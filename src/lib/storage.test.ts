import { describe, it, expect, beforeEach } from 'vitest';
import {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
  getSavedRecipes,
  saveRecipe,
  deleteSavedRecipe,
  getWaterProfile,
  setWaterProfile,
  getWorkspaceIdFromHash,
  setWorkspaceHash,
  migrateGlobalData,
} from './storage';

beforeEach(() => {
  localStorage.clear();
  window.location.hash = '';
});

describe('workspace CRUD', () => {
  it('getWorkspaces returns empty array initially', () => {
    expect(getWorkspaces()).toEqual([]);
  });

  it('createWorkspace adds a workspace', () => {
    const ws = createWorkspace('My Garden');
    expect(ws.id).toBe('my-garden');
    expect(ws.name).toBe('My Garden');
    expect(ws.createdAt).toBeGreaterThan(0);

    const all = getWorkspaces();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe('my-garden');
  });

  it('createWorkspace normalizes name to ID', () => {
    expect(createWorkspace('Hello World!').id).toBe('hello-world');
    expect(createWorkspace('  Spaces  ').id).toBe('spaces');
    expect(createWorkspace('UPPER case').id).toBe('upper-case');
  });

  it('createWorkspace returns existing if duplicate', () => {
    const ws1 = createWorkspace('Test');
    const ws2 = createWorkspace('Test');
    expect(ws1.id).toBe(ws2.id);
    expect(getWorkspaces()).toHaveLength(1);
  });

  it('createWorkspace can create multiple', () => {
    createWorkspace('Garden A');
    createWorkspace('Garden B');
    expect(getWorkspaces()).toHaveLength(2);
  });

  it('deleteWorkspace removes workspace', () => {
    createWorkspace('To Delete');
    expect(getWorkspaces()).toHaveLength(1);
    deleteWorkspace('to-delete');
    expect(getWorkspaces()).toHaveLength(0);
  });

  it('deleteWorkspace cleans up scoped data', () => {
    const ws = createWorkspace('Test');
    saveRecipe(ws.id, 'My Recipe', [{ chemicalId: 'potassium-nitrate', mgPerL: 100 }]);
    setWaterProfile(ws.id, { name: 'Tap', ions: { Ca: 50 } });

    deleteWorkspace(ws.id);

    // Scoped data should be gone
    expect(getSavedRecipes(ws.id)).toEqual([]);
    expect(getWaterProfile(ws.id)).toBeNull();
  });

  it('getWorkspaces handles corrupted JSON', () => {
    localStorage.setItem('hydro-calc-workspaces', 'not-json');
    expect(getWorkspaces()).toEqual([]);
  });
});

describe('saved recipes CRUD', () => {
  const wsId = 'test-ws';

  it('getSavedRecipes returns empty array initially', () => {
    expect(getSavedRecipes(wsId)).toEqual([]);
  });

  it('saveRecipe adds a recipe', () => {
    const recipe = saveRecipe(wsId, 'Custom Mix', [
      { chemicalId: 'potassium-nitrate', mgPerL: 500 },
    ]);
    expect(recipe.name).toBe('Custom Mix');
    expect(recipe.id).toMatch(/^saved-/);
    expect(recipe.chemicals).toHaveLength(1);
  });

  it('saveRecipe creates deep copy of chemicals', () => {
    const chemicals = [{ chemicalId: 'potassium-nitrate', mgPerL: 500 }];
    saveRecipe(wsId, 'Test', chemicals);
    chemicals[0].mgPerL = 999;

    const saved = getSavedRecipes(wsId);
    expect(saved[0].chemicals[0].mgPerL).toBe(500); // unchanged
  });

  it('deleteSavedRecipe removes the recipe', () => {
    const recipe = saveRecipe(wsId, 'To Delete', []);
    deleteSavedRecipe(wsId, recipe.id);
    expect(getSavedRecipes(wsId)).toHaveLength(0);
  });

  it('recipes are workspace-isolated', () => {
    saveRecipe('ws-a', 'Recipe A', []);
    saveRecipe('ws-b', 'Recipe B', []);

    expect(getSavedRecipes('ws-a')).toHaveLength(1);
    expect(getSavedRecipes('ws-b')).toHaveLength(1);
    expect(getSavedRecipes('ws-a')[0].name).toBe('Recipe A');
  });
});

describe('water profile', () => {
  const wsId = 'test-ws';

  it('returns null initially', () => {
    expect(getWaterProfile(wsId)).toBeNull();
  });

  it('setWaterProfile stores and retrieves', () => {
    const profile = { name: 'City Water', ions: { Ca: 50, Mg: 15 } };
    setWaterProfile(wsId, profile);
    const retrieved = getWaterProfile(wsId);
    expect(retrieved?.name).toBe('City Water');
    expect(retrieved?.ions.Ca).toBe(50);
    expect(retrieved?.ions.Mg).toBe(15);
  });

  it('setWaterProfile null clears profile', () => {
    setWaterProfile(wsId, { name: 'Test', ions: {} });
    setWaterProfile(wsId, null);
    expect(getWaterProfile(wsId)).toBeNull();
  });
});

describe('hash router', () => {
  it('returns null for empty hash', () => {
    window.location.hash = '';
    expect(getWorkspaceIdFromHash()).toBeNull();
  });

  it('returns null for # only', () => {
    window.location.hash = '#';
    expect(getWorkspaceIdFromHash()).toBeNull();
  });

  it('returns null for #/', () => {
    window.location.hash = '#/';
    expect(getWorkspaceIdFromHash()).toBeNull();
  });

  it('parses workspace ID from hash', () => {
    window.location.hash = '#/my-garden';
    expect(getWorkspaceIdFromHash()).toBe('my-garden');
  });

  it('setWorkspaceHash sets the hash', () => {
    setWorkspaceHash('test-ws');
    expect(window.location.hash).toBe('#/test-ws');
  });
});

describe('migrateGlobalData', () => {
  it('migrates old global recipes to workspace', () => {
    const oldRecipes = [{ id: 'old-1', name: 'Old', chemicals: [], createdAt: 1000 }];
    localStorage.setItem('hydro-calc-saved-recipes', JSON.stringify(oldRecipes));

    migrateGlobalData('new-ws');

    expect(getSavedRecipes('new-ws')).toHaveLength(1);
    expect(getSavedRecipes('new-ws')[0].name).toBe('Old');
    // Old key should be removed
    expect(localStorage.getItem('hydro-calc-saved-recipes')).toBeNull();
  });

  it('does not overwrite existing workspace recipes', () => {
    saveRecipe('new-ws', 'Existing', []);
    localStorage.setItem('hydro-calc-saved-recipes', JSON.stringify([{ id: 'old', name: 'Old', chemicals: [], createdAt: 1 }]));

    migrateGlobalData('new-ws');

    const recipes = getSavedRecipes('new-ws');
    expect(recipes).toHaveLength(1);
    expect(recipes[0].name).toBe('Existing');
  });

  it('no-op when no old data exists', () => {
    migrateGlobalData('new-ws');
    expect(getSavedRecipes('new-ws')).toEqual([]);
  });
});
