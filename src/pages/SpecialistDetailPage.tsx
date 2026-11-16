import { Navigate, useParams } from "react-router-dom";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import Reveal from "../components/Reveal";
import ReviewBox from "../components/ReviewBox";
import { useSpecialist } from "../context/CatalogContext";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { formatPrice } from "../lib/format";
import { categoryById } from "../lib/wedding/catalog";
import { isFavorite, toggleFavorite, useFavorites } from "../lib/wedding/store";
import { paths } from "../routes/paths";

export default function SpecialistDetailPage() {
  const { specialistId = "" } = useParams();
  const { specialist: person, loading } = useSpecialist(specialistId);
  const navigate = useAppNavigate();
  const favorites = useFavorites();

  if (loading) return <p className="max-w-5xl mx-auto px-4 py-16 text-sm text-gray-400">Yuklanmoqda...</p>;
  if (!person) return <Navigate to={paths.specialists} replace />;
  const category = categoryById(person.categoryId);
  const faved = isFavorite(favorites, { kind: "specialist", id: person.id });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
      <Reveal>
      <div>
        <button type="button" onClick={() => navigate(paths.specialists)} className="text-sm text-[#00A86B] font-semibold mb-4">
          ← Mutaxassislar
        </button>
        <img src={person.image} alt="" className="w-full h-72 object-cover rounded-3xl" />
        <p className="text-sm font-semibold text-[#008F5A] mt-4">{category?.icon} {category?.name}</p>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>{person.name}</h1>
          {person.id > 0 && <button type="button" onClick={() => toggleFavorite({ kind: "specialist", id: person.id })} className="text-sm font-semibold text-[#00A86B]">
            {faved ? "Saqlangan" : "Saqlash"}
          </button>}
        </div>
        <p className="text-sm text-gray-500 mt-1">{person.region}</p>
        <p className="text-gray-700 mt-4 leading-relaxed">{person.bio}</p>
        <p className="mt-3 font-semibold text-[#008F5A]">
          {person.priceFrom == null ? "Kelishilgan narxda" : `${formatPrice(person.priceFrom)}dan`}
        </p>
        {person.id > 0 && <div className="mt-6">
          <ReviewBox target="specialist" targetId={person.id} seedRating={person.rating} seedCount={person.reviewCount} />
        </div>}
      </div>
      </Reveal>
      <Reveal delay={120}>
      <aside className="space-y-4">
        {person.id < 0 ? (
          <div className="rounded-2xl border bg-white p-5 text-sm text-gray-600" style={{ borderColor: "var(--border)" }}>
            Bu xizmat namunasi. Haqiqiy aloqa ma’lumotlari va bandlik taqvimi hali kiritilmagan.
          </div>
        ) : <>
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-bold mb-4">Bandlik taqvimi</h2>
          <AvailabilityCalendar load={() => 0} legend="specialist" />
        </div>
        <div className="bg-[#0F172A] text-white rounded-2xl p-5">
          <p className="text-sm text-white/60 mb-1">Mutaxassis bilan bog&apos;lanish</p>
          <p className="text-xl font-black">{person.phone}</p>
          <a href={`tel:${person.phone.replace(/\s/g, "")}`} className="inline-block mt-4 bg-[#00A86B] rounded-xl px-4 py-2.5 text-sm font-semibold">
            Qo&apos;ng&apos;iroq qilish
          </a>
        </div>
        </>}
      </aside>
      </Reveal>
    </div>
  );
}
