import Reveal from "../components/Reveal";
import SpecialistCard from "../components/SpecialistCard";
import VenueCard from "../components/VenueCard";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { useCatalog } from "../context/CatalogContext";
import { isFavorite, toggleFavorite, useFavorites } from "../lib/wedding/store";
import { paths } from "../routes/paths";

export default function FavoritesPage({ embedded = false }: { embedded?: boolean }) {
  const navigate = useAppNavigate();
  const favorites = useFavorites();
  const { venues, specialists } = useCatalog();
  const venueItems = favorites.flatMap((item) => {
    if (item.kind !== "venue") return [];
    const venue = venues.find((entry) => entry.id === item.id);
    return venue ? [venue] : [];
  });
  const people = favorites.flatMap((item) => {
    if (item.kind !== "specialist") return [];
    const person = specialists.find((entry) => entry.id === item.id);
    return person ? [person] : [];
  });

  return (
    <div className={embedded ? "" : "max-w-7xl mx-auto px-4 py-8"}>
      <Reveal>
        <h1 className={`${embedded ? "text-2xl" : "text-3xl"} font-black text-gray-900 mb-6`} style={{ fontFamily: "var(--font-sans)" }}>Sevimlilar</h1>
      </Reveal>
      {favorites.length === 0 && (
        <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-gray-500 mb-4">Hali saqlangan to&apos;yxona yoki mutaxassis yo&apos;q.</p>
          <button type="button" onClick={() => navigate(paths.catalog)} className="rounded-xl bg-[#00A86B] text-white font-semibold px-5 py-2.5">
            To&apos;yxonalarni ko&apos;rish
          </button>
        </div>
      )}
      {venueItems.length > 0 && (
        <section className="mb-8">
          <h2 className="font-bold text-gray-900 mb-3">To&apos;yxonalar</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venueItems.map((venue, index) => (
              <Reveal key={venue.id} className="h-full" delay={(index % 3) * 90}>
                <VenueCard venue={venue} faved onFav={() => toggleFavorite({ kind: "venue", id: venue.id })} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
      {people.length > 0 && (
        <section>
          <h2 className="font-bold text-gray-900 mb-3">Mutaxassislar</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {people.map((item, index) => (
              <Reveal key={item.id} className="h-full" delay={(index % 4) * 80}>
                <SpecialistCard
                  specialist={item}
                  faved={isFavorite(favorites, { kind: "specialist", id: item.id })}
                  onFav={() => toggleFavorite({ kind: "specialist", id: item.id })}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
