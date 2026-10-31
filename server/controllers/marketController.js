/**
 * Uzhavan Hub - Mandi Market Prices & Proceeds Calculator (Module 12)
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

export async function getMarketPrices(req, res) {
  try {
    const prices = loadJSON('sample_market_prices.json');
    const { district, commodity } = req.query;

    let filtered = prices;
    if (district) {
      filtered = filtered.filter(p => p.district.toLowerCase().includes(district.toLowerCase()));
    }
    if (commodity) {
      filtered = filtered.filter(p => p.commodity.toLowerCase().includes(commodity.toLowerCase()));
    }

    return res.json({
      success: true,
      dataSource: 'Tamil Nadu Agri Marketing Board & APMC Regulated Markets',
      timestamp: new Date().toISOString(),
      commoditiesCount: filtered.length,
      prices: filtered
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load mandi price trends.' });
  }
}

export async function calculateProceeds(req, res) {
  try {
    const {
      cropId,
      quantityBags = 25,
      bagWeightKg = 75,
      distanceKm = 18,
      baseMandiPriceQtl = 2450
    } = req.body;

    const totalQuintals = (quantityBags * bagWeightKg) / 100.0;
    const grossValuation = totalQuintals * baseMandiPriceQtl;

    // 1. Mandi Yard
    // Deductions: Transport (₹35/Qtl), Mandi cess/commission (1.5%), Unloading & weighing (₹15/Qtl)
    const mandiTransport = totalQuintals * 35;
    const mandiCommission = grossValuation * 0.015;
    const mandiWeighing = totalQuintals * 15;
    const mandiTotalDeductions = mandiTransport + mandiCommission + mandiWeighing;
    const mandiNetProceeds = grossValuation - mandiTotalDeductions;

    // 2. Farmer Producer Organization (FPO Collective)
    // FPO premium (+₹60/Qtl over APMC), Bulk transport shared (₹15/Qtl), Zero commission, FPO service charge (0.5%)
    const fpoGross = totalQuintals * (baseMandiPriceQtl + 60);
    const fpoTransport = totalQuintals * 15;
    const fpoFee = fpoGross * 0.005;
    const fpoTotalDeductions = fpoTransport + fpoFee;
    const fpoNetProceeds = fpoGross - fpoTotalDeductions;

    // 3. Direct Farmgate Sale
    // Farmgate discount (-₹90/Qtl under APMC), Zero transport, Zero commission, Zero loading deductions!
    const farmgateGross = totalQuintals * (baseMandiPriceQtl - 90);
    const farmgateTotalDeductions = 0;
    const farmgateNetProceeds = farmgateGross;

    const channels = [
      {
        channel: 'Farmer Producer Org (FPO)',
        tag: 'Highest Net Realization',
        recommended: true,
        grossAmount: Math.round(fpoGross),
        deductions: Math.round(fpoTotalDeductions),
        netProceeds: Math.round(fpoNetProceeds),
        netPerQuintal: Math.round(fpoNetProceeds / totalQuintals),
        breakdown: [
          { item: 'Bulk Collective Transport', cost: Math.round(fpoTransport) },
          { item: 'FPO Admin Fee (0.5%)', cost: Math.round(fpoFee) },
          { item: 'APMC Market Cess', cost: 0 }
        ]
      },
      {
        channel: 'Regulated Mandi Yard',
        tag: 'Spot Cash Liquidity',
        recommended: false,
        grossAmount: Math.round(grossValuation),
        deductions: Math.round(mandiTotalDeductions),
        netProceeds: Math.round(mandiNetProceeds),
        netPerQuintal: Math.round(mandiNetProceeds / totalQuintals),
        breakdown: [
          { item: 'Freight Transport to Mandi', cost: Math.round(mandiTransport) },
          { item: 'Commission & Cess (1.5%)', cost: Math.round(mandiCommission) },
          { item: 'Unloading & Weighing fee', cost: Math.round(mandiWeighing) }
        ]
      },
      {
        channel: 'Direct Farmgate Sale',
        tag: 'Zero Logistics / Instant Pickup',
        recommended: false,
        grossAmount: Math.round(farmgateGross),
        deductions: 0,
        netProceeds: Math.round(farmgateNetProceeds),
        netPerQuintal: Math.round(farmgateNetProceeds / totalQuintals),
        breakdown: [
          { item: 'Transport (Paid by Trader)', cost: 0 },
          { item: 'Commission', cost: 0 },
          { item: 'Trader Margin Discount', cost: Math.round(totalQuintals * 90) }
        ]
      }
    ];

    return res.json({
      success: true,
      parameters: {
        quantityBags,
        bagWeightKg,
        totalQuintals,
        baseMandiPriceQtl
      },
      channels
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Proceeds calculation error.' });
  }
}
