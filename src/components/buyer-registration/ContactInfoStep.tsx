import React from 'react';
import { BuyerRegistrationData } from '../../context/BuyerRegistrationContext';
import { MapPin } from 'lucide-react';

interface ContactInfoStepProps {
  data: Partial<BuyerRegistrationData>;
  errors: Record<string, string>;
  onChange: (data: Partial<BuyerRegistrationData>) => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ data, errors, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleCopyAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange({ communicationAddress: data.registeredAddress || '' });
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">2. Contact Information</h2>
        <p className="mt-1 text-sm text-gray-500">Details of the authorized representative and business location.</p>
      </div>

      {/* Authorized Representative Details */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Representative Details</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Authorized Representative Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="authorizedRepresentative"
              value={data.authorizedRepresentative || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.authorizedRepresentative ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            />
            {errors.authorizedRepresentative && <p className="mt-1 text-xs text-red-600">{errors.authorizedRepresentative}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Designation</label>
            <input
              type="text"
              name="designation"
              value={data.designation || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">+91</span>
              <input
                type="tel"
                name="mobileNumber"
                maxLength={10}
                value={data.mobileNumber || ''}
                onChange={handleChange}
                className={`flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-md border ${errors.mobileNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'} sm:text-sm`}
              />
            </div>
            {errors.mobileNumber && <p className="mt-1 text-xs text-red-600">{errors.mobileNumber}</p>}
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Alternate Mobile</label>
            <input
              type="tel"
              name="alternateMobile"
              maxLength={10}
              value={data.alternateMobile || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Official Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={data.email || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Address Details</h3>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Registered Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Registered Office Address <span className="text-red-500">*</span></label>
            <textarea
              name="registeredAddress"
              rows={3}
              value={data.registeredAddress || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.registeredAddress ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            />
            {errors.registeredAddress && <p className="mt-1 text-xs text-red-600">{errors.registeredAddress}</p>}
          </div>

          {/* Communication Address */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Communication Address</label>
              <div className="flex items-center">
                <input
                  id="sameAsRegistered"
                  name="sameAsRegistered"
                  type="checkbox"
                  onChange={handleCopyAddress}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="sameAsRegistered" className="ml-2 block text-xs text-gray-500 cursor-pointer">
                  Same as Registered
                </label>
              </div>
            </div>
            <textarea
              name="communicationAddress"
              rows={3}
              value={data.communicationAddress || ''}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">State <span className="text-red-500">*</span></label>
            <select
              name="state"
              value={data.state || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border bg-white ${errors.state ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            >
              <option value="">Select State</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Other">Other</option>
            </select>
            {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">District <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="district"
              value={data.district || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.district ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            />
            {errors.district && <p className="mt-1 text-xs text-red-600">{errors.district}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">PIN Code <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="pinCode"
              maxLength={6}
              value={data.pinCode || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.pinCode ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
            />
            {errors.pinCode && <p className="mt-1 text-xs text-red-600">{errors.pinCode}</p>}
          </div>
        </div>

        {/* Map Location Picker Mock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Google Map Location</label>
          <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <MapPin className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-600">Click to pin exact location on map</p>
            <p className="text-xs text-gray-400 mt-1">Improves logistics and verification accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoStep;
