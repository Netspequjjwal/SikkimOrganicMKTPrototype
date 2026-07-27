import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../../../context/ContractContext';
import { useAuth } from '../../../context/AuthContext';
import { Search, Filter, Download, ArrowUpRight, CheckCircle, Clock, DollarSign, CreditCard } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

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
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header Banner Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl shrink-0">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {user?.role === 'BUYER'
                ? 'Buyer Payment Ledger & Payables Tracker'
                : 'Seller Financial Ledger & Payment Reconciliation'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {user?.role === 'BUYER'
                ? 'View and manage all your outgoing procurement payments, escrow dues, and milestone payables.'
                : 'Track, audit, and reconcile incoming procurement payments, escrow milestones, and bank payouts.'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => toast.success('Ledger statement export initiated...')}
          className="px-4 py-2.5 sm:px-5 sm:py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          {user?.role === 'BUYER' ? 'Export Payables Statement' : 'Export Ledger Statement'}
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-200/80 text-xs font-extrabold uppercase tracking-wider mb-1">
                {user?.role === 'BUYER' ? 'Total Paid Amount' : 'Total Settled & Disbursed Value'}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black font-mono">₹{(totalPaid / 100000).toFixed(2)} Lakhs</h2>
            </div>
            <div className="p-3 bg-emerald-500/30 rounded-2xl border border-emerald-400/40 shrink-0">
              <CheckCircle className="w-6 h-6 text-emerald-300" />
            </div>
          </div>
          <p className="text-emerald-200/70 text-xs font-medium">Verified payments cleared and settled to seller bank accounts.</p>
        </div>

        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 rounded-2xl p-6 text-white shadow-md space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-100/80 text-xs font-extrabold uppercase tracking-wider mb-1">
                {user?.role === 'BUYER' ? 'Pending Payables' : 'Upcoming Pending Receivables'}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black font-mono">₹{(totalPending / 100000).toFixed(2)} Lakhs</h2>
            </div>
            <div className="p-3 bg-amber-500/30 rounded-2xl border border-amber-300/40 shrink-0">
              <Clock className="w-6 h-6 text-amber-200" />
            </div>
          </div>
          <p className="text-amber-100/70 text-xs font-medium">
            {user?.role === 'BUYER' ? 'Outstanding dues for upcoming contract milestones.' : 'Expected incoming payments from active escrow milestones.'}
          </p>
        </div>
      </div>

      {/* Filters & Control Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Contract Ref, Buyer Name, Supplier, or Milestone..."
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'All', label: 'ALL TRANSACTIONS' },
            { id: 'Paid', label: 'SETTLED (PAID)' },
            { id: 'Pending', label: 'UPCOMING (PENDING)' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={clsx(
                "px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all border",
                statusFilter === st.id 
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs" 
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              )}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center">
            <CreditCard className="w-4 h-4 text-emerald-600 mr-2" /> B2B Payment Audit & Milestone Ledger
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">Showing {filteredTransactions.length} transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[700px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Date & Time</th>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Contract & Commodity</th>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Transacting Entities</th>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Milestone Description</th>
                <th className="px-5 py-3 text-right text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Amount (₹)</th>
                <th className="px-5 py-3 text-right text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTransactions.map((tx, idx) => (
                <tr key={`${tx.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {tx.status === 'Paid' ? (
                      <>
                        <p className="font-extrabold text-slate-900 text-xs">{new Date(tx.paidAt!).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(tx.paidAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-slate-600 text-xs">Due: {new Date(tx.dueDate).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Upcoming</p>
                      </>
                    )}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <p className="font-mono font-extrabold text-emerald-700 text-xs">{tx.contractRef}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{tx.product}</p>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="text-xs">
                      <p><span className="text-slate-400 text-[10px] uppercase font-bold inline-block w-10">From:</span> <strong className="text-slate-800">{tx.buyerName}</strong></p>
                      <p className="mt-0.5"><span className="text-slate-400 text-[10px] uppercase font-bold inline-block w-10">To:</span> <strong className="text-slate-800">{tx.supplierName}</strong></p>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <p className="font-bold text-slate-800 text-xs">{tx.description}</p>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    <p className={clsx(
                      "font-black font-mono text-sm",
                      tx.status === 'Paid' ? "text-emerald-700" : "text-slate-900"
                    )}>
                      ₹{tx.amount.toLocaleString()}
                    </p>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    {tx.status === 'Paid' ? (
                      <span className="inline-flex items-center bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] px-2.5 py-1 rounded-full font-extrabold">
                        <CheckCircle className="w-3 h-3 mr-1" /> Settled
                      </span>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="inline-flex items-center bg-amber-100 text-amber-800 border border-amber-300 text-[10px] px-2.5 py-1 rounded-full font-extrabold">
                          <Clock className="w-3 h-3 mr-1" /> Pending
                        </span>
                        {user?.role === 'BUYER' && (
                          <button 
                            onClick={() => navigate(`/dashboard/payments/gateway/${tx.contractId}`)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded-xl text-xs font-extrabold transition-all shadow-xs"
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
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    No payment transactions found matching your criteria.
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
