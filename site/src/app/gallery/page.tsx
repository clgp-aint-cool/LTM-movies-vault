import type { Metadata } from "next";
import GalleryGrid from "./GalleryGrid";

export const metadata: Metadata = {
  title: "Thư viện ảnh",
  description:
    "Thư viện ảnh phim điện ảnh của diễn viên Lâm Thanh Mỹ — poster phim Cám, Bóng đè, Đoạt hồn, Khe ước bán dâu và ảnh sự kiện. Tổng hợp hình ảnh từ các dự án điện ảnh và sự kiện ra mắt.",
  keywords: [
    "thư viện ảnh Lâm Thanh Mỹ",
    "hình ảnh phim Lâm Thanh Mỹ",
    "poster phim Cám",
    "poster Bóng đè",
    "ảnh sự kiện Lâm Thanh Mỹ",
    "film stills Lâm Thanh Mỹ",
  ],
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Thư viện ảnh Lâm Thanh Mỹ",
    description:
      "Tổng hợp poster phim, ảnh chân dung và sự kiện của diễn viên Lâm Thanh Mỹ.",
  },
};

export default function GalleryPage() {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-semibold mb-2">Thư viện ảnh</h1>
      <p className="opacity-70 text-sm mb-8">
        Poster phim, ảnh chân dung và hình ảnh sự kiện của diễn viên Lâm Thanh Mỹ.
      </p>

      {/* SEO paragraph — visible to search engines, hidden from screen */}
      <p className="sr-only">
        Thư viện ảnh tổng hợp toàn bộ poster phim điện ảnh của diễn viên Lâm Thanh Mỹ,
        bao gồm Cám, Bóng đè, Tôi thấy hoa vàng trên cỏ xanh, Khe ước bán dâu,
        Đoạt hồn, Nghề siêu dễ, Vợ ba, Thất Sơn tâm linh, Tình đầu thơ ngây,
        Cục vàng của ngoại — cùng ảnh chân dung và ảnh sự kiện ra mắt phim.
      </p>

      <GalleryGrid />
    </div>
  );
}
