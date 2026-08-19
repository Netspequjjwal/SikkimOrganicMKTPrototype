import React from 'react';
import { OrganizationData } from '../../context/OrganizationContext';
import { ShieldCheck, FileCheck } from 'lucide-react';

interface CompliancesStepProps {
  data: Partial<OrganizationData>;
  errors: Record<string, string>;
  onChange: (data: Partial<OrganizationData>) => void;
}

const FSSAI_LICENSE_TYPES = [
  'Central License',
  'State License',
  'Basic Registration'
];

const CompliancesStep: React.FC<CompliancesStepProps> = ({ data, errors, onChange }) => {
  const handleChange = (field: keyof OrganizationData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> 2. Organic Capabilities & Statutory Compliances
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Provide your food safety, organic registration, and export compliance credentials.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-1 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600" /> Statutory & Regulatory Licenses
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FSSAI License Type <span className="text-red-500">*</span>
            </label>
            <select
              value={data.fssaiLicenseTypeId || ''}
              onChange={(e) => handleChange('fssaiLicenseTypeId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.fssaiLicenseTypeId ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select FSSAI License Type</option>
              {FSSAI_LICENSE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.fssaiLicenseTypeId && (
              <p className="mt-1 text-xs text-red-600">{errors.fssaiLicenseTypeId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FSSAI License Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={14}
              value={data.fssaiLicenseNumber || ''}
              onChange={(e) => handleChange('fssaiLicenseNumber', e.target.value)}
              placeholder="e.g. 11419850000123"
              className={`w-full px-3 py-2 border rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 ${
                errors.fssaiLicenseNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.fssaiLicenseNumber && (
              <p className="mt-1 text-xs text-red-600">{errors.fssaiLicenseNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CIN (Corporate Identification Number)
            </label>
            <input
              type="text"
              maxLength={21}
              value={data.cinNumber || ''}
              onChange={(e) => handleChange('cinNumber', e.target.value.toUpperCase())}
              placeholder="e.g. U12345SK2018PTC001234"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jaivik Bharat Registration Number
            </label>
            <input
              type="text"
              value={data.jaivikBharatRegistration || ''}
              onChange={(e) => handleChange('jaivikBharatRegistration', e.target.value)}
              placeholder="e.g. JB/2025/12345"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IEC (Import Export Code) Number
            </label>
            <input
              type="text"
              maxLength={10}
              value={data.iecNumber || ''}
              onChange={(e) => handleChange('iecNumber', e.target.value)}
              placeholder="e.g. 1234567890 (Mandatory for Exporters)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              APEDA RCMC Number
            </label>
            <input
              type="text"
              value={data.apedaRcmcNumber || ''}
              onChange={(e) => handleChange('apedaRcmcNumber', e.target.value)}
              placeholder="e.g. APEDA/RCMC/2026/0912"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompliancesStep;
