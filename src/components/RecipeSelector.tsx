import { useState, useEffect } from 'react';
import { RECIPES } from '../lib/recipes';
import { getSavedRecipes, deleteSavedRecipe, type SavedRecipe } from '../lib/storage';
import type { ChemicalInput } from '../lib/types';
import { useT } from '../lib/i18n';
import styles from './NutrientCalculator.module.css';

interface Props {
  selectedId: string;
  onSelect: (recipeId: string, chemicals: ChemicalInput[]) => void;
}

export default function RecipeSelector({ selectedId, onSelect }: Props) {
  const { t } = useT();
  const [saved, setSaved] = useState<SavedRecipe[]>(() => getSavedRecipes());

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id === 'custom') {
      onSelect('custom', []);
      return;
    }

    // Check saved recipes first
    const savedRecipe = saved.find((r) => r.id === id);
    if (savedRecipe) {
      onSelect(savedRecipe.id, savedRecipe.chemicals.map((c) => ({ ...c })));
      return;
    }

    const recipe = RECIPES.find((r) => r.id === id);
    if (recipe) {
      onSelect(recipe.id, recipe.chemicals.map((c) => ({ ...c })));
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSavedRecipe(id);
    setSaved(getSavedRecipes());
    if (selectedId === id) {
      const defaultRecipe = RECIPES[0];
      onSelect(defaultRecipe.id, defaultRecipe.chemicals.map((c) => ({ ...c })));
    }
  };

  const recipe = RECIPES.find((r) => r.id === selectedId);
  const recipeName = (id: string, fallback: string) => t.recipes[id]?.name ?? fallback;
  const recipeDesc = (id: string, fallback: string) => t.recipes[id]?.description ?? fallback;

  // Notify parent to refresh saved list (called after save)
  useEffect(() => {
    const handler = () => setSaved(getSavedRecipes());
    window.addEventListener('recipes-updated', handler);
    return () => window.removeEventListener('recipes-updated', handler);
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>{t.recipe.presetRecipe}</div>
      <select className={styles.select} value={selectedId} onChange={handleChange}>
        <optgroup label={t.recipe.builtIn}>
          {RECIPES.map((r) => (
            <option key={r.id} value={r.id}>
              {recipeName(r.id, r.name)}
            </option>
          ))}
        </optgroup>
        {saved.length > 0 && (
          <optgroup label={t.recipe.saved}>
            {saved.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </optgroup>
        )}
        <option value="custom">{t.common.custom}</option>
      </select>
      {recipe && <div className={styles.description}>{recipeDesc(recipe.id, recipe.description)}</div>}

      {saved.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
          {saved.map((r) => (
            <span key={r.id} className={styles.savedTag}>
              {r.name}
              <button
                type="button"
                className={styles.savedTagDelete}
                onClick={(e) => handleDelete(r.id, e)}
                title={`${t.common.remove} "${r.name}"`}
                aria-label={`${t.common.remove} ${r.name}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
