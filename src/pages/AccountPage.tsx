import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { formatDateShort } from "../lib/format";
import { SESSIONS } from "../lib/wedding/catalog";
import { cancelBooking, useAccountBookings } from "../lib/wedding/store";
import { getAccountSection, paths } from "../routes/paths";
import FavoritesPage from "./FavoritesPage";

const NAV = [
  { id: "overview", label: "Umumiy", path: paths.account.root },
  { id: "bookings", label: "Bronlarim", path: paths.account.bookings },
  { id: "favorites", label: "Sevimlilar", path: paths.account.favorites },
  { id: "profile", label: "Profil", path: paths.account.profile },
];

const STATUS: Record<string, string> = {
  pending: "Ko'rib chiqilmoqda",
  confirmed: "Tasdiqlangan",
  cancelled: "Bekor qilindi",
};

function sessionName(id: string) {
  return SESSIONS.find((item) => item.id === id)?.name || id;
}

function useMyBookings() {
  return useAccountBookings();
}

function BookingsList({ limit }: { limit?: number }) {
  const all = useMyBookings();
  const bookings = limit ? all.slice(0, limit) : all;
  if (bookings.length === 0) {
    return <p className="text-sm text-gray-500">Hali bron so&apos;rovi yo&apos;q. Telefon raqamingiz bilan yuborgan arizalar shu yerda turadi.</p>;
  }
  return (
    <div className="space-y-3">
      {bookings.map((item) => (
        <article key={item.id} className="bg-white rounded-2xl border p-4 flex gap-4" style={{ borderColor: "var(--border)" }}>
          <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-gray-900">{item.venueName}</p>
                <p className="text-xs text-gray-400">{item.id} · {formatDateShort(item.date)} · {sessionName(item.session)}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#E8F8F1] text-[#008F5A]">{STATUS[item.status]}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{item.guests} mehmon · {item.name} · {item.phone}</p>
            {item.note && <p className="text-sm text-gray-500 mt-1">{item.note}</p>}
            {item.status === "pending" && (
              <button type="button" onClick={() => { void cancelBooking(item.id); }} className="text-xs text-red-500 mt-2 font-semibold">
                So&apos;rovni bekor qilish
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function Overview() {
  const navigate = useAppNavigate();
  const { user } = useAppContext();
  const bookings = useMyBookings();
  const active = bookings.filter((item) => item.status === "pending").length;
  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-4" style={{ fontFamily: "var(--font-sans)" }}>
        Salom, {user?.firstName || "mehmon"}
      </h1>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl bg-[#E8F8F1] p-4">
          <p className="text-2xl font-black">{bookings.length}</p>
          <p className="text-xs text-gray-500">Jami bronlar</p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4">
          <p className="text-2xl font-black">{active}</p>
          <p className="text-xs text-gray-500">Kutilayotgan</p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold">So&apos;nggi so&apos;rovlar</h2>
        <button type="button" onClick={() => navigate(paths.account.bookings)} className="text-sm text-[#00A86B] font-semibold">Barchasi</button>
      </div>
      <BookingsList limit={3} />
    </div>
  );
}

function Profile() {
  const { user, logout } = useAppContext();
  const navigate = useAppNavigate();
  return (
    <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
      <h1 className="text-xl font-black mb-4" style={{ fontFamily: "var(--font-sans)" }}>Profil</h1>
      <dl className="space-y-3 text-sm">
        <div><dt className="text-gray-400">Ism</dt><dd className="font-semibold">{user?.firstName} {user?.lastName}</dd></div>
        <div><dt className="text-gray-400">Telefon</dt><dd className="font-semibold">{user?.phone}</dd></div>
        <div><dt className="text-gray-400">Email</dt><dd className="font-semibold">{user?.email || "—"}</dd></div>
      </dl>
      <p className="text-xs text-gray-400 mt-4">Shu telefon bilan yuborilgan bronlar kabinetda ko&apos;rinadi.</p>
      <button
        type="button"
        onClick={() => { void logout().then(() => navigate(paths.home)); }}
        className="mt-5 text-sm font-semibold text-red-500"
      >
        Chiqish
      </button>
    </div>
  );
}

export default function AccountPage() {
  const location = useLocation();
  const navigate = useAppNavigate();
  const section = getAccountSection(location.pathname);
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[220px_1fr] gap-6">
      <aside>
        <button type="button" onClick={() => setOpen((value) => !value)} className="lg:hidden mb-3 text-sm font-semibold text-[#00A86B]">
          Bo&apos;limlar
        </button>
        <nav className={`${open ? "block" : "hidden"} lg:block bg-white rounded-2xl border p-2`} style={{ borderColor: "var(--border)" }}>
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { navigate(item.path); setOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${section === item.id ? "bg-[#E8F8F1] text-[#008F5A]" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <div>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="bookings" element={<div><h1 className="text-2xl font-black mb-4" style={{ fontFamily: "var(--font-sans)" }}>Bronlarim</h1><BookingsList /></div>} />
          <Route path="favorites" element={<FavoritesPage embedded />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to={paths.account.root} replace />} />
        </Routes>
      </div>
    </div>
  );
}
