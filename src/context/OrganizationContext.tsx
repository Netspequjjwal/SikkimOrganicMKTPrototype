import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type OrgStatus = 'UNREGISTERED' | 'PENDING_SOFDA_REVIEW' | 'APPROVED' | 'RETURNED' | 'REJECTED';
export type SellerStatus = 'UNREGISTERED' | 'PENDING_SCOPE_VERIFICATION' | 'ACTIVE' | 'RETURNED';

export interface OrganizationData {
  id?: string;
  referenceId?: string;
  submissionDate?: string;
  remarks?: string;

  // 1. Business Information
  legalName: string;
  tradeName: string;
  organizationTypeId: string;
  registrationNumber: string;
  pan: string;
  gstNumber: string;
  establishedDate: string;
  organizationEmail: string;
  organizationPhoneNumber: string;
  stateId: string;
  districtId: string;
  pinCode: string;
  registeredAddress: string;
  communicationAddress: string;
  representativeName: string;
  designation: string;
  representativeEmail: string;
  representativePhoneNumber: string;
  representativeAltPhoneNumber: string;

  // 2. Compliances
  iecNumber: string;
  cinNumber: string;
  fssaiLicenseTypeId: string;
  fssaiLicenseNumber: string;
  apedaRcmcNumber: string;
  jaivikBharatRegistration: string;

  // 3. Infrastructure
  warehouse: string;
  processingFacility: string;
  coldStorage: string;
  organicStorage: string;
  storageCapacityUnitId: string;
  totalStorageCapacity: string;
  processingCapacityUnitId: string;
  processingCapacity: string;
  packagingFacility: string;
  qualityControlLaboratoryId: string;

  // 4. Documents
  documents: {
    logo?: string;
    scopeCertificate?: string;
    fssaiLicense?: string;
    iecCertificate?: string;
    apedaRcmc?: string;
  };
}

export interface ScopeCertData {
  certificationSystem: string;
  certificationBody: string;
  scopeCertNumber: string;
  activeAnnualCycle: string;
  issueDate: string;
  expiryDate: string;
  yearWiseHistory: Array<{ year: string; certNumber: string; validFrom: string; validTo: string }>;
  scopeVerifiedCrops: string[];
  docFileName?: string;
}

export interface AuthorizedSignatory {
  id: string;
  name: string;
  designation: string;
  signingAuthority: string;
  mobile: string;
  email: string;
}

export interface BankAccountData {
  bankName: string;
  branchName: string;
  ifscCode: string;
  accountNumber: string;
  accountHolderName: string;
  accountType: string;
  chequeDocName?: string;
}

export interface CapabilitiesState {
  isSellerActive: boolean;
  isBuyerActive: boolean;
}

interface OrganizationContextType {
  orgStatus: OrgStatus;
  orgData: OrganizationData | null;
  capabilities: CapabilitiesState;

  // Seller Profile Lifecycle
  sellerStatus: SellerStatus;
  scopeCertData: ScopeCertData | null;
  authorizedSignatories: AuthorizedSignatory[];
  bankAccount: BankAccountData | null;
  sellerCompletionPercentage: number;

  // Buyer Profile Lifecycle
  buyerAuthorizedSignatories: AuthorizedSignatory[];
  buyerPaymentAccount: BankAccountData | null;
  buyerCompletionPercentage: number;

  saveDraft: (data: Partial<OrganizationData>) => void;
  submitOrgRegistration: (data: OrganizationData) => string;
  approveOrgRegistration: () => void;
  returnOrgRegistration: (remarks?: string) => void;
  rejectOrgRegistration: (remarks?: string) => void;
  activateSellerProfile: () => void;
  activateBuyerProfile: () => void;
  resetToUnregistered: () => void;

  // Seller Actions
  submitSellerScope: (data: ScopeCertData) => void;
  approveSellerScope: () => void;
  addAuthorizedSignatory: (signatory: Omit<AuthorizedSignatory, 'id'>) => void;
  removeAuthorizedSignatory: (id: string) => void;
  saveBankAccount: (bankData: BankAccountData) => void;

  // Buyer Actions
  addBuyerAuthorizedSignatory: (signatory: Omit<AuthorizedSignatory, 'id'>) => void;
  removeBuyerAuthorizedSignatory: (id: string) => void;
  saveBuyerPaymentAccount: (bankData: BankAccountData) => void;
}

const defaultOrgData: OrganizationData = {
  legalName: 'Karmapa Organic Traders',
  tradeName: 'Karmapa Organics',
  organizationTypeId: 'Private Limited Company',
  registrationNumber: 'REG-2026-SK-8891',
  pan: 'ABCDE1234F',
  gstNumber: '11ABCDE1234F1Z5',
  establishedDate: '2018-04-15',
  organizationEmail: 'contact@karmapaorganic.in',
  organizationPhoneNumber: '9876543210',
  stateId: 'Sikkim',
  districtId: 'Gangtok',
  pinCode: '737101',
  registeredAddress: 'Zero Point, Near Secretariat Road, Gangtok',
  communicationAddress: 'Zero Point, Near Secretariat Road, Gangtok',
  representativeName: 'Tenzing Bhutia',
  designation: 'Managing Director',
  representativeEmail: 'tenzing@karmapaorganic.in',
  representativePhoneNumber: '9876543210',
  representativeAltPhoneNumber: '9876543211',

  iecNumber: '1234567890',
  cinNumber: 'U12345SK2018PTC001234',
  fssaiLicenseTypeId: 'State License',
  fssaiLicenseNumber: '11419850000123',
  apedaRcmcNumber: 'APEDA/RCMC/2026/0912',
  jaivikBharatRegistration: 'JB/2025/12345',

  warehouse: 'Yes',
  processingFacility: 'Yes',
  coldStorage: 'Yes',
  organicStorage: 'Yes',
  storageCapacityUnitId: 'MT',
  totalStorageCapacity: '250',
  processingCapacityUnitId: 'MT/Day',
  processingCapacity: '15',
  packagingFacility: 'Yes',
  qualityControlLaboratoryId: 'In-House',

  documents: {
    logo: 'Org_Logo.png',
    scopeCertificate: 'Scope_Certificate_NPOP.pdf',
    fssaiLicense: 'FSSAI_State_License.pdf',
    iecCertificate: 'IEC_Certificate.pdf',
    apedaRcmc: 'APEDA_RCMC.pdf',
  },
};

const defaultScopeData: ScopeCertData = {
  certificationSystem: 'NPOP',
  certificationBody: 'Sikkim State Organic Certification Agency (SSOCA)',
  scopeCertNumber: 'ORG/SC/2026/001',
  activeAnnualCycle: '2026 - 2027 (Current Cycle)',
  issueDate: '2026-04-01',
  expiryDate: '2027-03-31',
  yearWiseHistory: [
    { year: '2025 - 2026', certNumber: 'ORG/SC/2025/084', validFrom: '2025-04-01', validTo: '2026-03-31' },
    { year: '2026 - 2027', certNumber: 'ORG/SC/2026/001', validFrom: '2026-04-01', validTo: '2027-03-31' },
  ],
  scopeVerifiedCrops: [
    'Large Cardamom',
    'Dzongu Ginger',
    'Lakadong Turmeric',
    'Buckwheat',
    'Sikkim Mandarin',
    'Dalle Khursani',
  ],
  docFileName: 'Scope_Certificate_2026.pdf',
};

const OrganizationContext = createContext<OrganizationContextType>({
  orgStatus: 'UNREGISTERED',
  orgData: null,
  capabilities: { isSellerActive: false, isBuyerActive: false },

  sellerStatus: 'UNREGISTERED',
  scopeCertData: null,
  authorizedSignatories: [],
  bankAccount: null,
  sellerCompletionPercentage: 0,

  buyerAuthorizedSignatories: [],
  buyerPaymentAccount: null,
  buyerCompletionPercentage: 0,

  saveDraft: () => {},
  submitOrgRegistration: () => '',
  approveOrgRegistration: () => {},
  returnOrgRegistration: () => {},
  rejectOrgRegistration: () => {},
  activateSellerProfile: () => {},
  activateBuyerProfile: () => {},
  resetToUnregistered: () => {},

  submitSellerScope: () => {},
  approveSellerScope: () => {},
  addAuthorizedSignatory: () => {},
  removeAuthorizedSignatory: () => {},
  saveBankAccount: () => {},

  addBuyerAuthorizedSignatory: () => {},
  removeBuyerAuthorizedSignatory: () => {},
  saveBuyerPaymentAccount: () => {},
});

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const loadStoredStatus = (): OrgStatus => {
    const stored = localStorage.getItem('orgRegistrationStatus');
    return (stored as OrgStatus) || 'UNREGISTERED';
  };

  const loadStoredData = (): OrganizationData | null => {
    const stored = localStorage.getItem('orgRegistrationData');
    return stored ? JSON.parse(stored) : defaultOrgData;
  };

  const loadCapabilities = (): CapabilitiesState => {
    const stored = localStorage.getItem('orgCapabilities');
    return stored ? JSON.parse(stored) : { isSellerActive: false, isBuyerActive: false };
  };

  const loadSellerStatus = (): SellerStatus => {
    const stored = localStorage.getItem('sellerProfileStatus');
    return (stored as SellerStatus) || 'UNREGISTERED';
  };

  const loadScopeData = (): ScopeCertData | null => {
    const stored = localStorage.getItem('sellerScopeData');
    return stored ? JSON.parse(stored) : defaultScopeData;
  };

  const loadSignatories = (): AuthorizedSignatory[] => {
    const stored = localStorage.getItem('sellerSignatories');
    return stored ? JSON.parse(stored) : [
      {
        id: 'SIG-1',
        name: 'Tenzing Bhutia',
        designation: 'Managing Director',
        signingAuthority: 'Primary Signatory (Sole Authority)',
        mobile: '9876543210',
        email: 'tenzing@karmapaorganic.in',
      }
    ];
  };

  const loadBuyerSignatories = (): AuthorizedSignatory[] => {
    const stored = localStorage.getItem('buyerSignatories');
    return stored ? JSON.parse(stored) : [
      {
        id: 'BUY-SIG-1',
        name: 'Tenzing Bhutia',
        designation: 'Procurement Director',
        signingAuthority: 'Primary Procurement Signatory',
        mobile: '9876543210',
        email: 'tenzing@karmapaorganic.in',
      }
    ];
  };

  const loadBankAccount = (): BankAccountData | null => {
    const stored = localStorage.getItem('sellerBankAccount');
    return stored ? JSON.parse(stored) : {
      bankName: 'State Bank of India',
      branchName: 'MG Marg Branch, Gangtok',
      ifscCode: 'SBIN0000234',
      accountNumber: '30492817492',
      accountHolderName: 'Karmapa Organic Traders',
      accountType: 'Current Account',
      chequeDocName: 'Cancelled_Cheque_SBI.pdf',
    };
  };

  const loadBuyerPaymentAccount = (): BankAccountData | null => {
    const stored = localStorage.getItem('buyerPaymentAccount');
    return stored ? JSON.parse(stored) : {
      bankName: 'HDFC Bank',
      branchName: 'Gangtok Main Branch',
      ifscCode: 'HDFC0000881',
      accountNumber: '50200019284718',
      accountHolderName: 'Karmapa Organic Traders',
      accountType: 'Current Account',
      chequeDocName: 'HDFC_Cheque.pdf',
    };
  };

  const [orgStatus, setOrgStatus] = useState<OrgStatus>(loadStoredStatus);
  const [orgData, setOrgData] = useState<OrganizationData | null>(loadStoredData);
  const [capabilities, setCapabilities] = useState<CapabilitiesState>(loadCapabilities);

  const [sellerStatus, setSellerStatus] = useState<SellerStatus>(loadSellerStatus);
  const [scopeCertData, setScopeCertData] = useState<ScopeCertData | null>(loadScopeData);
  const [authorizedSignatories, setAuthorizedSignatories] = useState<AuthorizedSignatory[]>(loadSignatories);
  const [bankAccount, setBankAccount] = useState<BankAccountData | null>(loadBankAccount);

  const [buyerAuthorizedSignatories, setBuyerAuthorizedSignatories] = useState<AuthorizedSignatory[]>(loadBuyerSignatories);
  const [buyerPaymentAccount, setBuyerPaymentAccount] = useState<BankAccountData | null>(loadBuyerPaymentAccount);

  useEffect(() => {
    localStorage.setItem('orgRegistrationStatus', orgStatus);
  }, [orgStatus]);

  useEffect(() => {
    if (orgData) localStorage.setItem('orgRegistrationData', JSON.stringify(orgData));
  }, [orgData]);

  useEffect(() => {
    localStorage.setItem('orgCapabilities', JSON.stringify(capabilities));
  }, [capabilities]);

  useEffect(() => {
    localStorage.setItem('sellerProfileStatus', sellerStatus);
  }, [sellerStatus]);

  useEffect(() => {
    if (scopeCertData) localStorage.setItem('sellerScopeData', JSON.stringify(scopeCertData));
  }, [scopeCertData]);

  useEffect(() => {
    localStorage.setItem('sellerSignatories', JSON.stringify(authorizedSignatories));
  }, [authorizedSignatories]);

  useEffect(() => {
    if (bankAccount) localStorage.setItem('sellerBankAccount', JSON.stringify(bankAccount));
  }, [bankAccount]);

  useEffect(() => {
    localStorage.setItem('buyerSignatories', JSON.stringify(buyerAuthorizedSignatories));
  }, [buyerAuthorizedSignatories]);

  useEffect(() => {
    if (buyerPaymentAccount) localStorage.setItem('buyerPaymentAccount', JSON.stringify(buyerPaymentAccount));
  }, [buyerPaymentAccount]);

  // Calculate Seller Completion Percentage
  const sellerCompletionPercentage = React.useMemo(() => {
    let score = 0;
    if (orgStatus === 'APPROVED') score += 25;
    if (sellerStatus === 'ACTIVE' && scopeCertData) score += 35;
    else if (sellerStatus === 'PENDING_SCOPE_VERIFICATION') score += 20;
    if (authorizedSignatories.length > 0) score += 20;
    if (bankAccount && bankAccount.accountNumber) score += 20;
    return score;
  }, [orgStatus, sellerStatus, scopeCertData, authorizedSignatories, bankAccount]);

  // Calculate Buyer Completion Percentage
  const buyerCompletionPercentage = React.useMemo(() => {
    let score = 0;
    if (orgStatus === 'APPROVED') score += 40;
    if (capabilities.isBuyerActive) score += 20;
    if (buyerAuthorizedSignatories.length > 0) score += 20;
    if (buyerPaymentAccount && buyerPaymentAccount.accountNumber) score += 20;
    return score;
  }, [orgStatus, capabilities.isBuyerActive, buyerAuthorizedSignatories, buyerPaymentAccount]);

  const saveDraft = (data: Partial<OrganizationData>) => {
    setOrgData((prev) => ({
      ...(prev || defaultOrgData),
      ...data,
    }));
  };

  const submitOrgRegistration = (data: OrganizationData) => {
    const refId = `ORG-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const updatedData: OrganizationData = {
      ...data,
      referenceId: refId,
      submissionDate: new Date().toISOString(),
    };
    setOrgData(updatedData);
    setOrgStatus('PENDING_SOFDA_REVIEW');
    return refId;
  };

  const approveOrgRegistration = () => {
    setOrgStatus('APPROVED');
  };

  const returnOrgRegistration = (remarks?: string) => {
    setOrgStatus('RETURNED');
    if (orgData) {
      setOrgData({ ...orgData, remarks: remarks || 'Returned by SOFDA Admin for corrections.' });
    }
  };

  const rejectOrgRegistration = (remarks?: string) => {
    setOrgStatus('REJECTED');
    if (orgData) {
      setOrgData({ ...orgData, remarks: remarks || 'Rejected by SOFDA Admin.' });
    }
  };

  const activateSellerProfile = () => {
    setCapabilities((prev) => ({ ...prev, isSellerActive: true }));
  };

  const activateBuyerProfile = () => {
    setCapabilities((prev) => ({ ...prev, isBuyerActive: true }));
  };

  const resetToUnregistered = () => {
    setOrgStatus('UNREGISTERED');
    setSellerStatus('UNREGISTERED');
    setCapabilities({ isSellerActive: false, isBuyerActive: false });
    localStorage.setItem('orgRegistrationStatus', 'UNREGISTERED');
    localStorage.setItem('sellerProfileStatus', 'UNREGISTERED');
    localStorage.setItem('orgCapabilities', JSON.stringify({ isSellerActive: false, isBuyerActive: false }));
  };

  // Seller Actions
  const submitSellerScope = (data: ScopeCertData) => {
    setScopeCertData(data);
    setSellerStatus('PENDING_SCOPE_VERIFICATION');
  };

  const approveSellerScope = () => {
    setSellerStatus('ACTIVE');
    setCapabilities((prev) => ({ ...prev, isSellerActive: true }));
  };

  const addAuthorizedSignatory = (signatory: Omit<AuthorizedSignatory, 'id'>) => {
    const newSignatory: AuthorizedSignatory = {
      ...signatory,
      id: `SIG-${Date.now()}`,
    };
    setAuthorizedSignatories((prev) => [...prev, newSignatory]);
  };

  const removeAuthorizedSignatory = (id: string) => {
    setAuthorizedSignatories((prev) => prev.filter((s) => s.id !== id));
  };

  const saveBankAccount = (bankData: BankAccountData) => {
    setBankAccount(bankData);
  };

  // Buyer Actions
  const addBuyerAuthorizedSignatory = (signatory: Omit<AuthorizedSignatory, 'id'>) => {
    const newSignatory: AuthorizedSignatory = {
      ...signatory,
      id: `BUY-SIG-${Date.now()}`,
    };
    setBuyerAuthorizedSignatories((prev) => [...prev, newSignatory]);
  };

  const removeBuyerAuthorizedSignatory = (id: string) => {
    setBuyerAuthorizedSignatories((prev) => prev.filter((s) => s.id !== id));
  };

  const saveBuyerPaymentAccount = (bankData: BankAccountData) => {
    setBuyerPaymentAccount(bankData);
  };

  return (
    <OrganizationContext.Provider
      value={{
        orgStatus,
        orgData,
        capabilities,
        sellerStatus,
        scopeCertData,
        authorizedSignatories,
        bankAccount,
        sellerCompletionPercentage,

        buyerAuthorizedSignatories,
        buyerPaymentAccount,
        buyerCompletionPercentage,

        saveDraft,
        submitOrgRegistration,
        approveOrgRegistration,
        returnOrgRegistration,
        rejectOrgRegistration,
        activateSellerProfile,
        activateBuyerProfile,
        resetToUnregistered,

        submitSellerScope,
        approveSellerScope,
        addAuthorizedSignatory,
        removeAuthorizedSignatory,
        saveBankAccount,

        addBuyerAuthorizedSignatory,
        removeBuyerAuthorizedSignatory,
        saveBuyerPaymentAccount,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => useContext(OrganizationContext);
