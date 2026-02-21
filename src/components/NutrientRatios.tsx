import type { IonConcentration } from '../lib/types';
import { useT } from '../lib/i18n';
import styles from './NutrientCalculator.module.css';

interface Props {
  totals: IonConcentration[];
}

function getPpm(totals: IonConcentration[], ion: string): number {
  return totals.find((t) => t.ion === ion)?.ppm ?? 0;
}

interface Ratio {
  label: string;
  value: string;
  description: string;
}

export default function NutrientRatios({ totals }: Props) {
  const { t } = useT();
  const nNo3 = getPpm(totals, 'NO3');
  const nNh4 = getPpm(totals, 'NH4');
  const p = getPpm(totals, 'H2PO4');
  const k = getPpm(totals, 'K');
  const ca = getPpm(totals, 'Ca');
  const mg = getPpm(totals, 'Mg');
  const totalN = nNo3 + nNh4;

  const ratios: Ratio[] = [];

  // N:P:K ratio (normalized to N=1 or K=1)
  if (totalN > 0 && p > 0 && k > 0) {
    const min = Math.min(totalN, p, k);
    const norm = min > 0 ? min : 1;
    ratios.push({
      label: 'N : P : K',
      value: `${(totalN / norm).toFixed(1)} : ${(p / norm).toFixed(1)} : ${(k / norm).toFixed(1)}`,
      description: t.ratios.macroBalance,
    });
  }

  // Ca:Mg ratio
  if (ca > 0 && mg > 0) {
    ratios.push({
      label: 'Ca : Mg',
      value: `${(ca / mg).toFixed(1)} : 1`,
      description: t.ratios.caMgIdeal,
    });
  }

  // NO3:NH4 ratio
  if (nNo3 > 0 && nNh4 > 0) {
    ratios.push({
      label: 'NO\u2083 : NH\u2084',
      value: `${(nNo3 / nNh4).toFixed(1)} : 1`,
      description: t.ratios.no3nh4Prefer,
    });
  } else if (nNo3 > 0 && nNh4 === 0) {
    ratios.push({
      label: 'NO\u2083 : NH\u2084',
      value: t.ratios.allNO3,
      description: t.ratios.noAmmonium,
    });
  }

  // K:Ca ratio
  if (k > 0 && ca > 0) {
    ratios.push({
      label: 'K : Ca',
      value: `${(k / ca).toFixed(2)} : 1`,
      description: t.ratios.fruitingKCa,
    });
  }

  if (ratios.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>{t.ratios.title}</div>
      <div className={styles.ratioGrid}>
        {ratios.map((r) => (
          <div key={r.label} className={styles.ratioItem}>
            <div className={styles.ratioLabel}>{r.label}</div>
            <div className={styles.ratioValue}>{r.value}</div>
            <div className={styles.ratioDesc}>{r.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
