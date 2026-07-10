import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTC } from '../../../context/TCContext';
import { IndianRupee, CheckCircle2, ShieldCheck, ArrowRight, ShieldAlert, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotification } from '../../../context/NotificationContext';

export default function TCProposalReview() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { requests, providers, updateRequestStatus } = useTC();
  
  const request = requests.find(r => r.id === requestId);
  
  if (!request || !request.proposal) return <div className="p-10 text-center">Proposal not found or not ready.</div>;

  const provider = providers.find(p => p.id === request.providerId);
  const proposal = request.proposal;

  const handleAccept = () => {
    updateRequestStatus(request.id, 'Payment Pending');
    navigate(`/dashboard/tc/payment/${request.id}`);
  };

  const handleReject = () => {
    updateRequestStatus(request.id, 'Rejected', 'FPO rejected the proposal.');
    toast.success('Proposal Rejected: You have rejected this TC proposal.');
    navigate('/dashboard'); // Or to FPO's requests dashboard if we make one
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-8 border-b pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-3 border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" /> Certificate Usage Proposal
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Proposal for {request.id}</h1>
            <p className="text-gray-500">Offered by {provider?.name}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Total Service Charges</div>
            <div className="text-3xl font-bold text-gray-900 flex items-center justify-end">
              <IndianRupee className="w-6 h-6 mr-0.5 text-gray-400" /> {proposal.serviceCharges.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Authorized Certificate Details</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div><span className="text-sm text-gray-500 block mb-1">Validity Period</span><span className="font-semibold text-gray-900">{proposal.validityStart} to {proposal.validityEnd}</span></div>
              <div><span className="text-sm text-gray-500 block mb-1">Maximum Quantity</span><span className="font-semibold text-gray-900">{proposal.maxQty} MT</span></div>
              <div><span className="text-sm text-gray-500 block mb-1">Authorized Crops</span><span className="font-semibold text-gray-900">{proposal.applicableCrops.join(', ')}</span></div>
              <div><span className="text-sm text-gray-500 block mb-1">Applicable Districts</span><span className="font-semibold text-gray-900">{proposal.districts.join(', ')}</span></div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-500" /> Terms & Conditions
            </h3>
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 space-y-4">
              {proposal.conditions.map((cond, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-orange-900 text-sm leading-relaxed">{cond}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button 
              onClick={handleReject}
              className="px-6 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" /> Reject Proposal
            </button>
            <button 
              onClick={handleAccept}
              className="px-8 py-3 bg-primary text-white font-bold hover:bg-primary-dark rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              Accept & Proceed to Payment <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
