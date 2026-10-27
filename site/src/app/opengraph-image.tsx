import { ImageResponse } from "next/og";
import { movies } from "@/data/movies";
import { OG_SIZE, ogFonts, siteCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Lâm Thanh Mỹ – Tổng hợp phim điện ảnh, vai diễn & hình ảnh";

export default async function Image() {
  return new ImageResponse(
    await siteCard({
      kicker: "DIỄN VIÊN",
      title: "Lâm Thanh Mỹ",
      subtitle: `Tổng hợp ${movies.length} phim điện ảnh, vai diễn & hình ảnh – Cám, Bóng đè, Đoạt hồn…`,
    }),
    { ...size, fonts: await ogFonts() }
  );
}
