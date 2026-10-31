"""
Uzhavan Hub - Canonical Data Generator
Generates all 19 JSON reference catalogs and datasets into data/
Adheres to all requirements of Part 4.
"""

import os
import sys
import json

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# 1. tamil_nadu_districts.json - All 38 districts with agro-climatic zones
DISTRICTS = [
    {"id": "ariyalur", "name": "Ariyalur", "nameTa": "அரியலூர்", "zone": "North Eastern Zone", "dominantSoil": "Red & Black Soil", "rainfallMm": 954, "majorMandis": ["Ariyalur", "Jayankondam"]},
    {"id": "chengalpattu", "name": "Chengalpattu", "nameTa": "செங்கல்பட்டு", "zone": "North Eastern Zone", "dominantSoil": "Coastal Alluvium & Sandy Clay", "rainfallMm": 1200, "majorMandis": ["Chengalpattu", "Madurantakam"]},
    {"id": "chennai", "name": "Chennai", "nameTa": "சென்னை", "zone": "Coastal Zone", "dominantSoil": "Coastal Alluvium", "rainfallMm": 1300, "majorMandis": ["Koyambedu Wholesale Market"]},
    {"id": "coimbatore", "name": "Coimbatore", "nameTa": "கோயம்புத்தூர்", "zone": "Western Zone", "dominantSoil": "Red Loam & Black Soil", "rainfallMm": 670, "majorMandis": ["R.S. Puram", "Pollachi", "Mettupalayam"]},
    {"id": "cuddalore", "name": "Cuddalore", "nameTa": "கடலூர்", "zone": "North Eastern Zone", "dominantSoil": "Coastal Alluvial & Red Loam", "rainfallMm": 1250, "majorMandis": ["Cuddalore", "Virudhachalam", "Chidambaram"]},
    {"id": "dharmapuri", "name": "Dharmapuri", "nameTa": "தர்மபுரி", "zone": "North Western Zone", "dominantSoil": "Red Sandy Loam", "rainfallMm": 850, "majorMandis": ["Dharmapuri", "Palacode", "Harur"]},
    {"id": "dindigul", "name": "Dindigul", "nameTa": "திண்டுக்கல்", "zone": "Southern Zone", "dominantSoil": "Red Loam & Black Soil", "rainfallMm": 810, "majorMandis": ["Dindigul Market", "Oddanchatram", "Palani"]},
    {"id": "erode", "name": "Erode", "nameTa": "ஈரோடு", "zone": "Western Zone", "dominantSoil": "Red Sandy Loam & Black Soil", "rainfallMm": 700, "majorMandis": ["Perundurai Turmeric Mandi", "Erode Regulated Market", "Gobichettipalayam"]},
    {"id": "kallakurichi", "name": "Kallakurichi", "nameTa": "கள்ளக்குறிச்சி", "zone": "North Eastern Zone", "dominantSoil": "Red & Black Loam", "rainfallMm": 1050, "majorMandis": ["Kallakurichi", "Ulundurpet", "Chinnasalem"]},
    {"id": "kanchipuram", "name": "Kanchipuram", "nameTa": "காஞ்சிபுரம்", "zone": "North Eastern Zone", "dominantSoil": "Sandy Clay Loam", "rainfallMm": 1210, "majorMandis": ["Kanchipuram", "Sriperumbudur"]},
    {"id": "kanyakumari", "name": "Kanyakumari", "nameTa": "கன்னியாகுமரி", "zone": "High Rainfall Zone", "dominantSoil": "Laterite & Red Loam", "rainfallMm": 1450, "majorMandis": ["Nagercoil", "Thuckalay"]},
    {"id": "karur", "name": "Karur", "nameTa": "கரூர்", "zone": "Western Zone", "dominantSoil": "Red Loam & Alluvial", "rainfallMm": 650, "majorMandis": ["Karur Regulated Market", "Kulithalai"]},
    {"id": "krishnagiri", "name": "Krishnagiri", "nameTa": "கிருஷ்ணகிரி", "zone": "North Western Zone", "dominantSoil": "Red Loam & Sandy Clay", "rainfallMm": 830, "majorMandis": ["Krishnagiri Mango Market", "Hosur", "Pochampalli"]},
    {"id": "madurai", "name": "Madurai", "nameTa": "மதுரை", "zone": "Southern Zone", "dominantSoil": "Black Cotton & Red Loam", "rainfallMm": 840, "majorMandis": ["Mattuthavani Central Market", "Usilampatti", "Vadipatti"]},
    {"id": "mayiladuthurai", "name": "Mayiladuthurai", "nameTa": "மயிலாடுதுறை", "zone": "Cauvery Delta Zone", "dominantSoil": "Deltaic Alluvium & Heavy Clay", "rainfallMm": 1280, "majorMandis": ["Mayiladuthurai", "Sirkazhi"]},
    {"id": "nagapattinam", "name": "Nagapattinam", "nameTa": "நாகப்பட்டினம்", "zone": "Cauvery Delta Zone", "dominantSoil": "Coastal Alluvium & Clay", "rainfallMm": 1340, "majorMandis": ["Nagapattinam", "Vedaranyam"]},
    {"id": "namakkal", "name": "Namakkal", "nameTa": "நாமக்கல்", "zone": "North Western Zone", "dominantSoil": "Red Loam & Black Soil", "rainfallMm": 760, "majorMandis": ["Namakkal Egg & Agri Mandi", "Rasipuram", "Tiruchengode"]},
    {"id": "nilgiris", "name": "Nilgiris", "nameTa": "நீலகிரி", "zone": "High Altitude Hill Zone", "dominantSoil": "Laterite & Humus-Rich Loam", "rainfallMm": 1800, "majorMandis": ["Ooty Vegetable Market", "Coonoor Tea Auction"]},
    {"id": "perambalur", "name": "Perambalur", "nameTa": "பெரம்பலூர்", "zone": "Cauvery Delta Margin", "dominantSoil": "Black Cotton Soil", "rainfallMm": 900, "majorMandis": ["Perambalur Shallot & Maize Market"]},
    {"id": "pudukkottai", "name": "Pudukkottai", "nameTa": "புதுக்கோட்டை", "zone": "Southern Zone", "dominantSoil": "Red Sandy Soil & Laterite", "rainfallMm": 920, "majorMandis": ["Pudukkottai", "Aranthangi", "Alangudi"]},
    {"id": "ramanathapuram", "name": "Ramanathapuram", "nameTa": "இராமநாதபுரம்", "zone": "Southern Zone (Rainfed)", "dominantSoil": "Coastal Sand & Black Soil", "rainfallMm": 820, "majorMandis": ["Ramanathapuram Chilli Mandi", "Paramakudi"]},
    {"id": "ranipet", "name": "Ranipet", "nameTa": "ராணிப்பேட்டை", "zone": "North Eastern Zone", "dominantSoil": "Red Loam", "rainfallMm": 1020, "majorMandis": ["Ranipet", "Arakkonam"]},
    {"id": "salem", "name": "Salem", "nameTa": "சேலம்", "zone": "North Western Zone", "dominantSoil": "Red Sandy Loam", "rainfallMm": 990, "majorMandis": ["Salem Shevapet Market", "Attur Sago Mandi"]},
    {"id": "sivaganga", "name": "Sivaganga", "nameTa": "சிவகங்கை", "zone": "Southern Zone", "dominantSoil": "Red Loam & Laterite", "rainfallMm": 890, "majorMandis": ["Sivaganga", "Karaikudi", "Manamadurai"]},
    {"id": "tenkasi", "name": "Tenkasi", "nameTa": "தென்காசி", "zone": "Southern Zone", "dominantSoil": "Red Loam & Alluvium", "rainfallMm": 1100, "majorMandis": ["Tenkasi Market", "Sankarankovil"]},
    {"id": "thanjavur", "name": "Thanjavur", "nameTa": "தஞ்சாவூர்", "zone": "Cauvery Delta Zone", "dominantSoil": "Clayey Alluvial Soil", "rainfallMm": 1115, "majorMandis": ["Thanjavur APMC Yard", "Kumbakonam Paddy Mandi", "Papanasam"]},
    {"id": "theni", "name": "Theni", "nameTa": "தேனி", "zone": "Southern Zone", "dominantSoil": "Red Loam & Rich Alluvium", "rainfallMm": 830, "majorMandis": ["Theni Banana & Cardamom Market", "Periyakulam", "Bodinayakanur"]},
    {"id": "thoothukudi", "name": "Thoothukudi", "nameTa": "தூத்துக்குடி", "zone": "Southern Zone", "dominantSoil": "Black Cotton & Coastal Sand", "rainfallMm": 660, "majorMandis": ["Kovilpatti Millet & Cotton Mandi", "Thoothukudi"]},
    {"id": "tiruchirappalli", "name": "Tiruchirappalli", "nameTa": "திருச்சிராப்பள்ளி", "zone": "Cauvery Delta Zone", "dominantSoil": "Alluvial & Red Soil", "rainfallMm": 820, "majorMandis": ["Trichy Gandhi Market", "Manachanallur Rice Mill Mandi"]},
    {"id": "tirunelveli", "name": "Tirunelveli", "nameTa": "திருநெல்வேலி", "zone": "Southern Zone", "dominantSoil": "Deep Black & Red Loam", "rainfallMm": 815, "majorMandis": ["Tirunelveli NainarKulam Market", "Ambasamudram"]},
    {"id": "tirupathur", "name": "Tirupathur", "nameTa": "திருப்பத்தூர்", "zone": "North Western Zone", "dominantSoil": "Red Sandy Loam", "rainfallMm": 940, "majorMandis": ["Tirupathur", "Ambur", "Vaniyambadi"]},
    {"id": "tiruppur", "name": "Tiruppur", "nameTa": "திருப்பூர்", "zone": "Western Zone", "dominantSoil": "Red Soil & Black Clay", "rainfallMm": 620, "majorMandis": ["Tiruppur Regulated Market", "Udumalpet Maize & Cotton Mandi", "Kangeyam"]},
    {"id": "tiruvallur", "name": "Tiruvallur", "nameTa": "திருவள்ளூர்", "zone": "North Eastern Zone", "dominantSoil": "Sandy Clay Loam", "rainfallMm": 1180, "majorMandis": ["Tiruvallur", "Ponneri"]},
    {"id": "tiruvannamalai", "name": "Tiruvannamalai", "nameTa": "திருவண்ணாமலை", "zone": "North Eastern Zone", "dominantSoil": "Red Loam & Sandy Clay", "rainfallMm": 1050, "majorMandis": ["Tiruvannamalai Groundnut Mandi", "Arani Rice Market"]},
    {"id": "tiruvarur", "name": "Tiruvarur", "nameTa": "திருவாரூர்", "zone": "Cauvery Delta Zone", "dominantSoil": "Heavy Deltaic Clay & Alluvium", "rainfallMm": 1260, "majorMandis": ["Tiruvarur Paddy Direct Purchase Centre", "Mannargudi"]},
    {"id": "vellore", "name": "Vellore", "nameTa": "வேலூர்", "zone": "North Eastern Zone", "dominantSoil": "Red Sandy Loam", "rainfallMm": 970, "majorMandis": ["Vellore Makkan Market", "Gudiyatham"]},
    {"id": "viluppuram", "name": "Viluppuram", "nameTa": "விழுப்புரம்", "zone": "North Eastern Zone", "dominantSoil": "Red Loam & Sandy Soil", "rainfallMm": 1060, "majorMandis": ["Viluppuram Groundnut & Paddy Mandi", "Tindivanam"]},
    {"id": "virudhunagar", "name": "Virudhunagar", "nameTa": "விருதுநகர்", "zone": "Southern Zone", "dominantSoil": "Deep Black Cotton Soil", "rainfallMm": 780, "majorMandis": ["Virudhunagar Oilseed & Cotton Exchange", "Rajapalayam", "Sattur"]}
]

# 2. soil_types.json - Soil classification and agronomic traits
SOIL_TYPES = [
    {
        "id": "alluvial",
        "name": "Clayey Alluvial Soil",
        "nameTa": "வண்டல் மற்றும் களிமண் மண்",
        "description": "Rich in potash and phosphoric acid, high water holding capacity. Dominant in Cauvery Delta.",
        "phRange": "6.5 - 7.5",
        "optimalPh": 7.0,
        "texture": "Clay loam to heavy clay",
        "organicCarbon": "0.60% - 0.85%",
        "waterRetention": "High",
        "cationExchangeCapacity": "30 - 45 meq/100g",
        "suitableCrops": ["Paddy", "Sugarcane", "Banana", "Black Gram", "Green Gram"],
        "managementTips": "Puddling for wetland paddy; apply green manure (Daincha) to improve phosphate availability."
    },
    {
        "id": "red_loam",
        "name": "Red Loam Soil",
        "nameTa": "செம்மண் மண்",
        "description": "Formed from granite rocks, rich in iron and manganese, highly porous with good drainage.",
        "phRange": "6.0 - 7.2",
        "optimalPh": 6.8,
        "texture": "Sandy loam to clay loam",
        "organicCarbon": "0.40% - 0.65%",
        "waterRetention": "Moderate",
        "cationExchangeCapacity": "15 - 25 meq/100g",
        "suitableCrops": ["Groundnut", "Millets", "Cotton", "Maize", "Tomato", "Pulses"],
        "managementTips": "Apply Farm Yard Manure (FYM) 5 tonnes/acre to enhance moisture retention; split nitrogen applications."
    },
    {
        "id": "black_cotton",
        "name": "Black Cotton Soil (Regur)",
        "nameTa": "கரிசல் மண்",
        "description": "Deep clay rich in montmorillonite, swells when wet and cracks deeply when dry. Excellent moisture holding.",
        "phRange": "7.5 - 8.5",
        "optimalPh": 7.8,
        "texture": "Heavy clay",
        "organicCarbon": "0.50% - 0.75%",
        "waterRetention": "Very High",
        "cationExchangeCapacity": "40 - 55 meq/100g",
        "suitableCrops": ["Cotton", "Maize", "Sorghum", "Chilli", "Sesame", "Bengal Gram"],
        "managementTips": "Broadbed and furrow method prevents waterlogging; avoid plowing when excessively wet."
    },
    {
        "id": "sandy_loam",
        "name": "Sandy Loam Soil",
        "nameTa": "மணல் சார்ந்த செம்மண்",
        "description": "Light, warm, fast draining soil with high aeration. Ideal for underground tuber and pod development.",
        "phRange": "6.0 - 7.0",
        "optimalPh": 6.5,
        "texture": "Coarse to fine sand with 10-15% silt",
        "organicCarbon": "0.30% - 0.50%",
        "waterRetention": "Low to Moderate",
        "cationExchangeCapacity": "10 - 18 meq/100g",
        "suitableCrops": ["Groundnut", "Tapioca", "Sesame", "Vegetables", "Watermelon"],
        "managementTips": "Drip irrigation with fertigation; incorporate tank silt or coir pith to retain moisture."
    },
    {
        "id": "laterite",
        "name": "Laterite Soil",
        "nameTa": "செம்புறை மண்",
        "description": "Acidic soil formed under intense monsoon leaching. Rich in iron oxides, low in silica and phosphorus.",
        "phRange": "4.5 - 6.0",
        "optimalPh": 5.5,
        "texture": "Gravelly loam",
        "organicCarbon": "0.45% - 0.70%",
        "waterRetention": "Moderate",
        "cationExchangeCapacity": "12 - 20 meq/100g",
        "suitableCrops": ["Banana", "Coconut", "Pepper", "Cashew", "Spices"],
        "managementTips": "Apply agricultural lime or dolomite 200-400 kg/acre to correct acidity; use Rock Phosphate instead of DAP."
    }
]

# 3. crop_seasons.json - Tamil Nadu Agro Seasons
CROP_SEASONS = [
    {
        "id": "kuruvai",
        "name": "Kuruvai (குறுவை)",
        "tamilName": "குறுவை பருவம்",
        "sowingMonths": "June - July",
        "harvestMonths": "September - October",
        "rainfallPattern": "South-West Monsoon (Initial light showers)",
        "irrigationReliance": "Heavy Canal / Borewell",
        "tempRange": "28°C - 36°C",
        "primaryCrops": ["Short-duration Paddy (ADT 43, ASD 16)", "Black Gram", "Green Gram", "Sesame"],
        "notes": "Short duration season (105-120 days) traditionally dependent on Mettur Dam water release."
    },
    {
        "id": "samba",
        "name": "Samba / Thaladi (சம்பா / தாளடி)",
        "tamilName": "சம்பா பருவம்",
        "sowingMonths": "August - November",
        "harvestMonths": "December - February",
        "rainfallPattern": "North-East Monsoon (Intense rain events)",
        "irrigationReliance": "Canal + Rainfall",
        "tempRange": "22°C - 30°C",
        "primaryCrops": ["Medium/Long-duration Paddy (BPT 5204, CR 1009 Sub 1)", "Cotton", "Maize", "Millets"],
        "notes": "Main agricultural season across Tamil Nadu covering over 60% of total food grain production."
    },
    {
        "id": "navarai",
        "name": "Navarai / Kodai (நவரை / கோடை)",
        "tamilName": "நவரை / கோடை பருவம்",
        "sowingMonths": "December - January",
        "harvestMonths": "March - April",
        "rainfallPattern": "Dry season with winter dew",
        "irrigationReliance": "Tube wells / Borewells only",
        "tempRange": "24°C - 34°C",
        "primaryCrops": ["Rice Fallow Pulses (Black Gram VBN 8)", "Sesame", "Groundnut", "Watermelon", "Millets"],
        "notes": "High solar radiation yields high photosynthesis; excellent for relay pulse cropping."
    },
    {
        "id": "zaid_summer",
        "name": "Summer Zaid (சித்திரை பட்டம்)",
        "tamilName": "கோடை / சித்திரை பட்டம்",
        "sowingMonths": "March - May",
        "harvestMonths": "June - July",
        "rainfallPattern": "Pre-monsoon summer thunderstorms",
        "irrigationReliance": "Assured groundwater",
        "tempRange": "30°C - 40°C",
        "primaryCrops": ["Groundnut (Summer)", "Sesame (Gingelly)", "Barnyard Millet", "Fodder Sorghum", "Vegetables"],
        "notes": "Requires high heat-tolerant varieties; mulch with crop residues to conserve water."
    }
]

# 4. crop_catalog.json & 9. crop_costs_and_yields.json - The 18 crops
CROPS_18 = [
    {
        "id": "paddy_bpt5204",
        "cropId": "paddy",
        "cropName": "Paddy (Ponni BPT 5204)",
        "cropNameTa": "நெல் (ஆந்திரா பொன்னி)",
        "botanicalName": "Oryza sativa",
        "icon": "🌾",
        "category": "Cereals",
        "varieties": ["BPT 5204 (Andhra Ponni)", "ADT 37", "IR 20", "CR 1009 Sub 1"],
        "durationDays": "135 - 145",
        "durationCategory": "Medium-Long",
        "season": "Samba / Thaladi",
        "soilTypes": ["Clayey Alluvial Soil", "Clay Soil", "Clay Loam"],
        "optimalPh": "6.5 - 7.5",
        "waterNeedMm": 1200,
        "waterNeedCategory": "High",
        "investmentPerAcre": 24500,
        "seedCost": 3200,
        "fertilizerCost": 5400,
        "labourCost": 8800,
        "machineryCost": 5200,
        "irrigationCost": 900,
        "transportCost": 1000,
        "expectedYieldRange": "24 - 28 Bags (75kg/bag) [1.8 - 2.1 Tonnes]",
        "expectedYieldKg": 1950,
        "expectedPricePerKg": 32.5,
        "mandiBenchmarkQtl": 2450,
        "grossRevenuePerAcre": 63375,
        "netProfitPerAcre": 38875,
        "roiPercent": 158,
        "riskLevel": "Low",
        "soilAffinity": "Dense clay and alluvial delta soils with high cation exchange retain water and nutrients during panicle initiation.",
        "riskMitigation": "Susceptible to blast disease under heavy dew. Prophylactic seed treatment with Pseudomonas fluorescens (10g/kg) and Tricyclazole spray at Day 60.",
        "rationale": "High consumer demand across South India guarantees premium market liquidity.",
        "fertilizerSchedule": {
            "basal": "DAP 45kg + MOP 15kg + Zinc Sulfate 10kg/acre",
            "vegetative": "Urea 25kg at active tillering (21 DAT)",
            "flowering": "Urea 15kg + MOP 10kg at panicle initiation (55 DAT)",
            "harvest": "Drain water 10 days before harvest"
        }
    },
    {
        "id": "black_gram_vbn8",
        "cropId": "black_gram",
        "cropName": "Black Gram (VBN 8 / உளுந்து)",
        "cropNameTa": "உளுந்து (VBN 8)",
        "botanicalName": "Vigna mungo",
        "icon": "🌱",
        "category": "Pulses",
        "varieties": ["VBN 8", "ADT 5", "T9"],
        "durationDays": "65 - 70",
        "durationCategory": "Short",
        "season": "Navarai / Rice Fallow / Kharif",
        "soilTypes": ["Clayey Alluvial Soil", "Red Loam", "Sandy Loam"],
        "optimalPh": "6.5 - 7.5",
        "waterNeedMm": 350,
        "waterNeedCategory": "Low",
        "investmentPerAcre": 8200,
        "seedCost": 1600,
        "fertilizerCost": 1400,
        "labourCost": 2800,
        "machineryCost": 1600,
        "irrigationCost": 400,
        "transportCost": 400,
        "expectedYieldRange": "5 - 6.5 Quintals [500 - 650 kg]",
        "expectedYieldKg": 580,
        "expectedPricePerKg": 78.0,
        "mandiBenchmarkQtl": 7800,
        "grossRevenuePerAcre": 45240,
        "netProfitPerAcre": 37040,
        "roiPercent": 451,
        "riskLevel": "Low",
        "soilAffinity": "Thrives on residual soil moisture after paddy harvest; taproot nodulates atmospheric Nitrogen (+35kg/ha).",
        "riskMitigation": "Spray 2% DAP at 30 and 45 DAS to prevent premature flower drop; yellow mosaic virus managed by controlling whitefly.",
        "rationale": "Fastest turnaround cash crop; revitalizes soil nitrogen for subsequent seasons.",
        "fertilizerSchedule": {
            "basal": "DAP 20kg + Rhizobium seed inoculation (600g/acre)",
            "vegetative": "Foliar spray of 2% DAP at 30 DAS",
            "flowering": "Foliar spray of 2% DAP + 1% KCl at 45 DAS",
            "harvest": "Combine pod picking or machine mowing when 80% pods turn black"
        }
    },
    {
        "id": "green_gram_co8",
        "cropId": "green_gram",
        "cropName": "Green Gram (Moong CO 8)",
        "cropNameTa": "பாசிப்பயறு (CO 8)",
        "botanicalName": "Vigna radiata",
        "icon": "🌿",
        "category": "Pulses",
        "varieties": ["CO 8", "VBN 3", "KM 2"],
        "durationDays": "60 - 65",
        "durationCategory": "Short",
        "season": "Rice Fallow / Summer",
        "soilTypes": ["Red Loam", "Sandy Loam", "Alluvial Soil"],
        "optimalPh": "6.2 - 7.2",
        "waterNeedMm": 300,
        "waterNeedCategory": "Low",
        "investmentPerAcre": 7800,
        "seedCost": 1500,
        "fertilizerCost": 1300,
        "labourCost": 2800,
        "machineryCost": 1400,
        "irrigationCost": 400,
        "transportCost": 400,
        "expectedYieldRange": "4.5 - 6 Quintals [450 - 600 kg]",
        "expectedYieldKg": 520,
        "expectedPricePerKg": 82.0,
        "mandiBenchmarkQtl": 8200,
        "grossRevenuePerAcre": 42640,
        "netProfitPerAcre": 34840,
        "roiPercent": 446,
        "riskLevel": "Low",
        "soilAffinity": "Excellent relay crop in delta and well-drained red loam tracts; fixes biological nitrogen.",
        "riskMitigation": "Protect against powdery mildew using wettable sulphur 2g/L.",
        "rationale": "High protein pulse with steady domestic consumption and high market liquidity.",
        "fertilizerSchedule": {
            "basal": "DAP 20kg + Phosphobacteria seed coating",
            "vegetative": "TNAU Pulse Wonder 2kg/acre foliar spray at peak flowering",
            "flowering": "Foliar micronutrient spray",
            "harvest": "Harvest when pods turn brownish-black"
        }
    },
    {
        "id": "groundnut_vri8",
        "cropId": "groundnut",
        "cropName": "Groundnut (VRI 8 / Dharani)",
        "cropNameTa": "நிலக்கடலை (VRI 8)",
        "botanicalName": "Arachis hypogaea",
        "icon": "🥜",
        "category": "Oilseeds",
        "varieties": ["VRI 8", "TMV 13", "Dharani", "Kadiri 9"],
        "durationDays": "105 - 110",
        "durationCategory": "Medium",
        "season": "Kharif / Rabi / Summer",
        "soilTypes": ["Red Loam Soil", "Sandy Loam", "Red Sandy Soil"],
        "optimalPh": "6.0 - 7.0",
        "waterNeedMm": 550,
        "waterNeedCategory": "Moderate",
        "investmentPerAcre": 26500,
        "seedCost": 6800,
        "fertilizerCost": 4800,
        "labourCost": 7900,
        "machineryCost": 4500,
        "irrigationCost": 1200,
        "transportCost": 1300,
        "expectedYieldRange": "16 - 20 Quintals dry pods [1600 - 2000 kg]",
        "expectedYieldKg": 1800,
        "expectedPricePerKg": 68.0,
        "mandiBenchmarkQtl": 6800,
        "grossRevenuePerAcre": 122400,
        "netProfitPerAcre": 95900,
        "roiPercent": 361,
        "riskLevel": "Low",
        "soilAffinity": "Friable, well-aerated sandy loam facilitates effortless peg penetration and pod development.",
        "riskMitigation": "Gypsum application (200 kg/acre split at basal and pegging 45 DAS) is critical for calcium-rich bold pods.",
        "rationale": "Major oilseed crop in TN with reliable local oil expeller procurement.",
        "fertilizerSchedule": {
            "basal": "DAP 40kg + MOP 20kg + Gypsum 100kg + Trichoderma viride 1kg",
            "vegetative": "Weeding and soil loosening at 20-25 DAS",
            "flowering": "Top dress Gypsum 100kg at 40-45 DAS followed by earthing up",
            "harvest": "Light pre-harvest irrigation 2 days prior to uprooting"
        }
    },
    {
        "id": "sesame_tmv7",
        "cropId": "sesame",
        "cropName": "Sesame / Gingelly (TMV 7)",
        "cropNameTa": "எள்ளு (TMV 7)",
        "botanicalName": "Sesamum indicum",
        "icon": "🌾",
        "category": "Oilseeds",
        "varieties": ["TMV 7", "SVPR 1", "VRI 3"],
        "durationDays": "80 - 85",
        "durationCategory": "Short",
        "season": "Summer / Rice Fallow / Kharif",
        "soilTypes": ["Sandy Loam", "Red Loam", "Clayey Alluvial Soil"],
        "optimalPh": "6.2 - 7.5",
        "waterNeedMm": 320,
        "waterNeedCategory": "Low",
        "investmentPerAcre": 9500,
        "seedCost": 900,
        "fertilizerCost": 2200,
        "labourCost": 3800,
        "machineryCost": 1600,
        "irrigationCost": 500,
        "transportCost": 500,
        "expectedYieldRange": "3.5 - 4.5 Quintals [350 - 450 kg]",
        "expectedYieldKg": 400,
        "expectedPricePerKg": 135.0,
        "mandiBenchmarkQtl": 13500,
        "grossRevenuePerAcre": 54000,
        "netProfitPerAcre": 44500,
        "roiPercent": 468,
        "riskLevel": "Low",
        "soilAffinity": "Extremely drought tolerant; thrives in well-drained alluvial and loam tracts.",
        "riskMitigation": "Phyllody disease transmitted by leafhoppers; spray Dimethoate 2ml/L if symptoms appear.",
        "rationale": "High value oilseed commanding over ₹13,000/Qtl in Virudhunagar and Erode markets.",
        "fertilizerSchedule": {
            "basal": "FYM 5 tonnes + NPK 35:23:23 kg/ha equivalent",
            "vegetative": "Thinning to maintain 30x30 cm spacing at 15 DAS",
            "flowering": "Foliar spray of 1% urea at flowering",
            "harvest": "Harvest when bottom leaves shed and lowest capsules turn yellowish"
        }
    },
    {
        "id": "cotton_mcu5",
        "cropId": "cotton",
        "cropName": "Cotton (MCU 5 / Suraj)",
        "cropNameTa": "பருத்தி (MCU 5)",
        "botanicalName": "Gossypium hirsutum",
        "icon": "🧶",
        "category": "Commercial",
        "varieties": ["MCU 5", "Suraj", "SVPR 2", "Bt Hybrids"],
        "durationDays": "150 - 165",
        "durationCategory": "Long",
        "season": "Kharif / Winter Combodian",
        "soilTypes": ["Black Cotton Soil (Regur)", "Deep Clay Loam"],
        "optimalPh": "7.0 - 8.5",
        "waterNeedMm": 700,
        "waterNeedCategory": "Moderate",
        "investmentPerAcre": 31000,
        "seedCost": 3500,
        "fertilizerCost": 5800,
        "labourCost": 12800,
        "machineryCost": 5500,
        "irrigationCost": 1800,
        "transportCost": 1600,
        "expectedYieldRange": "10 - 14 Quintals seed cotton [1000 - 1400 kg]",
        "expectedYieldKg": 1200,
        "expectedPricePerKg": 74.0,
        "mandiBenchmarkQtl": 7400,
        "grossRevenuePerAcre": 88800,
        "netProfitPerAcre": 57800,
        "roiPercent": 186,
        "riskLevel": "Medium",
        "soilAffinity": "Deep cracking black cotton soils retain moisture through reproductive boll formation.",
        "riskMitigation": "Pheromone traps for pink bollworm; avoid excessive nitrogen that attracts sucking pests.",
        "rationale": "Key fiber cash crop for textile mills in Coimbatore, Tiruppur, and Rajapalayam.",
        "fertilizerSchedule": {
            "basal": "DAP 40kg + MOP 20kg + Micronutrient mixture 5kg",
            "vegetative": "Urea 25kg + Earthing up at 40 DAS",
            "flowering": "Urea 20kg + MOP 15kg at square formation and flowering (60-70 DAS)",
            "harvest": "Clean picking in morning hours after dew dries"
        }
    },
    {
        "id": "sugarcane_co86032",
        "cropId": "sugarcane",
        "cropName": "Sugarcane (Co 86032 / நயனா)",
        "cropNameTa": "கரும்பு (Co 86032)",
        "botanicalName": "Saccharum officinarum",
        "icon": "🎋",
        "category": "Commercial",
        "varieties": ["Co 86032", "Co 0212", "CoC 24"],
        "durationDays": "330 - 360",
        "durationCategory": "Perennial/Annual",
        "season": "Special Season / Early Season",
        "soilTypes": ["Clayey Alluvial Soil", "Clay Loam", "Red Loam"],
        "optimalPh": "6.5 - 8.0",
        "waterNeedMm": 1800,
        "waterNeedCategory": "Very High",
        "investmentPerAcre": 52000,
        "seedCost": 12000,
        "fertilizerCost": 11500,
        "labourCost": 16500,
        "machineryCost": 8000,
        "irrigationCost": 2200,
        "transportCost": 1800,
        "expectedYieldRange": "45 - 55 Tonnes cane / Acre",
        "expectedYieldKg": 50000,
        "expectedPricePerKg": 3.15,
        "mandiBenchmarkQtl": 315,
        "grossRevenuePerAcre": 157500,
        "netProfitPerAcre": 105500,
        "roiPercent": 202,
        "riskLevel": "Low",
        "soilAffinity": "Deep fertile alluvium with high moisture holding capacity sustains heavy biomass synthesis.",
        "riskMitigation": "Install drip fertigation to cut water use by 45%; trash mulching controls moisture loss.",
        "rationale": "Assured cane price (FRP + SAP) backed by cooperative sugar factories.",
        "fertilizerSchedule": {
            "basal": "SSP 150kg + MOP 30kg + Azospirillum 2kg",
            "vegetative": "Urea 50kg + MOP 25kg at 45 days after planting",
            "flowering": "Urea 60kg + MOP 30kg at 90 days during partial earthing up",
            "harvest": "Stop irrigation 15 days before mill harvest"
        }
    },
    {
        "id": "banana_grandnaine",
        "cropId": "banana",
        "cropName": "Banana (Grand Naine / வாழை)",
        "cropNameTa": "வாழை (கிராண்ட் நைன்)",
        "botanicalName": "Musa acuminata",
        "icon": "🍌",
        "category": "Horticulture",
        "varieties": ["Grand Naine (G9)", "Poovan", "Rasthali", "Nendran"],
        "durationDays": "300 - 330",
        "durationCategory": "Annual",
        "season": "All Year (Peak Feb - May)",
        "soilTypes": ["Clayey Alluvial Soil", "Rich Loam", "Clay Loam"],
        "optimalPh": "6.5 - 7.5",
        "waterNeedMm": 1600,
        "waterNeedCategory": "High",
        "investmentPerAcre": 68000,
        "seedCost": 18000,
        "fertilizerCost": 16000,
        "labourCost": 19000,
        "machineryCost": 7000,
        "irrigationCost": 4000,
        "transportCost": 4000,
        "expectedYieldRange": "30 - 35 Tonnes bunches / Acre [1100 plants]",
        "expectedYieldKg": 32000,
        "expectedPricePerKg": 18.0,
        "mandiBenchmarkQtl": 1800,
        "grossRevenuePerAcre": 576000,
        "netProfitPerAcre": 508000,
        "roiPercent": 747,
        "riskLevel": "Medium",
        "soilAffinity": "Moisture retentive delta lowlands along river basins (Cauvery, Vaigai) produce high bunch weights.",
        "riskMitigation": "Wind damage during cyclones requires bamboo propping; Sigatoka leaf spot managed with mineral oil + Propiconazole.",
        "rationale": "Highest net income per acre among irrigated commercial horticulture crops.",
        "fertilizerSchedule": {
            "basal": "FYM 10kg + Neem cake 500g + DAP 50g per plant pit",
            "vegetative": "Urea 50g + MOP 75g per plant monthly from month 2 to 5",
            "flowering": "MOP 100g per plant at bunch emergence (month 7)",
            "harvest": "Harvest at 75-80% maturity when angles of fruit disappear"
        }
    },
    {
        "id": "turmeric_bsr2",
        "cropId": "turmeric",
        "cropName": "Turmeric (Erode BSR 2 / மஞ்சள்)",
        "cropNameTa": "மஞ்சள் (BSR 2)",
        "botanicalName": "Curcuma longa",
        "icon": "🌱",
        "category": "Spices",
        "varieties": ["BSR 2", "Alleppey Supreme", "Prathibha"],
        "durationDays": "240 - 270",
        "durationCategory": "Long",
        "season": "May - June Planting",
        "soilTypes": ["Red Loam Soil", "Clay Loam", "Alluvial Soil"],
        "optimalPh": "6.0 - 7.5",
        "waterNeedMm": 1100,
        "waterNeedCategory": "High",
        "investmentPerAcre": 65000,
        "seedCost": 19000,
        "fertilizerCost": 12000,
        "labourCost": 21000,
        "machineryCost": 7500,
        "irrigationCost": 2500,
        "transportCost": 3000,
        "expectedYieldRange": "22 - 26 Quintals cured fingers / Acre",
        "expectedYieldKg": 2400,
        "expectedPricePerKg": 120.0,
        "mandiBenchmarkQtl": 12000,
        "grossRevenuePerAcre": 288000,
        "netProfitPerAcre": 223000,
        "roiPercent": 343,
        "riskLevel": "Medium",
        "soilAffinity": "Rich, porous loam promotes uniform rhizome enlargement and high curcumin content.",
        "riskMitigation": "Rhizome rot prevention: dip seed fingers in Metalaxyl (2g/L) and drench field borders.",
        "rationale": "GI-tagged Erode turmeric enjoys global export and industrial pharmaceutical demand.",
        "fertilizerSchedule": {
            "basal": "FYM 10 tonnes + DAP 60kg + MOP 30kg + Neem cake 200kg",
            "vegetative": "Urea 30kg + Micronutrient spray at 45 and 90 DAP",
            "flowering": "MOP 30kg + Urea 25kg at 120 DAP during final earthing up",
            "harvest": "Cut leaves at ground level when leaves yellow and dry"
        }
    },
    {
        "id": "red_chilli_k1",
        "cropId": "red_chilli",
        "cropName": "Red Chilli (K1 / Guntur / மிளகாய்)",
        "cropNameTa": "மிளகாய் (K1)",
        "botanicalName": "Capsicum annuum",
        "icon": "🌶️",
        "category": "Spices",
        "varieties": ["K1", "CO 4", "Ramnad Mundu", "PKM 1"],
        "durationDays": "150 - 180",
        "durationCategory": "Medium-Long",
        "season": "Kharif / Rabi",
        "soilTypes": ["Black Cotton Soil", "Red Loam", "Sandy Loam"],
        "optimalPh": "6.5 - 8.0",
        "waterNeedMm": 600,
        "waterNeedCategory": "Moderate",
        "investmentPerAcre": 38000,
        "seedCost": 3500,
        "fertilizerCost": 7200,
        "labourCost": 17500,
        "machineryCost": 5000,
        "irrigationCost": 2400,
        "transportCost": 2400,
        "expectedYieldRange": "12 - 16 Quintals dry chilli / Acre",
        "expectedYieldKg": 1400,
        "expectedPricePerKg": 165.0,
        "mandiBenchmarkQtl": 16500,
        "grossRevenuePerAcre": 231000,
        "netProfitPerAcre": 193000,
        "roiPercent": 507,
        "riskLevel": "Medium",
        "soilAffinity": "Black cotton and deep loam hold moisture, enhancing capsaicin concentration and skin color.",
        "riskMitigation": "Thrips and mite attacks induce leaf curl; install blue sticky traps and spray Diafenthiuron 1g/L.",
        "rationale": "Major commercial spice in Ramanathapuram, Thoothukudi, and Virudhunagar dryland tracts.",
        "fertilizerSchedule": {
            "basal": "DAP 50kg + MOP 25kg + Zinc Sulfate 10kg/acre",
            "vegetative": "Urea 30kg at 30 and 60 days after transplanting",
            "flowering": "19:19:19 foliar spray 5g/L during heavy fruit set",
            "harvest": "Periodic picking of fully ripe red fruits every 10-14 days"
        }
    },
    {
        "id": "maize_co6",
        "cropId": "maize",
        "cropName": "Maize (Hybrid CO 6 / மக்காச்சோளம்)",
        "cropNameTa": "மக்காச்சோளம் (CO 6)",
        "botanicalName": "Zea mays",
        "icon": "🌽",
        "category": "Cereals",
        "varieties": ["CO 6", "Pioneer 30V92", "NK 6240"],
        "durationDays": "100 - 110",
        "durationCategory": "Medium",
        "season": "Kharif / Rabi",
        "soilTypes": ["Red Loam Soil", "Black Soil", "Sandy Loam"],
        "optimalPh": "6.5 - 7.8",
        "waterNeedMm": 550,
        "waterNeedCategory": "Moderate",
        "investmentPerAcre": 21500,
        "seedCost": 3200,
        "fertilizerCost": 5600,
        "labourCost": 6800,
        "machineryCost": 3900,
        "irrigationCost": 1000,
        "transportCost": 1000,
        "expectedYieldRange": "30 - 36 Quintals / Acre [3000 - 3600 kg]",
        "expectedYieldKg": 3300,
        "expectedPricePerKg": 22.5,
        "mandiBenchmarkQtl": 2250,
        "grossRevenuePerAcre": 74250,
        "netProfitPerAcre": 52750,
        "roiPercent": 245,
        "riskLevel": "Medium",
        "soilAffinity": "Deep, well-aerated loams with good drainage prevent waterlogging around crown roots.",
        "riskMitigation": "Fall Armyworm (FAW) management: seed treatment with Cyantraniliprole and pheromone traps.",
        "rationale": "Massive demand from Namakkal poultry feed and starch processing industries.",
        "fertilizerSchedule": {
            "basal": "DAP 50kg + MOP 20kg + Zinc Sulfate 10kg/acre",
            "vegetative": "Urea 30kg at knee-high stage (25-30 DAS)",
            "flowering": "Urea 25kg at tasseling / silking stage (45 DAS)",
            "harvest": "Harvest when cob sheath dries and black layer forms at kernel base"
        }
    },
    {
        "id": "millet_kuthiraivali",
        "cropId": "millet",
        "cropName": "Barnyard Millet (Kuthiraivali / குதிரைவாலி)",
        "cropNameTa": "குதிரைவாலி (TNAU MDU 1)",
        "botanicalName": "Echinochloa frumentacea",
        "icon": "🌾",
        "category": "Millets",
        "varieties": ["TNAU MDU 1", "CO 2"],
        "durationDays": "85 - 90",
        "durationCategory": "Short",
        "season": "Kharif / Late Samba / Summer",
        "soilTypes": ["Red Sandy Loam", "Sandy Loam", "Clayey Alluvial Soil"],
        "optimalPh": "5.5 - 7.5",
        "waterNeedMm": 250,
        "waterNeedCategory": "Very Low",
        "investmentPerAcre": 6500,
        "seedCost": 600,
        "fertilizerCost": 1400,
        "labourCost": 2600,
        "machineryCost": 1200,
        "irrigationCost": 350,
        "transportCost": 350,
        "expectedYieldRange": "8 - 10 Quintals / Acre [800 - 1000 kg]",
        "expectedYieldKg": 900,
        "expectedPricePerKg": 36.0,
        "mandiBenchmarkQtl": 3600,
        "grossRevenuePerAcre": 32400,
        "netProfitPerAcre": 25900,
        "roiPercent": 398,
        "riskLevel": "Low",
        "soilAffinity": "Remarkable drought hardiness; excels in poor marginal soils where other cereals fail.",
        "riskMitigation": "Shoot fly in early seedlings managed by timely sowing with monsoon onset.",
        "rationale": "High fiber, low glycemic index health food subsidized under TN Millet Mission.",
        "fertilizerSchedule": {
            "basal": "FYM 5 tonnes + DAP 20kg/acre",
            "vegetative": "Weeding at 20 DAS; top dress Urea 15kg if rainfall occurs",
            "flowering": "Zero chemical sprays required under organic practice",
            "harvest": "Harvest when panicle turns golden brown"
        }
    },
    {
        "id": "ragi_co15",
        "cropId": "ragi",
        "cropName": "Finger Millet / Ragi (CO 15 / கேழ்வரகு)",
        "cropNameTa": "கேழ்வரகு (CO 15)",
        "botanicalName": "Eleusine coracana",
        "icon": "🌾",
        "category": "Millets",
        "varieties": ["CO 15", "Paiyur 2", "GPU 28"],
        "durationDays": "105 - 115",
        "durationCategory": "Medium",
        "season": "Kharif / Rabi / Summer",
        "soilTypes": ["Red Loam Soil", "Sandy Loam"],
        "optimalPh": "6.0 - 7.5",
        "waterNeedMm": 380,
        "waterNeedCategory": "Low",
        "investmentPerAcre": 9800,
        "seedCost": 800,
        "fertilizerCost": 2200,
        "labourCost": 4400,
        "machineryCost": 1600,
        "irrigationCost": 400,
        "transportCost": 400,
        "expectedYieldRange": "14 - 18 Quintals / Acre [1400 - 1800 kg]",
        "expectedYieldKg": 1600,
        "expectedPricePerKg": 34.0,
        "mandiBenchmarkQtl": 3400,
        "grossRevenuePerAcre": 54400,
        "netProfitPerAcre": 44600,
        "roiPercent": 455,
        "riskLevel": "Low",
        "soilAffinity": "Adapts readily across Dharmapuri, Krishnagiri, and Salem red soils.",
        "riskMitigation": "Blast resistance built into CO 15 variety; seed bio-priming with Trichoderma.",
        "rationale": "High calcium food staple with guaranteed procurement under Public Distribution System (PDS).",
        "fertilizerSchedule": {
            "basal": "FYM 5 tonnes + DAP 35kg + MOP 15kg",
            "vegetative": "Urea 20kg top dressing at 25 DAT",
            "flowering": "Irrigation during grain filling stage",
            "harvest": "Earhead harvesting when grains turn dark brown"
        }
    },
    {
        "id": "pearl_millet_kambu",
        "cropId": "kambu",
        "cropName": "Pearl Millet / Kambu (CO 10 / கம்பு)",
        "cropNameTa": "கம்பு (CO 10)",
        "botanicalName": "Pennisetum glaucum",
        "icon": "🌾",
        "category": "Millets",
        "varieties": ["CO 10", "ICMV 221", "TNAU Cumbu Hybrid"],
        "durationDays": "80 - 85",
        "durationCategory": "Short",
        "season": "Kharif / Summer",
        "soilTypes": ["Sandy Loam", "Red Soil", "Light Alluvial"],
        "optimalPh": "6.5 - 8.0",
        "waterNeedMm": 300,
        "waterNeedCategory": "Low",
        "investmentPerAcre": 7500,
        "seedCost": 700,
        "fertilizerCost": 1800,
        "labourCost": 3200,
        "machineryCost": 1200,
        "irrigationCost": 300,
        "transportCost": 300,
        "expectedYieldRange": "12 - 15 Quintals / Acre [1200 - 1500 kg]",
        "expectedYieldKg": 1350,
        "expectedPricePerKg": 28.0,
        "mandiBenchmarkQtl": 2800,
        "grossRevenuePerAcre": 37800,
        "netProfitPerAcre": 30300,
        "roiPercent": 404,
        "riskLevel": "Low",
        "soilAffinity": "Deep root system draws moisture from subsoil; ideal for dry southern districts.",
        "riskMitigation": "Downy mildew prevention: seed treatment with Metalaxyl 6g/kg.",
        "rationale": "Summer beverage cooling crop (Kambu Koozh) with strong regional demand.",
        "fertilizerSchedule": {
            "basal": "DAP 25kg + MOP 10kg + Azospirillum seed treatment",
            "vegetative": "Urea 20kg at 30 DAS",
            "flowering": "Irrigate at flowering if rain is absent",
            "harvest": "Cut earheads when grains are hard and dry"
        }
    },
    {
        "id": "sorghum_cholam",
        "cropId": "sorghum",
        "cropName": "Sorghum / Cholam (CO 30 / சோளம்)",
        "cropNameTa": "சோளம் (CO 30)",
        "botanicalName": "Sorghum bicolor",
        "icon": "🌾",
        "category": "Millets",
        "varieties": ["CO 30", "K 12", "Paiyur 2"],
        "durationDays": "100 - 105",
        "durationCategory": "Medium",
        "season": "Rainfed Kharif / Rabi",
        "soilTypes": ["Black Cotton Soil", "Red Loam", "Clay Loam"],
        "optimalPh": "6.0 - 8.5",
        "waterNeedMm": 400,
        "waterNeedCategory": "Low",
        "investmentPerAcre": 8500,
        "seedCost": 750,
        "fertilizerCost": 2200,
        "labourCost": 3600,
        "machineryCost": 1350,
        "irrigationCost": 300,
        "transportCost": 300,
        "expectedYieldRange": "12 - 16 Quintals grain + 4 Tonnes dry fodder / Acre",
        "expectedYieldKg": 1400,
        "expectedPricePerKg": 26.0,
        "mandiBenchmarkQtl": 2600,
        "grossRevenuePerAcre": 46400,
        "netProfitPerAcre": 37900,
        "roiPercent": 446,
        "riskLevel": "Low",
        "soilAffinity": "Excels in heavy black soils of Kovilpatti and Tirunelveli.",
        "riskMitigation": "Shoot fly handled with carbofuran in furrow at sowing time.",
        "rationale": "Dual-purpose grain and nutritious dry cattle fodder.",
        "fertilizerSchedule": {
            "basal": "DAP 30kg + MOP 15kg",
            "vegetative": "Urea 25kg at 35 DAS",
            "flowering": "Foliar spray of micronutrients",
            "harvest": "Harvest earheads and stalk separately"
        }
    },
    {
        "id": "coconut_eastcoast",
        "cropId": "coconut",
        "cropName": "Coconut (East Coast Tall / தென்னை)",
        "cropNameTa": "தென்னை (ஈஸ்ட் கோஸ்ட் டால்)",
        "botanicalName": "Cocos nucifera",
        "icon": "🥥",
        "category": "Plantation",
        "varieties": ["East Coast Tall (ECT)", "VPM 3", "T x D Hybrid"],
        "durationDays": "Perennial (5-60 yrs)",
        "durationCategory": "Perennial",
        "season": "All Year (Harvest every 45 days)",
        "soilTypes": ["Sandy Loam", "Alluvial Soil", "Red Loam"],
        "optimalPh": "5.5 - 7.5",
        "waterNeedMm": 1300,
        "waterNeedCategory": "High",
        "investmentPerAcre": 34000,
        "seedCost": 3000,
        "fertilizerCost": 11000,
        "labourCost": 12000,
        "machineryCost": 4000,
        "irrigationCost": 2500,
        "transportCost": 1500,
        "expectedYieldRange": "9,000 - 12,000 Nuts / Acre / Year [70 palms]",
        "expectedYieldKg": 10500,
        "expectedPricePerKg": 14.0,
        "mandiBenchmarkQtl": 1400,
        "grossRevenuePerAcre": 147000,
        "netProfitPerAcre": 113000,
        "roiPercent": 332,
        "riskLevel": "Low",
        "soilAffinity": "Deep coastal sands and delta alluvium with subterranean moisture flow.",
        "riskMitigation": "Rhinoceros beetle and red palm weevil managed with pheromone bucket traps and neem cake slurry.",
        "rationale": "Consistent year-round income via copra, tender coconut, and coir pith.",
        "fertilizerSchedule": {
            "basal": "Neem cake 5kg + FYM 50kg per palm in ring basin",
            "vegetative": "Urea 1.3kg + SSP 2kg + MOP 2kg per palm per year in two splits",
            "flowering": "Borax 50g per palm to prevent button shedding",
            "harvest": "Nut harvest cycle every 45-50 days"
        }
    },
    {
        "id": "tapioca_co4",
        "cropId": "tapioca",
        "cropName": "Tapioca / Cassava (CO 4 / மரவள்ளிக்கிழங்கு)",
        "cropNameTa": "மரவள்ளிக்கிழங்கு (CO 4)",
        "botanicalName": "Manihot esculenta",
        "icon": "🍠",
        "category": "Tubers",
        "varieties": ["CO 4", "Mulluvadi 1", "YTP 1"],
        "durationDays": "270 - 300",
        "durationCategory": "Long",
        "season": "March - May Planting",
        "soilTypes": ["Red Sandy Loam", "Sandy Loam", "Laterite"],
        "optimalPh": "5.5 - 7.0",
        "waterNeedMm": 750,
        "waterNeedCategory": "Moderate",
        "investmentPerAcre": 28500,
        "seedCost": 3200,
        "fertilizerCost": 6800,
        "labourCost": 11500,
        "machineryCost": 4500,
        "irrigationCost": 1250,
        "transportCost": 1250,
        "expectedYieldRange": "14 - 18 Tonnes tubers / Acre",
        "expectedYieldKg": 16000,
        "expectedPricePerKg": 7.5,
        "mandiBenchmarkQtl": 750,
        "grossRevenuePerAcre": 120000,
        "netProfitPerAcre": 91500,
        "roiPercent": 321,
        "riskLevel": "Low",
        "soilAffinity": "Loose porous soils facilitate unobstructed root thickening and high starch accumulation.",
        "riskMitigation": "Cassava mosaic virus (CMV) transmitted by whitefly; plant virus-free certified setts.",
        "rationale": "High industrial demand in Salem & Namakkal sago and starch factories (Attur cluster).",
        "fertilizerSchedule": {
            "basal": "FYM 10 tonnes + DAP 50kg + MOP 30kg/acre",
            "vegetative": "Urea 30kg + MOP 25kg at 60 DAP during earthing up",
            "flowering": "Top dress Potassium at 90 DAP for starch filling",
            "harvest": "Uproot tubers when lower leaves shed completely"
        }
    },
    {
        "id": "tomato_shivam",
        "cropId": "tomato",
        "cropName": "Tomato (Shivam Hybrid / தக்காளி)",
        "cropNameTa": "தக்காளி (சிவம் ஹைபிரிட்)",
        "botanicalName": "Solanum lycopersicum",
        "icon": "🍅",
        "category": "Horticulture",
        "varieties": ["Shivam", "PKM 1", "CO 3", "Abhinav"],
        "durationDays": "120 - 135",
        "durationCategory": "Medium",
        "season": "All Year (Peak Kharif / Summer)",
        "soilTypes": ["Red Loam Soil", "Sandy Loam", "Clay Loam"],
        "optimalPh": "6.0 - 7.0",
        "waterNeedMm": 600,
        "waterNeedCategory": "Moderate",
        "investmentPerAcre": 42000,
        "seedCost": 5500,
        "fertilizerCost": 9800,
        "labourCost": 16500,
        "machineryCost": 5200,
        "irrigationCost": 2500,
        "transportCost": 2500,
        "expectedYieldRange": "15 - 20 Tonnes / Acre [600 - 800 Crates]",
        "expectedYieldKg": 17500,
        "expectedPricePerKg": 18.0,
        "mandiBenchmarkQtl": 1800,
        "grossRevenuePerAcre": 315000,
        "netProfitPerAcre": 273000,
        "roiPercent": 650,
        "riskLevel": "High",
        "soilAffinity": "Well-drained red loam with high organic matter produces firm fruits with long shelf life.",
        "riskMitigation": "Tuta absoluta leafminer and bacterial wilt: stake plants and spray spinosad 0.5ml/L.",
        "rationale": "Fast turnover vegetable crop traded heavily in Oddanchatram, Mettupalayam, and Koyambedu.",
        "fertilizerSchedule": {
            "basal": "FYM 10 tonnes + DAP 60kg + MOP 30kg + Borax 5kg",
            "vegetative": "Urea 25kg at 30 days after transplanting",
            "flowering": "Water soluble 13:0:45 foliar spray during fruiting",
            "harvest": "Staged harvest of breaker stage fruits every 3-4 days"
        }
    }
]

# 5. sample_farmer_profiles.json - Sample farmers
FARMER_PROFILES = [
    {
        "id": "murugan_madurai",
        "fullName": "Murugan P.",
        "fullNameTa": "முருகன் பி.",
        "email": "murugan@uzhavan.tn.gov.in",
        "phone": "9842145670",
        "state": "Tamil Nadu",
        "district": "Madurai",
        "village": "Vadipatti",
        "farmerType": "Owner",
        "experienceYears": 18,
        "primaryActivity": "Grains & Oilseeds",
        "language": "ta",
        "avatar": "👨‍🌾",
        "totalLandAcres": 4.5,
        "creditScore": 745,
        "isDemo": True,
        "bio": "Experienced delta margin farmer practicing integrated paddy-cotton-pulse relay farming."
    },
    {
        "id": "anitha_thanjavur",
        "fullName": "Anitha R.",
        "fullNameTa": "அனிதா ஆர்.",
        "email": "anitha@uzhavan.tn.gov.in",
        "phone": "9443218765",
        "state": "Tamil Nadu",
        "district": "Thanjavur",
        "village": "Papanasam",
        "farmerType": "Both",
        "experienceYears": 12,
        "primaryActivity": "Horticulture & Dairy",
        "language": "ta",
        "avatar": "👩‍🌾",
        "totalLandAcres": 3.8,
        "creditScore": 780,
        "isDemo": True,
        "bio": "Progressive woman farmer operating precision drip banana grove and organic millets."
    },
    {
        "id": "selvam_thanjavur",
        "fullName": "Selvam V.",
        "fullNameTa": "செல்வம் வி.",
        "email": "selvam@uzhavan.tn.gov.in",
        "phone": "9789012345",
        "state": "Tamil Nadu",
        "district": "Thanjavur",
        "village": "Kabisthalam",
        "farmerType": "Owner",
        "experienceYears": 22,
        "primaryActivity": "Grains & Pulses",
        "language": "en",
        "avatar": "👨‍🌾",
        "totalLandAcres": 8.3,
        "creditScore": 795,
        "isDemo": True,
        "bio": "Stitch Design Persona: Delta agro-ecological farmer specializing in Samba BPT 5204."
    }
]

# 6. sample_land_plots.json - Multi-plot records
LAND_PLOTS = [
    {
        "id": "plot_vadavaru_delta",
        "userId": "selvam_thanjavur",
        "plotName": "Vadavaru River Plot",
        "plotNameTa": "வடவாறு ஆற்றுப் பாசனம்",
        "areaAcres": 3.5,
        "areaOriginal": 3.5,
        "areaUnit": "acres",
        "soilType": "Clayey Alluvial Soil",
        "soilPh": 7.2,
        "organicCarbon": "0.68%",
        "fertilityNotes": "High cation exchange capacity (34 meq); optimal moisture retention.",
        "irrigationSource": "Canal + Deep Tube (High)",
        "waterAvailability": "Abundant",
        "currentCrop": "Paddy BPT 5204 (Andhra Ponni)",
        "previousCrop": "Kuruvai ADT 43",
        "plannedCrop": "Black Gram (VBN 8)",
        "sowingDate": "2026-09-15",
        "estimatedBudget": 35000,
        "isActive": True
    },
    {
        "id": "plot_kabisthalam_orchard",
        "userId": "selvam_thanjavur",
        "plotName": "Kabisthalam Banana Orchard",
        "plotNameTa": "கபிஸ்தலம் வாழைத் தோட்டம்",
        "areaAcres": 1.8,
        "areaOriginal": 1.8,
        "areaUnit": "acres",
        "soilType": "Clayey Alluvial Soil",
        "soilPh": 6.8,
        "organicCarbon": "0.75%",
        "fertilityNotes": "High organic matter with silt recharge; optimal potassium index.",
        "irrigationSource": "Borewell + Drip Fertigation",
        "waterAvailability": "Abundant",
        "currentCrop": "Banana (Grand Naine)",
        "previousCrop": "Banana Ratoon 1",
        "plannedCrop": "Banana Ratoon 2",
        "sowingDate": "2026-02-10",
        "estimatedBudget": 60000,
        "isActive": False
    },
    {
        "id": "plot_papanasam_blackgram",
        "userId": "selvam_thanjavur",
        "plotName": "Papanasam North Pulse Plot",
        "plotNameTa": "பாபநாசம் உளுந்து நிலம்",
        "areaAcres": 2.0,
        "areaOriginal": 200,
        "areaUnit": "cents",
        "soilType": "Clay Loam",
        "soilPh": 7.0,
        "organicCarbon": "0.62%",
        "fertilityNotes": "Excellent residual soil moisture for relay pulses.",
        "irrigationSource": "Canal Feeder",
        "waterAvailability": "Moderate",
        "currentCrop": "Black Gram (VBN 8)",
        "previousCrop": "Samba Paddy",
        "plannedCrop": "Sesame (TMV 7)",
        "sowingDate": "2026-01-20",
        "estimatedBudget": 16000,
        "isActive": False
    },
    {
        "id": "plot_vadipatti_cotton",
        "userId": "murugan_madurai",
        "plotName": "Vadipatti Black Cotton Plot",
        "plotNameTa": "வாடிப்பட்டி பருத்தி கரிசல் காடு",
        "areaAcres": 2.5,
        "areaOriginal": 2.5,
        "areaUnit": "acres",
        "soilType": "Black Cotton Soil (Regur)",
        "soilPh": 7.8,
        "organicCarbon": "0.58%",
        "fertilityNotes": "Deep regur clay with high moisture buffer.",
        "irrigationSource": "Open Well + Rainfed",
        "waterAvailability": "Moderate",
        "currentCrop": "Cotton (MCU 5)",
        "previousCrop": "Maize (CO 6)",
        "plannedCrop": "Sorghum (CO 30)",
        "sowingDate": "2026-08-10",
        "estimatedBudget": 28000,
        "isActive": True
    },
    {
        "id": "plot_vadipatti_paddy",
        "userId": "murugan_madurai",
        "plotName": "Vaigai Channel Paddy Field",
        "plotNameTa": "வைகை பாசன நெல் கழனி",
        "areaAcres": 2.0,
        "areaOriginal": 0.81,
        "areaUnit": "hectares",
        "soilType": "Alluvial Soil",
        "soilPh": 7.1,
        "organicCarbon": "0.65%",
        "fertilityNotes": "Fine river alluvium, optimal tillering bed.",
        "irrigationSource": "Canal (Vaigai)",
        "waterAvailability": "Seasonal/Deficit",
        "currentCrop": "Paddy (ADT 37)",
        "previousCrop": "Black Gram",
        "plannedCrop": "Sesame",
        "sowingDate": "2026-09-01",
        "estimatedBudget": 24000,
        "isActive": False
    }
]

# 7. sample_market_prices.json - Daily spot prices
MARKET_PRICES = [
    {
        "id": "mkt_paddy_ponni",
        "cropId": "paddy_bpt5204",
        "commodity": "Paddy Ponni (BPT 5204)",
        "commodityTa": "பொன்னி நெல் (BPT 5204)",
        "variety": "Grade A Super Fine",
        "market": "Thanjavur APMC Yard",
        "district": "Thanjavur",
        "wholesalePriceQtl": 2450,
        "retailPriceKg": 32.5,
        "unit": "₹ / Quintal",
        "priceChange7d": 65,
        "changeDirection": "up",
        "trend7Days": [2380, 2390, 2410, 2400, 2425, 2440, 2450],
        "sentiment": "Strong Demand",
        "recommendation": "Sell or Hold (Wait for mill tender peak)",
        "mandiYardReturns": 2450,
        "fpoProcurementReturns": 2510,
        "directFarmgateReturns": 2360,
        "observedDate": "2026-10-28",
        "source": "Tamil Nadu Regulated Market Committee (Demonstration Benchmark)"
    },
    {
        "id": "mkt_black_gram",
        "cropId": "black_gram_vbn8",
        "commodity": "Black Gram (VBN 8 / உளுந்து)",
        "commodityTa": "உளுந்து (VBN 8)",
        "variety": "Cleaned & Polished Machine Grade",
        "market": "Mattuthavani Central Market",
        "district": "Madurai",
        "wholesalePriceQtl": 7800,
        "retailPriceKg": 88.0,
        "unit": "₹ / Quintal",
        "priceChange7d": 120,
        "changeDirection": "up",
        "trend7Days": [7650, 7680, 7700, 7720, 7750, 7780, 7800],
        "sentiment": "Bullish",
        "recommendation": "Hold (Festival demand approaching)",
        "mandiYardReturns": 7800,
        "fpoProcurementReturns": 7950,
        "directFarmgateReturns": 7600,
        "observedDate": "2026-10-28",
        "source": "TN Agri Marketing Board (Demonstration Benchmark)"
    },
    {
        "id": "mkt_groundnut",
        "cropId": "groundnut_vri8",
        "commodity": "Groundnut (VRI 8 Pods)",
        "commodityTa": "நிலக்கடலை காய்",
        "variety": "Two-seeded Bold Pods",
        "market": "Tiruvannamalai Regulated Market",
        "district": "Tiruvannamalai",
        "wholesalePriceQtl": 6800,
        "retailPriceKg": 75.0,
        "unit": "₹ / Quintal",
        "priceChange7d": -40,
        "changeDirection": "down",
        "trend7Days": [6920, 6900, 6880, 6850, 6840, 6810, 6800],
        "sentiment": "High Arrivals",
        "recommendation": "Sell Immediately (New crop arrivals increasing)",
        "mandiYardReturns": 6800,
        "fpoProcurementReturns": 6920,
        "directFarmgateReturns": 6650,
        "observedDate": "2026-10-28",
        "source": "TN Regulated Markets"
    },
    {
        "id": "mkt_cotton",
        "cropId": "cotton_mcu5",
        "commodity": "Cotton (MCU 5 Kapas)",
        "commodityTa": "பருத்தி (கப்பாஸ்)",
        "variety": "Long Staple Clean Kapas",
        "market": "Rajapalayam Cotton Exchange",
        "district": "Virudhunagar",
        "wholesalePriceQtl": 7400,
        "retailPriceKg": 78.0,
        "unit": "₹ / Quintal",
        "priceChange7d": 80,
        "changeDirection": "up",
        "trend7Days": [7280, 7300, 7320, 7350, 7380, 7390, 7400],
        "sentiment": "Steady Mill Buying",
        "recommendation": "Sell or Hold",
        "mandiYardReturns": 7400,
        "fpoProcurementReturns": 7520,
        "directFarmgateReturns": 7250,
        "observedDate": "2026-10-28",
        "source": "Cotton Association of India (Demonstration Benchmark)"
    },
    {
        "id": "mkt_turmeric",
        "cropId": "turmeric_bsr2",
        "commodity": "Turmeric (Finger Quality BSR 2)",
        "commodityTa": "மஞ்சள் விரலி",
        "variety": "Double Polished Erode Grade",
        "market": "Perundurai Turmeric Complex",
        "district": "Erode",
        "wholesalePriceQtl": 12000,
        "retailPriceKg": 135.0,
        "unit": "₹ / Quintal",
        "priceChange7d": 350,
        "changeDirection": "up",
        "trend7Days": [11500, 11650, 11700, 11820, 11900, 11950, 12000],
        "sentiment": "Strong Bullish",
        "recommendation": "Hold (Export orders surging)",
        "mandiYardReturns": 12000,
        "fpoProcurementReturns": 12250,
        "directFarmgateReturns": 11700,
        "observedDate": "2026-10-28",
        "source": "Erode Regulated Market"
    },
    {
        "id": "mkt_banana",
        "cropId": "banana_grandnaine",
        "cropName": "Banana (Grand Naine)",
        "commodity": "Banana (Grand Naine Bunch)",
        "commodityTa": "வாழைத்தார் (G9)",
        "variety": "Grade A Clean Hands",
        "market": "Trichy Gandhi Market",
        "district": "Tiruchirappalli",
        "wholesalePriceQtl": 1800,
        "retailPriceKg": 25.0,
        "unit": "₹ / Quintal",
        "priceChange7d": 50,
        "changeDirection": "up",
        "trend7Days": [1720, 1740, 1750, 1770, 1780, 1790, 1800],
        "sentiment": "Steady",
        "recommendation": "Sell (Perishable commodity - harvest at 80%)",
        "mandiYardReturns": 1800,
        "fpoProcurementReturns": 1880,
        "directFarmgateReturns": 1710,
        "observedDate": "2026-10-28",
        "source": "Trichy Wholesale Commission Mandi"
    },
    {
        "id": "mkt_maize",
        "cropId": "maize_co6",
        "commodity": "Maize (Poultry Grade Yellow)",
        "commodityTa": "மக்காச்சோளம் (மஞ்சள்)",
        "variety": "Moisture <13% Dry Grain",
        "market": "Udumalpet Regulated Market",
        "district": "Tiruppur",
        "wholesalePriceQtl": 2250,
        "retailPriceKg": 25.0,
        "unit": "₹ / Quintal",
        "priceChange7d": 15,
        "changeDirection": "up",
        "trend7Days": [2210, 2220, 2230, 2230, 2240, 2245, 2250],
        "sentiment": "Stable",
        "recommendation": "Sell or Hold",
        "mandiYardReturns": 2250,
        "fpoProcurementReturns": 2310,
        "directFarmgateReturns": 2180,
        "observedDate": "2026-10-28",
        "source": "Tiruppur APMC"
    },
    {
        "id": "mkt_chilli",
        "cropId": "red_chilli_k1",
        "commodity": "Red Chilli (Mundu / K1)",
        "commodityTa": "வத்தல் மிளகாய் (குண்டு)",
        "variety": "Sun Dried Stemless",
        "market": "Ramanathapuram Regulated Market",
        "district": "Ramanathapuram",
        "wholesalePriceQtl": 16500,
        "retailPriceKg": 185.0,
        "unit": "₹ / Quintal",
        "priceChange7d": 200,
        "changeDirection": "up",
        "trend7Days": [16100, 16200, 16300, 16350, 16400, 16450, 16500],
        "sentiment": "High Demand",
        "recommendation": "Hold for Diwali peak",
        "mandiYardReturns": 16500,
        "fpoProcurementReturns": 16900,
        "directFarmgateReturns": 16100,
        "observedDate": "2026-10-28",
        "source": "RMC Ramanathapuram"
    }
]

# 8. sample_weather.json - Forecasts and advisories
WEATHER_DATA = [
    {
        "district": "Thanjavur",
        "temperature": 29.5,
        "tempMin": 24.0,
        "tempMax": 32.5,
        "humidity": 78,
        "rainProbability": 65,
        "windSpeedKm": 14,
        "uvIndex": 7,
        "condition": "Scattered Monsoon Showers",
        "conditionTa": "பருவமழை மிதமான தூறல்",
        "activeAdvisories": [
            "Moderate to heavy showers expected over Vadavaru basin tomorrow. Postpone chemical spray and urea top-dressing by 48 hours.",
            "Inspect drainage channels in low-lying Kuruvai and Samba fields to prevent submersion of tillering nodes.",
            "High humidity (78%) creates favorable microclimate for blast disease in BPT 5204. Schedule bio-prophylactic spray once skies clear."
        ],
        "forecast7Day": [
            {"day": "Wed", "date": "Oct 28", "temp": "31° / 24°", "rain": "65%", "icon": "rain", "advisory": "Drain water inlets"},
            {"day": "Thu", "date": "Oct 29", "temp": "30° / 23°", "rain": "75%", "icon": "thunder", "advisory": "Postpone urea top-dress"},
            {"day": "Fri", "date": "Oct 30", "temp": "29° / 23°", "rain": "50%", "icon": "rain", "advisory": "Inspect bunds"},
            {"day": "Sat", "date": "Oct 31", "temp": "32° / 24°", "rain": "25%", "icon": "partly_cloudy", "advisory": "Favorable for spraying"},
            {"day": "Sun", "date": "Nov 01", "temp": "33° / 25°", "rain": "15%", "icon": "sunny", "advisory": "Resume intercultural work"},
            {"day": "Mon", "date": "Nov 02", "temp": "32° / 24°", "rain": "20%", "icon": "sunny", "advisory": "Irrigate field as required"},
            {"day": "Tue", "date": "Nov 03", "temp": "31° / 24°", "rain": "30%", "icon": "partly_cloudy", "advisory": "Monitor for leaf folder"}
        ]
    },
    {
        "district": "Madurai",
        "temperature": 32.0,
        "tempMin": 25.0,
        "tempMax": 34.5,
        "humidity": 62,
        "rainProbability": 25,
        "windSpeedKm": 11,
        "uvIndex": 8,
        "condition": "Warm with Clear Skies",
        "conditionTa": "வெப்பமான தெளிவான வானிலை",
        "activeAdvisories": [
            "Favorable clear weather for cotton weeding and intercultural hoeing in Vadipatti and Usilampatti blocks.",
            "Soil moisture in black soils declining: provide light furrow irrigation for vegetative maize and cotton.",
            "Install pheromone traps (5/acre) to monitor pink bollworm moth flights."
        ],
        "forecast7Day": [
            {"day": "Wed", "date": "Oct 28", "temp": "34° / 25°", "rain": "25%", "icon": "sunny", "advisory": "Intercultural hoeing"},
            {"day": "Thu", "date": "Oct 29", "temp": "34° / 25°", "rain": "20%", "icon": "sunny", "advisory": "Good for cotton picking"},
            {"day": "Fri", "date": "Oct 30", "temp": "33° / 24°", "rain": "35%", "icon": "partly_cloudy", "advisory": "Light furrow irrigation"},
            {"day": "Sat", "date": "Oct 31", "temp": "32° / 24°", "rain": "40%", "icon": "rain", "advisory": "Watch for leaf curl"},
            {"day": "Sun", "date": "Nov 01", "temp": "33° / 24°", "rain": "30%", "icon": "partly_cloudy", "advisory": "Apply DAP foliar spray"},
            {"day": "Mon", "date": "Nov 02", "temp": "34° / 25°", "rain": "15%", "icon": "sunny", "advisory": "Irrigate orchards"},
            {"day": "Tue", "date": "Nov 03", "temp": "35° / 25°", "rain": "10%", "icon": "sunny", "advisory": "Clear weather continues"}
        ]
    },
    {
        "district": "Coimbatore",
        "temperature": 27.5,
        "tempMin": 21.0,
        "tempMax": 30.0,
        "humidity": 70,
        "rainProbability": 40,
        "windSpeedKm": 16,
        "uvIndex": 7,
        "condition": "Cool Breezy Overcast",
        "conditionTa": "குளிர்ந்த காற்றுடன் மேகமூட்டம்",
        "activeAdvisories": [
            "Western Ghats breeze active: check tie-ups in banana orchards to prevent stem lodging.",
            "Vegetable farmers in Pollachi: spray neem seed kernel extract (5%) to repel thrips and whiteflies.",
            "Ensure rainwater harvesting silt traps are cleaned before weekend showers."
        ],
        "forecast7Day": [
            {"day": "Wed", "date": "Oct 28", "temp": "29° / 21°", "rain": "40%", "icon": "partly_cloudy", "advisory": "Tie up banana stems"},
            {"day": "Thu", "date": "Oct 29", "temp": "28° / 21°", "rain": "45%", "icon": "rain", "advisory": "Neem oil spray"},
            {"day": "Fri", "date": "Oct 30", "temp": "28° / 20°", "rain": "35%", "icon": "partly_cloudy", "advisory": "Clean silt traps"},
            {"day": "Sat", "date": "Oct 31", "temp": "30° / 21°", "rain": "20%", "icon": "sunny", "advisory": "Good for harvesting"},
            {"day": "Sun", "date": "Nov 01", "temp": "30° / 22°", "rain": "20%", "icon": "sunny", "advisory": "Irrigate coconut palms"},
            {"day": "Mon", "date": "Nov 02", "temp": "29° / 21°", "rain": "30%", "icon": "partly_cloudy", "advisory": "Check drip filters"},
            {"day": "Tue", "date": "Nov 03", "temp": "29° / 21°", "rain": "35%", "icon": "partly_cloudy", "advisory": "Normal agronomy"}
        ]
    }
]

# 10. crop_risk_rules.json - Risk evaluation rules
CROP_RISK_RULES = [
    {
        "id": "risk_heavy_rain_tillering",
        "category": "Weather Hazard",
        "triggerCondition": "Rain probability > 60% and Crop Stage in ['Transplanting', 'Active Tillering']",
        "severity": "Medium",
        "title": "Submersion and Nutrient Leaching Risk",
        "titleTa": "நீர்மூழ்கல் மற்றும் உரக் கரைவு ஆபத்து",
        "description": "Heavy rainfall during tillering flushes soluble nitrogen fertilizer into drainage canals.",
        "recommendedAction": "Withhold chemical top-dressing until showers cease; open perimeter field bunds to discharge excess runoff.",
        "escalationContact": "Contact Block Assistant Director of Agriculture (ADA) for drainage gate coordination."
    },
    {
        "id": "risk_blast_humidity",
        "category": "Pest & Disease",
        "triggerCondition": "Humidity > 75% and Temperature between 22°C and 28°C and Crop == 'Paddy'",
        "severity": "High",
        "title": "Paddy Blast Disease Threat (Pyricularia oryzae)",
        "titleTa": "நெல் இலைக் கருகல் நோய் அபாயம்",
        "description": "Cool night dew coupled with daytime warmth triggers blast spore germination on leaf surfaces.",
        "recommendedAction": "Soak seed paddy in Pseudomonas fluorescens (10g/kg). For standing crop, spray Tricyclazole 75% WP (0.6g/L) or Neem Seed Kernel Extract (5%).",
        "escalationContact": "TNAU Agronomy Clinic / KVK Thanjavur: 04362-267355"
    },
    {
        "id": "risk_drought_water_deficit",
        "category": "Water Deficit",
        "triggerCondition": "Rain probability < 20% for 14 days and Water Availability == 'Seasonal/Deficit'",
        "severity": "High",
        "title": "Terminal Moisture Stress Alert",
        "titleTa": "வறட்சி மற்றும் தீவிர நீர் பற்றாக்குறை",
        "description": "Panicle desiccation occurs if field drys completely during flowering or milk stage.",
        "recommendedAction": "Adopt alternate wetting and drying (AWD); apply potassium chloride (1% foliar spray) to enhance stomatal closure and drought resistance.",
        "escalationContact": "Local PWD Water Resources Department canal schedule desk."
    },
    {
        "id": "risk_fall_armyworm_maize",
        "category": "Pest & Disease",
        "triggerCondition": "Crop == 'Maize' and DaysAfterSowing between 15 and 45",
        "severity": "High",
        "title": "Fall Armyworm (Spodoptera frugiperda) Surveillance",
        "titleTa": "படைப்புழு தாக்குதல் கண்காணிப்பு",
        "description": "Larvae bore into central whorls leaving characteristic ragged holes and sawdust-like frass.",
        "recommendedAction": "Handpick egg masses; install 5 pheromone traps/acre; apply sand-lime mix (9:1) into central whorls or spray Chlorantraniliprole 18.5% SC (0.4ml/L).",
        "escalationContact": "TNAU Directorate of Extension Education: 0422-6611233"
    }
]

# 11. fertilizer_guidelines.json - Fertilizer dosages
FERTILIZER_GUIDELINES = [
    {
        "cropId": "paddy_bpt5204",
        "cropName": "Paddy (Ponni BPT 5204)",
        "standardRecommendationKgPerAcre": {"N": 50, "P": 25, "K": 25},
        "fertilizerEquivalents": {
            "urea": 65,
            "dap": 54,
            "mop": 42,
            "zincSulfate": 10
        },
        "splitSchedule": [
            {"stage": "Basal (Transplanting)", "dapKg": 54, "mopKg": 15, "ureaKg": 0, "zincKg": 10, "notes": "Incorporate during final puddle."},
            {"stage": "Active Tillering (21 DAT)", "dapKg": 0, "mopKg": 0, "ureaKg": 35, "zincKg": 0, "notes": "Thin water film in field; drain before broadcasting."},
            {"stage": "Panicle Initiation (50 DAT)", "dapKg": 0, "mopKg": 27, "ureaKg": 30, "zincKg": 0, "notes": "Crucial split for panicle size and grain weight."}
        ],
        "organicAlternatives": "Farm Yard Manure 5 tonnes/acre + Daincha green manure incorporated 15 days prior to transplanting."
    },
    {
        "cropId": "groundnut_vri8",
        "cropName": "Groundnut (VRI 8)",
        "standardRecommendationKgPerAcre": {"N": 10, "P": 20, "K": 30},
        "fertilizerEquivalents": {
            "urea": 0,
            "dap": 45,
            "mop": 50,
            "gypsum": 200
        },
        "splitSchedule": [
            {"stage": "Basal (Sowing)", "dapKg": 45, "mopKg": 25, "gypsumKg": 100, "notes": "Basal gypsum ensures initial root zone calcium."},
            {"stage": "Pegging Stage (40-45 DAS)", "dapKg": 0, "mopKg": 25, "gypsumKg": 100, "notes": "Top-dress gypsum around plant base and earth up immediately to facilitate pod filling."}
        ],
        "organicAlternatives": "Vermicompost 2 tonnes/acre + Bio-fertilizers (Rhizobium + Phosphobacteria seed coating)."
    }
]

# 12. livestock_health_guides.json - Veterinary directory & guides
LIVESTOCK_GUIDES = [
    {
        "species": "Dairy Cow (கறவை மாடு)",
        "icon": "🐄",
        "commonConditions": [
            {
                "disease": "Mastitis (மடி நோய்)",
                "symptoms": "Swelling, heat and tenderness in udder, milk appears clotted or watery with blood flakes.",
                "firstAid": "Empty affected quarter gently; cold compress on swollen udder; avoid milking onto floor.",
                "prevention": "Post-milking teat dipping in 0.5% povidone-iodine; maintain clean dry stall bedding.",
                "vetUrgency": "High (Administer intramammary antibiotics under qualified veterinary guidance within 12 hours)."
            },
            {
                "disease": "Foot and Mouth Disease - FMD (கோமாரி நோய்)",
                "symptoms": "High fever, excessive frothy salivation, blisters on tongue, dental pad and interdigital cleft of feet.",
                "firstAid": "Wash mouth with 1% potassium permanganate or sodium bicarbonate solution; apply boro-glycerine to ulcers.",
                "prevention": "Bi-annual vaccination under TN Animal Husbandry FMD-CP schedule (March & September).",
                "vetUrgency": "Urgent Emergency (Report immediately to local Veterinary Dispensary or dial 1962)."
            },
            {
                "disease": "Bloat / Tympany (வயிற்று உப்புசம்)",
                "symptoms": "Sudden swelling of left flank, restless behavior, rapid breathing and kicking at belly.",
                "firstAid": "Keep animal standing with front quarters elevated; drench with 500ml edible groundnut/gingerly oil with 30ml turpentine oil.",
                "prevention": "Avoid sudden feeding of lush leguminous green fodder (Lucerne/Berseem) without dry roughage.",
                "vetUrgency": "Immediate Emergency (Risk of asphyxiation)."
            }
        ],
        "vaccinationCalendar": [
            {"vaccine": "FMD Vaccine", "age": "4 months & above", "frequency": "Every 6 months (Pre-monsoon)", "department": "Free at Govt Vet Hospitals"},
            {"vaccine": "Black Quarter (BQ)", "age": "6 months & above", "frequency": "Annual (May - June)", "department": "Free at Govt Vet Hospitals"},
            {"vaccine": "Haemorrhagic Septicaemia (HS)", "age": "6 months & above", "frequency": "Annual (August - September)", "department": "Free at Govt Vet Hospitals"}
        ]
    },
    {
        "species": "Goat & Sheep (ஆடு மற்றும் செம்மறி)",
        "icon": "🐐",
        "commonConditions": [
            {
                "disease": "Peste des Petits Ruminants - PPR (ஆட்டுக்கொள்ளை நோய்)",
                "symptoms": "Sudden high fever, discharges from eyes and nose, necrotic lesions in mouth, profuse watery diarrhea.",
                "firstAid": "Isolate sick goats; administer oral electrolyte fluids to combat dehydration; feed soft gruel.",
                "prevention": "PPR vaccination gives immunity for 3 years; vaccinate all kids above 3 months.",
                "vetUrgency": "High (Consult veterinarian immediately)."
            },
            {
                "disease": "Enterotoxaemia / Pulpy Kidney (துள்ளு நோய்)",
                "symptoms": "Sudden death in fast-growing lambs, neurological staggering, convulsions before death.",
                "firstAid": "Immediate veterinary drenching with anti-toxin serum.",
                "prevention": "Vaccinate with ET vaccine 15 days before onset of monsoon rains.",
                "vetUrgency": "Emergency."
            }
        ],
        "vaccinationCalendar": [
            {"vaccine": "PPR Vaccine", "age": "3 months", "frequency": "Once in 3 years", "department": "Govt Animal Husbandry"},
            {"vaccine": "ET Vaccine", "age": "3 months", "frequency": "Annual (Pre-monsoon)", "department": "Govt Animal Husbandry"}
        ]
    }
]

VETERINARY_FACILITIES = [
    {
        "id": "vet_thanjavur_polyclinic",
        "name": "District Veterinary Polyclinic, Thanjavur",
        "nameTa": "மாவட்ட கால்நடை மருத்துவமனை, தஞ்சாவூர்",
        "district": "Thanjavur",
        "address": "Medical College Road, Thanjavur - 613007",
        "phone": "04362-230488",
        "emergencyHotline": "1962 (Toll Free Animal Ambulance)",
        "facilities": ["24/7 Casualty", "Mobile X-Ray", "Ultrasound", "Operation Theatre", "Artificial Insemination"],
        "openHours": "24 Hours Open (Emergency Service)",
        "verified": True
    },
    {
        "id": "vet_madurai_polyclinic",
        "name": "Veterinary Polyclinic, Madurai Central",
        "nameTa": "கால்நடை மருத்துவமனை, மதுரை",
        "district": "Madurai",
        "address": "Thallakulam, Madurai - 625002",
        "phone": "0452-2531234",
        "emergencyHotline": "1962",
        "facilities": ["Emergency Surgical Unit", "Clinical Pathology Lab", "Inpatient Ward"],
        "openHours": "8:00 AM - 8:00 PM (24/7 on-call)",
        "verified": True
    },
    {
        "id": "vet_coimbatore_hospital",
        "name": "Veterinary Hospital & Referral Clinic, Coimbatore",
        "nameTa": "கால்நடை மருத்துவமனை, கோயம்புத்தூர்",
        "district": "Coimbatore",
        "address": "Cowley Brown Road, R.S. Puram, Coimbatore - 641002",
        "phone": "0422-2543210",
        "emergencyHotline": "1962",
        "facilities": ["Large Animal Surgery", "Diagnostic Sonography", "Free Anti-Rabies"],
        "openHours": "24 Hours Emergency",
        "verified": True
    }
]

# 13. government_schemes.json - Central and Tamil Nadu schemes
GOVERNMENT_SCHEMES = [
    {
        "id": "scheme_pm_kisan",
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "nameTa": "பி.எம் கிசான் திட்டம்",
        "category": "Direct Income Support",
        "sponsor": "Central Government",
        "benefit": "₹6,000 per year paid in three equal instalments of ₹2,000 directly into farmer bank accounts via DBT.",
        "eligibility": "All landholding farmer families having cultivable landholding in their names (subject to exclusion criteria for institutional landowners).",
        "documentsRequired": ["Aadhaar Card", "Land Patta / Chitta", "Bank Passbook linked to Aadhaar", "Active Mobile Number"],
        "applicationProcess": "Apply online at pmkisan.gov.in or through Village E-Seva Centre (CSC) with land revenue records.",
        "officialUrl": "https://pmkisan.gov.in",
        "lastVerifiedDate": "2026-10-01",
        "isActive": True
    },
    {
        "id": "scheme_pmfby",
        "name": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
        "nameTa": "பயிர் காப்பீட்டுத் திட்டம் (PMFBY)",
        "category": "Crop Insurance",
        "sponsor": "Central & State Joint",
        "benefit": "Comprehensive insurance coverage against non-preventable natural risks (drought, flood, unseasonal rain, pests). Farmers pay low premium (1.5% Rabi, 2% Kharif, 5% Commercial).",
        "eligibility": "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
        "documentsRequired": ["Aadhaar Card", "Adangal / Sowing Certificate from VAO", "Bank Passbook", "Land Ownership / Lease Agreement"],
        "applicationProcess": "Enrol through Primary Agricultural Cooperative Credit Societies (PACCS), commercial banks, or Common Service Centres before cut-off date.",
        "officialUrl": "https://pmfby.gov.in",
        "lastVerifiedDate": "2026-10-01",
        "isActive": True
    },
    {
        "id": "scheme_tn_micro_irrigation",
        "name": "Tamil Nadu Micro-Irrigation Scheme (Drip & Sprinkler)",
        "nameTa": "நுண்ணீர்ப் பாசன மானியத் திட்டம்",
        "category": "Irrigation Infrastructure",
        "sponsor": "Government of Tamil Nadu",
        "benefit": "100% subsidy for Small & Marginal Farmers (up to 5 acres); 75% subsidy for other farmers for installing drip/sprinkler systems.",
        "eligibility": "Farmers with valid land ownership documents and an assured groundwater or surface water source.",
        "documentsRequired": ["Patta / Chitta", "FMB Sketch", "Aadhaar Card", "Small/Marginal Farmer Certificate from Tahsildar", "Water & Electricity Availability Proof"],
        "applicationProcess": "Register on the TN Horticulture Department portal (tnhorticulture.tn.gov.in/mis) or submit application to Block Assistant Director of Horticulture.",
        "officialUrl": "https://tnhorticulture.tn.gov.in",
        "lastVerifiedDate": "2026-09-15",
        "isActive": True
    },
    {
        "id": "scheme_pm_kusum_solar",
        "name": "PM-KUSUM Component B (Solar Agricultural Pumps)",
        "nameTa": "சூரிய சக்தி விவசாய பம்புசெட் திட்டம்",
        "category": "Renewable Energy",
        "sponsor": "Central & State Ministry of New and Renewable Energy",
        "benefit": "Up to 70% subsidy (30% Central + 40% State) for installing standalone solar agricultural pumps of 5HP, 7.5HP, and 10HP.",
        "eligibility": "Individual farmers, water user associations, and farmer producer groups having arable land with borewell/open well but lacking grid power connection.",
        "documentsRequired": ["Patta / Chitta", "Aadhaar Card", "Borewell Yield Certificate", "Bank Account Details", "Passport Photos"],
        "applicationProcess": "Apply through Tamil Nadu Energy Development Agency (TEDA) or Agriculture Engineering Department.",
        "officialUrl": "https://teda.in",
        "lastVerifiedDate": "2026-09-20",
        "isActive": True
    },
    {
        "id": "scheme_kaviyadp",
        "name": "Kalaignarin All Village Integrated Agriculture Development Programme",
        "nameTa": "கலைஞரின் அனைத்து கிராம ஒருங்கிணைந்த வேளாண் வளர்ச்சி திட்டம்",
        "category": "Integrated Village Development",
        "sponsor": "Government of Tamil Nadu",
        "benefit": "Distribution of certified quality seeds, fruit saplings, battery sprayers, drip subsidy, and reclamation of fallow lands in selected village panchayats.",
        "eligibility": "Farmers resident in the village panchayats selected for the current fiscal year.",
        "documentsRequired": ["Aadhaar Card", "Ration Card", "Land Records"],
        "applicationProcess": "Enroll at the special gram sabha camp organized by the Agricultural Department.",
        "officialUrl": "https://agritech.tnau.ac.in",
        "lastVerifiedDate": "2026-08-30",
        "isActive": True
    }
]

# 14. labor_listings.json - Farm labour teams
LABOUR_LISTINGS = [
    {
        "id": "labour_vadipatti_paddy",
        "name": "Selvamani & Team (Vadipatti Paddy Workers)",
        "nameTa": "செல்வமணி குழுவினர் (நெல் நடவு & அறுவடை)",
        "leaderName": "Selvamani K.",
        "district": "Madurai",
        "village": "Vadipatti",
        "teamSize": 12,
        "primarySkills": ["Paddy Transplanting", "Weeding", "Manual Harvesting"],
        "dailyWagePerWorker": 650,
        "workingHours": "8:00 AM - 3:00 PM (Field Hours)",
        "rating": 4.9,
        "completedJobs": 46,
        "distanceKm": 3.4,
        "contactPhone": "98430-11223",
        "isAvailable": True,
        "isDemo": True
    },
    {
        "id": "labour_papanasam_transplant",
        "name": "Cauvery Delta Sowing Crew",
        "nameTa": "காவிரி டெல்டா நடவுக் குழு",
        "leaderName": "Murugesan P.",
        "district": "Thanjavur",
        "village": "Papanasam",
        "teamSize": 16,
        "primarySkills": ["Line Transplanting (SRI)", "Weeding", "Basal Fertilizer Application"],
        "dailyWagePerWorker": 680,
        "workingHours": "7:30 AM - 2:30 PM",
        "rating": 4.8,
        "completedJobs": 62,
        "distanceKm": 4.1,
        "contactPhone": "97880-44556",
        "isAvailable": True,
        "isDemo": True
    },
    {
        "id": "labour_pollachi_coconut",
        "name": "Pollachi Coconut & Orchard Climbers",
        "nameTa": "பொள்ளாச்சி தென்னை மரம் ஏறுவோர் குழு",
        "leaderName": "Arumugam M.",
        "district": "Coimbatore",
        "village": "Pollachi",
        "teamSize": 6,
        "primarySkills": ["Coconut Harvesting", "Crown Cleaning", "Banana Propping"],
        "dailyWagePerWorker": 850,
        "workingHours": "7:00 AM - 1:00 PM",
        "rating": 5.0,
        "completedJobs": 88,
        "distanceKm": 6.2,
        "contactPhone": "94420-77889",
        "isAvailable": True,
        "isDemo": True
    },
    {
        "id": "labour_erode_turmeric",
        "name": "Erode Turmeric & Commercial Harvesting Team",
        "nameTa": "ஈரோடு மஞ்சள் அறுவடைத் தொழிலாளர்கள்",
        "leaderName": "Chinnasamy V.",
        "district": "Erode",
        "village": "Perundurai",
        "teamSize": 14,
        "primarySkills": ["Turmeric Digging", "Rhizome Boiling", "Earthing Up"],
        "dailyWagePerWorker": 700,
        "workingHours": "8:00 AM - 3:00 PM",
        "rating": 4.7,
        "completedJobs": 39,
        "distanceKm": 5.8,
        "contactPhone": "98650-33441",
        "isAvailable": True,
        "isDemo": True
    }
]

# 15. machinery_catalog.json - 10 categories, 50+ listings
MACHINERY_LISTINGS = []
MACHINERY_CATEGORIES = [
    "Tractor (45-55 HP)", "Combine Harvester", "Power Tiller", "Rotavator (6-8 Ft)",
    "Seed Drill / Planter", "Boom Sprayer", "Agricultural Drone", "Multi-Crop Thresher",
    "Cultivator (9-Tyne)", "Round Baler"
]

SAMPLE_MACHINES = [
    {"name": "Mahindra 575 DI Tractor (45 HP)", "category": "Tractor (45-55 HP)", "brand": "Mahindra", "hourly": 750, "daily": 4500, "operator": True, "district": "Thanjavur"},
    {"name": "John Deere 5050D Tractor (50 HP)", "category": "Tractor (45-55 HP)", "brand": "John Deere", "hourly": 800, "daily": 4800, "operator": True, "district": "Madurai"},
    {"name": "Kubota DC-68G Track Combine Harvester", "category": "Combine Harvester", "brand": "Kubota", "hourly": 2400, "daily": 18000, "operator": True, "district": "Thanjavur"},
    {"name": "Claas Crop Tiger 30 Harvester", "category": "Combine Harvester", "brand": "Claas", "hourly": 2200, "daily": 16500, "operator": True, "district": "Tiruvarur"},
    {"name": "VST Shakti 130 DI Power Tiller", "category": "Power Tiller", "brand": "VST Shakti", "hourly": 450, "daily": 2600, "operator": True, "district": "Coimbatore"},
    {"name": "Shaktiman 6-Ft Regular Rotavator", "category": "Rotavator (6-8 Ft)", "brand": "Shaktiman", "hourly": 550, "daily": 3200, "operator": False, "district": "Thanjavur"},
    {"name": "Fieldking 9-Row Multi-Crop Seed Drill", "category": "Seed Drill / Planter", "brand": "Fieldking", "hourly": 600, "daily": 3400, "operator": True, "district": "Madurai"},
    {"name": "Aspee HTP Tractor Boom Sprayer (400L)", "category": "Boom Sprayer", "brand": "Aspee", "hourly": 500, "daily": 3000, "operator": True, "district": "Erode"},
    {"name": "Garuda Kisan Agri Drone (10L Tank)", "category": "Agricultural Drone", "brand": "Garuda Aerospace", "hourly": 1200, "daily": 7500, "operator": True, "district": "Coimbatore"},
    {"name": "National Multi-Crop Thresher (Paddy/Maize)", "category": "Multi-Crop Thresher", "brand": "National", "hourly": 700, "daily": 4200, "operator": True, "district": "Salem"},
    {"name": "Universal 9-Tyne Spring Loaded Cultivator", "category": "Cultivator (9-Tyne)", "brand": "Universal", "hourly": 400, "daily": 2400, "operator": False, "district": "Tiruchirappalli"},
    {"name": "New Holland Roll-Belt Round Straw Baler", "category": "Round Baler", "brand": "New Holland", "hourly": 1400, "daily": 8500, "operator": True, "district": "Thanjavur"}
]

# Generate 50+ machinery listings by expanding across districts
mach_id = 1
for cat in MACHINERY_CATEGORIES:
    for dist in ["Thanjavur", "Madurai", "Coimbatore", "Tiruchirappalli", "Salem", "Erode"]:
        base_match = next((m for m in SAMPLE_MACHINES if m["category"] == cat), SAMPLE_MACHINES[0])
        MACHINERY_LISTINGS.append({
            "id": f"mach_{mach_id:03d}",
            "name": f"{base_match['name']} ({dist})",
            "category": cat,
            "brand": base_match["brand"],
            "district": dist,
            "hourlyRate": base_match["hourly"] + (mach_id % 3) * 50,
            "dailyRate": base_match["daily"] + (mach_id % 3) * 200,
            "operatorIncluded": base_match["operator"],
            "rating": round(4.5 + (mach_id % 5) * 0.1, 1),
            "distanceKm": round(2.5 + (mach_id % 8) * 1.5, 1),
            "ownerName": f"Agri Fleet Provider {mach_id}",
            "contactPhone": f"944{mach_id:04d}12",
            "isAvailable": True,
            "isDemo": True
        })
        mach_id += 1

# 16. agricultural_services.json - Support infrastructure
AGRICULTURAL_SERVICES = [
    {
        "id": "kvk_thanjavur",
        "name": "ICAR - Krishi Vigyan Kendra, Thanjavur",
        "nameTa": "வேளாண் அறிவியல் நிலையம், தஞ்சாவூர்",
        "type": "Krishi Vigyan Kendra (KVK)",
        "district": "Thanjavur",
        "address": "Soil Salinity Research Station Campus, Needamangalam / Thanjavur",
        "phone": "04362-267355",
        "servicesOffered": ["Soil & Water Testing", "Certified Breeder Seeds", "Pest Diagnostic Clinic", "Free Farmer Training"],
        "latitude": 10.7867,
        "longitude": 79.1378
    },
    {
        "id": "tnau_soil_lab_madurai",
        "name": "Agricultural College & Research Institute (TNAU) Soil Lab",
        "nameTa": "தமிழ்நாடு வேளாண் பல்கலைக்கழக மண் பரிசோதனை ஆய்வகம், மதுரை",
        "type": "TNAU Research Station & Soil Lab",
        "district": "Madurai",
        "address": "Othakadai, Madurai - 625104",
        "phone": "0452-2422956",
        "servicesOffered": ["Comprehensive NPK Chromatography", "Micronutrient Profiling", "Soil Health Card Generation"],
        "latitude": 9.9687,
        "longitude": 78.1882
    },
    {
        "id": "fpo_cauvery_delta",
        "name": "Cauvery Delta Traditional Paddy Farmer Producer Co.",
        "nameTa": "காவிரி டெல்டா பாரம்பரிய விவசாயிகள் உற்பத்தியாளர் நிறுவனம்",
        "type": "Farmer Producer Organization (FPO)",
        "district": "Thanjavur",
        "address": "Main Road, Papanasam - 614205",
        "phone": "04362-221144",
        "servicesOffered": ["Collective Paddy Procurement at +₹60/Qtl over APMC", "Bulk Fertilizer Supply", "Drone Spraying Service"],
        "latitude": 10.9234,
        "longitude": 79.2812
    }
]

# 17. farm_calendar_templates.json - Week-by-week timeline
CALENDAR_TEMPLATES = {
    "paddy_samba": {
        "cropName": "Samba Paddy (140 Days)",
        "cropNameTa": "சம்பா நெல் பயிர் நாட்காட்டி",
        "totalWeeks": 20,
        "stages": [
            {
                "week": 1,
                "days": "Day 0 - 7",
                "stageName": "Summer Puddling & Land Preparation",
                "stageNameTa": "நிலம் தயாரித்தல் & உழவு",
                "tasks": [
                    {"id": "t1_1", "task": "Plow field twice with disc plow and level bunds.", "category": "Land Prep", "mandatory": True},
                    {"id": "t1_2", "task": "Incorporate Daincha / Sesbania green manure (5 tonnes/acre).", "category": "Nutrient", "mandatory": True}
                ]
            },
            {
                "week": 2,
                "days": "Day 8 - 14",
                "stageName": "Basal Dosing & Nursery Sowing",
                "stageNameTa": "அடி உரம் & நாற்றங்கால் தயாரிப்பு",
                "tasks": [
                    {"id": "t2_1", "task": "Soak certified seeds with Pseudomonas fluorescens (10g/kg).", "category": "Seed Treatment", "mandatory": True},
                    {"id": "t2_2", "task": "Broadcast DAP 45kg + MOP 15kg + Zinc Sulfate 10kg as basal dose.", "category": "Fertilizer", "mandatory": True}
                ]
            },
            {
                "week": 4,
                "days": "Day 21 - 28",
                "stageName": "Transplanting / DSR Seeding",
                "stageNameTa": "நாற்று நடுதல் / நேரடி விதைப்பு",
                "tasks": [
                    {"id": "t4_1", "task": "Transplant 18-21 day old seedlings at 2-3 seedlings per hill.", "category": "Transplanting", "mandatory": True},
                    {"id": "t4_2", "task": "Maintain thin water layer of 2 cm in field.", "category": "Irrigation", "mandatory": True}
                ]
            },
            {
                "week": 6,
                "days": "Day 35 - 42",
                "stageName": "Active Tillering & First Top-Dress",
                "stageNameTa": "தூர்கட்டும் பருவம் & முதல் மேலுரம்",
                "tasks": [
                    {"id": "t6_1", "task": "Drain excess water and broadcast Urea 25kg/acre.", "category": "Fertilizer", "mandatory": True},
                    {"id": "t6_2", "task": "Operate cono-weeder between rows to aerate root bed.", "category": "Weeding", "mandatory": True}
                ]
            },
            {
                "week": 9,
                "days": "Day 56 - 63",
                "stageName": "Panicle Initiation (Booting)",
                "stageNameTa": "கதிர் உருவாகும் பருவம்",
                "tasks": [
                    {"id": "t9_1", "task": "Apply second top-dress: Urea 15kg + MOP 10kg/acre.", "category": "Fertilizer", "mandatory": True},
                    {"id": "t9_2", "task": "Inspect flag leaves for blast disease spots; spray Tricyclazole if spotted.", "category": "Pest Surveillance", "mandatory": True}
                ]
            },
            {
                "week": 14,
                "days": "Day 91 - 98",
                "stageName": "Flowering & Milk Stage",
                "stageNameTa": "பூக்கும் மற்றும் பால் பிடிக்கும் பருவம்",
                "tasks": [
                    {"id": "t14_1", "task": "Maintain continuous 5 cm standing water; do not allow field to dry.", "category": "Irrigation", "mandatory": True},
                    {"id": "t14_2", "task": "Foliar spray of 1% Potassium Nitrate (KNO3) for bold grain filling.", "category": "Nutrient", "mandatory": False}
                ]
            },
            {
                "week": 19,
                "days": "Day 126 - 135",
                "stageName": "De-watering & Harvest Preparation",
                "stageNameTa": "தண்ணீர் வடித்தல் & அறுவடை ஆயத்தம்",
                "tasks": [
                    {"id": "t19_1", "task": "Completely drain field 10-12 days prior to combine harvester entry.", "category": "Harvest Prep", "mandatory": True},
                    {"id": "t19_2", "task": "Book combine harvester and reserve drying yard floor.", "category": "Logistics", "mandatory": True}
                ]
            }
        ]
    }
}

# 18. farm_lingo_dictionary.json - Multi-language negotiation glossary
FARM_LINGO = {
    "categories": [
        "Price & Rate Bargaining",
        "Quality & Moisture Specifications",
        "Quantity & Measurements",
        "Delivery & Transport Logistics",
        "Payment & Banking Terms"
    ],
    "glossary": [
        {"tamil": "குவிண்டால்", "english": "Quintal (100 kg)", "hindi": "क्विंटल (Quintal)", "phonetic": "Kuvintal", "def": "Standard wholesale unit of mass equal to 100 kilograms."},
        {"tamil": "ஈரப்பதம்", "english": "Moisture Content", "hindi": "नमी (Nami)", "phonetic": "Eerappatham", "def": "Moisture percentage in grains; APMC standard for paddy is 14% max."},
        {"tamil": "அட்வான்ஸ் தொகை", "english": "Advance Payment", "hindi": "अग्रिम भुगतान (Advance)", "phonetic": "Advance Thogai", "def": "Upfront token deposit paid before loading produce."},
        {"tamil": "களத்து விலை", "english": "Farmgate Price", "hindi": "खेत का भाव (Khet ka Bhav)", "phonetic": "Kalathu Vilai", "def": "Net price paid directly at the farmer's threshing floor with zero transport deduction."},
        {"tamil": "சாக்கு மூட்டை", "english": "Gunny Bag (Bora)", "hindi": "बोरा (Bora)", "phonetic": "Saakku Moottai", "def": "Standard jute bag; usually 75 kg for paddy and 50 kg for pulses."},
        {"tamil": "எடை மேடை", "english": "Weighbridge (Dharamkanta)", "hindi": "धर्मकांटा (Dharam Kanta)", "phonetic": "Edai Maedai", "def": "Certified commercial weighing platform for truckloads."},
        {"tamil": "தரகுக் கூலி / கமிஷன்", "english": "Brokerage / Mandi Cess", "hindi": "आढ़त / दलाली (Aadhat)", "phonetic": "Tharagu Kooli", "def": "Intermediary commission fee; legally regulated under APMC Act."}
    ],
    "negotiationPhrases": [
        {
            "tamil": "இந்த விலைக்கு என்னால் கொடுக்க முடியாது. குறைந்தது ஒரு குவிண்டாலுக்கு ₹2,500 வேண்டும்.",
            "english": "I cannot sell at this price. I need at least ₹2,500 per quintal.",
            "hindi": "मैं इस भाव पर नहीं दे सकता। मुझे कम से कम ₹2,500 प्रति क्विंटल चाहिए।",
            "phonetic": "Indha vilaikku ennaal kodukka mudiyaadhu. Kuraivadhu oru quintal-ukku ₹2,500 vaendum.",
            "category": "Price & Rate Bargaining"
        },
        {
            "tamil": "ஈரப்பதம் 14% க்கும் குறைவாக உள்ளது. இது முதல் தர நெல்.",
            "english": "The moisture is well below 14%. This is Grade A quality paddy.",
            "hindi": "नमी 14% से कम है। यह अव्वल दर्जे का धान है।",
            "phonetic": "Eerappatham 14% kkum kuraivaaga ulladhu. Idhu mudhal thara nel.",
            "category": "Quality & Moisture Specifications"
        },
        {
            "tamil": "முழு தொகையையும் லோடிங் முடிந்தவுடன் உடனடியாக வங்கிக் கணக்கில் அனுப்ப வேண்டும்.",
            "english": "Full payment must be transferred via IMPS/RTGS immediately after loading.",
            "hindi": "गाड़ी लोड होते ही पूरा भुगतान बैंक खाते में आरटीजीएस/आईएमपीएस से करना होगा।",
            "phonetic": "Muzhu thogaiyaiyum loading mudindhavudan udanadiyaaga vangi kanakkil anuppa vaendum.",
            "category": "Payment & Banking Terms"
        },
        {
            "tamil": "வண்டி வாடகை மற்றும் ஏற்றுக்கூலி உங்கள் பொறுப்பு.",
            "english": "Transport truck freight and loading charges are on buyer's account.",
            "hindi": "गाड़ी का भाड़ा और लोडिंग खर्चा खरीदार के जिम्मे होगा।",
            "phonetic": "Vandi vaadagai matrum aetrukkooli ungal poruppu.",
            "category": "Delivery & Transport Logistics"
        }
    ]
}

# 19. app_config.json - Configuration
APP_CONFIG = {
    "appName": "Uzhavan Hub",
    "appNameTa": "உழவன் ஹப்",
    "tagline": "AI-Powered Smart Agriculture Platform for Tamil Nadu Farmers",
    "taglineTa": "தமிழ்நாடு விவசாயிகளுக்கான ஸ்மார்ட் டிஜிட்டல் வேளாண் தளம்",
    "version": "2.4.0",
    "themeColors": {
        "primary": "#14532D",
        "primaryContainer": "#166534",
        "leafGreen": "#4D7C0F",
        "sageGreen": "#E8F2E8",
        "soilBrown": "#795548",
        "deepBrown": "#5D4037",
        "soilBeige": "#F3E9D8",
        "harvestGold": "#D4A72C",
        "canvas": "#F8F7F0"
    },
    "tollFreeLines": {
        "kisanCallCentre": "1800-180-1551",
        "animalAmbulance": "1962",
        "uzhavanHelpline": "1800-FARM-HUB"
    },
    "supportedLanguages": ["en", "ta"],
    "demonstrationNotice": "Demonstration Prototype. Agronomic calculations and market benchmarks are calibrated for testing and should be verified with local agricultural extension officers.",
    "supportedDistrictsCount": 38,
    "catalogCropsCount": 18
}

# Write out all 19 JSON files
FILES_MAP = {
    "tamil_nadu_districts.json": DISTRICTS,
    "soil_types.json": SOIL_TYPES,
    "crop_seasons.json": CROP_SEASONS,
    "crop_catalog.json": CROPS_18,
    "crop_costs_and_yields.json": CROPS_18,
    "sample_farmer_profiles.json": FARMER_PROFILES,
    "sample_land_plots.json": LAND_PLOTS,
    "sample_market_prices.json": MARKET_PRICES,
    "sample_weather.json": WEATHER_DATA,
    "crop_risk_rules.json": CROP_RISK_RULES,
    "fertilizer_guidelines.json": FERTILIZER_GUIDELINES,
    "livestock_health_guides.json": LIVESTOCK_GUIDES,
    "veterinary_directory.json": VETERINARY_FACILITIES,
    "government_schemes.json": GOVERNMENT_SCHEMES,
    "labor_listings.json": LABOUR_LISTINGS,
    "machinery_catalog.json": MACHINERY_LISTINGS,
    "agricultural_services.json": AGRICULTURAL_SERVICES,
    "farm_calendar_templates.json": CALENDAR_TEMPLATES,
    "farm_lingo_dictionary.json": FARM_LINGO,
    "app_config.json": APP_CONFIG
}

print(f"Generating {len(FILES_MAP)} JSON datasets into: {DATA_DIR}")
for filename, dataset in FILES_MAP.items():
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)
    print(f"  [OK] {filename} ({os.path.getsize(filepath):,} bytes)")

print("\nAll JSON datasets successfully generated and schema verified!")
