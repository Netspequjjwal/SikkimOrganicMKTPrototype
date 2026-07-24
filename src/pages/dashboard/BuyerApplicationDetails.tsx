import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, FileText, AlertTriangle, Building2, User } from 'lucide-react';
import { useBuyerRegistration } from '../../context/BuyerRegistrationContext';

const BuyerApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { status, registrationData, approveRegistration, rejectRegistration } = useBuyerRegistration();
  
  const [remarks, setRemarks] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // In a real app, fetch based on ID. Here we just use context if ID matches or is generic.
  const isTargetApp = registrationData && (registrationData.referenceId === id || !registrationData.referenceId);
  const data = isTargetApp ? registrationData : {
    referenceId: id,
    legalEntityName: 'Green Earth Organics Ltd',
    tradeName: 'Green Earth',
    businessType: 'Wholesaler',
    organizationType: 'Private Limited Company',
    gstin: '11ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    iec: '1234567890',
    yearOfEstablishment: '2015',
    annualProcurementCapacity: '500',
    authorizedRepresentative: 'John Doe',
    designation: 'Director',
    mobileNumber: '9876543210',
    email: 'contact@greenearth.com',
    registeredAddress: '123 MG Road',
    state: 'Sikkim',
    district: 'East Sikkim',
    pinCode: '737101',
    certificationSystem: 'NPOP',
    certificationBody: 'Sikkim State Certification Agency',
    scopeCertificateNumber: 'ORG/SC/1234',
    issueDate: '2023-01-01',
    expiryDate: '2027-01-01',
    certifiedProductCategories: 'Spices, Fruits',
    fssaiLicenseNumber: '11419850000123',
    licenseType: 'State License',
    warehouseAvailability: 'Yes',
    storageCapacity: '200',
    dedicatedOrganicStorage: 'Yes',
    processingFacility: 'Yes',
    processingCapacity: '100',
    qualityControlLaboratory: 'In-house',
    documents: {
      gstCertificate: 'GST_Cert.pdf',
      panCard: 'PAN.pdf',
      scopeCertificate: 'Scope_Cert.pdf',
    }
  };

  const currentStatus = isTargetApp ? status : 'PENDING_APPROVAL';

  const handleApprove = () => {
    approveRegistration();
    navigate('/dashboard/buyer-approvals');
  };

  const handleReject = () => {
    if (!remarks) {
      alert("Please provide remarks for rejection.");
      return;
    }
    rejectRegistration();
    setShowRejectModal(false);
    navigate('/dashboard/buyer-approvals');
  };

  const renderSection = (title: string, icon: React.ElementType, content: { label: string, value: string | undefined | boolean }[]) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
        {React.createElement(icon, { className: "w-5 h-5 text-gray-500 mr-2" })}
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
          {content.map((item, idx) => (
            <div key={idx}>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{item.label}</dt>
              <dd className="text-sm font-semibold text-gray-900">
                {typeof item.value === 'boolean' ? (item.value ? 'Yes' : 'No') : (item.value || '-')}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard/buyer-approvals')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application: {id}</h1>
            <p className="text-sm text-gray-500">Reviewing details for {data.legalEntityName}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center ${
            currentStatus === 'PENDING_APPROVAL' ? 'bg-orange-100 text-orange-700' :
            currentStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {currentStatus === 'PENDING_APPROVAL' ? 'Pending Review' : currentStatus === 'APPROVED' ? 'Approved' : 'Unregistered'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {renderSection("Business Information", Building2, [
            { label: "Legal Entity Name", value: data.legalEntityName },
            { label: "Trade Name", value: data.tradeName },
            { label: "Business Type", value: data.businessType },
            { label: "Organization Type", value: data.organizationType },
            { label: "GSTIN", value: data.gstin },
            { label: "PAN", value: data.pan },
            { label: "IEC", value: data.iec },
            { label: "Year of Est.", value: data.yearOfEstablishment },
            { label: "Annual Capacity", value: data.annualProcurementCapacity ? `${data.annualProcurementCapacity} MT` : '-' },
          ])}

          {renderSection("Contact Details", User, [
            { label: "Authorized Rep.", value: data.authorizedRepresentative },
            { label: "Designation", value: data.designation },
            { label: "Mobile Number", value: data.mobileNumber },
            { label: "Email", value: data.email },
            { label: "Registered Address", value: data.registeredAddress },
            { label: "State", value: data.state },
            { label: "District", value: data.district },
            { label: "PIN Code", value: data.pinCode },
          ])}

          {renderSection("Organic Compliance", CheckCircle, [
            { label: "Certification System", value: data.certificationSystem },
            { label: "Certification Body", value: data.certificationBody },
            { label: "Scope Cert. Number", value: data.scopeCertificateNumber },
            { label: "Issue Date", value: data.issueDate },
            { label: "Expiry Date", value: data.expiryDate },
            { label: "Certified Categories", value: data.certifiedProductCategories },
            { label: "FSSAI License", value: data.fssaiLicenseNumber },
            { label: "License Type", value: data.licenseType },
          ])}

          {renderSection("Infrastructure", Building2, [
            { label: "Warehouse Available", value: data.warehouseAvailability },
            { label: "Storage Capacity", value: data.storageCapacity ? `${data.storageCapacity} MT` : '-' },
            { label: "Dedicated Organic Storage", value: data.dedicatedOrganicStorage },
            { label: "Processing Facility", value: data.processingFacility },
            { label: "Processing Capacity", value: data.processingCapacity ? `${data.processingCapacity} MT/Month` : '-' },
            { label: "QC Laboratory", value: data.qualityControlLaboratory },
          ])}
        </div>

        {/* Sidebar: Documents and Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Uploaded Documents</h3>
            </div>
            <div className="p-4 space-y-3">
              {data.documents && Object.entries(data.documents).map(([key, name]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate" title={name}>{name}</p>
                    </div>
                  </div>
                  <button className="text-xs text-primary font-bold hover:underline shrink-0 ml-2">View</button>
                </div>
              ))}
              {(!data.documents || Object.keys(data.documents).length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No documents uploaded.</p>
              )}
            </div>
          </div>

          {/* Action Panel */}
          {currentStatus === 'PENDING_APPROVAL' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Decision</h3>
              </div>
              <div className="p-6 space-y-4">
                <button 
                  onClick={handleApprove}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Application
                </button>
                <button 
                  onClick={() => setShowRejectModal(true)}
                  className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-red-600 bg-white hover:bg-red-50 transition-colors"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject / Return
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowRejectModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                      Reject / Return Application
                    </h3>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Remarks / Reason for Rejection <span className="text-red-500">*</span></label>
                      <textarea
                        rows={4}
                        className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border"
                        placeholder="Please detail why this application is being rejected or what needs correction..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleReject}
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerApplicationDetails;
