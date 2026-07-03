import React, { createContext, useState, useContext, ReactNode } from 'react';

export type EnquiryStatus = 'New Enquiry' | 'Acknowledged' | 'Quotation Submitted' | 'Counter Offer' | 'Under Negotiation' | 'Negotiation Successful' | 'Negotiation Declined' | 'Expired' | 'Converted to Digital Contract';

export interface ChatMessage {
  id: string;
  sender: 'Buyer' | 'Supplier';
  text: string;
  timestamp: string;
  attachmentName?: string;
  fileUrl?: string;
  isQuotation?: boolean;
  quotationDetails?: {
    pricePerUnit: number;
    totalAmount: number;
    validUntil: string;
  };
}

export interface BuyerEnquiry {
  id: string;
  buyerName: string;
  supplierName: string; // ICS Provider
  product: string;
  quantityRequested: number;
  uom: string;
  procurementType: 'Pre-Booking' | 'Purchase';
  deliveryDate: string;
  deliveryLocation: string;
  status: EnquiryStatus;
  createdAt: string;
  priority: 'Normal' | 'Urgent' | 'Long-Term';
  messages: ChatMessage[];
}

interface NegContextType {
  enquiries: BuyerEnquiry[];
  addEnquiry: (enquiry: Omit<BuyerEnquiry, 'id' | 'status' | 'createdAt' | 'messages'>, initialMessage?: string) => string;
  addMessage: (enquiryId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateStatus: (enquiryId: string, status: EnquiryStatus) => void;
}

const initialEnquiries: BuyerEnquiry[] = [
  {
    id: 'ENQ-2026-000458',
    buyerName: 'Global Organic Foods Ltd.',
    supplierName: 'Sikkim Organic Alive',
    product: 'Large Cardamom',
    quantityRequested: 1.5,
    uom: 'MT',
    procurementType: 'Pre-Booking',
    deliveryDate: '2026-09-15',
    deliveryLocation: 'Siliguri Transit Hub',
    status: 'Quotation Submitted',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    priority: 'Urgent',
    messages: [
      {
        id: 'msg-1',
        sender: 'Buyer',
        text: 'Hello, we are interested in pre-booking 1.5 MT of Large Cardamom for our winter export batch. Can you provide your best FOB price?',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'msg-2',
        sender: 'Supplier',
        text: 'Thank you for your enquiry. Yes, we have Phase 1 estimated yields available for pre-booking. Attached is our formal quotation.',
        timestamp: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
        isQuotation: true,
        attachmentName: 'SOA_Quote_Cardamom_458.pdf',
        quotationDetails: {
          pricePerUnit: 850000, // per MT
          totalAmount: 1275000,
          validUntil: '2026-07-10'
        }
      }
    ]
  }
];

const NegotiationContext = createContext<NegContextType | undefined>(undefined);

export const NegotiationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enquiries, setEnquiries] = useState<BuyerEnquiry[]>(initialEnquiries);

  const addEnquiry = (enquiryData: Omit<BuyerEnquiry, 'id' | 'status' | 'createdAt' | 'messages'>, initialMessage?: string) => {
    const newId = `ENQ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const messages = initialMessage ? [{
      id: `msg-${Date.now()}`,
      sender: 'Buyer' as const,
      text: initialMessage,
      timestamp: new Date().toISOString()
    }] : [];

    const newEnquiry: BuyerEnquiry = {
      ...enquiryData,
      id: newId,
      status: 'New Enquiry',
      createdAt: new Date().toISOString(),
      messages
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    return newId;
  };

  const addMessage = (enquiryId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setEnquiries((prev) => 
      prev.map(enq => {
        if (enq.id === enquiryId) {
          return {
            ...enq,
            messages: [
              ...enq.messages,
              {
                ...message,
                id: `msg-${Date.now()}`,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return enq;
      })
    );
  };

  const updateStatus = (enquiryId: string, status: EnquiryStatus) => {
    setEnquiries(prev => prev.map(enq => enq.id === enquiryId ? { ...enq, status } : enq));
  };

  return (
    <NegotiationContext.Provider value={{ enquiries, addEnquiry, addMessage, updateStatus }}>
      {children}
    </NegotiationContext.Provider>
  );
};

export const useNegotiation = () => {
  const context = useContext(NegotiationContext);
  if (context === undefined) {
    throw new Error('useNegotiation must be used within a NegotiationProvider');
  }
  return context;
};
