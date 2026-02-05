// Re-export Prisma types
export type {
  Deal,
  User,
  Comparable,
  Document,
  Lender,
  LenderSubmission,
  Notification,
  MarketData,
} from '@prisma/client';

export {
  DealStatus,
  PropertyType,
  DocumentType,
  SubmissionStatus,
  NotificationType,
} from '@prisma/client';

// Underwriting Input
export interface UnderwritingInput {
  purchasePrice: number;
  monthlyRent: number;
  otherIncome?: number;
  vacancyRate?: number;
  
  propertyTaxes?: number;
  insurance?: number;
  utilities?: number;
  maintenance?: number;
  propertyManagement?: number;
  hoaFees?: number;
  otherExpenses?: number;
  
  loanAmount?: number;
  interestRate?: number;
  loanTermYears?: number;
}

// Underwriting Results
export interface UnderwritingResult {
  // Income
  grossAnnualIncome: number;
  effectiveGrossIncome: number;
  
  // Expenses
  totalOperatingExpenses: number;
  expenseBreakdown: {
    propertyTaxes: number;
    insurance: number;
    utilities: number;
    maintenance: number;
    propertyManagement: number;
    hoaFees: number;
    otherExpenses: number;
  };
  
  // Key Metrics
  noi: number;
  annualDebtService: number;
  dscr: number;
  capRate: number;
  cashOnCash: number;
  
  // Monthly Breakdown
  monthlyNOI: number;
  monthlyDebtService: number;
  monthlyCashFlow: number;
  
  // Status
  isBankReady: boolean;
  dscrStatus: 'excellent' | 'good' | 'marginal' | 'poor';
}

// Rent Estimation
export interface RentEstimationInput {
  zipCode: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  yearBuilt?: number;
  amenities?: string[];
}

export interface RentEstimationResult {
  estimatedRent: number;
  rentRange: {
    low: number;
    high: number;
  };
  confidence: number;
  comparables: RentComparable[];
  marketAverage: number;
  adjustments: RentAdjustment[];
}

export interface RentComparable {
  address: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  distance: number;
}

export interface RentAdjustment {
  factor: string;
  amount: number;
  description: string;
}

// Deal Scoring
export interface DealScoreInput {
  dscr: number;
  capRate: number;
  cashOnCash: number;
  
  purchasePrice: number;
  afterRepairValue?: number;
  rehabCosts?: number;
  
  propertyType: string;
  yearBuilt?: number;
  location?: {
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface DealScoreResult {
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    dscrScore: number;
    capRateScore: number;
    cashOnCashScore: number;
    equityScore: number;
    propertyScore: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

// Form Types
export interface DealFormData {
  // Property Info
  propertyName: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  yearBuilt?: number;
  squareFootage?: number;
  lotSize?: number;
  units: number;
  bedrooms?: number;
  bathrooms?: number;
  
  // Purchase
  purchasePrice: number;
  afterRepairValue?: number;
  rehabCosts?: number;
  closingCosts?: number;
  
  // Financing
  loanAmount?: number;
  interestRate?: number;
  loanTermYears?: number;
  downPayment?: number;
  
  // Income
  monthlyRent?: number;
  otherIncome?: number;
  vacancyRate?: number;
  
  // Expenses
  propertyTaxes?: number;
  insurance?: number;
  utilities?: number;
  maintenance?: number;
  propertyManagement?: number;
  hoaFees?: number;
  otherExpenses?: number;
  
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Dashboard Types
export interface DashboardMetrics {
  totalDeals: number;
  activeDeals: number;
  totalPortfolioValue: number;
  averageDSCR: number;
  averageCapRate: number;
  dealsByStatus: Record<string, number>;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'deal_created' | 'deal_updated' | 'deal_submitted' | 'submission_response';
  title: string;
  description: string;
  dealId?: string;
  timestamp: Date;
}

// Filter Types
export interface DealFilters {
  status?: string[];
  propertyType?: string[];
  minPrice?: number;
  maxPrice?: number;
  minDSCR?: number;
  state?: string;
  search?: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// PDF Report Types
export interface PDFReportData {
  deal: {
    propertyName: string;
    propertyAddress: string;
    city: string;
    state: string;
    zipCode: string;
    propertyType: string;
    units: number;
    yearBuilt?: number;
    squareFootage?: number;
  };
  financials: {
    purchasePrice: number;
    loanAmount?: number;
    downPayment?: number;
    interestRate?: number;
    loanTermYears?: number;
  };
  income: {
    monthlyRent: number;
    otherIncome: number;
    vacancyRate: number;
    effectiveGrossIncome: number;
  };
  expenses: {
    propertyTaxes: number;
    insurance: number;
    utilities: number;
    maintenance: number;
    propertyManagement: number;
    hoaFees: number;
    otherExpenses: number;
    totalExpenses: number;
  };
  metrics: {
    noi: number;
    dscr: number;
    capRate: number;
    cashOnCash: number;
    annualDebtService: number;
  };
  score: DealScoreResult;
  comparables?: Comparable[];
  generatedAt: Date;
}

// Comparable type for PDF
export interface Comparable {
  address: string;
  salePrice?: number;
  rentPrice?: number;
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  distanceMiles?: number;
}
