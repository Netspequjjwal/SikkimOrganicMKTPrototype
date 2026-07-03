import React, { useState } from 'react';
import { useContract } from '../../../context/ContractContext';
import { Search, Filter, Download, FileSignature, FileText } from 'lucide-react';
import clsx from 'clsx';

const ContractRepository: React.FC = () => {
  const { contracts } = useContract();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Legally Executed': return <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Payment Pending': return <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Partially Paid': return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Fully Paid': return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Completed': return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      default: return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const executedContracts = contracts.filter(c => c.status !== 'Draft' && c.status !== 'Pending Buyer Review' && c.status !== 'Awaiting Signature');

  const filteredContracts = executedContracts.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.buyerName.toLowerCase().includes(q) || 
             c.supplierName.toLowerCase().includes(q) ||
             c.product.toLowerCase().includes(q) || 
             (c.contractRef && c.contractRef.toLowerCase().includes(q));
    }
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Repository</h1>
          <p className="text-sm text-gray-500 mt-1">Search, filter, and download executed legal agreements.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input 
              type="text"
              placeholder="Search by ID, Buyer, Supplier, or Product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          </div>
          <div className="w-full md:w-64 relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50 appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="Legally Executed">Legally Executed</option>
              <option value="Payment Pending">Payment Pending</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Fully Paid">Fully Paid</option>
              <option value="Completed">Completed</option>
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map(contract => (
            <div key={contract.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col">
              <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <FileSignature className="w-4 h-4 text-gray-400" />
                    <p className="font-bold text-gray-900">{contract.contractRef}</p>
                  </div>
                  <p className="text-xs text-gray-500">Executed on {new Date(contract.buyerSignature?.timestamp || '').toLocaleDateString()}</p>
                </div>
                {getStatusBadge(contract.status)}
              </div>
              <div className="p-5 flex-1 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Buyer</p>
                  <p className="font-medium text-gray-900 truncate">{contract.buyerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Supplier</p>
                  <p className="font-medium text-gray-900 truncate">{contract.supplierName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">Product</p>
                    <p className="font-bold text-gray-900">{contract.product}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">Total Value</p>
                    <p className="font-bold text-primary font-mono">₹{contract.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button className="text-primary hover:text-primary-dark font-bold text-sm flex items-center transition-colors">
                  <Download className="w-4 h-4 mr-1.5" /> Download PDF
                </button>
              </div>
            </div>
          ))}
          {filteredContracts.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium">No executed contracts found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractRepository;
