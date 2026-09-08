import "server-only";
import { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const bucket = process.env.S3_BUCKET;
const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || undefined,
  region: process.env.S3_REGION || "us-east-1",
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
    ? { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY }
    : undefined,
});

function requireBucket() { if (!bucket) throw new Error("S3_BUCKET is not configured"); return bucket; }

export async function headObject(key: string) {
  return client.send(new HeadObjectCommand({ Bucket: requireBucket(), Key: key }));
}

export async function getObject(key: string) {
  return client.send(new GetObjectCommand({ Bucket: requireBucket(), Key: key }));
}

export async function putObject(key: string, body: PutObjectCommand["input"]["Body"], contentType: string, cacheControl?: string) {
  return client.send(new PutObjectCommand({ Bucket: requireBucket(), Key: key, Body: body, ContentType: contentType, CacheControl: cacheControl }));
}

export function publicObjectUrl(key: string) {
  const base = process.env.S3_PUBLIC_BASE_URL;
  if (!base) throw new Error("S3_PUBLIC_BASE_URL is not configured");
  return `${base.replace(/\/$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export async function listObjects(prefix: string, continuationToken?: string, maxKeys = 100) {
  return client.send(
    new ListObjectsV2Command({
      Bucket: requireBucket(),
      Prefix: prefix,
      MaxKeys: maxKeys,
      ContinuationToken: continuationToken,
    })
  );
}
