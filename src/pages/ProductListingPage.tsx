import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { catalogApi } from "../lib/api";
import type { Category, Product } from "../lib/api/types";
import { paths } from "../routes/paths";

export default function ProductListingPage() {
  const navigate = useAppNavigate();
  const [searchParams] = useSearchParams();
  const { favIds, handleFav, handleCart } = useAppContext();
  const [sortBy, setSortBy] = useState("newest");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedCat, setSelectedCat] = useState<number | null>(
    searchParams.get("category") ? Number(searchParams.get("category")) : null,
  );
  const [minRating, setMinRating] = useState<number | null>(null);
  const [onSale, setOnSale] = useState(false);
  const [verifiedSeller, setVerifiedSeller] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState<Record<string, boolean>>({
    category: true, price: true, rating: true, location: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const toggleFilter = (key: string) => setFiltersOpen(p => ({ ...p, [key]: !p[key] }));

  useEffect(() => {
    catalogApi.categories().then(setCategories).catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const list = await catalogApi.products({
          category: selectedCat ?? undefined,
          minPrice: priceMin || undefined,
          maxPrice: priceMax || undefined,
          minRating: minRating ?? undefined,
          onSale: onSale || undefined,
          verifiedSeller: verifiedSeller || undefined,
          sort: sortBy,
          q: searchParams.get("q") || undefined,
          limit: 48,
        });
        if (!cancelled) {
          setProducts(list);
          setTotal(list.length);
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedCat, priceMin, priceMax, minRating, onSale, verifiedSeller, sortBy, searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button onClick={() => navigate(paths.home)} className="hover:text-[#00A86B]">Bosh sahifa</button>
        <span>/</span>
        <span className="text-gray-900">Barcha mahsulotlar</span>
      </nav>

      <div className="flex gap-6">
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <span className="font-semibold text-sm">Filtrlar</span>
              <button
                className="text-xs text-[#00A86B] font-medium"
                onClick={() => {
                  setSelectedCat(null);
                  setPriceMin("");
                  setPriceMax("");
                  setMinRating(null);
                  setOnSale(false);
                  setVerifiedSeller(false);
                }}
              >
                Tozalash
              </button>
            </div>

            <div className="border-b" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => toggleFilter("category")} className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-gray-800">
                Kategoriya
                <svg className={`w-4 h-4 transition-transform ${filtersOpen.category ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {filtersOpen.category && (
                <div className="px-4 pb-3 space-y-1">
                  {categories.slice(0, 12).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
                      className={`flex items-center justify-between w-full py-1 text-sm ${selectedCat === cat.id ? "text-[#00A86B] font-semibold" : "text-gray-600 hover:text-gray-900"}`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-gray-400">{(cat.count ?? 0).toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => toggleFilter("price")} className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-gray-800">
                Narx (so'm)
                <svg className={`w-4 h-4 transition-transform ${filtersOpen.price ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {filtersOpen.price && (
                <div className="px-4 pb-3 flex gap-2">
                  <input value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="Min" className="w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#00A86B]" style={{ borderColor: "var(--border)" }} />
                  <input value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Max" className="w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#00A86B]" style={{ borderColor: "var(--border)" }} />
                </div>
              )}
            </div>

            <div className="border-b" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => toggleFilter("rating")} className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-gray-800">
                Baho
                <svg className={`w-4 h-4 transition-transform ${filtersOpen.rating ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {filtersOpen.rating && (
                <div className="px-4 pb-3 space-y-1">
                  {[5, 4, 3].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(minRating === r ? null : r)}
                      className={`flex items-center gap-2 w-full py-1 text-sm ${minRating === r ? "text-[#00A86B]" : "text-gray-600"}`}
                    >
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className={`w-3.5 h-3.5 ${i < r ? "text-[#F59E0B]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs">va undan yuqori</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={onSale} onChange={e => setOnSale(e.target.checked)} className="w-4 h-4 rounded accent-[#00A86B]" />
                <span className="text-sm text-gray-700">Faqat aksiyali</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" checked={verifiedSeller} onChange={e => setVerifiedSeller(e.target.checked)} className="w-4 h-4 rounded accent-[#00A86B]" />
                <span className="text-sm text-gray-700">Tasdiqlangan sotuvchi</span>
              </label>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 bg-white rounded-2xl border px-4 py-3" style={{ borderColor: "var(--border)" }}>
            <span className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{total}</span> ta mahsulot topildi
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-[#00A86B]"
              style={{ borderColor: "var(--border)" }}
            >
              <option value="newest">Yangilar avval</option>
              <option value="price-asc">Arzon narxdan</option>
              <option value="price-desc">Qimmat narxdan</option>
              <option value="rating">Baholangan</option>
              <option value="popular">Mashhur</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Yuklanmoqda...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Mahsulot topilmadi</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onFav={() => handleFav(p.id)}
                  onCart={() => handleCart(p.id)}
                  isFaved={favIds.includes(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
