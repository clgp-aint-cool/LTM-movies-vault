export const SITE_URL = "https://lamthanhmy.com";
/** Site name Google shows above results (WebSite.name + og:site_name) — keep it short and identical everywhere */
export const SITE_NAME = "Lâm Thanh Mỹ";
/** Fan-archive label for footer / author / publisher, so content isn't attributed to the actress herself */
export const SITE_BRAND = "Lâm Thanh Mỹ – Kho phim";

export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}
