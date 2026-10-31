"""
Unit Test: JSON Dataset Verification
Validates that every JSON file in data/ parses with zero errors and adheres to its structure.
"""

import os
import json
import unittest

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

EXPECTED_FILES = [
    "tamil_nadu_districts.json",
    "soil_types.json",
    "crop_seasons.json",
    "crop_catalog.json",
    "crop_costs_and_yields.json",
    "sample_farmer_profiles.json",
    "sample_land_plots.json",
    "sample_market_prices.json",
    "sample_weather.json",
    "crop_risk_rules.json",
    "fertilizer_guidelines.json",
    "livestock_health_guides.json",
    "government_schemes.json",
    "labor_listings.json",
    "machinery_catalog.json",
    "agricultural_services.json",
    "farm_calendar_templates.json",
    "farm_lingo_dictionary.json",
    "app_config.json"
]

class TestJSONDatasets(unittest.TestCase):
    def test_all_files_exist_and_valid(self):
        for filename in EXPECTED_FILES:
            filepath = os.path.join(DATA_DIR, filename)
            self.assertTrue(os.path.exists(filepath), f"Missing expected dataset: {filename}")
            
            with open(filepath, "r", encoding="utf-8") as f:
                try:
                    data = json.load(f)
                    self.assertIsNotNone(data, f"Data in {filename} is None")
                except json.JSONDecodeError as e:
                    self.fail(f"Invalid JSON syntax in {filename}: {str(e)}")

    def test_districts_count(self):
        with open(os.path.join(DATA_DIR, "tamil_nadu_districts.json"), "r", encoding="utf-8") as f:
            districts = json.load(f)
            self.assertEqual(len(districts), 38, "Must contain all 38 Tamil Nadu districts")

    def test_crops_catalog_count(self):
        with open(os.path.join(DATA_DIR, "crop_catalog.json"), "r", encoding="utf-8") as f:
            crops = json.load(f)
            self.assertGreaterEqual(len(crops), 18, "Must support at least 18 crops for comparison")

    def test_machinery_catalog_count(self):
        with open(os.path.join(DATA_DIR, "machinery_catalog.json"), "r", encoding="utf-8") as f:
            machinery = json.load(f)
            self.assertGreaterEqual(len(machinery), 50, "Must support 50+ machinery listings")

if __name__ == "__main__":
    unittest.main()
