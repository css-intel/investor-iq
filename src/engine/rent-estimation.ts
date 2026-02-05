import type { RentEstimationInput, RentEstimationResult, RentAdjustment } from '@/types';

/**
 * Base rent rates by bedroom count (national averages as fallback)
 * These would typically come from a database or API
 */
const BASE_RENT_BY_BEDROOMS: Record<number, number> = {
  0: 1200,  // Studio
  1: 1400,
  2: 1700,
  3: 2100,
  4: 2500,
  5: 3000,
};

/**
 * Property type multipliers
 */
const PROPERTY_TYPE_MULTIPLIERS: Record<string, number> = {
  SINGLE_FAMILY: 1.15,
  MULTI_FAMILY: 1.0,
  CONDO: 1.05,
  TOWNHOUSE: 1.08,
  DUPLEX: 0.95,
  TRIPLEX: 0.93,
  FOURPLEX: 0.90,
  APARTMENT: 0.95,
};

/**
 * Amenity adjustments (monthly)
 */
const AMENITY_ADJUSTMENTS: Record<string, number> = {
  'garage': 100,
  'pool': 75,
  'washer_dryer': 50,
  'dishwasher': 25,
  'central_ac': 50,
  'hardwood_floors': 35,
  'updated_kitchen': 75,
  'updated_bathroom': 50,
  'fireplace': 40,
  'fenced_yard': 60,
  'pet_friendly': 30,
  'smart_home': 45,
};

/**
 * Regional rent multipliers by state (simplified)
 * In production, this would use zip code-level data
 */
const STATE_MULTIPLIERS: Record<string, number> = {
  'CA': 1.45,
  'NY': 1.40,
  'MA': 1.35,
  'WA': 1.30,
  'CO': 1.20,
  'TX': 0.95,
  'FL': 1.10,
  'AZ': 1.05,
  'NC': 0.95,
  'GA': 0.98,
  'OH': 0.85,
  'MI': 0.80,
  'PA': 0.95,
  'IL': 1.05,
  'NJ': 1.25,
  // Default for unlisted states
};

/**
 * Calculate price per square foot adjustment
 */
function calculateSqftAdjustment(squareFootage: number | undefined, bedrooms: number): number {
  if (!squareFootage) return 0;
  
  // Expected sqft by bedroom count
  const expectedSqft: Record<number, number> = {
    0: 500,
    1: 700,
    2: 1000,
    3: 1400,
    4: 1800,
    5: 2200,
  };
  
  const expected = expectedSqft[bedrooms] || 1000;
  const difference = squareFootage - expected;
  
  // $0.50 per sqft difference
  return difference * 0.50;
}

/**
 * Calculate age adjustment based on year built
 */
function calculateAgeAdjustment(yearBuilt: number | undefined): number {
  if (!yearBuilt) return 0;
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - yearBuilt;
  
  if (age <= 5) return 150;    // New construction premium
  if (age <= 15) return 75;    // Modern
  if (age <= 30) return 0;     // Standard
  if (age <= 50) return -50;   // Older
  return -100;                 // Very old
}

/**
 * Get state multiplier with fallback
 */
function getStateMultiplier(state: string): number {
  return STATE_MULTIPLIERS[state.toUpperCase()] || 1.0;
}

/**
 * Extract state from zip code (simplified lookup)
 * In production, this would use a proper zip code database
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStateFromZip(zipCode: string): string {
  const prefix = parseInt(zipCode.substring(0, 3));
  
  // Simplified state lookup by zip prefix
  if (prefix >= 900 && prefix <= 961) return 'CA';
  if (prefix >= 100 && prefix <= 149) return 'NY';
  if (prefix >= 750 && prefix <= 799) return 'TX';
  if (prefix >= 320 && prefix <= 349) return 'FL';
  if (prefix >= 850 && prefix <= 865) return 'AZ';
  if (prefix >= 800 && prefix <= 816) return 'CO';
  
  return 'DEFAULT';
}

/**
 * Calculate bathroom adjustment
 */
function calculateBathroomAdjustment(bathrooms: number, bedrooms: number): number {
  const expectedBaths = Math.ceil(bedrooms / 2) + 0.5;
  const difference = bathrooms - expectedBaths;
  
  // $40 per 0.5 bathroom difference
  return difference * 80;
}

/**
 * Main rent estimation function
 */
export function estimateRent(input: RentEstimationInput): RentEstimationResult {
  const {
    zipCode,
    propertyType,
    bedrooms,
    bathrooms,
    squareFootage,
    yearBuilt,
    amenities = [],
  } = input;

  const adjustments: RentAdjustment[] = [];

  // Start with base rent
  const baseRent = BASE_RENT_BY_BEDROOMS[bedrooms] || BASE_RENT_BY_BEDROOMS[2];
  adjustments.push({
    factor: 'Base Rent',
    amount: baseRent,
    description: `${bedrooms} bedroom base rent`,
  });

  // Apply property type multiplier
  const propertyMultiplier = PROPERTY_TYPE_MULTIPLIERS[propertyType] || 1.0;
  const afterPropertyType = baseRent * propertyMultiplier;
  if (propertyMultiplier !== 1.0) {
    adjustments.push({
      factor: 'Property Type',
      amount: afterPropertyType - baseRent,
      description: `${propertyType.replace('_', ' ').toLowerCase()} adjustment`,
    });
  }

  // Apply state/location multiplier
  const state = getStateFromZip(zipCode);
  const stateMultiplier = getStateMultiplier(state);
  const afterLocation = afterPropertyType * stateMultiplier;
  if (stateMultiplier !== 1.0) {
    adjustments.push({
      factor: 'Location',
      amount: afterLocation - afterPropertyType,
      description: `${state} market adjustment`,
    });
  }

  // Apply square footage adjustment
  const sqftAdj = calculateSqftAdjustment(squareFootage, bedrooms);
  if (sqftAdj !== 0) {
    adjustments.push({
      factor: 'Square Footage',
      amount: sqftAdj,
      description: squareFootage ? `${squareFootage} sqft adjustment` : 'Size adjustment',
    });
  }

  // Apply age adjustment
  const ageAdj = calculateAgeAdjustment(yearBuilt);
  if (ageAdj !== 0) {
    adjustments.push({
      factor: 'Property Age',
      amount: ageAdj,
      description: yearBuilt ? `Built in ${yearBuilt}` : 'Age adjustment',
    });
  }

  // Apply bathroom adjustment
  const bathAdj = calculateBathroomAdjustment(bathrooms, bedrooms);
  if (bathAdj !== 0) {
    adjustments.push({
      factor: 'Bathrooms',
      amount: bathAdj,
      description: `${bathrooms} bathroom${bathrooms !== 1 ? 's' : ''}`,
    });
  }

  // Apply amenity adjustments
  let amenityTotal = 0;
  amenities.forEach(amenity => {
    const adj = AMENITY_ADJUSTMENTS[amenity.toLowerCase()];
    if (adj) {
      amenityTotal += adj;
    }
  });
  if (amenityTotal !== 0) {
    adjustments.push({
      factor: 'Amenities',
      amount: amenityTotal,
      description: `${amenities.length} amenity adjustments`,
    });
  }

  // Calculate final estimate
  const estimatedRent = Math.round(
    afterLocation + sqftAdj + ageAdj + bathAdj + amenityTotal
  );

  // Calculate confidence based on available data
  let confidence = 0.5; // Base confidence
  if (squareFootage) confidence += 0.1;
  if (yearBuilt) confidence += 0.1;
  if (bathrooms) confidence += 0.1;
  if (amenities.length > 0) confidence += 0.1;
  if (STATE_MULTIPLIERS[state]) confidence += 0.1;

  // Calculate rent range (±15% with low confidence, ±8% with high confidence)
  const rangePercent = 0.08 + (1 - confidence) * 0.07;
  const rentRange = {
    low: Math.round(estimatedRent * (1 - rangePercent)),
    high: Math.round(estimatedRent * (1 + rangePercent)),
  };

  // Mock comparables (in production, these would come from database/API)
  const comparables = generateMockComparables(estimatedRent, bedrooms, bathrooms);

  return {
    estimatedRent,
    rentRange,
    confidence: Math.min(confidence, 1),
    comparables,
    marketAverage: estimatedRent * 0.95,
    adjustments,
  };
}

/**
 * Generate mock comparables for demo purposes
 */
function generateMockComparables(
  baseRent: number,
  bedrooms: number,
  bathrooms: number
) {
  const comparables = [];
  const variance = 0.12;

  for (let i = 0; i < 5; i++) {
    const rentVariance = 1 + (Math.random() * variance * 2 - variance);
    comparables.push({
      address: `${1000 + i * 100} Example St`,
      rent: Math.round(baseRent * rentVariance),
      bedrooms,
      bathrooms,
      squareFootage: 800 + bedrooms * 300 + Math.floor(Math.random() * 200),
      distance: Math.round((0.5 + Math.random() * 2) * 10) / 10,
    });
  }

  return comparables;
}

/**
 * Quick rent estimate with minimal inputs
 */
export function quickRentEstimate(
  bedrooms: number,
  zipCode: string,
  propertyType: string = 'SINGLE_FAMILY'
): number {
  const result = estimateRent({
    zipCode,
    propertyType,
    bedrooms,
    bathrooms: Math.ceil(bedrooms / 2) + 0.5,
  });
  return result.estimatedRent;
}

/**
 * Calculate rent per bedroom
 */
export function calculateRentPerBedroom(totalRent: number, bedrooms: number): number {
  if (bedrooms <= 0) return totalRent;
  return Math.round(totalRent / bedrooms);
}

/**
 * Calculate price to rent ratio
 */
export function calculatePriceToRentRatio(
  purchasePrice: number,
  monthlyRent: number
): number {
  if (monthlyRent <= 0) return 0;
  return purchasePrice / (monthlyRent * 12);
}

/**
 * Evaluate rent vs market
 */
export function evaluateRentVsMarket(
  actualRent: number,
  estimatedRent: number
): { status: 'below' | 'at' | 'above'; percentage: number } {
  const percentage = ((actualRent - estimatedRent) / estimatedRent) * 100;
  
  if (percentage < -5) return { status: 'below', percentage };
  if (percentage > 5) return { status: 'above', percentage };
  return { status: 'at', percentage };
}
