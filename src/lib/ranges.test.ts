import { describe, it, expect } from 'vitest';
import { NUTRIENT_RANGES, checkRange } from './ranges';

describe('NUTRIENT_RANGES', () => {
  it('defines ranges for 13 ions', () => {
    expect(Object.keys(NUTRIENT_RANGES)).toHaveLength(13);
  });

  it('all ranges have low < high', () => {
    for (const [ion, range] of Object.entries(NUTRIENT_RANGES)) {
      expect(range!.low, `${ion} low`).toBeLessThan(range!.high);
    }
  });

  it('all low values are non-negative', () => {
    for (const [ion, range] of Object.entries(NUTRIENT_RANGES)) {
      expect(range!.low, `${ion} low`).toBeGreaterThanOrEqual(0);
    }
  });

  it('has expected ions', () => {
    const expected = ['NO3', 'NH4', 'H2PO4', 'K', 'Ca', 'Mg', 'SO4', 'Fe', 'Mn', 'B', 'Zn', 'Cu', 'Mo'];
    for (const ion of expected) {
      expect(NUTRIENT_RANGES[ion as keyof typeof NUTRIENT_RANGES], ion).toBeDefined();
    }
  });
});

describe('checkRange', () => {
  it('returns "low" below range', () => {
    expect(checkRange('K', 50)).toBe('low'); // range: 150-350
  });

  it('returns "ok" within range', () => {
    expect(checkRange('K', 200)).toBe('ok');
  });

  it('returns "high" above range', () => {
    expect(checkRange('K', 400)).toBe('high');
  });

  it('returns "ok" at exact low boundary', () => {
    expect(checkRange('K', 150)).toBe('ok');
  });

  it('returns "ok" at exact high boundary', () => {
    expect(checkRange('K', 350)).toBe('ok');
  });

  it('returns null for ion without range (Na)', () => {
    expect(checkRange('Na', 10)).toBeNull();
  });

  it('returns null for ion without range (Cl)', () => {
    expect(checkRange('Cl', 10)).toBeNull();
  });

  it('returns null for Si', () => {
    expect(checkRange('Si', 10)).toBeNull();
  });
});
