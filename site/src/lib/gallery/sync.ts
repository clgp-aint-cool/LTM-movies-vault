import "server-only";
import { revalidatePath } from "next/cache";
import { fetchPublicInstagramMedia } from "@/lib/instagram/public-profile";
import { headObject, putObject, publicObjectUrl, getObject } from "@/lib/storage/s3";
import { validateGalleryManifest } from "./validation";
import { MANIFEST_KEY } from "./read";
import type { GalleryManifest } from "./types";

function keyPart(value: string) { return encodeURIComponent(value).replace(/%/g, "_"); }
async function previousManifest(): Promise<GalleryManifest> {
  try {
    const object = await getObject(MANIFEST_KEY);
    if (!object.Body) throw new Error("empty");
    return validateGalleryManifest(JSON.parse(await object.Body.transformToString("utf-8")));
  } catch { return { version: 1, updatedAt: new Date(0).toISOString(), images: [] }; }
}

export async function syncGallery() {
  const media = await fetchPublicInstagramMedia();
  const prior = await previousManifest();
  let uploaded = 0; let skipped = 0;
  const failures: Array<{ id: string; error: string }> = [];
  const images = [];
  for (const item of media) {
    const key = `gallery/instagram/${keyPart(item.mediaId)}/${keyPart(item.childId)}.jpg`;
    try {
      try { await headObject(key); skipped++; }
      catch {
        const response = await fetch(item.url, { redirect: "error", signal: AbortSignal.timeout(Number(process.env.INSTAGRAM_DOWNLOAD_TIMEOUT_MS || 15000)) });
        const type = response.headers.get("content-type") || "";
        if (!response.ok || !type.startsWith("image/") || !response.body) throw new Error("Invalid image download");
        await putObject(key, response.body as never, "image/jpeg", "public, max-age=31536000, immutable");
        uploaded++;
      }
      images.push({ id: `${item.mediaId}:${item.childId}`, src: publicObjectUrl(key), alt: item.alt, caption: item.caption, category: item.category });
    } catch (error) { failures.push({ id: `${item.mediaId}:${item.childId}`, error: error instanceof Error ? error.message : "upload failed" }); }
  }
  if (failures.length) throw Object.assign(new Error("Gallery sync failed"), { failures });
  const manifest = validateGalleryManifest({ version: 1, updatedAt: new Date().toISOString(), images: images.length ? images : prior.images });
  await putObject(MANIFEST_KEY, JSON.stringify(manifest), "application/json", "no-cache");
  revalidatePath("/gallery");
  return { discovered: media.length, uploaded, skipped, failed: 0, images: manifest.images.length };
}
