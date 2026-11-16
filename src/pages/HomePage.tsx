import { useMemo, useState } from "react";
import Reveal from "../components/Reveal";
import VenueCard from "../components/VenueCard";
import SpecialistCard from "../components/SpecialistCard";
import VenueFilters from "../components/VenueFilters";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { dashboardUrl } from "../lib/links";
import { useCatalog } from "../context/CatalogContext";
import { catalogPath, PLATFORM, SPECIALIST_CATEGORIES } from "../lib/wedding/catalog";
import { isFavorite, toggleFavorite, useFavorites } from "../lib/wedding/store";
import type { VenueQuery } from "../lib/wedding/types";
import { paths } from "../routes/paths";

const STATS = [
  { value: "—", label: "Muhtasham saroylar" },
  { value: "1", label: "Hudud qamrovi" },
  { value: "24/7", label: "Onlayn bron qilish" },
  { value: "0%", label: "Xizmat haqi (komissiya)" },
];

const HOME_CATEGORIES = ["host", "photo", "liveband", "cortege"];

export default function HomePage() {
  const navigate = useAppNavigate();
  const favorites = useFavorites();
  const { venues, specialists } = useCatalog();
  const [query, setQuery] = useState<VenueQuery>({});
  const featured = useMemo(() => venues.slice(0, 6), [venues]);
  const people = useMemo(() => specialists.filter((item) => item.featured).slice(0, 4), [specialists]);

  return (
    <div>
      <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg, #0F172A 0%, #003D27 50%, #0F172A 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "#00A86B" }} />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-15 blur-2xl" style={{ background: "#00A86B" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-14">
          <Reveal>
            <p className="text-xs font-semibold tracking-wide text-[#6EE7B7] mb-3">Oliy darajadagi tadbirlar uchun</p>
            <h1 className="text-4xl md:text-5xl font-black leading-[1.1] max-w-3xl mb-4" style={{ fontFamily: "var(--font-sans)" }}>
              Eng nufuzli to&apos;yxonalarni <span className="text-[#6EE7B7]">bitta platformada</span> toping
            </h1>
            <p className="text-white/65 max-w-2xl mb-8">
              Bo&apos;sh sanalarni tekshiring va onlayn bron qiling. Narx to&apos;yxonaning o&apos;zi bilan kelishiladi, platforma komissiya olmaydi.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <VenueFilters variant="hero" value={query} onChange={setQuery} onSearch={() => navigate(catalogPath(query))} />
          </Reveal>
        </div>
        <div className="border-t border-white/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 80}>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black text-[#6EE7B7]" style={{ fontFamily: "var(--font-sans)" }}>{index === 0 ? String(venues.length) : stat.value}</p>
                  <p className="text-white/55 text-xs">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <Reveal>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>Oliy toifali to&apos;yxonalar</h2>
              <p className="text-sm text-gray-500 mt-1">{venues.length} ta natija</p>
            </div>
            <button type="button" onClick={() => navigate(paths.catalog)} className="text-sm font-semibold text-[#00A86B]">
              Barchasini ko&apos;rish
            </button>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((venue, index) => (
            <Reveal key={venue.id} className="h-full" delay={(index % 3) * 90}>
              <VenueCard
                venue={venue}
                faved={isFavorite(favorites, { kind: "venue", id: venue.id })}
                onFav={() => toggleFavorite({ kind: "venue", id: venue.id })}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-12 grid md:grid-cols-3 gap-4">
        {[
          { title: "Haqiqiy vaqtdagi bandlik", text: "Bo'sh kunlarni uydan chiqmasdan kalendar orqali tekshiring. Sanalar yangilanib boradi." },
          { title: "Vositachilarsiz narxlar", text: "Platforma qo'shimcha foiz olmaydi. Bron to'g'ridan-to'g'ri to'yxona narxida yuboriladi." },
          { title: "Kafolatlangan tasdiq", text: "So'rov to'yxona ma'muriyatiga boradi. Tasdiqlangach tadbir sanasi band hisoblanadi." },
        ].map((item, index) => (
          <Reveal key={item.title} className="h-full" delay={index * 110}>
            <div className="bg-white rounded-2xl border p-5 h-full" style={{ borderColor: "var(--border)" }}>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-14">
        <Reveal>
          <h2 className="text-2xl font-black text-center text-gray-900 mb-8" style={{ fontFamily: "var(--font-sans)" }}>Bron qilish qadamlari</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Qidiring", text: "Hudud, sana va mehmon soni bo'yicha mos zalni toping." },
            { step: "02", title: "Buyurtma bering", text: "To'yxona sahifasida sanani tanlang va band qilish formasini to'ldiring." },
            { step: "03", title: "Tasdiqlang", text: "To'yxona rahbariyati arizani ko'rib chiqadi va rasman tasdiqlaydi." },
          ].map((item, index) => (
            <Reveal key={item.step} delay={index * 120}>
              <div className="text-center">
                <div className="text-xs font-mono font-bold text-[#F59E0B] mb-2">{item.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white border-y py-12" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>Barcha xizmatlar bir joyda</h2>
                <p className="text-sm text-gray-500 mt-1">Boshlovchi, foto, sozanda va kortejni ham shu yerdan topasiz.</p>
              </div>
              <button type="button" onClick={() => navigate(paths.specialists)} className="text-sm font-semibold text-[#00A86B]">
                Barcha mutaxassislar
              </button>
            </div>
          </Reveal>
          <Reveal delay={80}>
          <div className="flex flex-wrap gap-2 mb-6">
            {HOME_CATEGORIES.map((id) => {
              const category = SPECIALIST_CATEGORIES.find((item) => item.id === id);
              if (!category) return null;
              return (
                <button key={id} type="button" onClick={() => navigate(`${paths.specialists}?category=${id}`)} className="px-4 py-2 rounded-full bg-[#E8F8F1] text-[#008F5A] text-sm font-semibold">
                  {category.icon} {category.short}
                </button>
              );
            })}
          </div>
          </Reveal>
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
        </div>
      </section>

      <section className="bg-[#00A86B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <Reveal>
            <h2 className="text-3xl font-black mb-3" style={{ fontFamily: "var(--font-sans)" }}>To&apos;yxona yoki xizmat egasi misiz?</h2>
            <p className="text-white/80 mb-6">
              Bandlik kalendarini boshqaring, arizalarni qabul qiling va mijozlar sharhlari orqali reytingni oshiring.
            </p>
            <ul className="space-y-2 text-sm text-white/85 mb-6">
              {["Shaxsiy boshqaruv paneli", "Daromad va statistika", "Buyurtmalarni to'g'ridan-to'g'ri qabul qilish", "Sharhlar orqali reyting"].map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <a href={dashboardUrl("/?register=1")} className="inline-block bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold px-6 py-3 rounded-xl">
              Platformaga ulanish
            </a>
          </Reveal>
          <Reveal delay={140}>
          <div className="bg-white/10 rounded-3xl p-6 border border-white/20">
            <p className="text-sm text-white/70 mb-2">Aloqa</p>
            <a href={PLATFORM.phoneHref} className="block text-2xl font-black">{PLATFORM.phone}</a>
            <a href={`mailto:${PLATFORM.email}`} className="text-white/80 text-sm">{PLATFORM.email}</a>
          </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
