import type { ChemicalInput, IonConcentration } from '../lib/types';

/** Hoagland recipe chemicals (same as RECIPES[0]) */
export const HOAGLAND_CHEMICALS: ChemicalInput[] = [
  { chemicalId: 'calcium-nitrate', mgPerL: 945 },
  { chemicalId: 'potassium-nitrate', mgPerL: 506 },
  { chemicalId: 'monopotassium-phosphate', mgPerL: 136 },
  { chemicalId: 'magnesium-sulfate', mgPerL: 493 },
  { chemicalId: 'fe-edta', mgPerL: 21.1 },
  { chemicalId: 'boric-acid', mgPerL: 2.86 },
  { chemicalId: 'manganese-sulfate', mgPerL: 1.54 },
  { chemicalId: 'zinc-sulfate', mgPerL: 0.22 },
  { chemicalId: 'copper-sulfate', mgPerL: 0.08 },
  { chemicalId: 'sodium-molybdate', mgPerL: 0.02 },
];

/** Simple single-chemical input for focused testing */
export const SINGLE_KNO3: ChemicalInput = {
  chemicalId: 'potassium-nitrate',
  mgPerL: 101.102, // 1 mmol/L
};

/** Simple single-chemical: CaNO3·4H2O at 1 mmol/L */
export const SINGLE_CALCIUM_NITRATE: ChemicalInput = {
  chemicalId: 'calcium-nitrate',
  mgPerL: 236.146, // 1 mmol/L
};

/** Zero-ion totals for testing edge cases */
export const ZERO_TOTALS: IonConcentration[] = [
  { ion: 'NO3', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'NH4', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'H2PO4', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'K', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'Ca', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'Mg', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'SO4', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'Fe', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'Mn', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'B', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'Zn', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'Cu', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'Mo', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'Na', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'Cl', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'Si', mmolPerL: 0, ppm: 0, mePerL: 0 },
];

/** A sample totals array from roughly Hoagland recipe for display component tests */
export const SAMPLE_TOTALS: IonConcentration[] = [
  { ion: 'NO3', mmolPerL: 8.0, ppm: 112.06, mePerL: 8.0 },
  { ion: 'NH4', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'H2PO4', mmolPerL: 1.0, ppm: 30.97, mePerL: 1.0 },
  { ion: 'K', mmolPerL: 6.3, ppm: 246.32, mePerL: 6.3 },
  { ion: 'Ca', mmolPerL: 4.0, ppm: 160.31, mePerL: 8.0 },
  { ion: 'Mg', mmolPerL: 2.0, ppm: 48.61, mePerL: 4.0 },
  { ion: 'SO4', mmolPerL: 2.0, ppm: 64.13, mePerL: 4.0 },
  { ion: 'Fe', mmolPerL: 0.05, ppm: 2.79, mePerL: 0.1 },
  { ion: 'Mn', mmolPerL: 0.009, ppm: 0.50, mePerL: 0.018 },
  { ion: 'B', mmolPerL: 0.046, ppm: 0.50, mePerL: 0.139 },
  { ion: 'Zn', mmolPerL: 0.001, ppm: 0.05, mePerL: 0.002 },
  { ion: 'Cu', mmolPerL: 0.0003, ppm: 0.02, mePerL: 0.0006 },
  { ion: 'Mo', mmolPerL: 0.00008, ppm: 0.008, mePerL: 0.00016 },
  { ion: 'Na', mmolPerL: 0.05, ppm: 1.15, mePerL: 0.05 },
  { ion: 'Cl', mmolPerL: 0, ppm: 0, mePerL: 0 },
  { ion: 'Si', mmolPerL: 0, ppm: 0, mePerL: 0 },
];
