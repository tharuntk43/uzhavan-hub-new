import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

export default function MarketPricesPage() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Harvest Proceeds Calculator state
  const [calcCrop, setCalcCrop] = useState(null);
  const [calcQuantity, setCalcQuantity] = useState(40); // quintals
  const [calcDistance, setCalcDistance] = useState(25); // km to mandi

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const res = await api.getMarketPrices();
      const list = res.prices || res.data || (Array.isArray(res) ? res : []);
      setPrices(list);
      if (list.length > 0 && !calcCrop) {
        setCalcCrop(list[0]);
      }
    } catch (err) {
      console.error('Failed to load market prices', err);
    } finally {
      setLoading(false);
    }
  };

  const districts = ['all', ...new Set(prices.map(p => p.district).filter(Boolean))];

  const filteredPrices = prices.filter(p => {
    const matchesDistrict = selectedDistrict === 'all' || p.district === selectedDistrict;
    const matchesSearch = !searchQuery || 
      p.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.commodityTa && p.commodityTa.includes(searchQuery)) ||
      (p.market && p.market.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDistrict && matchesSearch;
  });

  // Calculate Net Proceeds for 3 Channels
  const getProceedsAnalysis = () => {
    if (!calcCrop) return null;
    const qtl = parseFloat(calcQuantity) || 1;
    const dist = parseFloat(calcDistance) || 10;
    const baseRate = calcCrop.wholesalePriceQtl || 2000;

    // 1. Mandi (APMC)
    const mandiGross = baseRate * qtl;
    const mandiTransport = (dist * 18 * (qtl / 10)); // ~18 Rs/km per ton
    const mandiHandling = qtl * 25; // unload/weighment
    const mandiCommission = mandiGross * 0.015; // 1.5% statutory market fee
    const mandiNet = mandiGross - mandiTransport - mandiHandling - mandiCommission;

    // 2. FPO Collective Procurement
    const fpoRate = calcCrop.fpoProcurementReturns || (baseRate * 1.02);
    const fpoGross = fpoRate * qtl;
    const fpoTransport = (dist * 10 * (qtl / 10)); // shared logistics discount
    const fpoHandling = qtl * 10;
    const fpoNet = fpoGross - fpoTransport - fpoHandling;

    // 3. Farmgate Direct Cash Pickup
    const farmgateRate = calcCrop.directFarmgateReturns || (baseRate * 0.96);
    const farmgateGross = farmgateRate * qtl;
    const farmgateTransport = 0; // Buyer bears logistics
    const farmgateHandling = 0;
    const farmgateNet = farmgateGross;

    const highest = Math.max(mandiNet, fpoNet, farmgateNet);
    let bestChannel = 'FPO Procurement';
    if (highest === mandiNet) bestChannel = 'Regulated APMC Mandi';
    if (highest === farmgateNet) bestChannel = 'Direct Farmgate Pickup';

    return {
      qtl,
      mandi: { gross: mandiGross, deductions: mandiTransport + mandiHandling + mandiCommission, net: mandiNet, rate: baseRate },
      fpo: { gross: fpoGross, deductions: fpoTransport + fpoHandling, net: fpoNet, rate: fpoRate },
      farmgate: { gross: farmgateGross, deductions: 0, net: farmgateNet, rate: farmgateRate },
      bestChannel
    };
  };

  const analysis = getProceedsAnalysis();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003b1b] to-[#14532d] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Icon name="trending_up" className="text-sm" />
            TN Agmarknet & APMC Price Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Market Spot Prices & Sell-or-Hold Advisor
          </h1>
          <p className="text-emerald-100 text-sm mt-1 font-tamil">
            தமிழ்நாடு ஒழுங்குமுறை விற்பனைக் கூடங்களின் நேரடி விலை நிலவரம் மற்றும் விற்பனை உத்தி
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-xs space-y-1 max-w-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <Icon name="info" className="text-sm" />
            Benchmark Data Note
          </div>
          <p className="text-stone-200">
            Current daily prices reflect Tamil Nadu Regulated Market Committee benchmark tenders. Always verify final lot quality with your local market secretary.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Icon name="search" className="absolute left-3 top-2.5 text-stone-400 text-sm" />
          <input
            type="text"
            placeholder="Search crop or market (e.g. Paddy, Thanjavur)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#14532d] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-stone-500 whitespace-nowrap">District:</span>
          {districts.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedDistrict === d
                  ? 'bg-[#14532d] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {d === 'all' ? 'All Districts' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Price Cards */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
          <Icon name="progress_activity" className="animate-spin text-3xl text-[#14532d]" />
          <p className="text-sm font-medium">Fetching daily APMC spot rates & trends...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrices.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md cursor-pointer ${
                calcCrop?.id === item.id ? 'border-[#14532d] ring-2 ring-[#14532d]/20 bg-emerald-50/20' : 'border-stone-200'
              }`}
              onClick={() => setCalcCrop(item)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                    {item.commodity}
                    {calcCrop?.id === item.id && (
                      <span className="bg-[#14532d] text-white text-[10px] px-1.5 py-0.5 rounded font-normal">Active in Calc</span>
                    )}
                  </h3>
                  <p className="text-xs font-tamil text-stone-500">{item.commodityTa}</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${
                  item.changeDirection === 'up'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  <Icon name="{item.changeDirection === 'up' ? 'arrow_upward' : 'arrow_downward'}" className="text-xs" />
                  ₹{Math.abs(item.priceChange7d)} / 7d
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Wholesale APMC</div>
                  <div className="text-2xl font-black text-[#14532d]">
                    ₹{item.wholesalePriceQtl.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-stone-500"> / Quintal</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Retail Approx</div>
                  <div className="text-sm font-bold text-stone-700">₹{item.retailPriceKg} / kg</div>
                </div>
              </div>

              {/* 7-Day Sparkline representation */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                  <span>7-Day Price Trajectory</span>
                  <span className="font-medium text-stone-600">{item.market}</span>
                </div>
                <div className="flex items-end gap-1.5 h-10 pt-2 border-b border-stone-200">
                  {item.trend7Days && item.trend7Days.map((val, idx) => {
                    const min = Math.min(...item.trend7Days);
                    const max = Math.max(...item.trend7Days);
                    const heightPct = max === min ? 60 : Math.round(((val - min) / (max - min)) * 60) + 30;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full rounded-t transition-all ${
                            idx === item.trend7Days.length - 1
                              ? 'bg-[#14532d]'
                              : 'bg-emerald-200 group-hover:bg-emerald-400'
                          }`}
                        />
                        <div className="hidden group-hover:block absolute -top-7 bg-stone-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                          ₹{val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strategy Advice Badge */}
              <div className="mt-4 p-2.5 bg-stone-50 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium text-stone-700">
                  <Icon name="psychology_alt" className="text-sm text-amber-600" />
                  <span className="line-clamp-1">{item.recommendation}</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-stone-200 text-stone-700 rounded">
                  {item.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Module 12 Special: Harvest Proceeds Net Calculator (Mandi vs FPO vs Farmgate) */}
      {analysis && calcCrop && (
        <div className="bg-white rounded-2xl border-2 border-stone-200 p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#14532d] mb-1">
                <Icon name="calculate" className="text-sm" />
                Comparative Channel Profitability Model
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                Harvest Proceeds Net In-Hand Calculator
              </h2>
              <p className="text-xs text-stone-500 font-tamil">
                சந்தை இடைத்தரகர் செலவுகள், போக்குவரத்து கழித்து கையில் கிடைக்கும் நிகர லாப ஒப்பீடு
              </p>
            </div>
            <div className="flex items-center gap-4 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-stone-600">Optimal Channel:</span>
              <span className="px-3 py-1 bg-[#14532d] text-white text-xs font-bold rounded-lg shadow-sm">
                🏆 {analysis.bestChannel}
              </span>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Selected Commodity</label>
              <div className="font-bold text-stone-800 text-sm bg-white p-2.5 rounded-lg border border-stone-200">
                {calcCrop.commodity}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">
                Harvest Volume: <span className="text-[#14532d] font-bold">{calcQuantity} Quintals</span>
              </label>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={calcQuantity}
                onChange={(e) => setCalcQuantity(e.target.value)}
                className="w-full accent-[#14532d] cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>5 Qtl</span>
                <span>100 Qtl</span>
                <span>250 Qtl</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">
                Distance to APMC Mandi: <span className="text-[#14532d] font-bold">{calcDistance} km</span>
              </label>
              <input
                type="range"
                min="2"
                max="100"
                step="2"
                value={calcDistance}
                onChange={(e) => setCalcDistance(e.target.value)}
                className="w-full accent-[#14532d] cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>2 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
            </div>
          </div>

          {/* 3 Channels Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Channel 1: Mandi */}
            <div className={`p-5 rounded-xl border-2 flex flex-col justify-between transition-all ${
              analysis.bestChannel === 'Regulated APMC Mandi'
                ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-md'
                : 'border-stone-200 bg-white'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Icon name="storefront" className="text-[#14532d]" />
                    Regulated APMC Yard
                  </div>
                  {analysis.bestChannel === 'Regulated APMC Mandi' && (
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">Highest Net</span>
                  )}
                </div>
                <div className="text-xs text-stone-500 mb-4">
                  Official government yard tender with weighing scales & e-NAM settlement.
                </div>
                <div className="space-y-2 text-xs border-t border-stone-200/80 pt-3">
                  <div className="flex justify-between text-stone-600">
                    <span>Base Tender Rate:</span>
                    <span className="font-semibold">₹{analysis.mandi.rate} / Qtl</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Gross Lot Value:</span>
                    <span className="font-semibold">₹{Math.round(analysis.mandi.gross).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>Logistics & Handling Deductions:</span>
                    <span className="font-semibold">- ₹{Math.round(analysis.mandi.deductions).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200">
                <div className="text-[10px] uppercase font-bold text-stone-400">Net In-Hand Revenue</div>
                <div className="text-2xl font-black text-stone-900">
                  ₹{Math.round(analysis.mandi.net).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Channel 2: FPO Procurement */}
            <div className={`p-5 rounded-xl border-2 flex flex-col justify-between transition-all ${
              analysis.bestChannel === 'FPO Procurement'
                ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-md'
                : 'border-stone-200 bg-white'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Icon name="groups" className="text-[#14532d]" />
                    Farmer Producer Org (FPO)
                  </div>
                  {analysis.bestChannel === 'FPO Procurement' && (
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">Highest Net</span>
                  )}
                </div>
                <div className="text-xs text-stone-500 mb-4">
                  Collective village collection center, patronage dividend bonus, minimal transit loss.
                </div>
                <div className="space-y-2 text-xs border-t border-stone-200/80 pt-3">
                  <div className="flex justify-between text-stone-600">
                    <span>Collective FPO Rate:</span>
                    <span className="font-semibold">₹{analysis.fpo.rate} / Qtl</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Gross Aggregated Value:</span>
                    <span className="font-semibold">₹{Math.round(analysis.fpo.gross).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>Subsidized Village Transport:</span>
                    <span className="font-semibold">- ₹{Math.round(analysis.fpo.deductions).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200">
                <div className="text-[10px] uppercase font-bold text-stone-400">Net In-Hand Revenue</div>
                <div className="text-2xl font-black text-[#14532d]">
                  ₹{Math.round(analysis.fpo.net).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Channel 3: Farmgate Direct Pickup */}
            <div className={`p-5 rounded-xl border-2 flex flex-col justify-between transition-all ${
              analysis.bestChannel === 'Direct Farmgate Pickup'
                ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-md'
                : 'border-stone-200 bg-white'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Icon name="local_shipping" className="text-[#14532d]" />
                    Direct Farmgate Pickup
                  </div>
                  {analysis.bestChannel === 'Direct Farmgate Pickup' && (
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">Highest Net</span>
                  )}
                </div>
                <div className="text-xs text-stone-500 mb-4">
                  Merchant arrives at field with truck. Instant spot cash settlement, zero haulage cost.
                </div>
                <div className="space-y-2 text-xs border-t border-stone-200/80 pt-3">
                  <div className="flex justify-between text-stone-600">
                    <span>Spot Cash Rate:</span>
                    <span className="font-semibold">₹{analysis.farmgate.rate} / Qtl</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Gross Spot Value:</span>
                    <span className="font-semibold">₹{Math.round(analysis.farmgate.gross).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Farmer Transport & Loading:</span>
                    <span className="font-semibold">₹0 (Buyer pays)</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200">
                <div className="text-[10px] uppercase font-bold text-stone-400">Net In-Hand Revenue</div>
                <div className="text-2xl font-black text-stone-900">
                  ₹{Math.round(analysis.farmgate.net).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
