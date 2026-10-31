import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function FarmLabourPage() {
  const { user, plots } = useAuth();
  const [labourTeams, setLabourTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Booking Form state
  const [bookingForm, setBookingForm] = useState({
    work_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    workers_count: 6,
    operation: 'Transplanting (நடவு)',
    plot_id: plots[0]?.id || '',
    notes: 'Morning shift preferred starting 7:30 AM'
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    fetchLabourList();
  }, []);

  const fetchLabourList = async () => {
    try {
      setLoading(true);
      const res = await api.getLabourListings();
      const list = res.listings || (Array.isArray(res) ? res : []);
      setLabourTeams(list);
    } catch (err) {
      console.error('Failed to load labour listings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (team) => {
    setSelectedTeam(team);
    setBookingForm(prev => ({
      ...prev,
      workers_count: Math.min(team.teamSize, 6),
      plot_id: plots[0]?.id || ''
    }));
    setIsBookingModalOpen(true);
  };

  const handleBookLabour = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
    setBookingSubmitting(true);
    try {
      const res = await api.bookLabour({
        labour_id: selectedTeam.id,
        work_date: bookingForm.work_date,
        workers_count: parseInt(bookingForm.workers_count),
        operation: bookingForm.operation,
        plot_id: bookingForm.plot_id,
        notes: bookingForm.notes
      });

      const newBooking = {
        id: res.id || 'bkg_' + Date.now(),
        teamName: selectedTeam.name,
        leaderName: selectedTeam.leaderName,
        phone: selectedTeam.contactPhone,
        workDate: bookingForm.work_date,
        workers: bookingForm.workers_count,
        operation: bookingForm.operation,
        estTotal: parseInt(bookingForm.workers_count) * selectedTeam.dailyWagePerWorker,
        status: 'Confirmed'
      };

      setMyBookings(prev => [newBooking, ...prev]);
      setBookingSuccess(`Booking request submitted successfully to ${selectedTeam.leaderName}!`);
      setIsBookingModalOpen(false);
      setTimeout(() => setBookingSuccess(null), 6000);
    } catch (err) {
      alert('Booking error: ' + (err.message || 'Please check your inputs'));
    } finally {
      setBookingSubmitting(false);
    }
  };

  const districts = ['all', ...new Set(labourTeams.map(t => t.district).filter(Boolean))];
  const allSkills = ['all', 'Transplanting', 'Weeding', 'Harvesting', 'Spraying', 'Dehusking'];

  const filteredTeams = labourTeams.filter(t => {
    const matchesDistrict = selectedDistrict === 'all' || t.district === selectedDistrict;
    const matchesSkill = selectedSkill === 'all' || 
      (t.primarySkills && t.primarySkills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase())));
    return matchesDistrict && matchesSkill;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003b1b] to-[#14532d] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Icon name="groups_3" className="text-sm" />
            Verified Agriculture Labour Aggregation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Agricultural Labour Directory & Booking
          </h1>
          <p className="text-emerald-100 text-sm mt-1 font-tamil">
            நம்பகமான விவசாய கூலித் தொழிலாளர்கள் மற்றும் நடவு/அறுவடை குழுவினர் முன்பதிவு
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-xs space-y-1">
          <div className="font-semibold text-emerald-200 flex items-center gap-1">
            <Icon name="verified_user" className="text-sm" />
            Fair Wage Standard
          </div>
          <p className="text-stone-200">
            Transparent daily wage rates with no hidden contractor commission. Direct contact with team captains.
          </p>
        </div>
      </div>

      {bookingSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Icon name="check_circle" className="text-emerald-600" />
            <span className="text-sm font-semibold">{bookingSuccess}</span>
          </div>
          <button onClick={() => setBookingSuccess(null)} className="text-emerald-600 hover:text-emerald-900 text-sm">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-stone-500 whitespace-nowrap">Skill:</span>
          {allSkills.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSkill(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedSkill === s
                  ? 'bg-[#795548] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {s === 'all' ? 'All Tasks' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Labour Directory Cards */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
          <Icon name="progress_activity" className="animate-spin text-3xl text-[#14532d]" />
          <p className="text-sm font-medium">Loading village labour federations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-stone-900 text-lg">{team.name}</h3>
                    <p className="text-xs font-tamil text-stone-500">{team.nameTa}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-stone-600">
                      <Icon name="location_on" className="text-sm text-[#14532d]" />
                      <span>{team.village}, {team.district} ({team.distanceKm || '3.5'} km away)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#14532d]">
                      ₹{team.dailyWagePerWorker}
                    </div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">per worker / day</div>
                  </div>
                </div>

                {/* Team meta */}
                <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-stone-100 text-center">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">Crew Size</div>
                    <div className="text-sm font-bold text-stone-800">{team.teamSize} Workers</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">Completed</div>
                    <div className="text-sm font-bold text-stone-800">{team.completedJobs} Jobs</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">Rating</div>
                    <div className="text-sm font-bold text-amber-600 flex items-center justify-center gap-1">
                      <Icon name="star" className="text-xs" />
                      {team.rating || 4.8}
                    </div>
                  </div>
                </div>

                {/* Skill tags */}
                <div className="mb-4">
                  <div className="text-[10px] uppercase font-bold text-stone-400 mb-1.5">Specialized Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {team.primarySkills?.map((skill, sIdx) => (
                      <span key={sIdx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-stone-500 flex items-center gap-1.5 mb-4">
                  <Icon name="schedule" className="text-sm text-stone-400" />
                  <span>Shift: {team.workingHours}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <a
                  href={`tel:${team.contactPhone}`}
                  className="px-4 py-2 border border-stone-300 hover:border-stone-400 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Icon name="call" className="text-sm text-[#14532d]" />
                  Call Captain
                </a>
                <button
                  onClick={() => handleOpenBooking(team)}
                  className="flex-1 py-2 bg-[#14532d] hover:bg-[#003b1b] text-white rounded-xl text-xs font-semibold transition-all shadow flex items-center justify-center gap-1.5"
                >
                  <Icon name="calendar_month" className="text-sm" />
                  Book Farm Crew
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Bookings Tracker Section */}
      {myBookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Icon name="checklist" className="text-[#14532d]" />
            My Active Labour Bookings ({myBookings.length})
          </h2>
          <div className="space-y-3">
            {myBookings.map((b) => (
              <div key={b.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-stone-900 text-sm">{b.teamName}</div>
                  <div className="text-xs text-stone-500">
                    Leader: {b.leaderName} ({b.phone}) | Operation: <span className="font-medium text-stone-700">{b.operation}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-stone-400">Date:</span> <span className="font-bold text-stone-800">{b.workDate}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Workers:</span> <span className="font-bold text-stone-800">{b.workers}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Est. Total:</span> <span className="font-bold text-[#14532d]">₹{b.estTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-lg">Book Farm Crew</h3>
                <p className="text-xs text-stone-500">{selectedTeam.name}</p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-full"
              >
                <Icon name="close" className="" />
              </button>
            </div>

            <form onSubmit={handleBookLabour} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Date of Work / வேலை நாள்</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingForm.work_date}
                  onChange={(e) => setBookingForm({ ...bookingForm, work_date: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Workers Needed (Max {selectedTeam.teamSize})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTeam.teamSize}
                    required
                    value={bookingForm.workers_count}
                    onChange={(e) => setBookingForm({ ...bookingForm, workers_count: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Farmland Plot</label>
                  <select
                    value={bookingForm.plot_id}
                    onChange={(e) => setBookingForm({ ...bookingForm, plot_id: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                  >
                    {plots.map(p => (
                      <option key={p.id} value={p.id}>{p.plot_name} ({p.area_value} {p.area_unit})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Farm Operation</label>
                <select
                  value={bookingForm.operation}
                  onChange={(e) => setBookingForm({ ...bookingForm, operation: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  <option value="Transplanting (நடவு)">Transplanting (நாற்று நடுதல்)</option>
                  <option value="Weeding (களை எடுத்தல்)">Weeding (களை எடுத்தல்)</option>
                  <option value="Harvesting (அறுவடை)">Harvesting (அறுவடை பணிகள்)</option>
                  <option value="Fertilizer / Spraying">Fertilizer Application / Spraying</option>
                  <option value="Land Preparation">Bund trimming / Land Preparation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Special Instructions / Notes</label>
                <textarea
                  rows="2"
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  placeholder="e.g. Bring own sickle, tea provided"
                />
              </div>

              {/* Estimate Breakdown */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-emerald-800 font-semibold">Estimated Daily Cost:</div>
                  <div className="text-xs text-stone-500">{bookingForm.workers_count} workers × ₹{selectedTeam.dailyWagePerWorker}</div>
                </div>
                <div className="text-xl font-black text-[#14532d]">
                  ₹{(parseInt(bookingForm.workers_count || 0) * selectedTeam.dailyWagePerWorker).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="px-6 py-2 bg-[#14532d] hover:bg-[#003b1b] text-white rounded-xl text-xs font-semibold transition-all shadow disabled:opacity-50"
                >
                  {bookingSubmitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
