import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Building2, MapPin, DollarSign, Percent, Calculator } from 'lucide-react';
import { calculateDSCR, calculateNOI, calculateCapRate, calculateAnnualDebtService } from '@/engine/underwriting';
import { quickScore } from '@/engine/deal-scoring';

export default function NewDealPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyName: '',
    address: '',
    purchasePrice: '',
    annualRent: '',
    operatingExpenses: '',
    loanAmount: '',
    interestRate: '',
    loanTermYears: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calculate metrics
  const purchasePrice = parseFloat(formData.purchasePrice) || 0;
  const annualRent = parseFloat(formData.annualRent) || 0;
  const operatingExpenses = parseFloat(formData.operatingExpenses) || 0;
  const loanAmount = parseFloat(formData.loanAmount) || 0;
  const interestRate = parseFloat(formData.interestRate) || 0;
  const loanTermYears = parseFloat(formData.loanTermYears) || 30;

  const noi = calculateNOI(annualRent, operatingExpenses);
  const annualDebtService = calculateAnnualDebtService(loanAmount, interestRate, loanTermYears);
  const dscr = calculateDSCR(noi, annualDebtService);
  const capRate = calculateCapRate(noi, purchasePrice);
  const dealScore = purchasePrice > 0 ? quickScore(dscr, capRate, 0) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save deal to database
    navigate('/deals');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">New Deal</h1>
            <p className="text-muted-foreground mt-1">Enter property details for underwriting analysis.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Information */}
          <div className="rounded-xl border bg-card p-6 space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Building2 className="h-5 w-5 text-primary" />
              Property Information
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Name</label>
                <Input
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  placeholder="e.g., Maple Street Duplex"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, State"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="rounded-xl border bg-card p-6 space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <DollarSign className="h-5 w-5 text-primary" />
              Financial Details
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Purchase Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="purchasePrice"
                    type="number"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    placeholder="350000"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Annual Gross Rent</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="annualRent"
                    type="number"
                    value={formData.annualRent}
                    onChange={handleInputChange}
                    placeholder="36000"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Annual Operating Expenses</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="operatingExpenses"
                    type="number"
                    value={formData.operatingExpenses}
                    onChange={handleInputChange}
                    placeholder="10800"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="loanAmount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    placeholder="280000"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Interest Rate (%)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="interestRate"
                    type="number"
                    step="0.1"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    placeholder="7.5"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Term (Years)</label>
                <Input
                  name="loanTermYears"
                  type="number"
                  value={formData.loanTermYears}
                  onChange={handleInputChange}
                  placeholder="30"
                />
              </div>
            </div>
          </div>

          {/* Calculated Metrics */}
          <div className="rounded-xl border bg-card p-6 space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Calculator className="h-5 w-5 text-primary" />
              Calculated Metrics
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">NOI</p>
                <p className="text-2xl font-bold">${noi.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-lg ${dscr >= 1.25 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <p className="text-sm text-muted-foreground">DSCR</p>
                <p className="text-2xl font-bold">{isFinite(dscr) ? dscr.toFixed(2) : '--'}</p>
                <p className="text-xs text-muted-foreground">Min: 1.25</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">Cap Rate</p>
                <p className="text-2xl font-bold">{isFinite(capRate) ? `${capRate.toFixed(2)}%` : '--'}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">Deal Score</p>
                <p className="text-2xl font-bold">{dealScore}/100</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/deals')}>
              Cancel
            </Button>
            <Button type="submit">
              Save Deal
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
