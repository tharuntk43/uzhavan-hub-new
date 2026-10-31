# Uzhavan Hub (உழவன் ஹப்) 🌾
## AI-Powered Smart Agriculture Platform for Tamil Nadu Farmers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v24-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Native%20SQLite-blue.svg)](https://www.postgresql.org/)
[![Lucide Icons](https://img.shields.io/badge/Icons-Pure%20SVG%20Lucide-emerald.svg)](https://lucide.dev/)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E0%AE%A4%E0%AE%AE%E0%AE%BF%E0%AE%B4%E0%AF%8D-teal.svg)](https://fonts.google.com/noto/specimen/Noto+Sans+Tamil)

**Uzhavan Hub (உழவன் ஹப்)** is a comprehensive, functional, bilingual, AI-powered agricultural platform designed specifically for farmers in Tamil Nadu, India. It combines agricultural intelligence, real-time APMC mandi spot prices, hyperlocal weather forecasts, 6-dimension crop recommendations, government scheme checklists, farm finance modeling, machinery rentals, and allied livestock veterinary services (1962 helpline) organized into **exactly 10 main feature categories**.

The platform is running live at:
👉 **http://localhost:5000** (or http://127.0.0.1:5000)

---

## 🚀 Key Improvements & UI/UX Repair

1. **Zero Text Icon Strings (Pure SVG Lucide Engine)**:
   - Completely replaced Google Material Symbols ligature dependencies with a pure SVG Lucide icon system (`assets/lucide.js` and `client/src/components/icons/LucideIcons.jsx`).
   - Completely eliminated broken ligature text strings such as `eco`, `visibility`, `partly_cloudy_day`, `arrow_forward`, `trending_up`, `groups`, `checklist`, `spa`, `verified_user`, and `person`.
   - Every single icon across the website is rendered as an inline, resolution-independent SVG graphic that works offline without network font delays.

2. **Zero Input Text & Icon Overlaps**:
   - Redesigned all input fields with generous left padding (`pl-11` / 44px) and precisely positioned SVG icons (`left-3.5 top-3`), completely eliminating text collision.

3. **Authentic Farmer Login Experience**:
   - Pixel-perfect implementation matching the supplied reference image (`media_1793169803722_a5ccc453.jpg`).
   - Left hero section features Tamil Nadu farmland scenic background, Uzhavan Hub unclipped logo, Tamil branding (உழவன் ஹப்), and 4 circular feature highlights.
   - Right section contains a clean Farmer Login card accepting **Email Address OR 10-digit Indian Mobile Number**.
   - Show/hide password toggle, remember me checkbox, and forgot password recovery modal.
   - **NO pre-filled fake credentials**: clean placeholder text.
   - 1-click verified demo farmer logins:
     - **Murugan P.** (Madurai — Cotton & Gram farmer, Red Soil)
     - **Anitha R.** (Thanjavur — Delta Paddy farmer, Alluvial Soil)

4. **5-Step First-Time Farmer Onboarding Wizard**:
   - **Step 1**: Personal Details (Full name, 10-digit mobile, email, password, preferred language).
   - **Step 2**: Farm Location with HTML5 Geolocation API (`📍 Detect My Location`) and 38-district Tamil Nadu dropdown fallback.
   - **Step 3**: Land Plots & Real-Time Unit Converter (Acres ↔ Cents ↔ Hectares live preview, Soil type, Irrigation source).
   - **Step 4**: Preferences & Livestock (Primary farming goal, dairy cattle, goats, poultry).
   - **Step 5**: Review & Save (Confirmation summary, persistent profile creation, and instant AI calibration).

5. **Clean Farmer Dashboard (Strictly 10 Categories)**:
   - Removed all 23-module clutter and the "All 23 Modules" button.
   - Personalized greeting: `Vanakkam, [Farmer Name]!` / `வணக்கம், [பெயர்]!`.
   - Active Farmland Plot badge with acreage and `+ Add Farmland Plot` modal.
   - 4 Telemetry Status Cards:
     1. *Local Weather*: 33°C, Partly Cloudy, 65% Humidity, Safe for foliar spraying indicator.
     2. *Active Cultivation*: Cotton & Black Gram, Day 24, Vegetative stage, Harvest in ~45 days.
     3. *Weekly Tasks*: 2 Pending (Weeding & DAP split application), Due this week.
     4. *Mandi Spot Rate*: ₹2,450 / Qtl, Ponni Paddy (Madurai APMC), +₹65 Bullish Trend.
   - 10 Main Categories Grid with bilingual titles, category numbering (01-10), and direct feature launchers.
   - Recommended Next Steps section with AI-calibrated action cards.

---

## 🌾 The Exactly 10 Main Feature Categories

| # | Category | Description | Key Capabilities |
|---|----------|-------------|------------------|
| **01** | **Crop Planning & Guidance** | 6-Dimension AI agronomic scoring | Evaluates soil, rainfall, season, water & budget; top 3 crops, 4R NPK dosing (Urea, DAP, Potash), irrigation schedule. |
| **02** | **AI Crop Doctor** | Pest & disease diagnostics | Leaf photo upload, symptom selection, organic 5% NSKE preparation recipe, free KVK expert helpline (1800-180-1551). |
| **03** | **Weather & Alerts** | Hyperlocal 7-day forecast | Rainfall probability, temperature, humidity, wind speed, spray safety windows. |
| **04** | **Market Prices & Selling** | APMC mandi spot prices | Real-time prices across Tamil Nadu, 7-day trends, Mandi vs FPO vs Farmgate net return comparison. |
| **05** | **Government Schemes & Insurance** | Subsidies & PMFBY insurance | 100% drip irrigation subsidy eligibility check, PM-KISAN, PMFBY Samba insurance deadlines & checklist. |
| **06** | **Farm Finance & Profit** | Cultivation economics & loans | 18 crop budget calculators, Net Profit = Revenue − Costs, 4% KCC interest subvention loan simulator. |
| **07** | **Farmer Community & Support** | Peer discussion & expert Q&A | Community forum, verified TNAU agronomist answers, ask questions, share farming practices. |
| **08** | **Equipment & Resource Sharing** | Custom Hiring Centres & labor | CHC machinery tariffs (tractors, rotavators, combine harvesters, drone sprayers), local labour crew directory. |
| **09** | **Livestock & Allied Farming** | Cattle care & animal ambulance | Free government vaccination schedule (FMD, BQ, Anthrax), direct 1-tap call to **1962** Mobile Animal Ambulance. |
| **10** | **Farm Management** | Multi-plot land & task manager | Plot registration, unit conversions (acres/cents/ha), soil pH tracking, crop ledger, weekly action checklist. |

---

## 💻 Technology Stack

- **Frontend**: React.js, Tailwind CSS, Lucide React SVG engine, Noto Sans Tamil typography, Web Speech API (Voice Guide).
- **Backend**: Node.js, Express.js architecture (`server/utils/expressShim.js`), modular controllers and routes.
- **Database**: PostgreSQL / SQLite Dual-Engine with persistent relational schema (`users`, `farmer_profiles`, `plots`, `tasks`, `posts`, `bookings`).
- **Data Catalogues**: 14 synchronized reference JSON datasets in both `data/` and `backend/data/`.

---

## 🧪 Verification & Testing

Run the automated test suites from the project root:

```bash
# 1. Verify JSON Reference Datasets
python tests/test_json_datasets.py
# Result: 4 tests, OK (100% PASS)

# 2. Verify All Backend REST API Endpoints
node tests/test_api_endpoints.js
# Result: ALL 23 FEATURE MODULE APIS VERIFIED WITH 100% SUCCESS!
```

---

## 🏃 Starting the Application

To launch Uzhavan Hub locally:

```bash
cd uzhavan-hub
node server/server.js
```

Open your browser at:
👉 **http://localhost:5000**
