import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, FileText, Settings, LogOut, Bell, Menu, X, CheckCircle, BarChart3, Truck, Search, FilePlus, FileCheck, UploadCloud, ClipboardList, ShoppingCart, MessageSquare, FileSignature, Package, ShieldCheck, Shield, Key, UserCheck
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import clsx from 'clsx';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const base = [{ icon: LayoutDashboard, label: 'Overview', path: '/dashboard' }];

    switch (user?.role) {
      case 'AGRI_DEPT':
        return [
          ...base, 
          { icon: ShieldCheck, label: 'Product Approvals', path: '/dashboard/agri/product-approvals' },
          { icon: FileCheck, label: 'Seller Approvals', path: '/dashboard/seller-approvals' }, 
          { icon: Users, label: 'FPO Registration', path: '/dashboard/agri/fpo-registration' }, 
          { icon: Package, label: 'ICS Product Listing', path: '/dashboard/agri/ics-products' }, 
          { icon: FileText, label: 'FPO Product Listing', path: '/dashboard/agri/fpo-products' }, 
          { icon: BarChart3, label: 'Analytics & Reports', path: '/dashboard/agri/analytics' }
        ];
      case 'ICS_PROVIDER':
        return [
          ...base, 
          { icon: Package, label: 'Product Management', path: '/dashboard/products/manage' },
          { icon: MessageSquare, label: 'Buyer Enquiries', path: '/dashboard/buyer-enquiries' }, 
          { icon: FileSignature, label: 'Contracts', path: '/dashboard/sp-contracts' }, 
          { icon: Truck, label: 'Order Fulfilment', path: '/dashboard/sp-orders' }, 
          { icon: ClipboardList, label: 'Ledger', path: '/dashboard/payments/ledger' }, 
          { icon: Settings, label: 'Organization Settings', path: '/dashboard/seller-registration' }, 
          { icon: ShieldCheck, label: 'TC Requests', path: '/dashboard/tc/requests' }
        ];
      case 'FPO_FARMER':
        return [
          ...base, 
          { icon: Package, label: 'Product Management', path: '/dashboard/products/manage' },
          { icon: Shield, label: 'TC Services', path: '/dashboard/tc/marketplace' }, 
          { icon: Key, label: 'TC Vault', path: '/dashboard/tc/vault' }, 
          { icon: Settings, label: 'Settings', path: '/dashboard/seller-registration' }
        ];
      case 'BUYER':
        return [...base, { icon: ShoppingCart, label: 'Marketplace', path: '/dashboard/marketplace' }, { icon: FileText, label: 'My Enquiries', path: '/dashboard/my-enquiries' }, { icon: FileSignature, label: 'Contracts', path: '/dashboard/buyer-contracts' }, { icon: Truck, label: 'My Orders', path: '/dashboard/buyer-orders' }, { icon: ClipboardList, label: 'Ledger', path: '/dashboard/payments/ledger' }];
      default:
        return base;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Primary Top Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-20 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex items-center">
            <img src={logoImg} alt="Logo" className="h-10 w-auto" />
          </Link>

          <div className="hidden md:block ml-4">
            <h1 className="text-lg font-semibold text-gray-800">
              {user?.role === 'AGRI_DEPT' && 'Agriculture Department Dashboard'}
              {user?.role === 'ICS_PROVIDER' && 'Sellers Dashboard'}
              {user?.role === 'FPO_FARMER' && 'FPO Dashboard'}
              {user?.role === 'BUYER' && 'Buyer Dashboard'}
            </h1>
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Global Search Bar (Mobile Toggle Icon) */}
          <button className="md:hidden text-gray-400 hover:text-gray-500">
            <Search className="h-6 w-6" />
          </button>

          <button className="relative text-gray-400 hover:text-gray-500 transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-3 border-l border-gray-200 pl-4 relative group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ').toLowerCase()}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-inner cursor-pointer">
              {user?.name?.charAt(0)}
            </div>

            {/* Dropdown for Logout */}
            <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
              <div className="bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-3 h-4 w-4 text-gray-400" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation Header (Desktop) */}
      <div className="hidden md:flex bg-primary px-4 sm:px-6 z-10 shadow-md flex-shrink-0">
        <nav className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide w-full">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={clsx(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                  isActive
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon className={clsx('flex-shrink-0 mr-2 h-4 w-4 transition-colors', isActive ? 'text-white' : 'text-white/70 group-hover:text-white')} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <img src={logoImg} alt="Logo" className="h-8 w-auto" />
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={clsx(
                        'group flex items-center px-2 py-2 text-base font-medium rounded-md',
                        isActive
                          ? 'bg-green-50 text-primary'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                      )}
                    >
                      <Icon className={clsx('mr-4 flex-shrink-0 h-6 w-6', isActive ? 'text-primary' : 'text-gray-400')} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-2 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="mr-4 h-6 w-6 text-gray-400 hover:text-red-500" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
