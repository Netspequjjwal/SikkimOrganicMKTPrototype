import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import logoImg from '../assets/logo.png';

const DEMO_USERS = [
  { label: 'Agriculture Department', email: 'agridept@sikkim.gov.in', pass: 'Agri@123', role: 'AGRI_DEPT', name: 'Directorate of Agriculture' },
  { label: 'ICS Service Provider', email: 'ics.admin@sikkimorganic.in', pass: 'ICS@123', role: 'ICS_PROVIDER', name: 'Sikkim ICS Admin' },
  { label: 'FPO / Farmer', email: 'farmer001@sikkimorganic.in', pass: 'Farmer@123', role: 'FPO_FARMER', name: 'Karma Bhutia (FPO)' },
  { label: 'Buyer', email: 'buyer@organicmart.com', pass: 'Buyer@123', role: 'BUYER', name: 'Naturals India Procurement' }
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = DEMO_USERS.find(u => u.email === email && u.pass === password);
    if (foundUser) {
      login({
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role as UserRole
      });
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Please use the demo credentials.');
    }
  };

  const handleDemoClick = (user: typeof DEMO_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.pass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <Link to="/" className="absolute -top-12 left-0 flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <img src={logoImg} alt="Sikkim Organic Logo" className="mx-auto h-16 w-auto" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sikkim Organic Digital Ecosystem
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign in
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-4 text-center">Demonstration Login Access</h3>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_USERS.map((user, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDemoClick(user)}
                  className="text-left px-4 py-2 text-xs border border-gray-200 rounded-md hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <span className="font-bold text-gray-700 block">{user.label}</span>
                  <span className="text-gray-500">User: {user.email}</span>
                </button>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
