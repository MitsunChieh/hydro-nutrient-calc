import { describe, it, expect } from 'vitest';
import { roundTo, ppmToMePerL, mePerLToPpm } from './units';

describe('roundTo', () => {
  it('rounds to 0 decimal places', () => {
    expect(roundTo(3.7, 0)).toBe(4);
    expect(roundTo(3.2, 0)).toBe(3);
  });

  it('rounds to 2 decimal places', () => {
    expect(roundTo(3.456, 2)).toBe(3.46);
    expect(roundTo(3.454, 2)).toBe(3.45);
  });

  it('rounds to 3 decimal places', () => {
    expect(roundTo(1.2345, 3)).toBe(1.235);
  });

  it('handles zero', () => {
    expect(roundTo(0, 2)).toBe(0);
  });

  it('handles negative numbers', () => {
    expect(roundTo(-3.456, 2)).toBe(-3.46);
  });
});

describe('ppmToMePerL', () => {
  it('converts K ppm to me/L (monovalent)', () => {
    // K: atomicWeight = 39.098, valence = 1
    // 39.098 ppm → 1 mmol/L → 1 me/L
    const result = ppmToMePerL('K', 39.098);
    expect(result).toBeCloseTo(1.0, 3);
  });

  it('converts Ca ppm to me/L (divalent)', () => {
    // Ca: atomicWeight = 40.078, valence = 2
    // 40.078 ppm → 1 mmol/L → 2 me/L
    const result = ppmToMePerL('Ca', 40.078);
    expect(result).toBeCloseTo(2.0, 3);
  });

  it('converts NO3-N ppm to me/L', () => {
    // NO3: atomicWeight = 14.007 (N), valence = 1
    // 14.007 ppm → 1 mmol/L → 1 me/L
    const result = ppmToMePerL('NO3', 14.007);
    expect(result).toBeCloseTo(1.0, 3);
  });

  it('converts SO4-S ppm to me/L (divalent)', () => {
    // SO4: atomicWeight = 32.065 (S), valence = 2
    // 32.065 ppm → 1 mmol/L → 2 me/L
    const result = ppmToMePerL('SO4', 32.065);
    expect(result).toBeCloseTo(2.0, 3);
  });

  it('returns 0 for zero ppm', () => {
    expect(ppmToMePerL('K', 0)).toBe(0);
  });

  it('Si returns 0 me/L (uncharged)', () => {
    // Si has valence 0, but ppm / atomicWeight * 0 = 0
    const result = ppmToMePerL('Si', 28.085);
    expect(result).toBe(0);
  });
});

describe('mePerLToPpm', () => {
  it('converts K me/L to ppm (monovalent)', () => {
    // 1 me/L → 1 mmol/L → 39.098 ppm
    const result = mePerLToPpm('K', 1.0);
    expect(result).toBeCloseTo(39.098, 2);
  });

  it('converts Ca me/L to ppm (divalent)', () => {
    // 2 me/L → 1 mmol/L → 40.078 ppm
    const result = mePerLToPpm('Ca', 2.0);
    expect(result).toBeCloseTo(40.078, 2);
  });

  it('returns 0 for zero me/L', () => {
    expect(mePerLToPpm('K', 0)).toBe(0);
  });

  it('returns 0 for Si (valence 0)', () => {
    expect(mePerLToPpm('Si', 1.0)).toBe(0);
  });

  it('round-trip: ppm → me/L → ppm', () => {
    const originalPpm = 150;
    const mePerL = ppmToMePerL('K', originalPpm);
    const backPpm = mePerLToPpm('K', mePerL);
    expect(backPpm).toBeCloseTo(originalPpm, 5);
  });

  it('round-trip for divalent Ca', () => {
    const originalPpm = 200;
    const mePerL = ppmToMePerL('Ca', originalPpm);
    const backPpm = mePerLToPpm('Ca', mePerL);
    expect(backPpm).toBeCloseTo(originalPpm, 5);
  });
});
