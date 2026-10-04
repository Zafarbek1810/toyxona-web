import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { catalogApi } from "../lib/api";
import type { Product, Seller } from "../lib/api/types";

export default function SellerStorePage() {
  const { storeSlug = "techplus" } = useParams();
  const { favIds, handleFav, handleCart } = useAppContext();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useDocumentTitle(seller?.name || "Do'kon");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const data = await catalogApi.store(storeSlug, tab === "all" ? undefined : tab);
        if (!cancelled) {
          setSeller(data.store);
          setProducts(data.products);
        }
      } catch {
        if (!cancelled) {
          setSeller(null);
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storeSlug, tab]);

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Yuklanmoqda...</div>;
  }

  if (!seller) {
    return <div className="py-20 text-center text-gray-500">Do'kon topilmadi</div>;
  }

  const joined = seller.joined || seller.createdAt
    ? new Date(seller.joined || seller.createdAt || "").toLocaleDateString("uz-UZ")
    : "—";

  return (
    <div>
      <div className="bg-gradient-to-r from-[#00A86B] to-[#1e4a8a] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-start gap-5">
            {seller.logo && (
              <img src={seller.logo} alt={seller.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-sans)" }}>{seller.name}</h1>
                {seller.verified && (
                  <svg className="w-6 h-6 text-[#F59E0B]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-semibold">
                  {seller.subscription}
                </span>
              </div>
              <p className="text-white/70 text-sm mb-3">{seller.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {seller.rating || 0} ({seller.reviewCount || 0} sharh)
                </span>
                <span>📦 {seller.productCount || products.length} mahsulot</span>
                <span>📍 {seller.location}</span>
                <span>📅 {joined} dan beri</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit" style={{ background: "var(--muted)" }}>
          {[
            { id: "all", label: "Barcha mahsulotlar" },
            { id: "popular", label: "Mashhur" },
            { id: "new", label: "Yangi" },
            { id: "sale", label: "Aksiyada" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t.id ? "bg-white text-[#00A86B] shadow-sm" : "text-gray-500"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onFav={() => handleFav(p.id)}
              onCart={() => handleCart(p.id)}
              isFaved={favIds.includes(p.id)}
            />
          ))}
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-bold text-gray-900 mb-3">Biznes haqida</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{seller.description}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ish vaqti</span>
                <span className="font-medium">{seller.workingHours || "09:00 - 18:00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Telefon</span>
                <span className="font-medium">{seller.phone || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
