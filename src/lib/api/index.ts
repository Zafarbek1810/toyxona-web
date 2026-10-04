import { apiRequest } from "./client";
import type { AuthUser, HomeData, Product, Category, Seller, SubscriptionPlan, CartResponse, Order, Address, Notification } from "./types";

export const authApi = {
  login: (body: { phone?: string; email?: string; password: string }) =>
    apiRequest<{ token: string; user: AuthUser }>("/auth/login", { method: "POST", body, auth: false }),
  register: (body: Record<string, unknown>) =>
    apiRequest<{ token: string; user: AuthUser }>("/auth/register", { method: "POST", body, auth: false }),
  me: () => apiRequest<AuthUser>("/auth/me"),
  forgotPassword: (phone: string) =>
    apiRequest<{ message: string; demoCode?: string }>("/auth/forgot-password", {
      method: "POST",
      body: { phone },
      auth: false,
    }),
  resetPassword: (body: { phone: string; code: string; password: string }) =>
    apiRequest<{ message: string }>("/auth/reset-password", { method: "POST", body, auth: false }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
};

export const catalogApi = {
  home: () => apiRequest<HomeData>("/home", { auth: false }),
  regions: () => apiRequest<string[]>("/regions", { auth: false }),
  categories: () => apiRequest<Category[]>("/categories", { auth: false }),
  products: (query?: Record<string, string | number | boolean | undefined>) =>
    apiRequest<Product[]>("/products", { auth: false, query }),
  product: (id: number | string) => apiRequest<Product>(`/products/${id}`, { auth: false }),
  similar: (id: number | string) => apiRequest<Product[]>(`/products/${id}/similar`, { auth: false }),
  sellers: (query?: Record<string, string | number | undefined>) =>
    apiRequest<Seller[]>("/sellers", { auth: false, query }),
  store: (slug: string, tab?: string) =>
    apiRequest<{ store: Seller; products: Product[] }>(`/stores/${slug}`, {
      auth: false,
      query: { tab },
    }),
  plans: () => apiRequest<SubscriptionPlan[]>("/subscription-plans", { auth: false }),
  productReviews: (id: number | string) =>
    apiRequest<{
      reviews: unknown[];
      histogram: Record<string, number>;
      average: number;
      count: number;
    }>(`/products/${id}/reviews`, { auth: false }),
};

export const cartApi = {
  get: () => apiRequest<CartResponse>("/cart"),
  add: (productId: number, quantity = 1) =>
    apiRequest("/cart/items", { method: "POST", body: { productId, quantity } }),
  update: (productId: number, quantity: number) =>
    apiRequest(`/cart/items/${productId}`, { method: "PATCH", body: { quantity } }),
  remove: (productId: number) =>
    apiRequest(`/cart/items/${productId}`, { method: "DELETE" }),
  promo: (code: string) =>
    apiRequest<{ code: string; discountPct: number; title: string }>("/cart/promo", {
      method: "POST",
      body: { code },
    }),
};

export const favoritesApi = {
  list: () =>
    apiRequest<Array<{ id: number; productId: number; product: Product }>>("/favorites"),
  add: (productId: number) => apiRequest(`/favorites/${productId}`, { method: "POST" }),
  remove: (productId: number) => apiRequest(`/favorites/${productId}`, { method: "DELETE" }),
  toggle: (productId: number) =>
    apiRequest<{ favorited: boolean; productId: number }>(`/favorites/${productId}/toggle`, {
      method: "POST",
    }),
};

export const ordersApi = {
  create: (body: Record<string, unknown>) =>
    apiRequest<Order[]>("/orders", { method: "POST", body }),
  list: (query?: Record<string, string | undefined>) =>
    apiRequest<Order[]>("/orders", { query }),
  get: (id: number | string) => apiRequest<Order>(`/orders/${id}`),
  review: (id: number | string, body: { rating: number; comment: string; productId?: number }) =>
    apiRequest(`/orders/${id}/reviews`, { method: "POST", body }),
};

export const usersApi = {
  me: () => apiRequest<AuthUser>("/users/me"),
  updateMe: (body: Record<string, unknown>) =>
    apiRequest<AuthUser>("/users/me", { method: "PATCH", body }),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    apiRequest("/users/me/change-password", { method: "POST", body }),
  getSettings: () => apiRequest<Record<string, unknown>>("/users/me/settings"),
  updateSettings: (body: Record<string, unknown>) =>
    apiRequest("/users/me/settings", { method: "PATCH", body }),
};

export const addressesApi = {
  list: () => apiRequest<Address[]>("/addresses"),
  create: (body: Omit<Address, "id">) =>
    apiRequest<Address>("/addresses", { method: "POST", body }),
  update: (id: number, body: Partial<Address>) =>
    apiRequest<Address>(`/addresses/${id}`, { method: "PATCH", body }),
  remove: (id: number) => apiRequest(`/addresses/${id}`, { method: "DELETE" }),
  setDefault: (id: number) => apiRequest<Address>(`/addresses/${id}/default`, { method: "POST" }),
};

export const notificationsApi = {
  list: () =>
    apiRequest<{ items: Notification[]; unread: number }>("/notifications"),
  markRead: (id: number) => apiRequest(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => apiRequest("/notifications/read-all", { method: "POST" }),
  remove: (id: number) => apiRequest(`/notifications/${id}`, { method: "DELETE" }),
};
