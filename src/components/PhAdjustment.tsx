import { useState, useMemo } from 'react';
import { CHEMICALS } from '../lib/chemicals';
import { ION_ELEMENT_MAP, ION_VALENCE } from '../lib/constants';
import type { IonId } from '../lib/types';
import { useT } from '../lib/i18n';
import styles from './NutrientCalculator.module.css';

// Only show acids and bases for pH adjustment
const PH_CHEMICALS = CHEMICALS.filter(
  (c) => c.category === 'acid' || c.category === 'base'
);

interface AdjustmentResult {
  chemicalName: string;
  formula: string;
  pureMass_g: number;
  ions: { ion: IonId; label: string; ppm: number; mePerL: number }[];
}

export default function PhAdjustment() {
  const { t } = useT();
  const [chemicalId, setChemicalId] = useState(PH_CHEMICALS[0]?.id ?? '');
  const [volume_mL, setVolume] = useState('');
  const [concentration, setConcentration] = useState('');  // % w/v
  const [reservoir_L, setReservoir] = useState('100');

  const result = useMemo((): AdjustmentResult | null => {
    const vol = parseFloat(volume_mL);
    const conc = parseFloat(concentration);
    const res = parseFloat(reservoir_L);
    if (!vol || !conc || !res || vol <= 0 || conc <= 0 || res <= 0) return null;

    const chemical = PH_CHEMICALS.find((c) => c.id === chemicalId);
    if (!chemical) return null;

    // Pure mass of the chemical added:
    // volume (mL) × concentration (g/100mL) = grams
    const pureMass_g = vol * (conc / 100);

    // mg added to reservoir → mg/L in reservoir
    const mg_total = pureMass_g * 1000; // convert g to mg
    const mgPerL = mg_total / res;

    // mmol/L in reservoir
    const mmolPerL = mgPerL / chemical.molecularWeight;

    const ions = chemical.ions.map(({ ion, coefficient }) => {
      const ionMmolPerL = mmolPerL * coefficient;
      const { atomicWeight } = ION_ELEMENT_MAP[ion];
      const valence = ION_VALENCE[ion];
      const ppm = ionMmolPerL * atomicWeight;
      const mePerL = ionMmolPerL * valence;

      // Build display label
      const labels: Record<string, string> = {
        NO3: 'N (NO\u2083\u207B)',
        NH4: 'N (NH\u2084\u207A)',
        H2PO4: 'P',
        K: 'K\u207A',
        Ca: 'Ca\u00B2\u207A',
        Mg: 'Mg\u00B2\u207A',
        SO4: 'SO\u2084\u00B2\u207B',
        Na: 'Na\u207A',
        Cl: 'Cl\u207B',
      };
      const label = labels[ion] || ion;

      return { ion, label, ppm, mePerL };
    });

    return {
      chemicalName: chemical.name,
      formula: chemical.formula,
      pureMass_g,
      ions,
    };
  }, [chemicalId, volume_mL, concentration, reservoir_L]);

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>{t.ph.title}</div>
      <p className={styles.description} style={{ marginBottom: '0.7rem' }}>
        {t.ph.description}
      </p>

      {/* Chemical selector */}
      <select
        className={styles.select}
        value={chemicalId}
        onChange={(e) => setChemicalId(e.target.value)}
        style={{ marginBottom: '0.6rem' }}
      >
        <optgroup label={t.ph.acids}>
          {PH_CHEMICALS.filter((c) => c.category === 'acid').map((c) => (
            <option key={c.id} value={c.id}>
              {t.chemicals[c.id] ?? c.name} ({c.formula})
            </option>
          ))}
        </optgroup>
        <optgroup label={t.ph.bases}>
          {PH_CHEMICALS.filter((c) => c.category === 'base').map((c) => (
            <option key={c.id} value={c.id}>
              {t.chemicals[c.id] ?? c.name} ({c.formula})
            </option>
          ))}
        </optgroup>
      </select>

      {/* Inputs */}
      <div className={styles.phInputGrid}>
        <div className={styles.phInputItem}>
          <label className={styles.phLabel} htmlFor="ph-volume">{t.ph.volumeAdded}</label>
          <div className={styles.inputGroup}>
            <input
              id="ph-volume"
              type="number"
              className={styles.numberInput}
              style={{ width: '100%' }}
              min="0"
              step="1"
              value={volume_mL}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="0"
            />
            <span className={styles.unit}>mL</span>
          </div>
        </div>

        <div className={styles.phInputItem}>
          <label className={styles.phLabel} htmlFor="ph-concentration">{t.ph.concentration}</label>
          <div className={styles.inputGroup}>
            <input
              id="ph-concentration"
              type="number"
              className={styles.numberInput}
              style={{ width: '100%' }}
              min="0"
              max="100"
              step="0.1"
              value={concentration}
              onChange={(e) => setConcentration(e.target.value)}
              placeholder="0"
            />
            <span className={styles.unit}>% w/v</span>
          </div>
        </div>

        <div className={styles.phInputItem}>
          <label className={styles.phLabel} htmlFor="ph-reservoir">{t.ph.reservoir}</label>
          <div className={styles.inputGroup}>
            <input
              id="ph-reservoir"
              type="number"
              className={styles.numberInput}
              style={{ width: '100%' }}
              min="0.1"
              step="1"
              value={reservoir_L}
              onChange={(e) => setReservoir(e.target.value)}
              placeholder="100"
            />
            <span className={styles.unit}>L</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className={styles.phResult}>
          <div className={styles.phResultHeader}>
            {t.ph.result(result.pureMass_g.toFixed(3), result.formula, reservoir_L)}
          </div>
          {result.ions.map(({ ion, label, ppm, mePerL }) => (
            <div key={ion} className={styles.phResultRow}>
              <span className={styles.phResultIon}>{label}</span>
              <span className={styles.phResultValues}>
                <span className={styles.phResultPpm}>+{ppm.toFixed(3)} ppm</span>
                <span className={styles.phResultMe}>+{mePerL.toFixed(4)} me/L</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
