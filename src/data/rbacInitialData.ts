import { ModuleDefinition, RoleDefinition, PermissionMatrix, PlatformRole, ModuleId, AuditLogEntry, UserAccount } from '../types/rbac';

export const SYSTEM_MODULES: ModuleDefinition[] = [
  {
    id: 'USER_MGMT',
    name: 'User Management',
    description: 'User registration, accounts, role assignments, and profile management.',
    features: [
      { id: 'user_list', name: 'User Directory', description: 'View & search platform users', availableOperations: ['view', 'export', 'manage'] },
      { id: 'role_assign', name: 'Role Assignment', description: 'Grant or revoke roles for users', availableOperations: ['view', 'update', 'manage'] },
      { id: 'permission_matrix', name: 'Permission Matrix Console', description: 'Configure granular RBAC rules', availableOperations: ['view', 'configure', 'manage'] }
    ]
  },
  {
    id: 'MASTER_CONFIG',
    name: 'Master Configuration',
    description: 'System settings, crop masters, district mappings, and compliance rules.',
    features: [
      { id: 'crop_master', name: 'Crop & Produce Master', description: 'Manage organic crop varieties and categories', availableOperations: ['view', 'create', 'update', 'delete', 'configure'] },
      { id: 'district_master', name: 'District & Cluster Master', description: 'Manage Sikkim agricultural clusters', availableOperations: ['view', 'update', 'configure'] }
    ]
  },
  {
    id: 'CMS',
    name: 'Website CMS',
    description: 'Public content, announcements, banners, and helpdesk portal.',
    features: [
      { id: 'cms_content', name: 'Content Editor', description: 'Publish news, stories & banners', availableOperations: ['view', 'create', 'update', 'publish', 'delete'] },
      { id: 'helpdesk', name: 'Helpdesk & Tickets', description: 'Support queries and ticket resolution', availableOperations: ['view', 'create', 'update', 'manage'] }
    ]
  },
  {
    id: 'AUTH',
    name: 'Registration & Login',
    description: 'OTP authentication, passwordless login, device tracking, and security audit.',
    features: [
      { id: 'otp_auth', name: 'Mobile OTP Verification', description: 'OTP generation, validation & lockout', availableOperations: ['view', 'verify', 'manage'] },
      { id: 'device_sessions', name: 'Active Sessions', description: 'Manage active devices and session invalidation', availableOperations: ['view', 'delete', 'manage'] }
    ]
  },
  {
    id: 'SELLER_ONBOARDING',
    name: 'Seller Onboarding',
    description: 'Grower group and FPO verification, organic certification validation.',
    features: [
      { id: 'seller_apply', name: 'Seller Application', description: 'Submit organic farmer/FPO details', availableOperations: ['view', 'create', 'update'] },
      { id: 'seller_verify', name: 'SOFDA Verification', description: 'Inspect certification documents and verify seller', availableOperations: ['view', 'verify', 'approve', 'reject'] }
    ]
  },
  {
    id: 'BUYER_ONBOARDING',
    name: 'Buyer Onboarding',
    description: 'Corporate buyer verification, GSTIN check, credit score assessment.',
    features: [
      { id: 'buyer_apply', name: 'Buyer Application', description: 'Submit trade license and buyer verification', availableOperations: ['view', 'create', 'update'] },
      { id: 'buyer_verify', name: 'SOFDA Approval', description: 'Approve buyer credit limit and trading license', availableOperations: ['view', 'verify', 'approve', 'reject'] }
    ]
  },
  {
    id: 'PRODUCT_MGMT',
    name: 'Product Management',
    description: 'Organic inventory publishing, pricing, batch tracking, approval workflow.',
    features: [
      { id: 'catalog_view', name: 'Product Catalog', description: 'Explore published organic produce', availableOperations: ['view', 'export'] },
      { id: 'product_publish', name: 'Publish Produce Listing', description: 'Create and list organic batch for sale', availableOperations: ['view', 'create', 'update', 'delete', 'publish'] },
      { id: 'listing_approve', name: 'SOFDA Quality Approval', description: 'Approve organic grade & pesticide tests', availableOperations: ['view', 'verify', 'approve', 'reject'] }
    ]
  },
  {
    id: 'ENQUIRY_NEGOTIATION',
    name: 'Enquiry & Negotiation',
    description: 'B2B price discovery, bulk rate counters, term sheets.',
    features: [
      { id: 'enquiry_raise', name: 'Submit Trade Enquiry', description: 'Send quote request for organic produce', availableOperations: ['view', 'create', 'update'] },
      { id: 'negotiation_room', name: 'Interactive Counter-Offer', description: 'Bargain price, delivery date, payment terms', availableOperations: ['view', 'create', 'update', 'approve', 'reject'] }
    ]
  },
  {
    id: 'DIGITAL_CONTRACT',
    name: 'Digital Contract',
    description: 'Automated contract generation, digital signatures, escrow terms.',
    features: [
      { id: 'contract_gen', name: 'Contract Generation', description: 'Formulate legal trade agreement', availableOperations: ['view', 'create', 'update', 'approve', 'export'] },
      { id: 'contract_sign', name: 'Digital Signature', description: 'e-Sign contract terms', availableOperations: ['view', 'verify', 'approve'] }
    ]
  },
  {
    id: 'PAYMENT',
    name: 'Payment & Escrow',
    description: 'Escrow deposit, stage payments, payment gateway release.',
    features: [
      { id: 'escrow_deposit', name: 'Escrow Deposit', description: 'Lock funds in organic trade escrow', availableOperations: ['view', 'create', 'verify'] },
      { id: 'payout_release', name: 'Payout Authorization', description: 'Release payment upon quality audit', availableOperations: ['view', 'approve', 'reject', 'manage'] }
    ]
  },
  {
    id: 'ORDER_FULFILMENT',
    name: 'Order Management & Fulfilment',
    description: 'Dispatch, logistics tracking, cold chain temperature logs, delivery confirmation.',
    features: [
      { id: 'order_track', name: 'Order Status Tracking', description: 'Track shipment from Sikkim farm to buyer depot', availableOperations: ['view', 'update', 'export'] },
      { id: 'quality_grn', name: 'Goods Receipt (GRN)', description: 'Acknowledge delivery quality and weight', availableOperations: ['view', 'create', 'approve', 'reject'] }
    ]
  },
  {
    id: 'ACCOUNTS_LEDGER',
    name: 'Accounts Ledger',
    description: 'Transaction ledger, GST reports, commission logs, invoice history.',
    features: [
      { id: 'ledger_view', name: 'Financial Statements', description: 'Inspect account debits, credits and taxes', availableOperations: ['view', 'export'] }
    ]
  },
  {
    id: 'REPORTS_ANALYTICS',
    name: 'Reports & Analytics',
    description: 'Executive dashboards, yield statistics, pricing trends, compliance metrics.',
    features: [
      { id: 'executive_dash', name: 'Department Dashboard', description: 'Macro organic farming metrics', availableOperations: ['view', 'export'] },
      { id: 'trade_analytics', name: 'Market Intelligence', description: 'Price trends and trade volume graphs', availableOperations: ['view', 'export'] }
    ]
  }
];

export const SYSTEM_ROLES: RoleDefinition[] = [
  { id: 'SUPER_ADMIN', name: 'Super Admin', description: 'Full unrestricted system access, RBAC matrix management, audit control.', isSystemRole: true, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'DEPT_ADMIN', name: 'Department Admin', description: 'Agri Dept executives monitoring ecosystem analytics, reports & yield stats.', isSystemRole: true, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'SUPPORT_USER', name: 'Support User', description: 'Website CMS management, master data support, and read-only issue resolution.', isSystemRole: true, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'SOFDA_ADMIN', name: 'SOFDA Admin', description: 'Sikkim Organic Agency admin approving buyers, sellers, products & compliance.', isSystemRole: true, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'GUEST_USER', name: 'Guest User', description: 'Default account for new OTP logins. Public browsing & seller verification view.', isSystemRole: true, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'SELLER_USER', name: 'Seller User (Grower/FPO)', description: 'Publish organic produce, quote prices, sign trade contracts, fulfill orders.', isSystemRole: true, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'BUYER_USER', name: 'Buyer User (Wholesaler/Processor)', description: 'Procure organic produce, submit enquiries, negotiate terms & manage orders.', isSystemRole: true, createdAt: '2026-01-01', updatedAt: '2026-01-01' }
];

// Helper to generate initial permissions
export const buildInitialMatrix = (): PermissionMatrix => {
  const matrix: PermissionMatrix = {};

  SYSTEM_ROLES.forEach((role) => {
    matrix[role.id] = {} as any;
    SYSTEM_MODULES.forEach((mod) => {
      matrix[role.id][mod.id] = {} as any;
      mod.features.forEach((feat) => {
        const opsRecord: Record<string, boolean> = {
          view: false, create: false, update: false, delete: false,
          approve: false, reject: false, export: false, configure: false,
          publish: false, verify: false, manage: false
        };

        if (role.id === 'SUPER_ADMIN') {
          feat.availableOperations.forEach(op => opsRecord[op] = true);
        } else if (role.id === 'DEPT_ADMIN') {
          if (['REPORTS_ANALYTICS', 'ACCOUNTS_LEDGER', 'USER_MGMT', 'PRODUCT_MGMT'].includes(mod.id)) {
            opsRecord.view = true;
            opsRecord.export = true;
          }
        } else if (role.id === 'SUPPORT_USER') {
          if (['CMS', 'MASTER_CONFIG', 'AUTH'].includes(mod.id)) {
            opsRecord.view = true;
            opsRecord.create = true;
            opsRecord.update = true;
          } else {
            opsRecord.view = true; // Read-only troubleshooting
          }
        } else if (role.id === 'SOFDA_ADMIN') {
          opsRecord.view = true;
          if (['SELLER_ONBOARDING', 'BUYER_ONBOARDING', 'PRODUCT_MGMT'].includes(mod.id)) {
            opsRecord.verify = true;
            opsRecord.approve = true;
            opsRecord.reject = true;
          }
        } else if (role.id === 'GUEST_USER') {
          if (['PRODUCT_MGMT', 'CMS', 'AUTH'].includes(mod.id)) {
            opsRecord.view = true; // Browse only
          }
        } else if (role.id === 'SELLER_USER') {
          if (['SELLER_ONBOARDING', 'PRODUCT_MGMT', 'ENQUIRY_NEGOTIATION', 'DIGITAL_CONTRACT', 'PAYMENT', 'ORDER_FULFILMENT', 'ACCOUNTS_LEDGER'].includes(mod.id)) {
            opsRecord.view = true;
            opsRecord.create = true;
            opsRecord.update = true;
            opsRecord.publish = true;
          }
        } else if (role.id === 'BUYER_USER') {
          if (['BUYER_ONBOARDING', 'PRODUCT_MGMT', 'ENQUIRY_NEGOTIATION', 'DIGITAL_CONTRACT', 'PAYMENT', 'ORDER_FULFILMENT', 'ACCOUNTS_LEDGER'].includes(mod.id)) {
            opsRecord.view = true;
            opsRecord.create = true;
            opsRecord.update = true;
            opsRecord.export = true;
          }
        }

        matrix[role.id][mod.id][feat.id] = opsRecord as any;
      });
    });
  });

  return matrix;
};

export const INITIAL_USERS: UserAccount[] = [
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
    organization: 'Sikkim Organic Development Agency (SOFDA)',
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
    name: 'Karmapa Organic Traders (Guest)',
    email: 'newuser@gmail.com',
    activeRoles: ['GUEST_USER'],
    currentRole: 'GUEST_USER',
    isGuest: true,
    buyerStatus: 'NOT_APPLIED',
    sellerStatus: 'NOT_APPLIED',
    organization: 'Pending Setup',
    district: 'Pakyong',
    createdAt: '2026-08-01',
    lastLogin: '2026-08-01 10:20 AM',
    status: 'ACTIVE',
    failedLoginAttempts: 0
  },
  {
    id: 'USR-005',
    mobile: '9800011122',
    name: 'Tashi Bhutia',
    email: 'sofda.admin@sikkimorganic.gov.in',
    activeRoles: ['SOFDA_ADMIN'],
    currentRole: 'SOFDA_ADMIN',
    isGuest: false,
    buyerStatus: 'NOT_APPLIED',
    sellerStatus: 'NOT_APPLIED',
    organization: 'Sikkim Organic Farming Development Agency (SOFDA)',
    district: 'Gangtok',
    createdAt: '2026-01-15',
    lastLogin: '2026-08-01 10:45 AM',
    status: 'ACTIVE',
    failedLoginAttempts: 0
  },
  {
    id: 'USR-006',
    mobile: '9833344455',
    name: 'Dr. Norden Lepcha',
    email: 'dept.admin@sikkimorganic.gov.in',
    activeRoles: ['DEPT_ADMIN'],
    currentRole: 'DEPT_ADMIN',
    isGuest: false,
    buyerStatus: 'NOT_APPLIED',
    sellerStatus: 'NOT_APPLIED',
    organization: 'Department of Agriculture, Govt of Sikkim',
    district: 'Gangtok',
    createdAt: '2026-01-10',
    lastLogin: '2026-08-01 10:50 AM',
    status: 'ACTIVE',
    failedLoginAttempts: 0
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-8801',
    timestamp: '2026-08-01 10:15:02',
    actorId: 'USR-001',
    actorName: 'Prem Das Rai',
    actorRole: 'SUPER_ADMIN',
    action: 'OTP_LOGIN_SUCCESS',
    category: 'AUTH',
    details: 'Authenticated via 6-digit OTP from mobile 9876543210',
    ipAddress: '103.21.124.5',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-8802',
    timestamp: '2026-08-01 09:30:11',
    actorId: 'USR-002',
    actorName: 'Dawa Lepcha',
    actorRole: 'SELLER_USER',
    action: 'ROLE_SWITCHED',
    category: 'ROLE_MGMT',
    details: 'Switched active workspace from BUYER_USER to SELLER_USER',
    previousValue: 'BUYER_USER',
    newValue: 'SELLER_USER',
    ipAddress: '103.54.99.12',
    status: 'SUCCESS'
  }
];
