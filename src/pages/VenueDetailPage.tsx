import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import Reveal from "../components/Reveal";
import ReviewBox from "../components/ReviewBox";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { formatPrice } from "../lib/format";
import { slotsFor, useCatalog, useVenue } from "../context/CatalogContext";
import { amenityName, capacityLabel, locationLabel, mapsUrl, SESSIONS } from "../lib/wedding/catalog";
import { isFavorite, toggleFavorite, useFavorites } from "../lib/wedding/store";
import { paths } from "../routes/paths";

export default function VenueDetailPage() {
  const { venueId = "" } = useParams();
  const { venue, loading } = useVenue(venueId);
  const { slots } = useCatalog();
  const navigate = useAppNavigate();
  const favorites = useFavorites();
  const [photo, setPhoto] = useState(0);
  const [tab, setTab] = useState<"amenities" | "menu" | "map">("amenities");
  const [date, setDate] = useState("");

  const load = useMemo(() => {
    if (!venue) return () => 0 as const;
    return (iso: string) => {
      const count = slotsFor(slots, venue.id, iso).length as 0 | 1 | 2 | 3;
      return count;
    };
  }, [slots, venue]);

  if (loading) return <p className="max-w-7xl mx-auto px-4 py-16 text-sm text-gray-400">Yuklanmoqda...</p>;
  if (!venue) return <Navigate to={paths.catalog} replace />;

  const photos = [venue.image, ...venue.gallery.filter((item) => item !== venue.image)];
  const faved = isFavorite(favorites, { kind: "venue", id: venue.id });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Reveal>
        <button type="button" onClick={() => navigate(paths.catalog)} className="text-sm text-[#00A86B] font-semibold mb-4">
          ← Orqaga qaytish
        </button>
      </Reveal>
      <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6">
        <div>
          <Reveal>
          <img src={photos[photo] || venue.image} alt={venue.name} className="w-full h-72 md:h-96 object-cover rounded-3xl" />
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {photos.slice(0, 5).map((src, index) => (
              <button key={src} type="button" onClick={() => setPhoto(index)} className={`shrink-0 rounded-xl overflow-hidden border-2 ${photo === index ? "border-[#00A86B]" : "border-transparent"}`}>
                <img src={src} alt="" className="w-20 h-16 object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>{venue.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{locationLabel(venue.region, venue.district)} — {venue.address}</p>
              <p className="text-sm text-gray-600 mt-2">{venue.phone} · Ish vaqti: {venue.hours}</p>
              <p className="text-sm text-gray-700 mt-3">Mehmonlar sig&apos;imi: {capacityLabel(venue)}</p>
            </div>
            <button type="button" onClick={() => toggleFavorite({ kind: "venue", id: venue.id })} className={`text-sm font-semibold px-3 py-2 rounded-xl border ${faved ? "bg-red-50 text-red-600 border-red-100" : "text-gray-600"}`} style={{ borderColor: faved ? undefined : "var(--border)" }}>
              {faved ? "Saqlangan" : "Saqlash"}
            </button>
          </div>
          <p className="text-gray-600 mt-4 leading-relaxed">{venue.description}</p>
          </Reveal>

          <Reveal>
          <div className="flex gap-2 mt-6">
            {[
              ["amenities", "Qulayliklar"],
              ["menu", "Menyu"],
              ["map", "Joylashuv"],
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setTab(id as typeof tab)} className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === id ? "bg-[#00A86B] text-white" : "bg-white border text-gray-600"}`} style={tab === id ? undefined : { borderColor: "var(--border)" }}>
                {label}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl border p-5 mt-3" style={{ borderColor: "var(--border)" }}>
            {tab === "amenities" && (
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((id) => (
                  <span key={id} className="px-3 py-1.5 rounded-full bg-[#E8F8F1] text-[#008F5A] text-sm font-medium">{amenityName(id)}</span>
                ))}
              </div>
            )}
            {tab === "menu" && (
              <ul className="space-y-2 text-sm text-gray-700">
                {venue.menu.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            )}
            {tab === "map" && (
              <a href={mapsUrl(venue)} target="_blank" rel="noreferrer" className="inline-flex text-sm font-semibold text-[#00A86B]">
                Google Maps orqali ochish
              </a>
            )}
          </div>
          </Reveal>

          <Reveal>
          <div className="bg-white rounded-2xl border p-5 mt-4" style={{ borderColor: "var(--border)" }}>
            <h2 className="font-bold text-gray-900 mb-3">Zallar va narxlar</h2>
            {venue.halls.length === 0 ? (
              <p className="text-sm text-gray-500">Hozircha zallar kiritilmagan. Narx kelishiladi.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th className="py-2 font-medium">Zal nomi</th>
                      <th className="py-2 font-medium">Sig&apos;im</th>
                      <th className="py-2 font-medium">Narxi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venue.halls.map((hall) => (
                      <tr key={hall.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                        <td className="py-2">{hall.name}</td>
                        <td>{hall.capacity} kishi</td>
                        <td>{hall.price == null ? "Kelishilgan narxda" : `${formatPrice(hall.price)} / kishi`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          </Reveal>

          <Reveal>
          <div className="mt-4">
            <ReviewBox target="venue" targetId={venue.id} seedRating={venue.rating} seedCount={venue.reviewCount} />
          </div>
          </Reveal>
        </div>

        <Reveal>
        <aside className="bg-white rounded-2xl border p-5 h-fit lg:sticky lg:top-28" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-bold text-gray-900 mb-4">Bandlik kalendari</h2>
          <AvailabilityCalendar selected={date} onSelect={setDate} load={load} legend="venue" />
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-gray-800">Seanslar</p>
            {SESSIONS.map((session) => {
              const taken = date ? slotsFor(slots, venue.id, date).includes(session.id) : false;
              return (
                <div key={session.id} className="flex items-center justify-between text-sm border rounded-xl px-3 py-2" style={{ borderColor: "var(--border)" }}>
                  <span>{session.name} · {session.time}</span>
                  <span className={taken ? "text-red-500" : "text-[#008F5A]"}>{date ? (taken ? "Band" : "Bo'sh") : "—"}</span>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            disabled={!date}
            onClick={() => navigate(paths.venueBook(venue.id, date))}
            className="w-full mt-4 rounded-xl bg-[#00A86B] hover:bg-[#008F5A] disabled:opacity-50 text-white font-semibold py-3"
          >
            {date ? "Bron qilish" : "Kalendardan sanani tanlang"}
          </button>
        </aside>
        </Reveal>
      </div>
    </div>
  );
}
