import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract, type DigitalContract } from '../../../context/ContractContext';
import { useAuth } from '../../../context/AuthContext';
import { FileSignature, Clock, CreditCard, Search, DollarSign, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

const BuyerContractDashboard: React.FC = () => {
  const { contracts } = useContract();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'All' | 'Awaiting Review' | 'Active' | 'Payment Requests' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending Buyer Review': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">Review Required</span>;
      case 'Awaiting Signature': return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Legally Executed': return <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Payment Pending': return <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider text-red-600 animate-pulse border border-red-300">Action Required</span>;
      case 'Partially Paid': return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Fully Paid': return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Completed': return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      default: return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const filteredContracts = contracts.filter(c => {
    // Only show non-drafts for the buyer (or if they are pending review)
    if (c.status === 'Draft') return false;

    if (activeTab === 'Awaiting Review' && c.status !== 'Pending Buyer Review') return false;
    if (activeTab === 'Active' && !['Legally Executed', 'Payment Pending', 'Partially Paid'].includes(c.status)) return false;
    if (activeTab === 'Payment Requests' && !['Payment Pending', 'Partially Paid'].includes(c.status)) return false;
    if (activeTab === 'Completed' && !['Fully Paid', 'Completed'].includes(c.status)) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.supplierName.toLowerCase().includes(q) || 
             c.product.toLowerCase().includes(q) || 
             (c.contractRef && c.contractRef.toLowerCase().includes(q));
    }
    
    return true;
  });

  const handleContractAction = (contract: DigitalContract) => {
    if (contract.status === 'Pending Buyer Review') {
      navigate(`/dashboard/contracts/review/${contract.id}`);
    } else if (['Payment Pending', 'Partially Paid'].includes(contract.status)) {
      navigate(`/dashboard/payments/gateway/${contract.id}`);
    } else {
      // Just view it
      navigate(`/dashboard/contracts/review/${contract.id}`);
    }
  };

  const getActionText = (contract: DigitalContract) => {
    if (contract.status === 'Pending Buyer Review') return 'Review & Sign';
    if (['Payment Pending', 'Partially Paid'].includes(contract.status)) return 'Make Payment';
    return 'View Contract';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buyer Contracts & Procurement</h1>
          <p className="text-sm text-gray-500 mt-1">Review legal agreements, manage signatures, and process payments.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => navigate('/dashboard/contracts/repository')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
            <Search className="w-4 h-4 mr-2" /> Global Repository
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Awaiting Review</h3>
            <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{contracts.filter(c => c.status === 'Pending Buyer Review').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Procurement</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <FileSignature className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{contracts.filter(c => ['Legally Executed', 'Payment Pending', 'Partially Paid'].includes(c.status)).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Payment Requests</h3>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">{contracts.filter(c => ['Payment Pending', 'Partially Paid'].includes(c.status)).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Committed</h3>
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ₹{(contracts.reduce((acc, c) => acc + c.totalAmount, 0) / 100000).toFixed(2)}L
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs & Search */}
        <div className="border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-1 overflow-x-auto w-full md:w-auto">
            {['All', 'Awaiting Review', 'Active', 'Payment Requests', 'Completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={clsx(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                  activeTab === tab ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <input 
              type="text"
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Contract List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contract ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product & Qty</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContracts.map(contract => (
                <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => navigate(`/dashboard/contracts/review/${contract.id}`)}
                      className="text-left group block"
                    >
                      <p className="font-bold text-primary group-hover:underline flex items-center">
                        {contract.contractRef || 'Pending Execution'}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Enq: {contract.enquiryId}</p>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{contract.supplierName}</p>
                    <p className="text-xs text-gray-500 mt-1">{contract.procurementType}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{contract.product}</p>
                    <p className="text-xs text-gray-500 mt-1">{contract.quantity} {contract.uom}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 font-mono">₹{contract.totalAmount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleContractAction(contract)}
                      className={clsx(
                        "inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors shadow-sm",
                        contract.status === 'Pending Buyer Review' 
                          ? "bg-primary text-white border-transparent hover:bg-primary-dark"
                          : ['Payment Pending', 'Partially Paid'].includes(contract.status)
                            ? "bg-red-600 text-white border-transparent hover:bg-red-700 animate-pulse"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {['Payment Pending', 'Partially Paid'].includes(contract.status) && <CreditCard className="w-4 h-4 mr-1.5" />}
                      {contract.status === 'Pending Buyer Review' && <FileSignature className="w-4 h-4 mr-1.5" />}
                      {getActionText(contract)}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredContracts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No contracts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerContractDashboard;
