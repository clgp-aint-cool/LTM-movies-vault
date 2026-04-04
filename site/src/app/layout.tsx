import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "Lam Thanh My Movies Collection",
    template: "%s | Lam Thanh My Movies Collection",
  },
  description: "Tổng hợp phim điện ảnh của diễn viên Lâm Thanh Mỹ — từ Cám, Tôi thấy hoa vàng trên cỏ xanh, Bóng đè đến Đoạt hồn.",
  metadataBase: new URL("https://lamthanhmy.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lam Thanh My Movies Collection",
    description: "Tổng hợp phim điện ảnh của diễn viên Lâm Thanh Mỹ.",
    url: "https://lamthanhmy.com",
    siteName: "Lam Thanh My Movies Collection",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lam Thanh My Movies Collection",
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
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center justify-between p-6 sm:p-8 border-b border-black/10 dark:border-white/10">
            <Link href="/" className="font-semibold">Lam Thanh My Movies Collection</Link>
            <div className="flex items-center gap-4 text-sm">
              <Link className="opacity-90 hover:opacity-100" href="/movies">Movies</Link>
              <Link className="opacity-90 hover:opacity-100" href="/about">About</Link>
            </div>
          </nav>
          {children}
          <footer className="p-6 sm:p-8 text-sm opacity-70 border-t border-black/10 dark:border-white/10 mt-10">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Lam Thanh My Movies Collection
          </footer>
        </div>
      </body>
    </html>
  );
}
