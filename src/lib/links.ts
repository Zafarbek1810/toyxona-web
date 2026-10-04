function dashboardOrigin(): string {
  return (import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5174").trim().replace(/\/$/, "");
}

/** Seller and admin cabinet. The dashboard is a separate app. */
export function dashboardUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${dashboardOrigin()}${normalized}`;
}
