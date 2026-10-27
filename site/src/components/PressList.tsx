import { press } from "@/data/press";
import { formatDate } from "@/lib/posts";

/** "Báo chí nói gì" — links to real press coverage; hidden when the list is empty */
export default function PressList({ limit, className = "" }: { limit?: number; className?: string }) {
  const items = [...press].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
  if (items.length === 0) return null;
  return (
    <ul className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      {items.map((p) => (
        <li key={p.url} className="rounded-xl border border-black/10 dark:border-white/15 p-4">
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="block group">
            <p className="text-xs uppercase tracking-wide opacity-60">
              {p.outlet} · {formatDate(p.date)}
            </p>
            {p.quote && <blockquote className="mt-2 text-lg italic leading-snug">“{p.quote}”</blockquote>}
            <p className={`mt-2 ${p.quote ? "text-sm opacity-80" : "font-medium"} group-hover:underline`}>{p.title} ↗</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
