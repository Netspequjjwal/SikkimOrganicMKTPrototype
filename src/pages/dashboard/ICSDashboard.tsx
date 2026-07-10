import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, MapPin, AlertCircle, Calendar, CheckCircle2, Clock, XCircle, ArrowRight, FileText, Search, Pin, ChevronRight, MessageSquare, FileSignature, CreditCard, X, Package } from 'lucide-react';
import { useServiceProvider } from '../../context/ServiceProviderContext';
import { useContract } from '../../context/ContractContext';
import { useNegotiation } from '../../context/NegotiationContext';
import { useOrder } from '../../context/OrderContext';
import { useActionCenter } from '../../context/ActionCenterContext';

const ICSDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { applications } = useServiceProvider();
  const { contracts } = useContract();
  const { enquiries } = useNegotiation();
  const { orders } = useOrder();
  const { recentActions } = useActionCenter();
  
  // For the prototype, we display the progress of the most recently submitted application
  const myApp = applications[0];

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
    
    // Base steps for any transaction (Seller Perspective)
    const steps = [
      { id: 'enquiry', title: 'Enquiry Received', description: 'Buyer sent initial requirements.', status: 'completed', icon: MessageSquare },
      { id: 'quote', title: 'Quotation Submitted', description: 'You provided pricing details.', status: (type === 'contract' || (type === 'enquiry' && data.messages.some((m: any) => m.isQuotation))) ? 'completed' : 'pending', icon: FileText },
      { id: 'draft', title: 'Contract Prepared', description: 'Legal document drafted and payment configured.', status: type === 'contract' ? 'completed' : 'pending', icon: FileSignature },
      { id: 'execute', title: 'Legally Executed', description: 'Both parties digitally signed.', status: type === 'contract' && !['Draft', 'Pending Buyer Review'].includes(data.status) ? 'completed' : 'pending', icon: CheckCircle2 },
      { id: 'payment', title: 'Payment Processing', description: 'Funds received via gateway.', status: type === 'contract' && ['Partially Paid', 'Fully Paid', 'Completed'].includes(data.status) ? (data.status === 'Fully Paid' || data.status === 'Completed' ? 'completed' : 'current') : 'pending', icon: CreditCard },
      { id: 'logistics', title: 'Logistics & Fulfillment', description: 'Shipment dispatched and verified.', status: type === 'contract' && data.status === 'Completed' ? 'completed' : 'pending', icon: MapPin },
    ];

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
      
      {/* Top Header */}
      <div className="flex flex-col bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Service Provider Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your active negotiations, contracts, and payments.</p>
      </div>

      {/* Organization Registration Status Tracker */}
      {myApp && (
        <div className={`border rounded-xl p-4 flex items-center justify-between mb-6 shadow-sm ${myApp.status === 'Approved' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center">
            {myApp.status === 'Approved' ? <CheckCircle2 className="w-5 h-5 text-green-600 mr-3" /> : <Clock className="w-5 h-5 text-yellow-600 mr-3" />}
            <div>
              <p className="text-sm font-bold text-gray-900">Organization Registration: {myApp.status}</p>
              <p className="text-xs text-gray-600">Ref ID: {myApp.id} {myApp.remarks && `— ${myApp.remarks}`}</p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Timeline Tracker */}
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
                <CheckCircle2 className="w-12 h-12 text-gray-300 mb-3" />
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
                        {item.iconType === 'general' && <CheckCircle2 className="w-5 h-5" />}
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
                  <CheckCircle2 className="w-12 h-12 text-gray-300 mb-3" />
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
          </div>  </div>
      </div>

    </div>
  );
};

export default ICSDashboard;
