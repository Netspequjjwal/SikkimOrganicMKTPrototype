import React, { createContext, useState, useContext, ReactNode } from 'react';

export type OrderStatus = 
  | 'Ready for Delivery Details'
  | 'Awaiting Buyer Delivery Confirmation'
  | 'Delivery Address Confirmed'
  | 'Preparing Order'
  | 'Quality Inspection Completed'
  | 'Packaging Completed'
  | 'Ready for Dispatch'
  | 'Way Bill Generated'
  | 'Handed Over to Logistics Partner'
  | 'Shipment In Transit'
  | 'Out for Delivery'
  | 'Delivered (Awaiting Buyer Confirmation)'
  | 'Completed';

export interface DeliveryAddress {
  recipientName: string;
  companyName?: string;
  contactNumber: string;
  altContactNumber?: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  deliveryInstructions?: string;
  preferredTime?: string;
  specialHandling?: string;
}

export interface WayBillDetails {
  wayBillNumber: string;
  dispatchLocation: string;
  expectedDeliveryDate?: string;
  transportInstructions?: string;
  logisticsPartnerName?: string;
  vehicleNumber?: string;
  driverContact?: string;
  trackingRef?: string;
  qualityInspected?: boolean;
}

export interface TimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  contractId: string;
  contractRef: string;
  buyerName: string;
  supplierName: string;
  product: string;
  quantity: number;
  uom: string;
  status: OrderStatus;
  createdAt: string;
  
  deliveryAddress?: DeliveryAddress;
  wayBillDetails?: WayBillDetails;
  timelineEvents: TimelineEvent[];
}

interface OrderContextType {
  orders: Order[];
  createOrder: (contractDetails: any) => string;
  submitDeliveryAddress: (orderId: string, address: DeliveryAddress) => void;
  requestAddressConfirmation: (orderId: string) => void;
  confirmDeliveryAddress: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string, wayBillData?: Partial<WayBillDetails>) => void;
  confirmDeliveryReceipt: (orderId: string) => void;
}

// Initial dummy order linked to the existing dummy contract-2 assuming it got paid
const initialOrders: Order[] = [
  {
    id: 'ORD-2026-0001',
    contractId: 'contract-2',
    contractRef: 'EC-2026-000102',
    buyerName: 'Nature Extracts Inc.',
    supplierName: 'East Sikkim Farmers Co-op',
    product: 'Turmeric (Lakadong)',
    quantity: 500,
    uom: 'KG',
    status: 'Ready for Delivery Details',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    timelineEvents: [
      {
        status: 'Ready for Delivery Details',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        note: 'Advance payment received. Waiting for buyer to provide delivery details.'
      }
    ]
  }
];

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const createOrder = (contract: any) => {
    // Check if order already exists for this contract
    const existingOrder = orders.find(o => o.contractId === contract.id);
    if (existingOrder) return existingOrder.id;

    const newOrder: Order = {
      id: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      contractId: contract.id,
      contractRef: contract.contractRef || '',
      buyerName: contract.buyerName,
      supplierName: contract.supplierName,
      product: contract.product,
      quantity: contract.quantity,
      uom: contract.uom,
      status: 'Ready for Delivery Details',
      createdAt: new Date().toISOString(),
      timelineEvents: [
        {
          status: 'Ready for Delivery Details',
          timestamp: new Date().toISOString(),
          note: 'Advance payment received. Order workflow initiated.'
        }
      ]
    };
    
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  };

  const submitDeliveryAddress = (orderId: string, address: DeliveryAddress) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { 
        ...o, 
        deliveryAddress: address,
        status: 'Awaiting Buyer Delivery Confirmation',
        timelineEvents: [
          ...o.timelineEvents, 
          { status: 'Awaiting Buyer Delivery Confirmation', timestamp: new Date().toISOString(), note: 'Buyer submitted delivery address for SP review.' }
        ]
      } : o
    ));
  };

  const requestAddressConfirmation = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { 
        ...o, 
        status: 'Awaiting Buyer Delivery Confirmation',
        timelineEvents: [
          ...o.timelineEvents, 
          { status: 'Awaiting Buyer Delivery Confirmation', timestamp: new Date().toISOString(), note: 'SP requested final address confirmation from Buyer.' }
        ]
      } : o
    ));
  };

  const confirmDeliveryAddress = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { 
        ...o, 
        status: 'Delivery Address Confirmed',
        timelineEvents: [
          ...o.timelineEvents, 
          { status: 'Delivery Address Confirmed', timestamp: new Date().toISOString(), note: 'Buyer confirmed final delivery address.' }
        ]
      } : o
    ));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string, wayBillData?: Partial<WayBillDetails>) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedWayBill = wayBillData ? { ...(o.wayBillDetails || {} as WayBillDetails), ...wayBillData } : o.wayBillDetails;
        
        if (status === 'Way Bill Generated' && updatedWayBill && !updatedWayBill.wayBillNumber) {
          updatedWayBill.wayBillNumber = `WB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        }

        return {
          ...o,
          status,
          wayBillDetails: updatedWayBill,
          timelineEvents: [
            ...o.timelineEvents,
            { status, timestamp: new Date().toISOString(), note }
          ]
        };
      }
      return o;
    }));
  };

  const confirmDeliveryReceipt = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { 
        ...o, 
        status: 'Completed',
        timelineEvents: [
          ...o.timelineEvents, 
          { status: 'Completed', timestamp: new Date().toISOString(), note: 'Buyer confirmed successful delivery receipt.' }
        ]
      } : o
    ));
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      submitDeliveryAddress,
      requestAddressConfirmation,
      confirmDeliveryAddress,
      updateOrderStatus,
      confirmDeliveryReceipt
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
