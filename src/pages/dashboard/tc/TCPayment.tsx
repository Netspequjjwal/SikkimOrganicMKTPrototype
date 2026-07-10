import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTC } from '../../../context/TCContext';
import { IndianRupee, CreditCard, Wallet, Smartphone, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotification } from '../../../context/NotificationContext';

export default function TCPayment() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { requests, providers, processPayment } = useTC();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('upi');

  const request = requests.find(r => r.id === requestId);

  // If already paid or not found
  useEffect(() => {
    if (request && request.status === 'Accepted') {
      navigate('/dashboard/tc/vault');
    }
  }, [request, navigate]);

  if (!request || !request.proposal) return <div className="p-10 text-center">Request/Proposal not found</div>;

  const provider = providers.find(p => p.id === request.providerId);
  const proposal = request.proposal;

  const tax = proposal.serviceCharges * 0.18;
  const total = proposal.serviceCharges + tax;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      processPayment(request.id);
      setIsProcessing(false);
      toast.success('Payment Successful: Your Transaction Certificate is now active!');
      navigate('/dashboard/tc/vault');
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 flex gap-6">
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
          
          <div className="space-y-4">
            <label className={`block border rounded-xl p-4 cursor-pointer transition-all ${selectedMethod === 'upi' ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <input type="radio" name="payment" value="upi" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} className="w-5 h-5 text-primary focus:ring-primary" />
                <Smartphone className={`w-8 h-8 ${selectedMethod === 'upi' ? 'text-primary' : 'text-gray-400'}`} />
                <div>
                  <div className="font-bold text-gray-900">UPI / QR Code</div>
                  <div className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</div>
                </div>
              </div>
            </label>

            <label className={`block border rounded-xl p-4 cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <input type="radio" name="payment" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} className="w-5 h-5 text-primary focus:ring-primary" />
                <CreditCard className={`w-8 h-8 ${selectedMethod === 'card' ? 'text-primary' : 'text-gray-400'}`} />
                <div>
                  <div className="font-bold text-gray-900">Credit / Debit Card</div>
                  <div className="text-sm text-gray-500">Visa, Mastercard, RuPay</div>
                </div>
              </div>
              {selectedMethod === 'card' && (
                <div className="mt-4 pl-12 space-y-4">
                  <input type="text" placeholder="Card Number" className="w-full p-3 border border-gray-300 rounded-lg" />
                  <div className="flex gap-4">
                    <input type="text" placeholder="MM/YY" className="w-1/2 p-3 border border-gray-300 rounded-lg" />
                    <input type="text" placeholder="CVV" className="w-1/2 p-3 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              )}
            </label>

            <label className={`block border rounded-xl p-4 cursor-pointer transition-all ${selectedMethod === 'netbanking' ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <input type="radio" name="payment" value="netbanking" checked={selectedMethod === 'netbanking'} onChange={() => setSelectedMethod('netbanking')} className="w-5 h-5 text-primary focus:ring-primary" />
                <Wallet className={`w-8 h-8 ${selectedMethod === 'netbanking' ? 'text-primary' : 'text-gray-400'}`} />
                <div>
                  <div className="font-bold text-gray-900">Net Banking</div>
                  <div className="text-sm text-gray-500">All major Indian banks</div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="w-96 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Payment Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Provider</div>
              <div className="font-semibold text-gray-900">{provider?.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Request ID</div>
              <div className="font-semibold text-gray-900">{request.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Certificate Validity</div>
              <div className="font-semibold text-gray-900">{proposal.validityStart} to {proposal.validityEnd}</div>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-200 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Service Charges</span>
              <span>₹{proposal.serviceCharges.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (18%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={handlePay}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md ${
              isProcessing ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...</>
            ) : (
              <><ShieldCheck className="w-5 h-5" /> Pay ₹{total.toLocaleString()}</>
            )}
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4" /> 100% Secure & Government Approved Gateway
          </div>
        </div>
      </div>
    </div>
  );
}
