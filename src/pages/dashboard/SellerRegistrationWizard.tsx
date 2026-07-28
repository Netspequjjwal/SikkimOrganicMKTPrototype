import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerRegistration, SellerType } from '../../context/SellerRegistrationContext';
import toast from 'react-hot-toast';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X, ChevronRight, ChevronLeft, Building2, Users, Leaf, Truck, ArrowLeft, ArrowRight, Save, Calendar } from 'lucide-react';

const STEPS = [
  'Seller Type',
  'Organization',
  'Compliance',
  'Statutory',
  'Infrastructure',
  'Documents',
  'Review & Submit'
];

const SellerRegistrationWizard: React.FC = () => {
  const navigate = useNavigate();
  const { addApplication } = useSellerRegistration();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    sellerType: 'ICS',
    legalName: 'Sikkim Organic Farmers Cooperative Society',
    tradeName: 'Sikkim Organics',
    orgType: 'Registered Legal Entity / Farmer Collective',
    establishmentYear: '2018',
    authorizedRep: 'Tenzing Bhutia',
    designation: 'Managing Director',
    mobile: '9876543210',
    altMobile: '9876543211',
    email: 'contact@sikkimorganicfarmers.com',
    registeredAddress: 'Zero Point, Near Secretariat',
    state: 'Sikkim',
    district: 'Gangtok',
    pinCode: '737101',
    businessActivities: ['Production', 'Aggregation', 'Trading'],
    scopeVerifiedCrops: ['Large Cardamom', 'Dzongu Ginger', 'Lakadong Turmeric', 'Buckwheat', 'Sikkim Mandarin', 'Dalle Khursani'],
    certificationSystem: 'NPOP',
    certificationBody: 'Sikkim State Organic Certification Agency (SSOCA)',
    scopeCertNumber: 'ORG/SC/2026/001',
    scopeCertValidityYear: '2026 - 2027 (Current Annual Cycle)',
    scopeCertIssueDate: '2026-04-01',
    scopeCertExpiryDate: '2027-03-31',
    yearWiseScopeCerts: [
      { year: '2025 - 2026', certNumber: 'ORG/SC/2025/084', validFrom: '2025-04-01', validTo: '2026-03-31' },
      { year: '2026 - 2027', certNumber: 'ORG/SC/2026/001', validFrom: '2026-04-01', validTo: '2027-03-31' }
    ],
    noOfFarmers: '125',
    cultivatedArea: '250',
    icsAvailability: true,
    gstin: '11AAAAA0000A1Z5',
    pan: 'AAAAA0000A',
    fssaiLicenseNumber: '11419850000001',
    fssaiExpiryDate: '2028-12-31',
    isExporting: true,
    iec: '0123456789',
    apedaRcmc: 'APEDA/RCMC/2026/1023',
    apedaRcmcExpiryDate: '2029-03-31',
    warehouseAvailability: true,
    processingUnit: false,
    coldStorage: true,
  });

  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [declarations, setDeclarations] = useState({ decl1: false, decl2: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customCropInput, setCustomCropInput] = useState('');

  const handleAddAnnualScopeCert = () => {
    const nextYearNum = 2027 + (formData.yearWiseScopeCerts?.length || 0) - 1;
    const newRecord = {
      year: `${nextYearNum} - ${nextYearNum + 1}`,
      certNumber: `ORG/SC/${nextYearNum}/099`,
      validFrom: `${nextYearNum}-04-01`,
      validTo: `${nextYearNum + 1}-03-31`
    };
    setFormData((prev: any) => ({
      ...prev,
      yearWiseScopeCerts: [...(prev.yearWiseScopeCerts || []), newRecord]
    }));
    toast.success(`Added Scope Certificate record for ${newRecord.year}`);
  };

  const handleRemoveAnnualScopeCert = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      yearWiseScopeCerts: (prev.yearWiseScopeCerts || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const handleAddCrop = (cropName: string) => {
    const trimmed = cropName.trim();
    if (!trimmed) return;
    const currentCrops = formData.scopeVerifiedCrops || [];
    if (!currentCrops.includes(trimmed)) {
      setFormData((prev: any) => ({
        ...prev,
        scopeVerifiedCrops: [...currentCrops, trimmed]
      }));
    }
    setCustomCropInput('');
  };

  const handleRemoveCrop = (cropName: string) => {
    const currentCrops = formData.scopeVerifiedCrops || [];
    setFormData((prev: any) => ({
      ...prev,
      scopeVerifiedCrops: currentCrops.filter((c: string) => c !== cropName)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === 'checkbox') {
      // Handle multi-select checkboxes for business activities
      if (name === 'businessActivities') {
        const currentActivities = [...formData.businessActivities];
        if (checked) currentActivities.push(value);
        else {
          const index = currentActivities.indexOf(value);
          if (index > -1) currentActivities.splice(index, 1);
        }
        setFormData((prev: any) => ({ ...prev, businessActivities: currentActivities }));
      } else if (name === 'scopeVerifiedCrops') {
        const currentCrops = [...(formData.scopeVerifiedCrops || [])];
        if (checked) currentCrops.push(value);
        else {
          const index = currentCrops.indexOf(value);
          if (index > -1) currentCrops.splice(index, 1);
        }
        setFormData((prev: any) => ({ ...prev, scopeVerifiedCrops: currentCrops }));
      } else {
        setFormData((prev: any) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles((prev: any) => ({ ...prev, [key]: file }));
    }
  };

  const removeFile = (key: string) => {
    setFiles((prev: any) => ({ ...prev, [key]: null }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 0 && !formData.sellerType) {
      newErrors.sellerType = 'Please select a seller type';
    }
    if (currentStep === 1) {
      if (!formData.legalName) newErrors.legalName = 'Required';
      if (!formData.authorizedRep) newErrors.authorizedRep = 'Required';
      if (!formData.mobile) newErrors.mobile = 'Required';
      if (!formData.district) newErrors.district = 'Required';
    }
    if (currentStep === 2) {
      if (formData.businessActivities.length === 0) newErrors.businessActivities = 'Select at least one';
      if (formData.sellerType === 'ICS' && !formData.scopeCertNumber) {
        newErrors.scopeCertNumber = 'Scope Certificate is required for ICS';
      }
    }
    if (currentStep === 3) {
      if (formData.isExporting) {
        if (!formData.iec) newErrors.iec = 'IEC required for export';
        if (!formData.apedaRcmc) newErrors.apedaRcmc = 'APEDA required for export';
      }
    }
    if (currentStep === 5) {
      // dynamic doc validation could go here
    }
    if (currentStep === 6) {
      if (!declarations.decl1 || !declarations.decl2) newErrors.decl = 'You must accept all declarations';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      const newApp = addApplication({
        sellerType: formData.sellerType as SellerType,
        legalName: formData.legalName,
        tradeName: formData.tradeName,
        orgType: formData.orgType,
        establishmentYear: formData.establishmentYear,
        authorizedRep: formData.authorizedRep,
        designation: formData.designation,
        mobile: formData.mobile,
        altMobile: formData.altMobile,
        email: formData.email,
        registeredAddress: formData.registeredAddress,
        state: formData.state,
        district: formData.district,
        pinCode: formData.pinCode,
        businessActivities: formData.businessActivities,
        certificationSystem: formData.certificationSystem,
        certificationBody: formData.certificationBody,
        scopeCertNumber: formData.scopeCertNumber,
        scopeVerifiedCrops: formData.scopeVerifiedCrops,
        noOfFarmers: Number(formData.noOfFarmers) || undefined,
        cultivatedArea: Number(formData.cultivatedArea) || undefined,
        icsAvailability: formData.icsAvailability,
        gstin: formData.gstin,
        pan: formData.pan,
        fssaiLicenseNumber: formData.fssaiLicenseNumber,
        isExporting: formData.isExporting,
        iec: formData.iec,
        apedaRcmc: formData.apedaRcmc,
        warehouseAvailability: formData.warehouseAvailability,
        processingUnit: formData.processingUnit,
        coldStorage: formData.coldStorage,
        // map files
        logoFileName: files.logo?.name,
        scopeCertFileName: files.scopeCert?.name,
        fssaiFileName: files.fssai?.name,
      });
      navigate(`/dashboard/registration-success`, { state: { id: newApp.id, type: 'seller' } });
    }
  };

  // --- Step Renders ---
  
  const renderStep0 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Select Seller Organization Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: 'ICS', title: 'ICS', icon: Building2, desc: 'Organizations managing Internal Control Systems for organic farmers.' },
          { id: 'Individual Farmer', title: 'Individual Farmer', icon: Users, desc: 'Individual farmers using the Scope/TC of their Grower Group.' },
          { id: 'IFFCO', title: 'IFFCO', icon: Truck, desc: 'Indian Farmers Fertiliser Cooperative Limited (Organic Division).' }
        ].map(type => (
          <div 
            key={type.id}
            onClick={() => setFormData({ ...formData, sellerType: type.id })}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${formData.sellerType === type.id ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200 hover:border-primary/50'}`}
          >
            <type.icon className={`w-10 h-10 mb-4 ${formData.sellerType === type.id ? 'text-primary' : 'text-gray-400'}`} />
            <h4 className="font-bold text-gray-900 mb-2">{type.title}</h4>
            <p className="text-sm text-gray-500">{type.desc}</p>
          </div>
        ))}
      </div>
      {errors.sellerType && <p className="text-red-500 text-sm mt-2">{errors.sellerType}</p>}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Organization Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Legal Entity Name *</label>
          <input type="text" name="legalName" value={formData.legalName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
          {errors.legalName && <p className="text-red-500 text-xs mt-1">{errors.legalName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Trade Name</label>
          <input type="text" name="tradeName" value={formData.tradeName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Organization Type</label>
          <select name="orgType" value={formData.orgType} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border">
            <option value="">Select Type</option>
            <option value="Multi-State Cooperative Society">Multi-State Cooperative Society</option>
            <option value="Registered Legal Entity / Farmer Collective">Registered Legal Entity / Farmer Collective</option>
            <option value="Internal Management System / Control Unit">Internal Management System / Control Unit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Authorized Representative *</label>
          <input type="text" name="authorizedRep" value={formData.authorizedRep} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
          {errors.authorizedRep && <p className="text-red-500 text-xs mt-1">{errors.authorizedRep}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile *</label>
          <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
          {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">District *</label>
          <select name="district" value={formData.district} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border">
            <option value="">Select District</option>
            <option value="Gangtok">Gangtok</option>
            <option value="Namchi">Namchi</option>
            <option value="Pakyong">Pakyong</option>
            <option value="Gyalshing">Gyalshing</option>
          </select>
          {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Business & Organic Compliance</h3>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Business Activities *</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Production', 'Aggregation', 'Processing', 'Packaging', 'Trading', 'Export'].map(act => (
            <label key={act} className="flex items-center space-x-2 text-sm">
              <input type="checkbox" name="businessActivities" value={act} checked={formData.businessActivities.includes(act)} onChange={handleInputChange} className="rounded text-primary focus:ring-primary" />
              <span>{act}</span>
            </label>
          ))}
        </div>
        {errors.businessActivities && <p className="text-red-500 text-xs mt-1">{errors.businessActivities}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Certification System</label>
          <select name="certificationSystem" value={formData.certificationSystem} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border">
            <option value="">Select System</option>
            <option value="NPOP">NPOP</option>
            <option value="PGS">PGS</option>
            <option value="Both">Both</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Active Scope Certificate Number *</label>
          <input type="text" name="scopeCertNumber" value={formData.scopeCertNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
          {errors.scopeCertNumber && <p className="text-red-500 text-xs mt-1">{errors.scopeCertNumber}</p>}
        </div>
      </div>

      {/* Scope Certificate Annual Validity & Expiry Period Box */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-200/80 pb-3 gap-2">
          <div>
            <h4 className="text-sm font-extrabold text-amber-950 flex items-center">
              <Calendar className="w-4 h-4 text-amber-700 mr-2 shrink-0" />
              Annual Scope Certificate Validity & Expiry Cycle *
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Scope Certificates expire annually under NPOP/PGS standards. Specify your active validity period and track year-wise certificates.
            </p>
          </div>
          <span className="bg-amber-200 text-amber-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto shrink-0">
            Annual Renewal Required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Active Annual Cycle *
            </label>
            <select
              name="scopeCertValidityYear"
              value={formData.scopeCertValidityYear || '2026 - 2027 (Current Annual Cycle)'}
              onChange={handleInputChange}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="2026 - 2027 (Current Annual Cycle)">2026 - 2027 (Current Cycle)</option>
              <option value="2025 - 2026 (Previous Cycle)">2025 - 2026 (Previous Cycle)</option>
              <option value="2027 - 2028 (Upcoming Cycle)">2027 - 2028 (Upcoming Cycle)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Issue Date (Valid From) *
            </label>
            <input
              type="date"
              name="scopeCertIssueDate"
              value={formData.scopeCertIssueDate || '2026-04-01'}
              onChange={handleInputChange}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Expiry Date (Valid Until) *
            </label>
            <input
              type="date"
              name="scopeCertExpiryDate"
              value={formData.scopeCertExpiryDate || '2027-03-31'}
              onChange={handleInputChange}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        {/* Year-wise Annual Scope Certificates History */}
        <div className="pt-3 border-t border-amber-200/80 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-slate-800">Year-Wise Scope Certificate History & Renewal Records:</span>
            <button
              type="button"
              onClick={handleAddAnnualScopeCert}
              className="text-[11px] font-extrabold text-amber-950 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-xl transition-colors flex items-center shadow-xs"
            >
              + Add Annual Scope Cert Record
            </button>
          </div>

          <div className="space-y-2">
            {(formData.yearWiseScopeCerts || []).map((item: any, idx: number) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-200">
                    Cycle: {item.year}
                  </span>
                  <span className="font-mono font-bold text-slate-900">{item.certNumber}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-600">
                  <span>Valid: <strong className="text-slate-900">{item.validFrom}</strong> to <strong className="text-slate-900">{item.validTo}</strong></span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAnnualScopeCert(idx)}
                    className="text-red-500 hover:text-red-700 font-extrabold text-xs"
                    title="Remove record"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scope Certified Organic Produces Hybrid Selector (Dropdown + Free Text) */}
      <div className="space-y-4 p-5 bg-emerald-50/80 border border-emerald-300 rounded-2xl">
        <div>
          <label className="block text-sm font-extrabold text-slate-900 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2"></span>
            Scope Certified Organic Produces Authorized for Listing *
          </label>
          <p className="text-xs text-slate-600 mt-1">
            Select items from the pre-filled dropdown list OR type custom produce names as authorized on your active Scope Certificate.
          </p>
        </div>

        {/* Selected Crops Chips List */}
        <div className="flex flex-wrap gap-2 min-h-[42px] p-3 bg-white rounded-xl border border-emerald-200">
          {(formData.scopeVerifiedCrops || []).length === 0 ? (
            <span className="text-xs text-slate-400 italic">No produces selected yet. Use the dropdown or text box below to add crops.</span>
          ) : (
            (formData.scopeVerifiedCrops || []).map((crop: string) => (
              <span key={crop} className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs">
                <span>✓ {crop}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveCrop(crop)}
                  className="w-4 h-4 rounded-full bg-emerald-800 hover:bg-emerald-900 flex items-center justify-center text-white text-[10px] font-extrabold"
                  title="Remove crop"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        {/* Input Controls: Pre-filled Dropdown + Free Text Add */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* 1. Pre-filled Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Select from Pre-filled Scope Produces
            </label>
            <select 
              onChange={e => {
                if (e.target.value) {
                  handleAddCrop(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Choose Pre-filled Produce --</option>
              {[
                'Large Cardamom', 'Dzongu Ginger', 'Lakadong Turmeric', 'Buckwheat', 
                'Sikkim Mandarin', 'Dalle Khursani', 'Passion Fruit', 'Cymbidium Orchid', 
                'Black Cardamom', 'Organic Honey', 'Temi Tea', 'Organic Rajma'
              ].filter(c => !(formData.scopeVerifiedCrops || []).includes(c)).map(c => (
                <option key={c} value={c}>+ {c}</option>
              ))}
            </select>
          </div>

          {/* 2. Free Text Custom Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Or Type Custom Produce Name
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customCropInput}
                onChange={e => setCustomCropInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCrop(customCropInput);
                  }
                }}
                placeholder="e.g. Organic Kiwi / Red Rice"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
              <button 
                type="button"
                onClick={() => handleAddCrop(customCropInput)}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs shrink-0"
              >
                + Add
              </button>
            </div>
          </div>
        </div>

        {errors.scopeVerifiedCrops && <p className="text-red-500 text-xs mt-1 font-bold">{errors.scopeVerifiedCrops}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Statutory & Export Compliance</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">GSTIN</label>
          <input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">FSSAI License Number</label>
          <input type="text" name="fssaiLicenseNumber" value={formData.fssaiLicenseNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">FSSAI License Expiry Date</label>
          <input type="date" name="fssaiExpiryDate" value={formData.fssaiExpiryDate || '2028-12-31'} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="flex items-center space-x-3 mb-4">
          <input type="checkbox" name="isExporting" checked={formData.isExporting} onChange={handleInputChange} className="w-5 h-5 rounded text-primary focus:ring-primary" />
          <span className="font-bold text-gray-900">Are you an Exporting Organization?</span>
        </label>
        
        {formData.isExporting && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">IEC (Import Export Code) *</label>
              <input type="text" name="iec" value={formData.iec} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
              {errors.iec && <p className="text-red-500 text-xs mt-1">{errors.iec}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">APEDA RCMC Number *</label>
              <input type="text" name="apedaRcmc" value={formData.apedaRcmc} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
              {errors.apedaRcmc && <p className="text-red-500 text-xs mt-1">{errors.apedaRcmc}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">APEDA RCMC Expiry Date *</label>
              <input type="date" name="apedaRcmcExpiryDate" value={formData.apedaRcmcExpiryDate || '2029-03-31'} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Infrastructure & Traceability</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <input type="checkbox" name="warehouseAvailability" checked={formData.warehouseAvailability} onChange={handleInputChange} className="rounded text-primary focus:ring-primary" />
          <span className="text-sm font-medium">Warehouse Facility</span>
        </label>
        <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <input type="checkbox" name="processingUnit" checked={formData.processingUnit} onChange={handleInputChange} className="rounded text-primary focus:ring-primary" />
          <span className="text-sm font-medium">Processing Unit</span>
        </label>
        <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <input type="checkbox" name="coldStorage" checked={formData.coldStorage} onChange={handleInputChange} className="rounded text-primary focus:ring-primary" />
          <span className="text-sm font-medium">Cold Storage</span>
        </label>
      </div>
    </div>
  );

  const renderStep5 = () => {
    // Dynamic docs based on seller type and export
    const requiredDocs = [
      { key: 'logo', label: 'Organization/Farmer Logo', formats: 'PNG, JPG, JPEG', size: 'Max 2MB' },
      { 
        key: 'scopeCert', 
        label: formData.sellerType === 'Individual Farmer' ? 'Scope Certificate (of Grower Group)' : 'Scope Certificate (NPOP/PGS)', 
        formats: 'PDF, JPG, PNG', 
        size: 'Max 5MB',
        validity: `Annual Validity: ${formData.scopeCertValidityYear || '2026-2027'} (Expires ${formData.scopeCertExpiryDate || '2027-03-31'})`
      }
    ];
    
    if (formData.sellerType !== 'Individual Farmer') {
      requiredDocs.push({ 
        key: 'fssai', 
        label: 'FSSAI License', 
        formats: 'PDF, JPG, PNG', 
        size: 'Max 5MB',
        validity: `Valid until: ${formData.fssaiExpiryDate || '2028-12-31'}`
      });
    }
    if (formData.isExporting) {
      requiredDocs.push({ key: 'iecDoc', label: 'IEC Certificate', formats: 'PDF, JPG, PNG', size: 'Max 5MB' });
      requiredDocs.push({ 
        key: 'apedaDoc', 
        label: 'APEDA RCMC', 
        formats: 'PDF, JPG, PNG', 
        size: 'Max 5MB',
        validity: `Valid until: ${formData.apedaRcmcExpiryDate || '2029-03-31'}`
      });
    }

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Document Upload</h3>
        <p className="text-sm text-gray-500">Upload the mandatory documents for your {formData.sellerType} application.</p>
        
        {/* Specifications Banner */}
        <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium">File Specifications: Upload official certificates in <strong>PDF, PNG, JPG, or JPEG</strong> format. Maximum file size per document is <strong>5 MB</strong> (Logo up to 2 MB).</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requiredDocs.map(doc => (
            <div key={doc.key} className="border border-gray-200 rounded-xl p-4 bg-gray-50/80 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <label className="block text-sm font-bold text-gray-800">{doc.label} *</label>
                  <span className="text-[10px] font-semibold text-gray-600 bg-gray-200/80 px-2 py-0.5 rounded-full">{doc.size}</span>
                </div>
                {doc.validity && (
                  <p className="text-[11px] font-extrabold text-amber-900 bg-amber-100/90 border border-amber-200 px-2 py-0.5 rounded-md w-fit mb-2">
                    📅 {doc.validity}
                  </p>
                )}
              </div>
              
              {!files[doc.key] ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:bg-gray-100/80 transition-all group">
                  <UploadCloud className="mx-auto h-8 w-8 text-gray-400 group-hover:text-primary transition-colors mb-1.5" />
                  <label className="cursor-pointer text-sm font-bold text-primary hover:text-primary-dark">
                    Browse File
                    <input type="file" className="sr-only" onChange={(e) => handleFileChange(doc.key, e)} accept=".pdf,.png,.jpg,.jpeg" />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Supported formats: {doc.formats} ({doc.size})</p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
                  <div className="flex items-center overflow-hidden">
                    <FileText className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-gray-900 truncate">{files[doc.key]?.name}</p>
                      <span className="text-[10px] text-gray-400 font-mono">{(files[doc.key]?.size ? (files[doc.key]!.size / 1024 / 1024).toFixed(2) + ' MB' : 'Uploaded')}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFile(doc.key)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Review & Declaration</h3>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <h4 className="font-bold text-blue-900 flex items-center mb-2"><CheckCircle className="w-5 h-5 mr-2"/> Ready for Submission</h4>
        <p className="text-sm text-blue-800">You are registering as a <strong>{formData.sellerType}</strong> from <strong>{formData.district}</strong>.</p>
      </div>
      
      <div className="space-y-3">
        <label className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
          <input type="checkbox" checked={declarations.decl1} onChange={e => { setDeclarations({...declarations, decl1: e.target.checked}); setErrors({...errors, decl: ''}) }} className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary" />
          <span className="text-sm text-gray-700">I declare that all information provided is true and accurate. I understand that false information will lead to rejection.</span>
        </label>
        <label className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
          <input type="checkbox" checked={declarations.decl2} onChange={e => { setDeclarations({...declarations, decl2: e.target.checked}); setErrors({...errors, decl: ''}) }} className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary" />
          <span className="text-sm text-gray-700">I agree to abide by the NPOP standards, Jaivik Bharat guidelines, and Sikkim Organic Marketplace terms of service.</span>
        </label>
        {errors.decl && <p className="text-red-500 text-sm mt-1">{errors.decl}</p>}
      </div>
    </div>
  );

  const stepsContent = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 mt-4 sm:mt-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Unified Seller Registration</h1>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-500">Complete your compliance profile to list & sell certified organic produces</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/60 overflow-x-auto">
          <div className="flex justify-between min-w-max md:min-w-0">
            {STEPS.map((step, idx) => (
              <div key={step} className="flex flex-col items-center relative z-10 w-full px-2">
                <div className="flex items-center justify-center w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold z-10 flex-shrink-0 transition-all
                    ${currentStep > idx ? 'bg-emerald-600 text-white' : 
                      currentStep === idx ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30' : 
                      'bg-slate-200 text-slate-500 border border-slate-300'}`}>
                    {currentStep > idx ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`h-1 w-full min-w-[20px] flex-1 mx-1.5 rounded ${currentStep > idx ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                  )}
                </div>
                <div className="mt-2 text-center hidden md:block">
                  <p className={`text-[10px] font-extrabold uppercase tracking-wider ${currentStep >= idx ? 'text-slate-900' : 'text-slate-400'}`}>{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white min-h-[400px] p-4 sm:p-8">
          {stepsContent[currentStep]()}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => toast.success('Registration draft saved successfully.')}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl shadow-xs hover:bg-slate-100 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-slate-400" /> Save as Draft
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-4 py-2 border rounded-xl shadow-xs text-xs font-bold flex items-center gap-1.5 transition-all
                ${currentStep === 0 ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed' : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100'}`}
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            
            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent shadow-xs text-xs font-extrabold rounded-xl text-white bg-emerald-700 hover:bg-emerald-800 transition-all gap-1.5"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent shadow-xs text-xs font-extrabold rounded-xl text-white bg-emerald-700 hover:bg-emerald-800 transition-all gap-1.5"
              >
                Submit Registration <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegistrationWizard;
