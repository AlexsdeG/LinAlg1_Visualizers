import { useState, useCallback } from 'react';
import { en } from '../locales/en';
import { de } from '../locales/de';

type Locale = 'en' | 'de';
type Translations = typeof en;
type TranslationKey = keyof Translations;

const dictionaries: Record<Locale, Translations> = {
  en,
  de,
};

export const useTranslation = () => {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useCallback((key: TranslationKey): string => {
    return dictionaries[locale][key] || key;
  }, [locale]);

  return { t, locale, setLocale };
};