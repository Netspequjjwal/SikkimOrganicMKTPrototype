import React from 'react';
import { OrganizationData } from '../../context/OrganizationContext';
import { Warehouse, Factory, Snowflake, Layers, TestTube } from 'lucide-react';

interface InfrastructureStepProps {
  data: Partial<OrganizationData>;
  errors: Record<string, string>;
  onChange: (data: Partial<OrganizationData>) => void;
}

const STORAGE_UNITS = ['MT', 'Quintals', 'KG', 'Bags'];
const PROCESSING_UNITS = ['MT/Day', 'Quintals/Day', 'Tons/Year', 'Kg/Hour'];
const LAB_TYPES = ['In-House', 'Third-Party NABL Accredited', 'Government Certified Lab', 'None'];

const InfrastructureStep: React.FC<InfrastructureStepProps> = ({ data, errors, onChange }) => {
  const handleChange = (field: keyof OrganizationData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
          <Warehouse className="w-5 h-5 text-emerald-600" /> 3. Infrastructure & Processing Capabilities
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Specify your facility capabilities, storage capacities, and quality control setup.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-1 flex items-center gap-2">
          <Factory className="w-4 h-4 text-emerald-600" /> Facilities Availability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Warehouse */}
          <div className="p-4 border rounded-xl bg-gray-50/50 space-y-2">
            <label className="block text-sm font-bold text-gray-800 flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-emerald-600" /> Warehouse
            </label>
            <div className="flex gap-4 pt-1">
              {['Yes', 'No'].map((opt) => (
                <label key={opt} className="inline-flex items-center text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="warehouse"
                    value={opt}
                    checked={data.warehouse === opt}
                    onChange={(e) => handleChange('warehouse', e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Processing Facility */}
          <div className="p-4 border rounded-xl bg-gray-50/50 space-y-2">
            <label className="block text-sm font-bold text-gray-800 flex items-center gap-2">
              <Factory className="w-4 h-4 text-emerald-600" /> Processing Facility
            </label>
            <div className="flex gap-4 pt-1">
              {['Yes', 'No'].map((opt) => (
                <label key={opt} className="inline-flex items-center text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="processingFacility"
                    value={opt}
                    checked={data.processingFacility === opt}
                    onChange={(e) => handleChange('processingFacility', e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cold Storage */}
          <div className="p-4 border rounded-xl bg-gray-50/50 space-y-2">
            <label className="block text-sm font-bold text-gray-800 flex items-center gap-2">
              <Snowflake className="w-4 h-4 text-blue-600" /> Cold Storage
            </label>
            <div className="flex gap-4 pt-1">
              {['Yes', 'No'].map((opt) => (
                <label key={opt} className="inline-flex items-center text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="coldStorage"
                    value={opt}
                    checked={data.coldStorage === opt}
                    onChange={(e) => handleChange('coldStorage', e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dedicated Organic Storage */}
          <div className="p-4 border rounded-xl bg-gray-50/50 space-y-2">
            <label className="block text-sm font-bold text-gray-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Dedicated Organic Storage
            </label>
            <div className="flex gap-4 pt-1">
              {['Yes', 'No'].map((opt) => (
                <label key={opt} className="inline-flex items-center text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="organicStorage"
                    value={opt}
                    checked={data.organicStorage === opt}
                    onChange={(e) => handleChange('organicStorage', e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Packaging Facility */}
          <div className="p-4 border rounded-xl bg-gray-50/50 space-y-2">
            <label className="block text-sm font-bold text-gray-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Packaging Facility
            </label>
            <div className="flex gap-4 pt-1">
              {['Yes', 'No'].map((opt) => (
                <label key={opt} className="inline-flex items-center text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="packagingFacility"
                    value={opt}
                    checked={data.packagingFacility === opt}
                    onChange={(e) => handleChange('packagingFacility', e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Capacities & Lab Details */}
      <div className="space-y-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-1 flex items-center gap-2">
          <TestTube className="w-4 h-4 text-emerald-600" /> Capacities & Quality Setup
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Storage Capacity */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Storage Capacity
              </label>
              <input
                type="number"
                value={data.totalStorageCapacity || ''}
                onChange={(e) => handleChange('totalStorageCapacity', e.target.value)}
                placeholder="e.g. 250"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={data.storageCapacityUnitId || 'MT'}
                onChange={(e) => handleChange('storageCapacityUnitId', e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                {STORAGE_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Processing Capacity */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Processing Capacity
              </label>
              <input
                type="number"
                value={data.processingCapacity || ''}
                onChange={(e) => handleChange('processingCapacity', e.target.value)}
                placeholder="e.g. 15"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={data.processingCapacityUnitId || 'MT/Day'}
                onChange={(e) => handleChange('processingCapacityUnitId', e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                {PROCESSING_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quality Control Lab */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quality Control Laboratory
            </label>
            <select
              value={data.qualityControlLaboratoryId || ''}
              onChange={(e) => handleChange('qualityControlLaboratoryId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Quality Control Setup</option>
              {LAB_TYPES.map((lab) => (
                <option key={lab} value={lab}>
                  {lab}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureStep;
