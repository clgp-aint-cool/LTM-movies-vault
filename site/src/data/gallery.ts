export type GalleryImage = {
  src: string; // path relative to /public
  alt: string;
  caption: string;
  year?: number;
  category: "portrait" | "poster" | "event" | "other";
};

// Images in /public/gallery_images/ — Instagram & public appearance photos
export const galleryImages: GalleryImage[] = [
  {
    src: "/gallery_images/lamthanhmy_1767446703_3801940967000539232_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1767699022_3804057572199285153_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1768567412_3811342156691559563_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1769600848_3820006910075251281_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1771505946_3835990789210649010_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh vuông từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1771505946_3835990790603197540_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1772022073_3840316392978166756_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1774955347_3864928003541891946_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1774955347_3864928007509679113_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1775308436_3867889927384620206_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1775308436_3867889929691509850_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1775308436_3867889931092413821_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
  {
    src: "/gallery_images/lamthanhmy_1775308436_3867889934330382239_2053004915.jpg",
    alt: "Lâm Thanh Mỹ — ảnh từ Instagram",
    caption: "Instagram",
    category: "other",
  },
];

export const CATEGORIES = [
  { key: "all", label: "Tất cả" },
  { key: "other", label: "Instagram" },
  { key: "poster", label: "Poster phim" },
  { key: "portrait", label: "Chân dung" },
  { key: "event", label: "Sự kiện" },
] as const;
