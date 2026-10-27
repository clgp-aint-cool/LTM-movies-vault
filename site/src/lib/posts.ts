import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Bài viết là file Markdown trong site/content/posts — xem README.md trong thư mục đó
const POSTS_DIR = path.join(process.cwd(), "content/posts");

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  updated?: string;
  cover?: string;
  movies: string[];
  keywords: string[];
  draft: boolean;
  html: string;
  readingMinutes: number;
};

function toDateString(value: unknown, field: string, file: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  throw new Error(`${file}: "${field}" phải có dạng YYYY-MM-DD`);
}

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  if (!data.title || !data.description) throw new Error(`${file}: thiếu "title" hoặc "description"`);
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: String(data.title),
    description: String(data.description),
    date: toDateString(data.date, "date", file),
    updated: data.updated ? toDateString(data.updated, "updated", file) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    movies: Array.isArray(data.movies) ? data.movies.map(String) : [],
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    draft: data.draft === true,
    html: marked.parse(content, { async: false }),
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

let cache: Post[] | null = null;

/** Published posts, newest first. Drafts are only visible in `next dev`. */
export function getPosts(): Post[] {
  if (!cache || process.env.NODE_ENV === "development") {
    const files = fs.existsSync(POSTS_DIR)
      ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") && f !== "README.md")
      : [];
    cache = files
      .map(readPost)
      .filter((p) => !p.draft || process.env.NODE_ENV === "development")
      .sort((a, b) => b.date.localeCompare(a.date));
  }
  return cache;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function getPostsForMovie(movieSlug: string): Post[] {
  return getPosts().filter((p) => p.movies.includes(movieSlug));
}

export function formatDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}
