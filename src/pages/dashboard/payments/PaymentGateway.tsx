import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContract, type DigitalContract } from '../../../context/ContractContext';
import { useNotification } from '../../../context/NotificationContext';
import { IndianRupee, CreditCard, Building, Smartphone, ShieldCheck, Download, CheckCircle, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const PaymentGateway: React.FC = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { contracts, processPayment } = useContract();
  const { triggerSMS } = useNotification();
  
  const [contract, setContract] = useState<DigitalContract | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'NET_BANKING' | 'CARD' | 'NEFT'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paidMilestoneId, setPaidMilestoneId] = useState<string | null>(null);

  useEffect(() => {
    const existing = contracts.find(c => c.id === contractId);
    if (existing) setContract(existing);
  }, [contractId, contracts]);

  if (!contract) return <div className="p-10 text-center">Loading Payment Gateway...</div>;

  // Find the first pending milestone
  const currentMilestone = contract.paymentMilestones.find(m => m.status === 'Pending');

  if (!currentMilestone && !showReceipt) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Payments Complete!</h2>
        <p className="text-gray-500 mb-8">There are no pending payments for Contract {contract.contractRef}.</p>
        <button onClick={() => navigate('/dashboard/buyer-contracts')} className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-bold transition-colors">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handlePay = () => {
    if (!currentMilestone) return;
    setIsProcessing(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaidMilestoneId(currentMilestone.id);
      processPayment(contract.id, currentMilestone.id);
      triggerSMS(
        contract.supplierName || 'Supplier',
        `Payment Received! Rs. ${currentMilestone.amount.toLocaleString('en-IN')} has been credited for Contract ${contract.contractRef}.`
      );
      setShowReceipt(true);
    }, 2500);
  };

  if (showReceipt && paidMilestoneId) {
    const receiptMilestone = contract.paymentMilestones.find(m => m.id === paidMilestoneId) || currentMilestone;
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-green-600 px-8 py-10 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Payment Successful</h1>
            <p className="text-green-100 text-sm">Transaction Reference: TXN-{Date.now()}</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-end border-b border-gray-100 pb-6">
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Amount Paid</p>
                <p className="text-3xl font-bold text-gray-900 font-mono">₹{receiptMilestone?.amount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Date & Time</p>
                <p className="font-medium text-gray-900">{new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Paid To</p>
                <p className="font-bold text-gray-900">{contract.supplierName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                <p className="font-bold text-gray-900">{selectedMethod}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Contract Reference</p>
                <p className="font-bold text-gray-900">{contract.contractRef}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Milestone Description</p>
                <p className="font-bold text-gray-900">{receiptMilestone?.description}</p>
              </div>
            </div>

            <div className="pt-6 flex justify-center space-x-4">
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" /> Download Receipt
              </button>
              <button onClick={() => navigate('/dashboard/buyer-contracts')} className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center text-gray-500 text-sm mb-6 font-medium">
        <span>Dashboard</span>
        <ArrowRight className="w-3 h-3 mx-2" />
        <span>Contracts</span>
        <ArrowRight className="w-3 h-3 mx-2" />
        <span className="text-gray-900">Secure Payment</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <ShieldCheck className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="font-bold text-gray-900 tracking-wide">Secure Payment Gateway</h2>
            </div>
            
            <div className="p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Select Payment Method</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { id: 'UPI', icon: Smartphone, label: 'UPI / QR Code' },
                  { id: 'NET_BANKING', icon: Building, label: 'Net Banking' },
                  { id: 'CARD', icon: CreditCard, label: 'Credit / Debit Card' },
                  { id: 'NEFT', icon: Building, label: 'NEFT / RTGS' },
                ].map(method => (
                  <div 
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as any)}
                    className={clsx(
                      "border-2 rounded-xl p-4 flex items-center cursor-pointer transition-all",
                      selectedMethod === method.id ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                      selectedMethod === method.id ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                    )}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-900">{method.label}</span>
                  </div>
                ))}
              </div>

              {selectedMethod === 'UPI' && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                  <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 mx-auto rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sikkimorganic@sbi&pn=SikkimOrganic&cu=INR" alt="QR Code" className="w-36 h-36 opacity-50" />
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center font-bold text-gray-700">Mock QR</div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Scan with any UPI app to pay</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xs text-gray-400">OR ENTER VPA:</span>
                    <input type="text" placeholder="yourname@upi" className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-primary" />
                  </div>
                </div>
              )}

              {(selectedMethod === 'NET_BANKING' || selectedMethod === 'CARD' || selectedMethod === 'NEFT') && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium">Selected: {selectedMethod.replace('_', ' ')}</p>
                  <p className="text-xs mt-1">This is a simulated payment gateway.</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <button 
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  <>Pay ₹{currentMilestone?.amount.toLocaleString()} Securely</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">Payment Summary</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Contract Reference</p>
                <p className="font-bold text-gray-900">{contract.contractRef}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Supplier</p>
                <p className="font-medium text-gray-900">{contract.supplierName}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-semibold mb-2">Milestone Description</p>
                <p className="text-sm font-medium text-gray-800 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  {currentMilestone?.description}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <p className="font-bold text-gray-900">Total Amount</p>
                <p className="text-2xl font-bold text-primary font-mono">₹{currentMilestone?.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-gray-400 grayscale opacity-60">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rupay-Logo.png/1200px-Rupay-Logo.png" alt="RuPay" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
