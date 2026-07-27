import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTC } from '../../../context/TCContext';
import { useAuth } from '../../../context/AuthContext';
import { ShieldCheck, Search, Filter, FileText, ChevronRight, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export default function TCProviderDashboard() {
  const { requests, activeCertificates } = useTC();
  const { user } = useAuth();
  const navigate = useNavigate();

  const myRequests = requests; 
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingCount = myRequests.filter(r => r.status === 'Pending').length;
  const underReviewCount = myRequests.filter(r => r.status === 'Under Review' || r.status === 'Proposal Ready').length;
  const activeCount = activeCertificates.length;

  const filteredRequests = myRequests.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.fpoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.crops.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (filter !== 'All' && r.status !== filter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header Banner Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Transaction Certificate (TC) Requests Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Process incoming Transaction Certificate requests, perform batch trace audits, and issue valid organic licenses.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 self-start md:self-center shrink-0">
          Certifying Body Desk
        </span>
      </div>

      {/* KPI METRIC CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" /> Pending TC Review
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-900 mt-1 block">{pendingCount}</span>
        </div>

        <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block flex items-center">
            <FileText className="w-3.5 h-3.5 mr-1" /> Under Audit / Proposal
          </span>
          <span className="text-xl sm:text-2xl font-black text-blue-900 mt-1 block">{underReviewCount}</span>
        </div>

        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active TC Licenses
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-900 mt-1 block">{activeCount}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-slate-500" /> Total Applications
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">{myRequests.length}</span>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Request ID, Seller/FPO Name, Crop..."
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['All', 'Pending', 'Under Review', 'Proposal Ready', 'Accepted'].map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={clsx(
                "px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all border",
                filter === st 
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs" 
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* REQUESTS TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2" /> Transaction Certificate Requests Ledger
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">Showing {filteredRequests.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Request ID & Date</th>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Applicant Seller / FPO</th>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Scope Produce Authorized</th>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Requested Qty / Period</th>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span 
                      onClick={() => navigate(`/dashboard/tc/requests/${req.id}`)}
                      className="font-mono font-extrabold text-emerald-700 hover:underline cursor-pointer text-xs block"
                    >
                      {req.id}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{new Date(req.requestDate).toLocaleDateString()}</span>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap font-bold text-slate-900 text-xs">
                    {req.fpoName}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-800 font-semibold text-xs">
                    {req.crops.join(', ')}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <strong className="text-slate-900 block text-xs">{req.expectedQty} MT</strong>
                    <span className="text-[10px] text-slate-500 block">{req.usagePeriod} Months Validity</span>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-[10px] font-extrabold border inline-flex items-center gap-1",
                      req.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-300' : 
                      req.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      req.status === 'Proposal Ready' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                      req.status === 'Payment Pending' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    )}>
                      {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {req.status === 'Accepted' && <CheckCircle2 className="w-3 h-3" />}
                      {req.status}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    <button 
                      onClick={() => navigate(`/dashboard/tc/requests/${req.id}`)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all inline-flex items-center gap-1"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 italic">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No TC requests found matching your filter criteria.
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
