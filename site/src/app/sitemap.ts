import type { MetadataRoute } from "next";
import { movies } from "@/data/movies";
import { absoluteUrl } from "@/lib/site";
import { getPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/movies"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/gallery"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/bai-viet"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const moviePages: MetadataRoute.Sitemap = movies.map((m) => ({
    url: absoluteUrl(`/movies/${m.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [absoluteUrl(m.posterUrl)],
  }));

  const postPages: MetadataRoute.Sitemap = getPosts().map((p) => ({
    url: absoluteUrl(`/bai-viet/${p.slug}`),
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...moviePages, ...postPages];
}
