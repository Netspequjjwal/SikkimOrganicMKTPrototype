import React, { useState, useMemo } from 'react';
import { useServiceProvider } from '../../context/ServiceProviderContext';
import type { ServiceProviderRegistration, ApplicationStatus } from '../../context/ServiceProviderContext';
import { Search, Filter, Eye, FileText, CheckCircle, XCircle, Clock, ArrowLeft, Download, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const ServiceProviderApprovals: React.FC = () => {
  const { applications, updateApplicationStatus } = useServiceProvider();
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedApp, setSelectedApp] = useState<ServiceProviderRegistration | null>(null);
  const [actionRemarks, setActionRemarks] = useState('');
  const [actionError, setActionError] = useState('');

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesTab = activeTab === 'All' || app.status === activeTab;
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [applications, activeTab, searchQuery]);

  const handleAction = (status: ApplicationStatus) => {
    if ((status === 'Returned' || status === 'Rejected') && !actionRemarks.trim()) {
      setActionError(`Remarks are mandatory when ${status === 'Returned' ? 'returning' : 'rejecting'} an application.`);
      return;
    }
    if (selectedApp) {
      updateApplicationStatus(selectedApp.id, status, actionRemarks);
      setSelectedApp(null);
      setActionRemarks('');
      setActionError('');
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
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
                    <div><span className="text-sm text-gray-500 block">Name</span><span className="text-sm font-medium text-gray-900">{selectedApp.name}</span></div>
                    <div><span className="text-sm text-gray-500 block">Owner/Rep</span><span className="text-sm font-medium text-gray-900">{selectedApp.ownerName}</span></div>
                    <div><span className="text-sm text-gray-500 block">Contact</span><span className="text-sm font-medium text-gray-900">{selectedApp.mobile} {selectedApp.altMobile ? `/ ${selectedApp.altMobile}` : ''}</span></div>
                    <div><span className="text-sm text-gray-500 block">Email</span><span className="text-sm font-medium text-gray-900">{selectedApp.email || 'N/A'}</span></div>
                    <div><span className="text-sm text-gray-500 block">Office Address</span><span className="text-sm font-medium text-gray-900">{selectedApp.address}</span></div>
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
                          <p className="text-sm font-medium text-gray-900">SP License</p>
                          <p className="text-xs text-gray-500">{selectedApp.licenseFileName || 'Not uploaded'}</p>
                        </div>
                      </div>
                      <button className="text-primary hover:text-primary-dark"><Download className="w-4 h-4" /></button>
                    </div>
                    {selectedApp.additionalDocFileName && (
                      <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{selectedApp.additionalDocName || 'Additional Doc'}</p>
                            <p className="text-xs text-gray-500">{selectedApp.additionalDocFileName}</p>
                          </div>
                        </div>
                        <button className="text-primary hover:text-primary-dark"><Download className="w-4 h-4" /></button>
                      </div>
                    )}
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
                      <button onClick={() => handleAction('Returned')} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Return for Correction</button>
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
          <h1 className="text-2xl font-bold text-gray-900">Service Provider Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage ICS Provider registrations.</p>
        </div>
        <button className="bg-white border border-gray-300 shadow-sm text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex space-x-1 overflow-x-auto">
            {(['All', 'Pending', 'Approved', 'Returned', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors',
                  activeTab === tab 
                    ? 'bg-primary text-white' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search ID, Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ref ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SP Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{app.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{app.name}</div>
                      <div className="text-xs text-gray-500">{app.ownerName} • {app.mobile}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="text-primary hover:text-primary-dark bg-green-50 px-3 py-1.5 rounded-md flex items-center transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination Mock */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredApps.length}</span> of <span className="font-medium">{filteredApps.length}</span> results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderApprovals;
