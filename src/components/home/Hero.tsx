import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Award, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import organicVideo from '../../assets/Organic_Farming_30s_Video.webm';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[#0e3b1e] text-white py-16 md:py-28 overflow-hidden min-h-[520px] flex items-center">
      
      {/* Background Video Element */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-75 transition-opacity duration-700 pointer-events-none"
      >
        <source src={organicVideo} type="video/webm" />
        <source src="/src/assets/Organic_Farming_30s_Video.webm" type="video/webm" />
        <source src="/src/assets/sikkimorganic.mp4" type="video/mp4" />
        <source src="/src/assets/hero.mp4" type="video/mp4" />
        <source src="/src/assets/banner.mp4" type="video/mp4" />
      </video>

      {/* Lightened Brand Gradient Overlay for high video clarity while maintaining text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#051c0d]/80 via-[#0a2e17]/55 to-transparent z-0 pointer-events-none" />

      {/* Ambient Radial Glow Effect */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-3xl space-y-6 text-left">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md text-emerald-100 text-xs font-semibold uppercase tracking-wider border border-white/20 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Government of Sikkim Initiative | Dept. of Agriculture & Horticulture</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
            India's{' '}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
              100% Organic
            </span>{' '}
            B2B Platform for Certified Produce
          </h1>
          
          {/* Sub-headline */}
          <p className="text-base sm:text-lg md:text-xl text-emerald-50/90 font-normal leading-relaxed max-w-2xl">
            Connect directly with verified organic growers, FPOs, and cooperatives across Sikkim. Source authentic, certified organic produce with complete digital traceability — all in one platform.
          </p>
          
          {/* CTA Button & Feature Chips */}
          <div className="pt-2 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="group bg-white text-[#0e3b1e] hover:bg-emerald-50 font-extrabold px-8 py-3.5 rounded-xl text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                <span>Register now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Feature Chips */}
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-100">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>100% Digital Traceability</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <Award className="w-4 h-4 text-amber-300" />
                <span>NPOP & PGS Certified</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 text-amber-300" />
                <span>Direct Farm Procurement</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
