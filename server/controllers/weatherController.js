/**
 * Uzhavan Hub - Weather & Smart Alerts Controller (Module 11)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

function loadJSON(filename) {
  const fp = path.join(DATA_DIR, filename);
  if (fs.existsSync(fp)) return JSON.parse(fs.readFileSync(fp, 'utf-8'));
  return [];
}

export async function getWeather(req, res) {
  try {
    const weatherList = loadJSON('sample_weather.json');
    const districtQuery = req.query.district || req.user?.profile?.district || 'Thanjavur';

    let weather = weatherList.find(w => w.district.toLowerCase() === districtQuery.toLowerCase());
    if (!weather) {
      weather = {
        ...weatherList[0],
        district: districtQuery,
        activeAdvisories: [
          `Agro-meteorological advisory active for ${districtQuery}. Monitor soil moisture and check drainage.`,
          "Ensure irrigation scheduling accounts for current seasonal wind and evaporation rates."
        ]
      };
    }

    return res.json({
      success: true,
      dataSource: 'IMD & TNAU Agromet Advisory Service (Demonstration Benchmark)',
      timestamp: new Date().toISOString(),
      weather
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve weather advisories.' });
  }
}
