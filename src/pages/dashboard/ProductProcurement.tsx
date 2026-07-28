import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useYieldSurvey } from '../../context/YieldSurveyContext';
import { useNegotiation } from '../../context/NegotiationContext';
import { useActionCenter } from '../../context/ActionCenterContext';
import { useNotification } from '../../context/NotificationContext';
import { useBuyerRegistration } from '../../context/BuyerRegistrationContext';
import toast from 'react-hot-toast';
import { Search, Filter, ShieldCheck, Star, MapPin, Truck, ArrowLeft, ArrowRight, LayoutGrid, List, CheckCircle2, Clock, Info } from 'lucide-react';
import clsx from 'clsx';
import cardamomImg from '../../assets/cardamom.jpg';
import gingerImg from '../../assets/ginger.jpg';
import turmericImg from '../../assets/turmeric.jpg';
import buckwheatImg from '../../assets/buckwheat.jpg';
import orangesImg from '../../assets/oranges.png';
import dalleKhursaniImg from '../../assets/dallekhursani.png';
import sikkimOrganicAliveLogo from '../../assets/sikkim-organic-alive-logo.png';
import simfedLogo from '../../assets/simfed-logo.png';
import concedeLogo from '../../assets/concede-logo.png';

const ProductProcurement: React.FC = () => {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { surveys } = useYieldSurvey();
  const { addEnquiry } = useNegotiation();
  const { logAction } = useActionCenter();
  const { triggerEmail } = useNotification();
  const { status: registrationStatus } = useBuyerRegistration();
  const isApproved = registrationStatus === 'APPROVED';

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedSuppliers, setSelectedSuppliers] = useState<Set<string>>(new Set());
  const [enquiryMode, setEnquiryMode] = useState<'selected' | string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [filters, setFilters] = useState({
    status: new Set(['Ready for Pre-Booking', 'Open for Sale (Harvested)']),
    districts: new Set<string>(),
    sps: new Set<string>(),
    minRating: 0,
    minQty: 0
  });

  // Enquiry Form State
  const [enqForm, setEnqForm] = useState({
    type: 'Pre-Booking' as 'Pre-Booking' | 'Purchase',
    qty: '',
    uom: 'MT',
    date: '',
    notes: ''
  });

  // Derive unique base suppliers for this crop from approved surveys
  const baseSuppliers = useMemo(() => {
    const agg: Record<string, any> = {};
    surveys.filter(s => s.status === 'Approved' && s.crop === cropId).forEach(s => {
      if (!agg[s.serviceProviderName]) {
        agg[s.serviceProviderName] = {
          id: s.serviceProviderName.replace(/\s+/g, '-').toLowerCase(),
          name: s.serviceProviderName,
          estimatedYield: 0,
          actualYield: 0,
          hasPhase1: false,
          hasPhase2: false,
          districts: new Set(),
          rating: (4.5 + Math.random() * 0.5).toFixed(1), // Mock rating
          orders: Math.floor(10 + Math.random() * 90),
          moq: '500 KG',
          responseRate: '98%',
          responseTime: '< 12 Hours'
        };
      }
      if (s.phase.includes('1')) {
        agg[s.serviceProviderName].estimatedYield += s.totalYield;
        agg[s.serviceProviderName].hasPhase1 = true;
      }
      if (s.phase.includes('2')) {
        agg[s.serviceProviderName].actualYield += s.totalYield;
        agg[s.serviceProviderName].hasPhase2 = true;
      }
      agg[s.serviceProviderName].districts.add(s.growerGroups[0].split(' ')[0]);
    });
    return Object.values(agg).map(sp => ({
      ...sp,
      districts: Array.from(sp.districts)
    }));
  }, [surveys, cropId]);

  // Apply Filters
  const suppliers = useMemo(() => {
    return baseSuppliers.filter(sp => {
      if (parseFloat(sp.rating) < filters.minRating) return false;
      const qty = sp.hasPhase2 ? sp.actualYield : sp.estimatedYield;
      if (qty < filters.minQty) return false;
      if (filters.sps.size > 0 && !filters.sps.has(sp.name)) return false;
      if (filters.districts.size > 0 && !sp.districts.some((d: string) => filters.districts.has(d))) return false;
      return true;
    });
  }, [baseSuppliers, filters]);

  const toggleSelection = (spId: string) => {
    const newSet = new Set(selectedSuppliers);
    if (newSet.has(spId)) newSet.delete(spId);
    else newSet.add(spId);
    setSelectedSuppliers(newSet);
  };

  const getStatusBadge = (sp: any) => {
    if (sp.hasPhase2) {
      return <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-md flex items-center border border-green-200"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Open for Sale (Actual)</span>;
    }
    return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md flex items-center border border-blue-200"><Clock className="w-3.5 h-3.5 mr-1" /> Pre-Booking</span>;
  };

  const getCropImage = (name: string) => {
    if (!name) return cardamomImg;
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
    <div className="max-w-7xl mx-auto py-6 relative h-full flex flex-col">
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden mb-8 shadow-sm flex-shrink-0 min-h-[160px] flex items-center">
        <img 
          src={getCropImage(cropId || '')} 
          alt={cropId}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="relative p-6 md:p-10 flex items-center w-full">
          <button onClick={() => navigate('/dashboard/marketplace')} className="text-white/80 hover:text-white mr-6 bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors backdrop-blur-sm flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center w-max">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified Supply
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{cropId}</h1>
            <p className="text-lg text-gray-200 max-w-2xl">Discover and compare certified ICS Providers supplying {cropId}.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 pb-24">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-4 hidden md:block">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Refine Results
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Availability</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" defaultChecked />
                    <span className="text-xs text-slate-700">Pre-Booking Open</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" defaultChecked />
                    <span className="text-xs text-slate-700">Ready for Sale</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Organic Certification</label>
                <div className="mt-2 space-y-2">
                  {['NPOP Certified', 'PGS-India Certified', 'India Organic'].map(cert => (
                    <label key={cert} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                      <span className="text-xs text-slate-700">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Seller Type</label>
                <div className="mt-2 space-y-2">
                  {['ICS Service Provider', 'Grower Group / FPO', 'Individual Farmer', 'IFFCO Partner'].map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                      <span className="text-xs text-slate-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Service Providers</label>
                <div className="mt-2 space-y-2 max-h-36 overflow-y-auto">
                  {baseSuppliers.map(sp => (
                    <label key={sp.id} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" 
                        checked={filters.sps.has(sp.name)} 
                        onChange={(e) => {
                          const newSet = new Set(filters.sps);
                          if (e.target.checked) newSet.add(sp.name);
                          else newSet.delete(sp.name);
                          setFilters({...filters, sps: newSet});
                        }} 
                      /> 
                      <span className="ml-2 text-sm text-gray-700">{sp.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase">Minimum Rating</label>
                <div className="mt-2 space-y-2">
                  {[4, 3].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input type="radio" name="rating" className="border-gray-300 text-primary focus:ring-primary h-4 w-4" 
                        checked={filters.minRating === rating} 
                        onChange={() => setFilters({...filters, minRating: rating})}
                      /> 
                      <span className="ml-2 text-sm text-gray-700 flex items-center">{rating}+ Stars</span>
                    </label>
                  ))}
                  <label className="flex items-center">
                      <input type="radio" name="rating" className="border-gray-300 text-primary focus:ring-primary h-4 w-4" 
                        checked={filters.minRating === 0} 
                        onChange={() => setFilters({...filters, minRating: 0})}
                      /> 
                      <span className="ml-2 text-sm text-gray-700 flex items-center">Any Rating</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Quality Assurance</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" /> <span className="text-xs text-slate-700">NABL Lab Tested</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" /> <span className="text-xs text-slate-700">Scope Certificate Available</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" /> <span className="text-xs text-slate-700">TC Issued</span></label>
                </div>
              </div>
            </div>

            <button className="w-full mt-5 bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-xl text-xs font-extrabold transition-all">Apply Filters</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input type="text" placeholder="Search suppliers..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" />
            </div>

            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setViewMode('grid')} className={clsx("p-1.5 rounded-md transition-colors", viewMode === 'grid' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700")}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('table')} className={clsx("p-1.5 rounded-md transition-colors", viewMode === 'table' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700")}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {suppliers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No Suppliers Found</h3>
              <p className="text-slate-500 text-sm mt-1">There are currently no approved suppliers for {cropId}.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {suppliers.map(sp => {
                // Mock per-supplier produce attributes for richer card display
                const varieties: Record<string, string> = {
                  'Sikkim Organic Alive': 'Ramsey (Bharlang)',
                  'SIMFED': 'Varlang (Premium)',
                  'Concede Service Provider Agency': 'Golsey',
                };
                const grades: Record<string, string> = {
                  'Sikkim Organic Alive': 'Grade A+',
                  'SIMFED': 'Grade A',
                  'Concede Service Provider Agency': 'Grade B+',
                };
                const certCategories: Record<string, string> = {
                  'Sikkim Organic Alive': 'NPOP Certified',
                  'SIMFED': 'NPOP + India Organic',
                  'Concede Service Provider Agency': 'PGS-India Certified',
                };
                const packagingTypes: Record<string, string> = {
                  'Sikkim Organic Alive': 'Gunny Bags (50 KG)',
                  'SIMFED': 'Jute Bags (25 KG)',
                  'Concede Service Provider Agency': 'Bulk (Loose)',
                };
                const labParams: Record<string, string[]> = {
                  'Sikkim Organic Alive': ['Pesticide Residue: ND', 'Moisture: <12%', 'Essential Oil: >3%'],
                  'SIMFED': ['Pesticide Residue: ND', 'Moisture: <11%', 'Curcumin: >5%'],
                  'Concede Service Provider Agency': ['Pesticide Residue: ND', 'Moisture: <13%'],
                };
                const sellerLogos: Record<string, string> = {
                  'Sikkim Organic Alive': sikkimOrganicAliveLogo,
                  'SIMFED': simfedLogo,
                  'Concede Service Provider Agency': concedeLogo,
                };
                const sellerLogo = sellerLogos[sp.name] || null;
                const sellerTypes: Record<string, string> = {
                  'Sikkim Organic Alive': 'ICS',
                  'SIMFED': 'IFFCO',
                  'Concede Service Provider Agency': 'ICS',
                };
                const variety = varieties[sp.name] || 'Standard';
                const grade = grades[sp.name] || 'Grade A';
                const certCategory = certCategories[sp.name] || 'NPOP Certified';
                const packaging = packagingTypes[sp.name] || 'Gunny Bags';
                const labTests = labParams[sp.name] || ['Pesticide Residue: ND', 'Moisture: <12%'];
                const sellerType = sellerTypes[sp.name] || 'ICS';
                const logoSrc = sellerLogo;

                return (
                  <div
                    key={sp.id}
                    className={clsx(
                      'bg-white rounded-2xl border overflow-hidden flex flex-col transition-all cursor-pointer group',
                      selectedSuppliers.has(sp.id)
                        ? 'border-emerald-500 ring-2 ring-emerald-400/40 shadow-lg'
                        : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                    )}
                    onClick={() => toggleSelection(sp.id)}
                  >
                    {/* Card Header: Logo + Seller Name + Status + Select */}
                    <div className="p-4 flex items-start gap-3">
                      {/* Seller Logo */}
                      <div className="w-14 h-14 bg-white rounded-xl border border-slate-200 flex items-center justify-center shrink-0 shadow-xs overflow-hidden p-1">
                        {logoSrc ? (
                          <img
                            src={logoSrc}
                            alt={`${sp.name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Fallback to initials if image fails
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <span className={`${logoSrc ? 'hidden' : ''} text-sm font-extrabold text-emerald-700 bg-emerald-50 w-full h-full flex items-center justify-center rounded-lg`}>
                          {sp.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-extrabold text-slate-900 text-sm leading-tight truncate">{sp.name}</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0" />
                              <span className="text-xs font-bold text-slate-700">{sp.rating}</span>
                              <span className="text-[11px] text-slate-400">({sp.orders} Orders)</span>
                              <span className="text-[9px] font-extrabold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider">{sellerType}</span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedSuppliers.has(sp.id)}
                            readOnly
                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0 mt-0.5"
                          />
                        </div>
                        {/* Availability status pill */}
                        <div className="mt-2">{getStatusBadge(sp)}</div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-4 border-t border-slate-100" />

                    {/* Produce Attributes Grid */}
                    <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Crop Variety</p>
                        <p className="font-bold text-slate-800">{variety}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Grade Classification</p>
                        <p className="font-bold text-emerald-700">{grade}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Certification Category</p>
                        <p className="font-bold text-slate-800">{certCategory}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Packaging</p>
                        <p className="font-bold text-slate-800">{packaging}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Available Stock</p>
                        <p className="font-black text-base text-emerald-700 font-mono">
                          {(sp.hasPhase2 ? sp.actualYield : sp.estimatedYield).toFixed(1)} MT
                        </p>
                      </div>
                    </div>

                    {/* Certification Tags */}
                    <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-2.5 h-2.5" /> SC Verified
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5" /> TC Issued
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5" /> NABL Tested
                      </span>
                    </div>

                    {/* Lab Quality Parameters */}
                    <div className="mx-4 mb-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Lab Tested Quality Parameters
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {labTests.map(param => (
                          <span key={param} className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shadow-xs">
                            {param}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toast.success(`Downloading NABL Lab Test Report for ${sp.name}...`); }}
                        className="mt-2 text-[10px] font-extrabold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1"
                      >
                        <Info className="w-3 h-3" /> View Full Lab Report
                      </button>
                    </div>

                    {/* Action Footer */}
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between mt-auto">
                      <button
                        className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors"
                        onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/supplier/${sp.id}`); }}
                      >
                        View Full Profile →
                      </button>
                      <button
                        className={clsx(
                          'px-4 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all flex items-center gap-1.5',
                          isApproved
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isApproved) setEnquiryMode(sp.id);
                          else navigate('/dashboard/buyer-registration');
                        }}
                      >
                        {isApproved ? 'Send Buying Intent' : 'Register to Send Buying Intent'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left"><input type="checkbox" className="rounded border-gray-300 text-primary" /></th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Available Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {suppliers.map(sp => (
                    <tr key={sp.id} className={clsx("hover:bg-gray-50 cursor-pointer", selectedSuppliers.has(sp.id) && "bg-primary/5")} onClick={() => toggleSelection(sp.id)}>
                      <td className="px-6 py-4"><input type="checkbox" checked={selectedSuppliers.has(sp.id)} readOnly className="rounded border-gray-300 text-primary focus:ring-primary" /></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{sp.name}</div>
                        <div className="text-xs text-gray-500">{sp.districts.join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{(sp.hasPhase2 ? sp.actualYield : sp.estimatedYield).toFixed(1)} MT</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(sp)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center mt-2"><Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" /> {sp.rating}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          className={`px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center justify-end ml-auto ${isApproved ? 'bg-primary hover:bg-primary-dark text-white hover:shadow-md hover:-translate-y-0.5' : 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:-translate-y-0.5'}`} 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (isApproved) {
                              setEnquiryMode(sp.id); 
                            } else {
                              navigate('/dashboard/buyer-registration');
                            }
                          }}
                          title={!isApproved ? "Register to send buying intent" : ""}
                        >
                          {isApproved ? 'Send Buying Intent' : 'Register'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Enquiry Panel */}
      {selectedSuppliers.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 px-6 md:px-10 z-40 flex items-center justify-between animate-slideUp">
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Selected Suppliers</p>
              <p className="text-xl font-bold text-primary">{selectedSuppliers.size}</p>
            </div>
            <div className="hidden sm:block border-l border-gray-300 h-10"></div>
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500 uppercase font-semibold">Max Available Capacity</p>
              <p className="text-xl font-bold text-gray-900">
                {Array.from(selectedSuppliers).reduce((sum, id) => {
                  const sp = suppliers.find(s => s.id === id);
                  return sum + (sp ? (sp.hasPhase2 ? sp.actualYield : sp.estimatedYield) : 0);
                }, 0).toFixed(1)} MT
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center ${isApproved ? 'bg-primary hover:bg-primary-dark text-white hover:shadow-lg hover:-translate-y-0.5' : 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:-translate-y-0.5'}`} 
              onClick={() => { 
                if (isApproved) {
                  setEnquiryMode('selected'); 
                } else {
                  navigate('/dashboard/buyer-registration');
                }
              }}
              title={!isApproved ? "Register to send buying intent" : ""}
            >
              {isApproved 
                ? `Send Buying Intent to ${selectedSuppliers.size} Selected ${selectedSuppliers.size === 1 ? 'Supplier' : 'Suppliers'}` 
                : 'Register to Send Buying Intent'} <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Basic Drawer Implementation for Prototype */}
      {enquiryMode && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/10 transition-opacity animate-fadeIn" onClick={() => setEnquiryMode(null)}></div>
          <div className="fixed inset-y-0 right-0 max-w-xl w-full flex bg-white shadow-2xl flex-col animate-slideLeft">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                {enquiryMode === 'selected' && selectedSuppliers.size > 1 ? 'Broadcast Enquiry (RFQ)' : 'Send Enquiry'}
              </h2>
              <button onClick={() => setEnquiryMode(null)} className="text-gray-400 hover:text-gray-500 text-2xl leading-none">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {enquiryMode === 'selected' && selectedSuppliers.size > 1 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start">
                    <Info className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 font-bold mb-1.5 uppercase tracking-wide">Broadcast Enquiry Mode</p>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        You are initiating a commercial procurement process. Your enquiry will be sent simultaneously to <strong>{selectedSuppliers.size}</strong> selected suppliers for <strong>{cropId}</strong>. You can compare their quotations side-by-side in your dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Direct Enquiry To</p>
                    <p className="text-gray-900 font-bold">{enquiryMode === 'selected' ? Array.from(selectedSuppliers).map(id => suppliers.find(s => s.id === id)?.name).join(', ') : suppliers.find(s => s.id === enquiryMode)?.name}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Procurement Type</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" value={enqForm.type} onChange={e => setEnqForm({ ...enqForm, type: e.target.value as any })}>
                    <option value="Pre-Booking">Pre-Booking</option>
                    <option value="Purchase">Immediate Purchase</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity Required</label>
                    <input type="number" value={enqForm.qty} onChange={e => setEnqForm({ ...enqForm, qty: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" placeholder="e.g. 5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" value={enqForm.uom} onChange={e => setEnqForm({ ...enqForm, uom: e.target.value })}>
                      <option>MT</option>
                      <option>KG</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
                  <input type="date" value={enqForm.date} onChange={e => setEnqForm({ ...enqForm, date: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Buyer Notes & Quality Specifications</label>
                  <textarea rows={4} value={enqForm.notes} onChange={e => setEnqForm({ ...enqForm, notes: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border" placeholder="Specific packaging or certification requirements..."></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <button
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors disabled:opacity-50"
                disabled={!enqForm.qty || !enqForm.date}
                onClick={() => {
                  setIsSending(true);
                  const targetList = enquiryMode === 'selected' ? Array.from(selectedSuppliers) : [enquiryMode as string];

                  targetList.forEach(spId => {
                    const sp = suppliers.find(s => s.id === spId);
                    const newId = addEnquiry({
                      buyerName: user?.name || 'Authorized Buyer',
                      supplierName: sp?.name || spId,
                      product: cropId || 'Organic Produce',
                      quantityRequested: Number(enqForm.qty),
                      uom: enqForm.uom,
                      procurementType: enqForm.type,
                      deliveryDate: enqForm.date,
                      deliveryLocation: 'To Be Decided',
                      priority: 'Normal'
                    }, enqForm.notes);

                    logAction({
                      title: `Enquiry Sent to ${sp?.name || spId}`,
                      description: `Requested ${enqForm.qty} ${enqForm.uom} of ${cropId}`,
                      iconType: 'enquiry',
                      actionUrl: `/dashboard/negotiation/${newId}`
                    });
                  });
                  setTimeout(() => {
                    setIsSending(false);
                    setEnquiryMode(null);
                    
                    const supplierList = targetList.map(spId => suppliers.find(s => s.id === spId)?.name || spId).join(', ');
                    
                    triggerEmail(
                      supplierList, 
                      `New Commercial Enquiry: ${cropId}`,
                      `Dear Supplier,\n\nYou have received a new commercial enquiry for ${cropId}.\n\nProcurement Type: ${enqForm.type}\nQuantity Requested: ${enqForm.qty} ${enqForm.uom}\nDelivery Date: ${enqForm.date}\n\nPlease login to the Sikkim Organic Platform to acknowledge and submit your quotation.\n\nBest Regards,\nGlobal Organic Foods Ltd.`
                    );
                    
                    navigate('/dashboard/my-enquiries');
                  }, 1500); 
                  setSelectedSuppliers(new Set());
                }}
              >
                {isSending ? 'Sending Enquiry...' : (enquiryMode === 'selected' && selectedSuppliers.size > 1 ? 'Submit Broadcast Enquiry' : 'Send Enquiry')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductProcurement;
