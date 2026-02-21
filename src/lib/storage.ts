import type { ChemicalInput, IonId } from './types';

// ===== Workspace =====

const WORKSPACES_KEY = 'hydro-calc-workspaces';

export interface Workspace {
  id: string;
  name: string;
  createdAt: number;
}

export function getWorkspaces(): Workspace[] {
  try {
    const raw = localStorage.getItem(WORKSPACES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function createWorkspace(name: string): Workspace {
  const workspaces = getWorkspaces();
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const existing = workspaces.find((w) => w.id === id);
  if (existing) return existing;

  const ws: Workspace = { id, name, createdAt: Date.now() };
  workspaces.push(ws);
  localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
  return ws;
}

export function deleteWorkspace(id: string): void {
  const workspaces = getWorkspaces().filter((w) => w.id !== id);
  localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
  // Clean up all workspace-scoped data
  const prefix = `hydro-calc:${id}:`;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) keysToRemove.push(key);
  }
  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
}

// ===== Workspace-scoped helpers =====

function wsKey(workspaceId: string, key: string): string {
  return `hydro-calc:${workspaceId}:${key}`;
}

function wsGet<T>(workspaceId: string, key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(wsKey(workspaceId, key));
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function wsSet(workspaceId: string, key: string, value: unknown): void {
  localStorage.setItem(wsKey(workspaceId, key), JSON.stringify(value));
}

// ===== Saved Recipes (workspace-scoped) =====

export interface SavedRecipe {
  id: string;
  name: string;
  chemicals: ChemicalInput[];
  createdAt: number;
}

export function getSavedRecipes(workspaceId: string): SavedRecipe[] {
  return wsGet(workspaceId, 'saved-recipes', []);
}

export function saveRecipe(workspaceId: string, name: string, chemicals: ChemicalInput[]): SavedRecipe {
  const recipes = getSavedRecipes(workspaceId);
  const recipe: SavedRecipe = {
    id: `saved-${Date.now()}`,
    name,
    chemicals: chemicals.map((c) => ({ ...c })),
    createdAt: Date.now(),
  };
  recipes.push(recipe);
  wsSet(workspaceId, 'saved-recipes', recipes);
  return recipe;
}

export function deleteSavedRecipe(workspaceId: string, id: string): void {
  const recipes = getSavedRecipes(workspaceId).filter((r) => r.id !== id);
  wsSet(workspaceId, 'saved-recipes', recipes);
}

// ===== Water Profile (workspace-scoped) =====

export interface WaterProfile {
  name: string;
  ions: Partial<Record<IonId, number>>; // ppm values
}

export function getWaterProfile(workspaceId: string): WaterProfile | null {
  return wsGet<WaterProfile | null>(workspaceId, 'water-profile', null);
}

export function setWaterProfile(workspaceId: string, profile: WaterProfile | null): void {
  wsSet(workspaceId, 'water-profile', profile);
}

// ===== Hash Router Helpers =====

export function getWorkspaceIdFromHash(): string | null {
  const hash = window.location.hash;
  if (!hash || hash === '#' || hash === '#/') return null;
  const match = hash.match(/^#\/([a-z0-9-]+)/);
  return match ? match[1] : null;
}

export function setWorkspaceHash(id: string): void {
  window.location.hash = `/${id}`;
}

// ===== Migration: move old global data to workspace =====

export function migrateGlobalData(workspaceId: string): void {
  const oldKey = 'hydro-calc-saved-recipes';
  const oldData = localStorage.getItem(oldKey);
  if (oldData) {
    const existing = getSavedRecipes(workspaceId);
    if (existing.length === 0) {
      wsSet(workspaceId, 'saved-recipes', JSON.parse(oldData));
    }
    localStorage.removeItem(oldKey);
  }
}
