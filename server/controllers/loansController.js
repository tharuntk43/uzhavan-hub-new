/**
 * Uzhavan Hub - Agricultural Credit & Loans Controller (Module 17)
 */

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
