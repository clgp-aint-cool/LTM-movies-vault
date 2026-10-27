import type { Metadata } from "next";
import GalleryGrid from "./GalleryGrid";
import { readGalleryImages } from "@/lib/gallery/read";
import { listS3GalleryImages } from "@/lib/gallery/s3-public";

// Re-render at most every 5 minutes instead of on every request
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Hình ảnh, poster phim",
  description:
    "Thư viện ảnh phim điện ảnh của diễn viên Lâm Thanh Mỹ — poster phim Cám, Bóng đè, Đoạt hồn, Khế ước bán dâu và ảnh sự kiện. Tổng hợp hình ảnh từ các dự án điện ảnh và sự kiện ra mắt.",
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

export default async function GalleryPage() {
  const s3Images = await listS3GalleryImages().catch((err) => {
    console.warn("[gallery] S3 listing failed, using fallback:", err instanceof Error ? err.message : err);
    return [];
  });
  const images = s3Images.length > 0 ? s3Images : await readGalleryImages();
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-semibold mb-2">Thư viện ảnh</h1>
      <p className="opacity-70 text-sm mb-8">
        Poster phim, ảnh chân dung và hình ảnh sự kiện của diễn viên Lâm Thanh Mỹ.
      </p>

      <p className="opacity-70 text-sm leading-relaxed mb-8 max-w-3xl">
        Thư viện ảnh tổng hợp toàn bộ poster phim điện ảnh của diễn viên Lâm Thanh Mỹ,
        bao gồm Cám, Bóng đè, Tôi thấy hoa vàng trên cỏ xanh, Khế ước bán dâu,
        Đoạt hồn, Nghề siêu dễ, Vợ ba, Thất Sơn tâm linh, Tình đầu thơ ngây,
        Cục vàng của ngoại — cùng ảnh chân dung và ảnh sự kiện ra mắt phim.
      </p>

      <GalleryGrid images={images} />
    </div>
  );
}
