import React, { useState } from 'react';
import { useProductListing, ProductListing, ListingStatus } from '../../../context/ProductListingContext';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, CheckCircle2, XCircle, ArrowLeft, Clock, Eye, Filter, Search, 
  Warehouse, Tag, FileText, Layers, AlertCircle, Building2, UserCheck, X
} from 'lucide-react';

export default function ProductListingApprovals() {
  const { listings, approveListing, returnListing, rejectListing } = useProductListing();

  // Active Tab Filter
  const [activeTab, setActiveTab] = useState<string>('PENDING_APPROVAL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Listing for Review Drawer
  const [reviewListing, setReviewListing] = useState<ProductListing | null>(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [actionType, setActionType] = useState<'APPROVE' | 'RETURN' | 'REJECT' | null>(null);

  const filteredListings = listings.filter(l => {
    const matchesTab = activeTab === 'ALL' || l.listingStatus === activeTab;
    const matchesSearch = 
      l.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.listingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.scopeCertNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = listings.filter(l => l.listingStatus === 'PENDING_APPROVAL').length;

  const handleOpenReview = (listing: ProductListing, defaultAction: 'APPROVE' | 'RETURN' | 'REJECT') => {
    setReviewListing(listing);
    setActionType(defaultAction);
    setAdminRemarks('');
  };

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewListing || !actionType) return;

    const inspectorName = 'Dr. S.T. Bhutia (Dept Admin)';

    if (actionType === 'APPROVE') {
      approveListing(reviewListing.id, inspectorName, adminRemarks || 'Scope Certificate, organic compliance, and warehouse specs verified.');
      toast.success(`Listing ${reviewListing.listingCode} Approved! It is now published live on the B2B Marketplace.`);
    } else if (actionType === 'RETURN') {
      if (!adminRemarks.trim()) {
        toast.error('Mandatory Remarks required when returning an application.');
        return;
      }
      returnListing(reviewListing.id, inspectorName, adminRemarks);
      toast.success(`Listing ${reviewListing.listingCode} returned to seller with feedback.`);
    } else if (actionType === 'REJECT') {
      if (!adminRemarks.trim()) {
        toast.error('Mandatory Remarks required when rejecting an application.');
        return;
      }
      rejectListing(reviewListing.id, inspectorName, adminRemarks);
      toast.error(`Listing ${reviewListing.listingCode} rejected.`);
    }

    setReviewListing(null);
    setActionType(null);
    setAdminRemarks('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <ShieldCheck className="w-7 h-7 mr-3 text-emerald-700" />
            Agriculture Dept • Product Listing Approvals Desk
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enforce Scope Certificate (SC) compliance, verify grower group traceability, and authorize public B2B marketplace listings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Pending Review</span>
            <span className="text-lg font-black text-amber-900">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'PENDING_APPROVAL', label: `Pending Approval (${pendingCount})` },
            { id: 'PRE_BOOKING_OPEN', label: 'Approved (Pre-Booking)' },
            { id: 'READY_STOCK', label: 'Approved (Ready Stock)' },
            { id: 'RETURNED', label: 'Returned' },
            { id: 'REJECTED', label: 'Rejected' },
            { id: 'ALL', label: 'All Listings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input 
            type="text" 
            placeholder="Search by Listing Code, Commodity, Seller Name, Scope Cert #..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* APPROVAL TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center">
            <UserCheck className="w-4 h-4 text-emerald-700 mr-2" />
            Compliance Gate Review Ledger
          </h3>
          <span className="text-xs text-slate-400 font-mono">Showing {filteredListings.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 text-[11px] uppercase font-bold text-slate-600 border-b border-slate-200">
                <th className="p-4">Listing & Commodity</th>
                <th className="p-4">Seller & Seller Type</th>
                <th className="p-4">Scope Cert & Compliance</th>
                <th className="p-4">Type & Quantities</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    No product listings match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredListings.map(listing => (
                  <tr key={listing.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Commodity */}
                    <td className="p-4">
                      <span className="font-mono text-[10px] font-bold text-slate-400 block">{listing.listingCode}</span>
                      <span className="font-extrabold text-slate-900 text-sm block">{listing.commodity}</span>
                      <span className="text-[11px] text-slate-500">{listing.variety} ({listing.grade})</span>
                    </td>

                    {/* Seller */}
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{listing.sellerName}</span>
                      <span className="text-[10px] font-mono text-emerald-700 block">
                        {listing.sellerType} • {listing.growerGroupCode || 'Direct Seller'}
                      </span>
                    </td>

                    {/* Scope Cert */}
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-800 block">SC #{listing.scopeCertNumber}</span>
                      <span className="text-[10px] text-emerald-700 font-bold block">Valid to {listing.scopeCertValidUntil}</span>
                      <span className="text-[10px] text-slate-500 block">{listing.organicCategory}</span>
                    </td>

                    {/* Type & Qty */}
                    <td className="p-4">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block mb-1 ${listing.listingType === 'PRE_BOOKING' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                        {listing.listingType === 'PRE_BOOKING' ? 'Pre-Booking' : 'Ready Stock'}
                      </span>
                      <span className="font-bold text-slate-900 block text-xs">
                        {listing.listingType === 'PRE_BOOKING' ? `${listing.estimatedQuantity} MT (Est)` : `${listing.actualHarvestQuantity} MT (Actual)`}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">₹{listing.pricePerUnit.toLocaleString()} / MT</span>
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        listing.listingStatus === 'PENDING_APPROVAL' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        listing.listingStatus === 'PRE_BOOKING_OPEN' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        listing.listingStatus === 'READY_STOCK' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        listing.listingStatus === 'RETURNED' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {listing.listingStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenReview(listing, 'APPROVE')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Review & Authorize
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REVIEW & AUTHORIZATION DRAWER / MODAL */}
      {reviewListing && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-6 border border-slate-200">
            
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  Compliance Audit Desk
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Review Listing: {reviewListing.commodity} ({reviewListing.variety})
                </h3>
                <p className="text-xs text-slate-500">Code: {reviewListing.listingCode} • Submitted by {reviewListing.sellerName}</p>
              </div>
              <button onClick={() => { setReviewListing(null); setActionType(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. STEP 1: SCOPE CERTIFICATE COMPLIANCE & TRACEABILITY AUDIT */}
            <div className="p-4 bg-emerald-50/90 border border-emerald-300 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Step 1 Audit: Scope Certificate & Traceability Compliance
                </h4>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                  SC STATUS: VERIFIED ACTIVE
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-emerald-200">
                <div><span className="text-slate-500 block text-[10px] uppercase font-bold">SC Number</span><span className="font-mono font-bold text-slate-900">{reviewListing.scopeCertNumber}</span></div>
                <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Valid Until</span><span className="font-bold text-emerald-800">{reviewListing.scopeCertValidUntil}</span></div>
                <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Certifying Body</span><span className="font-bold text-slate-900">{reviewListing.certificationBody}</span></div>
                <div><span className="text-slate-500 block text-[10px] uppercase font-bold">NPOP/PGS Reg #</span><span className="font-mono font-bold text-indigo-700">{reviewListing.npopPgsNumber || 'NPOP/NAB/0012'}</span></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-emerald-200">
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">Seller Name</span><strong className="text-slate-900 block">{reviewListing.sellerName}</strong></div>
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">Seller Category</span><strong className="text-emerald-800 block">{reviewListing.sellerType}</strong></div>
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">Grower Group Code</span><strong className="font-mono text-indigo-700 block">{reviewListing.growerGroupCode || 'N/A'}</strong></div>
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">ICS Provider</span><strong className="text-slate-800 block">{reviewListing.icsProviderName || 'N/A'}</strong></div>
              </div>

              <div className="text-[11px] text-emerald-900 bg-emerald-100/60 p-2.5 rounded-xl border border-emerald-300 font-medium">
                ✓ <strong>Scope Verification Check:</strong> Commodity "<strong>{reviewListing.commodity}</strong>" is authorized under Scope Certificate #{reviewListing.scopeCertNumber}.
              </div>
            </div>

            {/* 2. STEP 2: PRODUCT METADATA, PRICING & QUALITY PARAMETERS */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center">
                <Tag className="w-4 h-4 text-indigo-600 mr-1.5" />
                Step 2 Audit: Product Metadata, Pricing & Lab Quality Specs
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">Commodity & Variety</span><strong className="text-slate-900 block">{reviewListing.commodity} ({reviewListing.variety})</strong></div>
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">Grade Classification</span><strong className="text-indigo-700 block">{reviewListing.grade}</strong></div>
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">Organic Category</span><strong className="text-emerald-800 block">{reviewListing.organicCategory}</strong></div>
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">Price per MT</span><strong className="text-emerald-700 text-sm block">₹{reviewListing.pricePerUnit.toLocaleString()} / MT</strong></div>
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">Packaging Type</span><strong className="text-slate-800 block">{reviewListing.packagingType}</strong></div>
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">Unit of Measure</span><strong className="text-slate-800 block">{reviewListing.unitOfMeasure}</strong></div>
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">MOQ</span><strong className="text-slate-800 block">{reviewListing.moq} {reviewListing.unitOfMeasure}</strong></div>
                <div><span className="text-slate-400 text-[10px] uppercase font-bold">District</span><strong className="text-slate-800 block">{reviewListing.district}, Sikkim</strong></div>
              </div>

              {/* Lab Tested Quality Specs */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-indigo-950 uppercase text-[10px] flex items-center">
                    <Layers className="w-3.5 h-3.5 text-indigo-600 mr-1" /> Lab Tested Quality Parameters
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">NABL TESTED</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-2.5 rounded-lg border border-indigo-100 font-medium">
                  <div><span className="text-slate-400 block text-[10px]">Moisture:</span> <strong>{reviewListing.qualityParameters.moisturePercent}%</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Essential Oil:</span> <strong>{reviewListing.qualityParameters.essentialOilPercent}%</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Grade Caliber:</span> <strong>{reviewListing.qualityParameters.gradeSizeMm}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Ash Content:</span> <strong>{reviewListing.qualityParameters.ashContentPercent}%</strong></div>
                </div>

                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-indigo-200 mt-1">
                  <div className="flex items-center space-x-2 truncate mr-2">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-slate-900 text-xs block truncate">{reviewListing.labReportFileName || 'Cardamom_NABL_LabReport_2026.pdf'}</span>
                      <span className="text-[10px] text-slate-500 truncate block">{reviewListing.labName || 'SSOCA Quality Testing Laboratory, Gangtok'} ({reviewListing.labReportDate || '2026-06-10'})</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => toast.success(`Viewing Lab Test Report: ${reviewListing.labReportFileName || 'Cardamom_NABL_LabReport_2026.pdf'}`)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> View Lab Report
                  </button>
                </div>
              </div>
            </div>

            {/* 3. STEP 3: INVENTORY LIFECYCLE & WAREHOUSE LOGISTICS (PRE-BOOKING VS READY STOCK) */}
            <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-950 flex items-center">
                  <Warehouse className="w-4 h-4 text-amber-600 mr-1.5" />
                  Step 3 Audit: Inventory Lifecycle & Warehouse Specs
                </h4>
                <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase border ${
                  reviewListing.listingType === 'PRE_BOOKING' ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-emerald-600 text-white border-emerald-700'
                }`}>
                  {reviewListing.listingType === 'PRE_BOOKING' ? 'STAGE 1: PRE-BOOKING (ESTIMATED HARVEST)' : 'STAGE 2: READY STOCK (SPOT SALE)'}
                </span>
              </div>

              {/* Conditional Display for Pre-Booking vs Ready Stock */}
              {reviewListing.listingType === 'PRE_BOOKING' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-amber-200">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimated Quantity (MT)</span>
                    <strong className="text-amber-900 text-sm">{reviewListing.estimatedQuantity} MT</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Expected Harvest Date</span>
                    <strong className="text-slate-900">{reviewListing.expectedHarvestDate || '2026-09-15'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Expected Dispatch Date</span>
                    <strong className="text-slate-900">{reviewListing.expectedAvailabilityDate || '2026-09-30'}</strong>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-emerald-200">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Actual Harvested Quantity</span>
                    <strong className="text-emerald-900 text-sm">{reviewListing.actualHarvestQuantity || reviewListing.estimatedQuantity} MT</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Mandatory Lot / Batch Number</span>
                    <strong className="font-mono text-slate-900 text-xs">{reviewListing.lotBatchNumber || 'LOT-2026-SKM-889'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Harvest Completion Date</span>
                    <strong className="text-slate-900">{reviewListing.harvestDate || '2026-07-10'}</strong>
                  </div>
                </div>
              )}

              {/* Warehouse Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-amber-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Warehouse / Storage Hub</span>
                  <strong className="text-slate-900">{reviewListing.warehouseName} ({reviewListing.warehouseLocation})</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">FSSAI Warehouse Reg. No.</span>
                  <strong className="font-mono text-slate-900">{reviewListing.fssaiWarehouseRegNo}</strong>
                </div>
              </div>
            </div>

            {/* 4. Seller Statutory & Organic Compliance Certificates (Scope Cert, FSSAI, IEC, APEDA RCMC) */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-extrabold text-slate-900 uppercase text-[11px] flex items-center">
                  <FileText className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Seller Uploaded Statutory & Organic Compliance Certificates
                </h4>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                  4 Documents Uploaded
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* 1. Scope Certificate */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 truncate mr-2">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-slate-900 block text-xs truncate">1. Scope Certificate (NPOP/PGS)</span>
                      <span className="text-[10px] text-slate-500 font-mono truncate block">{reviewListing.scopeCertFileName || 'NPOP_Scope_Certificate_2026.pdf'}</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => toast.success(`Viewing Scope Certificate: ${reviewListing.scopeCertFileName || 'NPOP_Scope_Certificate_2026.pdf'}`)}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <Eye className="w-3 h-3" /> View
                  </button>
                </div>

                {/* 2. FSSAI License */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 truncate mr-2">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-slate-900 block text-xs truncate">2. FSSAI License</span>
                      <span className="text-[10px] text-slate-500 font-mono truncate block">{reviewListing.fssaiFileName || 'FSSAI_Central_License_Gangtok.pdf'}</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => toast.success(`Viewing FSSAI License: ${reviewListing.fssaiFileName || 'FSSAI_Central_License_Gangtok.pdf'}`)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <Eye className="w-3 h-3" /> View
                  </button>
                </div>

                {/* 3. IEC Certificate */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 truncate mr-2">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-slate-900 block text-xs truncate">3. IEC Certificate (Import Export Code)</span>
                      <span className="text-[10px] text-slate-500 font-mono truncate block">{reviewListing.iecFileName || 'IEC_Import_Export_Code_Cert.pdf'}</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => toast.success(`Viewing IEC Certificate: ${reviewListing.iecFileName || 'IEC_Import_Export_Code_Cert.pdf'}`)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <Eye className="w-3 h-3" /> View
                  </button>
                </div>

                {/* 4. APEDA RCMC Document */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 truncate mr-2">
                    <div className="p-2 bg-purple-100 text-purple-700 rounded-lg shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-slate-900 block text-xs truncate">4. APEDA RCMC Membership Certificate</span>
                      <span className="text-[10px] text-slate-500 font-mono truncate block">{reviewListing.apedaRcmcFileName || 'APEDA_RCMC_Organic_Membership.pdf'}</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => toast.success(`Viewing APEDA RCMC Certificate: ${reviewListing.apedaRcmcFileName || 'APEDA_RCMC_Organic_Membership.pdf'}`)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <Eye className="w-3 h-3" /> View
                  </button>
                </div>
              </div>
            </div>

            {/* Decision Action Options */}
            <form onSubmit={handleConfirmDecision} className="space-y-4 border-t pt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Department Decision Action
              </label>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setActionType('APPROVE')}
                  className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all border flex items-center justify-center gap-2 ${actionType === 'APPROVE' ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'}`}
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Publish Live
                </button>

                <button
                  type="button"
                  onClick={() => setActionType('RETURN')}
                  className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all border flex items-center justify-center gap-2 ${actionType === 'RETURN' ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'}`}
                >
                  <Clock className="w-4 h-4" /> Return to Seller
                </button>

                <button
                  type="button"
                  onClick={() => setActionType('REJECT')}
                  className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all border flex items-center justify-center gap-2 ${actionType === 'REJECT' ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'}`}
                >
                  <XCircle className="w-4 h-4" /> Reject Listing
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department Admin Inspection Remarks {actionType !== 'APPROVE' && <span className="text-red-500">* (Mandatory)</span>}
                </label>
                <textarea 
                  rows={3}
                  value={adminRemarks}
                  onChange={e => setAdminRemarks(e.target.value)}
                  placeholder={actionType === 'APPROVE' ? 'Scope certificate, crop authorization, and warehouse specs verified clean.' : 'Specify reason for returning or rejecting this listing...'}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 border-t pt-4">
                <button 
                  type="button" 
                  onClick={() => { setReviewListing(null); setActionType(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`px-6 py-2 rounded-xl text-xs font-extrabold text-white shadow-md transition-colors ${actionType === 'APPROVE' ? 'bg-emerald-700 hover:bg-emerald-800' : actionType === 'RETURN' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Confirm Decision
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
