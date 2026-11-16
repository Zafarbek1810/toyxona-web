import PlaceSelect from "./PlaceSelect";
import { AMENITIES } from "../lib/wedding/catalog";
import type { AmenityId, VenueQuery } from "../lib/wedding/types";

const fieldClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B]/20";

export default function VenueFilters({
  value,
  onChange,
  onSearch,
  variant = "panel",
}: {
  value: VenueQuery;
  onChange: (next: VenueQuery) => void;
  onSearch: () => void;
  variant?: "hero" | "panel";
}) {
  const toggleAmenity = (id: AmenityId) => {
    const current = value.amenities || [];
    const amenities = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    onChange({ ...value, amenities });
  };

  const shell = variant === "hero" ? "bg-white rounded-3xl p-4 md:p-5 shadow-2xl shadow-black/20 text-gray-800" : "bg-white rounded-2xl border p-4 md:p-5";

  return (
    <form
      className={shell}
      style={variant === "panel" ? { borderColor: "var(--border)" } : undefined}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <label className="block">
          <span className="text-xs font-semibold text-gray-500">Tadbir sanasi</span>
          <input
            type="date"
            value={value.date || ""}
            onChange={(event) => onChange({ ...value, date: event.target.value || undefined })}
            className={`${fieldClass} mt-1`}
          />
        </label>
        <PlaceSelect
          region={value.region}
          district={value.district}
          onChange={(place) => onChange({ ...value, region: place.region, district: place.district })}
          className={`${fieldClass} mt-1`}
        />
        <label className="block">
          <span className="text-xs font-semibold text-gray-500">Min. mehmon soni</span>
          <input
            type="number"
            min={1}
            placeholder="Masalan, 200"
            value={value.guests || ""}
            onChange={(event) => onChange({ ...value, guests: event.target.value ? Number(event.target.value) : undefined })}
            className={`${fieldClass} mt-1`}
          />
        </label>
        <div className="flex items-end">
          <button type="submit" className="w-full rounded-xl py-2.5 text-sm font-bold text-white bg-[#00A86B] hover:bg-[#008F5A]">
            Izlash
          </button>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Qo&apos;shimcha qulayliklar</p>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((item) => {
            const active = value.amenities?.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleAmenity(item.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  active ? "bg-[#E8F8F1] border-[#00A86B] text-[#008F5A]" : "border-gray-200 text-gray-600 hover:border-[#00A86B]"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    </form>
  );
}
