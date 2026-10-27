import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { displayTitleEn, moviesEn } from "@/data/movies-en";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "Lam Thanh My movies – Full filmography" },
  description:
    "Every film starring Vietnamese actress Lâm Thanh Mỹ, from Hollow (2014) and Yellow Flowers on the Green Grass (2015) to The Sisters (Cám) and Bride of the Covenant.",
  alternates: { canonical: "/en/movies", languages: languageAlternates("/movies") },
};

export default function MoviesEn() {
  const sorted = [...moviesEn].sort((a, b) => b.year - a.year);
  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6">Lâm Thanh Mỹ filmography</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sorted.map((m) => (
          <li key={m.slug}>
            <Link href={`/en/movies/${m.slug}`} className="flex gap-4 rounded-xl border border-black/10 dark:border-white/10 p-3 hover:bg-black/5 dark:hover:bg-white/5">
              <Image src={m.posterUrl} alt={`${displayTitleEn(m)} poster`} width={80} height={120} className="rounded-md object-cover h-[120px] w-[80px] shrink-0" />
              <div>
                <h2 className="font-semibold">{displayTitleEn(m)}</h2>
                <p className="text-sm opacity-60">
                  {m.year}{m.genresEn?.length ? ` · ${m.genresEn.join(", ")}` : ""}{m.director ? ` · dir. ${m.director}` : ""}
                </p>
                <p className="text-sm opacity-80 mt-1 line-clamp-2">{m.descriptionEn}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
