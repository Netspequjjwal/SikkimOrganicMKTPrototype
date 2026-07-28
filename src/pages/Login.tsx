import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import logoImg from '../assets/logo.png';

const DEMO_USERS = [
  { label: 'Agriculture Department', email: 'agridept@sikkim.gov.in', pass: 'Agri@123', role: 'AGRI_DEPT', name: 'Directorate of Agriculture' },
  { label: 'Seller', email: 'seller.admin@sikkimorganic.in', pass: 'Seller@123', role: 'ICS_PROVIDER', name: 'Sikkim Seller Admin' },
  { label: 'FPO', email: 'fpo001@sikkimorganic.in', pass: 'FPO@123', role: 'FPO_FARMER', name: 'Ongmu Bhutia (FPO)' },
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
    const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === password) ||
      (email.toLowerCase() === 'ics.admin@sikkimorganic.in' ? DEMO_USERS[1] : null) ||
      (email.toLowerCase() === 'farmer001@sikkimorganic.in' ? DEMO_USERS[2] : null);
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Sikkim Organic Logo" className="h-10 w-auto" />
            <span className="font-extrabold text-slate-900 text-base">Sikkim Organic Portal</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left Section: Sign In Form */}
          <div className="bg-white py-8 px-6 sm:px-8 shadow-sm rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900">Sign in to your portal</h2>
                <p className="mt-1 text-xs font-medium text-slate-500">Access your Sikkim Organic Digital Ecosystem account</p>
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl text-center">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">Email address</label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-9 text-xs border-slate-300 rounded-xl py-2.5 px-3 border font-medium text-slate-900 outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-9 text-xs border-slate-300 rounded-xl py-2.5 px-3 border font-medium text-slate-900 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-slate-700 font-medium cursor-pointer">
                      Remember me
                    </label>
                  </div>

                  <div>
                    <a href="#" className="font-bold text-emerald-700 hover:text-emerald-800">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-xs font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section: Demonstration Login Access */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 py-8 px-6 sm:px-8 shadow-sm rounded-2xl text-white flex flex-col justify-between border border-emerald-700/50">
            <div>
              <div className="mb-5 pb-4 border-b border-emerald-700/60">
                <span className="text-[10px] font-extrabold tracking-widest uppercase bg-emerald-700/60 text-emerald-200 px-2.5 py-1 rounded-full border border-emerald-500/40 inline-block mb-2">
                  1-Click Quick Login
                </span>
                <h3 className="text-xl font-black text-white">Demonstration Access</h3>
                <p className="text-xs text-emerald-200/90 mt-1">Select a role below to auto-fill credentials & sign in directly:</p>
              </div>

              <div className="space-y-2.5">
                {DEMO_USERS.map((user, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDemoClick(user)}
                    className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-white text-xs block group-hover:text-emerald-200 transition-colors">{user.label}</span>
                      <span className="text-[11px] text-emerald-200/80 font-mono block mt-0.5">{user.email}</span>
                    </div>
                    <span className="text-[11px] font-extrabold text-white bg-white/15 group-hover:bg-white text-white group-hover:text-emerald-900 px-2.5 py-1 rounded-lg transition-colors shrink-0">
                      Auto-fill →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-700/60 text-[11px] text-emerald-300 text-center">
              Tip: Click any role above to automatically populate the email and password fields.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
