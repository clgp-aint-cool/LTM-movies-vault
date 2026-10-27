import { ImageResponse } from "next/og";
import { OG_SIZE, OgFrame, ogFonts, publicImageDataUri, siteCard } from "@/lib/og";
import { formatDate } from "@/lib/posts";
import { getUpcomingMovies } from "@/lib/upcoming";
import { releaseTimestamp } from "@/lib/release";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Đếm ngược phim sắp ra mắt của Lâm Thanh Mỹ";
export const revalidate = 3600;

export default async function Image() {
  const movie = getUpcomingMovies()[0];
  const fonts = await ogFonts();
  if (!movie) {
    return new ImageResponse(
      await siteCard({ kicker: "SẮP RA MẮT", title: "Phim mới của Lâm Thanh Mỹ", subtitle: "Đếm ngược ngày khởi chiếu các phim sắp ra mắt." }),
      { ...size, fonts }
    );
  }

  const days = Math.ceil((releaseTimestamp(movie.releaseDate!) - Date.now()) / 86_400_000);
  const poster = await publicImageDataUri(movie.posterUrl);

  return new ImageResponse(
    (
      <OgFrame>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={poster} width={324} height={458} style={{ objectFit: "cover", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <span style={{ fontSize: 26, color: "#f87171", fontWeight: 800, letterSpacing: 2 }}>SẮP RA MẮT · CÓ LÂM THANH MỸ</span>
          <span style={{ fontSize: movie.title.length > 18 ? 60 : 76, fontWeight: 800, lineHeight: 1.1, marginTop: 16 }}>{movie.title}</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 28 }}>
            <span style={{ fontSize: 120, fontWeight: 800, color: "#f87171", lineHeight: 1 }}>{days}</span>
            <span style={{ fontSize: 40, fontWeight: 800 }}>ngày nữa</span>
          </div>
          <span style={{ fontSize: 30, color: "#d6d3d1", marginTop: 16 }}>
            {movie.releaseTentative ? "Dự kiến khởi chiếu" : "Khởi chiếu"} {formatDate(movie.releaseDate!)}
          </span>
        </div>
      </OgFrame>
    ),
    { ...size, fonts }
  );
}
