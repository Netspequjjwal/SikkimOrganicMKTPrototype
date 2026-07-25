import React from 'react';
import { useData } from '../../hooks/useData';

const Stats: React.FC = () => {
  const { stats: statsData } = useData();

  return (
    <section className="py-5 bg-gradient-to-r from-[#0d3d1f] via-[#14532d] to-[#0d3d1f] text-white border-y border-emerald-700/40 shadow-inner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/15 text-center items-center">
          {statsData.map((stat, index) => (
            <div key={index} className="px-2 py-1 md:py-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-emerald-100/90 font-bold uppercase tracking-wider mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
