import React, { useState, useEffect } from 'react';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_INFO } from '../config/businessInfo';

interface AuthPageProps {
  onNavigate: (tab: string) => void;
  initialTab?: 'phone' | 'email' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, initialTab = 'phone' }) => {
  const { login, register, sendPhoneOtp, verifyPhoneOtp, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'phone' | 'email' | 'register'>(initialTab);

  // Phone OTP State (Amazon style)
  const [phoneNumber, setPhoneNumber] = useState('7548887006');
  const [userName, setUserName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [testOtpNotice, setTestOtpNotice] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState('');

  // Email Login state
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

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // Handle Amazon-style Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPhoneError('');
    setPhoneSuccess('');
    setTestOtpNotice(null);

    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendPhoneOtp(phoneNumber);
      setOtpSent(true);
      setOtpCountdown(60);
      setPhoneSuccess('OTP has been dispatched to your mobile number');
      if (res.testOtp) {
        setTestOtpNotice(res.testOtp);
        setOtpCode(res.testOtp); // Auto-fill for convenience during testing
      }
    } catch (err: any) {
      setPhoneError(err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setPhoneError('Please enter the verification code received');
      return;
    }

    setIsLoading(true);
    try {
      const { isAdmin } = await verifyPhoneOtp(phoneNumber, otpCode, userName);
      if (isAdmin) {
        onNavigate('admin');
      } else {
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setPhoneError(err?.message || 'Invalid or expired OTP. Please check and re-enter.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email / Password Login
  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email or admin username');
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
      setLoginError(err?.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register
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

  // Handle Google / Gmail OAuth Login
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setPhoneError('');
    setLoginError('');
    try {
      const promptEmail = window.prompt(
        'Sign in with Google / Gmail:\nEnter your Gmail address (e.g. admin@fabricprint.in for Admin or your personal Gmail):',
        'customer@gmail.com'
      );
      if (!promptEmail) {
        setIsLoading(false);
        return;
      }

      const { isAdmin } = await loginWithGoogle({
        email: promptEmail,
        name: promptEmail.split('@')[0],
        googleId: `goog-${Date.now()}`
      });

      if (isAdmin) {
        onNavigate('admin');
      } else {
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setPhoneError(err?.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-md w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-black text-lg shadow-md tracking-wider">
            FP
          </div>
          <h2 className="text-2xl font-black font-editorial tracking-tight">
            Fabric Print Secure Access
          </h2>
          <p className="text-xs text-[#8A8883] dark:text-gray-400 max-w-xs mx-auto">
            JWT-Secured Sign In • Phone OTP • Google Auth • Admin Control
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white dark:bg-[#1A1C1A] border border-[#ECECEC] dark:border-white/[0.08] rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Top Tabs */}
          <div className="flex bg-[#F9F6ED] dark:bg-[#242624] rounded-full p-1 border border-[#ECECEC] dark:border-white/[0.08] mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('phone');
                setShowForgotPassword(false);
              }}
              className={`flex-1 py-2 rounded-full transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'phone'
                  ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-sm'
                  : 'text-[#0F100F] dark:text-white hover:opacity-80'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('email');
                setShowForgotPassword(false);
              }}
              className={`flex-1 py-2 rounded-full transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'email'
                  ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-sm'
                  : 'text-[#0F100F] dark:text-white hover:opacity-80'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email / Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setShowForgotPassword(false);
              }}
              className={`flex-1 py-2 rounded-full transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'register'
                  ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-sm'
                  : 'text-[#0F100F] dark:text-white hover:opacity-80'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>

          {/* TAB 1: AMAZON-STYLE PHONE NUMBER + OTP */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              {phoneError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 rounded-2xl text-xs flex items-center space-x-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{phoneError}</span>
                </div>
              )}

              {phoneSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs flex items-center space-x-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{phoneSuccess}</span>
                </div>
              )}

              {testOtpNotice && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 rounded-2xl text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Demo 6-Digit OTP: <strong>{testOtpNotice}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpCode(testOtpNotice)}
                    className="text-[11px] font-bold underline text-amber-900 dark:text-amber-200"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {!otpSent ? (
                // Step 1: Enter Mobile Number
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Mobile Number (Amazon Style)
                    </label>
                    <div className="flex rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-[#FAF8F2] dark:bg-[#252825] focus-within:ring-2 focus-within:ring-[#AC7900]">
                      <span className="inline-flex items-center px-3 text-xs font-bold bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-r border-black/10 dark:border-white/10">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 7548887006"
                        maxLength={15}
                        className="w-full px-3 py-3 text-sm bg-transparent outline-none font-medium"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5 flex items-center space-x-1">
                      <span>💡 Admin Phone:</span>
                      <button
                        type="button"
                        onClick={() => setPhoneNumber('7548887006')}
                        className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                      >
                        7548887006
                      </button>
                      <span>(Click to fill, grants admin)</span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Sending OTP...' : 'Send OTP & Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                // Step 2: Enter 6-Digit OTP
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Sent to: <strong>+91 {phoneNumber}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                      }}
                      className="text-[#AC7900] font-bold hover:underline"
                    >
                      Change Number
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Enter 6-Digit OTP
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="• • • • • •"
                        maxLength={6}
                        className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 px-3 rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F2] dark:bg-[#252825] focus:outline-none focus:ring-2 focus:ring-[#AC7900]"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  {/* Optional Name for new customers */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">
                      Your Name (Optional for first-time login)
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Dinesh Kumar"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-black/10 dark:border-white/10 bg-[#FAF8F2] dark:bg-[#252825] focus:outline-none focus:ring-2 focus:ring-[#AC7900]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Verifying...' : 'Verify OTP & Sign In'}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </button>

                  <div className="text-center pt-1">
                    {otpCountdown > 0 ? (
                      <span className="text-xs text-gray-400">
                        Resend OTP in <strong>{otpCountdown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline inline-flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Resend OTP Code</span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: EMAIL / PASSWORD LOGIN */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 rounded-2xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Email Address or Admin ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@fabricprint.in or customer@domain.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F2] dark:bg-[#252825] text-xs focus:outline-none focus:ring-2 focus:ring-[#AC7900]"
                    required
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F2] dark:bg-[#252825] text-xs focus:outline-none focus:ring-2 focus:ring-[#AC7900]"
                    required
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Quick Fill Admin Credentials helper */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Default Mill Admin Login:</span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@fabricprint.in');
                    setLoginPassword('Admin@FabricPrint2026!');
                  }}
                  className="font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline"
                >
                  Quick Fill Admin
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In with Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: REGISTER NEW USER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 rounded-2xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Dinesh Kumar"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-[#FAF8F2] dark:bg-[#252825] text-xs focus:outline-none focus:ring-2 focus:ring-[#AC7900]"
                    required
                  />
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="7548887006"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-[#FAF8F2] dark:bg-[#252825] text-xs focus:outline-none focus:ring-2 focus:ring-[#AC7900]"
                    required
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="customer@fabricprint.in"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-[#FAF8F2] dark:bg-[#252825] text-xs focus:outline-none focus:ring-2 focus:ring-[#AC7900]"
                    required
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Create Password (min 6 chars)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-[#FAF8F2] dark:bg-[#252825] text-xs focus:outline-none focus:ring-2 focus:ring-[#AC7900]"
                    required
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Customer Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* DIVIDER & SOCIAL SIGN IN (GOOGLE) */}
          <div className="mt-6 pt-5 border-t border-black/10 dark:border-white/10 space-y-3">
            <div className="relative text-center">
              <span className="bg-white dark:bg-[#1A1C1A] px-3 text-[10px] uppercase font-bold tracking-widest text-gray-400">
                Or Continue With
              </span>
            </div>

            {/* Google / Gmail OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-[#252825] text-gray-800 dark:text-white font-bold text-xs flex items-center justify-center space-x-2.5 border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition shadow-xs active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google / Gmail</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
