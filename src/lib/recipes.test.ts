import { describe, it, expect } from 'vitest';
import { RECIPES, RECIPE_MAP } from './recipes';
import { CHEMICAL_MAP } from './chemicals';
import { calcSolution, estimateEC } from './engine';

describe('RECIPES', () => {
  it('contains 5 recipes', () => {
    expect(RECIPES).toHaveLength(5);
  });

  it('all IDs are unique', () => {
    const ids = RECIPES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all have non-empty name and description', () => {
    for (const r of RECIPES) {
      expect(r.name.length, `${r.id} name`).toBeGreaterThan(0);
      expect(r.description.length, `${r.id} description`).toBeGreaterThan(0);
    }
  });

  it('all chemicals reference valid chemical IDs', () => {
    for (const r of RECIPES) {
      for (const c of r.chemicals) {
        expect(CHEMICAL_MAP.has(c.chemicalId), `${r.id}: ${c.chemicalId}`).toBe(true);
      }
    }
  });

  it('all have positive mg/L amounts', () => {
    for (const r of RECIPES) {
      for (const c of r.chemicals) {
        expect(c.mgPerL, `${r.id}/${c.chemicalId}`).toBeGreaterThan(0);
      }
    }
  });

  it('all have at least 5 chemicals', () => {
    for (const r of RECIPES) {
      expect(r.chemicals.length, `${r.id}`).toBeGreaterThanOrEqual(5);
    }
  });

  it('EC range sanity check: 1.0–3.5 mS/cm for all recipes', () => {
    for (const r of RECIPES) {
      const result = calcSolution(r.chemicals);
      const ec = estimateEC(result.totals);
      expect(ec, `${r.id} EC`).toBeGreaterThan(1.0);
      expect(ec, `${r.id} EC`).toBeLessThan(3.5);
    }
  });

  it('all recipes produce nonzero NO3-N', () => {
    for (const r of RECIPES) {
      const result = calcSolution(r.chemicals);
      const no3 = result.totals.find((t) => t.ion === 'NO3');
      expect(no3?.ppm, `${r.id} NO3-N`).toBeGreaterThan(50);
    }
  });

  it('expected recipe IDs', () => {
    const ids = RECIPES.map((r) => r.id);
    expect(ids).toContain('hoagland');
    expect(ids).toContain('lettuce');
    expect(ids).toContain('leafy-greens');
    expect(ids).toContain('tomato');
    expect(ids).toContain('strawberry');
  });
});

describe('RECIPE_MAP', () => {
  it('has same size as RECIPES', () => {
    expect(RECIPE_MAP.size).toBe(RECIPES.length);
  });

  it('lookup by ID returns correct recipe', () => {
    const hoagland = RECIPE_MAP.get('hoagland');
    expect(hoagland?.name).toBe('Hoagland Solution');
  });
});
