import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContract, type DigitalContract, type ContractClause } from '../../../context/ContractContext';
import { useNegotiation } from '../../../context/NegotiationContext';
import { useNotification } from '../../../context/NotificationContext';
import { FileSignature, Save, Send, AlertCircle, Plus, Trash2, CheckCircle, Shield } from 'lucide-react';
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

  // Initialize or fetch Draft contract
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
        // It will re-render and find it in contracts array
      }
    }
  }, [enquiry, contracts]);

  if (!enquiry || !contract) {
    return <div className="p-10 text-center">Loading Contract Workspace...</div>;
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
    // Add it after mandatory clauses, so it doesn't just go to the very bottom blindly
    const mandatoryClauses = clauses.filter(c => c.isMandatory);
    const optionalClauses = clauses.filter(c => !c.isMandatory);
    setClauses([...mandatoryClauses, newClause, ...optionalClauses]);
    
    setShowAddClauseModal(false);
    setNewClauseForm({ title: '', content: '' });
  };

  const handleRemoveClause = (id: string) => {
    setClauses(prev => prev.filter(c => c.id !== id));
  };

  const handleSaveDraft = () => {
    updateContractClauses(contract.id, clauses);
    triggerSMS(
      contract.supplierName,
      `Contract Draft for ${enquiryId} saved successfully.`
    );
  };

  const handleNextPayment = () => {
    updateContractClauses(contract.id, clauses);
    navigate(`/dashboard/payments/config/${contract.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <TransactionMap contractId={contract.id} currentStep="contract" />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Generation Workspace</h1>
          <p className="text-sm text-gray-500 mt-1">Review commercial terms and finalize legal clauses for {enquiryId}</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleSaveDraft} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center transition-colors">
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </button>
          <button onClick={handleNextPayment} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-sm">
            Next: Payment Schedule <Send className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start mb-6">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">Government Compliant Template</h4>
          <p className="text-sm text-blue-800 mt-1">This contract uses standard clauses approved by the Sikkim Organic Board. Mandatory clauses cannot be removed or significantly altered.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Commercial Data (Read Only) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Commercial Summary</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Buyer</p>
                <p className="font-medium text-gray-900">{contract.buyerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Product</p>
                <p className="font-bold text-gray-900">{contract.product}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Quantity</p>
                  <p className="font-medium text-gray-900">{contract.quantity} {contract.uom}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Type</p>
                  <p className="font-medium text-gray-900">{contract.procurementType}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-semibold mb-1">Negotiated Total Value</p>
                <p className="text-xl font-bold text-primary font-mono">₹{contract.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clause Editor */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Terms & Conditions</h3>
            <button onClick={() => setShowAddClauseModal(true)} className="text-sm font-bold text-primary hover:text-primary-dark flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Clause
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {clauses.map((clause) => (
              <div key={clause.id} className={clsx("p-4 border rounded-xl", clause.isMandatory ? "border-gray-200 bg-gray-50" : "border-gray-200 bg-white")}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={clause.title}
                      onChange={(e) => setClauses(prev => prev.map(c => c.id === clause.id ? { ...c, title: e.target.value } : c))}
                      disabled={clause.isMandatory}
                      className="font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                    />
                    {clause.isMandatory && <span className="ml-3 text-[10px] uppercase font-bold tracking-wider bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Mandatory</span>}
                  </div>
                  {!clause.isMandatory && (
                    <button onClick={() => handleRemoveClause(clause.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <textarea
                  value={clause.content}
                  onChange={(e) => handleClauseChange(clause.id, e.target.value)}
                  disabled={clause.isMandatory}
                  className="w-full text-sm text-gray-700 bg-transparent border border-transparent focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-primary rounded-lg p-2 min-h-[80px] resize-y"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Clause Modal */}
      {showAddClauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Plus className="w-5 h-5 text-primary mr-2" />
                Add Custom Clause
              </h2>
              <button onClick={() => setShowAddClauseModal(false)} className="text-gray-400 hover:text-gray-600">
                <Trash2 className="w-5 h-5 opacity-0" /> {/* Spacer */}
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Clause Title</label>
                <input 
                  type="text"
                  value={newClauseForm.title}
                  onChange={(e) => setNewClauseForm({...newClauseForm, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g. Additional Quality Checks"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Clause Content</label>
                <textarea 
                  value={newClauseForm.content}
                  onChange={(e) => setNewClauseForm({...newClauseForm, content: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[150px] resize-y"
                  placeholder="Describe the terms and conditions clearly..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={() => setShowAddClauseModal(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSaveNewClause}
                disabled={!newClauseForm.title.trim() || !newClauseForm.content.trim()}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center"
              >
                Add to Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractGeneration;
