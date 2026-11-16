export const paths = {
  home: "/",
  catalog: "/katalog",
  venue: (id: number | string) => `/toyxonalar/${id}`,
  venueBook: (id: number | string, date?: string) => {
    const base = `/toyxonalar/${id}/bron`;
    return date ? `${base}?date=${date}` : base;
  },
  specialists: "/mutaxassislar",
  specialist: (id: number | string) => `/mutaxassislar/${id}`,
  specialistJoin: "/mutaxassis/royxatdan-otish",
  auth: "/auth",
  favorites: "/favorites",
  account: {
    root: "/account",
    bookings: "/account/bookings",
    favorites: "/account/favorites",
    profile: "/account/profile",
  },
} as const;

export const accountSectionPaths: Record<string, string> = {
  overview: paths.account.root,
  bookings: paths.account.bookings,
  favorites: paths.account.favorites,
  profile: paths.account.profile,
};

export function getAccountSection(pathname: string): string {
  for (const [id, path] of Object.entries(accountSectionPaths)) {
    if (pathname === path) return id;
  }
  return "overview";
}
