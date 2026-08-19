import React from 'react';
import { OrganizationData } from '../../context/OrganizationContext';
import { Building2, User, MapPin, Mail, Phone } from 'lucide-react';

interface BusinessInfoStepProps {
  data: Partial<OrganizationData>;
  errors: Record<string, string>;
  onChange: (data: Partial<OrganizationData>) => void;
}

const ORG_TYPES = [
  'Private Limited Company',
  'Proprietorship',
  'Partnership Firm',
  'Limited Liability Partnership (LLP)',
  'Farmer Producer Organization (FPO)',
  'Cooperative Society',
  'Public Limited Company',
  'Self Help Group (SHG)'
];

const SIKKIM_DISTRICTS = [
  'Gangtok',
  'Namchi',
  'Mangan',
  'Gyalshing',
  'Soreng',
  'Pakyong'
];

const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({ data, errors, onChange }) => {
  const handleChange = (field: keyof OrganizationData, value: string) => {
    onChange({ [field]: value });
  };

  const handleSameAddressToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange({ communicationAddress: data.registeredAddress || '' });
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-600" /> 1. Organization & Business Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Provide the primary legal and contact information for your organization.
        </p>
      </div>

      {/* Organization Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-1">
          Legal Entity & Identification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Legal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.legalName || ''}
              onChange={(e) => handleChange('legalName', e.target.value)}
              placeholder="e.g. Sikkim Organic Farmers Cooperative Ltd."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.legalName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.legalName && <p className="mt-1 text-xs text-red-600">{errors.legalName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trade Name / Brand Name
            </label>
            <input
              type="text"
              value={data.tradeName || ''}
              onChange={(e) => handleChange('tradeName', e.target.value)}
              placeholder="e.g. Sikkim Organics"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Type <span className="text-red-500">*</span>
            </label>
            <select
              value={data.organizationTypeId || ''}
              onChange={(e) => handleChange('organizationTypeId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.organizationTypeId ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select Organization Type</option>
              {ORG_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.organizationTypeId && (
              <p className="mt-1 text-xs text-red-600">{errors.organizationTypeId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.registrationNumber || ''}
              onChange={(e) => handleChange('registrationNumber', e.target.value)}
              placeholder="e.g. REG-2026-SK-8891"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.registrationNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.registrationNumber && (
              <p className="mt-1 text-xs text-red-600">{errors.registrationNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PAN (Permanent Account Number) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              value={data.pan || ''}
              onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
              placeholder="e.g. ABCDE1234F"
              className={`w-full px-3 py-2 border rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 ${
                errors.pan ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.pan && <p className="mt-1 text-xs text-red-600">{errors.pan}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={15}
              value={data.gstNumber || ''}
              onChange={(e) => handleChange('gstNumber', e.target.value.toUpperCase())}
              placeholder="e.g. 11ABCDE1234F1Z5"
              className={`w-full px-3 py-2 border rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 ${
                errors.gstNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.gstNumber && <p className="mt-1 text-xs text-red-600">{errors.gstNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Established Date / Year <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={data.establishedDate || ''}
              onChange={(e) => handleChange('establishedDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.establishedDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.establishedDate && (
              <p className="mt-1 text-xs text-red-600">{errors.establishedDate}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-1 flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-600" /> Organization Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={data.organizationEmail || ''}
              onChange={(e) => handleChange('organizationEmail', e.target.value)}
              placeholder="e.g. contact@karmapaorganic.in"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.organizationEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.organizationEmail && (
              <p className="mt-1 text-xs text-red-600">{errors.organizationEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              value={data.organizationPhoneNumber || ''}
              onChange={(e) => handleChange('organizationPhoneNumber', e.target.value)}
              placeholder="e.g. 9876543210"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.organizationPhoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.organizationPhoneNumber && (
              <p className="mt-1 text-xs text-red-600">{errors.organizationPhoneNumber}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-1 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" /> Address Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              readOnly
              value={data.stateId || 'Sikkim'}
              onChange={(e) => handleChange('stateId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-semibold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <select
              value={data.districtId || ''}
              onChange={(e) => handleChange('districtId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.districtId ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select District</option>
              {SIKKIM_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.districtId && <p className="mt-1 text-xs text-red-600">{errors.districtId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pin Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={6}
              value={data.pinCode || ''}
              onChange={(e) => handleChange('pinCode', e.target.value)}
              placeholder="e.g. 737101"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.pinCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.pinCode && <p className="mt-1 text-xs text-red-600">{errors.pinCode}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registered Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={data.registeredAddress || ''}
              onChange={(e) => handleChange('registeredAddress', e.target.value)}
              placeholder="Full registered office address..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.registeredAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.registeredAddress && (
              <p className="mt-1 text-xs text-red-600">{errors.registeredAddress}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Communication Address <span className="text-red-500">*</span>
              </label>
              <label className="flex items-center text-xs text-emerald-700 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={handleSameAddressToggle}
                  className="mr-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                Same as Registered
              </label>
            </div>
            <textarea
              rows={3}
              value={data.communicationAddress || ''}
              onChange={(e) => handleChange('communicationAddress', e.target.value)}
              placeholder="Full correspondence address..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.communicationAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.communicationAddress && (
              <p className="mt-1 text-xs text-red-600">{errors.communicationAddress}</p>
            )}
          </div>
        </div>
      </div>

      {/* Representative Details */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-1 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" /> Authorized Representative Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Representative Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.representativeName || ''}
              onChange={(e) => handleChange('representativeName', e.target.value)}
              placeholder="e.g. Tenzing Bhutia"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.representativeName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.representativeName && (
              <p className="mt-1 text-xs text-red-600">{errors.representativeName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.designation || ''}
              onChange={(e) => handleChange('designation', e.target.value)}
              placeholder="e.g. Managing Director / Authorized Signatory"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.designation ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.designation && (
              <p className="mt-1 text-xs text-red-600">{errors.designation}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Representative Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={data.representativeEmail || ''}
              onChange={(e) => handleChange('representativeEmail', e.target.value)}
              placeholder="e.g. tenzing@karmapaorganic.in"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.representativeEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.representativeEmail && (
              <p className="mt-1 text-xs text-red-600">{errors.representativeEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Representative Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              value={data.representativePhoneNumber || ''}
              onChange={(e) => handleChange('representativePhoneNumber', e.target.value)}
              placeholder="e.g. 9876543210"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                errors.representativePhoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.representativePhoneNumber && (
              <p className="mt-1 text-xs text-red-600">{errors.representativePhoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Representative Alternative Phone Number
            </label>
            <input
              type="tel"
              maxLength={10}
              value={data.representativeAltPhoneNumber || ''}
              onChange={(e) => handleChange('representativeAltPhoneNumber', e.target.value)}
              placeholder="e.g. 9876543211"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
