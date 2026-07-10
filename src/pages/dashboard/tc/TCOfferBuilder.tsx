import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTC } from '../../../context/TCContext';
import { useNotification } from '../../../context/NotificationContext';
import { IndianRupee, Save, Send, Calendar, Box, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TCOfferBuilder() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { requests, submitProposal } = useTC();
  
  const request = requests.find(r => r.id === requestId);

  const [offer, setOffer] = useState({
    serviceCharges: 18000,
    validityStart: new Date().toISOString().split('T')[0],
    validityEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    maxQty: request?.expectedQty || 500,
    applicableCrops: request?.crops.join(', ') || '',
    districts: 'All Districts',
    conditions: [
      'The Transaction Certificate is non-transferable and can only be used by the authorized FPO.',
      'Produce must be procured only from farmers registered under the ICS Provider\'s verified list.',
      'Usage of this certificate outside the Sikkim Organic Platform is strictly prohibited and legally invalid.'
    ]
  });

  if (!request) return <div className="p-10 text-center">Request not found</div>;

  const handlePublish = () => {
    submitProposal(request.id, {
      serviceCharges: offer.serviceCharges,
      validityStart: offer.validityStart,
      validityEnd: offer.validityEnd,
      maxQty: offer.maxQty,
      applicableCrops: offer.applicableCrops.split(',').map(s => s.trim()),
      districts: offer.districts.split(',').map(s => s.trim()),
      conditions: offer.conditions
    });
    toast.success('Proposal Published: The Certificate Usage Proposal has been sent to the FPO for review.');
    navigate('/dashboard/tc/requests');
  };

  if (request.status === 'Proposal Ready') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Offer Already Published</h1>
        <p className="text-gray-600 mb-8">The FPO is currently reviewing the proposal.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-100 rounded-lg">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificate Offer Builder</h1>
          <p className="text-gray-500">Configure commercial and legal terms for {request.fpoName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <Calendar className="w-5 h-5 text-primary" /> Certificate Validity & Scope
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validity Start Date</label>
                <input type="date" className="w-full p-3 border border-gray-300 rounded-xl" value={offer.validityStart} onChange={e => setOffer({...offer, validityStart: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validity End Date</label>
                <input type="date" className="w-full p-3 border border-gray-300 rounded-xl" value={offer.validityEnd} onChange={e => setOffer({...offer, validityEnd: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Crops</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-xl" value={offer.applicableCrops} onChange={e => setOffer({...offer, applicableCrops: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Authorized Quantity (MT)</label>
                <input type="number" className="w-full p-3 border border-gray-300 rounded-xl" value={offer.maxQty} onChange={e => setOffer({...offer, maxQty: parseInt(e.target.value)})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Districts</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-xl" value={offer.districts} onChange={e => setOffer({...offer, districts: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <ShieldAlert className="w-5 h-5 text-orange-500" /> Legal Terms & Conditions
            </h3>
            <div className="space-y-4">
              {offer.conditions.map((cond, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-gray-400 mt-0.5">{idx + 1}.</div>
                  <textarea 
                    rows={2} 
                    className="w-full bg-transparent border-none p-0 focus:ring-0 resize-none text-sm text-gray-800"
                    value={cond}
                    onChange={e => {
                      const newC = [...offer.conditions];
                      newC[idx] = e.target.value;
                      setOffer({...offer, conditions: newC});
                    }}
                  />
                </div>
              ))}
              <button 
                onClick={() => setOffer({...offer, conditions: [...offer.conditions, '']})}
                className="text-primary text-sm font-medium hover:underline"
              >
                + Add Custom Clause
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Commercials</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Charges (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="number" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-primary/20 focus:ring-2 focus:ring-primary focus:border-primary text-2xl font-bold bg-blue-50"
                  value={offer.serviceCharges}
                  onChange={e => setOffer({...offer, serviceCharges: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Draft
              </button>
              <button 
                onClick={handlePublish}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-5 h-5" /> Publish Offer to FPO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
