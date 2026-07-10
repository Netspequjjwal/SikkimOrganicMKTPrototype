import React, { useState, useMemo } from 'react';
import { useYieldSurvey } from '../../../context/YieldSurveyContext';
import type { YieldSurvey, SurveyStatus } from '../../../context/YieldSurveyContext';
import { Search, Filter, Eye, FileText, CheckCircle, XCircle, Clock, ArrowLeft, Download, AlertCircle, BarChart2 } from 'lucide-react';
import clsx from 'clsx';

const ICSProductListing: React.FC = () => {
  const { surveys, updateSurveyStatus } = useYieldSurvey();
  const [activeTab, setActiveTab] = useState<SurveyStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedSurvey, setSelectedSurvey] = useState<YieldSurvey | null>(null);
  const [actionRemarks, setActionRemarks] = useState('');
  const [actionError, setActionError] = useState('');

  const filteredSurveys = useMemo(() => {
    return surveys.filter(s => {
      const matchesTab = activeTab === 'All' || s.status === activeTab;
      const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.serviceProviderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.crop.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [surveys, activeTab, searchQuery]);

  const handleAction = (status: SurveyStatus) => {
    if ((status === 'Returned' || status === 'Rejected') && !actionRemarks.trim()) {
      setActionError(`Remarks are mandatory when ${status === 'Returned' ? 'returning' : 'rejecting'} a survey.`);
      return;
    }
    if (selectedSurvey) {
      updateSurveyStatus(selectedSurvey.id, status, actionRemarks);
      setSelectedSurvey(null);
      setActionRemarks('');
      setActionError('');
    }
  };

  const getStatusBadge = (status: SurveyStatus) => {
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
      {/* Detail Review Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 px-4 py-8">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Survey Review: {selectedSurvey.id}</h2>
                <p className="text-sm text-gray-500">Submitted by {selectedSurvey.serviceProviderName} on {new Date(selectedSurvey.submittedAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => { setSelectedSurvey(null); setActionRemarks(''); setActionError(''); }} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Details & Actions */}
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Metadata</h3>
                  <div className="space-y-3">
                    <div><span className="text-sm text-gray-500 block">Season / Year</span><span className="text-sm font-bold text-gray-900">{selectedSurvey.season} {selectedSurvey.year}</span></div>
                    <div><span className="text-sm text-gray-500 block">Phase</span><span className="text-sm font-medium text-gray-900">{selectedSurvey.phase}</span></div>
                    <div><span className="text-sm text-gray-500 block">Crop</span><span className="text-sm font-medium text-gray-900">{selectedSurvey.crop}</span></div>
                    <div><span className="text-sm text-gray-500 block">Grower Groups</span><span className="text-sm font-medium text-gray-900">{selectedSurvey.growerGroups.join(', ')}</span></div>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Uploaded Certificate</h3>
                  <div className="border border-green-200 bg-green-50 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="w-6 h-6 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedSurvey.certFileName}</p>
                        <p className="text-xs text-green-700 font-medium">Valid Certificate</p>
                      </div>
                    </div>
                    <button className="text-primary hover:text-primary-dark"><Download className="w-5 h-5" /></button>
                  </div>
                </div>

                {selectedSurvey.remarks && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Previous Remarks</h4>
                    <p className="text-sm text-blue-800">{selectedSurvey.remarks}</p>
                  </div>
                )}

                {selectedSurvey.status === 'Pending' && (
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">SOFDA Decision</h3>
                    <textarea 
                      className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2 mb-3 border focus:ring-primary focus:border-primary bg-gray-50"
                      rows={3} 
                      placeholder="Enter official remarks (Mandatory for Return/Reject)"
                      value={actionRemarks}
                      onChange={(e) => { setActionRemarks(e.target.value); setActionError(''); }}
                    />
                    {actionError && <p className="text-xs text-red-600 mb-3 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{actionError}</p>}
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleAction('Approved')} className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">Approve Survey</button>
                      <button onClick={() => handleAction('Returned')} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">Return for Correction</button>
                      <button onClick={() => handleAction('Rejected')} className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">Reject Survey</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Data Grid & Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4"><FileText className="w-6 h-6 text-blue-600" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Farmers</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedSurvey.farmerCount}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg mr-4"><BarChart2 className="w-6 h-6 text-green-600" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Area</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedSurvey.totalArea} Ha</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4"><CheckCircle className="w-6 h-6 text-purple-600" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Yield</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedSurvey.totalYield.toFixed(1)} MT</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
                  <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900">Extracted Farmer Data</h3>
                    <button className="text-sm text-primary font-medium hover:underline flex items-center">
                      <Download className="w-4 h-4 mr-1"/> Export Excel
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-white sticky top-0 shadow-sm">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Farmer ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Village</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Area (Ha)</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Yield (MT)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedSurvey.excelData.map((row: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{row.farmerId || row.id}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{row.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.village}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{row.area || row.cropArea}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">{row.yield || (selectedSurvey.phase.includes('1') ? row.estYield : row.actYield)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4, mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ICS Product Listing (SOFDA)</h1>
          <p className="text-gray-500 text-sm mt-1">Review and approve seasonal crop yield data submitted by ICS Providers.</p>
        </div>
        <button className="bg-white border border-gray-300 shadow-sm text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0">
            {(['All', 'Pending', 'Approved', 'Returned', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors',
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-sm' 
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
              placeholder="Search ID, Provider, Crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full sm:w-72 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ref ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Provider / Crop</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phase</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Yield</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSurveys.length > 0 ? (
                filteredSurveys.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{s.id}</div>
                      <div className="text-xs text-gray-500">{new Date(s.submittedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{s.serviceProviderName}</div>
                      <div className="text-xs text-primary font-semibold">{s.crop} ({s.season} {s.year})</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {s.phase.split(' - ')[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{s.totalYield.toFixed(1)} MT</div>
                      <div className="text-xs text-gray-500">{s.farmerCount} farmers</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(s.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => setSelectedSurvey(s)}
                        className="text-primary hover:text-primary-dark bg-green-50 px-3 py-1.5 rounded-md flex items-center transition-colors border border-green-100"
                      >
                        <Eye className="w-4 h-4 mr-1" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    No yield surveys found matching your criteria.
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

export default ICSProductListing;
