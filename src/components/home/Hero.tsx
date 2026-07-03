import React from 'react';
import { Search } from 'lucide-react';
import { useData } from '../../hooks/useData';
import bannerImg from '../../assets/banner.png';

const Hero: React.FC = () => {
  const { home: homeData } = useData();

  return (
    <section className="relative">
      {/* Background Image with subtle dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <span className="inline-block py-1.5 px-4 rounded-full border border-white/40 bg-white/10 text-white text-xs tracking-wider uppercase font-semibold mb-6 backdrop-blur-sm">
            Government of Sikkim Initiative | Dept. of Agriculture
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-md">
            {homeData.hero.title}
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl drop-shadow-sm">
            {homeData.hero.subtitle}
          </p>
          
          {/* Global Search Bar */}
          <div className="bg-white p-2 rounded-lg shadow-lg flex max-w-2xl mb-10">
            <div className="flex-grow flex items-center px-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder={homeData.hero.searchPlaceholder}
                className="w-full bg-transparent border-none focus:ring-0 outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-md font-bold transition-colors whitespace-nowrap">
              Search
            </button>
          </div>
          
          <div className="flex flex-wrap gap-6 items-center">
            <button className="text-white hover:text-yellow-400 font-semibold text-lg transition-colors flex items-center gap-2 group">
              {homeData.hero.ctaPrimary}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md font-bold text-lg transition-colors shadow-lg">
              {homeData.hero.ctaSecondary}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
