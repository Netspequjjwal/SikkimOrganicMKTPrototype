import React, { useState } from 'react';
import { Order, WayBillDetails } from '../../context/OrderContext';
import { Printer, FileText, CheckCircle, Save, Edit3, ShieldCheck, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  order: Order;
  onGenerate: (wayBillData: Partial<WayBillDetails>) => void;
}

const WayBillDocument: React.FC<Props> = ({ order, onGenerate }) => {
  const { user } = useAuth();
  const isSeller = user?.role === 'ICS_PROVIDER';
  const isDraft = !order.wayBillDetails?.wayBillNumber;

  const [isEditing, setIsEditing] = useState(isDraft && isSeller);
  const [formData, setFormData] = useState<Partial<WayBillDetails>>(order.wayBillDetails || {
    dispatchLocation: order.supplierName,
    logisticsPartnerName: '',
    vehicleNumber: '',
    driverContact: '',
    trackingRef: '',
    transportInstructions: '',
    qualityInspected: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    onGenerate(formData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden waybill-container">
      {/* Non-printable header actions */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden">
        <h3 className="font-bold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-primary" /> 
          {isDraft ? 'Way Bill Draft' : `Way Bill: ${order.wayBillDetails?.wayBillNumber}`}
        </h3>
        <div className="flex gap-2">
          {isSeller && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center font-medium transition-colors">
              <Edit3 className="w-4 h-4 mr-2" /> Edit Details
            </button>
          )}
          {isSeller && isEditing && (
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center font-medium transition-colors">
              <Save className="w-4 h-4 mr-2" /> {isDraft ? 'Generate Way Bill' : 'Update Way Bill'}
            </button>
          )}
          {!isDraft && (
            <button onClick={handlePrint} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center font-medium transition-colors">
              <Printer className="w-4 h-4 mr-2" /> Print / PDF
            </button>
          )}
        </div>
      </div>

      {/* Printable Area */}
      <div className="p-8 print:p-0 waybill-print-area">
        <div className="border-2 border-gray-900 p-6 print:border-none print:p-0">
          
          <div className="text-center border-b-2 border-gray-900 pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">Way Bill / Delivery Challan</h1>
            <p className="text-sm font-semibold text-gray-600">Sikkim Organic Digital Platform</p>
          </div>

          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm text-gray-500 font-bold mb-1">WAY BILL NUMBER</p>
              <p className="font-mono text-xl font-bold">{order.wayBillDetails?.wayBillNumber || 'DRAFT'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-bold mb-1">DATE OF ISSUE</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 border-t border-b border-gray-300 py-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2 underline">CONSIGNOR (Supplier)</h4>
              <p className="font-medium">{order.supplierName}</p>
              <p className="text-sm mt-1">Origin: {formData.dispatchLocation || 'Not Specified'}</p>
              <p className="text-sm mt-2 font-medium">Contract Ref: {order.contractRef || order.contractId}</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 underline">CONSIGNEE (Buyer)</h4>
              <p className="font-medium">{order.deliveryAddress?.recipientName || order.buyerName}</p>
              {order.deliveryAddress?.companyName && <p className="text-sm">{order.deliveryAddress.companyName}</p>}
              <p className="text-sm mt-1 max-w-xs leading-relaxed">
                {order.deliveryAddress?.address}, {order.deliveryAddress?.landmark ? `${order.deliveryAddress.landmark}, ` : ''}
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pinCode}
              </p>
              <p className="text-sm mt-1">Contact: {order.deliveryAddress?.contactNumber}</p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-3 bg-gray-100 p-2">ITEM DETAILS</h4>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="py-2">Description of Goods</th>
                  <th className="py-2">HSN/SAC</th>
                  <th className="py-2 text-right">Quantity</th>
                  <th className="py-2 text-right">UOM</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-medium">{order.product} (Organic Certified)</td>
                  <td className="py-3 text-gray-600">0908</td>
                  <td className="py-3 text-right font-medium">{order.quantity}</td>
                  <td className="py-3 text-right">{order.uom}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-8 bg-gray-50 border border-gray-200 p-4">
            <h4 className="font-bold text-gray-900 mb-3">LOGISTICS & DISPATCH INFO</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500 font-medium block text-xs">Logistics Partner</label>
                {isEditing ? (
                  <input type="text" name="logisticsPartnerName" value={formData.logisticsPartnerName} onChange={handleChange} className="w-full mt-1 p-1 border rounded" />
                ) : (
                  <p className="font-medium">{formData.logisticsPartnerName || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-gray-500 font-medium block text-xs">Tracking Reference</label>
                {isEditing ? (
                  <input type="text" name="trackingRef" value={formData.trackingRef} onChange={handleChange} className="w-full mt-1 p-1 border rounded" />
                ) : (
                  <p className="font-medium">{formData.trackingRef || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-gray-500 font-medium block text-xs">Vehicle Number</label>
                {isEditing ? (
                  <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="w-full mt-1 p-1 border rounded" />
                ) : (
                  <p className="font-medium">{formData.vehicleNumber || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-gray-500 font-medium block text-xs">Driver Contact</label>
                {isEditing ? (
                  <input type="text" name="driverContact" value={formData.driverContact} onChange={handleChange} className="w-full mt-1 p-1 border rounded" />
                ) : (
                  <p className="font-medium">{formData.driverContact || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-gray-500 font-medium block text-xs">Expected Delivery Date</label>
                {isEditing ? (
                  <input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate || ''} onChange={handleChange} className="w-full mt-1 p-1 border rounded" />
                ) : (
                  <p className="font-medium">{formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate).toLocaleDateString() : 'N/A'}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="flex items-center space-x-2">
                {isEditing ? (
                  <input type="checkbox" name="qualityInspected" checked={formData.qualityInspected} onChange={handleChange} className="w-4 h-4 text-primary" />
                ) : (
                  formData.qualityInspected ? <CheckCircle className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                )}
                <span className="text-sm font-bold flex items-center">
                  <ShieldCheck className="w-4 h-4 text-green-600 mr-1" /> Quality Inspection Completed Prior to Packaging
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-between mt-16 pt-8 border-t-2 border-gray-900 text-sm">
            <div className="text-center w-48">
              <div className="border-b border-gray-400 pb-8 mb-2"></div>
              <p className="font-bold">Authorized Signatory</p>
              <p className="text-gray-500">(Consignor)</p>
            </div>
            <div className="text-center w-48">
              <div className="border-b border-gray-400 pb-8 mb-2"></div>
              <p className="font-bold">Receiver's Signature</p>
              <p className="text-gray-500">(Consignee)</p>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .waybill-print-area, .waybill-print-area * {
            visibility: visible;
          }
          .waybill-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
};

export default WayBillDocument;
