import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization, OrganizationData } from '../../context/OrganizationContext';
import {
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Clock,
  Building2,
  ShoppingBag,
  Store,
  ShieldCheck,
  RefreshCw,
  XCircle,
  RotateCcw,
  UserCheck,
  CreditCard,
  Package,
  Plus,
  Edit,
  CheckCircle2
} from 'lucide-react';
import BusinessInfoStep from '../../components/org-registration/BusinessInfoStep';
import CompliancesStep from '../../components/org-registration/CompliancesStep';
import InfrastructureStep from '../../components/org-registration/InfrastructureStep';
import DocumentUploadStep from '../../components/org-registration/DocumentUploadStep';
import ReviewSubmitStep from '../../components/org-registration/ReviewSubmitStep';

import SellerActivationWizard from '../../components/seller-activation/SellerActivationWizard';
import AuthorizedSignatoriesModal from '../../components/seller-activation/AuthorizedSignatoriesModal';
import BankAccountModal from '../../components/seller-activation/BankAccountModal';

const steps = [
  { id: 1, title: 'Business Information', description: 'Legal & Entity Details' },
  { id: 2, title: 'Organic Capabilities', description: 'Statutory & Compliances' },
  { id: 3, title: 'Infrastructure', description: 'Facility & Storage Capacities' },
  { id: 4, title: 'Documents', description: 'Mandatory Certificates' },
  { id: 5, title: 'Review & Submit', description: 'Final Declaration' },
];

const OrganizationOnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const {
    orgStatus,
    orgData,
    capabilities,
    sellerStatus,
    scopeCertData,
    authorizedSignatories,
    bankAccount,
    sellerCompletionPercentage,
    buyerAuthorizedSignatories,
    buyerPaymentAccount,
    buyerCompletionPercentage,
    saveDraft,
    submitOrgRegistration,
    approveOrgRegistration,
    returnOrgRegistration,
    rejectOrgRegistration,
    activateSellerProfile,
    activateBuyerProfile,
    resetToUnregistered,
    approveSellerScope,
  } = useOrganization();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OrganizationData>>(
    orgData || {
      legalName: 'Karmapa Organic Traders',
      tradeName: 'Karmapa Organics',
      organizationTypeId: 'Private Limited Company',
      registrationNumber: 'REG-2026-SK-8891',
      pan: 'ABCDE1234F',
      gstNumber: '11ABCDE1234F1Z5',
      establishedDate: '2018-04-15',
      organizationEmail: 'contact@karmapaorganic.in',
      organizationPhoneNumber: '9876543210',
      stateId: 'Sikkim',
      districtId: 'Gangtok',
      pinCode: '737101',
      registeredAddress: 'Zero Point, Near Secretariat Road, Gangtok',
      communicationAddress: 'Zero Point, Near Secretariat Road, Gangtok',
      representativeName: 'Tenzing Bhutia',
      designation: 'Managing Director',
      representativeEmail: 'tenzing@karmapaorganic.in',
      representativePhoneNumber: '9876543210',
      representativeAltPhoneNumber: '9876543211',

      iecNumber: '1234567890',
      cinNumber: 'U12345SK2018PTC001234',
      fssaiLicenseTypeId: 'State License',
      fssaiLicenseNumber: '11419850000123',
      apedaRcmcNumber: 'APEDA/RCMC/2026/0912',
      jaivikBharatRegistration: 'JB/2025/12345',

      warehouse: 'Yes',
      processingFacility: 'Yes',
      coldStorage: 'Yes',
      organicStorage: 'Yes',
      storageCapacityUnitId: 'MT',
      totalStorageCapacity: '250',
      processingCapacityUnitId: 'MT/Day',
      processingCapacity: '15',
      packagingFacility: 'Yes',
      qualityControlLaboratoryId: 'In-House',

      documents: {
        logo: 'Org_Logo.png',
        scopeCertificate: 'Scope_Certificate_NPOP.pdf',
        fssaiLicense: 'FSSAI_State_License.pdf',
        iecCertificate: 'IEC_Certificate.pdf',
        apedaRcmc: 'APEDA_RCMC.pdf',
      },
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modals state
  const [showSellerActivationModal, setShowSellerActivationModal] = useState(false);
  const [showSignatoriesModal, setShowSignatoriesModal] = useState(false);
  const [showBankAccountModal, setShowBankAccountModal] = useState(false);

  const [showBuyerSignatoriesModal, setShowBuyerSignatoriesModal] = useState(false);
  const [showBuyerPaymentModal, setShowBuyerPaymentModal] = useState(false);

  const updateFormData = (data: Partial<OrganizationData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    const newErrors = { ...errors };
    Object.keys(data).forEach((key) => delete newErrors[key]);
    setErrors(newErrors);
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.legalName) newErrors.legalName = 'Legal Entity Name is required';
      if (!formData.organizationTypeId) newErrors.organizationTypeId = 'Organization Type is required';
      if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration Number is required';
      if (!formData.pan) newErrors.pan = 'PAN is required';
      if (!formData.gstNumber) newErrors.gstNumber = 'GST Number is required';
      if (!formData.establishedDate) newErrors.establishedDate = 'Established Date is required';
      if (!formData.organizationEmail) newErrors.organizationEmail = 'Organization Email is required';
      if (!formData.organizationPhoneNumber) newErrors.organizationPhoneNumber = 'Organization Phone is required';
      if (!formData.districtId) newErrors.districtId = 'District is required';
      if (!formData.pinCode) newErrors.pinCode = 'PIN Code is required';
      if (!formData.registeredAddress) newErrors.registeredAddress = 'Registered Address is required';
      if (!formData.communicationAddress) newErrors.communicationAddress = 'Communication Address is required';
      if (!formData.representativeName) newErrors.representativeName = 'Representative Name is required';
      if (!formData.designation) newErrors.designation = 'Designation is required';
      if (!formData.representativeEmail) newErrors.representativeEmail = 'Representative Email is required';
      if (!formData.representativePhoneNumber) newErrors.representativePhoneNumber = 'Representative Phone is required';
    } else if (step === 2) {
      if (!formData.fssaiLicenseTypeId) newErrors.fssaiLicenseTypeId = 'FSSAI License Type is required';
      if (!formData.fssaiLicenseNumber) newErrors.fssaiLicenseNumber = 'FSSAI License Number is required';
    } else if (step === 3) {
      if (!formData.warehouse) newErrors.warehouse = 'Warehouse selection required';
      if (!formData.processingFacility) newErrors.processingFacility = 'Processing Facility selection required';
    } else if (step === 4) {
      const docs = formData.documents || {};
      if (!docs.logo) newErrors.doc_logo = 'Organization Logo is required';
      if (!docs.scopeCertificate) newErrors.doc_scopeCertificate = 'Scope Certificate is required';
      if (!docs.fssaiLicense) newErrors.doc_fssaiLicense = 'FSSAI License is required';
    } else if (step === 5) {
      // @ts-ignore
      if (!formData._declarationAgreed) newErrors.declaration = 'You must accept the legal declaration to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
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
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      submitOrgRegistration(formData as OrganizationData);
      window.scrollTo(0, 0);
    }
  };

  const handleResetFlow = () => {
    resetToUnregistered();
    setCurrentStep(1);
  };

  // Render Status Screens if status is not UNREGISTERED or RETURNED
  if (orgStatus === 'PENDING_SOFDA_REVIEW') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Pending SOFDA Approval
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Organization Application Under SOFDA Review
            </h1>
            <p className="text-sm text-gray-600 mt-1 max-w-xl mx-auto">
              Your organization registration application has been submitted and is currently under verification by SOFDA officials.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 max-w-lg mx-auto text-left grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-gray-500 block">Application Reference</span>
              <span className="font-mono font-bold text-gray-900">{orgData?.referenceId || 'ORG-2026-PENDING'}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Submitted On</span>
              <span className="font-semibold text-gray-900">
                {orgData?.submissionDate ? new Date(orgData.submissionDate).toLocaleDateString('en-IN') : 'Today'}
              </span>
            </div>
            <div className="col-span-2 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500 block">Organization Registered</span>
              <span className="font-bold text-gray-900">{orgData?.legalName} ({orgData?.tradeName})</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-left flex items-start gap-3 max-w-lg mx-auto">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              <strong>Next Step:</strong> Once SOFDA approves your Organization Profile, the options to activate your <strong>Seller Profile</strong> and <strong>Buyer Profile</strong> will automatically be enabled.
            </p>
          </div>

          {/* Controls Panel */}
          <div className="pt-6 border-t border-gray-200 text-left max-w-lg mx-auto space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              ⚡ Demo Testing Controls (SOFDA Admin Simulation)
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={approveOrgRegistration}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" /> Approve Application (SOFDA)
              </button>
              <button
                onClick={() => returnOrgRegistration('Missing clear copy of FSSAI certificate.')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> Return for Info
              </button>
              <button
                onClick={() => rejectOrgRegistration('Invalid PAN & GST matching.')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={handleResetFlow}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 underline"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to Fill Organization Form from Scratch
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orgStatus === 'REJECTED') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
        <div className="bg-white rounded-2xl p-8 border border-red-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Application Rejected
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Organization Registration Rejected by SOFDA
            </h1>
            <p className="text-sm text-red-700 mt-2 max-w-xl mx-auto bg-red-50 p-3 rounded-lg border border-red-200">
              <strong>Reason:</strong> {orgData?.remarks || 'Application did not satisfy statutory compliance criteria.'}
            </p>
          </div>
          <button
            onClick={handleResetFlow}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Re-apply Organization Registration
          </button>
        </div>
      </div>
    );
  }

  if (orgStatus === 'APPROVED') {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Seller Modals */}
        {showSellerActivationModal && (
          <SellerActivationWizard onClose={() => setShowSellerActivationModal(false)} />
        )}
        {showSignatoriesModal && (
          <AuthorizedSignatoriesModal onClose={() => setShowSignatoriesModal(false)} />
        )}
        {showBankAccountModal && (
          <BankAccountModal onClose={() => setShowBankAccountModal(false)} />
        )}

        {/* Buyer Modals */}
        {showBuyerSignatoriesModal && (
          <AuthorizedSignatoriesModal isBuyer={true} onClose={() => setShowBuyerSignatoriesModal(false)} />
        )}
        {showBuyerPaymentModal && (
          <BankAccountModal isBuyer={true} onClose={() => setShowBuyerPaymentModal(false)} />
        )}

        <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-sm space-y-6">
          {/* Active Org Header */}
          <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-xl">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{orgData?.legalName}</h1>
                  <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1 whitespace-nowrap">
                    <CheckCircle className="w-3.5 h-3.5" /> Approved
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  Trade Name: {orgData?.tradeName} | Reg No: {orgData?.registrationNumber} | District: {orgData?.districtId}
                </p>
              </div>
            </div>
            <button
              onClick={handleResetFlow}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 border px-3 py-1.5 rounded-lg hover:bg-gray-50"
              title="Reset state to fill form again"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Form Demo
            </button>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Business Capabilities Management</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your Organization Profile is active. Select and activate business capabilities to participate in the Sikkim Organic Marketplace.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Seller Capability Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Store className="w-36 h-36" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                      <Store className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                        sellerStatus === 'ACTIVE'
                          ? 'bg-emerald-500 text-white'
                          : sellerStatus === 'PENDING_SCOPE_VERIFICATION'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {sellerStatus === 'ACTIVE'
                        ? 'Approved'
                        : sellerStatus === 'PENDING_SCOPE_VERIFICATION'
                        ? 'Pending'
                        : 'Available to Activate'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">Seller Business Profile</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      List certified organic products, set procurement pricing, manage crop inventory, and accept buyer purchase orders across Sikkim.
                    </p>
                  </div>

                  {/* Seller Completion Percentage Bar */}
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-emerald-400 uppercase tracking-wider">Seller Profile Completion</span>
                      <span className="text-white font-mono text-sm">{sellerCompletionPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                        style={{ width: `${sellerCompletionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Organization Approved
                      </span>
                      <span className="text-emerald-400 font-bold">✓ Done</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="flex items-center gap-2 text-slate-200">
                        {sellerStatus === 'ACTIVE' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-400" />
                        )}
                        Scope Certificate Approved (SOFDA)
                      </span>
                      {sellerStatus === 'ACTIVE' ? (
                        <span className="text-emerald-400 font-bold">✓ Verified</span>
                      ) : sellerStatus === 'PENDING_SCOPE_VERIFICATION' ? (
                        <span className="text-amber-400 font-bold">Under Review</span>
                      ) : (
                        <button
                          onClick={() => setShowSellerActivationModal(true)}
                          className="text-emerald-400 hover:underline font-bold"
                        >
                          + Submit Scope
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="flex items-center gap-2 text-slate-200">
                        {sellerStatus === 'ACTIVE' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Package className="w-4 h-4 text-slate-500" />
                        )}
                        Product Listing Enabled
                      </span>
                      <span className={sellerStatus === 'ACTIVE' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {sellerStatus === 'ACTIVE' ? '✓ Unlocked' : 'Locked'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="flex items-center gap-2 text-slate-200">
                        {authorizedSignatories.length > 0 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-slate-400" />
                        )}
                        Authorized Signatories ({authorizedSignatories.length})
                        <span className="text-[10px] text-amber-300 font-normal">(Req. before Contract)</span>
                      </span>
                      <button
                        onClick={() => setShowSignatoriesModal(true)}
                        className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                      >
                        {authorizedSignatories.length > 0 ? <Edit className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {authorizedSignatories.length > 0 ? 'Edit' : 'Add'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="flex items-center gap-2 text-slate-200">
                        {bankAccount && bankAccount.accountNumber ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-slate-400" />
                        )}
                        Bank Account Setup
                        <span className="text-[10px] text-amber-300 font-normal">(Req. before Payment)</span>
                      </span>
                      <button
                        onClick={() => setShowBankAccountModal(true)}
                        className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                      >
                        {bankAccount && bankAccount.accountNumber ? <Edit className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {bankAccount && bankAccount.accountNumber ? 'Edit' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Seller Actions */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  {sellerStatus === 'ACTIVE' ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => navigate('/dashboard/products/manage')}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        Manage Seller Products & Inventory <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowSignatoriesModal(true)}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Signatories
                        </button>
                        <button
                          onClick={() => setShowBankAccountModal(true)}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-1"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Bank Account
                        </button>
                      </div>
                    </div>
                  ) : sellerStatus === 'PENDING_SCOPE_VERIFICATION' ? (
                    <div className="space-y-2">
                      <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs text-amber-200 font-medium text-center">
                        Scope Certificate submitted! Pending SOFDA officer verification.
                      </div>
                      <button
                        onClick={approveSellerScope}
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve Scope Certificate (SOFDA Demo Simulation)
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowSellerActivationModal(true)}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      Activate Seller Profile & Submit Scope <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Buyer Capability Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShoppingBag className="w-36 h-36" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                        capabilities.isBuyerActive ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {capabilities.isBuyerActive ? 'Approved' : 'Available to Activate'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Buyer Business Profile</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Browse verified organic farmers and FPOs, issue digital purchase enquiries, negotiate trade terms, and execute procurement contracts.
                    </p>
                  </div>

                  {/* Buyer Completion Percentage Bar */}
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-blue-400 uppercase tracking-wider">Buyer Profile Completion</span>
                      <span className="text-white font-mono text-sm">{buyerCompletionPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-500 rounded-full"
                        style={{ width: `${buyerCompletionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Buyer Checklist */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Organization Approved
                      </span>
                      <span className="text-emerald-400 font-bold">✓ Done</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="flex items-center gap-2 text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" /> Marketplace Discovery
                      </span>
                      <span className="text-blue-400 font-bold">✓ Unlocked</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="flex items-center gap-2 text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" /> Procurement Contracts
                      </span>
                      <span className="text-blue-400 font-bold">Digital Ready</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="flex items-center gap-2 text-slate-200">
                        {buyerAuthorizedSignatories.length > 0 ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-slate-400" />
                        )}
                        Authorized Signatories ({buyerAuthorizedSignatories.length})
                        <span className="text-[10px] text-amber-300 font-normal">(Req. before Contract)</span>
                      </span>
                      <button
                        onClick={() => setShowBuyerSignatoriesModal(true)}
                        className="text-blue-400 hover:underline font-bold flex items-center gap-1"
                      >
                        {buyerAuthorizedSignatories.length > 0 ? <Edit className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {buyerAuthorizedSignatories.length > 0 ? 'Edit' : 'Add'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="flex items-center gap-2 text-slate-200">
                        {buyerPaymentAccount && buyerPaymentAccount.accountNumber ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-slate-400" />
                        )}
                        Payment Settlement Account
                        <span className="text-[10px] text-amber-300 font-normal">(Req. before Payment)</span>
                      </span>
                      <button
                        onClick={() => setShowBuyerPaymentModal(true)}
                        className="text-blue-400 hover:underline font-bold flex items-center gap-1"
                      >
                        {buyerPaymentAccount && buyerPaymentAccount.accountNumber ? <Edit className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {buyerPaymentAccount && buyerPaymentAccount.accountNumber ? 'Edit' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  {capabilities.isBuyerActive ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => navigate('/dashboard/marketplace')}
                        className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        Explore Organic Marketplace <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowBuyerSignatoriesModal(true)}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Signatories
                        </button>
                        <button
                          onClick={() => setShowBuyerPaymentModal(true)}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-1"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-blue-400" /> Settlement Bank
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        activateBuyerProfile();
                      }}
                      className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      Activate Buyer Profile <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise render the Organization Registration Wizard (for UNREGISTERED & RETURNED)
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfoStep data={formData} errors={errors} onChange={updateFormData} />;
      case 2:
        return <CompliancesStep data={formData} errors={errors} onChange={updateFormData} />;
      case 3:
        return <InfrastructureStep data={formData} errors={errors} onChange={updateFormData} />;
      case 4:
        return <DocumentUploadStep data={formData} errors={errors} onChange={updateFormData} />;
      case 5:
        return <ReviewSubmitStep data={formData} errors={errors} onChange={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      {orgStatus === 'RETURNED' && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl flex items-start gap-3 text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold">Application Returned for Correction by SOFDA</h4>
            <p className="text-xs mt-0.5">{orgData?.remarks || 'Please update details and re-submit.'}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organization Onboarding & Profile Registration</h1>
              <p className="mt-1 text-sm text-gray-500">
                Register your organization profile to obtain SOFDA approval and unlock buyer/seller capabilities.
              </p>
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
          <div className="flex justify-between min-w-[600px]">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center relative z-10 w-full">
                <div className="flex items-center justify-center w-full">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                      currentStep > step.id
                        ? 'bg-emerald-600 text-white'
                        : currentStep === step.id
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 w-full flex-1 mx-2 rounded ${
                        currentStep > step.id ? 'bg-emerald-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-3 text-center hidden md:block">
                  <p className={`text-xs font-bold ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white min-h-[400px]">{renderStepContent()}</div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-xs hover:bg-gray-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2 text-gray-400" /> Save as Draft
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-4 py-2 border rounded-md shadow-xs text-sm font-medium flex items-center ${
                currentStep === 1
                  ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex justify-center items-center px-6 py-2 border border-transparent shadow-xs text-sm font-bold rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex justify-center items-center px-6 py-2 border border-transparent shadow-xs text-sm font-bold rounded-md text-white bg-emerald-700 hover:bg-emerald-800"
              >
                Submit for SOFDA Review <CheckCircle className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationOnboardingWizard;
