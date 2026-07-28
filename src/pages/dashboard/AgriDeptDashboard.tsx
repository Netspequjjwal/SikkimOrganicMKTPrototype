import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Building2, 
  ShoppingCart, 
  TrendingUp, 
  Briefcase, 
  Handshake, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Package,
  Activity,
  FileCheck2,
  Users,
  BadgeCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNegotiation } from '../../context/NegotiationContext';

const tradeVolumeData = [
  { month: 'Jan', volumeMT: 1200, tradeValueCr: 4.2 },
  { month: 'Feb', volumeMT: 1650, tradeValueCr: 5.8 },
  { month: 'Mar', volumeMT: 2100, tradeValueCr: 7.4 },
  { month: 'Apr', volumeMT: 2800, tradeValueCr: 9.8 },
  { month: 'May', volumeMT: 3400, tradeValueCr: 12.1 },
  { month: 'Jun', volumeMT: 4250, tradeValueCr: 15.6 },
];

const AgriDeptDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { enquiries } = useNegotiation();

  // Get 4 latest negotiations
  const latestNegotiations = enquiries.slice(0, 4);

  const pendingSellerCount = 3;
  const pendingBuyerCount = 4;
  const pendingFpoCount = 2;
  const pendingProductCount = 5;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-800/40">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-700/30 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-widest uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Department Approving & Monitoring Authority
              </span>
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1"></span> Live Governance
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Platform Operations & Approval Center</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Regulatory monitoring of registered B2B buyers & sellers, FPO approvals, product listings, transaction certificates, and live trade negotiations across Sikkim.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => navigate('/dashboard/agri/analytics')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center"
          >
            <TrendingUp className="w-4 h-4 mr-1.5" /> Platform Analytics
          </button>
        </div>
      </div>

      {/* KPI Cards: Pure B2B Trade & Authority Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Approved Sellers & FPOs', value: '28 Entities', sub: '3 Pending Approvals', icon: Building2, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Verified Buyer Organizations', value: '42 Buyers', sub: '4 Pending Approvals', icon: UserCheck, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Active Trade Pipeline', value: '₹34.8 Cr', sub: 'Secure Escrow & Contracts', icon: Handshake, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Transaction Cert. (TC) Issued', value: '154 Verified', sub: 'APEDA / NPOP Compliant', icon: FileCheck2, color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{stat.sub}</p>
              </div>
              <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTION HUB: Pending Approval Queues At A Glance */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Clock className="w-5 h-5 text-amber-600 mr-2" /> Department Approval Control Center
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Review and grant official department sanction for incoming seller, buyer, FPO, and crop listing applications</p>
          </div>
          <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-200">
            {pendingSellerCount + pendingBuyerCount + pendingFpoCount + pendingProductCount} Pending Approvals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Seller Approvals Card */}
          <div 
            onClick={() => navigate('/dashboard/seller-approvals')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {pendingSellerCount} Pending
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Seller / SP Approvals</h3>
              <p className="text-xs text-slate-500 mt-1">Review Sikkim Organic Service Providers & ICS Entities</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs font-bold text-emerald-700 group-hover:underline">
              <span>Review Sellers (3)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Buyer Approvals Card */}
          <div 
            onClick={() => navigate('/dashboard/buyer-approvals')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {pendingBuyerCount} Pending
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">Buyer Organization Approvals</h3>
              <p className="text-xs text-slate-500 mt-1">Verify Bulk Institutional Buyers & Exporters</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs font-bold text-blue-700 group-hover:underline">
              <span>Review Buyers (4)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* FPO Approvals Card */}
          <div 
            onClick={() => navigate('/dashboard/agri/fpo-registration')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 bg-purple-100 text-purple-800 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {pendingFpoCount} Pending
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">FPO Approvals</h3>
              <p className="text-xs text-slate-500 mt-1">Sanction Farmer Producer Organization Registrations</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs font-bold text-purple-700 group-hover:underline">
              <span>Review FPOs (2)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Product Listing Approvals Card */}
          <div 
            onClick={() => navigate('/dashboard/agri/product-approvals')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 bg-teal-100 text-teal-800 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {pendingProductCount} Pending
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">Product Listing Approvals</h3>
              <p className="text-xs text-slate-500 mt-1">Approve Organic Crop Lots for Direct Trade</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs font-bold text-teal-700 group-hover:underline">
              <span>Review Products (5)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* HIGHLIGHT: Active Trade Negotiations Oversight Showcase */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center">
              <Handshake className="w-5 h-5 text-emerald-700 mr-2" /> Live Platform B2B Trade Negotiations Showcase
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Department monitoring of commercial deal negotiations occurring between buyers & Sikkim sellers</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/agri/negotiations')}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center shrink-0"
          >
            Inspect All Active Negotiations ({enquiries.length}) <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-200">
          {latestNegotiations.map((enq) => {
            const lastQuote = enq.messages.slice().reverse().find(m => m.isQuotation && m.quotationDetails);
            const totalAmt = lastQuote?.quotationDetails?.totalAmount || (enq.quantityRequested * 500000);

            return (
              <div key={enq.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">{enq.id}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      enq.status === 'Quotation Submitted' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                      enq.status === 'Counter Offer' || enq.status === 'Under Negotiation' ? 'bg-indigo-100 text-indigo-800 border-indigo-300' :
                      enq.status === 'Converted to Digital Contract' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {enq.status}
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-extrabold text-slate-900 text-sm">{enq.product}</span>
                    <span className="text-emerald-700 font-extrabold text-xs bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {enq.quantityRequested} {enq.uom}
                    </span>
                    <span className="text-slate-400 text-xs">• {enq.procurementType}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 pt-0.5">
                    <span>Buyer: <strong>{enq.buyerName}</strong></span>
                    <span className="text-slate-300">|</span>
                    <span>Seller: <strong>{enq.supplierName}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between md:justify-end shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Latest Quote Amount</span>
                    <span className="text-base font-black text-slate-900 block">₹{totalAmt.toLocaleString()}</span>
                    {lastQuote?.quotationDetails?.pricePerUnit && (
                      <span className="text-[10px] text-slate-500 block">₹{lastQuote.quotationDetails.pricePerUnit.toLocaleString()}/{enq.uom}</span>
                    )}
                  </div>

                  <button
                    onClick={() => navigate('/dashboard/agri/negotiations')}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors flex items-center"
                  >
                    Inspect Deal <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Ecosystem Activity Audit Feed & B2B Trade Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Ecosystem Activity Stream */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Activity className="w-5 h-5 text-emerald-700 mr-2" /> Live Ecosystem Approval & Trade Audit Stream
            </h2>
            <span className="text-xs text-slate-400 font-medium">Real-Time Platform Feed</span>
          </div>

          <div className="space-y-4">
            {[
              { title: 'New Buyer Organization Registration Submitted', details: 'Naturals India Procurement submitted GST & organic credentials for verification', time: '10 mins ago', type: 'Buyer App', badgeBg: 'bg-blue-100 text-blue-800' },
              { title: 'Formal Quotation Submitted for 12 MT Organic Ginger', details: 'SIMFED submitted quote of ₹1,40,000/MT to Global Organic Foods Ltd.', time: '45 mins ago', type: 'Trade Quote', badgeBg: 'bg-purple-100 text-purple-800' },
              { title: 'Transaction Certificate (TC/2026/NPOP/008492) Attached', details: 'Uploaded by Sikkim Organic Alive for 1.5 MT Large Cardamom consignment', time: '2 hours ago', type: 'TC Audit', badgeBg: 'bg-emerald-100 text-emerald-800' },
              { title: 'FPO Registration Approval Requested', details: 'Pakyong Organic FPO Federation submitted statutory board resolution & documents', time: '3 hours ago', type: 'FPO App', badgeBg: 'bg-amber-100 text-amber-800' },
              { title: 'Organic Product Batch Sanctioned', details: '5 MT High-Curcumin Organic Turmeric batch verified and listed for B2B trade', time: '5 hours ago', type: 'Product Sanction', badgeBg: 'bg-teal-100 text-teal-800' },
            ].map((act, i) => (
              <div key={i} className="flex items-start justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${act.badgeBg}`}>{act.type}</span>
                    <span className="text-xs font-bold text-slate-900">{act.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-0.5">{act.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-4">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform B2B Trade Volume Growth */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Platform Trade Volume Trend</h2>
            <p className="text-xs text-slate-500 mb-4">Monthly B2B Organic Procurement Volume (MT)</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tradeVolumeData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#047857" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10}} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10}} dx={-5} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Area type="monotone" dataKey="volumeMT" stroke="#047857" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Cumulative Procurement</span>
            <span className="font-extrabold text-emerald-800 text-sm">15,400 MT</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgriDeptDashboard;
