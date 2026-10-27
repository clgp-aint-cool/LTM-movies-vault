import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { movies } from "@/data/movies";

export const metadata: Metadata = {
  title: { absolute: "Danh sách phim Lâm Thanh Mỹ đã đóng – Đầy đủ, mới nhất" },
  description:
    "Danh sách toàn bộ phim điện ảnh có sự tham gia của diễn viên Lâm Thanh Mỹ — từ Cám, Tôi thấy hoa vàng trên cỏ xanh, Khế ước bán dâu đến Bóng đè.",
  alternates: {
    canonical: "/movies",
  },
};

type SearchParams = Promise<{ q?: string; y?: string }>;

export default async function MoviesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = (params.q ?? "").toLowerCase();
  const year = params.y ? Number(params.y) : undefined;

  const filtered = movies.filter((m) => {
    const matchesQuery = query
      ? m.title.toLowerCase().includes(query) || m.description.toLowerCase().includes(query)
      : true;
    const matchesYear = year ? m.year === year : true;
    return matchesQuery && matchesYear;
  }).sort((a, b) => b.year - a.year);

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-semibold mb-2">Danh sách phim Lâm Thanh Mỹ đã đóng</h1>
      <p className="opacity-80 text-sm leading-relaxed mb-6 max-w-3xl">
        Toàn bộ {movies.length} phim điện ảnh có sự tham gia của diễn viên Lâm Thanh Mỹ, từ phim kinh
        dị Đoạt hồn (2014), Bóng đè (2022), Cám (2024) đến phim tâm lý Tôi thấy hoa vàng trên cỏ
        xanh (2015). Bấm vào từng phim để xem thông tin, vai diễn và trailer.
      </p>
      <form className="flex flex-wrap gap-3 mb-6">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Tìm theo tên phim"
          className="border border-black/10 dark:border-white/10 rounded px-3 py-2 bg-transparent"
        />
        <input
          name="y"
          defaultValue={params.y ?? ""}
          placeholder="Năm"
          className="border border-black/10 dark:border-white/10 rounded px-3 py-2 w-28 bg-transparent"
        />
        <button className="rounded px-4 py-2 border border-black/10 dark:border-white/10">Lọc</button>
      </form>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((m) => (
          <li key={m.slug} className="group">
            <Link href={`/movies/${m.slug}`}>
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/5">
                <Image
                  src={m.posterUrl}
                  alt={`Poster phim ${m.title} (${m.year}) có Lâm Thanh Mỹ`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-2">
                <p className="font-medium leading-tight">{m.title}</p>
                <p className="text-sm opacity-70">{m.year}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="opacity-70 mt-8">Không tìm thấy phim phù hợp.</p>
      )}
    </div>
  );
}


