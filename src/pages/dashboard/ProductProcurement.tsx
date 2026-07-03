import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useYieldSurvey } from '../../context/YieldSurveyContext';
import { useNegotiation } from '../../context/NegotiationContext';
import { useNotification } from '../../context/NotificationContext';
import type { BuyerEnquiry } from '../../context/NegotiationContext';
import { Search, Filter, ShieldCheck, Star, MapPin, Truck, ArrowLeft, ArrowRight, LayoutGrid, List, CheckCircle2, Clock, Info } from 'lucide-react';
import clsx from 'clsx';

const ProductProcurement: React.FC = () => {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { surveys } = useYieldSurvey();
  const { addEnquiry } = useNegotiation();
  const { triggerEmail } = useNotification();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedSuppliers, setSelectedSuppliers] = useState<Set<string>>(new Set());
  const [enquiryMode, setEnquiryMode] = useState<'selected' | string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [filters, setFilters] = useState({
    status: new Set(['Ready for Pre-Booking', 'Open for Sale (Harvested)']),
    districts: new Set<string>(),
    sps: new Set<string>(),
    minRating: 0,
    minQty: 0
  });

  // Enquiry Form State
  const [enqForm, setEnqForm] = useState({
    type: 'Pre-Booking' as 'Pre-Booking' | 'Purchase',
    qty: '',
    uom: 'MT',
    date: '',
    notes: ''
  });

  // Derive unique base suppliers for this crop from approved surveys
  const baseSuppliers = useMemo(() => {
    const agg: Record<string, any> = {};
    surveys.filter(s => s.status === 'Approved' && s.crop === cropId).forEach(s => {
      if (!agg[s.serviceProviderName]) {
        agg[s.serviceProviderName] = {
          id: s.serviceProviderName.replace(/\s+/g, '-').toLowerCase(),
          name: s.serviceProviderName,
          estimatedYield: 0,
          actualYield: 0,
          hasPhase1: false,
          hasPhase2: false,
          districts: new Set(),
          rating: (4.5 + Math.random() * 0.5).toFixed(1), // Mock rating
          orders: Math.floor(10 + Math.random() * 90),
          moq: '500 KG',
          responseRate: '98%',
          responseTime: '< 12 Hours'
        };
      }
      if (s.phase.includes('1')) {
        agg[s.serviceProviderName].estimatedYield += s.totalYield;
        agg[s.serviceProviderName].hasPhase1 = true;
      }
      if (s.phase.includes('2')) {
        agg[s.serviceProviderName].actualYield += s.totalYield;
        agg[s.serviceProviderName].hasPhase2 = true;
      }
      agg[s.serviceProviderName].districts.add(s.growerGroups[0].split(' ')[0]);
    });
    return Object.values(agg).map(sp => ({
      ...sp,
      districts: Array.from(sp.districts)
    }));
  }, [surveys, cropId]);

  // Apply Filters
  const suppliers = useMemo(() => {
    return baseSuppliers.filter(sp => {
      if (parseFloat(sp.rating) < filters.minRating) return false;
      const qty = sp.hasPhase2 ? sp.actualYield : sp.estimatedYield;
      if (qty < filters.minQty) return false;
      if (filters.sps.size > 0 && !filters.sps.has(sp.name)) return false;
      if (filters.districts.size > 0 && !sp.districts.some(d => filters.districts.has(d))) return false;
      return true;
    });
  }, [baseSuppliers, filters]);

  const toggleSelection = (spId: string) => {
    const newSet = new Set(selectedSuppliers);
    if (newSet.has(spId)) newSet.delete(spId);
    else newSet.add(spId);
    setSelectedSuppliers(newSet);
  };

  const getStatusBadge = (sp: any) => {
    if (sp.hasPhase2) {
      return <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-md flex items-center border border-green-200"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Open for Sale (Actual)</span>;
    }
    return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md flex items-center border border-blue-200"><Clock className="w-3.5 h-3.5 mr-1" /> Pre-Booking (Estimated)</span>;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 relative h-full flex flex-col">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/dashboard/marketplace')} className="text-gray-500 hover:text-gray-900 mr-4">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procure {cropId}</h1>
          <p className="text-sm text-gray-500">Discover and compare certified ICS Providers supplying {cropId}.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 pb-24">
        {/* Advanced Filters Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-6 hidden md:block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center"><Filter className="w-4 h-4 mr-2" /> Filters</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Availability Status</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" defaultChecked /> <span className="ml-2 text-sm text-gray-700">Ready for Pre-Booking</span></label>
                  <label className="flex items-center"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" defaultChecked /> <span className="ml-2 text-sm text-gray-700">Open for Sale (Harvested)</span></label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase">District</label>
                <div className="mt-2 space-y-2">
                  {['Mangan', 'Geyzing', 'Namchi'].map(d => (
                    <label key={d} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" 
                        checked={filters.districts.has(d)}
                        onChange={(e) => {
                          const newSet = new Set(filters.districts);
                          if (e.target.checked) newSet.add(d);
                          else newSet.delete(d);
                          setFilters({...filters, districts: newSet});
                        }}
                      /> 
                      <span className="ml-2 text-sm text-gray-700">{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase">Service Providers</label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {baseSuppliers.map(sp => (
                    <label key={sp.id} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" 
                        checked={filters.sps.has(sp.name)} 
                        onChange={(e) => {
                          const newSet = new Set(filters.sps);
                          if (e.target.checked) newSet.add(sp.name);
                          else newSet.delete(sp.name);
                          setFilters({...filters, sps: newSet});
                        }} 
                      /> 
                      <span className="ml-2 text-sm text-gray-700">{sp.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase">Minimum Rating</label>
                <div className="mt-2 space-y-2">
                  {[4, 3].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input type="radio" name="rating" className="border-gray-300 text-primary focus:ring-primary h-4 w-4" 
                        checked={filters.minRating === rating} 
                        onChange={() => setFilters({...filters, minRating: rating})}
                      /> 
                      <span className="ml-2 text-sm text-gray-700 flex items-center">{rating}+ Stars</span>
                    </label>
                  ))}
                  <label className="flex items-center">
                      <input type="radio" name="rating" className="border-gray-300 text-primary focus:ring-primary h-4 w-4" 
                        checked={filters.minRating === 0} 
                        onChange={() => setFilters({...filters, minRating: 0})}
                      /> 
                      <span className="ml-2 text-sm text-gray-700 flex items-center">Any Rating</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase">Min Quantity (MT): {filters.minQty}</label>
                <input type="range" min="0" max="20" step="0.5" value={filters.minQty} 
                   onChange={(e) => setFilters({...filters, minQty: parseFloat(e.target.value)})}
                   className="w-full mt-2 accent-primary" 
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase">Trust Indicators</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" /> <span className="ml-2 text-sm text-gray-700 flex items-center">Scope Certificate Available</span></label>
                  <label className="flex items-center"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" /> <span className="ml-2 text-sm text-gray-700">Transaction Cert Available</span></label>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-gray-50 text-gray-700 border border-gray-200 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">Apply Filters</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input type="text" placeholder="Search suppliers..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" />
            </div>

            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setViewMode('grid')} className={clsx("p-1.5 rounded-md transition-colors", viewMode === 'grid' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700")}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('table')} className={clsx("p-1.5 rounded-md transition-colors", viewMode === 'table' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700")}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {suppliers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">No Suppliers Found</h3>
              <p className="text-gray-500 mt-1">There are currently no approved suppliers for {cropId}.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
              {suppliers.map(sp => (
                <div key={sp.id} className={clsx("bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all cursor-pointer hover:shadow-md", selectedSuppliers.has(sp.id) ? "border-primary ring-1 ring-primary" : "border-gray-200")} onClick={() => toggleSelection(sp.id)}>
                  <div className="p-5 flex gap-4">
                    <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-100">
                      <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{sp.name}</h3>
                        <input type="checkbox" checked={selectedSuppliers.has(sp.id)} readOnly className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary ml-2" />
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                        <span className="font-medium text-gray-700 mr-1">{sp.rating}</span>
                        <span>({sp.orders} Orders)</span>
                      </div>
                      <div className="mt-2">
                        {getStatusBadge(sp)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-5 py-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Available Qty</p>
                      <p className="font-bold text-gray-900">{(sp.hasPhase2 ? sp.actualYield : sp.estimatedYield).toFixed(1)} MT</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">MOQ</p>
                      <p className="font-medium text-gray-900">{sp.moq}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Regions</p>
                      <p className="font-medium text-gray-900 flex items-center"><MapPin className="w-3 h-3 mr-1 text-gray-400" /> {sp.districts.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Response Time</p>
                      <p className="font-medium text-gray-900">{sp.responseTime}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center">
                    <button className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/supplier/${sp.id}`); }}>View Profile</button>
                    <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center hover:-translate-y-0.5" 
                      onClick={(e) => { e.stopPropagation(); setEnquiryMode(sp.id); }}>
                      Send Enquiry <ArrowRight className="w-4 h-4 ml-1.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left"><input type="checkbox" className="rounded border-gray-300 text-primary" /></th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Available Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {suppliers.map(sp => (
                    <tr key={sp.id} className={clsx("hover:bg-gray-50 cursor-pointer", selectedSuppliers.has(sp.id) && "bg-primary/5")} onClick={() => toggleSelection(sp.id)}>
                      <td className="px-6 py-4"><input type="checkbox" checked={selectedSuppliers.has(sp.id)} readOnly className="rounded border-gray-300 text-primary focus:ring-primary" /></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{sp.name}</div>
                        <div className="text-xs text-gray-500">{sp.districts.join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{(sp.hasPhase2 ? sp.actualYield : sp.estimatedYield).toFixed(1)} MT</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(sp)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center mt-2"><Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" /> {sp.rating}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-end ml-auto" 
                          onClick={(e) => { e.stopPropagation(); setEnquiryMode(sp.id); }}>
                          Enquire <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Enquiry Panel */}
      {selectedSuppliers.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 px-6 md:px-10 z-40 flex items-center justify-between animate-slideUp">
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Selected Suppliers</p>
              <p className="text-xl font-bold text-primary">{selectedSuppliers.size}</p>
            </div>
            <div className="hidden sm:block border-l border-gray-300 h-10"></div>
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500 uppercase font-semibold">Max Available Capacity</p>
              <p className="text-xl font-bold text-gray-900">
                {Array.from(selectedSuppliers).reduce((sum, id) => {
                  const sp = suppliers.find(s => s.id === id);
                  return sum + (sp ? (sp.hasPhase2 ? sp.actualYield : sp.estimatedYield) : 0);
                }, 0).toFixed(1)} MT
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center hover:-translate-y-0.5" onClick={() => setEnquiryMode('selected')}>
              Broadcast Enquiry to {selectedSuppliers.size} Selected {selectedSuppliers.size === 1 ? 'Supplier' : 'Suppliers'} <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Basic Drawer Implementation for Prototype */}
      {enquiryMode && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/10 transition-opacity animate-fadeIn" onClick={() => setEnquiryMode(null)}></div>
          <div className="fixed inset-y-0 right-0 max-w-xl w-full flex bg-white shadow-2xl flex-col animate-slideLeft">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                {enquiryMode === 'selected' && selectedSuppliers.size > 1 ? 'Broadcast Requirement (RFQ)' : 'Send Enquiry'}
              </h2>
              <button onClick={() => setEnquiryMode(null)} className="text-gray-400 hover:text-gray-500 text-2xl leading-none">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {enquiryMode === 'selected' && selectedSuppliers.size > 1 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start">
                    <Info className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 font-bold mb-1.5 uppercase tracking-wide">Broadcast Enquiry Mode</p>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        You are initiating a competitive procurement process. Your requirements will be sent simultaneously to <strong>{selectedSuppliers.size}</strong> selected suppliers for <strong>{cropId}</strong>. You can compare their quotations side-by-side in your dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Direct Enquiry To</p>
                    <p className="text-gray-900 font-bold">{enquiryMode === 'selected' ? Array.from(selectedSuppliers).map(id => suppliers.find(s => s.id === id)?.name).join(', ') : suppliers.find(s => s.id === enquiryMode)?.name}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Procurement Type</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" value={enqForm.type} onChange={e => setEnqForm({ ...enqForm, type: e.target.value as any })}>
                    <option value="Pre-Booking">Pre-Booking (Harvest Q3)</option>
                    <option value="Purchase">Immediate Purchase</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity Required</label>
                    <input type="number" value={enqForm.qty} onChange={e => setEnqForm({ ...enqForm, qty: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" placeholder="e.g. 5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" value={enqForm.uom} onChange={e => setEnqForm({ ...enqForm, uom: e.target.value })}>
                      <option>MT</option>
                      <option>KG</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
                  <input type="date" value={enqForm.date} onChange={e => setEnqForm({ ...enqForm, date: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Buyer Notes</label>
                  <textarea rows={4} value={enqForm.notes} onChange={e => setEnqForm({ ...enqForm, notes: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" placeholder="Specific packaging or certification requirements..."></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <button
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors disabled:opacity-50"
                disabled={!enqForm.qty || !enqForm.date}
                onClick={() => {
                  setIsSending(true);
                  const targetList = enquiryMode === 'selected' ? Array.from(selectedSuppliers) : [enquiryMode as string];

                  targetList.forEach(spId => {
                    const sp = suppliers.find(s => s.id === spId);
                    addEnquiry({
                      buyerName: user?.name || 'Authorized Buyer',
                      supplierName: sp?.name || spId,
                      product: cropId || 'Organic Produce',
                      quantityRequested: Number(enqForm.qty),
                      uom: enqForm.uom,
                      procurementType: enqForm.type,
                      deliveryDate: enqForm.date,
                      deliveryLocation: 'To Be Decided',
                      priority: 'Normal'
                    }, enqForm.notes);
                  });
                  setTimeout(() => {
                    setIsSending(false);
                    setShowEnquiryModal(false);
                    
                    const supplierList = targetList.map(spId => suppliers.find(s => s.id === spId)?.name || spId).join(', ');
                    
                    triggerEmail(
                      supplierList, 
                      `New Commercial Enquiry: ${cropData?.name || cropId}`,
                      `Dear Supplier,\n\nYou have received a new commercial enquiry for ${cropData?.name || cropId}.\n\nProcurement Type: ${enqForm.type}\nQuantity Requested: ${enqForm.qty} ${enqForm.uom}\nDelivery Date: ${enqForm.date}\n\nPlease login to the Sikkim Organic Platform to acknowledge and submit your quotation.\n\nBest Regards,\nGlobal Organic Foods Ltd.`
                    );
                    
                    navigate('/dashboard/my-enquiries');
                  }, 1500); 
                  setSelectedSuppliers(new Set());
                }}
              >
                {isSending ? 'Sending Enquiry...' : (enquiryMode === 'selected' && selectedSuppliers.size > 1 ? 'Submit Broadcast RFQ' : 'Submit Direct Enquiry')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductProcurement;
