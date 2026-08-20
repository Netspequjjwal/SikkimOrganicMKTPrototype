import React, { useState, useMemo } from 'react';
import { useOrganization, OrganizationData, OrgStatus } from '../../context/OrganizationContext';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, ArrowLeft, Download, AlertCircle, Building2, ShieldCheck, Warehouse, FileText, RefreshCw, Mail, Phone, MapPin, User } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_ORGS: (OrganizationData & { status: OrgStatus; submittedAt: string })[] = [
  {
    id: 'ORG-2026-650195',
    referenceId: 'ORG-2026-650195',
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
    status: 'PENDING_SOFDA_REVIEW',
    submittedAt: '2026-08-18',
  },
  {
    id: 'ORG-2026-992144',
    referenceId: 'ORG-2026-992144',
    legalName: 'Sikkim Himalayan Spices Producer Co.',
    tradeName: 'Himalayan Organic Spices',
    organizationTypeId: 'Farmer Producer Organization (FPO)',
    registrationNumber: 'REG-2025-SK-4412',
    pan: 'BCDEF2345G',
    gstNumber: '11BCDEF2345G1Z4',
    establishedDate: '2020-02-10',
    organizationEmail: 'info@himalayanspices.org',
    organizationPhoneNumber: '9876599887',
    stateId: 'Sikkim',
    districtId: 'Namchi',
    pinCode: '737126',
    registeredAddress: 'Market Complex, Namchi Bazaar',
    communicationAddress: 'Market Complex, Namchi Bazaar',
    representativeName: 'Pemba Lepcha',
    designation: 'FPO Director',
    representativeEmail: 'pemba@himalayanspices.org',
    representativePhoneNumber: '9876599887',
    representativeAltPhoneNumber: '',

    iecNumber: '0987654321',
    cinNumber: 'U01100SK2020PTC009988',
    fssaiLicenseTypeId: 'Central License',
    fssaiLicenseNumber: '11420850000999',
    apedaRcmcNumber: 'APEDA/RCMC/2025/1100',
    jaivikBharatRegistration: 'JB/2025/99881',

    warehouse: 'Yes',
    processingFacility: 'Yes',
    coldStorage: 'No',
    organicStorage: 'Yes',
    storageCapacityUnitId: 'MT',
    totalStorageCapacity: '500',
    processingCapacityUnitId: 'MT/Day',
    processingCapacity: '30',
    packagingFacility: 'Yes',
    qualityControlLaboratoryId: 'Third-Party NABL Accredited',

    documents: {
      logo: 'FPO_Logo.png',
      scopeCertificate: 'Scope_Cert_NPOP_2026.pdf',
      fssaiLicense: 'FSSAI_Central.pdf',
      iecCertificate: 'IEC_Cert.pdf',
    },
    status: 'PENDING_SOFDA_REVIEW',
    submittedAt: '2026-08-19',
  },
  {
    id: 'ORG-2026-110023',
    referenceId: 'ORG-2026-110023',
    legalName: 'Yuksom Organic Farmers Collective',
    tradeName: 'Yuksom Organics',
    organizationTypeId: 'Cooperative Society',
    registrationNumber: 'COOP-2019-Gyalshing-004',
    pan: 'CDEFG3456H',
    gstNumber: '11CDEFG3456H1Z3',
    establishedDate: '2019-07-22',
    organizationEmail: 'contact@yuksomorganics.org',
    organizationPhoneNumber: '9733001122',
    stateId: 'Sikkim',
    districtId: 'Gyalshing',
    pinCode: '737113',
    registeredAddress: 'Yuksom Bazaar, West Sikkim',
    communicationAddress: 'Yuksom Bazaar, West Sikkim',
    representativeName: 'Dawa Sherpa',
    designation: 'Society President',
    representativeEmail: 'dawa@yuksomorganics.org',
    representativePhoneNumber: '9733001122',
    representativeAltPhoneNumber: '',

    iecNumber: '',
    cinNumber: '',
    fssaiLicenseTypeId: 'State License',
    fssaiLicenseNumber: '11419850000456',
    apedaRcmcNumber: '',
    jaivikBharatRegistration: 'JB/2024/77654',

    warehouse: 'Yes',
    processingFacility: 'No',
    coldStorage: 'No',
    organicStorage: 'Yes',
    storageCapacityUnitId: 'Quintals',
    totalStorageCapacity: '800',
    processingCapacityUnitId: 'MT/Day',
    processingCapacity: '0',
    packagingFacility: 'Yes',
    qualityControlLaboratoryId: 'None',

    documents: {
      logo: 'Coop_Logo.png',
      scopeCertificate: 'PGS_Scope_Certificate.pdf',
      fssaiLicense: 'FSSAI_State.pdf',
    },
    status: 'APPROVED',
    submittedAt: '2026-08-15',
  }
];

import UniversalDocumentViewer from '../../components/common/UniversalDocumentViewer';

const SellerApprovals: React.FC = () => {
  const { orgStatus, orgData, approveOrgRegistration, returnOrgRegistration, rejectOrgRegistration } = useOrganization();

  const [activeTab, setActiveTab] = useState<'All' | OrgStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const [actionRemarks, setActionRemarks] = useState('');

  const [activeViewerDoc, setActiveViewerDoc] = useState<{
    isOpen: boolean;
    title: string;
    fileName: string;
    entityName: string;
    regNo?: string;
  } | null>(null);

  const applications = useMemo(() => {
    let list = [...MOCK_ORGS];
    if (orgData) {
      const liveStatus = orgStatus;
      const existingIdx = list.findIndex(o => o.referenceId === orgData.referenceId || o.legalName === orgData.legalName);
      const liveItem = {
        ...orgData,
        id: orgData.referenceId || 'ORG-2026-LIVE',
        referenceId: orgData.referenceId || 'ORG-2026-LIVE',
        status: liveStatus,
        submittedAt: orgData.submissionDate ? new Date(orgData.submissionDate).toISOString().split('T')[0] : '2026-08-19'
      };
      if (existingIdx >= 0) {
        list[existingIdx] = liveItem as any;
      } else {
        list.unshift(liveItem as any);
      }
    }
    return list;
  }, [orgData, orgStatus]);

  const filteredOrgs = useMemo(() => {
    return applications.filter(org => {
      const matchesTab = activeTab === 'All' || org.status === activeTab;
      const matchesSearch =
        org.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (org.referenceId && org.referenceId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        org.representativeName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [applications, activeTab, searchQuery]);

  const handleApprove = (org: any) => {
    if (org.referenceId === orgData?.referenceId || org.legalName === orgData?.legalName) {
      approveOrgRegistration();
    }
    toast.success(`Organization ${org.legalName} Approved successfully! Status set to Active.`);
    setSelectedOrg(null);
  };

  const handleReturn = (org: any) => {
    if (!actionRemarks.trim()) {
      toast.error('Remarks are mandatory when returning an application.');
      return;
    }
    if (org.referenceId === orgData?.referenceId || org.legalName === orgData?.legalName) {
      returnOrgRegistration(actionRemarks);
    }
    toast.success(`Application returned to ${org.legalName} for corrections.`);
    setSelectedOrg(null);
    setActionRemarks('');
  };

  const handleReject = (org: any) => {
    if (!actionRemarks.trim()) {
      toast.error('Remarks are mandatory when rejecting an application.');
      return;
    }
    if (org.referenceId === orgData?.referenceId || org.legalName === orgData?.legalName) {
      rejectOrgRegistration(actionRemarks);
    }
    toast.error(`Application for ${org.legalName} Rejected.`);
    setSelectedOrg(null);
    setActionRemarks('');
  };

  const getStatusBadge = (status: OrgStatus) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">Approved</span>;
      case 'PENDING_SOFDA_REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">Pending</span>;
      case 'RETURNED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 whitespace-nowrap">Returned</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 whitespace-nowrap">Rejected</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 whitespace-nowrap">{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold">Organizations Verifications Center</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            SOFDA Regulatory Inspection & Verification of Incoming Organization Registration Applications.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Pending Verification: <strong>{applications.filter(a => a.status === 'PENDING_SOFDA_REVIEW').length} Applications</strong></span>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 border-b md:border-b-0 pb-2 md:pb-0 overflow-x-auto w-full md:w-auto">
          {(['All', 'PENDING_SOFDA_REVIEW', 'APPROVED', 'RETURNED', 'REJECTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'All' ? 'All Applications' : tab.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Organization Name, PAN, Reg No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider">
                <th className="p-4">Ref & Legal Name</th>
                <th className="p-4">Organization Type</th>
                <th className="p-4">District / State</th>
                <th className="p-4">PAN & GST</th>
                <th className="p-4">Representative</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {filteredOrgs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No Organization applications found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{org.legalName}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{org.referenceId} ({org.tradeName})</div>
                    </td>
                    <td className="p-4 text-gray-700 font-semibold">{org.organizationTypeId}</td>
                    <td className="p-4 text-gray-700">{org.districtId}, {org.stateId}</td>
                    <td className="p-4 font-mono text-gray-700">
                      <div>PAN: {org.pan}</div>
                      <div className="text-[11px] text-gray-500">GST: {org.gstNumber}</div>
                    </td>
                    <td className="p-4 text-gray-700">
                      <div className="font-bold">{org.representativeName}</div>
                      <div className="text-[11px] text-gray-500">{org.designation}</div>
                    </td>
                    <td className="p-4 text-gray-600">{org.submittedAt}</td>
                    <td className="p-4">{getStatusBadge(org.status)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrg(org)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect Org Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organization Application Details Inspection Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-xl font-bold">{selectedOrg.legalName}</h2>
                  {getStatusBadge(selectedOrg.status)}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Ref ID: {selectedOrg.referenceId} | Trade Name: {selectedOrg.tradeName} | Submitted: {selectedOrg.submittedAt}
                </p>
              </div>
              <button onClick={() => setSelectedOrg(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body with 4 Sections */}
            <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* 1. Business Information */}
              <div className="bg-white border rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" /> 1. Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-gray-500 block">Legal Name:</span><strong className="text-gray-900">{selectedOrg.legalName}</strong></div>
                  <div><span className="text-gray-500 block">Trade Name:</span><strong className="text-gray-900">{selectedOrg.tradeName}</strong></div>
                  <div><span className="text-gray-500 block">Organization Type:</span><strong className="text-gray-900">{selectedOrg.organizationTypeId}</strong></div>
                  <div><span className="text-gray-500 block">Registration Number:</span><strong className="text-gray-900">{selectedOrg.registrationNumber}</strong></div>
                  <div><span className="text-gray-500 block">PAN:</span><strong className="font-mono text-gray-900">{selectedOrg.pan}</strong></div>
                  <div><span className="text-gray-500 block">GST Number:</span><strong className="font-mono text-gray-900">{selectedOrg.gstNumber}</strong></div>
                  <div><span className="text-gray-500 block">Established Date:</span><strong className="text-gray-900">{selectedOrg.establishedDate}</strong></div>
                  <div><span className="text-gray-500 block">Email:</span><strong className="text-gray-900">{selectedOrg.organizationEmail}</strong></div>
                  <div><span className="text-gray-500 block">Phone:</span><strong className="text-gray-900">{selectedOrg.organizationPhoneNumber}</strong></div>
                  <div className="col-span-2"><span className="text-gray-500 block">Registered Address:</span><strong className="text-gray-900">{selectedOrg.registeredAddress}, {selectedOrg.districtId}, {selectedOrg.stateId} - {selectedOrg.pinCode}</strong></div>
                  <div><span className="text-gray-500 block">Representative:</span><strong className="text-gray-900">{selectedOrg.representativeName} ({selectedOrg.designation})</strong></div>
                </div>
              </div>

              {/* 2. Organic Capabilities / Compliances */}
              <div className="bg-white border rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2. Statutory Compliances & Certifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-gray-500 block">FSSAI License:</span><strong className="text-gray-900">{selectedOrg.fssaiLicenseNumber} ({selectedOrg.fssaiLicenseTypeId})</strong></div>
                  <div><span className="text-gray-500 block">CIN Number:</span><strong className="text-gray-900">{selectedOrg.cinNumber || 'N/A'}</strong></div>
                  <div><span className="text-gray-500 block">Jaivik Bharat Reg:</span><strong className="text-gray-900">{selectedOrg.jaivikBharatRegistration || 'N/A'}</strong></div>
                  <div><span className="text-gray-500 block">IEC Number:</span><strong className="text-gray-900">{selectedOrg.iecNumber || 'N/A'}</strong></div>
                  <div><span className="text-gray-500 block">APEDA RCMC:</span><strong className="text-gray-900">{selectedOrg.apedaRcmcNumber || 'N/A'}</strong></div>
                </div>
              </div>

              {/* 3. Infrastructure Details */}
              <div className="bg-white border rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-emerald-600" /> 3. Infrastructure & Facilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-gray-500 block">Warehouse:</span><strong className="text-gray-900">{selectedOrg.warehouse} (Cap: {selectedOrg.totalStorageCapacity} {selectedOrg.storageCapacityUnitId})</strong></div>
                  <div><span className="text-gray-500 block">Processing Facility:</span><strong className="text-gray-900">{selectedOrg.processingFacility} (Cap: {selectedOrg.processingCapacity} {selectedOrg.processingCapacityUnitId})</strong></div>
                  <div><span className="text-gray-500 block">Cold Storage:</span><strong className="text-gray-900">{selectedOrg.coldStorage}</strong></div>
                  <div><span className="text-gray-500 block">Organic Storage:</span><strong className="text-gray-900">{selectedOrg.organicStorage}</strong></div>
                  <div><span className="text-gray-500 block">Packaging Facility:</span><strong className="text-gray-900">{selectedOrg.packagingFacility}</strong></div>
                  <div><span className="text-gray-500 block">QC Lab Setup:</span><strong className="text-gray-900">{selectedOrg.qualityControlLaboratoryId}</strong></div>
                </div>
              </div>

              {/* 4. Uploaded Documents */}
              <div className="bg-white border rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" /> 4. Uploaded Verification Documents
                  </span>
                  <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Click any document to inspect in Document Viewer
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {Object.entries(selectedOrg.documents || {}).map(([key, val]) => {
                    const docLabel = key.replace(/([A-Z])/g, ' $1').trim();
                    const fileName = val as string;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50/60 transition-colors rounded-xl border border-slate-200"
                      >
                        <div>
                          <span className="font-bold text-gray-900 capitalize block">{docLabel}</span>
                          <span className="font-mono text-[11px] text-gray-500">{fileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveViewerDoc({
                              isOpen: true,
                              title: `${selectedOrg.legalName} - ${docLabel}`,
                              fileName: fileName,
                              entityName: selectedOrg.legalName,
                              regNo: selectedOrg.registrationNumber,
                            })
                          }
                          className="px-3 py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold text-xs rounded-lg border border-emerald-300 shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Document
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Remarks Field for Actions */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <label className="block text-xs font-bold text-gray-700">
                  SOFDA Official Inspection Remarks / Feedback Notes
                </label>
                <textarea
                  rows={2}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder="Enter verification notes or reasons if returning/rejecting..."
                  className="w-full p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <button
                onClick={() => setSelectedOrg(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border rounded-lg hover:bg-gray-100"
              >
                Close View
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleReturn(selectedOrg)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Return for Info
                </button>
                <button
                  onClick={() => handleReject(selectedOrg)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject Application
                </button>
                <button
                  onClick={() => handleApprove(selectedOrg)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Approve Organization Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Universal Document Viewer Modal */}
      {activeViewerDoc && (
        <UniversalDocumentViewer
          isOpen={activeViewerDoc.isOpen}
          onClose={() => setActiveViewerDoc(null)}
          documentTitle={activeViewerDoc.title}
          documentFileName={activeViewerDoc.fileName}
          entityName={activeViewerDoc.entityName}
          registrationNumber={activeViewerDoc.regNo || 'REG-2026-SK-8891'}
        />
      )}
    </div>
  );
};

export default SellerApprovals;
