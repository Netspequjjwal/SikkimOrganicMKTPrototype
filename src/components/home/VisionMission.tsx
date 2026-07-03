import React from 'react';
import { Target, Lightbulb } from 'lucide-react';
import { useData } from '../../hooks/useData';

const VisionMission: React.FC = () => {
  const { visionMission: visionMissionData } = useData();

  return (
    <section className="py-24 bg-[#14432A] text-white relative overflow-hidden">
      {/* Background Pattern Shape */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-10 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M50 0C61.0457 0 70 8.95431 70 20C70 27.2415 66.149 33.5852 60.5284 37.071C67.6369 35.8858 74.9224 37.6433 80.522 42.4578C89.1557 49.8805 90.1347 62.8941 82.712 71.5278C77.5859 77.4883 69.8396 80.2078 62.2462 79.4312C65.558 85.1979 64.9926 92.6841 60.1119 97.8091C52.5901 105.707 40.1601 106.027 32.2621 98.5053C26.8924 93.3934 25.1052 85.8037 27.2307 79.1352C19.7828 80.3704 12.1896 77.8925 6.96937 72.2479C-1.07722 63.5463 -0.569424 49.9458 8.13221 41.8992C14.0534 36.4251 22.3789 34.619 29.5695 36.8159C24.1627 32.9693 20.8872 26.6874 20.8872 19.646C20.8872 8.79603 29.6832 0 40.5332 0H50ZM50 20C50 14.4772 45.5228 10 40 10C34.4772 10 30 14.4772 30 20C30 25.5228 34.4772 30 40 30C45.5228 30 50 25.5228 50 20ZM60.5284 37.071C63.2982 41.8845 62.6394 48.0673 58.747 52.193C54.8546 56.3188 48.6508 57.3976 43.6009 54.8393C44.159 49.3361 47.3828 44.4795 52.2747 41.7602C54.8087 40.3512 57.7335 38.9959 60.5284 37.071ZM62.2462 79.4312C57.4334 76.6575 54.4965 71.3713 54.832 65.8643C60.274 65.5173 65.2536 62.4346 68.1009 57.6534C70.9482 52.8722 71.1896 47.1648 68.7437 42.193C72.8687 45.7487 74.4533 51.5222 72.5898 56.7027C70.7262 61.8832 65.7345 65.5392 60.2525 65.7397C61.4237 70.835 63.9535 75.5413 67.5759 79.4312H62.2462ZM27.2307 79.1352C31.5422 76.2413 34.4026 71.4939 34.9084 66.1963C29.6209 65.3421 24.9603 62.0676 22.2531 57.3093C19.5458 52.5511 19.2482 46.8834 21.4326 41.979C17.5188 45.728 16.0357 51.4925 17.7551 56.634C19.4745 61.7756 24.1611 65.4344 29.5695 65.8078C28.2773 70.8126 25.8617 75.4616 22.3789 79.1352H27.2307Z" fill="white"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Vision */}
          <div className="bg-white/5 backdrop-blur-md p-10 md:p-14 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{visionMissionData.vision.title}</h2>
            <p className="text-lg text-white/90 leading-relaxed mb-8 font-light">
              {visionMissionData.vision.description}
            </p>
            <div className="flex items-center text-yellow-400 font-semibold cursor-pointer group-hover:text-yellow-300 transition-colors">
              <Target className="w-5 h-5 mr-2" /> Explore Our Vision
            </div>
          </div>
          
          {/* Mission */}
          <div className="bg-white/5 backdrop-blur-md p-10 md:p-14 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{visionMissionData.mission.title}</h2>
            <p className="text-lg text-white/90 leading-relaxed mb-8 font-light">
              {visionMissionData.mission.description}
            </p>
            <div className="flex items-center text-yellow-400 font-semibold cursor-pointer group-hover:text-yellow-300 transition-colors">
              <Lightbulb className="w-5 h-5 mr-2" /> Explore Our Mission
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
