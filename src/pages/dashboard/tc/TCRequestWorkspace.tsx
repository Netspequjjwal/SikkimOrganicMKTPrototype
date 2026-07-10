import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTC } from '../../../context/TCContext';
import { Shield, FileText, CheckCircle2, AlertCircle, MapPin, Calendar, Clock, Download, ChevronLeft, Eye, XCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotification } from '../../../context/NotificationContext';

export default function TCRequestWorkspace() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { requests, updateRequestStatus } = useTC();
  
  const [remarks, setRemarks] = useState('');

  const request = requests.find(r => r.id === requestId);

  if (!request) return <div className="p-10 text-center">Request not found</div>;

  const handleAction = (status: 'Under Review' | 'Awaiting Documents' | 'Rejected', showMsg: string) => {
    if ((status === 'Awaiting Documents' || status === 'Rejected') && !remarks.trim()) {
      toast.error('Required: Please provide remarks for this action.');
      return;
    }
    updateRequestStatus(request.id, status, remarks);
    toast.success(`Status Updated: ${showMsg}`);
  };

  const handleAccept = () => {
    updateRequestStatus(request.id, 'Under Review'); // implicitly under review while building offer
    navigate(`/dashboard/tc/offer/${request.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Workspace: {request.id}
          </h1>
          <p className="text-gray-500">Submitted on {new Date(request.requestDate).toLocaleString()}</p>
        </div>
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border
          ${request.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
            request.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' :
            request.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-blue-50 text-blue-700 border-blue-200'}`}>
          Status: {request.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">FPO Profile</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div><span className="text-gray-500 block mb-1">Organization Name</span><span className="font-semibold text-gray-900">{request.fpoName}</span></div>
              <div><span className="text-gray-500 block mb-1">FPO ID</span><span className="font-semibold text-gray-900">{request.fpoId}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Business Requirements</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm mb-4">
              <div className="col-span-2"><span className="text-gray-500 block mb-1">Requested Crops</span><span className="font-semibold text-gray-900">{request.crops.join(', ')}</span></div>
              <div><span className="text-gray-500 block mb-1">Expected Quantity</span><span className="font-semibold text-gray-900">{request.expectedQty} MT</span></div>
              <div><span className="text-gray-500 block mb-1">Procurement Season</span><span className="font-semibold text-gray-900">{request.procurementSeason}</span></div>
              <div><span className="text-gray-500 block mb-1">Intended Market</span><span className="font-semibold text-gray-900">{request.intendedMarket}</span></div>
              <div><span className="text-gray-500 block mb-1">Requested Usage Period</span><span className="font-semibold text-gray-900">{request.usagePeriod} Months</span></div>
            </div>
            {request.message && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-700 italic">
                "{request.message}"
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Uploaded Documents</h3>
            <div className="space-y-3">
              {request.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500 p-1.5 bg-blue-50 rounded-lg" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{doc.type}</div>
                      <div className="text-xs text-gray-500">{doc.name}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
            
            {(request.status === 'Pending' || request.status === 'Under Review' || request.status === 'Awaiting Documents') ? (
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks / Notes</label>
                  <textarea 
                    rows={3} 
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm" 
                    placeholder="Provide reasoning for rejection or missing info..."
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                  ></textarea>
                </div>
                
                <button 
                  onClick={handleAccept}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5" /> Accept & Build Offer
                </button>
                
                <button 
                  onClick={() => handleAction('Awaiting Documents', 'Requested additional documents from FPO')}
                  className="w-full py-3 bg-white text-yellow-600 border border-yellow-600 rounded-xl font-bold hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" /> Request Info
                </button>
                
                <button 
                  onClick={() => handleAction('Rejected', 'Request rejected')}
                  className="w-full py-3 bg-white text-red-600 border border-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" /> Reject Request
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-4">No further actions required. Status: <strong>{request.status}</strong></p>
                {request.status === 'Proposal Ready' && (
                  <button onClick={() => navigate(`/dashboard/tc/offer/${request.id}`)} className="text-primary text-sm font-bold flex items-center justify-center w-full">
                    View Built Offer <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
