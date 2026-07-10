import React, { useState } from 'react';
import { DeliveryAddress } from '../../context/OrderContext';
import { MapPin, Save, User, Building, Phone, Info } from 'lucide-react';

interface DeliveryAddressFormProps {
  initialAddress?: DeliveryAddress;
  onSubmit: (address: DeliveryAddress) => void;
  readOnly?: boolean;
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({ initialAddress, onSubmit, readOnly = false }) => {
  const [formData, setFormData] = useState<DeliveryAddress>(initialAddress || {
    recipientName: '',
    companyName: '',
    contactNumber: '',
    altContactNumber: '',
    address: '',
    landmark: '',
    city: '',
    state: 'Sikkim',
    pinCode: '',
    deliveryInstructions: '',
    preferredTime: '',
    specialHandling: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    onSubmit(formData);
  };

  if (readOnly) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 text-gray-400 mr-2" /> Delivery Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Recipient</p>
            <p className="font-medium text-gray-900">{formData.recipientName}</p>
            {formData.companyName && <p className="text-sm text-gray-600">{formData.companyName}</p>}
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Contact</p>
            <p className="font-medium text-gray-900">{formData.contactNumber}</p>
            {formData.altContactNumber && <p className="text-sm text-gray-600">Alt: {formData.altContactNumber}</p>}
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Address</p>
            <p className="font-medium text-gray-900">{formData.address}</p>
            <p className="text-gray-600">
              {formData.landmark && `${formData.landmark}, `}{formData.city}, {formData.state} - {formData.pinCode}
            </p>
          </div>
          {(formData.deliveryInstructions || formData.specialHandling) && (
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
              {formData.deliveryInstructions && (
                <div className="mb-2">
                  <p className="text-sm text-gray-500 font-medium">Delivery Instructions:</p>
                  <p className="text-sm text-gray-700">{formData.deliveryInstructions}</p>
                </div>
              )}
              {formData.specialHandling && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">Special Handling:</p>
                  <p className="text-sm text-gray-700">{formData.specialHandling}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <MapPin className="w-5 h-5 text-primary mr-2" /> Finalize Delivery Destination
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              required
              type="text" name="recipientName" value={formData.recipientName} onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" name="companyName" value={formData.companyName} onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              required
              type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Contact (Optional)</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="tel" name="altContactNumber" value={formData.altContactNumber} onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address *</label>
          <textarea 
            required rows={3}
            name="address" value={formData.address} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
          <input 
            type="text" name="landmark" value={formData.landmark} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
          <input 
            required
            type="text" name="pinCode" value={formData.pinCode} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City/Town *</label>
          <input 
            required
            type="text" name="city" value={formData.city} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
          <input 
            required
            type="text" name="state" value={formData.state} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-4">
          <h4 className="font-medium text-blue-900 flex items-center">
            <Info className="w-4 h-4 mr-2" /> Additional Instructions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions</label>
              <textarea 
                rows={2} name="deliveryInstructions" value={formData.deliveryInstructions} onChange={handleChange}
                placeholder="e.g., Deliver to warehouse gate 2"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Handling Requirements</label>
              <textarea 
                rows={2} name="specialHandling" value={formData.specialHandling} onChange={handleChange}
                placeholder="e.g., Keep dry, fragile"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-bold flex items-center transition-colors">
          <Save className="w-5 h-5 mr-2" /> Save & Submit Delivery Details
        </button>
      </div>
    </form>
  );
};

export default DeliveryAddressForm;
