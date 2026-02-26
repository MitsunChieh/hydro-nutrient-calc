import type { Messages } from './types';

export const zhCN: Messages = {
  common: {
    save: '保存',
    cancel: '取消',
    create: '创建',
    add: '添加',
    remove: '移除',
    custom: '自定义',
    total: '合计',
    copied: '已复制！',
    copyText: '复制文字',
    exportCsv: '导出 CSV',
    ppm: 'ppm',
    mePerL: 'me/L',
  },

  app: {
    title: '营养液计算器',
    fullTitle: '水培营养液计算器',
    toggleTheme: '切换主题',
    switchToDark: '切换至深色模式',
    switchToLight: '切换至浅色模式',
  },

  nav: {
    recipeBrowser: '配方浏览',
    targetSolver: '目标求解',
    tools: '工具',
  },

  recipe: {
    presetRecipe: '预设配方',
    builtIn: '内置配方',
    saved: '已保存配方',
    saveRecipe: '保存配方',
    recipeName: '配方名称...',
  },

  chemical: {
    title: '化学品 (mg/L)',
    addPlaceholder: '添加化学品...',
    chemical: '化学品',
  },

  ions: {
    title: '离子浓度',
    ion: '离子',
    delta: '差异',
    macro: '大量元素',
    micro: '微量元素',
    estEc: '预估 EC',
    range: (low, high) => `范围：${low}\u2013${high} ppm`,
  },

  balance: {
    title: '阳离子-阴离子平衡',
    cations: '阳离子',
    anions: '阴离子',
    ratio: '比例',
    status: '状态',
    ideal: '理想值：1.00 : 1',
    balanced: '平衡',
    cationExcess: '阳离子过量',
    anionExcess: '阴离子过量',
    perfect: '完美',
    deviation: (pct) => `偏差 ${pct}%`,
  },

  ratios: {
    title: '营养比例',
    macroBalance: '大量元素平衡',
    caMgIdeal: '理想范围：2:1 至 5:1',
    no3nh4Prefer: '多数作物偏好 >8:1',
    allNO3: '100% NO\u2083',
    noAmmonium: '无铵态氮',
    fruitingKCa: '果菜类：约 1.5:1',
  },

  volume: {
    title: '混合用量',
    waterVolume: '水量：',
    liters: '升',
  },

  water: {
    title: '水源水质',
    subtracting: '扣除中',
    off: '关闭',
    sourceName: '水源名称...',
    description: '输入自来水／水源的离子浓度，这些将从配方目标中扣除。',
  },

  ph: {
    title: 'pH 调整计算器',
    description: '计算添加酸或碱对营养液池离子的影响。',
    acids: '酸',
    bases: '碱',
    volumeAdded: '添加量',
    concentration: '浓度',
    reservoir: '营养液池',
    result: (g, formula, liters) => `添加 ${g} g ${formula} 至 ${liters} L`,
  },

  stock: {
    title: 'A/B 母液',
    emptyDescription: '请先在配方中添加化学品，再来计算母液。',
    description: '将化学品分装至 A/B 桶以避免钙沉淀。A 桶：钙 + 铁。B 桶：硫酸盐 + 磷酸盐。',
    concentration: '浓缩倍数',
    tankVolume: '桶容量',
    dilute: (mL, liters) => `稀释：每 ${liters} L 水加入 ${mL} mL 母液`,
    tankA: 'A 桶 \u2014 钙 + 铁 + 硝酸盐',
    tankB: 'B 桶 \u2014 硫酸盐 + 磷酸盐',
    noChemicals: '此桶无化学品',
  },

  solver: {
    targetConcentrations: '目标浓度 (ppm)',
    clearAll: '清除全部',
    macronutrients: '大量元素',
    micronutrients: '微量元素',
    availableChemicals: '可用化学品',
    macroSalts: '大量盐类',
    microSalts: '微量盐类',
    acidsAndBases: '酸与碱',
    calculateOptimal: '计算最佳用量',
    recommendedAmounts: '建议化学品用量',
  },

  breakdown: {
    title: '各化学品明细 (ppm)',
    chemical: '化学品',
  },

  export: {
    header: '=== 水培营养液配方 ===',
    chemicalsSection: '--- 化学品 (mg/L) ---',
    ecSection: (ec) => `--- EC: ${ec} mS/cm ---`,
    ionSection: '--- 离子浓度 ---',
    columnHeaders: `${'离子'.padEnd(16)} ${'ppm'.padStart(10)} ${'me/L'.padStart(10)}`,
    footer: '由水培营养液计算器生成',
    csvHeader: '区域,名称,数值,单位',
    csvChemical: '化学品',
    csvEc: 'EC',
    csvEstimatedEc: '预估 EC',
    csvIon: '离子',
  },

  recipes: {
    hoagland: {
      name: '霍格兰营养液',
      description: '经典全浓度霍格兰营养液 \u2014 通用参考配方。',
    },
    lettuce: {
      name: '生菜',
      description: '针对结球生菜与叶生菜优化 \u2014 中等 EC。',
    },
    'leafy-greens': {
      name: '叶菜类',
      description: '适用于菠菜、羽衣甘蓝、甜菜等叶菜的均衡配方。',
    },
    tomato: {
      name: '番茄',
      description: '高钾配方，适用于番茄果期 \u2014 较高 EC。',
    },
    strawberry: {
      name: '草莓',
      description: '中等钾、较高钙配方，适用于草莓生产。',
    },
  },

  chemicals: {
    'calcium-nitrate': '硝酸钙四水合物',
    'calcium-nitrate-anhydrous': '硝酸钙（无水）',
    'potassium-nitrate': '硝酸钾',
    'monopotassium-phosphate': '磷酸二氢钾',
    'monoammonium-phosphate': '磷酸一铵（MAP）',
    'monocalcium-phosphate': '磷酸一钙一水合物',
    'magnesium-sulfate': '硫酸镁七水合物（泻盐）',
    'magnesium-sulfate-anhydrous': '硫酸镁（无水）',
    'potassium-sulfate': '硫酸钾',
    'potassium-chloride': '氯化钾',
    'calcium-chloride': '氯化钙（无水）',
    'calcium-chloride-dihydrate': '氯化钙二水合物',
    'magnesium-nitrate': '硝酸镁六水合物',
    'fe-edta': 'EDTA 螯合铁钠（三水合物）',
    'fe-dtpa': 'DTPA 螯合铁钠',
    'ferric-tartrate': '酒石酸铁',
    'boric-acid': '硼酸',
    'manganese-sulfate': '硫酸锰一水合物',
    'manganese-chloride': '氯化锰四水合物',
    'zinc-sulfate': '硫酸锌七水合物',
    'copper-sulfate': '硫酸铜五水合物',
    'sodium-molybdate': '钼酸钠二水合物',
    'ammonium-heptamolybdate': '七钼酸铵四水合物',
    'ammonium-molybdate': '钼酸铵',
    'molybdic-acid': '钼酸一水合物',
    'potassium-silicate': '硅酸钾',
    'nitric-acid': '硝酸',
    'phosphoric-acid': '磷酸',
    'sulfuric-acid': '硫酸',
    'potassium-hydroxide': '氢氧化钾',
    'calcium-hydroxide': '氢氧化钙',
    'potassium-carbonate': '碳酸钾',
  },
};
