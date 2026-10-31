import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

export default function VeterinaryPage() {
  const [hospitals, setHospitals] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'guides'
  const [selectedSpecies, setSelectedSpecies] = useState('Dairy Cow');

  useEffect(() => {
    fetchVetData();
  }, []);

  const fetchVetData = async () => {
    try {
      setLoading(true);
      const [hospRes, guideRes] = await Promise.all([
        api.getVeterinaryHospitals(),
        api.getLivestockGuides()
      ]);
      setHospitals(hospRes.hospitals || (Array.isArray(hospRes) ? hospRes : []));
      setGuides(guideRes.guides || (Array.isArray(guideRes) ? guideRes : []));
    } catch (err) {
      console.error('Failed to load vet data', err);
    } finally {
      setLoading(false);
    }
  };

  const districts = ['all', ...new Set(hospitals.map(h => h.district).filter(Boolean))];

  const filteredHospitals = hospitals.filter(h => {
    return selectedDistrict === 'all' || h.district === selectedDistrict;
  });

  const activeGuide = guides.find(g => g.species?.toLowerCase().includes(selectedSpecies.toLowerCase())) || guides[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1962 Emergency Animal Ambulance Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-red-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 text-white">
          <Icon name="ambulance" className="text-[160px]" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-rose-950/60 border border-rose-500/40 text-rose-200 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Icon name="warning" className="text-sm animate-pulse text-amber-400" />
            Tamil Nadu Animal Husbandry 24/7 Helpline
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Livestock Health & 1962 Animal Ambulance
          </h1>
          <p className="text-rose-100 text-sm mt-1 font-tamil">
            அவசர கால்நடை ஆம்புலன்ஸ் உதவி எண் 1962 மற்றும் நோய்த் தடுப்பு கையேடு
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href="tel:1962"
            className="px-6 py-3.5 bg-white text-rose-800 hover:bg-rose-50 font-black rounded-xl shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2 text-base"
          >
            <Icon name="call" className="text-rose-600" />
            Dial 1962 Toll-Free
          </a>
          <div className="text-xs text-rose-200 text-center sm:text-left">
            <span>24/7 Mobile Vet Unit</span>
            <br />
            <span>Doorstep Farm Care</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('directory')}
          className={`pb-3 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'directory'
              ? 'border-[#14532d] text-[#14532d]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Icon name="local_hospital" className="text-base" />
          Govt Veterinary Hospitals ({hospitals.length})
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`pb-3 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'guides'
              ? 'border-[#14532d] text-[#14532d]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Icon name="menu_book" className="text-base" />
          Disease Guides & Vaccination Schedule
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
          <Icon name="progress_activity" className="animate-spin text-3xl text-[#14532d]" />
          <p className="text-sm font-medium">Loading veterinary records...</p>
        </div>
      ) : activeTab === 'directory' ? (
        <div className="space-y-6">
          {/* District filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-stone-600">Filter By District:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
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

          {/* Hospital Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map(h => (
              <div key={h.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded">
                      {h.district} District Polyclinic
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                      <Icon name="verified" className="text-xs" />
                      TN Govt Verified
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base">{h.name}</h3>
                  <p className="text-xs font-tamil text-stone-500 mt-0.5">{h.nameTa}</p>

                  <div className="text-xs text-stone-600 mt-3 flex items-start gap-1.5">
                    <Icon name="location_on" className="text-sm text-stone-400 mt-0.5" />
                    <span>{h.address}</span>
                  </div>

                  <div className="text-xs text-stone-600 mt-2 flex items-center gap-1.5">
                    <Icon name="schedule" className="text-sm text-[#14532d]" />
                    <span>{h.openHours}</span>
                  </div>

                  {/* Facilities */}
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <div className="text-[10px] uppercase font-bold text-stone-400 mb-1.5">Equipped Facilities</div>
                    <div className="flex flex-wrap gap-1">
                      {h.facilities?.map((f, fIdx) => (
                        <span key={fIdx} className="bg-stone-100 text-stone-700 text-[10px] px-2 py-0.5 rounded font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">Hospital Desk</div>
                    <div className="text-xs font-bold text-stone-800">{h.phone}</div>
                  </div>
                  <a
                    href={`tel:${h.phone}`}
                    className="px-4 py-2 bg-[#14532d] hover:bg-[#003b1b] text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-1.5"
                  >
                    <Icon name="call" className="text-sm" />
                    Direct Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Disease Guides & Vaccine Schedules */
        <div className="space-y-6">
          {/* Species selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedSpecies('Dairy Cow')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                selectedSpecies === 'Dairy Cow'
                  ? 'bg-[#14532d] text-white shadow'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>🐄</span>
              Dairy Cattle (கறவை மாடு)
            </button>
            <button
              onClick={() => setSelectedSpecies('Goat')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                selectedSpecies === 'Goat'
                  ? 'bg-[#14532d] text-white shadow'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>🐐</span>
              Goat & Sheep (ஆடு வளர்ப்பு)
            </button>
          </div>

          {activeGuide && (
            <div className="space-y-6">
              {/* Common Conditions Accordion / Cards */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <Icon name="medical_services" className="text-[#14532d]" />
                  Critical Livestock Diseases & Emergency First Aid
                </h3>

                <div className="space-y-4">
                  {activeGuide.commonConditions?.map((cond, cIdx) => (
                    <div key={cIdx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-bold text-stone-900 text-base">{cond.disease}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          cond.vetUrgency.toLowerCase().includes('emergency')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cond.vetUrgency}
                        </span>
                      </div>

                      <div className="text-xs text-stone-700">
                        <strong className="text-stone-900">Symptoms: </strong>
                        {cond.symptoms}
                      </div>

                      <div className="text-xs text-emerald-900 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200">
                        <strong className="text-emerald-950">Immediate Farm First-Aid: </strong>
                        {cond.firstAid}
                      </div>

                      <div className="text-xs text-stone-500">
                        <strong>Prevention: </strong>
                        {cond.prevention}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vaccination Schedule Table */}
              {activeGuide.vaccinationCalendar && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Icon name="vaccines" className="text-[#14532d]" />
                    Tamil Nadu Free Vaccination Calendar (தடுப்பூசி அட்டவணை)
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-500 uppercase border-b border-stone-200">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Vaccine Name</th>
                          <th className="py-3 px-4 font-semibold">Eligible Age</th>
                          <th className="py-3 px-4 font-semibold">Frequency / Month</th>
                          <th className="py-3 px-4 font-semibold">Department Provision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {activeGuide.vaccinationCalendar.map((v, vIdx) => (
                          <tr key={vIdx} className="hover:bg-stone-50">
                            <td className="py-3 px-4 font-bold text-stone-800">{v.vaccine}</td>
                            <td className="py-3 px-4 text-stone-600">{v.age}</td>
                            <td className="py-3 px-4 font-medium text-emerald-800">{v.frequency}</td>
                            <td className="py-3 px-4 text-stone-500">
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                                {v.department}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
