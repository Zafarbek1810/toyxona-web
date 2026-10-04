export const SITE_NAME = "To'yxona";

/** Exact pathname → page title (without brand suffix). */
const exactTitles: Record<string, string> = {
  "/": "Bosh sahifa",
  "/products": "Mahsulotlar",
  "/auth": "Kirish",
  "/cart": "Savatcha",
  "/favorites": "Sevimlilar",
  "/account": "Kabinet",
  "/account/orders": "Buyurtmalarim",
  "/account/favorites": "Sevimlilar",
  "/account/profile": "Profil",
  "/account/addresses": "Manzillar",
  "/account/notifications": "Bildirishnomalar",
  "/account/settings": "Sozlamalar",
};

export function formatDocumentTitle(pageTitle?: string | null): string {
  const trimmed = pageTitle?.trim();
  if (!trimmed || trimmed === SITE_NAME) return SITE_NAME;
  return `${trimmed} | ${SITE_NAME}`;
}

export function getPageTitleForPath(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, "") || "/";

  if (exactTitles[normalized]) return exactTitles[normalized];

  if (normalized.startsWith("/products/")) return "Mahsulot";
  if (normalized.startsWith("/store/")) return "Do'kon";
  if (normalized.startsWith("/account")) return "Kabinet";

  return SITE_NAME;
}
