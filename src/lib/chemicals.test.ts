import { describe, it, expect } from 'vitest';
import { CHEMICALS, CHEMICAL_MAP } from './chemicals';
import { ALL_IONS } from './constants';

describe('CHEMICALS', () => {
  it('contains 32 chemicals', () => {
    expect(CHEMICALS).toHaveLength(32);
  });

  it('all IDs are unique', () => {
    const ids = CHEMICALS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all have valid categories', () => {
    const valid = new Set(['macro', 'micro', 'acid', 'base']);
    for (const c of CHEMICALS) {
      expect(valid.has(c.category), `${c.id} category: ${c.category}`).toBe(true);
    }
  });

  it('all have positive molecular weight', () => {
    for (const c of CHEMICALS) {
      expect(c.molecularWeight, `${c.id}`).toBeGreaterThan(0);
    }
  });

  it('all ions reference valid IonIds', () => {
    const ionSet = new Set(ALL_IONS);
    for (const c of CHEMICALS) {
      for (const ic of c.ions) {
        expect(ionSet.has(ic.ion), `${c.id} → ${ic.ion}`).toBe(true);
        expect(ic.coefficient, `${c.id} → ${ic.ion} coeff`).toBeGreaterThan(0);
      }
    }
  });

  it('all have at least one ion contribution', () => {
    for (const c of CHEMICALS) {
      expect(c.ions.length, `${c.id} should have ions`).toBeGreaterThanOrEqual(1);
    }
  });

  // Hand-calculated MW spot checks
  it('KNO₃ MW = 101.102', () => {
    const kno3 = CHEMICAL_MAP.get('potassium-nitrate')!;
    // 39.098 + 14.007 + 3*15.999 = 101.102
    expect(kno3.molecularWeight).toBeCloseTo(101.102, 2);
  });

  it('MgSO₄·7H₂O MW = 246.471', () => {
    const mgso4 = CHEMICAL_MAP.get('magnesium-sulfate')!;
    // 24.305 + 32.065 + 4*15.999 + 7*18.015 = 246.471
    expect(mgso4.molecularWeight).toBeCloseTo(246.471, 2);
  });

  it('Ca(NO₃)₂·4H₂O MW = 236.146', () => {
    const cano3 = CHEMICAL_MAP.get('calcium-nitrate')!;
    // 40.078 + 2*(14.007 + 3*15.999) + 4*18.015 = 236.146
    expect(cano3.molecularWeight).toBeCloseTo(236.146, 2);
  });

  it('H₃BO₃ MW = 61.831', () => {
    const boric = CHEMICAL_MAP.get('boric-acid')!;
    // 3*1.008 + 10.81 + 3*15.999 = 61.831
    expect(boric.molecularWeight).toBeCloseTo(61.831, 2);
  });

  it('KH₂PO₄ MW = 136.084', () => {
    const mkp = CHEMICAL_MAP.get('monopotassium-phosphate')!;
    // 39.098 + 2*1.008 + 30.974 + 4*15.999 = 136.084
    expect(mkp.molecularWeight).toBeCloseTo(136.084, 2);
  });
});

describe('CHEMICAL_MAP', () => {
  it('has same size as CHEMICALS array', () => {
    expect(CHEMICAL_MAP.size).toBe(CHEMICALS.length);
  });

  it('all entries accessible by ID', () => {
    for (const c of CHEMICALS) {
      expect(CHEMICAL_MAP.get(c.id)).toBe(c);
    }
  });

  it('returns undefined for unknown ID', () => {
    expect(CHEMICAL_MAP.get('nonexistent')).toBeUndefined();
  });
});
