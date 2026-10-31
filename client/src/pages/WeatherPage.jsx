import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

const TN_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
  "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
  "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

export default function WeatherPage() {
  const { user } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState(() => user?.profile?.district || 'Thanjavur');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true);
        const res = await api.getWeather(selectedDistrict);
        if (res.success) setWeatherData(res.weather);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [selectedDistrict]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* HEADER & DISTRICT SWITCHER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#c0c9be]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌦️</span>
            <h1 className="text-xl sm:text-2xl font-black text-[#003b1b]">
              Weather and Smart Agricultural Advisories
            </h1>
          </div>
          <p className="text-xs text-[#404941] mt-1">
            வானிலை மற்றும் விவசாய எச்சரிக்கைகள் • 7-day agro-meteorological forecasting calibrated across 38 districts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#404941] uppercase">District:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-xs font-bold text-[#003b1b] focus:outline-none"
          >
            {TN_DISTRICTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {weatherData && (
        <div className="space-y-6">
          
          {/* CURRENT CONDITIONS METRIC ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-[#c0c9be]/50 shadow-xs text-center">
              <span className="text-[10px] uppercase font-bold text-[#404941] block">Temperature</span>
              <div className="text-2xl font-black text-[#003b1b] mt-1">{weatherData.temperature}°C</div>
              <span className="text-[10px] text-[#404941]">{weatherData.tempMin}° / {weatherData.tempMax}°</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-[#c0c9be]/50 shadow-xs text-center">
              <span className="text-[10px] uppercase font-bold text-[#404941] block">Rain Probability</span>
              <div className="text-2xl font-black text-blue-700 mt-1">{weatherData.rainProbability}%</div>
              <span className="text-[10px] text-[#404941]">Precipitation Vector</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-[#c0c9be]/50 shadow-xs text-center">
              <span className="text-[10px] uppercase font-bold text-[#404941] block">Relative Humidity</span>
              <div className="text-2xl font-black text-emerald-800 mt-1">{weatherData.humidity}%</div>
              <span className="text-[10px] text-[#404941]">Canopy Microclimate</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-[#c0c9be]/50 shadow-xs text-center">
              <span className="text-[10px] uppercase font-bold text-[#404941] block">Wind Speed</span>
              <div className="text-2xl font-black text-slate-800 mt-1">{weatherData.windSpeedKm} km/h</div>
              <span className="text-[10px] text-[#404941]">Surface Aeration</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-[#c0c9be]/50 shadow-xs text-center">
              <span className="text-[10px] uppercase font-bold text-[#404941] block">UV Index</span>
              <div className="text-2xl font-black text-amber-700 mt-1">{weatherData.uvIndex}</div>
              <span className="text-[10px] text-[#404941]">Photosynthetic Scale</span>
            </div>
          </div>

          {/* ACTIVE SMART ADVISORIES BANNER */}
          <div className="bg-[#e4f9e8] rounded-3xl p-6 border border-emerald-300 space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="campaign" className="text-[#003b1b] text-[22px]" />
              <h3 className="text-sm font-bold text-[#003b1b] uppercase tracking-wider">
                Smart Agro-Meteorological Advisories ({weatherData.district})
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              {weatherData.activeAdvisories?.map((adv, idx) => (
                <div key={idx} className="p-3 bg-white rounded-2xl border border-emerald-200 flex items-start gap-2 text-[#0e1f15]">
                  <span className="text-[#003b1b] font-bold">🌾</span>
                  <span className="leading-relaxed">{adv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7-DAY EXTENDED FORECAST CARDS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#c0c9be]/50 space-y-4">
            <h3 className="text-sm font-bold text-[#003b1b]">7-Day Extended Agriculture Forecast</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
              {weatherData.forecast7Day?.map((f, i) => (
                <div key={i} className="p-3 bg-[#f8f7f0] rounded-2xl border border-[#c0c9be]/40 text-center space-y-1.5">
                  <div className="text-xs font-bold text-[#003b1b]">{f.day}</div>
                  <div className="text-[10px] text-[#404941]">{f.date}</div>
                  <div className="text-2xl py-1">
                    {f.icon === 'rain' ? '🌧️' : f.icon === 'thunder' ? '⛈️' : f.icon === 'sunny' ? '☀️' : '⛅'}
                  </div>
                  <div className="text-xs font-bold text-[#0e1f15]">{f.temp}</div>
                  <div className="text-[10px] font-bold text-blue-700">Rain {f.rain}</div>
                  <div className="text-[9px] text-[#404941] bg-white p-1 rounded-lg border leading-tight truncate" title={f.advisory}>
                    {f.advisory}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
