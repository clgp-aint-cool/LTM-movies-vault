import "server-only";
import crypto from "node:crypto";
import type { InstagramMedia } from "@/lib/gallery/types";

const defaultTarget = "https://www.instagram.com/lamthanhmy/";
const allowedProfileHosts = new Set(["instagram.com", "www.instagram.com"]);
const allowedCdnHosts = ["cdninstagram.com", "fbcdn.net", "instagram.com"];

function targetUrl() {
  const value = process.env.INSTAGRAM_TARGET_URL || defaultTarget;
  const url = new URL(value);
  if (url.protocol !== "https:" || !allowedProfileHosts.has(url.hostname) || url.pathname.split("/").filter(Boolean).length !== 1) {
    throw new Error("INSTAGRAM_TARGET_URL must be an HTTPS Instagram profile");
  }
  return url;
}

function stableId(value: string) { return value || crypto.createHash("sha256").update(value).digest("hex").slice(0, 24); }
function isImageUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedCdnHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch { return false; }
}

function collect(value: unknown, out: InstagramMedia[], mediaId = "") {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) { for (const item of value.slice(0, 1000)) collect(item, out, mediaId); return; }
  const item = value as Record<string, unknown>;
  const id = typeof item.id === "string" ? item.id : typeof item.pk === "string" || typeof item.pk === "number" ? String(item.pk) : mediaId;
  const caption = typeof item.caption === "string" ? item.caption : typeof item.caption === "object" && item.caption && typeof (item.caption as Record<string, unknown>).text === "string" ? (item.caption as Record<string, string>).text : "Instagram";
  const candidates = [item.display_url, item.displayUrl, item.thumbnail_src, item.image_url, item.url];
  const image = candidates.find(isImageUrl);
  const children = item.edge_sidecar_to_children;
  if (image && id) out.push({ mediaId: stableId(mediaId || id), childId: stableId(id), url: image, alt: caption.slice(0, 200), caption: caption.slice(0, 500), category: "other" });
  if (children) collect(children, out, mediaId || id);
  for (const [key, child] of Object.entries(item)) if (key !== "edge_sidecar_to_children" && (typeof child === "object" || Array.isArray(child))) collect(child, out, mediaId);
}

export async function fetchPublicInstagramMedia(): Promise<InstagramMedia[]> {
  const response = await fetch(targetUrl(), { headers: { accept: "text/html" }, redirect: "error", signal: AbortSignal.timeout(Number(process.env.INSTAGRAM_TIMEOUT_MS || 10000)) });
  if (!response.ok || !(response.headers.get("content-type") || "").includes("text/html")) throw new Error("Instagram profile request failed");
  const text = await response.text();
  if (new TextEncoder().encode(text).byteLength > Number(process.env.INSTAGRAM_MAX_RESPONSE_BYTES || 5_000_000)) throw new Error("Instagram response too large");
  const found: InstagramMedia[] = [];
  for (const match of text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { collect(JSON.parse(match[1]), found); } catch { /* unrelated scripts */ }
  }
  const seen = new Set<string>();
  return found.filter((item) => !seen.has(`${item.mediaId}:${item.childId}`) && seen.add(`${item.mediaId}:${item.childId}`)).slice(0, Number(process.env.INSTAGRAM_MAX_IMAGES || 200));
}
