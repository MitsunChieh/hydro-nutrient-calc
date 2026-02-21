export type Locale = 'en' | 'zh-TW' | 'zh-CN';

export interface Messages {
  common: {
    save: string;
    cancel: string;
    create: string;
    add: string;
    remove: string;
    custom: string;
    total: string;
    copied: string;
    copyText: string;
    exportCsv: string;
    ppm: string;
    mePerL: string;
  };

  app: {
    title: string;
    fullTitle: string;
    toggleTheme: string;
    switchToDark: string;
    switchToLight: string;
    switchWorkspace: string;
  };

  nav: {
    recipeBrowser: string;
    targetSolver: string;
    tools: string;
  };

  workspace: {
    title: string;
    subtitle: string;
    newWorkspace: string;
    placeholder: string;
    yourWorkspaces: string;
    deleteWorkspace: string;
    confirmDelete: string;
  };

  recipe: {
    presetRecipe: string;
    builtIn: string;
    saved: string;
    saveRecipe: string;
    recipeName: string;
  };

  chemical: {
    title: string;
    addPlaceholder: string;
    chemical: string;
  };

  ions: {
    title: string;
    ion: string;
    delta: string;
    macro: string;
    micro: string;
    estEc: string;
    range: (low: number, high: number) => string;
  };

  balance: {
    title: string;
    cations: string;
    anions: string;
    ratio: string;
    status: string;
    ideal: string;
    balanced: string;
    cationExcess: string;
    anionExcess: string;
    perfect: string;
    deviation: (pct: string) => string;
  };

  ratios: {
    title: string;
    macroBalance: string;
    caMgIdeal: string;
    no3nh4Prefer: string;
    allNO3: string;
    noAmmonium: string;
    fruitingKCa: string;
  };

  volume: {
    title: string;
    waterVolume: string;
    liters: string;
  };

  water: {
    title: string;
    subtracting: string;
    off: string;
    sourceName: string;
    description: string;
  };

  ph: {
    title: string;
    description: string;
    acids: string;
    bases: string;
    volumeAdded: string;
    concentration: string;
    reservoir: string;
    result: (g: string, formula: string, liters: string) => string;
  };

  stock: {
    title: string;
    emptyDescription: string;
    description: string;
    concentration: string;
    tankVolume: string;
    dilute: (mL: string, liters: string) => string;
    tankA: string;
    tankB: string;
    noChemicals: string;
  };

  solver: {
    targetConcentrations: string;
    clearAll: string;
    macronutrients: string;
    micronutrients: string;
    availableChemicals: string;
    macroSalts: string;
    microSalts: string;
    acidsAndBases: string;
    calculateOptimal: string;
    recommendedAmounts: string;
  };

  breakdown: {
    title: string;
    chemical: string;
  };

  export: {
    header: string;
    chemicalsSection: string;
    ecSection: (ec: string) => string;
    ionSection: string;
    columnHeaders: string;
    footer: string;
    csvHeader: string;
    csvChemical: string;
    csvEc: string;
    csvEstimatedEc: string;
    csvIon: string;
  };

  recipes: Record<string, { name: string; description: string }>;

  chemicals: Record<string, string>;
}
