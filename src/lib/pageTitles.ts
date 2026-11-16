export const SITE_NAME = "To'yxona";

const exactTitles: Record<string, string> = {
  "/": "Bosh sahifa",
  "/katalog": "To'yxonalar",
  "/mutaxassislar": "Mutaxassislar",
  "/mutaxassis/royxatdan-otish": "Mutaxassis bo'lish",
  "/auth": "Kirish",
  "/favorites": "Sevimlilar",
  "/account": "Kabinet",
  "/account/bookings": "Bronlarim",
  "/account/favorites": "Sevimlilar",
  "/account/profile": "Profil",
};

export function formatDocumentTitle(pageTitle?: string | null): string {
  const trimmed = pageTitle?.trim();
  if (!trimmed || trimmed === SITE_NAME) return SITE_NAME;
  return `${trimmed} | ${SITE_NAME}`;
}

export function getPageTitleForPath(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (exactTitles[normalized]) return exactTitles[normalized];
  if (normalized.includes("/bron")) return "Bron qilish";
  if (normalized.startsWith("/toyxonalar/")) return "To'yxona";
  if (normalized.startsWith("/mutaxassislar/")) return "Mutaxassis";
  if (normalized.startsWith("/account")) return "Kabinet";
  return SITE_NAME;
}
