import React, { useState, useMemo } from 'react';
import { useSellerRegistration, SellerRegistration, ApplicationStatus, SellerType } from '../../context/SellerRegistrationContext';
import { Search, Filter, Eye, FileText, CheckCircle, XCircle, Clock, ArrowLeft, Download, AlertCircle, Building2, Truck, Users } from 'lucide-react';
import clsx from 'clsx';

const SellerApprovals: React.FC = () => {
  const { applications, updateApplicationStatus } = useSellerRegistration();
  
  // Filters
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSellerType, setFilterSellerType] = useState<SellerType | 'All'>('All');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterExportReady, setFilterExportReady] = useState<boolean | 'All'>('All');
  
  const [selectedApp, setSelectedApp] = useState<SellerRegistration | null>(null);
  const [actionRemarks, setActionRemarks] = useState('');
  const [actionError, setActionError] = useState('');

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesTab = activeTab === 'All' || app.status === activeTab;
      const matchesSearch = 
        app.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.authorizedRep.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterSellerType === 'All' || app.sellerType === filterSellerType;
      const matchesDistrict = filterDistrict === 'All' || app.district === filterDistrict;
      const matchesExport = filterExportReady === 'All' || app.isExporting === filterExportReady;
      
      return matchesTab && matchesSearch && matchesType && matchesDistrict && matchesExport;
    });
  }, [applications, activeTab, searchQuery, filterSellerType, filterDistrict, filterExportReady]);

  const handleAction = (status: ApplicationStatus | 'Activate') => {
    if ((status === 'Returned' || status === 'Rejected' || status === 'Suspended') && !actionRemarks.trim()) {
      setActionError(`Remarks are mandatory when changing status to ${status}.`);
      return;
    }
    if (selectedApp) {
      let badges: string[] = [];
      if (status === 'Approved' || status === 'Activate') {
        badges.push('Government Approved Seller');
        if (selectedApp.certificationSystem === 'NPOP') badges.push('NPOP Certified');
        if (selectedApp.certificationSystem === 'PGS') badges.push('PGS Certified');
        if (selectedApp.isExporting) badges.push('Export Ready');
        if (selectedApp.fssaiLicenseNumber) badges.push('FSSAI Licensed');
        if (selectedApp.jaivikBharatNumber) badges.push('Jaivik Bharat Compliant');
      }
      
      const newStatus = status === 'Activate' ? 'Approved' : status;
      updateApplicationStatus(selectedApp.id, newStatus, actionRemarks, badges.length > 0 ? badges : undefined);
      setSelectedApp(null);
      setActionRemarks('');
      setActionError('');
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Approved': return <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-semibold rounded-full bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> Approved</span>;
      case 'Pending': return <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1"/> Pending</span>;
      case 'Returned': return <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-semibold rounded-full bg-orange-100 text-orange-800"><ArrowLeft className="w-3 h-3 mr-1"/> Returned</span>;
      case 'Rejected': return <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-semibold rounded-full bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1"/> Rejected</span>;
      case 'Suspended': return <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-semibold rounded-full bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1"/> Suspended</span>;
      default: return null;
    }
  };

  const getSellerIcon = (type: string) => {
    if (type === 'ICS' || type === 'ICS Service Provider') return <Building2 className="w-4 h-4 mr-1 text-blue-500" />;
    if (type === 'Individual Farmer') return <Users className="w-4 h-4 mr-1 text-green-500" />;
    return <Truck className="w-4 h-4 mr-1 text-purple-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto py-4">
      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  Application Review: {selectedApp.id} 
                  <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">{selectedApp.sellerType}</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">Submitted on {new Date(selectedApp.submittedAt).toLocaleString()}</p>
              </div>
              <button onClick={() => { setSelectedApp(null); setActionRemarks(''); setActionError(''); }} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Org Details */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-2">1. Organization Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-xs text-gray-500 block uppercase">Legal Name</span><span className="text-sm font-medium text-gray-900">{selectedApp.legalName}</span></div>
                    <div><span className="text-xs text-gray-500 block uppercase">Org Type</span><span className="text-sm font-medium text-gray-900">{selectedApp.orgType || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500 block uppercase">Authorized Rep</span><span className="text-sm font-medium text-gray-900">{selectedApp.authorizedRep} ({selectedApp.designation})</span></div>
                    <div><span className="text-xs text-gray-500 block uppercase">Contact</span><span className="text-sm font-medium text-gray-900">{selectedApp.mobile}</span></div>
                    <div className="col-span-2"><span className="text-xs text-gray-500 block uppercase">Registered Address</span><span className="text-sm font-medium text-gray-900">{selectedApp.registeredAddress}, {selectedApp.district}, {selectedApp.state} - {selectedApp.pinCode}</span></div>
                  </div>
                </div>

                {/* 2. Business Compliance */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-2">2. Business & Organic Compliance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <span className="text-xs text-gray-500 block uppercase mb-1">Business Activities</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.businessActivities?.map(act => (
                          <span key={act} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">{act}</span>
                        ))}
                      </div>
                    </div>
                    <div><span className="text-xs text-gray-500 block uppercase">Certification System</span><span className="text-sm font-medium text-gray-900">{selectedApp.certificationSystem || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500 block uppercase">Scope Cert No</span><span className="text-sm font-medium text-gray-900">{selectedApp.scopeCertNumber || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500 block uppercase">No of Farmers</span><span className="text-sm font-medium text-gray-900">{selectedApp.noOfFarmers || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500 block uppercase">Cultivated Area (Ha)</span><span className="text-sm font-medium text-gray-900">{selectedApp.cultivatedArea || 'N/A'}</span></div>
                  </div>
                </div>

                {/* 3. Statutory & Export */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-2">3. Statutory & Export Compliance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-xs text-gray-500 block uppercase">GSTIN</span><span className="text-sm font-medium text-gray-900">{selectedApp.gstin || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500 block uppercase">FSSAI License</span><span className="text-sm font-medium text-gray-900">{selectedApp.fssaiLicenseNumber || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500 block uppercase">Export Ready</span><span className="text-sm font-medium text-gray-900">{selectedApp.isExporting ? 'Yes' : 'No'}</span></div>
                    {selectedApp.isExporting && (
                      <>
                        <div><span className="text-xs text-gray-500 block uppercase">IEC</span><span className="text-sm font-medium text-gray-900">{selectedApp.iec}</span></div>
                        <div><span className="text-xs text-gray-500 block uppercase">APEDA RCMC</span><span className="text-sm font-medium text-gray-900">{selectedApp.apedaRcmc}</span></div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar: Documents & Actions */}
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-2">Uploaded Documents</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Scope Certificate', file: selectedApp.scopeCertFileName },
                      { name: 'FSSAI License', file: selectedApp.fssaiFileName },
                      { name: 'Organization Logo', file: selectedApp.logoFileName },
                    ].filter(d => d.file).map((doc, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-md p-2 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center overflow-hidden">
                          <FileText className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-gray-900">{doc.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{doc.file}</p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                    {!selectedApp.scopeCertFileName && !selectedApp.fssaiFileName && (
                       <p className="text-xs text-gray-500 italic">No documents uploaded.</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-200 pb-2">Review Action</h3>
                  
                  {selectedApp.remarks && (
                    <div className="mb-4 bg-yellow-50 p-3 rounded border border-yellow-100">
                      <p className="text-xs font-bold text-yellow-800 uppercase">Previous Remarks</p>
                      <p className="text-sm text-yellow-900 mt-1">{selectedApp.remarks}</p>
                    </div>
                  )}

                  <textarea 
                    className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2.5 mb-3 border focus:ring-primary focus:border-primary"
                    rows={3} 
                    placeholder="Enter review remarks (Mandatory for Return/Reject/Suspend)"
                    value={actionRemarks}
                    onChange={(e) => { setActionRemarks(e.target.value); setActionError(''); }}
                  />
                  {actionError && <p className="text-xs text-red-600 mb-3 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{actionError}</p>}
                  
                  <div className="flex flex-col gap-2">
                    {selectedApp.status === 'Pending' || selectedApp.status === 'Returned' ? (
                      <>
                        <button onClick={() => handleAction('Approved')} className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-bold transition-colors">Approve Registration</button>
                        <button onClick={() => handleAction('Returned')} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-bold transition-colors">Return for Correction</button>
                        <button onClick={() => handleAction('Rejected')} className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-bold transition-colors">Reject Application</button>
                      </>
                    ) : selectedApp.status === 'Approved' ? (
                      <button onClick={() => handleAction('Suspended')} className="w-full bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-bold transition-colors">Suspend Seller</button>
                    ) : selectedApp.status === 'Suspended' ? (
                      <button onClick={() => handleAction('Activate')} className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-bold transition-colors">Re-Activate Seller</button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Registration Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review unified applications from ICS, Individual Farmers, and IFFCO.</p>
        </div>
        <button className="bg-white border border-gray-300 shadow-sm text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 space-y-4">
          <div className="flex space-x-1 overflow-x-auto pb-2 border-b border-gray-200">
            {(['All', 'Pending', 'Approved', 'Returned', 'Rejected', 'Suspended'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'px-4 py-2 text-sm font-bold rounded-md whitespace-nowrap transition-colors',
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search ID, Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            
            <select value={filterSellerType} onChange={e => setFilterSellerType(e.target.value as any)} className="block w-full py-2 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm">
              <option value="All">All Seller Types</option>
              <option value="ICS">ICS</option>
              <option value="Individual Farmer">Individual Farmer</option>
              <option value="IFFCO">IFFCO</option>
            </select>
            
            <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm">
              <option value="All">All Districts</option>
              <option value="Gangtok">Gangtok</option>
              <option value="Namchi">Namchi</option>
              <option value="Pakyong">Pakyong</option>
              <option value="Gyalshing">Gyalshing</option>
            </select>
            
            <select value={filterExportReady.toString()} onChange={e => setFilterExportReady(e.target.value === 'All' ? 'All' : e.target.value === 'true')} className="block w-full py-2 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm">
              <option value="All">Export Status: All</option>
              <option value="true">Export Ready Only</option>
              <option value="false">Domestic Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ref ID & Details</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Compliance Summary</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{app.id}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">{getSellerIcon(app.sellerType)} {app.sellerType}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{new Date(app.submittedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{app.legalName}</div>
                      <div className="text-xs text-gray-500">{app.district}, {app.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-700">{app.certificationSystem || 'Uncertified'}</span>
                        {app.isExporting ? <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded w-max font-bold">Export Ready</span> : <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded w-max font-medium">Domestic</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="text-primary hover:text-primary-dark bg-primary/10 px-3 py-2 rounded-md inline-flex items-center font-bold transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    No applications found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-bold">{filteredApps.length > 0 ? 1 : 0}</span> to <span className="font-bold">{filteredApps.length}</span> of <span className="font-bold">{filteredApps.length}</span> applications
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerApprovals;
