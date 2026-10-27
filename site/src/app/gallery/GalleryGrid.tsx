"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { CATEGORIES } from "@/data/gallery";
import type { GalleryImage } from "@/lib/gallery/types";

const PAGE_SIZE = 24;

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [lightbox, setLightbox] = useState<{
    images: GalleryImage[];
    index: number;
  } | null>(null);

  const filtered =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const openLightbox = useCallback(
    (images: GalleryImage[], index: number) => {
      setLightbox({ images, index });
      document.body.style.overflow = "hidden";
    },
    []
  );

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    document.body.style.overflow = "";
  }, []);

  const prev = useCallback(() => {
    setLightbox((lb) =>
      lb
        ? {
            ...lb,
            index: (lb.index - 1 + lb.images.length) % lb.images.length,
          }
        : null
    );
  }, []);

  const next = useCallback(() => {
    setLightbox((lb) =>
      lb
        ? {
            ...lb,
            index: (lb.index + 1) % lb.images.length,
          }
        : null
    );
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox, prev, next]);

  return (
    <>
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setActiveCategory(cat.key);
              setVisibleCount(PAGE_SIZE);
            }}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              activeCategory === cat.key
                ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
        <span className="ml-auto text-xs opacity-50 self-center">
          {filtered.length} ảnh
        </span>
      </div>

      {/* Masonry-style grid */}
      {filtered.length === 0 ? (
        <p className="opacity-60 text-sm py-12 text-center">
          Chưa có ảnh trong danh mục này.
        </p>
      ) : (
        <div
          className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 space-y-3"
          role="list"
        >
          {visible.map((img, i) => (
            <button
              key={img.id || img.src}
              onClick={() => openLightbox(filtered, i)}
              className="group break-inside-avoid block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30 rounded-lg overflow-hidden"
              aria-label={`Xem ảnh: ${img.alt}`}
              role="listitem"
            >
              <div className="relative overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/5">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={0}
                  height={0}
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                  style={{ width: "100%", height: "auto" }}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-2">
                  <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    {img.caption}
                  </span>
                </div>
              </div>
              <p className="text-xs mt-1.5 font-medium leading-tight">{img.caption}</p>
              {img.year && (
                <p className="text-xs opacity-50">{img.year}</p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-10 flex flex-col items-center gap-2">
          <button
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="px-6 py-2.5 rounded-full border border-black/20 dark:border-white/20 text-sm font-medium
              hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
              transition-colors"
          >
            Tải thêm ảnh ({filtered.length - visibleCount} còn lại)
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Thư viện ảnh"
          onClick={closeLightbox}
        >
          {/* Dark backdrop */}
          <div className="absolute inset-0 bg-black/90" />

          {/* Content */}
          <div
            className="relative z-10 max-w-5xl w-full mx-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header row */}
            <div className="flex items-center justify-between w-full mb-3 px-1">
              <p className="text-white/50 text-xs">
                {lightbox.index + 1} / {lightbox.images.length}
              </p>
              <button
                onClick={closeLightbox}
                className="text-white/70 hover:text-white text-sm focus:outline-none"
                aria-label="Đóng thư viện ảnh"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Image */}
            <div className="relative w-full h-[70vh]">
              <Image
                key={lightbox.images[lightbox.index].src}
                src={lightbox.images[lightbox.index].src}
                alt={lightbox.images[lightbox.index].alt}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Caption */}
            <div className="mt-3 text-center">
              <p className="text-white font-medium">
                {lightbox.images[lightbox.index].caption}
              </p>
              {lightbox.images[lightbox.index].year && (
                <p className="text-white/50 text-sm">
                  {lightbox.images[lightbox.index].year}
                </p>
              )}
            </div>

            {/* Navigation arrows */}
            {lightbox.images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl px-4 py-2 focus:outline-none"
                  aria-label="Ảnh trước"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl px-4 py-2 focus:outline-none"
                  aria-label="Ảnh tiếp theo"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
