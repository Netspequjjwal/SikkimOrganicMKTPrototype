import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PlatformRole, 
  ModuleId, 
  PermissionOperation, 
  UserAccount, 
  RoleDefinition, 
  PermissionMatrix, 
  AuditLogEntry, 
  UserSession 
} from '../types/rbac';
import { 
  SYSTEM_MODULES, 
  SYSTEM_ROLES, 
  buildInitialMatrix, 
  INITIAL_USERS, 
  INITIAL_AUDIT_LOGS 
} from '../data/rbacInitialData';

interface RBACContextType {
  currentUser: UserAccount | null;
  activeRole: PlatformRole | null;
  rolesList: RoleDefinition[];
  permissionMatrix: PermissionMatrix;
  auditLogs: AuditLogEntry[];
  activeSessions: UserSession[];
  
  // Auth & OTP
  loginWithOTP: (mobile: string, otp: string) => { success: boolean; message: string };
  logout: () => void;
  quickSwitchUser: (userId: string) => void;

  // Multi-role switching
  switchActiveRole: (newRole: PlatformRole) => void;
  upgradeUserRole: (userId: string, addedRole: PlatformRole) => void;

  // Permission Checks
  hasPermission: (moduleId: ModuleId, featureId: string, operation: PermissionOperation) => boolean;
  canAccessModule: (moduleId: ModuleId) => boolean;

  // Super Admin Matrix Management
  updatePermission: (roleId: string, moduleId: ModuleId, featureId: string, operation: PermissionOperation, value: boolean) => void;
  bulkUpdateModulePermissions: (roleId: string, moduleId: ModuleId, value: boolean) => void;
  cloneRole: (sourceRoleId: string, newRoleName: string, newRoleCode: string) => void;
  createNewRole: (roleName: string, roleCode: string, description: string, baseRole?: PlatformRole) => void;

  // Session & Security Audit
  terminateSession: (sessionId: string) => void;
  logAuditEntry: (action: string, category: AuditLogEntry['category'], details: string, prevVal?: string, newVal?: string, status?: 'SUCCESS' | 'WARNING' | 'FAILED') => void;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial states or localStorage
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('sikkim_rbac_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default to Super Admin for immediate demo view
  });

  const [activeRole, setActiveRole] = useState<PlatformRole | null>(() => {
    return currentUser ? currentUser.currentRole : 'SUPER_ADMIN';
  });

  const [rolesList, setRolesList] = useState<RoleDefinition[]>(SYSTEM_ROLES);
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrix>(() => buildInitialMatrix());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [activeSessions, setActiveSessions] = useState<UserSession[]>([
    {
      sessionId: 'SESS-9001',
      deviceName: 'Chrome on Windows 11',
      browser: 'Chrome 127.0',
      ipAddress: '103.21.124.5',
      location: 'Gangtok, Sikkim',
      loginTime: '2026-08-01 10:15 AM',
      lastActiveTime: 'Just now',
      isCurrent: true
    },
    {
      sessionId: 'SESS-9002',
      deviceName: 'Safari on iPhone 15 Pro',
      browser: 'Safari Mobile 17.4',
      ipAddress: '49.207.19.88',
      location: 'Namchi, Sikkim',
      loginTime: '2026-07-31 06:40 PM',
      lastActiveTime: 'Yesterday',
      isCurrent: false
    }
  ]);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sikkim_rbac_user', JSON.stringify(currentUser));
      setActiveRole(currentUser.currentRole);
    } else {
      localStorage.removeItem('sikkim_rbac_user');
      setActiveRole(null);
    }
  }, [currentUser]);

  // Add Audit Entry Helper
  const logAuditEntry = (
    action: string,
    category: AuditLogEntry['category'],
    details: string,
    previousValue?: string,
    newValue?: string,
    status: 'SUCCESS' | 'WARNING' | 'FAILED' = 'SUCCESS'
  ) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorId: currentUser?.id || 'GUEST',
      actorName: currentUser?.name || 'Guest User',
      actorRole: activeRole || 'GUEST_USER',
      action,
      category,
      details,
      previousValue,
      newValue,
      ipAddress: '103.21.124.5',
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // OTP Login Simulation
  const loginWithOTP = (mobile: string, otp: string) => {
    if (otp !== '123456' && otp !== '000000') {
      logAuditEntry('LOGIN_FAILED', 'AUTH', `Failed OTP attempt for mobile ${mobile}`, undefined, undefined, 'FAILED');
      return { success: false, message: 'Invalid OTP. Please enter 123456 for testing.' };
    }

    // Find existing or register as Guest
    let user = INITIAL_USERS.find(u => u.mobile === mobile);
    if (!user) {
      user = {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        mobile,
        name: `Guest User (${mobile.slice(-4)})`,
        email: `${mobile}@sikkimorganic.in`,
        activeRoles: ['GUEST_USER'],
        currentRole: 'GUEST_USER',
        isGuest: true,
        buyerStatus: 'NOT_APPLIED',
        sellerStatus: 'NOT_APPLIED',
        organization: 'Independent Guest',
        district: 'East Sikkim',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toLocaleString(),
        status: 'ACTIVE',
        failedLoginAttempts: 0
      };
    }

    setCurrentUser(user);
    setActiveRole(user.currentRole);
    logAuditEntry('OTP_LOGIN_SUCCESS', 'AUTH', `Logged in via mobile ${mobile}`);
    return { success: true, message: 'OTP Verified successfully.' };
  };

  const logout = () => {
    logAuditEntry('LOGOUT', 'AUTH', 'User logged out manually');
    setCurrentUser(null);
    setActiveRole(null);
  };

  const quickSwitchUser = (userId: string) => {
    const found = INITIAL_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setActiveRole(found.currentRole);
      logAuditEntry('DEMO_USER_SWITCH', 'AUTH', `Switched demo active account to ${found.name} (${found.currentRole})`);
    }
  };

  // Multi-Role switching
  const switchActiveRole = (newRole: PlatformRole) => {
    if (!currentUser) return;
    if (!currentUser.activeRoles.includes(newRole)) {
      logAuditEntry('UNAUTHORIZED_ROLE_SWITCH', 'SECURITY', `Attempted to switch to unauthorized role ${newRole}`, undefined, undefined, 'WARNING');
      return;
    }
    const prev = currentUser.currentRole;
    const updatedUser = { ...currentUser, currentRole: newRole };
    setCurrentUser(updatedUser);
    setActiveRole(newRole);
    logAuditEntry('ROLE_SWITCHED', 'ROLE_MGMT', `Switched active workspace role to ${newRole}`, prev, newRole);
  };

  // Upgrade Role after onboarding
  const upgradeUserRole = (userId: string, addedRole: PlatformRole) => {
    setCurrentUser(prev => {
      if (!prev || prev.id !== userId) return prev;
      const updatedRoles = Array.from(new Set([...prev.activeRoles, addedRole]));
      return {
        ...prev,
        activeRoles: updatedRoles,
        currentRole: addedRole,
        isGuest: false,
        sellerStatus: addedRole === 'SELLER_USER' ? 'APPROVED' : prev.sellerStatus,
        buyerStatus: addedRole === 'BUYER_USER' ? 'APPROVED' : prev.buyerStatus
      };
    });
    logAuditEntry('ROLE_GRANTED', 'ROLE_MGMT', `Granted role ${addedRole} to user ${userId}`);
  };

  // Permission Checks
  const hasPermission = (moduleId: ModuleId, featureId: string, operation: PermissionOperation): boolean => {
    if (!activeRole) return false;
    const rolePerms = permissionMatrix[activeRole];
    if (!rolePerms || !rolePerms[moduleId] || !rolePerms[moduleId][featureId]) {
      return false;
    }
    return !!rolePerms[moduleId][featureId][operation];
  };

  const canAccessModule = (moduleId: ModuleId): boolean => {
    if (!activeRole) return false;
    const rolePerms = permissionMatrix[activeRole];
    if (!rolePerms || !rolePerms[moduleId]) return false;
    
    // Check if at least one feature has 'view' or any operation true
    const features = rolePerms[moduleId];
    return Object.values(features).some(featureOps => 
      Object.values(featureOps).some(val => val === true)
    );
  };

  // Super Admin Matrix Edits
  const updatePermission = (
    roleId: string, 
    moduleId: ModuleId, 
    featureId: string, 
    operation: PermissionOperation, 
    value: boolean
  ) => {
    setPermissionMatrix(prev => {
      const copy = { ...prev };
      if (!copy[roleId]) copy[roleId] = {} as any;
      if (!copy[roleId][moduleId]) copy[roleId][moduleId] = {} as any;
      if (!copy[roleId][moduleId][featureId]) {
        copy[roleId][moduleId][featureId] = {
          view: false, create: false, update: false, delete: false,
          approve: false, reject: false, export: false, configure: false,
          publish: false, verify: false, manage: false
        };
      }
      copy[roleId][moduleId][featureId][operation] = value;
      return copy;
    });

    logAuditEntry(
      'PERMISSION_UPDATED',
      'PERMISSION_CHANGE',
      `Modified permission for Role [${roleId}], Module [${moduleId}], Feature [${featureId}], Operation [${operation}]`,
      (!value).toString(),
      value.toString()
    );
  };

  const bulkUpdateModulePermissions = (roleId: string, moduleId: ModuleId, value: boolean) => {
    setPermissionMatrix(prev => {
      const copy = { ...prev };
      const moduleDef = SYSTEM_MODULES.find(m => m.id === moduleId);
      if (!moduleDef) return prev;

      if (!copy[roleId]) copy[roleId] = {} as any;
      if (!copy[roleId][moduleId]) copy[roleId][moduleId] = {} as any;

      moduleDef.features.forEach(feat => {
        if (!copy[roleId][moduleId][feat.id]) {
          copy[roleId][moduleId][feat.id] = {} as any;
        }
        feat.availableOperations.forEach(op => {
          copy[roleId][moduleId][feat.id][op] = value;
        });
      });
      return copy;
    });

    logAuditEntry('BULK_PERMISSION_UPDATED', 'PERMISSION_CHANGE', `Bulk updated all operations for Role [${roleId}] under Module [${moduleId}] to ${value}`);
  };

  const cloneRole = (sourceRoleId: string, newRoleName: string, newRoleCode: string) => {
    if (rolesList.some(r => r.id === newRoleCode)) {
      alert('Role code already exists!');
      return;
    }

    const newRoleDef: RoleDefinition = {
      id: newRoleCode,
      name: newRoleName,
      description: `Cloned from ${sourceRoleId}`,
      isSystemRole: false,
      baseRole: sourceRoleId as PlatformRole,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setRolesList(prev => [...prev, newRoleDef]);

    setPermissionMatrix(prev => {
      const copy = { ...prev };
      copy[newRoleCode] = JSON.parse(JSON.stringify(prev[sourceRoleId] || {}));
      return copy;
    });

    logAuditEntry('ROLE_CLONED', 'ROLE_MGMT', `Cloned role [${sourceRoleId}] to new role [${newRoleCode} - ${newRoleName}]`);
  };

  const createNewRole = (roleName: string, roleCode: string, description: string, baseRole?: PlatformRole) => {
    const newRoleDef: RoleDefinition = {
      id: roleCode,
      name: roleName,
      description,
      isSystemRole: false,
      baseRole,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setRolesList(prev => [...prev, newRoleDef]);
    setPermissionMatrix(prev => {
      const copy = { ...prev };
      if (baseRole && prev[baseRole]) {
        copy[roleCode] = JSON.parse(JSON.stringify(prev[baseRole]));
      } else {
        copy[roleCode] = buildInitialMatrix()['GUEST_USER'];
      }
      return copy;
    });

    logAuditEntry('ROLE_CREATED', 'ROLE_MGMT', `Created custom role [${roleCode} - ${roleName}]`);
  };

  const terminateSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(s => s.sessionId !== sessionId));
    logAuditEntry('SESSION_TERMINATED', 'SECURITY', `Force terminated session ${sessionId}`);
  };

  return (
    <RBACContext.Provider
      value={{
        currentUser,
        activeRole,
        rolesList,
        permissionMatrix,
        auditLogs,
        activeSessions,
        loginWithOTP,
        logout,
        quickSwitchUser,
        switchActiveRole,
        upgradeUserRole,
        hasPermission,
        canAccessModule,
        updatePermission,
        bulkUpdateModulePermissions,
        cloneRole,
        createNewRole,
        terminateSession,
        logAuditEntry
      }}
    >
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};
