import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { formatPrice, formatDateShort, getStatusColor } from "../lib/format";
import ProductCard from "../components/ProductCard";
import Modal, { FormField, inputClass } from "../components/Modal";
import { useAppContext } from "../context/AppContext";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { favoritesApi, ordersApi, usersApi, addressesApi, notificationsApi, catalogApi } from "../lib/api";
import type { Order as ApiOrder, Product, Address, Notification, CustomerSettings } from "../lib/api/types";
import { accountSectionPaths, getAccountSection, paths } from "../routes/paths";

type OrderItem = ApiOrder;

const navItems = [
  { id: "overview", label: "Umumiy ko'rinish", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
  { id: "orders", label: "Buyurtmalarim", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { id: "favorites", label: "Sevimlilar", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { id: "profile", label: "Profil", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { id: "addresses", label: "Manzillar", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
  { id: "notifications", label: "Bildirishnomalar", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
  { id: "settings", label: "Sozlamalar", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

function AccountOverview() {
  const navigate = useAppNavigate();
  const { favIds, user } = useAppContext();
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    ordersApi.list().then(setOrders).catch(() => setOrders([]));
  }, []);

  const active = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
  const done = orders.filter((o) => o.status === "delivered").length;
  const name = user ? `${user.firstName}` : "Xaridor";

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>
        Salom, {name}! 👋
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Jami buyurtmalar", value: orders.length, icon: "📦", color: "bg-blue-50 text-blue-600" },
          { label: "Faol buyurtmalar", value: active, icon: "🚚", color: "bg-orange-50 text-orange-600" },
          { label: "Bajarilgan", value: done, icon: "✅", color: "bg-green-50 text-green-600" },
          { label: "Sevimlilar", value: favIds.length, icon: "❤️", color: "bg-red-50 text-red-600" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl p-4 ${stat.color.split(" ")[0]}`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-black text-gray-900 font-mono">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border" style={{ borderColor: "var(--border)" }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-bold text-gray-900">So'nggi buyurtmalar</h2>
          <button onClick={() => navigate(paths.account.orders)} className="text-xs text-[#00A86B] hover:underline">
            Barchasini ko'rish
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="px-5 py-4 flex items-center gap-4">
              <img
                src={order.product?.image || order.items?.[0]?.image || ""}
                alt=""
                className="w-12 h-12 rounded-xl object-cover bg-gray-50"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {order.product?.name || order.items?.[0]?.name}
                </p>
                <p className="text-xs text-gray-400">
                  {order.orderNumber} · {order.date ? new Date(order.date).toLocaleDateString("uz-UZ") : ""}
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.statusLabel || order.status)}`}>
                {order.statusLabel || order.status}
              </span>
              <span className="font-mono font-bold text-sm text-[#00A86B]">{formatPrice(order.total || order.price || 0)}</span>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">Hali buyurtma yo'q</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`${star} yulduz`}
        >
          <svg
            className={`w-7 h-7 ${star <= value ? "text-amber-400" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function AccountOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [viewOrder, setViewOrder] = useState<OrderItem | null>(null);
  const [reviewOrder, setReviewOrder] = useState<OrderItem | null>(null);
  const [reviewedIds, setReviewedIds] = useState<number[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    ordersApi.list().then((list) => {
      setOrders(list);
      setReviewedIds(list.filter((o) => o.reviewed).map((o) => o.id));
    }).catch(() => setOrders([]));
  }, []);

  const openReview = (order: OrderItem) => {
    setReviewOrder(order);
    setRating(5);
    setComment("");
    setReviewError("");
    setReviewSuccess(false);
  };

  const closeReview = () => {
    setReviewOrder(null);
    setRating(5);
    setComment("");
    setReviewError("");
    setReviewSuccess(false);
  };

  const handleSubmitReview = async () => {
    if (!reviewOrder) return;
    if (rating < 1) {
      setReviewError("Reyting tanlang");
      return;
    }
    if (!comment.trim()) {
      setReviewError("Sharh matnini yozing");
      return;
    }

    try {
      await ordersApi.review(reviewOrder.id, { rating, comment: comment.trim() });
      setReviewedIds((prev) => [...prev, reviewOrder.id]);
      setReviewSuccess(true);
      setReviewError("");
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Xatolik");
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border" style={{ borderColor: "var(--border)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-bold text-gray-900">Buyurtmalarim</h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {orders.map((order) => {
            const hasReview = reviewedIds.includes(order.id) || order.reviewed;
            const img = order.product?.image || order.items?.[0]?.image || "";
            const name = order.product?.name || order.items?.[0]?.name || "Mahsulot";
            return (
              <div key={order.id} className="p-5 flex items-start gap-4">
                <img src={img} alt="" className="w-16 h-16 rounded-xl object-cover bg-gray-50 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900 line-clamp-1">{name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.seller?.name} ·{" "}
                        {order.date ? new Date(order.date).toLocaleDateString("uz-UZ") : ""}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.orderNumber}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${getStatusColor(order.statusLabel || order.status)}`}
                    >
                      {order.statusLabel || order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="font-mono font-bold text-sm text-[#00A86B]">
                      {formatPrice(order.total || order.price || 0)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewOrder(order)}
                      className="text-xs text-[#00A86B] font-medium hover:underline"
                    >
                      Batafsil
                    </button>
                    {order.status === "delivered" && !hasReview && (
                      <button
                        type="button"
                        onClick={() => openReview(order)}
                        className="text-xs text-amber-600 font-medium hover:underline"
                      >
                        Baholash
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {orders.length === 0 && (
            <p className="p-8 text-center text-sm text-gray-400">Buyurtmalar yo'q</p>
          )}
        </div>
      </div>

      <Modal open={!!viewOrder} onClose={() => setViewOrder(null)} title="Buyurtma tafsiloti">
        {viewOrder && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-400">Raqam:</span> {viewOrder.orderNumber}
            </p>
            <p>
              <span className="text-gray-400">Holat:</span> {viewOrder.statusLabel || viewOrder.status}
            </p>
            <p>
              <span className="text-gray-400">Manzil:</span> {viewOrder.address}
            </p>
            <p>
              <span className="text-gray-400">To'lov:</span> {viewOrder.paymentMethod}
            </p>
            <p className="font-mono font-bold text-[#00A86B]">{formatPrice(viewOrder.total)}</p>
          </div>
        )}
      </Modal>

      <Modal open={!!reviewOrder} onClose={closeReview} title="Mahsulotni baholash">
        {reviewOrder && (
          <div className="space-y-4">
            <StarRating value={rating} onChange={setRating} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Sharhingiz..."
              className={inputClass()}
              style={{ borderColor: "var(--border)" }}
            />
            {reviewError && <p className="text-sm text-red-500">{reviewError}</p>}
            {reviewSuccess && <p className="text-sm text-green-600">Sharh yuborildi!</p>}
            <button
              type="button"
              onClick={() => void handleSubmitReview()}
              className="w-full bg-[#00A86B] text-white py-2.5 rounded-xl font-semibold text-sm"
            >
              Yuborish
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}

function AccountFavorites() {
  const navigate = useAppNavigate();
  const { favIds, handleFav, handleCart } = useAppContext();
  const [favProducts, setFavProducts] = useState<Product[]>([]);

  useEffect(() => {
    favoritesApi
      .list()
      .then((list) => setFavProducts(list.map((f) => f.product)))
      .catch(() => setFavProducts([]));
  }, [favIds]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-black text-lg text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>Sevimli mahsulotlar</h2>
          <p className="text-sm text-gray-400 mt-0.5">{favProducts.length} ta mahsulot</p>
        </div>
        {favProducts.length > 0 && (
          <button onClick={() => navigate(paths.products)} className="text-sm text-[#00A86B] font-semibold hover:underline">
            + Mahsulot qo'shish
          </button>
        )}
      </div>
      {favProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl mx-auto mb-4">❤️</div>
          <p className="font-semibold text-gray-700 mb-1">Sevimlilar ro'yxati bo'sh</p>
          <p className="text-sm text-gray-400 mb-5">Mahsulotni yoqtirganingizda yurak belgisini bosing</p>
          <button onClick={() => navigate(paths.products)} className="bg-[#00A86B] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#008F5A] transition-colors">
            Mahsulotlarni ko'rish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {favProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onFav={() => handleFav(p.id)}
              onCart={() => handleCart(p.id)}
              isFaved
            />
          ))}
        </div>
      )}
    </div>
  );
}

type ProfileForm = {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  city: string;
};

function profileFromUser(user: {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  birthDate?: string | null;
  city?: string | null;
}): ProfileForm {
  return {
    name: `${user.firstName} ${user.lastName}`.trim(),
    phone: user.phone || "",
    email: user.email || "",
    birthDate: user.birthDate || "",
    city: user.city || "",
  };
}

function splitName(name: string) {
  const trimmed = name.trim();
  const space = trimmed.indexOf(" ");
  if (space === -1) return { firstName: trimmed, lastName: trimmed };
  return {
    firstName: trimmed.slice(0, space).trim(),
    lastName: trimmed.slice(space + 1).trim() || trimmed.slice(0, space).trim(),
  };
}

function AccountProfile() {
  const { user, refreshUser, showToast } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    phone: "",
    email: "",
    birthDate: "",
    city: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const profile = user ? profileFromUser(user) : null;
  const memberYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : null;

  const startEdit = () => {
    if (!profile) return;
    setForm(profile);
    setErrors({});
    setSaved(false);
    setEditing(true);
  };

  const cancelEdit = () => {
    if (profile) setForm(profile);
    setErrors({});
    setEditing(false);
  };

  const handleSave = async () => {
    const nextErrors: Partial<Record<keyof ProfileForm, string>> = {};
    if (!form.name.trim()) nextErrors.name = "Ism kiritilishi shart";
    if (!form.phone.trim()) nextErrors.phone = "Telefon kiritilishi shart";
    if (!form.email.trim()) nextErrors.email = "Email kiritilishi shart";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "To'g'ri email kiriting";
    if (!form.city.trim()) nextErrors.city = "Shahar kiritilishi shart";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const { firstName, lastName } = splitName(form.name);
    setSaving(true);
    try {
      await usersApi.updateMe({
        firstName,
        lastName,
        phone: form.phone.trim(),
        email: form.email.trim(),
        birthDate: form.birthDate.trim() || null,
        city: form.city.trim(),
      });
      await refreshUser();
      setEditing(false);
      setSaved(true);
      showToast("Profil yangilandi");
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Profilni saqlab bo'lmadi", "error");
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof ProfileForm; label: string; placeholder: string }[] = [
    { key: "name", label: "Ism", placeholder: "To'liq ism" },
    { key: "phone", label: "Telefon", placeholder: "+998 90 123 45 67" },
    { key: "email", label: "Email", placeholder: "email@example.com" },
    { key: "birthDate", label: "Tug'ilgan sana", placeholder: "15 mart 1995" },
    { key: "city", label: "Shahar", placeholder: "Toshkent shahri" },
  ];

  if (!user || !profile) {
    return (
      <div className="bg-white rounded-2xl border p-10 text-center text-gray-400" style={{ borderColor: "var(--border)" }}>
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-black text-lg text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>
          Profil ma'lumotlari
        </h2>
        {saved && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
            Saqlandi
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#00A86B] flex items-center justify-center text-white text-2xl font-black">
          {(profile.name[0] || "X").toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-gray-900">{profile.name}</p>
          <p className="text-sm text-gray-400">
            Xaridor{memberYear ? ` · ${memberYear} yildan beri` : ""}
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="ml-auto border text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50"
            style={{ borderColor: "var(--border)" }}
          >
            Tahrirlash
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          {fields.map(f => (
            <FormField key={f.key} label={f.label} required={f.key !== "birthDate"} error={errors[f.key]}>
              <input
                value={form[f.key]}
                onChange={e => {
                  setForm(prev => ({ ...prev, [f.key]: e.target.value }));
                  setErrors(prev => {
                    const next = { ...prev };
                    delete next[f.key];
                    return next;
                  });
                }}
                placeholder={f.placeholder}
                className={inputClass(!!errors[f.key])}
                style={{ borderColor: errors[f.key] ? undefined : "var(--border)" }}
              />
            </FormField>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border text-gray-600 text-sm font-semibold hover:bg-gray-50"
              style={{ borderColor: "var(--border)" }}
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008F5A] text-white text-sm font-semibold disabled:opacity-60"
            >
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map(f => (
            <div
              key={f.key}
              className="flex items-center justify-between py-3 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-sm text-gray-500">{f.label}</span>
              <span className="text-sm font-medium text-gray-900">{profile[f.key] || "—"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountAddresses() {
  const { user, showToast } = useAppContext();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [deleteAddress, setDeleteAddress] = useState<Address | null>(null);
  const [form, setForm] = useState({
    title: "",
    fullName: "",
    phone: "",
    region: "",
    address: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState<Partial<Record<"title" | "fullName" | "phone" | "address", string>>>({});

  const defaultName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
  const defaultPhone = user?.phone || "";

  const loadAddresses = async () => {
    try {
      const list = await addressesApi.list();
      setAddresses(list);
    } catch {
      setAddresses([]);
      showToast("Manzillarni yuklab bo'lmadi", "error");
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [list, regionList] = await Promise.all([
          addressesApi.list(),
          catalogApi.regions().catch(() => [] as string[]),
        ]);
        if (cancelled) return;
        setAddresses(list);
        setRegions(regionList);
      } catch {
        if (!cancelled) {
          setAddresses([]);
          showToast("Manzillarni yuklab bo'lmadi", "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      fullName: defaultName,
      phone: defaultPhone,
      region: regions[0] || "",
      address: "",
      isDefault: addresses.length === 0,
    });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item: Address) => {
    setEditing(item);
    setForm({
      title: item.title,
      fullName: item.fullName,
      phone: item.phone,
      region: item.region,
      address: item.address,
      isDefault: item.isDefault,
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setErrors({});
  };

  const handleSubmit = async () => {
    const nextErrors: typeof errors = {};
    if (!form.title.trim()) nextErrors.title = "Nom kiritilishi shart";
    if (!form.fullName.trim()) nextErrors.fullName = "Ism kiritilishi shart";
    if (!form.phone.trim()) nextErrors.phone = "Telefon kiritilishi shart";
    if (!form.address.trim()) nextErrors.address = "Manzil kiritilishi shart";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      title: form.title.trim(),
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      region: form.region,
      address: form.address.trim(),
      isDefault: form.isDefault || addresses.length === 0,
    };

    setSaving(true);
    try {
      if (editing) {
        await addressesApi.update(editing.id, payload);
        showToast("Manzil yangilandi");
      } else {
        await addressesApi.create(payload);
        showToast("Manzil qo'shildi");
      }
      await loadAddresses();
      closeModal();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Manzilni saqlab bo'lmadi", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteAddress) return;
    setSaving(true);
    try {
      await addressesApi.remove(deleteAddress.id);
      showToast("Manzil o'chirildi", "info");
      setDeleteAddress(null);
      await loadAddresses();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Manzilni o'chirib bo'lmadi", "error");
    } finally {
      setSaving(false);
    }
  };

  const setDefault = async (id: number) => {
    try {
      await addressesApi.setDefault(id);
      showToast("Asosiy manzil yangilandi");
      await loadAddresses();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Asosiy manzilni belgilab bo'lmadi", "error");
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-gray-400">Yuklanmoqda...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-lg text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>
              Manzillar
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">{addresses.length} ta saqlangan manzil</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="bg-[#00A86B] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#008F5A]"
          >
            + Manzil qo'shish
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: "var(--border)" }}>
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
            </div>
            <p className="font-semibold text-gray-700 mb-1">Manzillar yo'q</p>
            <p className="text-sm text-gray-400 mb-4">Yetkazish uchun manzil qo'shing</p>
            <button
              type="button"
              onClick={openCreate}
              className="text-sm text-[#00A86B] font-semibold hover:underline"
            >
              + Manzil qo'shish
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border p-5"
                style={{ borderColor: item.isDefault ? "#00A86B" : "var(--border)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      {item.isDefault && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F8F1] text-[#00A86B]">
                          Asosiy
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{item.fullName}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.phone}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.region}, {item.address}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!item.isDefault && (
                      <button
                        type="button"
                        onClick={() => void setDefault(item.id)}
                        className="text-xs text-[#00A86B] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-[#E8F8F1]"
                      >
                        Asosiy qilish
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-500"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteAddress(item)}
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-400"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Manzilni tahrirlash" : "Yangi manzil"}
        description="Yetkazish manzili ma'lumotlari"
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border text-gray-600 font-semibold text-sm hover:bg-gray-50"
              style={{ borderColor: "var(--border)" }}
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008F5A] text-white font-semibold text-sm disabled:opacity-60"
            >
              {saving ? "Saqlanmoqda..." : editing ? "Saqlash" : "Qo'shish"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Manzil nomi" required error={errors.title}>
            <input
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Uy, Ish..."
              className={inputClass(!!errors.title)}
              style={{ borderColor: errors.title ? undefined : "var(--border)" }}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ism" required error={errors.fullName}>
              <input
                value={form.fullName}
                onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                className={inputClass(!!errors.fullName)}
                style={{ borderColor: errors.fullName ? undefined : "var(--border)" }}
              />
            </FormField>
            <FormField label="Telefon" required error={errors.phone}>
              <input
                value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className={inputClass(!!errors.phone)}
                style={{ borderColor: errors.phone ? undefined : "var(--border)" }}
              />
            </FormField>
          </div>
          <FormField label="Viloyat / Shahar">
            <select
              value={form.region}
              onChange={e => setForm(prev => ({ ...prev, region: e.target.value }))}
              className={inputClass()}
              style={{ borderColor: "var(--border)" }}
            >
              {regions.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="To'liq manzil" required error={errors.address}>
            <textarea
              rows={3}
              value={form.address}
              onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Tuman, mavze, uy..."
              className={`${inputClass(!!errors.address)} resize-none`}
              style={{ borderColor: errors.address ? undefined : "var(--border)" }}
            />
          </FormField>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={e => setForm(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-[#00A86B] focus:ring-[#00A86B]"
            />
            <span className="text-sm text-gray-700">Asosiy manzil qilib belgilash</span>
          </label>
        </div>
      </Modal>

      <Modal
        open={!!deleteAddress}
        onClose={() => setDeleteAddress(null)}
        title="Manzilni o'chirish"
        description="Bu amalni bekor qilib bo'lmaydi"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteAddress(null)}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border text-gray-600 font-semibold text-sm hover:bg-gray-50"
              style={{ borderColor: "var(--border)" }}
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={() => void handleConfirmDelete()}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm disabled:opacity-60"
            >
              {saving ? "O'chirilmoqda..." : "O'chirish"}
            </button>
          </>
        }
      >
        {deleteAddress && (
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">{deleteAddress.title}</span> manzilini
            o'chirmoqchimisiz?
          </p>
        )}
      </Modal>
    </>
  );
}

function AccountNotifications() {
  const { showToast } = useAppContext();
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.list();
      setItems(data.items);
      setUnreadCount(data.unread);
    } catch {
      setItems([]);
      setUnreadCount(0);
      showToast("Bildirishnomalarni yuklab bo'lmadi", "error");
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await notificationsApi.list();
        if (cancelled) return;
        setItems(data.items);
        setUnreadCount(data.unread);
      } catch {
        if (!cancelled) {
          setItems([]);
          setUnreadCount(0);
          showToast("Bildirishnomalarni yuklab bo'lmadi", "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      await loadNotifications();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Yangilab bo'lmadi", "error");
    }
  };

  const markRead = async (id: number) => {
    try {
      await notificationsApi.markRead(id);
      await loadNotifications();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Yangilab bo'lmadi", "error");
    }
  };

  const removeItem = async (id: number) => {
    try {
      await notificationsApi.remove(id);
      await loadNotifications();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "O'chirib bo'lmadi", "error");
    }
  };

  const typeStyle = (type: string) => {
    if (type === "order") return "bg-blue-50 text-blue-600";
    if (type === "promo") return "bg-amber-50 text-amber-600";
    return "bg-gray-100 text-gray-600";
  };

  const typeLabel = (type: string) => {
    if (type === "order") return "Buyurtma";
    if (type === "promo") return "Aksiya";
    return "Tizim";
  };

  if (loading) {
    return <div className="py-16 text-center text-gray-400">Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-lg text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>
            Bildirishnomalar
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} ta o'qilmagan` : "Barcha bildirishnomalar o'qilgan"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => void markAllRead()}
            className="text-sm text-[#00A86B] font-semibold hover:underline"
          >
            Barchasini o'qilgan qilish
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {items.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-gray-700">Bildirishnomalar yo'q</p>
            <p className="text-sm text-gray-400 mt-1">Yangi xabarlar shu yerda ko'rinadi</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {items.map(item => (
              <div
                key={item.id}
                className={`p-4 flex gap-3 ${item.read ? "bg-white" : "bg-[#E8F8F1]/30"}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${typeStyle(item.type)}`}
                >
                  {typeLabel(item.type)[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${item.read ? "font-medium text-gray-800" : "font-bold text-gray-900"}`}>
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.message}</p>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {formatDateShort(item.createdAt || item.time)}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {!item.read && (
                        <button
                          type="button"
                          onClick={() => void markRead(item.id)}
                          className="text-[10px] font-semibold text-[#00A86B] px-2 py-1 rounded-lg hover:bg-[#E8F8F1]"
                        >
                          O'qildi
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void removeItem(item.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-400"
                        aria-label="O'chirish"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const DEFAULT_SETTINGS: CustomerSettings = {
  orderUpdates: true,
  promoEmails: true,
  smsAlerts: false,
  language: "uz",
  currency: "uzs",
};

function AccountSettings() {
  const { showToast } = useAppContext();
  const [settings, setSettings] = useState<CustomerSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await usersApi.getSettings();
        if (cancelled) return;
        setSettings({
          orderUpdates: Boolean(data.orderUpdates ?? DEFAULT_SETTINGS.orderUpdates),
          promoEmails: Boolean(data.promoEmails ?? DEFAULT_SETTINGS.promoEmails),
          smsAlerts: Boolean(data.smsAlerts ?? DEFAULT_SETTINGS.smsAlerts),
          language: String(data.language ?? DEFAULT_SETTINGS.language),
          currency: String(data.currency ?? DEFAULT_SETTINGS.currency),
        });
      } catch {
        if (!cancelled) showToast("Sozlamalarni yuklab bo'lmadi", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const toggle = (key: "orderUpdates" | "promoEmails" | "smsAlerts") => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await usersApi.updateSettings(settings);
      setSaved(true);
      showToast("Sozlamalar saqlandi");
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Sozlamalarni saqlab bo'lmadi", "error");
    } finally {
      setSaving(false);
    }
  };

  const closePasswordModal = () => {
    setPasswordOpen(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    if (!passwordForm.currentPassword.trim()) {
      setPasswordError("Joriy parolni kiriting");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Yangi parol kamida 8 belgidan iborat bo'lishi kerak");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Yangi parollar mos kelmadi");
      return;
    }

    setPasswordSaving(true);
    try {
      await usersApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      showToast("Parol yangilandi");
      closePasswordModal();
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Parolni o'zgartirib bo'lmadi");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-gray-400">Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-lg text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>
            Sozlamalar
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">Hisob va bildirishnoma sozlamalari</p>
        </div>
        {saved && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
            Saqlandi
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-bold text-sm text-gray-900 mb-4">Bildirishnomalar</h3>
        <div className="space-y-3">
          {[
            { key: "orderUpdates" as const, label: "Buyurtma yangilanishlari", desc: "Holat o'zgarishi haqida xabar" },
            { key: "promoEmails" as const, label: "Aksiya va chegirmalar", desc: "Email orqali maxsus takliflar" },
            { key: "smsAlerts" as const, label: "SMS ogohlantirishlar", desc: "Muhim xabarlar telefon orqali" },
          ].map(item => (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 border-b last:border-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(item.key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings[item.key] ? "bg-[#00A86B]" : "bg-gray-200"
                }`}
                aria-pressed={settings[item.key]}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings[item.key] ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-bold text-sm text-gray-900 mb-4">Til va valyuta</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Til">
            <select
              value={settings.language}
              onChange={e => {
                setSettings(prev => ({ ...prev, language: e.target.value }));
                setSaved(false);
              }}
              className={inputClass()}
              style={{ borderColor: "var(--border)" }}
            >
              <option value="uz">O'zbekcha</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </FormField>
          <FormField label="Valyuta">
            <select
              value={settings.currency}
              onChange={e => {
                setSettings(prev => ({ ...prev, currency: e.target.value }));
                setSaved(false);
              }}
              className={inputClass()}
              style={{ borderColor: "var(--border)" }}
            >
              <option value="uzs">So'm (UZS)</option>
              <option value="usd">USD</option>
            </select>
          </FormField>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-bold text-sm text-gray-900 mb-2">Xavfsizlik</h3>
        <p className="text-xs text-gray-400 mb-4">Parol va hisob xavfsizligi</p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setPasswordOpen(true)}
            className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium text-gray-700 hover:bg-gray-50"
            style={{ borderColor: "var(--border)" }}
          >
            Parolni o'zgartirish
          </button>
          <button
            type="button"
            className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium text-red-500 hover:bg-red-50"
            style={{ borderColor: "#FECACA" }}
          >
            Hisobni o'chirish
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008F5A] text-white text-sm font-semibold disabled:opacity-60"
        >
          {saving ? "Saqlanmoqda..." : "Sozlamalarni saqlash"}
        </button>
      </div>

      <Modal
        open={passwordOpen}
        onClose={closePasswordModal}
        title="Parolni o'zgartirish"
        description="Joriy parolingizni tasdiqlang va yangi parol kiriting"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={closePasswordModal}
              disabled={passwordSaving}
              className="px-5 py-2.5 rounded-xl border text-gray-600 font-semibold text-sm hover:bg-gray-50"
              style={{ borderColor: "var(--border)" }}
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={() => void handleChangePassword()}
              disabled={passwordSaving}
              className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008F5A] text-white font-semibold text-sm disabled:opacity-60"
            >
              {passwordSaving ? "Saqlanmoqda..." : "Yangilash"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Joriy parol" required>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className={inputClass()}
              style={{ borderColor: "var(--border)" }}
            />
          </FormField>
          <FormField label="Yangi parol" required>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              className={inputClass()}
              style={{ borderColor: "var(--border)" }}
            />
          </FormField>
          <FormField label="Yangi parolni tasdiqlang" required>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={inputClass()}
              style={{ borderColor: "var(--border)" }}
            />
          </FormField>
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        </div>
      </Modal>
    </div>
  );
}

export default function CustomerDashboard() {
  const navigate = useAppNavigate();
  const { pathname } = useLocation();
  const section = getAccountSection(pathname);
  const { user, logout } = useAppContext();
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "Xaridor";
  const initial = (user?.firstName || "X").charAt(0).toUpperCase();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-6">
        <aside className="w-56 shrink-0">
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00A86B] flex items-center justify-center text-white font-bold">{initial}</div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-400">{user ? `+998 ${user.phone}` : ""}</p>
                </div>
              </div>
            </div>
            <nav className="py-2 px-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(accountSectionPaths[item.id])}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-colors mb-0.5 ${
                    section === item.id ? "bg-[#00A86B] text-white font-semibold" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={async () => {
                  await logout();
                  navigate(paths.home);
                }}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 px-3 py-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Chiqish
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <Routes>
            <Route index element={<AccountOverview />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="favorites" element={<AccountFavorites />} />
            <Route path="profile" element={<AccountProfile />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="notifications" element={<AccountNotifications />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="*" element={<Navigate to={paths.account.root} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
