import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

export default function AgriculturalLoansPage() {
  const [principal, setPrincipal] = useState(150000);
  const [tenureMonths, setTenureMonths] = useState(12);
  const [promptRepayment, setPromptRepayment] = useState(true);
  const [calcResult, setCalcResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    runCalculation();
  }, [principal, tenureMonths, promptRepayment]);

  const runCalculation = async () => {
    setLoading(true);
    try {
      const rate = promptRepayment ? 4.0 : 7.0;
      const res = await api.calculateLoan({
        principal: parseFloat(principal),
        annualInterestRate: rate,
        tenureMonths: parseInt(tenureMonths)
      });
      if (res.calculation) {
        setCalcResult(res.calculation);
        if (res.products) setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to calculate loan', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate interest saved with subvention
  const standardInterest = (principal * 0.07 * (tenureMonths / 12));
  const subventedInterest = (principal * 0.04 * (tenureMonths / 12));
  const savings = Math.max(0, standardInterest - subventedInterest);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003b1b] to-[#14532d] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Icon name="payments" className="text-sm" />
            NABARD & Institutional Farm Credit
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Agricultural Loans & KCC Calculator
          </h1>
          <p className="text-emerald-100 text-sm mt-1 font-tamil">
            கிசான் கிரெடிட் கார்டு (KCC) 4% வட்டி மானியம் மற்றும் விவசாய கடன் வழிகாட்டி
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-xs space-y-1">
          <div className="font-semibold text-amber-300 flex items-center gap-1">
            <Icon name="stars" className="text-sm" />
            Prompt Repayment Subvention
          </div>
          <p className="text-stone-200">
            Govt of India offers 3% subvention on KCC crop loans up to ₹3 Lakhs if repaid on time, reducing effective rate from 7% to 4%.
          </p>
        </div>
      </div>

      {/* Interactive KCC Calculator */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-6 sm:p-8 shadow-md">
        <div className="pb-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Icon name="calculate" className="text-[#14532d]" />
              Kisan Credit Card (KCC) Repayment Simulator
            </h2>
            <p className="text-xs text-stone-500 font-tamil">
              பயிர் கடன் தொகைக்கான வட்டி மற்றும் தவணை கணக்கீடு
            </p>
          </div>

          <label className="flex items-center gap-2.5 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 cursor-pointer">
            <input
              type="checkbox"
              checked={promptRepayment}
              onChange={(e) => setPromptRepayment(e.target.checked)}
              className="rounded text-[#14532d] focus:ring-[#14532d] h-4 w-4"
            />
            <div className="text-xs">
              <span className="font-bold text-emerald-900 block">Prompt Repayment Eligible (4% Rate)</span>
              <span className="text-emerald-700 text-[10px]">3% Annual Interest Subvention Applied</span>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-stone-700 uppercase">Crop Loan Amount (Principal)</label>
                <span className="text-lg font-black text-[#14532d]">₹{principal.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="300000"
                step="5000"
                value={principal}
                onChange={(e) => setPrincipal(parseInt(e.target.value))}
                className="w-full accent-[#14532d] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>₹20,000</span>
                <span>₹1,50,000</span>
                <span>₹3,00,000 (Max Subvented)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-stone-700 uppercase">Tenure / Repayment Cycle</label>
                <span className="text-lg font-black text-stone-900">{tenureMonths} Months</span>
              </div>
              <input
                type="range"
                min="3"
                max="24"
                step="1"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(parseInt(e.target.value))}
                className="w-full accent-[#14532d] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>3 Months (Kuruvai)</span>
                <span>12 Months (Annual)</span>
                <span>24 Months (Two-Crop)</span>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="font-bold text-stone-800">NABARD Benchmark Scale of Finance:</div>
              <p>Paddy: ~₹38,000/acre | Sugarcane: ~₹65,000/acre | Banana: ~₹90,000/acre.</p>
            </div>
          </div>

          {/* Results Summary Box */}
          {calcResult && (
            <div className="bg-gradient-to-br from-emerald-50 to-stone-50 rounded-2xl border border-emerald-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
                  <span className="text-xs font-bold text-stone-500 uppercase">Applicable Interest Rate</span>
                  <span className="text-xl font-black text-[#14532d]">
                    {calcResult.interestRatePct}% <span className="text-xs font-normal text-stone-600">per annum</span>
                  </span>
                </div>

                <div className="space-y-3 py-4 text-sm border-b border-emerald-200/60">
                  <div className="flex justify-between text-stone-600">
                    <span>Principal Amount:</span>
                    <span className="font-bold text-stone-900">₹{calcResult.principal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Total Estimated Interest:</span>
                    <span className="font-bold text-stone-900">₹{calcResult.estimatedAnnualInterest.toLocaleString('en-IN')}</span>
                  </div>
                  {promptRepayment && (
                    <div className="flex justify-between text-emerald-800 font-semibold bg-emerald-100/70 p-2 rounded-lg">
                      <span>Govt Subvention Savings (3%):</span>
                      <span>+ ₹{Math.round(savings).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <div className="text-[11px] text-stone-500 uppercase font-semibold">Total Repayment at Harvest</div>
                <div className="text-3xl font-black text-stone-900 mt-0.5">
                  ₹{calcResult.totalRepayment.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  (Or approximately ₹{calcResult.monthlyInstallment.toLocaleString('en-IN')} / month if amortized)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Credit Products Directory */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900">
          Available Agricultural Institutional Credit Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                  {p.rateRange}
                </span>
                <h3 className="font-bold text-stone-900 text-base mt-3">{p.name}</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">{p.feature}</p>
                <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
                  <strong className="text-stone-700">Eligibility: </strong>
                  {p.eligibility}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">Public Sector / Co-op Banks</span>
                <span className="font-bold text-[#14532d] flex items-center gap-1">
                  Learn More <Icon name="arrow_forward" className="text-xs" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
