import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerRegistration } from '../../../context/SellerRegistrationContext';
import { useProductListing, ListingType, OrganicCategory } from '../../../context/ProductListingContext';
import toast from 'react-hot-toast';
import {
  ShieldCheck, AlertCircle, Leaf, CheckCircle2, ChevronRight, ChevronLeft,
  UploadCloud, Warehouse, Calendar, Layers, Tag, DollarSign, Package, Lock, FileText, ArrowLeft
} from 'lucide-react';

export default function CreateProductListing() {
  const navigate = useNavigate();
  const { applications } = useSellerRegistration();
  const { createListing, getSellerScopeCertCrops } = useProductListing();

  const myApp = applications[0]; // Seller's application

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    sellerType: (myApp?.sellerType || 'ICS') as 'ICS' | 'Individual Farmer' | 'IFFCO',
    growerGroupCode: 'GG-GANGTOK-012',
    icsProviderName: 'Sikkim Organic Alive ICS Unit',
    scopeCertNumber: myApp?.scopeCertNumber || 'ORG/SC/2026/001',
    scopeCertValidUntil: '2027-06-30',
    certificationBody: myApp?.certificationBody || 'Sikkim State Organic Certification Agency (SSOCA)',
    npopPgsNumber: 'NPOP/NAB/0012',

    // Listing details
    commodity: '',
    variety: '',
    hsCode: '09083110',
    grade: 'Grade A++' as 'Grade A++' | 'Premium' | 'Superior' | 'Standard',
    organicCategory: 'NPOP Certified 100% Organic' as OrganicCategory,
    packagingType: 'Jute Bag (50kg)' as any,
    unitOfMeasure: 'MT' as 'MT' | 'Quintal' | 'KG',
    moq: 1,
    pricePerUnit: 180000,
    description: '',

    // Quality Parameters
    moisturePercent: 10.0,
    gradeSizeMm: '8mm - 10mm',
    essentialOilPercent: 2.5,
    colorGrade: 'Standard Organic Natural',
    ashContentPercent: 3.0,
    labReportFileName: 'Cardamom_NABL_LabReport_2026.pdf',
    labName: 'SSOCA Quality Testing Laboratory, Gangtok',
    labReportDate: new Date().toISOString().split('T')[0],

    // Warehouse & Location
    warehouseName: 'Gangtok Organic Logistics & Cold Storage Hub',
    warehouseLocation: 'Zero Point, Gangtok, East Sikkim',
    district: myApp?.district || 'Gangtok',
    fssaiWarehouseRegNo: '11419850000102',

    // Listing Type & Quantities
    listingType: 'PRE_BOOKING' as ListingType,
    estimatedQuantity: 10,
    expectedHarvestDate: '2026-09-15',
    expectedAvailabilityDate: '2026-09-30',

    // Ready Stock optional fields
    actualHarvestQuantity: 10,
    lotBatchNumber: 'LOT-2026-SKM-001',
    harvestDate: new Date().toISOString().split('T')[0],

    // Images
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80'
    ]
  });

  // Approved commodities dynamically fetched from seller's verified Scope Certificate in Organization Registration
  const approvedCrops = (myApp?.scopeVerifiedCrops && myApp.scopeVerifiedCrops.length > 0)
    ? myApp.scopeVerifiedCrops
    : getSellerScopeCertCrops(formData.sellerType);

  useEffect(() => {
    if (approvedCrops.length > 0 && (!formData.commodity || !approvedCrops.includes(formData.commodity))) {
      setFormData(prev => ({ ...prev, commodity: approvedCrops[0] }));
    }
  }, [approvedCrops]);

  // Validation
  const isScopeCertValid = myApp ? myApp.status === 'Approved' : true; // Assuming approved for demo

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.commodity) {
        toast.error('Please select an approved commodity from your Scope Certificate.');
        return;
      }
      if (formData.sellerType === 'Individual Farmer' && !formData.growerGroupCode) {
        toast.error('Grower Group / Farmer Cluster Code is required for traceability.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.variety) {
        toast.error('Please enter the crop variety.');
        return;
      }
      if (formData.pricePerUnit <= 0) {
        toast.error('Please enter a valid price per unit.');
        return;
      }
    }
    if (currentStep === 3) {
      if (formData.listingType === 'PRE_BOOKING' && (!formData.estimatedQuantity || formData.estimatedQuantity <= 0)) {
        toast.error('Please enter a valid Estimated Quantity for pre-booking.');
        return;
      }
      if (formData.listingType === 'READY_STOCK') {
        if (!formData.actualHarvestQuantity || formData.actualHarvestQuantity <= 0) {
          toast.error('Please enter Actual Harvest Quantity for Ready Stock.');
          return;
        }
        if (!formData.lotBatchNumber.trim()) {
          toast.error('Lot/Batch Number is mandatory for Ready Stock / Spot Sale listings.');
          return;
        }
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.commodity || !approvedCrops.includes(formData.commodity)) {
      toast.error(`Commodity "${formData.commodity}" is not approved under your Scope Certificate.`);
      return;
    }

    createListing({
      sellerId: myApp?.id || 'SEL-2026-000101',
      sellerName: myApp?.legalName || 'Sikkim Organic Alive Pvt Ltd',
      sellerType: formData.sellerType,
      growerGroupCode: formData.growerGroupCode,
      icsProviderName: formData.icsProviderName,
      scopeCertNumber: formData.scopeCertNumber,
      scopeCertValidUntil: formData.scopeCertValidUntil,
      certificationBody: formData.certificationBody,
      npopPgsNumber: formData.npopPgsNumber,
      approvedCommoditiesInScope: approvedCrops,
      scopeCertFileName: myApp?.scopeCertFileName || 'NPOP_Scope_Certificate_2026.pdf',
      fssaiFileName: myApp?.fssaiFileName || 'FSSAI_Central_License_Gangtok.pdf',
      iecFileName: 'IEC_Import_Export_Code_Cert.pdf',
      apedaRcmcFileName: 'APEDA_RCMC_Organic_Membership.pdf',
      commodity: formData.commodity,
      variety: formData.variety,
      grade: formData.grade,
      organicCategory: formData.organicCategory,
      qualityParameters: {
        moisturePercent: formData.moisturePercent,
        gradeSizeMm: formData.gradeSizeMm,
        essentialOilPercent: formData.essentialOilPercent,
        colorGrade: formData.colorGrade,
        ashContentPercent: formData.ashContentPercent
      },
      labReportFileName: formData.labReportFileName,
      labName: formData.labName,
      labReportDate: formData.labReportDate,
      packagingType: formData.packagingType,
      unitOfMeasure: formData.unitOfMeasure,
      moq: Number(formData.moq),
      pricePerUnit: Number(formData.pricePerUnit),
      description: formData.description || `${formData.grade} Organic ${formData.commodity} (${formData.variety}) harvested in ${formData.district}, Sikkim.`,
      images: formData.images,
      warehouseName: formData.warehouseName,
      warehouseLocation: formData.warehouseLocation,
      district: formData.district,
      fssaiWarehouseRegNo: formData.fssaiWarehouseRegNo,
      listingType: formData.listingType,
      estimatedQuantity: Number(formData.estimatedQuantity),
      expectedHarvestDate: formData.listingType === 'PRE_BOOKING' ? formData.expectedHarvestDate : undefined,
      expectedAvailabilityDate: formData.listingType === 'PRE_BOOKING' ? formData.expectedAvailabilityDate : undefined,
      actualHarvestQuantity: formData.listingType === 'READY_STOCK' ? Number(formData.actualHarvestQuantity) : undefined,
      lotBatchNumber: formData.listingType === 'READY_STOCK' ? formData.lotBatchNumber : undefined,
      harvestDate: formData.listingType === 'READY_STOCK' ? formData.harvestDate : undefined
    });

    toast.success('Listing Submitted! Your product listing has been routed to Department Admin for approval.');
    navigate('/dashboard/products/manage');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">

      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/products/manage')}
          className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Product Management
        </button>
        <span className="text-xs font-mono bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-bold">
          Compliance Gate: Active Scope Certificate Verified
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-4 sm:p-8 rounded-2xl text-white shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/30 rounded-xl border border-emerald-400/40 shrink-0">
            <Leaf className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Create Product Listing</h1>
            <p className="text-emerald-200/80 text-xs sm:text-sm mt-0.5 sm:mt-1">
              Organic Inventory & Traceability Gate
            </p>
          </div>
        </div>

        {/* Wizard Stepper */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-emerald-700/50 pt-4 sm:pt-6">
          {[
            { step: 1, label: 'Scope Cert Gate' },
            { step: 2, label: 'Metadata & Quality' },
            { step: 3, label: 'Inventory & Warehouse' },
            { step: 4, label: 'Preview & Submit' }
          ].map(s => (
            <div key={s.step} className="flex items-center space-x-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${currentStep === s.step ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30' : currentStep > s.step ? 'bg-emerald-500 text-white' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-700'}`}>
                {currentStep > s.step ? '✓' : s.step}
              </div>
              <span className={`text-xs font-bold truncate ${currentStep === s.step ? 'text-amber-300' : 'text-emerald-200/70'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-8">

        <form onSubmit={handleSubmit}>

          {/* STEP 1: SCOPE CERTIFICATE COMPLIANCE & TRACEABILITY GATE */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mr-2" />
                    Step 1: Organic Scope Certificate Compliance Gate
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    System verifies your Scope Certificate (SC) and dynamically limits commodities to certified crops.
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full border border-emerald-200">
                  SC Status: ACTIVE
                </span>
              </div>

              {/* Scope Certificate Verification Card */}
              <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Scope Certificate No.</span>
                  <span className="text-sm font-mono font-extrabold text-slate-900">{formData.scopeCertNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Certifying Body</span>
                  <span className="text-xs font-bold text-slate-800">{formData.certificationBody}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Valid Until</span>
                  <span className="text-xs font-bold text-emerald-700">{formData.scopeCertValidUntil} (Active)</span>
                </div>
              </div>

              {/* Dynamic Commodity Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Approved Commodity (Filtered by Scope Certificate) *
                </label>
                <select
                  value={formData.commodity}
                  onChange={e => setFormData({ ...formData, commodity: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  {approvedCrops.map(crop => (
                    <option key={crop} value={crop}>
                      ✓ {crop} (Authorized under SC #{formData.scopeCertNumber})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Only commodities explicitly covered under your Scope Certificate are available for listing.
                </p>
              </div>

              {/* Traceability Details for Grower Groups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Seller Category
                  </label>
                  <select
                    value={formData.sellerType}
                    onChange={e => setFormData({ ...formData, sellerType: e.target.value as any })}
                    className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 font-semibold"
                  >
                    <option value="ICS">ICS Service Provider</option>
                    <option value="Individual Farmer">Individual Farmer / Grower Group</option>
                    <option value="IFFCO">IFFCO Organics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Grower Group / Farmer Cluster Code *
                  </label>
                  <input
                    type="text"
                    value={formData.growerGroupCode}
                    onChange={e => setFormData({ ...formData, growerGroupCode: e.target.value })}
                    placeholder="e.g. GG-NAMCHI-042"
                    className="w-full p-3 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Required for 100% backward traceability to farming cluster.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: METADATA, VARIETY, GRADE & QUALITY PARAMETERS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <Tag className="w-5 h-5 text-indigo-600 mr-2" />
                  Step 2: Product Metadata, Grade & Quality Specifications
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Specify variety, organic standard category, and lab quality test parameters.
                </p>
              </div>

              {/* Commodity, Variety, HS Code & Grade */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Commodity
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.commodity}
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Crop Variety *
                  </label>
                  <input
                    type="text"
                    value={formData.variety}
                    onChange={e => setFormData({ ...formData, variety: e.target.value })}
                    placeholder="e.g. Ramsay / Nadia / Lakadong"
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    HS Code (Harmonized System)
                  </label>
                  <input
                    type="text"
                    value={formData.hsCode}
                    onChange={e => setFormData({ ...formData, hsCode: e.target.value })}
                    placeholder="e.g. 09083110 / 09101110"
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm font-bold font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Grade Classification
                  </label>
                  <select
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value as any })}
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                  >
                    <option value="Grade A++">Grade A++ (Export Quality)</option>
                    <option value="Premium">Premium Grade</option>
                    <option value="Superior">Superior Grade</option>
                    <option value="Standard">Standard Grade</option>
                  </select>
                </div>
              </div>

              {/* Organic Category, Pricing & Lot/Batch Number */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    OC Category
                  </label>
                  <select
                    value={formData.organicCategory}
                    onChange={e => setFormData({ ...formData, organicCategory: e.target.value as any })}
                    className="w-full p-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="NPOP Certified 100% Organic">NPOP Certified 100% Organic</option>
                    <option value="PGS-India Organic">PGS-India Organic</option>
                    <option value="Jaivik Bharat Certified">Jaivik Bharat Certified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Packaging Type
                  </label>
                  <select
                    value={formData.packagingType}
                    onChange={e => setFormData({ ...formData, packagingType: e.target.value as any })}
                    className="w-full p-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="Jute Bag (50kg)">Jute Bag (50kg)</option>
                    <option value="Vacuum Sealed Foil (25kg)">Vacuum Sealed Foil (25kg)</option>
                    <option value="Corrugated Box (10kg)">Corrugated Box (10kg)</option>
                    <option value="HDPE Bag (50kg)">HDPE Bag (50kg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Expected Price per MT (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.pricePerUnit}
                    onChange={e => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
                    placeholder="e.g. 180000"
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Lot / Batch Number
                  </label>
                  <input
                    type="text"
                    value={formData.lotBatchNumber}
                    onChange={e => setFormData({ ...formData, lotBatchNumber: e.target.value })}
                    placeholder="e.g. LOT-2026-SKM-001"
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm font-bold font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Quality Parameters */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center">
                  <Layers className="w-4 h-4 mr-1.5 text-indigo-600" /> Lab Tested Quality Parameters
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Moisture %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.moisturePercent}
                      onChange={e => setFormData({ ...formData, moisturePercent: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Essential Oil %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.essentialOilPercent}
                      onChange={e => setFormData({ ...formData, essentialOilPercent: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Grade Size / Caliber</label>
                    <input
                      type="text"
                      value={formData.gradeSizeMm}
                      onChange={e => setFormData({ ...formData, gradeSizeMm: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ash Content %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.ashContentPercent}
                      onChange={e => setFormData({ ...formData, ashContentPercent: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                </div>

                {/* OFFICIAL LAB TEST REPORT FILE UPLOAD */}
                <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center">
                      <FileText className="w-4 h-4 text-emerald-600 mr-1.5" />
                      Official Lab Test Report Document (NABL / Certified Testing Lab) *
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">PDF, PNG, JPG (Max 5 MB)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Testing Laboratory Name</label>
                      <input
                        type="text"
                        value={formData.labName}
                        onChange={e => setFormData({ ...formData, labName: e.target.value })}
                        placeholder="e.g. NABL Accredited Quality Testing Lab, Gangtok"
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Report Issue Date</label>
                      <input
                        type="date"
                        value={formData.labReportDate}
                        onChange={e => setFormData({ ...formData, labReportDate: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Upload Box / Card */}
                  <div className="p-4 bg-white rounded-xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            {formData.labReportFileName || 'Upload Lab Test Report Certificate (.pdf)'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Buyers can view and download this report to verify quality specifications.
                          </span>
                        </div>
                      </div>

                      <label className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors">
                        Browse File
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              const f = e.target.files[0];
                              setFormData(prev => ({ ...prev, labReportFileName: f.name }));
                              toast.success(`Lab Test Report "${f.name}" uploaded successfully!`);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* STEP 3: INVENTORY LIFECYCLE & WAREHOUSE SPECS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <Warehouse className="w-5 h-5 text-amber-600 mr-2" />
                  Step 3: Listing Type, Inventory Specs & Warehouse Location
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose between Pre-Booking (Estimated Harvest) or Ready Stock (Spot Sale).
                </p>
              </div>

              {/* LISTING TYPE SELECTOR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setFormData({ ...formData, listingType: 'PRE_BOOKING' })}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.listingType === 'PRE_BOOKING' ? 'border-amber-500 bg-amber-50/60 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5 text-amber-600" /> Pre-Booking (Future Harvest)
                    </span>
                    <input type="radio" checked={formData.listingType === 'PRE_BOOKING'} readOnly className="text-amber-600 focus:ring-amber-500" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Publish estimated yield before harvest. Buyers reserve stock early against projected dates.
                  </p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, listingType: 'READY_STOCK' })}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.listingType === 'READY_STOCK' ? 'border-emerald-500 bg-emerald-50/60 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> Ready Stock (Spot Sale)
                    </span>
                    <input type="radio" checked={formData.listingType === 'READY_STOCK'} readOnly className="text-emerald-600 focus:ring-emerald-500" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Harvest completed and stored in warehouse. Requires mandatory Lot/Batch Number.
                  </p>
                </div>
              </div>

              {/* PRE-BOOKING CONDITIONAL FIELDS */}
              {formData.listingType === 'PRE_BOOKING' && (
                <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                    Stage 1: Pre-Booking Yield Estimates
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Quantity (MT) *</label>
                      <input
                        type="number"
                        value={formData.estimatedQuantity}
                        onChange={e => setFormData({ ...formData, estimatedQuantity: Number(e.target.value) })}
                        placeholder="e.g. 10"
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Expected Harvest Date</label>
                      <input
                        type="date"
                        value={formData.expectedHarvestDate}
                        onChange={e => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Expected Dispatch Date</label>
                      <input
                        type="date"
                        value={formData.expectedAvailabilityDate}
                        onChange={e => setFormData({ ...formData, expectedAvailabilityDate: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* READY STOCK CONDITIONAL FIELDS */}
              {formData.listingType === 'READY_STOCK' && (
                <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                    Stage 2: Harvested Physical Inventory Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Actual Harvest Quantity (MT) *</label>
                      <input
                        type="number"
                        value={formData.actualHarvestQuantity}
                        onChange={e => setFormData({ ...formData, actualHarvestQuantity: Number(e.target.value) })}
                        placeholder="e.g. 14"
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Lot / Batch Number *</label>
                      <input
                        type="text"
                        value={formData.lotBatchNumber}
                        onChange={e => setFormData({ ...formData, lotBatchNumber: e.target.value })}
                        placeholder="e.g. LOT-2026-SKM-889"
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Harvest Completion Date</label>
                      <input
                        type="date"
                        value={formData.harvestDate}
                        onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Warehouse & Storage Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Storage & Warehouse Logistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Warehouse / Cold Storage Name</label>
                    <input
                      type="text"
                      value={formData.warehouseName}
                      onChange={e => setFormData({ ...formData, warehouseName: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">FSSAI Warehouse Reg. No.</label>
                    <input
                      type="text"
                      value={formData.fssaiWarehouseRegNo}
                      onChange={e => setFormData({ ...formData, fssaiWarehouseRegNo: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: PREVIEW & SUBMIT */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2" />
                  Step 4: Review Product Listing & Scope Certificate Compliance
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Review all captured specs before routing to Agriculture Department Admin for approval.
                </p>
              </div>

              {/* Preview Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-slate-200 px-2.5 py-1 rounded-md text-slate-700">
                      {formData.sellerType} • {formData.growerGroupCode}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                      {formData.grade} {formData.commodity} ({formData.variety})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{formData.district}, Sikkim • Storage: {formData.warehouseName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-700">
                      ₹{formData.pricePerUnit.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ MT</span>
                    </span>
                    <span className="block text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 mt-1">
                      {formData.listingType === 'PRE_BOOKING' ? 'READY FOR PRE-BOOKING' : 'OPEN FOR SPOT SALE'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Scope Cert</span>
                    <span className="font-mono font-bold text-slate-900">{formData.scopeCertNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Category</span>
                    <span className="font-bold text-emerald-800">{formData.organicCategory}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Listing Qty</span>
                    <span className="font-bold text-slate-900">
                      {formData.listingType === 'PRE_BOOKING' ? `${formData.estimatedQuantity} MT (Est)` : `${formData.actualHarvestQuantity} MT (Actual)`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Batch / Lot #</span>
                    <span className="font-mono font-bold text-slate-900">{formData.lotBatchNumber || 'Pending Harvest'}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                  ✓ <strong>Compliance Routing:</strong> Upon submission, this listing will be placed in <code>PENDING_APPROVAL</code> status. Agriculture Department Admins will verify your Scope Certificate and activate the listing for public buyer discovery.
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center border-t border-slate-200 pt-6 mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Step
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 ml-auto"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 ml-auto"
              >
                <ShieldCheck className="w-5 h-5" /> Submit for Dept Approval
              </button>
            )}
          </div>

        </form>

      </div>

    </div>
  );
}
