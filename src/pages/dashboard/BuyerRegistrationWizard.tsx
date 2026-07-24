import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuyerRegistration, BuyerRegistrationData } from '../../context/BuyerRegistrationContext';
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import BusinessInfoStep from '../../components/buyer-registration/BusinessInfoStep';
import ContactInfoStep from '../../components/buyer-registration/ContactInfoStep';
import OrganicComplianceStep from '../../components/buyer-registration/OrganicComplianceStep';
import InfrastructureStep from '../../components/buyer-registration/InfrastructureStep';
import DocumentUploadStep from '../../components/buyer-registration/DocumentUploadStep';
import ReviewSubmitStep from '../../components/buyer-registration/ReviewSubmitStep';

const steps = [
  { id: 1, title: 'Business Information', description: 'Legal & Entity Details' },
  { id: 2, title: 'Contact Information', description: 'Address & Representatives' },
  { id: 3, title: 'Organic Compliance', description: 'Certifications & FSSAI' },
  { id: 4, title: 'Infrastructure Details', description: 'Storage & Processing' },
  { id: 5, title: 'Document Upload', description: 'Mandatory Documents' },
  { id: 6, title: 'Review & Declaration', description: 'Final Verification' },
];

const BuyerRegistrationWizard: React.FC = () => {
  const navigate = useNavigate();
  const { registrationData, saveDraft, submitRegistration } = useBuyerRegistration();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BuyerRegistrationData>>(
    registrationData || {
      // Step 1: Business Info
      legalEntityName: 'Green Earth Organics Ltd.',
      tradeName: 'Green Earth',
      businessType: 'Wholesaler / Distributor',
      organizationType: 'Private Limited Company',
      gstin: '11ABCDE1234F1Z5',
      pan: 'ABCDE1234F',
      cin: 'U12345SK2015PTC001234',
      iec: '1234567890',
      yearOfEstablishment: '2015',
      annualProcurementCapacity: '500',
      website: 'www.greenearthorganics.in',
      
      // Step 2: Contact Info
      authorizedRepresentative: 'John Doe',
      designation: 'Director of Procurement',
      mobileNumber: '9876543210',
      alternateMobile: '9876543211',
      email: 'contact@greenearthorganics.in',
      officePhone: '03592-201234',
      registeredAddress: '123 MG Road, Gangtok',
      communicationAddress: '123 MG Road, Gangtok',
      state: 'Sikkim',
      district: 'East Sikkim',
      pinCode: '737101',
      
      // Step 3: Organic Compliance
      certificationSystem: 'NPOP',
      certificationBody: 'Aditi Organic Certifications',
      scopeCertificateNumber: 'ORG/SC/1504/001234',
      issueDate: '2025-01-01',
      expiryDate: '2026-12-31',
      scopeOfCertification: 'Trading, Processing',
      certifiedProductCategories: 'Spices, Fruits, Tea',
      fssaiLicenseNumber: '11419850000123',
      licenseType: 'State License',
      jaivikBharatRegistrationNumber: 'JB/2025/12345',
      
      // Step 4: Infrastructure
      warehouseAvailability: 'Yes',
      coldStorage: 'Yes',
      processingFacility: 'Yes',
      packagingFacility: 'Yes',
      dedicatedOrganicStorage: 'Yes',
      storageCapacity: '200',
      processingCapacity: '100',
      organicHandlingProcess: 'Dedicated cleaning, sorting, and packaging lines for organic produce.',
      qualityControlLaboratory: 'In-house',
      
      documents: {
        gstCertificate: 'GST_Cert.pdf',
        panCard: 'PAN.pdf',
        scopeCertificate: 'Scope_Cert.pdf',
        fssaiLicense: 'FSSAI.pdf'
      }
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    // Validate current step before proceeding (we will add validation logic in step components)
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSaveDraft = () => {
    saveDraft(formData);
    // Could show a toast notification here
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const refId = submitRegistration(formData as BuyerRegistrationData);
      navigate('/dashboard/registration-success', { state: { id: refId, fromBuyerRegistration: true } });
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.legalEntityName) newErrors.legalEntityName = 'Legal Entity Name is required';
      if (!formData.businessType) newErrors.businessType = 'Business Type is required';
      if (!formData.organizationType) newErrors.organizationType = 'Organization Type is required';
      if (!formData.gstin) newErrors.gstin = 'GSTIN is required';
      if (!formData.pan) newErrors.pan = 'PAN is required';
    } else if (step === 2) {
      if (!formData.authorizedRepresentative) newErrors.authorizedRepresentative = 'Authorized Representative is required';
      if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
      else if (!/^[0-9]{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Invalid 10-digit mobile number';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.registeredAddress) newErrors.registeredAddress = 'Registered Address is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.district) newErrors.district = 'District is required';
      if (!formData.pinCode) newErrors.pinCode = 'PIN Code is required';
    } else if (step === 3) {
      if (!formData.certificationSystem) newErrors.certificationSystem = 'Certification System is required';
      if (!formData.certificationBody) newErrors.certificationBody = 'Certification Body is required';
      if (!formData.scopeCertificateNumber) newErrors.scopeCertificateNumber = 'Scope Certificate Number is required';
      if (!formData.issueDate) newErrors.issueDate = 'Issue Date is required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry Date is required';
      if (!formData.certifiedProductCategories) newErrors.certifiedProductCategories = 'Certified Categories are required';
      if (!formData.fssaiLicenseNumber) newErrors.fssaiLicenseNumber = 'FSSAI License Number is required';
      if (!formData.licenseType) newErrors.licenseType = 'License Type is required';
    } else if (step === 4) {
      if (!formData.warehouseAvailability) newErrors.warehouseAvailability = 'This field is required';
      if (formData.warehouseAvailability === 'Yes') {
        if (!formData.dedicatedOrganicStorage) newErrors.dedicatedOrganicStorage = 'This field is required';
        if (!formData.storageCapacity) newErrors.storageCapacity = 'Storage Capacity is required';
      }
      if (!formData.processingFacility) newErrors.processingFacility = 'This field is required';
      if (formData.processingFacility === 'Yes') {
        if (!formData.processingCapacity) newErrors.processingCapacity = 'Processing Capacity is required';
      }
    } else if (step === 5) {
      const docs = formData.documents || {};
      if (!docs.gstCertificate) newErrors.doc_gstCertificate = 'GST Certificate is required';
      if (!docs.panCard) newErrors.doc_panCard = 'PAN Card is required';
      if (!docs.fssaiLicense) newErrors.doc_fssaiLicense = 'FSSAI License is required';
      if (!docs.scopeCertificate) newErrors.doc_scopeCertificate = 'Scope Certificate is required';
      if (!docs.organicCertification) newErrors.doc_organicCertification = 'Organic Certification is required';
    } else if (step === 6) {
      // @ts-ignore - Temporary flag for validation
      if (!formData._declarationAgreed) newErrors.declaration = 'You must accept the declaration to proceed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (data: Partial<BuyerRegistrationData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    // Clear errors for updated fields
    const newErrors = { ...errors };
    Object.keys(data).forEach(key => delete newErrors[key]);
    setErrors(newErrors);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfoStep data={formData} errors={errors} onChange={updateFormData} />;
      case 2:
        return <ContactInfoStep data={formData} errors={errors} onChange={updateFormData} />;
      case 3:
        return <OrganicComplianceStep data={formData} errors={errors} onChange={updateFormData} />;
      case 4:
        return <InfrastructureStep data={formData} errors={errors} onChange={updateFormData} />;
      case 5:
        return <DocumentUploadStep data={formData} errors={errors} onChange={updateFormData} />;
      case 6:
        return <ReviewSubmitStep data={formData} errors={errors} onChange={(data) => updateFormData(data)} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Buyer Registration</h1>
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
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center relative z-10 w-full">
                <div className="flex items-center justify-center w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10
                    ${currentStep > step.id ? 'bg-green-500 text-white' : 
                      currentStep === step.id ? 'bg-primary text-white ring-4 ring-primary/20' : 
                      'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-1 w-full flex-1 mx-2 rounded ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="mt-3 text-center hidden md:block">
                  <p className={`text-xs font-bold ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2 text-gray-400" /> Save as Draft
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium flex items-center
                ${currentStep === 1 ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </button>
            
            {currentStep < steps.length ? (
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

export default BuyerRegistrationWizard;
