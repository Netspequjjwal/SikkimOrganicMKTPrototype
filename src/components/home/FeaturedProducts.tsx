import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useData } from '../../hooks/useData';

import cardamomImg from '../../assets/cardamom.jpg';
import gingerImg from '../../assets/ginger.jpg';
import turmericImg from '../../assets/turmeric.jpg';
import buckwheatImg from '../../assets/buckwheat.jpg';

const imageMap: Record<string, string> = {
  'cardamom.jpg': cardamomImg,
  'ginger.jpg': gingerImg,
  'turmeric.jpg': turmericImg,
  'buckwheat.jpg': buckwheatImg,
};

const FeaturedProducts: React.FC = () => {
  const { products: productsData, navigation: navData } = useData();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Organic Products</h2>
            <p className="text-gray-600 max-w-2xl text-lg">
              Discover the purest produce from the pristine hills of Sikkim, grown without any chemical fertilizers.
            </p>
          </div>
          <button className="hidden md:flex items-center text-primary font-medium hover:text-primary-dark">
            View all products <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsData.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img 
                  src={imageMap[product.image] || product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary flex items-center shadow-sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Organic
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="mb-6 flex flex-col gap-2">
                  {product.benefits.slice(0, 2).map((benefit, i) => (
                    <div key={i} className="flex items-center text-xs font-semibold text-primary bg-green-50 px-2.5 py-1.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      {benefit}
                    </div>
                  ))}
                </div>
                <button className="w-full border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-md transition-colors text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <button className="inline-flex items-center text-primary font-medium hover:text-primary-dark">
            View all products <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
