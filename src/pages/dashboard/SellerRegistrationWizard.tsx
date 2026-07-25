import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerRegistration, SellerType } from '../../context/SellerRegistrationContext';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X, ChevronRight, ChevronLeft, Building2, Users, Leaf, Truck, ArrowLeft, ArrowRight, Save } from 'lucide-react';

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
    certificationSystem: 'NPOP',
    certificationBody: 'Sikkim State Organic Certification Agency (SSOCA)',
    scopeCertNumber: 'ORG/SC/2026/001',
    noOfFarmers: '125',
    cultivatedArea: '250',
    icsAvailability: true,
    gstin: '11AAAAA0000A1Z5',
    pan: 'AAAAA0000A',
    fssaiLicenseNumber: '11419850000001',
    isExporting: true,
    iec: '0123456789',
    apedaRcmc: 'APEDA/RCMC/2026/1023',
    warehouseAvailability: true,
    processingUnit: false,
    coldStorage: true,
  });

  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [declarations, setDeclarations] = useState({ decl1: false, decl2: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
          <label className="block text-sm font-medium text-gray-700">Scope Certificate Number</label>
          <input type="text" name="scopeCertNumber" value={formData.scopeCertNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
          {errors.scopeCertNumber && <p className="text-red-500 text-xs mt-1">{errors.scopeCertNumber}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Statutory & Export Compliance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">GSTIN</label>
          <input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">FSSAI License Number</label>
          <input type="text" name="fssaiLicenseNumber" value={formData.fssaiLicenseNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="flex items-center space-x-3 mb-4">
          <input type="checkbox" name="isExporting" checked={formData.isExporting} onChange={handleInputChange} className="w-5 h-5 rounded text-primary focus:ring-primary" />
          <span className="font-bold text-gray-900">Are you an Exporting Organization?</span>
        </label>
        
        {formData.isExporting && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
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
      { key: 'scopeCert', label: formData.sellerType === 'Individual Farmer' ? 'Scope Certificate (of Grower Group)' : 'Scope Certificate (NPOP/PGS)', formats: 'PDF, JPG, PNG', size: 'Max 5MB' }
    ];
    
    if (formData.sellerType !== 'Individual Farmer') requiredDocs.push({ key: 'fssai', label: 'FSSAI License', formats: 'PDF, JPG, PNG', size: 'Max 5MB' });
    if (formData.isExporting) {
      requiredDocs.push({ key: 'iecDoc', label: 'IEC Certificate', formats: 'PDF, JPG, PNG', size: 'Max 5MB' });
      requiredDocs.push({ key: 'apedaDoc', label: 'APEDA RCMC', formats: 'PDF, JPG, PNG', size: 'Max 5MB' });
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
                <div className="flex justify-between items-start mb-2">
                  <label className="block text-sm font-bold text-gray-800">{doc.label} *</label>
                  <span className="text-[10px] font-semibold text-gray-600 bg-gray-200/80 px-2 py-0.5 rounded-full">{doc.size}</span>
                </div>
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
    <div className="max-w-5xl mx-auto space-y-6 pb-12 mt-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Unified Seller Registration</h1>
              <p className="mt-1 text-sm text-gray-500">Complete your profile to access the organic marketplace</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white overflow-x-auto">
          <div className="flex justify-between min-w-max md:min-w-0">
            {STEPS.map((step, idx) => (
              <div key={step} className="flex flex-col items-center relative z-10 w-full px-2">
                <div className="flex items-center justify-center w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 flex-shrink-0
                    ${currentStep > idx ? 'bg-green-500 text-white' : 
                      currentStep === idx ? 'bg-primary text-white ring-4 ring-primary/20' : 
                      'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                    {currentStep > idx ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`h-1 w-full min-w-[30px] flex-1 mx-2 rounded ${currentStep > idx ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="mt-3 text-center hidden md:block">
                  <p className={`text-[11px] font-bold uppercase tracking-wider ${currentStep >= idx ? 'text-gray-900' : 'text-gray-400'}`}>{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white min-h-[400px] p-6">
          {stepsContent[currentStep]()}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2 text-gray-400" /> Save as Draft
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium flex items-center
                ${currentStep === 0 ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </button>
            
            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex justify-center items-center px-6 py-2 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-primary hover:bg-primary-dark"
              >
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex justify-center items-center px-6 py-2 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Submit Registration <CheckCircle className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegistrationWizard;
