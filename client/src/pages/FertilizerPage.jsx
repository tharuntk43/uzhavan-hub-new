import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function FertilizerPage() {
  const { activePlot } = useAuth();
  const [areaAcres, setAreaAcres] = useState(activePlot?.area_value || 2.5);
  const [selectedCrop, setSelectedCrop] = useState('Paddy (Ponni BPT 5204)');
  const [soilFertility, setSoilFertility] = useState('medium'); // low, medium, high
  const [soilPh, setSoilPh] = useState(activePlot?.soil_ph || 6.8);
  const [calcResult, setCalcResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateDosage();
  }, [areaAcres, selectedCrop, soilFertility, soilPh]);

  const calculateDosage = async () => {
    setLoading(true);
    try {
      const res = await api.calculateFertilizer({
        crop: selectedCrop,
        acres: parseFloat(areaAcres),
        fertility: soilFertility,
        ph: parseFloat(soilPh)
      });
      if (res.dosage || res.calculation) {
        setCalcResult(res.dosage || res.calculation);
      } else {
        // Local calculation fallback
        const acres = parseFloat(areaAcres) || 1;
        const mult = soilFertility === 'low' ? 1.2 : soilFertility === 'high' ? 0.85 : 1.0;
        const ureaTotal = Math.round(65 * acres * mult);
        const dapTotal = Math.round(54 * acres * mult);
        const mopTotal = Math.round(42 * acres * mult);
        const zincTotal = Math.round(10 * acres);

        setCalcResult({
          ureaKg: ureaTotal,
          dapKg: dapTotal,
          mopKg: mopTotal,
          zincKg: zincTotal,
          ureaBags: (ureaTotal / 45).toFixed(1),
          dapBags: (dapTotal / 50).toFixed(1),
          mopBags: (mopTotal / 50).toFixed(1),
          splits: [
            { stage: 'Basal (Land Preparation)', dapKg: dapTotal, mopKg: Math.round(mopTotal * 0.35), ureaKg: 0, zincKg: zincTotal, note: 'Incorporate thoroughly during last puddling' },
            { stage: 'Active Tillering (21-25 DAT)', dapKg: 0, mopKg: 0, ureaKg: Math.round(ureaTotal * 0.5), zincKg: 0, note: 'Broadcast under thin water film' },
            { stage: 'Panicle Initiation (45-50 DAT)', dapKg: 0, mopKg: Math.round(mopTotal * 0.65), ureaKg: Math.round(ureaTotal * 0.5), zincKg: 0, note: 'Promotes grain density and head size' }
          ],
          phRecommendation: soilPh < 6.2 
            ? 'Acidic Soil: Apply 200 kg Agricultural Lime (CaCO3) per acre during summer plowing.' 
            : soilPh > 8.0 
            ? 'Alkaline/Sodic Soil: Apply 400 kg Gypsum per acre with copious flushing.' 
            : 'Optimal Soil pH (6.5 - 7.5): Nutrient absorption capacity is maximal.'
        });
      }
    } catch (err) {
      console.error('Fertilizer calc error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003b1b] to-[#14532d] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Icon name="science" className="text-sm" />
            TNAU Precision Nutrient Management (4R Stewardship)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Fertilizer Dosing & Split Application Engine
          </h1>
          <p className="text-emerald-100 text-sm mt-1 font-tamil">
            தமிழ்நாடு வேளாண் பல்கலைக்கழக பரிந்துரைப்படி துல்லிய உர அளவு மற்றும் தவணை அட்டவணை
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-xs space-y-1">
          <div className="font-semibold text-emerald-200 flex items-center gap-1">
            <Icon name="eco" className="text-sm" />
            The 4R Nutrient Rule
          </div>
          <p className="text-stone-200">
            Right Source, Right Rate, Right Time, and Right Place for optimum crop absorption with zero leaching.
          </p>
        </div>
      </div>

      {/* Inputs Bar */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
            Cultivable Area (Acres)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.2"
            value={areaAcres}
            onChange={(e) => setAreaAcres(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-stone-50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
            Select Crop
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
          >
            <option value="Paddy (Ponni BPT 5204)">Paddy (Ponni BPT 5204)</option>
            <option value="Cotton (Bt Hybrid)">Cotton (Bt Hybrid)</option>
            <option value="Sugarcane (Co 86032)">Sugarcane (Co 86032)</option>
            <option value="Groundnut (TMV 7)">Groundnut (TMV 7)</option>
            <option value="Banana (Grand Naine)">Banana (Grand Naine)</option>
            <option value="Maize (Hybrid)">Maize (Hybrid)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
            Soil Fertility Status
          </label>
          <select
            value={soilFertility}
            onChange={(e) => setSoilFertility(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
          >
            <option value="low">Low Organic Carbon (&lt; 0.5%)</option>
            <option value="medium">Medium Fertility (0.5% - 0.75%)</option>
            <option value="high">High Organic Carbon (&gt; 0.75%)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
            Soil pH ({soilPh})
          </label>
          <input
            type="range"
            min="5.0"
            max="9.0"
            step="0.1"
            value={soilPh}
            onChange={(e) => setSoilPh(e.target.value)}
            className="w-full accent-[#14532d] mt-2"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-1">
            <span>5.0 Acid</span>
            <span>7.0 Neutral</span>
            <span>9.0 Alkali</span>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {calcResult && (
        <div className="space-y-6">
          {/* Total Fertilizer Requirement Cards */}
          <div>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Icon name="inventory_2" className="text-[#14532d]" />
              Total Fertilizer Requirements for {areaAcres} Acres
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center">
                <div className="text-[10px] uppercase font-bold text-stone-400">Urea (46% N)</div>
                <div className="text-2xl font-black text-[#14532d] my-1">{calcResult.ureaKg} kg</div>
                <div className="text-xs text-stone-500 font-medium">~{calcResult.ureaBags} Bags (45kg)</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center">
                <div className="text-[10px] uppercase font-bold text-stone-400">DAP (18-46-0)</div>
                <div className="text-2xl font-black text-[#14532d] my-1">{calcResult.dapKg} kg</div>
                <div className="text-xs text-stone-500 font-medium">~{calcResult.dapBags} Bags (50kg)</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center">
                <div className="text-[10px] uppercase font-bold text-stone-400">MOP Potash (60% K)</div>
                <div className="text-2xl font-black text-[#14532d] my-1">{calcResult.mopKg} kg</div>
                <div className="text-xs text-stone-500 font-medium">~{calcResult.mopBags} Bags (50kg)</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center">
                <div className="text-[10px] uppercase font-bold text-stone-400">Zinc Sulphate (21%)</div>
                <div className="text-2xl font-black text-amber-700 my-1">{calcResult.zincKg} kg</div>
                <div className="text-xs text-stone-500 font-medium">Micronutrient Dosing</div>
              </div>
            </div>
          </div>

          {/* Split Application Timing Table */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Icon name="splitscreen" className="text-[#14532d]" />
              Growth-Stage Split Application Schedule
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Growth Stage</th>
                    <th className="py-3 px-4 font-semibold">DAP (kg)</th>
                    <th className="py-3 px-4 font-semibold">Urea (kg)</th>
                    <th className="py-3 px-4 font-semibold">Potash (kg)</th>
                    <th className="py-3 px-4 font-semibold">Micronutrients</th>
                    <th className="py-3 px-4 font-semibold">Field Application Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {calcResult.splits?.map((s, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="py-3.5 px-4 font-bold text-stone-800">{s.stage}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#14532d]">{s.dapKg} kg</td>
                      <td className="py-3.5 px-4 font-semibold text-[#14532d]">{s.ureaKg} kg</td>
                      <td className="py-3.5 px-4 font-semibold text-[#14532d]">{s.mopKg} kg</td>
                      <td className="py-3.5 px-4 text-stone-600">{s.zincKg ? `${s.zincKg} kg Zinc` : '—'}</td>
                      <td className="py-3.5 px-4 text-stone-500 italic">{s.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Soil pH Amendment & Bio-manuring Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs space-y-2">
              <div className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                <Icon name="balance" className="text-base" />
                Soil pH Reclamation Advisory
              </div>
              <p className="text-amber-950 leading-relaxed font-medium">
                {calcResult.phRecommendation}
              </p>
              <div className="text-[11px] text-amber-800 pt-1">
                Note: Gypsum in groundnut also supplies essential Sulphur and Calcium for pod filling.
              </div>
            </div>

            <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs space-y-2">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                <Icon name="compost" className="text-base" />
                Organic & Bio-fertilizer Integration
              </div>
              <p className="text-emerald-950 leading-relaxed">
                Incorporate 5 tonnes of well-decomposed FYM or vermicompost per acre with 2 kg Azospirillum and 2 kg Phosphobacteria bio-inoculants to cut chemical nitrogen reliance by 25%.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
