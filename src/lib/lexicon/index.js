// Great Books — Multilingual Greek Lexicon
// Common lexical data and language selection

import { lexicon as greekEn } from './greek-en.js';
import { lexiconFr } from './greek-fr.js';

// Translations available for each language.
// French and Portuguese will be added progressively.

const translations = {
  en: greekEn,
  fr: lexiconFr
};

// Return a Greek lexical entry in the requested language.
// English is the fallback language.

export function getLexiconEntry(key, language = 'en') {
  const baseEntry = greekEn[key];

  if (!baseEntry) return null;

  const translatedEntry = translations[language]?.[key] ?? {};

  return {
    ...baseEntry,
    ...translatedEntry
  };
}