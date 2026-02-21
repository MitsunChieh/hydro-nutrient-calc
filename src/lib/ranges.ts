import type { IonId } from './types';

export interface IonRange {
  low: number;   // ppm - below this is deficient
  high: number;  // ppm - above this is excess
}

/**
 * General hydroponic nutrient ranges (ppm as element).
 * Based on commonly cited values for vegetative growth.
 * These are guidelines, not strict limits — crops vary.
 */
export const NUTRIENT_RANGES: Partial<Record<IonId, IonRange>> = {
  NO3:   { low: 100, high: 250 },  // N from nitrate
  NH4:   { low: 0,   high: 30 },   // N from ammonium (keep low)
  H2PO4: { low: 30,  high: 80 },   // P
  K:     { low: 150, high: 350 },   // K
  Ca:    { low: 100, high: 260 },   // Ca
  Mg:    { low: 30,  high: 80 },    // Mg
  SO4:   { low: 20,  high: 120 },   // S
  Fe:    { low: 1,   high: 5 },     // Fe
  Mn:    { low: 0.3, high: 2 },     // Mn
  B:     { low: 0.2, high: 1 },     // B
  Zn:    { low: 0.1, high: 1 },     // Zn
  Cu:    { low: 0.02, high: 0.5 },  // Cu
  Mo:    { low: 0.01, high: 0.1 },  // Mo
};

export type RangeStatus = 'low' | 'ok' | 'high';

export function checkRange(ion: IonId, ppm: number): RangeStatus | null {
  const range = NUTRIENT_RANGES[ion];
  if (!range) return null;
  if (ppm < range.low) return 'low';
  if (ppm > range.high) return 'high';
  return 'ok';
}
