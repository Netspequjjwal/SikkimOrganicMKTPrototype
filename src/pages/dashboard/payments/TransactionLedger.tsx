import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../../../context/ContractContext';
import { useAuth } from '../../../context/AuthContext';
import { Search, Filter, Download, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

const TransactionLedger: React.FC = () => {
  const { contracts } = useContract();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Extract all payment milestones across all contracts
  const allTransactions = contracts.flatMap(c => 
    c.paymentMilestones.map(m => ({
      ...m,
      contractId: c.id,
      contractRef: c.contractRef,
      buyerName: c.buyerName,
      supplierName: c.supplierName,
      product: c.product
    }))
  ).filter(t => t.contractRef); // Only show transactions for executed contracts

  // Sort by date (paid transactions first by paidAt, then pending by dueDate)
  allTransactions.sort((a, b) => {
    const dateA = a.paidAt ? new Date(a.paidAt).getTime() : new Date(a.dueDate).getTime();
    const dateB = b.paidAt ? new Date(b.paidAt).getTime() : new Date(b.dueDate).getTime();
    return dateB - dateA; // Descending
  });

  const filteredTransactions = allTransactions.filter(t => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.buyerName.toLowerCase().includes(q) || 
             t.supplierName.toLowerCase().includes(q) ||
             t.contractRef?.toLowerCase().includes(q) ||
             t.description.toLowerCase().includes(q);
    }
    
    return true;
  });

  const totalPaid = allTransactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const totalPending = allTransactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">Track and audit all incoming and outgoing procurement payments.</p>
        </div>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center transition-colors shadow-sm">
          <Download className="w-4 h-4 mr-2" /> Export Statement
        </button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-green-100 text-sm font-semibold uppercase tracking-wider mb-1">
                {user?.role === 'BUYER' ? 'Total Paid Amount' : 'Total Settled Value'}
              </p>
              <h2 className="text-4xl font-bold font-mono">₹{(totalPaid / 100000).toFixed(2)}L</h2>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-green-100 text-sm">Amount successfully processed via payment gateway.</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-orange-100 text-sm font-semibold uppercase tracking-wider mb-1">
                {user?.role === 'BUYER' ? 'Pending Payables' : 'Pending Receivables'}
              </p>
              <h2 className="text-4xl font-bold font-mono">₹{(totalPending / 100000).toFixed(2)}L</h2>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-orange-100 text-sm">
            {user?.role === 'BUYER' ? 'Outstanding dues for upcoming milestones.' : 'Expected value from upcoming milestones.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1 relative w-full">
            <input 
              type="text"
              placeholder="Search by Ref, Buyer, Supplier, or Description..."
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50 appearance-none font-medium"
            >
              <option value="All">All Transactions</option>
              <option value="Paid">Settled (Paid)</option>
              <option value="Pending">Upcoming (Pending)</option>
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date / Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contract Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Parties Involved</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((tx, idx) => (
                <tr key={`${tx.id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {tx.status === 'Paid' ? (
                      <>
                        <p className="font-medium text-gray-900">{new Date(tx.paidAt!).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(tx.paidAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-gray-600">Due: {new Date(tx.dueDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Pending</p>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{tx.contractRef}</p>
                    <p className="text-xs text-gray-500 mt-1">{tx.product}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p><span className="text-gray-500 text-xs w-10 inline-block">From:</span> <span className="font-medium">{tx.buyerName}</span></p>
                      <p className="mt-1"><span className="text-gray-500 text-xs w-10 inline-block">To:</span> <span className="font-medium">{tx.supplierName}</span></p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{tx.description}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className={clsx(
                      "font-bold font-mono text-lg",
                      tx.status === 'Paid' ? "text-green-600" : "text-gray-900"
                    )}>
                      ₹{tx.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {tx.status === 'Paid' ? (
                      <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                        <CheckCircle className="w-3 h-3 mr-1" /> Settled
                      </span>
                    ) : (
                      <div className="flex items-center justify-end space-x-3">
                        <span className="inline-flex items-center bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                          <Clock className="w-3 h-3 mr-1" /> Pending
                        </span>
                        {user?.role === 'BUYER' && (
                          <button 
                            onClick={() => navigate(`/dashboard/payments/gateway/${tx.contractId}`)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No transactions found.
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

export default TransactionLedger;
