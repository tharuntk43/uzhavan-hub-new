import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MachineryRentalPage() {
  const { user, plots } = useAuth();
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [operatorOnly, setOperatorOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Booking state
  const [bookingType, setBookingType] = useState('hourly'); // 'hourly' or 'daily'
  const [bookingUnits, setBookingUnits] = useState(4); // hours or days
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingPlotId, setBookingPlotId] = useState(plots[0]?.id || '');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    fetchMachinery();
  }, []);

  const fetchMachinery = async () => {
    try {
      setLoading(true);
      const res = await api.getMachinery();
      const list = res.machinery || (Array.isArray(res) ? res : []);
      setMachinery(list);
    } catch (err) {
      console.error('Failed to load machinery catalog', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(machinery.map(m => m.category).filter(Boolean))];
  const districts = ['all', ...new Set(machinery.map(m => m.district).filter(Boolean))];

  const filteredMachines = machinery.filter(m => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesDist = selectedDistrict === 'all' || m.district === selectedDistrict;
    const matchesOp = !operatorOnly || m.operatorIncluded;
    const matchesSearch = !searchQuery || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesDist && matchesOp && matchesSearch;
  });

  const handleOpenBooking = (item) => {
    setSelectedMachine(item);
    setBookingUnits(bookingType === 'hourly' ? 4 : 1);
    setBookingPlotId(plots[0]?.id || '');
    setIsBookingModalOpen(true);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedMachine) return;
    setBookingSubmitting(true);
    try {
      const res = await api.bookMachinery({
        machinery_id: selectedMachine.id,
        start_date: bookingDate,
        duration_days: bookingType === 'daily' ? bookingUnits : (bookingUnits / 8),
        booking_type: bookingType,
        plot_id: bookingPlotId
      });

      const rate = bookingType === 'hourly' ? selectedMachine.hourlyRate : selectedMachine.dailyRate;
      const total = rate * bookingUnits;

      const newBooking = {
        id: res.id || 'mbkg_' + Date.now(),
        machineName: selectedMachine.name,
        category: selectedMachine.category,
        owner: selectedMachine.ownerName,
        phone: selectedMachine.contactPhone,
        date: bookingDate,
        duration: `${bookingUnits} ${bookingType === 'hourly' ? 'Hours' : 'Days'}`,
        totalCost: total,
        status: 'Confirmed'
      };

      setMyBookings(prev => [newBooking, ...prev]);
      setBookingSuccess(`Equipment rental confirmed for ${selectedMachine.name}!`);
      setIsBookingModalOpen(false);
      setTimeout(() => setBookingSuccess(null), 6000);
    } catch (err) {
      alert('Machinery booking error: ' + (err.message || 'Please check your inputs'));
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003b1b] to-[#14532d] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Icon name="precision_manufacturing" className="text-sm" />
            TN Custom Hiring Center (CHC) Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Farm Machinery & Drone Rental
          </h1>
          <p className="text-emerald-100 text-sm mt-1 font-tamil">
            டிராக்டர், கொய் அறுவடை இயந்திரம், டிரோன் தெளிப்பான் மற்றும் உழவு கருவிகள் வாடகை மையம்
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-xs space-y-1">
          <div className="font-semibold text-emerald-200 flex items-center gap-1">
            <Icon name="agriculture" className="text-sm" />
            Custom Hiring Rates
          </div>
          <p className="text-stone-200">
            Regulated hourly & daily tariffs. Skilled operators available with diesel options included.
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

      {/* Filter and Category Ribbon */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 space-y-3">
        {/* Search & District */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Icon name="search" className="absolute left-3 top-2.5 text-stone-400 text-sm" />
            <input
              type="text"
              placeholder="Search machinery, brand (e.g. Mahindra, Drone)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={operatorOnly}
                onChange={(e) => setOperatorOnly(e.target.checked)}
                className="rounded text-[#14532d] focus:ring-[#14532d]"
              />
              <span>Operator Included Only</span>
            </label>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-semibold bg-white text-stone-700"
            >
              {districts.map(d => (
                <option key={d} value={d}>{d === 'all' ? 'All Districts' : d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-stone-100">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#14532d] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Equipment' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Machinery Catalog Grid */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
          <Icon name="progress_activity" className="animate-spin text-3xl text-[#14532d]" />
          <p className="text-sm font-medium">Loading Custom Hiring Center catalog...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {m.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Icon name="star" className="text-xs" />
                    {m.rating || 4.7}
                  </div>
                </div>

                <h3 className="font-bold text-stone-900 text-base mt-2">{m.name}</h3>
                <div className="text-xs text-stone-500 mt-0.5">Brand: <span className="font-semibold text-stone-700">{m.brand}</span></div>

                <div className="flex items-center gap-2 mt-2 text-xs text-stone-600">
                  <Icon name="pin_drop" className="text-sm text-[#14532d]" />
                  <span>{m.district} ({m.distanceKm || 4} km away)</span>
                </div>

                {/* Rate card */}
                <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-stone-50 rounded-xl border border-stone-100 text-center">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-stone-400">Hourly Tariff</div>
                    <div className="text-base font-black text-[#14532d]">₹{m.hourlyRate} <span className="text-[10px] font-normal text-stone-500">/ hr</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-stone-400">Daily Tariff</div>
                    <div className="text-base font-black text-stone-800">₹{m.dailyRate} <span className="text-[10px] font-normal text-stone-500">/ day</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-600 mb-4">
                  <Icon name={m.operatorIncluded ? 'check_circle' : 'x'} className={`text-sm ${m.operatorIncluded ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>{m.operatorIncluded ? 'Certified Driver / Pilot Included' : 'Equipment Only (Self-Operated)'}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                <a
                  href={`tel:${m.contactPhone}`}
                  className="px-3 py-2 border border-stone-300 hover:border-stone-400 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Icon name="call" className="text-sm text-[#14532d]" />
                  Call Owner
                </a>
                <button
                  onClick={() => handleOpenBooking(m)}
                  className="flex-1 py-2 bg-[#14532d] hover:bg-[#003b1b] text-white rounded-xl text-xs font-semibold transition-all shadow flex items-center justify-center gap-1.5"
                >
                  <Icon name="schedule_send" className="text-sm" />
                  Book Equipment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Bookings Tracker */}
      {myBookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Icon name="precision_manufacturing" className="text-[#14532d]" />
            My Active Machinery Bookings ({myBookings.length})
          </h2>
          <div className="space-y-3">
            {myBookings.map((b) => (
              <div key={b.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-stone-900 text-sm">{b.machineName}</div>
                  <div className="text-xs text-stone-500">
                    Category: {b.category} | Fleet Provider: {b.owner} ({b.phone})
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-stone-400">Date:</span> <span className="font-bold text-stone-800">{b.date}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Duration:</span> <span className="font-bold text-stone-800">{b.duration}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Total:</span> <span className="font-bold text-[#14532d]">₹{b.totalCost.toLocaleString('en-IN')}</span>
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
      {isBookingModalOpen && selectedMachine && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-lg">Book Farm Machinery</h3>
                <p className="text-xs text-stone-500">{selectedMachine.name}</p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-full"
              >
                <Icon name="close" className="" />
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setBookingType('hourly'); setBookingUnits(4); }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    bookingType === 'hourly'
                      ? 'bg-[#14532d] text-white border-[#14532d]'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  Hourly Rate (₹{selectedMachine.hourlyRate}/hr)
                </button>
                <button
                  type="button"
                  onClick={() => { setBookingType('daily'); setBookingUnits(1); }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    bookingType === 'daily'
                      ? 'bg-[#14532d] text-white border-[#14532d]'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  Daily Rate (₹{selectedMachine.dailyRate}/day)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {bookingType === 'hourly' ? 'Number of Hours' : 'Number of Days'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={bookingType === 'hourly' ? 14 : 30}
                    required
                    value={bookingUnits}
                    onChange={(e) => setBookingUnits(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Assign to Plot</label>
                <select
                  value={bookingPlotId}
                  onChange={(e) => setBookingPlotId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  {plots.map(p => (
                    <option key={p.id} value={p.id}>{p.plot_name} ({p.area_value} {p.area_unit})</option>
                  ))}
                </select>
              </div>

              {/* Estimate Cost card */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-emerald-800 font-semibold">Total Estimated Rental:</div>
                  <div className="text-xs text-stone-500">
                    {bookingUnits} {bookingType === 'hourly' ? 'hours' : 'days'} × ₹{bookingType === 'hourly' ? selectedMachine.hourlyRate : selectedMachine.dailyRate}
                  </div>
                </div>
                <div className="text-xl font-black text-[#14532d]">
                  ₹{((bookingType === 'hourly' ? selectedMachine.hourlyRate : selectedMachine.dailyRate) * bookingUnits).toLocaleString('en-IN')}
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
                  {bookingSubmitting ? 'Confirming...' : 'Book Equipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
