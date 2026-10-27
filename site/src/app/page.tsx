import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { actress, movies } from "@/data/movies";
import { formatDate, getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: { absolute: "Lâm Thanh Mỹ – Tổng hợp phim điện ảnh, vai diễn & hình ảnh" },
  description:
    "Tổng hợp phim điện ảnh của diễn viên Lâm Thanh Mỹ — 'em bé ma' của màn ảnh Việt. Xem phim Cám, Tôi thấy hoa vàng trên cỏ xanh, Khế ước bán dâu, Bóng đè, Đoạt hồn.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const posts = getPosts().slice(0, 3);
  return (
    <div className="min-h-screen p-6 sm:p-10">
      <header className="max-w-6xl mx-auto flex items-center gap-4 sm:gap-6">
        <Image
          src={actress.avatarUrl}
          alt={`Chân dung diễn viên ${actress.name}`}
          width={80}
          height={80}
          className="rounded-full object-cover"
          priority
        />
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">{actress.name}</h1>
          <p className="opacity-80 text-sm sm:text-base leading-relaxed">{actress.bio}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Phim Lâm Thanh Mỹ đã đóng</h2>
          <Link
            href="/movies"
            className="text-sm underline opacity-80 hover:opacity-100 transition-opacity"
          >
            Xem tất cả →
          </Link>
        </div>

        <p className="text-sm opacity-80 leading-relaxed mb-6">
          Diễn viên Lâm Thanh Mỹ sinh năm 2005, nổi tiếng với vai diễn trong các phim kinh dị
          Việt Nam như Đoạt hồn, Bóng đè, Cám, Khế ước bán dâu. Trang web này tổng hợp toàn bộ
          phim điện ảnh của Lâm Thanh Mỹ, cập nhật đầy đủ năm phát hành, đạo diễn và mô tả nội
          dung từng bộ phim.
        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {movies.map((m, i) => (
            <li key={m.slug} className="group">
              <Link href={`/movies/${m.slug}`}>
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/5">
                  <Image
                    src={m.posterUrl}
                    alt={`Poster phim ${m.title} (${m.year}) có Lâm Thanh Mỹ`}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    priority={i === 0}
                  />
                </div>
                <div className="mt-2">
                  <p className="font-medium leading-tight">{m.title}</p>
                  <p className="text-sm opacity-60">{m.year}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {posts.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Bài viết mới về Lâm Thanh Mỹ</h2>
              <Link href="/bai-viet" className="text-sm underline opacity-80 hover:opacity-100 transition-opacity">
                Xem tất cả →
              </Link>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug} className="rounded-xl border border-black/10 dark:border-white/10 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <Link href={`/bai-viet/${p.slug}`} className="block">
                    <p className="font-medium leading-snug">{p.title}</p>
                    <p className="text-xs opacity-60 mt-1">{formatDate(p.date)}</p>
                    <p className="text-sm opacity-80 mt-2 line-clamp-3">{p.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Secondary CTA */}
        <div className="mt-10 p-6 rounded-xl border border-black/10 dark:border-white/10 bg-black/5">
          <h2 className="text-lg font-medium mb-2">Về diễn viên Lâm Thanh Mỹ</h2>
          <p className="text-sm opacity-80 leading-relaxed mb-4">
            Lâm Thanh Mỹ sinh năm 2005, được biết đến với danh xưng &quot;em bé ma&quot; của màn ảnh
            Việt. Cô gây ấn tượng với lối diễn chân thật trong nhiều thể loại phim — từ kinh dị,
            cổ trang đến tâm lý xã hội.
          </p>
          <Link
            href="/about"
            className="inline-block text-sm underline opacity-80 hover:opacity-100 transition-opacity"
          >
            Đọc tiểu sử →
          </Link>
        </div>
      </main>
    </div>
  );
}
