import React, { createContext, useState, useContext, ReactNode } from 'react';

export type SurveyPhase = 'Phase 1 - Estimated' | 'Phase 2 - Actual';
export type SurveyStatus = 'Pending' | 'Approved' | 'Returned' | 'Rejected';

export interface YieldSurvey {
  id: string;
  serviceProviderName: string;
  year: string;
  season: string;
  phase: SurveyPhase;
  crop: string;
  growerGroups: string[];
  farmerCount: number;
  certFileName: string;
  excelData: any[];
  totalArea: number; // in Ha
  totalYield: number; // in MT
  status: SurveyStatus;
  submittedAt: string;
  remarks?: string;
}

interface YSContextType {
  surveys: YieldSurvey[];
  addSurvey: (survey: Omit<YieldSurvey, 'id' | 'status' | 'submittedAt'>) => YieldSurvey;
  updateSurveyStatus: (id: string, status: SurveyStatus, remarks?: string) => void;
  getApprovedYield: (crop: string) => number;
}

const initialData: YieldSurvey[] = [
  // Large Cardamom
  {
    id: 'YS-2026-RABI-000088',
    serviceProviderName: 'Sikkim Organic Alive',
    year: '2026',
    season: 'Rabi',
    phase: 'Phase 1 - Estimated',
    crop: 'Large Cardamom',
    growerGroups: ['Mangan GG1', 'Dzongu GG2'],
    farmerCount: 145,
    certFileName: 'Scoped_Cert_SOA_2026.pdf',
    excelData: [
      { farmerId: 'F-1001', name: 'Karma Bhutia', village: 'Mangan', area: 2.5, yield: 1.2 },
      { farmerId: 'F-1002', name: 'Sonam Lepcha', village: 'Dzongu', area: 1.8, yield: 0.8 },
      { farmerId: 'F-1003', name: 'Passang Sherpa', village: 'Mangan', area: 3.2, yield: 1.5 },
    ],
    totalArea: 7.5,
    totalYield: 3.5, // MT
    status: 'Approved',
    submittedAt: '2026-04-10T09:00:00Z',
    remarks: 'Data verified against field inspection reports. Approved.'
  },
  {
    id: 'YS-2026-RABI-000102',
    serviceProviderName: 'SIMFED',
    year: '2026',
    season: 'Rabi',
    phase: 'Phase 2 - Actual',
    crop: 'Large Cardamom',
    growerGroups: ['Chungthang GG'],
    farmerCount: 200,
    certFileName: 'TC_SIMFED_Cardamom.pdf',
    excelData: [],
    totalArea: 10.0,
    totalYield: 5.2, // MT
    status: 'Approved',
    submittedAt: '2026-05-15T10:00:00Z',
    remarks: 'Actual yields verified with TC.'
  },
  {
    id: 'YS-2026-RABI-000115',
    serviceProviderName: 'Concede Service Provider Agency',
    year: '2026',
    season: 'Rabi',
    phase: 'Phase 1 - Estimated',
    crop: 'Large Cardamom',
    growerGroups: ['Geyzing GG1'],
    farmerCount: 120,
    certFileName: 'Scoped_Cert_Concede.pdf',
    excelData: [],
    totalArea: 8.0,
    totalYield: 4.1, // MT
    status: 'Approved',
    submittedAt: '2026-04-12T11:00:00Z',
    remarks: 'Approved for pre-booking.'
  },
  
  // Ginger
  {
    id: 'YS-2026-KHARIF-000142',
    serviceProviderName: 'SIMFED',
    year: '2026',
    season: 'Kharif',
    phase: 'Phase 1 - Estimated',
    crop: 'Ginger',
    growerGroups: ['Geyzing GG'],
    farmerCount: 88,
    certFileName: 'SIMFED_Scoped_2026.pdf',
    excelData: [
      { farmerId: 'F-2051', name: 'Rahul Sharma', village: 'Geyzing', area: 1.2, yield: 4.5 },
      { farmerId: 'F-2052', name: 'Priya Rai', village: 'Geyzing', area: 0.8, yield: 3.2 },
    ],
    totalArea: 2.0,
    totalYield: 7.7, // MT
    status: 'Pending',
    submittedAt: '2026-07-01T11:20:00Z',
  },
  {
    id: 'YS-2026-KHARIF-000188',
    serviceProviderName: 'Sikkim Organic Alive',
    year: '2026',
    season: 'Kharif',
    phase: 'Phase 2 - Actual',
    crop: 'Ginger',
    growerGroups: ['Namchi GG'],
    farmerCount: 300,
    certFileName: 'TC_SOA_Ginger.pdf',
    excelData: [],
    totalArea: 15.0,
    totalYield: 120.5, // MT
    status: 'Approved',
    submittedAt: '2026-06-20T09:00:00Z',
    remarks: 'Actual yields approved.'
  },
  {
    id: 'YS-2026-KHARIF-000195',
    serviceProviderName: 'Mevedir',
    year: '2026',
    season: 'Kharif',
    phase: 'Phase 1 - Estimated',
    crop: 'Ginger',
    growerGroups: ['Pakyong GG'],
    farmerCount: 150,
    certFileName: 'Scoped_Cert_Mevedir.pdf',
    excelData: [],
    totalArea: 8.0,
    totalYield: 45.0, // MT
    status: 'Approved',
    submittedAt: '2026-06-25T14:00:00Z',
    remarks: 'Approved.'
  },

  // Turmeric
  {
    id: 'YS-2026-KHARIF-000210',
    serviceProviderName: 'SIMFED',
    year: '2026',
    season: 'Kharif',
    phase: 'Phase 1 - Estimated',
    crop: 'Turmeric',
    growerGroups: ['Jorethang GG'],
    farmerCount: 220,
    certFileName: 'TC_SIMFED_Turmeric.pdf',
    excelData: [],
    totalArea: 12.0,
    totalYield: 60.0, // MT
    status: 'Approved',
    submittedAt: '2026-05-10T10:00:00Z',
    remarks: 'Approved.'
  },
  {
    id: 'YS-2026-KHARIF-000220',
    serviceProviderName: 'Concede Service Provider Agency',
    year: '2026',
    season: 'Kharif',
    phase: 'Phase 2 - Actual',
    crop: 'Turmeric',
    growerGroups: ['Namchi GG2'],
    farmerCount: 180,
    certFileName: 'TC_Concede_Turmeric.pdf',
    excelData: [],
    totalArea: 10.0,
    totalYield: 48.5, // MT
    status: 'Approved',
    submittedAt: '2026-06-12T11:00:00Z',
    remarks: 'Approved.'
  },

  // Buckwheat
  {
    id: 'YS-2026-RABI-000305',
    serviceProviderName: 'Sikkim Organic Alive',
    year: '2026',
    season: 'Rabi',
    phase: 'Phase 2 - Actual',
    crop: 'Buckwheat',
    growerGroups: ['Lachen GG', 'Lachung GG'],
    farmerCount: 400,
    certFileName: 'TC_SOA_Buckwheat.pdf',
    excelData: [],
    totalArea: 40.0,
    totalYield: 85.0, // MT
    status: 'Approved',
    submittedAt: '2026-06-05T09:00:00Z',
    remarks: 'Approved.'
  },
  {
    id: 'YS-2026-RABI-000315',
    serviceProviderName: 'Mevedir',
    year: '2026',
    season: 'Rabi',
    phase: 'Phase 1 - Estimated',
    crop: 'Buckwheat',
    growerGroups: ['Dzongu GG'],
    farmerCount: 150,
    certFileName: 'Scoped_Mevedir_Buckwheat.pdf',
    excelData: [],
    totalArea: 15.0,
    totalYield: 25.0, // MT
    status: 'Approved',
    submittedAt: '2026-06-22T09:00:00Z',
    remarks: 'Approved.'
  }
];

const YieldSurveyContext = createContext<YSContextType | undefined>(undefined);

export const YieldSurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [surveys, setSurveys] = useState<YieldSurvey[]>(initialData);

  const addSurvey = (survey: Omit<YieldSurvey, 'id' | 'status' | 'submittedAt'>) => {
    const seasonCode = survey.season.toUpperCase();
    const newId = `YS-${survey.year}-${seasonCode}-000${Math.floor(100 + Math.random() * 900)}`;
    const newSurvey: YieldSurvey = {
      ...survey,
      id: newId,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };
    setSurveys((prev) => [newSurvey, ...prev]);
    return newSurvey;
  };

  const updateSurveyStatus = (id: string, status: SurveyStatus, remarks?: string) => {
    setSurveys((prev) =>
      prev.map((survey) => (survey.id === id ? { ...survey, status, remarks } : survey))
    );
  };

  const getApprovedYield = (crop: string) => {
    return surveys
      .filter(s => s.crop === crop && s.status === 'Approved')
      .reduce((total, s) => total + s.totalYield, 0);
  };

  return (
    <YieldSurveyContext.Provider value={{ surveys, addSurvey, updateSurveyStatus, getApprovedYield }}>
      {children}
    </YieldSurveyContext.Provider>
  );
};

export const useYieldSurvey = () => {
  const context = useContext(YieldSurveyContext);
  if (context === undefined) {
    throw new Error('useYieldSurvey must be used within a YieldSurveyProvider');
  }
  return context;
};
