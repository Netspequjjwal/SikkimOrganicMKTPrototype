import React, { createContext, useState, useContext, ReactNode } from 'react';

export type ApplicationStatus = 'Pending' | 'Approved' | 'Returned' | 'Rejected' | 'Suspended';
export type SellerType = 'ICS' | 'Individual Farmer' | 'IFFCO';

export interface SellerRegistration {
  id: string;
  sellerType: SellerType;
  status: ApplicationStatus;
  submittedAt: string;
  remarks?: string;
  trustBadges?: string[];

  // 1. Organization Details
  legalName: string;
  tradeName?: string;
  orgType: string;
  establishmentYear: string;
  authorizedRep: string;
  designation: string;
  mobile: string;
  altMobile?: string;
  email: string;
  officeContact?: string;
  registeredAddress: string;
  communicationAddress?: string;
  state: string;
  district: string;
  pinCode: string;
  website?: string;

  // 2. Business & Organic Compliance
  businessActivities: string[];
  certificationSystem?: string;
  certificationBody?: string;
  scopeCertNumber?: string;
  scopeCertValidityYear?: string;
  scopeCertIssueDate?: string;
  scopeCertExpiryDate?: string;
  yearWiseScopeCerts?: Array<{ year: string; certNumber: string; validFrom: string; validTo: string }>;
  issueDate?: string;
  expiryDate?: string;
  productsCovered?: string;
  scopeVerifiedCrops?: string[]; // Scope Certified Organic Produces authorized for listing
  cultivatedArea?: number;
  noOfFarmers?: number;
  noOfGrowerGroups?: number;
  collectionCentres?: number;
  icsAvailability?: boolean;
  tracenetNumber?: string;

  // 3. Statutory & Export Compliance
  gstin?: string;
  pan?: string;
  fssaiLicenseNumber?: string;
  fssaiExpiryDate?: string;
  fssaiLicenseType?: string;
  jaivikBharatNumber?: string;
  isExporting?: boolean;
  iec?: string;
  apedaRcmc?: string;
  apedaRcmcExpiryDate?: string;
  exportMarkets?: string;

  // 4. Infrastructure & Traceability
  warehouseAvailability?: boolean;
  organicStorage?: boolean;
  coldStorage?: boolean;
  processingUnit?: boolean;
  packagingUnit?: boolean;
  storageCapacity?: string;
  processingCapacity?: string;
  batchSegregation?: boolean;
  internalInspectionTeam?: boolean;
  qaPractices?: string;

  // 5. Document Files (mocked with string names)
  logoFileName?: string;
  scopeCertFileName?: string;
  fssaiFileName?: string;
  gstFileName?: string;
  panFileName?: string;
  iecFileName?: string;
  apedaFileName?: string;
  tracenetFileName?: string;
  icsManualFileName?: string;
  warehouseImageFileName?: string;
  additionalDocFileName?: string;
}

interface SellerContextType {
  applications: SellerRegistration[];
  addApplication: (app: Omit<SellerRegistration, 'id' | 'status' | 'submittedAt' | 'trustBadges'>) => SellerRegistration;
  updateApplicationStatus: (id: string, status: ApplicationStatus, remarks?: string, badges?: string[]) => void;
  resetToUnregistered: () => void;
  setDemoStatus: (status: ApplicationStatus) => void;
}

const initialData: SellerRegistration[] = [
  {
    id: 'SEL-2026-000101',
    sellerType: 'ICS',
    status: 'Pending',
    submittedAt: '2026-06-15T10:30:00Z',
    legalName: 'Sikkim Organic Alive Pvt Ltd',
    tradeName: 'Sikkim Organic Alive',
    orgType: 'Internal Management System / Control Unit',
    establishmentYear: '2015',
    authorizedRep: 'Tenzing Lepcha',
    designation: 'Managing Director',
    mobile: '9876543210',
    email: 'contact@sikkimalive.in',
    registeredAddress: 'M.G. Marg, Gangtok, East Sikkim',
    state: 'Sikkim',
    district: 'Gangtok',
    pinCode: '737101',
    businessActivities: ['Aggregation', 'Trading'],
    certificationSystem: 'NPOP',
    certificationBody: 'Sikkim State Certification Agency',
    scopeCertNumber: 'ORG/SC/2026/001',
    scopeCertValidityYear: '2026 - 2027 (Current Annual Cycle)',
    scopeCertIssueDate: '2026-04-01',
    scopeCertExpiryDate: '2027-03-31',
    yearWiseScopeCerts: [
      { year: '2025 - 2026', certNumber: 'ORG/SC/2025/084', validFrom: '2025-04-01', validTo: '2026-03-31' },
      { year: '2026 - 2027', certNumber: 'ORG/SC/2026/001', validFrom: '2026-04-01', validTo: '2027-03-31' }
    ],
    scopeVerifiedCrops: ['Large Cardamom', 'Dzongu Ginger', 'Lakadong Turmeric', 'Buckwheat', 'Sikkim Mandarin', 'Dalle Khursani'],
    noOfFarmers: 450,
    cultivatedArea: 1200,
    icsAvailability: true,
    gstin: '11ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    fssaiLicenseNumber: '10020011001234',
    fssaiExpiryDate: '2028-12-31',
    isExporting: true,
    iec: '0123456789',
    apedaRcmc: 'APEDA/RCMC/2026/1023',
    apedaRcmcExpiryDate: '2029-03-31',
    scopeCertFileName: 'SOA_ScopeCert.pdf',
    fssaiFileName: 'SOA_FSSAI.pdf',
  },
  {
    id: 'SEL-2026-000122',
    sellerType: 'Individual Farmer',
    status: 'Pending',
    submittedAt: '2026-07-01T14:45:00Z',
    legalName: 'Namchi Organic Farmers Group',
    orgType: 'Registered Legal Entity / Farmer Collective',
    establishmentYear: '2018',
    authorizedRep: 'Priya Sharma',
    designation: 'President',
    mobile: '9988776655',
    email: 'admin@namchiorganic.in',
    registeredAddress: 'Namchi Bazaar, South Sikkim',
    state: 'Sikkim',
    district: 'Namchi',
    pinCode: '737126',
    businessActivities: ['Production'],
    certificationSystem: 'PGS',
    scopeCertNumber: 'ORG/SC/2026/088',
    scopeVerifiedCrops: ['Dzongu Ginger', 'Lakadong Turmeric', 'Sikkim Mandarin', 'Dalle Khursani'],
    noOfFarmers: 120,
    cultivatedArea: 350,
    scopeCertFileName: 'Namchi_PGS_Cert.pdf',
  },
  {
    id: 'SEL-2026-000135',
    sellerType: 'IFFCO',
    status: 'Approved',
    submittedAt: '2026-06-20T09:15:00Z',
    legalName: 'Indian Farmers Fertiliser Cooperative Limited (Organic Div)',
    tradeName: 'IFFCO Organics Sikkim',
    orgType: 'Multi-State Cooperative Society',
    establishmentYear: '2020',
    authorizedRep: 'Dr. Ramesh Kumar',
    designation: 'State Head',
    mobile: '9000000000',
    email: 'sikkim@iffco.in',
    registeredAddress: 'Sonam Tshering Marg, Gangtok',
    state: 'Sikkim',
    district: 'Gangtok',
    pinCode: '737101',
    businessActivities: ['Processing', 'Export', 'Trading'],
    scopeCertNumber: 'ORG/SC/2026/099',
    scopeVerifiedCrops: ['Lakadong Turmeric', 'Buckwheat', 'Large Cardamom', 'Sikkim Mandarin'],
    isExporting: true,
    iec: '0500000000',
    apedaRcmc: 'APEDA/2026/001',
    processingUnit: true,
    warehouseAvailability: true,
    trustBadges: ['Government Approved Seller', 'Export Ready', 'FSSAI Licensed'],
    logoFileName: 'IFFCO_Logo.png',
  }
];

const SellerRegistrationContext = createContext<SellerContextType | undefined>(undefined);

export const SellerRegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<SellerRegistration[]>(initialData);

  const addApplication = (app: Omit<SellerRegistration, 'id' | 'status' | 'submittedAt' | 'trustBadges'>) => {
    const newId = `SEL-2026-000${Math.floor(100 + Math.random() * 900)}`;
    const newApp: SellerRegistration = {
      ...app,
      id: newId,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };
    setApplications((prev) => [newApp, ...prev.filter(a => a.id !== newId)]);
    return newApp;
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, remarks?: string, badges?: string[]) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const updatedApp = { ...app, status, remarks };
          if (badges) updatedApp.trustBadges = badges;
          return updatedApp;
        }
        return app;
      })
    );
  };

  const resetToUnregistered = () => {
    setApplications([]);
  };

  const setDemoStatus = (status: ApplicationStatus) => {
    if (applications.length === 0) {
      setApplications([initialData[0]]);
    }
    setApplications((prev) => {
      if (prev.length === 0) return prev;
      return [
        {
          ...prev[0],
          status,
          trustBadges: status === 'Approved' ? ['Government Approved Seller', 'Export Ready', 'NPOP Certified'] : []
        },
        ...prev.slice(1)
      ];
    });
  };

  return (
    <SellerRegistrationContext.Provider value={{
      applications,
      addApplication,
      updateApplicationStatus,
      resetToUnregistered,
      setDemoStatus
    }}>
      {children}
    </SellerRegistrationContext.Provider>
  );
};

export const useSellerRegistration = () => {
  const context = useContext(SellerRegistrationContext);
  if (context === undefined) {
    throw new Error('useSellerRegistration must be used within a SellerRegistrationProvider');
  }
  return context;
};
