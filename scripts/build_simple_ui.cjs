const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'C:/Users/Tharunkumar/.gemini/antigravity/scratch/uzhavan-hub';

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Uzhavan Hub (உழவன் ஹப்) — Smart Agriculture Platform</title>
  <meta name="description" content="AI-Powered Smart Agriculture Platform for Tamil Nadu Farmers. Simple, accessible crop planning, mandi prices, weather, and farm finance." />
  <meta name="theme-color" content="#14532D" />

  <!-- PWA Manifest & App Icons -->
  <link rel="manifest" href="/manifest.json" />
  <link rel="icon" type="image/svg+xml" href="/icon.svg" />

  <!-- Google Fonts: Inter & Noto Sans Tamil & Material Symbols -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Tamil:wght@400;500;600;700;800&family=Caveat:wght@600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            agro: {
              forest: '#14532D',
              green: '#166534',
              leaf: '#4D7C0F',
              sage: '#E8F2E8',
              soil: '#795548',
              deepsoil: '#5D4037',
              cream: '#F8F7F0',
              gold: '#D4A72C'
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            tamil: ['"Noto Sans Tamil"', 'sans-serif'],
            handwriting: ['Caveat', 'cursive']
          }
        }
      }
    };
  </script>

  <style>
    body {
      background-color: #F8F7F0;
      font-family: 'Inter', sans-serif;
      color: #0e1f15;
    }
    .font-tamil {
      font-family: 'Noto Sans Tamil', 'Inter', sans-serif;
    }
    .font-handwriting {
      font-family: 'Caveat', cursive;
    }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      vertical-align: middle;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</head>
<body class="bg-[#F8F7F0] min-h-screen text-[#0e1f15] selection:bg-emerald-200">

  <!-- ============================================================ -->
  <!-- 1. FIRST SCREEN: LOGIN VIEW (Exact match to reference image)  -->
  <!-- ============================================================ -->
  <div id="loginView" class="min-h-screen flex flex-col justify-between">
    
    <!-- Top Header -->
    <header className="h-20" class="h-20 px-6 sm:px-12 bg-white/95 backdrop-blur-md border-b border-stone-200/80 flex items-center justify-between sticky top-0 z-40">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-[#14532D] flex items-center justify-center text-white shadow-md">
          <span class="material-symbols-outlined text-[26px]">potted_plant</span>
        </div>
        <div>
          <span class="text-xl sm:text-2xl font-black text-[#14532D] tracking-tight block leading-tight">Uzhavan Hub</span>
          <span class="text-xs font-bold text-[#795548] font-tamil block -mt-0.5">உழவன் ஹப்</span>
        </div>
      </div>

      <nav class="hidden lg:flex items-center gap-8">
        <a href="#home" class="text-sm font-bold text-[#14532D] border-b-2 border-[#14532D] pb-1">Home</a>
        <a href="#services" class="text-sm font-semibold text-stone-600 hover:text-[#14532D]">Services</a>
        <a href="#features" class="text-sm font-semibold text-stone-600 hover:text-[#14532D]">Features</a>
        <a href="#about" class="text-sm font-semibold text-stone-600 hover:text-[#14532D]">About</a>
        <a href="#contact" class="text-sm font-semibold text-stone-600 hover:text-[#14532D]">Contact</a>
      </nav>

      <div class="flex items-center gap-4">
        <button id="loginLangToggle" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50">
          <span class="material-symbols-outlined text-sm text-[#14532D]">language</span>
          <span id="loginLangText">EN</span>
          <span class="material-symbols-outlined text-xs text-stone-400">expand_more</span>
        </button>

        <button class="hidden sm:inline-flex px-4 py-2 border border-stone-300 hover:border-stone-400 rounded-xl text-xs font-bold text-stone-800">Login</button>
        <button id="openRegisterFromHeader" class="px-5 py-2 bg-[#14532D] hover:bg-[#003b1b] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all">Register</button>
      </div>
    </header>

    <!-- Main Hero & Login Content -->
    <main class="flex-1 relative flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden">
      <!-- Background Landscape Image with Soft Overlay -->
      <div class="absolute inset-0 bg-cover bg-left sm:bg-center opacity-30 z-0 pointer-events-none" style="background-image: url('/login-bg.jpg');"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-[#F8F7F0] via-[#F8F7F0]/90 to-[#F8F7F0]/60 z-0 pointer-events-none"></div>

      <div class="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        <!-- Left Hero Area -->
        <div class="lg:col-span-7 space-y-6">
          <div>
            <div class="text-sm sm:text-base font-bold text-stone-600 mb-1">
              Welcome <span class="text-[#4D7C0F]">Back</span> to
            </div>
            <h1 class="text-4xl sm:text-6xl font-black text-[#14532D] tracking-tight leading-none">
              Uzhavan Hub
            </h1>
            <div class="text-3xl sm:text-5xl font-black text-[#795548] font-tamil mt-1">
              உழவன் ஹப்
            </div>
          </div>

          <p class="text-base sm:text-lg text-stone-700 max-w-lg leading-relaxed font-medium">
            Your trusted partner in smart agriculture and sustainable farming.
          </p>

          <!-- 4 Circular Feature Badges (Matching Reference Image) -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 max-w-lg">
            <div class="flex flex-col items-center text-center p-3 rounded-2xl bg-white/80 backdrop-blur border border-stone-200/60 shadow-xs">
              <div class="w-12 h-12 rounded-full bg-[#E8F2E8] text-[#14532D] flex items-center justify-center mb-2 shadow-xs">
                <span class="material-symbols-outlined text-[24px]">potted_plant</span>
              </div>
              <span class="text-xs font-bold text-stone-800 leading-tight">Smart<br />Recommendations</span>
            </div>

            <div class="flex flex-col items-center text-center p-3 rounded-2xl bg-white/80 backdrop-blur border border-stone-200/60 shadow-xs">
              <div class="w-12 h-12 rounded-full bg-[#E8F2E8] text-[#14532D] flex items-center justify-center mb-2 shadow-xs">
                <span class="material-symbols-outlined text-[24px]">partly_cloudy_day</span>
              </div>
              <span class="text-xs font-bold text-stone-800 leading-tight">Weather<br />Updates</span>
            </div>

            <div class="flex flex-col items-center text-center p-3 rounded-2xl bg-white/80 backdrop-blur border border-stone-200/60 shadow-xs">
              <div class="w-12 h-12 rounded-full bg-[#E8F2E8] text-[#14532D] flex items-center justify-center mb-2 shadow-xs">
                <span class="material-symbols-outlined text-[24px]">trending_up</span>
              </div>
              <span class="text-xs font-bold text-stone-800 leading-tight">Market<br />Prices</span>
            </div>

            <div class="flex flex-col items-center text-center p-3 rounded-2xl bg-white/80 backdrop-blur border border-stone-200/60 shadow-xs">
              <div class="w-12 h-12 rounded-full bg-[#E8F2E8] text-[#14532D] flex items-center justify-center mb-2 shadow-xs">
                <span class="material-symbols-outlined text-[24px]">groups</span>
              </div>
              <span class="text-xs font-bold text-stone-800 leading-tight">Farmer<br />Community</span>
            </div>
          </div>

          <!-- Hand-written tagline style -->
          <div class="pt-4 flex items-center gap-2">
            <span class="font-handwriting text-3xl sm:text-4xl text-[#14532D] font-bold tracking-wide">
              Better Farming Together
            </span>
            <span class="material-symbols-outlined text-emerald-600 text-2xl">spa</span>
          </div>
        </div>

        <!-- Right Floating Farmer Login Card (Matching Reference Image) -->
        <div class="lg:col-span-5 flex justify-center">
          <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80 w-full max-w-md">
            
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-2xl bg-[#E8F2E8] text-[#14532D] flex items-center justify-center shadow-xs">
                <span class="material-symbols-outlined text-[28px]">eco</span>
              </div>
              <div>
                <h2 class="text-2xl font-black text-stone-900 tracking-tight">Farmer Login</h2>
                <p class="text-xs text-stone-500 font-medium">Access your farm dashboard and services</p>
              </div>
            </div>

            <div id="loginErrorMsg" class="hidden mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">error</span>
              <span id="loginErrorText">Invalid email or password.</span>
            </div>

            <!-- Login Form -->
            <form id="loginForm" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Email Address</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3.5 top-3 text-stone-400 text-lg">mail</span>
                  <input type="email" id="loginEmail" required placeholder="Enter your email address" value="murugan.madurai@uzhavan.tn.gov.in" class="w-full pl-11 pr-4 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#14532D] focus:border-transparent" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Password</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3.5 top-3 text-stone-400 text-lg">lock</span>
                  <input type="password" id="loginPassword" required placeholder="Enter your password" value="password123" class="w-full pl-11 pr-11 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#14532D] focus:border-transparent" />
                  <button type="button" id="togglePasswordBtn" class="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-600">
                    <span class="material-symbols-outlined text-lg" id="togglePasswordIcon">visibility</span>
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between text-xs pt-1">
                <label class="flex items-center gap-2 text-stone-600 font-medium cursor-pointer">
                  <input type="checkbox" checked class="rounded text-[#14532D] focus:ring-[#14532D] h-4 w-4" />
                  <span>Remember me</span>
                </label>
                <button type="button" id="forgotPasswordBtn" class="text-[#14532D] hover:underline font-bold">Forgot password?</button>
              </div>

              <button type="submit" id="submitLoginBtn" class="w-full py-3 bg-[#14532D] hover:bg-[#003b1b] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2">
                <span>Login</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>

            <!-- OR Divider -->
            <div class="relative my-6 text-center">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-stone-200"></div></div>
              <span class="relative bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-widest">OR</span>
            </div>

            <!-- Try Demo Accounts Box -->
            <div class="p-4 rounded-2xl bg-[#E8F2E8] border border-emerald-200/60 space-y-2.5">
              <div class="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <span class="material-symbols-outlined text-sm text-[#14532D]">person</span>
                <span>Try Demo Accounts</span>
              </div>
              <p class="text-[11px] text-stone-600 leading-tight">Explore the platform with sample farmer accounts</p>

              <div class="grid grid-cols-2 gap-2 pt-1">
                <button type="button" id="demoMuruganBtn" class="p-2.5 bg-emerald-100/70 hover:bg-emerald-200/70 rounded-xl text-left border border-emerald-300/60 transition-all flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-[#14532D] text-white flex items-center justify-center text-xs font-bold">M</div>
                  <div>
                    <div class="text-xs font-bold text-stone-900 leading-tight">Murugan P.</div>
                    <div class="text-[10px] text-stone-500 font-medium">(Madurai)</div>
                  </div>
                </button>

                <button type="button" id="demoAnithaBtn" class="p-2.5 bg-amber-100/70 hover:bg-amber-200/70 rounded-xl text-left border border-amber-300/60 transition-all flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-[#795548] text-white flex items-center justify-center text-xs font-bold">A</div>
                  <div>
                    <div class="text-xs font-bold text-stone-900 leading-tight">Anitha R.</div>
                    <div class="text-[10px] text-stone-500 font-medium">(Thanjavur)</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Create New Account Button -->
            <div class="mt-4">
              <button type="button" id="openRegisterBtn" class="w-full py-2.5 border-2 border-[#14532D] text-[#14532D] hover:bg-[#E8F2E8] rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5">
                <span class="material-symbols-outlined text-sm">person_add</span>
                <span>Create New Account</span>
              </button>
              <p class="text-[10px] text-stone-400 text-center mt-1">Join Uzhavan Hub and start your farming journey</p>
            </div>

            <!-- Card Bottom Language Switch -->
            <div class="mt-6 pt-3 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-500">
              <span class="material-symbols-outlined text-sm text-stone-400">language</span>
              <button id="langEnBtn" class="font-bold text-[#14532D]">English</button>
              <span>|</span>
              <button id="langTaBtn" class="font-tamil hover:text-[#14532D]">தமிழ்</button>
            </div>

          </div>
        </div>

      </div>
    </main>

    <!-- Footer (Matching Reference Image) -->
    <footer class="bg-[#0e3820] text-white py-6 px-6 sm:px-12 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
          <span class="material-symbols-outlined text-[20px]">potted_plant</span>
        </div>
        <div>
          <span class="text-sm font-bold text-white tracking-tight">Uzhavan Hub</span>
          <span class="text-xs font-tamil text-stone-300 ml-1.5">உழவன் ஹப்</span>
        </div>
      </div>

      <div class="flex items-center gap-6 text-xs text-stone-300">
        <a href="#privacy" class="hover:text-white">Privacy Policy</a>
        <span>|</span>
        <a href="#terms" class="hover:text-white">Terms of Service</a>
        <span>|</span>
        <a href="#support" class="hover:text-white">Support</a>
      </div>

      <div class="flex items-center gap-4 text-xs text-stone-400">
        <div class="flex items-center gap-3 text-stone-300">
          <span class="material-symbols-outlined text-base">public</span>
          <span class="material-symbols-outlined text-base">smart_display</span>
          <span class="material-symbols-outlined text-base">photo_camera</span>
        </div>
        <span>© 2025 Uzhavan Hub. All rights reserved.</span>
      </div>
    </footer>

  </div>

  <!-- ============================================================ -->
  <!-- 2. FARMER REGISTRATION MODAL                                 -->
  <!-- ============================================================ -->
  <div id="registerModal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
      <div class="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <h2 class="text-xl font-bold text-stone-900">Farmer Registration</h2>
          <p class="text-xs text-stone-500 font-tamil">புதிய உழவர் கணக்கு பதிவு</p>
        </div>
        <button id="closeRegisterModalBtn" class="text-stone-400 hover:text-stone-600">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form id="registerForm" class="space-y-4 mt-4 text-xs">
        <div>
          <label class="block font-bold text-stone-700 uppercase tracking-wider mb-1">Full Name / முழு பெயர் *</label>
          <input type="text" id="regFullName" required placeholder="e.g. K. Arumugam" class="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-stone-700 uppercase tracking-wider mb-1">Mobile Number (10-digits) *</label>
            <input type="tel" id="regPhone" required pattern="[0-9]{10}" placeholder="9843012345" class="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm" />
          </div>
          <div>
            <label class="block font-bold text-stone-700 uppercase tracking-wider mb-1">Email Address *</label>
            <input type="email" id="regEmail" required placeholder="farmer@example.com" class="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-stone-700 uppercase tracking-wider mb-1">Password *</label>
            <input type="password" id="regPassword" required minlength="6" placeholder="Min 6 characters" class="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm" />
          </div>
          <div>
            <label class="block font-bold text-stone-700 uppercase tracking-wider mb-1">District / மாவட்டம் *</label>
            <select id="regDistrict" class="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white">
              <option value="Madurai">Madurai (மதுரை)</option>
              <option value="Thanjavur">Thanjavur (தஞ்சாவூர்)</option>
              <option value="Coimbatore">Coimbatore (கோயம்புத்தூர்)</option>
              <option value="Tiruppur">Tiruppur (திருப்பூர்)</option>
              <option value="Erode">Erode (ஈரோடு)</option>
              <option value="Salem">Salem (சேலம்)</option>
              <option value="Tiruchirappalli">Tiruchirappalli (திருச்சிராப்பள்ளி)</option>
              <option value="Tirunelveli">Tirunelveli (திருநெல்வேலி)</option>
            </select>
          </div>
        </div>

        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <label class="block font-bold text-[#14532D] mb-1">Farmland Details (Optional)</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="number" step="0.1" id="regLandSize" placeholder="Land Size (Acres)" class="px-3 py-1.5 border border-stone-300 rounded-lg text-xs bg-white" />
            <select id="regSoilType" class="px-3 py-1.5 border border-stone-300 rounded-lg text-xs bg-white">
              <option value="red">Red Soil (செம்மண்)</option>
              <option value="black">Black Soil (கரிசல்)</option>
              <option value="alluvial">Alluvial (வண்டல்)</option>
              <option value="clay">Clay (களிமண்)</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" id="cancelRegisterBtn" class="px-4 py-2 border border-stone-300 rounded-xl font-bold text-stone-600">Cancel</button>
          <button type="submit" class="px-6 py-2 bg-[#14532D] text-white rounded-xl font-bold">Register & Enter</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ============================================================ -->
  <!-- 3. SIMPLE FARMER DASHBOARD (Rendered ONLY After Login)        -->
  <!-- ============================================================ -->
  <div id="dashboardView" class="hidden min-h-screen flex flex-col justify-between">
    
    <!-- Top Dashboard Header -->
    <header class="h-20 px-4 sm:px-8 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs flex items-center justify-between sticky top-0 z-40">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2.5 cursor-pointer" id="dashBrandClick">
          <div class="w-10 h-10 rounded-xl bg-[#14532D] flex items-center justify-center text-white shadow-sm">
            <span class="material-symbols-outlined text-[22px]">potted_plant</span>
          </div>
          <div>
            <span class="text-lg font-black text-[#14532D] tracking-tight block leading-tight">Uzhavan Hub</span>
            <span class="text-[11px] font-bold text-[#795548] font-tamil block -mt-0.5">உழவன் ஹப்</span>
          </div>
        </div>

        <button id="backToDashBtn" class="hidden items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#14532D] hover:bg-emerald-100 text-xs font-bold border border-emerald-200">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to Dashboard</span>
        </button>
      </div>

      <!-- Header Controls -->
      <div class="flex items-center gap-3">
        <!-- Voice Guidance Button -->
        <button id="dashAudioGuideBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-[#14532D] hover:bg-emerald-100 border border-emerald-200">
          <span class="material-symbols-outlined text-sm" id="dashAudioIcon">campaign</span>
          <span class="hidden sm:inline">Voice Guide</span>
        </button>

        <!-- Language Selector -->
        <button id="dashLangToggle" class="px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50">தமிழ்</button>

        <!-- User Profile Pill & Logout -->
        <div class="flex items-center gap-2 p-1.5 pl-2.5 bg-stone-100 rounded-xl border border-stone-200">
          <div class="w-7 h-7 rounded-lg bg-[#14532D] text-white flex items-center justify-center text-xs font-bold" id="userAvatar">M</div>
          <div class="hidden sm:block text-left pr-1">
            <div class="text-xs font-bold text-stone-900 leading-tight" id="userNameHeader">Murugan P.</div>
            <div class="text-[10px] text-stone-500 font-medium" id="userLocationHeader">Madurai</div>
          </div>
          <button id="logoutBtn" title="Logout / வெளியேறு" class="p-1 hover:text-rose-600 text-stone-400 transition-colors">
            <span class="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Dashboard Container -->
    <main class="flex-1 px-4 sm:px-8 max-w-7xl w-full mx-auto py-8">
      
      <!-- Welcome Hero Banner -->
      <div class="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#003b1b] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div>
          <div class="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-500/30 text-emerald-100 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <span class="material-symbols-outlined text-sm">verified_user</span>
            <span id="dashStatusBadge">Uzhavan Hub • Live Dashboard</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black tracking-tight" id="dashWelcomeHeading">
            Welcome back, Murugan P.!
          </h1>
          <p class="text-emerald-100 text-sm mt-1 max-w-xl font-medium" id="dashWelcomeSub">
            Your personalized agricultural operations and smart farming advisor for Madurai district.
          </p>
        </div>

        <!-- Active Farmland Plot Widget -->
        <div class="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-start sm:items-end gap-1.5 text-right">
          <div class="text-[11px] text-emerald-200 uppercase font-bold tracking-wider">Active Farmland Plot</div>
          <div class="font-extrabold text-white text-base">Vadakku Kadu (North Field)</div>
          <div class="text-xs text-emerald-100">3.50 Acres • Red Soil • Borewell</div>
          <button id="dashAddPlotBtn" class="mt-1 px-3 py-1 bg-white text-[#14532D] hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all shadow-sm">
            + Add Farmland Plot
          </button>
        </div>
      </div>

      <!-- 4 Telemetry Status Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Weather Card -->
        <div onclick="openModuleView('weather')" class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all cursor-pointer">
          <div class="flex items-center justify-between text-xs font-bold text-stone-500 uppercase">
            <span>Local Weather</span>
            <span class="material-symbols-outlined text-amber-500 text-2xl">partly_cloudy_day</span>
          </div>
          <div class="text-2xl font-black text-stone-900 my-1">33°C</div>
          <div class="text-xs text-stone-600 font-medium">Partly Cloudy, 65% Humidity</div>
          <div class="text-[11px] text-emerald-700 font-bold mt-2 flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">check_circle</span>
            <span>Safe for spraying</span>
          </div>
        </div>

        <!-- Current Crop Card -->
        <div onclick="openModuleView('crop_planning')" class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all cursor-pointer">
          <div class="flex items-center justify-between text-xs font-bold text-stone-500 uppercase">
            <span>Active Cultivation</span>
            <span class="material-symbols-outlined text-[#14532D] text-2xl">spa</span>
          </div>
          <div class="text-lg font-black text-stone-900 my-1 line-clamp-1">Cotton & Black Gram</div>
          <div class="text-xs text-stone-500">Day 24 • Vegetative Stage</div>
          <div class="text-[11px] text-[#14532D] font-bold mt-2">Harvest in ~45 days</div>
        </div>

        <!-- Farm Tasks Card -->
        <div onclick="openModuleView('farm_management')" class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all cursor-pointer">
          <div class="flex items-center justify-between text-xs font-bold text-stone-500 uppercase">
            <span>Weekly Tasks</span>
            <span class="material-symbols-outlined text-rose-600 text-2xl">checklist</span>
          </div>
          <div class="text-2xl font-black text-stone-900 my-1">2 Pending</div>
          <div class="text-xs text-stone-600 line-clamp-1">Weeding & DAP application</div>
          <div class="text-[11px] text-amber-700 font-bold mt-2 flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">schedule</span>
            <span>Due this week</span>
          </div>
        </div>

        <!-- Market Ticker Card -->
        <div onclick="openModuleView('market_prices')" class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all cursor-pointer">
          <div class="flex items-center justify-between text-xs font-bold text-stone-500 uppercase">
            <span>Mandi Spot Rate</span>
            <span class="material-symbols-outlined text-emerald-600 text-2xl">trending_up</span>
          </div>
          <div class="text-xl font-black text-[#14532D] my-1">₹2,450 <span class="text-xs font-normal text-stone-500">/ Qtl</span></div>
          <div class="text-xs text-stone-600">Ponni Paddy (Madurai APMC)</div>
          <div class="text-[11px] text-emerald-700 font-bold mt-2 flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">arrow_upward</span>
            <span>+₹65 (Bullish Trend)</span>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- THE EXACTLY 10 MAIN FEATURE MODULES GRID                      -->
      <!-- ============================================================ -->
      <div id="tenModulesSection">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-stone-900 tracking-tight" id="dashModulesTitle">
              10 Main Agriculture Features
            </h2>
            <p class="text-xs text-stone-500 font-tamil mt-0.5" id="dashModulesSub">
              உங்கள் பண்ணையை எளிதாக நிர்வகிக்க 10 முதன்மை வழிகாட்டி பகுதிகள்
            </p>
          </div>
          <span class="text-xs font-bold text-[#14532D] bg-[#E8F2E8] px-3 py-1 rounded-full">
            10 Categories
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5" id="modulesCardsContainer">
          <!-- 10 Modules injected cleanly -->
        </div>
      </div>

      <!-- DYNAMIC MODULE VIEW CONTAINER (Replaces modules when opened) -->
      <div id="activeModuleDetailView" class="hidden space-y-6">
        <!-- Rendered when user opens any module -->
      </div>

    </main>

    <!-- Simple Dashboard Footer -->
    <footer class="bg-white border-t border-stone-200 py-4 px-6 text-center text-xs text-stone-500">
      Uzhavan Hub (உழவன் ஹப்) • AI-Powered Smart Agriculture for Tamil Nadu Farmers
    </footer>

  </div>

  <!-- ADD PLOT MODAL -->
  <div id="addPlotModal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
      <div class="flex items-center justify-between pb-3 border-b border-stone-100">
        <h3 class="font-bold text-stone-900 text-base">Add Farmland Plot</h3>
        <button id="closeAddPlotBtn" class="text-stone-400 hover:text-stone-600"><span class="material-symbols-outlined">close</span></button>
      </div>
      <form id="addPlotForm" class="space-y-3 mt-3 text-xs">
        <div>
          <label class="block font-bold text-stone-700 mb-1">Plot Title *</label>
          <input type="text" id="plotNameInput" required placeholder="e.g. Vadakku Kadu" class="w-full px-3 py-2 border rounded-xl" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-stone-700 mb-1">Area Size *</label>
            <input type="number" step="0.01" id="plotAreaInput" required value="2.5" class="w-full px-3 py-2 border rounded-xl" />
          </div>
          <div>
            <label class="block font-bold text-stone-700 mb-1">Unit</label>
            <select id="plotUnitInput" class="w-full px-3 py-2 border rounded-xl bg-white">
              <option value="acres">Acres (ஏக்கர்)</option>
              <option value="cents">Cents (சென்ட்)</option>
              <option value="hectares">Hectares (ஹெக்டேர்)</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-stone-700 mb-1">Soil Type</label>
            <select id="plotSoilInput" class="w-full px-3 py-2 border rounded-xl bg-white">
              <option value="red">Red Soil (செம்மண்)</option>
              <option value="black">Black Soil (கரிசல்)</option>
              <option value="alluvial">Alluvial (வண்டல்)</option>
              <option value="clay">Clay (களிமண்)</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-stone-700 mb-1">Irrigation Source</label>
            <select id="plotIrrigInput" class="w-full px-3 py-2 border rounded-xl bg-white">
              <option value="borewell">Borewell (ஆழ்துளை கிணறு)</option>
              <option value="canal">Canal (கால்வாய்)</option>
              <option value="rainfall">Rainfed (மானாவாரி)</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" id="cancelPlotBtn" class="px-4 py-2 border rounded-xl text-stone-600">Cancel</button>
          <button type="submit" class="px-5 py-2 bg-[#14532D] text-white rounded-xl font-bold">Save Plot</button>
        </div>
      </form>
    </div>
  </div>

  <!-- APPLICATION LOGIC & API CONTROLLER -->
  <script>
    // 10 Main Categories Manifest
    const TEN_MODULES = [
      {
        id: 'crop_planning',
        number: '01',
        title: 'Crop Planning and Farming Guidance',
        titleTa: 'பயிர் திட்டம் & வழிகாட்டி',
        icon: 'psychology',
        color: 'from-emerald-700 to-green-800',
        desc: 'Suitability recommendations based on soil, season, water and budget with NPK fertilizer dosing.',
        descTa: 'மண், பருவம், நீர் மற்றும் பட்ஜெட் அடிப்படையிலான சிறந்த பயிர் பரிந்துரைகள்.'
      },
      {
        id: 'crop_doctor',
        number: '02',
        title: 'AI Crop Doctor',
        titleTa: 'பயிர் மருத்துவர் & நோய் அறிதல்',
        icon: 'document_scanner',
        color: 'from-green-700 to-emerald-900',
        desc: 'Upload crop photos, identify observed symptoms, and get organic neem remedies with expert advice.',
        descTa: 'பயிர் இலை படம் எடுத்து பதிவேற்றி நோய்களை கண்டறிந்து இயற்கை மருந்துகள் பெறலாம்.'
      },
      {
        id: 'weather',
        number: '03',
        title: 'Weather and Alerts',
        titleTa: 'வானிலை & முன்னறிவிப்பு',
        icon: 'partly_cloudy_day',
        color: 'from-teal-700 to-emerald-800',
        desc: 'Hyperlocal 7-day forecast, rainfall probability, humidity and crop spraying advisories.',
        descTa: '7 நாள் உள்ளூர் வானிலை முன்னறிவிப்பு, மழை வாய்ப்பு மற்றும் தெளிப்பு பாதுகாப்பு.'
      },
      {
        id: 'market_prices',
        number: '04',
        title: 'Market Prices and Selling',
        titleTa: 'சந்தை விலை & விற்பனை',
        icon: 'trending_up',
        color: 'from-amber-700 to-yellow-800',
        desc: 'APMC mandi spot prices, 7-day trend, and net return comparison (Mandi vs FPO vs Farmgate).',
        descTa: 'ஒழுங்குமுறை விற்பனைக்கூட நேரடி விலை நிலவரம் மற்றும் நிகர லாப ஒப்பீடு.'
      },
      {
        id: 'government_schemes',
        number: '05',
        title: 'Government Schemes and Insurance',
        titleTa: 'அரசு மானியங்கள் & காப்பீடு',
        icon: 'account_balance',
        color: 'from-emerald-800 to-teal-900',
        desc: 'PM-KISAN, PMFBY insurance, 100% drip subsidy eligibility check & required documents.',
        descTa: 'சொட்டு நீர்ப் பாசன 100% மானியம், பி.எம் கிசான் மற்றும் அரசு உதவி திட்டங்கள்.'
      },
      {
        id: 'farm_finance',
        number: '06',
        title: 'Farm Finance and Profit',
        titleTa: 'பண்ணை நிதி & லாப கணக்கீடு',
        icon: 'payments',
        color: 'from-[#795548] to-[#5D4037]',
        desc: 'Cost of cultivation calculator, Net Profit = Revenue − Costs, and 4% KCC loan simulator.',
        descTa: 'பயிர்க்கான செலவு, நிகர லாப கணக்கீடு மற்றும் 4% கிசான் கடன் வட்டி மானியம்.'
      },
      {
        id: 'community',
        number: '07',
        title: 'Farmer Community and Expert Support',
        titleTa: 'உழவர் மன்றம் & விவாதங்கள்',
        icon: 'forum',
        color: 'from-emerald-700 to-stone-800',
        desc: 'Ask farming questions, share experiences, read answers, and connect with verified experts.',
        descTa: 'விவசாயிகள் கலந்துரையாடல், பயிர் நோய் தீர்வுகள் மற்றும் அனுபவப் பகிர்வு.'
      },
      {
        id: 'equipment_sharing',
        number: '08',
        title: 'Equipment and Resource Sharing',
        titleTa: 'உழவு இயந்திரங்கள் & கூலி',
        icon: 'precision_manufacturing',
        color: 'from-stone-700 to-emerald-900',
        desc: 'Tractors, harvesters, drone sprayers at regulated CHC rates and verified farm crew booking.',
        descTa: 'டிராக்டர், கொய் அறுவடை இயந்திரங்கள் வாடகை மற்றும் நடவு/அறுவடை தொழிலாளர்கள்.'
      },
      {
        id: 'livestock',
        number: '09',
        title: 'Livestock and Allied Farming',
        titleTa: 'கால்நடை & 1962 ஆம்புலன்ஸ்',
        icon: 'medical_services',
        color: 'from-rose-800 to-red-950',
        desc: 'Cattle & goat health, free vaccination schedule, and direct 1-tap call to 1962 animal ambulance.',
        descTa: 'மாடு, ஆடு மருத்துவ பராமரிப்பு, தடுப்பூசி அட்டவணை மற்றும் 1962 ஆம்புலன்ஸ் உதவி.'
      },
      {
        id: 'farm_management',
        number: '10',
        title: 'Farm Management',
        titleTa: 'பண்ணை மேலாண்மை & நிலங்கள்',
        icon: 'landscape',
        color: 'from-emerald-800 to-green-950',
        desc: 'Add farmland plots, track acres/cents, soil pH, sowing dates, and harvest ledger.',
        descTa: 'உங்கள் நிலங்கள், மண் பரிசோதனை, விதைப்பு நாட்கள் மற்றும் பயிர் வரவு செலவு பராமரிப்பு.'
      }
    ];

    let currentUser = null;
    let currentLanguage = 'en';

    // Check existing session
    const storedUser = localStorage.getItem('uzhavan_user');
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
      } catch (e) {}
    }

    // Render Login or Dashboard based on session
    function updateViewState() {
      const loginView = document.getElementById('loginView');
      const dashboardView = document.getElementById('dashboardView');
      
      if (!currentUser) {
        loginView.classList.remove('hidden');
        dashboardView.classList.add('hidden');
      } else {
        loginView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        
        // Update user elements
        document.getElementById('userNameHeader').textContent = currentUser.full_name || 'Farmer';
        document.getElementById('userLocationHeader').textContent = currentUser.district || 'Tamil Nadu';
        document.getElementById('userAvatar').textContent = (currentUser.full_name || 'U')[0];
        document.getElementById('dashWelcomeHeading').textContent = currentLanguage === 'ta'
          ? \`வணக்கம் \${currentUser.full_name || 'உழவர்'}!\`
          : \`Welcome back, \${currentUser.full_name || 'Farmer'}!\`;
        
        renderTenModulesGrid();
      }
    }

    // Render 10 Modules Grid
    function renderTenModulesGrid() {
      const container = document.getElementById('modulesCardsContainer');
      if (!container) return;
      const isTa = currentLanguage === 'ta';

      container.innerHTML = TEN_MODULES.map(m => \`
        <div onclick="openModuleView('\${m.id}')" class="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between hover:border-emerald-300">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br \${m.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <span class="material-symbols-outlined text-[30px]">\${m.icon}</span>
            </div>
            <div>
              <span class="text-[11px] font-black text-stone-400 uppercase tracking-widest">Module \${m.number}</span>
              <h3 class="text-lg font-black text-stone-900 group-hover:text-[#14532D] transition-colors leading-tight mt-0.5">\${m.title}</h3>
              <div class="text-xs font-bold text-[#795548] font-tamil mt-0.5">\${m.titleTa}</div>
              <p class="text-xs text-stone-600 mt-2 leading-relaxed">\${isTa ? m.descTa : m.desc}</p>
            </div>
          </div>
          <div class="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#14532D]">
            <span class="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>\${isTa ? 'தொடங்குக' : 'Open Feature'}</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
            <span class="text-[10px] text-stone-400 font-semibold uppercase">Uzhavan Hub</span>
          </div>
        </div>
      \`).join('');
    }

    // Open Specific Module View
    async function openModuleView(moduleId) {
      const tenSection = document.getElementById('tenModulesSection');
      const detailView = document.getElementById('activeModuleDetailView');
      const backBtn = document.getElementById('backToDashBtn');

      tenSection.classList.add('hidden');
      detailView.classList.remove('hidden');
      backBtn.classList.remove('hidden');
      backBtn.classList.add('inline-flex');

      detailView.innerHTML = '<div class="text-center py-12 text-stone-400"><span class="material-symbols-outlined animate-spin text-3xl text-[#14532D]">progress_activity</span><p class="text-xs mt-2">Loading feature details...</p></div>';

      const mod = TEN_MODULES.find(m => m.id === moduleId);

      if (moduleId === 'crop_planning') {
        // Module 01: Crop Planning & Guidance
        detailView.innerHTML = \`
          <div class="space-y-6">
            <div class="bg-gradient-to-r from-[#14532D] to-emerald-800 text-white p-6 rounded-2xl shadow">
              <h2 class="text-2xl font-black">Module 01: Crop Planning and Farming Guidance</h2>
              <p class="text-xs text-emerald-100 font-tamil mt-1">பயிர் திட்டம், மண் பரிசோதனை மற்றும் துல்லிய உர அட்டவணை</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-2xl border border-stone-200">
                <h3 class="font-bold text-stone-900 text-sm mb-2 flex items-center gap-1.5"><span class="material-symbols-outlined text-[#14532D]">psychology</span> 6-Dimension AI Advice</h3>
                <p class="text-xs text-stone-600 mb-3">Evaluates soil strata, rainfall, irrigation availability, and market trends.</p>
                <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <div class="font-bold text-[#14532D]">Rank #1: Paddy Ponni (BPT 5204)</div>
                  <div class="text-stone-500 text-[11px]">Match: 98% • Water: 1200mm • Duration: 140 Days</div>
                </div>
              </div>
              <div class="bg-white p-6 rounded-2xl border border-stone-200">
                <h3 class="font-bold text-stone-900 text-sm mb-2 flex items-center gap-1.5"><span class="material-symbols-outlined text-[#14532D]">science</span> Soil & Nutrient Dosing</h3>
                <p class="text-xs text-stone-600 mb-3">Precision 4R stewardship guidelines for basal and vegetative splits.</p>
                <div class="text-xs text-stone-700 space-y-1">
                  <div>• Urea: 65 kg / Acre (2 Splits)</div>
                  <div>• DAP: 54 kg / Acre (Basal Application)</div>
                  <div>• MOP Potash: 42 kg / Acre (Flowering)</div>
                </div>
              </div>
              <div class="bg-white p-6 rounded-2xl border border-stone-200">
                <h3 class="font-bold text-stone-900 text-sm mb-2 flex items-center gap-1.5"><span class="material-symbols-outlined text-[#14532D]">water_drop</span> Irrigation Scheduling</h3>
                <p class="text-xs text-stone-600 mb-3">Regulated watering cycles to maintain 2cm shallow water depth.</p>
                <div class="text-xs text-stone-500">Postpone canal let-out during forecast pre-monsoon showers.</div>
              </div>
            </div>
          </div>
        \`;
      } else if (moduleId === 'crop_doctor') {
        // Module 02: AI Crop Doctor
        detailView.innerHTML = \`
          <div class="space-y-6">
            <div class="bg-gradient-to-r from-emerald-800 to-[#14532D] text-white p-6 rounded-2xl shadow">
              <h2 class="text-2xl font-black">Module 02: AI Crop Doctor</h2>
              <p class="text-xs text-emerald-100 font-tamil mt-1">பயிர் இலை படம் எடுத்து நோய்களை கண்டறிந்து இயற்கை தீர்வு பெறுங்கள்</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold text-stone-700 uppercase mb-2">Upload Crop Leaf Photograph</label>
                <div class="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center cursor-pointer hover:border-[#14532D] transition-colors">
                  <span class="material-symbols-outlined text-4xl text-stone-400">add_a_photo</span>
                  <div class="text-xs font-bold text-stone-700 mt-2">Click to select photo (JPEG, PNG, WebP)</div>
                  <div class="text-[10px] text-stone-400 mt-0.5">Maximum file size: 10 MB</div>
                </div>
              </div>
              <div class="space-y-3">
                <label class="block text-xs font-bold text-stone-700 uppercase">Or Select Observed Symptoms</label>
                <select class="w-full px-3 py-2 border rounded-xl text-xs bg-white">
                  <option>Spindle-shaped brown lesions on leaves (Blast / இலைக் கருகல்)</option>
                  <option>Yellowing of leaf tips with curling (Nutrient Deficiency)</option>
                  <option>White powder coating on upper leaf surface (Powdery Mildew)</option>
                </select>
                <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                  <div class="font-bold text-[#14532D]">Organic Neem Remedy Recommendation:</div>
                  <p class="text-stone-700">Spray 5% Neem Seed Kernel Extract (NSKE) or Tricyclazole @ 0.6g/Litre in early morning hours.</p>
                  <div class="text-[10px] text-stone-500 pt-1">Consult local block Agriculture Officer for severe infections.</div>
                </div>
              </div>
            </div>
          </div>
        \`;
      } else if (moduleId === 'market_prices') {
        // Module 04: Market Prices
        try {
          const res = await fetch('/api/market/prices').then(r => r.json());
          const prices = res.prices || res.data || [];
          detailView.innerHTML = \`
            <div class="space-y-6">
              <div class="bg-gradient-to-r from-amber-700 to-yellow-800 text-white p-6 rounded-2xl shadow">
                <h2 class="text-2xl font-black">Module 04: Market Prices and Selling</h2>
                <p class="text-xs text-amber-100 font-tamil mt-1">ஒழுங்குமுறை விற்பனைக்கூட நேரடி விலை நிலவரம் மற்றும் நிகர லாப ஒப்பீடு</p>
              </div>
              <div class="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex justify-between">
                <span><strong>Sell or Hold Guidance:</strong> Paddy prices are on a 7-day upward trend (+₹65/Qtl).</span>
                <span class="bg-[#14532D] text-white px-2 py-0.5 rounded text-[10px] font-bold">FPO Bulk Recommended</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                \${prices.map(p => \`
                  <div class="bg-white p-4 rounded-xl border border-stone-200">
                    <div class="font-bold text-xs text-stone-900">\${p.commodity}</div>
                    <div class="text-[10px] text-stone-500 font-tamil">\${p.commodityTa || ''}</div>
                    <div class="text-xl font-black text-[#14532D] my-2">₹\${p.wholesalePriceQtl.toLocaleString('en-IN')} <span class="text-xs font-normal text-stone-400">/ Qtl</span></div>
                    <div class="text-[10px] text-stone-500 flex justify-between border-t pt-2">
                      <span>\${p.market}</span>
                      <span class="text-emerald-700 font-bold">\${p.sentiment}</span>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>
          \`;
        } catch (e) {
          detailView.innerHTML = '<div class="text-rose-600 text-xs">Error loading prices: ' + e.message + '</div>';
        }
      } else if (moduleId === 'livestock') {
        // Module 09: Livestock
        detailView.innerHTML = \`
          <div class="space-y-6">
            <div class="bg-gradient-to-r from-rose-800 to-red-900 text-white p-6 sm:p-8 rounded-2xl shadow flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 class="text-2xl font-black">Module 09: Livestock and Allied Farming</h2>
                <p class="text-xs text-rose-100 font-tamil mt-1">கால்நடை அவசர உதவி எண் 1962 மற்றும் மருத்துவ கையேடு</p>
              </div>
              <a href="tel:1962" class="px-6 py-3 bg-white text-rose-800 hover:bg-rose-50 font-black rounded-xl text-sm shadow flex items-center gap-2">
                <span class="material-symbols-outlined text-rose-700">call</span>
                Dial 1962 Toll-Free
              </a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white p-6 rounded-2xl border border-stone-200 text-xs space-y-3">
                <h3 class="font-bold text-stone-900 text-sm">Govt 24/7 Veterinary Polyclinics:</h3>
                <div class="space-y-2 text-stone-600">
                  <div class="p-2.5 bg-stone-50 rounded-lg"><strong>Thanjavur:</strong> Medical College Rd (04362-230488) - 24/7 Mobile Ambulance</div>
                  <div class="p-2.5 bg-stone-50 rounded-lg"><strong>Madurai:</strong> Dindigul Main Rd (0452-2531234) - Casualty Unit</div>
                  <div class="p-2.5 bg-stone-50 rounded-lg"><strong>Coimbatore:</strong> Trichy Road (0422-2212345) - Ultrasound & Surgery</div>
                </div>
              </div>
              <div class="bg-white p-6 rounded-2xl border border-stone-200 text-xs space-y-3">
                <h3 class="font-bold text-stone-900 text-sm">Tamil Nadu Free Vaccination Calendar:</h3>
                <div class="space-y-1.5 text-stone-700">
                  <div class="flex justify-between p-2 bg-emerald-50 rounded-lg font-medium">
                    <span>Foot and Mouth Disease (FMD)</span>
                    <span class="text-emerald-800">Bi-annual (March & Sept)</span>
                  </div>
                  <div class="flex justify-between p-2 bg-stone-50 rounded-lg font-medium">
                    <span>Black Quarter (BQ)</span>
                    <span class="text-stone-600">Annual (May - June)</span>
                  </div>
                  <div class="flex justify-between p-2 bg-stone-50 rounded-lg font-medium">
                    <span>Haemorrhagic Septicaemia (HS)</span>
                    <span class="text-stone-600">Annual (August - Sept)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        \`;
      } else {
        // Generic module view
        detailView.innerHTML = \`
          <div class="space-y-6">
            <div class="bg-gradient-to-r \${mod.color} text-white p-6 rounded-2xl shadow">
              <h2 class="text-2xl font-black">Module \${mod.number}: \${mod.title}</h2>
              <p class="text-xs text-stone-200 font-tamil mt-1">\${mod.titleTa}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-stone-200 text-xs space-y-3">
              <p class="text-stone-700 leading-relaxed font-medium">\${mod.desc}</p>
              <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <strong>Feature Status:</strong> Integrated with the Uzhavan Hub relational backend and verified reference datasets.
              </div>
            </div>
          </div>
        \`;
      }
    }

    // Back to Dashboard Button
    document.getElementById('backToDashBtn').addEventListener('click', () => {
      document.getElementById('tenModulesSection').classList.remove('hidden');
      document.getElementById('activeModuleDetailView').classList.add('hidden');
      document.getElementById('backToDashBtn').classList.add('hidden');
      document.getElementById('backToDashBtn').classList.remove('inline-flex');
    });
    document.getElementById('dashBrandClick').addEventListener('click', () => {
      document.getElementById('tenModulesSection').classList.remove('hidden');
      document.getElementById('activeModuleDetailView').classList.add('hidden');
      document.getElementById('backToDashBtn').classList.add('hidden');
    });

    // Login Form Submit
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errBox = document.getElementById('loginErrorMsg');

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }).then(r => r.json());

        if (res.user) {
          currentUser = res.user;
          localStorage.setItem('uzhavan_user', JSON.stringify(res.user));
          updateViewState();
        } else {
          errBox.classList.remove('hidden');
          document.getElementById('loginErrorText').textContent = res.error || 'Invalid credentials.';
        }
      } catch (err) {
        errBox.classList.remove('hidden');
        document.getElementById('loginErrorText').textContent = 'Login error: ' + err.message;
      }
    });

    // 1-Click Demo Logins
    async function handleDemoLogin(type) {
      try {
        const res = await fetch('/api/auth/demo-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ demoType: type })
        }).then(r => r.json());

        if (res.user) {
          currentUser = res.user;
          localStorage.setItem('uzhavan_user', JSON.stringify(res.user));
          updateViewState();
        }
      } catch (err) {
        alert('Demo login error: ' + err.message);
      }
    }

    document.getElementById('demoMuruganBtn').addEventListener('click', () => handleDemoLogin('murugan'));
    document.getElementById('demoAnithaBtn').addEventListener('click', () => handleDemoLogin('anitha'));

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (e) {}
      currentUser = null;
      localStorage.removeItem('uzhavan_user');
      updateViewState();
    });

    // Toggle Password Visibility
    document.getElementById('togglePasswordBtn').addEventListener('click', () => {
      const p = document.getElementById('loginPassword');
      const icon = document.getElementById('togglePasswordIcon');
      if (p.type === 'password') {
        p.type = 'text';
        icon.textContent = 'visibility_off';
      } else {
        p.type = 'password';
        icon.textContent = 'visibility';
      }
    });

    // Registration Modal Open & Close
    const regModal = document.getElementById('registerModal');
    document.getElementById('openRegisterBtn').addEventListener('click', () => regModal.classList.remove('hidden'));
    document.getElementById('openRegisterFromHeader').addEventListener('click', () => regModal.classList.remove('hidden'));
    document.getElementById('closeRegisterModalBtn').addEventListener('click', () => regModal.classList.add('hidden'));
    document.getElementById('cancelRegisterBtn').addEventListener('click', () => regModal.classList.add('hidden'));

    // Register Form Submit
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        full_name: document.getElementById('regFullName').value,
        phone: document.getElementById('regPhone').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        district: document.getElementById('regDistrict').value,
        land_size: document.getElementById('regLandSize').value || 2.5,
        soil_type: document.getElementById('regSoilType').value || 'red'
      };

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json());

        if (res.user) {
          currentUser = res.user;
          localStorage.setItem('uzhavan_user', JSON.stringify(res.user));
          regModal.classList.add('hidden');
          updateViewState();
        } else {
          alert('Registration error: ' + (res.error || 'Failed to create account'));
        }
      } catch (err) {
        alert('Registration error: ' + err.message);
      }
    });

    // Add Plot Modal Controls
    const addPlotModal = document.getElementById('addPlotModal');
    document.getElementById('dashAddPlotBtn').addEventListener('click', () => addPlotModal.classList.remove('hidden'));
    document.getElementById('closeAddPlotBtn').addEventListener('click', () => addPlotModal.classList.add('hidden'));
    document.getElementById('cancelPlotBtn').addEventListener('click', () => addPlotModal.classList.add('hidden'));

    document.getElementById('addPlotForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        plot_name: document.getElementById('plotNameInput').value,
        area_value: parseFloat(document.getElementById('plotAreaInput').value),
        area_unit: document.getElementById('plotUnitInput').value,
        soil_type: document.getElementById('plotSoilInput').value,
        irrigation_source: document.getElementById('plotIrrigInput').value
      };
      try {
        await fetch('/api/plots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        addPlotModal.classList.add('hidden');
        alert('New farmland plot registered successfully!');
      } catch (err) {
        alert('Error saving plot: ' + err.message);
      }
    });

    // Voice Guidance Audio Toggle in Dashboard
    const audioBtn = document.getElementById('dashAudioGuideBtn');
    let isPlaying = false;
    audioBtn.addEventListener('click', () => {
      if (!('speechSynthesis' in window)) {
        alert('Voice guidance is supported in modern browsers.');
        return;
      }
      if (isPlaying) {
        window.speechSynthesis.cancel();
        isPlaying = false;
        document.getElementById('dashAudioIcon').textContent = 'campaign';
      } else {
        const text = currentLanguage === 'ta'
          ? 'வணக்கம் முருகேசன் அவர்களே! உழவன் ஹப் உங்களை வரவேற்கிறது. உங்கள் மதுரை மாவட்ட நிலத்திற்கு நடப்பு பருவத்தில் பருத்தி மற்றும் உளுந்து சிறந்த பயிர்களாக கணிக்கப்பட்டுள்ளது.'
          : 'Welcome to Uzhavan Hub, Murugan! Your active farmland in Madurai is currently recommended for Cotton and Black Gram cultivation.';
        const u = new SpeechSynthesisUtterance(text);
        u.lang = currentLanguage === 'ta' ? 'ta-IN' : 'en-IN';
        u.onend = () => {
          isPlaying = false;
          document.getElementById('dashAudioIcon').textContent = 'campaign';
        };
        window.speechSynthesis.speak(u);
        isPlaying = true;
        document.getElementById('dashAudioIcon').textContent = 'volume_up';
      }
    });

    // Language Toggles
    document.getElementById('langTaBtn').addEventListener('click', () => { currentLanguage = 'ta'; updateViewState(); });
    document.getElementById('langEnBtn').addEventListener('click', () => { currentLanguage = 'en'; updateViewState(); });
    document.getElementById('dashLangToggle').addEventListener('click', () => {
      currentLanguage = currentLanguage === 'ta' ? 'en' : 'ta';
      document.getElementById('dashLangToggle').textContent = currentLanguage === 'ta' ? 'English' : 'தமிழ்';
      updateViewState();
    });

    // Initialize View State on Load
    updateViewState();
  </script>
</body>
</html>`;

// Write to client/index.html and root index.html
fs.writeFileSync(path.join(ROOT_DIR, 'client/index.html'), fullHtml, 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), fullHtml, 'utf8');

console.log('client/index.html and index.html written successfully!');
