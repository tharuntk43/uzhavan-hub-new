import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function CropRiskPage({ setCurrentTab }) {
  const { user, activePlot } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const district = user?.profile?.district || 'Thanjavur';
        const res = await api.getRiskAlerts(district);
        if (res.success) setAlerts(res.alerts || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, [user]);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#c0c9be]/50">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center text-xl">
              ⚠️
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#003b1b]">
                Crop Risk and Hazard Detection Radar
              </h1>
              <p className="text-xs text-[#404941]">பயிர் ஆபத்து மற்றும் பூச்சி தாக்குதல் எச்சரிக்கை</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-900 font-bold border border-red-200">
            {alerts.length} Active Hazard Advisories
          </span>
        </div>

        <p className="text-xs text-[#404941] leading-relaxed">
          Evaluates meteorological forecast, rainfall bursts, humidity pest vectors, and soil moisture stress relative to your active plot ({activePlot?.plot_name || 'Vadavaru River Plot'}).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl border shadow-sm space-y-3 flex flex-col justify-between ${
              alert.severity === 'High'
                ? 'bg-red-50/60 border-red-200 text-red-950'
                : 'bg-amber-50/60 border-amber-200 text-amber-950'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  alert.severity === 'High' ? 'bg-red-700 text-white' : 'bg-amber-700 text-white'
                }`}>
                  {alert.severity} Hazard Alert
                </span>
                <span className="text-[11px] text-[#404941] font-semibold">{alert.category}</span>
              </div>

              <h3 className="text-base font-bold mb-1">{alert.title}</h3>
              <div className="text-xs font-semibold mb-2">{alert.titleTa}</div>

              <p className="text-xs leading-relaxed opacity-90">{alert.description}</p>

              <div className="mt-3 p-3 rounded-2xl bg-white/80 border border-black/5 text-xs space-y-1">
                <strong className="text-[#003b1b] block">Recommended Preventive Action:</strong>
                <p className="text-[#404941] leading-tight">{alert.recommendedAction}</p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#404941] border-t border-black/5 flex items-center justify-between">
              <span>{alert.escalationContact}</span>
              <button
                onClick={() => setCurrentTab('crop_doctor')}
                className="text-xs font-bold text-[#003b1b] hover:underline"
              >
                Scan Leaf Photo →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
