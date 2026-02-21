import { describe, it, expect } from 'vitest';
import { solveForTarget, type SolverTarget } from './solver';
import { CHEMICALS, CHEMICAL_MAP } from './chemicals';
import { calcSolution } from './engine';
import { HOAGLAND_CHEMICALS } from '../test/fixtures';

describe('solveForTarget', () => {
  it('returns empty result for empty targets', () => {
    const result = solveForTarget([], CHEMICALS);
    expect(result.chemicals).toHaveLength(0);
    expect(result.residual).toBe(0);
  });

  it('returns empty result for empty chemicals', () => {
    const targets: SolverTarget[] = [{ ion: 'K', ppm: 200 }];
    const result = solveForTarget(targets, []);
    expect(result.chemicals).toHaveLength(0);
    expect(result.residual).toBe(0);
  });

  it('returns empty result for all-zero targets', () => {
    const targets: SolverTarget[] = [{ ion: 'K', ppm: 0 }];
    const result = solveForTarget(targets, CHEMICALS);
    expect(result.chemicals).toHaveLength(0);
  });

  it('single ion / single chemical: K from KNO₃', () => {
    const targets: SolverTarget[] = [{ ion: 'K', ppm: 39.098 }]; // 1 mmol/L
    const kno3 = CHEMICAL_MAP.get('potassium-nitrate')!;
    const result = solveForTarget(targets, [kno3]);

    expect(result.chemicals).toHaveLength(1);
    expect(result.chemicals[0].chemicalId).toBe('potassium-nitrate');
    // Should be ~101.102 mg/L (1 mmol/L)
    expect(result.chemicals[0].mgPerL).toBeCloseTo(101.102, 0);
  });

  it('all amounts are non-negative', () => {
    const targets: SolverTarget[] = [
      { ion: 'NO3', ppm: 112 },
      { ion: 'K', ppm: 247 },
      { ion: 'Ca', ppm: 160 },
      { ion: 'Mg', ppm: 49 },
    ];
    const result = solveForTarget(targets, CHEMICALS.filter((c) => c.category === 'macro'));
    for (const c of result.chemicals) {
      expect(c.mgPerL, `${c.chemicalId}`).toBeGreaterThanOrEqual(0);
    }
  });

  it('Hoagland round-trip: solver recreates similar recipe', () => {
    // Calculate Hoagland targets
    const hoaglandResult = calcSolution(HOAGLAND_CHEMICALS);
    const targets: SolverTarget[] = hoaglandResult.totals
      .filter((t) => t.ppm > 0.001)
      .map((t) => ({ ion: t.ion, ppm: t.ppm }));

    // Solve with all chemicals
    const result = solveForTarget(targets, CHEMICALS);

    // Achieved should be close to targets for major ions
    const achievedMap = new Map(result.achieved.map((a) => [a.ion, a.ppm]));
    const targetMap = new Map(targets.map((t) => [t.ion, t.ppm]));

    // Check macro nutrients within 5%
    for (const ion of ['NO3', 'K', 'Ca', 'Mg'] as const) {
      const target = targetMap.get(ion)!;
      const achieved = achievedMap.get(ion) ?? 0;
      const error = Math.abs(achieved - target) / target;
      expect(error, `${ion}: ${achieved.toFixed(1)} vs ${target.toFixed(1)}`).toBeLessThan(0.05);
    }
  });

  it('residual is small for well-constrained problem', () => {
    const targets: SolverTarget[] = [
      { ion: 'NO3', ppm: 112 },
      { ion: 'K', ppm: 200 },
      { ion: 'Ca', ppm: 160 },
    ];
    const macroChems = CHEMICALS.filter((c) => c.category === 'macro');
    const result = solveForTarget(targets, macroChems);

    // Residual (sum of squared relative errors) should be small
    expect(result.residual).toBeLessThan(1.0);
  });

  it('micro targets are addressed', () => {
    const targets: SolverTarget[] = [
      { ion: 'Fe', ppm: 2.8 },
      { ion: 'B', ppm: 0.5 },
      { ion: 'Mn', ppm: 0.5 },
    ];
    const microChems = CHEMICALS.filter((c) => c.category === 'micro');
    const result = solveForTarget(targets, microChems);

    expect(result.chemicals.length).toBeGreaterThan(0);
    const achievedFe = result.achieved.find((a) => a.ion === 'Fe');
    expect(achievedFe?.ppm).toBeGreaterThan(0);
  });

  it('achieved concentrations are computed correctly', () => {
    const targets: SolverTarget[] = [{ ion: 'K', ppm: 100 }];
    const kno3 = CHEMICAL_MAP.get('potassium-nitrate')!;
    const result = solveForTarget(targets, [kno3]);

    // Verify achieved totals are consistent
    expect(result.achieved.length).toBe(16); // all ions
    const kAchieved = result.achieved.find((a) => a.ion === 'K');
    expect(kAchieved?.ppm).toBeGreaterThan(0);
  });

  it('handles two-ion single-chemical correctly', () => {
    // Target both K and NO3 → should use KNO3
    const targets: SolverTarget[] = [
      { ion: 'K', ppm: 39.098 },
      { ion: 'NO3', ppm: 14.007 },
    ];
    const kno3 = CHEMICAL_MAP.get('potassium-nitrate')!;
    const result = solveForTarget(targets, [kno3]);
    expect(result.chemicals).toHaveLength(1);
    expect(result.chemicals[0].mgPerL).toBeCloseTo(101.102, 0);
  });

  it('produces result object with correct shape', () => {
    const targets: SolverTarget[] = [{ ion: 'K', ppm: 200 }];
    const result = solveForTarget(targets, CHEMICALS);
    expect(result).toHaveProperty('chemicals');
    expect(result).toHaveProperty('achieved');
    expect(result).toHaveProperty('residual');
    expect(Array.isArray(result.chemicals)).toBe(true);
    expect(Array.isArray(result.achieved)).toBe(true);
    expect(typeof result.residual).toBe('number');
  });
});
