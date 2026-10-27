import { ImageResponse } from "next/og";
import { getMovieBySlug, movies } from "@/data/movies";
import { OG_SIZE, OgFrame, ogFonts, publicImageDataUri } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Poster phim có diễn viên Lâm Thanh Mỹ";

export function generateStaticParams() {
  return movies.map((m) => ({ slug: m.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);
  if (!movie) return new Response("Not found", { status: 404 });

  const poster = await publicImageDataUri(movie.posterUrl);
  const meta = [String(movie.year), movie.genres?.join(" · ")].filter(Boolean).join("  ·  ");

  return new ImageResponse(
    (
      <OgFrame>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          src={poster}
          width={324}
          height={486}
          style={{ objectFit: "cover", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}
        />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <span style={{ fontSize: 26, color: "#f87171", fontWeight: 800, letterSpacing: 2 }}>
            PHIM CÓ LÂM THANH MỸ
          </span>
          <span
            style={{
              fontSize: movie.title.length > 22 ? 60 : 76,
              fontWeight: 800,
              lineHeight: 1.1,
              marginTop: 16,
            }}
          >
            {movie.title}
          </span>
          <span style={{ fontSize: 32, color: "#d6d3d1", marginTop: 24 }}>{meta}</span>
          {movie.director && (
            <span style={{ fontSize: 28, color: "#a8a29e", marginTop: 12 }}>
              Đạo diễn: {movie.director}
            </span>
          )}
          {movie.role && (
            <span style={{ fontSize: 28, color: "#a8a29e", marginTop: 12 }}>
              Vai: {movie.role}
            </span>
          )}
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await ogFonts() }
  );
}
