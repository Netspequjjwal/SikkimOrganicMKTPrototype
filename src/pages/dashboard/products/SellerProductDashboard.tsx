import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductListing, ProductListing, ListingStatus } from '../../../context/ProductListingContext';
import { useSellerRegistration } from '../../../context/SellerRegistrationContext';
import toast from 'react-hot-toast';
import { 
  Plus, Package, Clock, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, 
  Search, Filter, Calendar, Tag, Warehouse, ChevronRight, FileText, Lock, Unlock, Eye, X, Archive
} from 'lucide-react';

export default function SellerProductDashboard() {
  const navigate = useNavigate();
  const { listings, updateHarvestAndReconcile, archiveListing } = useProductListing();
  const { applications } = useSellerRegistration();

  const myApp = applications[0];

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal State for Stage 2 & 3 Harvest Reconciliation
  const [reconcileModalListing, setReconcileModalListing] = useState<ProductListing | null>(null);
  const [actualHarvestQty, setActualHarvestQty] = useState<number>(10);
  const [lotBatchNumber, setLotBatchNumber] = useState<string>('');
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Modal State for Audit Trail Drawer
  const [auditListing, setAuditListing] = useState<ProductListing | null>(null);

  // Filter listings for current seller (or all mock listings for demo)
  const sellerListings = listings.filter(l => {
    const matchesSearch = 
      l.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.listingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.lotBatchNumber && l.lotBatchNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || l.listingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics Metrics
  const totalListings = listings.length;
  const activeListings = listings.filter(l => ['PRE_BOOKING_OPEN', 'READY_STOCK', 'PARTIALLY_RESERVED'].includes(l.listingStatus)).length;
  const pendingApprovals = listings.filter(l => l.listingStatus === 'PENDING_APPROVAL').length;
  const preBookingQty = listings.filter(l => l.listingType === 'PRE_BOOKING').reduce((acc, l) => acc + l.estimatedQuantity, 0);
  const readyStockQty = listings.filter(l => l.listingType === 'READY_STOCK').reduce((acc, l) => acc + (l.actualHarvestQuantity || 0), 0);
  const reservedQty = listings.reduce((acc, l) => acc + l.reservedQuantity, 0);

  // Handle Harvest Reconciliation Trigger
  const handleOpenReconcile = (listing: ProductListing) => {
    setReconcileModalListing(listing);
    setActualHarvestQty(listing.estimatedQuantity);
    setLotBatchNumber(`LOT-${new Date().getFullYear()}-${listing.commodity.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleConfirmReconciliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reconcileModalListing) return;

    if (actualHarvestQty <= 0) {
      toast.error('Please enter a valid Actual Harvest Quantity.');
      return;
    }
    if (!lotBatchNumber.trim()) {
      toast.error('Lot/Batch Number is mandatory for harvested Ready Stock.');
      return;
    }

    updateHarvestAndReconcile(reconcileModalListing.id, {
      actualHarvestQuantity: Number(actualHarvestQty),
      lotBatchNumber,
      harvestDate
    });

    toast.success(`Inventory Reconciled! Harvest of ${actualHarvestQty} MT updated with Lot #${lotBatchNumber}. Stock has been auto-balanced.`);
    setReconcileModalListing(null);
  };

  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case 'PRE_BOOKING_OPEN':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold rounded-full">Pre-Booking Open</span>;
      case 'READY_STOCK':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold rounded-full">Ready Stock</span>;
      case 'PENDING_APPROVAL':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-extrabold rounded-full">Pending Dept Approval</span>;
      case 'PARTIALLY_RESERVED':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-extrabold rounded-full">Partially Reserved</span>;
      case 'FULLY_RESERVED':
        return <span className="px-2.5 py-1 bg-orange-100 text-orange-800 border border-orange-300 text-[10px] font-extrabold rounded-full">Fully Reserved</span>;
      case 'RETURNED':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 border border-yellow-300 text-[10px] font-extrabold rounded-full">Returned by Dept</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 bg-red-100 text-red-800 border border-red-300 text-[10px] font-extrabold rounded-full">Rejected</span>;
      case 'ARCHIVED':
        return <span className="px-2.5 py-1 bg-slate-200 text-slate-700 text-[10px] font-extrabold rounded-full">Archived</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-extrabold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Top Navigation & Action Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <Package className="w-7 h-7 mr-3 text-emerald-700" />
            Seller Product & Inventory Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            3-Stage Inventory Lifecycle Management • Scope Certificate Gate • Automatic Stock Reconciliation
          </p>
        </div>

        <button 
          onClick={() => navigate('/dashboard/products/create')}
          className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Product Listing
        </button>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Listings</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{totalListings}</span>
        </div>
        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Active Listings</span>
          <span className="text-xl font-black text-emerald-900 mt-1 block">{activeListings}</span>
        </div>
        <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Pending Approval</span>
          <span className="text-xl font-black text-blue-900 mt-1 block">{pendingApprovals}</span>
        </div>
        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Pre-Booking Stock</span>
          <span className="text-xl font-black text-amber-900 mt-1 block">{preBookingQty} <span className="text-xs font-normal">MT</span></span>
        </div>
        <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">Ready Physical Stock</span>
          <span className="text-xl font-black text-teal-900 mt-1 block">{readyStockQty} <span className="text-xs font-normal">MT</span></span>
        </div>
        <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Reserved Inventory</span>
          <span className="text-xl font-black text-purple-900 mt-1 block">{reservedQty} <span className="text-xs font-normal">MT</span></span>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input 
            type="text" 
            placeholder="Search by Listing Code, Commodity, Variety, Lot/Batch #..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Status:</span>
          {['ALL', 'PRE_BOOKING_OPEN', 'READY_STOCK', 'PENDING_APPROVAL', 'RETURNED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors ${statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN INVENTORY TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center">
            <Warehouse className="w-4 h-4 text-emerald-700 mr-2" />
            Organic Product Inventory & Scope Certificate Ledger
          </h3>
          <span className="text-xs text-slate-400 font-mono">Showing {sellerListings.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 text-[11px] uppercase font-bold text-slate-600 border-b border-slate-200">
                <th className="p-4">Listing & Commodity</th>
                <th className="p-4">Traceability & Scope Cert</th>
                <th className="p-4">Type & Grade</th>
                <th className="p-4 text-center">Available Stock</th>
                <th className="p-4 text-center">Reserved Stock</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {sellerListings.map(listing => (
                <tr key={listing.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Commodity & Code */}
                  <td className="p-4">
                    <span className="font-mono text-[10px] font-bold text-slate-400 block">{listing.listingCode}</span>
                    <span className="font-extrabold text-slate-900 text-sm block">{listing.commodity}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{listing.variety} ({listing.district})</span>
                  </td>

                  {/* Traceability */}
                  <td className="p-4">
                    <span className="font-mono font-bold text-emerald-700 block text-[11px]">SC #{listing.scopeCertNumber}</span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {listing.growerGroupCode || 'Direct ICS Seller'}
                    </span>
                    {listing.lotBatchNumber && (
                      <span className="inline-block mt-1 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        Lot: {listing.lotBatchNumber}
                      </span>
                    )}
                  </td>

                  {/* Type & Grade */}
                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block mb-1 ${listing.listingType === 'PRE_BOOKING' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'}`}>
                      {listing.listingType === 'PRE_BOOKING' ? 'Pre-Booking' : 'Ready Spot Stock'}
                    </span>
                    <span className="text-[11px] text-slate-700 font-semibold block">{listing.grade}</span>
                  </td>

                  {/* Available Stock */}
                  <td className="p-4 text-center">
                    <span className="text-sm font-black text-slate-900 block">{listing.availableQuantity} {listing.unitOfMeasure}</span>
                    <span className="text-[10px] text-slate-400 block">
                      {listing.listingType === 'PRE_BOOKING' ? `Est: ${listing.estimatedQuantity} MT` : `Actual: ${listing.actualHarvestQuantity} MT`}
                    </span>
                  </td>

                  {/* Reserved Stock */}
                  <td className="p-4 text-center">
                    <span className="text-sm font-bold text-purple-700 block">{listing.reservedQuantity} {listing.unitOfMeasure}</span>
                    <span className="text-[10px] text-slate-400 block">Pre-Booked</span>
                  </td>

                  {/* Status */}
                  <td className="p-4 text-center">
                    {getStatusBadge(listing.listingStatus)}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right space-x-2">
                    {/* Stage 2 & 3 Reconciliation Trigger */}
                    {listing.listingType === 'PRE_BOOKING' && (
                      <button 
                        onClick={() => handleOpenReconcile(listing)}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-extrabold rounded-lg shadow-xs transition-colors inline-flex items-center gap-1"
                        title="Update harvest yield and trigger automatic inventory reconciliation"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Reconcile Harvest
                      </button>
                    )}

                    <button 
                      onClick={() => setAuditListing(listing)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center"
                      title="View Lifecycle Audit Trail"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: STAGE 2 & 3 HARVEST RECONCILIATION MODAL */}
      {reconcileModalListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-6 border border-slate-200">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                  Stage 2 & 3 Automatic Reconciliation
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Harvest Yield Update: {reconcileModalListing.commodity}
                </h3>
                <p className="text-xs text-slate-500">Ref: {reconcileModalListing.listingCode}</p>
              </div>
              <button onClick={() => setReconcileModalListing(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReconciliation} className="space-y-4">
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Original Pre-Booking Estimate:</span>
                  <span className="font-bold text-slate-900">{reconcileModalListing.estimatedQuantity} MT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reserved Pre-Booked Stock:</span>
                  <span className="font-bold text-purple-700">{reconcileModalListing.reservedQuantity} MT (Locked)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Actual Harvested Quantity (MT) *
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={actualHarvestQty}
                  onChange={e => setActualHarvestQty(Number(e.target.value))}
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mandatory Harvest Lot / Batch Number *
                </label>
                <input 
                  type="text" 
                  value={lotBatchNumber}
                  onChange={e => setLotBatchNumber(e.target.value)}
                  placeholder="e.g. LOT-2026-SKM-889"
                  className="w-full p-3 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Harvest Completion Date
                </label>
                <input 
                  type="date" 
                  value={harvestDate}
                  onChange={e => setHarvestDate(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              {/* Live Preview Calculation */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                <span className="font-bold block">✓ Automatic Reconciliation Formula:</span>
                <p>
                  • <strong>{reconcileModalListing.reservedQuantity} MT</strong> will be locked & allocated to pre-booked buyers.<br />
                  • <strong>{Math.max(0, actualHarvestQty - reconcileModalListing.reservedQuantity)} MT</strong> will automatically become open for Spot Sale.
                </p>
              </div>

              <div className="flex justify-end space-x-3 border-t pt-4">
                <button 
                  type="button" 
                  onClick={() => setReconcileModalListing(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-md transition-colors"
                >
                  Confirm & Reconcile Inventory
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AUDIT TRAIL DRAWER */}
      {auditListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-6 border border-slate-200">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
                  Audit Log & Traceability Chain
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Lifecycle Audit Trail: {auditListing.commodity} ({auditListing.listingCode})
                </h3>
              </div>
              <button onClick={() => setAuditListing(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {auditListing.auditTrail.map((log, idx) => (
                <div key={log.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs relative pl-8">
                  <div className="absolute left-3 top-4 w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900">{log.actionBy} ({log.role})</span>
                    <span className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 my-1">
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold">{log.previousStatus}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-extrabold">{log.newStatus}</span>
                  </div>
                  {log.remarks && <p className="text-slate-600 mt-1 text-[11px] italic">"{log.remarks}"</p>}
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t pt-4">
              <button 
                onClick={() => setAuditListing(null)} 
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close Audit History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
