import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, Home } from 'lucide-react';
import { useRBAC } from '../context/RBACContext';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const { activeRole, currentUser } = useRBAC();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-xl max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold uppercase tracking-wider">
            HTTP 403 Forbidden
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-xs text-slate-500">
            Your current active role <strong className="text-slate-800">[{activeRole || 'GUEST'}]</strong> does not possess permission to access this module or execute this action.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-600">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Lock className="w-4 h-4 text-amber-600" />  Security Policy
          </div>
          <p>• Guest Users must complete Buyer/Seller onboarding to unlock transactional features.</p>
          <p>• Multi-role users can use the header <strong>Role Switcher</strong> to change perspective.</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>

          <Link
            to="/dashboard"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" /> Allowed Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AccessDenied;
