import { describe, it, expect } from 'vitest';
import { ATOMIC_WEIGHT, ION_ELEMENT_MAP, ION_VALENCE, ALL_IONS } from './constants';

describe('ATOMIC_WEIGHT', () => {
  it('contains 18 elements', () => {
    expect(Object.keys(ATOMIC_WEIGHT)).toHaveLength(18);
  });

  it('has correct values for key elements', () => {
    expect(ATOMIC_WEIGHT.H).toBe(1.008);
    expect(ATOMIC_WEIGHT.N).toBe(14.007);
    expect(ATOMIC_WEIGHT.O).toBe(15.999);
    expect(ATOMIC_WEIGHT.K).toBe(39.098);
    expect(ATOMIC_WEIGHT.Ca).toBe(40.078);
    expect(ATOMIC_WEIGHT.Fe).toBe(55.845);
    expect(ATOMIC_WEIGHT.S).toBe(32.065);
    expect(ATOMIC_WEIGHT.P).toBe(30.974);
  });

  it('all values are positive numbers', () => {
    for (const [key, val] of Object.entries(ATOMIC_WEIGHT)) {
      expect(val, `${key}`).toBeGreaterThan(0);
      expect(typeof val).toBe('number');
    }
  });
});

describe('ION_ELEMENT_MAP', () => {
  it('contains 16 ions', () => {
    expect(Object.keys(ION_ELEMENT_MAP)).toHaveLength(16);
  });

  it('maps NO3 to N with correct atomic weight', () => {
    expect(ION_ELEMENT_MAP.NO3.element).toBe('N_NO3');
    expect(ION_ELEMENT_MAP.NO3.atomicWeight).toBe(ATOMIC_WEIGHT.N);
  });

  it('maps Ca to Ca with correct atomic weight', () => {
    expect(ION_ELEMENT_MAP.Ca.element).toBe('Ca');
    expect(ION_ELEMENT_MAP.Ca.atomicWeight).toBe(ATOMIC_WEIGHT.Ca);
  });

  it('all ions reference valid atomic weights', () => {
    for (const [ionId, mapping] of Object.entries(ION_ELEMENT_MAP)) {
      expect(mapping.atomicWeight, `${ionId}`).toBeGreaterThan(0);
    }
  });
});

describe('ION_VALENCE', () => {
  it('contains 16 ions', () => {
    expect(Object.keys(ION_VALENCE)).toHaveLength(16);
  });

  it('monovalent ions', () => {
    expect(ION_VALENCE.NO3).toBe(1);
    expect(ION_VALENCE.NH4).toBe(1);
    expect(ION_VALENCE.K).toBe(1);
    expect(ION_VALENCE.Na).toBe(1);
    expect(ION_VALENCE.Cl).toBe(1);
    expect(ION_VALENCE.H2PO4).toBe(1);
  });

  it('divalent ions', () => {
    expect(ION_VALENCE.Ca).toBe(2);
    expect(ION_VALENCE.Mg).toBe(2);
    expect(ION_VALENCE.SO4).toBe(2);
    expect(ION_VALENCE.Fe).toBe(2);
  });

  it('Si is uncharged', () => {
    expect(ION_VALENCE.Si).toBe(0);
  });

  it('all valences are non-negative integers', () => {
    for (const [key, val] of Object.entries(ION_VALENCE)) {
      expect(val, `${key}`).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(val), `${key} should be integer`).toBe(true);
    }
  });
});

describe('ALL_IONS', () => {
  it('contains 16 ions', () => {
    expect(ALL_IONS).toHaveLength(16);
  });

  it('has no duplicates', () => {
    expect(new Set(ALL_IONS).size).toBe(ALL_IONS.length);
  });

  it('matches ION_ELEMENT_MAP keys', () => {
    const mapKeys = new Set(Object.keys(ION_ELEMENT_MAP));
    for (const ion of ALL_IONS) {
      expect(mapKeys.has(ion), `${ion} should be in ION_ELEMENT_MAP`).toBe(true);
    }
  });

  it('matches ION_VALENCE keys', () => {
    const valenceKeys = new Set(Object.keys(ION_VALENCE));
    for (const ion of ALL_IONS) {
      expect(valenceKeys.has(ion), `${ion} should be in ION_VALENCE`).toBe(true);
    }
  });
});
