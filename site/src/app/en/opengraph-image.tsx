import { ImageResponse } from "next/og";
import { OG_SIZE, ogFonts, siteCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Lam Thanh My – Vietnamese actress, horror films The Sisters, Hollow, Bride of the Covenant";

export default async function Image() {
  return new ImageResponse(
    await siteCard({
      kicker: "VIETNAMESE ACTRESS",
      title: "Lâm Thanh Mỹ",
      subtitle: "The \"little ghost\" of Vietnamese cinema: The Sisters, Hollow, Bride of the Covenant.",
    }),
    { ...size, fonts: await ogFonts() }
  );
}
