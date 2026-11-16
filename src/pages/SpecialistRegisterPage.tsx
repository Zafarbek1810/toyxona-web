import { useState } from "react";
import { ApiClientError } from "../lib/api/client";
import { weddingApi } from "../lib/api/wedding";
import { DISTRICTS, REGIONS, SPECIALIST_CATEGORIES } from "../lib/wedding/catalog";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { paths } from "../routes/paths";

const fieldClass = "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:border-[#00A86B]";

export default function SpecialistRegisterPage() {
  const navigate = useAppNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const districts = region ? DISTRICTS[region] || [] : [];

  const requestCode = () => {
    if (!name.trim() || !category || !region || !district) {
      setError("Ism, yo'nalish, viloyat va tumanni tanlang");
      return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      setError("Telefon raqamini kiriting");
      return;
    }
    const next = String(Math.floor(1000 + Math.random() * 9000));
    setSentCode(next);
    setStep(2);
    setError("");
  };

  const finish = async () => {
    if (code !== sentCode) {
      setError("Tasdiqlash kodi noto'g'ri");
      return;
    }
    if (password.length < 8) {
      setError("Parol kamida 8 belgidan iborat bo'lsin");
      return;
    }
    if (password !== confirm) {
      setError("Parollar mos emas");
      return;
    }
    const parts = name.trim().split(/\s+/);
    const digits = phone.replace(/\D/g, "");
    const normalized = digits.startsWith("998") ? digits.slice(3) : digits.slice(-9);
    try {
      await weddingApi.registerSpecialist({
        phone: normalized,
        password,
        firstName: parts[0],
        lastName: parts.slice(1).join(" ") || "Mutaxassis",
        role: "specialist",
        categoryId: category,
        city: region,
        district,
      });
      setStep(3);
      setError("");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Ro'yxatdan o'tish amalga oshmadi");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl border p-6" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>Mutaxassis bo&apos;lib ro&apos;yxatdan o&apos;ting</h1>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          San&apos;atkor, boshlovchi, DJ, fotograf yoki sozanda — kabinet ochib, ishlaringizni joylang va bron oling.
        </p>
        {step === 1 && (
          <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); requestCode(); }}>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ism familiya" className={fieldClass} style={{ borderColor: "var(--border)" }} />
            <select value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClass} style={{ borderColor: "var(--border)" }}>
              <option value="">Yo&apos;nalish</option>
              {SPECIALIST_CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <select value={region} onChange={(event) => { setRegion(event.target.value); setDistrict(""); }} className={fieldClass} style={{ borderColor: "var(--border)" }}>
              <option value="">Viloyat</option>
              {REGIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={district} onChange={(event) => setDistrict(event.target.value)} className={fieldClass} style={{ borderColor: "var(--border)" }} disabled={!region}>
              <option value="">{region ? "Tuman" : "Avval viloyatni tanlang"}</option>
              {districts.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Telefon raqam" className={fieldClass} style={{ borderColor: "var(--border)" }} />
            <p className="text-xs text-gray-400">Shu raqamga bir martalik tasdiqlash kodi yuboriladi. Keyin parol o&apos;rnatasiz.</p>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" className="w-full rounded-xl bg-[#00A86B] text-white font-semibold py-3">Kodni olish</button>
          </form>
        )}
        {step === 2 && (
          <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); finish(); }}>
            <p className="text-sm text-gray-600">Sinov kodi: <span className="font-mono font-bold text-[#008F5A]">{sentCode}</span>. SMS provayder ulanmaguncha kod shu yerda ko&apos;rinadi.</p>
            <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Tasdiqlash kodi" className={fieldClass} style={{ borderColor: "var(--border)" }} />
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Parol" className={fieldClass} style={{ borderColor: "var(--border)" }} />
            <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Parolni tasdiqlang" className={fieldClass} style={{ borderColor: "var(--border)" }} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" className="w-full rounded-xl bg-[#00A86B] text-white font-semibold py-3">Kabinetni ochish</button>
          </form>
        )}
        {step === 3 && (
          <div>
            <p className="font-semibold text-gray-900">Ariza qabul qilindi.</p>
            <p className="text-sm text-gray-500 mt-2">Telefon va parol bilan keyingi kirishlar ochiladi. Hozircha mutaxassis kabineti alohida panelda.</p>
            <button type="button" onClick={() => navigate(paths.specialists)} className="mt-5 rounded-xl bg-[#00A86B] text-white font-semibold px-5 py-2.5">
              Mutaxassislarga qaytish
            </button>
          </div>
        )}
        <p className="text-sm text-gray-500 mt-5">
          Hisobingiz bormi?{" "}
          <button type="button" onClick={() => navigate(paths.auth)} className="text-[#00A86B] font-semibold">Kirish</button>
        </p>
      </div>
    </div>
  );
}
