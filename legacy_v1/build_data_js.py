# Build js/data.js integrating all 18 crops, JSON datasets, dynamic loader, and backward compatibility.

import json
import os
import sys

# Ensure UTF-8 output
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
JS_DIR = os.path.join(BASE_DIR, "js")

with open(os.path.join(DATA_DIR, "crops.json"), "r", encoding="utf-8") as f:
    crops_rec = json.load(f)

with open(os.path.join(DATA_DIR, "weather.json"), "r", encoding="utf-8") as f:
    weather_rec = json.load(f)

with open(os.path.join(DATA_DIR, "fertilizers.json"), "r", encoding="utf-8") as f:
    fert_rec = json.load(f)

with open(os.path.join(DATA_DIR, "marketPrices.json"), "r", encoding="utf-8") as f:
    mkt_rec = json.load(f)

with open(os.path.join(DATA_DIR, "rentals.json"), "r", encoding="utf-8") as f:
    rent_rec = json.load(f)

with open(os.path.join(DATA_DIR, "veterinary.json"), "r", encoding="utf-8") as f:
    vet_rec = json.load(f)

with open(os.path.join(DATA_DIR, "schemes.json"), "r", encoding="utf-8") as f:
    schemes_rec = json.load(f)

with open(os.path.join(DATA_DIR, "voiceFaq.json"), "r", encoding="utf-8") as f:
    faq_rec = json.load(f)

# Extract unique 18 crops to build CROPS_DATA
crops_map = {}
for r in crops_rec:
    cid = r["cropId"]
    if cid not in crops_map:
        crops_map[cid] = {
            "id": cid,
            "name": r["cropName"],
            "nameTa": r["cropNameTa"],
            "icon": r["icon"],
            "category": r["category"],
            "soilTypes": [r["soilType"]],
            "waterNeed": "High" if "High" in r["irrigationRequirement"] else "Moderate" if "Moderate" in r["irrigationRequirement"] else "Low",
            "suitableSeasons": [r["season"]],
            "investmentPerAcre": r["investmentPerAcre"],
            "yieldPerAcre": r["yieldPerAcre"],
            "marketPrice": r["marketPrice"],
            "durationDays": 105 if cid == "groundnut" else 120 if cid == "rice" else 150 if cid == "cotton" else 90 if "gram" in cid else 100,
            "riskLevel": r["riskLevel"].upper(),
            "suitabilityBase": 88,
            "reasonsEn": [
                f"Well-adapted to regional {r['soilType']} with favorable soil pH {r['soilPH']}.",
                f"Seasonal rainfall ({r['rainfall']}) and temperature ({r['temperature']}) match vegetative cycles.",
                f"Strong market demand with average farm-gate return of {r['netProfit']} per acre.",
                f"Balanced nutrient management using {r['recommendedFertilizer']}."
            ],
            "reasonsTa": [
                f"{r['soilType']} மண்ணில் pH {r['soilPH']} அளவுக்கு உகந்த பயிர் வளர்ச்சி.",
                f"பருவ மழைப்பொழிவு ({r['rainfall']}) மற்றும் வெப்பநிலை ({r['temperature']}) சிறந்த வளர்ச்சிக்கு உதவும்.",
                f"சந்தையில் நல்ல வரவேற்பு, ஏக்கருக்கு சராசரியாக {r['netProfit']} நிகர லாபம்.",
                f"பரிந்துரைக்கப்பட்ட உர மேலாண்மை: {r['recommendedFertilizer']}."
            ],
            "weeklyPlan": [
                {"week": 1, "titleEn": "Land Preparation", "titleTa": "நிலம் தயாரித்தல்", "phase": "Preparation", "icon": "🚜", "descEn": f"Plough twice and incorporate well-rotted FYM in {r['soilType']}."},
                {"week": 2, "titleEn": "Sowing & Seed Treatment", "titleTa": "விதைப்பு & விதை நேர்த்தி", "phase": "Sowing", "icon": "🌱", "descEn": "Treat seed before sowing with bio-fertilizers."},
                {"week": 4, "titleEn": "Weeding & Basal Fertilizer", "titleTa": "களை எடுத்தல் & அடி உரம்", "phase": "Maintenance", "icon": "🌿", "descEn": r["fertilizerSchedule"].get("basal", "Apply basal fertilizer")},
                {"week": 7, "titleEn": "Vegetative Care", "titleTa": "வளர்ச்சி மேலாண்மை", "phase": "Nutrition", "icon": "🧪", "descEn": r["fertilizerSchedule"].get("vegetative", "Top dress fertilizer")},
                {"week": 10, "titleEn": "Flowering / Earhead Scouting", "titleTa": "பூக்கும் பருவம் கண்காணிப்பு", "phase": "Pest & Disease", "icon": "🐛", "descEn": r["diseaseRiskPrevention"]},
                {"week": 14, "titleEn": "Harvesting & Curing", "titleTa": "அறுவடை & சேமிப்பு", "phase": "Harvest", "icon": "🧺", "descEn": r["fertilizerSchedule"].get("maturity", "Harvest at full physiological maturity")}
            ],
            "fertilizer": {
                "npk": f"{r['nitrogen']} N : {r['phosphorus']} P : {r['potassium']} K / acre",
                "stages": [
                    {"stageEn": "Basal (At Sowing)", "stageTa": "அடி உரம் (விதைக்கும் போது)", "recEn": r["fertilizerSchedule"].get("basal", "Basal dose"), "recTa": "அடி உரம் பரிந்துரை"},
                    {"stageEn": "Vegetative Growth", "stageTa": "வளர்ச்சி பருவம்", "recEn": r["fertilizerSchedule"].get("vegetative", "Vegetative top-dressing"), "recTa": "மேலுரம் பரிந்துரை"},
                    {"stageEn": "Flowering / Pod Filling", "stageTa": "பூக்கும் / காய் திரட்சி பருவம்", "recEn": r["fertilizerSchedule"].get("flowering", "Flowering booster"), "recTa": "பூக்கும் பருவ உரம்"}
                ],
                "organic": "Neem Cake 100kg/acre + Trichoderma viride + Phosphobacteria bio-fertilizer",
                "precautionsEn": "Ensure adequate soil moisture prior to top-dressing; avoid excess nitrogen under overcast skies.",
                "precautionsTa": "உரமிடுவதற்கு முன் நிலத்தில் போதிய ஈரம் இருக்க வேண்டும். மேகமூட்டமான நாட்களில் அதிக தழைச்சத்து இடுவதை தவிர்க்கவும்."
            },
            "risks": {
                "overall": r["riskLevel"].upper(),
                "weatherRisk": "Moderate during heavy rainfall periods",
                "pestRisk": "Low to Moderate with routine scouting",
                "diseaseRisk": r["diseaseRiskPrevention"]
            }
        }
    else:
        # Append soil types and seasons
        if r["soilType"] not in crops_map[cid]["soilTypes"]:
            crops_map[cid]["soilTypes"].append(r["soilType"])
        if r["season"] not in crops_map[cid]["suitableSeasons"]:
            crops_map[cid]["suitableSeasons"].append(r["season"])

crops_data_list = list(crops_map.values())

# Backward compatible human workers and machines
human_workers_data = []
for i, r in enumerate(rent_rec):
    if r["type"] == "Human":
        item = dict(r)
        item["avatar"] = "👨‍🌾"
        item["distanceKm"] = round(2.0 + (i % 8) * 1.3, 1)
        item["primaryWork"] = r["workType"]
        item["primaryWorkTa"] = r["workType"]
        item["allWorkTypes"] = [r["workType"], "General farm work"]
        item["experienceYears"] = int(r["experience"].split()[0]) if r["experience"][0].isdigit() else 6
        item["dailyWage"] = r["rate"]
        item["reviewsCount"] = 20 + (i % 30)
        item["availableStatus"] = "available" if r["availability"] == "Immediate" else "busy"
        item["phone"] = r["contact"]
        item["location"] = f"{r['district']} Central"
        human_workers_data.append(item)

machinery_data = []
for j, r in enumerate(rent_rec):
    if r["type"] == "Machine":
        item = dict(r)
        item["type"] = r["machineType"]
        item["typeTa"] = r["machineType"]
        item["model"] = r["name"]
        item["distanceKm"] = round(2.5 + (j % 9) * 1.4, 1)
        is_hr = "/hour" in r["rateUnit"]
        item["pricePerHour"] = r["rate"] if is_hr else int(r["rate"] / 8)
        item["pricePerDay"] = r["rate"] * 8 if is_hr else r["rate"]
        item["rateFormatted"] = r["rateFormatted"]
        item["specs"] = [r["experience"], "Fuel Efficient", "Tested"]
        item["reviewsCount"] = 25 + (j % 35)
        item["availableStatus"] = "available" if r["availability"] == "Immediate" else "busy"
        item["phone"] = r["contact"]
        item["location"] = f"{r['district']} Agro Hub"
        machinery_data.append(item)

# Weather mock backward compatible
weather_mock = {
    "current": {
        "temp": 31,
        "feelsLike": 34,
        "humidity": 68,
        "rainProbability": 70,
        "windSpeed": 14,
        "uvIndex": "High (7)",
        "condition": "Partly Cloudy with Thunderstorm Alert",
        "conditionTa": "பகுதி மேகமூட்டம் & இடிமின்னல் மழை எச்சரிக்கை"
    },
    "alert": {
        "titleEn": "Heavy Rainfall & Local Thunderstorm Warning",
        "titleTa": "கனமழை மற்றும் இடிமின்னல் எச்சரிக்கை",
        "risksEn": [
            "Excessive root-zone waterlogging in low-lying fields.",
            "Lodging risk for tall vegetative crops.",
            "High humidity promoting foliar fungal sporulation."
        ],
        "risksTa": [
            "பள்ளமான நிலங்களில் நீர் தேங்கி வேரழுகல் அபாயம்.",
            "பலத்த காற்றினால் உயரமான பயிர்கள் சாயும் வாய்ப்பு.",
            "அதிக ஈரப்பதத்தால் இலைப்புள்ளி பூஞ்சாண நோய் பரவல்."
        ],
        "actionsEn": [
            "Clear field drainage trenches immediately to prevent inundation.",
            "Pause scheduled irrigation and avoid heavy urea top-dressing today.",
            "Postpone chemical insecticide sprays until rain subsides."
        ],
        "actionsTa": [
            "நிலத்தில் நீர் தேங்காதவாறு வடிகால் வாய்க்கால்களை உடனே தூர்வாரவும்.",
            "இன்றைய பாசனத்தை நிறுத்தவும்; யூரியா மேலுரம் இடுவதை தள்ளிப்போடவும்.",
            "மழை நிற்கும் வரை பூச்சிக்கொல்லி மருந்துகள் தெளிப்பதை தவிர்க்கவும்."
        ]
    }
}

# Cattle health disease guides
cattle_health_data = {
    "cow": [
        {
            "name": "Mastitis",
            "nameTa": "மடி வீக்க நோய்",
            "symptomsEn": "Hot, painful, swollen quarters of udder; milk turns watery, yellowish with flakes, clots, or blood.",
            "symptomsTa": "மடி வீங்கி சூடாகவும், தொட்டால் வலியுடனும் இருத்தல்; பால் நீர்த்துப்போதல் அல்லது சீழ்/ரத்தம் கலந்திருத்தல்.",
            "causesEn": "Bacterial pathogens (Streptococcus, E. coli) entering teat canal from unhygienic bedding.",
            "causesTa": "அசுத்தமான தரை விரிப்பு வழியாக காம்பு துளைக்குள் பாக்டீரியா கிருமிகள் நுழைதல்.",
            "preventionEn": "Post-milking teat dipping in 0.5% povidone iodine; clean, dry, lime-disinfected shed floors.",
            "preventionTa": "பால் கறந்த பின் காம்புகளை பொவிடோன் அயோடின் கரைசலில் நனைத்தல்; கொட்டகையை உலர்வாக வைத்திருத்தல்.",
            "whenToContactEn": "Call veterinary doctor immediately within 6-12 hours of noticing clotted milk for intramammary antibiotic infusions.",
            "whenToContactTa": "பாலில் திரி திரியாக அல்லது ரத்தம் தென்பட்டால் 6-12 மணி நேரத்திற்குள் மருத்துவரை அழைக்கவும்.",
            "severity": "CRITICAL"
        },
        {
            "name": "Foot and Mouth Disease (FMD)",
            "nameTa": "கோமாரி நோய்",
            "symptomsEn": "High fever, ropy salivation hanging from mouth, blisters on tongue, gums, and interdigital clefts of hooves causing severe lameness.",
            "symptomsTa": "கடும் காய்ச்சல், வாயிலிருந்து நுரை கலந்த உமிழ்நீர் வடிதல், நாக்கு மற்றும் குளம்புகளில் கொப்புளங்கள் ஏற்பட்டு நொண்டுதல்.",
            "causesEn": "Highly contagious Aphthovirus transmitted through aerosol, saliva, and contaminated feed/water.",
            "causesTa": "ஆப்தோவைரஸ் கிருமி மூலம் காற்று, உமிழ்நீர் மற்றும் தீவனம் வழியாக அதிவேகமாக பரவுதல்.",
            "preventionEn": "Bi-annual FMD vaccination (May-June and Nov-Dec). Disinfect shed entrances with 4% washing soda.",
            "preventionTa": "ஆண்டுக்கு இருமுறை கோமாரி தடுப்பூசி தவறாமல் போடுதல். கொட்டகை வாசலில் சோடா சுண்ணாம்பு தொட்டி அமைத்தல்.",
            "whenToContactEn": "Report immediately to the local veterinary surgeon to quarantine and receive symptomatic antiseptic washes.",
            "whenToContactTa": "அறிகுறிகள் கண்டவுடன் உடனடியாக அரசு கால்நடை மருத்துவருக்கு தகவல் தெரிவிக்கவும்.",
            "severity": "HIGH"
        }
    ],
    "buffalo": [
        {
            "name": "Haemorrhagic Septicaemia (HS / Komari)",
            "nameTa": "தொண்டை அடைப்பான் நோய்",
            "symptomsEn": "Sudden high fever (106°F), severe respiratory distress, painful hot swelling in throat, dewlap and brisket; grunting respiration.",
            "symptomsTa": "திடீர் கடும் காய்ச்சல், தொண்டை மற்றும் நெஞ்சுப் பகுதியில் சூடான வீக்கம், மூச்சு விட சிரமப்பட்டு உறுமுதல்.",
            "causesEn": "Pasteurella multocida bacteria multiplying in bloodstream following wet, humid weather stress.",
            "causesTa": "ஈரப்பதம் மற்றும் வானிலை மாற்றத்தால் ரத்தத்தில் பாஸ்டுரெல்லா பாக்டீரியா பெருகுதல்.",
            "preventionEn": "Annual pre-monsoon HS vaccination in May-June. Avoid wallowing in stagnant muddy ponds.",
            "preventionTa": "மழைக்காலத்திற்கு முன் மே-ஜூன் மாதங்களில் தொண்டை அடைப்பான் தடுப்பூசி போடுதல்.",
            "whenToContactEn": "Emergency! Death can occur within 12-24 hours. Call vet for immediate intravenous antibiotic therapy.",
            "whenToContactTa": "அதி அவசரம்! 24 மணி நேரத்திற்குள் இறப்பு நேரலாம் என்பதால் உடனே மருத்துவரை அழைக்கவும்.",
            "severity": "CRITICAL"
        }
    ],
    "goat": [
        {
            "name": "PPR (Goat Plague)",
            "nameTa": "பி.பி.ஆர் நோய் (ஆட்டுக்கொல்லை நோய்)",
            "symptomsEn": "High fever, foul-smelling watery diarrhea, crusted sores around mouth and nostrils, pneumonia.",
            "symptomsTa": "காய்ச்சல், துர்நாற்றத்துடன் கூடிய வயிற்றுப்போக்கு, வாய் மற்றும் மூக்கைச் சுற்றி புண்கள் தோன்றுதல்.",
            "causesEn": "Morbillivirus spread via direct contact, secretions, and common grazing.",
            "causesTa": "மார்பில்லி வைரஸ் மூலம் உமிழ்நீர் மற்றும் நேரடி தொடர்பு வழியாக பரவும் கொடிய தொற்று.",
            "preventionEn": "PPR vaccine given once every 3 years. Quarantine new goats for 21 days.",
            "preventionTa": "3 ஆண்டுகளுக்கு ஒருமுறை PPR தடுப்பூசி போடுதல். புதிய ஆடுகளை 21 நாட்கள் தனிமைப்படுத்துதல்.",
            "whenToContactEn": "Contact vet at first sign of mouth ulcers to start supportive antibiotic therapy.",
            "whenToContactTa": "புண்கள் தென்பட்டவுடன் மருத்துவரை அணுகி சிகிச்சை பெறவும்.",
            "severity": "CRITICAL"
        }
    ],
    "sheep": [
        {
            "name": "Sheep Pox",
            "nameTa": "செம்மறி அம்மை நோய்",
            "symptomsEn": "High fever, circular red papules erupting on face, ears, and wool-free areas of thighs.",
            "symptomsTa": "காய்ச்சல், முகம், காதுகள் மற்றும் முடி இல்லாத பகுதிகளில் அம்மை கொப்புளங்கள் தோன்றுதல்.",
            "causesEn": "Capripoxvirus spread via aerosol droplets and dried scab dust.",
            "causesTa": "கேப்ரிபாக்ஸ் வைரஸ் கிருமியால் காற்று மூலம் பரவும் தொற்று.",
            "preventionEn": "Annual Sheep Pox vaccination before monsoon.",
            "preventionTa": "வருடத்திற்கு ஒருமுறை செம்மறி அம்மை தடுப்பூசி போடுதல்.",
            "whenToContactEn": "Consult veterinarian for antibiotic cover to prevent secondary complications.",
            "whenToContactTa": "புண்கள் சீழ்பிடிப்பதை தடுக்க மருத்துவரை அணுகவும்.",
            "severity": "HIGH"
        }
    ],
    "calf": [
        {
            "name": "Calf Scours (White Diarrhea)",
            "nameTa": "கன்றுக்குட்டி வெள்ளைக் கழிச்சல்",
            "symptomsEn": "Watery yellowish-white foul-smelling diarrhea, sunken dull eyes, dehydration, weakness.",
            "symptomsTa": "மஞ்சள் அல்லது வெள்ளை நிறத்தில் துர்நாற்றத்துடன் வயிற்றுப்போக்கு, கண்கள் குழிவிழுந்து கன்று சோர்வடைதல்.",
            "causesEn": "Rotavirus, Coronavirus, or E. coli from damp pens and delayed colostrum feeding.",
            "causesTa": "பிறந்தவுடன் சீம்பால் கொடுக்கத் தவறுதல் மற்றும் அசுத்தமான தரை வழியே பரவும் கிருமிகள்.",
            "preventionEn": "Feed warm mother colostrum within 2 hours of birth; keep calf pen warm and dry.",
            "preventionTa": "பிறந்த 2 மணி நேரத்திற்குள் சீம்பால் தவறாமல் புகட்டவும்; கன்றின் கொட்டகை உலர்வாக இருக்க வேண்டும்.",
            "whenToContactEn": "Call vet immediately for electrolyte rehydration fluids and antibiotic bolus.",
            "whenToContactTa": "கன்று பலவீனமடையாமல் இருக்க உடனடியாக மருத்துவரிடம் எலக்ட்ரோலைட் சிகிச்சை பெறவும்.",
            "severity": "HIGH"
        }
    ]
}

# Personas
demo_personas = [
    {
        "id": "murugan", "name": "Murugan P.", "nameTa": "முருகன் பா.",
        "location": "Madurai District", "landArea": 3.0, "soilType": "Red Soil",
        "waterSource": "Borewell", "currentCrop": "Groundnut", "previousCrop": "Cotton",
        "budget": 60000, "language": "ta"
    },
    {
        "id": "selvi", "name": "Selvi R.", "nameTa": "செல்வி ரா.",
        "location": "Thanjavur District", "landArea": 4.0, "soilType": "Alluvial Soil",
        "waterSource": "Canal", "currentCrop": "Rice", "previousCrop": "Blackgram",
        "budget": 80000, "language": "ta"
    },
    {
        "id": "kumar", "name": "Kumar S.", "nameTa": "குமார் செ.",
        "location": "Coimbatore District", "landArea": 2.5, "soilType": "Black Soil",
        "waterSource": "Well", "currentCrop": "Cotton", "previousCrop": "Maize",
        "budget": 50000, "language": "en"
    }
]

# Write out js/data.js
out_code = f"""// Uzhavan Hub - Agriculture Dataset & Dynamic Configuration
// Contains synchronous pre-bundled datasets and asynchronous JSON loaders.

const CROPS_DATA = {json.dumps(crops_data_list, ensure_ascii=False, indent=2)};

const CROPS_RECOMMENDATIONS = {json.dumps(crops_rec, ensure_ascii=False, indent=2)};

const WEATHER_RECORDS = {json.dumps(weather_rec, ensure_ascii=False, indent=2)};

const WEATHER_MOCK = {json.dumps(weather_mock, ensure_ascii=False, indent=2)};

const FERTILIZERS_DATA = {json.dumps(fert_rec, ensure_ascii=False, indent=2)};

const MARKET_PRICES = {json.dumps(mkt_rec, ensure_ascii=False, indent=2)};

const RENTALS_DATA = {json.dumps(rent_rec, ensure_ascii=False, indent=2)};

const FARM_WORKERS_DATA = {json.dumps(human_workers_data, ensure_ascii=False, indent=2)};

const MACHINERY_DATA = {json.dumps(machinery_data, ensure_ascii=False, indent=2)};

const VETERINARY_RECORDS = {json.dumps(vet_rec, ensure_ascii=False, indent=2)};

const VETERINARY_FACILITIES_DATA = {json.dumps(vet_rec, ensure_ascii=False, indent=2)};

const CATTLE_HEALTH_DATA = {json.dumps(cattle_health_data, ensure_ascii=False, indent=2)};

const GOVERNMENT_SCHEMES = {json.dumps(schemes_rec, ensure_ascii=False, indent=2)};

const AGRI_LOANS = {json.dumps([s for s in schemes_rec if s['category'] == 'Agricultural loans'], ensure_ascii=False, indent=2)};

const VOICE_FAQ = {json.dumps(faq_rec, ensure_ascii=False, indent=2)};

const DEMO_PERSONAS = {json.dumps(demo_personas, ensure_ascii=False, indent=2)};

// Dynamic loader utility
const UzhavanDataLoader = {{
  async loadAll() {{
    try {{
      const [crops, weather, ferts, market, rentals, vet, schemes, faq] = await Promise.all([
        fetch('data/crops.json').then(r => r.json()),
        fetch('data/weather.json').then(r => r.json()),
        fetch('data/fertilizers.json').then(r => r.json()),
        fetch('data/marketPrices.json').then(r => r.json()),
        fetch('data/rentals.json').then(r => r.json()),
        fetch('data/veterinary.json').then(r => r.json()),
        fetch('data/schemes.json').then(r => r.json()),
        fetch('data/voiceFaq.json').then(r => r.json())
      ]);

      if (crops && Array.isArray(crops)) window.UZHAVAN_DATA.CROPS_RECOMMENDATIONS = crops;
      if (weather && Array.isArray(weather)) window.UZHAVAN_DATA.WEATHER_RECORDS = weather;
      if (ferts && Array.isArray(ferts)) window.UZHAVAN_DATA.FERTILIZERS_DATA = ferts;
      if (market && Array.isArray(market)) window.UZHAVAN_DATA.MARKET_PRICES = market;
      if (rentals && Array.isArray(rentals)) {{
        window.UZHAVAN_DATA.RENTALS_DATA = rentals;
        window.UZHAVAN_DATA.FARM_WORKERS_DATA = rentals.filter(r => r.type === 'Human');
        window.UZHAVAN_DATA.MACHINERY_DATA = rentals.filter(r => r.type === 'Machine');
      }}
      if (vet && Array.isArray(vet)) {{
        window.UZHAVAN_DATA.VETERINARY_RECORDS = vet;
        window.UZHAVAN_DATA.VETERINARY_FACILITIES_DATA = vet;
      }}
      if (schemes && Array.isArray(schemes)) {{
        window.UZHAVAN_DATA.GOVERNMENT_SCHEMES = schemes;
        window.UZHAVAN_DATA.AGRI_LOANS = schemes.filter(s => s.category === 'Agricultural loans');
      }}
      if (faq && Array.isArray(faq)) window.UZHAVAN_DATA.VOICE_FAQ = faq;
      console.log("[Uzhavan Hub] Datasets dynamically synchronized from data/*.json");
    }} catch (e) {{
      console.log("[Uzhavan Hub] Running with pre-bundled offline datasets.", e);
    }}
  }}
}};

// Export to global scope
window.UZHAVAN_DATA = {{
  CROPS_DATA,
  CROPS_RECOMMENDATIONS,
  WEATHER_RECORDS,
  WEATHER_MOCK,
  FERTILIZERS_DATA,
  MARKET_PRICES,
  RENTALS_DATA,
  FARM_WORKERS_DATA,
  MACHINERY_DATA,
  VETERINARY_RECORDS,
  VETERINARY_FACILITIES_DATA,
  CATTLE_HEALTH_DATA,
  GOVERNMENT_SCHEMES,
  AGRI_LOANS,
  VOICE_FAQ,
  DEMO_PERSONAS,
  loadFromJSON: UzhavanDataLoader.loadAll
}};

window.UzhavanDataLoader = UzhavanDataLoader;
"""

with open(os.path.join(JS_DIR, "data.js"), "w", encoding="utf-8") as f:
    f.write(out_code)

print("SUCCESS: js/data.js generated with all datasets and dynamic loader!")
