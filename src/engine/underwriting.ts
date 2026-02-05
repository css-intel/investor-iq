import type { UnderwritingInput, UnderwritingResult } from '@/types';

/**
 * Default expense percentages when not provided
 */
const DEFAULT_EXPENSE_RATES = {
  propertyTaxes: 0.012, // 1.2% of purchase price annually
  insurance: 0.005,     // 0.5% of purchase price annually
  maintenance: 0.01,    // 1% of purchase price annually
  propertyManagement: 0.08, // 8% of gross rent
  vacancyRate: 0.05,    // 5% vacancy
};

/**
 * Bank-ready DSCR threshold
 */
export const DSCR_THRESHOLD = 1.25;

/**
 * Calculate monthly mortgage payment using amortization formula
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number
): number {
  if (loanAmount <= 0) return 0;
  if (annualInterestRate <= 0) return loanAmount / (loanTermYears * 12);
  
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  const payment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return payment;
}

/**
 * Calculate annual debt service
 */
export function calculateAnnualDebtService(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number
): number {
  return calculateMonthlyPayment(loanAmount, annualInterestRate, loanTermYears) * 12;
}

/**
 * Calculate NOI (Net Operating Income)
 * NOI = Effective Gross Income - Operating Expenses
 * Note: Does NOT include debt service
 */
export function calculateNOI(
  effectiveGrossIncome: number,
  totalOperatingExpenses: number
): number {
  return effectiveGrossIncome - totalOperatingExpenses;
}

/**
 * Calculate DSCR (Debt Service Coverage Ratio)
 * DSCR = NOI / Annual Debt Service
 */
export function calculateDSCR(noi: number, annualDebtService: number): number {
  if (annualDebtService <= 0) return 0;
  return noi / annualDebtService;
}

/**
 * Calculate Cap Rate
 * Cap Rate = NOI / Purchase Price
 */
export function calculateCapRate(noi: number, purchasePrice: number): number {
  if (purchasePrice <= 0) return 0;
  return (noi / purchasePrice) * 100;
}

/**
 * Calculate Cash on Cash Return
 * Cash on Cash = Annual Cash Flow / Total Cash Invested
 */
export function calculateCashOnCash(
  annualCashFlow: number,
  totalCashInvested: number
): number {
  if (totalCashInvested <= 0) return 0;
  return (annualCashFlow / totalCashInvested) * 100;
}

/**
 * Get DSCR status classification
 */
export function getDSCRStatus(dscr: number): 'excellent' | 'good' | 'marginal' | 'poor' {
  if (dscr >= 1.5) return 'excellent';
  if (dscr >= 1.25) return 'good';
  if (dscr >= 1.0) return 'marginal';
  return 'poor';
}

/**
 * Main underwriting calculation function
 */
export function calculateUnderwriting(input: UnderwritingInput): UnderwritingResult {
  const {
    purchasePrice,
    monthlyRent,
    otherIncome = 0,
    vacancyRate = DEFAULT_EXPENSE_RATES.vacancyRate,
    
    propertyTaxes,
    insurance,
    utilities = 0,
    maintenance,
    propertyManagement,
    hoaFees = 0,
    otherExpenses = 0,
    
    loanAmount = 0,
    interestRate = 0,
    loanTermYears = 30,
  } = input;

  // Calculate Gross Annual Income
  const grossAnnualIncome = (monthlyRent + otherIncome) * 12;

  // Calculate Effective Gross Income (accounting for vacancy)
  const effectiveGrossIncome = grossAnnualIncome * (1 - vacancyRate);

  // Calculate individual expenses (use defaults if not provided)
  const expenseBreakdown = {
    propertyTaxes: propertyTaxes ?? purchasePrice * DEFAULT_EXPENSE_RATES.propertyTaxes,
    insurance: insurance ?? purchasePrice * DEFAULT_EXPENSE_RATES.insurance,
    utilities,
    maintenance: maintenance ?? purchasePrice * DEFAULT_EXPENSE_RATES.maintenance,
    propertyManagement: propertyManagement ?? grossAnnualIncome * DEFAULT_EXPENSE_RATES.propertyManagement,
    hoaFees: hoaFees * 12, // Convert monthly to annual
    otherExpenses: otherExpenses * 12, // Convert monthly to annual
  };

  // Calculate Total Operating Expenses
  const totalOperatingExpenses = Object.values(expenseBreakdown).reduce((sum, val) => sum + val, 0);

  // Calculate NOI
  const noi = calculateNOI(effectiveGrossIncome, totalOperatingExpenses);

  // Calculate Debt Service
  const annualDebtService = calculateAnnualDebtService(loanAmount, interestRate, loanTermYears);

  // Calculate DSCR
  const dscr = calculateDSCR(noi, annualDebtService);

  // Calculate Cap Rate
  const capRate = calculateCapRate(noi, purchasePrice);

  // Calculate Cash on Cash
  const downPayment = purchasePrice - loanAmount;
  const annualCashFlow = noi - annualDebtService;
  const cashOnCash = calculateCashOnCash(annualCashFlow, downPayment);

  // Monthly breakdown
  const monthlyNOI = noi / 12;
  const monthlyDebtService = annualDebtService / 12;
  const monthlyCashFlow = annualCashFlow / 12;

  // Determine if deal is bank-ready
  const isBankReady = dscr >= DSCR_THRESHOLD;
  const dscrStatus = getDSCRStatus(dscr);

  return {
    grossAnnualIncome,
    effectiveGrossIncome,
    totalOperatingExpenses,
    expenseBreakdown,
    noi,
    annualDebtService,
    dscr,
    capRate,
    cashOnCash,
    monthlyNOI,
    monthlyDebtService,
    monthlyCashFlow,
    isBankReady,
    dscrStatus,
  };
}

/**
 * Quick DSCR calculation
 */
export function quickDSCR(
  monthlyRent: number,
  purchasePrice: number,
  loanAmount: number,
  interestRate: number,
  loanTermYears: number = 30
): number {
  const result = calculateUnderwriting({
    purchasePrice,
    monthlyRent,
    loanAmount,
    interestRate,
    loanTermYears,
  });
  return result.dscr;
}

/**
 * Calculate maximum loan amount for target DSCR
 */
export function calculateMaxLoanForDSCR(
  targetDSCR: number,
  noi: number,
  interestRate: number,
  loanTermYears: number = 30
): number {
  if (interestRate <= 0) return 0;
  
  const maxAnnualDebtService = noi / targetDSCR;
  const monthlyPayment = maxAnnualDebtService / 12;
  
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  const maxLoan =
    (monthlyPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
  
  return Math.floor(maxLoan);
}

/**
 * Calculate break-even rent
 */
export function calculateBreakEvenRent(
  totalOperatingExpenses: number,
  annualDebtService: number,
  vacancyRate: number = 0.05
): number {
  const requiredIncome = totalOperatingExpenses + annualDebtService;
  const grossIncomeNeeded = requiredIncome / (1 - vacancyRate);
  return grossIncomeNeeded / 12;
}
