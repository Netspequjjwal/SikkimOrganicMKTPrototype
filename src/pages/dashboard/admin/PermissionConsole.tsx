import React, { useState } from 'react';
import { useRBAC } from '../../../context/RBACContext';
import { ModuleDefinition, ModuleId, PermissionOperation, PlatformRole, RoleDefinition, AuditLogEntry } from '../../../types/rbac';
import { SYSTEM_MODULES } from '../../../data/rbacInitialData';
import {
  ShieldCheck,
  Copy,
  PlusCircle,
  Check,
  X,
  Search,
  Filter,
  History,
  Layers,
  Lock,
  ChevronRight
} from 'lucide-react';

export const PermissionConsole: React.FC = () => {
  const {
    rolesList,
    permissionMatrix,
    updatePermission,
    bulkUpdateModulePermissions,
    cloneRole,
    createNewRole,
    auditLogs
  } = useRBAC();

  const [selectedRole, setSelectedRole] = useState<string>('SUPER_ADMIN');
  const [selectedModule, setSelectedModule] = useState<ModuleId | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'MATRIX' | 'CLONE' | 'CREATE' | 'AUDIT'>('MATRIX');

  // Clone Form state
  const [cloneName, setCloneName] = useState('');
  const [cloneCode, setCloneCode] = useState('');

  // Create Form state
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleCode, setNewRoleCode] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const currentRoleDef = rolesList.find((r: RoleDefinition) => r.id === selectedRole) || rolesList[0];

  const filteredModules = SYSTEM_MODULES.filter((mod: ModuleDefinition) => {
    if (selectedModule !== 'ALL' && mod.id !== selectedModule) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return mod.name.toLowerCase().includes(q) || mod.features.some(f => f.name.toLowerCase().includes(q));
  });

  const handleCloneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneName || !cloneCode) return;
    cloneRole(selectedRole, cloneName, cloneCode.toUpperCase().replace(/\s+/g, '_'));
    setCloneName('');
    setCloneCode('');
    setActiveTab('MATRIX');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName || !newRoleCode) return;
    createNewRole(newRoleName, newRoleCode.toUpperCase().replace(/\s+/g, '_'), newRoleDesc, selectedRole as PlatformRole);
    setNewRoleName('');
    setNewRoleCode('');
    setNewRoleDesc('');
    setActiveTab('MATRIX');
  };

  const allOperations: PermissionOperation[] = [
    'view', 'create', 'update', 'delete', 'approve', 'reject', 'export', 'configure', 'publish', 'verify', 'manage'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Console Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-tight"> Permission Management Console</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure dynamic Role & Permission Matrix for Sikkim Organic Digital Marketplace. Rules update live without code rebuilds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('MATRIX')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'MATRIX' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1.5" />
            Matrix View
          </button>

          <button
            onClick={() => setActiveTab('CLONE')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'CLONE' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <Copy className="w-3.5 h-3.5 inline mr-1.5" />
            Clone Role
          </button>

          <button
            onClick={() => setActiveTab('CREATE')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'CREATE' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <PlusCircle className="w-3.5 h-3.5 inline mr-1.5" />
            New Custom Role
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'AUDIT' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <History className="w-3.5 h-3.5 inline mr-1.5" />
            Audit Changelog
          </button>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Role to Configure:</label>
          <span className="text-xs text-slate-400">Total Defined Roles: {rolesList.length}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {rolesList.map((r: RoleDefinition) => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${selectedRole === r.id
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${selectedRole === r.id ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{r.name}</span>
              {r.isSystemRole && (
                <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-normal">System</span>
              )}
            </button>
          ))}
        </div>

        {currentRoleDef && (
          <div className="mt-2 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center justify-between border border-slate-100">
            <div>
              <span className="font-bold text-slate-800">{currentRoleDef.name} ({currentRoleDef.id}):</span>{' '}
              {currentRoleDef.description}
            </div>
            {currentRoleDef.id === 'SUPER_ADMIN' && (
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded font-medium text-[11px] border border-amber-200">
                <Lock className="w-3 h-3" /> Unrestricted Root Access
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'MATRIX' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search module or feature..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none"
                >
                  <option value="ALL">All Platform Modules</option>
                  {SYSTEM_MODULES.map((m: ModuleDefinition) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              💡 Tip: Click column headers or actions to bulk toggle permissions for this role.
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="p-3 w-72 min-w-[280px]">Module & Feature Name</th>
                  {allOperations.map(op => (
                    <th key={op} className="p-3 text-center min-w-[70px]">
                      {op}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredModules.map((module: ModuleDefinition) => (
                  <React.Fragment key={module.id}>
                    {/* Module Header Row */}
                    <tr className="bg-slate-50/80 font-bold text-slate-900">
                      <td className="p-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-emerald-800">
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                          {module.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => bulkUpdateModulePermissions(selectedRole, module.id, true)}
                            className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded text-[9px] font-semibold"
                            title="Grant all permissions in this module"
                          >
                            Grant All
                          </button>
                          <button
                            onClick={() => bulkUpdateModulePermissions(selectedRole, module.id, false)}
                            className="px-1.5 py-0.5 bg-red-100 text-red-700 hover:bg-red-200 rounded text-[9px] font-semibold"
                            title="Revoke all permissions in this module"
                          >
                            Clear All
                          </button>
                        </div>
                      </td>
                      {allOperations.map(op => (
                        <td key={op} className="p-3 text-center bg-slate-50/50"></td>
                      ))}
                    </tr>

                    {/* Feature Sub-Rows */}
                    {module.features.map((feature) => (
                      <tr key={feature.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 pl-8 text-slate-700">
                          <div className="font-semibold text-slate-800">{feature.name}</div>
                          <div className="text-[10px] text-slate-400">{feature.description}</div>
                        </td>

                        {allOperations.map(op => {
                          const isSupported = feature.availableOperations.includes(op);
                          const isChecked = isSupported && !!permissionMatrix[selectedRole]?.[module.id]?.[feature.id]?.[op];
                          const isDisabled = selectedRole === 'SUPER_ADMIN' || !isSupported;

                          return (
                            <td key={op} className="p-3 text-center">
                              {isSupported ? (
                                <button
                                  disabled={isDisabled}
                                  onClick={() => updatePermission(selectedRole, module.id, feature.id, op, !isChecked)}
                                  className={`w-5 h-5 inline-flex items-center justify-center rounded transition-all ${isChecked
                                      ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                                      : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                                    } ${isDisabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3 h-3 text-slate-300" />}
                                </button>
                              ) : (
                                <span className="text-slate-200 text-[10px]">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clone Role Tab */}
      {activeTab === 'CLONE' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-2xl space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Copy className="w-5 h-5 text-emerald-600" />
            Clone Existing Role Definition
          </h2>
          <p className="text-xs text-slate-500">
            Create a new role inheriting all exact permissions from <strong>{currentRoleDef.name} ({selectedRole})</strong>.
          </p>

          <form onSubmit={handleCloneSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Role Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior SOFDA Auditor"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Role Identifier Code</label>
              <input
                type="text"
                required
                placeholder="e.g. SR_SOFDA_AUDITOR"
                value={cloneCode}
                onChange={(e) => setCloneCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Confirm & Clone Role Matrix
            </button>
          </form>
        </div>
      )}

      {/* Create Custom Role Tab */}
      {activeTab === 'CREATE' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-2xl space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            Create Brand New Platform Role
          </h2>
          <p className="text-xs text-slate-500">
            Define a custom business role for specialized department officers or partner agencies.
          </p>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Certification Inspector"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role Identifier Code</label>
              <input
                type="text"
                required
                placeholder="e.g. ORGANIC_INSPECTOR"
                value={newRoleCode}
                onChange={(e) => setNewRoleCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Scope</label>
              <textarea
                rows={3}
                placeholder="Describe responsibilities and access boundaries..."
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Create Role & Initialize Matrix
            </button>
          </form>
        </div>
      )}

      {/* Audit Changelog Tab */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" />
              Permission Change Audit Trail & Log History
            </h2>
            <span className="text-xs text-slate-400">Total Recorded Audit Events: {auditLogs.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor / Admin</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log: AuditLogEntry) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">{log.timestamp}</td>
                    <td className="p-3 font-semibold text-slate-800">{log.actorName} ({log.actorRole})</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${log.category === 'PERMISSION_CHANGE' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-700">{log.action}</td>
                    <td className="p-3 font-sans text-slate-600">{log.details}</td>
                    <td className="p-3 text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
