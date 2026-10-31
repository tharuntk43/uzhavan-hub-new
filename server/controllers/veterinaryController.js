/**
 * Uzhavan Hub - Veterinary Care & Livestock Health Controller (Module 15)
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

export async function getVeterinaryData(req, res) {
  try {
    const facilities = loadJSON('veterinary_directory.json');
    const guides = loadJSON('livestock_health_guides.json');
    const { district } = req.query;

    let filteredFacilities = facilities;
    if (district) {
      filteredFacilities = filteredFacilities.filter(f => f.district.toLowerCase().includes(district.toLowerCase()));
    }

    return res.json({
      success: true,
      emergencyHotline: '1962',
      emergencyTitle: '24/7 Mobile Veterinary Ambulance & Disaster Relief (Dial 1962)',
      emergencyNotice: 'Toll-free emergency animal ambulance operated under Tamil Nadu Animal Husbandry Department.',
      disclaimer: 'Educational medical guide. Always consult a certified veterinary surgeon for medication prescriptions.',
      facilities: filteredFacilities,
      speciesGuides: guides
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve veterinary information.' });
  }
}
