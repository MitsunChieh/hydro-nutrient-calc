import { useMemo } from 'react';
import type { IonConcentration, IonId } from '../lib/types';
import { estimateEC } from '../lib/engine';
import { checkRange, NUTRIENT_RANGES } from '../lib/ranges';
import { useT } from '../lib/i18n';
import styles from './NutrientCalculator.module.css';

type Unit = 'ppm' | 'mePerL';

interface TargetRef {
  ion: IonId;
  ppm: number;
}

interface Props {
  totals: IonConcentration[];
  unit: Unit;
  onUnitChange: (unit: Unit) => void;
  targets?: TargetRef[];
}

const ION_LABELS: Record<IonId, string> = {
  NO3: 'N (NO\u2083\u207B)',
  NH4: 'N (NH\u2084\u207A)',
  H2PO4: 'P',
  K: 'K',
  Ca: 'Ca',
  Mg: 'Mg',
  SO4: 'S (SO\u2084\u00B2\u207B)',
  Fe: 'Fe',
  Mn: 'Mn',
  B: 'B',
  Zn: 'Zn',
  Cu: 'Cu',
  Mo: 'Mo',
  Na: 'Na',
  Cl: 'Cl',
  Si: 'Si',
};

const MACRO_IONS: IonId[] = ['NO3', 'NH4', 'H2PO4', 'K', 'Ca', 'Mg', 'SO4'];
const MICRO_IONS: IonId[] = ['Fe', 'Mn', 'B', 'Zn', 'Cu', 'Mo', 'Na', 'Cl', 'Si'];

function formatValue(v: number): string {
  if (v === 0) return '0';
  if (v >= 10) return v.toFixed(1);
  if (v >= 1) return v.toFixed(2);
  if (v >= 0.01) return v.toFixed(3);
  return v.toFixed(4);
}

export default function IonResultsTable({ totals, unit, onUnitChange, targets }: Props) {
  const { t } = useT();
  const totalsMap = new Map(totals.map((t) => [t.ion, t]));
  const targetsMap = targets ? new Map(targets.map((t) => [t.ion, t.ppm])) : null;
  const hasTargets = targetsMap && targetsMap.size > 0;
  const ec = estimateEC(totals);
  const colCount = 2 + (hasTargets ? 1 : 0);

  const getValue = (ion: IonId) => {
    const t = totalsMap.get(ion);
    if (!t) return 0;
    return unit === 'ppm' ? t.ppm : t.mePerL;
  };

  const getPpmValue = (ion: IonId) => {
    const t = totalsMap.get(ion);
    return t?.ppm ?? 0;
  };

  // Compute max values per group for bar scaling
  // biome-ignore lint/correctness/useExhaustiveDependencies: totalsMap is derived from totals; unit is a prop
  const maxValues = useMemo(() => {
    const getVal = (ion: IonId) => {
      const entry = totalsMap.get(ion);
      if (!entry) return 0;
      return unit === 'ppm' ? entry.ppm : entry.mePerL;
    };
    const getMax = (ions: IonId[]) => {
      let max = 0;
      for (const ion of ions) {
        const v = getVal(ion);
        if (v > max) max = v;
      }
      return max || 1;
    };
    return { macro: getMax(MACRO_IONS), micro: getMax(MICRO_IONS) };
  }, [totals, unit]);

  const unitLabel = unit === 'ppm' ? t.common.ppm : t.common.mePerL;

  const renderDelta = (ion: IonId) => {
    if (!targetsMap) return null;
    const target = targetsMap.get(ion);
    if (target === undefined) return <td></td>;

    const achieved = getPpmValue(ion);
    const delta = achieved - target;
    const pct = target > 0 ? (delta / target) * 100 : 0;

    let cls = styles.deltaZero;
    let prefix = '';
    if (Math.abs(pct) < 1) {
      cls = styles.deltaZero;
    } else if (pct > 0) {
      cls = styles.deltaPositive;
      prefix = '+';
    } else {
      cls = styles.deltaNegative;
    }

    return (
      <td className={cls}>
        {Math.abs(pct) < 1 ? '\u2713' : `${prefix}${pct.toFixed(1)}%`}
      </td>
    );
  };

  const renderRows = (ions: IonId[], maxVal: number) =>
    ions.map((ion) => {
      const val = getValue(ion);
      const ppmVal = getPpmValue(ion);
      const barPct = maxVal > 0 ? Math.min((val / maxVal) * 100, 100) : 0;
      const rangeStatus = ppmVal > 0 ? checkRange(ion, ppmVal) : null;
      const range = NUTRIENT_RANGES[ion];

      let rangeIndicator: string | null = null;
      let rangeColor: string | undefined;
      if (rangeStatus === 'low') {
        rangeIndicator = '\u25BC'; // ▼
        rangeColor = 'var(--color-accent)';
      } else if (rangeStatus === 'high') {
        rangeIndicator = '\u25B2'; // ▲
        rangeColor = 'var(--color-danger)';
      }

      return (
        <tr key={ion}>
          <td>
            {ION_LABELS[ion]}
            {rangeIndicator && (
              <span
                style={{ color: rangeColor, marginLeft: '0.3rem', fontSize: '0.7rem' }}
                title={range ? t.ions.range(range.low, range.high) : ''}
              >
                {rangeIndicator}
              </span>
            )}
          </td>
          <td className={styles.valueCell}>
            <div className={styles.barCell}>
              <div
                className={styles.bar}
                style={{ width: `${barPct}%` }}
              />
              <span className={styles.barValue}>{formatValue(val)}</span>
            </div>
          </td>
          {hasTargets && renderDelta(ion)}
        </tr>
      );
    });

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div className={styles.sectionTitle}>{t.ions.title}</div>
        <div className={styles.unitToggle}>
          <button
            type="button"
            className={`${styles.unitBtn} ${unit === 'ppm' ? styles.unitBtnActive : ''}`}
            onClick={() => onUnitChange('ppm')}
          >
            ppm
          </button>
          <button
            type="button"
            className={`${styles.unitBtn} ${unit === 'mePerL' ? styles.unitBtnActive : ''}`}
            onClick={() => onUnitChange('mePerL')}
          >
            me/L
          </button>
        </div>
      </div>
      {ec > 0 && (
        <div className={styles.ecBadge}>
          <span className={styles.ecLabel}>{t.ions.estEc}</span>
          {ec.toFixed(2)} mS/cm
        </div>
      )}
      <div className={styles.tableWrap} style={{ marginTop: ec > 0 ? '0.6rem' : 0 }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t.ions.ion}</th>
              <th>{unitLabel}</th>
              {hasTargets && <th>{t.ions.delta}</th>}
            </tr>
          </thead>
          <tbody>
            <tr className={styles.groupHeader}>
              <td colSpan={colCount}>{t.ions.macro}</td>
            </tr>
            {renderRows(MACRO_IONS, maxValues.macro)}
            <tr className={styles.groupHeader}>
              <td colSpan={colCount}>{t.ions.micro}</td>
            </tr>
            {renderRows(MICRO_IONS, maxValues.micro)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
