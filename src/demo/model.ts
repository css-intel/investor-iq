import { calculateUnderwriting } from '@/engine/underwriting';
import { scoreDeal } from '@/engine/deal-scoring';
import { estimateRent } from '@/engine/rent-estimation';
import type { DealScoreResult, UnderwritingResult } from '@/types';

/** Demo data only. Every number below the inputs comes from the real Investor IQ engine. */
export const DEMO_PROPERTY = {
  name: 'Magnolia Court Rental',
  address: '412 Magnolia Court',
  city: 'Aiken',
  state: 'SC',
  zipCode: '29803',
  propertyType: 'SINGLE_FAMILY',
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 1640,
  yearBuilt: 2004,
  rehabCosts: 10000,
  afterRepairValue: 295000,
  downPaymentPct: 0.25,
  termYears: 30,
};

export interface DemoInputs {
  price: number;
  rent: number;
  rate: number;
}

export const RENT_ESTIMATE = estimateRent({
  zipCode: DEMO_PROPERTY.zipCode,
  propertyType: DEMO_PROPERTY.propertyType,
  bedrooms: DEMO_PROPERTY.bedrooms,
  bathrooms: DEMO_PROPERTY.bathrooms,
  squareFootage: DEMO_PROPERTY.squareFootage,
  yearBuilt: DEMO_PROPERTY.yearBuilt,
});

export const DEFAULT_INPUTS: DemoInputs = {
  price: 225000,
  rent: Math.round(RENT_ESTIMATE.estimatedRent / 25) * 25,
  rate: 6.75,
};

export interface DemoDeal {
  inputs: DemoInputs;
  loan: number;
  cashInvested: number;
  uw: UnderwritingResult;
  score: DealScoreResult;
}

export function runDeal(inputs: DemoInputs): DemoDeal {
  const loan = Math.round(inputs.price * (1 - DEMO_PROPERTY.downPaymentPct));
  const uw = calculateUnderwriting({
    purchasePrice: inputs.price,
    monthlyRent: inputs.rent,
    loanAmount: loan,
    interestRate: inputs.rate,
    loanTermYears: DEMO_PROPERTY.termYears,
  });
  const score = scoreDeal({
    dscr: uw.dscr,
    capRate: uw.capRate,
    cashOnCash: uw.cashOnCash,
    purchasePrice: inputs.price,
    afterRepairValue: DEMO_PROPERTY.afterRepairValue,
    rehabCosts: DEMO_PROPERTY.rehabCosts,
    propertyType: DEMO_PROPERTY.propertyType,
    yearBuilt: DEMO_PROPERTY.yearBuilt,
  });
  return { inputs, loan, cashInvested: inputs.price - loan, uw, score };
}

export function verdict(d: DemoDeal): { headline: string; sub: string } {
  const heads = {
    A: 'Excellent deal. Go get it.',
    B: 'Solid deal. Banks will like it.',
    C: 'Average deal. Negotiate it.',
    D: 'Weak deal. Needs work.',
    F: 'Pass on this one.',
  } as const;
  const dscr = d.uw.dscr.toFixed(2);
  return {
    headline: heads[d.score.grade],
    sub: d.uw.isBankReady
      ? `${dscr}x DSCR clears the 1.25x bank line`
      : `${dscr}x DSCR is under the 1.25x bank line`,
  };
}

export const LENDERS = [
  { name: 'First National Bank', type: 'Bank', minDSCR: 1.25 },
  { name: 'Velocity Capital', type: 'Private lender', minDSCR: 1.0 },
  { name: 'Metro Credit Union', type: 'Credit union', minDSCR: 1.2 },
  { name: 'Apex DSCR Lending', type: 'DSCR specialist', minDSCR: 0.75 },
];

export const money = (n: number, dp = 0) =>
  (n < 0 ? '-$' : '$') +
  Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });

export const REPORT_ID = 'IQ-DEMO-0001';
