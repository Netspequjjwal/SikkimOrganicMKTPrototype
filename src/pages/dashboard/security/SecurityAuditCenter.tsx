import React from 'react';
import { useRBAC } from '../../../context/RBACContext';
import { PlatformRole } from '../../../types/rbac';
import { 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  Monitor, 
  CheckCircle, 
  History, 
  LogOut
} from 'lucide-react';

export const SecurityAuditCenter: React.FC = () => {
  const { auditLogs, activeSessions, terminateSession, currentUser } = useRBAC();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-tight">Security Audit & Device Management Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of OTP logins, device sessions, failed login monitoring, and complete system audit trail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Security Status</p>
            <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5" /> High Enforcement
            </p>
          </div>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Authentication Mode</span>
            <Smartphone className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-slate-900">Mobile OTP Only</p>
          <p className="text-xs text-slate-500">6-Digit OTP verification with auto lockout after 5 failures.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Sessions</span>
            <Monitor className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-lg font-bold text-slate-900">{activeSessions.length} Linked Devices</p>
          <p className="text-xs text-slate-500">Multi-device session control & force remote logout capability.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Audit Events</span>
            <History className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-lg font-bold text-slate-900">{auditLogs.length} Recorded Entries</p>
          <p className="text-xs text-slate-500">Immutable audit log tracking all permission and access events.</p>
        </div>
      </div>

      {/* Active Device Sessions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-emerald-600" />
            Active User Sessions & Registered Devices
          </h2>
          <span className="text-xs text-slate-400">Current User: {currentUser?.name}</span>
        </div>

        <div className="space-y-3">
          {activeSessions.map((session: any) => (
            <div
              key={session.sessionId}
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                session.isCurrent ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${session.isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{session.deviceName}</span>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">This Device</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-slate-400" /> {session.ipAddress} ({session.location})</span>
                    <span>•</span>
                    <span>Logged in: {session.loginTime}</span>
                    <span>•</span>
                    <span>Last active: {session.lastActiveTime}</span>
                  </div>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  onClick={() => terminateSession(session.sessionId)}
                  className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Force Logout Device
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Audit Logs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            Security & Authentication Audit Trail
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3">Timestamp</th>
                <th className="p-3">User / Actor</th>
                <th className="p-3">Category</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-500">{log.timestamp}</td>
                  <td className="p-3 font-semibold text-slate-800">{log.actorName} ({log.actorRole})</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold">
                      {log.category}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-700">{log.action}</td>
                  <td className="p-3 font-sans text-slate-600">{log.details}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
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
