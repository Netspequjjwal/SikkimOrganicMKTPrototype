import React, { useState } from 'react';
import { useRBAC } from '../../../context/RBACContext';
import { PlatformRole, UserAccount } from '../../../types/rbac';
import { 
  Users, 
  UserPlus, 
  ShieldAlert, 
  CheckCircle, 
  Search, 
  Filter, 
  Smartphone, 
  Building, 
  MapPin, 
  Edit3,
  Unlock,
  Lock,
  ArrowRight
} from 'lucide-react';

export const UserManagementConsole: React.FC = () => {
  const { currentUser, upgradeUserRole, logAuditEntry } = useRBAC();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Simulated list of system users
  const [usersList, setUsersList] = useState<UserAccount[]>([
    {
      id: 'USR-001',
      mobile: '9876543210',
      name: 'Prem Das Rai',
      email: 'superadmin@sikkimorganic.gov.in',
      activeRoles: ['SUPER_ADMIN'],
      currentRole: 'SUPER_ADMIN',
      isGuest: false,
      buyerStatus: 'APPROVED',
      sellerStatus: 'APPROVED',
      organization: 'SOFDA Head Office',
      district: 'Gangtok',
      createdAt: '2026-01-01',
      lastLogin: '2026-08-01 10:15 AM',
      status: 'ACTIVE',
      failedLoginAttempts: 0
    },
    {
      id: 'USR-002',
      mobile: '9812345678',
      name: 'Dawa Lepcha',
      email: 'dawa.fpo@sikkimorganic.org',
      activeRoles: ['SELLER_USER', 'BUYER_USER'],
      currentRole: 'SELLER_USER',
      isGuest: false,
      buyerStatus: 'APPROVED',
      sellerStatus: 'APPROVED',
      organization: 'North Sikkim Large Cardamom FPO Cooperative',
      district: 'Mangan',
      createdAt: '2026-02-10',
      lastLogin: '2026-08-01 09:30 AM',
      status: 'ACTIVE',
      failedLoginAttempts: 0
    },
    {
      id: 'USR-003',
      mobile: '9765432109',
      name: 'Sonam Gyatso',
      email: 'support@sikkimorganic.gov.in',
      activeRoles: ['SUPPORT_USER'],
      currentRole: 'SUPPORT_USER',
      isGuest: false,
      buyerStatus: 'NOT_APPLIED',
      sellerStatus: 'NOT_APPLIED',
      organization: 'Dept of Agriculture, Sikkim',
      district: 'Gangtok',
      createdAt: '2026-03-15',
      lastLogin: '2026-07-31 04:20 PM',
      status: 'ACTIVE',
      failedLoginAttempts: 0
    },
    {
      id: 'USR-004',
      mobile: '9654321098',
      name: 'Pema Bhutia (Guest)',
      email: 'pema@gmail.com',
      activeRoles: ['GUEST_USER'],
      currentRole: 'GUEST_USER',
      isGuest: true,
      buyerStatus: 'PENDING',
      sellerStatus: 'NOT_APPLIED',
      organization: 'Bhutia Retailers',
      district: 'Pakyong',
      createdAt: '2026-08-01',
      lastLogin: '2026-08-01 10:20 AM',
      status: 'ACTIVE',
      failedLoginAttempts: 0
    }
  ]);

  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const handleGrantRole = (user: UserAccount, roleToGrant: PlatformRole) => {
    upgradeUserRole(user.id, roleToGrant);
    setUsersList(prev => prev.map(u => {
      if (u.id === user.id) {
        const newRoles = Array.from(new Set([...u.activeRoles, roleToGrant]));
        return {
          ...u,
          activeRoles: newRoles,
          isGuest: false,
          buyerStatus: roleToGrant === 'BUYER_USER' ? 'APPROVED' : u.buyerStatus,
          sellerStatus: roleToGrant === 'SELLER_USER' ? 'APPROVED' : u.sellerStatus
        };
      }
      return u;
    }));
  };

  const handleToggleLock = (user: UserAccount) => {
    const newStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    logAuditEntry('USER_STATUS_CHANGE', 'SECURITY', `Updated user account status for ${user.name} to ${newStatus}`);
  };

  const filteredUsers = usersList.filter(u => {
    if (roleFilter !== 'ALL' && !u.activeRoles.includes(roleFilter as any)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.mobile.includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">User Directory & Role Onboarding</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage mobile-registered accounts, Guest upgrades, multi-role approvals (Seller + Buyer), and access status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400">Total System Accounts</p>
            <p className="text-lg font-bold text-slate-800">{usersList.length} Active Users</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search user by name, mobile, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="GUEST_USER">Guest Users</option>
              <option value="SELLER_USER">Sellers (Growers/FPO)</option>
              <option value="BUYER_USER">Buyers (Wholesalers)</option>
              <option value="SOFDA_ADMIN">SOFDA Admin</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          ⚡ All mobile signups automatically start as Guest accounts.
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3">User & Contact</th>
                <th className="p-3">Organization & Location</th>
                <th className="p-3">Assigned Active Roles</th>
                <th className="p-3">Onboarding Status</th>
                <th className="p-3">Account Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><Smartphone className="w-3 h-3 text-slate-400" /> {user.mobile}</span>
                      <span>•</span>
                      <span>{user.email}</span>
                    </div>
                  </td>

                  <td className="p-3 text-slate-600">
                    <div className="flex items-center gap-1 font-medium"><Building className="w-3 h-3 text-slate-400" /> {user.organization || 'Individual'}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5"><MapPin className="w-3 h-3 text-slate-400" /> {user.district}, Sikkim</div>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {user.activeRoles.map(role => (
                        <span key={role} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-semibold">
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="space-y-1 text-[10px]">
                      <div>
                        Seller Status: <span className={`font-bold ${user.sellerStatus === 'APPROVED' ? 'text-emerald-600' : 'text-slate-500'}`}>{user.sellerStatus}</span>
                      </div>
                      <div>
                        Buyer Status: <span className={`font-bold ${user.buyerStatus === 'APPROVED' ? 'text-teal-600' : 'text-slate-500'}`}>{user.buyerStatus}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!user.activeRoles.includes('SELLER_USER') && (
                        <button
                          onClick={() => handleGrantRole(user, 'SELLER_USER')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-semibold transition-colors"
                          title="Approve & Grant Seller Role"
                        >
                          + Seller Role
                        </button>
                      )}

                      {!user.activeRoles.includes('BUYER_USER') && (
                        <button
                          onClick={() => handleGrantRole(user, 'BUYER_USER')}
                          className="px-2 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded text-[10px] font-semibold transition-colors"
                          title="Approve & Grant Buyer Role"
                        >
                          + Buyer Role
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleLock(user)}
                        className={`p-1 rounded transition-colors ${
                          user.status === 'ACTIVE' ? 'text-slate-400 hover:text-red-600' : 'text-red-600 hover:text-emerald-600'
                        }`}
                        title={user.status === 'ACTIVE' ? 'Lock Account' : 'Unlock Account'}
                      >
                        {user.status === 'ACTIVE' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
