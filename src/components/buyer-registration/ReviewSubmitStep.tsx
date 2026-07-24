import React, { useState } from 'react';
import { BuyerRegistrationData } from '../../context/BuyerRegistrationContext';
import { CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface ReviewSubmitStepProps {
  data: Partial<BuyerRegistrationData>;
  errors: Record<string, string>;
  onChange: (data: Partial<BuyerRegistrationData>, isDeclaration: boolean) => void;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ data, errors, onChange }) => {
  const [agreed, setAgreed] = useState(false);

  const handleAgree = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(e.target.checked);
    onChange({ _declarationAgreed: e.target.checked } as any, true); // Sending flag for validation in parent
  };

  const renderSection = (title: string, content: { label: string, value: string | undefined }[]) => (
    <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
        {content.map((item, idx) => (
          <div key={idx}>
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            <p className="text-sm font-medium text-gray-900">{item.value || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">6. Review & Declaration</h2>
        <p className="mt-1 text-sm text-gray-500">Please review all information before final submission.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-1 bg-yellow-50 border-b border-yellow-100 text-center">
          <p className="text-xs text-yellow-700 font-medium flex items-center justify-center py-1">
            <AlertCircle className="w-3 h-3 mr-1" />
            Ensure all details are accurate to avoid rejection.
          </p>
        </div>
        
        <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar space-y-2">
          
          {renderSection("1. Business Information", [
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

          {renderSection("2. Contact Information", [
            { label: "Authorized Rep.", value: data.authorizedRepresentative },
            { label: "Designation", value: data.designation },
            { label: "Mobile Number", value: data.mobileNumber },
            { label: "Email", value: data.email },
            { label: "Registered Address", value: data.registeredAddress },
            { label: "State", value: data.state },
            { label: "District", value: data.district },
            { label: "PIN Code", value: data.pinCode },
          ])}

          {renderSection("3. Organic Compliance", [
            { label: "Certification System", value: data.certificationSystem },
            { label: "Certification Body", value: data.certificationBody },
            { label: "Scope Cert. Number", value: data.scopeCertificateNumber },
            { label: "Issue Date", value: data.issueDate },
            { label: "Expiry Date", value: data.expiryDate },
            { label: "FSSAI License", value: data.fssaiLicenseNumber },
            { label: "License Type", value: data.licenseType },
          ])}

          {renderSection("4. Infrastructure Details", [
            { label: "Warehouse Available", value: data.warehouseAvailability },
            { label: "Storage Capacity", value: data.storageCapacity ? `${data.storageCapacity} MT` : '-' },
            { label: "Dedicated Organic Storage", value: data.dedicatedOrganicStorage },
            { label: "Processing Facility", value: data.processingFacility },
            { label: "Processing Capacity", value: data.processingCapacity ? `${data.processingCapacity} MT/Month` : '-' },
            { label: "QC Laboratory", value: data.qualityControlLaboratory },
          ])}

          <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">5. Uploaded Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.documents && Object.entries(data.documents).map(([key, name]) => (
                <div key={key} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <FileText className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={name}>{name}</p>
                  </div>
                </div>
              ))}
              {(!data.documents || Object.keys(data.documents).length === 0) && (
                <p className="text-sm text-gray-500 col-span-2">No documents uploaded.</p>
              )}
            </div>
          </div>
          
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Declaration</h3>
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 text-sm text-blue-900 space-y-3 leading-relaxed">
          <p>1. I/We hereby declare that the information provided in this application is true, correct, and complete to the best of my/our knowledge and belief.</p>
          <p>2. I/We understand that any false or misleading information may lead to the immediate rejection of this application, cancellation of registration, and potential legal action under applicable laws.</p>
          <p>3. I/We agree to strictly adhere to the Organic farming standards, certification guidelines (NPOP/PGS), and APEDA regulations.</p>
          <p>4. I/We agree to abide by the terms and conditions, dispute resolution mechanisms, and operational guidelines of the Sikkim Organic Digital Marketplace.</p>
        </div>
        
        <div className="flex items-start mt-4">
          <div className="flex items-center h-5">
            <input
              id="declaration"
              name="declaration"
              type="checkbox"
              checked={agreed}
              onChange={handleAgree}
              className={`focus:ring-primary h-5 w-5 text-primary border-gray-300 rounded cursor-pointer ${errors.declaration ? 'border-red-500 ring-red-500' : ''}`}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="declaration" className="font-bold text-gray-800 cursor-pointer">
              I accept all declarations and terms of usage.
            </label>
            {errors.declaration && <p className="mt-1 text-xs text-red-600 font-medium">{errors.declaration}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
