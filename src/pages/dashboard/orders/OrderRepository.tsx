import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../../context/OrderContext';
import { useAuth } from '../../../context/AuthContext';
import { Search, Filter, Eye, Download, Calendar } from 'lucide-react';
import clsx from 'clsx';

const OrderRepository: React.FC = () => {
  const { orders } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter for role
  const roleOrders = orders.filter(o => {
    if (user?.role === 'BUYER') return o.buyerName === 'Nature Extracts Inc.' || o.buyerName === 'Global Organic Foods Ltd.';
    if (user?.role === 'ICS_PROVIDER') return o.supplierName === 'East Sikkim Farmers Co-op' || o.supplierName === 'Sikkim Organic Alive';
    return true; // Admin sees all
  });

  const filteredOrders = roleOrders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (o.contractRef || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-green-100 text-green-800';
    if (status.includes('Delivered')) return 'bg-purple-100 text-purple-800';
    if (status.includes('Transit') || status.includes('Dispatch') || status.includes('Way Bill')) return 'bg-blue-100 text-blue-800';
    if (status.includes('Awaiting')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Repository</h1>
          <p className="text-gray-500">Comprehensive view of all your platform orders.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by Order ID, Contract Ref, or Product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Ready for Delivery Details">Ready for Details</option>
              <option value="Awaiting Buyer Delivery Confirmation">Awaiting Confirmation</option>
              <option value="Delivery Address Confirmed">Address Confirmed</option>
              <option value="Preparing Order">Preparing</option>
              <option value="Ready for Dispatch">Ready for Dispatch</option>
              <option value="Shipment In Transit">In Transit</option>
              <option value="Delivered (Awaiting Buyer Confirmation)">Delivered</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">Order ID & Date</th>
                <th className="p-4 font-semibold">{user?.role === 'BUYER' ? 'Supplier' : 'Buyer'}</th>
                <th className="p-4 font-semibold">Product Details</th>
                <th className="p-4 font-semibold">Contract Ref</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No orders found matching your criteria.</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{user?.role === 'BUYER' ? order.supplierName : order.buyerName}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{order.product}</div>
                      <div className="text-sm text-gray-500">{order.quantity} {order.uom}</div>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">
                      {order.contractRef || order.contractId}
                    </td>
                    <td className="p-4">
                      <span className={clsx('px-2.5 py-1 rounded-md text-xs font-semibold', getStatusColor(order.status))}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                        className="text-primary hover:text-primary-dark font-medium text-sm flex items-center justify-end ml-auto"
                      >
                        <Eye className="w-4 h-4 mr-1" /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderRepository;
