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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Draft': return <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[10px] px-2.5 py-1 rounded-full font-extrabold">{status}</span>;
      case 'Pending Buyer Review': return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] px-2.5 py-1 rounded-full font-extrabold">{status}</span>;
      case 'Awaiting Signature': return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] px-2.5 py-1 rounded-full font-extrabold">{status}</span>;
      case 'Legally Executed': return <span className="bg-teal-100 text-teal-800 border border-teal-300 text-[10px] px-2.5 py-1 rounded-full font-extrabold">{status}</span>;
      case 'Payment Pending': return <span className="bg-orange-100 text-orange-800 border border-orange-300 text-[10px] px-2.5 py-1 rounded-full font-extrabold">{status}</span>;
      case 'Partially Paid': return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] px-2.5 py-1 rounded-full font-extrabold">{status}</span>;
      case 'Fully Paid': return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] px-2.5 py-1 rounded-full font-extrabold">{status}</span>;
      case 'Completed': return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] px-2.5 py-1 rounded-full font-extrabold">{status}</span>;
      default: return <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[10px] px-2.5 py-1 rounded-full font-extrabold">{status}</span>;
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
    if (contract.status === 'Pending Buyer Review') return 'View Contract';
    if (contract.status === 'Legally Executed' && !contract.paymentConfigured) return 'Configure Payments';
    if (['Payment Pending', 'Partially Paid', 'Fully Paid'].includes(contract.status)) return 'View Ledger';
    return 'View Contract';
  };

  const activeCount = contracts.filter(c => ['Legally Executed', 'Payment Pending', 'Partially Paid'].includes(c.status)).length;
  const pendingSignaturesCount = contracts.filter(c => c.status === 'Pending Buyer Review').length;
  const paymentsPendingCount = contracts.filter(c => c.status === 'Payment Pending' || c.status === 'Partially Paid').length;
  const totalValueLakhs = (contracts.reduce((acc, c) => acc + c.totalAmount, 0) / 100000).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header Banner Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl shrink-0">
            <FileSignature className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Seller Digital Contracts & Agreements
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Legally binding smart digital procurement contracts, e-signatures, and payment milestone terms.
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard/contracts/repository')} 
          className="px-4 py-2.5 sm:px-5 sm:py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" /> Global Contract Repository
        </button>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">Active Executed Contracts</span>
          <span className="text-xl sm:text-2xl font-black text-blue-900 mt-1 block">{activeCount}</span>
        </div>

        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">Pending Signatures</span>
          <span className="text-xl sm:text-2xl font-black text-amber-900 mt-1 block">{pendingSignaturesCount}</span>
        </div>

        <div className="p-4 bg-orange-50/80 rounded-2xl border border-orange-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700 block">Payments Pending</span>
          <span className="text-xl sm:text-2xl font-black text-orange-900 mt-1 block">{paymentsPendingCount}</span>
        </div>

        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">Total Contracted Value</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-900 mt-1 block">₹{totalValueLakhs} L</span>
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
            placeholder="Search Contract Ref, Buyer Name, Commodity..."
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['All', 'Draft', 'Pending Buyer', 'Active', 'Completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={clsx(
                "px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all border",
                activeTab === tab 
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs" 
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CONTRACTS TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center">
            <FileSignature className="w-4 h-4 text-emerald-600 mr-2" /> B2B Procurement Contracts Ledger
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">Showing {filteredContracts.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Contract ID & Ref</th>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Buyer Entity</th>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Produce & Qty</th>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Contract Value</th>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredContracts.map(contract => (
                <tr key={contract.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <button 
                      onClick={() => navigate(`/dashboard/contracts/review/${contract.id}`)}
                      className="text-left group block"
                    >
                      <p className="font-mono font-extrabold text-emerald-700 group-hover:underline flex items-center text-xs">
                        {contract.contractRef || 'Pending Ref.'}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Enq: {contract.enquiryId}</p>
                    </button>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <p className="font-bold text-slate-900 text-xs">{contract.buyerName}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{contract.procurementType}</p>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <p className="font-extrabold text-slate-900 text-xs">{contract.product}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{contract.quantity} {contract.uom}</p>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <p className="font-black text-slate-900 font-mono text-xs">₹{contract.totalAmount.toLocaleString()}</p>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {getStatusBadge(contract.status)}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    <button 
                      onClick={() => handleContractAction(contract)}
                      className={clsx(
                        "inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-xs gap-1.5",
                        contract.status === 'Legally Executed' && !contract.paymentConfigured 
                          ? "bg-emerald-700 hover:bg-emerald-800 text-white" 
                          : contract.status === 'Draft'
                            ? "bg-slate-900 hover:bg-slate-800 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                      )}
                    >
                      {contract.status === 'Legally Executed' && !contract.paymentConfigured && <CreditCard className="w-3.5 h-3.5" />}
                      {getActionText(contract)}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredContracts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
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
