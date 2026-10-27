import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { actress } from "@/data/movies";
import { SITE_BRAND, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import SiteNav, { SiteFooterNote } from "@/components/SiteNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lâm Thanh Mỹ – Tổng hợp phim điện ảnh, vai diễn & hình ảnh",
    template: "%s – Lâm Thanh Mỹ",
  },
  description:
    "Tổng hợp phim điện ảnh của diễn viên Lâm Thanh Mỹ — 'em bé ma' màn ảnh Việt. Phim: Cám, Tôi thấy hoa vàng trên cỏ xanh, Khế ước bán dâu, Bóng đè, Đoạt hồn.",
  keywords: [
    "Lâm Thanh Mỹ",
    "diễn viên Lâm Thanh Mỹ",
    "phim Lâm Thanh Mỹ",
    "em bé ma màn ảnh Việt",
    "phim kinh dị Việt Nam",
    "Cám 2024",
    "Bóng đè",
    "Đoạt hồn",
    "Tôi thấy hoa vàng trên cỏ xanh",
    "Khế ước bán dâu",
  ],
  authors: [{ name: SITE_BRAND }],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Lâm Thanh Mỹ – Tổng hợp phim điện ảnh, vai diễn & hình ảnh",
    description: "Tổng hợp phim điện ảnh của diễn viên Lâm Thanh Mỹ.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lâm Thanh Mỹ – Tổng hợp phim điện ảnh",
    description: "Tổng hợp phim điện ảnh của diễn viên Lâm Thanh Mỹ.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: [SITE_BRAND, "lamthanhmy.com"],
      inLanguage: "vi-VN",
      about: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: actress.name,
      alternateName: ["Lam Thanh My", "Em bé ma của màn ảnh Việt"],
      birthDate: "2005",
      jobTitle: "Diễn viên",
      nationality: { "@type": "Country", name: "Việt Nam" },
      image: absoluteUrl(actress.avatarUrl),
      url: absoluteUrl("/about"),
      sameAs: ["https://www.instagram.com/lamthanhmy/"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="max-w-7xl mx-auto">
          <SiteNav />
          {children}
          <footer className="p-6 sm:p-8 text-sm opacity-70 border-t border-black/10 dark:border-white/10 mt-10">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {SITE_BRAND} · <SiteFooterNote />
          </footer>
        </div>
      </body>
    </html>
  );
}
