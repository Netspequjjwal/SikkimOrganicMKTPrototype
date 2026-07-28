import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

export type EnquiryStatus = 'New Enquiry' | 'Acknowledged' | 'Quotation Submitted' | 'Counter Offer' | 'Under Negotiation' | 'Negotiation Successful' | 'Negotiation Declined' | 'Expired' | 'Converted to Digital Contract';

export interface ChatMessage {
  id: string;
  sender: 'Buyer' | 'Supplier';
  text: string;
  timestamp: string;
  attachmentName?: string;
  fileUrl?: string;
  isQuotation?: boolean;
  isPurchaseIntent?: boolean;
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
    buyerName: 'Naturals India Procurement',
    supplierName: 'Sikkim Organic Alive',
    product: 'Large Cardamom',
    quantityRequested: 1.5,
    uom: 'MT',
    procurementType: 'Pre-Booking',
    deliveryDate: '2026-09-15',
    deliveryLocation: 'Siliguri Transit Hub',
    status: 'Quotation Submitted',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
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
        timestamp: new Date(Date.now() - 82800000).toISOString(),
        isQuotation: true,
        attachmentName: 'SOA_Quote_Cardamom_458.pdf',
        quotationDetails: {
          pricePerUnit: 850000,
          totalAmount: 1275000,
          validUntil: '2026-08-20'
        }
      }
    ]
  },
  {
    id: 'ENQ-2026-000492',
    buyerName: 'Global Organic Foods Ltd.',
    supplierName: 'SIMFED (Sikkim State Co-op)',
    product: 'Organic Ginger',
    quantityRequested: 12,
    uom: 'MT',
    procurementType: 'Purchase',
    deliveryDate: '2026-08-10',
    deliveryLocation: 'Gangtok Cold Storage Facility',
    status: 'Counter Offer',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    priority: 'Normal',
    messages: [
      {
        id: 'msg-201',
        sender: 'Buyer',
        text: 'We require 12 MT of fresh Organic Ginger for immediate procurement. Please share rate per MT.',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'msg-202',
        sender: 'Supplier',
        text: 'SIMFED can supply 12 MT from West Sikkim clusters. Initial quote: ₹1,40,000/MT including packaging.',
        timestamp: new Date(Date.now() - 144000000).toISOString(),
        isQuotation: true,
        attachmentName: 'SIMFED_Ginger_Quotation.pdf',
        quotationDetails: {
          pricePerUnit: 140000,
          totalAmount: 1680000,
          validUntil: '2026-08-15'
        }
      },
      {
        id: 'msg-203',
        sender: 'Buyer',
        text: 'Could you revise rate to ₹1,32,000/MT considering bulk order size? We are ready to sign digital contract today.',
        timestamp: new Date(Date.now() - 72000000).toISOString(),
      }
    ]
  },
  {
    id: 'ENQ-2026-000510',
    buyerName: 'Apex Agro Exports',
    supplierName: 'Mangan Farmer Producer Co.',
    product: 'Organic Turmeric',
    quantityRequested: 5,
    uom: 'MT',
    procurementType: 'Pre-Booking',
    deliveryDate: '2026-10-01',
    deliveryLocation: 'New Jalpaiguri Rail Terminal',
    status: 'Under Negotiation',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    priority: 'Long-Term',
    messages: [
      {
        id: 'msg-301',
        sender: 'Buyer',
        text: 'Requesting quotation for 5 MT High-Curcumin Organic Turmeric for autumn delivery.',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: 'msg-302',
        sender: 'Supplier',
        text: 'Mangan FPO tested Curcumin levels at 5.2%. Quote: ₹1,80,000/MT. TC certification available.',
        timestamp: new Date(Date.now() - 216000000).toISOString(),
        isQuotation: true,
        attachmentName: 'Mangan_Turmeric_Specs_Quote.pdf',
        quotationDetails: {
          pricePerUnit: 180000,
          totalAmount: 900000,
          validUntil: '2026-08-30'
        }
      }
    ]
  },
  {
    id: 'ENQ-2026-000524',
    buyerName: 'Himalayan Flavours Pvt Ltd',
    supplierName: 'Gyalshing Organic Growers FPO',
    product: 'Dalle Khursani Chilli',
    quantityRequested: 800,
    uom: 'KG',
    procurementType: 'Purchase',
    deliveryDate: '2026-08-02',
    deliveryLocation: 'Siliguri Spice Processing Unit',
    status: 'Converted to Digital Contract',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    priority: 'Urgent',
    messages: [
      {
        id: 'msg-401',
        sender: 'Buyer',
        text: 'Looking for 800 KG Grade-A fresh Dalle Khursani chillies.',
        timestamp: new Date(Date.now() - 345600000).toISOString(),
      },
      {
        id: 'msg-402',
        sender: 'Supplier',
        text: 'Quotation sent: ₹450/KG fresh picked. Total ₹3,60,000.',
        timestamp: new Date(Date.now() - 302400000).toISOString(),
        isQuotation: true,
        attachmentName: 'Gyalshing_Dalle_Quote.pdf',
        quotationDetails: {
          pricePerUnit: 450,
          totalAmount: 360000,
          validUntil: '2026-08-10'
        }
      },
      {
        id: 'msg-403',
        sender: 'Buyer',
        text: 'Quotation accepted! Generating digital purchase contract.',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        isPurchaseIntent: true
      }
    ]
  },
  {
    id: 'ENQ-2026-000539',
    buyerName: 'Nature Basket Retail',
    supplierName: 'Pakyong Organic FPO Federation',
    product: 'Organic Buckwheat',
    quantityRequested: 25,
    uom: 'MT',
    procurementType: 'Pre-Booking',
    deliveryDate: '2026-11-15',
    deliveryLocation: 'Kolkata Central Distribution Hub',
    status: 'New Enquiry',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    priority: 'Normal',
    messages: [
      {
        id: 'msg-501',
        sender: 'Buyer',
        text: 'We are seeking 25 MT of certified Organic Buckwheat for our winter superfood range. Please confirm availability and terms.',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
      }
    ]
  }
];

const NegotiationContext = createContext<NegContextType | undefined>(undefined);

export const NegotiationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enquiries, setEnquiries] = useState<BuyerEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('sikkim_organic_enquiries');
      if (saved) {
        const parsed: BuyerEnquiry[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(e => e.id));
        const missingInitial = initialEnquiries.filter(e => !existingIds.has(e.id));
        return [...missingInitial, ...parsed];
      }
    } catch (e) {
      console.error(e);
    }
    return initialEnquiries;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sikkim_organic_enquiries', JSON.stringify(enquiries));
    } catch (e) {
      console.error(e);
    }
  }, [enquiries]);

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
