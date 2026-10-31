import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function ProfitPredictorPage() {
  const { activePlot } = useAuth();
  const [acres, setAcres] = useState(() => (activePlot ? activePlot.area_acres : 2.5));
  const [crops, setCrops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTable() {
      try {
        setLoading(true);
        const res = await api.getComparisonTable(acres);
        if (res.success) setCrops(res.crops || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTable();
  }, [acres]);

  const categories = ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Millets', 'Commercial', 'Horticulture', 'Spices'];

  const filteredCrops = selectedCategory === 'All'
    ? crops
    : crops.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6 pb-16">
      
      {/* HEADER & SCALER CONTROLS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#c0c9be]/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h1 className="text-xl sm:text-2xl font-black text-[#003b1b]">
              Farm Finance & Profit Predictor (18 Crops)
            </h1>
          </div>
          <p className="text-xs text-[#404941] mt-1">
            பண்ணை நிதி & 18 பயிர்கள் லாப ஒப்பீட்டு அட்டவணை • Itemized expenses, yield benchmarks, and net ROI across custom acreage.
          </p>
        </div>

        {/* Acreage Scaler Slider */}
        <div className="bg-[#f8f7f0] p-4 rounded-2xl border border-[#c0c9be]/60 min-w-[280px]">
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="font-bold text-[#404941] uppercase">Farmland Acreage Scale:</span>
            <span className="text-base font-black text-[#003b1b]">{acres} Acres</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="25"
            step="0.5"
            value={acres}
            onChange={(e) => setAcres(parseFloat(e.target.value))}
            className="w-full accent-[#14532d]"
          />
          <div className="flex justify-between text-[10px] text-[#404941] mt-1">
            <span>0.5 Ac</span>
            <span>5 Ac</span>
            <span>15 Ac</span>
            <span>25 Ac</span>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#003b1b] text-white shadow-xs'
                : 'bg-white text-[#404941] border border-[#c0c9be]/50 hover:bg-[#e4f9e8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 18-CROPS ITEMISED COMPARISON TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#c0c9be]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#e4f9e8] text-[#003b1b] uppercase text-[10px] font-bold border-b border-[#c0c9be]/50">
              <tr>
                <th className="p-3.5 pl-5">Crop & Variety</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Seeds (₹)</th>
                <th className="p-3.5">Fertilizers (₹)</th>
                <th className="p-3.5">Labour (₹)</th>
                <th className="p-3.5">Machinery (₹)</th>
                <th className="p-3.5">Total Outlay (₹)</th>
                <th className="p-3.5">Expected Yield</th>
                <th className="p-3.5">Gross Revenue (₹)</th>
                <th className="p-3.5 font-black text-[#14532d]">Net Profit (₹)</th>
                <th className="p-3.5">ROI %</th>
                <th className="p-3.5 pr-5">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCrops.map((c, idx) => (
                <tr key={idx} className="hover:bg-[#f8f7f0] transition-colors">
                  <td className="p-3.5 pl-5">
                    <span className="font-bold text-[#0e1f15] block leading-tight">{c.cropName}</span>
                    <span className="text-[10px] text-[#404941]">{c.cropNameTa}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#404941] font-semibold text-[10px]">
                      {c.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">₹{c.seedCost?.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 font-semibold text-slate-700">₹{c.fertilizerCost?.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 font-semibold text-slate-700">₹{c.labourCost?.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 font-semibold text-slate-700">₹{c.machineryCost?.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 font-bold text-[#0e1f15]">₹{c.totalInvestment?.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-[#404941] max-w-[140px] truncate" title={c.expectedYield}>
                    {c.expectedYield}
                  </td>
                  <td className="p-3.5 font-bold text-emerald-800">₹{c.grossRevenue?.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 font-black text-emerald-900 bg-emerald-50/50">
                    ₹{c.netProfit?.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-bold text-[#003b1b]">{c.roiPercent}%</td>
                  <td className="p-3.5 pr-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-800' : c.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {c.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
