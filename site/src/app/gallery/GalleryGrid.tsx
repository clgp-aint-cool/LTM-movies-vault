"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import { CATEGORIES } from "@/data/gallery";
import type { GalleryImage } from "@/lib/gallery/types";

type ApiResponse = {
  images: GalleryImage[];
  hasMore: boolean;
  nextMarker: string | null;
};

async function fetchPage(marker?: string): Promise<ApiResponse> {
  const url = marker
    ? `/api/gallery/images?marker=${encodeURIComponent(marker)}`
    : "/api/gallery/images";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gallery API error: ${res.status}`);
  return res.json();
}

export default function GalleryGrid({ images: initialImages }: { images: GalleryImage[] }) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [hasMore, setHasMore] = useState(true);
  const [nextMarker, setNextMarker] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [s3Loaded, setS3Loaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [lightbox, setLightbox] = useState<{
    images: GalleryImage[];
    index: number;
  } | null>(null);

  // On mount, load first page from S3 API (replaces bundled images)
  useEffect(() => {
    fetchPage()
      .then((data) => {
        if (data.images.length > 0) {
          setImages(data.images);
          setS3Loaded(true);
        }
        setHasMore(data.hasMore);
        setNextMarker(data.nextMarker);
      })
      .catch((err) => {
        console.warn("S3 gallery fetch failed, using bundled images:", err.message);
        setHasMore(false);
      });
  }, []);

  const loadMore = useCallback(() => {
    if (!nextMarker || isPending) return;
    setLoadError(null);
    startTransition(async () => {
      try {
        const data = await fetchPage(nextMarker);
        setImages((prev) => {
          // Deduplicate by id/src
          const existing = new Set(prev.map((i) => i.id ?? i.src));
          const fresh = data.images.filter((i) => !existing.has(i.id ?? i.src));
          return [...prev, ...fresh];
        });
        setHasMore(data.hasMore);
        setNextMarker(data.nextMarker);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Lỗi tải ảnh");
      }
    });
  }, [nextMarker, isPending]);

  const filtered =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);

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
            onClick={() => setActiveCategory(cat.key)}
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
          {filtered.length} ảnh{s3Loaded ? " (S3)" : ""}
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
          {filtered.map((img, i) => (
            <button
              key={img.id || img.src}
              onClick={() => openLightbox(filtered, i)}
              className="group break-inside-avoid block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30 rounded-lg overflow-hidden"
              aria-label={`Xem ảnh: ${img.alt}`}
              role="listitem"
            >
              <div className="relative overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
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
          {loadError && (
            <p className="text-red-500 text-sm">{loadError}</p>
          )}
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-6 py-2.5 rounded-full border border-black/20 dark:border-white/20 text-sm font-medium
              hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
              transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {isPending ? "Đang tải…" : "Tải thêm ảnh"}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.images[lightbox.index].src}
              alt={lightbox.images[lightbox.index].alt}
              className="max-h-[70vh] max-w-full w-auto object-contain rounded-lg"
            />

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
