import type { IonId, ElementId } from './types';

// Atomic weights (g/mol) — IUPAC 2021 standard values
// S uses 32.065 (midpoint of IUPAC interval [32.059, 32.076]) to match PubChem
export const ATOMIC_WEIGHT: Record<string, number> = {
  H: 1.008,
  B: 10.81,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  Na: 22.990,
  Mg: 24.305,
  Si: 28.085,
  P: 30.974,
  S: 32.065,
  Cl: 35.45,
  K: 39.098,
  Ca: 40.078,
  Mn: 54.938,
  Fe: 55.845,
  Cu: 63.546,
  Zn: 65.38,
  Mo: 95.95,
};

// Map each ion to its reporting element and the element's atomic weight
// ppm is reported as mg/L of the element, not the ion
export const ION_ELEMENT_MAP: Record<IonId, { element: ElementId; atomicWeight: number }> = {
  NO3:   { element: 'N_NO3', atomicWeight: ATOMIC_WEIGHT.N },
  NH4:   { element: 'N_NH4', atomicWeight: ATOMIC_WEIGHT.N },
  H2PO4: { element: 'P',     atomicWeight: ATOMIC_WEIGHT.P },
  K:     { element: 'K',     atomicWeight: ATOMIC_WEIGHT.K },
  Ca:    { element: 'Ca',    atomicWeight: ATOMIC_WEIGHT.Ca },
  Mg:    { element: 'Mg',    atomicWeight: ATOMIC_WEIGHT.Mg },
  SO4:   { element: 'S',     atomicWeight: ATOMIC_WEIGHT.S },
  Fe:    { element: 'Fe',    atomicWeight: ATOMIC_WEIGHT.Fe },
  Mn:    { element: 'Mn',    atomicWeight: ATOMIC_WEIGHT.Mn },
  B:     { element: 'B',     atomicWeight: ATOMIC_WEIGHT.B },
  Zn:    { element: 'Zn',    atomicWeight: ATOMIC_WEIGHT.Zn },
  Cu:    { element: 'Cu',    atomicWeight: ATOMIC_WEIGHT.Cu },
  Mo:    { element: 'Mo',    atomicWeight: ATOMIC_WEIGHT.Mo },
  Na:    { element: 'Na',    atomicWeight: ATOMIC_WEIGHT.Na },
  Cl:    { element: 'Cl',    atomicWeight: ATOMIC_WEIGHT.Cl },
  Si:    { element: 'Si',    atomicWeight: ATOMIC_WEIGHT.Si },
};

// Ion valence (absolute value) for me/L calculation
// me/L = mmol/L × |valence|
export const ION_VALENCE: Record<IonId, number> = {
  NO3: 1,    // NO₃⁻
  NH4: 1,    // NH₄⁺
  H2PO4: 1,  // H₂PO₄⁻ (monovalent at hydroponic pH ~5.5–6.5)
  K: 1,      // K⁺
  Ca: 2,     // Ca²⁺
  Mg: 2,     // Mg²⁺
  SO4: 2,    // SO₄²⁻
  Fe: 2,     // Fe²⁺ (chelated, treated as Fe²⁺ for me/L)
  Mn: 2,     // Mn²⁺
  B: 3,      // B(OH)₃ — agricultural convention uses valence 3
  Zn: 2,     // Zn²⁺
  Cu: 2,     // Cu²⁺
  Mo: 2,     // MoO₄²⁻ — ionic charge 2
  Na: 1,     // Na⁺
  Cl: 1,     // Cl⁻
  Si: 0,     // H₄SiO₄ — uncharged at hydroponic pH
};

// All tracked ion IDs for iteration
export const ALL_IONS: IonId[] = [
  'NO3', 'NH4', 'H2PO4', 'K', 'Ca', 'Mg', 'SO4',
  'Fe', 'Mn', 'B', 'Zn', 'Cu', 'Mo', 'Na', 'Cl', 'Si',
];
