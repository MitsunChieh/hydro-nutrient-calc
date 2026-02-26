import { useState, useEffect } from 'react';
import type { IonId } from '../lib/types';
import { getWaterProfile, setWaterProfile, type WaterProfile } from '../lib/storage';
import { useT } from '../lib/i18n';
import styles from './NutrientCalculator.module.css';

interface Props {
  onChange: (profile: WaterProfile | null) => void;
}

const WATER_IONS: { ion: IonId; label: string }[] = [
  { ion: 'Ca', label: 'Ca' },
  { ion: 'Mg', label: 'Mg' },
  { ion: 'Na', label: 'Na' },
  { ion: 'Cl', label: 'Cl' },
  { ion: 'SO4', label: 'S (SO\u2084)' },
  { ion: 'K', label: 'K' },
  { ion: 'Fe', label: 'Fe' },
  { ion: 'NO3', label: 'N (NO\u2083)' },
  { ion: 'H2PO4', label: 'P' },
  { ion: 'Si', label: 'Si' },
];

export default function WaterProfileInput({ onChange }: Props) {
  const { t } = useT();
  const [enabled, setEnabled] = useState(false);
  const [name, setName] = useState('');
  const [ions, setIons] = useState<Partial<Record<IonId, number>>>({});

  // Load from storage on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: onChange is a stable setter from parent useState
  useEffect(() => {
    const profile = getWaterProfile();
    if (profile) {
      setEnabled(true);
      setName(profile.name);
      setIons(profile.ions);
      onChange(profile);
    } else {
      setEnabled(false);
      setName('');
      setIons({});
      onChange(null);
    }
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (!next) {
      setWaterProfile(null);
      onChange(null);
    } else {
      const profile: WaterProfile = { name: name || 'Tap Water', ions };
      setWaterProfile(profile);
      onChange(profile);
    }
  };

  const handleIonChange = (ion: IonId, value: string) => {
    const num = parseFloat(value) || 0;
    const next = { ...ions, [ion]: num };
    if (num === 0) delete next[ion];
    setIons(next);
    const profile: WaterProfile = { name: name || 'Tap Water', ions: next };
    setWaterProfile(profile);
    onChange(profile);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (enabled) {
      const profile: WaterProfile = { name: value || 'Tap Water', ions };
      setWaterProfile(profile);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div className={styles.sectionTitle}>{t.water.title}</div>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
            className={styles.toggleCheckbox}
          />
          <span className={styles.toggleText}>
            {enabled ? t.water.subtracting : t.water.off}
          </span>
        </label>
      </div>

      {enabled && (
        <>
          <input
            type="text"
            className={styles.saveInput}
            placeholder={t.water.sourceName}
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            style={{ marginBottom: '0.6rem' }}
          />
          <div className={styles.waterGrid}>
            {WATER_IONS.map(({ ion, label }) => (
              <div key={ion} className={styles.waterItem}>
                <label className={styles.waterLabel} htmlFor={`water-${ion}`}>{label}</label>
                <input
                  id={`water-${ion}`}
                  type="number"
                  className={styles.waterInput}
                  min="0"
                  step="0.1"
                  value={ions[ion] || ''}
                  onChange={(e) => handleIonChange(ion, e.target.value)}
                  placeholder="0"
                />
                <span className={styles.waterUnit}>ppm</span>
              </div>
            ))}
          </div>
          <div className={styles.description} style={{ marginTop: '0.5rem' }}>
            {t.water.description}
          </div>
        </>
      )}
    </div>
  );
}
