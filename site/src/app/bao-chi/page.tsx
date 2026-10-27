import type { Metadata } from "next";
import Link from "next/link";
import PressList from "@/components/PressList";
import { press } from "@/data/press";

export const metadata: Metadata = {
  title: { absolute: "Báo chí nói gì về Lâm Thanh Mỹ – Phỏng vấn, bài viết" },
  description:
    "Tổng hợp các bài phỏng vấn và bài báo về diễn viên Lâm Thanh Mỹ trên VnExpress, Dân Trí, Thanh Niên, VTV, VOV, Kenh14 — về vai Cám, Khế ước bán dâu và sự nghiệp.",
  alternates: { canonical: "/bao-chi" },
};

export default function PressPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bài báo về Lâm Thanh Mỹ",
    itemListElement: press.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: p.url, name: p.title })),
  };
  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl sm:text-3xl font-semibold">Báo chí nói gì về Lâm Thanh Mỹ</h1>
      <p className="opacity-80 mt-2 mb-8 leading-relaxed">
        Những bài phỏng vấn, bài viết về Lâm Thanh Mỹ trên các báo lớn. Bấm vào từng mục để đọc bài gốc trên trang báo.
        Xem thêm <Link href="/hanh-trinh" className="underline">hành trình sự nghiệp</Link> của cô.
      </p>
      <PressList />
    </div>
  );
}
