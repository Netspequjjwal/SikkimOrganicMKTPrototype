import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Award, CheckCircle2, Download, TrendingUp, Users, ArrowLeft, Building2, Send } from 'lucide-react';
import bannerImg from '../../assets/banner.png';
import logoSOA from '../../assets/sikkim-organic-alive-logo.png';
import logoSIMFED from '../../assets/simfed-logo.png';
import logoConcede from '../../assets/concede-logo.png';

const SupplierProfile: React.FC = () => {
  const { spId } = useParams();
  const navigate = useNavigate();

  // Mock data for prototype
  const spName = spId?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Service Provider';

  const getSupplierLogo = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('alive')) return logoSOA;
    if (lower.includes('simfed')) return logoSIMFED;
    if (lower.includes('concede')) return logoConcede;
    return null;
  };

  const spLogo = getSupplierLogo(spName);

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="h-48 md:h-56 relative w-full overflow-hidden">
          <img src={bannerImg} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white hover:bg-gray-100 text-gray-900 p-2.5 rounded-full shadow-md transition-colors z-20">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="px-6 md:px-8 pb-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-2xl shadow-xl border-4 border-white flex items-center justify-center flex-shrink-0 relative overflow-hidden -mt-12 md:-mt-16">
            {spLogo ? (
              <img src={spLogo} alt={spName} className="w-full h-full object-contain p-2" />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-12 h-12 md:w-16 md:h-16 text-primary opacity-80" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 border-2 border-white shadow-sm" title="SOFDA Verified">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex-1 pb-2 mt-2 md:mt-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{spName}</h1>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-md border border-green-200 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> SOFDA Verified
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-200">
                Top Rated Supplier
              </span>
            </div>
            <p className="text-gray-600 font-medium text-sm md:text-base">Certified Organic ICS Provider since 2018</p>
          </div>
          
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 pb-2 w-full md:w-auto mt-4 md:mt-0">
            <button className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center hover:-translate-y-0.5 border border-orange-600">
              <Send className="w-4 h-4 mr-2" /> Contact Supplier
            </button>
            <button className="flex-1 sm:flex-none bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 px-8 py-3 rounded-xl font-bold transition-colors shadow-sm text-sm">
              Save Profile
            </button>
          </div>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Organization Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 uppercase tracking-wide text-xs font-semibold">Registered Office</p>
                  <p className="text-gray-900 font-medium">M.G. Marg, Gangtok<br/>East Sikkim, 737101</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 uppercase tracking-wide text-xs font-semibold">Contact Number</p>
                  <p className="text-gray-900 font-medium">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 uppercase tracking-wide text-xs font-semibold">Email Address</p>
                  <p className="text-gray-900 font-medium text-primary hover:underline cursor-pointer">procurement@{spId}.in</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">98%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">&lt; 12h</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-900">124</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">95%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Verified Documents</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-yellow-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Organic Cert. (NPOP)</p>
                    <p className="text-xs text-gray-500">Valid till Mar 2027</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary-dark"><Download className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">SP Trade License</p>
                    <p className="text-xs text-gray-500">Valid till Dec 2026</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary-dark"><Download className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Current Product Inventory</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Regions</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Available Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: 'Large Cardamom', region: 'Mangan, Geyzing', qty: '12.5 MT', status: 'Pre-Booking' },
                    { name: 'Ginger', region: 'Namchi', qty: '8.2 MT', status: 'Open for Sale' },
                    { name: 'Turmeric', region: 'Geyzing', qty: '4.0 MT', status: 'Pre-Booking' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{row.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{row.region}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{row.qty}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center w-max border ${row.status === 'Open for Sale' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">450+ Farmers</h4>
              <p className="text-sm text-gray-500 mt-2">Managing 5 extensive Grower Groups across 3 districts ensuring consistent high-quality supply.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Consistent Supply</h4>
              <p className="text-sm text-gray-500 mt-2">Historical data shows a 12% YoY increase in actual yield delivered vs estimated yield.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierProfile;
