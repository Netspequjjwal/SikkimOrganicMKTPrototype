import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../../context/OrderContext';
import { Package, Truck, CheckCircle2, Clock, Search, Filter, AlertTriangle, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../../context/AuthContext';

const SPOrderDashboard: React.FC = () => {
  const { orders } = useOrder();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PREPARE' | 'DISPATCH' | 'TRANSIT' | 'COMPLETED'>('ALL');

  const myOrders = useMemo(() => orders, [orders]);

  const activeOrders = myOrders.filter(o => o.status !== 'Completed');
  const completedOrders = myOrders.filter(o => o.status === 'Completed');
  const ordersToPrepare = myOrders.filter(o => o.status === 'Delivery Address Confirmed');
  const awaitingDispatch = myOrders.filter(o => o.status === 'Way Bill Generated' || o.status === 'Ready for Dispatch');
  const inTransitCount = myOrders.filter(o => o.status === 'Shipment In Transit' || o.status === 'Out for Delivery').length;

  const filteredOrders = myOrders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.product.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'PREPARE') return o.status === 'Delivery Address Confirmed';
    if (activeTab === 'DISPATCH') return o.status === 'Way Bill Generated' || o.status === 'Ready for Dispatch';
    if (activeTab === 'TRANSIT') return o.status === 'Shipment In Transit' || o.status === 'Out for Delivery';
    if (activeTab === 'COMPLETED') return o.status === 'Completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (status.includes('Delivered')) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (status.includes('Transit') || status.includes('Dispatch') || status.includes('Way Bill')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (status.includes('Awaiting')) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header Banner Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl shrink-0">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Seller Order Fulfilment & Dispatch Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage harvest dispatch preparations, logistics waybills, and real-time delivery tracking.
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard/orders/repository')}
          className="px-4 py-2.5 sm:px-5 sm:py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" /> View All Orders Repository
        </button>
      </div>

      {/* Action Required: Address Confirmations Pending */}
      {myOrders.filter(o => o.status === 'Ready for Delivery Details' || o.status === 'Awaiting Buyer Delivery Confirmation').map(order => (
        <div key={order.id} className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 border border-amber-200 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-amber-950 uppercase tracking-wider">Awaiting Buyer Delivery Address Confirmation</h3>
              <p className="text-xs text-amber-800 mt-0.5">Order <strong>{order.id}</strong> for <strong>{order.buyerName}</strong> is awaiting final delivery address verification.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/dashboard/orders/${order.id}`)} 
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5"
          >
            Review Order Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {/* KPI METRIC CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block flex items-center">
            <Package className="w-3.5 h-3.5 mr-1" /> Orders to Prepare
          </span>
          <span className="text-xl sm:text-2xl font-black text-blue-900 mt-1 block">{ordersToPrepare.length}</span>
        </div>

        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" /> Awaiting Dispatch
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-900 mt-1 block">{awaitingDispatch.length}</span>
        </div>

        <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 block flex items-center">
            <Truck className="w-3.5 h-3.5 mr-1" /> In Transit
          </span>
          <span className="text-xl sm:text-2xl font-black text-purple-900 mt-1 block">{inTransitCount}</span>
        </div>

        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed Deliveries
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-900 mt-1 block">{completedOrders.length}</span>
        </div>
      </div>

      {/* CONTROL & SEARCH BAR */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, Buyer Name, Produce..."
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'ALL', label: 'ALL FULFILMENTS' },
            { id: 'PREPARE', label: `TO PREPARE (${ordersToPrepare.length})` },
            { id: 'DISPATCH', label: `DISPATCH (${awaitingDispatch.length})` },
            { id: 'TRANSIT', label: `TRANSIT (${inTransitCount})` },
            { id: 'COMPLETED', label: 'COMPLETED' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all border",
                activeTab === tab.id 
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs" 
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE ORDERS CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center">
            <Truck className="w-4 h-4 text-emerald-600 mr-2" /> B2B Order Fulfilments Ledger
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">Showing {filteredOrders.length} orders</span>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 italic">No order fulfilments found matching your filter criteria.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <li key={order.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="p-3 bg-slate-100 rounded-xl text-slate-600 border border-slate-200 shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                        <span className="font-mono font-extrabold text-emerald-700 text-xs sm:text-sm">{order.id}</span>
                        <span className={clsx('px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border', getStatusColor(order.status))}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-slate-900 font-extrabold text-xs">{order.product} &bull; {order.quantity} {order.uom}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Buyer: <strong>{order.buyerName}</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Contract Ref</p>
                      <p className="font-mono font-bold text-slate-800 text-xs">{order.contractRef || order.contractId}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0"
                    >
                      Manage Order <ArrowRight className="w-3.5 h-3.5" />
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
