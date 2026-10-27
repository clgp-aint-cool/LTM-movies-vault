import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { actress } from "@/data/movies";
import { displayTitleEn, moviesEn } from "@/data/movies-en";
import { languageAlternates } from "@/lib/i18n";
import UpcomingMovies from "@/components/UpcomingMovies";

export const metadata: Metadata = {
  title: { absolute: "Lam Thanh My – Vietnamese actress: films, roles & photos" },
  description:
    "Lâm Thanh Mỹ (born 2005) is a Vietnamese actress nicknamed the \"little ghost\" of Vietnamese cinema. Filmography: The Sisters (Cám), Hollow, Bride of the Covenant, The Third Wife.",
  alternates: { canonical: "/en", languages: languageAlternates("/") },
  openGraph: {
    title: "Lam Thanh My – Vietnamese actress",
    description: "Filmography of Vietnamese actress Lâm Thanh Mỹ: The Sisters (Cám), Hollow, Bride of the Covenant.",
    url: "/en",
  },
};

export default function HomeEn() {
  const sorted = [...moviesEn].sort((a, b) => b.year - a.year);
  const withRelease = moviesEn
    .filter((m) => m.releaseDate)
    .map((m) => ({ slug: m.slug, title: displayTitleEn(m), posterUrl: m.posterUrl, releaseDate: m.releaseDate!, tentative: m.releaseTentative }));

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <header className="max-w-6xl mx-auto flex items-center gap-4 sm:gap-6">
        <Image src={actress.avatarUrl} alt="Portrait of actress Lâm Thanh Mỹ" width={80} height={80} className="rounded-full object-cover" priority />
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Lâm Thanh Mỹ (Lam Thanh My)</h1>
          <p className="opacity-80 text-sm sm:text-base leading-relaxed">
            Vietnamese actress born in 2005, who started acting as a child. After memorable roles in horror films such as
            Hollow (Đoạt hồn) and Bóng đè, audiences nicknamed her the &quot;little ghost&quot; of Vietnamese cinema. She played
            the title role in the folk-horror film The Sisters (Cám, 2024).
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8">
        <UpcomingMovies items={withRelease} lang="en" />

        <div className="flex items-center justify-between mb-4 mt-8">
          <h2 className="text-xl font-medium">Films starring Lâm Thanh Mỹ</h2>
          <Link href="/en/movies" className="text-sm underline opacity-80 hover:opacity-100">See all →</Link>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {sorted.map((m, i) => (
            <li key={m.slug} className="group">
              <Link href={`/en/movies/${m.slug}`}>
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/5">
                  <Image
                    src={m.posterUrl}
                    alt={`${displayTitleEn(m)} (${m.year}) poster`}
                    fill
                    sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    priority={i === 0}
                  />
                </div>
                <p className="mt-2 font-medium leading-tight">{m.titleEn ?? m.title}</p>
                <p className="text-sm opacity-60">{m.titleEn ? `${m.title} · ` : ""}{m.year}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 p-6 rounded-xl border border-black/10 dark:border-white/10 bg-black/5">
          <h2 className="text-lg font-medium mb-2">About Lâm Thanh Mỹ</h2>
          <p className="text-sm opacity-80 leading-relaxed mb-4">
            From child roles in Vietnamese horror films to leading roles in period horror and family dramas.
          </p>
          <Link href="/en/about" className="text-sm underline opacity-80 hover:opacity-100">Read the biography →</Link>
          <p className="text-xs opacity-60 mt-4">
            More content (articles, press, timeline, quiz) is available on the <Link href="/" hrefLang="vi" className="underline">Vietnamese site</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
