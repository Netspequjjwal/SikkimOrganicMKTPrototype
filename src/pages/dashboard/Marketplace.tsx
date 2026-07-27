import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductListing } from '../../context/ProductListingContext';
import { Search, ShoppingCart, Leaf, ArrowRight, ShieldCheck, Users, ChevronRight } from 'lucide-react';
import cardamomImg from '../../assets/cardamom.jpg';
import gingerImg from '../../assets/ginger.jpg';
import turmericImg from '../../assets/turmeric.jpg';
import buckwheatImg from '../../assets/buckwheat.jpg';
import orangesImg from '../../assets/oranges.png';
import dalleKhursaniImg from '../../assets/dallekhursani.png';

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const { listings } = useProductListing();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter approved/active listings only
  const approvedListings = useMemo(() => {
    return listings.filter(l =>
      ['PRE_BOOKING_OPEN', 'READY_STOCK', 'PARTIALLY_RESERVED'].includes(l.listingStatus)
    );
  }, [listings]);

  // Group by commodity — each unique commodity becomes one product card
  const productGroups = useMemo(() => {
    const groups: Record<string, {
      commodity: string;
      sellerCount: number;
      totalStock: number;
      uom: string;
      hasPreBooking: boolean;
      hasReadyStock: boolean;
      sellerTypes: Set<string>;
    }> = {};

    approvedListings.forEach(l => {
      if (!groups[l.commodity]) {
        groups[l.commodity] = {
          commodity: l.commodity,
          sellerCount: 0,
          totalStock: 0,
          uom: l.unitOfMeasure,
          hasPreBooking: false,
          hasReadyStock: false,
          sellerTypes: new Set()
        };
      }
      groups[l.commodity].sellerCount += 1;
      groups[l.commodity].totalStock += l.availableQuantity;
      if (l.listingType === 'PRE_BOOKING') groups[l.commodity].hasPreBooking = true;
      if (l.listingType === 'READY_STOCK') groups[l.commodity].hasReadyStock = true;
      groups[l.commodity].sellerTypes.add(l.sellerType || 'ICS');
    });

    return Object.values(groups);
  }, [approvedListings]);

  // Static fallback products (always shown even when context is empty)
  const staticProducts = [
    { commodity: 'Large Cardamom', category: 'Spice', origin: 'Sikkim' },
    { commodity: 'Dzongu Ginger', category: 'Spice', origin: 'North Sikkim' },
    { commodity: 'Lakadong Turmeric', category: 'Spice', origin: 'Sikkim' },
    { commodity: 'Buckwheat', category: 'Grain', origin: 'Sikkim' },
    { commodity: 'Sikkim Mandarin', category: 'Fruit', origin: 'Sikkim' },
    { commodity: 'Dalle Khursani', category: 'Chilli', origin: 'Sikkim' },
  ];

  const getCropImage = (name: string) => {
    switch (name.toLowerCase()) {
      case 'large cardamom': return cardamomImg;
      case 'dzongu ginger':
      case 'ginger': return gingerImg;
      case 'lakadong turmeric':
      case 'turmeric': return turmericImg;
      case 'buckwheat': return buckwheatImg;
      case 'sikkim mandarin':
      case 'oranges': return orangesImg;
      case 'dalle khursani':
      case 'local dalle khursani (dried)': return dalleKhursaniImg;
      default: return cardamomImg;
    }
  };

  // Merge context-derived groups with static fallback list
  const allProducts = useMemo(() => {
    const contextNames = new Set(productGroups.map(p => p.commodity.toLowerCase()));
    const fallbacks = staticProducts
      .filter(s => !contextNames.has(s.commodity.toLowerCase()))
      .map(s => ({
        commodity: s.commodity,
        sellerCount: 0,
        totalStock: 0,
        uom: 'MT',
        hasPreBooking: false,
        hasReadyStock: false,
        sellerTypes: new Set<string>()
      }));
    return [...productGroups, ...fallbacks];
  }, [productGroups]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return allProducts;
    const q = searchQuery.toLowerCase();
    return allProducts.filter(p => p.commodity.toLowerCase().includes(q));
  }, [allProducts, searchQuery]);

  const getSellerTypeLabel = (types: Set<string>) => {
    const arr = Array.from(types);
    if (arr.length === 0) return 'ICS • Individual Farmers • IFFCO';
    return arr.join(' • ');
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 space-y-6">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Sikkim Organic B2B Produce Marketplace
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct B2B sourcing from SC-verified ICS, Grower Groups &amp; IFFCO. Select a product to compare all available suppliers.
              </p>
            </div>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-slate-50"
            />
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
          {['100% NPOP Scope Certificate Verified', 'GI-Tagged Produce', 'APEDA RCMC Certified Suppliers', 'Lab-Tested Quality Assured'].map(badge => (
            <span key={badge} className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" /> {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Section label */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          {filtered.length} Certified Organic Products
        </p>
        <p className="text-[11px] text-slate-400">Click a product to view all available suppliers</p>
      </div>

      {/* Product Grid — one card per commodity */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Leaf className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No products found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => {
            const hasListings = p.sellerCount > 0;
            return (
              <div
                key={p.commodity}
                onClick={() => navigate(`/dashboard/marketplace/${encodeURIComponent(p.commodity)}`)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-0.5"
              >
                {/* Product Image */}
                <div className="h-44 sm:h-48 bg-slate-200 relative overflow-hidden">
                  <img
                    src={getCropImage(p.commodity)}
                    alt={p.commodity}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                  {/* SC Verified badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-700/60">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> SC Verified
                    </span>
                  </div>

                  {/* Live supplier pill */}
                  {hasListings && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-full">
                        {p.sellerCount} {p.sellerCount === 1 ? 'Supplier' : 'Suppliers'} Live
                      </span>
                    </div>
                  )}

                  {/* Commodity name on image */}
                  <h3 className="absolute bottom-3 left-3 right-3 text-lg font-extrabold text-white drop-shadow-md leading-tight">
                    {p.commodity}
                  </h3>
                </div>

                {/* Card Body — clean, no seller-specific data */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    {/* Certification */}
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      NPOP / PGS Organic Certified
                    </div>

                    {/* Availability status pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {p.hasPreBooking && (
                        <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                          Pre-Booking Available
                        </span>
                      )}
                      {p.hasReadyStock && (
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Ready Stock Available
                        </span>
                      )}
                      {!hasListings && (
                        <span className="text-[10px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">
                          Enquiries Open
                        </span>
                      )}
                    </div>

                    {/* Who sells this */}
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-500 pt-1">
                      <Users className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                      <span>
                        Available from <span className="font-bold text-slate-700">ICS Providers, Individual Farmers &amp; IFFCO</span>
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-slate-900 group-hover:bg-emerald-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
                    View All Suppliers <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
