import { NextRequest, NextResponse } from "next/server";

// Base URL of the S3 bucket (no trailing slash)
const S3_BASE = "https://s3.hcm-5.cloud.cmctelecom.vn";
const BUCKET = "mysql-backup-test";
const PREFIX = "backup/backup2/new/";
const PAGE_SIZE = 24;

export const dynamic = "force-dynamic";

/** Parse keys from S3 ListBucketResult XML */
function parseKeys(xml: string): { keys: string[]; nextMarker: string | null } {
  const keys: string[] = [];
  // Extract all <Key>...</Key> values
  const keyMatches = xml.matchAll(/<Key>([^<]+)<\/Key>/g);
  for (const m of keyMatches) {
    const key = m[1];
    // Skip folder placeholder (size=0 entries ending with /)
    if (!key.endsWith("/")) keys.push(key);
  }

  // Extract NextMarker for pagination
  const nextMarkerMatch = xml.match(/<NextMarker>([^<]+)<\/NextMarker>/);
  const nextMarker = nextMarkerMatch ? nextMarkerMatch[1] : null;

  // IsTruncated
  const truncated = /<IsTruncated>true<\/IsTruncated>/.test(xml);
  return { keys, nextMarker: truncated ? nextMarker : null };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const marker = searchParams.get("marker") ?? "";

  const params = new URLSearchParams({
    prefix: PREFIX,
    "max-keys": String(PAGE_SIZE),
  });
  if (marker) params.set("marker", marker);

  try {
    const url = `${S3_BASE}/${BUCKET}/?${params.toString()}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json(
        { error: `S3 listing failed: ${res.status}` },
        { status: 502 }
      );
    }

    const xml = await res.text();
    const { keys, nextMarker } = parseKeys(xml);

    const images = keys
      .filter((k) => /\.(jpg|jpeg|png|webp|gif)$/i.test(k))
      .map((key, i) => ({
        id: `s3:${key}`,
        src: `${S3_BASE}/${BUCKET}/${key}`,
        alt: `Lâm Thanh Mỹ — ảnh ${i + 1}`,
        caption: "Instagram",
        category: "other" as const,
      }));

    return NextResponse.json(
      {
        images,
        hasMore: nextMarker !== null,
        nextMarker,
      },
      {
        headers: {
          // Cache 5 minutes at CDN/browser level
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[gallery/images] fetch error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
