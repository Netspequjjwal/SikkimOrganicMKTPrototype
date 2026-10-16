import React, { useState } from 'react';
import { DeliveryAddress } from '../../context/OrderContext';
import { MapPin, Save, User, Building, Phone, Info, Truck, PackageCheck, Car, Calendar, Clock, AlertTriangle, CheckCircle2, Edit3 } from 'lucide-react';
import clsx from 'clsx';

interface DeliveryAddressFormProps {
  initialAddress?: DeliveryAddress;
  onSubmit: (address: DeliveryAddress) => void;
  onUpdateVehicle?: (vehicleData: { vehicleNumber: string; driverName?: string; driverContact: string; estimatedPickupDate?: string }) => void;
  readOnly?: boolean;
  supplierName?: string;
  isBuyer?: boolean;
}

const DEMO_SELLER_DELIVERY: DeliveryAddress = {
  deliveryMode: 'SELLER_DELIVERY',
  recipientName: 'Naturals India Procurement',
  companyName: 'Green Earth Organics Ltd.',
  contactNumber: '9876543210',
  altContactNumber: '03592-201234',
  address: 'Plot 45, Organic Agro Park, Deorali',
  landmark: 'Near Sikkim Milk Union Depot',
  city: 'Gangtok',
  state: 'Sikkim',
  pinCode: '737102',
  deliveryInstructions: 'Deliver to Central Organic Warehouse Gate 2, Unloading Bay A',
  preferredTime: '09:00 AM - 05:00 PM',
  specialHandling: 'Temperature controlled (15°C - 20°C), Moisture protected, Fragile packaging'
};

const DEMO_SELF_PICKUP: DeliveryAddress = {
  deliveryMode: 'SELF_PICKUP',
  recipientName: 'Amit Patel (Buyer Logistics Officer)',
  companyName: 'Nature Extracts Inc.',
  contactNumber: '9876543210',
  altContactNumber: '03592-201234',
  pickupLocation: 'Sikkim Organic Alive Central Warehouse, NH-10, Gangtok',
  address: 'Sikkim Organic Alive Central Warehouse, NH-10, Gangtok',
  city: 'Gangtok',
  state: 'Sikkim',
  pinCode: '737101',
  vehicleNumber: 'SK-01-AB-4829',
  driverName: 'Ramesh Sharma',
  driverContact: '9876512345',
  provideDriverLater: false,
  estimatedPickupDate: '2026-08-05',
  deliveryInstructions: 'Buyer vehicle will arrive with order token for direct loading at Bay 3.',
  preferredTime: '10:00 AM - 02:00 PM',
  specialHandling: 'Organic certified shipment. Tarpaulin cover mandatory on vehicle.'
};

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({ 
  initialAddress, 
  onSubmit, 
  onUpdateVehicle,
  readOnly = false,
  supplierName = 'Supplier',
  isBuyer = true
}) => {
  const [formData, setFormData] = useState<DeliveryAddress>(() => {
    if (initialAddress && initialAddress.recipientName) {
      return { 
        deliveryMode: 'SELLER_DELIVERY',
        pickupLocation: `${supplierName} Central Warehouse, Gangtok`,
        provideDriverLater: false,
        ...initialAddress 
      };
    }
    return {
      ...DEMO_SELLER_DELIVERY,
      pickupLocation: `${supplierName} Central Warehouse, Gangtok`
    };
  });

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleModalData, setVehicleModalData] = useState({
    vehicleNumber: formData.vehicleNumber || '',
    driverName: formData.driverName || '',
    driverContact: formData.driverContact || '',
    estimatedPickupDate: formData.estimatedPickupDate || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleModeChange = (mode: 'SELLER_DELIVERY' | 'SELF_PICKUP') => {
    setFormData(prev => ({
      ...prev,
      deliveryMode: mode,
      pickupLocation: prev.pickupLocation || `${supplierName} Central Warehouse, Gangtok`,
      address: mode === 'SELF_PICKUP' ? (prev.pickupLocation || `${supplierName} Central Warehouse, Gangtok`) : prev.address
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    onSubmit(formData);
  };

  const handleSaveVehicleModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleModalData.vehicleNumber || !vehicleModalData.driverContact) return;

    if (onUpdateVehicle) {
      onUpdateVehicle(vehicleModalData);
    }
    setFormData(prev => ({
      ...prev,
      ...vehicleModalData,
      provideDriverLater: false
    }));
    setShowVehicleModal(false);
  };

  const isSelfPickup = formData.deliveryMode === 'SELF_PICKUP';

  if (readOnly) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className={clsx("p-2.5 rounded-xl", isSelfPickup ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800")}>
              {isSelfPickup ? <Car className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  {isSelfPickup ? 'Self-Pickup / Consignment Collection' : 'Doorstep Delivery Destination'}
                </h3>
                <span className={clsx(
                  "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border",
                  isSelfPickup ? "bg-amber-50 text-amber-900 border-amber-300" : "bg-emerald-50 text-emerald-900 border-emerald-300"
                )}>
                  {isSelfPickup ? 'Self Delivery' : 'Seller Delivery'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isSelfPickup 
                  ? 'Buyer collects consignment directly from seller warehouse with designated vehicle.'
                  : 'Consignment is dispatched directly to the buyer destination address by the seller.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
              {isSelfPickup ? 'Authorized Collection Representative' : 'Recipient Name'}
            </p>
            <p className="font-bold text-gray-900">{formData.recipientName}</p>
            {formData.companyName && <p className="text-xs text-gray-500 mt-0.5">{formData.companyName}</p>}
          </div>

          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Contact Details</p>
            <p className="font-bold text-gray-900">{formData.contactNumber}</p>
            {formData.altContactNumber && <p className="text-xs text-gray-500 mt-0.5">Alt: {formData.altContactNumber}</p>}
          </div>

          <div className="md:col-span-2">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
              {isSelfPickup ? 'Consignment Pickup Warehouse Location' : 'Destination Address'}
            </p>
            <p className="font-medium text-gray-900">
              {isSelfPickup ? (formData.pickupLocation || formData.address) : formData.address}
            </p>
            {!isSelfPickup && (
              <p className="text-xs text-gray-500 mt-0.5">
                {formData.landmark && `${formData.landmark}, `}{formData.city}, {formData.state} - {formData.pinCode}
              </p>
            )}
          </div>

          {/* Self-Pickup Vehicle and Driver Details Card */}
          {isSelfPickup && (
            <div className="md:col-span-2 rounded-xl p-4 border bg-amber-50/70 border-amber-200">
              <div className="flex items-center justify-between mb-3 border-b border-amber-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-800" />
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">Pickup Vehicle & Driver Assignment</span>
                </div>
                {isBuyer && onUpdateVehicle && (
                  <button
                    type="button"
                    onClick={() => {
                      setVehicleModalData({
                        vehicleNumber: formData.vehicleNumber || '',
                        driverName: formData.driverName || '',
                        driverContact: formData.driverContact || '',
                        estimatedPickupDate: formData.estimatedPickupDate || ''
                      });
                      setShowVehicleModal(true);
                    }}
                    className="inline-flex items-center text-xs font-bold text-amber-800 hover:text-amber-950 bg-white border border-amber-300 px-3 py-1 rounded-lg transition-colors shadow-2xs"
                  >
                    <Edit3 className="w-3 h-3 mr-1" /> {formData.vehicleNumber ? 'Update Vehicle' : 'Assign Vehicle & Driver'}
                  </button>
                )}
              </div>

              {formData.vehicleNumber ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-amber-800 font-semibold uppercase block">Vehicle Registration</span>
                    <strong className="text-gray-900 font-mono text-sm block mt-0.5">{formData.vehicleNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-800 font-semibold uppercase block">Driver Name & Contact</span>
                    <strong className="text-gray-900 block mt-0.5">
                      {formData.driverName ? `${formData.driverName} (${formData.driverContact})` : formData.driverContact}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-800 font-semibold uppercase block">Estimated Pickup Date</span>
                    <strong className="text-gray-900 block mt-0.5">{formData.estimatedPickupDate || 'Not specified'}</strong>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 bg-white p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>Vehicle Details Pending:</strong> Buyer opted to assign pickup vehicle and driver closer to pickup date.</span>
                  </div>
                  {isBuyer && onUpdateVehicle && (
                    <button
                      type="button"
                      onClick={() => setShowVehicleModal(true)}
                      className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg text-xs transition-colors shrink-0"
                    >
                      Add Vehicle Details Now
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {(formData.deliveryInstructions || formData.specialHandling) && (
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs space-y-2">
              {formData.deliveryInstructions && (
                <div>
                  <span className="font-semibold text-gray-500 uppercase text-[10px] block">Instructions:</span>
                  <p className="text-gray-800 mt-0.5">{formData.deliveryInstructions}</p>
                </div>
              )}
              {formData.specialHandling && (
                <div>
                  <span className="font-semibold text-gray-500 uppercase text-[10px] block">Special Handling:</span>
                  <p className="text-gray-800 mt-0.5">{formData.specialHandling}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal for adding/updating vehicle details */}
        {showVehicleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-amber-50 px-6 py-4 border-b border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Car className="w-5 h-5 text-amber-700" />
                  <h3>Assign Pickup Vehicle & Driver</h3>
                </div>
                <button onClick={() => setShowVehicleModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
              </div>

              <form onSubmit={handleSaveVehicleModal} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Registration Number *</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. SK-01-AB-4829"
                    value={vehicleModalData.vehicleNumber}
                    onChange={(e) => setVehicleModalData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-mono font-bold focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Driver Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ramesh Sharma"
                    value={vehicleModalData.driverName}
                    onChange={(e) => setVehicleModalData(prev => ({ ...prev, driverName: e.target.value }))}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Driver Phone Number *</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="e.g. 9876512345"
                    value={vehicleModalData.driverContact}
                    onChange={(e) => setVehicleModalData(prev => ({ ...prev, driverContact: e.target.value }))}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Pickup Date</label>
                  <input 
                    type="date" 
                    value={vehicleModalData.estimatedPickupDate}
                    onChange={(e) => setVehicleModalData(prev => ({ ...prev, estimatedPickupDate: e.target.value }))}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowVehicleModal(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
                  >
                    Save Vehicle Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 text-emerald-700 mr-2" /> Finalize Delivery Destination & Logistics
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Choose whether to have the consignment delivered to your doorstep or collect it with your own transport.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFormData({ ...DEMO_SELLER_DELIVERY, pickupLocation: `${supplierName} Central Warehouse, Gangtok` })}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            ✨ Doorstep Demo
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...DEMO_SELF_PICKUP, pickupLocation: `${supplierName} Central Warehouse, Gangtok` })}
            className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            🚗 Self-Pickup Demo
          </button>
        </div>
      </div>

      {/* DELIVERY MODE SELECTOR CARDS */}
      <div>
        <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Select Delivery Mode *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleModeChange('SELLER_DELIVERY')}
            className={clsx(
              "p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3",
              !isSelfPickup 
                ? "border-emerald-600 bg-emerald-50/50 shadow-xs" 
                : "border-gray-200 bg-white hover:bg-gray-50"
            )}
          >
            <div className={clsx("p-2 rounded-lg", !isSelfPickup ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500")}>
              <Truck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Doorstep Delivery</span>
                {!isSelfPickup && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-xs text-gray-500 mt-1">Supplier arranges logistics and transport vehicle to your destination address.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('SELF_PICKUP')}
            className={clsx(
              "p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3",
              isSelfPickup 
                ? "border-amber-600 bg-amber-50/50 shadow-xs" 
                : "border-gray-200 bg-white hover:bg-gray-50"
            )}
          >
            <div className={clsx("p-2 rounded-lg", isSelfPickup ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-500")}>
              <Car className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Self-Pickup / Self Delivery</span>
                {isSelfPickup && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
              </div>
              <p className="text-xs text-gray-500 mt-1">Buyer collects consignment directly from seller warehouse with own vehicle.</p>
            </div>
          </button>
        </div>
      </div>

      {/* SELF-PICKUP SPECIFIC WAREHOUSE BANNER */}
      {isSelfPickup && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Consignment Pickup Location</span>
              <p className="font-bold text-sm text-amber-950 mt-0.5">
                {formData.pickupLocation || `${supplierName} Central Warehouse, Gangtok`}
              </p>
              <p className="text-xs text-amber-800 mt-1">
                Your driver will present the Order ID and Platform Token at the loading bay for dispatch release.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FORM INPUT FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isSelfPickup ? 'Authorized Collection Person Name *' : 'Recipient Name *'}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              required
              type="text" 
              name="recipientName" 
              value={formData.recipientName} 
              onChange={handleChange}
              placeholder={isSelfPickup ? "e.g. Amit Patel (Logistics Rep)" : "e.g. Naturals India Procurement"}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company / Entity Name (Optional)</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              name="companyName" 
              value={formData.companyName} 
              onChange={handleChange}
              placeholder="e.g. Green Earth Organics Ltd."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone Number *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              required
              type="tel" 
              name="contactNumber" 
              value={formData.contactNumber} 
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Contact (Optional)</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="tel" 
              name="altContactNumber" 
              value={formData.altContactNumber} 
              onChange={handleChange}
              placeholder="e.g. 03592-201234"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* DOORSTEP DELIVERY ADDRESS FIELDS */}
        {!isSelfPickup && (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Complete Destination Address *</label>
              <textarea 
                required 
                rows={3}
                name="address" 
                value={formData.address} 
                onChange={handleChange}
                placeholder="Plot / Street / Facility address where supplier should deliver"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
              <input 
                type="text" 
                name="landmark" 
                value={formData.landmark} 
                onChange={handleChange}
                placeholder="e.g. Near Milk Union Depot"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
              <input 
                required
                type="text" 
                name="pinCode" 
                value={formData.pinCode} 
                onChange={handleChange}
                placeholder="e.g. 737102"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City/Town *</label>
              <input 
                required
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleChange}
                placeholder="e.g. Gangtok"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input 
                required
                type="text" 
                name="state" 
                value={formData.state} 
                onChange={handleChange}
                placeholder="e.g. Sikkim"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>
          </>
        )}

        {/* SELF-PICKUP DRIVER & VEHICLE SECTION */}
        {isSelfPickup && (
          <div className="md:col-span-2 bg-white rounded-xl border border-amber-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <h4 className="font-bold text-gray-900 text-sm flex items-center">
                <Car className="w-4 h-4 text-amber-700 mr-2" /> Self-Pickup Vehicle & Driver Details
              </h4>
              <label className="flex items-center text-xs font-semibold text-gray-700 cursor-pointer">
                <input 
                  type="checkbox"
                  name="provideDriverLater"
                  checked={formData.provideDriverLater || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-amber-600 rounded border-gray-300 mr-2 focus:ring-amber-500"
                />
                Provide vehicle & driver details later (before pickup)
              </label>
            </div>

            {!formData.provideDriverLater ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Registration Number *</label>
                  <input 
                    required={!formData.provideDriverLater}
                    type="text" 
                    name="vehicleNumber" 
                    value={formData.vehicleNumber || ''} 
                    onChange={handleChange}
                    placeholder="e.g. SK-01-AB-4829"
                    className="w-full p-2 border border-gray-300 rounded-lg font-mono font-bold focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Driver Full Name</label>
                  <input 
                    type="text" 
                    name="driverName" 
                    value={formData.driverName || ''} 
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Driver Phone Number *</label>
                  <input 
                    required={!formData.provideDriverLater}
                    type="tel" 
                    name="driverContact" 
                    value={formData.driverContact || ''} 
                    onChange={handleChange}
                    placeholder="e.g. 9876512345"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Pickup Date</label>
                  <input 
                    type="date" 
                    name="estimatedPickupDate" 
                    value={formData.estimatedPickupDate || ''} 
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>You can finalize your address now. An alert will remind you in your Order Workspace to assign the vehicle and driver before the seller prepares the consignment for dispatch.</span>
              </div>
            )}
          </div>
        )}

        {/* ADDITIONAL INSTRUCTIONS */}
        <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
          <h4 className="font-semibold text-slate-900 text-xs flex items-center uppercase tracking-wider">
            <Info className="w-4 h-4 mr-2 text-slate-500" /> Additional Logistics Notes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {isSelfPickup ? 'Loading Bay Instructions' : 'Delivery Instructions'}
              </label>
              <textarea 
                rows={2} 
                name="deliveryInstructions" 
                value={formData.deliveryInstructions} 
                onChange={handleChange}
                placeholder={isSelfPickup ? "e.g. Vehicle will arrive at Gate 2 with platform order token" : "e.g. Deliver to warehouse gate 2, unloading bay A"}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Special Handling Requirements</label>
              <textarea 
                rows={2} 
                name="specialHandling" 
                value={formData.specialHandling} 
                onChange={handleChange}
                placeholder="e.g. Keep dry, tarpaulin cover mandatory, moisture protected"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 outline-none text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="mt-8 flex justify-end">
        <button 
          type="submit" 
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center transition-colors shadow-xs"
        >
          <Save className="w-4 h-4 mr-2" /> Save & Submit Logistics Details
        </button>
      </div>
    </form>
  );
};

export default DeliveryAddressForm;
