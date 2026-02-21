import { useState, useRef, useCallback } from 'react';
import { CHEMICALS } from '../lib/chemicals';
import type { ChemicalInput } from '../lib/types';
import { useT } from '../lib/i18n';
import styles from './NutrientCalculator.module.css';

interface Props {
  chemicals: ChemicalInput[];
  onChange: (chemicals: ChemicalInput[]) => void;
}

export default function ChemicalInputs({ chemicals, onChange }: Props) {
  const { t } = useT();
  const [addId, setAddId] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);
  const removeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const usedIds = new Set(chemicals.map((c) => c.chemicalId));
  const available = CHEMICALS.filter((c) => !usedIds.has(c.id));

  const handleAmountChange = (index: number, value: string) => {
    const num = value === '' ? 0 : parseFloat(value);
    if (isNaN(num)) return;
    const next = chemicals.map((c, i) =>
      i === index ? { ...c, mgPerL: num } : c
    );
    onChange(next);
  };

  const handleRemove = useCallback((index: number) => {
    const id = chemicals[index]?.chemicalId;
    if (!id || removing) return;
    setRemoving(id);
    clearTimeout(removeTimer.current);
    removeTimer.current = setTimeout(() => {
      onChange(chemicals.filter((_, i) => i !== index));
      setRemoving(null);
    }, 200);
  }, [chemicals, onChange, removing]);

  const handleAdd = () => {
    if (!addId) return;
    onChange([...chemicals, { chemicalId: addId, mgPerL: 0 }]);
    setAddId('');
  };

  const getChemical = (id: string) => CHEMICALS.find((c) => c.id === id);

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>{t.chemical.title}</div>
      <div className={styles.chemicalList}>
        {chemicals.map((input, i) => {
          const chem = getChemical(input.chemicalId);
          return (
            <div
              key={input.chemicalId}
              className={`${styles.chemicalRow} ${removing === input.chemicalId ? styles.chemicalRowRemoving : ''}`}
            >
              <div className={styles.chemicalInfo}>
                <span className={styles.chemicalName} title={t.chemicals[input.chemicalId] ?? chem?.name}>
                  {t.chemicals[input.chemicalId] ?? chem?.name ?? input.chemicalId}
                </span>
                <span className={styles.chemicalFormula}>{chem?.formula}</span>
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="number"
                  className={styles.numberInput}
                  value={input.mgPerL || ''}
                  min={0}
                  step="any"
                  onChange={(e) => handleAmountChange(i, e.target.value)}
                />
                <span className={styles.unit}>mg/L</span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemove(i)}
                  title={t.common.remove}
                  aria-label={`${t.common.remove} ${t.chemicals[input.chemicalId] ?? chem?.name}`}
                >
                  &times;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {available.length > 0 && (
        <div className={styles.addRow}>
          <select
            className={styles.addSelect}
            value={addId}
            onChange={(e) => setAddId(e.target.value)}
          >
            <option value="">{t.chemical.addPlaceholder}</option>
            {available.map((c) => (
              <option key={c.id} value={c.id}>
                {t.chemicals[c.id] ?? c.name} ({c.formula})
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.addBtn}
            onClick={handleAdd}
            disabled={!addId}
          >
            {t.common.add}
          </button>
        </div>
      )}
    </div>
  );
}
