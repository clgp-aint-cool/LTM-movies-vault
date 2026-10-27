import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMovieBySlug, type Movie } from "@/data/movies";
import { formatDate, getPostBySlug, getPosts } from "@/lib/posts";
import { SITE_BRAND, SITE_URL, absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: { absolute: `${post.title} – Lâm Thanh Mỹ` },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/bai-viet/${post.slug}` },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `/bai-viet/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const movies = post.movies.map(getMovieBySlug).filter((m): m is Movie => Boolean(m));
  const others = getPosts().filter((p) => p.slug !== post.slug).slice(0, 4);
  const url = absoluteUrl(`/bai-viet/${post.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: "vi",
        image: `${url}/opengraph-image`,
        keywords: post.keywords.join(", ") || undefined,
        author: { "@type": "Organization", name: SITE_BRAND, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_BRAND, url: SITE_URL },
        about: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Lâm Thanh Mỹ" },
        mentions: movies.map((m) => ({ "@type": "Movie", name: m.title, url: absoluteUrl(`/movies/${m.slug}`) })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Bài viết", item: absoluteUrl("/bai-viet") },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <article className="p-6 sm:p-8 max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm opacity-70 mb-4">
        <Link href="/" className="hover:underline">Trang chủ</Link>
        {" / "}
        <Link href="/bai-viet" className="hover:underline">Bài viết</Link>
      </nav>

      <h1 className="text-2xl sm:text-4xl font-semibold leading-tight">{post.title}</h1>
      <p className="text-sm opacity-60 mt-3">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.updated && post.updated !== post.date && (
          <> · Cập nhật <time dateTime={post.updated}>{formatDate(post.updated)}</time></>
        )}
        {" · "}{post.readingMinutes} phút đọc
        {post.draft && <span className="ml-2 text-red-500">[NHÁP – không hiển thị trên web thật]</span>}
      </p>

      <div className="post-content mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />

      {movies.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Phim được nhắc đến</h2>
          <ul className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {movies.map((m) => (
              <li key={m.slug}>
                <Link href={`/movies/${m.slug}`} className="group block">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/5">
                    <Image
                      src={m.posterUrl}
                      alt={`Poster phim ${m.title} (${m.year})`}
                      fill
                      sizes="(min-width: 640px) 25vw, 33vw"
                      className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium leading-tight">{m.title}</p>
                  <p className="text-xs opacity-60">{m.year}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Bài viết khác</h2>
          <ul className="space-y-2">
            {others.map((p) => (
              <li key={p.slug}>
                <Link href={`/bai-viet/${p.slug}`} className="underline opacity-90 hover:opacity-100">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
