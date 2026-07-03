import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract, type DigitalContract } from '../../../context/ContractContext';
import { useAuth } from '../../../context/AuthContext';
import { FileSignature, Clock, CheckCircle, CreditCard, Search, Filter, Eye, DollarSign, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

const SPContractDashboard: React.FC = () => {
  const { contracts } = useContract();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'All' | 'Draft' | 'Pending Buyer' | 'Active' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // In a real app, we filter by SP ID. Here we just show all since it's dummy data.
  // Assuming the current user is 'Sikkim Organic Alive' or 'East Sikkim Farmers Co-op'
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Draft': return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Pending Buyer Review': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Awaiting Signature': return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Legally Executed': return <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Payment Pending': return <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Partially Paid': return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Fully Paid': return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Completed': return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      default: return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const filteredContracts = contracts.filter(c => {
    if (activeTab === 'Draft' && c.status !== 'Draft') return false;
    if (activeTab === 'Pending Buyer' && c.status !== 'Pending Buyer Review') return false;
    if (activeTab === 'Active' && !['Legally Executed', 'Payment Pending', 'Partially Paid'].includes(c.status)) return false;
    if (activeTab === 'Completed' && !['Fully Paid', 'Completed'].includes(c.status)) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.buyerName.toLowerCase().includes(q) || 
             c.product.toLowerCase().includes(q) || 
             (c.contractRef && c.contractRef.toLowerCase().includes(q));
    }
    
    return true;
  });

  const handleContractAction = (contract: DigitalContract) => {
    if (contract.status === 'Draft') {
      navigate(`/dashboard/contracts/generate/${contract.enquiryId}`);
    } else if (contract.status === 'Legally Executed' && !contract.paymentConfigured) {
      navigate(`/dashboard/payments/config/${contract.id}`);
    } else {
      navigate(`/dashboard/contracts/review/${contract.id}`);
    }
  };

  const getActionText = (contract: DigitalContract) => {
    if (contract.status === 'Draft') return 'Resume Draft';
    if (contract.status === 'Pending Buyer Review') return 'View Status';
    if (contract.status === 'Legally Executed' && !contract.paymentConfigured) return 'Configure Payments';
    if (['Payment Pending', 'Partially Paid', 'Fully Paid'].includes(contract.status)) return 'View Ledger';
    return 'View Contract';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your digital procurement agreements and payment schedules.</p>
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
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Contracts</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <FileSignature className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{contracts.filter(c => ['Legally Executed', 'Payment Pending', 'Partially Paid'].includes(c.status)).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pending Signatures</h3>
            <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{contracts.filter(c => c.status === 'Pending Buyer Review').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Payments Pending</h3>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{contracts.filter(c => c.status === 'Payment Pending' || c.status === 'Partially Paid').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Value</h3>
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
          <div className="flex space-x-1">
            {['All', 'Draft', 'Pending Buyer', 'Active', 'Completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={clsx(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Buyer</th>
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
                        {contract.contractRef || 'Pending Ref.'}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Enq: {contract.enquiryId}</p>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{contract.buyerName}</p>
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
                        "inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors",
                        contract.status === 'Legally Executed' && !contract.paymentConfigured 
                          ? "bg-green-600 text-white border-transparent hover:bg-green-700" 
                          : contract.status === 'Draft'
                            ? "bg-primary text-white border-transparent hover:bg-primary-dark"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {contract.status === 'Legally Executed' && !contract.paymentConfigured && <CreditCard className="w-4 h-4 mr-1.5" />}
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

export default SPContractDashboard;
