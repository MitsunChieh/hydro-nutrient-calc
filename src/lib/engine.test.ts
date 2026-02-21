import { describe, it, expect } from 'vitest';
import { calcChemicalIons, calcSolution, estimateEC } from './engine';
import { HOAGLAND_CHEMICALS, SINGLE_KNO3, SINGLE_CALCIUM_NITRATE } from '../test/fixtures';

describe('calcChemicalIons', () => {
  it('throws for unknown chemical', () => {
    expect(() => calcChemicalIons('nonexistent', 100)).toThrow('Unknown chemical: nonexistent');
  });

  it('returns zero ions for 0 mg/L', () => {
    const result = calcChemicalIons('potassium-nitrate', 0);
    expect(result.mgPerL).toBe(0);
    expect(result.mmolPerL).toBe(0);
    for (const ion of result.ions) {
      expect(ion.ppm).toBe(0);
      expect(ion.mePerL).toBe(0);
    }
  });

  it('KNO₃ at 1 mmol/L: K and NO3-N ppm', () => {
    // 1 mmol/L KNO₃ = 101.102 mg/L
    const result = calcChemicalIons('potassium-nitrate', 101.102);
    expect(result.mmolPerL).toBeCloseTo(1.0, 3);

    const k = result.ions.find((i) => i.ion === 'K')!;
    const no3 = result.ions.find((i) => i.ion === 'NO3')!;

    // K: 1 mmol/L × 39.098 g/mol = 39.098 ppm
    expect(k.ppm).toBeCloseTo(39.098, 2);
    expect(k.mmolPerL).toBeCloseTo(1.0, 3);
    expect(k.mePerL).toBeCloseTo(1.0, 3); // valence 1

    // NO3-N: 1 mmol/L × 14.007 g/mol = 14.007 ppm
    expect(no3.ppm).toBeCloseTo(14.007, 2);
    expect(no3.mmolPerL).toBeCloseTo(1.0, 3);
    expect(no3.mePerL).toBeCloseTo(1.0, 3); // valence 1
  });

  it('Ca(NO₃)₂·4H₂O at 1 mmol/L: Ca and NO3-N ppm', () => {
    // 1 mmol/L = 236.146 mg/L
    const result = calcChemicalIons('calcium-nitrate', 236.146);
    expect(result.mmolPerL).toBeCloseTo(1.0, 3);

    const ca = result.ions.find((i) => i.ion === 'Ca')!;
    const no3 = result.ions.find((i) => i.ion === 'NO3')!;

    // Ca: 1 × 40.078 = 40.078 ppm
    expect(ca.ppm).toBeCloseTo(40.078, 2);
    expect(ca.mePerL).toBeCloseTo(2.0, 3); // valence 2

    // NO3: coefficient=2, so 2 mmol/L × 14.007 = 28.014 ppm
    expect(no3.ppm).toBeCloseTo(28.014, 2);
    expect(no3.mmolPerL).toBeCloseTo(2.0, 3);
  });

  it('MgSO₄·7H₂O at 1 mmol/L', () => {
    const result = calcChemicalIons('magnesium-sulfate', 246.471);
    const mg = result.ions.find((i) => i.ion === 'Mg')!;
    const so4 = result.ions.find((i) => i.ion === 'SO4')!;

    expect(mg.ppm).toBeCloseTo(24.305, 2);
    expect(mg.mePerL).toBeCloseTo(2.0, 3);
    expect(so4.ppm).toBeCloseTo(32.065, 2);
    expect(so4.mePerL).toBeCloseTo(2.0, 3);
  });

  it('boric acid: coefficient 1 for B', () => {
    const result = calcChemicalIons('boric-acid', 61.831); // 1 mmol/L
    const b = result.ions.find((i) => i.ion === 'B')!;
    expect(b.ppm).toBeCloseTo(10.81, 2);
    expect(b.mmolPerL).toBeCloseTo(1.0, 3);
  });

  it('returns correct chemicalId and mgPerL', () => {
    const result = calcChemicalIons('potassium-nitrate', 500);
    expect(result.chemicalId).toBe('potassium-nitrate');
    expect(result.mgPerL).toBe(500);
  });
});

describe('calcSolution', () => {
  it('returns empty totals for empty inputs', () => {
    const result = calcSolution([]);
    expect(result.breakdowns).toHaveLength(0);
    expect(result.totals).toHaveLength(16); // all ions
    for (const t of result.totals) {
      expect(t.ppm).toBe(0);
    }
  });

  it('single chemical matches calcChemicalIons', () => {
    const result = calcSolution([SINGLE_KNO3]);
    expect(result.breakdowns).toHaveLength(1);

    const k = result.totals.find((t) => t.ion === 'K')!;
    expect(k.ppm).toBeCloseTo(39.098, 2);
  });

  it('aggregates ions from multiple chemicals correctly', () => {
    // KNO3 + Ca(NO3)2·4H2O — both contribute NO3
    const result = calcSolution([SINGLE_KNO3, SINGLE_CALCIUM_NITRATE]);

    const no3 = result.totals.find((t) => t.ion === 'NO3')!;
    // KNO3: 1 mmol/L NO3, Ca(NO3)2: 2 mmol/L NO3 → total 3 mmol/L
    expect(no3.mmolPerL).toBeCloseTo(3.0, 2);
    expect(no3.ppm).toBeCloseTo(3.0 * 14.007, 1);
  });

  it('Hoagland recipe regression: NO3-N ~ 182 ppm', () => {
    const result = calcSolution(HOAGLAND_CHEMICALS);
    const no3 = result.totals.find((t) => t.ion === 'NO3')!;
    // Ca(NO3)2 contributes ~112 ppm N, KNO3 contributes ~70 ppm N → total ~182
    expect(no3.ppm).toBeGreaterThan(170);
    expect(no3.ppm).toBeLessThan(195);
  });

  it('Hoagland recipe regression: K ~ 247 ppm', () => {
    const result = calcSolution(HOAGLAND_CHEMICALS);
    const k = result.totals.find((t) => t.ion === 'K')!;
    expect(k.ppm).toBeGreaterThan(220);
    expect(k.ppm).toBeLessThan(270);
  });

  it('Hoagland recipe regression: Ca ~ 160 ppm', () => {
    const result = calcSolution(HOAGLAND_CHEMICALS);
    const ca = result.totals.find((t) => t.ion === 'Ca')!;
    expect(ca.ppm).toBeGreaterThan(140);
    expect(ca.ppm).toBeLessThan(180);
  });

  it('Hoagland recipe regression: Mg ~ 49 ppm', () => {
    const result = calcSolution(HOAGLAND_CHEMICALS);
    const mg = result.totals.find((t) => t.ion === 'Mg')!;
    expect(mg.ppm).toBeGreaterThan(40);
    expect(mg.ppm).toBeLessThan(60);
  });

  it('totals include all 16 ions', () => {
    const result = calcSolution(HOAGLAND_CHEMICALS);
    expect(result.totals).toHaveLength(16);
  });

  it('breakdowns count matches input count', () => {
    const result = calcSolution(HOAGLAND_CHEMICALS);
    expect(result.breakdowns).toHaveLength(HOAGLAND_CHEMICALS.length);
  });
});

describe('estimateEC', () => {
  it('returns 0 for zero totals', () => {
    const totals = [{ ion: 'K' as const, mmolPerL: 0, ppm: 0, mePerL: 0 }];
    expect(estimateEC(totals)).toBe(0);
  });

  it('Hoagland recipe EC is in 1.5-2.5 mS/cm range', () => {
    const result = calcSolution(HOAGLAND_CHEMICALS);
    const ec = estimateEC(result.totals);
    expect(ec).toBeGreaterThan(1.5);
    expect(ec).toBeLessThan(2.5);
  });

  it('EC increases with concentration', () => {
    const low = calcSolution([{ chemicalId: 'potassium-nitrate', mgPerL: 100 }]);
    const high = calcSolution([{ chemicalId: 'potassium-nitrate', mgPerL: 500 }]);
    expect(estimateEC(high.totals)).toBeGreaterThan(estimateEC(low.totals));
  });

  it('returns positive value for any nonzero input', () => {
    const result = calcSolution([{ chemicalId: 'potassium-nitrate', mgPerL: 10 }]);
    expect(estimateEC(result.totals)).toBeGreaterThan(0);
  });

  it('ignores ions without molar conductivity', () => {
    // B has no molar conductivity entry
    const totals = [{ ion: 'B' as const, mmolPerL: 1.0, ppm: 10.81, mePerL: 3.0 }];
    expect(estimateEC(totals)).toBe(0);
  });
});
