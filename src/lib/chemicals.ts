import type { Chemical } from './types';

/**
 * Chemical database for hydroponic nutrient calculations.
 *
 * All molecular weights are computed from IUPAC 2021 atomic weights:
 *   H=1.008 B=10.81 C=12.011 N=14.007 O=15.999 Na=22.990 Mg=24.305
 *   Si=28.085 P=30.974 S=32.065 Cl=35.45 K=39.098 Ca=40.078
 *   Mn=54.938 Fe=55.845 Cu=63.546 Zn=65.38 Mo=95.95
 *   H2O=18.015
 */
export const CHEMICALS: Chemical[] = [
  // =============================================
  // Macro salts (13)
  // =============================================
  {
    id: 'calcium-nitrate',
    formula: 'Ca(NO₃)₂·4H₂O',
    name: 'Calcium Nitrate Tetrahydrate',
    // 40.078 + 2*(14.007 + 3*15.999) + 4*18.015
    // = 40.078 + 2*62.004 + 72.060 = 236.146
    molecularWeight: 236.146,
    category: 'macro',
    ions: [
      { ion: 'Ca', coefficient: 1 },
      { ion: 'NO3', coefficient: 2 },
    ],
  },
  {
    id: 'calcium-nitrate-anhydrous',
    formula: 'Ca(NO₃)₂',
    name: 'Calcium Nitrate (Anhydrous)',
    // 40.078 + 2*(14.007 + 3*15.999)
    // = 40.078 + 2*62.004 = 164.086
    molecularWeight: 164.086,
    category: 'macro',
    ions: [
      { ion: 'Ca', coefficient: 1 },
      { ion: 'NO3', coefficient: 2 },
    ],
  },
  {
    id: 'potassium-nitrate',
    formula: 'KNO₃',
    name: 'Potassium Nitrate',
    // 39.098 + 14.007 + 3*15.999 = 101.102
    molecularWeight: 101.102,
    category: 'macro',
    ions: [
      { ion: 'K', coefficient: 1 },
      { ion: 'NO3', coefficient: 1 },
    ],
  },
  {
    id: 'monopotassium-phosphate',
    formula: 'KH₂PO₄',
    name: 'Monopotassium Phosphate',
    // 39.098 + 2*1.008 + 30.974 + 4*15.999 = 136.084
    molecularWeight: 136.084,
    category: 'macro',
    ions: [
      { ion: 'K', coefficient: 1 },
      { ion: 'H2PO4', coefficient: 1 },
    ],
  },
  {
    id: 'monoammonium-phosphate',
    formula: 'NH₄H₂PO₄',
    name: 'Monoammonium Phosphate (MAP)',
    // 14.007 + 6*1.008 + 30.974 + 4*15.999 = 115.025
    molecularWeight: 115.025,
    category: 'macro',
    ions: [
      { ion: 'NH4', coefficient: 1 },
      { ion: 'H2PO4', coefficient: 1 },
    ],
  },
  {
    id: 'monocalcium-phosphate',
    formula: 'Ca(H₂PO₄)₂·H₂O',
    name: 'Monocalcium Phosphate Monohydrate',
    // 40.078 + 2*(2*1.008 + 30.974 + 4*15.999) + 18.015
    // = 40.078 + 2*96.986 + 18.015 = 252.065
    molecularWeight: 252.065,
    category: 'macro',
    ions: [
      { ion: 'Ca', coefficient: 1 },
      { ion: 'H2PO4', coefficient: 2 },
    ],
  },
  {
    id: 'magnesium-sulfate',
    formula: 'MgSO₄·7H₂O',
    name: 'Magnesium Sulfate Heptahydrate (Epsom Salt)',
    // 24.305 + 32.065 + 4*15.999 + 7*18.015
    // = 24.305 + 32.065 + 63.996 + 126.105 = 246.471
    molecularWeight: 246.471,
    category: 'macro',
    ions: [
      { ion: 'Mg', coefficient: 1 },
      { ion: 'SO4', coefficient: 1 },
    ],
  },
  {
    id: 'magnesium-sulfate-anhydrous',
    formula: 'MgSO₄',
    name: 'Magnesium Sulfate (Anhydrous)',
    // 24.305 + 32.065 + 4*15.999 = 120.366
    molecularWeight: 120.366,
    category: 'macro',
    ions: [
      { ion: 'Mg', coefficient: 1 },
      { ion: 'SO4', coefficient: 1 },
    ],
  },
  {
    id: 'potassium-sulfate',
    formula: 'K₂SO₄',
    name: 'Potassium Sulfate',
    // 2*39.098 + 32.065 + 4*15.999 = 174.257
    molecularWeight: 174.257,
    category: 'macro',
    ions: [
      { ion: 'K', coefficient: 2 },
      { ion: 'SO4', coefficient: 1 },
    ],
  },
  {
    id: 'potassium-chloride',
    formula: 'KCl',
    name: 'Potassium Chloride',
    // 39.098 + 35.45 = 74.548
    molecularWeight: 74.548,
    category: 'macro',
    ions: [
      { ion: 'K', coefficient: 1 },
      { ion: 'Cl', coefficient: 1 },
    ],
  },
  {
    id: 'calcium-chloride',
    formula: 'CaCl₂',
    name: 'Calcium Chloride (Anhydrous)',
    // 40.078 + 2*35.45 = 110.978
    molecularWeight: 110.978,
    category: 'macro',
    ions: [
      { ion: 'Ca', coefficient: 1 },
      { ion: 'Cl', coefficient: 2 },
    ],
  },
  {
    id: 'calcium-chloride-dihydrate',
    formula: 'CaCl₂·2H₂O',
    name: 'Calcium Chloride Dihydrate',
    // 40.078 + 2*35.45 + 2*18.015 = 147.008
    molecularWeight: 147.008,
    category: 'macro',
    ions: [
      { ion: 'Ca', coefficient: 1 },
      { ion: 'Cl', coefficient: 2 },
    ],
  },
  {
    id: 'magnesium-nitrate',
    formula: 'Mg(NO₃)₂·6H₂O',
    name: 'Magnesium Nitrate Hexahydrate',
    // 24.305 + 2*(14.007 + 3*15.999) + 6*18.015
    // = 24.305 + 2*62.004 + 108.090 = 256.403
    molecularWeight: 256.403,
    category: 'macro',
    ions: [
      { ion: 'Mg', coefficient: 1 },
      { ion: 'NO3', coefficient: 2 },
    ],
  },

  // =============================================
  // Micro salts (13)
  // =============================================
  {
    id: 'fe-edta',
    formula: 'C₁₀H₁₂FeN₂NaO₈·3H₂O',
    name: 'Sodium Iron EDTA Trihydrate',
    // 10*12.011 + 12*1.008 + 55.845 + 2*14.007 + 22.990 + 8*15.999 + 3*18.015
    // = 120.110 + 12.096 + 55.845 + 28.014 + 22.990 + 127.992 + 54.045 = 421.092
    molecularWeight: 421.092,
    category: 'micro',
    ions: [
      { ion: 'Fe', coefficient: 1 },
      { ion: 'Na', coefficient: 1 },
    ],
  },
  {
    id: 'fe-dtpa',
    formula: 'C₁₄H₁₈FeN₃NaO₁₀',
    name: 'Sodium Iron(III) DTPA',
    // 14*12.011 + 18*1.008 + 55.845 + 3*14.007 + 22.990 + 10*15.999
    // = 168.154 + 18.144 + 55.845 + 42.021 + 22.990 + 159.990 = 467.144
    molecularWeight: 467.144,
    category: 'micro',
    ions: [
      { ion: 'Fe', coefficient: 1 },
      { ion: 'Na', coefficient: 1 },
    ],
  },
  {
    id: 'ferric-tartrate',
    formula: 'C₁₂H₁₂Fe₂O₁₈',
    name: 'Ferric Tartrate',
    // 12*12.011 + 12*1.008 + 2*55.845 + 18*15.999
    // = 144.132 + 12.096 + 111.690 + 287.982 = 555.900
    molecularWeight: 555.900,
    category: 'micro',
    ions: [
      { ion: 'Fe', coefficient: 2 },
    ],
  },
  {
    id: 'boric-acid',
    formula: 'H₃BO₃',
    name: 'Boric Acid',
    // 3*1.008 + 10.81 + 3*15.999 = 61.831
    molecularWeight: 61.831,
    category: 'micro',
    ions: [
      { ion: 'B', coefficient: 1 },
    ],
  },
  {
    id: 'manganese-sulfate',
    formula: 'MnSO₄·H₂O',
    name: 'Manganese Sulfate Monohydrate',
    // 54.938 + 32.065 + 4*15.999 + 18.015 = 169.014
    molecularWeight: 169.014,
    category: 'micro',
    ions: [
      { ion: 'Mn', coefficient: 1 },
      { ion: 'SO4', coefficient: 1 },
    ],
  },
  {
    id: 'manganese-chloride',
    formula: 'MnCl₂·4H₂O',
    name: 'Manganese Chloride Tetrahydrate',
    // 54.938 + 2*35.45 + 4*18.015 = 197.898
    molecularWeight: 197.898,
    category: 'micro',
    ions: [
      { ion: 'Mn', coefficient: 1 },
      { ion: 'Cl', coefficient: 2 },
    ],
  },
  {
    id: 'zinc-sulfate',
    formula: 'ZnSO₄·7H₂O',
    name: 'Zinc Sulfate Heptahydrate',
    // 65.38 + 32.065 + 4*15.999 + 7*18.015 = 287.546
    molecularWeight: 287.546,
    category: 'micro',
    ions: [
      { ion: 'Zn', coefficient: 1 },
      { ion: 'SO4', coefficient: 1 },
    ],
  },
  {
    id: 'copper-sulfate',
    formula: 'CuSO₄·5H₂O',
    name: 'Copper Sulfate Pentahydrate',
    // 63.546 + 32.065 + 4*15.999 + 5*18.015 = 249.682
    molecularWeight: 249.682,
    category: 'micro',
    ions: [
      { ion: 'Cu', coefficient: 1 },
      { ion: 'SO4', coefficient: 1 },
    ],
  },
  {
    id: 'sodium-molybdate',
    formula: 'Na₂MoO₄·2H₂O',
    name: 'Sodium Molybdate Dihydrate',
    // 2*22.990 + 95.95 + 4*15.999 + 2*18.015 = 241.956
    molecularWeight: 241.956,
    category: 'micro',
    ions: [
      { ion: 'Mo', coefficient: 1 },
      { ion: 'Na', coefficient: 2 },
    ],
  },
  {
    id: 'ammonium-heptamolybdate',
    formula: '(NH₄)₆Mo₇O₂₄·4H₂O',
    name: 'Ammonium Heptamolybdate Tetrahydrate',
    // 6*(14.007 + 4*1.008) + 7*95.95 + 24*15.999 + 4*18.015
    // = 6*18.039 + 671.650 + 383.976 + 72.060 = 1235.920
    molecularWeight: 1235.920,
    category: 'micro',
    ions: [
      { ion: 'NH4', coefficient: 6 },
      { ion: 'Mo', coefficient: 7 },
    ],
  },
  {
    id: 'ammonium-molybdate',
    formula: '(NH₄)₂MoO₄',
    name: 'Ammonium Molybdate',
    // 2*(14.007 + 4*1.008) + 95.95 + 4*15.999
    // = 2*18.039 + 95.95 + 63.996 = 196.024
    molecularWeight: 196.024,
    category: 'micro',
    ions: [
      { ion: 'NH4', coefficient: 2 },
      { ion: 'Mo', coefficient: 1 },
    ],
  },
  {
    id: 'molybdic-acid',
    formula: 'H₂MoO₄·H₂O',
    name: 'Molybdic Acid Monohydrate',
    // 2*1.008 + 95.95 + 4*15.999 + 18.015 = 179.977
    molecularWeight: 179.977,
    category: 'micro',
    ions: [
      { ion: 'Mo', coefficient: 1 },
    ],
  },
  {
    id: 'potassium-silicate',
    formula: 'K₂SiO₃',
    name: 'Potassium Silicate',
    // 2*39.098 + 28.085 + 3*15.999 = 154.278
    molecularWeight: 154.278,
    category: 'micro',
    ions: [
      { ion: 'K', coefficient: 2 },
      { ion: 'Si', coefficient: 1 },
    ],
  },

  // =============================================
  // Acids (3)
  // =============================================
  {
    id: 'nitric-acid',
    formula: 'HNO₃',
    name: 'Nitric Acid',
    // 1.008 + 14.007 + 3*15.999 = 63.012
    molecularWeight: 63.012,
    category: 'acid',
    ions: [
      { ion: 'NO3', coefficient: 1 },
    ],
  },
  {
    id: 'phosphoric-acid',
    formula: 'H₃PO₄',
    name: 'Phosphoric Acid',
    // 3*1.008 + 30.974 + 4*15.999 = 97.994
    molecularWeight: 97.994,
    category: 'acid',
    ions: [
      { ion: 'H2PO4', coefficient: 1 },
    ],
  },
  {
    id: 'sulfuric-acid',
    formula: 'H₂SO₄',
    name: 'Sulfuric Acid',
    // 2*1.008 + 32.065 + 4*15.999 = 98.077
    molecularWeight: 98.077,
    category: 'acid',
    ions: [
      { ion: 'SO4', coefficient: 1 },
    ],
  },

  // =============================================
  // Bases (3)
  // =============================================
  {
    id: 'potassium-hydroxide',
    formula: 'KOH',
    name: 'Potassium Hydroxide',
    // 39.098 + 15.999 + 1.008 = 56.105
    molecularWeight: 56.105,
    category: 'base',
    ions: [
      { ion: 'K', coefficient: 1 },
    ],
  },
  {
    id: 'calcium-hydroxide',
    formula: 'Ca(OH)₂',
    name: 'Calcium Hydroxide',
    // 40.078 + 2*(15.999 + 1.008) = 74.092
    molecularWeight: 74.092,
    category: 'base',
    ions: [
      { ion: 'Ca', coefficient: 1 },
    ],
  },
  {
    id: 'potassium-carbonate',
    formula: 'K₂CO₃',
    name: 'Potassium Carbonate',
    // 2*39.098 + 12.011 + 3*15.999 = 138.204
    molecularWeight: 138.204,
    category: 'base',
    ions: [
      { ion: 'K', coefficient: 2 },
    ],
  },
];

// Lookup map for quick access by ID
export const CHEMICAL_MAP = new Map<string, Chemical>(
  CHEMICALS.map((c) => [c.id, c])
);
