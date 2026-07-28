import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, OrderStatus, WayBillDetails } from '../../../context/OrderContext';
import { useAuth } from '../../../context/AuthContext';
import { Package, MapPin, Truck, ChevronRight, FileText, CheckCircle2, Clock, Send, MessageSquare, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import OrderProgressTracker from '../../../components/orders/OrderProgressTracker';
import DeliveryAddressForm from '../../../components/orders/DeliveryAddressForm';
import WayBillDocument from '../../../components/orders/WayBillDocument';
import TransactionMap from '../../../components/common/TransactionMap';
import { useActionCenter } from '../../../context/ActionCenterContext';

const OrderWorkspace: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, updateOrderStatus, submitDeliveryAddress, requestAddressConfirmation, confirmDeliveryAddress, confirmDeliveryReceipt } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { logAction } = useActionCenter();
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const handleUpdateStatus = (status: OrderStatus, note: string, wayBillData?: Partial<WayBillDetails>) => {
    updateOrderStatus(orderId as string, status, note, wayBillData);
    
    // Log this action to the Action Center
    logAction({
      title: `Order Status: ${status}`,
      description: `Order ${orderId} is now ${status}.`,
      iconType: 'order',
      actionUrl: `/dashboard/buyer-orders/${orderId}`,
      refId: orderId
    });
  };

  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    return <div className="p-10 text-center">Order not found.</div>;
  }

  const isBuyer = user?.role === 'BUYER';
  const isSeller = user?.role === 'ICS_PROVIDER';

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-green-100 text-green-800';
    if (status.includes('Delivered')) return 'bg-purple-100 text-purple-800';
    if (status.includes('Transit') || status.includes('Dispatch') || status.includes('Way Bill')) return 'bg-blue-100 text-blue-800';
    if (status.includes('Awaiting')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <TransactionMap orderId={order.id} currentStep="order" />

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="hover:text-primary cursor-pointer" onClick={() => navigate(-1)}>Orders</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-gray-900">{order.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            {order.product} <span className="text-gray-500 font-normal text-lg ml-2">({order.quantity} {order.uom})</span>
          </h1>
          <div className="flex gap-4 items-center">
            <span className={clsx('px-3 py-1 rounded-full text-sm font-semibold', getStatusColor(order.status))}>
              {order.status}
            </span>
            <span className="text-gray-500 text-sm">Contract: {order.contractRef || order.contractId}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">{isBuyer ? 'Supplier' : 'Buyer'}</p>
          <p className="font-bold text-gray-900 text-lg">{isBuyer ? order.supplierName : order.buyerName}</p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <OrderProgressTracker currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Card: High Priority Address Confirmation */}
          {order.status === 'Awaiting Buyer Delivery Confirmation' && (
            <>
              {isBuyer && (
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg">Final Delivery Confirmation Required</h3>
                      <p className="text-sm opacity-90 mt-0.5">Please verify and confirm the delivery address below so supplier <strong>{order.supplierName}</strong> can initiate dispatch.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      confirmDeliveryAddress(order.id);
                      logAction({
                        title: `Delivery Address Confirmed`,
                        description: `${order.buyerName} confirmed the final delivery address for Order ${order.id}.`,
                        iconType: 'order',
                        actionUrl: `/dashboard/orders/${order.id}`,
                        refId: order.id
                      });
                    }}
                    className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 py-3 rounded-xl shadow-md transition-all whitespace-nowrap shrink-0"
                  >
                    Confirm Address Now
                  </button>
                </div>
              )}

              {isSeller && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-blue-600 shrink-0" />
                    <div>
                      <h3 className="font-bold text-blue-900 text-base">Awaiting Buyer Confirmation</h3>
                      <p className="text-xs text-blue-700 mt-1">The delivery destination has been sent to {order.buyerName} for final confirmation.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => requestAddressConfirmation(order.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
                  >
                    Re-send Request
                  </button>
                </div>
              )}
            </>
          )}

          {/* Action Card: Delivery Confirmation / Mark Delivered */}
          {['Shipment In Transit', 'Out for Delivery', 'Delivered (Awaiting Buyer Confirmation)'].includes(order.status) && isBuyer && (
             <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 shadow-sm text-center">
              <CheckCircle2 className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-purple-900 mb-2">Delivery Received?</h3>
              <p className="text-purple-800 text-sm mb-6 max-w-lg mx-auto">Have you received your shipment of {order.quantity} {order.uom} of {order.product}? Confirm receipt to complete this order and unlock final payment release.</p>
              <button 
                onClick={() => {
                  confirmDeliveryReceipt(order.id);
                  navigate('/dashboard/payments/ledger');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                Mark Order as Delivered & Release Payment
              </button>
           </div>
          )}

          {/* Delivery Address Section (Form or Read-Only Card) */}
          {(!order.deliveryAddress || isEditingAddress) ? (
            <div className="space-y-6">
              {!order.deliveryAddress && order.status === 'Ready for Delivery Details' && (
                <>
                  {isBuyer && (
                    <DeliveryAddressForm 
                      onSubmit={(addr) => submitDeliveryAddress(order.id, addr)} 
                    />
                  )}
                  {isSeller && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center shadow-sm">
                      <Clock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-blue-900 mb-2">Waiting for Buyer</h3>
                      <p className="text-blue-800 text-sm">The advance payment was received. The buyer has been notified to provide their delivery address.</p>
                    </div>
                  )}
                </>
              )}
              {isEditingAddress && order.deliveryAddress && (
                <DeliveryAddressForm 
                  initialAddress={order.deliveryAddress}
                  onSubmit={(addr) => {
                    submitDeliveryAddress(order.id, addr);
                    setIsEditingAddress(false);
                  }} 
                />
              )}
            </div>
          ) : (
            <div className="relative">
              <DeliveryAddressForm initialAddress={order.deliveryAddress} onSubmit={() => {}} readOnly={true} />
              {isBuyer && !['Delivered (Awaiting Buyer Confirmation)', 'Completed'].includes(order.status) && (
                <button 
                  onClick={() => setIsEditingAddress(true)}
                  className="absolute top-6 right-6 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors shadow-xs"
                >
                  Edit Address
                </button>
              )}
            </div>
          )}

          {/* Fulfillment & Logistics Preparation Section */}
          {(['Delivery Address Confirmed', 'Preparing Order', 'Quality Inspection Completed', 'Packaging Completed', 'Ready for Dispatch', 'Way Bill Generated', 'Handed Over to Logistics Partner', 'Shipment In Transit', 'Out for Delivery'].includes(order.status) || order.status === 'Delivered (Awaiting Buyer Confirmation)' || order.status === 'Completed') && (
            <div className="space-y-6">
              {/* Seller Controls */}
              {isSeller && !['Delivered (Awaiting Buyer Confirmation)', 'Completed'].includes(order.status) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 text-base mb-4">Update Fulfilment Status</h3>
                  <div className="flex flex-wrap gap-3">
                    {order.status === 'Delivery Address Confirmed' && (
                      <button onClick={() => handleUpdateStatus('Preparing Order', 'Order preparation started.')} className="bg-emerald-700 text-white hover:bg-emerald-800 px-4 py-2 rounded-xl font-bold text-xs transition-colors">
                        Start Order Preparation
                      </button>
                    )}
                    {order.status === 'Preparing Order' && (
                      <button onClick={() => handleUpdateStatus('Quality Inspection Completed', 'Quality inspection passed.')} className="bg-emerald-700 text-white hover:bg-emerald-800 px-4 py-2 rounded-xl font-bold text-xs transition-colors">
                        Mark Quality Inspected
                      </button>
                    )}
                    {order.status === 'Quality Inspection Completed' && (
                      <button onClick={() => handleUpdateStatus('Packaging Completed', 'Packaging is complete.')} className="bg-emerald-700 text-white hover:bg-emerald-800 px-4 py-2 rounded-xl font-bold text-xs transition-colors">
                        Mark Packaging Complete
                      </button>
                    )}
                    {order.status === 'Packaging Completed' && (
                      <button onClick={() => handleUpdateStatus('Ready for Dispatch', 'Order is ready for dispatch.')} className="bg-emerald-700 text-white hover:bg-emerald-800 px-4 py-2 rounded-xl font-bold text-xs transition-colors">
                        Mark Ready for Dispatch
                      </button>
                    )}
                    {order.status === 'Way Bill Generated' && (
                      <button onClick={() => handleUpdateStatus('Ready for Dispatch', 'Order is ready for dispatch.')} className="bg-emerald-700 text-white hover:bg-emerald-800 px-4 py-2 rounded-xl font-bold text-xs transition-colors">
                        Mark Ready for Dispatch
                      </button>
                    )}
                    {order.status === 'Ready for Dispatch' && (
                      <button onClick={() => handleUpdateStatus('Handed Over to Logistics Partner', 'Handed over to logistics.')} className="bg-emerald-700 text-white hover:bg-emerald-800 px-4 py-2 rounded-xl font-bold text-xs transition-colors">
                        Hand Over to Logistics
                      </button>
                    )}
                    {order.status === 'Handed Over to Logistics Partner' && (
                      <button onClick={() => handleUpdateStatus('Shipment In Transit', 'Shipment is now in transit.')} className="bg-emerald-700 text-white hover:bg-emerald-800 px-4 py-2 rounded-xl font-bold text-xs transition-colors">
                        Mark In Transit
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Show Way Bill */}
              {isSeller && (
                <WayBillDocument 
                  order={order} 
                  onGenerate={(data) => handleUpdateStatus('Way Bill Generated', 'Way Bill has been generated.', data)} 
                />
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar (Right 1 Column) */}
        <div className="space-y-6">

          {/* Order Commercial Overview Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-base border-b pb-3 flex items-center">
              <Package className="w-5 h-5 text-emerald-700 mr-2" /> Order Details
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px]">Commodity</p>
                <p className="font-bold text-gray-900 text-sm mt-0.5">{order.product}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 font-semibold uppercase text-[10px]">Quantity</p>
                  <p className="font-extrabold text-emerald-700 text-sm">{order.quantity} {order.uom}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold uppercase text-[10px]">Contract Ref</p>
                  <p className="font-bold text-gray-900 font-mono">{order.contractRef || order.contractId}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px]">{isBuyer ? 'Supplier Entity' : 'Buyer Entity'}</p>
                <p className="font-bold text-gray-900 mt-0.5">{isBuyer ? order.supplierName : order.buyerName}</p>
              </div>

              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px]">Organic Compliance</p>
                {order.wayBillDetails?.tcNumber && order.wayBillDetails?.tcDocumentName ? (
                  <div className="mt-1 inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" />
                    TC Attached ({order.wayBillDetails.tcNumber})
                  </div>
                ) : (
                  <div className="mt-1 inline-flex items-center text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-amber-600 mr-1" />
                    TC Pending Upload
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <button 
                onClick={() => navigate('/dashboard/payments/ledger')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center"
              >
                View Payment Ledger →
              </button>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-sm">Audit Trail</h3>
              <span className="text-xs font-semibold text-gray-500">{order.timelineEvents.length} Events</span>
            </div>
            <div className="p-5">
              <div className="relative border-l-2 border-emerald-200 ml-3 space-y-6 py-1">
                {[...order.timelineEvents].reverse().map((event, index) => (
                  <div key={index} className="relative pl-6">
                    <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white"></div>
                    <p className="text-xs font-bold text-gray-900">{event.status}</p>
                    {event.note && <p className="text-xs text-gray-600 mt-0.5">{event.note}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderWorkspace;
