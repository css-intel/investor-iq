// Enums (previously from Prisma)
export enum DealStatus {
  DRAFT = 'DRAFT',
  ANALYZING = 'ANALYZING',
  REVIEWED = 'REVIEWED',
  SUBMITTED = 'SUBMITTED',
  FUNDED = 'FUNDED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export enum PropertyType {
  SINGLE_FAMILY = 'SINGLE_FAMILY',
  MULTI_FAMILY = 'MULTI_FAMILY',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  COMMERCIAL = 'COMMERCIAL',
  MIXED_USE = 'MIXED_USE',
}

export enum DocumentType {
  PURCHASE_AGREEMENT = 'PURCHASE_AGREEMENT',
  APPRAISAL = 'APPRAISAL',
  INSPECTION = 'INSPECTION',
  RENT_ROLL = 'RENT_ROLL',
  TAX_RETURN = 'TAX_RETURN',
  OTHER = 'OTHER',
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum NotificationType {
  DEAL_CREATED = 'DEAL_CREATED',
  DEAL_UPDATED = 'DEAL_UPDATED',
  SUBMISSION_STATUS = 'SUBMISSION_STATUS',
  ALERT = 'ALERT',
}

// Base types (previously from Prisma)
export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  userId: string;
  propertyName: string;
  address: string;
  propertyType: PropertyType;
  status: DealStatus;
  purchasePrice: number;
  monthlyRent: number;
  annualExpenses: number;
  loanAmount?: number | null;
  interestRate?: number | null;
  loanTermYears?: number | null;
  noi?: number | null;
  dscr?: number | null;
  capRate?: number | null;
  dealScore?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  dealId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  createdAt: Date;
}

export interface Lender {
  id: string;
  name: string;
  contactEmail?: string | null;
  minDSCR?: number | null;
  maxLTV?: number | null;
  minLoanAmount?: number | null;
  maxLoanAmount?: number | null;
}

export interface LenderSubmission {
  id: string;
  dealId: string;
  lenderId: string;
  status: SubmissionStatus;
  submittedAt: Date;
  responseAt?: Date | null;
  notes?: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface MarketData {
  id: string;
  zipCode: string;
  medianRent: number;
  medianHomePrice: number;
  avgCapRate: number;
  populationGrowth?: number | null;
  employmentGrowth?: number | null;
  updatedAt: Date;
}

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
