import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { movies } from "@/data/movies";
import { displayTitleEn, moviesEn } from "@/data/movies-en";
import { languageAlternates } from "@/lib/i18n";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import Countdown from "@/components/Countdown";
import { releaseTimestamp } from "@/lib/release";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return movies.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;
export const revalidate = 86400;

function getMovie(slug: string) {
  return moviesEn.find((m) => m.slug === slug);
}

function formatDateEn(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const movie = getMovie(slug);
  if (!movie) return {};
  const title = `${displayTitleEn(movie)} (${movie.year}) – Lam Thanh My movie`;
  const text = `${displayTitleEn(movie)} (${movie.year})${movie.director ? `, directed by ${movie.director}` : ""}, starring Lâm Thanh Mỹ. ${movie.descriptionEn}`;
  const description = text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/en/movies/${slug}`, languages: languageAlternates(`/movies/${slug}`) },
    openGraph: { title, description, type: "video.movie", url: `/en/movies/${slug}` },
  };
}

export default async function MovieEn({ params }: Props) {
  const { slug } = await params;
  const movie = getMovie(slug);
  if (!movie) return notFound();
  const name = displayTitleEn(movie);
  const isUpcoming = movie.releaseDate ? releaseTimestamp(movie.releaseDate) > Date.now() : false;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    alternateName: movie.titleEn,
    url: absoluteUrl(`/en/movies/${movie.slug}`),
    datePublished: (!movie.releaseTentative && movie.releaseDate) || String(movie.year),
    description: movie.descriptionEn,
    image: absoluteUrl(movie.posterUrl),
    inLanguage: "vi",
    countryOfOrigin: { "@type": "Country", name: "Vietnam" },
    duration: movie.durationMinutes ? `PT${movie.durationMinutes}M` : undefined,
    genre: movie.genresEn,
    director: movie.director ? { "@type": "Person", name: movie.director } : undefined,
    actor: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Lâm Thanh Mỹ" },
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm opacity-70 mb-4">
        <Link href="/en" className="hover:underline">Home</Link>{" / "}
        <Link href="/en/movies" className="hover:underline">Films</Link>{" / "}
        <span>{movie.titleEn ?? movie.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8">
        <div className="w-full md:w-auto md:max-w-sm">
          <Image
            src={movie.posterUrl}
            alt={`${name} (${movie.year}) poster, starring Lâm Thanh Mỹ`}
            width={400}
            height={600}
            priority
            className="rounded-lg border border-black/10 dark:border-white/10"
            style={{ maxHeight: "600px", width: "auto", margin: "0 auto" }}
          />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">{name} ({movie.year})</h1>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {movie.titleEn && (<><dt className="opacity-60">Vietnamese title</dt><dd>{movie.title}</dd></>)}
            <dt className="opacity-60">Year</dt><dd>{movie.year}</dd>
            {movie.releaseDate && (<><dt className="opacity-60">Released (Vietnam)</dt><dd>{formatDateEn(movie.releaseDate)}{movie.releaseTentative ? " (expected)" : ""}</dd></>)}
            {movie.genresEn?.length ? (<><dt className="opacity-60">Genre</dt><dd>{movie.genresEn.join(", ")}</dd></>) : null}
            {movie.director && (<><dt className="opacity-60">Director</dt><dd>{movie.director}</dd></>)}
            {movie.durationMinutes && (<><dt className="opacity-60">Runtime</dt><dd>{movie.durationMinutes} min</dd></>)}
            <dt className="opacity-60">Cast</dt>
            <dd><Link href="/en/about" className="underline">Lâm Thanh Mỹ</Link>{movie.role ? ` (as ${movie.role})` : ""}</dd>
          </dl>

          <h2 className="text-xl font-semibold mt-6 mb-2">Synopsis</h2>
          <p className="opacity-90 leading-relaxed">{movie.descriptionEn}</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Where to watch {movie.titleEn ?? movie.title}</h2>
          {isUpcoming && movie.releaseDate ? (
            <>
              <p className="opacity-90 mb-3">{movie.releaseTentative ? "Expected in Vietnamese cinemas from" : "In Vietnamese cinemas from"} {formatDateEn(movie.releaseDate)}.</p>
              <Countdown date={movie.releaseDate} lang="en" />
            </>
          ) : movie.watch?.length ? (
            <>
              <p className="opacity-90 mb-3">Stream it legally (availability may depend on your region):</p>
              <ul className="flex flex-wrap gap-2">
                {movie.watch.map((w) => (
                  <li key={w.url}>
                    <a href={w.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-block rounded-full border border-black/15 dark:border-white/20 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10">
                      {w.platform} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="opacity-90">No confirmed legal streaming source yet. Please avoid pirate sites and support Vietnamese cinema.</p>
          )}

          {movie.trailerYoutubeId && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Official trailer</h2>
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${movie.trailerYoutubeId}?rel=0`}
                  title={`${name} (${movie.year}) trailer`}
                  className="absolute inset-0 w-full h-full rounded-lg border border-black/10 dark:border-white/10"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <Link href="/en/movies" className="inline-block mt-10 text-sm underline opacity-80 hover:opacity-100">← All films</Link>
    </div>
  );
}
