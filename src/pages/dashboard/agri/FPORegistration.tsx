import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, FileText, CheckCircle, XCircle, Clock, ArrowLeft, Download, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

type FPOStatus = 'Pending' | 'Approved' | 'Returned' | 'Rejected';

interface FPORegistrationData {
  id: string;
  fpoName: string;
  registrationNo: string;
  district: string;
  contactPerson: string;
  mobile: string;
  email: string;
  noOfFarmers: number;
  totalAreaHa: number;
  primaryCrops: string[];
  status: FPOStatus;
  submittedAt: string;
  remarks?: string;
  docFileName?: string;
}

const mockData: FPORegistrationData[] = [
  {
    id: 'FPO-REQ-2026-001',
    fpoName: 'Sikkim Organic Farmers Cooperative',
    registrationNo: 'REG-SKM-FPO-001',
    district: 'East Sikkim',
    contactPerson: 'Karma Bhutia',
    mobile: '+91 98765 43210',
    email: 'contact@sikkimorganicfpo.com',
    noOfFarmers: 150,
    totalAreaHa: 500.5,
    primaryCrops: ['Large Cardamom', 'Ginger'],
    status: 'Pending',
    submittedAt: '2026-07-08T10:00:00Z',
    docFileName: 'fpo_registration_cert.pdf'
  },
  {
    id: 'FPO-REQ-2026-002',
    fpoName: 'North District Organic Cooperative',
    registrationNo: 'REG-SKM-FPO-002',
    district: 'North Sikkim',
    contactPerson: 'Tenzing Lepcha',
    mobile: '+91 98765 43211',
    email: 'info@northorganic.in',
    noOfFarmers: 220,
    totalAreaHa: 750.0,
    primaryCrops: ['Turmeric', 'Buckwheat'],
    status: 'Approved',
    submittedAt: '2026-07-01T10:00:00Z',
    docFileName: 'cooperative_license_2026.pdf'
  },
  {
    id: 'FPO-REQ-2026-003',
    fpoName: 'South Sikkim Spices FPO',
    registrationNo: 'REG-SKM-FPO-003',
    district: 'South Sikkim',
    contactPerson: 'Sonam Sherpa',
    mobile: '+91 98765 43212',
    email: 'admin@southspices.in',
    noOfFarmers: 85,
    totalAreaHa: 200.2,
    primaryCrops: ['Large Cardamom', 'Turmeric'],
    status: 'Returned',
    submittedAt: '2026-07-05T10:00:00Z',
    docFileName: 'registration_doc_v1.pdf',
    remarks: 'Please re-upload a clearer copy of the registration certificate. The current document is illegible.'
  }
];

const FPORegistration: React.FC = () => {
  const [applications, setApplications] = useState<FPORegistrationData[]>(mockData);
  const [activeTab, setActiveTab] = useState<FPOStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedApp, setSelectedApp] = useState<FPORegistrationData | null>(null);
  const [actionRemarks, setActionRemarks] = useState('');
  const [actionError, setActionError] = useState('');

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesTab = activeTab === 'All' || app.status === activeTab;
      const matchesSearch = app.fpoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.registrationNo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [applications, activeTab, searchQuery]);

  const handleAction = (status: FPOStatus) => {
    if ((status === 'Returned' || status === 'Rejected') && !actionRemarks.trim()) {
      setActionError(`Remarks are mandatory when ${status === 'Returned' ? 'returning' : 'rejecting'} an application.`);
      return;
    }
    if (selectedApp) {
      setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status, remarks: actionRemarks } : a));
      toast.success(`Application marked as ${status}`);
      setSelectedApp(null);
      setActionRemarks('');
      setActionError('');
    }
  };

  const getStatusBadge = (status: FPOStatus) => {
    switch (status) {
      case 'Approved': return <span className="px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> Approved</span>;
      case 'Pending': return <span className="px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1"/> Pending</span>;
      case 'Returned': return <span className="px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800"><ArrowLeft className="w-3 h-3 mr-1"/> Returned</span>;
      case 'Rejected': return <span className="px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1"/> Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-4">
      {/* Detail Modal / Side Panel */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Application Review: {selectedApp.id}</h2>
                <p className="text-sm text-gray-500">Submitted on {new Date(selectedApp.submittedAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => { setSelectedApp(null); setActionRemarks(''); setActionError(''); }} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 border-b pb-1">Organization Details</h3>
                  <div className="space-y-3">
                    <div><span className="text-sm text-gray-500 block">FPO Name</span><span className="text-sm font-medium text-gray-900">{selectedApp.fpoName}</span></div>
                    <div><span className="text-sm text-gray-500 block">Registration No.</span><span className="text-sm font-medium text-gray-900">{selectedApp.registrationNo}</span></div>
                    <div><span className="text-sm text-gray-500 block">District</span><span className="text-sm font-medium text-gray-900">{selectedApp.district}</span></div>
                    <div><span className="text-sm text-gray-500 block">Contact Person</span><span className="text-sm font-medium text-gray-900">{selectedApp.contactPerson}</span></div>
                    <div><span className="text-sm text-gray-500 block">Contact Info</span><span className="text-sm font-medium text-gray-900">{selectedApp.mobile} <br/> {selectedApp.email}</span></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 border-b pb-1">FPO Statistics</h3>
                  <div className="space-y-3 grid grid-cols-2 gap-4">
                    <div><span className="text-sm text-gray-500 block">Total Farmers</span><span className="text-sm font-medium text-gray-900">{selectedApp.noOfFarmers}</span></div>
                    <div><span className="text-sm text-gray-500 block">Total Area</span><span className="text-sm font-medium text-gray-900">{selectedApp.totalAreaHa} Ha</span></div>
                    <div className="col-span-2"><span className="text-sm text-gray-500 block">Primary Crops</span><span className="text-sm font-medium text-gray-900">{selectedApp.primaryCrops.join(', ')}</span></div>
                  </div>
                </div>

                {selectedApp.remarks && (
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Previous Remarks</h4>
                    <p className="text-sm text-blue-800">{selectedApp.remarks}</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 border-b pb-1">Documents</h3>
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-center bg-gray-50">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-red-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">FPO Registration Certificate</p>
                          <p className="text-xs text-gray-500">{selectedApp.docFileName || 'Not uploaded'}</p>
                        </div>
                      </div>
                      <button className="text-primary hover:text-primary-dark"><Download className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>

                {selectedApp.status === 'Pending' && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Review Action</h3>
                    <textarea 
                      className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2 mb-3 border focus:ring-primary focus:border-primary"
                      rows={3} 
                      placeholder="Enter remarks (Mandatory for Return/Reject)"
                      value={actionRemarks}
                      onChange={(e) => { setActionRemarks(e.target.value); setActionError(''); }}
                    />
                    {actionError && <p className="text-xs text-red-600 mb-3 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{actionError}</p>}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button onClick={() => handleAction('Approved')} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Approve</button>
                      <button onClick={() => handleAction('Returned')} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Return</button>
                      <button onClick={() => handleAction('Rejected')} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Reject</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Page */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FPO Registrations</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve Farmer Producer Organization registrations.</p>
        </div>
        <button className="bg-white border border-gray-300 shadow-sm text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center">
          <Download className="w-4 h-4 mr-2" /> Export
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50">
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {['All', 'Pending', 'Approved', 'Returned', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status as FPOStatus | 'All')}
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === status 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                )}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, FPO, Reg No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ref ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">FPO / District</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Farmers / Area</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApps.length > 0 ? filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{app.id}</div>
                    <div className="text-xs text-gray-500">{new Date(app.submittedAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{app.fpoName}</div>
                    <div className="text-xs text-gray-500">{app.district} • {app.registrationNo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{app.noOfFarmers} Farmers</div>
                    <div className="text-xs text-gray-500">{app.totalAreaHa} Ha</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedApp(app)}
                      className="inline-flex items-center text-primary hover:text-primary-dark bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1.5" /> Review
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No applications found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FPORegistration;
