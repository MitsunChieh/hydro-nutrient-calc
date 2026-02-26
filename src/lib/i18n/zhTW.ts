import type { Messages } from './types';

export const zhTW: Messages = {
  common: {
    save: '儲存',
    cancel: '取消',
    create: '建立',
    add: '新增',
    remove: '移除',
    custom: '自訂',
    total: '合計',
    copied: '已複製！',
    copyText: '複製文字',
    exportCsv: '匯出 CSV',
    ppm: 'ppm',
    mePerL: 'me/L',
  },

  app: {
    title: '養液計算器',
    fullTitle: '水耕養液計算器',
    toggleTheme: '切換主題',
    switchToDark: '切換至深色模式',
    switchToLight: '切換至淺色模式',
  },

  nav: {
    recipeBrowser: '配方瀏覽',
    targetSolver: '目標求解',
    tools: '工具',
  },

  recipe: {
    presetRecipe: '預設配方',
    builtIn: '內建配方',
    saved: '已儲存配方',
    saveRecipe: '儲存配方',
    recipeName: '配方名稱...',
  },

  chemical: {
    title: '化學品 (mg/L)',
    addPlaceholder: '新增化學品...',
    chemical: '化學品',
  },

  ions: {
    title: '離子濃度',
    ion: '離子',
    delta: '差異',
    macro: '巨量元素',
    micro: '微量元素',
    estEc: '預估 EC',
    range: (low, high) => `範圍：${low}\u2013${high} ppm`,
  },

  balance: {
    title: '陽離子-陰離子平衡',
    cations: '陽離子',
    anions: '陰離子',
    ratio: '比例',
    status: '狀態',
    ideal: '理想值：1.00 : 1',
    balanced: '平衡',
    cationExcess: '陽離子過量',
    anionExcess: '陰離子過量',
    perfect: '完美',
    deviation: (pct) => `偏差 ${pct}%`,
  },

  ratios: {
    title: '營養比例',
    macroBalance: '巨量元素平衡',
    caMgIdeal: '理想範圍：2:1 至 5:1',
    no3nh4Prefer: '多數作物偏好 >8:1',
    allNO3: '100% NO\u2083',
    noAmmonium: '無銨態氮',
    fruitingKCa: '果菜類：約 1.5:1',
  },

  volume: {
    title: '混合用量',
    waterVolume: '水量：',
    liters: '公升',
  },

  water: {
    title: '水源水質',
    subtracting: '扣除中',
    off: '關閉',
    sourceName: '水源名稱...',
    description: '輸入自來水／水源的離子濃度，這些將從配方目標中扣除。',
  },

  ph: {
    title: 'pH 調整計算器',
    description: '計算添加酸或鹼對養液槽離子的影響。',
    acids: '酸',
    bases: '鹼',
    volumeAdded: '添加量',
    concentration: '濃度',
    reservoir: '養液槽',
    result: (g, formula, liters) => `添加 ${g} g ${formula} 至 ${liters} L`,
  },

  stock: {
    title: 'A/B 母液',
    emptyDescription: '請先在配方中添加化學品，再來計算母液。',
    description: '將化學品分裝至 A/B 桶以避免鈣沉澱。A 桶：鈣 + 鐵。B 桶：硫酸鹽 + 磷酸鹽。',
    concentration: '濃縮倍數',
    tankVolume: '桶容量',
    dilute: (mL, liters) => `稀釋：每 ${liters} L 水加入 ${mL} mL 母液`,
    tankA: 'A 桶 \u2014 鈣 + 鐵 + 硝酸鹽',
    tankB: 'B 桶 \u2014 硫酸鹽 + 磷酸鹽',
    noChemicals: '此桶無化學品',
  },

  solver: {
    targetConcentrations: '目標濃度 (ppm)',
    clearAll: '清除全部',
    macronutrients: '巨量元素',
    micronutrients: '微量元素',
    availableChemicals: '可用化學品',
    macroSalts: '巨量鹽類',
    microSalts: '微量鹽類',
    acidsAndBases: '酸與鹼',
    calculateOptimal: '計算最佳用量',
    recommendedAmounts: '建議化學品用量',
  },

  breakdown: {
    title: '各化學品明細 (ppm)',
    chemical: '化學品',
  },

  export: {
    header: '=== 水耕養液配方 ===',
    chemicalsSection: '--- 化學品 (mg/L) ---',
    ecSection: (ec) => `--- EC: ${ec} mS/cm ---`,
    ionSection: '--- 離子濃度 ---',
    columnHeaders: `${'離子'.padEnd(16)} ${'ppm'.padStart(10)} ${'me/L'.padStart(10)}`,
    footer: '由水耕養液計算器產生',
    csvHeader: '區域,名稱,數值,單位',
    csvChemical: '化學品',
    csvEc: 'EC',
    csvEstimatedEc: '預估 EC',
    csvIon: '離子',
  },

  recipes: {
    hoagland: {
      name: '霍格蘭營養液',
      description: '經典全濃度霍格蘭營養液 \u2014 通用參考配方。',
    },
    lettuce: {
      name: '萵苣',
      description: '針對結球萵苣與葉萵苣最佳化 \u2014 中等 EC。',
    },
    'leafy-greens': {
      name: '葉菜類',
      description: '適用於菠菜、羽衣甘藍、甜菜等葉菜的均衡配方。',
    },
    tomato: {
      name: '番茄',
      description: '高鉀配方，適用於番茄果期 \u2014 較高 EC。',
    },
    strawberry: {
      name: '草莓',
      description: '中等鉀、較高鈣配方，適用於草莓生產。',
    },
  },

  chemicals: {
    'calcium-nitrate': '硝酸鈣四水合物',
    'calcium-nitrate-anhydrous': '硝酸鈣（無水）',
    'potassium-nitrate': '硝酸鉀',
    'monopotassium-phosphate': '磷酸二氫鉀',
    'monoammonium-phosphate': '磷酸一銨（MAP）',
    'monocalcium-phosphate': '磷酸一鈣一水合物',
    'magnesium-sulfate': '硫酸鎂七水合物（瀉鹽）',
    'magnesium-sulfate-anhydrous': '硫酸鎂（無水）',
    'potassium-sulfate': '硫酸鉀',
    'potassium-chloride': '氯化鉀',
    'calcium-chloride': '氯化鈣（無水）',
    'calcium-chloride-dihydrate': '氯化鈣二水合物',
    'magnesium-nitrate': '硝酸鎂六水合物',
    'fe-edta': 'EDTA 螯合鐵鈉（三水合物）',
    'fe-dtpa': 'DTPA 螯合鐵鈉',
    'ferric-tartrate': '酒石酸鐵',
    'boric-acid': '硼酸',
    'manganese-sulfate': '硫酸錳一水合物',
    'manganese-chloride': '氯化錳四水合物',
    'zinc-sulfate': '硫酸鋅七水合物',
    'copper-sulfate': '硫酸銅五水合物',
    'sodium-molybdate': '鉬酸鈉二水合物',
    'ammonium-heptamolybdate': '七鉬酸銨四水合物',
    'ammonium-molybdate': '鉬酸銨',
    'molybdic-acid': '鉬酸一水合物',
    'potassium-silicate': '矽酸鉀',
    'nitric-acid': '硝酸',
    'phosphoric-acid': '磷酸',
    'sulfuric-acid': '硫酸',
    'potassium-hydroxide': '氫氧化鉀',
    'calcium-hydroxide': '氫氧化鈣',
    'potassium-carbonate': '碳酸鉀',
  },
};
