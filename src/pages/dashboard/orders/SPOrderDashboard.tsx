import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../../context/OrderContext';
import { Package, Truck, CheckCircle2, Clock, Search, Filter, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../../context/AuthContext';

const SPOrderDashboard: React.FC = () => {
  const { orders } = useOrder();
  const navigate = useNavigate();
  const { user } = useAuth();

  // For testing/demo purposes, we show all orders to the ICS Provider.
  // In production, this would be: orders.filter(o => o.supplierId === user.id)
  const myOrders = useMemo(() => orders, [orders]);

  const activeOrders = myOrders.filter(o => o.status !== 'Completed');
  const completedOrders = myOrders.filter(o => o.status === 'Completed');
  const ordersToPrepare = myOrders.filter(o => o.status === 'Delivery Address Confirmed');
  const awaitingDispatch = myOrders.filter(o => o.status === 'Way Bill Generated' || o.status === 'Ready for Dispatch');

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-green-100 text-green-800';
    if (status.includes('Delivered')) return 'bg-purple-100 text-purple-800';
    if (status.includes('Transit') || status.includes('Dispatch') || status.includes('Way Bill')) return 'bg-blue-100 text-blue-800';
    if (status.includes('Awaiting')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Fulfilment</h1>
          <p className="text-gray-500">Manage order preparations and track dispatches.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/orders/repository')}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
        >
          <Search className="w-4 h-4 mr-2" /> View All Orders
        </button>
      </div>

      {/* Action Required: Address Confirmations Pending */}
      {myOrders.filter(o => o.status === 'Ready for Delivery Details' || o.status === 'Awaiting Buyer Delivery Confirmation').map(order => (
        <div key={order.id} className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-white p-2 rounded-full border border-orange-200 shadow-sm mt-1">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-orange-800 mb-1">Awaiting Delivery Details</h3>
              <p className="text-orange-700">Order {order.id} for {order.buyerName} is waiting for delivery address confirmation.</p>
            </div>
          </div>
          <button onClick={() => navigate(`/dashboard/orders/${order.id}`)} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold transition-colors">
            Review Order
          </button>
        </div>
      ))}

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{ordersToPrepare.length}</span>
          </div>
          <h3 className="text-gray-500 font-medium">Orders to Prepare</h3>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{awaitingDispatch.length}</span>
          </div>
          <h3 className="text-gray-500 font-medium">Awaiting Dispatch</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {myOrders.filter(o => o.status === 'Shipment In Transit' || o.status === 'Out for Delivery').length}
            </span>
          </div>
          <h3 className="text-gray-500 font-medium">In Transit</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{completedOrders.length}</span>
          </div>
          <h3 className="text-gray-500 font-medium">Completed Deliveries</h3>
        </div>
      </div>

      {/* Active Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Active Fulfilments</h2>
          <button className="text-primary hover:text-primary-dark font-medium text-sm flex items-center">
            <Filter className="w-4 h-4 mr-1" /> Filter
          </button>
        </div>
        
        {activeOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No active fulfilments at the moment.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {activeOrders.map((order) => (
              <li key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-900">{order.id}</span>
                        <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-semibold', getStatusColor(order.status))}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium">{order.product} &bull; {order.quantity} {order.uom}</p>
                      <p className="text-sm text-gray-500 mt-1">Buyer: {order.buyerName}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Contract Ref</p>
                      <p className="font-medium text-gray-900">{order.contractRef || order.contractId}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ml-4"
                    >
                      Manage Order
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SPOrderDashboard;
