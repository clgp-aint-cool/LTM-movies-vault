import { ImageResponse } from "next/og";
import { OG_SIZE, ogFonts, siteCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Thư viện ảnh Lâm Thanh Mỹ";

export default async function Image() {
  return new ImageResponse(
    await siteCard({
      kicker: "THƯ VIỆN ẢNH",
      title: "Ảnh Lâm Thanh Mỹ",
      subtitle: "Poster phim, ảnh chân dung và hình ảnh sự kiện của diễn viên Lâm Thanh Mỹ",
    }),
    { ...size, fonts: await ogFonts() }
  );
}
