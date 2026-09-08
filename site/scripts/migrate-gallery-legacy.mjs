import fs from "node:fs";
import path from "node:path";
import { S3Client, HeadObjectCommand, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dir = path.join(root, "public/gallery_images");
const bucket = process.env.S3_BUCKET;
const dryRun = process.argv.includes("--dry-run");
if (!bucket) throw new Error("S3_BUCKET is required");
const client = new S3Client({ endpoint: process.env.S3_ENDPOINT || undefined, region: process.env.S3_REGION || "us-east-1", forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true", credentials: process.env.S3_ACCESS_KEY_ID ? { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY } : undefined });
const publicBase = process.env.S3_PUBLIC_BASE_URL;
if (!dryRun && !publicBase) throw new Error("S3_PUBLIC_BASE_URL is required when not in dry-run mode");

const MANIFEST_KEY = "gallery/manifest.json";

function getContentType(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "application/octet-stream";
}

const files = fs.readdirSync(dir).filter((file) => /\.(jpe?g|png|webp|gif)$/i.test(file)).sort();
let uploaded = 0;
let skipped = 0;

for (const file of files) {
  const key = `gallery/legacy/${encodeURIComponent(file)}`;
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    skipped++;
    continue;
  } catch {
    // Key does not exist, upload
  }

  if (!dryRun) {
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fs.createReadStream(path.join(dir, file)),
      ContentType: getContentType(file),
      CacheControl: "public, max-age=31536000, immutable"
    }));
  }
  uploaded++;
}

let manifestUpdated = false;
if (!dryRun && publicBase) {
  let existingManifest = { version: 1, updatedAt: new Date().toISOString(), images: [] };
  try {
    const manifestObj = await client.send(new GetObjectCommand({ Bucket: bucket, Key: MANIFEST_KEY }));
    if (manifestObj.Body) {
      existingManifest = JSON.parse(await manifestObj.Body.transformToString("utf-8"));
    }
  } catch {
    // No manifest yet, use empty
  }

  const existingIds = new Set((existingManifest.images || []).map((img) => img.id || img.src));
  const legacyImages = files.map((file) => {
    const key = `gallery/legacy/${encodeURIComponent(file)}`;
    const src = `${publicBase.replace(/\/$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`;
    const id = `legacy:${file}`;
    return {
      id,
      src,
      alt: `Lâm Thanh Mỹ — ${path.parse(file).name}`,
      caption: "Thư viện ảnh",
      category: "other",
    };
  });

  const mergedImages = [...(existingManifest.images || [])];
  for (const item of legacyImages) {
    if (!existingIds.has(item.id)) {
      mergedImages.push(item);
      existingIds.add(item.id);
    }
  }

  const updatedManifest = {
    version: 1,
    updatedAt: new Date().toISOString(),
    images: mergedImages,
  };

  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: MANIFEST_KEY,
    Body: JSON.stringify(updatedManifest),
    ContentType: "application/json",
    CacheControl: "no-cache",
  }));
  manifestUpdated = true;
}

console.log(JSON.stringify({ dryRun, discovered: files.length, uploaded, skipped, manifestUpdated }));

