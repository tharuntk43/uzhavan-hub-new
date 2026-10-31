import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { AlertCircle } from '../components/icons/LucideIcons.jsx';

const TN_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
  "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
  "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

const SOIL_OPTIONS = [
  "Clayey Alluvial Soil", "Red Loam Soil", "Black Cotton Soil (Regur)",
  "Sandy Loam Soil", "Laterite Soil", "Unknown"
];

const IRRIGATION_OPTIONS = [
  "Canal", "Borewell", "Canal + Deep Tube (High)", "Open Well", "Pond / Tank", "Rainfed", "Other"
];

export default function RegistrationPage({ onSuccess, onSwitchToLogin }) {
  const { register, language, showToast } = useAuth();
  const isTa = language === 'ta';

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal & Security
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    language: 'en',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    village: '',

    // Step 2: Farmer Profile
    farmerType: 'Owner',
    experienceYears: 10,
    primaryActivity: 'Grains & Oilseeds',
    avatar: '👨‍🌾',

    // Step 3: Multi-Plot Land Details
    noLandYet: false,
    plots: [
      {
        plotName: 'Primary Land Plot',
        area: 3.5,
        unit: 'acres',
        soilType: 'Clayey Alluvial Soil',
        soilPh: 7.0,
        fertilityNotes: 'Well-drained fertile land.',
        irrigationSource: 'Canal',
        waterAvailability: 'Abundant',
        currentCrop: 'Paddy',
        previousCrop: 'Pulses',
        plannedCrop: 'Black Gram',
        sowingDate: '2026-09-15',
        estimatedBudget: 30000
      }
    ]
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlotChange = (index, field, value) => {
    setFormData(prev => {
      const updatedPlots = [...prev.plots];
      updatedPlots[index] = { ...updatedPlots[index], [field]: value };
      return { ...prev, plots: updatedPlots };
    });
  };

  const addAnotherPlot = () => {
    setFormData(prev => ({
      ...prev,
      plots: [
        ...prev.plots,
        {
          plotName: `Farmland Plot ${prev.plots.length + 1}`,
          area: 2.0,
          unit: 'acres',
          soilType: 'Red Loam Soil',
          soilPh: 6.8,
          fertilityNotes: '',
          irrigationSource: 'Borewell',
          waterAvailability: 'Moderate',
          currentCrop: 'Groundnut',
          previousCrop: 'Millets',
          plannedCrop: 'Sesame',
          sowingDate: new Date().toISOString().split('T')[0],
          estimatedBudget: 20000
        }
      ]
    }));
  };

  const removePlot = (index) => {
    if (formData.plots.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      plots: prev.plots.filter((_, i) => i !== index)
    }));
  };

  const getNormalizedAcres = (area, unit) => {
    const a = parseFloat(area) || 0;
    if (unit === 'hectares' || unit === 'ha') return (a * 2.471).toFixed(2);
    if (unit === 'cents') return (a / 100.0).toFixed(2);
    return a.toFixed(2);
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address.';
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) return 'Please enter a valid 10-digit Indian mobile number.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    setStep(prev => Math.min(4, prev + 1));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const success = await register(formData);
      if (success) {
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      
      {/* WIZARD CONTAINER CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#c0c9be]/50">
        
        {/* WIZARD PROGRESS HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-[#14532d] uppercase tracking-wider">
                Step {step} of 4
              </span>
              <h1 className="text-2xl font-black text-[#003b1b] mt-0.5">
                {step === 1 && (isTa ? 'தனிப்பட்ட விவரங்கள் & பாதுகாப்பு' : 'Personal Details & Security')}
                {step === 2 && (isTa ? 'விவசாயி சுயவிவரம்' : 'Farmer Experience & Profile')}
                {step === 3 && (isTa ? 'விவசாய நில விவரங்கள்' : 'Farmland Plots & Soil Health')}
                {step === 4 && (isTa ? 'விவரங்களை சரிபார்த்து உறுதிசெய்க' : 'Review & Confirm Registration')}
              </h1>
            </div>
            <div className="text-3xl">🌾</div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-[#14532d]' : 'bg-[#e4f9e8]'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={18} className="text-red-700" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Personal Details & Security */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0e1f15] uppercase tracking-wider mb-1">
                  Full Name / முழுப்பெயர் *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Murugan P."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-sm focus:outline-none focus:border-[#14532d]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0e1f15] uppercase tracking-wider mb-1">
                  Email Address / மின்னஞ்சல் *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="farmer@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-sm focus:outline-none focus:border-[#14532d]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0e1f15] uppercase tracking-wider mb-1">
                  10-Digit Mobile / அலைபேசி எண் *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9842100000"
                  maxLength={10}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-sm focus:outline-none focus:border-[#14532d]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0e1f15] uppercase tracking-wider mb-1">
                  Preferred Language / மொழி
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-sm focus:outline-none focus:border-[#14532d]"
                >
                  <option value="en">English</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0e1f15] uppercase tracking-wider mb-1">
                  District / மாவட்டம் *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-sm focus:outline-none focus:border-[#14532d]"
                >
                  {TN_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0e1f15] uppercase tracking-wider mb-1">
                  Village or Town / கிராமம்
                </label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="e.g. Vadipatti"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-sm focus:outline-none focus:border-[#14532d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0e1f15] uppercase tracking-wider mb-1">
                  Password / கடவுச்சொல் *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-sm focus:outline-none focus:border-[#14532d]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0e1f15] uppercase tracking-wider mb-1">
                  Confirm Password / உறுதிசெய்க *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-type password"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-sm focus:outline-none focus:border-[#14532d]"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Farmer Profile */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#0e1f15] uppercase tracking-wider mb-2">
                Farmer Type / நில உரிமை வகை
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Owner', 'Tenant Farmer', 'Both'].map(t => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setFormData(prev => ({ ...prev, farmerType: t }))}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all ${
                      formData.farmerType === t
                        ? 'bg-[#14532d] text-white border-[#14532d] shadow-sm'
                        : 'bg-[#f8f7f0] text-[#0e1f15] border-[#c0c9be]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#0e1f15] uppercase tracking-wider">
                  Farming Experience / விவசாய அனுபவம்
                </label>
                <span className="text-sm font-bold text-[#14532d]">{formData.experienceYears} Years</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={formData.experienceYears}
                onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: parseInt(e.target.value, 10) }))}
                className="w-full accent-[#14532d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0e1f15] uppercase tracking-wider mb-2">
                Primary Farming Activity / முதன்மை விவசாயப் பிரிவு
              </label>
              <select
                name="primaryActivity"
                value={formData.primaryActivity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8f7f0] border border-[#c0c9be] text-sm focus:outline-none focus:border-[#14532d]"
              >
                <option value="Grains & Oilseeds">Grains & Oilseeds (Paddy, Groundnut, Sesame)</option>
                <option value="Horticulture">Horticulture (Banana, Vegetables, Flowers)</option>
                <option value="Cash Crops">Cash Crops (Cotton, Sugarcane)</option>
                <option value="Spices">Spices (Turmeric, Chilli)</option>
                <option value="Mixed with Dairy">Mixed Farming with Cattle & Dairy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0e1f15] uppercase tracking-wider mb-2">
                Select Farmer Avatar / சுயவிவரப் படம்
              </label>
              <div className="flex items-center gap-3">
                {['👨‍🌾', '👩‍🌾', '🌾', '🚜', '🌱'].map(av => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setFormData(prev => ({ ...prev, avatar: av }))}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-all ${
                      formData.avatar === av
                        ? 'bg-[#d9eddd] border-[#14532d] scale-110 shadow-sm'
                        : 'bg-[#f8f7f0] border-[#c0c9be]'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Multi-Plot Agricultural Land Details */}
        {step === 3 && (
          <div className="space-y-6">
            
            {/* "I don't own land yet" Toggle (Required by Module 2) */}
            <div className="p-4 rounded-2xl bg-[#e4f9e8] border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#003b1b] block">
                  I don't own agricultural land yet (நிலமற்ற விவசாயி / தொடக்க நிலை)
                </span>
                <span className="text-[11px] text-[#404941]">
                  You can register and access all farming services, machinery rentals, and labour bookings.
                </span>
              </div>
              <input
                type="checkbox"
                name="noLandYet"
                checked={formData.noLandYet}
                onChange={handleChange}
                className="w-5 h-5 accent-[#14532d] rounded cursor-pointer"
              />
            </div>

            {!formData.noLandYet && (
              <div className="space-y-6">
                {formData.plots.map((plot, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#f8f7f0] border border-[#c0c9be]/60 relative space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#14532d] text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-[#003b1b]">
                          {plot.plotName || `Farmland Plot ${idx + 1}`}
                        </h3>
                      </div>
                      {formData.plots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePlot(idx)}
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          Remove Plot
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0e1f15] uppercase mb-1">Plot Name</label>
                        <input
                          type="text"
                          value={plot.plotName}
                          onChange={(e) => handlePlotChange(idx, 'plotName', e.target.value)}
                          placeholder="e.g. North Canal Plot"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0e1f15] uppercase mb-1">Area Value</label>
                        <input
                          type="number"
                          step="0.1"
                          value={plot.area}
                          onChange={(e) => handlePlotChange(idx, 'area', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0e1f15] uppercase mb-1">Unit</label>
                        <select
                          value={plot.unit}
                          onChange={(e) => handlePlotChange(idx, 'unit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
                        >
                          <option value="acres">Acres (ஏக்கர்)</option>
                          <option value="hectares">Hectares (ஹெக்டேர்)</option>
                          <option value="cents">Cents (சென்ட்)</option>
                        </select>
                      </div>
                    </div>

                    {/* Normalized Acre Display */}
                    <div className="p-2 rounded-xl bg-emerald-50 text-[11px] text-[#14532d] font-semibold flex items-center justify-between">
                      <span>Normalized Cultivable Area:</span>
                      <span className="font-bold">{getNormalizedAcres(plot.area, plot.unit)} Acres</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0e1f15] uppercase mb-1">Soil Type / மண் வகை</label>
                        <select
                          value={plot.soilType}
                          onChange={(e) => handlePlotChange(idx, 'soilType', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
                        >
                          {SOIL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0e1f15] uppercase mb-1">Soil pH (Reaction)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="4.0"
                          max="9.5"
                          value={plot.soilPh}
                          onChange={(e) => handlePlotChange(idx, 'soilPh', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0e1f15] uppercase mb-1">Irrigation Source</label>
                        <select
                          value={plot.irrigationSource}
                          onChange={(e) => handlePlotChange(idx, 'irrigationSource', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
                        >
                          {IRRIGATION_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0e1f15] uppercase mb-1">Current Standing Crop</label>
                        <input
                          type="text"
                          value={plot.currentCrop}
                          onChange={(e) => handlePlotChange(idx, 'currentCrop', e.target.value)}
                          placeholder="e.g. Paddy BPT 5204"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0e1f15] uppercase mb-1">Estimated Budget (₹)</label>
                        <input
                          type="number"
                          value={plot.estimatedBudget}
                          onChange={(e) => handlePlotChange(idx, 'estimatedBudget', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#c0c9be] text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAnotherPlot}
                  className="w-full py-2.5 rounded-2xl border-2 border-dashed border-[#14532d] text-[#14532d] font-bold text-xs hover:bg-[#e4f9e8] transition-all flex items-center justify-center gap-2"
                >
                  <span>+</span>
                  <span>Add Another Farmland Plot / மற்றொரு நிலத்தைச் சேர்க்க</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Review and Confirmation */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#f8f7f0] border border-[#c0c9be]/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#14532d] uppercase">Personal Details</span>
                <button onClick={() => setStep(1)} className="text-xs font-bold text-[#003b1b] underline">Edit</button>
              </div>
              <div className="text-sm font-bold text-[#0e1f15]">{formData.fullName} ({formData.phone})</div>
              <div className="text-xs text-[#404941]">{formData.email} • {formData.district}, {formData.village || 'TN'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8f7f0] border border-[#c0c9be]/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#14532d] uppercase">Farmer Profile</span>
                <button onClick={() => setStep(2)} className="text-xs font-bold text-[#003b1b] underline">Edit</button>
              </div>
              <div className="text-sm font-bold text-[#0e1f15]">{formData.farmerType} • {formData.experienceYears} Years Exp</div>
              <div className="text-xs text-[#404941]">Primary Activity: {formData.primaryActivity}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8f7f0] border border-[#c0c9be]/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#14532d] uppercase">Registered Farmland Plots</span>
                <button onClick={() => setStep(3)} className="text-xs font-bold text-[#003b1b] underline">Edit</button>
              </div>
              {formData.noLandYet ? (
                <div className="text-xs text-[#404941] italic">Registered without land parcel (services only).</div>
              ) : (
                <div className="space-y-2">
                  {formData.plots.map((p, i) => (
                    <div key={i} className="text-xs bg-white p-2.5 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#003b1b] block">{p.plotName}</span>
                        <span className="text-[#404941]">{p.soilType} • Current: {p.currentCrop}</span>
                      </div>
                      <span className="font-bold text-[#14532d]">{getNormalizedAcres(p.area, p.unit)} Ac</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* WIZARD ACTION BUTTONS */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-[#0e1f15] text-xs font-bold hover:bg-slate-200 transition-all"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs text-[#003b1b] font-bold hover:underline"
            >
              Already have an account? Sign In
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#003b1b] text-white text-xs font-bold hover:bg-[#14532d] transition-all flex items-center gap-1.5"
            >
              <span>Next</span>
              <span>→</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-[#14532d] text-white text-xs font-bold hover:bg-[#003b1b] transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <span>{submitting ? 'Registering...' : 'Confirm & Open Dashboard'}</span>
              <span>🌾</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
