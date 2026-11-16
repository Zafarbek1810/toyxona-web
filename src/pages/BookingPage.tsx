import { useMemo, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { useAppContext } from "../context/AppContext";
import { slotsFor, useCatalog, useVenue } from "../context/CatalogContext";
import { ApiClientError } from "../lib/api/client";
import { weddingApi } from "../lib/api/wedding";
import { SESSIONS, isPastDate } from "../lib/wedding/catalog";
import type { SessionId } from "../lib/wedding/types";
import { paths } from "../routes/paths";

const fieldClass = "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:border-[#00A86B]";

export default function BookingPage() {
  const { venueId = "" } = useParams();
  const { venue, loading } = useVenue(venueId);
  const { slots, refresh } = useCatalog();
  const [params] = useSearchParams();
  const navigate = useAppNavigate();
  const { user } = useAppContext();
  const [session, setSession] = useState<SessionId | "">("");
  const [date, setDate] = useState(params.get("date") || "");
  const [guests, setGuests] = useState("");
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}`.trim() : "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [sending, setSending] = useState(false);

  const taken = useMemo(() => (venue && date ? slotsFor(slots, venue.id, date) : []), [date, slots, venue]);

  if (loading) return <p className="max-w-xl mx-auto px-4 py-16 text-sm text-gray-400">Yuklanmoqda...</p>;
  if (!venue) return <Navigate to={paths.catalog} replace />;

  const submit = async () => {
    if (!session) return setError("Seansni tanlang");
    if (!date || isPastDate(date)) return setError("Kelajakdagi sanani tanlang");
    if (taken.includes(session)) return setError("Bu seans band. Boshqa vaqtni tanlang");
    const guestCount = Number(guests);
    if (!guestCount || guestCount < 1) return setError("Mehmonlar sonini kiriting");
    if (venue.maxGuests && (guestCount < venue.minGuests || guestCount > venue.maxGuests)) {
      return setError(`Mehmonlar soni ${venue.minGuests} dan ${venue.maxGuests} gacha bo'lishi kerak`);
    }
    if (!name.trim() || phone.replace(/\D/g, "").length < 9) return setError("Ism va telefon raqamini kiriting");

    setSending(true);
    try {
      const created = await weddingApi.createBooking({
        venueId: venue.id,
        session,
        date,
        guests: guestCount,
        name: name.trim(),
        phone: phone.trim(),
        note: note.trim(),
      });
      setDone(String(created.id));
      setError("");
      await refresh();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "So'rov yuborilmadi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button type="button" onClick={() => navigate(paths.venue(venue.id))} className="text-sm text-[#00A86B] font-semibold mb-4">
        ← Orqaga qaytish
      </button>
      <div className="bg-white rounded-3xl border p-6" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-semibold text-[#008F5A] mb-1">Onlayn buyurtma</p>
        <h1 className="text-2xl font-black text-gray-900 mb-5" style={{ fontFamily: "var(--font-sans)" }}>{venue.name}</h1>
        {done ? (
          <div>
            <p className="text-gray-800 font-semibold">So&apos;rov yuborildi · {done}</p>
            <p className="text-sm text-gray-500 mt-2">
              So&apos;rovingiz to&apos;yxona ma&apos;muriyatiga uzatildi. Ular siz bilan aloqaga chiqishadi.
            </p>
            <button type="button" onClick={() => navigate(user ? paths.account.bookings : paths.auth)} className="mt-5 rounded-xl bg-[#00A86B] text-white font-semibold px-5 py-2.5">
              {user ? "Bronlarim" : "Bronni kuzatish uchun kiring"}
            </button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Seans (vaqt oralig&apos;i)</span>
              <select value={session} onChange={(event) => setSession(event.target.value as SessionId)} className={`${fieldClass} mt-1`} style={{ borderColor: "var(--border)" }}>
                <option value="">— Seansni tanlang —</option>
                {SESSIONS.map((item) => (
                  <option key={item.id} value={item.id} disabled={taken.includes(item.id)}>
                    {item.name} ({item.time}){taken.includes(item.id) ? " — band" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Tadbir sanasi</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={`${fieldClass} mt-1`} style={{ borderColor: "var(--border)" }} />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Mehmonlar soni</span>
              <input value={guests} onChange={(event) => setGuests(event.target.value)} inputMode="numeric" className={`${fieldClass} mt-1`} style={{ borderColor: "var(--border)" }} />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">To&apos;liq ismingiz</span>
              <input value={name} onChange={(event) => setName(event.target.value)} className={`${fieldClass} mt-1`} style={{ borderColor: "var(--border)" }} />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Telefon raqam</span>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+998" className={`${fieldClass} mt-1`} style={{ borderColor: "var(--border)" }} />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Qo&apos;shimcha izoh</span>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className={`${fieldClass} mt-1`} style={{ borderColor: "var(--border)" }} />
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={sending} className="w-full rounded-xl bg-[#00A86B] hover:bg-[#008F5A] disabled:opacity-60 text-white font-semibold py-3">
              {sending ? "Yuborilmoqda..." : "Bron so'rovini yuborish"}
            </button>
            <p className="text-xs text-gray-400">
              So&apos;rov to&apos;yxona ma&apos;muriyatiga uzatiladi. Tasdiq ulardan keladi.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
