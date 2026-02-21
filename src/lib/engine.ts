import type {
  ChemicalInput,
  ChemicalBreakdown,
  CalculationResult,
  IonConcentration,
  IonId,
} from './types';
import { CHEMICAL_MAP } from './chemicals';
import { ION_ELEMENT_MAP, ION_VALENCE, ALL_IONS } from './constants';

/**
 * Calculate ion concentrations contributed by a single chemical.
 *
 * Flow: mg/L → mmol/L (÷ MW) → per-ion mmol/L (× coefficient)
 *       → ppm (× element atomic weight) & me/L (× valence)
 */
export function calcChemicalIons(
  chemicalId: string,
  mgPerL: number
): ChemicalBreakdown {
  const chemical = CHEMICAL_MAP.get(chemicalId);
  if (!chemical) {
    throw new Error(`Unknown chemical: ${chemicalId}`);
  }

  const mmolPerL = mgPerL / chemical.molecularWeight;

  const ions: IonConcentration[] = chemical.ions.map(({ ion, coefficient }) => {
    const ionMmolPerL = mmolPerL * coefficient;
    const { atomicWeight } = ION_ELEMENT_MAP[ion];
    const valence = ION_VALENCE[ion];

    return {
      ion,
      mmolPerL: ionMmolPerL,
      ppm: ionMmolPerL * atomicWeight,
      mePerL: ionMmolPerL * valence,
    };
  });

  return {
    chemicalId,
    mgPerL,
    mmolPerL,
    ions,
  };
}

/**
 * Calculate the total ion concentrations from multiple chemicals.
 * Returns per-chemical breakdowns and aggregated totals.
 */
export function calcSolution(inputs: ChemicalInput[]): CalculationResult {
  const breakdowns = inputs.map(({ chemicalId, mgPerL }) =>
    calcChemicalIons(chemicalId, mgPerL)
  );

  // Aggregate totals per ion
  const totalsMap = new Map<IonId, { mmolPerL: number; ppm: number; mePerL: number }>();

  for (const ionId of ALL_IONS) {
    totalsMap.set(ionId, { mmolPerL: 0, ppm: 0, mePerL: 0 });
  }

  for (const breakdown of breakdowns) {
    for (const ionConc of breakdown.ions) {
      const total = totalsMap.get(ionConc.ion)!;
      total.mmolPerL += ionConc.mmolPerL;
      total.ppm += ionConc.ppm;
      total.mePerL += ionConc.mePerL;
    }
  }

  const totals: IonConcentration[] = ALL_IONS.map((ion) => {
    const t = totalsMap.get(ion)!;
    return {
      ion,
      mmolPerL: t.mmolPerL,
      ppm: t.ppm,
      mePerL: t.mePerL,
    };
  });

  return { breakdowns, totals };
}

/**
 * Estimate electrical conductivity (EC) from ion concentrations.
 *
 * Uses the simplified formula: EC (mS/cm) ≈ Σ (λᵢ × cᵢ) / 1000
 * where λᵢ is the limiting molar conductivity (S·cm²/mol) at 25°C
 * and cᵢ is the concentration in mmol/L.
 *
 * Values from CRC Handbook of Chemistry and Physics.
 */
const MOLAR_CONDUCTIVITY: Partial<Record<IonId, number>> = {
  NO3: 71.4,    // NO₃⁻
  NH4: 73.5,    // NH₄⁺
  H2PO4: 36.0,  // H₂PO₄⁻
  K: 73.5,      // K⁺
  Ca: 119.0,    // Ca²⁺ (equivalent conductivity × 2)
  Mg: 106.1,    // Mg²⁺ (equivalent conductivity × 2)
  SO4: 160.0,   // SO₄²⁻ (equivalent conductivity × 2)
  Na: 50.1,     // Na⁺
  Cl: 76.3,     // Cl⁻
  Fe: 108.0,    // Fe²⁺
};

export function estimateEC(totals: IonConcentration[]): number {
  let ec = 0;
  for (const t of totals) {
    const lambda = MOLAR_CONDUCTIVITY[t.ion];
    if (lambda && t.mmolPerL > 0) {
      ec += lambda * t.mmolPerL;
    }
  }
  // Convert from µS/cm to mS/cm
  return ec / 1000;
}
