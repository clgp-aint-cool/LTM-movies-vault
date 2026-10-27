"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Countdown from "./Countdown";
import { releaseTimestamp } from "@/lib/release";

export type UpcomingItem = { slug: string; title: string; posterUrl: string; releaseDate: string; tentative?: boolean };

/**
 * Movies whose releaseDate is still in the future (checked on the client, so a
 * movie drops off by itself after release without needing a rebuild).
 */
export default function UpcomingMovies({ items, lang = "vi" }: { items: UpcomingItem[]; lang?: "vi" | "en" }) {
  const [upcoming, setUpcoming] = useState<UpcomingItem[]>([]);

  useEffect(() => {
    setUpcoming(
      items
        .filter((m) => releaseTimestamp(m.releaseDate) > Date.now())
        .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
    );
  }, [items]);

  if (upcoming.length === 0) return null;
  const en = lang === "en";

  return (
    <section className="mt-10 rounded-xl border border-red-500/30 bg-red-500/5 p-6">
      <h2 className="text-xl font-medium mb-4">
        {en ? "Coming soon" : "Phim sắp ra mắt của Lâm Thanh Mỹ"}
      </h2>
      <ul className="space-y-6">
        {upcoming.map((m) => {
          const [y, mo, d] = m.releaseDate.split("-");
          return (
            <li key={m.slug} className="flex gap-4 items-center">
              <Link href={`${en ? "/en" : ""}/movies/${m.slug}`} className="shrink-0">
                <Image src={m.posterUrl} alt={m.title} width={90} height={135} className="rounded-md object-cover" />
              </Link>
              <div>
                <Link href={`${en ? "/en" : ""}/movies/${m.slug}`} className="font-semibold hover:underline">
                  {m.title}
                </Link>
                <p className="text-sm opacity-70 mb-2">
                  {en ? (m.tentative ? "Expected in cinemas" : "In Vietnamese cinemas") : m.tentative ? "Khởi chiếu dự kiến" : "Khởi chiếu"} {d}/{mo}/{y}
                </p>
                <Countdown date={m.releaseDate} lang={lang} />
                {!en && (
                  <Link href="/sap-ra-mat" className="inline-block mt-2 text-sm underline opacity-80 hover:opacity-100">
                    Xem trang đếm ngược →
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
