import type { IonConcentration, IonId } from '../lib/types';
import { useT } from '../lib/i18n';
import styles from './NutrientCalculator.module.css';

interface Props {
  totals: IonConcentration[];
}

// Cations: positive charge in solution
const CATIONS: IonId[] = ['K', 'Ca', 'Mg', 'NH4', 'Na', 'Fe', 'Mn', 'Zn', 'Cu'];
// Anions: negative charge in solution
const ANIONS: IonId[] = ['NO3', 'H2PO4', 'SO4', 'Cl'];
// Si and B/Mo excluded: uncharged or negligible at hydroponic pH

export default function IonBalance({ totals }: Props) {
  const { t } = useT();
  const totalsMap = new Map(totals.map((t) => [t.ion, t]));

  let cationSum = 0;
  let anionSum = 0;

  for (const ion of CATIONS) {
    cationSum += totalsMap.get(ion)?.mePerL ?? 0;
  }
  for (const ion of ANIONS) {
    anionSum += totalsMap.get(ion)?.mePerL ?? 0;
  }

  if (cationSum === 0 && anionSum === 0) return null;

  const total = cationSum + anionSum;
  const cationPct = total > 0 ? (cationSum / total) * 100 : 50;
  const ratio = anionSum > 0 ? cationSum / anionSum : 0;
  const deviation = total > 0 ? ((cationSum - anionSum) / total) * 200 : 0;

  let status: 'balanced' | 'warning' | 'alert';
  if (Math.abs(deviation) < 5) status = 'balanced';
  else if (Math.abs(deviation) < 15) status = 'warning';
  else status = 'alert';

  const statusColor = {
    balanced: 'var(--color-success)',
    warning: 'var(--color-warning)',
    alert: 'var(--color-danger)',
  }[status];

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>{t.balance.title}</div>

      {/* Balance bar */}
      <div className={styles.balanceBar}>
        <div
          className={styles.balanceCation}
          style={{ width: `${cationPct}%` }}
        />
        <div className={styles.balanceMid} style={{ left: '50%' }} />
      </div>
      <div className={styles.balanceLabels}>
        <span>{t.balance.cations}: {cationSum.toFixed(2)} me/L</span>
        <span>{t.balance.anions}: {anionSum.toFixed(2)} me/L</span>
      </div>

      {/* Summary */}
      <div className={styles.balanceSummary}>
        <div className={styles.ratioItem}>
          <div className={styles.ratioLabel}>{t.balance.ratio}</div>
          <div className={styles.ratioValue}>{ratio.toFixed(2)} : 1</div>
          <div className={styles.ratioDesc}>{t.balance.ideal}</div>
        </div>
        <div className={styles.ratioItem}>
          <div className={styles.ratioLabel}>{t.balance.status}</div>
          <div className={styles.ratioValue} style={{ color: statusColor }}>
            {status === 'balanced' ? t.balance.balanced : deviation > 0 ? t.balance.cationExcess : t.balance.anionExcess}
          </div>
          <div className={styles.ratioDesc}>
            {Math.abs(deviation) < 1 ? t.balance.perfect : t.balance.deviation(Math.abs(deviation).toFixed(1))}
          </div>
        </div>
      </div>
    </div>
  );
}
