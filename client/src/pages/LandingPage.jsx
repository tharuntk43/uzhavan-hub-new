import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LandingPage({ onGetStarted, onExploreServices }) {
  const { language, demoLogin } = useAuth();

  const isTa = language === 'ta';

  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003b1b] via-[#14532d] to-[#166534] text-white p-8 sm:p-14 shadow-xl border border-emerald-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold mb-4">
            <span>🌾</span>
            <span>{isTa ? 'தமிழ்நாடு வேளாண் டிஜிட்டல் புரட்சி' : 'Tamil Nadu Smart Agriculture Platform'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            {isTa ? 'ஸ்மார்ட் விவசாயம். சிறந்த முடிவுகள். அதிக விளைச்சல்.' : 'Smart Farming. Better Decisions. Higher Yields.'}
          </h1>

          <p className="text-base sm:text-lg text-emerald-100 font-normal mb-8 leading-relaxed">
            {isTa
              ? 'உங்கள் நிலத்தைப் புரிந்துகொள்ளவும், சரியான பயிரைத் தேர்ந்தெடுக்கவும், விவசாயத் தொழிலாளர்கள் மற்றும் இயந்திரங்களை வாடகைக்கு எடுக்கவும் ஒரே அறிவார்ந்த தளம்.'
              : 'One intelligent platform to manage your farm, understand your land, access agricultural services, and make informed farming decisions.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGetStarted}
              className="px-6 py-3.5 rounded-2xl bg-white text-[#003b1b] font-bold text-sm hover:bg-emerald-50 transition-all shadow-md flex items-center gap-2"
            >
              <span>🌱</span>
              <span>{isTa ? 'இலவசமாக தொடங்குங்கள்' : 'Get Started Free'}</span>
            </button>

            <button
              onClick={onExploreServices}
              className="px-6 py-3.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800 text-white border border-emerald-400/40 font-bold text-sm transition-all shadow-xs flex items-center gap-2"
            >
              <span>🚜</span>
              <span>{isTa ? 'விவசாய சேவைகளை காண்க' : 'Explore Farming Services'}</span>
            </button>
          </div>
        </div>

        {/* Decorative Watermark Leaf Icon */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white text-[240px]">
          🌾
        </div>
      </section>

      {/* DEMO ACCOUNTS QUICK-START (Required by Module 1) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#c0c9be]/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👨‍🌾</span>
              <h2 className="text-xl font-bold text-[#003b1b]">
                {isTa ? 'மாதிரி விவசாய கணக்குகளில் சோதிக்கவும்' : 'Try Uzhavan Hub with Verified Demo Farmers'}
              </h2>
            </div>
            <p className="text-xs text-[#404941] mt-1">
              {isTa
                ? 'கடவுச்சொல் இன்றி ஒரு கிளிக்கில் மாதிரி விவசாயி கணக்குகளை ஆராயுங்கள்.'
                : 'Experience real calibrated land plots, soil chromatography, and telemetry in 1 click.'}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-[#003b1b] font-bold self-start">
            Instant Demo Access
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Persona 1: Selvam V. from Thanjavur (Stitch Design Primary Persona) */}
          <div className="p-5 rounded-2xl bg-[#e4f9e8] border border-emerald-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👨‍🌾</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#14532d] text-white">Delta Basin</span>
              </div>
              <h3 className="text-base font-bold text-[#003b1b]">Selvam V.</h3>
              <div className="text-xs text-[#404941]">Thanjavur (Kabisthalam)</div>
              <div className="text-xs font-semibold text-[#14532d] mt-2">
                3 Plots • 7.3 Acres • Samba BPT 5204 & Banana
              </div>
            </div>
            <button
              onClick={() => demoLogin('selvam')}
              className="mt-4 w-full py-2 rounded-xl bg-[#003b1b] text-white text-xs font-bold hover:bg-[#14532d] transition-all"
            >
              Sign In as Selvam
            </button>
          </div>

          {/* Persona 2: Murugan P. from Madurai */}
          <div className="p-5 rounded-2xl bg-[#fdf8e6] border border-amber-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👨‍🌾</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-800 text-white">Black Cotton</span>
              </div>
              <h3 className="text-base font-bold text-amber-950">Murugan P.</h3>
              <div className="text-xs text-[#404941]">Madurai (Vadipatti)</div>
              <div className="text-xs font-semibold text-amber-900 mt-2">
                2 Plots • 4.5 Acres • Cotton MCU 5 & Millets
              </div>
            </div>
            <button
              onClick={() => demoLogin('murugan')}
              className="mt-4 w-full py-2 rounded-xl bg-amber-900 text-white text-xs font-bold hover:bg-amber-800 transition-all"
            >
              Sign In as Murugan
            </button>
          </div>

          {/* Persona 3: Anitha R. from Thanjavur */}
          <div className="p-5 rounded-2xl bg-[#f5eefc] border border-purple-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👩‍🌾</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-800 text-white">Precision Horti</span>
              </div>
              <h3 className="text-base font-bold text-purple-950">Anitha R.</h3>
              <div className="text-xs text-[#404941]">Thanjavur (Papanasam)</div>
              <div className="text-xs font-semibold text-purple-900 mt-2">
                2 Plots • 3.8 Acres • Drip Banana & Dairy
              </div>
            </div>
            <button
              onClick={() => demoLogin('anitha')}
              className="mt-4 w-full py-2 rounded-xl bg-purple-900 text-white text-xs font-bold hover:bg-purple-800 transition-all"
            >
              Sign In as Anitha
            </button>
          </div>

        </div>
      </section>

      {/* PLATFORM IMPACT HIGHLIGHTS (Demonstration Metrics Clearly Labeled) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#c0c9be]/50 shadow-xs text-center">
          <div className="text-2xl sm:text-3xl font-black text-[#003b1b]">38</div>
          <div className="text-xs font-bold text-[#0e1f15] mt-1">{isTa ? 'ஆதரிக்கப்படும் மாவட்டங்கள்' : 'Tamil Nadu Districts'}</div>
          <span className="text-[10px] text-[#404941] block mt-0.5">(Full Statewide Agro-Climatic Coverage)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c0c9be]/50 shadow-xs text-center">
          <div className="text-2xl sm:text-3xl font-black text-[#14532d]">18</div>
          <div className="text-xs font-bold text-[#0e1f15] mt-1">{isTa ? 'ஒப்பீடு பயிர்கள்' : 'Crops Analyzed'}</div>
          <span className="text-[10px] text-[#404941] block mt-0.5">(Cereals, Pulses, Oilseeds, Millets)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c0c9be]/50 shadow-xs text-center">
          <div className="text-2xl sm:text-3xl font-black text-[#77574d]">50+</div>
          <div className="text-xs font-bold text-[#0e1f15] mt-1">{isTa ? 'வாடகை இயந்திரங்கள்' : 'Machinery Listings'}</div>
          <span className="text-[10px] text-[#404941] block mt-0.5">(Tractors, Harvesters, Drones)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c0c9be]/50 shadow-xs text-center">
          <div className="text-2xl sm:text-3xl font-black text-[#14532d]">1962</div>
          <div className="text-xs font-bold text-[#0e1f15] mt-1">{isTa ? 'கால்நடை அவசர எண்' : 'Animal Emergency Dispatch'}</div>
          <span className="text-[10px] text-[#404941] block mt-0.5">(Toll-Free 24/7 Mobile Ambulance)</span>
        </div>
      </section>

      {/* CORE 5 PILLARS VALUE PROPOSITION */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#c0c9be]/50">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-black text-[#003b1b]">
            {isTa ? 'உழவன் ஹப் வழங்கும் 5 விவசாயத் தூண்கள்' : 'The 5 Core Pillars of Uzhavan Hub'}
          </h2>
          <p className="text-xs text-[#404941] mt-1">
            {isTa
              ? 'விதைப்பது முதல் அறுவடை மற்றும் விற்பனை வரை ஒரு முழுமையான டிஜிட்டல் சூழல்.'
              : 'End-to-end agronomic intelligence from seed selection to harvest and market negotiation.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#e4f9e8] border border-emerald-200">
            <div className="w-10 h-10 rounded-xl bg-[#003b1b] text-white flex items-center justify-center text-xl mb-3">🌱</div>
            <h3 className="text-sm font-bold text-[#003b1b] mb-1">1. AI Farming Decision Engine</h3>
            <p className="text-xs text-[#404941] leading-relaxed">
              Considers 6 dimensions: soil chromatography, rainfall forecast, water hydrology, season, capital, and APMC market trends.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#e4f9e8] border border-emerald-200">
            <div className="w-10 h-10 rounded-xl bg-[#003b1b] text-white flex items-center justify-center text-xl mb-3">🛠️</div>
            <h3 className="text-sm font-bold text-[#003b1b] mb-1">2. Farm Services Marketplace</h3>
            <p className="text-xs text-[#404941] leading-relaxed">
              Book verified agricultural labour teams (transplanting, weeding, harvesting) and rent 50+ tractors, harvesters, and drones.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#e4f9e8] border border-emerald-200">
            <div className="w-10 h-10 rounded-xl bg-[#003b1b] text-white flex items-center justify-center text-xl mb-3">🐄</div>
            <h3 className="text-sm font-bold text-[#003b1b] mb-1">3. Veterinary Care & Livestock</h3>
            <p className="text-xs text-[#404941] leading-relaxed">
              Find nearby veterinary polyclinics, official vaccination schedules, and direct 1-click dispatch to Animal Emergency Helpline 1962.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#e4f9e8] border border-emerald-200">
            <div className="w-10 h-10 rounded-xl bg-[#003b1b] text-white flex items-center justify-center text-xl mb-3">💰</div>
            <h3 className="text-sm font-bold text-[#003b1b] mb-1">4. Farm Finance & Mandi Intelligence</h3>
            <p className="text-xs text-[#404941] leading-relaxed">
              Real-time APMC spot prices with 7-day trend, harvest proceeds comparison (Mandi vs FPO vs Farmgate), and 4% KCC loan guidance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#e4f9e8] border border-emerald-200">
            <div className="w-10 h-10 rounded-xl bg-[#003b1b] text-white flex items-center justify-center text-xl mb-3">🌐</div>
            <h3 className="text-sm font-bold text-[#003b1b] mb-1">5. FarmLingo & Bilingual Voice AI</h3>
            <p className="text-xs text-[#404941] leading-relaxed">
              Cross-language Tamil-to-Hindi buyer price negotiation with audio pronunciation and contextual voice assistant.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#e4f9e8] border border-emerald-200">
            <div className="w-10 h-10 rounded-xl bg-[#003b1b] text-white flex items-center justify-center text-xl mb-3">📱</div>
            <h3 className="text-sm font-bold text-[#003b1b] mb-1">6. Progressive Web App (PWA)</h3>
            <p className="text-xs text-[#404941] leading-relaxed">
              Installable on Android and iOS devices with offline advisory caching, lightweight footprint, and one-thumb mobile navigation.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
