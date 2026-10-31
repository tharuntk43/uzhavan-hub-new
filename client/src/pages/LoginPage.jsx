import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Leaf,
  Sprout,
  CloudSun,
  TrendingUp,
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  AlertCircle
} from '../components/icons/LucideIcons.jsx';

export default function LoginPage({ onSuccess, onSwitchToRegister }) {
  const { login, demoLogin, language, setLanguage, showToast } = useAuth();
  const isTa = language === 'ta';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password modal
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const ok = await login(identifier, password);
      if (ok) {
        showToast(isTa ? 'வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்!' : 'Logged in successfully!', 'success');
        if (onSuccess) onSuccess();
      } else {
        setError(isTa ? 'தவறான மின்னஞ்சல்/கைபேசி அல்லது கடவுச்சொல்.' : 'Invalid email/phone or password.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (type) => {
    setLoading(true);
    setError('');
    try {
      const ok = await demoLogin(type);
      if (ok) {
        showToast(isTa ? 'மாதிரி விவசாயி கணக்கு திறக்கப்பட்டது!' : 'Demo farmer account active!', 'success');
        if (onSuccess) onSuccess();
      } else {
        setError('Demo login failed.');
      }
    } catch (err) {
      setError('Demo login error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMessage('Please enter your registered email or phone.');
      return;
    }
    setForgotMessage(
      isTa
        ? `${forgotEmail} முகவரிக்கு கடவுச்சொல் மீட்டெடுப்பு இணைப்பு அனுப்பப்பட்டுள்ளது.`
        : `A password reset link has been dispatched to ${forgotEmail}.`
    );
    setTimeout(() => {
      setForgotOpen(false);
      setForgotMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col justify-between font-sans selection:bg-emerald-200">
      
      {/* 1. TOP HEADER (Matching reference image) */}
      <header className="h-20 px-6 sm:px-12 bg-white/95 backdrop-blur-md border-b border-stone-200/80 flex items-center justify-between sticky top-0 z-40">
        {/* Brand Logo & Tamil Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#14532D] flex items-center justify-center text-white shadow-md">
            <Leaf size={24} color="#ffffff" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black text-[#14532D] tracking-tight block leading-tight">
              Uzhavan Hub
            </span>
            <span className="text-xs font-bold text-[#795548] font-tamil block -mt-0.5">
              உழவன் ஹப்
            </span>
          </div>
        </div>

        {/* Center Navigation Links (Matching reference) */}
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#home" className="text-sm font-bold text-[#14532D] border-b-2 border-[#14532D] pb-1">
            Home
          </a>
          <a href="#services" className="text-sm font-semibold text-stone-600 hover:text-[#14532D] transition-colors">
            Services
          </a>
          <a href="#features" className="text-sm font-semibold text-stone-600 hover:text-[#14532D] transition-colors">
            Features
          </a>
          <a href="#about" className="text-sm font-semibold text-stone-600 hover:text-[#14532D] transition-colors">
            About
          </a>
          <a href="#contact" className="text-sm font-semibold text-stone-600 hover:text-[#14532D] transition-colors">
            Contact
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Language Selector Dropdown */}
          <button
            onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
          >
            <Leaf size={14} className="text-[#14532D]" />
            <span>{isTa ? 'English' : 'தமிழ்'}</span>
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hidden sm:inline-flex px-4 py-2 border border-stone-300 hover:border-stone-400 rounded-xl text-xs font-bold text-stone-800 transition-colors"
          >
            Login
          </button>

          <button
            onClick={onSwitchToRegister}
            className="px-5 py-2 bg-[#14532D] hover:bg-[#003b1b] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            Register
          </button>
        </div>
      </header>

      {/* 2. MAIN HERO & LOGIN SECTION */}
      <main className="flex-1 relative flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden">
        
        {/* Background photo & overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 z-0 pointer-events-none"
          style={{ backgroundImage: `url('/login-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F7F0] via-[#F8F7F0]/90 to-transparent z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT HERO COLUMN (Matching reference image) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-sm sm:text-base font-bold text-stone-600 mb-1">
                Welcome <span className="text-[#4D7C0F]">Back</span> to
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-[#14532D] tracking-tight leading-none">
                Uzhavan Hub
              </h1>
              <div className="text-3xl sm:text-5xl font-black text-[#795548] font-tamil mt-1">
                உழவன் ஹப்
              </div>
            </div>

            <p className="text-base sm:text-lg text-stone-700 max-w-lg leading-relaxed font-medium">
              Your trusted partner in smart agriculture and sustainable farming.
            </p>

            {/* 4 Circular Feature Badges (Matching reference image) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 max-w-lg">
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/80 backdrop-blur border border-stone-200/60 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[#E8F2E8] text-[#14532D] flex items-center justify-center mb-2">
                  <Sprout size={24} className="text-[#14532D]" />
                </div>
                <span className="text-xs font-bold text-stone-800 leading-tight">Smart<br />Recommendations</span>
              </div>

              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/80 backdrop-blur border border-stone-200/60 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[#E8F2E8] text-[#14532D] flex items-center justify-center mb-2">
                  <CloudSun size={24} className="text-[#14532D]" />
                </div>
                <span className="text-xs font-bold text-stone-800 leading-tight">Weather<br />Updates</span>
              </div>

              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/80 backdrop-blur border border-stone-200/60 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[#E8F2E8] text-[#14532D] flex items-center justify-center mb-2">
                  <TrendingUp size={24} className="text-[#14532D]" />
                </div>
                <span className="text-xs font-bold text-stone-800 leading-tight">Market<br />Prices</span>
              </div>

              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/80 backdrop-blur border border-stone-200/60 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[#E8F2E8] text-[#14532D] flex items-center justify-center mb-2">
                  <Users size={24} className="text-[#14532D]" />
                </div>
                <span className="text-xs font-bold text-stone-800 leading-tight">Farmer<br />Community</span>
              </div>
            </div>

            {/* Hand-written tagline style */}
            <div className="pt-4 flex items-center gap-2">
              <span className="font-handwriting text-3xl sm:text-4xl text-[#14532D] font-bold tracking-wide">
                Better Farming Together
              </span>
              <Leaf size={24} className="text-emerald-700" />
            </div>
          </div>

          {/* RIGHT LOGIN CARD (Matching reference image) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80 w-full max-w-md">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F2E8] text-[#14532D] flex items-center justify-center shadow-xs">
                  <Leaf size={28} className="text-[#14532D]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                    {isTa ? 'உழவர் உள்நுழைவு' : 'Farmer Login'}
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    {isTa ? 'உங்கள் பண்ணை கணக்கை அணுகவும்' : 'Access your farm dashboard and services'}
                  </p>
                </div>
              </div>

              {/* Error Alert Banner */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form: Supports Email OR 10-Digit Mobile Number, Clean Inputs */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    {isTa ? 'மின்னஞ்சல் அல்லது கைபேசி எண்' : 'Email Address or Mobile Number'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-stone-400">
                      <Mail size={18} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9843012345 or farmer@uzhavan.hub"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#14532D] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    {isTa ? 'கடவுச்சொல்' : 'Password'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-stone-400">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#14532D] focus:border-transparent transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-stone-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#14532D] focus:ring-[#14532D] h-4 w-4"
                    />
                    <span>{isTa ? 'என்னை நினைவில் கொள்' : 'Remember me'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-[#14532D] hover:underline font-bold"
                  >
                    {isTa ? 'கடவுச்சொல் மறந்ததா?' : 'Forgot password?'}
                  </button>
                </div>

                {/* Primary Green Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#14532D] hover:bg-[#003b1b] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <span>{isTa ? 'உள்நுழைகிறது...' : 'Logging in...'}</span>
                  ) : (
                    <>
                      <span>{isTa ? 'உள்நுழைக' : 'Login'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* OR Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                  OR
                </span>
              </div>

              {/* Try Demo Accounts (1-Click) */}
              <div className="p-4 rounded-2xl bg-[#E8F2E8] border border-emerald-200/60 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                  <User size={16} className="text-[#14532D]" />
                  <span>{isTa ? 'மாதிரி விவசாயி கணக்குகள் (1-Click)' : 'Try Demo Accounts'}</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-tight">
                  {isTa ? 'உடனடியாக மாதிரி தரவுகளுடன் தளத்தை பார்வையிடுங்கள்' : 'Explore the platform instantly with verified farmer personas'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleDemoClick('murugan')}
                    className="p-2.5 bg-white hover:bg-emerald-50 rounded-xl text-left border border-emerald-300/80 transition-all flex items-center gap-2 shadow-xs group"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#14532D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      M
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-stone-900 group-hover:text-[#14532D] truncate">Murugan P.</div>
                      <div className="text-[10px] text-stone-500 truncate">Madurai • Cotton</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoClick('anitha')}
                    className="p-2.5 bg-white hover:bg-emerald-50 rounded-xl text-left border border-emerald-300/80 transition-all flex items-center gap-2 shadow-xs group"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#166534] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      A
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-stone-900 group-hover:text-[#14532D] truncate">Anitha R.</div>
                      <div className="text-[10px] text-stone-500 truncate">Thanjavur • Paddy</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Create Account Link */}
              <div className="mt-6 text-center text-xs text-stone-600 font-medium">
                <span>{isTa ? 'புதிய விவசாயியா?' : 'New to Uzhavan Hub?'}</span>{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-[#14532D] font-bold hover:underline ml-1"
                >
                  {isTa ? 'புதிய கணக்கு தொடங்கு' : 'Create New Account'}
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="bg-white border-t border-stone-200/80 py-4 px-6 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl w-full mx-auto">
        <div>© 2026 Uzhavan Hub (உழவன் ஹப்) • AI-Powered Smart Agriculture Platform</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 font-medium">
          <a href="#privacy" className="hover:underline">Privacy Policy</a>
          <a href="#terms" className="hover:underline">Terms of Service</a>
          <a href="#support" className="hover:underline">Farmer Helpline 1800-180-1551</a>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">
              {isTa ? 'கடவுச்சொல் மீட்டெடுப்பு' : 'Reset Password'}
            </h3>
            <p className="text-xs text-stone-600">
              {isTa
                ? 'உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சல் அல்லது கைபேசி எண்ணை உள்ளிடவும்.'
                : 'Enter your registered email address or mobile number to receive a verification OTP.'}
            </p>
            {forgotMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs border border-emerald-200">
                {forgotMessage}
              </div>
            )}
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Enter email or 10-digit mobile"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#14532D] outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
