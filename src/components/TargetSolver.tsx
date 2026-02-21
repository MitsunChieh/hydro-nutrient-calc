import { useState, useCallback } from 'react';
import type { IonId } from '../lib/types';
import { CHEMICALS } from '../lib/chemicals';
import { RECIPES } from '../lib/recipes';
import { calcSolution } from '../lib/engine';
import { solveForTarget, type SolverTarget, type SolverResult } from '../lib/solver';
import { useT } from '../lib/i18n';
import IonResultsTable from './IonResultsTable';
import styles from './NutrientCalculator.module.css';

type Unit = 'ppm' | 'mePerL';

interface Props {
  unit: Unit;
  onUnitChange: (unit: Unit) => void;
}

interface TargetIon {
  ion: IonId;
  label: string;
  group: 'macro' | 'micro';
}

const TARGET_IONS: TargetIon[] = [
  { ion: 'NO3', label: 'N (NO\u2083\u207B)', group: 'macro' },
  { ion: 'NH4', label: 'N (NH\u2084\u207A)', group: 'macro' },
  { ion: 'H2PO4', label: 'P', group: 'macro' },
  { ion: 'K', label: 'K', group: 'macro' },
  { ion: 'Ca', label: 'Ca', group: 'macro' },
  { ion: 'Mg', label: 'Mg', group: 'macro' },
  { ion: 'SO4', label: 'S (SO\u2084\u00B2\u207B)', group: 'macro' },
  { ion: 'Fe', label: 'Fe', group: 'micro' },
  { ion: 'Mn', label: 'Mn', group: 'micro' },
  { ion: 'B', label: 'B', group: 'micro' },
  { ion: 'Zn', label: 'Zn', group: 'micro' },
  { ion: 'Cu', label: 'Cu', group: 'micro' },
  { ion: 'Mo', label: 'Mo', group: 'micro' },
];

// Default: common chemicals that most growers have
const DEFAULT_CHEMICAL_IDS = new Set([
  'calcium-nitrate', 'potassium-nitrate', 'monopotassium-phosphate',
  'magnesium-sulfate', 'potassium-sulfate', 'fe-edta', 'boric-acid',
  'manganese-sulfate', 'zinc-sulfate', 'copper-sulfate', 'sodium-molybdate',
]);

function getHoaglandTargets(): Record<string, number> {
  const hoagland = RECIPES[0];
  const result = calcSolution(hoagland.chemicals);
  const targets: Record<string, number> = {};
  for (const t of result.totals) {
    if (t.ppm > 0.001) {
      targets[t.ion] = Math.round(t.ppm * 100) / 100;
    }
  }
  return targets;
}

export default function TargetSolver({ unit, onUnitChange }: Props) {
  const { t } = useT();
  const [targets, setTargets] = useState<Record<string, number>>(() => getHoaglandTargets());
  const [selectedChemIds, setSelectedChemIds] = useState<Set<string>>(() => new Set(DEFAULT_CHEMICAL_IDS));
  const [solverResult, setSolverResult] = useState<SolverResult | null>(null);
  const [presetId, setPresetId] = useState('hoagland');

  const recipeName = (id: string, fallback: string) => t.recipes[id]?.name ?? fallback;

  const handleTargetChange = (ion: string, value: string) => {
    const num = value === '' ? 0 : parseFloat(value);
    if (isNaN(num)) return;
    setTargets((prev) => ({ ...prev, [ion]: num }));
  };

  const handleChemToggle = (chemId: string) => {
    setSelectedChemIds((prev) => {
      const next = new Set(prev);
      if (next.has(chemId)) {
        next.delete(chemId);
      } else {
        next.add(chemId);
      }
      return next;
    });
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setPresetId(id);
    if (id === 'clear') {
      setTargets({});
      return;
    }
    const recipe = RECIPES.find((r) => r.id === id);
    if (!recipe) return;
    const result = calcSolution(recipe.chemicals);
    const newTargets: Record<string, number> = {};
    for (const t of result.totals) {
      if (t.ppm > 0.001) {
        newTargets[t.ion] = Math.round(t.ppm * 100) / 100;
      }
    }
    setTargets(newTargets);
  };

  const handleSolve = useCallback(() => {
    const solverTargets: SolverTarget[] = TARGET_IONS
      .map((ti) => ({ ion: ti.ion, ppm: targets[ti.ion] || 0 }))
      .filter((t) => t.ppm > 0);

    const availableChemicals = CHEMICALS.filter((c) => selectedChemIds.has(c.id));

    const result = solveForTarget(solverTargets, availableChemicals);
    setSolverResult(result);
  }, [targets, selectedChemIds]);

  const macroChemicals = CHEMICALS.filter((c) => c.category === 'macro');
  const microChemicals = CHEMICALS.filter((c) => c.category === 'micro');
  const acidBaseChemicals = CHEMICALS.filter((c) => c.category === 'acid' || c.category === 'base');

  return (
    <>
      {/* Target concentrations */}
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div className={styles.sectionTitle}>{t.solver.targetConcentrations}</div>
          <select
            className={styles.select}
            value={presetId}
            onChange={handlePresetChange}
            style={{ width: 'auto', minHeight: '34px', fontSize: '0.8rem', padding: '0.3rem 1.8rem 0.3rem 0.5rem' }}
          >
            {RECIPES.map((r) => (
              <option key={r.id} value={r.id}>
                {recipeName(r.id, r.name)}
              </option>
            ))}
            <option value="clear">{t.solver.clearAll}</option>
          </select>
        </div>

        <div className={styles.sectionTitle} style={{ marginTop: '0.5rem' }}>{t.solver.macronutrients}</div>
        <div className={styles.targetGrid}>
          {TARGET_IONS.filter((t) => t.group === 'macro').map((ti) => (
            <div key={ti.ion} className={styles.targetItem}>
              <label className={styles.targetLabel} htmlFor={`target-${ti.ion}`}>{ti.label}</label>
              <input
                id={`target-${ti.ion}`}
                type="number"
                className={styles.targetInput}
                value={targets[ti.ion] || ''}
                min={0}
                step="any"
                onChange={(e) => handleTargetChange(ti.ion, e.target.value)}
              />
              <span className={styles.targetUnit}>ppm</span>
            </div>
          ))}
        </div>

        <div className={styles.sectionTitle} style={{ marginTop: '0.6rem' }}>{t.solver.micronutrients}</div>
        <div className={styles.targetGrid}>
          {TARGET_IONS.filter((t) => t.group === 'micro').map((ti) => (
            <div key={ti.ion} className={styles.targetItem}>
              <label className={styles.targetLabel} htmlFor={`target-${ti.ion}`}>{ti.label}</label>
              <input
                id={`target-${ti.ion}`}
                type="number"
                className={styles.targetInput}
                value={targets[ti.ion] || ''}
                min={0}
                step="any"
                onChange={(e) => handleTargetChange(ti.ion, e.target.value)}
              />
              <span className={styles.targetUnit}>ppm</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available chemicals */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>{t.solver.availableChemicals}</div>
        <div className={styles.sectionTitle} style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{t.solver.macroSalts}</div>
        <div className={styles.chemCheckList}>
          {macroChemicals.map((c) => (
            <label key={c.id} className={styles.chemCheck}>
              <input
                type="checkbox"
                checked={selectedChemIds.has(c.id)}
                onChange={() => handleChemToggle(c.id)}
              />
              <span className={styles.chemCheckLabel} title={t.chemicals[c.id] ?? c.name}>{t.chemicals[c.id] ?? c.name}</span>
            </label>
          ))}
        </div>

        <div className={styles.sectionTitle} style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>{t.solver.microSalts}</div>
        <div className={styles.chemCheckList}>
          {microChemicals.map((c) => (
            <label key={c.id} className={styles.chemCheck}>
              <input
                type="checkbox"
                checked={selectedChemIds.has(c.id)}
                onChange={() => handleChemToggle(c.id)}
              />
              <span className={styles.chemCheckLabel} title={t.chemicals[c.id] ?? c.name}>{t.chemicals[c.id] ?? c.name}</span>
            </label>
          ))}
        </div>

        <div className={styles.sectionTitle} style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>{t.solver.acidsAndBases}</div>
        <div className={styles.chemCheckList}>
          {acidBaseChemicals.map((c) => (
            <label key={c.id} className={styles.chemCheck}>
              <input
                type="checkbox"
                checked={selectedChemIds.has(c.id)}
                onChange={() => handleChemToggle(c.id)}
              />
              <span className={styles.chemCheckLabel} title={t.chemicals[c.id] ?? c.name}>{t.chemicals[c.id] ?? c.name}</span>
            </label>
          ))}
        </div>

        <button
          type="button"
          className={styles.solveBtn}
          onClick={handleSolve}
        >
          {t.solver.calculateOptimal}
        </button>
      </div>

      {/* Results */}
      {solverResult && solverResult.chemicals.length > 0 && (
        <>
          <div className={styles.card}>
            <div className={styles.sectionTitle}>{t.solver.recommendedAmounts}</div>
            <div className={styles.solverResult}>
              {solverResult.chemicals.map((c) => {
                const chem = CHEMICALS.find((ch) => ch.id === c.chemicalId);
                return (
                  <div key={c.chemicalId} className={styles.resultChemRow}>
                    <span className={styles.resultChemName}>{t.chemicals[c.chemicalId] ?? chem?.name}</span>
                    <span className={styles.resultChemAmount}>{c.mgPerL} mg/L</span>
                  </div>
                );
              })}
            </div>
          </div>

          <IonResultsTable
            totals={solverResult.achieved}
            unit={unit}
            onUnitChange={onUnitChange}
            targets={TARGET_IONS
              .filter((ti) => (targets[ti.ion] || 0) > 0)
              .map((ti) => ({ ion: ti.ion, ppm: targets[ti.ion] }))}
          />
        </>
      )}
    </>
  );
}
