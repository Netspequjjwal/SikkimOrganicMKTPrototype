import React, { createContext, useState, useContext, ReactNode } from 'react';

export type ApplicationStatus = 'Pending' | 'Approved' | 'Returned' | 'Rejected';

export interface ServiceProviderRegistration {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  mobile: string;
  altMobile?: string;
  address: string;
  licenseFileName?: string;
  additionalDocName?: string;
  additionalDocFileName?: string;
  status: ApplicationStatus;
  submittedAt: string;
  remarks?: string;
}

interface SPContextType {
  applications: ServiceProviderRegistration[];
  addApplication: (app: Omit<ServiceProviderRegistration, 'id' | 'status' | 'submittedAt'>) => ServiceProviderRegistration;
  updateApplicationStatus: (id: string, status: ApplicationStatus, remarks?: string) => void;
}

const initialData: ServiceProviderRegistration[] = [
  {
    id: 'SP-2026-000101',
    name: 'Sikkim Organic Alive',
    ownerName: 'Tenzing Lepcha',
    email: 'contact@sikkimalive.in',
    mobile: '9876543210',
    address: 'M.G. Marg, Gangtok, East Sikkim',
    licenseFileName: 'SOA_License_2026.pdf',
    status: 'Pending',
    submittedAt: '2026-06-15T10:30:00Z',
  },
  {
    id: 'SP-2026-000122',
    name: 'Concede Service Provider Agency',
    ownerName: 'Priya Sharma',
    email: 'admin@concedein.com',
    mobile: '9988776655',
    address: 'Namchi Bazaar, South Sikkim',
    licenseFileName: 'Concede_Reg.pdf',
    status: 'Pending',
    submittedAt: '2026-07-01T14:45:00Z',
  },
  {
    id: 'SP-2026-000135',
    name: 'SIMFED',
    ownerName: 'Government of Sikkim',
    email: 'info@simfed.gov.in',
    mobile: '9000000000',
    address: 'Sonam Tshering Marg, Gangtok',
    licenseFileName: 'SIMFED_Auth.pdf',
    status: 'Approved',
    submittedAt: '2026-06-20T09:15:00Z',
  }
];

const ServiceProviderContext = createContext<SPContextType | undefined>(undefined);

export const ServiceProviderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<ServiceProviderRegistration[]>(initialData);

  const addApplication = (app: Omit<ServiceProviderRegistration, 'id' | 'status' | 'submittedAt'>) => {
    const newId = `SP-2026-000${Math.floor(100 + Math.random() * 900)}`;
    const newApp: ServiceProviderRegistration = {
      ...app,
      id: newId,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, remarks?: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status, remarks } : app))
    );
  };

  return (
    <ServiceProviderContext.Provider value={{ applications, addApplication, updateApplicationStatus }}>
      {children}
    </ServiceProviderContext.Provider>
  );
};

export const useServiceProvider = () => {
  const context = useContext(ServiceProviderContext);
  if (context === undefined) {
    throw new Error('useServiceProvider must be used within a ServiceProviderProvider');
  }
  return context;
};
