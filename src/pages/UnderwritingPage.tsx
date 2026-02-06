import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MetricCard } from '@/components/ui/metric-card';
import { Calculator, DollarSign, Percent, TrendingUp, Building2, PiggyBank } from 'lucide-react';
import { calculateDSCR, calculateNOI, calculateCapRate, calculateAnnualDebtService, calculateCashOnCash, calculateMonthlyPayment } from '@/engine/underwriting';

export default function UnderwritingPage() {
  const [inputs, setInputs] = useState({
    purchasePrice: '',
    downPayment: '',
    monthlyRent: '',
    annualExpenses: '',
    interestRate: '',
    loanTermYears: '30',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Parse inputs
  const purchasePrice = parseFloat(inputs.purchasePrice) || 0;
  const downPayment = parseFloat(inputs.downPayment) || 0;
  const monthlyRent = parseFloat(inputs.monthlyRent) || 0;
  const annualExpenses = parseFloat(inputs.annualExpenses) || 0;
  const interestRate = parseFloat(inputs.interestRate) || 0;
  const loanTermYears = parseFloat(inputs.loanTermYears) || 30;

  // Calculate metrics
  const loanAmount = purchasePrice - downPayment;
  const annualRent = monthlyRent * 12;
  const noi = calculateNOI(annualRent, annualExpenses);
  const annualDebtService = calculateAnnualDebtService(loanAmount, interestRate, loanTermYears);
  const dscr = calculateDSCR(noi, annualDebtService);
  const capRate = calculateCapRate(noi, purchasePrice);
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTermYears);
  const cashFlow = noi - annualDebtService;
  const cashOnCash = calculateCashOnCash(cashFlow, downPayment);
  const ltv = purchasePrice > 0 ? ((loanAmount / purchasePrice) * 100) : 0;

  const getDSCRStatus = (value: number) => {
    if (value >= 1.25) return { label: 'Excellent', color: 'text-green-500' };
    if (value >= 1.0) return { label: 'Acceptable', color: 'text-yellow-500' };
    return { label: 'Below Threshold', color: 'text-red-500' };
  };

  const dscrStatus = getDSCRStatus(dscr);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Underwriting Calculator</h1>
          <p className="text-muted-foreground mt-1">Analyze investment properties with DSCR, NOI, and cash flow metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-xl border p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Property Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Purchase Price</label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="purchasePrice"
                      type="number"
                      placeholder="500,000"
                      value={inputs.purchasePrice}
                      onChange={handleChange}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Down Payment</label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="downPayment"
                      type="number"
                      placeholder="125,000"
                      value={inputs.downPayment}
                      onChange={handleChange}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Monthly Rent</label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="monthlyRent"
                      type="number"
                      placeholder="4,000"
                      value={inputs.monthlyRent}
                      onChange={handleChange}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Annual Operating Expenses</label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="annualExpenses"
                      type="number"
                      placeholder="12,000"
                      value={inputs.annualExpenses}
                      onChange={handleChange}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Interest Rate (%)</label>
                  <div className="relative mt-1">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="interestRate"
                      type="number"
                      step="0.125"
                      placeholder="7.5"
                      value={inputs.interestRate}
                      onChange={handleChange}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Loan Term (Years)</label>
                  <Input
                    name="loanTermYears"
                    type="number"
                    placeholder="30"
                    value={inputs.loanTermYears}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button className="w-full mt-4">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
              </Button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="DSCR"
                value={dscr.toFixed(2)}
                icon={<TrendingUp className="h-5 w-5" />}
                subtitle={dscrStatus.label}
                trend={dscr >= 1.25 ? 'up' : 'down'}
              />
              <MetricCard
                title="Cap Rate"
                value={`${capRate.toFixed(2)}%`}
                icon={<Percent className="h-5 w-5" />}
                subtitle={capRate >= 6 ? 'Good' : capRate >= 4 ? 'Average' : 'Low'}
              />
              <MetricCard
                title="Cash on Cash"
                value={`${cashOnCash.toFixed(1)}%`}
                icon={<PiggyBank className="h-5 w-5" />}
                subtitle="Annual Return"
              />
              <MetricCard
                title="NOI"
                value={`$${noi.toLocaleString()}`}
                icon={<DollarSign className="h-5 w-5" />}
                subtitle="Annual"
              />
            </div>

            {/* Detailed Analysis */}
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-lg font-semibold mb-4">Detailed Analysis</h2>
              
              <div className="space-y-6">
                {/* DSCR Analysis */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Debt Service Coverage Ratio</span>
                    <span className={`font-bold text-lg ${dscrStatus.color}`}>{dscr.toFixed(2)}x</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${dscr >= 1.25 ? 'bg-green-500' : dscr >= 1.0 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(dscr / 2 * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {dscr >= 1.25 
                      ? 'This deal meets bank-ready DSCR requirements (≥1.25)'
                      : dscr >= 1.0
                      ? 'DSCR is acceptable but below preferred bank threshold'
                      : 'DSCR is below 1.0 - property may not cover debt obligations'}
                  </p>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-medium text-muted-foreground">Income</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Annual Gross Rent</span>
                        <span className="font-medium">${annualRent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Operating Expenses</span>
                        <span className="font-medium text-red-500">-${annualExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-sm font-medium">Net Operating Income</span>
                        <span className="font-bold text-green-500">${noi.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-muted-foreground">Financing</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Loan Amount</span>
                        <span className="font-medium">${loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Monthly Payment</span>
                        <span className="font-medium">${monthlyPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">LTV Ratio</span>
                        <span className="font-medium">{ltv.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-sm font-medium">Annual Cash Flow</span>
                        <span className={`font-bold ${cashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${cashFlow.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Requirements */}
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-lg font-semibold mb-4">Bank Requirements Check</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border ${dscr >= 1.25 ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2 w-2 rounded-full ${dscr >= 1.25 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-medium">DSCR ≥ 1.25</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Current: {dscr.toFixed(2)}</p>
                </div>
                <div className={`p-4 rounded-lg border ${ltv <= 80 ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2 w-2 rounded-full ${ltv <= 80 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-medium">LTV ≤ 80%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Current: {ltv.toFixed(1)}%</p>
                </div>
                <div className={`p-4 rounded-lg border ${capRate >= 5 ? 'border-green-500 bg-green-500/10' : 'border-yellow-500 bg-yellow-500/10'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2 w-2 rounded-full ${capRate >= 5 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="font-medium">Cap Rate ≥ 5%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Current: {capRate.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
