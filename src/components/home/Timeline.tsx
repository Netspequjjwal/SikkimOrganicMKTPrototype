import React from 'react';
import { UserCheck, Package, Search, MessageSquare, CreditCard, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  badge: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Sellers Onboarding',
    subtitle: 'ICS, Farmers, IFFCO & Grower Groups',
    description: 'ICS Providers, Individual Farmers, IFFCO & Grower Groups register with NPOP/PGS organic certification.',
    icon: UserCheck,
    badge: 'Seller Verification'
  },
  {
    number: '02',
    title: 'Product Listing',
    subtitle: 'Harvest & Yield Details',
    description: 'Sellers list authentic, GI-tagged organic produce with quality parameters, batch numbers, and available stock.',
    icon: Package,
    badge: 'Catalog & Stock'
  },
  {
    number: '03',
    title: 'Buyer Discovery',
    subtitle: 'Search & Source',
    description: 'Domestic & global B2B buyers discover verified organic produce via smart category search and trust profiles.',
    icon: Search,
    badge: 'Smart Sourcing'
  },
  {
    number: '04',
    title: 'Enquiry & Negotiations',
    subtitle: 'RFQ & Digital Contracts',
    description: 'Buyers initiate RFQs, negotiate prices, confirm procurement terms, and generate legally binding digital contracts.',
    icon: MessageSquare,
    badge: 'Price Agreement'
  },
  {
    number: '05',
    title: 'Payment & Fulfillment',
    subtitle: 'Escrow, QC & Logistics',
    description: 'Secure digital payment processing, quality check verification, waybill tracking, and seamless delivery.',
    icon: CreditCard,
    badge: 'Secure Delivery'
  }
];

const Timeline: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End B2B Workflow</span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            How the Marketplace Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            A transparent and seamless 5-step process connecting Sikkim's certified organic sellers directly to verified buyers nationwide.
          </p>
        </div>

        {/* 5-Step Process Flow Grid */}
        <div className="relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.number}
                  className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative"
                >
                  {/* Step Badge & Number Header */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md group-hover:bg-emerald-700 transition-colors">
                        {step.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-3 border border-emerald-100">
                      {step.badge}
                    </span>

                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug mb-1">
                      {step.title}
                    </h3>

                    <p className="text-xs font-semibold text-gray-500 mb-3">
                      {step.subtitle}
                    </p>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Timeline;
