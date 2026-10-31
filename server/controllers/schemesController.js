/**
 * Uzhavan Hub - Schemes (Module 16) & Loans (Module 17) Controllers
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

// Module 16: Government Schemes & Subsidies
export async function getSchemes(req, res) {
  try {
    const schemes = loadJSON('government_schemes.json');
    return res.json({
      success: true,
      lastVerified: 'October 2026',
      schemesCount: schemes.length,
      schemes
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve schemes directory.' });
  }
}

export async function checkEligibility(req, res) {
  try {
    const {
      landholdingSize = 'marginal', // 'marginal' (<2.5 ac), 'small' (2.5-5 ac), 'large' (>5 ac)
      irrigationStatus = 'borewell', // 'canal', 'borewell', 'rainfed'
      cropCategory = 'grains' // 'grains', 'pulses', 'horticulture', 'commercial'
    } = req.body;

    const allSchemes = loadJSON('government_schemes.json');

    // Filter matching schemes based on 3 inputs
    const matched = allSchemes.map(s => {
      let isEligible = true;
      let matchReason = 'Qualifies based on farm profile.';

      if (s.id === 'scheme_pm_kusum_solar') {
        if (irrigationStatus === 'canal') {
          isEligible = false;
          matchReason = 'Priority is given to dryland borewell/open-well fields lacking grid power.';
        }
      }

      if (s.id === 'scheme_tn_micro_irrigation') {
        if (cropCategory === 'grains' && irrigationStatus === 'canal') {
          matchReason = 'Applicable for horticultural crops, pulses, or orchard plantations.';
        }
      }

      return {
        ...s,
        isEligible,
        matchReason
      };
    });

    const checklist = [
      { doc: 'Aadhaar Card', mandatory: true, purpose: 'Direct Benefit Transfer (DBT) verification' },
      { doc: 'Chitta / Patta (Land Revenue Record)', mandatory: true, purpose: 'Proof of cultivable agricultural land' },
      { doc: 'Bank Passbook Copy', mandatory: true, purpose: 'DBT bank account linked with NPCI Aadhaar' },
      { doc: 'Adangal / Crop Sowing Certificate', mandatory: true, purpose: 'Issued by Village Administrative Officer (VAO)' },
      { doc: 'Small / Marginal Farmer Certificate', mandatory: landholdingSize !== 'large', purpose: '100% micro-irrigation subsidy eligibility' }
    ];

    return res.json({
      success: true,
      matchedSchemes: matched,
      documentChecklist: checklist
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Eligibility check failed.' });
  }
}

// Module 17: Agricultural Loans & Credit Guidance
export async function calculateLoan(req, res) {
  try {
    const {
      principal = 100000,
      annualInterestRate = 4.0, // Subvented KCC rate
      tenureMonths = 12
    } = req.body;

    const p = parseFloat(principal);
    const r = parseFloat(annualInterestRate) / 100.0;
    const t = parseFloat(tenureMonths) / 12.0;

    // KCC / Simple agricultural interest model
    const totalInterest = p * r * t;
    const totalRepayment = p + totalInterest;
    const monthlyInstallment = Math.round(totalRepayment / (parseFloat(tenureMonths) || 12));

    return res.json({
      success: true,
      calculation: {
        principal: Math.round(p),
        interestRatePct: annualInterestRate,
        tenureMonths,
        estimatedAnnualInterest: Math.round(totalInterest),
        totalRepayment: Math.round(totalRepayment),
        monthlyInstallment: monthlyInstallment,
        assumptions: 'Calculated using prompt-repayment 3% central subvention on standard 7% KCC rate resulting in 4% effective interest.'
      },
      products: [
        {
          name: 'Kisan Credit Card (KCC)',
          rateRange: '4% - 7% per annum',
          feature: 'Interest subvention of 3% for prompt repayment on crop loans up to ₹3,00,000.',
          eligibility: 'All farmers, tenant cultivators, and oral lessees with verified crop acreage.'
        },
        {
          name: 'Farm Mechanization & Tractor Term Loan',
          rateRange: '8.5% - 10.5%',
          feature: 'Financing up to 85% of equipment invoice with 5-7 years flexible harvest-linked repayment.',
          eligibility: 'Farmers owning minimum 3 acres of perennial irrigated land.'
        },
        {
          name: 'Joint Liability Group (JLG) / SHG Agri Loan',
          rateRange: '7.0% - 9.0%',
          feature: 'Collateral-free credit up to ₹50,000 per member for tenant farmers and landless farm workers.',
          eligibility: 'Groups of 4-10 tenant cultivators.'
        }
      ]
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Loan calculation failure.' });
  }
}
