import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UploadCloud, FileText, X, CheckCircle, ArrowLeft } from 'lucide-react';
import { useBuyerRegistration } from '../../context/BuyerRegistrationContext';

const CertificateRenewalWizard: React.FC = () => {
  const navigate = useNavigate();
  const { registrationData, setRegistrationData } = useBuyerRegistration();
  
  const [formData, setFormData] = useState({
    scopeCertificateNumber: registrationData?.scopeCertificateNumber || '',
    issueDate: '',
    expiryDate: '',
    document: null as File | null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, document: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (registrationData) {
        setRegistrationData({
          ...registrationData,
          scopeCertificateNumber: formData.scopeCertificateNumber,
          issueDate: formData.issueDate,
          expiryDate: formData.expiryDate,
        });
      }
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Renewal Request Submitted!</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Your new organic certificate has been sent to the Agriculture Department for verification. Your marketplace access remains active during the review process.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-bold transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Renew Organic Certificate</h1>
          <p className="text-sm text-gray-500">Update your NPOP/PGS-India certification details.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-start">
          <ShieldCheck className="w-6 h-6 text-orange-500 mr-3 shrink-0" />
          <div>
            <h3 className="font-bold text-orange-900">Current Certificate Status</h3>
            <p className="text-sm text-orange-800 mt-1">
              Your current certificate (<strong>{registrationData?.scopeCertificateNumber || 'N/A'}</strong>) 
              is scheduled to expire on <strong>{registrationData?.expiryDate || 'N/A'}</strong>. 
              Please provide the updated certificate details below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">New Scope Certificate Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={formData.scopeCertificateNumber}
                onChange={(e) => setFormData({ ...formData, scopeCertificateNumber: e.target.value })}
                className="mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border border-gray-300 focus:ring-primary focus:border-primary uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Issue Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                required
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Expiry Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                min={formData.issueDate || new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Certificate <span className="text-red-500">*</span></label>
            <div className={`flex-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors ${formData.document ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
              <div className="space-y-1 text-center w-full">
                {!formData.document ? (
                  <>
                    <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" accept=".pdf,.jpg,.png" required onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <FileText className="h-10 w-10 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[300px]">{formData.document.name}</p>
                    <div className="flex items-center mt-3 space-x-3">
                      <span className="flex items-center text-xs text-green-600 font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" /> Uploaded
                      </span>
                      <button type="button" onClick={() => setFormData({...formData, document: null})} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center">
                        <X className="w-3 h-3 mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="mr-4 px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Renewal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateRenewalWizard;
