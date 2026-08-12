export type PlatformRole = 
  | 'SUPER_ADMIN'
  | 'DEPT_ADMIN'
  | 'SUPPORT_USER'
  | 'SOFDA_ADMIN'
  | 'GUEST_USER'
  | 'SELLER_USER'
  | 'BUYER_USER';

export type ModuleId =
  | 'USER_MGMT'
  | 'MASTER_CONFIG'
  | 'CMS'
  | 'AUTH'
  | 'SELLER_ONBOARDING'
  | 'BUYER_ONBOARDING'
  | 'PRODUCT_MGMT'
  | 'ENQUIRY_NEGOTIATION'
  | 'DIGITAL_CONTRACT'
  | 'PAYMENT'
  | 'ORDER_FULFILMENT'
  | 'ACCOUNTS_LEDGER'
  | 'REPORTS_ANALYTICS';

export type PermissionOperation =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'export'
  | 'configure'
  | 'publish'
  | 'verify'
  | 'manage';

export interface ModuleFeature {
  id: string;
  name: string;
  description: string;
  availableOperations: PermissionOperation[];
}

export interface ModuleDefinition {
  id: ModuleId;
  name: string;
  description: string;
  icon?: string;
  features: ModuleFeature[];
}

export interface RoleDefinition {
  id: string; // role code e.g. SUPER_ADMIN or CUSTOM_ROLE_1
  name: string;
  description: string;
  isSystemRole: boolean;
  baseRole?: PlatformRole;
  createdAt: string;
  updatedAt: string;
}

// Matrix mapping: RoleId -> ModuleId -> FeatureId -> Record<PermissionOperation, boolean>
export type PermissionMatrix = Record<
  string, // RoleId
  Record<
    ModuleId,
    Record<
      string, // FeatureId
      Record<PermissionOperation, boolean>
    >
  >
>;

export interface UserSession {
  sessionId: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  location: string;
  loginTime: string;
  lastActiveTime: string;
  isCurrent: boolean;
}

export interface UserAccount {
  id: string;
  mobile: string;
  name: string;
  email: string;
  avatar?: string;
  activeRoles: PlatformRole[];
  currentRole: PlatformRole;
  isGuest: boolean;
  buyerStatus: 'NOT_APPLIED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  sellerStatus: 'NOT_APPLIED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  organization?: string;
  district?: string;
  createdAt: string;
  lastLogin: string;
  status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED';
  failedLoginAttempts: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: PlatformRole;
  action: string;
  category: 'AUTH' | 'ROLE_MGMT' | 'PERMISSION_CHANGE' | 'SECURITY' | 'ACCESS_DENIED';
  targetResource?: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface PermissionVersion {
  version: string;
  timestamp: string;
  author: string;
  changeSummary: string;
}
