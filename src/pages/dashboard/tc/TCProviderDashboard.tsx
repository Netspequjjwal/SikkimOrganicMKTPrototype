import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTC } from '../../../context/TCContext';
import { useAuth } from '../../../context/AuthContext';
import { ShieldCheck, Search, Filter, FileText, ChevronRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function TCProviderDashboard() {
  const { requests, activeCertificates } = useTC();
  const { user } = useAuth();
  const navigate = useNavigate();

  // For demo purposes, we show all requests. In production, filter by providerId === user.id
  const myRequests = requests; 
  const [filter, setFilter] = useState('All');

  const filteredRequests = myRequests.filter(r => filter === 'All' || r.status === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" /> TC Requests Dashboard
            </h1>
            <p className="text-gray-500">Manage incoming Transaction Certificate requests and active licenses.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Pending Review</div>
              <div className="text-2xl font-bold text-blue-900">{myRequests.filter(r => r.status === 'Pending').length}</div>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Active Licenses</div>
              <div className="text-2xl font-bold text-green-900">{activeCertificates.length}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by Request ID or FPO Name..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary bg-white shadow-sm"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Proposal Ready">Proposal Ready</option>
              <option value="Payment Pending">Payment Pending</option>
              <option value="Accepted">Accepted (Active)</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Request ID</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">FPO Name</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Requested Crops</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Qty / Period</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{req.id}</div>
                    <div className="text-xs text-gray-500">{new Date(req.requestDate).toLocaleDateString()}</div>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">{req.fpoName}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{req.crops.join(', ')}</td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{req.expectedQty} MT</div>
                    <div className="text-xs text-gray-500">{req.usagePeriod} Months</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                      ${req.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                        req.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                        req.status === 'Proposal Ready' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        req.status === 'Payment Pending' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {req.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                      {req.status === 'Accepted' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => navigate(`/dashboard/tc/requests/${req.id}`)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-300 mb-3" />
                      <p>No requests found in this category.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
