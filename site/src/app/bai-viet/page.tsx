import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { formatDate, getPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Tin tức, bài viết về Lâm Thanh Mỹ – Phim mới, vai diễn, tiểu sử" },
  description:
    "Tổng hợp tin tức và bài viết về diễn viên Lâm Thanh Mỹ: phim mới, vai diễn trong Cám, Bóng đè, Đoạt hồn, tiểu sử và hậu trường.",
  alternates: { canonical: "/bai-viet" },
  openGraph: {
    title: "Tin tức, bài viết về Lâm Thanh Mỹ",
    description: "Phim mới, vai diễn, tiểu sử và hậu trường của diễn viên Lâm Thanh Mỹ.",
    url: "/bai-viet",
  },
};

export default function PostsPage() {
  const posts = getPosts();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Tin tức, bài viết về Lâm Thanh Mỹ",
    url: absoluteUrl("/bai-viet"),
    inLanguage: "vi",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(`/bai-viet/${p.slug}`),
      datePublished: p.date,
    })),
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl sm:text-3xl font-semibold">Tin tức & bài viết về Lâm Thanh Mỹ</h1>
      <p className="opacity-70 mt-2 mb-8">
        Phim mới, vai diễn, tiểu sử và những điều thú vị về diễn viên Lâm Thanh Mỹ.
      </p>

      {posts.length === 0 ? (
        <p className="opacity-60">Chưa có bài viết nào.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/bai-viet/${p.slug}`} className="group flex gap-4 sm:gap-6">
                {p.cover && (
                  <div className="relative shrink-0 w-24 sm:w-32 aspect-[2/3] overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/5">
                    <Image src={p.cover} alt="" fill sizes="128px" className="object-cover" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold group-hover:underline">
                    {p.title}
                    {p.draft && <span className="ml-2 text-xs text-red-500 align-middle">[NHÁP]</span>}
                  </h2>
                  <p className="text-sm opacity-60 mt-1">
                    {formatDate(p.date)} · {p.readingMinutes} phút đọc
                  </p>
                  <p className="opacity-80 mt-2 text-sm sm:text-base">{p.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
