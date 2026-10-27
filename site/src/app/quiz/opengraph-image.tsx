import { ImageResponse } from "next/og";
import { OG_SIZE, ogFonts, siteCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Quiz: Bạn hiểu Lâm Thanh Mỹ bao nhiêu?";

export default async function Image() {
  return new ImageResponse(
    await siteCard({
      kicker: "QUIZ 10 CÂU",
      title: "Bạn hiểu Lâm Thanh Mỹ bao nhiêu?",
      subtitle: "Vai diễn, đạo diễn, biệt danh “em bé ma”… Thử ngay và khoe điểm với bạn bè!",
    }),
    { ...size, fonts: await ogFonts() }
  );
}
