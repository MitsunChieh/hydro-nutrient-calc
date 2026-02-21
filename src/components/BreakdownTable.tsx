import { useMemo } from 'react';
import type { CalculationResult, IonId } from '../lib/types';
import { CHEMICAL_MAP } from '../lib/chemicals';
import { useT } from '../lib/i18n';
import styles from './NutrientCalculator.module.css';

interface Props {
  result: CalculationResult;
}

type Unit = 'ppm';

const ION_LABELS: Partial<Record<IonId, string>> = {
  NO3: 'N-NO\u2083',
  NH4: 'N-NH\u2084',
  H2PO4: 'P',
  K: 'K',
  Ca: 'Ca',
  Mg: 'Mg',
  SO4: 'S',
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

export default function BreakdownTable({ result }: Props) {
  const { t } = useT();
  // Collect all ions that have nonzero values
  const activeIons = useMemo(() => {
    const ions = new Set<IonId>();
    for (const b of result.breakdowns) {
      for (const ic of b.ions) {
        if (ic.ppm > 0.001) ions.add(ic.ion);
      }
    }
    return Array.from(ions);
  }, [result]);

  if (activeIons.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>{t.breakdown.title}</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>{t.breakdown.chemical}</th>
              {activeIons.map((ion) => (
                <th key={ion} style={{ fontSize: '0.68rem', padding: '0.4rem 0.35rem' }}>
                  {ION_LABELS[ion] ?? ion}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.breakdowns.map((b) => {
              const chem = CHEMICAL_MAP.get(b.chemicalId);
              const ionMap = new Map(b.ions.map((ic) => [ic.ion, ic.ppm]));
              return (
                <tr key={b.chemicalId}>
                  <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {t.chemicals[b.chemicalId] ?? chem?.name ?? b.chemicalId}
                  </td>
                  {activeIons.map((ion) => {
                    const val = ionMap.get(ion) ?? 0;
                    return (
                      <td key={ion} className={styles.valueCell} style={{ padding: '0.4rem 0.35rem' }}>
                        {val > 0.001 ? (val >= 1 ? val.toFixed(1) : val.toFixed(3)) : ''}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {/* Totals row */}
            <tr style={{ fontWeight: 600, borderTop: '2px solid var(--color-border)' }}>
              <td>{t.common.total}</td>
              {activeIons.map((ion) => {
                const total = result.totals.find((t) => t.ion === ion);
                const val = total?.ppm ?? 0;
                return (
                  <td key={ion} className={styles.valueCell} style={{ padding: '0.4rem 0.35rem' }}>
                    {val > 0.001 ? (val >= 1 ? val.toFixed(1) : val.toFixed(3)) : '0'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
