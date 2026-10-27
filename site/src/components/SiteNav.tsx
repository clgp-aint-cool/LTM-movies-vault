"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { counterpartPath, isEnglishPath } from "@/lib/i18n";

const VI_LINKS = [
  ["/movies", "Phim"],
  ["/sap-ra-mat", "Sắp chiếu"],
  ["/hanh-trinh", "Hành trình"],
  ["/gallery", "Hình ảnh"],
  ["/bai-viet", "Bài viết"],
  ["/about", "Tiểu sử"],
] as const;

const EN_LINKS = [
  ["/en/movies", "Films"],
  ["/en/about", "Biography"],
] as const;

export default function SiteNav() {
  const pathname = usePathname();
  const en = isEnglishPath(pathname);
  const links = en ? EN_LINKS : VI_LINKS;
  const other = counterpartPath(pathname) ?? (en ? "/" : "/en");

  return (
    <nav className="flex items-center justify-between gap-4 p-6 sm:p-8 border-b border-black/10 dark:border-white/10">
      <Link href={en ? "/en" : "/"} className="font-semibold shrink-0">Lâm Thanh Mỹ</Link>
      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm">
        {links.map(([href, label]) => (
          <Link key={href} className="opacity-90 hover:opacity-100" href={href}>{label}</Link>
        ))}
        <Link
          href={other}
          hrefLang={en ? "vi" : "en"}
          className="rounded border border-black/15 dark:border-white/20 px-2 py-0.5 text-xs font-medium"
          aria-label={en ? "Xem bằng tiếng Việt" : "View in English"}
        >
          {en ? "VI" : "EN"}
        </Link>
      </div>
    </nav>
  );
}

export function SiteFooterNote() {
  const en = isEnglishPath(usePathname());
  return <>{en ? "Unofficial fan archive" : "Trang lưu trữ của người hâm mộ, không chính thức"}</>;
}
