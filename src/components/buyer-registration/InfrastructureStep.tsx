import React from 'react';
import { BuyerRegistrationData } from '../../context/BuyerRegistrationContext';

interface InfrastructureStepProps {
  data: Partial<BuyerRegistrationData>;
  errors: Record<string, string>;
  onChange: (data: Partial<BuyerRegistrationData>) => void;
}

const InfrastructureStep: React.FC<InfrastructureStepProps> = ({ data, errors, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      onChange({ [name]: value });
    } else {
      onChange({ [name]: value });
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">4. Infrastructure Details</h2>
        <p className="mt-1 text-sm text-gray-500">Provide information about your storage and processing capabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Storage Capabilities */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Storage & Warehousing</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse Availability <span className="text-red-500">*</span></label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input type="radio" name="warehouseAvailability" value="Yes" checked={data.warehouseAvailability === 'Yes'} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="warehouseAvailability" value="No" checked={data.warehouseAvailability === 'No'} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
            {errors.warehouseAvailability && <p className="mt-1 text-xs text-red-600">{errors.warehouseAvailability}</p>}
          </div>

          {data.warehouseAvailability === 'Yes' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dedicated Organic Storage? <span className="text-red-500">*</span></label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input type="radio" name="dedicatedOrganicStorage" value="Yes" checked={data.dedicatedOrganicStorage === 'Yes'} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">Yes, fully segregated</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="dedicatedOrganicStorage" value="No" checked={data.dedicatedOrganicStorage === 'No'} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">No, mixed facility</span>
                  </label>
                </div>
                {errors.dedicatedOrganicStorage && <p className="mt-1 text-xs text-red-600">{errors.dedicatedOrganicStorage}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total Storage Capacity (MT) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="storageCapacity"
                  value={data.storageCapacity || ''}
                  onChange={handleChange}
                  min="0"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.storageCapacity ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
                />
                {errors.storageCapacity && <p className="mt-1 text-xs text-red-600">{errors.storageCapacity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cold Storage Available?</label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input type="radio" name="coldStorage" value="Yes" checked={data.coldStorage === 'Yes'} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="coldStorage" value="No" checked={data.coldStorage === 'No'} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Processing Capabilities */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Processing & Packaging</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">In-house Processing Facility? <span className="text-red-500">*</span></label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input type="radio" name="processingFacility" value="Yes" checked={data.processingFacility === 'Yes'} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="processingFacility" value="No" checked={data.processingFacility === 'No'} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                <span className="ml-2 text-sm text-gray-700">No (Third-party/Trade only)</span>
              </label>
            </div>
            {errors.processingFacility && <p className="mt-1 text-xs text-red-600">{errors.processingFacility}</p>}
          </div>

          {data.processingFacility === 'Yes' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Processing Capacity (MT/Month) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="processingCapacity"
                  value={data.processingCapacity || ''}
                  onChange={handleChange}
                  min="0"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.processingCapacity ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
                />
                {errors.processingCapacity && <p className="mt-1 text-xs text-red-600">{errors.processingCapacity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">In-house Packaging Facility?</label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input type="radio" name="packagingFacility" value="Yes" checked={data.packagingFacility === 'Yes'} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="packagingFacility" value="No" checked={data.packagingFacility === 'No'} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quality Control Laboratory?</label>
                <select
                  name="qualityControlLaboratory"
                  value={data.qualityControlLaboratory || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border bg-white"
                >
                  <option value="">Select Option</option>
                  <option value="In-house">In-house</option>
                  <option value="Outsourced (NABL Accredited)">Outsourced (NABL Accredited)</option>
                  <option value="None">None</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="pt-4">
        <label className="block text-sm font-medium text-gray-700">Describe your Organic Handling & Segregation Process <span className="text-gray-400 font-normal">(Optional)</span></label>
        <textarea
          name="organicHandlingProcess"
          rows={3}
          value={data.organicHandlingProcess || ''}
          onChange={handleChange}
          placeholder="Briefly describe how you ensure organic integrity during storage, processing, and transit..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border"
        />
      </div>

    </div>
  );
};

export default InfrastructureStep;
