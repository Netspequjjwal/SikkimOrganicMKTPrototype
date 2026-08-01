import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRBAC } from '../context/RBACContext';
import { Smartphone, Shield, ArrowLeft, Key, Lock, CheckCircle2, UserCheck, RefreshCw } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithOTP, quickSwitchUser, currentUser } = useRBAC();

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let interval: any;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage('');
    setStep('OTP');
    setTimer(30);
    setSuccessMessage(`OTP sent to +91 ${mobile}. Enter 123456 to verify.`);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginWithOTP(mobile, otp);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handlePresetLogin = (userId: string) => {
    quickSwitchUser(userId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Public Marketplace
          </Link>
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Sikkim Organic Logo" className="h-10 w-auto" />
            <span className="font-extrabold text-slate-900 text-base">Sikkim Organic Portal</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left: Single OTP Login System */}
          <div className="bg-white py-8 px-6 sm:px-8 shadow-sm rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                  Single OTP Authentication & Guest First
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">Mobile OTP Login / Register</h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  New users start instantly as Guest Users. Upgrade to Seller / Buyer after onboarding.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {step === 'MOBILE' ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (India +91)</label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Smartphone className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-9 text-xs border-slate-300 rounded-xl py-3 px-3 border font-mono font-medium text-slate-900 outline-none"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-xs text-xs font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
                  >
                    Send 6-Digit Verification OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Enter 6-Digit OTP</label>
                      <button
                        type="button"
                        onClick={() => setStep('MOBILE')}
                        className="text-[11px] text-emerald-700 hover:underline font-semibold"
                      >
                        Change Mobile ({mobile})
                      </button>
                    </div>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-9 text-sm tracking-widest font-mono border-slate-300 rounded-xl py-3 px-3 border font-bold text-slate-900 outline-none"
                        placeholder="123456"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Demo Test OTP: <strong>123456</strong></p>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {timer > 0 ? `Resend in ${timer}s` : 'Didn\'t receive code?'}
                    </span>
                    {timer === 0 && (
                      <button
                        type="button"
                        onClick={() => { setTimer(30); setSuccessMessage('Resent OTP to +91 ' + mobile); }}
                        className="font-bold text-emerald-700 hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-xs text-xs font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
                  >
                    Verify OTP & Proceed
                  </button>
                </form>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Protected by Sikkim Organic Security Framework with OTP lockout monitoring.</span>
            </div>
          </div>

          {/* Right: Quick Preset Role Switcher for Evaluation */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 py-8 px-6 sm:px-8 shadow-sm rounded-2xl text-white flex flex-col justify-between border border-emerald-800/40">
            <div>
              <div className="mb-5 pb-4 border-b border-slate-800">
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  Evaluator Quick Presets
                </span>
                <h3 className="text-lg font-bold mt-2 text-white">Instant Multi-Role Test Profiles</h3>
                <p className="text-xs text-slate-400 mt-1">Select any platform role to immediately test dynamic navigation, matrix permissions, and workspaces.</p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => handlePresetLogin('USR-001')}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" /> Super Admin
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">Prem Das Rai • Full RBAC Matrix Console & Audit control</div>
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                </button>

                <button
                  onClick={() => handlePresetLogin('USR-002')}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Dual Role: Seller + Buyer (FPO)
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">Dawa Lepcha • Tests Header Role Switcher & dual workspace</div>
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                </button>

                <button
                  onClick={() => handlePresetLogin('USR-005')}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-400" /> SOFDA Admin
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">Tashi Bhutia • Buyer/Seller approvals, Listing approvals & compliance</div>
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                </button>

                <button
                  onClick={() => handlePresetLogin('USR-006')}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-purple-400" /> Department Admin
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">Dr. Norden Lepcha • Ecosystem Analytics, Reports & FPO stats</div>
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
                </button>

                <button
                  onClick={() => handlePresetLogin('USR-003')}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Support User
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">Sonam Gyatso • CMS, Master Config & Troubleshooting</div>
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                </button>

                <button
                  onClick={() => handlePresetLogin('USR-004')}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Guest User (New Account)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Pema Bhutia • Public Marketplace & Seller Profile Browser</div>
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                </button>
              </div>
            </div>

            <div className="mt-4 text-[10px] text-slate-400 text-center border-t border-slate-800 pt-3">
              Compliant Role-Based Access Control Architecture
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
