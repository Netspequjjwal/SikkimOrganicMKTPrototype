import React from 'react';
import { useData } from '../../hooks/useData';

const Timeline: React.FC = () => {
  const { timeline: timelineData } = useData();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How the Marketplace Works</h2>
          <p className="text-gray-600 text-lg">
            A transparent and seamless process from the farms of Sikkim to global buyers.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-green-200 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {timelineData.map((step, index) => (
              <div key={index} className="relative text-center bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#1A452E] rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md border-4 border-white">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-4 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
