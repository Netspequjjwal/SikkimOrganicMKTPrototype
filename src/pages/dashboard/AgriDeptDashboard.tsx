import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Sprout, ShoppingCart, TrendingUp, Briefcase, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 4500 },
  { name: 'Mar', value: 5200 },
  { name: 'Apr', value: 5800 },
  { name: 'May', value: 6500 },
  { name: 'Jun', value: 7200 },
];

const AgriDeptDashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Department Overview</h1>
        <p className="text-sm text-gray-500">Sikkim Organic Digital Ecosystem Analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Registered Farmers', value: '66,241', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Certified Acreage', value: '76,392 ha', icon: Sprout, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Procurement (MT)', value: '12,450', icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'YoY Growth', value: '+14.2%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action / Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/dashboard/sp-approvals')}
          className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-lg mr-4 text-primary group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">Service Provider Approvals</h3>
              <p className="text-sm text-gray-500">Review pending SP applications</p>
            </div>
          </div>
          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">12 Pending</span>
        </button>

        <button 
          onClick={() => navigate('/dashboard/buyer-approvals')}
          className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4 text-blue-600 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">Buyer Approvals</h3>
              <p className="text-sm text-gray-500">Review pending Organic Buyer applications</p>
            </div>
          </div>
          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">24 Pending</span>
        </button>
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Farmer Onboarding Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F855A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2F855A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#2F855A" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Policy Alerts</h2>
          <div className="space-y-4">
            {[
              { title: 'Subsidized Seed Distribution', date: '2 hours ago', type: 'Policy' },
              { title: 'New ICS Certification Standards', date: '1 day ago', type: 'Compliance' },
              { title: 'Direct Benefit Transfer Initiated', date: '3 days ago', type: 'Finance' },
              { title: 'Monsoon Advisory Issued', date: '5 days ago', type: 'Advisory' },
            ].map((alert, i) => (
              <div key={i} className="flex flex-col border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{alert.type}</span>
                <span className="text-sm text-gray-800 font-medium">{alert.title}</span>
                <span className="text-xs text-gray-400 mt-1">{alert.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriDeptDashboard;
