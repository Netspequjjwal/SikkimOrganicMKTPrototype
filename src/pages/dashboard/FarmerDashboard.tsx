import React from 'react';
import { Package, IndianRupee, MessageSquare, TrendingUp, CheckCircle2 } from 'lucide-react';

const FarmerDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-green-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Karma!</h1>
          <p className="text-sm text-gray-600 mt-1 flex items-center">
            <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" /> Profile 100% Complete & Verified
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-green-50 to-transparent pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Listed Products', value: '4', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100' },
          { label: 'Total Earnings (YTD)', value: '₹4.2L', icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Active Enquiries', value: '12', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Avg. Price Premium', value: '+24%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">My Listed Products</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {[
              { name: 'Large Cardamom', qty: '400 kg available', price: '₹950 / kg', status: 'High Demand' },
              { name: 'Organic Ginger', qty: '1200 kg available', price: '₹120 / kg', status: 'Verified' },
            ].map((product, idx) => (
              <li key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.qty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{product.price}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1
                    ${product.status === 'High Demand' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                    {product.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">Add new product &rarr;</a>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Digital Contracts</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {[
              { buyer: 'Naturals India', item: 'Cardamom (200kg)', date: 'June 28, 2026', status: 'Payment Pending' },
              { buyer: 'Eco Foods USA', item: 'Ginger (500kg)', date: 'June 15, 2026', status: 'Completed' },
            ].map((contract, idx) => (
              <li key={idx} className="px-6 py-4 flex flex-col justify-between hover:bg-gray-50 transition-colors">
                <div className="flex justify-between w-full mb-1">
                  <h4 className="text-sm font-bold text-gray-900">{contract.buyer}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                    ${contract.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {contract.status}
                  </span>
                </div>
                <div className="flex justify-between w-full text-sm text-gray-500">
                  <p>{contract.item}</p>
                  <p>{contract.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
