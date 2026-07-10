import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTC } from '../../../context/TCContext';
import { useAuth } from '../../../context/AuthContext';
import { Check, ChevronRight, Upload, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotification } from '../../../context/NotificationContext';

export default function TCRequestWizard() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { providers, submitRequest } = useTC();
  const { user } = useAuth();
  
  const provider = providers.find(p => p.id === providerId);
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [profile, setProfile] = useState({
    name: user?.name || 'Sikkim Organic FPO',
    regNumber: 'FPO-SKM-2023-8902',
    authRep: 'Karma Bhutia',
    contact: '+91 98765 43210',
    email: user?.email || 'contact@fpo.com',
    address: 'Namchi District Center',
    district: 'Namchi',
    gst: '11AAAAA0000A1Z5'
  });

  const [documents, setDocuments] = useState<{type: string, name: string}[]>([]);
  const [businessReq, setBusinessReq] = useState({
    crops: 'Large Cardamom, Ginger',
    expectedQty: '500',
    season: 'Kharif 2026',
    market: 'Export',
    usagePeriod: '12',
    message: 'We require a transaction certificate for our upcoming export shipment to the European market. Our produce is fully organic certified under NPOP.'
  });

  if (!provider) return <div>Provider not found</div>;

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments(prev => [...prev.filter(d => d.type !== type), { type, name: e.target.files![0].name }]);
    }
  };

  const handleSubmit = () => {
    submitRequest({
      fpoId: 'fpo1',
      fpoName: profile.name,
      providerId: provider.id,
      crops: businessReq.crops.split(',').map(s => s.trim()),
      expectedQty: parseInt(businessReq.expectedQty),
      procurementSeason: businessReq.season,
      intendedMarket: businessReq.market as 'Domestic' | 'Export',
      usagePeriod: parseInt(businessReq.usagePeriod),
      message: businessReq.message,
      documents
    });
    
    toast.success('Transaction Certificate Request submitted successfully!');
    navigate('/dashboard'); // FPO can see requests in a list later, or navigate home
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Transaction Certificate</h1>
        <p className="text-gray-500">From {provider.name}</p>

        {/* Stepper */}
        <div className="flex items-center justify-between mt-8 mb-12 relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 -z-10"></div>
          {['FPO Profile', 'Documents', 'Requirements', 'Review'].map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isPassed = currentStep > stepNum;
            
            return (
              <div key={step} className="flex flex-col items-center bg-white px-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                  isActive ? 'bg-primary text-white border-4 border-primary/20' : 
                  isPassed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isPassed ? <Check className="w-5 h-5" /> : stepNum}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-primary' : isPassed ? 'text-green-600' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Profile */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">FPO Profile Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">FPO Name</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" value={profile.name} readOnly /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg" value={profile.regNumber} onChange={e => setProfile({...profile, regNumber: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Authorized Representative</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg" value={profile.authRep} onChange={e => setProfile({...profile, authRep: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg" value={profile.contact} onChange={e => setProfile({...profile, contact: e.target.value})} /></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} /></div>
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Document Uploads</h2>
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex gap-3 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>Please upload valid, clearly scanned PDF or JPEG documents. These are required by the ICS Provider for compliance and verification.</p>
            </div>
            
            {['FPO Registration Certificate', 'PAN Card', 'Address Proof', 'Board Resolution'].map(docType => {
              const uploadedDoc = documents.find(d => d.type === docType);
              return (
                <div key={docType} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">{docType} <span className="text-red-500">*</span></h4>
                    <p className="text-sm text-gray-500">PDF, JPG up to 5MB</p>
                  </div>
                  <div>
                    {uploadedDoc ? (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-green-600 flex items-center"><Check className="w-4 h-4 mr-1" /> {uploadedDoc.name}</span>
                        <label className="cursor-pointer text-sm text-primary font-medium hover:underline">
                          Change <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, docType)} />
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center shadow-sm">
                        <Upload className="w-4 h-4 mr-2" /> Upload
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, docType)} />
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Step 3: Requirements */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Business Requirements</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Products / Crops</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g. Ginger, Large Cardamom" value={businessReq.crops} onChange={e => setBusinessReq({...businessReq, crops: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Expected Quantity (MT)</label><input type="number" className="w-full p-3 border border-gray-300 rounded-lg" value={businessReq.expectedQty} onChange={e => setBusinessReq({...businessReq, expectedQty: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Procurement Season</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg" value={businessReq.season} onChange={e => setBusinessReq({...businessReq, season: e.target.value})} /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intended Market</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg" value={businessReq.market} onChange={e => setBusinessReq({...businessReq, market: e.target.value})}>
                  <option>Domestic</option>
                  <option>Export</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requested Usage Period (Months)</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg" value={businessReq.usagePeriod} onChange={e => setBusinessReq({...businessReq, usagePeriod: e.target.value})}>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                </select>
              </div>
              <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Message to ICS Provider</label><textarea rows={4} className="w-full p-3 border border-gray-300 rounded-lg" value={businessReq.message} onChange={e => setBusinessReq({...businessReq, message: e.target.value})}></textarea></div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Review Your Request</h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Request Summary</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div><span className="text-gray-500 block mb-1">Provider</span><span className="font-semibold">{provider.name}</span></div>
                <div><span className="text-gray-500 block mb-1">FPO Name</span><span className="font-semibold">{profile.name}</span></div>
                <div><span className="text-gray-500 block mb-1">Crops</span><span className="font-semibold">{businessReq.crops}</span></div>
                <div><span className="text-gray-500 block mb-1">Expected Qty</span><span className="font-semibold">{businessReq.expectedQty} MT</span></div>
                <div><span className="text-gray-500 block mb-1">Usage Period</span><span className="font-semibold">{businessReq.usagePeriod} Months</span></div>
                <div><span className="text-gray-500 block mb-1">Documents Attached</span><span className="font-semibold">{documents.length} / 4 Required</span></div>
              </div>
            </div>

            <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm border border-orange-200">
              <h4 className="font-bold text-orange-900 mb-1">Terms of Request</h4>
              <p>By submitting this request, you confirm that all provided information and documents are authentic. The ICS Provider reserves the right to reject the request if requirements are not met or verification fails.</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
          <button 
            onClick={currentStep === 1 ? () => navigate(-1) : handlePrev}
            className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button 
            onClick={currentStep === 4 ? handleSubmit : handleNext}
            className="px-8 py-2.5 bg-primary text-white font-bold hover:bg-primary-dark rounded-lg shadow-sm transition-colors flex items-center"
          >
            {currentStep === 4 ? 'Submit Request' : 'Next Step'}
            {currentStep !== 4 && <ChevronRight className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
