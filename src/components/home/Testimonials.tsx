import React from 'react';
import { useData } from '../../hooks/useData';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const { testimonials: testimonialsData, buyers: buyersData } = useData();

  return (
    <section className="py-20 bg-[#FBF9F6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Voices of Trust</h2>
          <p className="text-gray-600 text-lg">
            Hear from our farmers and international buyers who are part of this ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-2xl p-10 relative shadow-sm hover:shadow-md transition-shadow">
              <Quote className="absolute top-10 right-10 w-8 h-8 text-gray-200" />
              <p className="text-lg md:text-xl text-gray-800 italic mb-8 relative z-10 leading-relaxed pr-12">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=2F855A&color=fff`} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Trusted by global buyers
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {buyersData.map((buyer, index) => (
              <div key={index} className="text-center">
                <div className="font-bold text-xl text-gray-800">{buyer.name}</div>
                <div className="text-xs text-gray-500">{buyer.location} • {buyer.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
