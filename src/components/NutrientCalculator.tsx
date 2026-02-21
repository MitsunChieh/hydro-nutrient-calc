import { useState, useMemo, useEffect, useCallback } from 'react';
import type { ChemicalInput, IonConcentration } from '../lib/types';
import { calcSolution } from '../lib/engine';
import { RECIPES } from '../lib/recipes';
import {
  saveRecipe,
  getWorkspaceIdFromHash,
  createWorkspace,
  migrateGlobalData,
  type WaterProfile,
} from '../lib/storage';
import { ION_ELEMENT_MAP } from '../lib/constants';
import { exportAsText, exportAsCSV, copyToClipboard, downloadFile } from '../lib/export';
import { LocaleProvider, useT, nextLocale, LOCALE_LABELS } from '../lib/i18n';
import WorkspaceLanding from './WorkspaceLanding';
import RecipeSelector from './RecipeSelector';
import ChemicalInputs from './ChemicalInputs';
import IonResultsTable from './IonResultsTable';
import TargetSolver from './TargetSolver';
import BreakdownTable from './BreakdownTable';
import NutrientRatios from './NutrientRatios';
import VolumeScaling from './VolumeScaling';
import IonBalance from './IonBalance';
import WaterProfileInput from './WaterProfileInput';
import PhAdjustment from './PhAdjustment';
import StockSolution from './StockSolution';
import styles from './NutrientCalculator.module.css';

type Unit = 'ppm' | 'mePerL';
type TabId = 'recipe' | 'solver' | 'tools';

const defaultRecipe = RECIPES[0];

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function NutrientCalculator() {
  return (
    <LocaleProvider>
      <NutrientCalculatorInner />
    </LocaleProvider>
  );
}

function NutrientCalculatorInner() {
  const { locale, setLocale, t } = useT();
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [workspaceId, setWorkspaceId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return getWorkspaceIdFromHash();
  });

  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    const handleHash = () => {
      setWorkspaceId(getWorkspaceIdFromHash());
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Migrate old global data when entering a workspace
  useEffect(() => {
    if (workspaceId) {
      migrateGlobalData(workspaceId);
    }
  }, [workspaceId]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  const handleEnterWorkspace = useCallback((id: string) => {
    // Ensure workspace exists
    createWorkspace(id);
    setWorkspaceId(id);
  }, []);

  const handleExitWorkspace = useCallback(() => {
    window.location.hash = '';
    setWorkspaceId(null);
  }, []);

  const localeSwitcher = (
    <button
      type="button"
      className={styles.localeBtn}
      onClick={() => setLocale(nextLocale(locale))}
      title={LOCALE_LABELS[locale]}
    >
      {LOCALE_LABELS[locale]}
    </button>
  );

  // Show landing page if no workspace selected
  if (!workspaceId) {
    return (
      <>
        <div className={styles.container}>
          <header className={styles.header}>
            <div />
            <div className={styles.headerBtns}>
              {localeSwitcher}
              <button
                type="button"
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label={t.app.toggleTheme}
              >
                {theme === 'light' ? '\u263E' : '\u2600'}
              </button>
            </div>
          </header>
        </div>
        <main>
          <WorkspaceLanding onEnter={handleEnterWorkspace} />
        </main>
      </>
    );
  }

  return (
    <WorkspaceView
      workspaceId={workspaceId}
      theme={theme}
      toggleTheme={toggleTheme}
      onExit={handleExitWorkspace}
      localeSwitcher={localeSwitcher}
    />
  );
}

// Separate component so hooks are unconditional
function WorkspaceView({
  workspaceId,
  theme,
  toggleTheme,
  onExit,
  localeSwitcher,
}: {
  workspaceId: string;
  theme: string;
  toggleTheme: () => void;
  onExit: () => void;
  localeSwitcher: React.ReactNode;
}) {
  const { t } = useT();
  const [activeTab, setActiveTab] = useState<TabId>('recipe');
  const [recipeId, setRecipeId] = useState(defaultRecipe.id);
  const [chemicals, setChemicals] = useState<ChemicalInput[]>(
    defaultRecipe.chemicals.map((c) => ({ ...c }))
  );
  const [unit, setUnit] = useState<Unit>('ppm');
  const [saveName, setSaveName] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [copied, setCopied] = useState(false);
  const [waterProfile, setWaterProfile] = useState<WaterProfile | null>(null);

  const result = useMemo(() => {
    const validInputs = chemicals.filter((c) => c.mgPerL > 0);
    if (validInputs.length === 0) return null;
    return calcSolution(validInputs);
  }, [chemicals]);

  // Subtract water profile from totals
  const adjustedTotals = useMemo((): IonConcentration[] | null => {
    if (!result) return null;
    if (!waterProfile || Object.keys(waterProfile.ions).length === 0) return result.totals;
    return result.totals.map((t) => {
      const waterPpm = waterProfile.ions[t.ion] ?? 0;
      if (waterPpm <= 0) return t;
      // Convert water ppm back to mmol/L to properly recalc me/L
      const { atomicWeight } = ION_ELEMENT_MAP[t.ion];
      const waterMmol = waterPpm / atomicWeight;
      const newPpm = Math.max(0, t.ppm - waterPpm);
      const newMmol = Math.max(0, t.mmolPerL - waterMmol);
      const ratio = t.mmolPerL > 0 ? newMmol / t.mmolPerL : 0;
      return {
        ...t,
        ppm: newPpm,
        mmolPerL: newMmol,
        mePerL: t.mePerL * ratio,
      };
    });
  }, [result, waterProfile]);

  const handleRecipeSelect = (id: string, chems: ChemicalInput[]) => {
    setRecipeId(id);
    if (chems.length > 0) {
      setChemicals(chems);
    }
  };

  const handleChemicalsChange = (chems: ChemicalInput[]) => {
    setRecipeId('custom');
    setChemicals(chems);
  };

  const handleSave = () => {
    if (!saveName.trim() || chemicals.length === 0) return;
    const saved = saveRecipe(workspaceId, saveName.trim(), chemicals);
    setRecipeId(saved.id);
    setSaveName('');
    setShowSave(false);
    window.dispatchEvent(new Event('recipes-updated'));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className={styles.workspaceBackBtn}
            onClick={onExit}
            title={t.app.switchWorkspace}
          >
            &larr;
          </button>
          <h1 className={styles.title}>{t.app.title}</h1>
        </div>
        <div className={styles.headerBtns}>
          {localeSwitcher}
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            title={theme === 'light' ? t.app.switchToDark : t.app.switchToLight}
            aria-label={t.app.toggleTheme}
          >
            {theme === 'light' ? '\u263E' : '\u2600'}
          </button>
        </div>
      </header>

      <nav aria-label={t.app.title}>
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            id="tab-recipe"
            aria-selected={activeTab === 'recipe'}
            aria-controls="panel-recipe"
            className={`${styles.tab} ${activeTab === 'recipe' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('recipe')}
          >
            {t.nav.recipeBrowser}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-solver"
            aria-selected={activeTab === 'solver'}
            aria-controls="panel-solver"
            className={`${styles.tab} ${activeTab === 'solver' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('solver')}
          >
            {t.nav.targetSolver}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-tools"
            aria-selected={activeTab === 'tools'}
            aria-controls="panel-tools"
            className={`${styles.tab} ${activeTab === 'tools' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            {t.nav.tools}
          </button>
        </div>
      </nav>

      <main>
      {activeTab === 'recipe' && (
        <div role="tabpanel" id="panel-recipe" aria-labelledby="tab-recipe">
          <RecipeSelector
            workspaceId={workspaceId}
            selectedId={recipeId}
            onSelect={handleRecipeSelect}
          />
          <ChemicalInputs chemicals={chemicals} onChange={handleChemicalsChange} />

          <div className={styles.card}>
            {showSave ? (
              <div className={styles.saveRow}>
                <input
                  type="text"
                  className={styles.saveInput}
                  placeholder={t.recipe.recipeName}
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={handleSave}
                  disabled={!saveName.trim()}
                >
                  {t.common.save}
                </button>
                <button
                  type="button"
                  className={styles.toolbarBtn}
                  onClick={() => { setShowSave(false); setSaveName(''); }}
                >
                  {t.common.cancel}
                </button>
              </div>
            ) : (
              <div className={styles.toolbar}>
                <button
                  type="button"
                  className={styles.toolbarBtn}
                  onClick={() => setShowSave(true)}
                  disabled={chemicals.length === 0}
                >
                  {t.recipe.saveRecipe}
                </button>
                {result && (
                  <>
                    <button
                      type="button"
                      className={styles.toolbarBtn}
                      onClick={async () => {
                        const text = exportAsText(chemicals, result.totals, t);
                        const ok = await copyToClipboard(text);
                        if (ok) {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }
                      }}
                    >
                      {copied ? t.common.copied : t.common.copyText}
                    </button>
                    <button
                      type="button"
                      className={styles.toolbarBtn}
                      onClick={() => {
                        const csv = exportAsCSV(chemicals, result.totals, t);
                        downloadFile(csv, 'nutrient-solution.csv', 'text/csv');
                      }}
                    >
                      {t.common.exportCsv}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <WaterProfileInput
            workspaceId={workspaceId}
            onChange={setWaterProfile}
          />

          {result && adjustedTotals && (
            <>
              <IonResultsTable
                totals={adjustedTotals}
                unit={unit}
                onUnitChange={setUnit}
              />
              <IonBalance totals={adjustedTotals} />
              <NutrientRatios totals={adjustedTotals} />
              <VolumeScaling chemicals={chemicals} />
              <BreakdownTable result={result} />
            </>
          )}
        </div>
      )}

      {activeTab === 'solver' && (
        <div role="tabpanel" id="panel-solver" aria-labelledby="tab-solver">
          <TargetSolver unit={unit} onUnitChange={setUnit} />
        </div>
      )}

      {activeTab === 'tools' && (
        <div role="tabpanel" id="panel-tools" aria-labelledby="tab-tools">
          <PhAdjustment />
          <StockSolution chemicals={chemicals} />
        </div>
      )}
      </main>
    </div>
  );
}
