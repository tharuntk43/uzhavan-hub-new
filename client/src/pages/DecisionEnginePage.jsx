import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function DecisionEnginePage({ setCurrentTab }) {
  const { user, activePlot, plots, switchActivePlot, language, showToast } = useAuth();
  const isTa = language === 'ta';

  const [season, setSeason] = useState('Samba / Rabi (Oct-Jan)');
  const [optimizationGoal, setOptimizationGoal] = useState('max_profit');
  const [intensityMode, setIntensityMode] = useState('standard'); // 'standard' vs 'intensive'

  const [topCrops, setTopCrops] = useState([]);
  const [contextData, setContextData] = useState(null);
  const [loading, setLoading] = useState(true);

  // PDF Export Modal
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDecisionData() {
      try {
        setLoading(true);
        const plotQuery = activePlot ? `plotId=${activePlot.id}&` : '';
        const res = await api.getRecommendations(`${plotQuery}season=${encodeURIComponent(season)}&optimizationGoal=${optimizationGoal}`);
        if (res.success) {
          setTopCrops(res.topRecommendations || []);
          setContextData(res.context);
        }
      } catch (err) {
        showToast('Using local calibrated agronomy baseline.', 'info');
      } finally {
        setLoading(false);
      }
    }

    fetchDecisionData();
  }, [activePlot, season, optimizationGoal]);

  const plotAcres = activePlot ? activePlot.area_acres : 3.5;

  // Simulator values depending on standard vs intensive toggle
  const simCost = intensityMode === 'standard' ? Math.round(plotAcres * 20000) : Math.round(plotAcres * 28000);
  const simBags = intensityMode === 'standard' ? Math.round(plotAcres * 25) : Math.round(plotAcres * 30);
  const simRoi = intensityMode === 'standard' ? '182%' : '215%';
  const simProgressWidth = intensityMode === 'standard' ? '82%' : '95%';
  const simNetProfit = intensityMode === 'standard' ? Math.round(plotAcres * 41000) : Math.round(plotAcres * 56000);

  return (
    <div className="space-y-6 pb-16">
      
      {/* WORKSPACE HEADER / BREADCRUMB ROW */}
      <div className="flex flex-col gap-4">
        
        {/* Breadcrumb & Title */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#404941]">
              <span onClick={() => setCurrentTab('dashboard')} className="hover:text-[#003b1b] cursor-pointer">
                My Farm
              </span>
              <Icon name="chevron_right" className="text-[14px]" />
              <span className="text-[#0e1f15] font-semibold">{activePlot ? activePlot.plot_name : 'Vadavaru River Plot'}</span>
              <Icon name="chevron_right" className="text-[14px]" />
              <span className="text-[#003b1b] font-semibold">Crop Recommendation & Soil Health v2.4</span>
            </div>

            <div className="flex items-baseline gap-2.5 mt-1 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-[#003b1b] tracking-tight">
                Crop Recommendation & Soil Health Engine
              </h1>
              <span className="text-sm font-semibold text-[#404941]">பயிர் பரிந்துரை & மண் வளம்</span>
              <span className="px-2 py-0.5 rounded-full bg-[#d9eddd] text-[#003b1b] text-[11px] font-bold uppercase tracking-wider">
                AI v2.4 Active
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPdfModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#003b1b] text-white hover:bg-[#14532d] transition-all text-xs font-bold shadow-md"
            >
              <Icon name="picture_as_pdf" className="text-[18px]" />
              <span>Export Full Advisory</span>
            </button>
          </div>
        </div>

        {/* ACTIVE PLOT & TELEMETRY STRIP */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#c0c9be]/50 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          
          {/* Plot Switcher */}
          <div className="flex items-center gap-3 min-w-[320px]">
            <div className="w-10 h-10 rounded-2xl bg-[#dff3e2] flex items-center justify-center text-[#003b1b]">
              <Icon name="pin_drop" className="text-[24px]" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-[#404941] uppercase tracking-wider">
                Active Agro-Ecological Plot
              </label>
              {plots && plots.length > 0 ? (
                <div className="relative">
                  <select
                    value={activePlot ? activePlot.id : ''}
                    onChange={(e) => switchActivePlot(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-[#003b1b] pr-6 cursor-pointer focus:outline-none appearance-none"
                  >
                    {plots.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.plot_name} ({p.area_acres} Acres • {p.soil_type})
                      </option>
                    ))}
                  </select>
                  <Icon name="expand_more" className="pointer-events-none absolute right-0 top-0.5 text-[#404941] text-[18px]" />
                </div>
              ) : (
                <span className="text-xs font-bold text-[#003b1b]">Vadavaru River Plot (3.5 Acres)</span>
              )}
            </div>
          </div>

          {/* Telemetry Tags */}
          <div className="flex flex-wrap items-center gap-2 xl:gap-3">
            <div className="flex items-center gap-2 bg-[#e4f9e8] px-3 py-1.5 rounded-xl border border-emerald-200">
              <Icon name="landslide" className="text-[#77574d] text-[18px]" />
              <div className="text-left">
                <div className="text-[10px] text-[#404941] leading-none">Soil Classification</div>
                <div className="text-xs font-bold text-[#0e1f15]">{activePlot ? activePlot.soil_type : 'Clayey Alluvial (களிமண்)'}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#e4f9e8] px-3 py-1.5 rounded-xl border border-emerald-200">
              <Icon name="science" className="text-[#003b1b] text-[18px]" />
              <div className="text-left">
                <div className="text-[10px] text-[#404941] leading-none">Soil Reaction (pH)</div>
                <div className="text-xs font-bold text-[#0e1f15]">{activePlot ? activePlot.soil_ph : '7.2'} (Neutral / நன்று)</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#e4f9e8] px-3 py-1.5 rounded-xl border border-emerald-200">
              <Icon name="water_drop" className="text-[#003b1b] text-[18px]" />
              <div className="text-left">
                <div className="text-[10px] text-[#404941] leading-none">Hydrology Source</div>
                <div className="text-xs font-bold text-[#0e1f15]">{activePlot ? activePlot.irrigation_source : 'Canal + Deep Tube (High)'}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#e4f9e8] px-3 py-1.5 rounded-xl border border-emerald-200">
              <Icon name="calendar_month" className="text-[#5c4500] text-[18px]" />
              <div className="text-left">
                <div className="text-[10px] text-[#404941] leading-none">Current Season</div>
                <div className="text-xs font-bold text-[#0e1f15]">{season}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#e4f9e8] px-3 py-1.5 rounded-xl border border-emerald-200">
              <Icon name="account_balance_wallet" className="text-[#77574d] text-[18px]" />
              <div className="text-left">
                <div className="text-[10px] text-[#404941] leading-none">Target Outlay / Acre</div>
                <div className="text-xs font-bold text-[#0e1f15]">₹25,000 - ₹35,000</div>
              </div>
            </div>
          </div>

        </div>

        {/* STRATEGY FILTERS & GOAL CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#c0c9be]/50 shadow-sm">
          
          {/* Target Season Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-[#404941] uppercase tracking-wider mr-1">Target Season:</span>
            {[
              { id: 'Samba / Rabi (Oct-Jan)', label: 'Upcoming Rabi / Samba (Auto-aligned)' },
              { id: 'Kuruvai (Monsoon)', label: 'Kharif 2026 (குறுவை)' },
              { id: 'Summer Zaid', label: 'Summer Zaid (கோடைப் பயிர்)' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSeason(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  season === s.id
                    ? 'bg-[#003b1b] text-white shadow-xs'
                    : 'bg-[#d9eddd] text-[#404941] hover:text-[#0e1f15]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Objective Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-[#404941] uppercase tracking-wider mr-1">Optimization Goal:</span>
            {[
              { id: 'max_profit', label: 'Max Profit / ROI', icon: 'trending_up' },
              { id: 'low_water', label: 'Low Water Need', icon: 'water_ph' },
              { id: 'short_duration', label: 'Short Duration (Cash)', icon: 'bolt' },
              { id: 'organic', label: 'Export Organic', icon: 'eco' }
            ].map(g => (
              <button
                key={g.id}
                onClick={() => setOptimizationGoal(g.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  optimizationGoal === g.id
                    ? 'bg-[#dff3e2] text-[#003b1b] border border-emerald-300 font-bold'
                    : 'bg-[#d9eddd] text-[#404941] hover:text-[#0e1f15]'
                }`}
              >
                <Icon name="{g.icon}" className="text-[16px]" />
                <span>{g.label}</span>
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* MAIN 3-COLUMN DESKTOP GRID (Exact from Stitch code.html lines 131-763) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: Soil Core Profile & Growth Phenology (Cols 1-3.5 on desktop)
           ========================================================================= */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          
          {/* Soil Core Profile Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#c0c9be]/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#003b1b]">Soil Core & Root Profile</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#e4f9e8] text-[#14532d] text-[10px] font-bold">LAB TESTED</span>
                </div>
                <span className="text-[11px] text-[#404941]">மண் பரிசோதனை அறிக்கை (Cauvery Delta)</span>
              </div>
              <Icon name="biotech" className="text-[#003b1b] text-[22px]" />
            </div>

            {/* 3-Tier Soil Strata Diagram */}
            <div className="space-y-2">
              {/* 0-15 cm */}
              <div className="p-2.5 rounded-xl bg-[#e4f9e8] flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#14532d] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  0-15
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0e1f15]">Organic Topsoil (மேல்மண்)</span>
                    <span className="text-[11px] font-bold text-[#003b1b]">Humus: High</span>
                  </div>
                  <p className="text-[11px] text-[#404941] leading-tight mt-0.5">
                    Crumbly, high microbial density, well aerated with optimal earthworm castings.
                  </p>
                </div>
              </div>

              {/* 15-30 cm */}
              <div className="p-2.5 rounded-xl bg-[#dff3e2] flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#77574d] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  15-30
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0e1f15]">Active Root Bed (வேர் மண்டலம்)</span>
                    <span className="text-[11px] font-bold text-[#77574d]">CEC: 34 meq</span>
                  </div>
                  <p className="text-[11px] text-[#404941] leading-tight mt-0.5">
                    Dense alluvial clay, strong nutrient holding capacity, ideal for tillering cereals.
                  </p>
                </div>
              </div>

              {/* 30-45 cm */}
              <div className="p-2.5 rounded-xl bg-[#d9eddd] flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#5c4500] text-[#ffdf98] flex items-center justify-center text-xs font-bold shrink-0">
                  30-45
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0e1f15]">Subsoil Water Retentive</span>
                    <span className="text-[11px] font-bold text-[#5c4500]">Moist Saturated</span>
                  </div>
                  <p className="text-[11px] text-[#404941] leading-tight mt-0.5">
                    Capillary recharge from canal feeder prevents terminal moisture stress.
                  </p>
                </div>
              </div>
            </div>

            {/* Telemetry Gauges Matrix */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#eaffee] p-2.5 rounded-xl border border-[#c0c9be]/40">
                <span className="text-[10px] uppercase font-bold text-[#404941] block">Soil pH</span>
                <div className="text-lg font-black text-[#003b1b] mt-0.5">7.2</div>
                <span className="text-[10px] text-[#404941]">Neutral (நடுநிலை)</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-xl border border-[#c0c9be]/40">
                <span className="text-[10px] uppercase font-bold text-[#404941] block">Organic Carbon</span>
                <div className="text-lg font-black text-[#003b1b] mt-0.5">0.68%</div>
                <span className="text-[10px] text-[#404941]">Good / ஆரோக்கியம்</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-xl border border-[#c0c9be]/40">
                <span className="text-[10px] uppercase font-bold text-[#404941] block">Moisture (ஈரம்)</span>
                <div className="text-lg font-black text-[#003b1b] mt-0.5">74%</div>
                <span className="text-[10px] text-[#404941]">Optimal for Samba</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-xl border border-[#c0c9be]/40">
                <span className="text-[10px] uppercase font-bold text-[#404941] block">NPK Status</span>
                <div className="text-sm font-bold text-[#0e1f15] mt-1.5">180:18:240</div>
                <span className="text-[10px] text-[#404941]">M : L : H (kg/ha)</span>
              </div>
            </div>

            {/* Agronomist Prescription Box */}
            <div className="bg-[#e4f9e8] rounded-2xl p-3 flex items-start gap-2.5 border border-emerald-200">
              <Icon name="prescriptions" className="text-[#003b1b] text-[20px] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#003b1b] block text-[11px] uppercase tracking-wider mb-0.5">
                  Agronomist Recommendation
                </span>
                <p className="text-[11px] text-[#404941] leading-tight">
                  Incorporate 2 tonnes/acre vermicompost & green manure (Daincha / தக்கைப்பூண்டு) prior to transplanting to replenish low available Phosphate (18 kg/ha).
                </p>
              </div>
            </div>
          </div>

          {/* Growth Phenology Cycle Timeline (Exact from Stitch code.html lines 241-304) */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#c0c9be]/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0e1f15]">Samba Paddy Phenology</h2>
                <span className="text-[11px] text-[#404941]">பருவ கால காலவரிசை (140 Days)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#003b1b] text-white font-bold">
                Day 42 / 140
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d9eddd]">
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#003b1b] flex items-center justify-center ring-4 ring-white">
                  <Icon name="check" className="text-[10px] text-white font-bold" />
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0e1f15]">Land Prep & Basal Dosing</span>
                  <span className="text-[#404941] text-[10px]">Day 0-14</span>
                </div>
                <p className="text-[11px] text-[#404941]">Summer puddling, Daincha green manuring completed.</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#003b1b] flex items-center justify-center ring-4 ring-white">
                  <Icon name="check" className="text-[10px] text-white font-bold" />
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0e1f15]">Transplanting / DSR Seeding</span>
                  <span className="text-[#404941] text-[10px]">Day 15-28</span>
                </div>
                <p className="text-[11px] text-[#404941]">Certified nursery transplanted under thin water layer.</p>
              </div>

              {/* Step 3: Active Stage */}
              <div className="relative bg-[#e4f9e8] p-2.5 rounded-xl -ml-2 pl-4 border border-emerald-300">
                <span className="absolute -left-4 top-3.5 w-4 h-4 rounded-full bg-[#003b1b] ring-4 ring-[#d9eddd] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#003b1b]">Vegetative Tillering (Active)</span>
                  <span className="text-[10px] font-bold text-[#003b1b]">Day 29-55</span>
                </div>
                <p className="text-[11px] text-[#404941]">Peak vegetative stage. First urea + potash split application window.</p>
              </div>

              {/* Step 4 */}
              <div className="relative opacity-60">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#d9eddd] ring-4 ring-white"></span>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#0e1f15]">Panicle Initiation</span>
                  <span className="text-[#404941] text-[10px]">Day 56-90</span>
                </div>
                <p className="text-[11px] text-[#404941]">Booting phase, blast disease prophylactic surveillance.</p>
              </div>

              {/* Step 5 */}
              <div className="relative opacity-60">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#d9eddd] ring-4 ring-white"></span>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#0e1f15]">Grain Maturation & Harvest</span>
                  <span className="text-[#404941] text-[10px]">Day 91-140</span>
                </div>
                <p className="text-[11px] text-[#404941]">Field de-watering 10 days before combined harvesting.</p>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================================
            CENTER COLUMN: Top Recommended Crops Cards (Cols 5-9 on desktop)
           ========================================================================= */}
        <div className="lg:col-span-8 xl:col-span-6 space-y-6">
          
          {/* Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-5 rounded-3xl shadow-sm border border-[#c0c9be]/50">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#003b1b]">Top Recommended Crops (3)</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#d9eddd] text-[#003b1b] text-[10px] font-bold">AI RANKED</span>
              </div>
              <p className="text-[11px] text-[#404941]">
                Thanjavur Agronomy Model (Ranked by Soil Affinity, Mandi Demand & Net Margin)
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#404941]">Sorting:</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#e4f9e8] text-[#003b1b] font-bold">Net Profit (High to Low)</span>
            </div>
          </div>

          {/* CROP CARD 1: Paddy BPT 5204 (Andhra Ponni) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#c0c9be]/50 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#e4f9e8] flex items-center justify-center text-[#003b1b] text-2xl shrink-0">
                  🌾
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-[#0e1f15]">Paddy BPT 5204 (Andhra Ponni)</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#e4f9e8] text-[#003b1b] text-[10px] font-bold flex items-center gap-1">
                      <Icon name="verified" className="text-[12px]" /> 96% Match
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#d9eddd] text-[#77574d] text-[10px] font-semibold">
                      TNAU Certified Grade
                    </span>
                  </div>
                  <div className="text-[11px] text-[#404941] mt-0.5">
                    ஆந்திரா பொன்னி • Medium Slender Fine Grain • Premium Consumer Demand
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#003b1b] text-white text-[10px] uppercase font-bold tracking-wider">
                Best Soil-Water Match
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Duration</span>
                <div className="text-xs font-bold text-[#0e1f15] mt-0.5">135-145 Days</div>
                <span className="text-[10px] text-[#404941]">Late Samba</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Water Need</span>
                <div className="text-xs font-bold text-[#0e1f15] mt-0.5">1,200 mm</div>
                <span className="text-[10px] text-[#404941]">Canal Active</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Input Cost / Ac</span>
                <div className="text-xs font-bold text-[#0e1f15] mt-0.5">₹24,500</div>
                <span className="text-[10px] text-[#404941]">Seed + Fert + Labor</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Est. Yield / Ac</span>
                <div className="text-xs font-bold text-[#003b1b] mt-0.5">24 - 28 Bags</div>
                <span className="text-[10px] text-[#404941]">75 kg / Bag</span>
              </div>
            </div>

            {/* Net Profit Gauge Bar */}
            <div className="bg-[#e4f9e8] p-4 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#404941] block">
                    Estimated Net Profit:
                  </span>
                  <span className="text-lg font-black text-[#003b1b]">₹38,000 - ₹46,000 / Acre</span>
                </div>
                <span className="text-xs font-bold text-[#0e1f15] bg-white px-2.5 py-1 rounded-xl shadow-2xs">
                  Mandi Benchmark: ₹2,450/Qtl
                </span>
              </div>
              <div className="w-full bg-[#dff3e2] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#003b1b] h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#404941]">
                <span>Breakeven: ₹14,200</span>
                <span>Target ROI: 172%</span>
                <span className="text-[#003b1b] font-bold">Top Profitability Tier</span>
              </div>
            </div>

            {/* Rationale & Advisory */}
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 bg-[#eaffee] p-2.5 rounded-xl">
                <Icon name="thumb_up" className="text-[#003b1b] text-[18px] shrink-0" />
                <p className="text-[11px] text-[#404941]">
                  <strong className="text-[#0e1f15]">Soil Affinity Rationale:</strong> Heavy alluvial clay in Vadavaru River Plot exhibits exceptional water retention, preventing panicle desiccation during heading stages common in light soils.
                </p>
              </div>

              <div className="flex items-start gap-2 bg-red-50 p-2.5 rounded-xl border border-red-200">
                <Icon name="warning" className="text-red-600 text-[18px] shrink-0" />
                <p className="text-[11px] text-red-950">
                  <strong className="text-red-700 font-bold">Blast Advisory (இலைக் கருகல்):</strong> BPT 5204 is susceptible to blast in humid Thanjavur mist. Must soak seeds with <em>Pseudomonas fluorescens</em> (10g/kg) and schedule Tricyclazole prophylactic spray at Day 60.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setCurrentTab('fertilizer'); showToast('Loaded NPK dose for Paddy BPT 5204', 'info'); }}
                  className="px-4 py-2 rounded-xl bg-[#003b1b] text-white text-xs font-bold hover:bg-[#14532d] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Icon name="calculate" className="text-[16px]" />
                  <span>Calculate NPK Dose</span>
                </button>
                <button
                  onClick={() => setCurrentTab('action_plan')}
                  className="px-3.5 py-2 rounded-xl bg-[#e4f9e8] text-[#003b1b] text-xs font-bold hover:bg-[#d9eddd] transition-all flex items-center gap-1"
                >
                  <span>View Crop Calendar</span>
                  <Icon name="arrow_forward" className="text-[16px]" />
                </button>
              </div>
              <button
                onClick={() => setCurrentTab('profit_predictor')}
                className="text-xs font-bold text-[#404941] hover:text-[#003b1b] flex items-center gap-1"
              >
                <span>Compare Specs</span>
                <Icon name="compare_arrows" className="text-[16px]" />
              </button>
            </div>
          </div>

          {/* CROP CARD 2: Black Gram (VBN 8 / உளுந்து) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#c0c9be]/50 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#fed3c7]/60 flex items-center justify-center text-[#77574d] text-2xl shrink-0">
                  🌱
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-[#0e1f15]">Black Gram (VBN 8 / உளுந்து)</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#d9eddd] text-[#77574d] text-[10px] font-bold flex items-center gap-1">
                      <Icon name="auto_graph" className="text-[12px]" /> 89% Match
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#e4f9e8] text-[#003b1b] text-[10px] font-semibold">
                      Relay Pulse Crop
                    </span>
                  </div>
                  <div className="text-[11px] text-[#404941] mt-0.5">
                    நெல் தரிசு உளுந்து • Short Turnaround • High Market Liquidity
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#77574d] text-white text-[10px] uppercase font-bold tracking-wider">
                Best Cash Yield / Pulse Relay
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Duration</span>
                <div className="text-xs font-bold text-[#0e1f15] mt-0.5">65 - 70 Days</div>
                <span className="text-[10px] text-[#404941]">Ultra Fast Cash</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Water Need</span>
                <div className="text-xs font-bold text-[#0e1f15] mt-0.5">350 mm</div>
                <span className="text-[10px] text-[#404941]">Residual Moisture</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Input Cost / Ac</span>
                <div className="text-xs font-bold text-[#0e1f15] mt-0.5">₹8,200</div>
                <span className="text-[10px] text-[#404941]">Low Outlay</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Est. Yield / Ac</span>
                <div className="text-xs font-bold text-[#77574d] mt-0.5">4.5 - 6.0 Qtl</div>
                <span className="text-[10px] text-[#404941]">Machine Harvestable</span>
              </div>
            </div>

            {/* Net Profit Gauge Bar */}
            <div className="bg-[#fbf4f0] p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#404941] block">
                    Estimated Net Profit:
                  </span>
                  <span className="text-lg font-black text-[#77574d]">₹26,000 - ₹32,000 / Acre</span>
                </div>
                <span className="text-xs font-bold text-[#0e1f15] bg-white px-2.5 py-1 rounded-xl shadow-2xs">
                  Mandi Benchmark: ₹7,800/Qtl
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#77574d] h-full rounded-full" style={{ width: '72%' }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#404941]">
                <span>Zero Irrigation Cost</span>
                <span>Biological N Credit: +35kg/ha</span>
                <span className="text-[#77574d] font-bold">280% Capital Turnaround</span>
              </div>
            </div>

            {/* Soil Enrichment Callout */}
            <div className="flex items-start gap-2 bg-[#e4f9e8] p-2.5 rounded-xl border border-emerald-200">
              <Icon name="compost" className="text-[#003b1b] text-[18px] shrink-0" />
              <p className="text-[11px] text-[#0e1f15]">
                <strong className="text-[#003b1b] font-bold">Soil Rejuvenation Advantage:</strong> Rhizobium root nodulation fixes ~35 kg atmospheric Nitrogen per acre, reducing subsequent Kuruvai season synthetic fertilizer expense by ₹4,000.
              </p>
            </div>
          </div>

          {/* CROP CARD 3: Barnyard Millet (Kuthiraivali / குதிரைவாலி) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#c0c9be]/50 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 text-2xl shrink-0">
                  🌾
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-[#0e1f15]">Barnyard Millet (Kuthiraivali / குதிரைவாலி)</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#d9eddd] text-[#5c4500] text-[10px] font-bold flex items-center gap-1">
                      82% Match
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#e4f9e8] text-[#003b1b] text-[10px] font-semibold">
                      TNAU MDU 1 Variety
                    </span>
                  </div>
                  <div className="text-[11px] text-[#404941] mt-0.5">
                    வறட்சி தாங்கும் சிறுதானியம் • Lowest Groundwater Draw • TN Millet Mission Subsidy
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#5c4500] text-[#ffdf98] text-[10px] uppercase font-bold tracking-wider">
                Drought & Climate Resilient Shield
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Duration</span>
                <div className="text-xs font-bold text-[#0e1f15] mt-0.5">85 - 90 Days</div>
                <span className="text-[10px] text-[#404941]">Early Harvesting</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Water Need</span>
                <div className="text-xs font-bold text-[#0e1f15] mt-0.5">250 mm</div>
                <span className="text-[10px] text-[#404941]">Lowest Need</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Input Cost / Ac</span>
                <div className="text-xs font-bold text-[#0e1f15] mt-0.5">₹6,500</div>
                <span className="text-[10px] text-[#404941]">Minimal Chem Fert</span>
              </div>

              <div className="bg-[#eaffee] p-2.5 rounded-2xl">
                <span className="text-[10px] uppercase text-[#404941] block">Est. Yield / Ac</span>
                <div className="text-xs font-bold text-[#5c4500] mt-0.5">8 - 10 Qtl</div>
                <span className="text-[10px] text-[#404941]">Direct Mandi Buy</span>
              </div>
            </div>

            <div className="bg-[#fcf9f2] p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#404941] block">
                    Estimated Net Profit:
                  </span>
                  <span className="text-lg font-black text-[#5c4500]">₹22,000 - ₹28,000 / Acre</span>
                </div>
                <span className="text-xs font-bold text-[#0e1f15] bg-white px-2.5 py-1 rounded-xl shadow-2xs">
                  Mandi Benchmark: ₹3,600/Qtl
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#5c4500] h-full rounded-full" style={{ width: '58%' }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#404941]">
                <span>Govt Millet Incentive: ₹2,500 / Ac</span>
                <span>Zero Borewell Run Time</span>
                <span className="text-[#5c4500] font-bold">Climate Insurance Crop</span>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN: Simulation, ROI Analytics & Support (Cols 10-12 on desktop)
           ========================================================================= */}
        <div className="lg:col-span-12 xl:col-span-3 space-y-6">
          
          {/* Plot Economics Simulator (Exact from Stitch code.html lines 595-663) */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#c0c9be]/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-[#0e1f15]">Plot Economics Simulator</h2>
                <span className="text-[11px] text-[#404941]">முதலீடு & லாப மதிப்பீடு ({plotAcres} Acres)</span>
              </div>
              <Icon name="query_stats" className="text-[#003b1b] text-[22px]" />
            </div>

            {/* Standard vs Intensive Toggle */}
            <div className="bg-[#dff3e2] p-1 rounded-2xl flex items-center">
              <button
                type="button"
                onClick={() => setIntensityMode('standard')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  intensityMode === 'standard'
                    ? 'bg-white text-[#003b1b] shadow-xs'
                    : 'text-[#404941] hover:text-[#0e1f15]'
                }`}
              >
                Standard (₹20k/ac)
              </button>
              <button
                type="button"
                onClick={() => setIntensityMode('intensive')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  intensityMode === 'intensive'
                    ? 'bg-white text-[#003b1b] shadow-xs'
                    : 'text-[#404941] hover:text-[#0e1f15]'
                }`}
              >
                Intensive (₹28k/ac)
              </button>
            </div>

            {/* Projected Key Numbers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-[#eaffee] rounded-xl">
                <span className="text-xs text-[#404941]">Total Investment ({plotAcres} Ac)</span>
                <span className="text-sm font-black text-[#0e1f15]">₹{simCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#eaffee] rounded-xl">
                <span className="text-xs text-[#404941]">Projected Harvest Yield</span>
                <span className="text-sm font-black text-[#003b1b]">{simBags} Bags (75kg)</span>
              </div>

              {/* ROI Radial / Bar */}
              <div className="bg-[#e4f9e8] p-3 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#404941]">Expected Return / ROI</span>
                  <span className="text-sm font-black text-[#003b1b]">{simRoi}</span>
                </div>
                <div className="w-full bg-[#dff3e2] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#003b1b] h-full rounded-full transition-all duration-300" style={{ width: simProgressWidth }}></div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-[#404941]">Net Profit (Entire {plotAcres} Ac):</span>
                  <span className="text-base font-black text-[#003b1b]">₹{simNetProfit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Expense Allocation Matrix */}
            <div>
              <span className="text-[10px] uppercase font-bold text-[#404941] block mb-2">Input Allocation Matrix</span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-1.5 bg-[#eaffee] rounded-lg">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#003b1b]"></span> Certified Seed Paddy</span>
                  <span className="font-bold">₹{Math.round(simCost * 0.15).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-[#eaffee] rounded-lg">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#77574d]"></span> Basal & NPK Top-dress</span>
                  <span className="font-bold">₹{Math.round(simCost * 0.26).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-[#eaffee] rounded-lg">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#5c4500]"></span> Mechanical Puddling</span>
                  <span className="font-bold">₹{Math.round(simCost * 0.23).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-[#eaffee] rounded-lg">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Labor & Harvesting</span>
                  <span className="font-bold">₹{Math.round(simCost * 0.36).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Verification & QR Simulation Box */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#c0c9be]/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e4f9e8] text-[#003b1b] flex items-center justify-center shrink-0">
                <Icon name="verified" className="text-[24px]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#0e1f15]">Government Verified Advisory</h3>
                <span className="text-[11px] text-[#404941]">TNAU - KVK Thanjavur Certified</span>
              </div>
            </div>
            <p className="text-[11px] text-[#404941] leading-tight">
              Export full PDF containing soil lab chromatography, geo-tagged moisture telemetry and subsidy eligibility form.
            </p>

            <div className="flex items-center gap-3 p-2.5 bg-[#eaffee] rounded-2xl border border-emerald-200">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-[#003b1b] font-bold text-2xl shrink-0 shadow-2xs">
                <Icon name="qr_code_2" className="text-[32px]" />
              </div>
              <div className="text-[10px] text-[#404941]">
                <strong className="text-[#0e1f15] block">Doc ID: TN-THJ-2026-8849</strong>
                <span>Digital Signature Verified</span>
                <span className="text-[#003b1b] font-bold block mt-0.5">Valid until Jan 2027</span>
              </div>
            </div>

            <button
              onClick={() => setPdfModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#003b1b] text-white hover:bg-[#14532d] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Icon name="download" className="text-[18px]" />
              <span>Download PDF Advisory</span>
            </button>
          </div>

          {/* District Agri Officer Hotline Card */}
          <div className="bg-[#e4f9e8] rounded-3xl p-5 shadow-sm border border-emerald-300 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#003b1b] text-white flex items-center justify-center shrink-0">
                <Icon name="support_agent" className="text-[18px]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#003b1b]">District Agri Officer Hotline</h3>
                <span className="text-[10px] text-[#404941]">வேளாண் விரிவாக்க அலுவலர்</span>
              </div>
            </div>
            <p className="text-[11px] text-[#404941] leading-tight">
              Direct telephone support with block agronomy desk for seed subsidy claims and pest diagnosis.
            </p>
            <a
              href="tel:18001801551"
              className="w-full py-2 px-3 rounded-xl bg-[#003b1b] text-white text-xs font-bold hover:bg-[#14532d] transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Icon name="call" className="text-[16px]" />
              <span>1800-FARM-HUB (Toll Free)</span>
            </a>
          </div>

        </div>

      </div>

      {/* ADVISORY PDF PREVIEW MODAL */}
      {pdfModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📄</span>
                <h3 className="text-base font-bold text-[#003b1b]">Uzhavan Hub Agronomy Advisory v2.4</h3>
              </div>
              <button onClick={() => setPdfModalOpen(false)} className="text-gray-400 hover:text-black">✕</button>
            </div>
            
            <div className="space-y-2 text-xs bg-[#f8f7f0] p-4 rounded-2xl border">
              <div><strong>Farmer:</strong> {user?.fullName || 'Selvam V.'} ({user?.profile?.district || 'Thanjavur'}, TN)</div>
              <div><strong>Plot:</strong> {activePlot?.plot_name || 'Vadavaru River Plot'} ({plotAcres} Acres • {activePlot?.soil_type || 'Alluvial Clay'})</div>
              <div><strong>Top Recommendation:</strong> Paddy BPT 5204 (Andhra Ponni) - 96% Suitability Match</div>
              <div><strong>Soil Chemistry:</strong> pH 7.2 | Humus: High | CEC: 34 meq</div>
              <div><strong>Prescription:</strong> Vermicompost 2t/ac + Daincha Green Manure + DAP 45kg/ac</div>
              <div><strong>Verification:</strong> TNAU - KVK Thanjavur Digital Seal TN-THJ-2026-8849</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setPdfModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold">
                Close
              </button>
              <button
                onClick={() => { window.print(); setPdfModalOpen(false); }}
                className="px-5 py-2 rounded-xl bg-[#003b1b] text-white text-xs font-bold hover:bg-[#14532d] flex items-center gap-1.5"
              >
                <Icon name="print" className="text-[16px]" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
