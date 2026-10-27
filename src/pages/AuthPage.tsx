import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Phone, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onNavigate: (tab: string) => void;
  initialTab?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, initialTab = 'login' }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email or username');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const { isAdmin } = await login(loginEmail, loginPassword);
      if (isAdmin) {
        onNavigate('admin');
      } else {
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Invalid credentials. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Please enter your full name');
      return;
    }
    if (!regPhone.trim()) {
      setRegError('Please enter your phone number');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Please enter your email address');
      return;
    }
    if (!regPassword.trim() || regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await register(regName, regPhone, regEmail, regPassword);
      onNavigate('dashboard');
    } catch (err: any) {
      setRegError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-black text-lg shadow-md">
            FP
          </div>
          <h2 className="text-2xl font-black font-editorial tracking-tight">
            Fabric Print Portal
          </h2>
          <p className="text-xs text-[#8A8883] dark:text-gray-400 max-w-xs mx-auto">
            Manage custom fabric orders, artwork designs, and wholesale textile quotes
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white dark:bg-[#1A1C1A] border border-[#ECECEC] dark:border-white/[0.08] rounded-[32px] p-6 sm:p-8 shadow-fabriclore relative overflow-hidden">
          
          {/* TWO TABS NAVIGATION */}
          <div className="flex bg-[#F9F6ED] dark:bg-[#242624] rounded-full p-1 border border-[#ECECEC] dark:border-white/[0.08] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setShowForgotPassword(false);
              }}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'login'
                  ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-sm'
                  : 'text-[#0F100F] dark:text-white hover:opacity-80'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setShowForgotPassword(false);
              }}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'register'
                  ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-sm'
                  : 'text-[#0F100F] dark:text-white hover:opacity-80'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && !showForgotPassword && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 rounded-2xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1.5 font-editorial">
                  Email / Username *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A8883] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2.5 pl-10 pr-3 text-xs text-[#0F100F] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#AC7900] transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold font-editorial">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] text-[#AC7900] dark:text-[#D4AF37] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A8883] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2.5 pl-10 pr-3 text-xs text-[#0F100F] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#AC7900] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold py-3 rounded-full transition shadow-md hover:opacity-90 text-xs flex items-center justify-center space-x-2 mt-2"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 rounded-2xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1 font-editorial">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8A8883] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2.5 pl-10 pr-3 text-xs text-[#0F100F] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#AC7900]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 font-editorial">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8A8883] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2.5 pl-10 pr-3 text-xs text-[#0F100F] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#AC7900]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 font-editorial">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A8883] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="aditi@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2.5 pl-10 pr-3 text-xs text-[#0F100F] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#AC7900]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 font-editorial">Password (Min. 6 chars) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A8883] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2.5 pl-10 pr-3 text-xs text-[#0F100F] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#AC7900]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold py-3 rounded-full transition shadow-md hover:opacity-90 text-xs flex items-center justify-center space-x-2 mt-2"
              >
                <span>Create Buyer Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
