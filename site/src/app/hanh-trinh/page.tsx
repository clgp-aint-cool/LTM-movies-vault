import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { movies } from "@/data/movies";
import { careerEvents, type CareerEvent } from "@/data/career";
import { formatDate } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Hành trình sự nghiệp Lâm Thanh Mỹ – Từ phim đầu tay đến nay" },
  description:
    "Dòng thời gian sự nghiệp diễn viên Lâm Thanh Mỹ: từ Đoạt hồn (2014), Tôi thấy hoa vàng trên cỏ xanh (2015) đến Cám, Khế ước bán dâu và các phim mới nhất.",
  alternates: { canonical: "/hanh-trinh" },
};

type Entry =
  | { type: "movie"; sortKey: string; movie: (typeof movies)[number] }
  | { type: "event"; sortKey: string; event: CareerEvent };

const KIND_LABEL: Record<CareerEvent["kind"], string> = {
  award: "🏆 Giải thưởng",
  event: "🎬 Sự kiện",
  milestone: "⭐ Cột mốc",
};

function displayDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? formatDate(date) : date;
}

export default function TimelinePage() {
  const entries: Entry[] = [
    ...movies.map((m) => ({ type: "movie" as const, sortKey: m.releaseDate ?? `${m.year}-12-31`, movie: m })),
    ...careerEvents.map((e) => ({ type: "event" as const, sortKey: e.date.length === 4 ? `${e.date}-12-31` : e.date, event: e })),
  ].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const years = [...new Set(entries.map((e) => e.sortKey.slice(0, 4)))];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Phim của Lâm Thanh Mỹ theo thời gian",
    itemListElement: movies
      .slice()
      .sort((a, b) => (a.releaseDate ?? `${a.year}`).localeCompare(b.releaseDate ?? `${b.year}`))
      .map((m, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/movies/${m.slug}`), name: m.title })),
  };

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl sm:text-3xl font-semibold">Hành trình sự nghiệp của Lâm Thanh Mỹ</h1>
      <p className="opacity-80 mt-2 leading-relaxed">
        Các mốc đáng nhớ trong sự nghiệp diễn xuất của Lâm Thanh Mỹ, từ những vai &quot;ma nhí&quot; đầu tiên tới các vai
        chính trên màn ảnh rộng. Ngày khởi chiếu là ngày ra rạp tại Việt Nam.
      </p>

      <nav aria-label="Chọn năm" className="flex flex-wrap gap-2 mt-6 text-sm">
        {years.map((y) => (
          <a key={y} href={`#nam-${y}`} className="rounded-full border border-black/10 dark:border-white/15 px-3 py-1 hover:bg-black/5 dark:hover:bg-white/10">
            {y}
          </a>
        ))}
      </nav>

      <ol className="mt-8 relative border-l border-black/15 dark:border-white/15 ml-3">
        {entries.map((entry, i) => {
          const year = entry.sortKey.slice(0, 4);
          const firstOfYear = i === 0 || entries[i - 1].sortKey.slice(0, 4) !== year;
          return (
            <li key={entry.type === "movie" ? entry.movie.slug : `${entry.event.date}-${entry.event.title}`} className="mb-10 ml-6">
              {firstOfYear && (
                <h2 id={`nam-${year}`} className="text-2xl font-bold mb-3 scroll-mt-6 -ml-6 pl-6 relative">
                  <span className="absolute -left-[9px] top-2 h-4 w-4 rounded-full bg-red-500 ring-4 ring-white dark:ring-black" />
                  {year}
                </h2>
              )}
              {entry.type === "movie" ? (
                <MovieEntry movie={entry.movie} />
              ) : (
                <EventEntry event={entry.event} />
              )}
            </li>
          );
        })}
      </ol>

      <p className="text-sm opacity-60">
        Thiếu mốc nào? Trang này là kho lưu trữ của người hâm mộ — xem <Link href="/bai-viet" className="underline">bài viết</Link> hoặc{" "}
        <Link href="/about" className="underline">tiểu sử</Link> để biết thêm.
      </p>
    </div>
  );
}

function MovieEntry({ movie }: { movie: (typeof movies)[number] }) {
  return (
    <Link href={`/movies/${movie.slug}`} className="group flex gap-4 rounded-xl border border-black/10 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/5">
      <Image
        src={movie.posterUrl}
        alt={`Poster phim ${movie.title} (${movie.year})`}
        width={80}
        height={120}
        className="rounded-md object-cover shrink-0 h-[120px] w-[80px]"
      />
      <div>
        <p className="text-xs uppercase tracking-wide opacity-60">
          🎞️ {movie.releaseDate ? `Khởi chiếu ${formatDate(movie.releaseDate)}${movie.releaseTentative ? " (dự kiến)" : ""}` : `Phim ${movie.year}`}
        </p>
        <h3 className="font-semibold text-lg group-hover:underline">{movie.title}</h3>
        <p className="text-sm opacity-80">
          {movie.role ? `Vai ${movie.role}` : "Lâm Thanh Mỹ tham gia"}
          {movie.director ? ` · Đạo diễn ${movie.director}` : ""}
          {movie.genres?.length ? ` · ${movie.genres.join(", ")}` : ""}
        </p>
      </div>
    </Link>
  );
}

function EventEntry({ event }: { event: CareerEvent }) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
      <p className="text-xs uppercase tracking-wide opacity-70">
        {KIND_LABEL[event.kind]} · {displayDate(event.date)}
      </p>
      <h3 className="font-semibold text-lg">{event.title}</h3>
      {event.image && (
        <Image src={event.image} alt={event.title} width={640} height={360} className="mt-2 rounded-lg h-auto w-full" />
      )}
      {event.description && <p className="text-sm opacity-80 mt-1">{event.description}</p>}
      <div className="text-sm mt-1 flex gap-3">
        {event.movie && <Link href={`/movies/${event.movie}`} className="underline">Xem phim</Link>}
        {event.sourceUrl && (
          <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline opacity-80">Nguồn</a>
        )}
      </div>
    </div>
  );
}
