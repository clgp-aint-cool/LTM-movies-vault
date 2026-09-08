import type { GalleryImage, GalleryManifest, GalleryCategory } from "./types";

const categories = new Set<GalleryCategory>(["portrait", "poster", "event", "other"]);
const MAX_IMAGES = Number(process.env.GALLERY_MAX_IMAGES || 500);
const MAX_STRING = 500;

function boundedString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= MAX_STRING;
}

export function validateGalleryImage(value: unknown): GalleryImage {
  if (!value || typeof value !== "object") throw new Error("Invalid gallery image");
  const image = value as Record<string, unknown>;
  if (!boundedString(image.src) || !boundedString(image.alt) || !boundedString(image.caption)) {
    throw new Error("Invalid gallery image strings");
  }
  if (typeof image.src === "string" && !image.src.startsWith("/")) {
    try {
      const url = new URL(image.src);
      if (url.protocol !== "https:") throw new Error("Unsafe gallery URL");
    } catch {
      throw new Error("Unsafe gallery URL");
    }
  }
  if (!categories.has(image.category as GalleryCategory)) throw new Error("Invalid gallery category");
  if (image.year !== undefined && (typeof image.year !== "number" || !Number.isInteger(image.year) || image.year < 1900 || image.year > 2200)) {
    throw new Error("Invalid gallery year");
  }
  if (image.id !== undefined && !boundedString(image.id)) throw new Error("Invalid gallery id");
  return image as GalleryImage;
}

export function validateGalleryManifest(value: unknown): GalleryManifest {
  if (!value || typeof value !== "object") throw new Error("Invalid gallery manifest");
  const manifest = value as Record<string, unknown>;
  if (manifest.version !== 1 || typeof manifest.updatedAt !== "string" || !Array.isArray(manifest.images)) {
    throw new Error("Invalid gallery manifest shape");
  }
  if (manifest.images.length > MAX_IMAGES) throw new Error("Gallery image limit exceeded");
  return { version: 1, updatedAt: manifest.updatedAt, images: manifest.images.map(validateGalleryImage) };
}
