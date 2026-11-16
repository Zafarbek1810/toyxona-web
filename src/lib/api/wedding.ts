import { exampleSpecialists, filterSpecialists } from "../wedding/catalog";
import { apiRequest } from "./client";
import type { Booking, Review, SessionId, Specialist, Venue, VenueQuery } from "../wedding/types";

export type OccupiedSlot = {
  venueId: number;
  date: string;
  session: SessionId;
};

export const weddingApi = {
  venues: (query?: VenueQuery) =>
    apiRequest<Venue[]>("/venues", {
      auth: false,
      query: {
        q: query?.q,
        region: query?.region,
        date: query?.date,
        guests: query?.guests,
        amenities: query?.amenities?.join(","),
        limit: 100,
      },
    }),
  venue: (id: number | string) => apiRequest<Venue>(`/venues/${id}`, { auth: false }),
  slots: () => apiRequest<OccupiedSlot[]>("/slots", { auth: false }),
  specialists: async (query?: { q?: string; category?: string; region?: string }) =>
    filterSpecialists([
      ...await apiRequest<Specialist[]>("/specialists", { auth: false, query: { ...query, limit: 100 } }),
      ...exampleSpecialists,
    ], query || {}),
  specialist: (id: number | string) => {
    const example = exampleSpecialists.find((item) => item.id === Number(id));
    return example ? Promise.resolve(example) : apiRequest<Specialist>(`/specialists/${id}`, { auth: false });
  },
  reviews: (target: "venue" | "specialist", id: number | string) =>
    apiRequest<Review[]>(target === "venue" ? `/venues/${id}/reviews` : `/specialists/${id}/reviews`, { auth: false }),
  addReview: (body: { target: "venue" | "specialist"; targetId: number; name: string; rating: number; text: string }) =>
    apiRequest<Review>("/reviews", { method: "POST", body, auth: true }),
  createBooking: (body: {
    venueId: number;
    session: SessionId;
    date: string;
    guests: number;
    name: string;
    phone: string;
    note?: string;
  }) => apiRequest<Booking>("/bookings", { method: "POST", body, auth: true }),
  myBookings: () => apiRequest<Booking[]>("/bookings/mine"),
  updateBooking: (id: number | string, status: Booking["status"]) =>
    apiRequest<Booking>(`/bookings/${id}/status`, { method: "PATCH", body: { status } }),
  favorites: () =>
    apiRequest<Array<{ kind: "venue" | "specialist"; venue?: Venue | null; specialist?: Specialist | null }>>("/favorites"),
  toggleFavorite: (kind: "venue" | "specialist", id: number) =>
    apiRequest<{ favorited: boolean }>(`/favorites/toggle`, { method: "POST", body: { kind, id } }),
  registerSpecialist: (body: Record<string, unknown>) =>
    apiRequest<{ token: string; user: unknown }>("/auth/register", { method: "POST", body, auth: false }),
};
