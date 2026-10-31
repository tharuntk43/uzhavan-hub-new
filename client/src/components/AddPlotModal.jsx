import React, { useState } from 'react';
import api from '../services/api.js';
import { MapPin, X, AlertCircle, CheckCircle, Sprout } from './icons/LucideIcons.jsx';

export default function AddPlotModal({ isOpen, onClose, onPlotAdded }) {
  const [formData, setFormData] = useState({
    plot_name: '',
    area_value: 2.5,
    area_unit: 'acres',
    soil_type: 'red',
    soil_ph: 6.8,
    fertility_notes: 'Medium organic carbon, responsive to compost',
    irrigation_source: 'borewell',
    water_availability: 'moderate',
    current_crop: 'Paddy (Ponni)',
    previous_crop: 'Black Gram',
    planned_crop: 'Groundnut',
    sowing_date: new Date().toISOString().split('T')[0],
    budget: 35000
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const calculateNormalizedAcres = () => {
    const val = parseFloat(formData.area_value) || 0;
    if (formData.area_unit === 'hectares') return (val * 2.47105).toFixed(2);
    if (formData.area_unit === 'cents') return (val * 0.01).toFixed(2);
    return val.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.plot_name.trim()) {
      setError('Please provide a plot title/name');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.addPlot({
        ...formData,
        area_value: parseFloat(formData.area_value),
        soil_ph: parseFloat(formData.soil_ph),
        budget: parseFloat(formData.budget)
      });
      if (res.plot || res.id) {
        onPlotAdded && onPlotAdded(res.plot || res);
        onClose();
      } else {
        setError(res.error || 'Failed to create plot');
      }
    } catch (err) {
      setError(err.message || 'Error saving plot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <MapPin size={20} className="text-[#14532d]" />
              Add Farmland Plot
            </h2>
            <p className="text-xs text-stone-500 font-tamil">புதிய நிலப்பரப்பு விவரங்களை சேர்க்கவும்</p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Plot Name / நிலத்தின் பெயர் *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vadakku Kadu (North Field)"
              value={formData.plot_name}
              onChange={(e) => setFormData({ ...formData, plot_name: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Area Value / பரப்பளவு *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                required
                value={formData.area_value}
                onChange={(e) => setFormData({ ...formData, area_value: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Unit / அலகு
              </label>
              <select
                value={formData.area_unit}
                onChange={(e) => setFormData({ ...formData, area_unit: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent text-sm bg-white"
              >
                <option value="acres">Acres (ஏக்கர்)</option>
                <option value="hectares">Hectares (ஹெக்டேர்)</option>
                <option value="cents">Cents (சென்ட்)</option>
              </select>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
            <span className="font-medium">Normalized Cultivable Area:</span>
            <span className="font-bold text-sm text-[#14532d]">{calculateNormalizedAcres()} Standard Acres</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Soil Type / மண் வகை
              </label>
              <select
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#14532d] text-sm bg-white"
              >
                <option value="red">Red Soil (செம்மண்)</option>
                <option value="black">Black Soil (கரிசல் மண்)</option>
                <option value="alluvial">Alluvial Soil (வண்டல் மண்)</option>
                <option value="clay">Clay Soil (களிமண்)</option>
                <option value="sandy_loam">Sandy Loam (மணல் கலந்த சரளை)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Soil pH ({formData.soil_ph})
              </label>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={formData.soil_ph}
                onChange={(e) => setFormData({ ...formData, soil_ph: e.target.value })}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#14532d] mt-2"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>4.5 (Acidic)</span>
                <span>7.0 (Neutral)</span>
                <span>9.0 (Alkaline)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Irrigation Source / பாசன ஆதாரம்
              </label>
              <select
                value={formData.irrigation_source}
                onChange={(e) => setFormData({ ...formData, irrigation_source: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
              >
                <option value="borewell">Borewell (ஆழ்துளை கிணறு)</option>
                <option value="canal">Canal (கால்வாய் பாசனம்)</option>
                <option value="open_well">Open Well (திறந்த கிணறு)</option>
                <option value="tank">Tank / Pond (ஏரி/குளம்)</option>
                <option value="rainfall">Rainfed (மானாவாரி)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Water Availability / நீர் இருப்பு
              </label>
              <select
                value={formData.water_availability}
                onChange={(e) => setFormData({ ...formData, water_availability: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
              >
                <option value="abundant">Abundant (போதிய அளவு)</option>
                <option value="moderate">Moderate (நடுத்தரம்)</option>
                <option value="deficit">Seasonal / Deficit (பற்றாக்குறை)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Current Crop
              </label>
              <input
                type="text"
                placeholder="e.g. Paddy"
                value={formData.current_crop}
                onChange={(e) => setFormData({ ...formData, current_crop: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Previous Crop
              </label>
              <input
                type="text"
                placeholder="e.g. Grams"
                value={formData.previous_crop}
                onChange={(e) => setFormData({ ...formData, previous_crop: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Budget (₹)
              </label>
              <input
                type="number"
                step="500"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-stone-600 rounded-xl hover:bg-stone-50 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#14532d] hover:bg-[#003b1b] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sprout size={16} className="animate-spin" />
                  Saving Plot...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Save Farmland Plot
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
