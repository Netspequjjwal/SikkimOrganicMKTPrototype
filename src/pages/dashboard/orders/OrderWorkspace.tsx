import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, OrderStatus, WayBillDetails } from '../../../context/OrderContext';
import { useAuth } from '../../../context/AuthContext';
import { Package, MapPin, Truck, ChevronRight, FileText, CheckCircle2, Clock, Send, MessageSquare } from 'lucide-react';
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
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Panels based on Status */}
          


          {/* Phase 1 & Ongoing: Delivery Address (Edit/Entry Mode) */}
          {(!order.deliveryAddress || isEditingAddress) && (
            <div className="space-y-6">
              {!order.deliveryAddress && order.status === 'Ready for Delivery Details' && (
                <>
                  {isBuyer && (
                    <DeliveryAddressForm 
                      onSubmit={(addr) => submitDeliveryAddress(order.id, addr)} 
                    />
                  )}
                  {isSeller && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center shadow-sm">
                      <Clock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-blue-900 mb-2">Waiting for Buyer</h3>
                      <p className="text-blue-800">The advance payment was received. The buyer has been notified to provide their delivery address.</p>
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
          )}

          {/* Delivered Phase / Early Confirmation (Moved Up) */}
          {['Shipment In Transit', 'Out for Delivery', 'Delivered (Awaiting Buyer Confirmation)'].includes(order.status) && isBuyer && (
             <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm text-center">
              <CheckCircle2 className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-purple-900 mb-2">Delivery Completed?</h3>
              <p className="text-purple-800 mb-6">Have you received your order? Please confirm receipt to complete this order and unlock the final payment milestone.</p>
              <button 
                onClick={() => {
                  confirmDeliveryReceipt(order.id);
                  navigate('/dashboard/payments/ledger');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-sm"
              >
                Mark Order as Delivered
              </button>
           </div>
          )}

          {/* Phase 3 & 4: Waybill & Preparation */}
          {(['Delivery Address Confirmed', 'Preparing Order', 'Quality Inspection Completed', 'Packaging Completed', 'Ready for Dispatch', 'Way Bill Generated', 'Handed Over to Logistics Partner', 'Shipment In Transit', 'Out for Delivery'].includes(order.status) || order.status === 'Delivered (Awaiting Buyer Confirmation)' || order.status === 'Completed') && (
            <div className="space-y-6">
              {/* Seller Controls to advance status */}
              {isSeller && !['Delivered (Awaiting Buyer Confirmation)', 'Completed'].includes(order.status) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Update Fulfilment Status</h3>
                  <div className="flex flex-wrap gap-3">
                    {order.status === 'Delivery Address Confirmed' && (
                      <button onClick={() => handleUpdateStatus('Preparing Order', 'Order preparation started.')} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition-colors">
                        Start Order Preparation
                      </button>
                    )}
                    {order.status === 'Preparing Order' && (
                      <button onClick={() => handleUpdateStatus('Quality Inspection Completed', 'Quality inspection passed.')} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition-colors">
                        Mark Quality Inspected
                      </button>
                    )}
                    {order.status === 'Quality Inspection Completed' && (
                      <button onClick={() => handleUpdateStatus('Packaging Completed', 'Packaging is complete.')} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition-colors">
                        Mark Packaging Complete
                      </button>
                    )}
                    {order.status === 'Packaging Completed' && (
                      <button onClick={() => handleUpdateStatus('Ready for Dispatch', 'Order is ready for dispatch.')} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition-colors">
                        Mark Ready for Dispatch
                      </button>
                    )}
                    {order.status === 'Way Bill Generated' && (
                      <button onClick={() => handleUpdateStatus('Ready for Dispatch', 'Order is ready for dispatch.')} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition-colors">
                        Mark Ready for Dispatch
                      </button>
                    )}
                    {order.status === 'Ready for Dispatch' && (
                      <button onClick={() => handleUpdateStatus('Handed Over to Logistics Partner', 'Handed over to logistics.')} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition-colors">
                        Hand Over to Logistics
                      </button>
                    )}
                    {order.status === 'Handed Over to Logistics Partner' && (
                      <button onClick={() => handleUpdateStatus('Shipment In Transit', 'Shipment is now in transit.')} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition-colors">
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

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Phase 1 & Ongoing: Delivery Address (Read-Only Mode in Sidebar) */}
          {order.deliveryAddress && !isEditingAddress && (
            <div className="space-y-6">
              <div className="relative">
                <DeliveryAddressForm initialAddress={order.deliveryAddress} onSubmit={() => {}} readOnly={true} />
                {isBuyer && !['Delivered (Awaiting Buyer Confirmation)', 'Completed'].includes(order.status) && (
                  <button 
                    onClick={() => setIsEditingAddress(true)}
                    className="absolute top-6 right-6 text-sm font-bold text-primary hover:text-primary-dark bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors shadow-sm"
                  >
                    Edit Address
                  </button>
                )}
              </div>

              {/* Status Update for Confirming Address */}
              {order.status === 'Awaiting Buyer Delivery Confirmation' && (
                <>
                  {isSeller && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 flex justify-between items-center shadow-sm flex-col gap-4 text-center">
                      <div>
                        <h4 className="font-bold text-gray-900">Request Final Confirmation</h4>
                        <p className="text-sm text-gray-500">Send this address back to the buyer for final approval before shipping.</p>
                      </div>
                      <button 
                        onClick={() => requestAddressConfirmation(order.id)}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors w-full"
                      >
                        Send Request
                      </button>
                    </div>
                  )}
                  {isBuyer && (
                    <div className="bg-white rounded-xl border border-orange-200 p-6 flex justify-between items-center shadow-sm flex-col gap-4 text-center">
                      <div>
                        <h4 className="font-bold text-gray-900 text-orange-900">Final Confirmation Required</h4>
                        <p className="text-sm text-orange-800">Please confirm that the delivery address above is correct.</p>
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
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-colors w-full"
                      >
                        Confirm Address
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Audit Trail */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900">Audit Trail</h3>
            </div>
            <div className="p-4">
              <div className="relative border-l border-gray-200 ml-3 space-y-6 py-2">
                {[...order.timelineEvents].reverse().map((event, index) => (
                  <div key={index} className="relative pl-6">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white"></div>
                    <p className="text-sm font-semibold text-gray-900">{event.status}</p>
                    {event.note && <p className="text-sm text-gray-600 mt-1">{event.note}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(event.timestamp).toLocaleString()}</p>
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
