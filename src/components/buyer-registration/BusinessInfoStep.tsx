import React from 'react';
import { BuyerRegistrationData } from '../../context/BuyerRegistrationContext';

interface BusinessInfoStepProps {
  data: Partial<BuyerRegistrationData>;
  errors: Record<string, string>;
  onChange: (data: Partial<BuyerRegistrationData>) => void;
}

const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({ data, errors, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">1. Organization Details</h2>
        <p className="mt-1 text-sm text-gray-500">Provide the primary business information for your entity.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Legal Entity Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Legal Entity Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="legalEntityName"
            value={data.legalEntityName || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.legalEntityName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            placeholder="e.g. Organic Foods Pvt. Ltd."
          />
          {errors.legalEntityName && <p className="mt-1 text-xs text-red-600">{errors.legalEntityName}</p>}
        </div>

        {/* Trade Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Trade Name / Brand Name</label>
          <input
            type="text"
            name="tradeName"
            value={data.tradeName || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border"
            placeholder="e.g. Nature's Best"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Type <span className="text-red-500">*</span></label>
          <select
            name="businessType"
            value={data.businessType || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border bg-white ${errors.businessType ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
          >
            <option value="">Select Business Type</option>
            <option value="Trader">Trader</option>
            <option value="Processor">Processor</option>
            <option value="Exporter">Exporter</option>
            <option value="Retailer">Retailer</option>
            <option value="Institutional Buyer">Institutional Buyer</option>
            <option value="Food Manufacturer">Food Manufacturer</option>
          </select>
          {errors.businessType && <p className="mt-1 text-xs text-red-600">{errors.businessType}</p>}
        </div>

        {/* Organization Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Organization Type <span className="text-red-500">*</span></label>
          <select
            name="organizationType"
            value={data.organizationType || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border bg-white ${errors.organizationType ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
          >
            <option value="">Select Organization Type</option>
            <option value="Proprietorship">Proprietorship</option>
            <option value="Partnership">Partnership</option>
            <option value="LLP">LLP</option>
            <option value="Private Limited">Private Limited</option>
            <option value="Public Limited">Public Limited</option>
            <option value="Co-operative">Co-operative</option>
          </select>
          {errors.organizationType && <p className="mt-1 text-xs text-red-600">{errors.organizationType}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* GSTIN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">GSTIN <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="gstin"
            value={data.gstin || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border uppercase ${errors.gstin ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            placeholder="e.g. 29ABCDE1234F1Z5"
          />
          {errors.gstin && <p className="mt-1 text-xs text-red-600">{errors.gstin}</p>}
        </div>

        {/* PAN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">PAN <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="pan"
            value={data.pan || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border uppercase ${errors.pan ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            placeholder="e.g. ABCDE1234F"
          />
          {errors.pan && <p className="mt-1 text-xs text-red-600">{errors.pan}</p>}
        </div>

        {/* IEC */}
        <div>
          <label className="block text-sm font-medium text-gray-700">IEC <span className="text-gray-400 font-normal">(Mandatory for Exporters)</span></label>
          <input
            type="text"
            name="iec"
            value={data.iec || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border uppercase ${errors.iec ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            placeholder="e.g. 1234567890"
          />
          {errors.iec && <p className="mt-1 text-xs text-red-600">{errors.iec}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* CIN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">CIN <span className="text-gray-400 font-normal">(Optional)</span></label>
          <input
            type="text"
            name="cin"
            value={data.cin || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border uppercase"
            placeholder="Corporate Identity Number"
          />
        </div>

        {/* Year of Est */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Year of Establishment</label>
          <input
            type="number"
            name="yearOfEstablishment"
            value={data.yearOfEstablishment || ''}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear()}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border"
            placeholder="YYYY"
          />
        </div>

        {/* Annual Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Annual Procurement Capacity (MT)</label>
          <input
            type="number"
            name="annualProcurementCapacity"
            value={data.annualProcurementCapacity || ''}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border"
            placeholder="e.g. 500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Company Website</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            https://
          </span>
          <input
            type="text"
            name="website"
            value={data.website || ''}
            onChange={handleChange}
            className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-md border border-gray-300 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="www.example.com"
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
