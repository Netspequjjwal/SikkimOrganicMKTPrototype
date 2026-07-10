import React, { createContext, useState, useContext, ReactNode } from 'react';

export type ContractStatus = 'Draft' | 'Pending Buyer Review' | 'Under Revision' | 'Awaiting Signature' | 'Legally Executed' | 'Payment Pending' | 'Partially Paid' | 'Fully Paid' | 'Completed' | 'Cancelled';

export interface PaymentMilestone {
  id: string;
  percentage: number;
  amount: number;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Paid';
  paidAt?: string;
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  isMandatory: boolean;
}

export interface DigitalContract {
  id: string;
  enquiryId: string;
  contractRef?: string; // Generated on execution
  buyerName: string;
  supplierName: string;
  product: string;
  quantity: number;
  uom: string;
  procurementType: 'Pre-Booking' | 'Purchase';
  pricePerUnit: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
  status: ContractStatus;
  
  // Dates
  estimatedHarvestDate?: string;
  deliveryDate: string;
  deliveryLocation: string;
  
  // Clauses & Terms
  clauses: ContractClause[];
  
  // Signatures
  supplierSignature?: {
    name: string;
    designation: string;
    timestamp: string;
  };
  buyerSignature?: {
    name: string;
    designation: string;
    timestamp: string;
  };
  
  // Payments
  paymentConfigured: boolean;
  paymentMilestones: PaymentMilestone[];
}

interface ContractContextType {
  contracts: DigitalContract[];
  createContract: (enquiryData: any) => string;
  updateContractClauses: (contractId: string, clauses: ContractClause[]) => void;
  signContractSP: (contractId: string, signature: any) => void;
  signContractBuyer: (contractId: string, signature: any) => void;
  configurePayments: (contractId: string, milestones: Omit<PaymentMilestone, 'id' | 'status'>[]) => void;
  processPayment: (contractId: string, milestoneId: string) => void;
}

const defaultClauses: ContractClause[] = [
  { id: 'c1', title: '1. Definitions', content: 'In this Agreement, the terms shall have the meanings as assigned by the Government of Sikkim Organic Farming Act.', isMandatory: true },
  { id: 'c2', title: '2. Product Quality & Certification', content: 'The Supplier guarantees that the Produce is 100% organic and complies with NPOP standards. Transaction Certificates must be provided upon delivery.', isMandatory: true },
  { id: 'c3', title: '3. Delivery Obligations', content: 'The Supplier shall deliver the Produce to the specified delivery location on or before the agreed delivery date.', isMandatory: false },
  { id: 'c4', title: '4. Dispute Resolution', content: 'Any dispute arising out of this contract shall be subject to the exclusive jurisdiction of the courts in Gangtok, Sikkim.', isMandatory: true },
];

const initialContracts: DigitalContract[] = [
  {
    id: 'contract-1',
    enquiryId: 'ENQ-2026-000458',
    buyerName: 'Global Organic Foods Ltd.',
    supplierName: 'Sikkim Organic Alive',
    product: 'Large Cardamom',
    quantity: 1.5,
    uom: 'MT',
    procurementType: 'Pre-Booking',
    pricePerUnit: 850000,
    totalAmount: 1275000,
    currency: 'INR',
    createdAt: new Date().toISOString(),
    status: 'Draft',
    estimatedHarvestDate: '2026-08-30',
    deliveryDate: '2026-09-15',
    deliveryLocation: 'Siliguri Transit Hub',
    clauses: defaultClauses,
    paymentConfigured: false,
    paymentMilestones: []
  },
  {
    id: 'contract-2',
    contractRef: 'EC-2026-000102',
    enquiryId: 'ENQ-2026-000102',
    buyerName: 'Nature Extracts Inc.',
    supplierName: 'East Sikkim Farmers Co-op',
    product: 'Turmeric (Lakadong)',
    quantity: 500,
    uom: 'KG',
    procurementType: 'Purchase',
    pricePerUnit: 150,
    totalAmount: 75000,
    currency: 'INR',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: 'Payment Pending',
    deliveryDate: '2026-07-10',
    deliveryLocation: 'Gangtok APMC',
    clauses: defaultClauses,
    supplierSignature: {
      name: 'Rinzing Bhutia',
      designation: 'Co-op President',
      timestamp: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    buyerSignature: {
      name: 'Amit Patel',
      designation: 'Procurement Manager',
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    paymentConfigured: true,
    paymentMilestones: [
      { id: 'm1', percentage: 100, amount: 75000, description: '100% Advance Payment', dueDate: new Date(Date.now() + 2 * 86400000).toISOString(), status: 'Pending' }
    ]
  }
];

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<DigitalContract[]>(initialContracts);

  const createContract = (enquiryData: any) => {
    // Deterministic ID to prevent strict-mode duplicates
    const newId = `contract-${enquiryData.id}`;
    
    // Quick closure check just in case
    const existing = contracts.find(c => c.id === newId || c.enquiryId === enquiryData.id);
    if (existing) return existing.id;

    const newContract: DigitalContract = {
      id: newId,
      enquiryId: enquiryData.id,
      buyerName: enquiryData.buyerName,
      supplierName: enquiryData.supplierName,
      product: enquiryData.product,
      quantity: enquiryData.quantityRequested,
      uom: enquiryData.uom,
      procurementType: enquiryData.procurementType,
      pricePerUnit: enquiryData.messages.find((m: any) => m.isQuotation)?.quotationDetails?.pricePerUnit || 0,
      totalAmount: enquiryData.messages.find((m: any) => m.isQuotation)?.quotationDetails?.totalAmount || 0,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      status: 'Draft',
      deliveryDate: enquiryData.deliveryDate,
      deliveryLocation: enquiryData.deliveryLocation,
      clauses: defaultClauses,
      paymentConfigured: false,
      paymentMilestones: []
    };
    
    setContracts(prev => {
      // Functional state check to guarantee no duplicates
      if (prev.find(c => c.id === newId || c.enquiryId === enquiryData.id)) {
        return prev;
      }
      return [newContract, ...prev];
    });
    
    return newId;
  };

  const updateContractClauses = (contractId: string, clauses: ContractClause[]) => {
    setContracts(prev => prev.map(c => c.id === contractId ? { ...c, clauses } : c));
  };

  const signContractSP = (contractId: string, signature: any) => {
    setContracts(prev => prev.map(c => 
      c.id === contractId ? { ...c, status: 'Pending Buyer Review', supplierSignature: { ...signature, timestamp: new Date().toISOString() } } : c
    ));
  };

  const signContractBuyer = (contractId: string, signature: any) => {
    setContracts(prev => prev.map(c => 
      c.id === contractId ? { 
        ...c, 
        status: c.paymentConfigured ? 'Payment Pending' : 'Legally Executed', 
        contractRef: `EC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        buyerSignature: { ...signature, timestamp: new Date().toISOString() } 
      } : c
    ));
  };

  const configurePayments = (contractId: string, milestones: Omit<PaymentMilestone, 'id' | 'status'>[]) => {
    const formattedMilestones: PaymentMilestone[] = milestones.map((m, i) => ({
      ...m,
      id: `m${i + 1}-${Date.now()}`,
      status: 'Pending'
    }));
    setContracts(prev => prev.map(c => 
      c.id === contractId ? { ...c, status: 'Payment Pending', paymentConfigured: true, paymentMilestones: formattedMilestones } : c
    ));
  };

  const processPayment = (contractId: string, milestoneId: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        const updatedMilestones = c.paymentMilestones.map(m => 
          m.id === milestoneId ? { ...m, status: 'Paid' as const, paidAt: new Date().toISOString() } : m
        );
        const allPaid = updatedMilestones.every(m => m.status === 'Paid');
        const anyPaid = updatedMilestones.some(m => m.status === 'Paid');
        
        let newStatus = c.status;
        if (allPaid) newStatus = 'Fully Paid';
        else if (anyPaid) newStatus = 'Partially Paid';
        
        return { ...c, status: newStatus, paymentMilestones: updatedMilestones };
      }
      return c;
    }));
  };

  return (
    <ContractContext.Provider value={{ 
      contracts, 
      createContract, 
      updateContractClauses, 
      signContractSP, 
      signContractBuyer,
      configurePayments,
      processPayment
    }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};
