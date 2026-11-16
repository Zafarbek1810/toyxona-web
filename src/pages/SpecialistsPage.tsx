import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import SpecialistCard from "../components/SpecialistCard";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { useCatalog } from "../context/CatalogContext";
import PlaceSelect from "../components/PlaceSelect";
import { filterSpecialists, RENTAL_CATEGORIES, SPECIALIST_CATEGORIES } from "../lib/wedding/catalog";
import { isFavorite, toggleFavorite, useFavorites } from "../lib/wedding/store";
import { paths } from "../routes/paths";

export default function SpecialistsPage() {
  const [params] = useSearchParams();
  const navigate = useAppNavigate();
  const favorites = useFavorites();
  const { specialists } = useCatalog();
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [region, setRegion] = useState(params.get("region") || "");
  const [district, setDistrict] = useState(params.get("district") || "");
  const results = useMemo(() => filterSpecialists(specialists, { q, category, region, district }), [category, district, q, region, specialists]);

  const apply = (next: { q?: string; category?: string; region?: string; district?: string }) => {
    const search = new URLSearchParams();
    const query = next.q ?? q;
    const cat = next.category ?? category;
    const reg = next.region ?? region;
    const dist = next.district ?? district;
    if (query) search.set("q", query);
    if (cat) search.set("category", cat);
    if (reg) search.set("region", reg);
    if (dist) search.set("district", dist);
    const suffix = search.toString();
    navigate(suffix ? `${paths.specialists}?${suffix}` : paths.specialists);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>To&apos;y mutaxassislari</h1>
          <p className="text-sm text-gray-500 mt-1">Boshlovchi, fotograf, DJ, kortej va boshqa xizmatlar. {results.length} ta natija.</p>
        </div>
        <button type="button" onClick={() => navigate(paths.specialistJoin)} className="rounded-xl bg-[#00A86B] text-white text-sm font-semibold px-4 py-2.5">
          Men mutaxassisman
        </button>
      </div>
      </Reveal>
      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside aria-label="Mutaxassislarni filtrlash" className="min-w-0">
      <Reveal delay={80}>
      <form onSubmit={(event) => { event.preventDefault(); apply({}); }} className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: "var(--border)" }}>
        <h2 className="text-lg font-bold text-gray-900">Qidiruv filtrlari</h2>
        <label className="block">
          <span className="text-xs font-semibold text-gray-500">Ism yoki yo&apos;nalish</span>
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Ism yoki yo'nalish" className="w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
        </label>
        <PlaceSelect
          region={region}
          district={district}
          onChange={(place) => {
            setRegion(place.region || "");
            setDistrict(place.district || "");
            apply({ region: place.region || "", district: place.district || "" });
          }}
          className="rounded-xl border px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--border)" }}
        />
        <button type="submit" className="w-full rounded-xl bg-[#0F172A] text-white text-sm font-semibold px-5 py-2.5">Izlash</button>
      <fieldset className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <legend className="text-sm font-semibold text-gray-900 px-1">Xizmat turi</legend>
      <div className="flex flex-col gap-2">
        <button type="button" onClick={() => { setCategory(""); apply({ category: "" }); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${!category ? "bg-[#00A86B] text-white" : "bg-white border text-gray-600"}`}>
          Barchasi
        </button>
        <label className="block border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold text-gray-900">Ijara xizmatlari</span>
        <select
          value={category === "rental" || RENTAL_CATEGORIES.some((item) => item.id === category) ? category : ""}
          onChange={(event) => { setCategory(event.target.value); apply({ category: event.target.value }); }}
          className="mt-2 w-full rounded-xl border bg-white px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--border)" }}
        >
          <option value="">Ijara turini tanlang</option>
          <option value="rental">Barchasi</option>
          {RENTAL_CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
        {SPECIALIST_CATEGORIES.filter((item) => item.group !== "rental").map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => { setCategory(item.id); apply({ category: item.id }); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${category === item.id ? "bg-[#00A86B] text-white" : "bg-white border text-gray-600"}`}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </div>
      </fieldset>

      </form>
      </Reveal>
      </aside>
      <section aria-label="Mutaxassislar ro'yxati" className="min-w-0">
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {results.map((item, index) => (
          <Reveal key={item.id} className="h-full" delay={(index % 3) * 80}>
            <SpecialistCard
              specialist={item}
              faved={isFavorite(favorites, { kind: "specialist", id: item.id })}
              onFav={() => toggleFavorite({ kind: "specialist", id: item.id })}
            />
          </Reveal>
        ))}
      </div>
      {results.length === 0 && (
        <div className="rounded-2xl border bg-white p-8 text-center" style={{ borderColor: "var(--border)" }}>
          <p className="font-semibold text-gray-900">Mutaxassislar topilmadi</p>
          <p className="mt-2 text-sm text-gray-500">Boshqa ism, hudud yoki xizmat turini tanlab ko&apos;ring.</p>
        </div>
      )}
      </section>
      </div>
    </div>
  );
}
