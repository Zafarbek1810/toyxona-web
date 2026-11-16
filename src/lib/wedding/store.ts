import { useCallback, useEffect, useState } from "react";
import { getToken } from "../api/client";
import { weddingApi } from "../api/wedding";
import type { Booking, Favorite, Review, SessionId } from "./types";

const BOOKINGS_KEY = "toyxona_bookings";
const FAVORITES_KEY = "toyxona_favorites";
const REVIEWS_KEY = "toyxona_reviews";
const BOOKINGS_EVENT = "toyxona-bookings";
const FAVORITES_EVENT = "toyxona-favorites";
const REVIEWS_EVENT = "toyxona-reviews";
const EMPTY_BOOKINGS: Booking[] = [];
const EMPTY_FAVORITES: Favorite[] = [];
const EMPTY_REVIEWS: Review[] = [];

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown, event: string) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(event));
}

function useStored<T>(key: string, event: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readJson(key, fallback));
  useEffect(() => {
    const sync = () => setValue(readJson(key, fallback));
    window.addEventListener(event, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(event, sync);
      window.removeEventListener("storage", sync);
    };
  }, [event, fallback, key]);
  return value;
}

export function useBookings() {
  return useStored<Booking[]>(BOOKINGS_KEY, BOOKINGS_EVENT, EMPTY_BOOKINGS);
}

export function useFavorites() {
  const local = useStored<Favorite[]>(FAVORITES_KEY, FAVORITES_EVENT, EMPTY_FAVORITES);
  const [remote, setRemote] = useState<Favorite[] | null>(null);

  const load = useCallback(async () => {
    if (!getToken()) {
      setRemote(null);
      return;
    }
    try {
      const rows = await weddingApi.favorites();
      setRemote(
        rows.flatMap((row) => {
          const id = row.kind === "venue" ? row.venue?.id : row.specialist?.id;
          return id ? [{ kind: row.kind, id }] : [];
        }),
      );
    } catch {
      setRemote([]);
    }
  }, []);

  useEffect(() => {
    void load();
    const sync = () => {
      void load();
    };
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, [load]);

  if (getToken()) return remote ?? [];
  return local;
}

export function useReviews() {
  return useStored<Review[]>(REVIEWS_KEY, REVIEWS_EVENT, EMPTY_REVIEWS);
}

export function saveBooking(booking: Booking) {
  const list = readJson<Booking[]>(BOOKINGS_KEY, []);
  writeJson(BOOKINGS_KEY, [booking, ...list], BOOKINGS_EVENT);
}

export function setBookingStatus(id: string, status: Booking["status"]) {
  const list = readJson<Booking[]>(BOOKINGS_KEY, []);
  writeJson(
    BOOKINGS_KEY,
    list.map((item) => (item.id === id ? { ...item, status } : item)),
    BOOKINGS_EVENT,
  );
}

export async function toggleFavorite(item: Favorite) {
  if (getToken()) {
    await weddingApi.toggleFavorite(item.kind, item.id);
    window.dispatchEvent(new Event(FAVORITES_EVENT));
    return;
  }
  const list = readJson<Favorite[]>(FAVORITES_KEY, []);
  const exists = list.some((fav) => fav.kind === item.kind && fav.id === item.id);
  const next = exists ? list.filter((fav) => !(fav.kind === item.kind && fav.id === item.id)) : [item, ...list];
  writeJson(FAVORITES_KEY, next, FAVORITES_EVENT);
}

export function isFavorite(list: Favorite[], item: Favorite) {
  return list.some((fav) => fav.kind === item.kind && fav.id === item.id);
}

export function addReview(review: Review) {
  const list = readJson<Review[]>(REVIEWS_KEY, []);
  writeJson(REVIEWS_KEY, [review, ...list], REVIEWS_EVENT);
}

export function reviewsFor(list: Review[], target: Review["target"], targetId: number) {
  return list.filter((item) => item.target === target && item.targetId === targetId);
}

export function bookedSessions(venueId: number, iso: string, bookings: Booking[]): SessionId[] {
  return bookings
    .filter((item) => item.venueId === venueId && item.date === iso && item.status !== "cancelled")
    .map((item) => item.session);
}

export function useAccountBookings() {
  const [rows, setRows] = useState<Booking[]>([]);
  const load = useCallback(async () => {
    if (!getToken()) {
      setRows([]);
      return;
    }
    try {
      setRows(await weddingApi.myBookings());
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
    const sync = () => {
      void load();
    };
    window.addEventListener(BOOKINGS_EVENT, sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(BOOKINGS_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, [load]);

  return rows;
}

export async function cancelBooking(id: number | string) {
  await weddingApi.updateBooking(id, "cancelled");
  window.dispatchEvent(new Event(BOOKINGS_EVENT));
}
