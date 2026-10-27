import "server-only";
import type { GalleryImage } from "./types";

// Public CMC S3 bucket holding the Instagram photo backup
export const S3_BASE = "https://s3.hcm-5.cloud.cmctelecom.vn";
const BUCKET = "mysql-backup-test";
const PREFIX = "backup/backup2/new/";
const REVALIDATE_SECONDS = 300;
const MAX_PAGES = 20;

type S3Object = { key: string; etag: string; size: number };

function decodeXml(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function tag(block: string, name: string) {
  const m = block.match(new RegExp(`<${name}>([^<]*)</${name}>`));
  return m ? decodeXml(m[1]) : "";
}

function parseListing(xml: string) {
  const objects: S3Object[] = [];
  for (const m of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
    objects.push({
      key: tag(m[1], "Key"),
      etag: tag(m[1], "ETag").replace(/"/g, ""),
      size: Number(tag(m[1], "Size")) || 0,
    });
  }
  const truncated = /<IsTruncated>true<\/IsTruncated>/.test(xml);
  const nextMarker = tag(xml, "NextMarker") || objects.at(-1)?.key || "";
  return { objects, nextMarker: truncated && nextMarker ? nextMarker : null };
}

/** "foo (1).jpg" → "foo.jpg", so browser-download copies collapse into one */
function normalizeKey(key: string) {
  return key.replace(/\s*\(\d+\)(?=\.[^.]+$)/, "").toLowerCase();
}

/**
 * Lists every image under PREFIX, skipping folder markers / empty objects and
 * removing duplicates (same ETag or same name with a " (n)" suffix).
 * The listing is cached for REVALIDATE_SECONDS via the Next data cache.
 */
export async function listS3GalleryImages(): Promise<GalleryImage[]> {
  const objects: S3Object[] = [];
  let marker: string | null = "";
  for (let page = 0; marker !== null && page < MAX_PAGES; page++) {
    const params = new URLSearchParams({ prefix: PREFIX, "max-keys": "1000" });
    if (marker) params.set("marker", marker);
    const res = await fetch(`${S3_BASE}/${BUCKET}/?${params}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["s3-gallery"] },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`S3 listing failed: ${res.status}`);
    const parsed = parseListing(await res.text());
    objects.push(...parsed.objects);
    marker = parsed.nextMarker;
  }

  const seenEtags = new Set<string>();
  const seenKeys = new Set<string>();
  const unique = objects
    .filter((o) => o.size > 0 && !o.key.endsWith("/") && /\.(jpe?g|png|webp|gif|avif)$/i.test(o.key))
    // Process the original name before its " (1)" copy so the clean key wins
    .sort((a, b) => a.key.length - b.key.length)
    .filter((o) => {
      const norm = normalizeKey(o.key);
      if (seenKeys.has(norm) || (o.etag && seenEtags.has(o.etag))) return false;
      seenKeys.add(norm);
      if (o.etag) seenEtags.add(o.etag);
      return true;
    })
    // Filenames embed the post timestamp/id, so a numeric sort puts newest first
    .sort((a, b) => b.key.localeCompare(a.key, undefined, { numeric: true }));

  return unique.map((o, i) => ({
    id: `s3:${o.key}`,
    src: `${S3_BASE}/${BUCKET}/${o.key.split("/").map(encodeURIComponent).join("/")}`,
    alt: `Lâm Thanh Mỹ – ảnh ${i + 1}`,
    caption: "Instagram",
    category: "other" as const,
  }));
}
