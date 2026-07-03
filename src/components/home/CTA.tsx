import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useData } from '../../hooks/useData';

const CTA: React.FC = () => {
  const { home: homeData } = useData();

  return (
    <section className="py-24 bg-[#F9FAFB] text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#14432A] mb-6">
          {homeData.ctaSection.title}
        </h2>
        <p className="text-xl text-gray-700 mb-10 leading-relaxed">
          {homeData.ctaSection.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button className="w-full sm:w-auto bg-[#14432A] hover:bg-[#1A5C38] text-white px-8 py-3.5 rounded-md font-bold text-lg transition-colors shadow-lg border border-transparent">
            {homeData.ctaSection.buttonLabel}
          </button>
          <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#14432A] px-8 py-3.5 rounded-md font-bold text-lg transition-colors border border-gray-300 shadow-sm">
            Contact Our Team
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
