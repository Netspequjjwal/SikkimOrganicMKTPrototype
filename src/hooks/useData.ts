import { useLanguage } from '../context/LanguageContext';

// English Data
import enNavigation from '../data/en/navigation.json';
import enHome from '../data/en/home.json';
import enProducts from '../data/en/products.json';
import enWhyChooseUs from '../data/en/whyChooseUs.json';
import enVisionMission from '../data/en/visionMission.json';
import enTimeline from '../data/en/timeline.json';
import enTestimonials from '../data/en/testimonials.json';
import enStats from '../data/en/stats.json';
import enBuyers from '../data/en/buyers.json';

// Nepali Data
import neNavigation from '../data/ne/navigation.json';
import neHome from '../data/ne/home.json';
import neProducts from '../data/ne/products.json';
import neWhyChooseUs from '../data/ne/whyChooseUs.json';
import neVisionMission from '../data/ne/visionMission.json';
import neTimeline from '../data/ne/timeline.json';
import neTestimonials from '../data/ne/testimonials.json';
import neStats from '../data/ne/stats.json';
import neBuyers from '../data/ne/buyers.json';

export const useData = () => {
  const { language } = useLanguage();

  if (language === 'ne') {
    return {
      navigation: neNavigation,
      home: neHome,
      products: neProducts,
      whyChooseUs: neWhyChooseUs,
      visionMission: neVisionMission,
      timeline: neTimeline,
      testimonials: neTestimonials,
      stats: neStats,
      buyers: neBuyers,
    };
  }

  return {
    navigation: enNavigation,
    home: enHome,
    products: enProducts,
    whyChooseUs: enWhyChooseUs,
    visionMission: enVisionMission,
    timeline: enTimeline,
    testimonials: enTestimonials,
    stats: enStats,
    buyers: enBuyers,
  };
};
