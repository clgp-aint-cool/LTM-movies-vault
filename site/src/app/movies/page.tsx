import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { movies } from "@/data/movies";

export const metadata: Metadata = {
  title: "Tất cả phim",
  description:
    "Danh sách toàn bộ phim điện ảnh có sự tham gia của diễn viên Lâm Thanh Mỹ — từ Cám, Tôi thấy hoa vàng trên cỏ xanh, Khe ước bán dâu đến Bóng đè.",
  alternates: {
    canonical: "/movies",
  },
};

export default function MoviesPage({ searchParams }: { searchParams?: { q?: string; y?: string } }) {
  const query = (searchParams?.q ?? "").toLowerCase();
  const year = searchParams?.y ? Number(searchParams.y) : undefined;

  const filtered = movies.filter((m) => {
    const matchesQuery = query
      ? m.title.toLowerCase().includes(query) || m.description.toLowerCase().includes(query)
      : true;
    const matchesYear = year ? m.year === year : true;
    return matchesQuery && matchesYear;
  });

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-semibold mb-4">All Movies</h1>
      <form className="flex flex-wrap gap-3 mb-6">
        <input
          name="q"
          defaultValue={searchParams?.q ?? ""}
          placeholder="Search title or description"
          className="border border-black/10 dark:border-white/10 rounded px-3 py-2 bg-transparent"
        />
        <input
          name="y"
          defaultValue={searchParams?.y ?? ""}
          placeholder="Year"
          className="border border-black/10 dark:border-white/10 rounded px-3 py-2 w-28 bg-transparent"
        />
        <button className="rounded px-4 py-2 border border-black/10 dark:border-white/10">Filter</button>
      </form>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((m) => (
          <li key={m.slug} className="group">
            <Link href={`/movies/${m.slug}`}>
              <div className="aspect-[2/3] w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/5">
                <Image
                  src={m.posterUrl}
                  alt={`Poster phim ${m.title}`}
                  fill
                  className="h-full w-full object-cover"
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
        <p className="opacity-70 mt-8">No movies match your filters.</p>
      )}
    </div>
  );
}


