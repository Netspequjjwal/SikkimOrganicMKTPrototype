import React, { useState } from 'react';
import { Play, X, Sparkles, MapPin, Quote } from 'lucide-react';

interface Story {
  id: string;
  youtubeId: string;
  title: string;
  subtitle: string;
  description: string;
  district: string;
  crop: string;
  farmerName: string;
}

const FARMER_STORIES: Story[] = [
  {
    id: 'story-1',
    youtubeId: 'hAd7EPiL3f0',
    title: '"How Sikkim\'s Organic Revolution Transformed Local Farming"',
    subtitle: 'Journey to 100% Organic State',
    description: 'Discover how traditional growers in Gangtok embraced certified organic farming practices and expanded their reach to national B2B markets.',
    district: 'Gangtok District',
    crop: 'Organic Ginger & Cardamom',
    farmerName: 'Tenzing Bhutia & Co.'
  },
  {
    id: 'story-2',
    youtubeId: '6AKQ0k7PO0s',
    title: '"Sikkim Organic Mission: From Mountain Farms to National Recognition"',
    subtitle: 'Empowering FPOs & Cooperatives',
    description: 'Learn how state-backed certification and digital marketplace access empowered smallholder cooperatives with fair prices and direct buyers.',
    district: 'Namchi District',
    crop: 'Large Cardamom & Turmeric',
    farmerName: 'Namchi Organic Collective'
  },
  {
    id: 'story-3',
    youtubeId: 'qsKyxVty0aU',
    title: '"Stories of Organic Innovation & Sustainable Agriculture"',
    subtitle: 'Sustainable Hill Farming',
    description: 'Witness how bio-inputs, ICS inspection, and cooperative pooling created sustainable livelihoods and premium crop values across Sikkim.',
    district: 'Pakyong District',
    crop: 'Organic Buckwheat & Spices',
    farmerName: 'Pakyong Grower Group'
  },
  {
    id: 'story-4',
    youtubeId: 'KFj3hgxLnTY',
    title: '"Empowering Women Organic Farmers & Local Cooperatives"',
    subtitle: 'Grassroots Impact',
    description: 'Exploring the grassroots impact of Sikkim\'s 100% organic mission on rural farming families and female agricultural entrepreneurs.',
    district: 'Gyalshing District',
    crop: 'Organic Dalle Khursani',
    farmerName: 'Gyalshing Women FPO'
  }
];

const FarmerStories: React.FC = () => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sikkim Organic Voices</span>
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Empowering Thousands of Organic Farmers Across Sikkim
          </h2>
          
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Hear directly from organic growers, cooperatives, and FPOs across Sikkim as they share their journey of organic farming, digital marketplace transformation, and sustainable agriculture.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FARMER_STORIES.map((story) => {
            const thumbnailUrl = `https://img.youtube.com/vi/${story.youtubeId}/hqdefault.jpg`;
            
            return (
              <div 
                key={story.id}
                onClick={() => setActiveVideoId(story.youtubeId)}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1"
              >
                {/* Video Thumbnail Box */}
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <img 
                    src={thumbnailUrl} 
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  
                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-700 transition-all duration-300">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>

                  {/* District & Crop Badge */}
                  <div className="absolute top-3 left-3 bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/20">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{story.district}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                      {story.crop}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                      {story.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <span>Watch Story</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Video Modal Lightbox */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            {/* Close Button */}
            <button 
              onClick={() => setActiveVideoId(null)}
              className="absolute top-4 right-4 z-10 bg-black/70 text-white hover:text-red-400 p-2 rounded-full backdrop-blur-md transition-colors"
              title="Close Video"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video iFrame */}
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1`}
                title="Farmer Story Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FarmerStories;
