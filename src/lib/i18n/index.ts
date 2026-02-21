import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { createElement } from 'react';
import type { Locale, Messages } from './types';
import { en } from './en';
import { zhTW } from './zhTW';
import { zhCN } from './zhCN';

export type { Locale, Messages } from './types';

const MESSAGES: Record<Locale, Messages> = { en, 'zh-TW': zhTW, 'zh-CN': zhCN };

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  'zh-TW': '\u7E41\u4E2D',
  'zh-CN': '\u7B80\u4E2D',
};

const LOCALE_CYCLE: Locale[] = ['en', 'zh-TW', 'zh-CN'];

export function nextLocale(current: Locale): Locale {
  const idx = LOCALE_CYCLE.indexOf(current);
  return LOCALE_CYCLE[(idx + 1) % LOCALE_CYCLE.length];
}

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('locale');
  if (stored === 'en' || stored === 'zh-TW' || stored === 'zh-CN') return stored;
  const lang = navigator.language;
  if (lang === 'zh-TW' || lang === 'zh-Hant' || lang.startsWith('zh-Hant')) return 'zh-TW';
  if (lang.startsWith('zh')) return 'zh-CN';
  return 'en';
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Messages;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: en,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('locale', l);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = MESSAGES[locale];

  return createElement(
    LocaleContext.Provider,
    { value: { locale, setLocale, t } },
    children,
  );
}

export function useT() {
  return useContext(LocaleContext);
}

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale];
}
