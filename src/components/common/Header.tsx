import { Link } from 'react-router-dom';
import { Globe, Menu } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../hooks/useData';
import logoImg from '../../assets/logo.png';

const Header: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const { navigation: navData } = useData();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-lg border-b border-gray-200/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImg} alt={navData.logoText} className="h-16 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navData.menu.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="text-gray-600 hover:text-primary transition-colors font-medium text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-gray-500 transition-colors">
              <Globe className="w-4 h-4 mr-1" />
              <select 
                value={language}
                onChange={(e) => toggleLanguage()}
                className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer outline-none text-gray-600 hover:text-primary"
              >
                <option value="en">English</option>
                <option value="ne">नेपाली</option>
              </select>
            </div>
            {navData.actions.map((action, index) => (
              <Link
                key={index}
                to="/login"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  action.primary
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'text-primary bg-green-50 hover:bg-green-100'
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-primary p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
