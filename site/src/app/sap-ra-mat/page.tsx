import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import ShareButtons from "./ShareButtons";
import { formatDate } from "@/lib/posts";
import { getUpcomingMovies } from "@/lib/upcoming";
import { absoluteUrl } from "@/lib/site";

// Re-check hourly so a movie leaves this page once it is released
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const next = getUpcomingMovies()[0];
  const title = next
    ? `Đếm ngược phim ${next.title} – Phim sắp ra mắt của Lâm Thanh Mỹ`
    : "Phim sắp ra mắt của Lâm Thanh Mỹ – Đếm ngược ngày khởi chiếu";
  return {
    title: { absolute: title },
    description: next
      ? `Còn bao nhiêu ngày nữa phim ${next.title} có Lâm Thanh Mỹ ra rạp? Đồng hồ đếm ngược tới ngày khởi chiếu ${formatDate(next.releaseDate!)}${next.releaseTentative ? " (dự kiến)" : ""}, nội dung phim và lịch chiếu.`
      : "Đồng hồ đếm ngược tới ngày khởi chiếu các phim sắp ra mắt có diễn viên Lâm Thanh Mỹ.",
    alternates: { canonical: "/sap-ra-mat" },
    openGraph: { title, url: "/sap-ra-mat" },
  };
}

/** Google Calendar "add event" link for the (all-day) release date */
function calendarUrl(title: string, date: string, details: string) {
  const start = date.replaceAll("-", "");
  const end = new Date(`${date}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Phim ${title} khởi chiếu`,
    dates: `${start}/${end.toISOString().slice(0, 10).replaceAll("-", "")}`,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export default function UpcomingPage() {
  const upcoming = getUpcomingMovies();
  const [hero, ...rest] = upcoming;

  if (!hero) {
    return (
      <div className="p-6 sm:p-8 max-w-3xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold">Phim sắp ra mắt của Lâm Thanh Mỹ</h1>
        <p className="opacity-80 mt-4">
          Hiện chưa có phim mới nào được công bố ngày khởi chiếu. Trong lúc chờ, hãy xem lại{" "}
          <Link href="/movies" className="underline">các phim Lâm Thanh Mỹ đã đóng</Link>.
        </p>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: hero.title,
    url: absoluteUrl(`/movies/${hero.slug}`),
    image: absoluteUrl(hero.posterUrl),
    description: hero.description,
    genre: hero.genres,
    director: hero.director ? { "@type": "Person", name: hero.director } : undefined,
    actor: { "@type": "Person", name: "Lâm Thanh Mỹ" },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden">
        <Image src={hero.posterUrl} alt="" fill priority className="object-cover blur-2xl scale-110 opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
        <div className="relative px-6 py-12 sm:py-16 max-w-5xl mx-auto text-white grid gap-8 md:grid-cols-[auto_1fr] items-center">
          <Image
            src={hero.posterUrl}
            alt={`Poster phim ${hero.title} có Lâm Thanh Mỹ`}
            width={280}
            height={396}
            priority
            className="rounded-xl shadow-2xl mx-auto w-48 sm:w-64 md:w-72 h-auto ring-1 ring-white/20"
          />
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-red-400 font-semibold">Phim sắp ra mắt</p>
            <h1 className="text-3xl sm:text-5xl font-bold mt-2">{hero.title}</h1>
            <p className="mt-2 text-white/70">
              {[hero.genres?.join(", "), hero.director && `Đạo diễn ${hero.director}`, "có Lâm Thanh Mỹ"].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-6 text-white/80">
              {hero.releaseTentative ? "Dự kiến khởi chiếu" : "Khởi chiếu"}{" "}
              <strong className="text-white">{formatDate(hero.releaseDate!)}</strong> — còn:
            </p>
            <div className="mt-3">
              <Countdown date={hero.releaseDate!} size="lg" />
            </div>
            {hero.releaseTentative && (
              <p className="mt-3 text-xs text-white/60">
                * Ngày dự kiến theo thông tin rạp chiếu, nhà sản xuất chưa công bố chính thức — có thể thay đổi.
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={calendarUrl(hero.title, hero.releaseDate!, `Phim ${hero.title} có Lâm Thanh Mỹ. ${absoluteUrl(`/movies/${hero.slug}`)}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-red-600 px-5 py-2 font-medium hover:bg-red-700"
              >
                📅 Thêm vào lịch
              </a>
              {hero.ticketUrl && (
                <a href={hero.ticketUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 px-5 py-2 font-medium hover:bg-white/10">
                  Lịch chiếu ↗
                </a>
              )}
              <ShareButtons text={`Còn bao lâu nữa phim ${hero.title} có Lâm Thanh Mỹ ra rạp? Xem đồng hồ đếm ngược:`} />
            </div>
          </div>
        </div>
      </section>

      <div className="p-6 sm:p-8 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Nội dung phim {hero.title}</h2>
        <p className="opacity-90 leading-relaxed">{hero.description}</p>

        {hero.trailerYoutubeId ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Trailer phim {hero.title}</h2>
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${hero.trailerYoutubeId}?rel=0`}
                title={`Trailer phim ${hero.title}`}
                className="absolute inset-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm opacity-70">Trailer chính thức sẽ được cập nhật ngay khi ra mắt.</p>
        )}

        <Link href={`/movies/${hero.slug}`} className="inline-block mt-6 underline opacity-80 hover:opacity-100">
          Xem trang phim {hero.title} →
        </Link>

        {rest.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Phim sắp ra mắt khác</h2>
            <ul className="space-y-6">
              {rest.map((m) => (
                <li key={m.slug} className="flex gap-4 items-center">
                  <Link href={`/movies/${m.slug}`} className="shrink-0">
                    <Image src={m.posterUrl} alt={`Poster phim ${m.title}`} width={90} height={135} className="rounded-md object-cover" />
                  </Link>
                  <div>
                    <Link href={`/movies/${m.slug}`} className="font-semibold hover:underline">{m.title}</Link>
                    <p className="text-sm opacity-70 mb-2">
                      {m.releaseTentative ? "Dự kiến khởi chiếu" : "Khởi chiếu"} {formatDate(m.releaseDate!)}
                    </p>
                    <Countdown date={m.releaseDate!} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
