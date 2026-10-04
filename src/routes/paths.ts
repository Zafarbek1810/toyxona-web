export const paths = {
  home: "/",
  products: "/products",
  product: (id: number | string) => `/products/${id}`,
  store: (slug = "techplus") => `/store/${slug}`,
  auth: "/auth",
  cart: "/cart",
  favorites: "/favorites",
  account: {
    root: "/account",
    orders: "/account/orders",
    favorites: "/account/favorites",
    profile: "/account/profile",
    addresses: "/account/addresses",
    notifications: "/account/notifications",
    settings: "/account/settings",
  },
} as const;

export const accountSectionPaths: Record<string, string> = {
  overview: paths.account.root,
  orders: paths.account.orders,
  favorites: paths.account.favorites,
  profile: paths.account.profile,
  addresses: paths.account.addresses,
  notifications: paths.account.notifications,
  settings: paths.account.settings,
};

export function getAccountSection(pathname: string): string {
  for (const [id, path] of Object.entries(accountSectionPaths)) {
    if (pathname === path) return id;
  }
  return "overview";
}
