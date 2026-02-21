import { describe, it, expect } from 'vitest';
import { nextLocale, getMessages, LOCALE_LABELS } from './index';
import { en } from './en';
import { zhTW } from './zhTW';
import { zhCN } from './zhCN';
import type { Locale, Messages } from './types';
import { CHEMICALS } from '../chemicals';
import { RECIPES } from '../recipes';

describe('nextLocale', () => {
  it('cycles en → zh-TW', () => {
    expect(nextLocale('en')).toBe('zh-TW');
  });

  it('cycles zh-TW → zh-CN', () => {
    expect(nextLocale('zh-TW')).toBe('zh-CN');
  });

  it('cycles zh-CN → en', () => {
    expect(nextLocale('zh-CN')).toBe('en');
  });

  it('full cycle returns to start', () => {
    let locale: Locale = 'en';
    locale = nextLocale(locale);
    locale = nextLocale(locale);
    locale = nextLocale(locale);
    expect(locale).toBe('en');
  });
});

describe('LOCALE_LABELS', () => {
  it('has labels for all 3 locales', () => {
    expect(Object.keys(LOCALE_LABELS)).toHaveLength(3);
    expect(LOCALE_LABELS.en).toBe('EN');
    expect(LOCALE_LABELS['zh-TW']).toBeTruthy();
    expect(LOCALE_LABELS['zh-CN']).toBeTruthy();
  });
});

describe('getMessages', () => {
  it('returns en messages', () => {
    expect(getMessages('en')).toBe(en);
  });

  it('returns zh-TW messages', () => {
    expect(getMessages('zh-TW')).toBe(zhTW);
  });

  it('returns zh-CN messages', () => {
    expect(getMessages('zh-CN')).toBe(zhCN);
  });
});

describe('i18n key structure consistency', () => {
  function getKeyStructure(obj: unknown, prefix = ''): string[] {
    const keys: string[] = [];
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        const path = prefix ? `${prefix}.${k}` : k;
        if (typeof v === 'function' || typeof v === 'string' || typeof v === 'number') {
          keys.push(path);
        } else if (typeof v === 'object' && v !== null) {
          keys.push(...getKeyStructure(v, path));
        }
      }
    }
    return keys.sort();
  }

  it('zh-TW has same key structure as en', () => {
    const enKeys = getKeyStructure(en);
    const zhTWKeys = getKeyStructure(zhTW);
    expect(zhTWKeys).toEqual(enKeys);
  });

  it('zh-CN has same key structure as en', () => {
    const enKeys = getKeyStructure(en);
    const zhCNKeys = getKeyStructure(zhCN);
    expect(zhCNKeys).toEqual(enKeys);
  });
});

describe('chemicals translations cover all chemical IDs', () => {
  const locales: [Locale, Messages][] = [
    ['en', en],
    ['zh-TW', zhTW],
    ['zh-CN', zhCN],
  ];

  for (const [locale, messages] of locales) {
    it(`${locale} has translations for all ${CHEMICALS.length} chemicals`, () => {
      for (const chem of CHEMICALS) {
        expect(messages.chemicals[chem.id], `${locale}: ${chem.id}`).toBeTruthy();
      }
    });
  }
});

describe('recipes translations cover all recipe IDs', () => {
  const locales: [Locale, Messages][] = [
    ['en', en],
    ['zh-TW', zhTW],
    ['zh-CN', zhCN],
  ];

  for (const [locale, messages] of locales) {
    it(`${locale} has translations for all ${RECIPES.length} recipes`, () => {
      for (const recipe of RECIPES) {
        expect(messages.recipes[recipe.id], `${locale}: ${recipe.id}`).toBeTruthy();
        expect(messages.recipes[recipe.id].name, `${locale}: ${recipe.id}.name`).toBeTruthy();
        expect(messages.recipes[recipe.id].description, `${locale}: ${recipe.id}.description`).toBeTruthy();
      }
    });
  }
});

describe('function-typed translations', () => {
  const locales: [Locale, Messages][] = [
    ['en', en],
    ['zh-TW', zhTW],
    ['zh-CN', zhCN],
  ];

  for (const [locale, messages] of locales) {
    it(`${locale}: ions.range returns string`, () => {
      const result = messages.ions.range(100, 250);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it(`${locale}: balance.deviation returns string`, () => {
      const result = messages.balance.deviation('5.0');
      expect(typeof result).toBe('string');
    });

    it(`${locale}: export.ecSection returns string`, () => {
      const result = messages.export.ecSection('1.85');
      expect(typeof result).toBe('string');
    });

    it(`${locale}: ph.result returns string`, () => {
      const result = messages.ph.result('0.5', 'HNO₃', '100');
      expect(typeof result).toBe('string');
    });

    it(`${locale}: stock.dilute returns string`, () => {
      const result = messages.stock.dilute('10', '100');
      expect(typeof result).toBe('string');
    });
  }
});
