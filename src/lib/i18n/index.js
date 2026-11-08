import en from './en.json';
import fr from './fr.json';
import pt from './pt.json';

export const languages = {
  en,
  fr,
  pt
};

export function translate(language, key) {
  const dictionary = languages[language] || en;

  const find = (data) =>
    key.split('.').reduce(
      (value, part) => value?.[part],
      data
    );

  return find(dictionary) ?? find(en) ?? key;
}