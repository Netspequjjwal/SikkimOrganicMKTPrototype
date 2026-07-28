import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ListingType = 'PRE_BOOKING' | 'READY_STOCK';

export type ListingStatus = 
  | 'DRAFT' 
  | 'PENDING_APPROVAL' 
  | 'PRE_BOOKING_OPEN' 
  | 'READY_STOCK' 
  | 'PARTIALLY_RESERVED' 
  | 'FULLY_RESERVED' 
  | 'SOLD_OUT' 
  | 'EXPIRED' 
  | 'ARCHIVED'
  | 'RETURNED'
  | 'REJECTED';

export type OrganicCategory = 'NPOP Certified 100% Organic' | 'PGS-India Organic' | 'Jaivik Bharat Certified';

export interface QualityParameters {
  moisturePercent?: number;
  gradeSizeMm?: string;
  essentialOilPercent?: number;
  colorGrade?: string;
  ashContentPercent?: number;
  aromaRating?: string;
  foreignMatterPercent?: number;
}

export interface ProvisionalFulfillment {
  id: string;
  buyerId: string;
  buyerName: string;
  reservedQty: number; // in MT or specified UOM
  reservedAt: string;
  fulfillmentStatus: 'RESERVED' | 'ALLOCATED_POST_HARVEST' | 'DISPATCH_READY';
  unitPrice: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  previousStatus: ListingStatus;
  newStatus: ListingStatus;
  actionBy: string;
  role: string;
  remarks?: string;
}

export interface ProductListing {
  id: string;
  listingCode: string; // e.g. LST-2026-SKM-001
  sellerId: string;
  sellerName: string;
  sellerType: 'ICS' | 'Individual Farmer' | 'IFFCO';
  growerGroupCode?: string; // e.g. GG-NAMCHI-042 (mandatory if grower group)
  icsProviderName?: string; // e.g. Sikkim Organic Alive ICS

  // Certification Compliance Gate
  scopeCertNumber: string;
  scopeCertValidUntil: string;
  certificationBody: string;
  npopPgsNumber: string;
  approvedCommoditiesInScope: string[];
  scopeCertFileName?: string;
  fssaiFileName?: string;
  iecFileName?: string;
  apedaRcmcFileName?: string;

  // Product Metadata
  commodity: string; // e.g. Large Cardamom, Lakadong Turmeric, Dzongu Ginger
  variety: string; // e.g. Ramsay, Sawney, Golsey
  hsCode?: string; // Harmonized System Code (e.g. 09083110)
  grade: 'Grade A++' | 'Premium' | 'Superior' | 'Standard';
  organicCategory: OrganicCategory;
  qualityParameters: QualityParameters;
  labReportFileName?: string;
  labReportUrl?: string;
  labName?: string;
  labReportDate?: string;
  packagingType: 'Jute Bag (50kg)' | 'Vacuum Sealed Foil (25kg)' | 'Corrugated Box (10kg)' | 'HDPE Bag (50kg)';
  unitOfMeasure: 'MT' | 'Quintal' | 'KG';
  moq: number;
  pricePerUnit: number; // ₹ per MT
  description: string;
  images: string[];

  // Warehouse & Traceability
  warehouseName: string;
  warehouseLocation: string;
  district: string;
  fssaiWarehouseRegNo: string;

  // Listing Type & Lifecycle Counters
  listingType: ListingType;
  listingStatus: ListingStatus;

  // Stage 1: Pre-Booking Specs
  estimatedQuantity: number; // in MT
  expectedHarvestDate?: string;
  expectedAvailabilityDate?: string;

  // Stage 2: Ready Stock Specs
  actualHarvestQuantity?: number; // in MT
  lotBatchNumber?: string; // e.g. LOT-2026-SKM-889
  harvestDate?: string;

  // Stage 3: Inventory Reconciliation Balances
  reservedQuantity: number; // reserved by pre-booking or spot orders
  availableQuantity: number; // remaining for spot sale or pre-booking
  remainingStock: number; // total unfulfilled physical stock
  soldQuantity: number;

  // Provisional Fulfillments & Audit History
  provisionalFulfillments: ProvisionalFulfillment[];
  auditTrail: AuditLogEntry[];
  
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductListingContextType {
  listings: ProductListing[];
  createListing: (data: Omit<ProductListing, 'id' | 'listingCode' | 'listingStatus' | 'reservedQuantity' | 'availableQuantity' | 'remainingStock' | 'soldQuantity' | 'provisionalFulfillments' | 'auditTrail' | 'createdAt' | 'updatedAt'>) => ProductListing;
  updateHarvestAndReconcile: (id: string, data: { actualHarvestQuantity: number; lotBatchNumber: string; harvestDate: string; warehouseName?: string; warehouseLocation?: string; remarks?: string }) => void;
  approveListing: (id: string, actionBy: string, remarks?: string) => void;
  returnListing: (id: string, actionBy: string, remarks: string) => void;
  rejectListing: (id: string, actionBy: string, remarks: string) => void;
  reserveStock: (id: string, buyerId: string, buyerName: string, quantity: number, unitPrice: number) => boolean;
  archiveListing: (id: string, actionBy: string) => void;
  getSellerScopeCertCrops: (sellerType: string) => string[];
}

const initialListings: ProductListing[] = [
  {
    id: 'prod-001',
    listingCode: 'LST-2026-SKM-001',
    sellerId: 'SEL-2026-000101',
    sellerName: 'Sikkim Organic Alive Pvt Ltd',
    sellerType: 'ICS',
    growerGroupCode: 'GG-GANGTOK-012',
    icsProviderName: 'Sikkim Organic Alive ICS Unit',
    scopeCertNumber: 'ORG/SC/2026/001',
    scopeCertValidUntil: '2027-06-30',
    certificationBody: 'Sikkim State Organic Certification Agency (SSOCA)',
    npopPgsNumber: 'NPOP/NAB/0012',
    approvedCommoditiesInScope: ['Large Cardamom', 'Dzongu Ginger', 'Lakadong Turmeric', 'Buckwheat'],
    scopeCertFileName: 'NPOP_Scope_Certificate_2026.pdf',
    fssaiFileName: 'FSSAI_Central_License_Gangtok.pdf',
    iecFileName: 'IEC_Import_Export_Code_Cert.pdf',
    apedaRcmcFileName: 'APEDA_RCMC_Organic_Membership.pdf',
    commodity: 'Large Cardamom',
    variety: 'Ramsay (Bharlang)',
    hsCode: '09083110',
    grade: 'Grade A++',
    organicCategory: 'NPOP Certified 100% Organic',
    qualityParameters: {
      moisturePercent: 9.5,
      gradeSizeMm: '8.5mm - 10mm',
      essentialOilPercent: 2.8,
      colorGrade: 'Deep Reddish Brown',
      ashContentPercent: 3.2
    },
    labReportFileName: 'Cardamom_NABL_LabAnalysis_Report.pdf',
    labName: 'SSOCA Quality Testing Laboratory, Gangtok',
    labReportDate: '2026-06-10',
    packagingType: 'Jute Bag (50kg)',
    unitOfMeasure: 'MT',
    moq: 1,
    pricePerUnit: 1450000,
    description: 'Premium organic Large Cardamom sourced from Dzongu & Gangtok grower clusters. Handpicked pods with high essential oil content and rich aroma.',
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
    ],
    warehouseName: 'Gangtok Organic Central Cold Storage',
    warehouseLocation: 'Zero Point, Gangtok, East Sikkim',
    district: 'Gangtok',
    fssaiWarehouseRegNo: '11419850000102',
    listingType: 'PRE_BOOKING',
    listingStatus: 'PRE_BOOKING_OPEN',
    estimatedQuantity: 12,
    expectedHarvestDate: '2026-09-15',
    expectedAvailabilityDate: '2026-09-30',
    reservedQuantity: 4,
    availableQuantity: 8,
    remainingStock: 12,
    soldQuantity: 0,
    provisionalFulfillments: [
      {
        id: 'pf-001',
        buyerId: 'BUY-8801',
        buyerName: 'Himalayan Organic Exporters Ltd',
        reservedQty: 4,
        reservedAt: '2026-07-20T10:15:00Z',
        fulfillmentStatus: 'RESERVED',
        unitPrice: 1450000
      }
    ],
    auditTrail: [
      {
        id: 'log-001',
        timestamp: '2026-07-15T09:00:00Z',
        previousStatus: 'DRAFT',
        newStatus: 'PENDING_APPROVAL',
        actionBy: 'Tenzing Lepcha',
        role: 'ICS Provider'
      },
      {
        id: 'log-002',
        timestamp: '2026-07-16T14:30:00Z',
        previousStatus: 'PENDING_APPROVAL',
        newStatus: 'PRE_BOOKING_OPEN',
        actionBy: 'Dr. S.T. Bhutia',
        role: 'Agriculture Dept Admin',
        remarks: 'Scope Certificate verified. Approved for pre-booking harvest window.'
      }
    ],
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-07-20T10:15:00Z'
  },
  {
    id: 'prod-002',
    listingCode: 'LST-2026-SKM-002',
    sellerId: 'SEL-2026-000122',
    sellerName: 'Namchi Organic Farmers Group',
    sellerType: 'Individual Farmer',
    growerGroupCode: 'GG-NAMCHI-042',
    icsProviderName: 'South Sikkim Organic ICS Network',
    scopeCertNumber: 'ORG/SC/2026/088',
    scopeCertValidUntil: '2027-04-15',
    certificationBody: 'Sikkim State Organic Certification Agency (SSOCA)',
    npopPgsNumber: 'PGS-IND-339281',
    approvedCommoditiesInScope: ['Dzongu Ginger', 'Lakadong Turmeric', 'Sikkim Mandarin', 'Dalle Khursani'],
    commodity: 'Dzongu Ginger',
    variety: 'Nadia Organic',
    grade: 'Premium',
    organicCategory: 'PGS-India Organic',
    qualityParameters: {
      moisturePercent: 12.0,
      gradeSizeMm: 'Rhizome Size > 150g',
      essentialOilPercent: 1.9,
      colorGrade: 'Pale Golden Yellow',
      ashContentPercent: 4.1
    },
    packagingType: 'Jute Bag (50kg)',
    unitOfMeasure: 'MT',
    moq: 2,
    pricePerUnit: 185000,
    description: 'High-grade organic Ginger rhizomes harvested from Namchi organic cluster. Low fiber, high pungency and aroma.',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
    ],
    warehouseName: 'Namchi Agri Logistics Hub',
    warehouseLocation: 'Namchi Bazaar, South Sikkim',
    district: 'Namchi',
    fssaiWarehouseRegNo: '11420850000304',
    listingType: 'READY_STOCK',
    listingStatus: 'READY_STOCK',
    estimatedQuantity: 15,
    actualHarvestQuantity: 16,
    lotBatchNumber: 'LOT-2026-GIN-402',
    harvestDate: '2026-07-10',
    reservedQuantity: 5,
    availableQuantity: 11,
    remainingStock: 11,
    soldQuantity: 5,
    provisionalFulfillments: [],
    auditTrail: [
      {
        id: 'log-003',
        timestamp: '2026-07-01T11:00:00Z',
        previousStatus: 'DRAFT',
        newStatus: 'PENDING_APPROVAL',
        actionBy: 'Priya Sharma',
        role: 'Grower Group Leader'
      },
      {
        id: 'log-004',
        timestamp: '2026-07-02T16:00:00Z',
        previousStatus: 'PENDING_APPROVAL',
        newStatus: 'PRE_BOOKING_OPEN',
        actionBy: 'Agriculture Inspector',
        role: 'Agriculture Dept Admin',
        remarks: 'PGS Certificate verified. Approved.'
      },
      {
        id: 'log-005',
        timestamp: '2026-07-12T09:30:00Z',
        previousStatus: 'PRE_BOOKING_OPEN',
        newStatus: 'READY_STOCK',
        actionBy: 'Priya Sharma',
        role: 'Grower Group Leader',
        remarks: 'Harvest completed. Actual yield 16 MT reconciled against 15 MT estimate.'
      }
    ],
    createdAt: '2026-07-01T11:00:00Z',
    updatedAt: '2026-07-12T09:30:00Z'
  },
  {
    id: 'prod-003',
    listingCode: 'LST-2026-SKM-003',
    sellerId: 'SEL-2026-000135',
    sellerName: 'IFFCO Organics Sikkim',
    sellerType: 'IFFCO',
    scopeCertNumber: 'ORG/SC/2026/099',
    scopeCertValidUntil: '2027-12-31',
    certificationBody: 'OneCert International',
    npopPgsNumber: 'NPOP/NAB/0099',
    approvedCommoditiesInScope: ['Lakadong Turmeric', 'Buckwheat', 'Large Cardamom', 'Sikkim Mandarin'],
    commodity: 'Lakadong Turmeric',
    variety: 'High Curcumin Lakadong',
    grade: 'Grade A++',
    organicCategory: 'Jaivik Bharat Certified',
    qualityParameters: {
      moisturePercent: 8.0,
      gradeSizeMm: 'Finger Turmeric',
      essentialOilPercent: 7.5,
      colorGrade: 'Deep Orange Yellow',
      ashContentPercent: 2.9
    },
    packagingType: 'Vacuum Sealed Foil (25kg)',
    unitOfMeasure: 'MT',
    moq: 1,
    pricePerUnit: 260000,
    description: 'Certified Organic Lakadong Turmeric with guaranteed >7.5% curcumin content. Processed in IFFCO clean air facilities.',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
    ],
    warehouseName: 'IFFCO Central Organic Storage Facility',
    warehouseLocation: 'Sonam Tshering Marg, Gangtok',
    district: 'Gangtok',
    fssaiWarehouseRegNo: '10020011001234',
    listingType: 'READY_STOCK',
    listingStatus: 'READY_STOCK',
    estimatedQuantity: 20,
    actualHarvestQuantity: 20,
    lotBatchNumber: 'LOT-2026-TUR-991',
    harvestDate: '2026-07-05',
    reservedQuantity: 0,
    availableQuantity: 20,
    remainingStock: 20,
    soldQuantity: 0,
    provisionalFulfillments: [],
    auditTrail: [
      {
        id: 'log-006',
        timestamp: '2026-07-08T10:00:00Z',
        previousStatus: 'DRAFT',
        newStatus: 'PENDING_APPROVAL',
        actionBy: 'Dr. Ramesh Kumar',
        role: 'IFFCO State Head'
      },
      {
        id: 'log-007',
        timestamp: '2026-07-09T11:20:00Z',
        previousStatus: 'PENDING_APPROVAL',
        newStatus: 'READY_STOCK',
        actionBy: 'Dr. S.T. Bhutia',
        role: 'Agriculture Dept Admin',
        remarks: 'SC and Jaivik Bharat compliance verified.'
      }
    ],
    createdAt: '2026-07-08T10:00:00Z',
    updatedAt: '2026-07-09T11:20:00Z'
  }
];

const ProductListingContext = createContext<ProductListingContextType | undefined>(undefined);

export const ProductListingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<ProductListing[]>(initialListings);

  // Helper to fetch approved commodities for a seller based on scope certificate
  const getSellerScopeCertCrops = (sellerType: string): string[] => {
    switch (sellerType) {
      case 'Individual Farmer':
        return ['Dzongu Ginger', 'Lakadong Turmeric', 'Sikkim Mandarin', 'Dalle Khursani'];
      case 'IFFCO':
        return ['Lakadong Turmeric', 'Buckwheat', 'Large Cardamom', 'Sikkim Mandarin'];
      case 'ICS':
      default:
        return ['Large Cardamom', 'Dzongu Ginger', 'Lakadong Turmeric', 'Buckwheat', 'Sikkim Mandarin', 'Dalle Khursani'];
    }
  };

  const createListing = (
    data: Omit<ProductListing, 'id' | 'listingCode' | 'listingStatus' | 'reservedQuantity' | 'availableQuantity' | 'remainingStock' | 'soldQuantity' | 'provisionalFulfillments' | 'auditTrail' | 'createdAt' | 'updatedAt'>
  ): ProductListing => {
    const newId = `prod-${Date.now()}`;
    const newCode = `LST-2026-SKM-${Math.floor(100 + Math.random() * 900)}`;

    const initialStatus: ListingStatus = 'PENDING_APPROVAL';

    const newListing: ProductListing = {
      ...data,
      id: newId,
      listingCode: newCode,
      listingStatus: initialStatus,
      reservedQuantity: 0,
      availableQuantity: data.listingType === 'PRE_BOOKING' ? data.estimatedQuantity : (data.actualHarvestQuantity || 0),
      remainingStock: data.listingType === 'PRE_BOOKING' ? data.estimatedQuantity : (data.actualHarvestQuantity || 0),
      soldQuantity: 0,
      provisionalFulfillments: [],
      auditTrail: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          previousStatus: 'DRAFT',
          newStatus: 'PENDING_APPROVAL',
          actionBy: data.sellerName,
          role: data.sellerType,
          remarks: `Listing submitted for Department Approval. (${data.listingType === 'PRE_BOOKING' ? 'Pre-Booking Estimate' : 'Ready Stock Spot Sale'})`
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setListings(prev => [newListing, ...prev]);
    return newListing;
  };

  // Stage 2 & 3 Automatic Reconciliation Logic
  const updateHarvestAndReconcile = (
    id: string, 
    data: { actualHarvestQuantity: number; lotBatchNumber: string; harvestDate: string; warehouseName?: string; warehouseLocation?: string; remarks?: string }
  ) => {
    setListings(prev => prev.map(listing => {
      if (listing.id !== id) return listing;

      const actualHarvest = data.actualHarvestQuantity;
      const reserved = listing.reservedQuantity; // Booked by buyers during pre-booking stage 1

      // Reconciliation:
      // Booked quantities (reserved) are locked for pre-booked buyers.
      // Excess harvested stock (actualHarvest - reserved) becomes available for Spot Sale.
      const newAvailable = Math.max(0, actualHarvest - reserved);
      const newRemainingStock = actualHarvest;

      // Determine updated status
      let nextStatus: ListingStatus = 'READY_STOCK';
      if (newAvailable === 0 && reserved > 0) {
        nextStatus = 'FULLY_RESERVED';
      } else if (reserved > 0 && newAvailable > 0) {
        nextStatus = 'PARTIALLY_RESERVED';
      }

      // Convert pre-booking fulfillments to post-harvest allocations
      const updatedFulfillments: ProvisionalFulfillment[] = listing.provisionalFulfillments.map(pf => ({
        ...pf,
        fulfillmentStatus: 'ALLOCATED_POST_HARVEST'
      }));

      const newAudit: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        previousStatus: listing.listingStatus,
        newStatus: nextStatus,
        actionBy: listing.sellerName,
        role: listing.sellerType,
        remarks: `Harvest Reconciled: Actual Harvest ${actualHarvest} MT vs ${listing.estimatedQuantity} MT estimate. ${reserved} MT reserved for pre-booked buyers, ${newAvailable} MT open for Spot Sale. Lot #${data.lotBatchNumber}.`
      };

      return {
        ...listing,
        listingType: 'READY_STOCK',
        listingStatus: nextStatus,
        actualHarvestQuantity: actualHarvest,
        lotBatchNumber: data.lotBatchNumber,
        harvestDate: data.harvestDate,
        warehouseName: data.warehouseName || listing.warehouseName,
        warehouseLocation: data.warehouseLocation || listing.warehouseLocation,
        availableQuantity: newAvailable,
        remainingStock: newRemainingStock,
        provisionalFulfillments: updatedFulfillments,
        auditTrail: [newAudit, ...listing.auditTrail],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const approveListing = (id: string, actionBy: string, remarks?: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id !== id) return listing;

      const nextStatus: ListingStatus = listing.listingType === 'PRE_BOOKING' ? 'PRE_BOOKING_OPEN' : 'READY_STOCK';

      const newAudit: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        previousStatus: listing.listingStatus,
        newStatus: nextStatus,
        actionBy,
        role: 'Agriculture Dept Admin',
        remarks: remarks || 'Scope Certificate, product metadata, and organic compliance verified. Approved for public marketplace.'
      };

      return {
        ...listing,
        listingStatus: nextStatus,
        adminRemarks: remarks,
        auditTrail: [newAudit, ...listing.auditTrail],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const returnListing = (id: string, actionBy: string, remarks: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id !== id) return listing;

      const newAudit: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        previousStatus: listing.listingStatus,
        newStatus: 'RETURNED',
        actionBy,
        role: 'Agriculture Dept Admin',
        remarks: `Application Returned: ${remarks}`
      };

      return {
        ...listing,
        listingStatus: 'RETURNED',
        adminRemarks: remarks,
        auditTrail: [newAudit, ...listing.auditTrail],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const rejectListing = (id: string, actionBy: string, remarks: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id !== id) return listing;

      const newAudit: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        previousStatus: listing.listingStatus,
        newStatus: 'REJECTED',
        actionBy,
        role: 'Agriculture Dept Admin',
        remarks: `Listing Rejected: ${remarks}`
      };

      return {
        ...listing,
        listingStatus: 'REJECTED',
        adminRemarks: remarks,
        auditTrail: [newAudit, ...listing.auditTrail],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // Buyer Reservation Real-time Overselling Validation
  const reserveStock = (id: string, buyerId: string, buyerName: string, quantity: number, unitPrice: number): boolean => {
    let success = false;
    setListings(prev => prev.map(listing => {
      if (listing.id !== id) return listing;

      if (quantity > listing.availableQuantity) {
        return listing; // Cannot reserve more than available
      }

      success = true;
      const newReserved = listing.reservedQuantity + quantity;
      const newAvailable = listing.availableQuantity - quantity;

      let nextStatus: ListingStatus = listing.listingStatus;
      if (newAvailable === 0) {
        nextStatus = 'FULLY_RESERVED';
      } else if (newReserved > 0) {
        nextStatus = 'PARTIALLY_RESERVED';
      }

      const newFulfillment: ProvisionalFulfillment = {
        id: `pf-${Date.now()}`,
        buyerId,
        buyerName,
        reservedQty: quantity,
        reservedAt: new Date().toISOString(),
        fulfillmentStatus: listing.listingType === 'PRE_BOOKING' ? 'RESERVED' : 'DISPATCH_READY',
        unitPrice
      };

      const newAudit: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        previousStatus: listing.listingStatus,
        newStatus: nextStatus,
        actionBy: buyerName,
        role: 'Buyer',
        remarks: `Reserved ${quantity} ${listing.unitOfMeasure} under ${listing.listingType === 'PRE_BOOKING' ? 'Pre-Booking' : 'Spot Sale'}.`
      };

      return {
        ...listing,
        reservedQuantity: newReserved,
        availableQuantity: newAvailable,
        listingStatus: nextStatus,
        provisionalFulfillments: [...listing.provisionalFulfillments, newFulfillment],
        auditTrail: [newAudit, ...listing.auditTrail],
        updatedAt: new Date().toISOString()
      };
    }));
    return success;
  };

  const archiveListing = (id: string, actionBy: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id !== id) return listing;

      const newAudit: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        previousStatus: listing.listingStatus,
        newStatus: 'ARCHIVED',
        actionBy,
        role: listing.sellerType,
        remarks: 'Listing archived by seller.'
      };

      return {
        ...listing,
        listingStatus: 'ARCHIVED',
        auditTrail: [newAudit, ...listing.auditTrail],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  return (
    <ProductListingContext.Provider value={{
      listings,
      createListing,
      updateHarvestAndReconcile,
      approveListing,
      returnListing,
      rejectListing,
      reserveStock,
      archiveListing,
      getSellerScopeCertCrops
    }}>
      {children}
    </ProductListingContext.Provider>
  );
};

export const useProductListing = () => {
  const context = useContext(ProductListingContext);
  if (!context) {
    throw new Error('useProductListing must be used within a ProductListingProvider');
  }
  return context;
};
