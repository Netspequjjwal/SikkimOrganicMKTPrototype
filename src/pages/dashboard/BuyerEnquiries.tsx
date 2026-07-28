import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNegotiation } from '../../context/NegotiationContext';
import { Search, FileText, CheckCircle2, TrendingUp, AlertCircle, MessageSquare, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const BuyerEnquiries: React.FC = () => {
  const navigate = useNavigate();
  const { enquiries } = useNegotiation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'NEW' | 'ACTIVE' | 'SUCCESSFUL'>('ALL');

  const supplierEnquiries = enquiries;

  const newCount = supplierEnquiries.filter(e => e.status === 'New Enquiry').length;
  const activeCount = supplierEnquiries.filter(e => e.status !== 'Negotiation Successful' && e.status !== 'Negotiation Declined' && e.status !== 'Converted to Digital Contract').length;
  const winRate = '85%';
  const closedCount = supplierEnquiries.filter(e => e.status === 'Negotiation Successful' || e.status === 'Converted to Digital Contract').length;

  const filteredEnquiries = supplierEnquiries.filter(enq => {
    const matchesSearch = enq.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          enq.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          enq.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'NEW') return enq.status === 'New Enquiry';
    if (activeTab === 'ACTIVE') return enq.status !== 'Negotiation Successful' && enq.status !== 'Negotiation Declined' && enq.status !== 'Converted to Digital Contract';
    if (activeTab === 'SUCCESSFUL') return enq.status === 'Negotiation Successful' || enq.status === 'Converted to Digital Contract';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New Enquiry': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Quotation Submitted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Counter Offer': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Under Negotiation': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Negotiation Successful': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Converted to Digital Contract': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header Banner Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl shrink-0">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Seller Sales Pipeline & Buyer Enquiries
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage B2B buyer procurement requests, counter-offers, and price negotiations in real time.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 self-start md:self-center shrink-0">
          UX4G B2B Sales Gateway
        </span>
      </div>

      {/* KPI METRIC CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1" /> New Enquiries
          </span>
          <span className="text-xl sm:text-2xl font-black text-blue-900 mt-1 block">{newCount}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center">
            <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" /> Active Pipelines
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">{activeCount}</span>
        </div>

        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> Win Rate
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-900 mt-1 block">{winRate}</span>
        </div>

        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Closed Deals
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-900 mt-1 block">{closedCount}</span>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Enquiry ID, Buyer Name, Produce..."
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'ALL', label: 'ALL ENQUIRIES' },
            { id: 'NEW', label: `NEW (${newCount})` },
            { id: 'ACTIVE', label: `ACTIVE (${activeCount})` },
            { id: 'SUCCESSFUL', label: 'CLOSED / DEALS' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={clsx(
                "px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all border",
                activeTab === t.id 
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE / CARD CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center">
            <MessageSquare className="w-4 h-4 text-emerald-600 mr-2" /> B2B Commercial Buying Intent & Quotation Pipeline
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">Showing {filteredEnquiries.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Intent Ref & Date</th>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Buyer Entity</th>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Produce & Buying Intent Specs</th>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Pipeline Status</th>
                <th className="px-5 py-3 text-right text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100 text-xs">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400 italic">
                    No buyer intents found matching your search.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map(enq => (
                  <tr key={enq.id} className={clsx("hover:bg-slate-50/80 transition-colors", enq.status === 'New Enquiry' && "bg-blue-50/40")}>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span 
                        onClick={() => navigate(`/dashboard/negotiation/${enq.id}`)}
                        className="font-mono font-bold text-emerald-700 hover:underline cursor-pointer block text-xs"
                      >
                        {enq.id}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <strong className="text-slate-900 block font-bold text-xs">{enq.buyerName}</strong>
                      {enq.priority === 'Urgent' && (
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-wide bg-red-50 px-1.5 py-0.5 rounded border border-red-200 inline-block mt-0.5">
                          Urgent Priority
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <strong className="text-slate-900 block font-extrabold text-xs">{enq.quantityRequested} {enq.uom} of {enq.product}</strong>
                      <span className="text-[10px] text-slate-500 block">{enq.procurementType}</span>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={clsx("px-2.5 py-1 text-[10px] font-extrabold rounded-full border", getStatusColor(enq.status))}>
                        {enq.status === 'New Enquiry' ? 'Buying Intent Received' : enq.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <button 
                        onClick={() => navigate(`/dashboard/negotiation/${enq.id}`)}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl text-xs shadow-xs transition-all inline-flex items-center gap-1"
                      >
                        {enq.status === 'New Enquiry' ? 'Prepare Quotation' : 'Open Workspace'} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default BuyerEnquiries;
