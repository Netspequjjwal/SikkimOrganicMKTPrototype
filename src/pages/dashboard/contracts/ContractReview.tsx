import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContract, type DigitalContract } from '../../../context/ContractContext';
import { useNotification } from '../../../context/NotificationContext';
import { Shield, FileSignature, Download, Printer, CheckCircle, Stamp } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../../context/AuthContext';

const ContractReview: React.FC = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { contracts, signContractBuyer } = useContract();
  const { triggerEmail } = useNotification();
  const { user } = useAuth();
  
  const [contract, setContract] = useState<DigitalContract | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedSignatory, setSelectedSignatory] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const existing = contracts.find(c => c.id === contractId);
    if (existing) setContract(existing);
  }, [contractId, contracts]);

  if (!contract) return <div className="p-10 text-center">Loading Legal Document...</div>;

  const isBuyer = user?.role === 'BUYER';
  const isPendingReview = contract.status === 'Pending Buyer Review';

  const handleExecute = () => {
    if (!selectedSignatory || !agreed) return;
    
    const signature = {
      name: selectedSignatory,
      designation: 'Authorized Signatory'
    };
    
    signContractBuyer(contract.id, signature);
    setShowSignatureModal(false);
    
    // Simulate generation of the final PDF reference
    const generatedRef = `EC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    triggerEmail(
      `${contract.buyerName}, ${contract.supplierName}`,
      `Legally Executed: Digital Contract ${generatedRef}`,
      `Dear Parties,\n\nThis is to notify that the digital contract for ${contract.product} has been legally executed by both the buyer and the supplier.\n\nThe final executed PDF document is attached for your records.\n\nThe Service Provider may now configure the payment schedule.\n\nBest Regards,\nSikkim Organic Digital Platform`,
      `Executed_Contract_${generatedRef}.pdf`,
      'PDF'
    );
    
    navigate('/dashboard/buyer-contracts');
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Legal Agreement</h1>
          <p className="text-sm text-gray-500 mt-1">
            {contract.contractRef ? `Reference: ${contract.contractRef}` : 'Review and execute the digital contract.'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center transition-colors">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center transition-colors">
            <Printer className="w-4 h-4 mr-2" /> Print
          </button>
          {isBuyer && isPendingReview && (
            <button 
              onClick={() => setShowSignatureModal(true)} 
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-sm"
            >
              <FileSignature className="w-4 h-4 mr-2" /> Accept & Sign
            </button>
          )}
        </div>
      </div>

      {/* Contract Document (PDF Style) */}
      <div className="bg-white mx-auto shadow-[0_0_40px_rgba(0,0,0,0.1)] max-w-4xl min-h-[1056px] p-12 md:p-20 relative">
        {/* Government Watermark Simulation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <Stamp className="w-96 h-96" />
        </div>

        <div className="relative z-10 text-gray-800">
          <div className="text-center mb-12 border-b-2 border-gray-900 pb-8">
            <h1 className="text-3xl font-bold font-serif uppercase tracking-widest text-gray-900">Digital Contract</h1>
            <p className="text-sm font-semibold tracking-wider text-gray-600 mt-2 uppercase">Government of Sikkim Organic Platform</p>
            {contract.contractRef && (
              <p className="text-xs font-mono text-gray-500 mt-4 border border-gray-300 inline-block px-3 py-1 bg-gray-50">
                REF: {contract.contractRef} | EXECUTED ON: {new Date(contract.buyerSignature?.timestamp || '').toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="text-justify font-serif leading-relaxed space-y-6 text-sm">
            <p>
              This Agreement ("Agreement") is made and entered into on this <strong>{new Date().toLocaleDateString()}</strong>, by and between:
            </p>
            
            <div className="pl-6 border-l-4 border-gray-300 space-y-4 py-2">
              <p>
                <strong>{contract.supplierName}</strong>, a registered Service Provider under the Sikkim Organic Board, hereinafter referred to as the <strong>"Supplier"</strong>,
              </p>
              <p className="font-bold text-center text-xs uppercase tracking-[0.2em] text-gray-500">AND</p>
              <p>
                <strong>{contract.buyerName}</strong>, a registered Institutional Buyer, hereinafter referred to as the <strong>"Buyer"</strong>.
              </p>
            </div>

            <p>
              WHEREAS, the Supplier is engaged in the cultivation, processing, and distribution of certified organic produce in the state of Sikkim.
              WHEREAS, the Buyer desires to procure such produce from the Supplier under the terms set forth herein.
            </p>
            <p>
              NOW, THEREFORE, in consideration of the mutual covenants contained herein, the Parties agree as follows:
            </p>

            {/* Clauses */}
            <div className="space-y-6 mt-8">
              {contract.clauses.map((clause, index) => (
                <div key={clause.id}>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{clause.title}</h3>
                  <p className="pl-6">{clause.content}</p>
                </div>
              ))}
              
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-2">5. Commercial Terms</h3>
                <div className="pl-6">
                  <table className="w-full text-left border-collapse my-4 font-sans text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="py-2 px-3 font-bold text-gray-900">Product</th>
                        <th className="py-2 px-3 font-bold text-gray-900">Quantity</th>
                        <th className="py-2 px-3 font-bold text-gray-900 text-right">Price per Unit</th>
                        <th className="py-2 px-3 font-bold text-gray-900 text-right">Total Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-3">{contract.product}</td>
                        <td className="py-3 px-3">{contract.quantity} {contract.uom}</td>
                        <td className="py-3 px-3 text-right">₹{contract.pricePerUnit.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-bold">₹{contract.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p>Procurement Type: <strong>{contract.procurementType}</strong></p>
                </div>
              </div>

              {contract.paymentMilestones && contract.paymentMilestones.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-gray-900 text-base mb-2">6. Payment Schedule & Installments</h3>
                  <div className="pl-6">
                    <table className="w-full text-left border-collapse my-4 font-sans text-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                          <th className="py-2 px-3 font-bold text-gray-900">Milestone Description</th>
                          <th className="py-2 px-3 font-bold text-gray-900">Due Date</th>
                          <th className="py-2 px-3 font-bold text-gray-900 text-center">Percentage</th>
                          <th className="py-2 px-3 font-bold text-gray-900 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contract.paymentMilestones.map((milestone, idx) => (
                          <tr key={idx} className="border-b border-gray-200">
                            <td className="py-3 px-3">{milestone.description}</td>
                            <td className="py-3 px-3">{new Date(milestone.dueDate).toLocaleDateString()}</td>
                            <td className="py-3 px-3 text-center">{milestone.percentage}%</td>
                            <td className="py-3 px-3 text-right font-bold text-primary">₹{milestone.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <p className="mt-12">
              IN WITNESS WHEREOF, the Parties hereto have caused this Digital Contract to be executed by their duly authorized representatives.
            </p>

            {/* Signature Blocks */}
            <div className="grid grid-cols-2 gap-16 mt-16 font-sans">
              <div className="border-t border-gray-400 pt-4">
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2">For the Supplier</h4>
                {contract.supplierSignature ? (
                  <div className="text-sm">
                    <p className="font-serif italic text-primary text-xl mb-1">{contract.supplierSignature.name}</p>
                    <p className="font-bold text-gray-900">{contract.supplierSignature.name}</p>
                    <p className="text-gray-500 text-xs">{contract.supplierSignature.designation}</p>
                    <p className="text-gray-400 text-xs mt-2 font-mono">Signed: {new Date(contract.supplierSignature.timestamp).toLocaleString()}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Pending Signature</p>
                )}
              </div>
              
              <div className="border-t border-gray-400 pt-4">
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2">For the Buyer</h4>
                {contract.buyerSignature ? (
                  <div className="text-sm">
                    <p className="font-serif italic text-blue-600 text-xl mb-1">{contract.buyerSignature.name}</p>
                    <p className="font-bold text-gray-900">{contract.buyerSignature.name}</p>
                    <p className="text-gray-500 text-xs">{contract.buyerSignature.designation}</p>
                    <p className="text-gray-400 text-xs mt-2 font-mono">Signed: {new Date(contract.buyerSignature.timestamp).toLocaleString()}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Pending Signature</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-bold text-gray-900">Execute Digital Contract</h2>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Select your authorized digital signature from the vault to execute this contract on behalf of <strong>{contract.buyerName}</strong>.
              </p>
              
              <div className="space-y-3">
                {['Amit Patel (Procurement Head)', 'Rajesh Kumar (Director)', 'Priya Singh (Legal Counsel)'].map(sig => (
                  <label key={sig} className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="buyerSignature"
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

              <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <label className="flex items-start cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded mt-0.5 focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-gray-700 font-medium">
                    I declare that I have read, understood, and agree to all terms and conditions of this agreement. This digital signature is legally binding.
                  </span>
                </label>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={() => setShowSignatureModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleExecute}
                disabled={!selectedSignatory || !agreed}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center transition-colors disabled:opacity-50 shadow-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Accept & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractReview;
