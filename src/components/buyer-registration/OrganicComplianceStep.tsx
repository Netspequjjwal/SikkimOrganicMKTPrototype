import React, { useMemo } from 'react';
import { BuyerRegistrationData } from '../../context/BuyerRegistrationContext';
import { AlertCircle } from 'lucide-react';

interface OrganicComplianceStepProps {
  data: Partial<BuyerRegistrationData>;
  errors: Record<string, string>;
  onChange: (data: Partial<BuyerRegistrationData>) => void;
}

const OrganicComplianceStep: React.FC<OrganicComplianceStepProps> = ({ data, errors, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const certificateStatus = useMemo(() => {
    if (!data.expiryDate) return null;
    
    const expiry = new Date(data.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'expired', message: 'Certificate has expired', color: 'text-red-600 bg-red-50 border-red-200' };
    if (diffDays <= 30) return { status: 'warning', message: `Expiring soon (${diffDays} days left)`, color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { status: 'valid', message: `Valid for ${diffDays} days`, color: 'text-green-600 bg-green-50 border-green-200' };
  }, [data.expiryDate]);

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">3. Organic Compliance</h2>
        <p className="mt-1 text-sm text-gray-500">Provide details of your organic certification and FSSAI licenses.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Certification Details</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Certification System <span className="text-red-500">*</span></label>
            <select
              name="certificationSystem"
              value={data.certificationSystem || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border bg-white ${errors.certificationSystem ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            >
              <option value="">Select Certification System</option>
              <option value="NPOP">NPOP (National Programme for Organic Production)</option>
              <option value="PGS-India">PGS-India (Participatory Guarantee System)</option>
              <option value="Both">Both (NPOP & PGS-India)</option>
            </select>
            {errors.certificationSystem && <p className="mt-1 text-xs text-red-600">{errors.certificationSystem}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Certification Body <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="certificationBody"
              value={data.certificationBody || ''}
              onChange={handleChange}
              placeholder="e.g. Aditi Organic Certifications, Lacon"
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.certificationBody ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            />
            {errors.certificationBody && <p className="mt-1 text-xs text-red-600">{errors.certificationBody}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Scope Certificate Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="scopeCertificateNumber"
              value={data.scopeCertificateNumber || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border uppercase ${errors.scopeCertificateNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            />
            {errors.scopeCertificateNumber && <p className="mt-1 text-xs text-red-600">{errors.scopeCertificateNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="issueDate"
              value={data.issueDate || ''}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.issueDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            />
            {errors.issueDate && <p className="mt-1 text-xs text-red-600">{errors.issueDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="expiryDate"
              value={data.expiryDate || ''}
              onChange={handleChange}
              min={data.issueDate || new Date().toISOString().split('T')[0]}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.expiryDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            />
            {errors.expiryDate && <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>}
            
            {/* Dynamic Validity Indicator */}
            {certificateStatus && (
              <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${certificateStatus.color}`}>
                {certificateStatus.status === 'warning' || certificateStatus.status === 'expired' ? <AlertCircle className="w-3 h-3 mr-1" /> : null}
                {certificateStatus.message}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Certified Product Categories <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="certifiedProductCategories"
            value={data.certifiedProductCategories || ''}
            onChange={handleChange}
            placeholder="e.g. Cereals, Pulses, Spices, Fruits"
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.certifiedProductCategories ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
          />
          {errors.certifiedProductCategories && <p className="mt-1 text-xs text-red-600">{errors.certifiedProductCategories}</p>}
        </div>
      </div>

      {/* FSSAI & Other Licenses */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">FSSAI & Marketplace Licenses</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">FSSAI License Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fssaiLicenseNumber"
              value={data.fssaiLicenseNumber || ''}
              onChange={handleChange}
              maxLength={14}
              placeholder="14-digit FSSAI Number"
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.fssaiLicenseNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            />
            {errors.fssaiLicenseNumber && <p className="mt-1 text-xs text-red-600">{errors.fssaiLicenseNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">License Type <span className="text-red-500">*</span></label>
            <select
              name="licenseType"
              value={data.licenseType || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border bg-white ${errors.licenseType ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            >
              <option value="">Select Type</option>
              <option value="Central License">Central License</option>
              <option value="State License">State License</option>
              <option value="Basic Registration">Basic Registration</option>
            </select>
            {errors.licenseType && <p className="mt-1 text-xs text-red-600">{errors.licenseType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Jaivik Bharat Registration <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input
              type="text"
              name="jaivikBharatRegistrationNumber"
              value={data.jaivikBharatRegistrationNumber || ''}
              onChange={handleChange}
              placeholder="Jaivik Bharat ID"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganicComplianceStep;
