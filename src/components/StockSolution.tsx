import { useState, useMemo } from 'react';
import type { ChemicalInput } from '../lib/types';
import { CHEMICAL_MAP } from '../lib/chemicals';
import { useT } from '../lib/i18n';
import styles from './NutrientCalculator.module.css';

interface Props {
  chemicals: ChemicalInput[];
}

/**
 * A/B stock solution calculator.
 *
 * Tank A: calcium-containing compounds + iron chelate + micros
 * Tank B: sulfates, phosphates, and remaining compounds
 * Reason: Ca²⁺ + SO₄²⁻ or H₂PO₄⁻ form insoluble precipitates at high concentration.
 */

// Chemicals that MUST go to Tank A (calcium sources and iron chelate)
const TANK_A_IDS = new Set([
  'calcium-nitrate',
  'calcium-nitrate-anhydrous',
  'calcium-chloride',
  'calcium-chloride-dihydrate',
  'calcium-hydroxide',
  'fe-edta',
  'fe-dtpa',
  'ferric-tartrate',
]);

// Chemicals that MUST go to Tank B (sulfates and phosphates)
const TANK_B_IDS = new Set([
  'magnesium-sulfate',
  'magnesium-sulfate-anhydrous',
  'potassium-sulfate',
  'manganese-sulfate',
  'manganese-chloride',
  'zinc-sulfate',
  'copper-sulfate',
  'monopotassium-phosphate',
  'monoammonium-phosphate',
  'phosphoric-acid',
  'sulfuric-acid',
]);

function assignTank(chemicalId: string): 'A' | 'B' {
  if (TANK_A_IDS.has(chemicalId)) return 'A';
  if (TANK_B_IDS.has(chemicalId)) return 'B';

  // Check ion contributions for heuristic assignment
  const chem = CHEMICAL_MAP.get(chemicalId);
  if (!chem) return 'A';

  const hasCa = chem.ions.some((i) => i.ion === 'Ca');
  const hasSO4 = chem.ions.some((i) => i.ion === 'SO4');
  const hasP = chem.ions.some((i) => i.ion === 'H2PO4');

  if (hasCa) return 'A';
  if (hasSO4 || hasP) return 'B';

  // Default: put in A (nitrates, KOH, etc.)
  return 'A';
}

interface StockItem {
  chemicalId: string;
  name: string;
  formula: string;
  mgPerL: number;
  gramsPerTank: number;
}

export default function StockSolution({ chemicals }: Props) {
  const { t } = useT();
  const [concentrationFactor, setConcentrationFactor] = useState('100');
  const [tankVolume, setTankVolume] = useState('10');

  const { tankA, tankB } = useMemo(() => {
    const cf = parseFloat(concentrationFactor) || 100;
    const tv = parseFloat(tankVolume) || 10;

    const a: StockItem[] = [];
    const b: StockItem[] = [];

    for (const input of chemicals) {
      if (input.mgPerL <= 0) continue;
      const chem = CHEMICAL_MAP.get(input.chemicalId);
      if (!chem) continue;

      // grams per tank = (mg/L × concentrationFactor × tankVolume_L) / 1000
      const gramsPerTank = (input.mgPerL * cf * tv) / 1000;

      const item: StockItem = {
        chemicalId: input.chemicalId,
        name: chem.name,
        formula: chem.formula,
        mgPerL: input.mgPerL,
        gramsPerTank,
      };

      if (assignTank(input.chemicalId) === 'A') {
        a.push(item);
      } else {
        b.push(item);
      }
    }

    return { tankA: a, tankB: b };
  }, [chemicals, concentrationFactor, tankVolume]);

  if (chemicals.filter((c) => c.mgPerL > 0).length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.sectionTitle}>{t.stock.title}</div>
        <div className={styles.description}>
          {t.stock.emptyDescription}
        </div>
      </div>
    );
  }

  const renderTank = (label: string, items: StockItem[]) => (
    <div style={{ marginBottom: '0.75rem' }}>
      <div className={styles.stockTankLabel}>{label}</div>
      {items.length === 0 ? (
        <div className={styles.description}>{t.stock.noChemicals}</div>
      ) : (
        items.map((item) => (
          <div key={item.chemicalId} className={styles.weighRow}>
            <div>
              <span className={styles.weighName}>{t.chemicals[item.chemicalId] ?? item.name}</span>
              <span className={styles.chemicalFormula} style={{ marginLeft: '0.4rem' }}>
                {item.formula}
              </span>
            </div>
            <span className={styles.weighAmount}>
              {item.gramsPerTank >= 1
                ? `${item.gramsPerTank.toFixed(1)} g`
                : `${(item.gramsPerTank * 1000).toFixed(1)} mg`}
            </span>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>{t.stock.title}</div>
      <p className={styles.description} style={{ marginBottom: '0.6rem' }}>
        {t.stock.description}
      </p>

      <div className={styles.stockInputRow}>
        <div className={styles.phInputItem}>
          <label className={styles.phLabel} htmlFor="stock-concentration">{t.stock.concentration}</label>
          <div className={styles.inputGroup}>
            <input
              id="stock-concentration"
              type="number"
              className={styles.numberInput}
              style={{ width: '100%' }}
              min="1"
              step="10"
              value={concentrationFactor}
              onChange={(e) => setConcentrationFactor(e.target.value)}
            />
            <span className={styles.unit}>&times;</span>
          </div>
        </div>
        <div className={styles.phInputItem}>
          <label className={styles.phLabel} htmlFor="stock-tank-volume">{t.stock.tankVolume}</label>
          <div className={styles.inputGroup}>
            <input
              id="stock-tank-volume"
              type="number"
              className={styles.numberInput}
              style={{ width: '100%' }}
              min="0.1"
              step="1"
              value={tankVolume}
              onChange={(e) => setTankVolume(e.target.value)}
            />
            <span className={styles.unit}>L</span>
          </div>
        </div>
      </div>

      <div className={styles.description} style={{ marginBottom: '0.6rem', marginTop: '0.4rem' }}>
        {t.stock.dilute(
          (1000 / (parseFloat(concentrationFactor) || 100)).toFixed(1),
          '1'
        )}
      </div>

      {renderTank(t.stock.tankA, tankA)}
      {renderTank(t.stock.tankB, tankB)}
    </div>
  );
}
