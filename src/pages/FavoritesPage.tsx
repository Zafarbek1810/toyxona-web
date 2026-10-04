import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { catalogApi, favoritesApi } from "../lib/api";
import { getToken } from "../lib/api/client";
import type { Product } from "../lib/api/types";
import { paths } from "../routes/paths";

export default function FavoritesPage() {
  const navigate = useAppNavigate();
  const { favIds, handleFav, handleCart } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (getToken()) {
          const favs = await favoritesApi.list();
          if (!cancelled) setProducts(favs.map((f) => f.product));
        } else if (favIds.length) {
          const all = await catalogApi.products({ limit: 100 });
          if (!cancelled) setProducts(all.filter((p) => favIds.includes(p.id)));
        } else if (!cancelled) {
          setProducts([]);
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
  }, [favIds]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>Sevimlilar</h1>
          <p className="text-sm text-gray-400 mt-0.5">{favIds.length} ta mahsulot</p>
        </div>
        {favIds.length > 0 && (
          <button onClick={() => navigate(paths.products)} className="text-sm text-[#00A86B] font-semibold hover:underline">
            + Mahsulot qo'shish
          </button>
        )}
      </div>
      {loading ? (
        <div className="text-center py-24 text-gray-400">Yuklanmoqda...</div>
      ) : favIds.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl mx-auto mb-4">❤️</div>
          <p className="font-semibold text-gray-700 mb-1">Sevimlilar ro'yxati bo'sh</p>
          <p className="text-sm text-gray-400 mb-5">Mahsulotni yoqtirganingizda yurak belgisini bosing</p>
          <button onClick={() => navigate(paths.products)} className="bg-[#00A86B] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#008F5A] transition-colors">
            Mahsulotlarni ko'rish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onFav={() => handleFav(p.id)}
              onCart={() => handleCart(p.id)}
              isFaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
