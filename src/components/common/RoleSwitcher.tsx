import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import { PlatformRole } from '../../types/rbac';
import { Shield, RefreshCw, CheckCircle2, ChevronDown, UserCheck } from 'lucide-react';

const ROLE_LABELS: Record<PlatformRole, { label: string; badgeClass: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', badgeClass: 'bg-red-100 text-red-800 border-red-200' },
  DEPT_ADMIN: { label: 'Department Admin', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' },
  SUPPORT_USER: { label: 'Support User', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
  SOFDA_ADMIN: { label: 'SOFDA Admin', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
  GUEST_USER: { label: 'Guest Explorer', badgeClass: 'bg-gray-100 text-gray-700 border-gray-200' },
  SELLER_USER: { label: 'Seller Workspace (Grower/FPO)', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  BUYER_USER: { label: 'Buyer Workspace (Wholesaler)', badgeClass: 'bg-teal-100 text-teal-800 border-teal-200' },
};

export const RoleSwitcher: React.FC = () => {
  const { currentUser, activeRole, switchActiveRole } = useRBAC();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!currentUser || currentUser.activeRoles.length <= 1) {
    if (!activeRole) return null;
    const info = ROLE_LABELS[activeRole] || { label: activeRole, badgeClass: 'bg-gray-100 text-gray-800' };
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 text-xs font-semibold text-slate-700">
        <Shield className="w-3.5 h-3.5 text-emerald-600" />
        <span>{info.label}</span>
      </div>
    );
  }

  const currentInfo = ROLE_LABELS[activeRole || 'GUEST_USER'];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold shadow-xs transition-all duration-150"
        title="Click to switch active role workspace"
      >
        <RefreshCw className="w-3.5 h-3.5 text-emerald-700 animate-spin-slow" />
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-700 font-normal">Active Role:</span>
          <span className="font-bold">{currentInfo.label}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-emerald-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Multi-Role Workspace Switcher</p>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Switch perspective without logging out</p>
            </div>

            <div className="space-y-1">
              {currentUser.activeRoles.map((role: PlatformRole) => {
                const info = ROLE_LABELS[role] || { label: role, badgeClass: 'bg-gray-100' };
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      switchActiveRole(role);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{info.label}</span>
                    </div>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1 bg-slate-50 rounded-b-lg">
              <p className="text-[10px] text-slate-500">
                ⚡ FPOs and Grower Groups can act as both Buyer & Seller seamlessly.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
