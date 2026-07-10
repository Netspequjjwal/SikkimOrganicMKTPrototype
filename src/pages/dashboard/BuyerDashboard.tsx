import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ArrowRight, FileSignature, CheckCircle, Package, Truck, ArrowLeft, ArrowUpRight, DollarSign, CreditCard, ExternalLink, Calendar, CheckCircle2, Clock, X, MessageSquare, AlertCircle, Pin, ChevronRight, ShoppingCart, FileText, FileCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useContract } from '../../context/ContractContext';
import { useNegotiation } from '../../context/NegotiationContext';
import { useOrder } from '../../context/OrderContext';
import { useActionCenter } from '../../context/ActionCenterContext';
import bannerImg from '../../assets/banner.png';

const data = [
  { name: 'Jan', amount: 1200000 },
  { name: 'Feb', amount: 1500000 },
  { name: 'Mar', amount: 1400000 },
  { name: 'Apr', amount: 1800000 },
  { name: 'May', amount: 2200000 },
  { name: 'Jun', amount: 2800000 },
];

const BuyerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { contracts } = useContract();
  const { enquiries } = useNegotiation();
  const { orders } = useOrder();
  const { recentActions } = useActionCenter();
  
  // Timeline Tracker state
  const [trackerSearch, setTrackerSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [trackedItem, setTrackedItem] = useState<{type: 'enquiry' | 'contract' | 'not_found', data: any} | null>(null);

  const allSuggestions = [
    ...contracts.filter(c => c.contractRef).map(c => ({ id: c.contractRef as string, type: 'Contract', product: c.product })),
    ...enquiries.map(e => ({ id: e.id, type: 'Enquiry', product: e.product }))
  ];

  const filteredSuggestions = trackerSearch.trim()
    ? allSuggestions.filter(s => s.id.toUpperCase().includes(trackerSearch.trim().toUpperCase())).slice(0, 5)
    : [];

  // Derive Actionable Items
  const pendingContracts = contracts.filter(c => c.status === 'Pending Buyer Review');
  const pendingPayments = contracts.filter(c => c.status === 'Payment Pending' || c.status === 'Partially Paid');
  const activeQuotations = enquiries.filter(e => e.status === 'Quotation Submitted');
  const pendingDeliveryActions = orders.filter(o => 
    o.status === 'Ready for Delivery Details' || 
    o.status === 'Awaiting Buyer Delivery Confirmation' || 
    ['Shipment In Transit', 'Out for Delivery', 'Delivered (Awaiting Buyer Confirmation)'].includes(o.status)
  );

  const allActionableItems = [
    ...pendingContracts.map(c => ({ id: c.id, refId: c.contractRef || 'Pending Ref', title: `Contract Signature Required - ${c.product}`, type: 'signature', actionUrl: `/dashboard/contracts/review/${c.id}` })),
    ...pendingPayments.map(c => ({ id: c.id, refId: c.contractRef || 'Pending Ref', title: `Payment Due - ₹${c.totalAmount.toLocaleString()} for ${c.product}`, type: 'payment', actionUrl: `/dashboard/payments/gateway/${c.id}` })),
    ...activeQuotations.map(e => ({ id: e.id, refId: e.id, title: `Quotation Received - ${e.product} from ${e.supplierName}`, type: 'quotation', actionUrl: `/dashboard/negotiation/${e.id}` })),
    ...pendingDeliveryActions.map(o => ({ id: o.id, refId: o.contractRef || o.id, title: `Order Action Required - ${o.status}`, type: 'order', actionUrl: `/dashboard/orders/${o.id}` }))
  ];

  // We removed the derived recentActivities because we now use recentActions from ActionCenterContext

  const handleTrackerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackerSearch.trim()) {
      setTrackedItem(null);
      return;
    }
    
    const query = trackerSearch.trim().toUpperCase();
    
    // Check contracts first
    const contract = contracts.find(c => c.contractRef === query || c.enquiryId === query);
    if (contract) {
      setTrackedItem({ type: 'contract', data: contract });
      return;
    }
    
    // Check enquiries
    const enquiry = enquiries.find(e => e.id === query);
    if (enquiry) {
      // Is there a contract for this enquiry?
      const relatedContract = contracts.find(c => c.enquiryId === enquiry.id);
      if (relatedContract) {
        setTrackedItem({ type: 'contract', data: relatedContract }); // Elevate to contract view if exists
      } else {
        setTrackedItem({ type: 'enquiry', data: enquiry });
      }
      return;
    }
    
    setTrackedItem({ type: 'not_found', data: null });
  };

  const renderTimeline = () => {
    if (!trackedItem || trackedItem.type === 'not_found') return null;
    
    const { type, data } = trackedItem;
    
    // Base steps for any transaction
    const steps = [
      { id: 'enquiry', title: 'Enquiry Created', description: 'Buyer sent initial requirements.', status: 'completed', icon: MessageSquare },
      { id: 'quote', title: 'Quotation Received', description: 'Supplier provided pricing details.', status: (type === 'contract' || (type === 'enquiry' && data.messages.some((m: any) => m.isQuotation))) ? 'completed' : 'pending', icon: FileCheck },
      { id: 'draft', title: 'Contract Drafted', description: 'Legal document generated.', status: type === 'contract' ? 'completed' : 'pending', icon: FileSignature },
      { id: 'execute', title: 'Legally Executed', description: 'Both parties digitally signed.', status: type === 'contract' && !['Draft', 'Pending Buyer Review'].includes(data.status) ? 'completed' : 'pending', icon: CheckCircle },
      { id: 'payment', title: 'Payment Milestones', description: 'Funds processed via gateway.', status: type === 'contract' && ['Partially Paid', 'Fully Paid', 'Completed'].includes(data.status) ? (data.status === 'Fully Paid' || data.status === 'Completed' ? 'completed' : 'current') : 'pending', icon: CreditCard },
      { id: 'logistics', title: 'Logistics & Fulfillment', description: 'Shipment delivered and verified.', status: type === 'contract' && data.status === 'Completed' ? 'completed' : 'pending', icon: Truck },
    ];

    // Find the first 'pending' or 'current' step to highlight it
    const currentIndex = steps.findIndex(s => s.status === 'pending' || s.status === 'current');

    return (
      <div className="mt-6 border-t border-gray-100 pt-6">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center">
          Timeline for {type === 'contract' ? (data.contractRef || 'Pending Execution') : data.id}
          <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">Current Status: {data.status}</span>
        </h3>
        
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8 relative">
            {steps.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current' || (currentIndex === idx && step.status === 'pending');
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex items-start">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 
                    ${isCompleted ? 'bg-green-100 text-green-600 border-2 border-white ring-4 ring-green-50' : 
                      isCurrent ? 'bg-primary/10 text-primary border-2 border-white ring-4 ring-primary/20' : 
                      'bg-gray-100 text-gray-400 border-2 border-white'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-4 mt-1.5">
                    <h4 className={`text-sm font-bold ${isCompleted ? 'text-gray-900' : isCurrent ? 'text-primary' : 'text-gray-500'}`}>{step.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header & CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 md:p-8 rounded-xl shadow-lg border border-gray-800 relative overflow-hidden group">
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0">
          <img src={bannerImg} alt="Organic Farmland" className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-primary/80 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Buyer Dashboard</h1>
          <p className="text-sm md:text-base text-gray-300 mt-1.5 font-medium max-w-md">Manage your procurement, track transactions, and instantly explore verified organic suppliers.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <button onClick={() => navigate('/dashboard/marketplace')} className="bg-white hover:bg-gray-50 text-primary px-6 py-3 rounded-xl font-bold transition-all flex items-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 animate-pulse-slow">
            <ShoppingCart className="w-5 h-5 mr-2" /> 
            Enter Marketplace
          </button>
          <button onClick={() => navigate('/dashboard/my-enquiries')} className="bg-gray-800/50 hover:bg-gray-800 border border-gray-600 text-white px-5 py-3 rounded-xl font-medium transition-colors shadow-sm backdrop-blur-sm">
            View Active Enquiries
          </button>
        </div>
      </div>

      {/* Transaction Timeline Tracker (Moved Up) */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 rounded-t-xl">
          <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" /> Transaction Timeline Tracker
          </h3>
          <p className="text-sm text-gray-500 mt-1">Enter an Enquiry ID or Contract ID to trace its full lifecycle.</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleTrackerSearch} className="flex gap-4 max-w-2xl">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="e.g. ENQ-2026-000458 or EC-2026-976665"
                value={trackerSearch}
                onChange={(e) => {
                  setTrackerSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              
              {trackerSearch && (
                <button 
                  type="button"
                  onClick={() => {
                    setTrackerSearch('');
                    setTrackedItem(null);
                  }}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              
              {/* Autocomplete Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white mt-1 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredSuggestions.map((s, idx) => (
                    <li 
                      key={idx}
                      onClick={() => {
                        setTrackerSearch(s.id);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex justify-between items-center group"
                    >
                      <span className="font-mono font-bold text-gray-900 group-hover:text-primary">{s.id}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{s.type} - {s.product}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition-colors">
              Track Status
            </button>
          </form>

          {trackedItem && trackedItem.type === 'not_found' && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" /> No transaction found matching that ID. Please check and try again.
            </div>
          )}

          {renderTimeline()}
        </div>
      </div>

      {/* Dynamic Action Center & Pinned Items Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Action Center (Recent Activity) */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" /> Action Center (Recent Activity)
            </h3>
          </div>
          <div className="p-6 flex-1 bg-white">
            {recentActions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                <CheckCircle className="w-12 h-12 text-gray-300 mb-3" />
                <p>No recent activity in this session.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActions.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all group bg-white cursor-pointer" onClick={() => navigate(item.actionUrl)}>
                    <div className="flex items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 
                        ${item.iconType === 'enquiry' ? 'bg-blue-100 text-blue-600' : 
                          item.iconType === 'contract' ? 'bg-teal-100 text-teal-600' : 
                          item.iconType === 'payment' ? 'bg-red-100 text-red-600' : 
                          item.iconType === 'order' ? 'bg-purple-100 text-purple-600' : 
                          item.iconType === 'quotation' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                        {item.iconType === 'enquiry' && <MessageSquare className="w-5 h-5" />}
                        {item.iconType === 'contract' && <FileSignature className="w-5 h-5" />}
                        {item.iconType === 'payment' && <CreditCard className="w-5 h-5" />}
                        {item.iconType === 'order' && <Package className="w-5 h-5" />}
                        {item.iconType === 'quotation' && <FileText className="w-5 h-5" />}
                        {item.iconType === 'general' && <CheckCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">{item.title}</p>
                        {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 group-hover:text-primary transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pinned Items & Timeline Tracker */}
        <div className="space-y-6 flex flex-col">
          
          {/* Pinned Items (Actionable Items) */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden flex-1">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center">
                <Pin className="w-5 h-5 mr-2 text-orange-500" /> Pinned Items (Pending)
              </h3>
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{allActionableItems.length} Pending</span>
            </div>
            <div className="p-6 bg-white min-h-[200px]">
              {allActionableItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                  <CheckCircle className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-sm text-center">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allActionableItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} onClick={() => navigate(item.actionUrl)} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-orange-50 cursor-pointer group">
                      <div className="flex items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                          ${item.type === 'signature' ? 'bg-blue-100 text-blue-600' : 
                            item.type === 'payment' ? 'bg-red-100 text-red-600' : 
                            item.type === 'order' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                          {item.type === 'signature' && <FileSignature className="w-4 h-4" />}
                          {item.type === 'payment' && <CreditCard className="w-4 h-4" />}
                          {item.type === 'quotation' && <MessageSquare className="w-4 h-4" />}
                          {item.type === 'order' && <Package className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm group-hover:text-primary leading-tight">{item.title}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 font-mono mr-2">{item.refId}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
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

export default BuyerDashboard;
