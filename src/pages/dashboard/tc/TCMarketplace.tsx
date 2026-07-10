import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, MapPin, Clock, IndianRupee, Star, Filter, CheckCircle2 } from 'lucide-react';
import { useTC } from '../../../context/TCContext';

export default function TCMarketplace() {
  const { providers } = useTC();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const filteredProviders = providers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter ? p.districts.includes(districtFilter) : true;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-800/50 rounded-full text-blue-200 text-sm font-medium mb-4 backdrop-blur-sm border border-blue-700/50">
            <Shield className="w-4 h-4" />
            Certificate-as-a-Service (CaaS)
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Transaction Certificate Services</h1>
          <p className="text-blue-100 text-lg">
            Connect with verified ICS Providers to obtain legal Transaction Certificates for your organic produce. 
            Ensure your FPO remains compliant and ready for the B2B marketplace.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-800/40 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search ICS Providers by name..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary bg-white shadow-sm"
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
          >
            <option value="">All Districts</option>
            <option value="Gangtok">Gangtok</option>
            <option value="Namchi">Namchi</option>
            <option value="Geyzing">Geyzing</option>
            <option value="Pakyong">Pakyong</option>
            <option value="Mangan">Mangan</option>
            <option value="Soreng">Soreng</option>
          </select>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProviders.map(provider => (
          <div key={provider.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className="p-6 flex gap-6">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm bg-gray-50">
                <img src={provider.logo} alt={provider.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-gray-900 truncate">{provider.name}</h3>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded font-bold text-sm">
                    <Star className="w-3.5 h-3.5 fill-current" /> {provider.rating}
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                  <Shield className="w-3.5 h-3.5 text-primary" /> Certifying Body: {provider.certAuthority}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.badges.map((badge, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-t border-b border-gray-100">
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">Starting Price</div>
                <div className="font-semibold text-gray-900 flex items-center">
                  <IndianRupee className="w-3.5 h-3.5 mr-0.5 text-gray-400" />
                  {provider.startingPrice.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">Processing</div>
                <div className="font-semibold text-gray-900 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {provider.processingTime}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">Regions</div>
                <div className="font-semibold text-gray-900 flex items-center truncate">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {provider.districts.length} Districts
                </div>
              </div>
            </div>

            <div className="p-6 mt-auto">
              <button 
                onClick={() => navigate(`/dashboard/tc/provider/${provider.id}`)}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                View Provider Details
              </button>
            </div>
          </div>
        ))}
        {filteredProviders.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No providers found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
