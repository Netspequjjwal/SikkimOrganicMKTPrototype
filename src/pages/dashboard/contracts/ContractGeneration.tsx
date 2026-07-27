import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContract, type DigitalContract, type ContractClause } from '../../../context/ContractContext';
import { useNegotiation } from '../../../context/NegotiationContext';
import { useNotification } from '../../../context/NotificationContext';
import { FileSignature, Save, ArrowRight, AlertCircle, Plus, Trash2, CheckCircle, Shield, X, ChevronRight, ArrowLeft, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import TransactionMap from '../../../components/common/TransactionMap';

const ContractGeneration: React.FC = () => {
  const { enquiryId } = useParams();
  const navigate = useNavigate();
  const { enquiries } = useNegotiation();
  const { contracts, createContract, updateContractClauses, signContractSP } = useContract();
  const { triggerEmail, triggerSMS } = useNotification();

  const [contractId, setContractId] = useState<string | null>(null);
  const [contract, setContract] = useState<DigitalContract | null>(null);
  const [clauses, setClauses] = useState<ContractClause[]>([]);
  const [showAddClauseModal, setShowAddClauseModal] = useState(false);
  const [newClauseForm, setNewClauseForm] = useState({ title: '', content: '' });

  const enquiry = enquiries.find(e => e.id === enquiryId);

  useEffect(() => {
    if (enquiry) {
      const existing = contracts.find(c => c.enquiryId === enquiryId);
      if (existing) {
        setContractId(existing.id);
        setContract(existing);
        setClauses(existing.clauses);
      } else {
        const newId = createContract(enquiry);
        setContractId(newId);
      }
    }
  }, [enquiry, contracts]);

  if (!enquiry || !contract) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <FileSignature className="w-10 h-10 text-emerald-300 animate-pulse" />
        <p className="text-slate-500 font-semibold text-sm">Loading Contract Workspace...</p>
      </div>
    );
  }

  const handleClauseChange = (id: string, newText: string) => {
    setClauses(prev => prev.map(c => c.id === id ? { ...c, content: newText } : c));
  };

  const handleSaveNewClause = () => {
    if (!newClauseForm.title.trim() || !newClauseForm.content.trim()) {
      toast.error("Please enter a title and content for the clause.");
      return;
    }
    const newClause: ContractClause = {
      id: `c-${Date.now()}`,
      title: newClauseForm.title,
      content: newClauseForm.content,
      isMandatory: false
    };
    const mandatoryClauses = clauses.filter(c => c.isMandatory);
    const optionalClauses = clauses.filter(c => !c.isMandatory);
    setClauses([...mandatoryClauses, newClause, ...optionalClauses]);
    setShowAddClauseModal(false);
    setNewClauseForm({ title: '', content: '' });
    toast.success('Custom clause added to the contract.');
  };

  const handleRemoveClause = (id: string) => {
    setClauses(prev => prev.filter(c => c.id !== id));
    toast.success('Clause removed.');
  };

  const handleSaveDraft = () => {
    updateContractClauses(contract.id, clauses);
    toast.success('Contract draft saved successfully.');
    triggerSMS(contract.supplierName, `Contract Draft for ${enquiryId} saved successfully.`);
  };

  const handleNextPayment = () => {
    updateContractClauses(contract.id, clauses);
    navigate(`/dashboard/payments/config/${contract.id}`);
  };

  const mandatoryClauses = clauses.filter(c => c.isMandatory);
  const customClauses = clauses.filter(c => !c.isMandatory);

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-20">

      {/* Transaction Lifecycle Breadcrumb */}
      <TransactionMap contractId={contract.id} currentStep="contract" />

      {/* UX4G Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl shrink-0">
            <FileSignature className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Digital Contract Generation Workspace
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review legal clauses, add custom terms, and proceed to payment schedule for{' '}
              <span className="font-mono font-bold text-emerald-700">{enquiryId}</span>
            </p>
          </div>
        </div>

        {/* Always-visible action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl shadow-xs hover:bg-slate-100 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4 text-slate-400" /> Save Draft
          </button>
          <button
            onClick={handleNextPayment}
            className="px-4 py-2.5 sm:px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            Next: Payment Schedule <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Government Compliance Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-xl shrink-0">
          <Shield className="w-4 h-4 text-blue-700" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">Government-Compliant NPOP Template</h4>
          <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
            This contract uses standard clauses approved by the Sikkim Organic Board under NPOP guidelines.
            <strong className="mx-1">Mandatory clauses</strong> cannot be removed or significantly altered.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* LEFT COLUMN: Commercial Summary Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">

          {/* Commercial Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700">Commercial Summary</span>
            </div>
            <div className="p-4 space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Buying Entity</span>
                <strong className="text-slate-900 font-extrabold">{contract.buyerName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Selling Entity (ICS)</span>
                <strong className="text-slate-900 font-extrabold">{contract.supplierName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Commodity</span>
                <strong className="text-slate-900 font-extrabold text-sm">{contract.product}</strong>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Quantity</span>
                  <strong className="text-emerald-700">{contract.quantity} {contract.uom}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Listing Type</span>
                  <strong className="text-slate-800">{contract.procurementType}</strong>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Negotiated Total Value</span>
                <span className="text-xl font-black text-emerald-700 font-mono">
                  ₹{contract.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Contract Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700">Contract Status</span>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="font-bold text-slate-700">Enquiry & Negotiation Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center shrink-0">
                  <FileSignature className="w-3 h-3 text-amber-600" />
                </div>
                <span className="font-extrabold text-amber-700">Drafting Contract Clauses</span>
              </div>
              <div className="flex items-center gap-2 opacity-40">
                <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center shrink-0">
                  <Lock className="w-3 h-3 text-slate-400" />
                </div>
                <span className="font-bold text-slate-500">Payment Schedule Config</span>
              </div>
              <div className="flex items-center gap-2 opacity-40">
                <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center shrink-0">
                  <Lock className="w-3 h-3 text-slate-400" />
                </div>
                <span className="font-bold text-slate-500">Order Fulfilment & Dispatch</span>
              </div>
            </div>
          </div>

          {/* Add Custom Clause CTA */}
          <button
            onClick={() => setShowAddClauseModal(true)}
            className="w-full px-4 py-3 bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-2xl border-2 border-dashed border-emerald-300 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Custom Clause
          </button>

        </div>

        {/* RIGHT COLUMN: T&C Clause Editor */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{minHeight: '600px'}}>
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Terms & Conditions Editor</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {mandatoryClauses.length} Mandatory • {customClauses.length} Custom clauses
              </p>
            </div>
            <button
              onClick={() => setShowAddClauseModal(true)}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Clause
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">

            {/* MANDATORY CLAUSES Section */}
            {mandatoryClauses.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Mandatory Government Clauses</span>
                </div>
                {mandatoryClauses.map((clause, idx) => (
                  <div
                    key={clause.id}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/70"
                  >
                    <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-slate-500 font-mono">{idx + 1}.</span>
                        <input
                          type="text"
                          value={clause.title}
                          disabled
                          className="font-extrabold text-slate-800 text-xs bg-transparent border-none focus:ring-0 p-0 w-auto disabled:cursor-default"
                        />
                      </div>
                      <span className="text-[9px] uppercase font-extrabold tracking-wider bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full border border-slate-300 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Mandatory
                      </span>
                    </div>
                    <div className="p-3">
                      <textarea
                        value={clause.content}
                        disabled
                        className="w-full text-xs text-slate-600 bg-transparent border-none focus:ring-0 p-0 min-h-[70px] resize-none disabled:cursor-default leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CUSTOM CLAUSES Section */}
            {customClauses.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Custom & Negotiated Clauses</span>
                </div>
                {customClauses.map((clause, idx) => (
                  <div
                    key={clause.id}
                    className="border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50/30"
                  >
                    <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <span className="text-[10px] font-extrabold text-emerald-600 font-mono shrink-0">{mandatoryClauses.length + idx + 1}.</span>
                        <input
                          type="text"
                          value={clause.title}
                          onChange={(e) => setClauses(prev => prev.map(c => c.id === clause.id ? { ...c, title: e.target.value } : c))}
                          className="font-extrabold text-slate-800 text-xs bg-transparent border-none focus:outline-none focus:ring-0 p-0 flex-1"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveClause(clause.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0"
                        title="Remove clause"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3">
                      <textarea
                        value={clause.content}
                        onChange={(e) => handleClauseChange(clause.id, e.target.value)}
                        className="w-full text-xs text-slate-700 bg-transparent border border-transparent hover:border-slate-200 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-400/30 rounded-lg p-2 min-h-[80px] resize-y transition-all leading-relaxed"
                        placeholder="Enter clause terms and conditions..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {clauses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <FileSignature className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm font-semibold">No contract clauses added yet.</p>
                <button
                  onClick={() => setShowAddClauseModal(true)}
                  className="mt-3 text-xs font-bold text-emerald-700 underline"
                >
                  Add the first clause
                </button>
              </div>
            )}
          </div>

          {/* Sticky Bottom Footer within clause editor */}
          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-500 font-medium">
              All changes auto-saved when you save draft
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5 text-slate-400" /> Save Draft
              </button>
              <button
                onClick={handleNextPayment}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
              >
                Proceed to Payment Schedule <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Clause Modal */}
      {showAddClauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="bg-emerald-800 px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-sm font-extrabold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Custom Contract Clause
              </h2>
              <button
                onClick={() => setShowAddClauseModal(false)}
                className="text-emerald-200 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                  Clause Title *
                </label>
                <input
                  type="text"
                  value={newClauseForm.title}
                  onChange={(e) => setNewClauseForm({...newClauseForm, title: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-900 text-xs"
                  placeholder="e.g. Additional Quality Checks, Penalty Clause, Force Majeure..."
                />
              </div>
              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                  Clause Content *
                </label>
                <textarea
                  value={newClauseForm.content}
                  onChange={(e) => setNewClauseForm({...newClauseForm, content: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs min-h-[140px] resize-y text-slate-800 leading-relaxed"
                  placeholder="Enter the full legal terms and conditions for this clause clearly..."
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <strong className="font-extrabold">Note:</strong> Custom clauses will be reviewed by both parties before the contract is digitally executed. They cannot override mandatory government clauses.
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddClauseModal(false)}
                className="px-4 py-2 text-xs text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewClause}
                disabled={!newClauseForm.title.trim() || !newClauseForm.content.trim()}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs disabled:opacity-40 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add to Contract
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContractGeneration;
