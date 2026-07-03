import { Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import logoImg from '../../assets/logo.png';
import { Share2, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const { navigation: navData } = useData();

  return (
    <footer className="bg-[#EBECEE] text-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2 pr-8">
            <div className="flex items-center gap-2 mb-6">
              <img src={logoImg} alt={navData.logoText} className="h-14 w-auto grayscale contrast-125" />
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Empowering Sikkim's organic farmers. We connect authentic organic producers with conscious buyers, driving sustainable agriculture and equitable trade.
            </p>
            <div className="flex space-x-4">
              <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-[#14432A] shadow-sm transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-[#14432A] shadow-sm transition-colors">
                <Mail className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-[#14432A] shadow-sm transition-colors">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {navData.footer.sections.map((section, idx) => (
            <div key={idx} className="col-span-1">
              <h3 className="text-sm font-bold tracking-wider uppercase mb-6 text-gray-900">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link to={link.link} className="text-sm text-gray-600 hover:text-[#14432A] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-1 md:col-span-1">
            <h3 className="text-sm font-bold tracking-wider uppercase mb-6 text-gray-900">
              Newsletter
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Join our list to get the latest updates from Sikkim Organic.
            </p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#14432A] text-sm"
              />
              <button className="w-full bg-[#14432A] hover:bg-[#1A5C38] text-white px-4 py-2.5 rounded-md font-bold text-sm transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>{navData.footer.copyright}</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-gray-800">Support & Help Center</a>
            <a href="#" className="hover:text-gray-800">Process & Verification Docs</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
