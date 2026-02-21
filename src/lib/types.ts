// Ion IDs — all tracked ions in hydroponic solutions
export type IonId =
  | 'NO3'
  | 'NH4'
  | 'H2PO4'
  | 'K'
  | 'Ca'
  | 'Mg'
  | 'SO4'
  | 'Fe'
  | 'Mn'
  | 'B'
  | 'Zn'
  | 'Cu'
  | 'Mo'
  | 'Na'
  | 'Cl'
  | 'Si';

// Element IDs — used for reporting ppm as elemental mass
export type ElementId =
  | 'N_NO3'
  | 'N_NH4'
  | 'P'
  | 'K'
  | 'Ca'
  | 'Mg'
  | 'S'
  | 'Fe'
  | 'Mn'
  | 'B'
  | 'Zn'
  | 'Cu'
  | 'Mo'
  | 'Na'
  | 'Cl'
  | 'Si';

export type ChemicalCategory = 'macro' | 'micro' | 'acid' | 'base';

// Ion contribution from a chemical: stoichiometric coefficient per formula unit
export interface IonContribution {
  ion: IonId;
  coefficient: number; // moles of ion per mole of chemical
}

export interface Chemical {
  id: string;
  formula: string;
  name: string;
  molecularWeight: number; // g/mol
  category: ChemicalCategory;
  ions: IonContribution[];
}

// Concentration of a single ion in multiple units
export interface IonConcentration {
  ion: IonId;
  mmolPerL: number;
  ppm: number;     // mg/L of the element (not the ion)
  mePerL: number;  // milliequivalents per liter
}

// Per-chemical breakdown showing what each chemical contributes
export interface ChemicalBreakdown {
  chemicalId: string;
  mgPerL: number;
  mmolPerL: number;
  ions: IonConcentration[];
}

// Complete calculation result
export interface CalculationResult {
  breakdowns: ChemicalBreakdown[];
  totals: IonConcentration[];
}

// Input for a single chemical in a calculation
export interface ChemicalInput {
  chemicalId: string;
  mgPerL: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  chemicals: ChemicalInput[];
}
