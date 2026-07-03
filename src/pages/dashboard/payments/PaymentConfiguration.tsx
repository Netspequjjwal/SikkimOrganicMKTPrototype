import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContract, type DigitalContract, type PaymentMilestone } from '../../../context/ContractContext';
import { useNotification } from '../../../context/NotificationContext';
import { CreditCard, Plus, Trash2, Calendar, CheckCircle, IndianRupee, Shield, Send, FileSignature } from 'lucide-react';

type PaymentModel = 'Advance' | 'Partial' | 'Milestone';

const PaymentConfiguration: React.FC = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { contracts, configurePayments, signContractSP } = useContract();
  const { triggerSMS, triggerEmail } = useNotification();
  
  const [contract, setContract] = useState<DigitalContract | null>(null);
  const [paymentModel, setPaymentModel] = useState<PaymentModel>('Advance');
  const [milestones, setMilestones] = useState<Omit<PaymentMilestone, 'id' | 'status'>[]>([]);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedSignatory, setSelectedSignatory] = useState('');

  useEffect(() => {
    const existing = contracts.find(c => c.id === contractId);
    if (existing) setContract(existing);
  }, [contractId, contracts]);

  useEffect(() => {
    if (!contract) return;
    
    // Auto-generate milestones based on model
    const amount = contract.totalAmount;
    const baseDate = new Date();
    
    if (paymentModel === 'Advance') {
      setMilestones([{
        percentage: 100,
        amount: amount,
        description: '100% Advance Payment',
        dueDate: new Date(baseDate.getTime() + 7 * 86400000).toISOString()
      }]);
    } else if (paymentModel === 'Partial') {
      setMilestones([
        {
          percentage: 40,
          amount: amount * 0.4,
          description: 'Booking Advance (40%)',
          dueDate: new Date(baseDate.getTime() + 7 * 86400000).toISOString()
        },
        {
          percentage: 60,
          amount: amount * 0.6,
          description: 'Balance Before Dispatch (60%)',
          dueDate: new Date(new Date(contract.deliveryDate).getTime() - 7 * 86400000).toISOString()
        }
      ]);
    } else if (paymentModel === 'Milestone') {
      setMilestones([
        {
          percentage: 30,
          amount: amount * 0.3,
          description: 'Booking Advance (30%)',
          dueDate: new Date(baseDate.getTime() + 7 * 86400000).toISOString()
        },
        {
          percentage: 40,
          amount: amount * 0.4,
          description: 'Before Dispatch (40%)',
          dueDate: new Date(new Date(contract.deliveryDate).getTime() - 7 * 86400000).toISOString()
        },
        {
          percentage: 30,
          amount: amount * 0.3,
          description: 'After Quality Acceptance (30%)',
          dueDate: new Date(new Date(contract.deliveryDate).getTime() + 14 * 86400000).toISOString()
        }
      ]);
    }
  }, [paymentModel, contract]);

  if (!contract) return <div className="p-10 text-center">Loading Payment Config...</div>;

  const totalPercentage = milestones.reduce((sum, m) => sum + m.percentage, 0);
  const isValid = totalPercentage === 100;

  const handleMilestoneChange = (index: number, field: string, value: string | number) => {
    const updated = [...milestones];
    if (field === 'percentage') {
      const pct = Number(value);
      updated[index].percentage = pct;
      updated[index].amount = contract.totalAmount * (pct / 100);
    } else {
      (updated[index] as any)[field] = value;
    }
    setMilestones(updated);
  };

  const handleAddMilestone = () => {
    setMilestones([...milestones, {
      percentage: 0,
      amount: 0,
      description: 'New Milestone',
      dueDate: new Date().toISOString()
    }]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!isValid) {
      triggerSMS(contract.supplierName, "Error: Total percentage must equal exactly 100%.");
      return;
    }
    // Instead of executing right away, we now proceed to signing.
    setShowSignatureModal(true);
  };

  const handleExecute = () => {
    if (!selectedSignatory) {
      triggerSMS(contract.supplierName, "Error: Please select an authorized signatory from the vault.");
      return;
    }

    // Save payment configuration
    configurePayments(contract.id, milestones);

    // Simulate signature payload
    const signature = {
      name: selectedSignatory,
      designation: 'Authorized Representative'
    };

    // Sign contract and change status to Pending Buyer Review
    signContractSP(contract.id, signature);
    setShowSignatureModal(false);
    
    triggerEmail(
      contract.buyerName,
      `Action Required: Draft Digital Contract for ${contract.product}`,
      `Dear ${contract.buyerName},\n\nThe Service Provider (${contract.supplierName}) has drafted the digital contract and payment schedule based on your negotiation.\n\nPlease log in to the Sikkim Organic Platform to review the legal clauses, check the payment milestones, and digitally sign the document.\n\nBest Regards,\nSikkim Organic Digital Platform`,
      `Draft_Contract_${contract.enquiryId}.pdf`,
      'PDF'
    );
    
    navigate('/dashboard/sp-contracts');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configure Payment Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Set payment milestones for Contract {contract.contractRef}</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={!isValid}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center transition-colors disabled:opacity-50 shadow-sm"
        >
          <FileSignature className="w-4 h-4 mr-2" /> Sign & Send Contract
        </button>
      </div>

      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white flex justify-between items-center shadow-lg">
        <div>
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Contract Total Value</p>
          <div className="flex items-center text-3xl font-bold font-mono">
            <IndianRupee className="w-8 h-8 mr-1" />
            {contract.totalAmount.toLocaleString()}
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-gray-400 text-sm mb-1">{contract.buyerName}</p>
          <p className="font-medium">{contract.product} &bull; {contract.quantity} {contract.uom}</p>
        </div>
      </div>

      {/* Model Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Select Payment Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'Advance', title: '100% Advance', desc: 'Full payment upfront' },
            { id: 'Partial', title: 'Partial Advance', desc: 'Split before/after dispatch' },
            { id: 'Milestone', title: 'Milestone Based', desc: 'Custom percentage splits' }
          ].map(model => (
            <label 
              key={model.id} 
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentModel === model.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">{model.title}</span>
                <input 
                  type="radio" 
                  name="model" 
                  value={model.id} 
                  checked={paymentModel === model.id} 
                  onChange={() => setPaymentModel(model.id as PaymentModel)}
                  className="text-primary focus:ring-primary" 
                />
              </div>
              <p className="text-xs text-gray-500">{model.desc}</p>
            </label>
          ))}
        </div>
      </div>

      {/* Milestone Editor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">Payment Milestones</h3>
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Total: {totalPercentage}%
            </span>
            <button onClick={handleAddMilestone} className="text-sm font-bold text-primary hover:text-primary-dark flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Milestone
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 items-start md:items-center relative">
              <div className="w-24">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Percentage</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={milestone.percentage} 
                    onChange={e => handleMilestoneChange(index, 'percentage', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary font-bold"
                  />
                  <span className="absolute right-3 top-2 text-gray-400 font-bold">%</span>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Description</label>
                <input 
                  type="text" 
                  value={milestone.description} 
                  onChange={e => handleMilestoneChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="w-40">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Due Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={milestone.dueDate.split('T')[0]} 
                    onChange={e => handleMilestoneChange(index, 'dueDate', new Date(e.target.value).toISOString())}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="w-32 text-right pt-5">
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="font-bold text-gray-900 font-mono">₹{milestone.amount.toLocaleString()}</p>
              </div>

              <button onClick={() => handleRemoveMilestone(index)} className="absolute -top-3 -right-3 bg-white border border-gray-200 rounded-full p-1.5 text-gray-400 hover:text-red-500 shadow-sm">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Vault Modal Simulation */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-lg font-bold text-gray-900">Signature Vault</h2>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Select an authorized representative to digitally sign this contract (including the configured payment schedule) on behalf of <strong>{contract.supplierName}</strong>.
              </p>

              <div className="space-y-3">
                {['Rinzing Bhutia (President)', 'Karma Lepcha (Secretary)', 'Tenzing Norgay (Director)'].map(sig => (
                  <label key={sig} className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="signature"
                      value={sig}
                      checked={selectedSignatory === sig}
                      onChange={(e) => setSelectedSignatory(e.target.value)}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <div className="ml-3">
                      <p className="font-bold text-gray-900 text-sm">{sig.split(' (')[0]}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{sig.split('(')[1].replace(')', '')}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800 leading-relaxed">
                  By clicking "Sign & Dispatch", you declare that you have read and agree to all terms and conditions within this contract, and this action is legally binding under the IT Act 2000.
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={() => setShowSignatureModal(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={handleExecute}
                  disabled={!selectedSignatory}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" /> Sign & Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentConfiguration;
