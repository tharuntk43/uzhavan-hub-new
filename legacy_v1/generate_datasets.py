# Uzhavan Hub - Dataset Generator
# Generates the 8 structured datasets in data/ adhering to all user specifications.

import os
import sys
import json

# Ensure UTF-8 output
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(DATA_DIR, exist_ok=True)

DISTRICTS = [
    "Coimbatore", "Tiruppur", "Erode", "Salem", "Namakkal",
    "Thanjavur", "Madurai", "Dindigul", "Trichy", "Karur",
    "Dharmapuri", "Krishnagiri", "Villupuram", "Cuddalore", "Tirunelveli"
]

CROP_SPECS = [
    {
        "id": "rice", "name": "Rice", "nameTa": "நெல்", "icon": "🌾", "category": "Cereals",
        "soilTypes": ["Alluvial Soil", "Clay Soil", "Clay Loam"],
        "seasons": ["Kuruvai (Monsoon)", "Samba (Monsoon)", "Navarai (Summer)"],
        "waterNeed": "High", "ph": "6.0 - 7.5", "n": "50 kg/acre", "p": "25 kg/acre", "k": "25 kg/acre",
        "rainfall": "1100 - 1250 mm", "temp": "22 - 32°C", "humidity": "75 - 85%",
        "fertilizer": "Urea 55kg + DAP 45kg + MOP 25kg + Zinc Sulfate 10kg/acre",
        "irrigation": "Submerged 2-5 cm during vegetative till panicle; saturated till maturity",
        "yield": 2600, "price": 24, "cost": 22000, "risk": "Low",
        "disease": "Blast and Sheath Blight - Seed treatment with Tricyclazole; avoid excess nitrogen.",
        "schedule": {
            "basal": "DAP 45kg + MOP 15kg + Zinc Sulfate 10kg",
            "vegetative": "Urea 25kg at active tillering (21 DAT)",
            "flowering": "Urea 15kg + MOP 10kg at panicle initiation",
            "maturity": "Drain field 10 days before harvest"
        }
    },
    {
        "id": "groundnut", "name": "Groundnut", "nameTa": "நிலக்கடலை", "icon": "🥜", "category": "Oilseeds",
        "soilTypes": ["Red Soil", "Sandy Loam", "Red Loam"],
        "seasons": ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid / Summer"],
        "waterNeed": "Moderate", "ph": "6.0 - 7.2", "n": "10 kg/acre", "p": "20 kg/acre", "k": "30 kg/acre",
        "rainfall": "500 - 650 mm", "temp": "25 - 32°C", "humidity": "60 - 75%",
        "fertilizer": "DAP 45kg + MOP 25kg + Gypsum 200kg/acre (100kg basal + 100kg pegging)",
        "irrigation": "Light irrigation at flowering & pegging; avoid water stagnation",
        "yield": 1850, "price": 74, "cost": 24000, "risk": "Low",
        "disease": "Tikka Leaf Spot - Spray Mancozeb 2g/L or Hexaconazole 1ml/L at first appearance.",
        "schedule": {
            "basal": "DAP 45kg + MOP 15kg + Gypsum 100kg + Trichoderma viride",
            "vegetative": "Weeding and soil loosening at 20-25 DAS",
            "flowering": "Gypsum 100kg top-dressing at 40-45 DAS (pegging) + earthing up",
            "maturity": "Irrigate lightly 2 days prior to pulling pods"
        }
    },
    {
        "id": "maize", "name": "Maize", "nameTa": "மக்காச்சோளம்", "icon": "🌽", "category": "Cereals",
        "soilTypes": ["Red Soil", "Black Soil", "Sandy Loam"],
        "seasons": ["Kharif (Monsoon)", "Rabi (Winter)"],
        "waterNeed": "Moderate", "ph": "6.5 - 7.8", "n": "60 kg/acre", "p": "25 kg/acre", "k": "20 kg/acre",
        "rainfall": "550 - 700 mm", "temp": "21 - 30°C", "humidity": "60 - 70%",
        "fertilizer": "NPK 20:20:0 60kg + Urea 40kg + MOP 20kg/acre",
        "irrigation": "Critical irrigations at knee-high, tasseling, and silking stages",
        "yield": 3200, "price": 22, "cost": 21000, "risk": "Medium",
        "disease": "Fall Armyworm (FAW) - Install pheromone traps; spray Chlorantraniliprole 0.4ml/L.",
        "schedule": {
            "basal": "DAP 50kg + MOP 15kg + Micronutrient mixture 5kg",
            "vegetative": "Urea 30kg at knee-high stage (25-30 DAS)",
            "flowering": "Urea 20kg at tasseling stage (45 DAS)",
            "maturity": "Allow cobs to dry on plant until husk yellows"
        }
    },
    {
        "id": "cotton", "name": "Cotton", "nameTa": "பருத்தி", "icon": "🧶", "category": "Commercial",
        "soilTypes": ["Black Soil", "Clay Loam", "Alluvial Soil"],
        "seasons": ["Kharif (Monsoon)", "Rabi (Winter)"],
        "waterNeed": "Moderate", "ph": "6.5 - 8.2", "n": "35 kg/acre", "p": "18 kg/acre", "k": "18 kg/acre",
        "rainfall": "600 - 800 mm", "temp": "24 - 34°C", "humidity": "55 - 70%",
        "fertilizer": "DAP 40kg + Urea 35kg + MOP 25kg + Borax foliar spray",
        "irrigation": "Ridge and furrow irrigation at squaring and boll development",
        "yield": 1150, "price": 80, "cost": 28000, "risk": "Medium",
        "disease": "Bollworms and Whitefly - Yellow sticky traps; spray Flonicamid or Spinosad.",
        "schedule": {
            "basal": "DAP 40kg + MOP 15kg + Farmyard Manure 5 tonnes",
            "vegetative": "Urea 20kg + earthing up at 35 DAS",
            "flowering": "Urea 15kg + MOP 10kg + 1% DAP spray at boll burst",
            "maturity": "Selective picking in morning hours"
        }
    },
    {
        "id": "sugarcane", "name": "Sugarcane", "nameTa": "கரும்பு", "icon": "🎋", "category": "Commercial",
        "soilTypes": ["Clay Loam", "Alluvial Soil", "Red Soil"],
        "seasons": ["Special Season (Main)", "Early Season"],
        "waterNeed": "High", "ph": "6.5 - 8.0", "n": "110 kg/acre", "p": "30 kg/acre", "k": "50 kg/acre",
        "rainfall": "1200 - 1500 mm", "temp": "26 - 35°C", "humidity": "70 - 85%",
        "fertilizer": "Urea 120kg + Single Super Phosphate 150kg + MOP 70kg split in 3 doses",
        "irrigation": "Furrow irrigation every 7-10 days depending on temperature",
        "yield": 45000, "price": 3.1, "cost": 55000, "risk": "Medium",
        "disease": "Red Rot - Use disease-free setts treated with Carbendazim 1g/L; trash mulching.",
        "schedule": {
            "basal": "SSP 150kg + MOP 25kg + Azospirillum",
            "vegetative": "Urea 40kg at 30 days and 40kg at 60 days",
            "flowering": "Urea 40kg + MOP 45kg at 90 days with partial earthing up",
            "maturity": "Withhold irrigation 15 days before mill cutting"
        }
    },
    {
        "id": "tomato", "name": "Tomato", "nameTa": "தக்காளி", "icon": "🍅", "category": "Vegetables",
        "soilTypes": ["Red Loam", "Sandy Loam", "Black Soil"],
        "seasons": ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid / Summer"],
        "waterNeed": "Moderate", "ph": "6.0 - 7.0", "n": "40 kg/acre", "p": "30 kg/acre", "k": "30 kg/acre",
        "rainfall": "450 - 600 mm", "temp": "19 - 28°C", "humidity": "60 - 75%",
        "fertilizer": "NPK 19:19:19 fertigation + Calcium Nitrate 15kg/acre",
        "irrigation": "Drip irrigation daily (2-3 hours) with mulch cover",
        "yield": 12000, "price": 22, "cost": 42000, "risk": "Medium",
        "disease": "Late Blight and Leaf Curl Virus - Vector control with Acetamiprid; Mancozeb 2g/L.",
        "schedule": {
            "basal": "Vermicompost 2 tons + DAP 35kg + MOP 20kg",
            "vegetative": "19:19:19 water soluble fertilizer 3kg/acre every week via drip",
            "flowering": "Calcium Nitrate 5kg + Boron 500g foliar spray to stop blossom end rot",
            "maturity": "Harvest fruits at breaker or pink stage for market shipment"
        }
    },
    {
        "id": "onion", "name": "Onion", "nameTa": "வெங்காயம்", "icon": "🧅", "category": "Vegetables",
        "soilTypes": ["Red Soil", "Sandy Loam", "Alluvial Soil"],
        "seasons": ["Rabi (Winter)", "Kharif (Monsoon)"],
        "waterNeed": "Moderate", "ph": "6.2 - 7.2", "n": "30 kg/acre", "p": "25 kg/acre", "k": "30 kg/acre",
        "rainfall": "400 - 550 mm", "temp": "18 - 28°C", "humidity": "50 - 65%",
        "fertilizer": "Urea 30kg + Single Super Phosphate 75kg + MOP 30kg + Sulfur 15kg",
        "irrigation": "Light frequent irrigation; avoid water stagnation around bulbs",
        "yield": 7500, "price": 32, "cost": 38000, "risk": "Medium",
        "disease": "Purple Blotch and Thrips - Blue sticky traps; spray Tebuconazole 1ml/L.",
        "schedule": {
            "basal": "SSP 75kg + MOP 20kg + Sulfur 15kg",
            "vegetative": "Urea 15kg top dressing at 30 DAT",
            "flowering": "Urea 15kg + MOP 10kg at bulb initiation (45 DAT)",
            "maturity": "Stop watering 10 days before pulling when 50% tops fall"
        }
    },
    {
        "id": "chilli", "name": "Chilli", "nameTa": "மிளகாய்", "icon": "🌶️", "category": "Vegetables",
        "soilTypes": ["Black Soil", "Red Loam", "Clay Loam"],
        "seasons": ["Kharif (Monsoon)", "Rabi (Winter)"],
        "waterNeed": "Moderate", "ph": "6.5 - 7.5", "n": "35 kg/acre", "p": "20 kg/acre", "k": "20 kg/acre",
        "rainfall": "500 - 650 mm", "temp": "20 - 32°C", "humidity": "55 - 70%",
        "fertilizer": "DAP 35kg + Urea 30kg + MOP 20kg + Neem cake 100kg",
        "irrigation": "Maintain optimum moisture; drought during flowering causes flower drop",
        "yield": 2400, "price": 140, "cost": 36000, "risk": "Medium",
        "disease": "Anthracnose (Die-back) and Mites - Spray Azoxystrobin 1ml/L and Fenazaquin.",
        "schedule": {
            "basal": "DAP 35kg + MOP 15kg + Neem cake 100kg",
            "vegetative": "Urea 15kg at 30 DAT after hoeing",
            "flowering": "Planofix 1ml/4.5L to prevent flower drop + Urea 15kg",
            "maturity": "Harvest red ripe fruits and sun dry on clean tarpaulins"
        }
    },
    {
        "id": "banana", "name": "Banana", "nameTa": "வாழை", "icon": "🍌", "category": "Horticulture",
        "soilTypes": ["Clay Loam", "Alluvial Soil", "Red Soil"],
        "seasons": ["All Year / Main Season"],
        "waterNeed": "High", "ph": "6.5 - 7.5", "n": "90 kg/acre", "p": "25 kg/acre", "k": "120 kg/acre",
        "rainfall": "1200 - 1800 mm", "temp": "25 - 35°C", "humidity": "75 - 85%",
        "fertilizer": "Urea 100kg + DAP 35kg + MOP 120kg per acre split in 5 applications",
        "irrigation": "Drip irrigation 15-20 litres/plant/day; avoid waterlogging",
        "yield": 25000, "price": 18, "cost": 65000, "risk": "Low",
        "disease": "Sigatoka Leaf Spot and Panama Wilt - Spray Propiconazole 1ml/L; sucker dip in Carbendazim.",
        "schedule": {
            "basal": "Well-rotted FYM 10kg/pit + DAP 50g/plant + Neem cake",
            "vegetative": "Urea 50g + MOP 50g/plant at 2nd, 3rd, and 4th months",
            "flowering": "Urea 50g + MOP 100g/plant at bunch emergence (7th month)",
            "maturity": "De-naveling after last hand formation; bunch sleeving with polybags"
        }
    },
    {
        "id": "coconut", "name": "Coconut", "nameTa": "தென்னை", "icon": "🥥", "category": "Plantation",
        "soilTypes": ["Sandy Loam", "Red Soil", "Alluvial Soil"],
        "seasons": ["Perennial / All Season"],
        "waterNeed": "Moderate", "ph": "5.5 - 7.5", "n": "40 kg/acre", "p": "25 kg/acre", "k": "80 kg/acre",
        "rainfall": "1000 - 1500 mm", "temp": "24 - 34°C", "humidity": "65 - 85%",
        "fertilizer": "Urea 60kg + Single Super Phosphate 80kg + MOP 90kg + Micronutrients per acre",
        "irrigation": "Drip or basin irrigation 40-50 litres/palm/day",
        "yield": 8500, "price": 14, "cost": 32000, "risk": "Low",
        "disease": "Rhinoceros Beetle and Root Wilt - Metarhizium anisopliae traps; basin green manuring.",
        "schedule": {
            "basal": "Coir pith compost 25kg/palm + green manure incorporation",
            "vegetative": "First split of NPK in June-July with onset of monsoon",
            "flowering": "Second split of NPK in Dec-Jan with Borax 50g/palm",
            "maturity": "Monthly harvesting of mature nuts at 11-12 months stage"
        }
    },
    {
        "id": "blackgram", "name": "Blackgram", "nameTa": "உளுந்து", "icon": "🌱", "category": "Pulses",
        "soilTypes": ["Black Soil", "Clay Loam", "Alluvial Soil"],
        "seasons": ["Rabi (Winter)", "Rice Fallow", "Kharif (Monsoon)"],
        "waterNeed": "Low", "ph": "6.5 - 7.8", "n": "8 kg/acre", "p": "16 kg/acre", "k": "8 kg/acre",
        "rainfall": "350 - 500 mm", "temp": "25 - 35°C", "humidity": "50 - 65%",
        "fertilizer": "DAP 25kg + Rhizobium seed treatment + 1% DAP foliar spray at flowering",
        "irrigation": "1-2 light irrigations at flowering and pod filling",
        "yield": 650, "price": 82, "cost": 12000, "risk": "Low",
        "disease": "Yellow Mosaic Virus (YMV) - Whitefly vector management; spray Imidacloprid 0.5ml/L.",
        "schedule": {
            "basal": "DAP 25kg/acre + Rhizobium bio-fertilizer seed inoculation",
            "vegetative": "Foliar spray of 2% DAP or TNAU Pulse Wonder at 25 DAS",
            "flowering": "Second spray of 2% DAP at 40 DAS to enhance pod setting",
            "maturity": "Harvest when 80% pods turn black"
        }
    },
    {
        "id": "greengram", "name": "Greengram", "nameTa": "பாசிப்பயறு", "icon": "🌿", "category": "Pulses",
        "soilTypes": ["Sandy Loam", "Red Soil", "Black Soil"],
        "seasons": ["Kharif (Monsoon)", "Rabi (Winter)", "Summer"],
        "waterNeed": "Low", "ph": "6.2 - 7.5", "n": "8 kg/acre", "p": "16 kg/acre", "k": "8 kg/acre",
        "rainfall": "350 - 450 mm", "temp": "25 - 35°C", "humidity": "50 - 65%",
        "fertilizer": "DAP 25kg + Phosphobacteria + Zinc Sulfate 5kg",
        "irrigation": "Drought tolerant; 1 irrigation at pre-flowering",
        "yield": 600, "price": 88, "cost": 11500, "risk": "Low",
        "disease": "Powdery Mildew - Spray Wettable Sulfur 2g/L at appearance of white patches.",
        "schedule": {
            "basal": "DAP 25kg + Gypsum 40kg + seed bio-priming",
            "vegetative": "Weeding at 15-20 DAS",
            "flowering": "1% DAP + 0.1% Boric acid spray at peak bloom",
            "maturity": "Selective picking of mature brown-black pods"
        }
    },
    {
        "id": "sesame", "name": "Sesame", "nameTa": "எள்", "icon": "🌾", "category": "Oilseeds",
        "soilTypes": ["Sandy Loam", "Red Soil", "Alluvial Soil"],
        "seasons": ["Zaid / Summer", "Kharif (Monsoon)"],
        "waterNeed": "Low", "ph": "5.5 - 7.5", "n": "15 kg/acre", "p": "10 kg/acre", "k": "10 kg/acre",
        "rainfall": "300 - 450 mm", "temp": "25 - 35°C", "humidity": "45 - 60%",
        "fertilizer": "Urea 15kg + Single Super Phosphate 40kg + MOP 10kg + Micronutrient",
        "irrigation": "1 irrigation at sowing, 1 at flowering, 1 at capsule formation",
        "yield": 450, "price": 125, "cost": 10500, "risk": "Low",
        "disease": "Phyllody (Mycoplasma) - Rouge infected plants; spray Dimethoate against leafhoppers.",
        "schedule": {
            "basal": "SSP 40kg + MOP 10kg + FYM 2 tons",
            "vegetative": "Urea 15kg top dressing at 25 DAS",
            "flowering": "Light moisture retention; avoid waterlogging",
            "maturity": "Harvest when lower capsules turn yellow and leaves shed"
        }
    },
    {
        "id": "sunflower", "name": "Sunflower", "nameTa": "சூரியகாந்தி", "icon": "🌻", "category": "Oilseeds",
        "soilTypes": ["Black Soil", "Red Loam", "Clay Loam"],
        "seasons": ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid / Summer"],
        "waterNeed": "Moderate", "ph": "6.5 - 8.0", "n": "25 kg/acre", "p": "20 kg/acre", "k": "15 kg/acre",
        "rainfall": "500 - 650 mm", "temp": "20 - 30°C", "humidity": "50 - 70%",
        "fertilizer": "NPK 20:20:0 50kg + Borax 4kg/acre (essential for capitulum seed filling)",
        "irrigation": "Irrigate at button stage, flowering, and seed development",
        "yield": 950, "price": 60, "cost": 16000, "risk": "Low",
        "disease": "Alternaria Leaf Blight and Head Rot - Spray Mancozeb 2g/L or Propiconazole 1ml/L.",
        "schedule": {
            "basal": "DAP 35kg + MOP 15kg + Borax 4kg",
            "vegetative": "Urea 20kg top dressing at 30 DAS",
            "flowering": "Foliar Boron 0.2% spray on back of head at ray floret opening",
            "maturity": "Harvest when rear of heads turn lemon yellow"
        }
    },
    {
        "id": "turmeric", "name": "Turmeric", "nameTa": "மஞ்சள்", "icon": "🟡", "category": "Spices",
        "soilTypes": ["Red Loam", "Clay Loam", "Alluvial Soil"],
        "seasons": ["Kharif (Monsoon / June-July planting)"],
        "waterNeed": "High", "ph": "6.0 - 7.5", "n": "60 kg/acre", "p": "30 kg/acre", "k": "60 kg/acre",
        "rainfall": "1200 - 1600 mm", "temp": "22 - 32°C", "humidity": "70 - 85%",
        "fertilizer": "DAP 50kg + MOP 50kg + Urea 60kg + Neem cake 150kg + Micronutrient spray",
        "irrigation": "Ridge and furrow irrigation every 5-7 days; mulch heavily with green leaves",
        "yield": 11000, "price": 85, "cost": 62000, "risk": "Medium",
        "disease": "Rhizome Rot and Leaf Spot - Trichoderma drenching; spray Mancozeb + Metalaxyl.",
        "schedule": {
            "basal": "Neem cake 150kg + DAP 50kg + MOP 25kg + leaf mulch 5 tons",
            "vegetative": "Urea 30kg + MOP 20kg at 60 DAS with first earthing up",
            "flowering": "Urea 30kg + MOP 25kg at 105 DAS with second earthing up",
            "maturity": "Stop watering 15 days before digging when leaves dry completely"
        }
    },
    {
        "id": "tapioca", "name": "Tapioca", "nameTa": "மரவள்ளிக்கிழங்கு", "icon": "🥔", "category": "Tubers",
        "soilTypes": ["Red Loam", "Sandy Soil", "Laterite Soil"],
        "seasons": ["Kharif (Monsoon)", "Zaid / Summer"],
        "waterNeed": "Moderate", "ph": "5.5 - 7.0", "n": "35 kg/acre", "p": "25 kg/acre", "k": "45 kg/acre",
        "rainfall": "800 - 1100 mm", "temp": "25 - 35°C", "humidity": "60 - 75%",
        "fertilizer": "DAP 40kg + MOP 45kg + Urea 35kg + Micronutrients",
        "irrigation": "Every 10-14 days; tolerant to intermittent drought",
        "yield": 14000, "price": 9, "cost": 29000, "risk": "Low",
        "disease": "Cassava Mosaic Disease (CMD) - Use tissue cultured disease-free setts; control whiteflies.",
        "schedule": {
            "basal": "FYM 5 tons + DAP 40kg + MOP 20kg",
            "vegetative": "Urea 20kg + MOP 15kg at 60 DAP with earthing up",
            "flowering": "Urea 15kg + MOP 15kg at 90 DAP (tuber enlargement)",
            "maturity": "Harvest tubers at 8-10 months stage"
        }
    },
    {
        "id": "ragi", "name": "Ragi", "nameTa": "கேழ்வரகு", "icon": "🥣", "category": "Millets",
        "soilTypes": ["Red Loam", "Sandy Loam", "Laterite Soil"],
        "seasons": ["Kharif (Monsoon)", "Rabi (Winter)", "Summer"],
        "waterNeed": "Low", "ph": "5.5 - 7.5", "n": "20 kg/acre", "p": "15 kg/acre", "k": "10 kg/acre",
        "rainfall": "450 - 650 mm", "temp": "20 - 32°C", "humidity": "50 - 70%",
        "fertilizer": "DAP 25kg + Urea 20kg + MOP 10kg + Azospirillum seed treatment",
        "irrigation": "2-3 protective irrigations at tillering and flowering",
        "yield": 1400, "price": 38, "cost": 13000, "risk": "Low",
        "disease": "Blast (Finger / Neck blast) - Seed treatment with Carbendazim 2g/kg; spray Tricyclazole.",
        "schedule": {
            "basal": "DAP 25kg + MOP 10kg + Azospirillum 2kg",
            "vegetative": "Urea 20kg top dressing at 20-25 DAT",
            "flowering": "Ensure soil moisture during earhead emergence",
            "maturity": "Harvest when earheads turn yellowish brown"
        }
    },
    {
        "id": "pearl_millet", "name": "Pearl Millet", "nameTa": "கம்பு", "icon": "🌾", "category": "Millets",
        "soilTypes": ["Sandy Loam", "Red Soil", "Black Soil"],
        "seasons": ["Kharif (Monsoon)", "Summer"],
        "waterNeed": "Low", "ph": "6.0 - 8.0", "n": "25 kg/acre", "p": "15 kg/acre", "k": "10 kg/acre",
        "rainfall": "350 - 550 mm", "temp": "25 - 38°C", "humidity": "40 - 60%",
        "fertilizer": "Urea 25kg + DAP 25kg + MOP 10kg + Zinc Sulfate 5kg",
        "irrigation": "Extremely drought hardy; 1-2 irrigations at boot leaf & grain filling",
        "yield": 1250, "price": 28, "cost": 11000, "risk": "Low",
        "disease": "Downy Mildew (Green Ear) - Metalaxyl 2g/kg seed treatment; remove infected shoots.",
        "schedule": {
            "basal": "DAP 25kg + MOP 10kg + FYM 2 tons",
            "vegetative": "Urea 25kg top dressing at 30 DAS",
            "flowering": "Scout for ergot and green ear symptoms",
            "maturity": "Harvest when grains become hard and earheads turn brown"
        }
    }
]

def generate_crops():
    print("Generating crops.json...")
    records = []
    
    for crop in CROP_SPECS:
        for idx, district in enumerate(DISTRICTS):
            soil = crop["soilTypes"][idx % len(crop["soilTypes"])]
            season = crop["seasons"][idx % len(crop["seasons"])]
            
            yield_variation = 0.92 + (idx % 5) * 0.04
            cur_yield = int(crop["yield"] * yield_variation)
            price_variation = 0.95 + ((idx + 2) % 4) * 0.03
            cur_price = round(crop["price"] * price_variation, 1)
            revenue = int(cur_yield * cur_price)
            cost = int(crop["cost"] * (0.95 + (idx % 3) * 0.04))
            profit = revenue - cost
            
            rec_id = f"crop-{crop['id']}-{district.lower()}-{season.split(' ')[0].lower()}"
            
            rec = {
                "id": rec_id,
                "cropId": crop["id"],
                "cropName": crop["name"],
                "cropNameTa": crop["nameTa"],
                "icon": crop["icon"],
                "category": crop["category"],
                "district": district,
                "season": season,
                "soilType": soil,
                "soilPH": crop["ph"],
                "nitrogen": crop["n"],
                "phosphorus": crop["p"],
                "potassium": crop["k"],
                "rainfall": crop["rainfall"],
                "temperature": crop["temp"],
                "humidity": crop["humidity"],
                "recommendedFertilizer": crop["fertilizer"],
                "irrigationRequirement": crop["irrigation"],
                "expectedYield": f"{cur_yield:,} kg/acre",
                "yieldPerAcre": cur_yield,
                "marketPrice": cur_price,
                "estimatedRevenue": f"₹{revenue:,}",
                "estimatedCost": f"₹{cost:,}",
                "investmentPerAcre": cost,
                "netProfit": f"₹{profit:,}",
                "profitPerAcre": profit,
                "riskLevel": crop["risk"],
                "irrigationAdvice": f"In {district} agro-climatic zone: {crop['irrigation']}.",
                "fertilizerSchedule": crop["schedule"],
                "diseaseRiskPrevention": crop["disease"],
                "dataStatus": "Demo Data – For Prototype Testing"
            }
            records.append(rec)
            
    print(f"-> Generated {len(records)} crop records (Target >= 150).")
    with open(os.path.join(DATA_DIR, "crops.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

def generate_weather():
    print("Generating weather.json...")
    records = []
    conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rain", "Heavy Rain"]
    advisories = {
        "Sunny": "Ideal conditions for open air drying, weeding, and foliar spray application.",
        "Partly Cloudy": "Moderate evapotranspiration; continue scheduled irrigation and scouting.",
        "Cloudy": "High humidity favors fungal spore germination; hold nitrogen and check leaf undersides.",
        "Rain": "Adequate natural precipitation; turn off motor pumps and clear drainage channels.",
        "Heavy Rain": "Waterlogging alert! Open emergency field drainage trenches. Postpone all chemical spraying."
    }
    risks = {
        "Sunny": "Low",
        "Partly Cloudy": "Low",
        "Cloudy": "Moderate",
        "Rain": "Moderate",
        "Heavy Rain": "High"
    }

    dates = [
        ("2026-10-06", "Tuesday"),
        ("2026-10-07", "Wednesday"),
        ("2026-10-08", "Thursday"),
        ("2026-10-09", "Friday"),
        ("2026-10-10", "Saturday"),
        ("2026-10-11", "Sunday"),
        ("2026-10-12", "Monday")
    ]

    for d_idx, district in enumerate(DISTRICTS):
        for day_idx, (dt, day) in enumerate(dates):
            c_idx = (d_idx * 2 + day_idx) % len(conditions)
            cond = conditions[c_idx]
            
            temp_base = 30 + (d_idx % 4) - (2 if "Rain" in cond else 0)
            hum_base = 55 + (30 if "Rain" in cond else (10 if "Cloudy" in cond else 0))
            rain_mm = 0.0 if cond == "Sunny" else (2.4 if cond == "Partly Cloudy" else (8.5 if cond == "Cloudy" else (24.0 if cond == "Rain" else 62.0)))
            rain_prob = 10 if cond == "Sunny" else (30 if cond == "Partly Cloudy" else (55 if cond == "Cloudy" else (85 if cond == "Rain" else 95)))
            wind = 12 + (d_idx % 6) + (10 if "Heavy" in cond else 0)

            rec = {
                "id": f"w-{district.lower()}-{dt}",
                "district": district,
                "date": dt,
                "dayName": day,
                "temperature": temp_base,
                "tempRange": f"{temp_base - 5}°C - {temp_base + 3}°C",
                "humidity": hum_base,
                "rainfall": rain_mm,
                "windSpeed": wind,
                "weatherCondition": cond,
                "rainProbability": rain_prob,
                "farmingRisk": risks[cond],
                "advisory": f"{district} Agro-Advisory: {advisories[cond]}",
                "dataStatus": "Demo Data – For Prototype Testing"
            }
            records.append(rec)

    print(f"-> Generated {len(records)} weather records (Target >= 100).")
    with open(os.path.join(DATA_DIR, "weather.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

def generate_fertilizers():
    print("Generating fertilizers.json...")
    records = []
    
    fert_catalog = [
        {"name": "Urea", "nutrient": "Nitrogenous", "grade": "46% N", "dosage": "45-55 kg/acre", "purpose": "Rapid vegetative growth and vigorous tillering"},
        {"name": "DAP", "nutrient": "Phosphatic & Complex", "grade": "18:46:0", "dosage": "40-50 kg/acre", "purpose": "Strong seedling root establishment and early vigor"},
        {"name": "MOP", "nutrient": "Potassic", "grade": "0:0:60", "dosage": "25-35 kg/acre", "purpose": "Drought resilience, disease defense, and grain/kernel plumpness"},
        {"name": "NPK 10:26:26", "nutrient": "Complex NPK", "grade": "10:26:26 High PK", "dosage": "50 kg/acre", "purpose": "Balanced nutrition during flower bud initiation and pod development"},
        {"name": "NPK 19:19:19", "nutrient": "Complex NPK", "grade": "19:19:19 Water Soluble", "dosage": "5 kg/acre (Foliar)", "purpose": "Foliar nutrition booster during critical stress and growth transitions"},
        {"name": "Gypsum", "nutrient": "Secondary (Calcium & Sulfur)", "grade": "29% Ca + 18% S", "dosage": "100-200 kg/acre", "purpose": "Groundnut pod filling, kernel development, and soil alkalinity reduction"},
        {"name": "Neem Cake", "nutrient": "Organic Manure & Repellent", "grade": "Natural Nitrogen (3-5%)", "dosage": "100-150 kg/acre", "purpose": "Nematode suppression, soil microflora enhancement, and slow-release nitrogen"},
        {"name": "Vermicompost", "nutrient": "Organic Humus", "grade": "Rich in Humic Acid", "dosage": "1000 kg/acre", "purpose": "Improve soil water-holding capacity, porous tilth, and microbial health"}
    ]

    for crop in CROP_SPECS:
        for idx in range(7):
            d = DISTRICTS[(idx * 2) % len(DISTRICTS)]
            fert = fert_catalog[idx % len(fert_catalog)]
            
            if crop["id"] == "groundnut" and idx % 2 == 0:
                fert = fert_catalog[5] # Gypsum
            
            rec = {
                "id": f"fert-{crop['id']}-{d.lower()}-{fert['name'].lower().replace(' ', '-')}-{idx}",
                "crop": crop["name"],
                "cropId": crop["id"],
                "district": d,
                "soilType": crop["soilTypes"][idx % len(crop["soilTypes"])],
                "soilN": "Medium" if idx % 2 == 0 else "Low",
                "soilP": "Medium",
                "soilK": "High" if idx % 3 == 0 else "Medium",
                "soilPH": crop["ph"],
                "recommendedFertilizer": fert["name"],
                "nutrientType": fert["nutrient"],
                "fertilizerGrade": fert["grade"],
                "suggestedDosage": fert["dosage"],
                "applicationMethod": "Foliar Spray" if "Foliar" in fert["dosage"] else "Basal Soil Incorporation" if "DAP" in fert["name"] else "Top Dressing",
                "timing": "Pegging Stage (40-45 DAS)" if (crop["id"] == "groundnut" and fert["name"] == "Gypsum") else "At Sowing" if "Basal" in fert["purpose"] else "Vegetative Stage (25-30 DAS)",
                "purpose": f"{fert['purpose']} tailored for {crop['name']} in {d} district.",
                "dataStatus": "Demo Data – For Prototype Testing"
            }
            records.append(rec)

    print(f"-> Generated {len(records)} fertilizer records (Target >= 100).")
    with open(os.path.join(DATA_DIR, "fertilizers.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

def generate_market_prices():
    print("Generating marketPrices.json...")
    records = []
    
    mandis = [
        "Regulated Market Committee", "APMC Wholesale Mandi", "Uzhavar Sandhai", "Central Agricultural Terminal"
    ]

    for crop in CROP_SPECS:
        for idx in range(7):
            d = DISTRICTS[(idx * 2) % len(DISTRICTS)]
            mandi_name = f"{d} {mandis[idx % len(mandis)]}"
            
            base_kg = crop["price"]
            min_kg = round(base_kg * 0.92, 1)
            max_kg = round(base_kg * 1.10, 1)
            modal_kg = base_kg
            
            unit = "₹/Quintal"
            min_p = int(min_kg * 100)
            max_p = int(max_kg * 100)
            modal_p = int(modal_kg * 100)
            
            if crop["id"] == "banana":
                unit = "₹/Bunch"
                min_p, max_p, modal_p = 280, 420, 350
            elif crop["id"] == "coconut":
                unit = "₹/1000 Nuts"
                min_p, max_p, modal_p = 12000, 16000, 14000

            trends = ["up", "stable", "down"]
            trend = trends[idx % 3]

            rec = {
                "id": f"mkt-{crop['id']}-{d.lower()}-{idx}",
                "district": d,
                "crop": crop["name"],
                "cropId": crop["id"],
                "marketName": mandi_name,
                "variety": f"{crop['name']} Super Grade",
                "minPrice": min_p,
                "maxPrice": max_p,
                "modalPrice": modal_p,
                "unit": unit,
                "trend": trend,
                "lastUpdated": "2026-10-05",
                "dataStatus": "Demo/Synthetic Market Data",
                "disclaimer": "Demo/Synthetic Market Data - Do not use as live market prices"
            }
            records.append(rec)

    print(f"-> Generated {len(records)} market price records (Target >= 100).")
    with open(os.path.join(DATA_DIR, "marketPrices.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

def generate_rentals():
    print("Generating rentals.json...")
    records = []
    
    human_categories = [
        "Farm Labour",
        "Harvesting Worker",
        "Ploughing Worker",
        "Pesticide Sprayer",
        "Transplanting Worker",
        "Irrigation Worker",
        "Tractor Operator",
        "Cattle Care Worker"
    ]

    human_categories_ta = {
        "Farm Labour": "பொது பண்ணை வேலை",
        "Harvesting Worker": "அறுவடை பணி",
        "Ploughing Worker": "உழவு பணி",
        "Pesticide Sprayer": "உரமிடுதல் & தெளிப்பு",
        "Transplanting Worker": "விதைப்பு & நடவு",
        "Irrigation Worker": "பாசன பணி",
        "Tractor Operator": "இயந்திர இயக்கம்",
        "Cattle Care Worker": "கால்நடை பராமரிப்பு"
    }

    # Map human categories to standard workTypes used in farmLabour.js
    category_to_worktypes = {
        "Farm Labour": ["General farm work", "Weeding", "Planting"],
        "Harvesting Worker": ["Harvesting", "General farm work"],
        "Ploughing Worker": ["General farm work", "Planting"],
        "Pesticide Sprayer": ["Fertilizer application", "General farm work"],
        "Transplanting Worker": ["Planting", "Weeding"],
        "Irrigation Worker": ["Irrigation work", "General farm work"],
        "Tractor Operator": ["General farm work", "Planting"],
        "Cattle Care Worker": ["Livestock care", "General farm work"]
    }

    human_names = [
        ("Ravi Kumar", "ரவி குமார்"),
        ("Murugan S", "முருகன் எஸ்"),
        ("Selvamurugan K", "செல்வமுருகன் கே"),
        ("Chinnasamy P", "சின்னசாமி பி"),
        ("Arumugam M", "ஆறுமுகம் எம்"),
        ("Karthik V", "கார்த்திக் வி"),
        ("Subramanian T", "சுப்பிரமணியன் டி"),
        ("Ganesan R", "கணேசன் ஆர்"),
        ("Mani K", "மணி கே"),
        ("Dhanapal S", "தனபால் எஸ்"),
        ("Senthil Nathan", "செந்தில் நாதன்"),
        ("Velusamy N", "வேலுசாமி என்"),
        ("Sundaram G", "சுந்தரம் ஜி"),
        ("Boopathy M", "பூபதி எம்"),
        ("Thangavel R", "தங்கவேல் ஆர்"),
        ("Palanisamy K", "பழனிசாமி கே"),
        ("Venkatesh S", "வெங்கடேஷ் எஸ்"),
        ("Murugesan P", "முருகேசன் பி"),
        ("Muthuraj C", "முத்துராஜ் சி"),
        ("Rajendran A", "ராஜேந்திரன் ஏ")
    ]

    for i in range(50):
        cat = human_categories[i % len(human_categories)]
        cat_ta = human_categories_ta.get(cat, cat)
        name, name_ta = human_names[i % len(human_names)]
        dist = DISTRICTS[i % len(DISTRICTS)]
        rate = 550 + (i % 7) * 50
        exp_years = 4 + (i % 12)
        exp = f"{exp_years} years"
        is_avail = (i % 3 != 0)
        avail = "Available Today" if is_avail else "Available Tomorrow"
        avail_ta = "இன்றே கிடைக்கும்" if is_avail else "நாளை கிடைக்கும்"
        avail_status = "available" if is_avail else "busy"
        rating = round(4.5 + ((i % 5) * 0.1), 1)
        wtypes = category_to_worktypes.get(cat, ["General farm work", "Planting"])
        dist_km = round(1.8 + (i % 9) * 0.9, 1)

        rec = {
            "id": f"rent-h-{i+1}",
            "type": "Human",
            "category": cat,
            "name": name,
            "nameTa": name_ta,
            "avatar": "👨‍🌾" if i % 2 == 0 else "👩‍🌾",
            "providerName": f"{name} (Self-Employed Labourer)",
            "district": dist,
            "location": f"{dist} Rural, Tamil Nadu",
            "distanceKm": dist_km,
            "workType": cat,
            "primaryWork": cat,
            "primaryWorkTa": cat_ta,
            "specialization": cat,
            "allWorkTypes": wtypes,
            "workTypes": wtypes,
            "experience": exp,
            "experienceYears": exp_years,
            "rate": rate,
            "dailyWage": rate,
            "rateUnit": "/day",
            "rateFormatted": f"₹{rate} / day",
            "availability": avail,
            "availabilityTa": avail_ta,
            "availableStatus": avail_status,
            "contact": f"+91 94431 {10000 + i * 37}",
            "phone": f"+91 94431 {10000 + i * 37}",
            "rating": rating,
            "reviewsCount": 16 + (i % 25),
            "completedJobs": 24 + (i % 35),
            "verified": (i % 2 == 0),
            "dataStatus": "Demo Data – For Prototype Testing"
        }
        records.append(rec)

    machine_categories = [
        "Tractor",
        "Power Tiller",
        "Rotavator",
        "Seed Drill",
        "Cultivator",
        "Harvester",
        "Sprayer Machine",
        "Water Pump",
        "Thresher",
        "Drone Sprayer"
    ]

    machine_icons = {
        "Tractor": "🚜",
        "Power Tiller": "🚜",
        "Rotavator": "🚜",
        "Seed Drill": "🌱",
        "Cultivator": "🌱",
        "Harvester": "🌾",
        "Sprayer Machine": "🧪",
        "Water Pump": "💧",
        "Thresher": "🌾",
        "Drone Sprayer": "🛸"
    }

    machine_models = {
        "Tractor": [("John Deere 5050D (50 HP)", "ஜான் டீர் 5050D டிராக்டர்"), ("Mahindra 575 DI (45 HP)", "மஹிந்திரா 575 DI"), ("Sonalika DI 745 III (50 HP)", "சோனாலிகா DI 745")],
        "Power Tiller": [("VST Shakti 130 DI (13 HP)", "விஎஸ்டி சக்தி பவர் டில்லர்"), ("Kirloskar Mega T (15 HP)", "கிர்லோஸ்கர் மெகா டி")],
        "Rotavator": [("Shaktiman Regular Light (6 Feet)", "சக்திமான் ரோட்டவேட்டர்"), ("Fieldking Robust Rotavator", "பீல்ட்கிங் ரோட்டவேட்டர்")],
        "Seed Drill": [("National Pneumatic 9-Row Seed Drill", "நேஷனல் 9-வரிசை விதைக்கருவி"), ("Dasmesh Multi-Crop Seed Drill", "தஸ்மேஷ் விதைக்கருவி")],
        "Cultivator": [("9-Tyne Heavy Duty Spring Cultivator", "9-கலப்பை ஸ்பிரிங் கல்டிவேட்டர்"), ("Fieldking 11-Tyne Cultivator", "11-கலப்பை கல்டிவேட்டர்")],
        "Harvester": [("Kubota DC-68G Combine Harvester", "குபோடா ஒருங்கிணைந்த அறுவடை இயந்திரம்"), ("Preet 987 Self Propelled Harvester", "பிரீத் 987 ஹார்வெஸ்டர்")],
        "Sprayer Machine": [("Stihl SR 420 Power Knapsack Sprayer", "ஸ்டில் SR 420 பவர் ஸ்ப்ரேயர்"), ("Neptune HTP High Pressure Sprayer", "நெப்டியூன் உயர் அழுத்த தெளிப்பான்")],
        "Water Pump": [("Kirloskar 5HP Portable Diesel Pump", "கிர்லோஸ்கர் 5HP டீசல் பம்பு"), ("Greaves Cotton 7.5HP Farm Pump", "கிரீவ்ஸ் காட்டன் 7.5HP பம்பு")],
        "Thresher": [("Punia Multi-Crop Paddy & Grain Thresher", "புனியா தானிய கதிரடிக்கும் கருவி"), ("Bharat Standard Groundnut Thresher", "பாரத் கடலை பிரிக்கும் கருவி")],
        "Drone Sprayer": [("Marut Drones 10L AG-360", "மாருத் ட்ரோன் தெளிப்பான்"), ("Garuda Aerospace Kisan Drone 16L", "கருடா ஏரோஸ்பேஸ் கிசான் ட்ரோன்")]
    }

    rates_info = {
        "Tractor": (850, 1100, "/hour"),
        "Power Tiller": (450, 600, "/hour"),
        "Rotavator": (900, 1200, "/hour"),
        "Seed Drill": (700, 950, "/acre"),
        "Cultivator": (750, 900, "/hour"),
        "Harvester": (2200, 2800, "/hour"),
        "Sprayer Machine": (350, 500, "/day"),
        "Water Pump": (400, 600, "/day"),
        "Thresher": (800, 1100, "/hour"),
        "Drone Sprayer": (450, 650, "/acre")
    }

    for j in range(50):
        cat = machine_categories[j % len(machine_categories)]
        models = machine_models[cat]
        model_name, model_name_ta = models[j % len(models)]
        dist = DISTRICTS[j % len(DISTRICTS)]
        min_r, max_r, runit = rates_info[cat]
        rate = min_r + (j % 4) * int((max_r - min_r) / 3 or 50)
        is_avail = (j % 3 != 1)
        avail = "Available Today" if is_avail else "Available Tomorrow"
        avail_ta = "இன்றே கிடைக்கும்" if is_avail else "நாளை கிடைக்கும்"
        avail_status = "available" if is_avail else "busy"
        rating = round(4.6 + ((j % 4) * 0.1), 1)
        dist_km = round(2.0 + (j % 9) * 1.1, 1)

        # Standardize daily and hourly pricing
        price_per_day = rate if runit == "/day" else (rate * 8)
        price_per_hour = rate if runit == "/hour" else max(150, round(rate / 8))

        rec = {
            "id": f"rent-m-{j+1}",
            "type": "Machine",
            "category": cat,
            "machineType": cat,
            "name": model_name,
            "nameTa": model_name_ta,
            "icon": machine_icons.get(cat, "🚜"),
            "provider": f"{dist} Agro Custom Hiring Centre (CHS)",
            "providerName": f"{dist} Agro Custom Hiring Centre (CHS)",
            "district": dist,
            "location": f"{dist} Agri Hub, Tamil Nadu",
            "distanceKm": dist_km,
            "experience": "2024 Model, Fully Serviced",
            "rate": rate,
            "rateUnit": runit,
            "rateFormatted": f"₹{rate} {runit}",
            "pricePerDay": price_per_day,
            "pricePerHour": price_per_hour,
            "availability": avail,
            "availabilityTa": avail_ta,
            "availableStatus": avail_status,
            "contact": f"+91 98422 {20000 + j * 43}",
            "phone": f"+91 98422 {20000 + j * 43}",
            "rating": rating,
            "reviewsCount": 22 + (j % 45),
            "completedJobs": 40 + (j % 60),
            "dataStatus": "Demo Data – For Prototype Testing"
        }
        records.append(rec)

    print(f"-> Generated {len(records)} rental records (Target >= 80).")
    with open(os.path.join(DATA_DIR, "rentals.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

def generate_veterinary():
    print("Generating veterinary.json...")
    records = []
    
    animals_pool = [
        ["Cow", "Calf"],
        ["Cow", "Buffalo", "Calf"],
        ["Goat", "Sheep"],
        ["Cow", "Buffalo", "Goat", "Sheep", "Calf"],
        ["Cow", "Calf", "Goat"]
    ]

    services_pool = ["General Check-up", "Vaccination", "Emergency", "Treatment"]

    for idx, dist in enumerate(DISTRICTS):
        centres = [
            f"Government Veterinary Polyclinic, {dist}",
            f"{dist} Taluk Veterinary Hospital",
            f"Sri Krishna Cattle & Dairy Health Centre, {dist}",
            f"{dist} Mobile Livestock Emergency Dispensary"
        ]

        for c_idx, c_name in enumerate(centres):
            serv = services_pool[c_idx % len(services_pool)]
            is_emer = (serv == "Emergency" or c_idx == 3)
            hrs = "24/7 Round the Clock" if is_emer else "8:00 AM - 5:30 PM"
            emer_avail = "24/7 On-Call & Mobile Ambulance" if is_emer else "Available during OPD hours"
            anim = animals_pool[(idx + c_idx) % len(animals_pool)]

            rec = {
                "id": f"vet-{dist.lower()}-{c_idx+1}",
                "centreName": c_name,
                "district": dist,
                "location": f"Main Road, {dist} Central",
                "animalsSupported": anim,
                "service": serv,
                "workingHours": hrs,
                "emergencyAvailability": emer_avail,
                "isEmergency": is_emer,
                "contact": "1962 (Toll-Free Livestock Emergency)" if is_emer else f"+91 422 {240000 + idx * 100 + c_idx}",
                "rating": round(4.6 + (c_idx % 4) * 0.1, 1),
                "dataStatus": "Demo location – verify before deployment",
                "disclaimer": "Prototype information – Verify with the local veterinary department. Do not rely on automated diagnosis."
            }
            records.append(rec)

    print(f"-> Generated {len(records)} veterinary records (Target >= 50).")
    with open(os.path.join(DATA_DIR, "veterinary.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

def generate_schemes():
    print("Generating schemes.json...")
    records = [
        {
            "id": "sch-pm-kisan",
            "schemeName": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
            "schemeNameTa": "பிரதம மந்திரி கிசான் சம்மான் நிதி",
            "category": "Farmer income support",
            "purpose": "Direct income support of ₹6,000 per year in 3 equal installments to cultivate farm inputs and manage operational expenses.",
            "authority": "Ministry of Agriculture & Farmers Welfare, GoI",
            "basicEligibility": "All landholding farmer families with cultivable land in their names. Excludes institutional landholders and high income taxpayers.",
            "financialBenefit": "₹6,000 / year (Direct Bank Transfer)",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://pmkisan.gov.in"
        },
        {
            "id": "sch-pmfby",
            "schemeName": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
            "schemeNameTa": "பிரதம மந்திரி பயிர் காப்பீட்டுத் திட்டம்",
            "category": "Crop insurance",
            "purpose": "Comprehensive insurance coverage against non-preventable natural risks from pre-sowing to post-harvest yield losses.",
            "authority": "Ministry of Agriculture & Farmers Welfare / Department of Agriculture TN",
            "basicEligibility": "All farmers growing notified crops in notified insurance units (both loanee and non-loanee farmers). Adangal and sowing certificate required.",
            "financialBenefit": "Max 1.5% - 2% farmer premium; 100% claim payout for assessed loss",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://pmfby.gov.in"
        },
        {
            "id": "sch-kcc",
            "schemeName": "Kisan Credit Card (KCC) Short-Term Agri Loan",
            "schemeNameTa": "கிசான் கிரெடிட் கார்டு கடன் திட்டம்",
            "category": "Agricultural loans",
            "purpose": "Timely short-term crop cultivation credit covering seeds, fertilizers, pesticides, labor wages, and post-harvest household expenses.",
            "authority": "NABARD / Commercial & Co-operative Banks",
            "basicEligibility": "Individual farmers, joint liability groups, tenant farmers, and sharecroppers with valid crop plan.",
            "financialBenefit": "Up to ₹3,00,000 at concessional 4% interest (with 3% prompt repayment incentive)",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://www.nabard.org"
        },
        {
            "id": "sch-pm-kusum",
            "schemeName": "PM-KUSUM (Solar Agricultural Pumps Scheme)",
            "schemeNameTa": "பி.எம்-குசும் சூரிய ஒளி பம்புசெட் திட்டம்",
            "category": "Solar/irrigation support",
            "purpose": "De-dieselization of farm pumps by installing grid-independent solar agricultural water pumps and solarizing grid-connected pumps.",
            "authority": "Ministry of New and Renewable Energy (MNRE) / TEDA Tamil Nadu",
            "basicEligibility": "Individual farmers, water user associations, and cooperatives with agricultural borewell/well connection.",
            "financialBenefit": "Up to 60% capital subsidy (30% Central + 30% State Gov); 30% bank loan",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://pmkusum.mnre.gov.in"
        },
        {
            "id": "sch-shc",
            "schemeName": "Soil Health Card Scheme",
            "schemeNameTa": "மண் வள அட்டை திட்டம்",
            "category": "Soil testing",
            "purpose": "Periodic scientific testing of 12 macro and micronutrients in farm soil to prescribe precise, balanced chemical and bio-fertilizer dosages.",
            "authority": "Department of Agriculture, Tamil Nadu",
            "basicEligibility": "All agricultural landowners across all districts. Free soil sampling through local Assistant Agricultural Officers (AAO).",
            "financialBenefit": "100% Free soil lab testing and customized nutrient recommendation card",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://soilhealth.dac.gov.in"
        },
        {
            "id": "sch-aif",
            "schemeName": "Agriculture Infrastructure Fund (AIF)",
            "schemeNameTa": "வேளாண் உட்கட்டமைப்பு நிதி",
            "category": "Agricultural infrastructure finance",
            "purpose": "Medium-to-long term debt financing for post-harvest management infrastructure such as cold storages, pack-houses, sorting units, and drying yards.",
            "authority": "Department of Agriculture & Farmers Welfare, GoI / NABARD",
            "basicEligibility": "Farmers, FPOs, Agri-entrepreneurs, Startups, and Primary Agricultural Credit Societies (PACS).",
            "financialBenefit": "3% interest subvention per annum up to ₹2 Crores for a maximum period of 7 years",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://agriinfra.dac.gov.in"
        },
        {
            "id": "sch-tn-kalaignar",
            "schemeName": "Kalaignarin All Village Integrated Agriculture Development Programme",
            "schemeNameTa": "கலைஞரின் அனைத்து கிராம ஒருங்கிணைந்த வேளாண் வளர்ச்சித் திட்டம்",
            "category": "Farmer income support",
            "purpose": "Holistic village-level development: converting fallow lands into cultivable lands, desilting farm ponds, and distributing farm machinery kits.",
            "authority": "Agriculture and Farmers Welfare Department, Tamil Nadu",
            "basicEligibility": "Resident small and marginal farmers in notified village panchayats of Tamil Nadu.",
            "financialBenefit": "Subsidized farm input kits, solar driers, and community farm pond development",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://tnhorticulture.tn.gov.in"
        },
        {
            "id": "sch-micro-irrigation",
            "schemeName": "Per Drop More Crop (Micro Irrigation Scheme)",
            "schemeNameTa": "சொட்டு நீர் பாசன மானியத் திட்டம்",
            "category": "Solar/irrigation support",
            "purpose": "Subsidized installation of drip and sprinkler irrigation systems to maximize water use efficiency and fertilizer saving via fertigation.",
            "authority": "Tamil Nadu Horticulture & Plantation Crops Department",
            "basicEligibility": "Small/Marginal Farmers (100% subsidy in Tamil Nadu); Other farmers (75% subsidy). Land Patta & Chitta required.",
            "financialBenefit": "100% subsidy for Small & Marginal farmers; 75% for large farmers up to 5 hectares",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://tnhorticulture.tn.gov.in"
        },
        {
            "id": "sch-paramparagat-krishi",
            "schemeName": "Paramparagat Krishi Vikas Yojana (PKVY - Organic Farming)",
            "schemeNameTa": "பாரம்பரிய இயற்கை வேளாண்மை திட்டம்",
            "category": "Soil testing",
            "purpose": "Cluster-based promotion of certified organic farming, bio-fertilizer production, on-farm vermicomposting, and PGS certification.",
            "authority": "National Project on Organic Farming / State Agri Department",
            "basicEligibility": "Farmer groups / clusters of at least 20-50 farmers with contiguous land area.",
            "financialBenefit": "₹50,000 per hectare over 3 years for inputs and certification",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://pgsindia-ncof.gov.in"
        },
        {
            "id": "sch-sub-mission-mechanization",
            "schemeName": "Sub-Mission on Agricultural Mechanization (SMAM)",
            "schemeNameTa": "வேளாண் இயந்திரமயமாக்கல் திட்டம்",
            "category": "Agricultural infrastructure finance",
            "purpose": "Subsidy support for procurement of tractors, power tillers, rotavators, harvesters, and establishment of Custom Hiring Centres (CHC).",
            "authority": "Department of Agricultural Engineering, Tamil Nadu",
            "basicEligibility": "Small, marginal, SC/ST, and women farmers given 50% subsidy; others 40%.",
            "financialBenefit": "Up to 50% capital subsidy on tractor and farm implements",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://agrimachinery.nic.in"
        },
        {
            "id": "sch-tn-animal-husbandry",
            "schemeName": "Free Dairy Cattle / Goat Distribution Scheme",
            "schemeNameTa": "இலவச கறவை மாடுகள் & வெள்ளாடுகள் வழங்கும் திட்டம்",
            "category": "Agricultural loans",
            "purpose": "Livelihood enhancement for rural women and smallholder farmers through distribution of high-yielding milch cows and goat units.",
            "authority": "Animal Husbandry Department, Tamil Nadu",
            "basicEligibility": "Rural landless poor or marginal smallholders, prioritized for women-headed households.",
            "financialBenefit": "100% grant of 4 goats/sheep or 1 milch cow unit with insurance cover",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://ahd.tn.gov.in"
        },
        {
            "id": "sch-national-livestock-mission",
            "schemeName": "National Livestock Mission (NLM)",
            "schemeNameTa": "தேசிய கால்நடை வளர்ப்பு திட்டம்",
            "category": "Agricultural infrastructure finance",
            "purpose": "Capital subsidy for establishing commercial poultry, sheep/goat breeding farms, and fodder seed production units.",
            "authority": "Department of Animal Husbandry & Dairying, GoI",
            "basicEligibility": "Individual entrepreneurs, FPOs, and cooperative societies with verified livestock holding space.",
            "financialBenefit": "50% capital subsidy up to ₹50 Lakhs for goat/sheep breeding farms",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://nlm.udyamimitra.in"
        },
        {
            "id": "sch-tn-seed-subsidy",
            "schemeName": "Certified Seed Distribution with Subsidy",
            "schemeNameTa": "சான்று பெற்ற விதை மானியத் திட்டம்",
            "category": "Farmer income support",
            "purpose": "Supplying high-yielding varieties (HYV) and hybrid foundation seeds of paddy, pulses, millets, and oilseeds through Agricultural Extension Centres (AEC).",
            "authority": "Tamil Nadu Agricultural Department (AEC)",
            "basicEligibility": "All active farmers holding Uzhavan App registration and Patta/Chitta.",
            "financialBenefit": "50% subsidy on seed purchase cost at government seed depots",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://agritech.tnau.ac.in"
        },
        {
            "id": "sch-crop-residue-management",
            "schemeName": "Crop Residue Management & Mulching Support",
            "schemeNameTa": "பயிர் கழிவு மேலாண்மை மானியம்",
            "category": "Soil testing",
            "purpose": "Incentivizing in-situ incorporation of paddy straw, sugarcane trash, and stalks into the soil to prevent burning and rebuild organic carbon.",
            "authority": "Department of Agricultural Engineering, Tamil Nadu",
            "basicEligibility": "Paddy, sugarcane, and maize cultivators.",
            "financialBenefit": "50% subsidy on straw balers, mulchers, and shredders",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://agrimachinery.nic.in"
        },
        {
            "id": "sch-warehousing-receipt-loan",
            "schemeName": "Negotiable Warehouse Receipt (e-NWR) Pledge Loan",
            "schemeNameTa": "கிடங்கு ரசீது அடமானக் கடன் திட்டம்",
            "category": "Agricultural loans",
            "purpose": "Pledge financing against stored farm produce in accredited warehouses to prevent distress sale during market glut.",
            "authority": "Warehousing Development and Regulatory Authority (WDRA) / Commercial Banks",
            "basicEligibility": "Farmers depositing commodities in WDRA-registered godowns/warehouses.",
            "financialBenefit": "Up to 75% loan against produce value at concessional 7% interest for up to 6 months",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://wdra.gov.in"
        },
        {
            "id": "sch-horticulture-mission",
            "schemeName": "Mission for Integrated Development of Horticulture (MIDH)",
            "schemeNameTa": "ஒருங்கிணைந்த தோட்டக்கலை மேம்பாட்டுத் திட்டம்",
            "category": "Agricultural infrastructure finance",
            "purpose": "Establishment of polyhouses, shade net structures, plastic mulching, and high-density orchards for fruits and vegetables.",
            "authority": "Department of Horticulture & Plantation Crops, GoI / TN",
            "basicEligibility": "Farmers cultivating horticultural crops with suitable drip irrigation infrastructure.",
            "financialBenefit": "50% capital subsidy on polyhouse and shade net construction",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://midh.gov.in"
        },
        {
            "id": "sch-rainfed-area-development",
            "schemeName": "Rainfed Area Development (RAD)",
            "schemeNameTa": "மானாவாரி நில மேம்பாட்டு திட்டம்",
            "category": "Farmer income support",
            "purpose": "Promoting integrated farming systems (Crop + Cattle + Tree + Fishery) in dryland tracts to maximize climate resilience and family income.",
            "authority": "National Mission for Sustainable Agriculture (NMSA)",
            "basicEligibility": "Farmers in notified rainfed districts with rain-dependent lands.",
            "financialBenefit": "Up to ₹25,000 per hectare for integrated farming components",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://nmsa.dac.gov.in"
        },
        {
            "id": "sch-agri-clinic-agri-business",
            "schemeName": "Agri-Clinics and Agri-Business Centres (AC&ABC)",
            "schemeNameTa": "வேளாண் மருத்துவமனை & வேளாண் வணிக மையம்",
            "category": "Agricultural infrastructure finance",
            "purpose": "Financial backing for agriculture graduates and trained diploma holders to set up soil clinics, custom hiring centres, and veterinary clinics.",
            "authority": "MANAGE Hyderabad / NABARD",
            "basicEligibility": "Graduates in agriculture, veterinary, horticulture, and allied subjects.",
            "financialBenefit": "Composite subsidy up to 36% (44% for women & SC/ST) on loans up to ₹20 Lakhs",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://www.agriclinics.net"
        },
        {
            "id": "sch-tn-crop-diversification",
            "schemeName": "Crop Diversification Programme (CDP)",
            "schemeNameTa": "பயிர் மாற்று திட்டம்",
            "category": "Farmer income support",
            "purpose": "Incentivizing water-stressed paddy growers to switch to pulses, oilseeds (groundnut/sesame), and millets (ragi/kambu).",
            "authority": "Department of Agriculture, Tamil Nadu",
            "basicEligibility": "Farmers in water-scarce delta and southern districts ready to diversify.",
            "financialBenefit": "Demonstration grant of ₹5,000 per hectare for inputs and technology",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://agritech.tnau.ac.in"
        },
        {
            "id": "sch-tn-farm-pond",
            "schemeName": "Individual Farm Pond Construction Subsidy",
            "schemeNameTa": "தனிநபர் பண்ணைக் குட்டை மானியத் திட்டம்",
            "category": "Solar/irrigation support",
            "purpose": "Harvesting rainwater run-off by excavating farm ponds (30m x 30m x 1.5m) to recharge local ground water aquifers.",
            "authority": "Agricultural Engineering Department, Tamil Nadu",
            "basicEligibility": "Farmers having minimum 2 acres of land with suitable catchment slope.",
            "financialBenefit": "100% subsidy (up to ₹1,00,000) for small/marginal farmers",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://aed.tn.gov.in"
        },
        {
            "id": "sch-poultry-venture-capital",
            "schemeName": "Poultry Venture Capital Fund (PVCF)",
            "schemeNameTa": "நாட்டுக்கோழி பண்ணை மானிய திட்டம்",
            "category": "Agricultural loans",
            "purpose": "Subsidized institutional credit for establishing commercial layer farms, broiler breeding units, and desi poultry sheds.",
            "authority": "NABARD / Animal Husbandry Department",
            "basicEligibility": "Farmers and rural youth with basic training in poultry husbandry.",
            "financialBenefit": "Back-ended capital subsidy up to 25% (33.33% for SC/ST) on project cost",
            "verificationNote": "Information should be verified from the official government source before applying.",
            "officialSource": "https://www.nabard.org"
        }
    ]

    print(f"-> Generated {len(records)} schemes records (Target >= 20).")
    with open(os.path.join(DATA_DIR, "schemes.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

def generate_voice_faq():
    print("Generating voiceFaq.json...")
    records = [
        {
            "id": "faq-sandy-soil",
            "category": "Crop recommendation",
            "queryPatternsEn": ["Which crop is suitable for sandy soil?", "Best crop for sandy soil", "Can I grow groundnut in sandy soil?", "Sandy soil crops"],
            "queryPatternsTa": ["மணல் பாங்கான நிலத்திற்கு எந்த பயிர் ஏற்றது?", "மணல் மண்ணில் என்ன பயிரிடலாம்?", "மணல் நிலத்திற்கு உகந்த பயிர் எது?"],
            "answerEn": "For sandy loam and light red soils, Groundnut (நிலக்கடலை), Sesame (எள்), and Pearl Millet (கம்பு) are highly recommended due to excellent drainage and root penetration.",
            "answerTa": "மணல் மற்றும் செம்மண் நிலத்திற்கு நிலக்கடலை, எள் மற்றும் கம்பு மிகவும் ஏற்றவை. வடிகால் வசதி சிறப்பாக இருப்பதால் வேர் மற்றும் காய் வளர்ச்சி மிகச் சிறப்பாக இருக்கும்.",
            "actionUrl": "#decision-engine"
        },
        {
            "id": "faq-rent-tractor",
            "category": "Machine rental",
            "queryPatternsEn": ["I need a tractor. Where can I rent one?", "Where to rent tractor?", "Tractor rental nearby", "How much for tractor rental?"],
            "queryPatternsTa": ["டிராக்டர் வாடகைக்கு கிடைக்குமா?", "டிராக்டர் எங்கே வாடகைக்கு எடுப்பது?", "டிராக்டர் வாடகை கட்டணம் என்ன?"],
            "answerEn": "You can rent 45-50 HP tractors (John Deere, Mahindra) starting at ₹850 - ₹1,100 per hour with verified drivers in your district under the Machine Rental section.",
            "answerTa": "உழவன் ஹப் 'மெஷினரி வாடகை' பகுதியில் உங்கள் மாவட்டத்தில் 45-50 HP டிராக்டர்கள் மணி நேரத்திற்கு ₹850 முதல் ₹1,100 வரை உடனடியாக வாடகைக்கு முன்பதிவு செய்யலாம்.",
            "actionUrl": "#machinery-rental"
        },
        {
            "id": "faq-harvesting-workers",
            "category": "Human rental",
            "queryPatternsEn": ["I need workers for harvesting", "Find farm labourers", "Harvesting workers booking", "Need labourers for harvest"],
            "queryPatternsTa": ["அறுவடைக்கு ஆட்கள் வேண்டும்", "விவசாய கூலி ஆட்கள் கிடைப்பார்களா?", "அறுவடை வேலைக்கு ஆட்கள் முன்பதிவு செய்வது எப்படி?"],
            "answerEn": "Skilled harvesting workers and labour teams are available starting at ₹600 - ₹800/day. Visit the Farm Labour section to book workers near your village.",
            "answerTa": "அறுவடைக்கு அனுபவமிக்க விவசாய கூலி ஆட்கள் நாள் ஒன்றுக்கு ₹600 முதல் ₹800 வரை கிடைக்கின்றனர். 'பண்ணை தொழிலாளர்கள்' பிரிவில் உங்கள் ஊருக்கு அருகில் உள்ளோரை உடனடியாக புக் செய்யலாம்.",
            "actionUrl": "#farm-labour"
        },
        {
            "id": "faq-market-price",
            "category": "Market prices",
            "queryPatternsEn": ["Where can I check today's market price?", "Check mandi prices", "Today groundnut market price", "Rice mandi rate today"],
            "queryPatternsTa": ["இன்றைய சந்தை விலையை எங்கே பார்க்கலாம்?", "மண்டி விலை நிலவரம் என்ன?", "நிலக்கடலை இன்றைய சந்தை விலை என்ன?"],
            "answerEn": "You can track demo modal prices, price trends, and nearby mandi rates across 18 crops in the Market Intelligence section of Uzhavan Hub.",
            "answerTa": "உழவன் ஹப் 'சந்தை விலை' பிரிவில் தமிழகத்தின் 15 மாவட்ட ஒழுங்குமுறை விற்பனைக்கூடங்களின் 18 பயிர்களுக்கான மாதிரி விலை நிலவரங்களை நீங்கள் பார்க்கலாம்.",
            "actionUrl": "#market-prices"
        },
        {
            "id": "faq-cow-sick",
            "category": "Veterinary services",
            "queryPatternsEn": ["My cow is sick. Where can I find a veterinary service?", "Cow is not eating", "Nearest veterinary hospital", "Emergency vet doctor"],
            "queryPatternsTa": ["என் மாட்டுக்கு உடம்பு சரியில்லை, கால்நடை மருத்துவர் எங்கே?", "மாடு தீவனம் சாப்பிடவில்லை என்ன செய்வது?", "அருகிலுள்ள கால்நடை மருத்துவமனை எங்குள்ளது?"],
            "answerEn": "For sick livestock, consult a qualified veterinarian immediately. Dial toll-free helpline 1962 or locate your nearest Veterinary Hospital in the Veterinary Care section.",
            "answerTa": "கால்நடைகளுக்கு உடல்நிலை சரியில்லாத போது சுய மருத்துவம் செய்யாமல் உடனடியாக கால்நடை மருத்துவரை அணுகவும். அவசர உதவிக்கு 1962-ஐ அழைக்கவும் அல்லது 'கால்நடை மருத்துவம்' பிரிவில் அருகிலுள்ள மருத்துவமனையை பார்க்கவும்.",
            "actionUrl": "#veterinary-care"
        },
        {
            "id": "faq-groundnut-fertilizer",
            "category": "Fertilizer",
            "queryPatternsEn": ["What fertilizer is suitable for groundnut?", "Fertilizer for groundnut", "When to apply gypsum for groundnut?", "Groundnut NPK dosage"],
            "queryPatternsTa": ["நிலக்கடலைக்கு எந்த உரம் ஏற்றது?", "நிலக்கடலை ஜிப்சம் எப்போது இட வேண்டும்?", "நிலக்கடலை உர அளவு என்ன?"],
            "answerEn": "For Groundnut, apply basal DAP 45kg + MOP 25kg per acre. Most importantly, top-dress Gypsum (100 kg/acre) at the pegging stage (40-45 DAS) for superior pod development.",
            "answerTa": "நிலக்கடலைக்கு அடி உரமாக டி.ஏ.பி 45 கிலோ + பொட்டாஷ் 25 கிலோ இடவும். காய் திரட்சிக்கு மிக முக்கியமாக விருது இறங்கும் 40-45 ஆம் நாளில் ஏக்கருக்கு 100 கிலோ ஜிப்சம் மேலுரமாக இட வேண்டும்.",
            "actionUrl": "#fertilizer-guidance"
        },
        {
            "id": "faq-rainfall-crop",
            "category": "Crop recommendation",
            "queryPatternsEn": ["Which crop is suitable for this rainfall?", "Low rainfall crop", "Drought tolerant crop", "Rainfed farming recommendations"],
            "queryPatternsTa": ["குறைந்த மழைப்பொழிவிற்கு எந்த பயிர் ஏற்றது?", "மானாவாரி நிலத்திற்கு சிறந்த பயிர் எது?", "மழை குறைவாக இருந்தால் என்ன பயிரிடலாம்?"],
            "answerEn": "For low to moderate rainfall (350-500 mm), Pearl Millet (கம்பு), Ragi (கேழ்வரகு), Blackgram (உளுந்து), and Sesame (எள்) are ideal drought-hardy choices.",
            "answerTa": "குறைந்த மழை உள்ள பகுதிகளுக்கு கம்பு, கேழ்வரகு, உளுந்து மற்றும் எள் ஆகியவை மிகவும் உகந்தவை. இவை குறைந்த நீரில் நல்ல மகசூலை தரக்கூடியவை.",
            "actionUrl": "#decision-engine"
        },
        {
            "id": "faq-agri-loan",
            "category": "Agricultural loans",
            "queryPatternsEn": ["What agricultural loan schemes are available?", "How to get crop loan?", "Kisan Credit Card loan details", "Low interest farming loan"],
            "queryPatternsTa": ["என்னென்ன விவசாய கடன் திட்டங்கள் உள்ளன?", "பயிர் கடன் பெறுவது எப்படி?", "கிசான் கிரெடிட் கார்டு கடன் விவரம் என்ன?"],
            "answerEn": "Farmers can avail short-term crop loans up to ₹3 Lakhs at 4% effective interest via the Kisan Credit Card (KCC) scheme. Explore details in our Agri Credit section.",
            "answerTa": "கிசான் கிரெடிட் கார்டு (KCC) மூலம் ஏக்கர் மற்றும் பயிரை பொறுத்து ரூ. 3 லட்சம் வரை 4% குறைந்த வட்டியில் குறுகிய கால பயிர்க்கடன் பெறலாம். முழு விவரங்களை 'விவசாயக் கடன்கள்' பிரிவில் காண்க.",
            "actionUrl": "#agri-loans"
        },
        {
            "id": "faq-cotton-pests",
            "category": "General farming",
            "queryPatternsEn": ["How to protect cotton from bollworm?", "Cotton pest control", "Whitefly control in cotton"],
            "queryPatternsTa": ["பருத்தியில் காய்ப்புழுவை கட்டுப்படுத்துவது எப்படி?", "பருத்தி பூச்சி மேலாண்மை", "பருத்தியில் வெள்ளை ஈ தாக்குதல்"],
            "answerEn": "Install pheromone traps (5/acre) for bollworm monitoring. Spray Neem oil (3%) or Flonicamid for whitefly. Avoid excessive nitrogen fertilizer.",
            "answerTa": "பருத்தி காய்ப்புழுவை கண்காணிக்க ஏக்கருக்கு 5 இனக்கவர்ச்சி பொறிகளை வைக்கவும். வெள்ளை ஈக்கு வேப்ப எண்ணெய் (3%) அல்லது புளோனிகாமிட் தெளிக்கவும்.",
            "actionUrl": "#crop-health"
        },
        {
            "id": "faq-rice-blast",
            "category": "General farming",
            "queryPatternsEn": ["How to treat blast disease in rice?", "Paddy blast symptoms", "Spindle shaped spots in paddy"],
            "queryPatternsTa": ["நெல்லில் குலை நோய் கட்டுப்பாடு எப்படி?", "நெல் குலை நோய் மருந்து", "நெல் இலையில் கண் வடிவ புள்ளிகள்"],
            "answerEn": "Treat paddy blast at first sign of spindle-shaped lesions by spraying Tricyclazole 75 WP (0.6g/L) or Azoxystrobin (1ml/L). Stop excess urea application.",
            "answerTa": "இலையில் கண் வடிவ புள்ளிகள் தோன்றினால் உடனே ட்ரைசைக்ளசோல் 75 WP (0.6 கிராம்/லிட்டர்) தெளிக்கவும். அதிகப்படியான யூரியா இடுவதை தவிர்க்கவும்.",
            "actionUrl": "#crop-health"
        },
        {
            "id": "faq-solar-pump-subsidy",
            "category": "Government schemes",
            "queryPatternsEn": ["How to get solar water pump subsidy?", "PM KUSUM solar pump subsidy", "Solar pump application Tamil Nadu"],
            "queryPatternsTa": ["சூரிய ஒளி பம்புசெட் மானியம் பெறுவது எப்படி?", "பிஎம் குசும் சோலார் பம்ப் விண்ணப்பிப்பது எப்படி?"],
            "answerEn": "Under PM-KUSUM Component-B, farmers can obtain up to 60% combined subsidy (30% Central + 30% State TEDA) for standalone solar agri pumps.",
            "answerTa": "பி.எம்-குசும் திட்டத்தின் கீழ் மத்திய-மாநில அரசுகளின் 60% மானியத்தில் 5HP முதல் 10HP வரையிலான சோலார் பம்புசெட்டுகளை TEDA மூலம் பெறலாம்.",
            "actionUrl": "#schemes"
        },
        {
            "id": "faq-soil-test-lab",
            "category": "Soil testing",
            "queryPatternsEn": ["Where can I test my farm soil?", "How to get soil health card?", "Soil testing cost in Tamil Nadu"],
            "queryPatternsTa": ["மண் பரிசோதனை எங்கு செய்வது?", "மண் வள அட்டை பெறுவது எப்படி?", "மண் பரிசோதனை கட்டணம் என்ன?"],
            "answerEn": "Soil testing is conducted free of charge at all District Agricultural Extension Centres (AEC) under the Soil Health Card Scheme.",
            "answerTa": "தமிழகத்தின் அனைத்து வட்டார வேளாண் விரிவாக்க மையங்களிலும் (AEC) மண் வள அட்டை திட்டத்தின் கீழ் கட்டணமின்றி மண் பரிசோதனை செய்து கொள்ளலாம்.",
            "actionUrl": "#schemes"
        },
        {
            "id": "faq-drone-sprayer",
            "category": "Machine rental",
            "queryPatternsEn": ["Can I rent an agricultural drone?", "Drone sprayer cost per acre", "How does drone spraying work?"],
            "queryPatternsTa": ["மருந்து தெளிக்கும் ட்ரோன் வாடகைக்கு கிடைக்குமா?", "ட்ரோன் தெளிப்புக்கு ஏக்கருக்கு என்ன கட்டணம்?"],
            "answerEn": "Yes! Agricultural spraying drones (10L - 16L capacity) are available at ₹450 - ₹650 per acre. They complete 1 acre of foliar spraying in just 7 minutes.",
            "answerTa": "ஆம்! மருந்து தெளிக்கும் ட்ரோன்கள் ஏக்கருக்கு ₹450 முதல் ₹650 வரை வாடகைக்கு கிடைக்கின்றன. 7 நிமிடங்களில் ஒரு ஏக்கர் முழுவதையும் சீராக தெளித்துவிடும்.",
            "actionUrl": "#machinery-rental"
        },
        {
            "id": "faq-drip-subsidy",
            "category": "Government schemes",
            "queryPatternsEn": ["Is drip irrigation 100% free?", "How to get micro irrigation subsidy in TN?", "Drip subsidy eligibility"],
            "queryPatternsTa": ["சொட்டு நீர் பாசனம் 100% இலவசமா?", "சொட்டு நீர் பாசன மானியம் எப்படி பெறுவது?"],
            "answerEn": "In Tamil Nadu, Small and Marginal farmers receive 100% subsidy for drip irrigation systems through the Department of Horticulture under PMKSY.",
            "answerTa": "தமிழகத்தில் சிறு மற்றும் குறு விவசாயிகளுக்கு தோட்டக்கலைத் துறை மூலம் 100% முழு மானியத்திலும், இதர விவசாயிகளுக்கு 75% மானியத்திலும் சொட்டு நீர் பாசனம் வழங்கப்படுகிறது.",
            "actionUrl": "#schemes"
        },
        {
            "id": "faq-goat-farming-scheme",
            "category": "Veterinary services",
            "queryPatternsEn": ["Government scheme for goat farming", "Subsidy for goat farm", "Free sheep and goat scheme"],
            "queryPatternsTa": ["ஆடு வளர்ப்பு அரசு மானியம்", "வெள்ளாடு வளர்க்க கடன் கிடைக்குமா?"],
            "answerEn": "Under the National Livestock Mission (NLM), entrepreneurs receive a 50% capital subsidy (up to ₹50 Lakhs) for sheep/goat breeding farms.",
            "answerTa": "தேசிய கால்நடை வளர்ப்பு இயக்கத்தின் (NLM) கீழ் வெள்ளாடு/செம்மறி ஆடு இனப்பெருக்க பண்ணை அமைக்க 50% மானியம் (ரூ. 50 லட்சம் வரை) வழங்கப்படுகிறது.",
            "actionUrl": "#schemes"
        },
        {
            "id": "faq-harvesting-machine-rate",
            "category": "Machine rental",
            "queryPatternsEn": ["What is combine harvester hourly rate?", "Paddy harvesting machine rental cost"],
            "queryPatternsTa": ["நெல் அறுவடை இயந்திர வாடகை எவ்வளவு?", "ஹார்வெஸ்டர் ஒரு மணி நேர கட்டணம் என்ன?"],
            "answerEn": "Combine harvesters (Kubota, Preet) rent for ₹2,200 - ₹2,800 per hour depending on ground wetness and diesel rates.",
            "answerTa": "நெல் மற்றும் தானிய அறுவடை இயந்திரங்கள் நிலத்தின் ஈரப்பதம் மற்றும் டீசல் விலையை பொறுத்து மணிக்கு ₹2,200 முதல் ₹2,800 வரை வாடகைக்கு கிடைக்கின்றன.",
            "actionUrl": "#machinery-rental"
        },
        {
            "id": "faq-banana-sigatoka",
            "category": "General farming",
            "queryPatternsEn": ["How to treat Sigatoka leaf spot in banana?", "Banana leaves yellowing with brown spots"],
            "queryPatternsTa": ["வாழையில் சிகடோகா இலைப்புள்ளி நோய் மருந்து", "வாழை இலை காய்ந்து போனால் என்ன செய்வது?"],
            "answerEn": "Spray Propiconazole (1ml/L) along with mineral oil (10ml/L) on leaf undersides. Cut and burn severely affected leaves to prevent spread.",
            "answerTa": "புரோபிகோனசோல் (1 மி.லி/லிட்டர்) மருந்தை தாது எண்ணெயுடன் கலந்து இலையின் அடிப்பகுதியில் படும்படி தெளிக்கவும். காய்ந்த இலைகளை வெட்டி அப்புறப்படுத்தவும்.",
            "actionUrl": "#crop-health"
        },
        {
            "id": "faq-tomato-leaf-curl",
            "category": "General farming",
            "queryPatternsEn": ["Tomato leaf curl treatment", "Leaves curling upward in tomato plant"],
            "queryPatternsTa": ["தக்காளி இலை சுருட்டை நோய் கட்டுப்பாடு", "தக்காளி இலைகள் சுருண்டு போனால் என்ன செய்வது?"],
            "answerEn": "Tomato Leaf Curl is viral and transmitted by whiteflies. Install yellow sticky traps and spray Acetamiprid (0.5g/L) or Imidacloprid (0.5ml/L).",
            "answerTa": "இலை சுருட்டை நோய் வெள்ளை ஈக்கள் மூலம் பரவும் வைரஸ் நோய். மஞ்சள் ஒட்டும் பொறிகளை வைத்து, அசிட்டமிப்ரிட் பூச்சிக்கொல்லி தெளித்து வெள்ளை ஈக்களை கட்டுப்படுத்தவும்.",
            "actionUrl": "#crop-health"
        },
        {
            "id": "faq-vermicompost-preparation",
            "category": "Fertilizer",
            "queryPatternsEn": ["How to use vermicompost on farm?", "Vermicompost dosage per acre"],
            "queryPatternsTa": ["மண்புழு உரம் இடும் அளவு எவ்வளவு?", "மண்புழு உரத்தின் நன்மைகள்"],
            "answerEn": "Apply 1,000 - 2,000 kg/acre of vermicompost during final field plowing. It dramatically improves beneficial soil microbes and water holding capacity.",
            "answerTa": "கடைசி உழவின் போது ஏக்கருக்கு 1 முதல் 2 டன் மண்புழு உரம் இடவும். இது மண்ணின் ஈரப்பதம் தாங்கும் திறனையும் நுண்ணுயிர் பெருக்கத்தையும் அதிகரிக்கும்.",
            "actionUrl": "#fertilizer-guidance"
        },
        {
            "id": "faq-weather-alerts",
            "category": "Weather",
            "queryPatternsEn": ["Will it rain today in my district?", "Agro weather forecast", "Is heavy rain expected?"],
            "queryPatternsTa": ["இன்று என் மாவட்டத்தில் மழை வருமா?", "வானிலை முன்னறிவிப்பு என்ன?", "கனமழை எச்சரிக்கை உள்ளதா?"],
            "answerEn": "Check localized 7-day agro-weather forecasts, rain probabilities, and farming advisories for your district in our Weather module.",
            "answerTa": "உங்கள் மாவட்டத்திற்கான 7 நாள் வானிலை முன்னறிவிப்பு, மழை வாய்ப்பு மற்றும் விவசாய எச்சரிக்கைகளை எங்களின் 'வானிலை' பகுதியில் உடனுக்குடன் அறியலாம்.",
            "actionUrl": "#weather"
        },
        {
            "id": "faq-pmfby-claim",
            "category": "Government schemes",
            "queryPatternsEn": ["How to claim PMFBY crop insurance?", "Paddy insurance compensation process"],
            "queryPatternsTa": ["பயிர் காப்பீடு இழப்பீடு பெறுவது எப்படி?", "பயிர் நஷ்டஈடு விண்ணப்பிக்கும் முறை"],
            "answerEn": "Inform your local agricultural officer within 72 hours of localized calamity (hailstorm, flood). A joint crop assessment survey will process the claim.",
            "answerTa": "வெள்ளம் அல்லது இயற்கை பேரிடரால் பயிர் சேதமடைந்தால் 72 மணி நேரத்திற்குள் வட்டார வேளாண்மை அலுவலரிடம் தகவல் தெரிவித்து இழப்பீட்டு ஆய்வு கோர வேண்டும்.",
            "actionUrl": "#schemes"
        },
        {
            "id": "faq-mastitis-cow",
            "category": "Veterinary services",
            "queryPatternsEn": ["Cow udder is hard and swollen", "Mastitis in dairy cow symptoms", "Milk has blood clots"],
            "queryPatternsTa": ["மாட்டுக்கு மடி வீக்கம் வந்துள்ளது என்ன செய்வது?", "மடி வீக்க நோய் சிகிச்சை", "பாலில் ரத்தம் வருகிறது"],
            "answerEn": "This indicates Mastitis (மடி வீக்கம்). Milk the infected quarter completely, apply ice packs, and summon a qualified veterinarian immediately for intramammary antibiotics.",
            "answerTa": "இது தீவிர மடி வீக்க நோயின் அறிகுறி. பாதிக்கப்பட்ட காம்பில் உள்ள பாலை முழுமையாக கறந்து அப்புறப்படுத்திவிட்டு, தாமதிக்காமல் கால்நடை மருத்துவரை வரவழைக்கவும்.",
            "actionUrl": "#veterinary-care"
        },
        {
            "id": "faq-fmd-cattle",
            "category": "Veterinary services",
            "queryPatternsEn": ["Blisters on cow tongue and hooves", "Foot and mouth disease symptoms"],
            "queryPatternsTa": ["மாட்டின் வாயிலும் காலிலும் கொப்புளங்கள் உள்ளன", "கோமாரி நோய் அறிகுறிகள் மற்றும் சிகிச்சை"],
            "answerEn": "Symptoms indicate Foot & Mouth Disease (கோமாரி நோய்). Wash mouth with 1% potassium permanganate and hooves with 2% sodium carbonate. Isolate cattle and call vet.",
            "answerTa": "இது கோமாரி நோய் அறிகுறி. பொட்டாசியம் பெர்மாங்கனேட் கரைசலால் வாயைக் கழுவவும். பாதிக்கப்பட்ட மாடுகளை தனியாக பிரித்து வைத்து கால்நடை மருத்துவரிடம் அவசர சிகிச்சை பெறவும்.",
            "actionUrl": "#veterinary-care"
        },
        {
            "id": "faq-blackgram-rice-fallow",
            "category": "Crop recommendation",
            "queryPatternsEn": ["Can I sow blackgram in rice fallow?", "Paddy fallow pulses management in Delta"],
            "queryPatternsTa": ["நெல் தரிசில் உளுந்து விதைப்பது எப்படி?", "டெல்டா நெல் தரிசு பயிர்"],
            "answerEn": "Broadcast Blackgram (ADT 5 or VBN 8) 4-6 days before paddy harvest when soil is in waxy condition. Seeds use residual soil moisture without extra plowing.",
            "answerTa": "நெல் அறுவடைக்கு 4-6 நாட்களுக்கு முன் நிலம் மெழுகு பதத்தில் இருக்கும் போது ஏக்கருக்கு 10 கிலோ உளுந்து விதையை விதைக்கலாம். கூடுதல் உழவு இன்றி நல்ல லாபம் தரும்.",
            "actionUrl": "#decision-engine"
        },
        {
            "id": "faq-power-tiller-rent",
            "category": "Machine rental",
            "queryPatternsEn": ["Power tiller rental rate", "Where to hire power tiller for wetland plowing"],
            "queryPatternsTa": ["பவர் டில்லர் வாடகை எவ்வளவு?", "சேற்று உழவுக்கு பவர் டில்லர் கிடைக்குமா?"],
            "answerEn": "Power Tillers (VST Shakti 13 HP) are available at ₹450 - ₹600 per hour, perfect for wetland puddling and small plots.",
            "answerTa": "நெல் சேற்று உழவு மற்றும் சிறிய நிலங்களுக்கு ஏற்ற 13 HP பவர் டில்லர்கள் மணிக்கு ₹450 முதல் ₹600 வரை உழவன் ஹப் மூலம் வாடகைக்கு கிடைக்கின்றன.",
            "actionUrl": "#machinery-rental"
        },
        {
            "id": "faq-neem-cake-dosage",
            "category": "Fertilizer",
            "queryPatternsEn": ["Why use neem cake in soil?", "Neem cake fertilizer benefits"],
            "queryPatternsTa": ["வேப்பம் புண்ணாக்கு எதற்கு இட வேண்டும்?", "வேப்பம் புண்ணாக்கின் நன்மைகள்"],
            "answerEn": "Neem cake (100-150 kg/acre) inhibits nitrogen leaching by slowing nitrification and acts as a potent organic pesticide against soil grubs and nematodes.",
            "answerTa": "வேப்பம் புண்ணாக்கு (ஏக்கருக்கு 100-150 கிலோ) யூரியா தழைச்சத்து வீணாவதை தடுத்து, மண்ணில் உள்ள வேர்ப்புழு மற்றும் நூற்புழுக்களை இயற்கை முறையில் அழிக்கிறது.",
            "actionUrl": "#fertilizer-guidance"
        },
        {
            "id": "faq-turmeric-rot",
            "category": "General farming",
            "queryPatternsEn": ["How to prevent rhizome rot in turmeric?", "Turmeric pseudostem wilting"],
            "queryPatternsTa": ["மஞ்சளில் கிழங்கு அழுகல் நோய் தடுப்பது எப்படி?", "மஞ்சள் இலை மஞ்சள் நிறமாகி அழுகுதல்"],
            "answerEn": "Provide raised beds for proper drainage. Drench soil with Trichoderma viride or Metalaxyl-Mancozeb (2g/L) at base of plants upon first symptoms.",
            "answerTa": "மஞ்சள் நிலத்தில் தண்ணீர் தேங்காமல் வடிகால் வசதி அமைக்கவும். கிழங்கு அழுகல் தென்பட்டால் டிரைக்கோடெர்மா விரிடி அல்லது மெட்டலாக்சில் மருந்தை வேர்ப்பகுதியில் ஊற்றவும்.",
            "actionUrl": "#crop-health"
        },
        {
            "id": "faq-chilli-curl",
            "category": "General farming",
            "queryPatternsEn": ["Chilli leaves curling upwards or downwards", "Chilli thrips and mites control"],
            "queryPatternsTa": ["மிளகாய் இலை சுருட்டல் நோய் மருந்து", "மிளகாயில் இலைகள் கீழ்நோக்கி சுருண்டு போதல்"],
            "answerEn": "Upward curling indicates Thrips (spray Fipronil or Spinosad). Downward curling indicates Mites (spray Fenazaquin or Spiromesifen).",
            "answerTa": "இலைகள் மேல்நோக்கி சுருண்டால் இலைப்பேன் தாக்குதல் (ஸ்பினோசாட் மருந்து); கீழ்நோக்கி படகு போல சுருண்டால் சிலந்தி தாக்குதல் (பெனாசாகுவின் மருந்து தெளிக்கவும்).",
            "actionUrl": "#crop-health"
        },
        {
            "id": "faq-kisan-call-center",
            "category": "General farming",
            "queryPatternsEn": ["What is Kisan Call Center toll free number?", "Government agriculture helpline number"],
            "queryPatternsTa": ["விவசாய இலவச உதவி எண் என்ன?", "கிசான் கால் சென்டர் போன் நம்பர்"],
            "answerEn": "The national Kisan Call Center toll-free helpline number is 1800-180-1551 (available 6:00 AM to 10:00 PM in Tamil and English).",
            "answerTa": "அரசின் இலவச கிசான் கால் சென்டர் உதவி எண் 1800-180-1551 ஆகும். காலை 6 மணி முதல் இரவு 10 மணி வரை தமிழில் விவசாய ஆலோசனைகளை நேரடியாக பெறலாம்.",
            "actionUrl": "#voice-assistant"
        },
        {
            "id": "faq-transplanting-labour",
            "category": "Human rental",
            "queryPatternsEn": ["Hire paddy transplanting workers", "Female farm labour for transplanting"],
            "queryPatternsTa": ["நெல் நாற்று நடவுக்கு பெண்கள் ஆட்கள்", "நாற்று நடுவதற்கு கூலி ஆட்கள் முன்பதிவு"],
            "answerEn": "Experienced paddy transplanting groups can be booked under Human Rental starting at ₹550 - ₹650 per day.",
            "answerTa": "நெல் நாற்று நடுவதற்கு அனுபவமிக்க கூலி தொழிலாளர்கள் குழுக்களை நாள் ஒன்றுக்கு ₹550 முதல் ₹650 வரை மனித வாடகை பிரிவில் புக் செய்யலாம்.",
            "actionUrl": "#farm-labour"
        },
        {
            "id": "faq-irrigation-worker",
            "category": "Human rental",
            "queryPatternsEn": ["Need worker for field irrigation", "Night irrigation farm worker"],
            "queryPatternsTa": ["வயலுக்கு தண்ணீர் பாய்ச்ச ஆட்கள் வேண்டும்", "இரவு நேர பாசன வேலைக்கு ஆட்கள்"],
            "answerEn": "Reliable irrigation workers for ridge and furrow or basin water management are available starting at ₹600/shift under Human Rental.",
            "answerTa": "கால்வாய் மற்றும் போர்வெல் பாசனம் செய்ய நம்பகமான தொழிலாளர்கள் ஷிப்ட் ஒன்றுக்கு ₹600 முதல் வாடகை பிரிவில் கிடைக்கின்றனர்.",
            "actionUrl": "#farm-labour"
        },
        {
            "id": "faq-pest-spray-worker",
            "category": "Human rental",
            "queryPatternsEn": ["Need worker to spray pesticide", "Chemical sprayer operator hire"],
            "queryPatternsTa": ["பூச்சி மருந்து தெளிக்க ஆட்கள் வேண்டும்", "மருந்து தெளிக்கும் ஆட்கள் முன்பதிவு"],
            "answerEn": "Certified pesticide sprayer operators with protective equipment can be hired at ₹650 - ₹750/day in your taluk.",
            "answerTa": "பாதுகாப்பு கவசத்துடன் பூச்சி மருந்து தெளிக்க பயிற்சி பெற்ற தொழிலாளர்கள் நாள் ஒன்றுக்கு ₹650 முதல் ₹750 வரை வாடகைக்கு கிடைக்கின்றனர்.",
            "actionUrl": "#farm-labour"
        }
    ]

    print(f"-> Generated {len(records)} voice FAQ records (Target >= 30).")
    with open(os.path.join(DATA_DIR, "voiceFaq.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

def main():
    print("==================================================")
    print("Uzhavan Hub - Generating Rich Prototype Datasets")
    print("==================================================")
    generate_crops()
    generate_weather()
    generate_fertilizers()
    generate_market_prices()
    generate_rentals()
    generate_veterinary()
    generate_schemes()
    generate_voice_faq()
    print("==================================================")
    print("All 8 datasets generated successfully in data/ directory!")
    print("==================================================")

if __name__ == "__main__":
    main()
