"use client";

import { useEffect, useState } from "react";
import { releaseTimestamp } from "@/lib/release";

type Labels = { days: string; hours: string; minutes: string; seconds: string; released: string };

const VI: Labels = { days: "ngày", hours: "giờ", minutes: "phút", seconds: "giây", released: "Phim đã khởi chiếu!" };
const EN: Labels = { days: "days", hours: "hours", minutes: "min", seconds: "sec", released: "Now showing!" };

/** Counts down to 00:00 Vietnam time on `date` (YYYY-MM-DD) */
export default function Countdown({ date, lang = "vi" }: { date: string; lang?: "vi" | "en" }) {
  const labels = lang === "en" ? EN : VI;
  const target = releaseTimestamp(date);
  // Rendered only after mount so the server HTML never disagrees with the client clock
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return <div className="h-16" aria-hidden />;

  const diff = target - now;
  if (diff <= 0) return <p className="font-medium text-red-500">{labels.released}</p>;

  const parts = [
    [Math.floor(diff / 86_400_000), labels.days],
    [Math.floor(diff / 3_600_000) % 24, labels.hours],
    [Math.floor(diff / 60_000) % 60, labels.minutes],
    [Math.floor(diff / 1000) % 60, labels.seconds],
  ] as const;

  return (
    <div className="flex gap-2" role="timer" aria-live="off">
      {parts.map(([value, label]) => (
        <div key={label} className="min-w-16 rounded-lg bg-black/80 text-white px-3 py-2 text-center">
          <div className="text-2xl font-semibold tabular-nums">{String(value).padStart(2, "0")}</div>
          <div className="text-xs opacity-70">{label}</div>
        </div>
      ))}
    </div>
  );
}
