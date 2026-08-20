import React, { useState, useMemo } from 'react';
import { useOrganization, SellerStatus } from '../../context/OrganizationContext';
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
  ShieldCheck,
  Building2,
  RefreshCw,
  X,
  Download,
  ZoomIn,
  ZoomOut,
  Warehouse,
  Tag,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_SCOPE_CERTS = [
  {
    id: 'SCOPE-2026-001',
    orgName: 'Karmapa Organic Traders',
    orgTradeName: 'Karmapa Organics',
    orgRefId: 'ORG-2026-650195',
    orgType: 'Private Limited Company',
    district: 'Gangtok',
    state: 'Sikkim',
    pan: 'ABCDE1234F',
    gst: '11ABCDE1234F1Z5',
    fssai: '11419850000123 (State License)',
    apeda: 'APEDA/RCMC/2026/0912',
    representative: 'Tenzing Bhutia (Managing Director)',
    email: 'contact@karmapaorganic.in',
    phone: '9876543210',
    address: 'Zero Point, Near Secretariat Road, Gangtok - 737101',
    warehouse: 'Yes (Cap: 250 MT)',
    processing: 'Yes (Cap: 15 MT/Day)',
    coldStorage: 'Yes',
    organicStorage: 'Yes',
    qcLab: 'In-House Quality Control Lab',

    certificationSystem: 'NPOP',
    certificationBody: 'Sikkim State Organic Certification Agency (SSOCA)',
    scopeCertNumber: 'ORG/SC/2026/001',
    activeAnnualCycle: '2026 - 2027 (Current Cycle)',
    issueDate: '2026-04-01',
    expiryDate: '2027-03-31',
    yearWiseHistory: [
      { year: '2025 - 2026', certNumber: 'ORG/SC/2025/084', validFrom: '2025-04-01', validTo: '2026-03-31' },
      { year: '2026 - 2027', certNumber: 'ORG/SC/2026/001', validFrom: '2026-04-01', validTo: '2027-03-31' }
    ],
    scopeVerifiedCrops: [
      'Large Cardamom',
      'Dzongu Ginger',
      'Lakadong Turmeric',
      'Buckwheat',
      'Sikkim Mandarin',
      'Dalle Khursani'
    ],
    docFileName: 'Scope_Certificate_NPOP_2026.pdf',
    status: 'PENDING_SCOPE_VERIFICATION' as SellerStatus,
    submittedAt: '2026-08-19'
  },
  {
    id: 'SCOPE-2026-002',
    orgName: 'Sikkim Himalayan Spices Producer Co.',
    orgTradeName: 'Himalayan Organic Spices',
    orgRefId: 'ORG-2026-992144',
    orgType: 'Farmer Producer Organization (FPO)',
    district: 'Namchi',
    state: 'Sikkim',
    pan: 'BCDEF2345G',
    gst: '11BCDEF2345G1Z4',
    fssai: '11420850000999 (Central License)',
    apeda: 'APEDA/RCMC/2025/1100',
    representative: 'Pemba Lepcha (FPO Director)',
    email: 'info@himalayanspices.org',
    phone: '9876599887',
    address: 'Market Complex, Namchi Bazaar, Namchi - 737126',
    warehouse: 'Yes (Cap: 500 MT)',
    processing: 'Yes (Cap: 30 MT/Day)',
    coldStorage: 'No',
    organicStorage: 'Yes',
    qcLab: 'Third-Party NABL Accredited',

    certificationSystem: 'NPOP',
    certificationBody: 'Aditi Organic Certifications Pvt. Ltd.',
    scopeCertNumber: 'ORG/SC/2026/088',
    activeAnnualCycle: '2026 - 2027 (Current Cycle)',
    issueDate: '2026-04-01',
    expiryDate: '2027-03-31',
    yearWiseHistory: [
      { year: '2026 - 2027', certNumber: 'ORG/SC/2026/088', validFrom: '2026-04-01', validTo: '2027-03-31' }
    ],
    scopeVerifiedCrops: [
      'Large Cardamom',
      'Ginger',
      'Turmeric',
      'Black Pepper'
    ],
    docFileName: 'Aditi_Scope_Cert_2026.pdf',
    status: 'PENDING_SCOPE_VERIFICATION' as SellerStatus,
    submittedAt: '2026-08-19'
  },
  {
    id: 'SCOPE-2025-099',
    orgName: 'Yuksom Organic Farmers Collective',
    orgTradeName: 'Yuksom Organics',
    orgRefId: 'ORG-2026-110023',
    orgType: 'Cooperative Society',
    district: 'Gyalshing',
    state: 'Sikkim',
    pan: 'CDEFG3456H',
    gst: '11CDEFG3456H1Z3',
    fssai: '11419850000456 (State License)',
    apeda: 'N/A',
    representative: 'Dawa Sherpa (President)',
    email: 'contact@yuksomorganics.org',
    phone: '9733001122',
    address: 'Yuksom Bazaar, West Sikkim - 737113',
    warehouse: 'Yes (Cap: 800 Quintals)',
    processing: 'No',
    coldStorage: 'No',
    organicStorage: 'Yes',
    qcLab: 'None',

    certificationSystem: 'PGS-India',
    certificationBody: 'PGS-India Local Council Sikkim',
    scopeCertNumber: 'PGS/SC/2025/102',
    activeAnnualCycle: '2025 - 2026',
    issueDate: '2025-04-01',
    expiryDate: '2026-03-31',
    yearWiseHistory: [
      { year: '2025 - 2026', certNumber: 'PGS/SC/2025/102', validFrom: '2025-04-01', validTo: '2026-03-31' }
    ],
    scopeVerifiedCrops: [
      'Buckwheat',
      'Sikkim Mandarin',
      'Passion Fruit'
    ],
    docFileName: 'PGS_Scope_Certificate_2025.pdf',
    status: 'ACTIVE' as SellerStatus,
    submittedAt: '2026-08-10'
  }
];

const BuyerApprovals: React.FC = () => {
  const { sellerStatus, scopeCertData, orgData, approveSellerScope } = useOrganization();

  const [activeTab, setActiveTab] = useState<'All' | SellerStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Panels
  const [selectedInspection, setSelectedInspection] = useState<any | null>(null);
  const [selectedFullOrg, setSelectedFullOrg] = useState<any | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showOrgAccordion, setShowOrgAccordion] = useState(true);
  const [actionRemarks, setActionRemarks] = useState('');

  // Mobile View Tab state ('details' | 'document')
  const [mobileViewTab, setMobileViewTab] = useState<'details' | 'document'>('details');

  const scopeCertList = useMemo(() => {
    let list = [...MOCK_SCOPE_CERTS];
    if (scopeCertData && orgData) {
      const liveItem = {
        id: 'SCOPE-2026-LIVE',
        orgName: orgData.legalName,
        orgTradeName: orgData.tradeName,
        orgRefId: orgData.referenceId || 'ORG-2026-650195',
        orgType: orgData.organizationTypeId,
        district: orgData.districtId,
        state: orgData.stateId || 'Sikkim',
        pan: orgData.pan,
        gst: orgData.gstNumber,
        fssai: `${orgData.fssaiLicenseNumber} (${orgData.fssaiLicenseTypeId})`,
        apeda: orgData.apedaRcmcNumber || 'N/A',
        representative: `${orgData.representativeName} (${orgData.designation})`,
        email: orgData.organizationEmail,
        phone: orgData.organizationPhoneNumber,
        address: `${orgData.registeredAddress}, ${orgData.districtId} - ${orgData.pinCode}`,
        warehouse: `${orgData.warehouse} (Cap: ${orgData.totalStorageCapacity} ${orgData.storageCapacityUnitId})`,
        processing: `${orgData.processingFacility} (Cap: ${orgData.processingCapacity} ${orgData.processingCapacityUnitId})`,
        coldStorage: orgData.coldStorage,
        organicStorage: orgData.organicStorage,
        qcLab: orgData.qualityControlLaboratoryId,

        certificationSystem: scopeCertData.certificationSystem,
        certificationBody: scopeCertData.certificationBody,
        scopeCertNumber: scopeCertData.scopeCertNumber,
        activeAnnualCycle: scopeCertData.activeAnnualCycle,
        issueDate: scopeCertData.issueDate,
        expiryDate: scopeCertData.expiryDate,
        yearWiseHistory: scopeCertData.yearWiseHistory,
        scopeVerifiedCrops: scopeCertData.scopeVerifiedCrops,
        docFileName: scopeCertData.docFileName || 'Scope_Certificate.pdf',
        status: sellerStatus,
        submittedAt: '2026-08-19'
      };
      const existingIdx = list.findIndex(s => s.orgName === liveItem.orgName);
      if (existingIdx >= 0) {
        list[existingIdx] = liveItem as any;
      } else {
        list.unshift(liveItem as any);
      }
    }
    return list;
  }, [scopeCertData, sellerStatus, orgData]);

  const filteredScopes = useMemo(() => {
    return scopeCertList.filter(scope => {
      const matchesTab = activeTab === 'All' || scope.status === activeTab;
      const matchesSearch =
        scope.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scope.scopeCertNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scope.certificationBody.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [scopeCertList, activeTab, searchQuery]);

  const handleApproveScope = (scope: any) => {
    if (scope.orgName === orgData?.legalName || scope.id === 'SCOPE-2026-LIVE') {
      approveSellerScope();
    }
    toast.success(`Scope Certificate for ${scope.orgName} Approved! Produce selling privileges unlocked.`);
    setSelectedInspection(null);
  };

  const getStatusBadge = (status: SellerStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">Approved</span>;
      case 'PENDING_SCOPE_VERIFICATION':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">Pending</span>;
      case 'RETURNED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 whitespace-nowrap">Returned</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 whitespace-nowrap">{status}</span>;
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
            <h1 className="text-xl md:text-2xl font-bold">Scope Certificate Verification Center</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            SOFDA Verification of Submitted Organic Scope Certificates & Produce Listing Authorizations.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Pending Scope Verification: <strong>{scopeCertList.filter(s => s.status === 'PENDING_SCOPE_VERIFICATION').length} Submissions</strong></span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 border-b md:border-b-0 pb-2 md:pb-0 overflow-x-auto w-full md:w-auto">
          {(['All', 'PENDING_SCOPE_VERIFICATION', 'ACTIVE', 'RETURNED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'All' ? 'All Submissions' : tab.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Organization, Scope Cert No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider">
                <th className="p-4">Organization & Scope Cert</th>
                <th className="p-4">Certification Body</th>
                <th className="p-4">Annual Cycle & Dates</th>
                <th className="p-4">Authorized Organic Produces</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {filteredScopes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No Scope Certificate submissions found.
                  </td>
                </tr>
              ) : (
                filteredScopes.map((scope) => (
                  <tr key={scope.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        {scope.orgName}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                        Cert No: <strong>{scope.scopeCertNumber}</strong> ({scope.certificationSystem})
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedFullOrg(scope)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-md border border-slate-300 flex items-center gap-1"
                        >
                          <Building2 className="w-3 h-3 text-emerald-600" /> View Full Org Profile
                        </button>
                      </div>
                    </td>

                    <td className="p-4 text-gray-700 font-semibold">{scope.certificationBody}</td>

                    <td className="p-4 text-gray-700">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md text-[11px] mb-1">
                        <Calendar className="w-3 h-3" /> {scope.activeAnnualCycle}
                      </span>
                      <div className="text-[11px] text-gray-500">Valid: {scope.issueDate} to {scope.expiryDate}</div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {scope.scopeVerifiedCrops.slice(0, 4).map((crop: string) => (
                          <span key={crop} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                            ✓ {crop}
                          </span>
                        ))}
                        {scope.scopeVerifiedCrops.length > 4 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 font-bold text-[10px] rounded-full">
                            +{scope.scopeVerifiedCrops.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">{getStatusBadge(scope.status)}</td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedInspection(scope);
                          setMobileViewTab('details');
                        }}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 text-xs"
                      >
                        <ShieldCheck className="w-4 h-4" /> Verify Scope & Document
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL ORGANIZATION PROFILE MODAL */}
      {selectedFullOrg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden animate-fade-in my-8">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-xl font-bold">{selectedFullOrg.orgName}</h2>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Ref ID: {selectedFullOrg.orgRefId} | Trade: {selectedFullOrg.orgTradeName} | Type: {selectedFullOrg.orgType}
                </p>
              </div>
              <button onClick={() => setSelectedFullOrg(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Section 1 */}
              <div className="bg-white border rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" /> 1. Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-gray-500 block">Legal Name:</span><strong className="text-gray-900">{selectedFullOrg.orgName}</strong></div>
                  <div><span className="text-gray-500 block">Trade Name:</span><strong className="text-gray-900">{selectedFullOrg.orgTradeName}</strong></div>
                  <div><span className="text-gray-500 block">Organization Type:</span><strong className="text-gray-900">{selectedFullOrg.orgType}</strong></div>
                  <div><span className="text-gray-500 block">PAN:</span><strong className="font-mono text-gray-900">{selectedFullOrg.pan}</strong></div>
                  <div><span className="text-gray-500 block">GST Number:</span><strong className="font-mono text-gray-900">{selectedFullOrg.gst}</strong></div>
                  <div><span className="text-gray-500 block">Representative:</span><strong className="text-gray-900">{selectedFullOrg.representative}</strong></div>
                  <div><span className="text-gray-500 block">Email:</span><strong className="text-gray-900">{selectedFullOrg.email}</strong></div>
                  <div><span className="text-gray-500 block">Phone:</span><strong className="text-gray-900">{selectedFullOrg.phone}</strong></div>
                  <div className="col-span-2"><span className="text-gray-500 block">Registered Address:</span><strong className="text-gray-900">{selectedFullOrg.address}</strong></div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="bg-white border rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2. Statutory Compliances & Certifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-gray-500 block">FSSAI License:</span><strong className="text-gray-900">{selectedFullOrg.fssai}</strong></div>
                  <div><span className="text-gray-500 block">APEDA RCMC:</span><strong className="text-gray-900">{selectedFullOrg.apeda}</strong></div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="bg-white border rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-emerald-600" /> 3. Infrastructure & Facilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-gray-500 block">Warehouse:</span><strong className="text-gray-900">{selectedFullOrg.warehouse}</strong></div>
                  <div><span className="text-gray-500 block">Processing Facility:</span><strong className="text-gray-900">{selectedFullOrg.processing}</strong></div>
                  <div><span className="text-gray-500 block">Cold Storage:</span><strong className="text-gray-900">{selectedFullOrg.coldStorage}</strong></div>
                  <div><span className="text-gray-500 block">Organic Storage:</span><strong className="text-gray-900">{selectedFullOrg.organicStorage}</strong></div>
                  <div><span className="text-gray-500 block">QC Lab Setup:</span><strong className="text-gray-900">{selectedFullOrg.qcLab}</strong></div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="bg-white border rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" /> 4. Uploaded Verification Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border">
                    <span className="font-semibold text-gray-700">Organization Logo</span>
                    <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> Org_Logo.png
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border">
                    <span className="font-semibold text-gray-700">Scope Certificate</span>
                    <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> {selectedFullOrg.docFileName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border">
                    <span className="font-semibold text-gray-700">FSSAI License Document</span>
                    <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> FSSAI_License.pdf
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border">
                    <span className="font-semibold text-gray-700">APEDA RCMC Certificate</span>
                    <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> APEDA_RCMC.pdf
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button onClick={() => setSelectedFullOrg(null)} className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl">
                Close Full Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DUAL-PANE SCOPE CERTIFICATE INSPECTION CONSOLE WITH RESPONSIVE MOBILE TABBING */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
          <div className="bg-white rounded-none sm:rounded-2xl w-full max-w-[1500px] h-[100dvh] sm:h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-700 animate-fade-in">
            {/* Console Header */}
            <div className="bg-slate-900 text-white px-4 md:px-6 py-3.5 flex justify-between items-center border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 hidden sm:block">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base md:text-lg font-bold">{selectedInspection.orgName}</h2>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-xs font-bold rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" /> NPOP/PGS Scope
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                    Ref: {selectedInspection.orgRefId} | Cert: <strong className="text-white font-mono">{selectedInspection.scopeCertNumber}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInspection(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Segmented Tab Bar (Visible on mobile screens < 1024px) */}
            <div className="lg:hidden bg-slate-800 p-2 flex gap-2 border-b border-slate-700 shrink-0">
              <button
                onClick={() => setMobileViewTab('details')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  mobileViewTab === 'details'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" /> 📋 Scope & Org Details
              </button>
              <button
                onClick={() => setMobileViewTab('document')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  mobileViewTab === 'document'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> 📄 Certificate PDF Viewer
              </button>
            </div>

            {/* Split Dual-Pane Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100">
              {/* LEFT PANE: Scope Data & Full Org Accordion (5 Cols) */}
              <div
                className={`lg:col-span-5 p-4 sm:p-6 overflow-y-auto space-y-6 border-r border-slate-200 bg-white ${
                  mobileViewTab === 'details' ? 'block' : 'hidden lg:block'
                }`}
              >
                {/* Active Validity Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2 flex-wrap gap-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-700" /> Active Annual Cycle:
                    </span>
                    <span className="px-2.5 py-1 bg-amber-200 text-amber-900 font-bold rounded-md font-mono">
                      {selectedInspection.activeAnnualCycle}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-amber-900 font-medium">
                    <div>Issue Date: <strong className="font-mono">{selectedInspection.issueDate}</strong></div>
                    <div>Expiry Date: <strong className="font-mono">{selectedInspection.expiryDate}</strong></div>
                  </div>
                </div>

                {/* Authorized Produces Tags */}
                <div className="bg-emerald-50 border border-emerald-200 p-4 sm:p-5 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider border-b border-emerald-200 pb-2 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600" /> Scope Certified Organic Produces Authorized for Listing:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInspection.scopeVerifiedCrops.map((crop: string) => (
                      <span key={crop} className="px-3 py-1 bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Year-Wise History Table */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Year-Wise Scope Renewal Records</h4>
                  <div className="space-y-1.5 text-xs">
                    {selectedInspection.yearWiseHistory.map((h: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-white rounded-lg border text-slate-700 flex-wrap gap-1">
                        <span className="font-bold">{h.year}</span>
                        <span className="font-mono text-slate-600">{h.certNumber}</span>
                        <span className="text-[10px] text-gray-500">{h.validFrom} to {h.validTo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Organization Profile Accordion */}
                <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <button
                    onClick={() => setShowOrgAccordion(!showOrgAccordion)}
                    className="w-full p-4 bg-slate-900 text-white text-left font-bold text-xs flex justify-between items-center"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" /> Full Organization Profile Context (4 Sections)
                    </span>
                    {showOrgAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showOrgAccordion && (
                    <div className="p-4 space-y-4 text-xs bg-slate-50/50 max-h-80 overflow-y-auto">
                      <div className="bg-white p-3 rounded-lg border space-y-1">
                        <h5 className="font-bold text-slate-900 text-xs border-b pb-1">1. Business Information</h5>
                        <p className="text-gray-600">Legal Name: <strong>{selectedInspection.orgName}</strong></p>
                        <p className="text-gray-600">Trade Name: <strong>{selectedInspection.orgTradeName}</strong></p>
                        <p className="text-gray-600">Type: <strong>{selectedInspection.orgType}</strong></p>
                        <p className="text-gray-600 font-mono">PAN: {selectedInspection.pan} | GST: {selectedInspection.gst}</p>
                        <p className="text-gray-600">Rep: <strong>{selectedInspection.representative}</strong></p>
                        <p className="text-gray-600">Address: {selectedInspection.address}</p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border space-y-1">
                        <h5 className="font-bold text-slate-900 text-xs border-b pb-1">2. Statutory Compliances</h5>
                        <p className="text-gray-600">FSSAI: <strong>{selectedInspection.fssai}</strong></p>
                        <p className="text-gray-600">APEDA RCMC: <strong>{selectedInspection.apeda}</strong></p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border space-y-1">
                        <h5 className="font-bold text-slate-900 text-xs border-b pb-1">3. Infrastructure & Facilities</h5>
                        <p className="text-gray-600">Warehouse: <strong>{selectedInspection.warehouse}</strong></p>
                        <p className="text-gray-600">Processing: <strong>{selectedInspection.processing}</strong></p>
                        <p className="text-gray-600">Cold Storage: <strong>{selectedInspection.coldStorage}</strong> | Organic: <strong>{selectedInspection.organicStorage}</strong></p>
                        <p className="text-gray-600">QC Lab: <strong>{selectedInspection.qcLab}</strong></p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border space-y-1">
                        <h5 className="font-bold text-slate-900 text-xs border-b pb-1">4. Uploaded Verification Documents</h5>
                        <p className="text-gray-600 font-mono">Logo: Org_Logo.png</p>
                        <p className="text-gray-600 font-mono">Scope Cert: {selectedInspection.docFileName}</p>
                        <p className="text-gray-600 font-mono">FSSAI: FSSAI_License.pdf</p>
                        <p className="text-gray-600 font-mono">APEDA: APEDA_RCMC.pdf</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Inspection Remarks */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-gray-700">
                    SOFDA Inspection Notes & Feedback
                  </label>
                  <textarea
                    rows={2}
                    value={actionRemarks}
                    onChange={(e) => setActionRemarks(e.target.value)}
                    placeholder="Enter inspection feedback or reasons if returning..."
                    className="w-full p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* RIGHT PANE: Interactive Live PDF Document Viewer Canvas (7 Cols) */}
              <div
                className={`lg:col-span-7 p-4 sm:p-6 bg-slate-900 flex-col justify-between overflow-hidden ${
                  mobileViewTab === 'document' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Document Viewer Toolbar */}
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex justify-between items-center text-xs text-slate-200 shrink-0 mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-white truncate max-w-[160px] sm:max-w-none">{selectedInspection.docFileName}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">
                      ✓ Seal Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                      <button onClick={() => setZoomLevel(Math.max(75, zoomLevel - 15))} className="p-1 hover:text-white">
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-[11px]">{zoomLevel}%</span>
                      <button onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))} className="p-1 hover:text-white">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => toast.success(`Downloading ${selectedInspection.docFileName}...`)}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Simulated High-Fidelity PDF Document Rendering Window */}
                <div className="flex-1 overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 p-3 sm:p-6 flex justify-center items-start shadow-inner">
                  <div
                    className="bg-white text-slate-900 p-4 sm:p-8 rounded-lg shadow-2xl w-full max-w-2xl space-y-6 transition-all duration-200 border border-slate-300 font-serif"
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  >
                    {/* Govt Header */}
                    <div className="text-center space-y-1 border-b-2 border-emerald-800 pb-4">
                      <div className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-emerald-900 font-sans">
                        GOVERNMENT OF SIKKIM • DEPARTMENT OF AGRICULTURE
                      </div>
                      <h2 className="text-sm sm:text-lg font-bold uppercase tracking-wide text-slate-900">
                        SIKKIM STATE ORGANIC CERTIFICATION AGENCY (SSOCA)
                      </h2>
                      <div className="text-[10px] sm:text-[11px] italic text-slate-600 font-sans">
                        NPOP Accredited Certification Body (Accreditation No: NPOP/NAB/0018)
                      </div>
                      <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-[10px] sm:text-xs rounded-full font-sans uppercase tracking-wider mt-2 border border-emerald-300">
                        OFFICIAL SCOPE CERTIFICATE
                      </div>
                    </div>

                    {/* Cert Body details */}
                    <div className="grid grid-cols-2 text-[10px] sm:text-[11px] border-b pb-3 font-sans gap-2">
                      <div>
                        <span className="text-slate-500 block">Certificate Registration No:</span>
                        <strong className="text-slate-900 font-mono">{selectedInspection.scopeCertNumber}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block">Validity Period:</span>
                        <strong className="text-slate-900 font-mono">{selectedInspection.issueDate} to {selectedInspection.expiryDate}</strong>
                      </div>
                    </div>

                    {/* Entity Info */}
                    <div className="space-y-2 text-[11px] sm:text-xs font-sans">
                      <p className="leading-relaxed">
                        This is to certify that the agricultural producing entity <strong>{selectedInspection.orgName}</strong> ({selectedInspection.orgTradeName}), located at <em>{selectedInspection.address}</em>, has been inspected and verified compliant under National Programme for Organic Production (NPOP).
                      </p>
                    </div>

                    {/* Certified Crop Schedule */}
                    <div className="space-y-2 pt-2 font-sans">
                      <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase border-b pb-1">
                        Schedule of Certified Organic Produces:
                      </h4>
                      <table className="w-full text-[10px] sm:text-[11px] border text-left">
                        <thead>
                          <tr className="bg-slate-100 border-b font-bold">
                            <th className="p-2">Crop Name</th>
                            <th className="p-2">Category</th>
                            <th className="p-2">Organic Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedInspection.scopeVerifiedCrops.map((crop: string, idx: number) => (
                            <tr key={idx}>
                              <td className="p-2 font-semibold">{crop}</td>
                              <td className="p-2 text-slate-600">Organic Spices / Horticulture</td>
                              <td className="p-2 text-emerald-700 font-bold">Certified Organic (NPOP)</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Official Seal & Signature */}
                    <div className="pt-6 border-t flex justify-between items-end font-sans">
                      <div className="text-center">
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-700 flex items-center justify-center text-[8px] font-bold text-emerald-950 p-1 mx-auto bg-emerald-50/50">
                          SSOCA OFFICIAL SEAL
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-serif italic text-xs sm:text-sm text-slate-800">Tashi Gyatso</div>
                        <div className="text-[9px] sm:text-[10px] font-bold text-slate-900">Authorized Certifying Officer</div>
                        <div className="text-[8px] sm:text-[9px] text-slate-500">SSOCA, Gangtok, Sikkim</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Console Footer Bar (Mobile responsive flex column / row) */}
            <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => setSelectedInspection(null)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg text-center"
              >
                Cancel Inspection
              </button>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    toast.success('Scope certificate returned for information update.');
                    setSelectedInspection(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Return for Info
                </button>
                <button
                  onClick={() => {
                    toast.error('Scope certificate rejected.');
                    setSelectedInspection(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Reject Scope
                </button>
                <button
                  onClick={() => handleApproveScope(selectedInspection)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Approve Scope Certificate & Unlock Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerApprovals;
