import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

const FONT_DIR = join(process.cwd(), "node_modules/@fontsource/be-vietnam-pro/files");
const SUBSETS = ["vietnamese", "latin-ext", "latin"] as const;

/** Be Vietnam Pro (500 + 800) for ImageResponse; Satori needs woff/ttf, not woff2 */
export async function ogFonts() {
  const fonts = await Promise.all(
    ([500, 800] as const).flatMap((weight) =>
      SUBSETS.map(async (subset) => ({
        // One family per subset: Satori keeps only one font per name+weight
        name: `BVP-${subset}`,
        data: await readFile(join(FONT_DIR, `be-vietnam-pro-${subset}-${weight}-normal.woff`)),
        weight,
        style: "normal" as const,
      }))
    )
  );
  return fonts;
}

/** Reads a JPEG/PNG from public/ as a data URI (Satori does not support WebP) */
export async function publicImageDataUri(path: string) {
  const data = await readFile(join(process.cwd(), "public", path));
  const mime = path.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${data.toString("base64")}`;
}

/** Shared dark card frame with the site name in the footer */
export function OgFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 48,
        background: "linear-gradient(135deg, #0a0a0a 0%, #1c1917 55%, #3b0d0d 100%)",
        color: "#fafafa",
        fontFamily: SUBSETS.map((subset) => `BVP-${subset}`).join(", "),
      }}
    >
      <div style={{ display: "flex", flex: 1, gap: 48, alignItems: "center" }}>{children}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 24,
          fontSize: 24,
          color: "#a8a29e",
        }}
      >
        <span>Lâm Thanh Mỹ – Kho phim</span>
        <span style={{ color: "#fafafa", fontWeight: 800 }}>lamthanhmy.com</span>
      </div>
    </div>
  );
}

/** Site-level card: headline on the left, fanned-out movie posters on the right */
export async function siteCard({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  const posters = await Promise.all(
    ["/poster/cam.jpg", "/poster/bong-de.jpg", "/poster/doat-hon.jpg"].map(publicImageDataUri)
  );
  return (
    <OgFrame>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <span style={{ fontSize: 26, color: "#f87171", fontWeight: 800, letterSpacing: 2 }}>{kicker}</span>
        <span style={{ fontSize: title.length > 14 ? 60 : 72, fontWeight: 800, lineHeight: 1.1, marginTop: 16 }}>
          {title}
        </span>
        <span style={{ fontSize: 32, color: "#d6d3d1", marginTop: 24, lineHeight: 1.35 }}>{subtitle}</span>
      </div>
      <div style={{ display: "flex", position: "relative", width: 420, height: 486 }}>
        {posters.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            key={i}
            src={src}
            width={240}
            height={360}
            style={{
              position: "absolute",
              left: i * 90,
              top: [90, 30, 110][i],
              objectFit: "cover",
              borderRadius: 14,
              boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
              transform: `rotate(${[-6, 2, 8][i]}deg)`,
            }}
          />
        ))}
      </div>
    </OgFrame>
  );
}
