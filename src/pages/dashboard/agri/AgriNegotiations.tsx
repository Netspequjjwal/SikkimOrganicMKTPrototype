import React, { useState } from 'react';
import { useNegotiation, BuyerEnquiry, EnquiryStatus } from '../../../context/NegotiationContext';
import { useNavigate } from 'react-router-dom';
import { 
  Handshake, 
  Search, 
  Filter, 
  MessageSquare, 
  Eye, 
  FileText, 
  Building2, 
  Package, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  X, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Calendar
} from 'lucide-react';

const AgriNegotiations: React.FC = () => {
  const { enquiries } = useNegotiation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<BuyerEnquiry | null>(null);

  // Compute metrics
  const totalDeals = enquiries.length;
  const pendingQuotes = enquiries.filter(e => e.status === 'New Enquiry' || e.status === 'Acknowledged').length;
  const activeNegotiations = enquiries.filter(e => ['Quotation Submitted', 'Counter Offer', 'Under Negotiation'].includes(e.status)).length;
  const convertedContracts = enquiries.filter(e => e.status === 'Converted to Digital Contract' || e.status === 'Negotiation Successful').length;

  const totalValue = enquiries.reduce((sum, enq) => {
    const lastQuote = enq.messages.slice().reverse().find(m => m.isQuotation && m.quotationDetails);
    return sum + (lastQuote?.quotationDetails?.totalAmount || (enq.quantityRequested * 500000));
  }, 0);

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = 
      enq.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'New Enquiry':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> New Enquiry</span>;
      case 'Acknowledged':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> Acknowledged</span>;
      case 'Quotation Submitted':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center w-fit"><FileText className="w-3 h-3 mr-1" /> Quotation Submitted</span>;
      case 'Under Negotiation':
      case 'Counter Offer':
        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center w-fit"><MessageSquare className="w-3 h-3 mr-1" /> Under Counter-Offer</span>;
      case 'Converted to Digital Contract':
      case 'Negotiation Successful':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center w-fit"><CheckCircle2 className="w-3 h-3 mr-1" /> Contract Drafted</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center w-fit">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 backdrop-blur-xs">
            <Handshake className="w-8 h-8 text-emerald-300" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-widest uppercase bg-emerald-700/60 text-emerald-200 px-2.5 py-1 rounded-full border border-emerald-500/40 inline-block mb-1">
              Government B2B Trade Oversight
            </span>
            <h1 className="text-2xl font-black text-white">Platform Trade Negotiations</h1>
            <p className="text-xs text-emerald-200/90 mt-0.5 max-w-xl">
              Real-time monitoring of commercial enquiries, supplier quotations, counter-offers, and deal pipelines between buyers and Sikkim organic sellers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-xl text-right">
            <p className="text-[10px] text-emerald-200 uppercase font-extrabold">Active Trade Pipeline</p>
            <p className="text-xl font-black text-white">₹{(totalValue / 100000).toFixed(2)} Lakhs</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Trade Deals</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalDeals}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Handshake className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pending Quotes</p>
            <p className="text-2xl font-black text-amber-700 mt-1">{pendingQuotes}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Active Counter-Offers</p>
            <p className="text-2xl font-black text-indigo-700 mt-1">{activeNegotiations}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contract Finalized</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{convertedContracts}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop, buyer, seller, deal ID..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 font-medium outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'New Enquiry', 'Quotation Submitted', 'Under Negotiation', 'Converted to Digital Contract'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === st 
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'Converted to Digital Contract' ? 'Contracts' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Negotiation Ledger Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm flex items-center">
            <Handshake className="w-4 h-4 text-emerald-700 mr-2" /> Live Commercial Negotiations Ledger
          </h3>
          <span className="text-xs font-semibold text-slate-500">{filteredEnquiries.length} Active Deals</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-6">Deal ID & Date</th>
                <th className="py-3.5 px-6">Commodity & Quantity</th>
                <th className="py-3.5 px-6">Buyer Entity</th>
                <th className="py-3.5 px-6">Seller / FPO Entity</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Quote Value</th>
                <th className="py-3.5 px-6">Stage</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEnquiries.map((enq) => {
                const quoteMsg = enq.messages.slice().reverse().find(m => m.isQuotation && m.quotationDetails);
                const totalAmt = quoteMsg?.quotationDetails?.totalAmount || (enq.quantityRequested * 500000);

                return (
                  <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-slate-900 block">{enq.id}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block">{enq.product}</span>
                      <span className="text-emerald-700 font-extrabold block text-[11px] mt-0.5">{enq.quantityRequested} {enq.uom}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 block">{enq.buyerName}</span>
                      <span className="text-[10px] text-slate-500">Verified Buyer</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 block">{enq.supplierName}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">Sikkim Organic SP</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                        {enq.procurementType}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-slate-900 block">₹{totalAmt.toLocaleString()}</span>
                      {quoteMsg?.quotationDetails?.pricePerUnit && (
                        <span className="text-[10px] text-slate-500 block">₹{quoteMsg.quotationDetails.pricePerUnit.toLocaleString()}/{enq.uom}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(enq.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors inline-flex items-center text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Inspection Drawer / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-end z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl h-full flex flex-col shadow-2xl border-l border-slate-200 animate-slideLeft">
            
            {/* Drawer Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Department Inspection Mode</span>
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Handshake className="w-5 h-5 text-emerald-400 mr-2" /> Deal: {selectedEnquiry.id}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Deal Overview Box */}
            <div className="bg-emerald-900 text-white p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-emerald-300 block text-[10px] uppercase font-bold">Commodity</span>
                  <span className="font-extrabold text-sm text-white block mt-0.5">{selectedEnquiry.product}</span>
                </div>
                <div>
                  <span className="text-emerald-300 block text-[10px] uppercase font-bold">Quantity</span>
                  <span className="font-extrabold text-sm text-white block mt-0.5">{selectedEnquiry.quantityRequested} {selectedEnquiry.uom}</span>
                </div>
                <div>
                  <span className="text-emerald-300 block text-[10px] uppercase font-bold">Procurement</span>
                  <span className="font-bold text-xs text-white block mt-0.5">{selectedEnquiry.procurementType}</span>
                </div>
                <div>
                  <span className="text-emerald-300 block text-[10px] uppercase font-bold">Target Date</span>
                  <span className="font-bold text-xs text-white block mt-0.5">{selectedEnquiry.deliveryDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-emerald-300 text-[10px] block uppercase font-bold">Buyer Entity</span>
                  <span className="font-bold text-white">{selectedEnquiry.buyerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-300 text-[10px] block uppercase font-bold">Seller Entity</span>
                  <span className="font-bold text-white">{selectedEnquiry.supplierName}</span>
                </div>
              </div>
            </div>

            {/* Chat & Negotiation Thread History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center">
                <MessageSquare className="w-4 h-4 text-slate-600 mr-1.5" /> Negotiation Message Audit History
              </h4>

              {selectedEnquiry.messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`p-4 rounded-2xl max-w-lg text-xs space-y-2 border ${
                    msg.sender === 'Buyer' 
                      ? 'bg-white border-slate-200 ml-auto' 
                      : 'bg-emerald-50 border-emerald-200 mr-auto'
                  }`}
                >
                  <div className="flex justify-between items-center border-b pb-1.5 text-[10px]">
                    <span className={`font-bold uppercase ${msg.sender === 'Buyer' ? 'text-slate-700' : 'text-emerald-900'}`}>
                      {msg.sender === 'Buyer' ? selectedEnquiry.buyerName : selectedEnquiry.supplierName}
                    </span>
                    <span className="text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <p className="text-slate-800 font-medium leading-relaxed">{msg.text}</p>

                  {msg.isQuotation && msg.quotationDetails && (
                    <div className="bg-emerald-900 text-white p-3 rounded-xl space-y-1.5 text-xs mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-emerald-300 uppercase font-bold">Official Quotation Submitted</span>
                        <span className="bg-emerald-800 text-emerald-200 text-[9px] px-2 py-0.5 rounded-full font-bold">Valid till {msg.quotationDetails.validUntil}</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="text-xs font-normal opacity-90">Rate: ₹{msg.quotationDetails.pricePerUnit.toLocaleString()} / {selectedEnquiry.uom}</span>
                        <span className="text-sm font-black text-white">Total: ₹{msg.quotationDetails.totalAmount.toLocaleString()}</span>
                      </div>
                      {msg.attachmentName && (
                        <div className="pt-2 border-t border-emerald-800 flex items-center justify-between text-[11px]">
                          <span className="truncate max-w-[200px] text-emerald-200">{msg.attachmentName}</span>
                          <button 
                            onClick={() => alert(`Downloading ${msg.attachmentName}...`)}
                            className="bg-white text-emerald-900 font-extrabold px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors text-[10px]"
                          >
                            Preview PDF
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Status: <strong>{selectedEnquiry.status}</strong></span>
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                Close Inspection
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AgriNegotiations;
