import Link from "next/link";
import Image from "next/image";
import { actress, movies } from "@/data/movies";

export default function Home() {
  return (
    <div className="min-h-screen p-6 sm:p-10">
      <header className="max-w-6xl mx-auto flex items-center gap-4 sm:gap-6">
        <Image
          src={actress.avatarUrl}
          alt={actress.name}
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">{actress.name}</h1>
          <p className="opacity-80 text-sm sm:text-base">{actress.bio}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Featured Films</h2>
          <Link href="/movies" className="underline opacity-90 hover:opacity-100">
            View all
          </Link>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {movies.slice(0, 4).map((m) => (
            <li key={m.slug} className="group">
              <Link href={`/movies/${m.slug}`}>
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/5">
                  <Image
                    src={m.posterUrl}
                    alt={`Poster phim ${m.title}`}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    priority
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
      </main>
    </div>
  );
}
