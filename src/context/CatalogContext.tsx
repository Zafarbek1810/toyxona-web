import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { exampleSpecialists } from "../lib/wedding/catalog";
import { ApiClientError } from "../lib/api/client";
import { weddingApi, type OccupiedSlot } from "../lib/api/wedding";
import type { SessionId, Specialist, Venue } from "../lib/wedding/types";

type CatalogValue = {
  venues: Venue[];
  specialists: Specialist[];
  slots: OccupiedSlot[];
  loading: boolean;
  refresh: () => Promise<void>;
};

const CatalogContext = createContext<CatalogValue | null>(null);

export function slotsFor(slots: OccupiedSlot[], venueId: number, iso: string): SessionId[] {
  return slots.filter((item) => item.venueId === venueId && item.date === iso).map((item) => item.session);
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [slots, setSlots] = useState<OccupiedSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [nextVenues, nextPeople, nextSlots] = await Promise.all([
      weddingApi.venues(),
      weddingApi.specialists(),
      weddingApi.slots(),
    ]);
    setVenues(nextVenues);
    setSpecialists(nextPeople);
    setSlots(nextSlots);
  }, []);

  useEffect(() => {
    let live = true;
    refresh()
      .catch(() => {
        if (!live) return;
        setVenues([]);
        setSpecialists(exampleSpecialists);
        setSlots([]);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    const onFocus = () => {
      void refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      live = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [refresh]);

  return (
    <CatalogContext.Provider value={{ venues, specialists, slots, loading, refresh }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("useCatalog must be used within CatalogProvider");
  return value;
}

function useRemoteRecord<T>(id: string, load: (id: string) => Promise<T>) {
  const [record, setRecord] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    setLoading(true);
    load(id)
      .then((next) => {
        if (live) setRecord(next);
      })
      .catch((error) => {
        if (!live) return;
        if (error instanceof ApiClientError && error.status === 404) setRecord(null);
        else setRecord(null);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [id, load]);

  return { record, loading };
}

export function useVenue(id: string) {
  const load = useCallback((nextId: string) => weddingApi.venue(nextId), []);
  const { record, loading } = useRemoteRecord(id, load);
  return { venue: record, loading };
}

export function useSpecialist(id: string) {
  const load = useCallback((nextId: string) => weddingApi.specialist(nextId), []);
  const { record, loading } = useRemoteRecord(id, load);
  return { specialist: record, loading };
}
