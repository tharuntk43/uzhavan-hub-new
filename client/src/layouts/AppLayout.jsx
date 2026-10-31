import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Home,
  Sprout,
  Stethoscope,
  CloudSun,
  TrendingUp,
  Award,
  DollarSign,
  Users,
  Tractor,
  HeartPulse,
  CalendarCheck,
  Settings,
  Volume2,
  VolumeX,
  LogOut,
  MapPin,
  Menu,
  X,
  Bell
} from '../components/icons/LucideIcons.jsx';

export default function AppLayout({ currentTab, setCurrentTab, children, onOpenAddPlot }) {
  const { user, plots, activePlot, language, setLanguage, logout, showToast } = useAuth();
  const isTa = language === 'ta';
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || 'Madurai');

  // Audio Guidance Function using Web Speech API
  const toggleAudioGuide = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Audio guidance requires browser speech synthesis support.', 'info');
      return;
    }

    if (isAudioPlaying) {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
      showToast('Audio guidance paused.', 'info');
    } else {
      const text = isTa
        ? `வணக்கம் ${user?.full_name || 'முருகன்'}! உழவன் ஹப் உங்களை வரவேற்கிறது. உங்கள் மதுரை மாவட்ட நிலத்திற்கு பருத்தி மற்றும் உளுந்து பரிந்துரைக்கப்படுகிறது. நாளைய கனமழை எச்சரிக்கையை கவனிக்கவும்.`
        : `Welcome to Uzhavan Hub, ${user?.full_name || 'Murugan P.'}! For your farm in Madurai, Cotton and Black Gram are top recommended crops. Heavy rain alert in your district tomorrow.`;

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = isTa ? 'ta-IN' : 'en-IN';
      utter.rate = 0.95;
      utter.onend = () => setIsAudioPlaying(false);
      utter.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utter);
      setIsAudioPlaying(true);
      showToast(isTa ? 'குரல் வழிகாட்டுதல் ஒலிக்கிறது...' : 'Playing voice guidance...', 'info');
    }
  };

  // 11 Core Navigation Links matching Image 2 sidebar
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', labelTa: 'முகப்பு', Icon: Home },
    { id: 'crop_planning', label: 'Crop Planning', labelTa: 'பயிர் திட்டம்', Icon: Sprout },
    { id: 'crop_doctor', label: 'AI Crop Doctor', labelTa: 'நோய் கண்டறிதல்', Icon: Stethoscope },
    { id: 'weather', label: 'Weather & Alerts', labelTa: 'வானிலை', Icon: CloudSun },
    { id: 'market_prices', label: 'Market Prices', labelTa: 'மார்க்கெட் விலை', Icon: TrendingUp },
    { id: 'government_schemes', label: 'Schemes & Insurance', labelTa: 'அரசு திட்டங்கள்', Icon: Award },
    { id: 'farm_finance', label: 'Farm Finance', labelTa: 'நிதி உதவி', Icon: DollarSign },
    { id: 'community', label: 'Community', labelTa: 'விவசாயிகள் குழு', Icon: Users },
    { id: 'equipment_sharing', label: 'Equipment Sharing', labelTa: 'உபகரணங்கள்', Icon: Tractor },
    { id: 'livestock', label: 'Livestock & Allied', labelTa: 'கால்நடை பராமரிப்பு', Icon: HeartPulse },
    { id: 'farm_management', label: 'Farm Management', labelTa: 'பண்ணை மேலாண்மை', Icon: CalendarCheck }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully.', 'info');
      setCurrentTab('login');
    } catch (e) {
      setCurrentTab('login');
    }
  };

  return (
    <div className="bg-[#F8F7F0] min-h-screen text-[#0e1f15] font-sans antialiased flex flex-row selection:bg-emerald-200">
      
      {/* 1. LEFT SIDEBAR: Dark Forest Green (#14532D) */}
      <aside className={`w-64 bg-[#14532D] text-white flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-50 transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 shadow-2xl lg:shadow-none`}>
        
        {/* Top Brand Logo */}
        <div>
          <div className="p-5 border-b border-emerald-800/60 flex items-center justify-between">
            <div 
              onClick={() => { setCurrentTab('dashboard'); setMobileSidebarOpen(false); }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white border border-white/20 shadow-xs group-hover:scale-105 transition-transform">
                <Sprout size={22} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight block leading-tight">
                  Uzhavan Hub
                </span>
                <span className="text-xs font-bold text-emerald-200 font-tamil block -mt-0.5">
                  உழவன் ஹப்
                </span>
              </div>
            </div>
            {/* Mobile close button */}
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 space-y-1 text-xs font-medium">
            {navItems.map((item) => {
              const IconC = item.Icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                    isActive
                      ? 'bg-[#1E6B3E] text-white font-bold shadow-xs'
                      : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'
                  }`}
                >
                  <IconC size={18} className={isActive ? 'text-white' : 'text-emerald-300'} />
                  <div className="leading-tight text-sm font-semibold truncate">
                    {isTa ? item.labelTa : item.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Tagline & Scenery */}
        <div className="p-4 border-t border-emerald-800/60 bg-gradient-to-t from-emerald-950 to-transparent">
          <div className="flex items-center gap-2 text-emerald-200 text-xs">
            <span className="font-handwriting text-lg text-emerald-100">Better Farming Together</span>
          </div>
          <div className="text-[10px] text-emerald-300/70 mt-1">
            Uzhavan Hub v2.0 • Tamil Nadu
          </div>
        </div>

      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* 2. MAIN RIGHT WORKSPACE */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* TOP NAVIGATION BAR */}
        <header className="h-16 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30 flex items-center justify-between shadow-xs">
          
          {/* Left: Mobile Menu & Location Pill */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Current Farm Location Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100/90 border border-stone-200 text-xs font-bold text-stone-800">
              <MapPin size={15} className="text-[#14532D]" />
              <span>{selectedDistrict}, Tamil Nadu</span>
              <button 
                onClick={() => setLocationModalOpen(true)}
                className="ml-1 text-[11px] font-bold text-[#14532D] hover:underline bg-white px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs"
              >
                {isTa ? 'மாற்ற' : 'Change Location'}
              </button>
            </div>
          </div>

          {/* Right: Language, Audio Guide, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  language === 'en' ? 'bg-[#14532D] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 rounded-lg transition-all font-tamil ${
                  language === 'ta' ? 'bg-[#14532D] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Audio Voice Guide Button */}
            <button
              onClick={toggleAudioGuide}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isAudioPlaying 
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
                  : 'bg-emerald-50 text-[#14532D] border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {isAudioPlaying ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span className="hidden md:inline">
                {isAudioPlaying ? (isTa ? 'நிறுத்து' : 'Pause') : (isTa ? 'குரல் வழிகாட்டி' : 'Voice Guide')}
              </span>
            </button>

            {/* Notifications Bell with 2 Badge */}
            <div className="relative">
              <button 
                onClick={() => showToast(isTa ? 'வானிலை எச்சரிக்கை: நாளைய கனமழை' : 'Weather Alert: Heavy rain tomorrow in Madurai', 'info')}
                className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors relative"
              >
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                  2
                </span>
              </button>
            </div>

            {/* Farmer Profile Pill with Photo & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div 
                onClick={() => setCurrentTab('farm_management')}
                className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-stone-100/90 border border-stone-200 hover:bg-stone-200/80 transition-colors cursor-pointer"
              >
                <img 
                  src="/farmer-avatar.jpg" 
                  alt="Murugan P." 
                  className="w-7 h-7 rounded-full object-cover border border-[#14532D]"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="text-left leading-tight hidden sm:block">
                  <div className="text-xs font-black text-stone-900">{user?.full_name || 'Murugan P.'}</div>
                  <div className="text-[10px] text-stone-500 font-medium">{selectedDistrict} ▾</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>

          </div>

        </header>

        {/* Location Change Modal */}
        {locationModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-stone-900 text-sm">
                  {isTa ? 'பண்ணை மாவட்டத்தை மாற்றவும்' : 'Change Farmland District'}
                </h3>
                <button onClick={() => setLocationModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                  <X size={18} />
                </button>
              </div>
              <div className="py-4 space-y-3">
                <label className="text-xs font-semibold text-stone-600">Select Tamil Nadu District:</label>
                <select 
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-[#14532D] outline-none"
                >
                  {['Madurai', 'Coimbatore', 'Thanjavur', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Erode', 'Dindigul', 'Cuddalore', 'Vellore', 'Theni', 'Virudhunagar'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setLocationModalOpen(false);
                    showToast(isTa ? `மாவட்டம் ${selectedDistrict} என மாற்றப்பட்டது` : `Location updated to ${selectedDistrict}`, 'success');
                  }}
                  className="w-full py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-sm mt-2"
                >
                  {isTa ? 'சேமிக்கவும்' : 'Confirm Location'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
