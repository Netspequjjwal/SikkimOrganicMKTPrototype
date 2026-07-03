import React from 'react';
import { Leaf, ShieldCheck, Handshake, Award } from 'lucide-react';
import { useData } from '../../hooks/useData';

const icons = [Leaf, ShieldCheck, Handshake, Award];

const WhyChooseUs: React.FC = () => {
  const { whyChooseUs: whyChooseUsData } = useData();

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Sikkim Organic?</h2>
          <p className="text-gray-600 text-lg">
            We bridge the gap between authentic organic farmers and conscious buyers globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {whyChooseUsData.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-primary mb-6 shadow-sm hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
