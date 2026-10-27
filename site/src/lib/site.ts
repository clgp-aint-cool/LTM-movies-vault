export const SITE_URL = "https://lamthanhmy.com";
export const SITE_NAME = "Lâm Thanh Mỹ – Kho phim";

export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}
