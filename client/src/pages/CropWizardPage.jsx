import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState } from 'react';
import { api } from '../services/api.js';

export default function CropWizardPage({ setCurrentTab }) {
  const [answers, setAnswers] = useState({
    soilTexture: 'clay_alluvial',
    waterSource: 'canal',
    season: 'samba',
    budgetRange: 'medium',
    objective: 'max_profit'
  });

  const [topThree, setTopThree] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await api.wizardRecommendations(answers);
      if (res.success) {
        setTopThree(res.topThree);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#c0c9be]/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#003b1b] text-white flex items-center justify-center text-xl">
            🌱
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#003b1b]">
              "What Should I Plant?" — 5-Question Crop Wizard
            </h1>
            <p className="text-xs text-[#404941]">பயிர் தேர்வு வழிகாட்டி • Instant Agricultural Decision Engine</p>
          </div>
        </div>

        <p className="text-xs text-[#404941] mb-6">
          Answer 5 simple questions about your farmland texture, water availability, season, and financial objectives to discover your top 3 highest-yielding crops.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Q1: Soil */}
          <div className="p-4 rounded-2xl bg-[#f8f7f0] border border-[#c0c9be]/50 space-y-2">
            <label className="block text-xs font-bold text-[#003b1b] uppercase">1. Soil Texture & Type / மண் வகை</label>
            <select
              value={answers.soilTexture}
              onChange={(e) => setAnswers(prev => ({ ...prev, soilTexture: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
            >
              <option value="clay_alluvial">Clayey Alluvial Soil (Cauvery Delta)</option>
              <option value="red_loam">Red Loam Soil (Dryland / Porous)</option>
              <option value="black_cotton">Black Cotton Soil (Regur Clay)</option>
              <option value="sandy_loam">Sandy Loam (Fast Drainage)</option>
            </select>
          </div>

          {/* Q2: Water */}
          <div className="p-4 rounded-2xl bg-[#f8f7f0] border border-[#c0c9be]/50 space-y-2">
            <label className="block text-xs font-bold text-[#003b1b] uppercase">2. Water Source & Reliability / பாசனம்</label>
            <select
              value={answers.waterSource}
              onChange={(e) => setAnswers(prev => ({ ...prev, waterSource: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
            >
              <option value="canal">Canal + Deep Tube (Assured Hydrology)</option>
              <option value="borewell">Borewell Only (Moderate)</option>
              <option value="rainfed">Rainfed / Seasonal Tank (Deficit Risk)</option>
            </select>
          </div>

          {/* Q3: Season */}
          <div className="p-4 rounded-2xl bg-[#f8f7f0] border border-[#c0c9be]/50 space-y-2">
            <label className="block text-xs font-bold text-[#003b1b] uppercase">3. Cultivation Season / பருவம்</label>
            <select
              value={answers.season}
              onChange={(e) => setAnswers(prev => ({ ...prev, season: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
            >
              <option value="samba">Samba / Rabi (Aug - Jan)</option>
              <option value="kuruvai">Kuruvai (Jun - Sep)</option>
              <option value="navarai">Navarai / Summer Zaid (Jan - May)</option>
            </select>
          </div>

          {/* Q4: Budget */}
          <div className="p-4 rounded-2xl bg-[#f8f7f0] border border-[#c0c9be]/50 space-y-2">
            <label className="block text-xs font-bold text-[#003b1b] uppercase">4. Available Budget / முதலீட்டு அளவு</label>
            <select
              value={answers.budgetRange}
              onChange={(e) => setAnswers(prev => ({ ...prev, budgetRange: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
            >
              <option value="low">Low Outlay (Under ₹15,000 / Acre)</option>
              <option value="medium">Medium Outlay (₹15,000 - ₹35,000 / Acre)</option>
              <option value="high">High Capital Commercial (&gt; ₹35,000 / Acre)</option>
            </select>
          </div>

          {/* Q5: Objective */}
          <div className="sm:col-span-2 p-4 rounded-2xl bg-[#f8f7f0] border border-[#c0c9be]/50 space-y-2">
            <label className="block text-xs font-bold text-[#003b1b] uppercase">5. Primary Objective / விவசாய நோக்கம்</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'max_profit', label: 'Max Profit / ROI' },
                { id: 'low_risk', label: 'Low Risk & Climate Safe' },
                { id: 'short_cash', label: 'Ultra Fast Turnaround' },
                { id: 'organic', label: 'Low Chemical / Organic' }
              ].map(obj => (
                <button
                  type="button"
                  key={obj.id}
                  onClick={() => setAnswers(prev => ({ ...prev, objective: obj.id }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    answers.objective === obj.id
                      ? 'bg-[#14532d] text-white border-[#14532d] shadow-xs'
                      : 'bg-white text-[#0e1f15] border-[#c0c9be]'
                  }`}
                >
                  {obj.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-2xl bg-[#003b1b] hover:bg-[#14532d] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Icon name="psychology" className="text-[18px]" />
          <span>{loading ? 'Evaluating Agronomy Parameters...' : 'Find My Top 3 Recommended Crops'}</span>
        </button>
      </div>

      {/* TOP THREE RESULTS DISPLAY */}
      {topThree && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-base font-bold text-[#003b1b]">Recommended Choices Based on Your Inputs</h2>
            <span className="text-xs text-[#404941]">Calibrated with TNAU Agro-Climatic Model</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThree.map((crop, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-5 shadow-sm border border-[#c0c9be]/50 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-7 h-7 rounded-full bg-[#14532d] text-white flex items-center justify-center text-xs font-bold">
                      #{idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#e4f9e8] text-[#003b1b] text-xs font-black">
                      {crop.suitabilityPct}% Match
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0e1f15] leading-tight">{crop.cropName}</h3>
                  <div className="text-[11px] text-[#404941]">{crop.cropNameTa} • {crop.category}</div>

                  <div className="my-3 space-y-1.5 text-xs bg-[#eaffee] p-2.5 rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-[#404941]">Duration:</span>
                      <span className="font-bold">{crop.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#404941]">Water Need:</span>
                      <span className="font-bold">{crop.waterNeed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#404941]">Input Cost:</span>
                      <span className="font-bold">{crop.investmentPerAcre}</span>
                    </div>
                    <div className="flex justify-between text-[#003b1b]">
                      <span className="font-bold">Net Profit:</span>
                      <span className="font-black">{crop.estimatedNetProfit}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#404941] leading-tight">{crop.rationale}</p>
                </div>

                <button
                  onClick={() => setCurrentTab('decision_engine')}
                  className="w-full py-2 rounded-xl bg-[#003b1b] text-white text-xs font-bold hover:bg-[#14532d]"
                >
                  View Full Agronomy Guide
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
