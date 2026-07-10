import React, { createContext, useContext, useState, ReactNode } from 'react';
import concedeLogo from '../assets/concede-logo.png';
import sikkimAliveLogo from '../assets/sikkim-organic-alive-logo.png';

export interface TCProvider {
  id: string;
  name: string;
  logo: string;
  districts: string[];
  certAuthority: string;
  experienceYears: number;
  activeCertsIssued: number;
  avgResponseTime: string;
  rating: number;
  complianceScore: number;
  startingPrice: number;
  processingTime: string;
  supportContact: string;
  badges: string[];
  crops: string[];
}

export interface TCRequest {
  id: string;
  fpoId: string;
  fpoName: string;
  providerId: string;
  status: 'Pending' | 'Under Review' | 'Awaiting Documents' | 'Proposal Ready' | 'Payment Pending' | 'Accepted' | 'Rejected' | 'Archived';
  requestDate: string;
  crops: string[];
  expectedQty: number;
  procurementSeason: string;
  intendedMarket: 'Domestic' | 'Export';
  usagePeriod: number; // months
  message: string;
  documents: { type: string; name: string }[];
  remarks?: string;
  proposal?: TCProposal;
}

export interface TCProposal {
  id: string;
  serviceCharges: number;
  validityStart: string;
  validityEnd: string;
  maxQty: number;
  applicableCrops: string[];
  districts: string[];
  conditions: string[];
}

export interface ActiveCertificate {
  id: string;
  certNumber: string;
  fpoId: string;
  providerId: string;
  providerName: string;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Suspended' | 'Revoked';
  validityStart: string;
  validityEnd: string;
  applicableCrops: string[];
  maxQty: number;
  utilizedQty: number;
  districts: string[];
}

interface TCContextType {
  providers: TCProvider[];
  requests: TCRequest[];
  activeCertificates: ActiveCertificate[];
  submitRequest: (request: Omit<TCRequest, 'id' | 'requestDate' | 'status'>) => void;
  updateRequestStatus: (id: string, status: TCRequest['status'], remarks?: string) => void;
  submitProposal: (requestId: string, proposal: Omit<TCProposal, 'id'>) => void;
  processPayment: (requestId: string) => void;
}

const TCContext = createContext<TCContextType | undefined>(undefined);

export const TCProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [providers] = useState<TCProvider[]>([
    {
      id: 'sp1',
      name: 'Concede Service Provider Agency',
      logo: concedeLogo,
      districts: ['Gangtok', 'Pakyong'],
      certAuthority: 'OneCert International',
      experienceYears: 8,
      activeCertsIssued: 145,
      avgResponseTime: '24 hours',
      rating: 4.8,
      complianceScore: 99,
      startingPrice: 15000,
      processingTime: '3-5 Days',
      supportContact: 'support@eastsikkimfpo.org',
      badges: ['SOFDA Approved', 'Verified ICS Provider'],
      crops: ['Large Cardamom', 'Ginger', 'Turmeric']
    },
    {
      id: 'sp2',
      name: 'Sikkim Organic Alive',
      logo: sikkimAliveLogo,
      districts: ['Namchi', 'Geyzing'],
      certAuthority: 'Control Union',
      experienceYears: 12,
      activeCertsIssued: 320,
      avgResponseTime: '12 hours',
      rating: 4.9,
      complianceScore: 100,
      startingPrice: 18000,
      processingTime: '2-4 Days',
      supportContact: 'hello@sikkimorganicalive.in',
      badges: ['SOFDA Approved', 'Premium Provider'],
      crops: ['Buckwheat', 'Dalley Khorsani', 'Tea']
    }
  ]);

  const [requests, setRequests] = useState<TCRequest[]>([]);
  const [activeCertificates, setActiveCertificates] = useState<ActiveCertificate[]>([]);

  const submitRequest = (request: Omit<TCRequest, 'id' | 'requestDate' | 'status'>) => {
    const newRequest: TCRequest = {
      ...request,
      id: `TCR-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      requestDate: new Date().toISOString(),
      status: 'Pending'
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateRequestStatus = (id: string, status: TCRequest['status'], remarks?: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status, remarks } : req));
  };

  const submitProposal = (requestId: string, proposal: Omit<TCProposal, 'id'>) => {
    const newProposal: TCProposal = {
      ...proposal,
      id: `TCP-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`
    };
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'Proposal Ready', proposal: newProposal } : req));
  };

  const processPayment = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request && request.proposal) {
      const provider = providers.find(p => p.id === request.providerId);
      const newCert: ActiveCertificate = {
        id: `TC-${Date.now()}`,
        certNumber: `TC/SKM/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        fpoId: request.fpoId,
        providerId: request.providerId,
        providerName: provider?.name || 'Unknown Provider',
        status: 'Active',
        validityStart: request.proposal.validityStart,
        validityEnd: request.proposal.validityEnd,
        applicableCrops: request.proposal.applicableCrops,
        maxQty: request.proposal.maxQty,
        utilizedQty: 0,
        districts: request.proposal.districts
      };
      
      setActiveCertificates(prev => [newCert, ...prev]);
      updateRequestStatus(requestId, 'Accepted');
    }
  };

  return (
    <TCContext.Provider value={{ providers, requests, activeCertificates, submitRequest, updateRequestStatus, submitProposal, processPayment }}>
      {children}
    </TCContext.Provider>
  );
};

export const useTC = () => {
  const context = useContext(TCContext);
  if (context === undefined) {
    throw new Error('useTC must be used within a TCProviderWrapper');
  }
  return context;
};
