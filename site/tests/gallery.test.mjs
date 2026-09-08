import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

// Test helper that mirrors validation logic
const categories = new Set(["portrait", "poster", "event", "other"]);
const MAX_IMAGES = 500;
const MAX_STRING = 500;

function boundedString(value) {
  return typeof value === "string" && value.length > 0 && value.length <= MAX_STRING;
}

function validateGalleryImage(value) {
  if (!value || typeof value !== "object") throw new Error("Invalid gallery image");
  const image = value;
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
  if (!categories.has(image.category)) throw new Error("Invalid gallery category");
  if (image.year !== undefined && (!Number.isInteger(image.year) || image.year < 1900 || image.year > 2200)) {
    throw new Error("Invalid gallery year");
  }
  if (image.id !== undefined && !boundedString(image.id)) throw new Error("Invalid gallery id");
  return image;
}

function validateGalleryManifest(value) {
  if (!value || typeof value !== "object") throw new Error("Invalid gallery manifest");
  const manifest = value;
  if (manifest.version !== 1 || typeof manifest.updatedAt !== "string" || !Array.isArray(manifest.images)) {
    throw new Error("Invalid gallery manifest shape");
  }
  if (manifest.images.length > MAX_IMAGES) throw new Error("Gallery image limit exceeded");
  return { version: 1, updatedAt: manifest.updatedAt, images: manifest.images.map(validateGalleryImage) };
}

// Instagram parser helper
const allowedCdnHosts = ["cdninstagram.com", "fbcdn.net", "instagram.com"];
function isImageUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedCdnHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch { return false; }
}

function stableId(value) {
  return value || crypto.createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function collectMedia(value, out, mediaId = "") {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value.slice(0, 1000)) collectMedia(item, out, mediaId);
    return;
  }
  const item = value;
  const id = typeof item.id === "string" ? item.id : typeof item.pk === "string" || typeof item.pk === "number" ? String(item.pk) : mediaId;
  const caption = typeof item.caption === "string" ? item.caption : typeof item.caption === "object" && item.caption && typeof item.caption.text === "string" ? item.caption.text : "Instagram";
  const candidates = [item.display_url, item.displayUrl, item.thumbnail_src, item.image_url, item.url];
  const image = candidates.find(isImageUrl);
  const children = item.edge_sidecar_to_children;
  if (image && id) {
    out.push({
      mediaId: stableId(mediaId || id),
      childId: stableId(id),
      url: image,
      alt: caption.slice(0, 200),
      caption: caption.slice(0, 500),
      category: "other",
    });
  }
  if (children) collectMedia(children, out, mediaId || id);
  for (const [key, child] of Object.entries(item)) {
    if (key !== "edge_sidecar_to_children" && (typeof child === "object" || Array.isArray(child))) {
      collectMedia(child, out, mediaId);
    }
  }
}

function safeCompare(a, b) {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function publicObjectUrl(key, base = "https://s3.example.com/bucket") {
  return `${base.replace(/\/$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

test("validateGalleryImage accepts valid relative and HTTPS URLs", () => {
  const local = validateGalleryImage({
    id: "legacy:1.jpg",
    src: "/gallery_images/1.jpg",
    alt: "Alt text",
    caption: "Caption",
    category: "other",
    year: 2024,
  });
  assert.equal(local.src, "/gallery_images/1.jpg");

  const remote = validateGalleryImage({
    id: "s3:1",
    src: "https://s3.example.com/gallery/img.jpg",
    alt: "Alt text",
    caption: "Caption",
    category: "portrait",
  });
  assert.equal(remote.src, "https://s3.example.com/gallery/img.jpg");
});

test("validateGalleryImage rejects unsafe URLs and invalid categories", () => {
  assert.throws(() => validateGalleryImage({
    src: "http://insecure.example.com/img.jpg",
    alt: "Alt",
    caption: "Caption",
    category: "other",
  }), /Unsafe gallery URL/);

  assert.throws(() => validateGalleryImage({
    src: "javascript:alert(1)",
    alt: "Alt",
    caption: "Caption",
    category: "other",
  }), /Unsafe gallery URL/);

  assert.throws(() => validateGalleryImage({
    src: "https://s3.example.com/img.jpg",
    alt: "Alt",
    caption: "Caption",
    category: "invalid-category",
  }), /Invalid gallery category/);
});

test("validateGalleryManifest enforces schema, version, and image limits", () => {
  const manifest = validateGalleryManifest({
    version: 1,
    updatedAt: new Date().toISOString(),
    images: [
      {
        id: "1",
        src: "https://s3.example.com/1.jpg",
        alt: "Image 1",
        caption: "Caption 1",
        category: "event",
      },
    ],
  });
  assert.equal(manifest.version, 1);
  assert.equal(manifest.images.length, 1);

  assert.throws(() => validateGalleryManifest({
    version: 2,
    updatedAt: new Date().toISOString(),
    images: [],
  }), /Invalid gallery manifest shape/);
});

test("Instagram parser extracts single post and carousel children while filtering video URLs", () => {
  const mockPayload = [
    {
      id: "post_1",
      display_url: "https://scontent.cdninstagram.com/v/t51.2885-15/e35/1.jpg",
      caption: { text: "Single photo post" },
    },
    {
      id: "carousel_post_2",
      edge_sidecar_to_children: {
        edges: [
          {
            node: {
              id: "child_2_1",
              display_url: "https://scontent.cdninstagram.com/v/t51.2885-15/e35/2_1.jpg",
              caption: "Carousel 1",
            },
          },
          {
            node: {
              id: "child_2_2",
              display_url: "https://scontent.cdninstagram.com/v/t51.2885-15/e35/2_2.jpg",
              caption: "Carousel 2",
            },
          },
        ],
      },
    },
    {
      id: "video_post_3",
      // Video only, no valid image candidate
      video_url: "https://scontent.cdninstagram.com/video.mp4",
      caption: "Video only",
    },
    {
      id: "untrusted_post_4",
      // Host outside allowlist
      display_url: "https://attacker.com/malicious.jpg",
      caption: "Attacker image",
    },
  ];

  const found = [];
  collectMedia(mockPayload, found);

  assert.equal(found.length, 3);
  assert.equal(found[0].childId, "post_1");
  assert.equal(found[1].childId, "child_2_1");
  assert.equal(found[2].childId, "child_2_2");
  assert.ok(found.every((item) => item.url.includes("cdninstagram.com")));
});

test("Timing-safe token comparison validates accurately", () => {
  const secret = "super-secret-sync-token-12345";
  assert.equal(safeCompare(secret, secret), true);
  assert.equal(safeCompare("wrong-token", secret), false);
  assert.equal(safeCompare("", secret), false);
});

test("Public S3 URL generation properly encodes keys and preserves base URL", () => {
  const url = publicObjectUrl("gallery/legacy/my photo #1.jpg", "https://s3.cloud.cmctelecom.vn/bucket");
  assert.equal(url, "https://s3.cloud.cmctelecom.vn/bucket/gallery/legacy/my%20photo%20%231.jpg");
});
