import { useState } from 'react';
import type { ChemicalInput } from '../lib/types';
import { CHEMICAL_MAP } from '../lib/chemicals';
import { useT } from '../lib/i18n';
import styles from './NutrientCalculator.module.css';

interface Props {
  chemicals: ChemicalInput[];
}

function formatGrams(mg: number): string {
  if (mg >= 1000) return `${(mg / 1000).toFixed(2)} g`;
  if (mg >= 1) return `${mg.toFixed(1)} mg`;
  return `${(mg * 1000).toFixed(1)} \u00B5g`;
}

export default function VolumeScaling({ chemicals }: Props) {
  const { t } = useT();
  const [volumeL, setVolumeL] = useState(100);

  if (chemicals.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>{t.volume.title}</div>
      <div className={styles.volumeRow}>
        <label className={styles.volumeLabel} htmlFor="volume-scaling">{t.volume.waterVolume}</label>
        <input
          id="volume-scaling"
          type="number"
          className={styles.volumeInput}
          value={volumeL || ''}
          min={0.1}
          step="any"
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v > 0) setVolumeL(v);
          }}
        />
        <span className={styles.volumeLabel}>{t.volume.liters}</span>
      </div>
      <div style={{ marginTop: '0.6rem' }}>
        {chemicals.filter((c) => c.mgPerL > 0).map((c) => {
          const chem = CHEMICAL_MAP.get(c.chemicalId);
          const totalMg = c.mgPerL * volumeL;
          return (
            <div key={c.chemicalId} className={styles.weighRow}>
              <span className={styles.weighName}>{t.chemicals[c.chemicalId] ?? chem?.name ?? c.chemicalId}</span>
              <span className={styles.weighAmount}>{formatGrams(totalMg)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
