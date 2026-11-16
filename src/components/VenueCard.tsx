import { formatPrice } from "../lib/format";
import { capacityLabel, locationLabel } from "../lib/wedding/catalog";
import type { Venue } from "../lib/wedding/types";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { paths } from "../routes/paths";

export default function VenueCard({
  venue,
  date,
  faved,
  onFav,
}: {
  venue: Venue;
  date?: string;
  faved?: boolean;
  onFav?: () => void;
}) {
  const navigate = useAppNavigate();
  const detail = paths.venue(venue.id);
  const book = paths.venueBook(venue.id, date);

  return (
    <article className="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex flex-col h-full" style={{ borderColor: "var(--border)" }}>
      <div className="relative">
        <button type="button" onClick={() => navigate(detail)} className="block w-full text-left">
          <img src={venue.image} alt={venue.name} className="w-full h-44 object-cover" />
        </button>
        <button
          type="button"
          onClick={onFav}
          className={`absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
            faved ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"
          }`}
          aria-label="Sevimlilarga qo'shish"
        >
          <svg className="w-4 h-4" fill={faved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>{venue.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{locationLabel(venue.region, venue.district)}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mt-2 flex-1">{venue.description}</p>
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div>
            <p className="text-[11px] text-gray-400">Mehmon sig&apos;imi</p>
            <p className="font-semibold text-gray-800">{capacityLabel(venue)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Boshlang&apos;ich narx</p>
            <p className="font-semibold text-[#008F5A]">
              {venue.priceFrom == null ? "Kelishilgan narxda" : `${formatPrice(venue.priceFrom)}dan`}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={() => navigate(detail)} className="flex-1 border border-gray-200 rounded-xl py-2 text-sm font-semibold text-gray-700 hover:border-[#00A86B] hover:text-[#00A86B]">
            Batafsil
          </button>
          <button type="button" onClick={() => navigate(book)} className="flex-1 rounded-xl py-2 text-sm font-semibold text-white bg-[#00A86B] hover:bg-[#008F5A]">
            Bron qilish
          </button>
        </div>
      </div>
    </article>
  );
}
