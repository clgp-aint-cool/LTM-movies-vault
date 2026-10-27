import { NextResponse } from "next/server";
import { listS3GalleryImages } from "@/lib/gallery/s3-public";

export const revalidate = 300;

export async function GET() {
  try {
    const images = await listS3GalleryImages();
    return NextResponse.json(
      { images },
      {
        headers: {
          // Cache 5 minutes at CDN/browser level
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[gallery/images] fetch error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
