import { useEffect, useState } from "react";
import { formatPrice } from "../lib/format";
import { useAppContext } from "../context/AppContext";
import { useAppNavigate } from "../hooks/useAppNavigate";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { cartApi, catalogApi, ordersApi } from "../lib/api";
import { getToken } from "../lib/api/client";
import type { Product } from "../lib/api/types";
import { paths } from "../routes/paths";

type CartLine = { product: Product; quantity: number; productId: number };

export default function CartCheckoutPage() {
  const navigate = useAppNavigate();
  const { cartIds, handleRemoveCart, user, refreshCartFav, showToast } = useAppContext();
  const [mode, setMode] = useState<"cart" | "checkout">("cart");
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("payme");
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discountPct, setDiscountPct] = useState(0);

  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [region, setRegion] = useState("Toshkent shahri");
  const [address, setAddress] = useState("");

  const [regions, setRegions] = useState<string[]>([]);

  useDocumentTitle(mode === "checkout" ? "Buyurtma berish" : "Savatcha");

  useEffect(() => {
    if (user) {
      setRecipientName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
      setRecipientPhone(user.phone || "");
      setRegion(user.city || "Toshkent shahri");
    }
  }, [user]);

  useEffect(() => {
    catalogApi.regions().then((list) => {
      setRegions(list);
      if (list.length && !list.includes(region)) setRegion(list[0]);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (getToken()) {
          const cart = await cartApi.get();
          if (!cancelled) {
            setLines(
              cart.items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                product: i.product,
              })),
            );
          }
        } else if (cartIds.length) {
          const all = await catalogApi.products({ limit: 100 });
          if (!cancelled) {
            setLines(
              all
                .filter((p) => cartIds.includes(p.id))
                .map((p) => ({ productId: p.id, quantity: 1, product: p })),
            );
          }
        } else if (!cancelled) {
          setLines([]);
        }
      } catch {
        if (!cancelled) setLines([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cartIds]);

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);
  const delivery = deliveryMethod === "express" ? 50000 : deliveryMethod === "pickup" ? 0 : 25000;
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const total = subtotal - discountAmount + delivery;

  const applyPromo = async () => {
    try {
      const res = await cartApi.promo(promoCode);
      setDiscountPct(res.discountPct);
      showToast(`${res.title}: -${res.discountPct}%`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Promo kod yaroqsiz", "error");
    }
  };

  const placeOrder = async () => {
    if (!getToken()) {
      showToast("Buyurtma uchun avval tizimga kiring", "error");
      navigate(paths.auth);
      return;
    }
    if (!recipientName.trim() || !recipientPhone.trim() || !address.trim()) {
      showToast("Manzil ma'lumotlarini to'ldiring", "error");
      setCheckoutStep(1);
      return;
    }
    setSubmitting(true);
    try {
      const orders = await ordersApi.create({
        fromCart: true,
        recipientName: recipientName.trim(),
        recipientPhone,
        region,
        address: address.trim(),
        deliveryMethod,
        paymentMethod,
        promoCode: promoCode || undefined,
      });
      setOrderNumber(orders[0]?.orderNumber || "");
      await refreshCartFav();
      setCheckoutStep(4);
      showToast("Buyurtma qabul qilindi");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Buyurtma yaratilmadi", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const onNext = () => {
    if (checkoutStep === 3) {
      void placeOrder();
      return;
    }
    setCheckoutStep((s) => s + 1);
  };

  if (mode === "cart") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "var(--font-sans)" }}>
          Savatcha {lines.length > 0 && <span className="text-gray-400 font-normal text-lg">({lines.length} ta mahsulot)</span>}
        </h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Yuklanmoqda...</div>
        ) : lines.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Savatcha bo'sh</h2>
            <p className="text-gray-500 mb-6">Mahsulotlarni savatga qo'shing</p>
            <button onClick={() => navigate(paths.products)} className="bg-[#00A86B] text-white px-6 py-3 rounded-xl font-semibold">
              Xarid qilish
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {lines.map((l) => (
                <div key={l.productId} className="bg-white rounded-2xl border p-4 flex gap-4" style={{ borderColor: "var(--border)" }}>
                  <img src={l.product.image || ""} alt={l.product.name} className="w-20 h-20 rounded-xl object-cover bg-gray-50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{l.product.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">{l.product.seller?.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">× {l.quantity}</span>
                      <span className="font-bold text-[#00A86B] font-mono text-sm">{formatPrice(l.product.price * l.quantity)}</span>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveCart(l.productId)} className="text-gray-300 hover:text-red-400 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div className="bg-white rounded-2xl border p-5 sticky top-24" style={{ borderColor: "var(--border)" }}>
                <h2 className="font-bold text-gray-900 mb-4">Buyurtma xulosasi</h2>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mahsulotlar ({lines.length} ta)</span>
                    <span className="font-mono">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Yetkazib berish</span>
                    <span className="font-mono">{formatPrice(25000)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base" style={{ borderColor: "var(--border)" }}>
                    <span>Jami</span>
                    <span className="text-[#00A86B] font-mono">{formatPrice(subtotal + 25000)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo-kod"
                    className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00A86B]"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <button onClick={() => void applyPromo()} className="border border-[#00A86B] text-[#00A86B] px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-[#E8F8F1]">
                    Qo'llash
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (!getToken()) {
                      showToast("Buyurtma uchun tizimga kiring", "error");
                      navigate(paths.auth);
                      return;
                    }
                    setMode("checkout");
                  }}
                  className="w-full bg-[#00A86B] hover:bg-[#008F5A] text-white font-bold py-3.5 rounded-xl"
                >
                  Buyurtma berish →
                </button>
                <button onClick={() => navigate(paths.products)} className="w-full text-center text-sm text-gray-500 mt-3 hover:text-gray-700">
                  ← Xaridni davom ettirish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const steps = ["Manzil", "Yetkazish", "To'lov", "Tasdiqlash"];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => setMode("cart")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
        ← Savatga qaytish
      </button>

      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${i + 1 <= checkoutStep ? "text-[#00A86B]" : "text-gray-400"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i + 1 < checkoutStep ? "bg-green-500 text-white" : i + 1 === checkoutStep ? "bg-[#00A86B] text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {i + 1 < checkoutStep ? "✓" : i + 1}
              </div>
              <span className="text-sm font-medium hidden md:block">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i + 1 < checkoutStep ? "bg-green-500" : "bg-gray-200"}`}></div>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {checkoutStep === 1 && (
            <div className="bg-white rounded-3xl border p-6" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-black text-lg text-gray-900 mb-5" style={{ fontFamily: "var(--font-sans)" }}>Yetkazish manzili</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">To'liq ism</label>
                  <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00A86B]" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Telefon</label>
                  <input value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00A86B]" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Viloyat</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00A86B]" style={{ borderColor: "var(--border)" }}>
                    {regions.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">To'liq manzil</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00A86B]" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>
          )}

          {checkoutStep === 2 && (
            <div className="bg-white rounded-3xl border p-6" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-black text-lg text-gray-900 mb-5" style={{ fontFamily: "var(--font-sans)" }}>Yetkazish usuli</h2>
              <div className="space-y-3">
                {[
                  { id: "standard", icon: "🚚", name: "Standart yetkazish", desc: "2-3 ish kuni", price: "25,000 so'm" },
                  { id: "express", icon: "⚡", name: "Tezkor yetkazish", desc: "Bugun 2-4 soat", price: "50,000 so'm" },
                  { id: "pickup", icon: "🏪", name: "O'zim olib ketaman", desc: "Do'kondan", price: "Bepul" },
                ].map((opt) => (
                  <label key={opt.id} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${deliveryMethod === opt.id ? "border-[#00A86B] bg-[#E8F8F1]" : "hover:border-[#00A86B]"}`} style={deliveryMethod !== opt.id ? { borderColor: "var(--border)" } : {}}>
                    <input type="radio" name="delivery" value={opt.id} checked={deliveryMethod === opt.id} onChange={() => setDeliveryMethod(opt.id)} className="accent-[#00A86B]" />
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{opt.name}</p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </div>
                    <span className="font-bold text-sm text-[#00A86B]">{opt.price}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {checkoutStep === 3 && (
            <div className="bg-white rounded-3xl border p-6" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-black text-lg text-gray-900 mb-5" style={{ fontFamily: "var(--font-sans)" }}>To'lov usuli</h2>
              <div className="space-y-3">
                {[
                  { id: "payme", name: "Payme", icon: "💳", desc: "Payme orqali to'lov" },
                  { id: "click", name: "Click", icon: "📱", desc: "Click orqali to'lov" },
                  { id: "uzum", name: "Uzum Bank", icon: "🏦", desc: "Uzum Bank orqali" },
                  { id: "card", name: "Bank kartasi", icon: "💰", desc: "Visa/MasterCard" },
                ].map((m) => (
                  <label key={m.id} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === m.id ? "border-[#00A86B] bg-[#E8F8F1]" : "hover:border-gray-300"}`} style={paymentMethod !== m.id ? { borderColor: "var(--border)" } : {}}>
                    <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} className="accent-[#00A86B]" />
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {checkoutStep === 4 && (
            <div className="bg-white rounded-3xl border p-6 text-center" style={{ borderColor: "var(--border)" }}>
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
              <h2 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "var(--font-sans)" }}>Buyurtma tasdiqlandi!</h2>
              <p className="text-gray-500 mb-1">Buyurtma ID: <span className="font-mono font-bold">{orderNumber || "—"}</span></p>
              <p className="text-sm text-gray-400 mb-6">Buyurtmangiz holati haqida SMS orqali xabar beramiz</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate(paths.account.orders)} className="bg-[#00A86B] text-white px-5 py-2.5 rounded-xl font-semibold text-sm">
                  Buyurtmalarni ko'rish
                </button>
                <button onClick={() => navigate(paths.home)} className="border text-gray-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50" style={{ borderColor: "var(--border)" }}>
                  Bosh sahifa
                </button>
              </div>
            </div>
          )}

          {checkoutStep < 4 && (
            <button disabled={submitting} onClick={onNext} className="mt-4 w-full bg-[#00A86B] hover:bg-[#008F5A] text-white font-bold py-3.5 rounded-xl disabled:opacity-60">
              {submitting ? "Yuborilmoqda..." : checkoutStep === 3 ? "To'lovni amalga oshirish" : "Davom etish →"}
            </button>
          )}
        </div>

        <div>
          <div className="bg-white rounded-2xl border p-5 sticky top-24" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-bold mb-4 text-gray-900">Xulosa</h3>
            {lines.map((l) => (
              <div key={l.productId} className="flex gap-3 mb-3">
                <img src={l.product.image || ""} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-50 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 line-clamp-2">{l.product.name}</p>
                  <p className="text-xs text-[#00A86B] font-mono font-bold mt-0.5">{formatPrice(l.product.price * l.quantity)}</p>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 mt-3 space-y-1.5 text-sm" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between text-gray-500"><span>Mahsulotlar</span><span className="font-mono">{formatPrice(subtotal)}</span></div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600"><span>Chegirma</span><span className="font-mono">-{formatPrice(discountAmount)}</span></div>
              )}
              <div className="flex justify-between text-gray-500"><span>Yetkazish</span><span className="font-mono">{formatPrice(delivery)}</span></div>
              <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                <span>Jami</span><span className="text-[#00A86B] font-mono">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
