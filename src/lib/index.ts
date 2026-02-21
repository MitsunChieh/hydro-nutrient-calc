// Barrel export for src/lib

// Types
export type {
  IonId,
  ElementId,
  ChemicalCategory,
  IonContribution,
  Chemical,
  IonConcentration,
  ChemicalBreakdown,
  CalculationResult,
  ChemicalInput,
  Recipe,
} from './types';

// Constants
export {
  ATOMIC_WEIGHT,
  ION_ELEMENT_MAP,
  ION_VALENCE,
  ALL_IONS,
} from './constants';

// Chemical database
export { CHEMICALS, CHEMICAL_MAP } from './chemicals';

// Recipes
export { RECIPES, RECIPE_MAP } from './recipes';

// Calculation engine
export { calcChemicalIons, calcSolution } from './engine';

// Unit conversions
export { roundTo, ppmToMePerL, mePerLToPpm } from './units';
