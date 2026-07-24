import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, FileText, Settings, LogOut, Bell, Menu, X, CheckCircle, BarChart3, Truck, Search, FilePlus, FileCheck, UploadCloud, ClipboardList, ShoppingCart, MessageSquare, FileSignature, Package, ShieldCheck, Shield, Key
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
    
    switch(user?.role) {
      case 'AGRI_DEPT':
        return [...base, { icon: FileCheck, label: 'ICS Registrations', path: '/dashboard/sp-approvals' }, { icon: ShieldCheck, label: 'Buyer Approvals', path: '/dashboard/buyer-approvals' }, { icon: Users, label: 'FPO Registration', path: '/dashboard/agri/fpo-registration' }, { icon: Package, label: 'ICS Product Listing', path: '/dashboard/agri/ics-products' }, { icon: FileText, label: 'FPO Product Listing', path: '/dashboard/agri/fpo-products' }, { icon: BarChart3, label: 'Analytics & Reports', path: '/dashboard/agri/analytics' }];
      case 'ICS_PROVIDER':
        return [...base, { icon: MessageSquare, label: 'Buyer Enquiries', path: '/dashboard/buyer-enquiries' }, { icon: UploadCloud, label: 'Publish Produces', path: '/dashboard/survey' }, { icon: FileSignature, label: 'Contracts', path: '/dashboard/sp-contracts' }, { icon: Package, label: 'Order Fulfilment', path: '/dashboard/sp-orders' }, { icon: ClipboardList, label: 'Ledger', path: '/dashboard/payments/ledger' }, { icon: FilePlus, label: 'Register Organization', path: '/dashboard/sp-registration' }, { icon: ShieldCheck, label: 'TC Requests', path: '/dashboard/tc/requests' }];
      case 'FPO_FARMER':
        return [...base, { icon: FileText, label: 'My Products', path: '#' }, { icon: UploadCloud, label: 'Publish Product', path: '/dashboard/fpo/publish' }, { icon: Shield, label: 'TC Services', path: '/dashboard/tc/marketplace' }, { icon: Key, label: 'TC Vault', path: '/dashboard/tc/vault' }, { icon: BarChart3, label: 'Sales', path: '#' }, { icon: Settings, label: 'Settings', path: '#' }];
      case 'BUYER':
        return [...base, { icon: ShoppingCart, label: 'Marketplace', path: '/dashboard/marketplace' }, { icon: FileText, label: 'My Enquiries', path: '/dashboard/my-enquiries' }, { icon: FileSignature, label: 'Contracts', path: '/dashboard/buyer-contracts' }, { icon: Truck, label: 'My Orders', path: '/dashboard/buyer-orders' }, { icon: ClipboardList, label: 'Ledger', path: '/dashboard/payments/ledger' }];
      default:
        return base;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={clsx(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                    isActive 
                      ? 'bg-green-50 text-primary' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                  )}
                >
                  <Icon className={clsx('flex-shrink-0 -ml-1 mr-3 h-5 w-5', isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary')} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-10 shadow-sm">
          <div className="flex items-center md:hidden">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
            <img src={logoImg} alt="Logo" className="h-8 w-auto ml-4" />
          </div>
          <div className="hidden md:flex items-center">
            <h1 className="text-lg font-semibold text-gray-800">
              {user?.role === 'AGRI_DEPT' && 'Agriculture Department Portal'}
              {user?.role === 'ICS_PROVIDER' && 'ICS Provider Portal'}
              {user?.role === 'FPO_FARMER' && 'FPO & Farmer Portal'}
              {user?.role === 'BUYER' && 'Buyer Portal'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-gray-500 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ').toLowerCase()}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-inner">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
