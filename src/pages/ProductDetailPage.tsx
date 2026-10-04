import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDateShort, formatPrice } from "../lib/format";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { useAppNavigate } from "../hooks/useAppNavigate";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { catalogApi } from "../lib/api";
import type { Product } from "../lib/api/types";
import { paths } from "../routes/paths";

type ProductReview = {
  id: number;
  rating: number;
  comment?: string;
  text?: string;
  authorName?: string;
  verifiedPurchase?: boolean;
  sellerReply?: string | null;
  date?: string;
  createdAt?: string;
};

type ReviewsPayload = {
  reviews: ProductReview[];
  histogram: Record<string, number>;
  average: number;
  count: number;
};

const TABS = [
  { id: "description", label: "Tavsif" },
  { id: "specs", label: "Xususiyatlar" },
  { id: "reviews", label: "Sharhlar" },
  { id: "delivery", label: "Yetkazib berish" },
  { id: "seller", label: "Sotuvchi" },
] as const;

function StarRow({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${size} ${i < Math.floor(rating) ? "text-[#F59E0B]" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const navigate = useAppNavigate();
  const { productId } = useParams();
  const { favIds, handleFav, handleCart, showToast } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [reviewsData, setReviewsData] = useState<ReviewsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("description");

  useDocumentTitle(product?.name || "Mahsulot");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setQty(1);
    setActiveTab("description");
    (async () => {
      try {
        const id = productId || "1";
        const [p, sim, rev] = await Promise.all([
          catalogApi.product(id),
          catalogApi.similar(id).catch(() => [] as Product[]),
          catalogApi.productReviews(id).catch(
            () =>
              ({
                reviews: [],
                histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                average: 0,
                count: 0,
              }) as ReviewsPayload,
          ),
        ]);
        if (cancelled) return;
        setProduct(p);
        setSimilar(sim);
        setReviewsData(rev as ReviewsPayload);
        setActiveImg(0);

        if (p.seller?.slug) {
          catalogApi
            .store(p.seller.slug)
            .then((data) => {
              if (!cancelled) {
                setSellerProducts(
                  (data.products || []).filter((sp) => sp.id !== p.id).slice(0, 4),
                );
              }
            })
            .catch(() => {
              if (!cancelled) setSellerProducts([]);
            });
        } else {
          setSellerProducts([]);
        }
      } catch {
        if (!cancelled) {
          setProduct(null);
          setSimilar([]);
          setReviewsData(null);
          setSellerProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">Yuklanmoqda...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Mahsulot topilmadi</p>
        <button onClick={() => navigate(paths.products)} className="text-[#00A86B] font-semibold">
          Katalogga qaytish
        </button>
      </div>
    );
  }

  const isFaved = favIds.includes(product.id);
  const imgs =
    product.images && product.images.length > 0
      ? product.images
      : [product.image || ""].filter(Boolean);
  const seller = product.seller;
  const stock = product.stock ?? 0;
  const maxQty = Math.max(1, stock || 1);
  const reviewCount = reviewsData?.count ?? product.reviewCount ?? 0;
  const rating = reviewsData?.average || product.rating || 0;
  const histogram = reviewsData?.histogram || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const reviews = reviewsData?.reviews || [];
  const delivery = seller?.delivery;

  const addToCart = () => {
    handleCart(product.id);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Havola nusxalandi");
      }
    } catch {
      /* user cancelled share */
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate(paths.home)} className="hover:text-[#00A86B]">
          Bosh sahifa
        </button>
        <span>/</span>
        <button onClick={() => navigate(paths.products)} className="hover:text-[#00A86B]">
          {product.category || "Mahsulotlar"}
        </button>
        <span>/</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <div
            className="relative bg-gray-50 rounded-3xl overflow-hidden mb-3"
            style={{ aspectRatio: "1/1" }}
          >
            {imgs[activeImg] ? (
              <img src={imgs[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">Rasm yo'q</div>
            )}
            {imgs.length > 0 && (
              <span className="absolute bottom-3 right-3 bg-black/55 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                {activeImg + 1}/{imgs.length}
              </span>
            )}
          </div>
          <div className="flex gap-3">
              {imgs.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`!w-[150px] !h-[150px] rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? "border-[#00A86B]" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="!w-full !h-[150px] object-cover rounded-2xl" />
                </button>
              ))}
            </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            {(product.discount || 0) > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                -{product.discount}%
              </span>
            )}
            <span className="text-xs text-gray-400">{product.views || 0} ko'rish</span>
            {stock > 0 ? (
              <span className="text-xs text-[#00A86B] font-medium">Mavjud</span>
            ) : (
              <span className="text-xs text-red-500 font-medium">Tugagan</span>
            )}
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-3" style={{ fontFamily: "var(--font-sans)" }}>
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <StarRow rating={rating} />
            <span className="text-sm font-semibold">{rating}</span>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className="text-sm text-gray-400 hover:text-[#00A86B]"
            >
              ({reviewCount} sharh)
            </button>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black text-[#00A86B] font-mono">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-lg text-gray-400 line-through font-mono">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {seller && (
            <div
              className="flex items-center gap-3 p-3 rounded-2xl border mb-4"
              style={{ borderColor: "var(--border)" }}
            >
              {seller.logo && (
                <img src={seller.logo} alt="" className="w-10 h-10 rounded-xl object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm truncate">{seller.name}</span>
                  {seller.verified && <span className="text-[#00A86B] text-xs">✓</span>}
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {seller.location || product.location || "O'zbekiston"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(paths.store(seller.slug))}
                className="border border-[#00A86B] text-[#00A86B] text-xs px-3 py-1.5 rounded-lg hover:bg-[#E8F8F1] shrink-0"
              >
                Do'konga o'tish
              </button>
            </div>
          )}

          <div
            className="rounded-2xl border p-4 mb-4 space-y-2 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--muted, #f9fafb)" }}
          >
            <div className="flex items-start gap-2 text-gray-600">
              <svg className="w-5 h-5 text-[#00A86B] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7h11v8H3V7zm11 2h4l3 3v3h-7V9zM6 18a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm10 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
              </svg>
              <div>
                <p className="font-medium text-gray-800">Yetkazib berish</p>
                <p className="text-xs text-gray-500">
                  {delivery?.deliveryTimeframe || "1–3 kun ichida"} ·{" "}
                  {product.location || seller?.location || "O'zbekiston bo'ylab"}
                </p>
              </div>
            </div>
            {delivery && (
              <p className="text-xs text-gray-500 pl-6">
                Minimal buyurtma: {formatPrice(delivery.minOrderAmount)}
                {delivery.freeDeliveryThreshold > 0 &&
                  ` · ${formatPrice(delivery.freeDeliveryThreshold)} dan bepul`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center border rounded-xl overflow-hidden"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-3 text-gray-500 hover:bg-gray-50"
              >
                −
              </button>
              <span className="px-4 font-mono font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(Math.min(maxQty, qty + 1))}
                className="px-4 py-3 text-gray-500 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">Omborda: {stock} ta</span>
          </div>

          <div className="flex gap-3 mb-3">
            <button
              type="button"
              disabled={stock <= 0}
              onClick={() => {
                addToCart();
                navigate(paths.cart);
              }}
              className="flex-1 bg-[#00A86B] hover:bg-[#008F5A] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold"
            >
              Savatga qo'shish
            </button>
            <button
              type="button"
              onClick={() => handleFav(product.id)}
              className={`w-14 rounded-xl border flex items-center justify-center ${
                isFaved ? "bg-red-50 border-red-200 text-red-500" : "text-gray-400"
              }`}
              style={{ borderColor: isFaved ? undefined : "var(--border)" }}
              aria-label="Sevimlilarga"
            >
              <svg
                className="w-6 h-6"
                fill={isFaved ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              type="button"
              disabled={stock <= 0}
              onClick={() => {
                addToCart();
                navigate(paths.cart);
              }}
              className="flex-1 border-2 border-[#00A86B] text-[#00A86B] hover:bg-[#E8F8F1] disabled:opacity-50 py-3 rounded-xl font-semibold"
            >
              Sotib olish
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-4 rounded-xl border text-gray-500 hover:bg-gray-50 text-sm font-medium"
              style={{ borderColor: "var(--border)" }}
            >
              Ulashish
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  activeTab === t.id ? "bg-[#E8F8F1] text-[#00A86B]" : "text-gray-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div
            className="bg-white rounded-2xl border p-5 text-sm text-gray-600 leading-relaxed"
            style={{ borderColor: "var(--border)" }}
          >
            {activeTab === "description" && (
              <p className="whitespace-pre-line">{product.description || "Tavsif mavjud emas."}</p>
            )}

            {activeTab === "specs" && (
              <div className="space-y-2">
                {Object.keys(product.specs || {}).length === 0 ? (
                  <p className="text-gray-400">Xususiyatlar ko'rsatilmagan</p>
                ) : (
                  Object.entries(product.specs || {}).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between border-b py-2"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span className="text-gray-400">{k}</span>
                      <span className="font-medium text-gray-800 text-right ml-4">{v}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-5">
                <div className="flex gap-6 flex-col sm:flex-row">
                  <div className="text-center shrink-0 sm:pr-4">
                    <p className="text-4xl font-black text-gray-900 font-mono">{rating.toFixed(1)}</p>
                    <div className="flex justify-center my-2">
                      <StarRow rating={rating} size="w-5 h-5" />
                    </div>
                    <p className="text-xs text-gray-400">{reviewCount} ta sharh</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = histogram[String(stars)] || histogram[stars as unknown as string] || 0;
                      const pct = reviewCount ? Math.round((Number(count) / reviewCount) * 100) : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-3">{stars}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-8">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Hali sharhlar yo'q</p>
                ) : (
                  <div className="space-y-3 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                    {reviews.map((r) => {
                      const name = r.authorName || "Mijoz";
                      const text = r.comment || r.text || "";
                      return (
                        <div key={r.id} className="py-3 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-xl bg-[#00A86B] flex items-center justify-center text-white font-bold text-xs">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-sm text-gray-900">{name}</span>
                            <StarRow rating={r.rating} size="w-3 h-3" />
                            {r.verifiedPurchase && (
                              <span className="text-[10px] text-[#00A86B] bg-[#E8F8F1] px-1.5 py-0.5 rounded">
                                Tasdiqlangan
                              </span>
                            )}
                            <span className="text-xs text-gray-400 ml-auto">
                              {formatDateShort(r.date || r.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed pl-10">{text}</p>
                          {r.sellerReply && (
                            <div className="mt-2 ml-10 bg-[#E8F8F1] rounded-xl p-3 border-l-2 border-[#00A86B]">
                              <p className="text-xs font-bold text-[#00A86B] mb-1">Sotuvchi javobi:</p>
                              <p className="text-xs text-gray-600">{r.sellerReply}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-3">
                <p>
                  Buyurtmangiz {delivery?.deliveryTimeframe || "1–3 ish kuni"} ichida{" "}
                  {product.location || seller?.location || "belgilangan manzilga"} yetkaziladi.
                </p>
                {delivery ? (
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between border-b py-2" style={{ borderColor: "var(--border)" }}>
                      <span className="text-gray-400">Minimal buyurtma</span>
                      <span className="font-medium text-gray-800">{formatPrice(delivery.minOrderAmount)}</span>
                    </li>
                    <li className="flex justify-between border-b py-2" style={{ borderColor: "var(--border)" }}>
                      <span className="text-gray-400">Muddat</span>
                      <span className="font-medium text-gray-800">{delivery.deliveryTimeframe}</span>
                    </li>
                    <li className="flex justify-between py-2">
                      <span className="text-gray-400">Bepul yetkazib berish</span>
                      <span className="font-medium text-gray-800">
                        {delivery.freeDeliveryThreshold > 0
                          ? `${formatPrice(delivery.freeDeliveryThreshold)} dan`
                          : "Mavjud emas"}
                      </span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-gray-400">Yetkazib berish tafsilotlari sotuvchi sozlamalariga qarab belgilanadi.</p>
                )}
              </div>
            )}

            {activeTab === "seller" && seller && (
              <div>
                <div className="flex items-start gap-3 mb-3">
                  {seller.logo && (
                    <img src={seller.logo} alt="" className="w-14 h-14 rounded-2xl object-cover" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{seller.name}</span>
                      {seller.verified && (
                        <span className="text-xs bg-[#E8F8F1] text-[#00A86B] px-2 py-0.5 rounded-lg font-medium">
                          Tasdiqlangan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      ⭐ {seller.rating || 0} · {seller.reviewCount || 0} sharh ·{" "}
                      {seller.productCount || sellerProducts.length + 1} mahsulot
                    </p>
                    <p className="text-xs text-gray-400">📍 {seller.location}</p>
                    {seller.workingHours && (
                      <p className="text-xs text-gray-400">🕒 {seller.workingHours}</p>
                    )}
                  </div>
                </div>
                {seller.description && <p className="text-sm text-gray-600 mb-3">{seller.description}</p>}
                <button
                  type="button"
                  onClick={() => navigate(paths.store(seller.slug))}
                  className="mt-3 bg-[#00A86B] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#008F5A]"
                >
                  Do'konga o'tish
                </button>
              </div>
            )}

            {activeTab === "seller" && !seller && (
              <p className="text-gray-400">Sotuvchi ma'lumoti mavjud emas</p>
            )}
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-black mb-4" style={{ fontFamily: "var(--font-sans)" }}>
            O'xshash mahsulotlar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.slice(0, 4).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onFav={() => handleFav(p.id)}
                onCart={() => handleCart(p.id)}
                isFaved={favIds.includes(p.id)}
              />
            ))}
          </div>
        </section>
      )}

      {sellerProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black" style={{ fontFamily: "var(--font-sans)" }}>
              Sotuvchining boshqa mahsulotlari
            </h2>
            {seller && (
              <button
                type="button"
                onClick={() => navigate(paths.store(seller.slug))}
                className="text-sm text-[#00A86B] font-semibold hover:underline"
              >
                Barchasi
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sellerProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onFav={() => handleFav(p.id)}
                onCart={() => handleCart(p.id)}
                isFaved={favIds.includes(p.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
