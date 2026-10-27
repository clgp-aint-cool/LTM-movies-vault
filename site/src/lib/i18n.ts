// Pages that exist in both Vietnamese and English (/en). Used for hreflang + the language switcher.
const PAIRS: [vi: string, en: string][] = [
  ["/", "/en"],
  ["/movies", "/en/movies"],
  ["/about", "/en/about"],
];

export function isEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

/** Counterpart of `pathname` in the other language, or null if there is none */
export function counterpartPath(pathname: string): string | null {
  const movie = pathname.match(/^(\/en)?\/movies\/([^/]+)$/);
  if (movie) return movie[1] ? `/movies/${movie[2]}` : `/en/movies/${movie[2]}`;
  for (const [vi, en] of PAIRS) {
    if (pathname === vi) return en;
    if (pathname === en) return vi;
  }
  return null;
}

/** `alternates.languages` for a page that exists in both languages (vi path given) */
export function languageAlternates(viPath: string) {
  const en = counterpartPath(viPath)!;
  return { vi: viPath, en, "x-default": viPath };
}
