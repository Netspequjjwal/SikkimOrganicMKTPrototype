import React, { createContext, useContext, useState, ReactNode } from 'react';

export type RegistrationStatus = 'UNREGISTERED' | 'PENDING_APPROVAL' | 'APPROVED';

export interface BuyerRegistrationData {
  id?: string;
  referenceId?: string;
  submissionDate?: string;
  // Step 1: Business Info
  legalEntityName: string;
  tradeName: string;
  businessType: string;
  organizationType: string;
  gstin: string;
  pan: string;
  cin: string;
  iec: string;
  yearOfEstablishment: string;
  annualProcurementCapacity: string;
  website: string;
  // Step 2: Contact Info
  authorizedRepresentative: string;
  designation: string;
  mobileNumber: string;
  alternateMobile: string;
  email: string;
  officePhone: string;
  registeredAddress: string;
  communicationAddress: string;
  state: string;
  district: string;
  pinCode: string;
  // Step 3: Organic Compliance
  certificationSystem: string;
  certificationBody: string;
  scopeCertificateNumber: string;
  issueDate: string;
  expiryDate: string;
  scopeOfCertification: string;
  certifiedProductCategories: string;
  fssaiLicenseNumber: string;
  licenseType: string;
  jaivikBharatRegistrationNumber: string;
  // Step 4: Infrastructure
  warehouseAvailability: string;
  coldStorage: string;
  processingFacility: string;
  packagingFacility: string;
  dedicatedOrganicStorage: string;
  storageCapacity: string;
  processingCapacity: string;
  organicHandlingProcess: string;
  qualityControlLaboratory: string;
  // Step 5: Documents (File names for mock)
  documents: {
    gstCertificate?: string;
    panCard?: string;
    scopeCertificate?: string;
    fssaiLicense?: string;
    organicCertification?: string;
    warehouseImages?: string;
    facilityImages?: string;
  };
}

interface BuyerRegistrationContextType {
  status: RegistrationStatus;
  registrationData: BuyerRegistrationData | null;
  saveDraft: (data: Partial<BuyerRegistrationData>) => void;
  submitRegistration: (data: BuyerRegistrationData) => string;
  approveRegistration: () => void;
  rejectRegistration: () => void;
}

const defaultContext: BuyerRegistrationContextType = {
  status: 'UNREGISTERED', // Start as UNREGISTERED for the workflow
  registrationData: null,
  saveDraft: () => {},
  submitRegistration: () => '',
  approveRegistration: () => {},
  rejectRegistration: () => {},
};

const BuyerRegistrationContext = createContext<BuyerRegistrationContextType>(defaultContext);

export const BuyerRegistrationProvider = ({ children }: { children: ReactNode }) => {
  const loadStoredStatus = (): RegistrationStatus => {
    const stored = localStorage.getItem('buyerRegistrationStatus');
    return (stored as RegistrationStatus) || 'UNREGISTERED';
  };

  const loadStoredData = (): BuyerRegistrationData | null => {
    const stored = localStorage.getItem('buyerRegistrationData');
    return stored ? JSON.parse(stored) : null;
  };

  const [status, setStatus] = useState<RegistrationStatus>(loadStoredStatus);
  const [registrationData, setRegistrationData] = useState<BuyerRegistrationData | null>(loadStoredData);

  // Update localStorage whenever these change
  React.useEffect(() => {
    localStorage.setItem('buyerRegistrationStatus', status);
  }, [status]);

  React.useEffect(() => {
    if (registrationData) {
      localStorage.setItem('buyerRegistrationData', JSON.stringify(registrationData));
    } else {
      localStorage.removeItem('buyerRegistrationData');
    }
  }, [registrationData]);

  // Sync across tabs
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'buyerRegistrationStatus' && e.newValue) {
        setStatus(e.newValue as RegistrationStatus);
      }
      if (e.key === 'buyerRegistrationData') {
        setRegistrationData(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveDraft = (data: Partial<BuyerRegistrationData>) => {
    setRegistrationData((prev) => ({
      ...(prev as BuyerRegistrationData),
      ...data,
    }));
  };

  const submitRegistration = (data: BuyerRegistrationData) => {
    const referenceId = `BUY-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setRegistrationData({
      ...data,
      referenceId,
      submissionDate: new Date().toISOString(),
    });
    setStatus('PENDING_APPROVAL');
    return referenceId;
  };

  const approveRegistration = () => {
    setStatus('APPROVED');
  };

  const rejectRegistration = () => {
    setStatus('UNREGISTERED'); // Or 'RETURNED'
  };

  return (
    <BuyerRegistrationContext.Provider
      value={{
        status,
        registrationData,
        saveDraft,
        submitRegistration,
        approveRegistration,
        rejectRegistration,
      }}
    >
      {children}
    </BuyerRegistrationContext.Provider>
  );
};

export const useBuyerRegistration = () => useContext(BuyerRegistrationContext);
