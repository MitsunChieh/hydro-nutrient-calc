import type { ChemicalInput, IonId } from './types';

// ===== Storage helpers =====

const PREFIX = 'hydro-calc:';

function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function storageSet(key: string, value: unknown): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

// ===== Saved Recipes =====

export interface SavedRecipe {
  id: string;
  name: string;
  chemicals: ChemicalInput[];
  createdAt: number;
}

export function getSavedRecipes(): SavedRecipe[] {
  return storageGet('saved-recipes', []);
}

export function saveRecipe(name: string, chemicals: ChemicalInput[]): SavedRecipe {
  const recipes = getSavedRecipes();
  const recipe: SavedRecipe = {
    id: `saved-${Date.now()}`,
    name,
    chemicals: chemicals.map((c) => ({ ...c })),
    createdAt: Date.now(),
  };
  recipes.push(recipe);
  storageSet('saved-recipes', recipes);
  return recipe;
}

export function deleteSavedRecipe(id: string): void {
  const recipes = getSavedRecipes().filter((r) => r.id !== id);
  storageSet('saved-recipes', recipes);
}

// ===== Water Profile =====

export interface WaterProfile {
  name: string;
  ions: Partial<Record<IonId, number>>; // ppm values
}

export function getWaterProfile(): WaterProfile | null {
  return storageGet<WaterProfile | null>('water-profile', null);
}

export function setWaterProfile(profile: WaterProfile | null): void {
  storageSet('water-profile', profile);
}
