import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import {
  Sprout,
  Wheat,
  CloudSun,
  CloudRain,
  TrendingUp,
  Award,
  DollarSign,
  Users,
  CalendarCheck,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MapPin,
  Lightbulb,
  MessageSquare
} from '../components/icons/LucideIcons.jsx';

export default function DashboardPage({ onNavigate, onOpenAddPlot }) {
  const { user, plots, activePlot, language, showToast } = useAuth();
  const isTa = language === 'ta';

  const [weather, setWeather] = useState(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [savedCrops, setSavedCrops] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const district = user?.district || 'Madurai';
        const wRes = await api.getWeather(district).catch(() => ({}));
        if (wRes && wRes.weather) setWeather(wRes.weather);
        else if (wRes && wRes.temperature) setWeather(wRes);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    }
    loadDashboardData();
  }, [user]);

  const handleSaveCrop = (cropName) => {
    setSavedCrops(prev => [...prev, cropName]);
    showToast(isTa ? `${cropName} உங்கள் பண்ணை திட்டத்தில் சேர்க்கப்பட்டது!` : `${cropName} added to your farm plan!`, 'success');
  };

  const toggleTask = () => {
    setTaskCompleted(!taskCompleted);
    showToast(
      taskCompleted 
        ? (isTa ? 'பணி நிலுவையில் வைக்கப்பட்டது' : 'Task marked as pending') 
        : (isTa ? 'பணி வெற்றிகரமாக முடிந்தது!' : 'Task marked as completed!'), 
      'info'
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP PANORAMIC HERO BANNER (Image 2 Match) */}
      <div className="relative rounded-3xl overflow-hidden shadow-md bg-[#14532D] text-white p-6 sm:p-8 min-h-[175px] flex items-center justify-between">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none" 
          style={{ backgroundImage: "url('/hero-banner-bg.jpg')" }}
        />
        
        {/* Left Content */}
        <div className="relative z-10 flex-1 max-w-xl">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {isTa ? `வணக்கம், ${user?.full_name || 'முருகன் ப.'}!` : `Vanakkam, ${user?.full_name || 'Murugan P.'}!`}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">
            {isTa ? 'சரியான தகவலுடன் துவங்குகிறது நவீன விவசாயம்.' : 'Smart farming begins with the right information.'}
          </p>
          
          {/* Farmer Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-bold">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center gap-1.5 shadow-2xs">
              <MapPin size={13} className="text-emerald-200" />
              <span>{user?.district || 'Madurai'}, Tamil Nadu</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center gap-1.5 shadow-2xs">
              <CalendarCheck size={13} className="text-emerald-200" />
              <span>{plots?.length || 2} Plots</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center gap-1.5 shadow-2xs">
              <Wheat size={13} className="text-emerald-200" />
              <span>{activePlot?.area_value || '3.50'} {activePlot?.area_unit || 'Acres'}</span>
            </span>
            <button 
              onClick={() => onNavigate('farm_management')}
              className="ml-1 px-4 py-1.5 bg-[#14532D] hover:bg-emerald-800 text-white border border-emerald-400/40 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isTa ? 'என் பண்ணை விவரம்' : 'View My Farm'}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Right: Smiling Farmer with Smartphone Photo from Image 2 */}
        <div className="relative z-10 hidden md:flex items-end justify-center shrink-0 -my-8 -mr-4 pl-4">
          <img 
            src="/farmer-hero.jpg" 
            alt="Farmer Murugan P." 
            className="h-44 lg:h-48 object-cover rounded-2xl shadow-xl border-2 border-white/20"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      </div>

      {/* 2. FOUR COMPACT OPERATIONAL SUMMARY PANELS (Image 2 Match) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Panel A: Current Weather */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {isTa ? 'தற்போதைய வானிலை' : 'Current Weather'}
              </span>
              <CloudSun size={24} className="text-amber-500" />
            </div>
            <div className="text-3xl font-black text-stone-900 my-1.5">
              {weather?.temperature ? `${weather.temperature}°C` : '33°C'}
            </div>
            <div className="text-xs font-semibold text-stone-700">
              {weather?.condition || (isTa ? 'சிறு மேகம்' : 'Partly Cloudy')}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Humidity: {weather?.humidity || '68%'} • Rain: {weather?.rain_chance || '20%'}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('weather')} 
            className="text-xs font-bold text-[#14532D] hover:underline mt-4 flex items-center gap-1 text-left"
          >
            <span>{isTa ? 'முழு முன்னறிவிப்பு' : 'View Forecast'}</span>
            <span>→</span>
          </button>
        </div>

        {/* Panel B: Active Crop */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {isTa ? 'நடப்பு பயிர்' : 'Active Crop'}
              </span>
              <Sprout size={24} className="text-[#14532D]" />
            </div>
            <div className="text-xl font-black text-stone-900 my-1.5">
              {isTa ? 'பருத்தி' : 'Cotton'}
            </div>
            <div className="text-xs font-semibold text-emerald-700">
              {isTa ? 'நாள் 24 • நலமுடன்' : 'Day 24 • Healthy'}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Sowing: Oct 07 • Harv: Jan 15
            </div>
          </div>
          <button 
            onClick={() => onNavigate('crop_planning')} 
            className="text-xs font-bold text-[#14532D] hover:underline mt-4 flex items-center gap-1 text-left"
          >
            <span>{isTa ? 'பயிர் விவரங்கள்' : 'View Details'}</span>
            <span>→</span>
          </button>
        </div>

        {/* Panel C: Upcoming Tasks */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {isTa ? 'வரவிருக்கும் பணி' : 'Upcoming Task'}
              </span>
              <CalendarCheck size={24} className="text-rose-600" />
            </div>
            <div className={`text-base font-black my-1.5 leading-snug ${taskCompleted ? 'line-through text-stone-400' : 'text-stone-900'}`}>
              {isTa ? 'யூரியா உரம் தெளித்தல்' : 'Apply Urea Fertilizer'}
            </div>
            <div className="text-xs font-bold text-amber-700">
              {isTa ? '3 நாட்களில் (Nov 03)' : '( in 3 days )'}
            </div>
            <button 
              onClick={toggleTask} 
              className={`mt-2 px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${
                taskCompleted 
                  ? 'bg-stone-100 text-stone-600 border-stone-300' 
                  : 'bg-emerald-50 hover:bg-emerald-100 text-[#14532D] border-emerald-200'
              }`}
            >
              {taskCompleted ? (isTa ? '✓ முடிந்தது' : '✓ Completed') : (isTa ? 'முடிக்கவும்' : 'Mark Complete')}
            </button>
          </div>
          <button 
            onClick={() => onNavigate('farm_management')} 
            className="text-xs font-bold text-[#14532D] hover:underline mt-4 flex items-center gap-1 text-left"
          >
            <span>{isTa ? 'அனைத்து பணிகள்' : 'View Tasks'}</span>
            <span>→</span>
          </button>
        </div>

        {/* Panel D: Market Price */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {isTa ? 'மார்க்கெட் விலை' : 'Market Price'}
              </span>
              <TrendingUp size={24} className="text-emerald-700" />
            </div>
            <div className="text-2xl font-black text-[#14532D] my-1.5">
              ₹2,450 <span className="text-xs font-bold text-stone-500">/ Qtl</span>
            </div>
            <div className="text-xs font-semibold text-stone-700">
              {isTa ? '(பொன்னி நெல்)' : '(Ponni Paddy)'}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">
              +₹65 (+2.7%) • Bullish Trend
            </div>
          </div>
          <button 
            onClick={() => onNavigate('market_prices')} 
            className="text-xs font-bold text-[#14532D] hover:underline mt-4 flex items-center gap-1 text-left"
          >
            <span>{isTa ? 'சந்தை நிலவரம்' : 'View Market'}</span>
            <span>→</span>
          </button>
        </div>

      </div>

      {/* 3. MIDDLE ROW: Crop Recommendations + 7-Day Forecast + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Crop Recommendations (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sprout size={20} className="text-[#14532D]" />
                <h3 className="font-black text-stone-900 text-sm">
                  {isTa ? 'பயிர் பரிந்துரை' : 'Crop Recommendation'}
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {isTa ? 'உங்கள் இருப்பிடம் சார்ந்தது' : 'Based on your location'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {isTa ? 'மதுரை மாவட்டத்திற்கான நடப்பு பருவ சிறந்த பயிர்கள்:' : 'Best crops for Madurai this season:'}
              </p>
            </div>
            <button 
              onClick={() => onNavigate('crop_planning')} 
              className="text-xs font-bold text-[#14532D] hover:underline"
            >
              {isTa ? 'விரிவான வழிகாட்டி →' : 'Open Engine →'}
            </button>
          </div>

          {/* 3 Interactive Recommendation Cards with Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            
            {/* Crop 1: Paddy */}
            <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden hover:border-emerald-400 transition-all group flex flex-col justify-between">
              <div className="h-24 relative overflow-hidden bg-stone-100">
                <img 
                  src="/paddy-crop.jpg" 
                  alt="Paddy" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-stone-900">{isTa ? 'நெல்' : 'Paddy (நெல்)'}</div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">92% Match</span>
                </div>
                <div className="text-[11px] text-stone-500 leading-tight">
                  {isTa ? 'அதிக மகசூல் & நல்ல சந்தை' : 'High yield & good market'}
                </div>
                <div className="pt-2 flex items-center justify-between gap-1">
                  <button onClick={() => onNavigate('crop_planning')} className="text-[10px] font-bold text-[#14532D] hover:underline">
                    {isTa ? 'விவரம் →' : 'View Details →'}
                  </button>
                  <button 
                    onClick={() => handleSaveCrop('Paddy')} 
                    className="px-2 py-0.5 bg-[#14532D] hover:bg-emerald-800 text-white text-[9px] font-bold rounded shadow-xs cursor-pointer"
                  >
                    + Save
                  </button>
                </div>
              </div>
            </div>

            {/* Crop 2: Black Gram */}
            <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden hover:border-emerald-400 transition-all group flex flex-col justify-between">
              <div className="h-24 relative overflow-hidden bg-stone-100">
                <img 
                  src="/blackgram-crop.jpg" 
                  alt="Black Gram" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-stone-900">{isTa ? 'உளுந்து' : 'Black Gram (உளுந்து)'}</div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">85% Match</span>
                </div>
                <div className="text-[11px] text-stone-500 leading-tight">
                  {isTa ? 'குறைந்த நீர், நல்ல லாபம்' : 'Low water, good profit'}
                </div>
                <div className="pt-2 flex items-center justify-between gap-1">
                  <button onClick={() => onNavigate('crop_planning')} className="text-[10px] font-bold text-[#14532D] hover:underline">
                    {isTa ? 'விவரம் →' : 'View Details →'}
                  </button>
                  <button 
                    onClick={() => handleSaveCrop('Black Gram')} 
                    className="px-2 py-0.5 bg-[#14532D] hover:bg-emerald-800 text-white text-[9px] font-bold rounded shadow-xs cursor-pointer"
                  >
                    + Save
                  </button>
                </div>
              </div>
            </div>

            {/* Crop 3: Groundnut */}
            <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden hover:border-emerald-400 transition-all group flex flex-col justify-between">
              <div className="h-24 relative overflow-hidden bg-stone-100">
                <img 
                  src="/groundnut-crop.jpg" 
                  alt="Groundnut" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-stone-900">{isTa ? 'நிலக்கடலை' : 'Groundnut (நிலக்கடலை)'}</div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">80% Match</span>
                </div>
                <div className="text-[11px] text-stone-500 leading-tight">
                  {isTa ? 'செம்மண்ணுக்கு உகந்தது' : 'Suitable for red soil'}
                </div>
                <div className="pt-2 flex items-center justify-between gap-1">
                  <button onClick={() => onNavigate('crop_planning')} className="text-[10px] font-bold text-[#14532D] hover:underline">
                    {isTa ? 'விவரம் →' : 'View Details →'}
                  </button>
                  <button 
                    onClick={() => handleSaveCrop('Groundnut')} 
                    className="px-2 py-0.5 bg-[#14532D] hover:bg-emerald-800 text-white text-[9px] font-bold rounded shadow-xs cursor-pointer"
                  >
                    + Save
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right: 7-Day Forecast + Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* 7-Day Weather Forecast Strip with Live badge & Rain Warning */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudSun size={18} className="text-amber-500" />
                <h4 className="font-bold text-xs text-stone-900">
                  {isTa ? '7-நாள் வானிலை முன்னறிவிப்பு' : '7-Day Weather Forecast'}
                </h4>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                <span>• Live</span>
              </span>
            </div>

            {/* Daily Forecast Strip */}
            <div className="grid grid-cols-7 gap-1 text-center py-2">
              {[
                { day: 'Today', temp: '33°', rain: false },
                { day: 'Mon', temp: '34°', rain: true },
                { day: 'Tue', temp: '33°', rain: true },
                { day: 'Wed', temp: '32°', rain: true },
                { day: 'Thu', temp: '31°', rain: true },
                { day: 'Fri', temp: '32°', rain: true },
                { day: 'Sat', temp: '33°', rain: true }
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-[10px] text-stone-500 font-medium">{f.day}</span>
                  {f.rain ? (
                    <CloudRain size={16} className="text-sky-600 my-1" />
                  ) : (
                    <CloudSun size={16} className="text-amber-500 my-1" />
                  )}
                  <span className="text-xs font-black text-stone-800">{f.temp}</span>
                </div>
              ))}
            </div>

            {/* Heavy Rain Alert Banner */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-amber-800">{isTa ? 'கனமழை எச்சரிக்கை:' : 'Heavy Rain Alert:'}</span>
                <span className="ml-1 text-[11px] text-amber-700">{isTa ? 'நாளை மதுரை மாவட்டத்தில் கனமழை வாய்ப்பு' : 'in Madurai District tomorrow'}</span>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('weather')} 
              className="text-xs font-bold text-[#14532D] hover:underline text-left mt-2"
            >
              {isTa ? 'முழு வானிலை அறிக்கை →' : 'View Full Forecast →'}
            </button>
          </div>

          {/* Quick Actions 4 Buttons */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
              {isTa ? 'விரைவு சேவைகள்' : 'Quick Actions'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button 
                onClick={() => onNavigate('crop_doctor')} 
                className="p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center gap-2 transition-all text-stone-800 text-left cursor-pointer"
              >
                <Stethoscope size={16} className="text-[#14532D]" />
                <span>{isTa ? 'நோய் கண்டறிதல்' : 'Check Crop Disease'}</span>
              </button>
              <button 
                onClick={() => onNavigate('market_prices')} 
                className="p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center gap-2 transition-all text-stone-800 text-left cursor-pointer"
              >
                <TrendingUp size={16} className="text-[#14532D]" />
                <span>{isTa ? 'சந்தை விலை' : 'View Market Prices'}</span>
              </button>
              <button 
                onClick={() => onNavigate('government_schemes')} 
                className="p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center gap-2 transition-all text-stone-800 text-left cursor-pointer"
              >
                <Award size={16} className="text-[#14532D]" />
                <span>{isTa ? 'அரசு திட்டங்கள்' : 'Explore Schemes'}</span>
              </button>
              <button 
                onClick={() => onNavigate('community')} 
                className="p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center gap-2 transition-all text-stone-800 text-left cursor-pointer"
              >
                <MessageSquare size={16} className="text-[#14532D]" />
                <span>{isTa ? 'உழவர் கேள்வி' : 'Ask Expert'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 4. BOTTOM SECTION: Farm Summary & Farming Tips & Sustainable Banner (Image 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Farm Summary */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span className="flex items-center gap-1.5">
              <TrendingUp size={16} className="text-[#14532D]" />
              <span>{isTa ? 'பண்ணை சுருக்கம்' : 'Your Farm Summary'}</span>
            </span>
          </div>
          <div className="flex items-center gap-4 my-3">
            <img 
              src="/plot-thumb.jpg" 
              alt="Farm Plot" 
              className="w-24 h-16 rounded-xl object-cover border border-stone-200 shrink-0" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="grid grid-cols-3 gap-2 text-center flex-1">
              <div>
                <div className="text-base font-black text-stone-900">3.50</div>
                <div className="text-[10px] text-stone-400">Total Area<br/>(Acres)</div>
              </div>
              <div>
                <div className="text-base font-black text-stone-900">2</div>
                <div className="text-[10px] text-stone-400">Plots</div>
              </div>
              <div>
                <div className="text-base font-black text-emerald-700">₹24,500</div>
                <div className="text-[10px] text-stone-400">Est. Profit<br/>(Next Season)</div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('farm_management')} 
            className="text-xs font-bold text-[#14532D] hover:underline text-left cursor-pointer"
          >
            {isTa ? 'நிலங்களை நிர்வகிக்க →' : 'Manage Plots & Crops →'}
          </button>
        </div>

        {/* Farming Tip */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
            <Lightbulb size={16} className="text-amber-600" />
            <span>{isTa ? 'இன்றைய விவசாய குறிப்பு' : 'Farming Tips'}</span>
          </div>
          <p className="text-xs text-stone-600 my-2 leading-relaxed">
            {isTa 
              ? 'கனமழையின் போது பயிர்களின் வேர் அழுகலைத் தடுக்க வரப்புகளில் முறையான வடிகால் வசதியை உறுதி செய்யவும்.'
              : 'Ensure proper drainage in paddy fields during heavy rains to prevent waterlogging and fungal infection.'}
          </p>
          <button 
            onClick={() => onNavigate('crop_planning')} 
            className="text-xs font-bold text-[#14532D] hover:underline text-left cursor-pointer"
          >
            {isTa ? 'மேலும் படிக்க →' : 'Read More →'}
          </button>
        </div>

        {/* Sustainable Farming Banner */}
        <div className="bg-gradient-to-br from-[#14532D] to-emerald-950 p-5 rounded-3xl text-white shadow-xs flex items-center justify-between overflow-hidden relative">
          <div className="z-10 max-w-[65%]">
            <span className="text-[9px] font-black uppercase text-emerald-300 tracking-wider">Uzhavan Mission</span>
            <h4 className="text-xs sm:text-sm font-black leading-snug mt-0.5">
              Sustainable Farming for a Greener Tomorrow
            </h4>
            <p className="text-[10px] text-emerald-100/80 mt-1 leading-tight">
              100% organic formulations & water conservation.
            </p>
            <div className="text-[11px] text-emerald-300 mt-2 font-handwriting">
              Better Farming Together 🌾
            </div>
          </div>
          <div className="shrink-0 z-10 pl-2">
            <img 
              src="/seedling-thumb.jpg" 
              alt="Seedling" 
              className="w-20 h-16 rounded-xl object-cover border border-emerald-400/30 shadow-xs" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
