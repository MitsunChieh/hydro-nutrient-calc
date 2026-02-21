import type { Recipe } from './types';

/**
 * 5 preset hydroponic recipes for MVP.
 *
 * Chemical amounts are in mg/L (ppm of the salt).
 * Targets are computed by calcSolution() from these exact amounts
 * and rounded for display.
 *
 * Fe-EDTA amounts are for the trihydrate form (MW 421.09).
 */
export const RECIPES: Recipe[] = [
  {
    id: 'hoagland',
    name: 'Hoagland Solution',
    description: 'Classic full-strength Hoagland solution — general purpose reference.',
    chemicals: [
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
    ],

  },
  {
    id: 'lettuce',
    name: 'Lettuce',
    description: 'Optimized for head and leaf lettuce — moderate EC.',
    chemicals: [
      { chemicalId: 'calcium-nitrate', mgPerL: 750 },
      { chemicalId: 'potassium-nitrate', mgPerL: 350 },
      { chemicalId: 'monopotassium-phosphate', mgPerL: 120 },
      { chemicalId: 'magnesium-sulfate', mgPerL: 400 },
      { chemicalId: 'fe-edta', mgPerL: 17.2 },
      { chemicalId: 'boric-acid', mgPerL: 1.8 },
      { chemicalId: 'manganese-sulfate', mgPerL: 1.2 },
      { chemicalId: 'zinc-sulfate', mgPerL: 0.25 },
      { chemicalId: 'copper-sulfate', mgPerL: 0.05 },
      { chemicalId: 'sodium-molybdate', mgPerL: 0.02 },
    ],

  },
  {
    id: 'leafy-greens',
    name: 'Leafy Greens',
    description: 'Balanced formula for spinach, kale, chard, and other leafy greens.',
    chemicals: [
      { chemicalId: 'calcium-nitrate', mgPerL: 810 },
      { chemicalId: 'potassium-nitrate', mgPerL: 400 },
      { chemicalId: 'monopotassium-phosphate', mgPerL: 130 },
      { chemicalId: 'magnesium-sulfate', mgPerL: 450 },
      { chemicalId: 'fe-edta', mgPerL: 18.4 },
      { chemicalId: 'boric-acid', mgPerL: 2.0 },
      { chemicalId: 'manganese-sulfate', mgPerL: 1.3 },
      { chemicalId: 'zinc-sulfate', mgPerL: 0.22 },
      { chemicalId: 'copper-sulfate', mgPerL: 0.06 },
      { chemicalId: 'sodium-molybdate', mgPerL: 0.02 },
    ],

  },
  {
    id: 'tomato',
    name: 'Tomato',
    description: 'High-K formula for tomato fruiting stage — higher EC.',
    chemicals: [
      { chemicalId: 'calcium-nitrate', mgPerL: 900 },
      { chemicalId: 'potassium-nitrate', mgPerL: 550 },
      { chemicalId: 'monopotassium-phosphate', mgPerL: 150 },
      { chemicalId: 'magnesium-sulfate', mgPerL: 500 },
      { chemicalId: 'potassium-sulfate', mgPerL: 85 },
      { chemicalId: 'fe-edta', mgPerL: 22.9 },
      { chemicalId: 'boric-acid', mgPerL: 3.0 },
      { chemicalId: 'manganese-sulfate', mgPerL: 1.7 },
      { chemicalId: 'zinc-sulfate', mgPerL: 0.30 },
      { chemicalId: 'copper-sulfate', mgPerL: 0.08 },
      { chemicalId: 'sodium-molybdate', mgPerL: 0.05 },
    ],

  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    description: 'Moderate-K, higher Ca formula for strawberry production.',
    chemicals: [
      { chemicalId: 'calcium-nitrate', mgPerL: 850 },
      { chemicalId: 'potassium-nitrate', mgPerL: 450 },
      { chemicalId: 'monopotassium-phosphate', mgPerL: 140 },
      { chemicalId: 'magnesium-sulfate', mgPerL: 430 },
      { chemicalId: 'potassium-sulfate', mgPerL: 50 },
      { chemicalId: 'fe-edta', mgPerL: 20.7 },
      { chemicalId: 'boric-acid', mgPerL: 2.5 },
      { chemicalId: 'manganese-sulfate', mgPerL: 1.5 },
      { chemicalId: 'zinc-sulfate', mgPerL: 0.25 },
      { chemicalId: 'copper-sulfate', mgPerL: 0.06 },
      { chemicalId: 'sodium-molybdate', mgPerL: 0.03 },
    ],

  },
];

// Lookup map for quick access by ID
export const RECIPE_MAP = new Map<string, Recipe>(
  RECIPES.map((r) => [r.id, r])
);
