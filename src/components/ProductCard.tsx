import { formatPrice } from "../lib/format";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { paths } from "../routes/paths";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number | null;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  image?: string | null;
  seller?: { name: string; verified?: boolean } | null;
  location?: string | null;
  stock?: number;
}

interface Props {
  product: Product;
  onFav?: () => void;
  onCart?: () => void;
  isFaved?: boolean;
}

export default function ProductCard({ product, onFav, onCart, isFaved }: Props) {
  const navigate = useAppNavigate();
  const discount = product.discount || 0;
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;
  const stock = product.stock ?? 0;
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
      style={{ borderColor: "var(--border)" }}
      onClick={() => navigate(paths.product(product.id))}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "1/1" }}>
        <img
          src={product.image || ""}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
            -{discount}%
          </span>
        )}
        <button
          onClick={e => { e.stopPropagation(); onFav?.(); }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            isFaved ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:bg-red-50 hover:text-red-500"
          } shadow-sm`}
        >
          <svg className="w-4 h-4" fill={isFaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {stock > 0 && stock <= 5 && (
          <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Oz qoldi: {stock} ta
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Seller */}
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-xs text-gray-500 truncate">{product.seller?.name || "Sotuvchi"}</span>
          {product.seller?.verified && (
            <svg className="w-3.5 h-3.5 text-[#00A86B] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "text-[#F59E0B]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-bold text-[#00A86B] text-base" style={{ fontFamily: "var(--font-mono)" }}>
            {formatPrice(product.price)}
          </span>
        </div>
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
        )}

        {/* Location */}
        <div className="flex items-center gap-1 mt-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
          <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="text-xs text-gray-400 truncate">{product.location || ""}</span>
          <button
            onClick={e => { e.stopPropagation(); onCart?.(); }}
            className="ml-auto bg-[#00A86B] hover:bg-[#008F5A] text-white text-xs px-3 py-1 rounded-lg font-medium shrink-0"
          >
            Savatga
          </button>
        </div>
      </div>
    </div>
  );
}
