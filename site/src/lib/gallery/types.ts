export type GalleryCategory = "portrait" | "poster" | "event" | "other";

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  year?: number;
  category: GalleryCategory;
  id?: string;
};

export type GalleryManifest = {
  version: 1;
  updatedAt: string;
  images: GalleryImage[];
};

export type InstagramMedia = {
  mediaId: string;
  childId: string;
  url: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
};
