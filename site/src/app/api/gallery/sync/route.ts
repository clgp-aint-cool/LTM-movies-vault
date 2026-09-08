import { NextResponse } from "next/server";
import { syncGallery } from "@/lib/gallery/sync";

import crypto from "node:crypto";

export const runtime = "nodejs";
let inFlight: Promise<{ discovered: number; uploaded: number; skipped: number; failed: number; images: number }> | null = null;

function safeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export async function POST(request: Request) {
  const expected = process.env.GALLERY_SYNC_TOKEN;
  const supplied = request.headers.get("x-gallery-sync-token");
  if (!expected || !supplied || !safeCompare(supplied, expected)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  if (!inFlight) inFlight = syncGallery().finally(() => { inFlight = null; });
  try {
    const result = await inFlight;
    return NextResponse.json({ ok: true, timestamp: new Date().toISOString(), ...(result as Record<string, unknown>) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: "Gallery sync failed" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
