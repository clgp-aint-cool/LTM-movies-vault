import type { Metadata } from "next";
import Link from "next/link";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "Who is Lam Thanh My? Biography of the Vietnamese actress" },
  description:
    "Biography of Lâm Thanh Mỹ, the Vietnamese actress born in 2005 and nicknamed the \"little ghost\" of Vietnamese cinema for her roles in horror films Hollow, Bóng đè and The Sisters (Cám).",
  alternates: { canonical: "/en/about", languages: languageAlternates("/about") },
};

export default function AboutEn() {
  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6 leading-relaxed">
      <h1 className="text-3xl font-bold">Lâm Thanh Mỹ – the &quot;little ghost&quot; of Vietnamese cinema</h1>
      <p className="text-sm opacity-60 italic">Unofficial fan archive</p>
      <p>
        <strong>Lâm Thanh Mỹ</strong> (often written <em>Lam Thanh My</em>) is a Vietnamese actress born in 2005. She began
        acting as a young child and, without formal acting training, became known for her natural, convincing performances.
      </p>
      <h2 className="text-xl font-semibold">Career</h2>
      <p>
        She first won audiences over in <Link className="underline" href="/en/movies/toi-thay-hoa-vang-tren-co-xanh">Yellow Flowers on the Green Grass</Link>{" "}
        (2015), directed by Victor Vũ, where she played Mận. Her roles in horror films such as{" "}
        <Link className="underline" href="/en/movies/doat-hon">Hollow</Link> (2014) and{" "}
        <Link className="underline" href="/en/movies/bong-de">Bóng đè</Link> (2022) earned her the nicknames &quot;little ghost of
        Vietnamese cinema&quot; and &quot;the scariest child ghost on screen&quot;.
      </p>
      <p>
        In 2024 she took on her first leading role in a feature film as Cám in{" "}
        <Link className="underline" href="/en/movies/cam">The Sisters (Cám)</Link>, a horror retelling of the folk tale Tấm Cám, followed
        by the role of Nhài in the period horror <Link className="underline" href="/en/movies/khe-uoc-ban-dau">Bride of the Covenant</Link> (2025).
        She has also appeared in comedies and family dramas such as Nghề siêu dễ and Cục vàng của ngoại.
      </p>
      <h2 className="text-xl font-semibold">About this site</h2>
      <p>
        This is a personal fan archive and is not affiliated with the actress, her management or any production company. See the{" "}
        <Link className="underline" href="/en/movies">full filmography</Link>, or visit the <Link className="underline" href="/" hrefLang="vi">Vietnamese site</Link>{" "}
        for articles, press coverage and the career timeline.
      </p>
    </div>
  );
}
