export const LANGS = ['fr', 'en', 'ar'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'fr';

export const LANG_META: Record<Lang, { label: string; dir: 'ltr' | 'rtl'; locale: string }> = {
  fr: { label: 'FR', dir: 'ltr', locale: 'fr_FR' },
  en: { label: 'EN', dir: 'ltr', locale: 'en_US' },
  ar: { label: 'AR', dir: 'rtl', locale: 'ar' },
};

export const SITE_URL = 'https://virtusoperandi.pages.dev';

/** Prefix any internal path with the active language: /fr/blog */
export function langPath(lang: Lang, path = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${clean === '/' ? '' : clean}`;
}

/** Swap the lang prefix of the current URL to another language */
export function swapLang(currentPath: string, targetLang: Lang): string {
  // currentPath looks like /fr/blog/my-post
  const withoutLang = currentPath.replace(/^\/(fr|en|ar)/, '') || '/';
  return langPath(targetLang, withoutLang);
}

/** Canonical URL for a given lang + path */
export function canonical(lang: Lang, path = ''): string {
  return `${SITE_URL}${langPath(lang, path)}`;
}

/** Resolve lang from URL params, fall back to default */
export function resolveLang(param: string | undefined): Lang {
  return LANGS.includes(param as Lang) ? (param as Lang) : DEFAULT_LANG;
}
