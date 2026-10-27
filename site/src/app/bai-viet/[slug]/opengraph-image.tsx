import { ImageResponse } from "next/og";
import { getPostBySlug, getPosts } from "@/lib/posts";
import { OG_SIZE, ogFonts, siteCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Bài viết về diễn viên Lâm Thanh Mỹ";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return new Response("Not found", { status: 404 });
  return new ImageResponse(
    await siteCard({ kicker: "BÀI VIẾT", title: post.title, subtitle: post.description }),
    { ...OG_SIZE, fonts: await ogFonts() }
  );
}
