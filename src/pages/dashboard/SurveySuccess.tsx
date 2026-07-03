import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Download, Printer, ArrowLeft } from 'lucide-react';

const SurveySuccess: React.FC = () => {
  const location = useLocation();
  const trackingId = location.state?.id || 'YS-2026-KHARIF-000000';
  const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center border border-gray-100">
        <div className="bg-green-50 py-10 px-6">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Yield Survey Submitted!</h2>
          <p className="text-sm text-gray-600">
            Your farmer yield survey data has been securely transmitted to SOFDA.
          </p>
        </div>
        
        <div className="px-6 py-8 bg-white space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Tracking Reference ID</p>
            <p className="text-xl font-bold text-gray-900">{trackingId}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-left px-2">
            <div>
              <p className="text-xs text-gray-500 font-medium">Submitted On</p>
              <p className="text-sm font-semibold text-gray-900">{timestamp}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Current Status</p>
              <p className="text-sm font-semibold text-yellow-600">Pending SOFDA Approval</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 bg-gray-50 border-t border-gray-100 space-y-3">
          <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors">
            <Download className="w-4 h-4 mr-2" /> Download Acknowledgement
          </button>
          <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors">
            <Printer className="w-4 h-4 mr-2" /> Print Receipt
          </button>
          <div className="pt-4">
            <Link to="/dashboard" className="text-sm font-medium text-primary hover:text-primary-dark flex justify-center items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveySuccess;
