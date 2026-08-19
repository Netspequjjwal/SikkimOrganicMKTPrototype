import React, { useState } from 'react';
import { OrganizationData } from '../../context/OrganizationContext';
import { Building2, ShieldCheck, Warehouse, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReviewSubmitStepProps {
  data: Partial<OrganizationData>;
  errors: Record<string, string>;
  onChange: (data: Partial<OrganizationData>) => void;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ data, errors, onChange }) => {
  const [declared, setDeclared] = useState(false);

  const handleDeclarationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeclared(e.target.checked);
    // @ts-ignore
    onChange({ _declarationAgreed: e.target.checked });
  };

  const docs = data.documents || {};

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">5. Review & Submit Application</h2>
        <p className="mt-1 text-sm text-gray-500">
          Verify all information before submitting your organization profile for SOFDA review.
        </p>
      </div>

      {/* Section 1: Business Information Summary */}
      <div className="bg-white border rounded-xl p-5 space-y-3">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
          <Building2 className="w-4 h-4 text-emerald-600" /> Business Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block text-xs">Legal Name</span>
            <span className="font-semibold text-gray-900">{data.legalName || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Trade Name</span>
            <span className="font-semibold text-gray-900">{data.tradeName || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Organization Type</span>
            <span className="font-semibold text-gray-900">{data.organizationTypeId || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Registration Number</span>
            <span className="font-semibold text-gray-900">{data.registrationNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">PAN</span>
            <span className="font-semibold text-gray-900 font-mono">{data.pan || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">GST Number</span>
            <span className="font-semibold text-gray-900 font-mono">{data.gstNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Established Date</span>
            <span className="font-semibold text-gray-900">{data.establishedDate || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Organization Email</span>
            <span className="font-semibold text-gray-900">{data.organizationEmail || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Organization Phone</span>
            <span className="font-semibold text-gray-900">{data.organizationPhoneNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">District / State</span>
            <span className="font-semibold text-gray-900">{data.districtId}, {data.stateId} ({data.pinCode})</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Representative</span>
            <span className="font-semibold text-gray-900">{data.representativeName} ({data.designation})</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Representative Contact</span>
            <span className="font-semibold text-gray-900">{data.representativePhoneNumber} | {data.representativeEmail}</span>
          </div>
        </div>
      </div>

      {/* Section 2: Compliances Summary */}
      <div className="bg-white border rounded-xl p-5 space-y-3">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Organic Capabilities & Compliances
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block text-xs">FSSAI License</span>
            <span className="font-semibold text-gray-900">{data.fssaiLicenseNumber} ({data.fssaiLicenseTypeId})</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">CIN Number</span>
            <span className="font-semibold text-gray-900">{data.cinNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Jaivik Bharat Registration</span>
            <span className="font-semibold text-gray-900">{data.jaivikBharatRegistration || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">IEC Number</span>
            <span className="font-semibold text-gray-900">{data.iecNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">APEDA RCMC</span>
            <span className="font-semibold text-gray-900">{data.apedaRcmcNumber || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Section 3: Infrastructure Summary */}
      <div className="bg-white border rounded-xl p-5 space-y-3">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
          <Warehouse className="w-4 h-4 text-emerald-600" /> Infrastructure Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block text-xs">Warehouse</span>
            <span className="font-semibold text-gray-900">{data.warehouse} (Cap: {data.totalStorageCapacity} {data.storageCapacityUnitId})</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Processing Facility</span>
            <span className="font-semibold text-gray-900">{data.processingFacility} (Cap: {data.processingCapacity} {data.processingCapacityUnitId})</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Cold Storage</span>
            <span className="font-semibold text-gray-900">{data.coldStorage}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Dedicated Organic Storage</span>
            <span className="font-semibold text-gray-900">{data.organicStorage}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Packaging Facility</span>
            <span className="font-semibold text-gray-900">{data.packagingFacility}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Quality Control Lab</span>
            <span className="font-semibold text-gray-900">{data.qualityControlLaboratoryId}</span>
          </div>
        </div>
      </div>

      {/* Section 4: Documents Summary */}
      <div className="bg-white border rounded-xl p-5 space-y-3">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
          <FileText className="w-4 h-4 text-emerald-600" /> Uploaded Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {Object.entries(docs).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Declaration */}
      <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
        <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" /> Legal Declaration
        </h4>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={declared}
            onChange={handleDeclarationChange}
            className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-xs text-amber-900 leading-relaxed font-medium">
            I hereby declare that all information submitted in this Organization Profile is accurate, authentic, and compliant with SOFDA guidelines and Sikkim Organic Mission regulations. I understand that submitting false or misleading information will result in rejection and statutory action.
          </span>
        </label>
        {errors.declaration && <p className="text-xs text-red-600 font-semibold">{errors.declaration}</p>}
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
