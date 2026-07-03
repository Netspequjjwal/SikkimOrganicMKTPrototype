import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import WhyChooseUs from '../components/home/WhyChooseUs';
import VisionMission from '../components/home/VisionMission';
import Timeline from '../components/home/Timeline';
import Testimonials from '../components/home/Testimonials';
import Stats from '../components/home/Stats';
import CTA from '../components/home/CTA';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedProducts />
      <WhyChooseUs />
      <VisionMission />
      <Timeline />
      <Testimonials />
      <CTA />
    </>
  );
};

export default Home;
