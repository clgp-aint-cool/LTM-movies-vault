import type { MetadataRoute } from "next";
import { movies } from "@/data/movies";
import { absoluteUrl } from "@/lib/site";
import { getPosts } from "@/lib/posts";
import { languageAlternates } from "@/lib/i18n";

/** hreflang links for a page that has an /en twin */
function bilingual(viPath: string) {
  const langs = languageAlternates(viPath);
  return { languages: { vi: absoluteUrl(langs.vi), en: absoluteUrl(langs.en) } };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1, alternates: bilingual("/") },
    { url: absoluteUrl("/movies"), lastModified: now, changeFrequency: "weekly", priority: 0.9, alternates: bilingual("/movies") },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: bilingual("/about") },
    { url: absoluteUrl("/sap-ra-mat"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/hanh-trinh"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/bao-chi"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/quiz"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/en"), lastModified: now, changeFrequency: "weekly", priority: 0.7, alternates: bilingual("/") },
    { url: absoluteUrl("/en/movies"), lastModified: now, changeFrequency: "weekly", priority: 0.6, alternates: bilingual("/movies") },
    { url: absoluteUrl("/en/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6, alternates: bilingual("/about") },
    { url: absoluteUrl("/gallery"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/bai-viet"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const moviePages: MetadataRoute.Sitemap = movies.map((m) => ({
    url: absoluteUrl(`/movies/${m.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [absoluteUrl(m.posterUrl)],
    alternates: bilingual(`/movies/${m.slug}`),
  }));

  const moviePagesEn: MetadataRoute.Sitemap = movies.map((m) => ({
    url: absoluteUrl(`/en/movies/${m.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
    alternates: bilingual(`/movies/${m.slug}`),
  }));

  const postPages: MetadataRoute.Sitemap = getPosts().map((p) => ({
    url: absoluteUrl(`/bai-viet/${p.slug}`),
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...moviePages, ...moviePagesEn, ...postPages];
}
