import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useYieldSurvey } from '../../context/YieldSurveyContext';
import { Search, MapPin, Tag, ShoppingCart, Leaf, Clock, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import cardamomImg from '../../assets/cardamom.jpg';
import gingerImg from '../../assets/ginger.jpg';
import turmericImg from '../../assets/turmeric.jpg';
import buckwheatImg from '../../assets/buckwheat.jpg';
import orangesImg from '../../assets/oranges.png';
import dalleKhursaniImg from '../../assets/dallekhursani.png';

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const { surveys } = useYieldSurvey();

  // Aggregate surveys by crop to display unique products
  const products = useMemo(() => {
    const agg: Record<string, any> = {};
    surveys.filter(s => s.status === 'Approved').forEach(s => {
      if (!agg[s.crop]) {
        agg[s.crop] = {
          name: s.crop,
          estimatedYield: 0,
          actualYield: 0,
          hasPhase1: false,
          hasPhase2: false,
          districts: new Set(),
          spCount: new Set()
        };
      }
      if (s.phase.includes('1')) {
        agg[s.crop].estimatedYield += s.totalYield;
        agg[s.crop].hasPhase1 = true;
      }
      if (s.phase.includes('2')) {
        agg[s.crop].actualYield += s.totalYield;
        agg[s.crop].hasPhase2 = true;
      }
      // Assuming mock data districts based on SP names for simplicity
      agg[s.crop].districts.add(s.growerGroups[0].split(' ')[0]);
      agg[s.crop].spCount.add(s.serviceProviderName);
    });
    return Object.values(agg).map(p => ({
      ...p,
      districts: Array.from(p.districts),
      spCount: p.spCount.size
    }));
  }, [surveys]);

  const getCropImage = (name: string) => {
    switch (name.toLowerCase()) {
      case 'large cardamom': return cardamomImg;
      case 'ginger': return gingerImg;
      case 'turmeric': return turmericImg;
      case 'buckwheat': return buckwheatImg;
      case 'oranges': return orangesImg;
      case 'local dalle khursani (dried)': return dalleKhursaniImg;
      default: return cardamomImg;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="flex flex-col mb-8 gap-1.5">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="mr-3 text-gray-400 hover:text-gray-800 transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-primary" /> 
            Premium Organic Produce Marketplace
          </h1>
        </div>
        <p className="text-gray-500 text-sm max-w-2xl sm:ml-10">Source fresh organic crops directly from verified Organic Certified Sellers. Secure your seasonal supply today.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Approved Products Available</h3>
          <p className="text-gray-500 mt-1">Check back later when SOFDA approves new yield surveys.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((p, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group cursor-pointer" onClick={() => navigate(`/dashboard/marketplace/${encodeURIComponent(p.name)}`)}>
              <div className="h-40 bg-gray-200 relative overflow-hidden">
                <img 
                  src={getCropImage(p.name)} 
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {p.hasPhase2 ? (
                    <span className="bg-green-500 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-md flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Open for Sale
                    </span>
                  ) : (
                    <span className="bg-blue-500 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-md flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> Pre-Booking
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm flex items-center w-fit">
                    <Tag className="w-2.5 h-2.5 mr-1" /> GI Certified
                  </span>
                </div>
                <h3 className="absolute bottom-3 left-3 right-3 text-lg font-bold text-white drop-shadow-md leading-tight">{p.name}</h3>
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5 mb-5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 flex items-center"><MapPin className="w-3.5 h-3.5 mr-1"/> Regions</span>
                    <span className="font-medium text-gray-900 text-right truncate max-w-[120px]" title={p.districts.join(', ')}>{p.districts.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Available Qty</span>
                    <span className={clsx("font-bold text-sm", p.hasPhase2 ? "text-green-600" : "text-blue-600")}>
                      {(p.hasPhase2 ? p.actualYield : p.estimatedYield).toFixed(1)} MT
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Suppliers</span>
                    <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-[10px]">{p.spCount} Providers</span>
                  </div>
                </div>
                
                <button className="w-full bg-gray-50 hover:bg-primary hover:text-white text-primary border border-primary/20 hover:border-transparent font-medium py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center group-hover:shadow-md">
                  View <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
