import "server-only";
import { galleryImages } from "@/data/gallery";
import { getObject } from "@/lib/storage/s3";
import { validateGalleryManifest } from "./validation";
import type { GalleryImage } from "./types";

const MANIFEST_KEY = "gallery/manifest.json";
const timeoutMs = Number(process.env.GALLERY_READ_TIMEOUT_MS || 3000);

export async function readGalleryImages(): Promise<GalleryImage[]> {
  try {
    const response = await Promise.race([
      getObject(MANIFEST_KEY),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Gallery manifest timeout")), timeoutMs)),
    ]);
    if (!response.Body || typeof response.Body.transformToString !== "function") throw new Error("Empty gallery manifest");
    const manifest = validateGalleryManifest(JSON.parse(await response.Body.transformToString("utf-8")));
    return manifest.images;
  } catch (error) {
    console.warn("Using bundled gallery fallback:", error instanceof Error ? error.message : "unknown error");
    return galleryImages;
  }
}

export { MANIFEST_KEY };
