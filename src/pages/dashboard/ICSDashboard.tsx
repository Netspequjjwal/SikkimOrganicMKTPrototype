import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, MapPin, AlertCircle, Calendar, CheckCircle2, Clock, XCircle, 
  ArrowRight, FileText, Search, Pin, ChevronRight, MessageSquare, FileSignature, 
  CreditCard, X, Package, ShieldCheck, Activity, Layers, Filter, Lock, Unlock, RefreshCw
} from 'lucide-react';
import { useSellerRegistration } from '../../context/SellerRegistrationContext';
import { useContract } from '../../context/ContractContext';
import { useNegotiation } from '../../context/NegotiationContext';
import { useOrder } from '../../context/OrderContext';
import { useActionCenter } from '../../context/ActionCenterContext';

const ICSDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { applications, resetToUnregistered, setDemoStatus } = useSellerRegistration();
  const { contracts } = useContract();
  const { enquiries } = useNegotiation();
  const { orders } = useOrder();
  const { recentActions } = useActionCenter();
  
  // Progress of the most recently submitted seller application
  const myApp = applications[0];

  // STEP 1: If seller is NOT registered (no application submitted yet), redirect to seller-registration page
  useEffect(() => {
    if (applications.length === 0) {
      navigate('/dashboard/seller-registration');
    }
  }, [applications, navigate]);

  // Timeline Tracker state
  const [trackerSearch, setTrackerSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [trackedItem, setTrackedItem] = useState<{ type: 'enquiry' | 'contract' | 'not_found', data: any } | null>(null);

  const allSuggestions = [
    ...contracts.filter(c => c.contractRef).map(c => ({ id: c.contractRef as string, type: 'Contract', product: c.product })),
    ...enquiries.map(e => ({ id: e.id, type: 'Enquiry', product: e.product }))
  ];

  const filteredSuggestions = trackerSearch.trim()
    ? allSuggestions.filter(s => s.id.toUpperCase().includes(trackerSearch.trim().toUpperCase())).slice(0, 5)
    : [];

  // Derive Actionable Items for SELLER
  const newEnquiries = enquiries.filter(e => e.status === 'New Enquiry' || e.status === 'Counter Offer');
  const pendingContractGenerations = enquiries.filter(e => e.status === 'Converted to Digital Contract');
  const draftContracts = contracts.filter(c => c.status === 'Draft');
  const activeContracts = contracts.filter(c => c.status === 'Legally Executed' || c.status === 'Partially Paid');
  const actionableOrders = orders.filter(o => 
    ['Ready for Dispatch', 'Handed Over to Logistics Partner', 'Delivery Address Confirmed', 'Preparing Order', 'Quality Inspection Completed', 'Packaging Completed'].includes(o.status) || 
    (o.status === 'Way Bill Generated' && !o.wayBillDetails?.wayBillNumber)
  );

  const allActionableItems = [
    ...newEnquiries.map(e => ({ id: e.id, refId: e.id, title: `Action Required - ${e.product} (${e.status})`, type: 'quotation', actionUrl: `/dashboard/negotiation/${e.id}` })),
    ...pendingContractGenerations.map(e => ({ id: e.id, refId: e.id, title: `Purchase Intent Received - Generate Contract`, type: 'signature', actionUrl: `/dashboard/negotiation/${e.id}` })),
    ...draftContracts.map(c => ({ id: c.id, refId: c.enquiryId, title: `Contract Draft - Ready to Send`, type: 'signature', actionUrl: `/dashboard/sp-contracts` })),
    ...activeContracts.map(c => ({ id: c.id, refId: c.contractRef || 'Executed Ref', title: `Active Contract - Manage Payments`, type: 'payment', actionUrl: `/dashboard/sp-contracts` })),
    ...actionableOrders.map(o => ({ id: o.id, refId: o.contractRef || o.id, title: `Order Action Required - ${o.status}`, type: 'order', actionUrl: `/dashboard/orders/${o.id}` }))
  ];

  const handleTrackerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackerSearch.trim()) {
      setTrackedItem(null);
      return;
    }

    const query = trackerSearch.trim().toUpperCase();

    const contract = contracts.find(c => c.contractRef === query || c.enquiryId === query);
    if (contract) {
      setTrackedItem({ type: 'contract', data: contract });
      return;
    }

    const enquiry = enquiries.find(e => e.id === query);
    if (enquiry) {
      const relatedContract = contracts.find(c => c.enquiryId === enquiry.id);
      if (relatedContract) {
        setTrackedItem({ type: 'contract', data: relatedContract });
      } else {
        setTrackedItem({ type: 'enquiry', data: enquiry });
      }
      return;
    }

    setTrackedItem({ type: 'not_found', data: null });
  };

  const renderCompactTimeline = () => {
    if (!trackedItem || trackedItem.type === 'not_found') return null;

    const { type, data } = trackedItem;

    const steps = [
      { id: 'enquiry', title: 'Enquiry Received', description: 'Buyer sent requirements.', status: 'completed', icon: MessageSquare },
      { id: 'quote', title: 'Quotation Submitted', description: 'Pricing details provided.', status: (type === 'contract' || (type === 'enquiry' && data.messages.some((m: any) => m.isQuotation))) ? 'completed' : 'pending', icon: FileText },
      { id: 'draft', title: 'Contract Prepared', description: 'Drafted & payment set.', status: type === 'contract' ? 'completed' : 'pending', icon: FileSignature },
      { id: 'execute', title: 'Legally Executed', description: 'Signed by both parties.', status: type === 'contract' && !['Draft', 'Pending Buyer Review'].includes(data.status) ? 'completed' : 'pending', icon: CheckCircle2 },
      { id: 'payment', title: 'Payment Processing', description: 'Funds via gateway.', status: type === 'contract' && ['Partially Paid', 'Fully Paid', 'Completed'].includes(data.status) ? (data.status === 'Fully Paid' || data.status === 'Completed' ? 'completed' : 'current') : 'pending', icon: CreditCard },
      { id: 'logistics', title: 'Fulfillment', description: 'Dispatched & verified.', status: type === 'contract' && data.status === 'Completed' ? 'completed' : 'pending', icon: MapPin },
    ];

    const currentIndex = steps.findIndex(s => s.status === 'pending' || s.status === 'current');

    return (
      <div className="mt-4 border-t border-slate-200/80 pt-4 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs font-bold text-slate-800">
            {type === 'contract' ? (data.contractRef || 'Pending Ref') : data.id}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
            {data.status}
          </span>
        </div>

        <div className="space-y-3 relative pl-3 border-l-2 border-slate-200 ml-2">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current' || (currentIndex === idx && step.status === 'pending');
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative flex items-center">
                <div className={`absolute -left-[19px] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white
                  ${isCompleted ? 'bg-emerald-500 text-white' :
                    isCurrent ? 'bg-amber-500 text-white ring-2 ring-amber-200' :
                      'bg-slate-200 text-slate-400'}`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div className="ml-3">
                  <p className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : isCurrent ? 'text-amber-700' : 'text-slate-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-500">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const isSellerApproved = myApp?.status === 'Approved';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">

      {/* DEMO WORKFLOW SIMULATOR TOOLBAR */}
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md border border-slate-800">
        <div className="flex items-center space-x-2 font-mono">
          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin-slow" />
          <span className="font-bold text-slate-300">Seller Workflow Simulator:</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => resetToUnregistered()}
            className="px-2.5 py-1 bg-red-600/80 hover:bg-red-600 rounded-lg text-white font-semibold transition-colors"
            title="Simulate first-time seller (redirects to /dashboard/seller-registration)"
          >
            1. Unregistered (Redirect)
          </button>
          <button 
            onClick={() => setDemoStatus('Pending')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${myApp?.status === 'Pending' ? 'bg-amber-500 text-white ring-2 ring-amber-300' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'}`}
          >
            2. Pending Approval
          </button>
          <button 
            onClick={() => setDemoStatus('Approved')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${myApp?.status === 'Approved' ? 'bg-emerald-600 text-white ring-2 ring-emerald-300' : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'}`}
          >
            3. Department Approved (Active)
          </button>
        </div>
      </div>

      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sellers Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage live buyer RFQs, digital contracts, and fulfillment pipelines.</p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Pending Actions</span>
            <span className="text-base font-extrabold text-amber-900">{allActionableItems.length}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Active Contracts</span>
            <span className="text-base font-extrabold text-emerald-900">{activeContracts.length}</span>
          </div>
        </div>
      </div>

      {/* SELLER REGISTRATION STATUS & APPROVAL PRIVILEGES BANNER */}
      {myApp && (
        <div className={`rounded-2xl p-5 border shadow-sm transition-all ${isSellerApproved ? 'bg-emerald-50/90 border-emerald-300' : 'bg-amber-50/90 border-amber-300'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-start space-x-3.5">
              {isSellerApproved ? (
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
                  <Clock className="w-6 h-6" />
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Organization Registration: {myApp.status}
                  </h3>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white rounded-md border border-slate-200 text-slate-700">
                    {myApp.id}
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  {isSellerApproved ? (
                    <span className="text-emerald-800 font-medium">
                      ✓ Your Seller Organization is verified and approved by the Agriculture & Horticulture Department! Full selling privileges and product listing features are active.
                    </span>
                  ) : (
                    <span className="text-amber-800 font-medium">
                      ⏳ Your registration application is currently under review by the Agriculture & Horticulture Department. Upon department approval, your produce selling privileges will be fully activated.
                    </span>
                  )}
                </p>

                {/* Trust Badges on Approval */}
                {isSellerApproved && myApp.trustBadges && myApp.trustBadges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {myApp.trustBadges.map((badge, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="shrink-0 flex items-center gap-2">
              {!isSellerApproved ? (
                <button 
                  onClick={() => navigate('/dashboard/seller-approvals')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Clock className="w-4 h-4" /> Review Approvals Desk
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/dashboard/survey')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Unlock className="w-4 h-4" /> Publish Produces
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2-COLUMN HEATMAP DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: Secondary & Reference Information (Cool Slate Tone) */}
        <div className="lg:col-span-5 space-y-6">

          {/* 1. Compact Transaction Timeline Tracker */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-sm p-5 relative z-20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-indigo-600" /> Status Tracker
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Trace ID</span>
            </div>

            <form onSubmit={handleTrackerSearch} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ENQ-2026-000458 or EC-2026-..."
                  value={trackerSearch}
                  onChange={(e) => {
                    setTrackerSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary uppercase bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />

                {trackerSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setTrackerSearch('');
                      setTrackedItem(null);
                    }}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Autocomplete Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white mt-1 border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((s, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setTrackerSearch(s.id);
                          setShowSuggestions(false);
                        }}
                        className="px-3 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 flex justify-between items-center text-xs"
                      >
                        <span className="font-mono font-bold text-slate-800">{s.id}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{s.type}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
                Track Transaction Status
              </button>
            </form>

            {trackedItem && trackedItem.type === 'not_found' && (
              <div className="mt-3 p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" /> No record found for that ID.
              </div>
            )}

            {renderCompactTimeline()}
          </div>

          {/* 2. Seller Pipeline Overview Summary Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-primary/40 transition-all" onClick={() => navigate('/dashboard/buyer-enquiries')}>
                <span className="text-[10px] font-bold text-slate-500 block">Open Enquiries</span>
                <span className="text-lg font-extrabold text-slate-900">{enquiries.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-primary/40 transition-all" onClick={() => navigate('/dashboard/sp-contracts')}>
                <span className="text-[10px] font-bold text-slate-500 block">Draft Contracts</span>
                <span className="text-lg font-extrabold text-slate-900">{draftContracts.length}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: HIGH HEAT MAP AREA (Action Center & Pinned Items in Warm High-Priority Tone) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. TOP RIGHT: Pinned Items (Pending Urgent Actions) */}
          <div className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-amber-200/60 bg-amber-100/40 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-amber-950 flex items-center">
                <Pin className="w-5 h-5 mr-2 text-amber-600 fill-amber-500" /> Pinned Items (Pending Actions)
              </h3>
              <span className="bg-amber-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                {allActionableItems.length} Pending
              </span>
            </div>

            <div className="p-6 min-h-[160px]">
              {allActionableItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                  <CheckCircle2 className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-xs font-medium">You're all caught up! No pending items.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allActionableItems.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      onClick={() => navigate(item.actionUrl)}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-amber-200/70 bg-white hover:bg-amber-50/80 hover:border-amber-400 cursor-pointer shadow-xs transition-all group"
                    >
                      <div className="flex items-center flex-1">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mr-3 shadow-xs
                          ${item.type === 'signature' ? 'bg-blue-100 text-blue-700' :
                            item.type === 'payment' ? 'bg-emerald-100 text-emerald-700' :
                              item.type === 'order' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                          {item.type === 'signature' && <FileSignature className="w-4 h-4" />}
                          {item.type === 'payment' && <CreditCard className="w-4 h-4" />}
                          {item.type === 'quotation' && <MessageSquare className="w-4 h-4" />}
                          {item.type === 'order' && <Package className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-amber-800 transition-colors leading-tight">
                            {item.title}
                          </p>
                          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">{item.refId}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. BELOW PINNED: Action Center (Recent Activity & Live Updates) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-indigo-600" /> Action Center (Recent Activity)
              </h3>
              <span className="text-xs text-slate-400 font-medium">Live Session Feed</span>
            </div>

            <div className="p-6 bg-white flex-1">
              {recentActions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <CheckCircle2 className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="text-sm font-medium">No recent activity logged in this session.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(item.actionUrl)}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer group bg-white"
                    >
                      <div className="flex items-center flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3.5 
                          ${item.iconType === 'enquiry' ? 'bg-blue-100 text-blue-600' :
                            item.iconType === 'contract' ? 'bg-teal-100 text-teal-600' :
                              item.iconType === 'payment' ? 'bg-emerald-100 text-emerald-600' :
                                item.iconType === 'order' ? 'bg-purple-100 text-purple-600' :
                                  item.iconType === 'quotation' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                          {item.iconType === 'enquiry' && <MessageSquare className="w-5 h-5" />}
                          {item.iconType === 'contract' && <FileSignature className="w-5 h-5" />}
                          {item.iconType === 'payment' && <CreditCard className="w-5 h-5" />}
                          {item.iconType === 'order' && <Package className="w-5 h-5" />}
                          {item.iconType === 'quotation' && <FileText className="w-5 h-5" />}
                          {item.iconType === 'general' && <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{item.title}</p>
                          {item.description && <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ICSDashboard;
