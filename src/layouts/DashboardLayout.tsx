import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useRBAC } from '../context/RBACContext';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import {
  LayoutDashboard, Users, FileText, Settings, LogOut, Bell, Menu, X, 
  BarChart3, Truck, Search, FileCheck, ClipboardList, ShoppingCart, 
  MessageSquare, FileSignature, Package, ShieldCheck, Shield, Key, 
  UserCheck, Handshake, Lock, Sliders, Database, Globe, Building2
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import clsx from 'clsx';

export const DashboardLayout: React.FC = () => {
  const { currentUser, activeRole, logout, canAccessModule } = useRBAC();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const items: { icon: any; label: string; path: string; moduleId?: any; highlight?: boolean }[] = [
      { icon: LayoutDashboard, label: 'Overview Dashboard', path: '/dashboard' }
    ];

    if (activeRole === 'SUPER_ADMIN') {
      items.push(
        { icon: ShieldCheck, label: 'Permission Matrix Console', path: '/dashboard/admin/permissions', highlight: true },
        { icon: Users, label: 'User Directory & Roles', path: '/dashboard/admin/users' },
        { icon: ShieldCheck, label: 'Security & Audit Center', path: '/dashboard/security/audit' },
        { icon: FileCheck, label: 'Seller Approvals', path: '/dashboard/seller-approvals' },
        { icon: UserCheck, label: 'Buyer Approvals', path: '/dashboard/buyer-approvals' },
        { icon: Package, label: 'Product Approvals', path: '/dashboard/agri/product-approvals' },
        { icon: BarChart3, label: 'Analytics & Reports', path: '/dashboard/agri/analytics' }
      );
    } else if (activeRole === 'SOFDA_ADMIN') {
      items.push(
        { icon: FileCheck, label: 'Seller Onboarding Approvals', path: '/dashboard/seller-approvals' },
        { icon: UserCheck, label: 'Buyer Onboarding Approvals', path: '/dashboard/buyer-approvals' },
        { icon: ShieldCheck, label: 'Product Listing Approvals', path: '/dashboard/agri/product-approvals' },
        { icon: Handshake, label: 'Trade Negotiations Monitoring', path: '/dashboard/agri/negotiations' },
        { icon: BarChart3, label: 'Ecosystem Analytics', path: '/dashboard/agri/analytics' }
      );
    } else if (activeRole === 'DEPT_ADMIN') {
      items.push(
        { icon: BarChart3, label: 'Analytics & Reports', path: '/dashboard/agri/analytics' },
        { icon: Users, label: 'FPO & Grower Directory', path: '/dashboard/agri/fpo-registration' },
        { icon: Handshake, label: 'Trade Negotiations', path: '/dashboard/agri/negotiations' }
      );
    } else if (activeRole === 'SUPPORT_USER') {
      items.push(
        { icon: Users, label: 'User Support Directory', path: '/dashboard/admin/users' },
        { icon: Globe, label: 'CMS & Helpdesk', path: '/dashboard/cms' },
        { icon: Database, label: 'Master Data Config', path: '/dashboard/master-config' },
        { icon: ShieldCheck, label: 'Audit Logs (Read-only)', path: '/dashboard/security/audit' }
      );
    } else if (activeRole === 'SELLER_USER') {
      items.push(
        { icon: Package, label: 'Product Management', path: '/dashboard/products/manage' },
        { icon: MessageSquare, label: 'Buyer Enquiries', path: '/dashboard/buyer-enquiries' },
        { icon: FileSignature, label: 'Digital Contracts', path: '/dashboard/sp-contracts' },
        { icon: Truck, label: 'Order Fulfilment', path: '/dashboard/sp-orders' },
        { icon: ClipboardList, label: 'Financial Ledger', path: '/dashboard/payments/ledger' },
        { icon: Settings, label: 'Seller Profile & Certification', path: '/dashboard/seller-registration' }
      );
    } else if (activeRole === 'BUYER_USER') {
      items.push(
        { icon: ShoppingCart, label: 'Marketplace Discovery', path: '/dashboard/marketplace' },
        { icon: FileText, label: 'My Enquiries', path: '/dashboard/my-enquiries' },
        { icon: FileSignature, label: 'Procurement Contracts', path: '/dashboard/buyer-contracts' },
        { icon: Truck, label: 'Order Tracking', path: '/dashboard/buyer-orders' },
        { icon: ClipboardList, label: 'Financial Ledger', path: '/dashboard/payments/ledger' },
        { icon: Settings, label: 'Buyer Organization Profile', path: '/dashboard/buyer-registration' }
      );
    } else if (activeRole === 'GUEST_USER') {
      items.push(
        { icon: ShoppingCart, label: 'Explore Organic Marketplace', path: '/dashboard/marketplace' },
        { icon: Building2, label: 'Register Organization', path: '/dashboard/org-registration', highlight: true }
      );
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Primary Top Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-20 shadow-xs flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex items-center">
            <img src={logoImg} alt="Logo" className="h-10 w-auto" />
          </Link>

          <div className="hidden md:block ml-2">
            <h1 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              Sikkim Organic Digital Marketplace
            </h1>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Dynamic Role Switcher for Multi-role users */}
          <RoleSwitcher />

          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-emerald-500 rounded-full"></span>
          </button>

          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-gray-900">{currentUser?.name || 'User'}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">{activeRole}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={clsx(
            'fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col justify-between border-r border-slate-800',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="p-4 overflow-y-auto">
            {/* User Profile Summary */}
            <div className="p-3 bg-slate-800/80 rounded-xl mb-4 border border-slate-700/60">
              <div className="text-xs font-bold text-white truncate">{currentUser?.name || 'Guest Explorer'}</div>
              <div className="text-[11px] text-emerald-400 font-semibold truncate mt-0.5">{currentUser?.organization || 'Individual'}</div>
              {currentUser?.isGuest && (
                <div className="mt-2 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 p-1.5 rounded text-center">
                  ⚠️ Guest Account (Browse Only)
                </div>
              )}
            </div>

            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-3 mb-2">
              Permitted Navigation
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md'
                        : item.highlight
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <Icon className={clsx('h-4 w-4', isActive ? 'text-white' : 'text-slate-400')} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800 text-[10px] text-slate-400 text-center">
            Sikkim Organic Digital Marketplace • Dynamic RBAC Active
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
