import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSavedRecipes,
  saveRecipe,
  deleteSavedRecipe,
  getWaterProfile,
  setWaterProfile,
} from './storage';

beforeEach(() => {
  localStorage.clear();
});

describe('saved recipes CRUD', () => {
  it('getSavedRecipes returns empty array initially', () => {
    expect(getSavedRecipes()).toEqual([]);
  });

  it('saveRecipe adds a recipe', () => {
    const recipe = saveRecipe('Custom Mix', [
      { chemicalId: 'potassium-nitrate', mgPerL: 500 },
    ]);
    expect(recipe.name).toBe('Custom Mix');
    expect(recipe.id).toMatch(/^saved-/);
    expect(recipe.chemicals).toHaveLength(1);
  });

  it('saveRecipe creates deep copy of chemicals', () => {
    const chemicals = [{ chemicalId: 'potassium-nitrate', mgPerL: 500 }];
    saveRecipe('Test', chemicals);
    chemicals[0].mgPerL = 999;

    const saved = getSavedRecipes();
    expect(saved[0].chemicals[0].mgPerL).toBe(500); // unchanged
  });

  it('deleteSavedRecipe removes the recipe', () => {
    const recipe = saveRecipe('To Delete', []);
    deleteSavedRecipe(recipe.id);
    expect(getSavedRecipes()).toHaveLength(0);
  });

  it('multiple recipes can be saved', () => {
    saveRecipe('Recipe A', []);
    saveRecipe('Recipe B', []);
    expect(getSavedRecipes()).toHaveLength(2);
  });

  it('handles corrupted JSON gracefully', () => {
    localStorage.setItem('hydro-calc:saved-recipes', 'not-json');
    expect(getSavedRecipes()).toEqual([]);
  });
});

describe('water profile', () => {
  it('returns null initially', () => {
    expect(getWaterProfile()).toBeNull();
  });

  it('setWaterProfile stores and retrieves', () => {
    const profile = { name: 'City Water', ions: { Ca: 50, Mg: 15 } };
    setWaterProfile(profile);
    const retrieved = getWaterProfile();
    expect(retrieved?.name).toBe('City Water');
    expect(retrieved?.ions.Ca).toBe(50);
    expect(retrieved?.ions.Mg).toBe(15);
  });

  it('setWaterProfile null clears profile', () => {
    setWaterProfile({ name: 'Test', ions: {} });
    setWaterProfile(null);
    expect(getWaterProfile()).toBeNull();
  });
});
