import { formatPrice } from "../lib/format";
import { categoryById } from "../lib/wedding/catalog";
import type { Specialist } from "../lib/wedding/types";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { paths } from "../routes/paths";

export default function SpecialistCard({
  specialist,
  faved,
  onFav,
}: {
  specialist: Specialist;
  faved?: boolean;
  onFav?: () => void;
}) {
  const navigate = useAppNavigate();
  const category = categoryById(specialist.categoryId);

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full"
      style={{ borderColor: "var(--border)" }}
      onClick={() => navigate(paths.specialist(specialist.id))}
    >
      <div className="relative">
        <img src={specialist.image} alt="" className="w-full h-40 object-cover" />
        <span className="absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/95 text-gray-800">
          {category?.icon} {category?.name}
        </span>
        {specialist.featured && (
          <span className="absolute top-2 right-12 text-[10px] font-bold px-2 py-1 rounded-full bg-[#F59E0B] text-white">TOP</span>
        )}
        {specialist.id > 0 && <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onFav?.();
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
            faved ? "bg-red-500 text-white" : "bg-white/90 text-gray-400"
          }`}
          aria-label="Sevimlilarga qo'shish"
        >
          <svg className="w-4 h-4" fill={faved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 line-clamp-1" style={{ fontFamily: "var(--font-sans)" }}>{specialist.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{specialist.region}</p>
        <div className="flex items-center justify-between mt-3 gap-2">
          <p className="text-sm font-semibold text-[#008F5A]">
            {specialist.priceFrom == null ? "Kelishilgan narxda" : `${formatPrice(specialist.priceFrom)}dan`}
          </p>
          {specialist.reviewCount > 0 && (
            <p className="text-xs text-gray-500">{specialist.rating.toFixed(1)} ({specialist.reviewCount})</p>
          )}
        </div>
      </div>
    </article>
  );
}
