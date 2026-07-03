import React from 'react';
import { useData } from '../../hooks/useData';

const Stats: React.FC = () => {
  const { stats: statsData } = useData();

  return (
    <section className="py-16 bg-earth text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statsData.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl md:text-5xl font-bold mb-1.5 text-white">
                {stat.value}
              </div>
              <div className="text-white/80 font-medium text-sm md:text-base">
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
