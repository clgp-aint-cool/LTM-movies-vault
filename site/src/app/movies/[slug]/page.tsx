import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMovieBySlug, getRelatedMovies, movies, type Movie } from "@/data/movies";
import { SITE_URL, absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return movies.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;

function pageTitle(movie: Movie) {
  return `${movie.title} (${movie.year}) – Phim Lâm Thanh Mỹ`;
}

function metaDescription(movie: Movie) {
  const intro = `Phim ${movie.title} (${movie.year})${movie.role ? `, Lâm Thanh Mỹ vai ${movie.role}` : " có Lâm Thanh Mỹ"}${movie.director ? `, đạo diễn ${movie.director}` : ""}. `;
  const text = intro + movie.description;
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);
  if (!movie) return {};
  const title = pageTitle(movie);
  const description = metaDescription(movie);
  return {
    title: { absolute: title },
    description,
    keywords: [movie.title, `phim ${movie.title}`, `Lâm Thanh Mỹ ${movie.title}`, "phim Lâm Thanh Mỹ"],
    alternates: {
      canonical: `/movies/${movie.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "video.movie",
      url: `/movies/${movie.slug}`,
      images: [{ url: movie.posterUrl, width: 400, height: 600, alt: `Poster phim ${movie.title}` }],
    },
  };
}

export default async function MovieDetail({ params }: Props) {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);
  if (!movie) return notFound();
  const related = getRelatedMovies(movie);

  // Normalize common YouTube/Vimeo links to embeddable URLs
  const toEmbedUrl = (url: string): { url: string; isEmbed: boolean } => {
    try {
      const u = new URL(url);
      // YouTube watch → embed
      if (u.hostname.includes("youtube.com")) {
        const vid = u.searchParams.get("v");
        if (vid) {
          return { url: `https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`, isEmbed: true };
        }
        // Already /embed/
        if (u.pathname.startsWith("/embed/")) return { url, isEmbed: true };
      }
      // youtu.be → embed
      if (u.hostname === "youtu.be") {
        const vid = u.pathname.replace("/", "");
        if (vid) {
          return { url: `https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`, isEmbed: true };
        }
      }
      // Vimeo normal → player
      if (u.hostname.includes("vimeo.com") && !u.hostname.startsWith("player.")) {
        const vid = u.pathname.split("/").filter(Boolean).pop();
        if (vid) {
          return { url: `https://player.vimeo.com/video/${vid}`, isEmbed: true };
        }
      }
      // Vimeo player
      if (u.hostname.startsWith("player.") && u.hostname.includes("vimeo.com")) {
        return { url, isEmbed: true };
      }

      // Google Drive → preview embed
      if (u.hostname.includes("drive.google.com") || u.hostname.includes("docs.google.com")) {
        // Patterns:
        // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
        // https://drive.google.com/uc?export=download&id=FILE_ID
        // https://drive.google.com/open?id=FILE_ID
        let fileId = "";
        const parts = u.pathname.split("/").filter(Boolean);
        const fileIndex = parts.findIndex((p) => p === "file");
        if (fileIndex !== -1 && parts[fileIndex + 1] === "d" && parts[fileIndex + 2]) {
          fileId = parts[fileIndex + 2];
        }
        if (!fileId) {
          fileId = u.searchParams.get("id") || "";
        }
        if (fileId) {
          return { url: `https://drive.google.com/file/d/${fileId}/preview`, isEmbed: true };
        }
      }
    } catch {
      // fall through
    }
    return { url, isEmbed: false };
  };
  const video = movie.videoUrl ? toEmbedUrl(movie.videoUrl) : null;
  const genreText = movie.genres?.map((g) => g.toLowerCase()).join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Movie",
        "@id": `${absoluteUrl(`/movies/${movie.slug}`)}#movie`,
        name: movie.title,
        url: absoluteUrl(`/movies/${movie.slug}`),
        datePublished: String(movie.year),
        description: movie.description,
        image: absoluteUrl(movie.posterUrl),
        inLanguage: "vi",
        countryOfOrigin: { "@type": "Country", name: "Việt Nam" },
        duration: movie.durationMinutes ? `PT${movie.durationMinutes}M` : undefined,
        genre: movie.genres,
        director: movie.director ? { "@type": "Person", name: movie.director } : undefined,
        actor: movie.role
          ? {
              "@type": "PerformanceRole",
              characterName: movie.role,
              actor: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Lâm Thanh Mỹ" },
            }
          : { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Lâm Thanh Mỹ" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Phim", item: absoluteUrl("/movies") },
          { "@type": "ListItem", position: 3, name: movie.title, item: absoluteUrl(`/movies/${movie.slug}`) },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <nav aria-label="Breadcrumb" className="text-sm opacity-70 mb-4">
        <Link href="/" className="hover:underline">Trang chủ</Link>
        {" / "}
        <Link href="/movies" className="hover:underline">Phim</Link>
        {" / "}
        <span>{movie.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8">
        <div className="w-full md:w-auto md:max-w-sm">
          <div className="rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-black/5">
            <Image
              src={movie.posterUrl}
              alt={`Poster phim ${movie.title} (${movie.year}) có diễn viên Lâm Thanh Mỹ`}
              width={400}
              height={600}
              className="w-full h-auto object-contain"
              priority
              style={{ maxHeight: "600px", width: "auto", display: "block", margin: "0 auto" }}
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {movie.title} ({movie.year})
          </h1>

          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="opacity-60">Năm phát hành</dt>
            <dd>{movie.year}</dd>
            {movie.genres && movie.genres.length > 0 && (
              <>
                <dt className="opacity-60">Thể loại</dt>
                <dd>{movie.genres.join(", ")}</dd>
              </>
            )}
            {movie.director && (
              <>
                <dt className="opacity-60">Đạo diễn</dt>
                <dd>{movie.director}</dd>
              </>
            )}
            {movie.durationMinutes && (
              <>
                <dt className="opacity-60">Thời lượng</dt>
                <dd>{movie.durationMinutes} phút</dd>
              </>
            )}
            <dt className="opacity-60">Diễn viên</dt>
            <dd>
              <Link href="/about" className="underline">Lâm Thanh Mỹ</Link>
              {movie.role ? ` (vai ${movie.role})` : ""}
            </dd>
          </dl>

          <h2 className="text-xl font-semibold mt-6 mb-2">Nội dung phim {movie.title}</h2>
          <p className="opacity-90 leading-relaxed">{movie.description}</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Lâm Thanh Mỹ trong phim {movie.title}</h2>
          <p className="opacity-90 leading-relaxed">
            {movie.title} là phim{genreText ? ` ${genreText}` : ""} ra mắt năm {movie.year}
            {movie.director ? ` do ${movie.director} đạo diễn` : ""}, có sự tham gia của diễn viên
            Lâm Thanh Mỹ{movie.role ? ` trong vai ${movie.role}` : ""}.
          </p>
          {movie.review && <p className="opacity-90 leading-relaxed mt-3">{movie.review}</p>}

          {video && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Xem phim {movie.title}</h2>
              {video.isEmbed ? (
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    src={video.url}
                    title={`Phim ${movie.title} (${movie.year})`}
                    className="absolute inset-0 w-full h-full rounded-lg border border-black/10 dark:border-white/10"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  src={video.url}
                  controls
                  preload="metadata"
                  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Phim khác của Lâm Thanh Mỹ</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {related.map((m) => (
            <li key={m.slug} className="group">
              <Link href={`/movies/${m.slug}`}>
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/5">
                  <Image
                    src={m.posterUrl}
                    alt={`Poster phim ${m.title} (${m.year})`}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-2 font-medium leading-tight">{m.title}</p>
                <p className="text-sm opacity-60">{m.year}</p>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/movies" className="inline-block mt-4 text-sm underline opacity-80 hover:opacity-100">
          Xem tất cả phim Lâm Thanh Mỹ →
        </Link>
      </section>
    </div>
    </>
  );
}
