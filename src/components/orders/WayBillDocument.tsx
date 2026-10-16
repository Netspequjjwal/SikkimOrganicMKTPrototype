import React, { useState } from 'react';
import { Order, WayBillDetails } from '../../context/OrderContext';
import { Printer, FileText, CheckCircle, Save, Edit3, ShieldCheck, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRBAC } from '../../context/RBACContext';
import clsx from 'clsx';

interface Props {
  order: Order;
  onGenerate: (wayBillData: Partial<WayBillDetails>) => void;
}

const WayBillDocument: React.FC<Props> = ({ order, onGenerate }) => {
  const { user } = useAuth();
  const { activeRole } = useRBAC();
  const isSeller = activeRole === 'SELLER_USER' || user?.role === 'ICS_PROVIDER' || activeRole === 'SUPER_ADMIN';
  const isDraft = !order.wayBillDetails?.wayBillNumber;
  const isSelfPickup = order.deliveryAddress?.deliveryMode === 'SELF_PICKUP';

  const defaultLogisticsPartner = isSelfPickup
    ? (order.deliveryAddress?.companyName ? `${order.deliveryAddress.companyName} (Self-Pickup)` : 'Buyer Self-Transport / Direct Pickup')
    : 'Sikkim Express Logistics Services';

  const defaultVehicleNumber = isSelfPickup
    ? (order.deliveryAddress?.vehicleNumber || (order.deliveryAddress?.provideDriverLater ? 'Pending Buyer Vehicle Assignment' : 'SK-01-AB-4829'))
    : 'SK-01-AB-4829';

  const defaultDriverContact = isSelfPickup
    ? (order.deliveryAddress?.driverName ? `${order.deliveryAddress.driverName} (${order.deliveryAddress.driverContact})` : (order.deliveryAddress?.driverContact || 'Driver Contact on Arrival'))
    : '9876512345 (Ramesh Sharma)';

  const DEMO_WAYBILL: Partial<WayBillDetails> = {
    dispatchLocation: order.deliveryAddress?.pickupLocation || (order.supplierName + ' Central Warehouse, Gangtok'),
    logisticsPartnerName: defaultLogisticsPartner,
    vehicleNumber: defaultVehicleNumber,
    driverContact: defaultDriverContact,
    trackingRef: isSelfPickup ? `PICKUP-${order.id}` : 'SE-LOG-2026-9941',
    expectedDeliveryDate: order.deliveryAddress?.estimatedPickupDate || '2026-08-05',
    transportInstructions: isSelfPickup
      ? (order.deliveryAddress?.deliveryInstructions || 'Buyer direct consignment collection. Verify order token upon vehicle arrival.')
      : 'Maintain temperature controlled environment. Handle organic produce with care.',
    qualityInspected: true,
    deliveryMode: isSelfPickup ? 'SELF_PICKUP' : 'SELLER_DELIVERY',
    tcNumber: '',
    tcIssuedDate: '',
    tcCertifyingBody: '',
    tcDocumentName: '',
    tcStatus: 'Pending'
  };

  const [isEditing, setIsEditing] = useState(isDraft && isSeller);
  const [formData, setFormData] = useState<Partial<WayBillDetails>>(() => {
    return { ...DEMO_WAYBILL, ...(order.wayBillDetails || {}) };
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
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center flex-wrap gap-2">
          <h3 className="font-bold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary" /> 
            {isDraft ? 'Way Bill Draft' : `Way Bill: ${order.wayBillDetails?.wayBillNumber}`}
          </h3>
          <span className={clsx(
            "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border",
            isSelfPickup ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-emerald-100 text-emerald-900 border-emerald-300"
          )}>
            {isSelfPickup ? '🚗 Buyer Self-Pickup' : '🚚 Seller Arranged'}
          </span>
        </div>
        <div className="flex gap-2">
          {isSeller && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center font-medium transition-colors text-xs">
              <Edit3 className="w-4 h-4 mr-2" /> Edit Details
            </button>
          )}
          {isSeller && isEditing && (
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center font-medium transition-colors text-xs">
              <Save className="w-4 h-4 mr-2" /> {isDraft ? 'Generate Way Bill' : 'Update Way Bill'}
            </button>
          )}
          {!isDraft && (
            <button onClick={handlePrint} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center font-medium transition-colors text-xs">
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
              <h4 className="font-bold text-gray-900 mb-2 underline">
                {isSelfPickup ? 'CONSIGNEE (Buyer Direct Collection)' : 'CONSIGNEE (Buyer)'}
              </h4>
              <p className="font-medium">{order.deliveryAddress?.recipientName || order.buyerName}</p>
              {order.deliveryAddress?.companyName && <p className="text-sm">{order.deliveryAddress.companyName}</p>}
              
              {isSelfPickup ? (
                <div className="text-sm mt-1.5 space-y-1">
                  <p className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">
                    Mode: Self-Pickup by Buyer Transport
                  </p>
                  <p className="text-xs text-gray-600">Pickup Location: {formData.dispatchLocation}</p>
                  <p className="text-xs text-gray-800">Assigned Vehicle: <strong className="font-mono">{formData.vehicleNumber}</strong></p>
                  <p className="text-xs text-gray-800">Driver / Contact: {formData.driverContact || order.deliveryAddress?.contactNumber}</p>
                </div>
              ) : (
                <div className="text-sm mt-1">
                  <p className="max-w-xs leading-relaxed text-gray-700">
                    {order.deliveryAddress?.address}, {order.deliveryAddress?.landmark ? `${order.deliveryAddress.landmark}, ` : ''}
                    {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pinCode}
                  </p>
                  <p className="text-sm mt-1">Contact: {order.deliveryAddress?.contactNumber}</p>
                </div>
              )}
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

          {/* MANDATORY TRANSACTION CERTIFICATE (TC) ATTACHMENT SECTION */}
          <div className={`mb-8 border rounded-xl p-5 shadow-xs ${formData.tcNumber && formData.tcDocumentName ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber-50/70 border-amber-300'}`}>
            <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
              <h4 className="font-extrabold text-gray-900 text-sm uppercase tracking-wide flex items-center">
                <ShieldCheck className={`w-5 h-5 mr-2 ${formData.tcNumber && formData.tcDocumentName ? 'text-emerald-700' : 'text-amber-700'}`} /> Organic Transaction Certificate (TC)
              </h4>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${formData.tcNumber && formData.tcDocumentName ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                {formData.tcNumber && formData.tcDocumentName ? 'Verified & Attached' : 'Pending Seller Upload'}
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-white border border-emerald-200 rounded-lg text-emerald-900 font-semibold mb-2 flex items-center">
                  <FileText className="w-4 h-4 text-emerald-700 mr-2 shrink-0" />
                  Seller Upload Requirement: Please provide the official TC Number and upload the Transaction Certificate PDF issued by the Certifying Body.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Transaction Certificate (TC) Number *</label>
                    <input 
                      type="text" 
                      name="tcNumber" 
                      value={formData.tcNumber || ''} 
                      onChange={handleChange} 
                      placeholder="e.g. TC/2026/NPOP/008492"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white font-mono font-bold focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Certifying Agency *</label>
                    <input 
                      type="text" 
                      name="tcCertifyingBody" 
                      value={formData.tcCertifyingBody || ''} 
                      onChange={handleChange} 
                      placeholder="e.g. Sikkim State Organic Certification Agency (SSOCA)"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white font-medium focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Issue Date</label>
                    <input 
                      type="date" 
                      name="tcIssuedDate" 
                      value={formData.tcIssuedDate || ''} 
                      onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Upload TC PDF Document *</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFormData(prev => ({ ...prev, tcDocumentName: e.target.files![0].name, tcStatus: 'Uploaded' }));
                          }
                        }}
                        className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                      />
                    </div>
                    {formData.tcDocumentName && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1">✓ Attached: {formData.tcDocumentName}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : formData.tcNumber && formData.tcDocumentName ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 font-semibold block text-[10px] uppercase">TC Ref Number</span>
                  <strong className="text-gray-900 font-mono text-sm block mt-0.5">{formData.tcNumber}</strong>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block text-[10px] uppercase">Certifying Body</span>
                  <strong className="text-gray-900 text-xs block mt-0.5">{formData.tcCertifyingBody || 'Sikkim Organic Certification Agency'}</strong>
                </div>
                <div className="flex items-center justify-between md:justify-end">
                  <div>
                    <span className="text-gray-500 font-semibold block text-[10px] uppercase">Attached Document</span>
                    <span className="text-gray-900 font-medium text-xs block truncate max-w-[160px]">{formData.tcDocumentName}</span>
                  </div>
                  <button 
                    onClick={() => alert(`Downloading official Transaction Certificate PDF (${formData.tcNumber})...`)}
                    className="ml-3 p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors shadow-xs shrink-0 flex items-center text-[11px] font-bold"
                    title="Download Official TC Document"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> TC PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-amber-900 font-medium bg-amber-100/60 p-3.5 rounded-lg flex items-center justify-between">
                <span>⚠️ <strong>Transaction Certificate (TC) Not Yet Uploaded:</strong> The seller must edit this document and upload the TC PDF before finalizing dispatch.</span>
                {isSeller && (
                  <button onClick={() => setIsEditing(true)} className="ml-3 text-xs font-extrabold bg-amber-700 text-white px-3 py-1.5 rounded-lg hover:bg-amber-800 transition-colors shrink-0">
                    Upload TC Now
                  </button>
                )}
              </div>
            )}
          </div>

          {isSelfPickup && (
            <div className="mb-6 bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
              <span className="text-xl">🚗</span>
              <div className="flex-1">
                <p className="font-bold text-sm">Self-Pickup Mode Activated</p>
                <p className="mt-0.5 text-amber-900 leading-relaxed">
                  The buyer has chosen self-pickup and is arranging transport. Transporter details, vehicle registration number, and driver contact are pre-filled directly from the buyer's order details. {isSeller && isEditing ? 'As the seller, you only need to ensure the Organic TC Number is entered and the Transaction Certificate (TC PDF) is attached above before generating the Way Bill.' : ''}
                </p>
              </div>
            </div>
          )}

          <div className="mb-8 bg-gray-50 border border-gray-200 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
              <h4 className="font-bold text-gray-900 text-sm">
                {isSelfPickup ? 'LOGISTICS & PICKUP VEHICLE INFO (Buyer Transport)' : 'LOGISTICS & DISPATCH INFO (Seller Arranged)'}
              </h4>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white border border-gray-300 text-gray-700">
                {isSelfPickup ? 'Buyer Arranged Vehicle' : 'Seller Arranged Transport'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500 font-medium block text-xs">
                  {isSelfPickup ? 'Transport Mode / Carrier' : 'Logistics Partner'}
                </label>
                {isEditing ? (
                  <input type="text" name="logisticsPartnerName" value={formData.logisticsPartnerName} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded text-xs bg-white" />
                ) : (
                  <p className="font-medium text-xs mt-1">{formData.logisticsPartnerName || 'N/A'}</p>
                )}
                {isSelfPickup && <p className="text-[10px] text-amber-700 mt-0.5">Pre-filled from buyer transport preference</p>}
              </div>
              <div>
                <label className="text-gray-500 font-medium block text-xs">Tracking / Pickup Token</label>
                {isEditing ? (
                  <input type="text" name="trackingRef" value={formData.trackingRef} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded text-xs bg-white font-mono" />
                ) : (
                  <p className="font-medium font-mono text-xs mt-1">{formData.trackingRef || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-gray-500 font-medium block text-xs">Vehicle Registration Number</label>
                {isEditing ? (
                  <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded text-xs bg-white font-mono font-bold" />
                ) : (
                  <p className="font-bold font-mono text-xs mt-1">{formData.vehicleNumber || 'N/A'}</p>
                )}
                {isSelfPickup && <p className="text-[10px] text-amber-700 mt-0.5">Assigned by buyer</p>}
              </div>
              <div>
                <label className="text-gray-500 font-medium block text-xs">Driver Name & Contact</label>
                {isEditing ? (
                  <input type="text" name="driverContact" value={formData.driverContact} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded text-xs bg-white" />
                ) : (
                  <p className="font-medium text-xs mt-1">{formData.driverContact || 'N/A'}</p>
                )}
                {isSelfPickup && <p className="text-[10px] text-amber-700 mt-0.5">Driver contact assigned by buyer</p>}
              </div>
              <div>
                <label className="text-gray-500 font-medium block text-xs">
                  {isSelfPickup ? 'Scheduled Pickup Date' : 'Expected Delivery Date'}
                </label>
                {isEditing ? (
                  <input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate || ''} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded text-xs bg-white" />
                ) : (
                  <p className="font-medium text-xs mt-1">{formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate).toLocaleDateString() : 'N/A'}</p>
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
