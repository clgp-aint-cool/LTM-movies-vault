import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Lam Thanh My – Vietnamese actress: films, roles & photos",
    template: "%s – Lam Thanh My",
  },
  description:
    "Fan archive of Vietnamese actress Lâm Thanh Mỹ (Lam Thanh My), known for horror films The Sisters (Cám), Hollow (Đoạt hồn), Bride of the Covenant and Yellow Flowers on the Green Grass.",
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    alternateLocale: ["vi_VN"],
    type: "website",
  },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <div lang="en">{children}</div>;
}
