import { ImageResponse } from "next/og";
import { OG_SIZE, ogFonts, siteCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Tiểu sử diễn viên Lâm Thanh Mỹ";

export default async function Image() {
  return new ImageResponse(
    await siteCard({
      kicker: "TIỂU SỬ",
      title: "Lâm Thanh Mỹ là ai?",
      subtitle: "“Em bé ma” của màn ảnh Việt – từ Tôi thấy hoa vàng trên cỏ xanh đến Cám",
    }),
    { ...size, fonts: await ogFonts() }
  );
}
