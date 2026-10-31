import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../');

const DATA_DIR = path.join(ROOT_DIR, 'data');
const BACKEND_DATA_DIR = path.join(ROOT_DIR, 'backend', 'data');

if (!fs.existsSync(BACKEND_DATA_DIR)) {
  fs.mkdirSync(BACKEND_DATA_DIR, { recursive: true });
}

// 1. districts.json (Tamil Nadu districts)
const tnDistricts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'tamil_nadu_districts.json'), 'utf8'));
fs.writeFileSync(path.join(DATA_DIR, 'districts.json'), JSON.stringify(tnDistricts, null, 2));
fs.writeFileSync(path.join(BACKEND_DATA_DIR, 'districts.json'), JSON.stringify(tnDistricts, null, 2));

// 2. villages_sample.json (Realistic Tamil Nadu sample villages across major districts)
const sampleVillages = [
  { id: "vil_01", district: "Madurai", taluk: "Vadipatti", village: "Alanganallur", villageTa: "அலங்காநல்லூர்", soilPrimary: "red", canalCommand: false, groundwaterStatus: "Semi-critical" },
  { id: "vil_02", district: "Madurai", taluk: "Melur", village: "Vellalur", villageTa: "வெள்ளலூர்", soilPrimary: "red", canalCommand: true, groundwaterStatus: "Safe" },
  { id: "vil_03", district: "Thanjavur", taluk: "Kumbakonam", village: "Thirunageswaram", villageTa: "திருநாகேஸ்வரம்", soilPrimary: "alluvial", canalCommand: true, groundwaterStatus: "Abundant" },
  { id: "vil_04", district: "Thanjavur", taluk: "Papanasam", village: "Ayyampettai", villageTa: "அய்யம்பேட்டை", soilPrimary: "alluvial", canalCommand: true, groundwaterStatus: "Abundant" },
  { id: "vil_05", district: "Coimbatore", taluk: "Pollachi", village: "Anaimalai", villageTa: "ஆனைமலை", soilPrimary: "red", canalCommand: true, groundwaterStatus: "Safe" },
  { id: "vil_06", district: "Erode", taluk: "Bhavani", village: "Kavindapadi", villageTa: "கவுந்தப்பாடி", soilPrimary: "black", canalCommand: true, groundwaterStatus: "Safe" },
  { id: "vil_07", district: "Tiruppur", taluk: "Dharapuram", village: "Kundadam", villageTa: "குண்டடம்", soilPrimary: "red", canalCommand: false, groundwaterStatus: "Deficit" },
  { id: "vil_08", district: "Salem", taluk: "Attur", village: "Thalaivasal", villageTa: "தலைவாசல்", soilPrimary: "red", canalCommand: false, groundwaterStatus: "Semi-critical" },
  { id: "vil_09", district: "Tiruchirappalli", taluk: "Lalgudi", village: "Pullambadi", villageTa: "புள்ளம்பாடி", soilPrimary: "alluvial", canalCommand: true, groundwaterStatus: "Safe" },
  { id: "vil_10", district: "Tirunelveli", taluk: "Ambasamudram", village: "Kallidaikurichi", villageTa: "கல்லிடைக்குறிச்சி", soilPrimary: "alluvial", canalCommand: true, groundwaterStatus: "Safe" },
  { id: "vil_11", district: "Dindigul", taluk: "Oddanchatram", village: "Kallimandhayam", villageTa: "கள்ளிமந்தையம்", soilPrimary: "red", canalCommand: false, groundwaterStatus: "Deficit" },
  { id: "vil_12", district: "Theni", taluk: "Periyakulam", village: "Vadaveeranaickenpatty", villageTa: "வடவீரநாயக்கன்பட்டி", soilPrimary: "red", canalCommand: true, groundwaterStatus: "Safe" }
];
fs.writeFileSync(path.join(DATA_DIR, 'villages_sample.json'), JSON.stringify(sampleVillages, null, 2));
fs.writeFileSync(path.join(BACKEND_DATA_DIR, 'villages_sample.json'), JSON.stringify(sampleVillages, null, 2));

// 3. seasons.json
const seasons = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'crop_seasons.json'), 'utf8'));
fs.writeFileSync(path.join(DATA_DIR, 'seasons.json'), JSON.stringify(seasons, null, 2));
fs.writeFileSync(path.join(BACKEND_DATA_DIR, 'seasons.json'), JSON.stringify(seasons, null, 2));

// 4. cultivation_costs.json
const costs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'crop_costs_and_yields.json'), 'utf8'));
fs.writeFileSync(path.join(DATA_DIR, 'cultivation_costs.json'), JSON.stringify(costs, null, 2));
fs.writeFileSync(path.join(BACKEND_DATA_DIR, 'cultivation_costs.json'), JSON.stringify(costs, null, 2));

// 5. equipment_listings.json
const equipment = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'machinery_catalog.json'), 'utf8'));
fs.writeFileSync(path.join(DATA_DIR, 'equipment_listings.json'), JSON.stringify(equipment, null, 2));
fs.writeFileSync(path.join(BACKEND_DATA_DIR, 'equipment_listings.json'), JSON.stringify(equipment, null, 2));

// 6. livestock_guides.json
const livestock = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'livestock_health_guides.json'), 'utf8'));
fs.writeFileSync(path.join(DATA_DIR, 'livestock_guides.json'), JSON.stringify(livestock, null, 2));
fs.writeFileSync(path.join(BACKEND_DATA_DIR, 'livestock_guides.json'), JSON.stringify(livestock, null, 2));

// 7. demo_farmers.json
const demoFarmers = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'sample_farmer_profiles.json'), 'utf8'));
fs.writeFileSync(path.join(DATA_DIR, 'demo_farmers.json'), JSON.stringify(demoFarmers, null, 2));
fs.writeFileSync(path.join(BACKEND_DATA_DIR, 'demo_farmers.json'), JSON.stringify(demoFarmers, null, 2));

// 8. demo_farms.json
const demoPlots = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'sample_land_plots.json'), 'utf8'));
fs.writeFileSync(path.join(DATA_DIR, 'demo_farms.json'), JSON.stringify(demoPlots, null, 2));
fs.writeFileSync(path.join(BACKEND_DATA_DIR, 'demo_farms.json'), JSON.stringify(demoPlots, null, 2));

// 9. crop_recommendations.json (Documented Rule-Based Agricultural Engine Dataset)
const cropRecs = [
  {
    condition: "Alluvial / Clay, Samba Season, Canal / Abundant Water",
    recommendations: [
      {
        cropId: "paddy_bpt5204",
        cropName: "Paddy (Ponni BPT 5204)",
        cropNameTa: "பொன்னி நெல் (BPT 5204)",
        category: "Cereals",
        suitabilityScore: 94,
        suitabilityReason: "Delta alluvial soil retains optimal root-zone moisture; high market demand across Tamil Nadu mills.",
        suitabilityReasonTa: "வண்டல் மண் ஈரப்பதத்தை நன்கு தக்கவைக்கும்; தமிழ்நாடு அரிசி ஆலைகளில் அதிக தேவை மற்றும் சிறந்த விலை.",
        waterRequirementMm: 1250,
        waterNeedLabel: "High (1200 - 1300 mm)",
        durationDays: 140,
        durationLabel: "135 - 140 Days",
        estimatedCostPerAcre: 35000,
        potentialYieldRange: "24 - 28 Quintals/Acre",
        mainRisks: "Blast disease during overcast monsoon; lodging if excessive nitrogen is applied.",
        mainRisksTa: "பனிப்பொழிவின் போது இலைக் கருகல் நோய்; அதிக யூரியா இட்டால் பயிர் சாயும் அபாயம்.",
        source: "TNAU Agronomy Guidelines (Demonstration Benchmark)",
        dataStatus: "sample"
      },
      {
        cropId: "blackgram_vbn8",
        cropName: "Black Gram (VBN 8)",
        cropNameTa: "உளுந்து (VBN 8)",
        category: "Pulses",
        suitabilityScore: 88,
        suitabilityReason: "Ideal post-paddy relay crop; fixes atmospheric nitrogen and requires minimal residual moisture.",
        suitabilityReasonTa: "நெல் தரிசு பயிராக சிறந்தது; வளிமண்டல தழைச்சத்தை நிலைநிறுத்தி குறைந்த ஈரப்பதத்தில் விளையும்.",
        waterRequirementMm: 350,
        waterNeedLabel: "Low (300 - 400 mm)",
        durationDays: 68,
        durationLabel: "65 - 70 Days",
        estimatedCostPerAcre: 11000,
        potentialYieldRange: "4 - 5.5 Quintals/Acre",
        mainRisks: "Yellow Mosaic Virus (YMV) transmitted by whiteflies.",
        mainRisksTa: "வெள்ளையீ மூலம் பரவும் மஞ்சள் தேமல் நோய்.",
        source: "TNAU Pulse Directorate (Demonstration Benchmark)",
        dataStatus: "sample"
      },
      {
        cropId: "banana_grandnaine",
        cropName: "Banana (Grand Naine / G9)",
        cropNameTa: "வாழை (ஜி-9)",
        category: "Horticulture",
        suitabilityScore: 82,
        suitabilityReason: "High economic revenue in perennial riverbeds with reliable irrigation infrastructure.",
        suitabilityReasonTa: "ஆற்றுப்படுகை நிலங்களில் தொடர்ந்து பாசனம் இருக்கும்போது மிக அதிக வருவாய் தரும் தோட்டக்கலை பயிர்.",
        waterRequirementMm: 1800,
        waterNeedLabel: "Very High (1800 - 2000 mm)",
        durationDays: 330,
        durationLabel: "11 - 12 Months",
        estimatedCostPerAcre: 85000,
        potentialYieldRange: "30 - 35 Tonnes/Acre",
        mainRisks: "Wind damage during summer storms; Sigatoka leaf spot in humid spells.",
        mainRisksTa: "கோடை சூறாவளி காற்று சேதம்; சிகடோகா இலைப்புள்ளி நோய்.",
        source: "NRCB Trichy (Demonstration Benchmark)",
        dataStatus: "sample"
      }
    ]
  },
  {
    condition: "Red / Loam Soil, Kuruvai / Summer, Borewell / Moderate Water",
    recommendations: [
      {
        cropId: "cotton_hybrid",
        cropName: "Cotton (Bt Hybrid)",
        cropNameTa: "பருத்தி (ஹைப்ரிட்)",
        category: "Commercial",
        suitabilityScore: 92,
        suitabilityReason: "Thrives in warm sunny climates with deep taproot utilizing borewell irrigation efficiently.",
        suitabilityReasonTa: "சூரிய ஒளி மிகுந்த தட்பவெப்பத்தில் ஆழமான வேர் அமைப்புடன் ஆழ்துளை கிணற்று நீரை பயன்படுத்தி நன்கு வளரும்.",
        waterRequirementMm: 650,
        waterNeedLabel: "Moderate (600 - 700 mm)",
        durationDays: 155,
        durationLabel: "150 - 160 Days",
        estimatedCostPerAcre: 28000,
        potentialYieldRange: "9 - 12 Quintals/Acre",
        mainRisks: "Sucking pests (jassids/thrips) during vegetative phase.",
        mainRisksTa: "ஆரம்ப கட்டத்தில் சாறு உறிஞ்சும் பூச்சிகள் தாக்குதல்.",
        source: "CICR Coimbatore Benchmark",
        dataStatus: "sample"
      },
      {
        cropId: "groundnut_tmv7",
        cropName: "Groundnut (TMV 7)",
        cropNameTa: "மணிலா / வேர்க்கடலை (TMV 7)",
        category: "Oilseeds",
        suitabilityScore: 89,
        suitabilityReason: "Red sandy loam permits free peg penetration and easy pod harvesting.",
        suitabilityReasonTa: "செம்மண் சரளை நிலம் விழுதுகள் எளிதாக இறங்கி தரமான காய்கள் உருவாக ஏதுவானது.",
        waterRequirementMm: 450,
        waterNeedLabel: "Moderate (400 - 500 mm)",
        durationDays: 105,
        durationLabel: "100 - 105 Days",
        estimatedCostPerAcre: 22000,
        potentialYieldRange: "10 - 14 Quintals/Acre",
        mainRisks: "Tikka leaf spot and wild boar damage during pod filling.",
        mainRisksTa: "திக்கா இலைப்புள்ளி நோய் மற்றும் காய் பிடிக்கும் போது பன்றி சேதம்.",
        source: "TNAU Oilseeds Research Station",
        dataStatus: "sample"
      },
      {
        cropId: "maize_hybrid",
        cropName: "Hybrid Maize (COH(M) 8)",
        cropNameTa: "மக்காச்சோளம் (ஹைப்ரிட்)",
        category: "Feed & Food",
        suitabilityScore: 85,
        suitabilityReason: "Fast growing, low labour intensity, high feed factory procurement demand.",
        suitabilityReasonTa: "குறைந்த ஆட்கள் தேவை, வேகமான வளர்ச்சி மற்றும் தீவன ஆலைகளில் உடனடி கொள்முதல்.",
        waterRequirementMm: 500,
        waterNeedLabel: "Moderate (500 mm)",
        durationDays: 105,
        durationLabel: "100 - 110 Days",
        estimatedCostPerAcre: 19000,
        potentialYieldRange: "28 - 34 Quintals/Acre",
        mainRisks: "Fall Armyworm (FAW) caterpillar in whorl stage.",
        mainRisksTa: "குருத்து பகுதியில் படைப்புழு தாக்குதல்.",
        source: "TNAU Millets Directorate",
        dataStatus: "sample"
      }
    ]
  }
];
fs.writeFileSync(path.join(DATA_DIR, 'crop_recommendations.json'), JSON.stringify(cropRecs, null, 2));
fs.writeFileSync(path.join(BACKEND_DATA_DIR, 'crop_recommendations.json'), JSON.stringify(cropRecs, null, 2));

// Copy other critical datasets to backend/data as well
['crops.json', 'soil_types.json', 'sample_weather.json', 'sample_market_prices.json', 'government_schemes.json'].forEach(f => {
  if (fs.existsSync(path.join(DATA_DIR, f))) {
    fs.copyFileSync(path.join(DATA_DIR, f), path.join(BACKEND_DATA_DIR, f));
  }
});

console.log('All 14 realistic sample datasets synchronized in data/ and backend/data/ successfully!');
