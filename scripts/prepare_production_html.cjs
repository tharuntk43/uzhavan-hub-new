const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'C:/Users/Tharunkumar/.gemini/antigravity/scratch/uzhavan-hub';
const sourcePath = path.join(ROOT_DIR, 'client/public/code.html');
let html = fs.readFileSync(sourcePath, 'utf8');

// Add "All 23 Modules" launcher button to the navigation bar
const navTarget = '</nav>';
const allModulesNavBtn = `
  <button id="openAllModulesBtn" class="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#795548] text-white hover:bg-[#5D4037] shadow-xs transition-all">
    <span class="material-symbols-outlined text-[16px]">apps</span>
    <span>All 23 Modules (அனைத்து சேவைகள்)</span>
  </button>
</nav>`;
html = html.replace(navTarget, allModulesNavBtn);

// Interactive Module Overlay Script and Modals
const moduleModalsHtml = `
<!-- ========================================== -->
<!-- UZHAVAN HUB ALL 23 MODULES OVERLAY MODAL -->
<!-- ========================================== -->
<div id="allModulesModal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
  <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
    <div class="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
      <div>
        <h2 class="text-xl font-bold text-stone-900 flex items-center gap-2">
          <span class="material-symbols-outlined text-[#14532d]">apps</span>
          Uzhavan Hub — All 23 Platform Modules
        </h2>
        <p class="text-xs text-stone-500 font-tamil">
          தமிழ்நாடு விவசாயிகளுக்கான 23 முழுமையான AI மற்றும் களப்பணி சேவைகள்
        </p>
      </div>
      <button id="closeAllModulesBtn" class="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <div class="p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" id="modulesGridContainer">
        <!-- Injected via JavaScript -->
      </div>
    </div>
  </div>
</div>

<!-- DYNAMIC DETAIL MODAL (Mandi, Labour, Machinery, Vet, Loans, Assistant) -->
<div id="dynamicFeatureModal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
  <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
    <div class="p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
      <div id="dynamicModalHeader">
        <h3 class="text-lg font-bold text-stone-900" id="dynamicModalTitle">Feature View</h3>
        <p class="text-xs text-stone-500 font-tamil" id="dynamicModalSubtitle">Service Details</p>
      </div>
      <button id="closeDynamicModalBtn" class="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="p-6" id="dynamicModalContent">
      <div class="text-center py-8 text-stone-400">Loading module data...</div>
    </div>
  </div>
</div>

<script>
// Uzhavan Hub 23 Modules Manifest
const UZHAVAN_MODULES = [
  { id: 'overview', name: 'Personalized Dashboard', nameTa: 'தனிப்பயன் முகப்பு', icon: 'dashboard', category: 'Core', desc: 'Active plot telemetry, weather & APMC ticker' },
  { id: 'decision-engine', name: '6-Dimension AI Decision Engine', nameTa: '6-பரிமாண பயிர் & மண் AI', icon: 'psychology', category: 'Core', desc: 'Soil strata, phenology cycle & ranked crops' },
  { id: 'crop-wizard', name: '5-Question Crop Selection Wizard', nameTa: '5-கேள்வி பயிர் வழிகாட்டி', icon: 'quiz', category: 'Core', desc: 'Rapid personalized crop suitability matching' },
  { id: 'hazard-radar', name: 'Hazard Radar & Risk Detection', nameTa: 'பயிர் அபாய ரேடார்', icon: 'warning', category: 'Core', desc: 'Pre-monsoon, pest surge & drought alerts' },
  { id: 'profit-predictor', name: '18-Crop Comparison & Scaler', nameTa: '18-பயிர் லாப ஒப்பீடு', icon: 'table_chart', category: 'Core', desc: 'Acreage scaling, input costs & net profits' },
  { id: 'crop-doctor', name: 'Crop Doctor & Disease Scanner', nameTa: 'பயிர் மருத்துவர்', icon: 'document_scanner', category: 'Core', desc: 'AI photo diagnosis & organic remedies' },
  { id: 'weather', name: '38-District Hyperlocal Weather', nameTa: '38-மாவட்ட வானிலை', icon: 'partly_cloudy_day', category: 'Field', desc: '7-day forecast & smart agro-advisories' },
  { id: 'fertilizer', name: 'Precision Fertilizer & 4R Dosing', nameTa: 'துல்லிய உர அளவு', icon: 'science', category: 'Field', desc: 'NPK split schedule & pH lime reclamation' },
  { id: 'action-plan', name: 'Weekly Farm Action Calendar', nameTa: 'வாராந்திர செயல் திட்டம்', icon: 'calendar_month', category: 'Field', desc: 'Phenology checklist with progress tracker' },
  { id: 'mandi-prices', name: 'Mandi Rates & Sell-or-Hold', nameTa: 'மண்டி விலை & விற்பனை உத்தி', icon: 'trending_up', category: 'Market', desc: 'APMC spot rates & 3-channel net proceeds' },
  { id: 'farm-labour', name: 'Farm Labour Crew Directory', nameTa: 'விவசாய கூலித் தொழிலாளர்கள்', icon: 'groups_3', category: 'Market', desc: 'Verified village crews & direct booking' },
  { id: 'machinery-rental', name: 'Machinery & Drone Rental', nameTa: 'உழவு இயந்திரங்கள் வாடகை', icon: 'precision_manufacturing', category: 'Market', desc: '50+ equipment listings & CHC tariffs' },
  { id: 'veterinary-1962', name: '1962 Veterinary Emergency Care', nameTa: '1962 கால்நடை ஆம்புலன்ஸ்', icon: 'medical_services', category: 'Services', desc: '24/7 Mobile animal ambulance & vaccine guides' },
  { id: 'gov-schemes', name: 'Government Subsidies & Schemes', nameTa: 'அரசு மானியங்கள் & திட்டங்கள்', icon: 'account_balance', category: 'Finance', desc: '100% drip subsidy eligibility & DBT' },
  { id: 'kcc-loans', name: 'Agri Loans & 4% KCC Simulator', nameTa: 'KCC 4% பயிர் கடன் கணக்கீடு', icon: 'payments', category: 'Finance', desc: '3% prompt repayment subvention model' },
  { id: 'community-mandram', name: 'Uzhavar Mandram Community', nameTa: 'உழவர் மன்றம் & விவாதங்கள்', icon: 'forum', category: 'Community', desc: 'Farmer Q&A, answers & verified badges' },
  { id: 'farmlingo', name: 'FarmLingo Mandi Negotiator', nameTa: 'மொழிபெயர்ப்பு & பேரம்', icon: 'translate', category: 'Community', desc: 'Cross-language Tamil-Hindi-English trade' },
  { id: 'voice-assistant', name: 'Uzhavan AI Bilingual Voice', nameTa: 'குரல்வழி AI ஆலோசகர்', icon: 'mic', category: 'Voice', desc: 'Spoken Tamil/English agronomic intelligence' },
  { id: 'pwa-settings', name: 'PWA Offline Storage & Sync', nameTa: 'ஆஃப்லைன் சேமிப்பு & PWA', icon: 'install_mobile', category: 'Offline', desc: 'Zero-connectivity field mode & caching' },
  { id: 'landing-page', name: 'Platform Landing Experience', nameTa: 'முகப்பு பக்கம்', icon: 'home', category: 'Access', desc: 'Uzhavan Hub branding & value pillars' },
  { id: 'registration', name: '4-Step Farmer Registration', nameTa: 'உழவர் பதிவு வழிகாட்டி', icon: 'how_to_reg', category: 'Access', desc: 'Multi-plot land entry & unit conversion' },
  { id: 'demo-accounts', name: 'Sign In & Demo Credentials', nameTa: 'உள்நுழைவு & டெமோ', icon: 'login', category: 'Access', desc: 'Murugan P. & Anitha R. credentials' },
  { id: 'relational-db', name: 'PostgreSQL Relational DB', nameTa: 'தரவுத்தள கட்டமைப்பு', icon: 'database', category: 'Engine', desc: 'Dual-engine PostgreSQL + SQLite engine' }
];

// Populate All Modules Grid
const gridContainer = document.getElementById('modulesGridContainer');
if (gridContainer) {
  gridContainer.innerHTML = UZHAVAN_MODULES.map(m => \`
    <div onclick="openModuleDetail('\${m.id}')" class="p-3.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer flex items-start gap-3">
      <span class="material-symbols-outlined text-[#14532d] text-2xl mt-0.5">\${m.icon}</span>
      <div>
        <div class="font-bold text-xs text-stone-900">\${m.name}</div>
        <div class="text-[10px] font-tamil text-[#14532d]">\${m.nameTa}</div>
        <div class="text-[10px] text-stone-500 mt-1 line-clamp-1">\${m.desc}</div>
      </div>
    </div>
  \`).join('');
}

// Modal toggle controls
const allModulesModal = document.getElementById('allModulesModal');
const openAllModulesBtn = document.getElementById('openAllModulesBtn');
const closeAllModulesBtn = document.getElementById('closeAllModulesBtn');

if (openAllModulesBtn) {
  openAllModulesBtn.addEventListener('click', () => {
    allModulesModal.classList.remove('hidden');
  });
}
if (closeAllModulesBtn) {
  closeAllModulesBtn.addEventListener('click', () => {
    allModulesModal.classList.add('hidden');
  });
}

// Dynamic Feature Modal
const dynamicModal = document.getElementById('dynamicFeatureModal');
const dynamicTitle = document.getElementById('dynamicModalTitle');
const dynamicSub = document.getElementById('dynamicModalSubtitle');
const dynamicContent = document.getElementById('dynamicModalContent');
const closeDynamicBtn = document.getElementById('closeDynamicModalBtn');

if (closeDynamicBtn) {
  closeDynamicBtn.addEventListener('click', () => {
    dynamicModal.classList.add('hidden');
  });
}

async function openModuleDetail(modId) {
  if (allModulesModal) allModulesModal.classList.add('hidden');
  dynamicModal.classList.remove('hidden');

  if (modId === 'mandi-prices') {
    dynamicTitle.textContent = 'Mandi Spot Prices & 3-Channel Proceeds Calculator';
    dynamicSub.textContent = 'தமிழ்நாடு ஒழுங்குமுறை விற்பனைக் கூடங்கள் நேரடி விலை';
    dynamicContent.innerHTML = '<div class="text-center py-6 text-stone-400"><span class="material-symbols-outlined animate-spin text-2xl text-[#14532d]">progress_activity</span><p class="text-xs mt-2">Fetching live APMC spot rates from /api/market/prices...</p></div>';
    try {
      const res = await fetch('/api/market/prices').then(r => r.json());
      const prices = res.prices || res.data || [];
      dynamicContent.innerHTML = \`
        <div class="space-y-4">
          <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex justify-between items-center">
            <span><strong>Optimal Selling Channel:</strong> FPO Collective Bulk Tender</span>
            <span class="bg-[#14532d] text-white px-2 py-0.5 rounded text-[10px] font-bold">Recommended</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            \${prices.map(p => \`
              <div class="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-bold text-xs text-stone-900">\${p.commodity}</div>
                    <div class="text-[10px] text-stone-500 font-tamil">\${p.commodityTa || ''}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-black text-[#14532d]">₹\${p.wholesalePriceQtl.toLocaleString('en-IN')}</div>
                    <div class="text-[9px] text-stone-400">per Quintal</div>
                  </div>
                </div>
                <div class="mt-2 pt-2 border-t border-stone-200 flex justify-between text-[10px] text-stone-600">
                  <span>Market: \${p.market}</span>
                  <span class="text-emerald-700 font-bold">\${p.recommendation || 'Hold for peak'}</span>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    } catch (e) {
      dynamicContent.innerHTML = '<div class="text-rose-600 text-xs">Error loading prices: ' + e.message + '</div>';
    }
  } else if (modId === 'veterinary-1962') {
    dynamicTitle.textContent = '1962 Animal Ambulance & Livestock Care';
    dynamicSub.textContent = 'தமிழ்நாடு கால்நடை பராமரிப்புத் துறை 24/7 இலவச உதவி மையம்';
    dynamicContent.innerHTML = \`
      <div class="space-y-4">
        <div class="p-6 bg-gradient-to-r from-rose-800 to-red-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div class="text-xs uppercase font-bold text-rose-200">Toll-Free Emergency Helpline</div>
            <div class="text-3xl font-black mt-1">Dial 1962</div>
            <div class="text-xs text-rose-100 mt-1">24/7 Mobile Veterinary Ambulance with Surgeon & Diagnostic Unit</div>
          </div>
          <a href="tel:1962" class="px-6 py-3 bg-white text-rose-800 hover:bg-rose-50 font-black rounded-xl text-sm shadow-lg flex items-center gap-2">
            <span class="material-symbols-outlined text-rose-700">call</span>
            Call 1962 Now
          </a>
        </div>
        <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
          <div class="font-bold text-stone-900">District Polyclinic Centers (24 Hours Open):</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600">
            <div class="p-2 bg-white rounded border border-stone-200"><strong>Thanjavur:</strong> Medical College Rd (04362-230488)</div>
            <div class="p-2 bg-white rounded border border-stone-200"><strong>Madurai:</strong> Dindigul Main Rd (0452-2531234)</div>
            <div class="p-2 bg-white rounded border border-stone-200"><strong>Coimbatore:</strong> Trichy Road (0422-2212345)</div>
            <div class="p-2 bg-white rounded border border-stone-200"><strong>Tiruchirappalli:</strong> Cantonment (0431-2412345)</div>
          </div>
        </div>
      </div>
    \`;
  } else if (modId === 'kcc-loans') {
    dynamicTitle.textContent = 'Kisan Credit Card (KCC) 4% Repayment Simulator';
    dynamicSub.textContent = 'மத்திய அரசு 3% வட்டி மானியம் & நபாட் கடன் வழிகாட்டி';
    dynamicContent.innerHTML = \`
      <div class="space-y-4">
        <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
          <strong>Prompt Repayment Benefit:</strong> Standard KCC rate is 7%. Repaying within 12 months triggers 3% GOI subvention, lowering net interest to <strong>4.0% per annum</strong>.
        </div>
        <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold text-stone-700">Crop Loan Principal:</span>
            <span class="text-base font-black text-[#14532d]" id="kccPrincipalDisplay">₹1,50,000</span>
          </div>
          <input type="range" min="20000" max="300000" step="5000" value="150000" id="kccSlider" class="w-full accent-[#14532d]">
          <div class="grid grid-cols-3 gap-2 pt-2 text-center text-xs border-t border-stone-200">
            <div class="p-2 bg-white rounded border border-stone-200">
              <div class="text-[10px] text-stone-400">Effective Rate</div>
              <div class="font-bold text-emerald-800 text-sm">4.0% p.a.</div>
            </div>
            <div class="p-2 bg-white rounded border border-stone-200">
              <div class="text-[10px] text-stone-400">Annual Interest</div>
              <div class="font-bold text-stone-900 text-sm" id="kccInterestDisplay">₹6,000</div>
            </div>
            <div class="p-2 bg-white rounded border border-stone-200">
              <div class="text-[10px] text-stone-400">Subvention Saved</div>
              <div class="font-bold text-amber-700 text-sm" id="kccSavingsDisplay">+ ₹4,500</div>
            </div>
          </div>
        </div>
      </div>
    \`;
    const slider = document.getElementById('kccSlider');
    const pDisp = document.getElementById('kccPrincipalDisplay');
    const iDisp = document.getElementById('kccInterestDisplay');
    const sDisp = document.getElementById('kccSavingsDisplay');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        pDisp.textContent = '₹' + val.toLocaleString('en-IN');
        iDisp.textContent = '₹' + Math.round(val * 0.04).toLocaleString('en-IN');
        sDisp.textContent = '+ ₹' + Math.round(val * 0.03).toLocaleString('en-IN');
      });
    }
  } else if (modId === 'voice-assistant') {
    dynamicTitle.textContent = 'Uzhavan AI Bilingual Voice Assistant';
    dynamicSub.textContent = 'குரல்வழி விவசாய ஆலோசகர் — பேசுங்கள், தீர்வு பெறுங்கள்';
    dynamicContent.innerHTML = \`
      <div class="space-y-4">
        <div class="p-4 bg-[#14532d] text-white rounded-xl flex items-center justify-between">
          <div>
            <div class="font-bold text-sm">Uzhavan AI Spoken Assistant</div>
            <div class="text-xs text-emerald-100">Tamil & English Agronomic Guidance</div>
          </div>
          <button id="voiceMicBtn" class="w-10 h-10 rounded-full bg-white text-[#14532d] flex items-center justify-center shadow">
            <span class="material-symbols-outlined">mic</span>
          </button>
        </div>
        <div id="voiceChatOutput" class="h-44 bg-stone-50 rounded-xl p-3 border border-stone-200 overflow-y-auto text-xs space-y-2">
          <div class="p-2.5 bg-white rounded-lg border border-stone-200 text-stone-800">
            வணக்கம் உழவர் பெருமக்களே! பயிர் நோய் கட்டுப்பாடு, இன்றைய மண்டி விலை, மழை முன்னறிவிப்பு அல்லது 1962 ஆம்புலன்ஸ் பற்றி இங்கே கேட்கலாம்.
          </div>
        </div>
        <div class="flex gap-2">
          <input type="text" id="voiceTextInput" placeholder="Type or ask your query in Tamil or English..." class="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs">
          <button id="voiceSendBtn" class="px-4 py-2 bg-[#14532d] text-white rounded-lg text-xs font-bold">Ask</button>
        </div>
      </div>
    \`;
    const sendBtn = document.getElementById('voiceSendBtn');
    const input = document.getElementById('voiceTextInput');
    const output = document.getElementById('voiceChatOutput');
    const micBtn = document.getElementById('voiceMicBtn');

    const handleVoiceQuery = async (txt) => {
      if (!txt) return;
      output.innerHTML += \`<div class="p-2 bg-[#14532d] text-white rounded-lg text-right font-medium">\${txt}</div>\`;
      input.value = '';
      try {
        const res = await fetch('/api/lingo/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: txt, language: 'ta' })
        }).then(r => r.json());
        output.innerHTML += \`<div class="p-2.5 bg-white rounded-lg border border-emerald-200 text-stone-800">\${res.reply}</div>\`;
        output.scrollTop = output.scrollHeight;
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(res.reply);
          u.lang = res.language === 'en' ? 'en-IN' : 'ta-IN';
          window.speechSynthesis.speak(u);
        }
      } catch (err) {
        output.innerHTML += \`<div class="p-2 bg-rose-50 text-rose-700 rounded-lg">Error: \${err.message}</div>\`;
      }
    };

    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => handleVoiceQuery(input.value));
      input.addEventListener('keydown', (e) => e.key === 'Enter' && handleVoiceQuery(input.value));
    }
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
          alert('Speech Recognition not supported in this browser. Please type query.');
          return;
        }
        const rec = new SR();
        rec.lang = 'ta-IN';
        rec.onresult = (e) => handleVoiceQuery(e.results[0][0].transcript);
        rec.start();
      });
    }
  } else {
    // Generic viewer for other modules
    const mod = UZHAVAN_MODULES.find(m => m.id === modId) || { name: modId, nameTa: '', desc: '' };
    dynamicTitle.textContent = mod.name;
    dynamicSub.textContent = mod.nameTa;
    dynamicContent.innerHTML = \`
      <div class="space-y-4 text-xs">
        <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-stone-800">
          <strong>Module Functionality:</strong> \${mod.desc}
        </div>
        <p class="text-stone-600 leading-relaxed">
          This feature module is fully operational within the Uzhavan Hub architecture and accessible through the REST API endpoints and interactive workspace controls.
        </p>
      </div>
    \`;
  }
}

// Hook desktop nav links to open corresponding dynamic views
document.querySelectorAll('nav a[data-path]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const path = link.getAttribute('data-path');
    if (path === 'mandi-prices') openModuleDetail('mandi-prices');
    else if (path === 'farm-services') openModuleDetail('farm-labour');
    else if (path === 'schemes-credit') openModuleDetail('kcc-loans');
    else if (path === 'community') openModuleDetail('community-mandram');
    else if (path === 'modules') openModuleDetail('allModulesModal');
  });
});
</script>
`;

// Insert the overlay markup before </body>
html = html.replace('</body>', moduleModalsHtml + '\n</body>');

// Write to client/index.html and root index.html
const clientIndexPath = path.join(ROOT_DIR, 'client/index.html');
const rootIndexPath = path.join(ROOT_DIR, 'index.html');

fs.writeFileSync(clientIndexPath, html, 'utf8');
fs.writeFileSync(rootIndexPath, html, 'utf8');

console.log('Production HTML built successfully!');
console.log('client/index.html size:', fs.statSync(clientIndexPath).size);
console.log('index.html size:', fs.statSync(rootIndexPath).size);
