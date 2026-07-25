import React, { createContext, useState, useContext, ReactNode } from 'react';

export type ApplicationStatus = 'Pending' | 'Approved' | 'Returned' | 'Rejected' | 'Suspended';
export type SellerType = 'ICS Service Provider' | 'Individual Farmer' | 'IFFCO';

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
  issueDate?: string;
  expiryDate?: string;
  productsCovered?: string;
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
  fssaiLicenseType?: string;
  jaivikBharatNumber?: string;
  isExporting?: boolean;
  iec?: string;
  apedaRcmc?: string;
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
}

const initialData: SellerRegistration[] = [
  {
    id: 'SEL-2026-000101',
    sellerType: 'ICS Service Provider',
    status: 'Pending',
    submittedAt: '2026-06-15T10:30:00Z',
    legalName: 'Sikkim Organic Alive Pvt Ltd',
    tradeName: 'Sikkim Organic Alive',
    orgType: 'Private Limited',
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
    noOfFarmers: 450,
    cultivatedArea: 1200,
    icsAvailability: true,
    gstin: '11ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    fssaiLicenseNumber: '10020011001234',
    scopeCertFileName: 'SOA_ScopeCert.pdf',
    fssaiFileName: 'SOA_FSSAI.pdf',
  },
  {
    id: 'SEL-2026-000122',
    sellerType: 'Individual Farmer',
    status: 'Pending',
    submittedAt: '2026-07-01T14:45:00Z',
    legalName: 'Namchi Organic Farmers Group',
    orgType: 'Farmer Producer Organization',
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
    orgType: 'Cooperative Society',
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
    setApplications((prev) => [newApp, ...prev]);
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

  return (
    <SellerRegistrationContext.Provider value={{ applications, addApplication, updateApplicationStatus }}>
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
