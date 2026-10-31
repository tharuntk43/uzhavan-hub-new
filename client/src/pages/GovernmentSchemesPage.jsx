import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function GovernmentSchemesPage() {
  const { user, plots } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 3-Question Eligibility Wizard State
  const [showWizard, setShowWizard] = useState(false);
  const [wizardLand, setWizardLand] = useState(plots[0]?.area_value || 3.0);
  const [wizardCategory, setWizardCategory] = useState('Marginal / Small Farmer (< 5 Acres)');
  const [wizardIrrigation, setWizardIrrigation] = useState('Borewell');
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const res = await api.getSchemes();
      const list = res.schemes || (Array.isArray(res) ? res : []);
      setSchemes(list);
    } catch (err) {
      console.error('Failed to load schemes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await api.checkSchemeEligibility({
        land_holding_acres: parseFloat(wizardLand),
        farmer_category: wizardCategory,
        irrigation_type: wizardIrrigation
      });
      setEligibilityResult(res);
    } catch (err) {
      // client-side rule fallback
      const land = parseFloat(wizardLand);
      const eligible = schemes.filter(s => {
        if (s.name.includes('Micro-Irrigation') && land > 12) return false;
        return true;
      });
      setEligibilityResult({
        status: 'success',
        farmerType: land <= 5 ? 'Small / Marginal Farmer' : 'Large Landholder',
        eligibleSchemes: eligible,
        dripSubsidyPct: land <= 5 ? 100 : 75,
        matchedCount: eligible.length
      });
    } finally {
      setChecking(false);
    }
  };

  const sponsors = ['all', 'Central Government', 'Tamil Nadu State Government'];

  const filteredSchemes = schemes.filter(s => {
    const matchesSponsor = selectedSponsor === 'all' || s.sponsor === selectedSponsor;
    const matchesSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nameTa && s.nameTa.includes(searchQuery)) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSponsor && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003b1b] to-[#14532d] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Icon name="account_balance" className="text-sm" />
            Direct Benefit Transfer (DBT) & Welfare Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Government Schemes & Subsidies
          </h1>
          <p className="text-emerald-100 text-sm mt-1 font-tamil">
            தமிழ்நாடு மற்றும் மத்திய அரசு மானியங்கள், நுண்ணீர்ப் பாசனம், பி.எம் கிசான் மற்றும் பயிர் காப்பீடு
          </p>
        </div>

        <button
          onClick={() => setShowWizard(!showWizard)}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold rounded-xl shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <Icon name="rule" className="" />
          {showWizard ? 'Close Eligibility Tool' : '3-Question Eligibility Check'}
        </button>
      </div>

      {/* 3-Question Eligibility Wizard Section */}
      {showWizard && (
        <div className="bg-emerald-50/70 border-2 border-emerald-600 rounded-2xl p-6 shadow-md transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-200">
            <div>
              <h2 className="text-lg font-black text-[#14532d] flex items-center gap-2">
                <Icon name="verified" className="" />
                Farmer Subsidy & Scheme Eligibility Engine
              </h2>
              <p className="text-xs text-stone-600 font-tamil">
                உங்கள் நில அளவு மற்றும் பாசன வகைக்கேற்ற 100% மானிய வாய்ப்புகளை கண்டறியுங்கள்
              </p>
            </div>
            <button
              onClick={() => setShowWizard(false)}
              className="text-stone-400 hover:text-stone-700"
            >
              <Icon name="close" className="" />
            </button>
          </div>

          <form onSubmit={handleCheckEligibility} className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                1. Total Landholding (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={wizardLand}
                onChange={(e) => setWizardLand(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                {parseFloat(wizardLand) <= 5 ? 'Eligible for Small Farmer 100% Drip Subsidy' : 'Large Landholder Tariff (75% Drip Subsidy)'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                2. Farmer Category
              </label>
              <select
                value={wizardCategory}
                onChange={(e) => setWizardCategory(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
              >
                <option value="Marginal / Small Farmer (< 5 Acres)">Marginal / Small (&lt; 5 Acres)</option>
                <option value="Women Farmer (மகளிர் விவசாயி)">Women Farmer (மகளிர் விவசாயி)</option>
                <option value="SC / ST Farmer">SC / ST Farmer Priority</option>
                <option value="Large Farmer (> 5 Acres)">General / Large Farmer (&gt; 5 Acres)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                3. Irrigation Infrastructure
              </label>
              <select
                value={wizardIrrigation}
                onChange={(e) => setWizardIrrigation(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
              >
                <option value="Borewell">Borewell (ஆழ்துளை கிணறு)</option>
                <option value="Open Well">Open Well (திறந்த கிணறு)</option>
                <option value="Canal">River / Canal Command</option>
                <option value="Rainfed (Dryland)">Rainfed (மானாவாரி பூமி)</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={checking}
                className="px-6 py-2.5 bg-[#14532d] hover:bg-[#003b1b] text-white rounded-xl text-sm font-bold shadow transition-all flex items-center gap-2"
              >
                {checking ? (
                  <>
                    <Icon name="progress_activity" className="animate-spin text-sm" />
                    Matching Eligibility Matrix...
                  </>
                ) : (
                  <>
                    <Icon name="check_circle" className="text-sm" />
                    Evaluate Eligible Subsidies
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Card */}
          {eligibilityResult && (
            <div className="mt-4 p-5 bg-white rounded-xl border border-emerald-300 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Icon name="task_alt" className="text-emerald-600" />
                  <span className="font-bold text-stone-900 text-sm">
                    Status: Qualified as <span className="text-[#14532d]">{eligibilityResult.farmerType || 'Small Farmer'}</span>
                  </span>
                </div>
                <div className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                  {eligibilityResult.dripSubsidyPct || (parseFloat(wizardLand) <= 5 ? 100 : 75)}% Drip & Sprinkler Subsidy Entitlement
                </div>
              </div>

              <div className="text-xs text-stone-600">
                You qualify for <strong className="text-stone-900">{eligibilityResult.eligibleSchemes?.length || schemes.length} welfare schemes</strong> under the Agriculture Department of Tamil Nadu & Central Ministry.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(eligibilityResult.eligibleSchemes || schemes).slice(0, 4).map((s, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                    <div className="font-bold text-stone-900">{s.name}</div>
                    <div className="text-stone-500 mt-1 line-clamp-2">{s.benefit}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Icon name="search" className="absolute left-3 top-2.5 text-stone-400 text-sm" />
          <input
            type="text"
            placeholder="Search schemes or subsidies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#14532d]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-stone-500 whitespace-nowrap">Sponsor:</span>
          {sponsors.map(sp => (
            <button
              key={sp}
              onClick={() => setSelectedSponsor(sp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSponsor === sp
                  ? 'bg-[#14532d] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {sp === 'all' ? 'All Schemes' : sp}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Directory List */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
          <Icon name="progress_activity" className="animate-spin text-3xl text-[#14532d]" />
          <p className="text-sm font-medium">Retrieving active subsidy schemes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    scheme.sponsor.includes('Tamil Nadu')
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {scheme.sponsor}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">{scheme.category}</span>
                </div>

                <h3 className="font-bold text-stone-900 text-base">{scheme.name}</h3>
                <p className="text-xs font-tamil text-stone-500 mt-0.5">{scheme.nameTa}</p>

                {/* Benefit Highlight */}
                <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-emerald-900 mb-1 flex items-center gap-1">
                    <Icon name="redeem" className="text-xs" />
                    Scheme Benefit
                  </div>
                  <div className="text-xs font-medium text-emerald-950 leading-relaxed">
                    {scheme.benefit}
                  </div>
                </div>

                {/* Eligibility text */}
                <div className="mt-3 text-xs text-stone-600">
                  <strong className="text-stone-800">Eligibility: </strong>
                  {scheme.eligibility}
                </div>

                {/* Documents Required Checklist */}
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <div className="text-[10px] uppercase font-bold text-stone-400 mb-2">Required Documentation</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {scheme.documentsRequired?.map((doc, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-1 text-[11px] text-stone-600">
                        <Icon name="check_box" className="text-emerald-700 text-xs" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link to Official Portal */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">Apply via CSC or Online</span>
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#14532d] hover:bg-[#003b1b] text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-1.5"
                >
                  <span>Apply on Official Portal</span>
                  <Icon name="open_in_new" className="text-xs" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
