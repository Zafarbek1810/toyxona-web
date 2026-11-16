import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import VenueCard from "../components/VenueCard";
import VenueFilters from "../components/VenueFilters";
import { slotsFor, useCatalog } from "../context/CatalogContext";
import { catalogPath, filterVenues, queryFromParams } from "../lib/wedding/catalog";
import { isFavorite, toggleFavorite, useFavorites } from "../lib/wedding/store";
import { useAppNavigate } from "../hooks/useAppNavigate";
import type { VenueQuery } from "../lib/wedding/types";

export default function CatalogPage() {
  const navigate = useAppNavigate();
  const [params] = useSearchParams();
  const initial = useMemo(() => queryFromParams(params), [params]);
  const [query, setQuery] = useState<VenueQuery>(initial);
  const { venues, slots, loading } = useCatalog();
  const favorites = useFavorites();
  const results = useMemo(
    () => filterVenues(venues, query, (venueId, iso) => slotsFor(slots, venueId, iso)),
    [query, slots, venues],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Reveal>
        <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "var(--font-sans)" }}>Barcha to&apos;yxonalar</h1>
        <p className="text-sm text-gray-500 mb-5">{loading ? "Yuklanmoqda..." : `${results.length} ta natija topildi`}</p>
      </Reveal>
      <Reveal delay={80}>
        <VenueFilters
          value={query}
          onChange={setQuery}
          onSearch={() => navigate(catalogPath(query))}
        />
      </Reveal>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {results.map((venue, index) => (
          <Reveal key={venue.id} className="h-full" delay={(index % 3) * 90}>
            <VenueCard
              venue={venue}
              date={query.date}
              faved={isFavorite(favorites, { kind: "venue", id: venue.id })}
              onFav={() => toggleFavorite({ kind: "venue", id: venue.id })}
            />
          </Reveal>
        ))}
      </div>
      {results.length === 0 && (
        <p className="text-center text-gray-500 py-16">Bu filtr bo&apos;yicha bo&apos;sh to&apos;yxona topilmadi. Sanani yoki qulayliklarni o&apos;zgartirib ko&apos;ring.</p>
      )}
    </div>
  );
}
