import type { DealScoreInput, DealScoreResult } from '@/types';
import { DSCR_THRESHOLD } from './underwriting';

/**
 * Score weights (total = 100)
 */
const SCORE_WEIGHTS = {
  dscr: 30,
  capRate: 25,
  cashOnCash: 20,
  equity: 15,
  property: 10,
};

/**
 * Grade thresholds
 */
const GRADE_THRESHOLDS = {
  A: 85,
  B: 70,
  C: 55,
  D: 40,
};

/**
 * Calculate DSCR score (0-100)
 */
function calculateDSCRScore(dscr: number): number {
  if (dscr >= 2.0) return 100;
  if (dscr >= 1.75) return 95;
  if (dscr >= 1.5) return 85;
  if (dscr >= DSCR_THRESHOLD) return 75;
  if (dscr >= 1.1) return 50;
  if (dscr >= 1.0) return 30;
  if (dscr >= 0.85) return 15;
  return 0;
}

/**
 * Calculate Cap Rate score (0-100)
 */
function calculateCapRateScore(capRate: number): number {
  if (capRate >= 12) return 100;
  if (capRate >= 10) return 95;
  if (capRate >= 8) return 85;
  if (capRate >= 6) return 70;
  if (capRate >= 5) return 55;
  if (capRate >= 4) return 40;
  if (capRate >= 3) return 25;
  return 10;
}

/**
 * Calculate Cash on Cash score (0-100)
 */
function calculateCashOnCashScore(coc: number): number {
  if (coc >= 20) return 100;
  if (coc >= 15) return 95;
  if (coc >= 12) return 85;
  if (coc >= 10) return 75;
  if (coc >= 8) return 65;
  if (coc >= 5) return 45;
  if (coc >= 2) return 25;
  return 10;
}

/**
 * Calculate Equity Position score (0-100)
 */
function calculateEquityScore(
  purchasePrice: number,
  afterRepairValue?: number,
  rehabCosts?: number
): number {
  if (!afterRepairValue) return 50; // Neutral if unknown

  const totalInvestment = purchasePrice + (rehabCosts || 0);
  const equityPercent = ((afterRepairValue - totalInvestment) / afterRepairValue) * 100;

  if (equityPercent >= 30) return 100;
  if (equityPercent >= 25) return 90;
  if (equityPercent >= 20) return 80;
  if (equityPercent >= 15) return 65;
  if (equityPercent >= 10) return 50;
  if (equityPercent >= 5) return 35;
  if (equityPercent >= 0) return 20;
  return 0; // Negative equity
}

/**
 * Calculate Property Quality score (0-100)
 */
function calculatePropertyScore(
  propertyType: string,
  yearBuilt?: number
): number {
  let score = 50; // Base score

  // Property type scoring
  const propertyTypeScores: Record<string, number> = {
    SINGLE_FAMILY: 20,
    DUPLEX: 18,
    TRIPLEX: 16,
    FOURPLEX: 14,
    TOWNHOUSE: 15,
    CONDO: 12,
    MULTI_FAMILY: 15,
    APARTMENT: 10,
    MIXED_USE: 12,
    COMMERCIAL: 10,
  };
  score += propertyTypeScores[propertyType] || 10;

  // Age scoring
  if (yearBuilt) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - yearBuilt;

    if (age <= 5) score += 30;
    else if (age <= 15) score += 25;
    else if (age <= 30) score += 15;
    else if (age <= 50) score += 5;
    else score -= 5;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Get letter grade from score
 */
function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= GRADE_THRESHOLDS.A) return 'A';
  if (score >= GRADE_THRESHOLDS.B) return 'B';
  if (score >= GRADE_THRESHOLDS.C) return 'C';
  if (score >= GRADE_THRESHOLDS.D) return 'D';
  return 'F';
}

/**
 * Generate strengths list
 */
function generateStrengths(breakdown: DealScoreResult['breakdown']): string[] {
  const strengths: string[] = [];

  if (breakdown.dscrScore >= 75) {
    strengths.push('Strong debt service coverage - bank-ready');
  }
  if (breakdown.capRateScore >= 70) {
    strengths.push('Above average cap rate for solid returns');
  }
  if (breakdown.cashOnCashScore >= 65) {
    strengths.push('Excellent cash flow for cash invested');
  }
  if (breakdown.equityScore >= 65) {
    strengths.push('Built-in equity provides safety margin');
  }
  if (breakdown.propertyScore >= 70) {
    strengths.push('Desirable property type/condition');
  }

  return strengths;
}

/**
 * Generate weaknesses list
 */
function generateWeaknesses(breakdown: DealScoreResult['breakdown']): string[] {
  const weaknesses: string[] = [];

  if (breakdown.dscrScore < 50) {
    weaknesses.push('Low DSCR may not meet bank requirements');
  }
  if (breakdown.capRateScore < 50) {
    weaknesses.push('Cap rate below market average');
  }
  if (breakdown.cashOnCashScore < 40) {
    weaknesses.push('Low cash-on-cash return');
  }
  if (breakdown.equityScore < 40) {
    weaknesses.push('Limited equity position');
  }
  if (breakdown.propertyScore < 40) {
    weaknesses.push('Property type or age may limit appreciation');
  }

  return weaknesses;
}

/**
 * Generate recommendation
 */
function generateRecommendation(
  _totalScore: number,
  grade: string,
  _strengths: string[],
  _weaknesses: string[]
): string {
  if (grade === 'A') {
    return 'Excellent investment opportunity. This deal meets or exceeds all key metrics. Recommend proceeding with due diligence.';
  }
  if (grade === 'B') {
    return 'Good investment opportunity. Solid fundamentals with room for improvement. Consider negotiating for better terms.';
  }
  if (grade === 'C') {
    return 'Average deal with mixed metrics. Carefully evaluate risks vs potential returns. May work with specific strategy adjustments.';
  }
  if (grade === 'D') {
    return 'Below average opportunity. Multiple areas of concern. Only proceed if you can address key weaknesses through negotiation or value-add.';
  }
  return 'Poor investment based on current numbers. Recommend passing unless significant improvements can be negotiated.';
}

/**
 * Main deal scoring function
 */
export function scoreDeal(input: DealScoreInput): DealScoreResult {
  const {
    dscr,
    capRate,
    cashOnCash,
    purchasePrice,
    afterRepairValue,
    rehabCosts,
    propertyType,
    yearBuilt,
  } = input;

  // Calculate individual scores
  const dscrScore = calculateDSCRScore(dscr);
  const capRateScore = calculateCapRateScore(capRate);
  const cashOnCashScore = calculateCashOnCashScore(cashOnCash);
  const equityScore = calculateEquityScore(purchasePrice, afterRepairValue, rehabCosts);
  const propertyScore = calculatePropertyScore(propertyType, yearBuilt);

  const breakdown = {
    dscrScore,
    capRateScore,
    cashOnCashScore,
    equityScore,
    propertyScore,
  };

  // Calculate weighted total score
  const totalScore = Math.round(
    (dscrScore * SCORE_WEIGHTS.dscr +
      capRateScore * SCORE_WEIGHTS.capRate +
      cashOnCashScore * SCORE_WEIGHTS.cashOnCash +
      equityScore * SCORE_WEIGHTS.equity +
      propertyScore * SCORE_WEIGHTS.property) /
      100
  );

  const grade = getGrade(totalScore);
  const strengths = generateStrengths(breakdown);
  const weaknesses = generateWeaknesses(breakdown);
  const recommendation = generateRecommendation(totalScore, grade, strengths, weaknesses);

  return {
    totalScore,
    grade,
    breakdown,
    strengths,
    weaknesses,
    recommendation,
  };
}

/**
 * Quick score calculation
 */
export function quickScore(dscr: number, capRate: number, cashOnCash: number): number {
  const dscrScore = calculateDSCRScore(dscr);
  const capRateScore = calculateCapRateScore(capRate);
  const cashOnCashScore = calculateCashOnCashScore(cashOnCash);

  return Math.round(
    (dscrScore * SCORE_WEIGHTS.dscr +
      capRateScore * SCORE_WEIGHTS.capRate +
      cashOnCashScore * SCORE_WEIGHTS.cashOnCash) /
      (SCORE_WEIGHTS.dscr + SCORE_WEIGHTS.capRate + SCORE_WEIGHTS.cashOnCash) *
      100 /
      100
  );
}

/**
 * Get score color for UI
 */
export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-profit';
  if (score >= 70) return 'text-blue-500';
  if (score >= 55) return 'text-warning';
  if (score >= 40) return 'text-orange-500';
  return 'text-loss';
}

/**
 * Get grade color for UI
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'bg-profit text-white';
    case 'B': return 'bg-blue-500 text-white';
    case 'C': return 'bg-warning text-white';
    case 'D': return 'bg-orange-500 text-white';
    default: return 'bg-loss text-white';
  }
}

/**
 * Compare two deals
 */
export function compareDeals(
  deal1: DealScoreResult,
  deal2: DealScoreResult
): { winner: 1 | 2 | 'tie'; reasons: string[] } {
  const reasons: string[] = [];
  let deal1Points = 0;
  let deal2Points = 0;

  // Compare each metric
  const metrics: (keyof DealScoreResult['breakdown'])[] = [
    'dscrScore',
    'capRateScore',
    'cashOnCashScore',
    'equityScore',
    'propertyScore',
  ];

  metrics.forEach(metric => {
    if (deal1.breakdown[metric] > deal2.breakdown[metric]) {
      deal1Points++;
    } else if (deal2.breakdown[metric] > deal1.breakdown[metric]) {
      deal2Points++;
    }
  });

  // Winner determination
  if (deal1.totalScore > deal2.totalScore + 5) {
    reasons.push(`Deal 1 has higher overall score (${deal1.totalScore} vs ${deal2.totalScore})`);
    return { winner: 1, reasons };
  }
  if (deal2.totalScore > deal1.totalScore + 5) {
    reasons.push(`Deal 2 has higher overall score (${deal2.totalScore} vs ${deal1.totalScore})`);
    return { winner: 2, reasons };
  }

  if (deal1Points > deal2Points) {
    reasons.push('Deal 1 performs better across more metrics');
    return { winner: 1, reasons };
  }
  if (deal2Points > deal1Points) {
    reasons.push('Deal 2 performs better across more metrics');
    return { winner: 2, reasons };
  }

  return { winner: 'tie', reasons: ['Both deals are comparable'] };
}
