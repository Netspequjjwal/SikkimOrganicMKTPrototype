import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Building2, 
  UserCheck, 
  Package, 
  Award, 
  AlertCircle, 
  Megaphone, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Filter,
  IndianRupee,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// Chart Data
const cropPerformanceData = [
  { crop: 'Large Cardamom', volumeMT: 1850, revenueLakhs: 1570, status: 'Top Performer' },
  { crop: 'Organic Ginger', volumeMT: 4200, revenueLakhs: 580, status: 'Top Performer' },
  { crop: 'Dalle Khursani', volumeMT: 850, revenueLakhs: 380, status: 'Top Performer' },
  { crop: 'Organic Turmeric', volumeMT: 1400, revenueLakhs: 252, status: 'Stable Trade' },
  { crop: 'Organic Buckwheat', volumeMT: 350, revenueLakhs: 87, status: 'Needs Promotion' },
  { crop: 'Mandarin Oranges', volumeMT: 520, revenueLakhs: 130, status: 'Needs Promotion' },
];

const districtTradeData = [
  { name: 'East Sikkim (Gangtok)', value: 38, color: '#047857' },
  { name: 'Pakyong Cluster', value: 22, color: '#10B981' },
  { name: 'West Sikkim (Gyalshing)', value: 18, color: '#3B82F6' },
  { name: 'North Sikkim (Mangan)', value: 14, color: '#8B5CF6' },
  { name: 'South Sikkim (Namchi)', value: 8, color: '#F59E0B' },
];

const topSellers = [
  { rank: 1, name: 'SIMFED (Sikkim State Co-op)', type: 'Apex State Co-op', volumeSold: '4,250 MT', revenue: '₹5.95 Cr', rating: '4.9 ★', badge: 'Top Exporter', badgeBg: 'bg-emerald-100 text-emerald-800' },
  { rank: 2, name: 'Sikkim Organic Alive', type: 'ICS Provider / SP', volumeSold: '3,180 MT', revenue: '₹4.20 Cr', rating: '4.8 ★', badge: 'Fastest Fulfilment', badgeBg: 'bg-blue-100 text-blue-800' },
  { rank: 3, name: 'Mangan Farmer Producer Co.', type: 'FPO Federation', volumeSold: '1,850 MT', revenue: '₹2.45 Cr', rating: '4.7 ★', badge: 'High Curcumin Specialist', badgeBg: 'bg-purple-100 text-purple-800' },
  { rank: 4, name: 'Gyalshing Organic Growers FPO', type: 'FPO Federation', volumeSold: '1,200 MT', revenue: '₹1.80 Cr', rating: '4.8 ★', badge: 'Dalle Spice Leader', badgeBg: 'bg-amber-100 text-amber-800' },
  { rank: 5, name: 'Pakyong Organic FPO Federation', type: 'FPO Federation', volumeSold: '890 MT', revenue: '₹1.15 Cr', rating: '4.6 ★', badge: 'Buckwheat Hub', badgeBg: 'bg-teal-100 text-teal-800' },
];

const topBuyers = [
  { rank: 1, name: 'Global Organic Foods Ltd.', category: 'Institutional Exporter', volumeBought: '2,850 MT', spend: '₹3.90 Cr', contracts: 14, status: 'Active Bulk Buyer' },
  { rank: 2, name: 'Naturals India Procurement', category: 'Wholesale Processor', volumeBought: '2,100 MT', spend: '₹2.85 Cr', contracts: 11, status: 'Active Bulk Buyer' },
  { rank: 3, name: 'Apex Agro Exports', category: 'International Trader', volumeBought: '1,650 MT', spend: '₹2.30 Cr', contracts: 8, status: 'High Pre-Booking' },
  { rank: 4, name: 'Himalayan Flavours Pvt Ltd', category: 'Spice Manufacturer', volumeBought: '980 MT', spend: '₹1.45 Cr', contracts: 6, status: 'Active Buyer' },
  { rank: 5, name: 'Nature Basket Retail Chain', category: 'Retail Chain', volumeBought: '620 MT', spend: '₹0.95 Cr', contracts: 4, status: 'Growing Buyer' },
];

const AnalyticsReports: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState('Q1 FY 2025-26 (Apr - Jun)');
  const [reportFormat, setReportFormat] = useState('PDF Executive Report');
  const [promotedCrops, setPromotedCrops] = useState<Set<string>>(new Set());

  const handleDownloadReport = () => {
    toast.success(`Generating ${reportFormat} for ${reportPeriod}...`, { icon: '📄', duration: 3000 });
    setTimeout(() => {
      const element = document.createElement('a');
      const file = new Blob([
        `SIKKIM ORGANIC TRADE ANALYTICAL REPORT\nPeriod: ${reportPeriod}\nFormat: ${reportFormat}\nGenerated: ${new Date().toLocaleString()}\n\nSUMMARY:\nTotal Produce Sold: 9,270 MT\nTotal Trade Revenue: ₹16.47 Crores\nActive Buyer Organizations: 42\nApproved Seller Entities: 28\nAPEDA/NPOP TCs Verified: 154\n`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Sikkim_Organic_Trade_Report_${reportPeriod.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  const togglePromotion = (cropName: string) => {
    setPromotedCrops(prev => {
      const next = new Set(prev);
      if (next.has(cropName)) {
        next.delete(cropName);
        toast.error(`Removed marketing promotion flag for ${cropName}`);
      } else {
        next.add(cropName);
        toast.success(`Flagged ${cropName} for State Promotion & Buyer Marketing Campaign!`, { icon: '📢' });
      }
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-800/40">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-700/30 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/30">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-widest uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 inline-block mb-1">
              Department Analytics & Trade Intelligence
            </span>
            <h1 className="text-2xl font-black text-white">Commercial Trade Analytics & Reports</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Comprehensive performance monitoring of sellers, bulk buyers, top crops, underperforming produce, and downloadable periodic trade reports.
            </p>
          </div>
        </div>
      </div>

      {/* REPORT GENERATOR & DOWNLOAD BAR */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center">
            <FileText className="w-4 h-4 text-emerald-700 mr-2" /> Official Periodic Trade Report Downloader
          </h2>
          <span className="text-xs text-slate-500 font-semibold">Ready for Department Audit & Governance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Report Duration / Period</label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Q1 FY 2025-26 (Apr - Jun)">Quarterly: Q1 FY 2025-26 (Apr - Jun)</option>
              <option value="Q4 FY 2024-25 (Jan - Mar)">Quarterly: Q4 FY 2024-25 (Jan - Mar)</option>
              <option value="H1 FY 2025-26 (Apr - Sep)">Half-Yearly: H1 FY 2025-26 (Apr - Sep)</option>
              <option value="H2 FY 2024-25 (Oct - Mar)">Half-Yearly: H2 FY 2024-25 (Oct - Mar)</option>
              <option value="Annual FY 2025-26">Annual / Yearly: FY 2025-26</option>
              <option value="Annual FY 2024-25">Annual / Yearly: FY 2024-25</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Export Format</label>
            <select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="PDF Executive Report">PDF Executive Summary Report</option>
              <option value="Excel Raw Data (.xlsx)">Excel Detailed B2B Trade Ledger (.xlsx)</option>
              <option value="CSV Data Dump">CSV Raw Audit Export (.csv)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleDownloadReport}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" /> Download Periodic Report
            </button>
          </div>
        </div>
      </div>

      {/* TOP PERFORMING SELLERS & BULK BUYERS LEADERBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Performing Sellers Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center">
              <Building2 className="w-4 h-4 text-emerald-700 mr-2" /> Top Performing Sellers & FPOs
            </h3>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">Ranked by Volume</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topSellers.map((seller) => (
              <div key={seller.rank} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    #{seller.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{seller.name}</span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${seller.badgeBg}`}>{seller.badge}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{seller.type} • Rating: {seller.rating}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-slate-900 block text-xs">{seller.volumeSold}</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 block">{seller.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Bulk Buyers Intelligence */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center">
              <UserCheck className="w-4 h-4 text-blue-700 mr-2" /> Active Bulk Buyer Organizations
            </h3>
            <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">Ranked by Spend</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topBuyers.map((buyer) => (
              <div key={buyer.rank} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    #{buyer.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{buyer.name}</span>
                      <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[9px] font-bold px-2 py-0.5 rounded">{buyer.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{buyer.category} • {buyer.contracts} Digital Contracts</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-slate-900 block text-xs">{buyer.volumeBought}</span>
                  <span className="text-[10px] font-extrabold text-blue-700 block">{buyer.spend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PRODUCT PERFORMANCE & MARKETING DEMAND MATRIX */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center">
              <Package className="w-5 h-5 text-emerald-700 mr-2" /> Produce Market Performance & Promotion Advisory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Identifies top market crops vs. crops requiring active department marketing and promotion</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Real-time Market Matrix
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Performing Produce Card */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
              <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center">
                <Sparkles className="w-4 h-4 text-emerald-600 mr-1.5" /> High-Performing Produce (Strong Demand)
              </h4>
              <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded">High Buyer Volume</span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Large Cardamom', vol: '1,850 MT', revenue: '₹15.7 Cr', index: '145% Demand', desc: 'Highest value export crop with heavy pre-booking demand from Middle East traders.' },
                { name: 'Organic Ginger', vol: '4,200 MT', revenue: '₹5.8 Cr', index: '120% Demand', desc: 'High bulk volume demand for fresh wholesale processing & domestic supply.' },
                { name: 'Dalle Khursani Chilli', vol: '850 MT', revenue: '₹3.8 Cr', index: '135% Demand', desc: 'Premium GI-tagged chilli with rapid turnover and high price realization per KG.' },
              ].map((c, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-emerald-100 text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-900">{c.name}</span>
                    <span className="text-emerald-800 font-extrabold">{c.vol} ({c.revenue})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Underperforming Produce Needing Promotion */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
              <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider flex items-center">
                <Megaphone className="w-4 h-4 text-amber-600 mr-1.5" /> Needs Marketing & Promotion (High Potential)
              </h4>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded">Surplus Available</span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Organic Buckwheat', vol: '350 MT', desc: 'High superfood health value; requires institutional buyer campaigns and promotion.' },
                { name: 'Sikkim Mandarin Oranges', vol: '520 MT', desc: 'Peak seasonal harvest approaching; needs buyer pre-booking marketing push.' },
                { name: 'Finger Millet (Kodo)', vol: '280 MT', desc: 'Nutri-cereal surplus in South Sikkim clusters; ideal for bulk retail promotion.' },
              ].map((c, i) => {
                const isPromoted = promotedCrops.has(c.name);
                return (
                  <div key={i} className="bg-white p-3 rounded-lg border border-amber-100 text-xs space-y-2">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-900">{c.name}</span>
                      <span className="text-amber-800 font-bold text-[11px]">Trade Vol: {c.vol}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{c.desc}</p>

                    <button
                      onClick={() => togglePromotion(c.name)}
                      className={`w-full py-1.5 px-3 rounded-lg font-bold text-[11px] transition-colors flex items-center justify-center ${
                        isPromoted 
                          ? 'bg-emerald-800 text-white shadow-xs' 
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                      }`}
                    >
                      <Megaphone className="w-3.5 h-3.5 mr-1.5" />
                      {isPromoted ? '✓ Flagged for State Promotion Campaign' : 'Flag for Department Marketing & Promotion'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* VISUAL CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Commodity Trade Volume Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 lg:col-span-2">
          <h3 className="font-extrabold text-slate-900 text-sm mb-1">Produce Trade Volume Breakdown (MT)</h3>
          <p className="text-xs text-slate-500 mb-4">Total B2B volume sold per crop lot</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="crop" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10}} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10}} dx={-5} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="volumeMT" fill="#047857" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Trade Share Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1">District Trade Share (%)</h3>
            <p className="text-xs text-slate-500 mb-4">Geographic distribution of B2B transactions</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={districtTradeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {districtTradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {districtTradeData.map((d, i) => (
              <div key={i} className="flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="font-semibold text-slate-700">{d.name}</span>
                </div>
                <span className="font-black text-slate-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsReports;
