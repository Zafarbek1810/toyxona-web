import { useEffect, useRef, useState } from "react";
import logoImg from "../assets/logo1.png";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { useAppContext } from "../context/AppContext";
import { useCatalog } from "../context/CatalogContext";
import { DISTRICTS, REGIONS } from "../lib/wedding/districts";
import { PLATFORM } from "../lib/wedding/catalog";
import { paths } from "../routes/paths";

const LANGS = [
  { code: "UZ", label: "O'zbek", flag: "🇺🇿" },
  { code: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "EN", label: "English", flag: "🇬🇧" },
];

export default function PublicHeader({ favCount, bookingCount }: { favCount: number; bookingCount: number }) {
  const navigate = useAppNavigate();
  const { user } = useAppContext();
  const { venues, specialists } = useCatalog();
  const customer = user?.role === "customer" ? user : null;
  const [query, setQuery] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [region, setRegion] = useState("Xorazm");
  const [district, setDistrict] = useState("");
  const [openRegion, setOpenRegion] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [lang, setLang] = useState(LANGS[0]);
  const [openLang, setOpenLang] = useState(false);
  const [menu, setMenu] = useState(false);
  const [barHeight, setBarHeight] = useState(96);
  const headerRef = useRef<HTMLElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(event.target as Node)) setOpenRegion(false);
      if (langRef.current && !langRef.current.contains(event.target as Node)) setOpenLang(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setBarHeight(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const q = query.trim().toLowerCase();
  const venueHits = (q ? venues.filter((item) => item.name.toLowerCase().includes(q)) : venues).slice(0, 4);
  const peopleHits = (q ? specialists.filter((item) => item.name.toLowerCase().includes(q)) : []).slice(0, 3);

  const goSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (region) params.set("region", region);
    if (district) params.set("district", district);
    navigate(`${paths.catalog}?${params.toString()}`);
    setOpenSearch(false);
    setMenu(false);
  };

  return (
    <>
      <header ref={headerRef} className="fixed top-0 inset-x-0 z-50">
        <div className="text-white text-xs" style={{ background: "#00A86B" }}>
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-3">
            <span className="hidden sm:block opacity-90">0% komissiya · onlayn bron</span>
            <div className="flex items-center gap-3 ml-auto">
              <div ref={regionRef} className="relative hidden md:flex items-center gap-3">
                <div className="relative">
                  <button type="button" onClick={() => { setOpenRegion((value) => !value); setOpenDistrict(false); }} className="opacity-90 hover:opacity-100">
                    {region || "Viloyat"}
                  </button>
                  {openRegion && (
                    <div className="absolute top-full right-0 mt-2 bg-white text-gray-700 rounded-xl shadow-xl w-52 max-h-72 overflow-y-auto py-1">
                      {REGIONS.map((item) => (
                        <button key={item} type="button" onClick={() => { setRegion(item); setDistrict(""); setOpenRegion(false); }} className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${item === region ? "text-[#008F5A] font-bold" : ""}`}>
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button type="button" onClick={() => { setOpenDistrict((value) => !value); setOpenRegion(false); }} className="opacity-90 hover:opacity-100">
                    {district || "Tuman"}
                  </button>
                  {openDistrict && (
                    <div className="absolute top-full right-0 mt-2 bg-white text-gray-700 rounded-xl shadow-xl w-52 max-h-72 overflow-y-auto py-1">
                      <button type="button" onClick={() => { setDistrict(""); setOpenDistrict(false); }} className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50">
                        Barcha tumanlar
                      </button>
                      {(DISTRICTS[region] || []).map((name) => (
                        <button key={name} type="button" onClick={() => { setDistrict(name); setOpenDistrict(false); }} className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${name === district ? "text-[#008F5A] font-bold" : ""}`}>
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div ref={langRef} className="relative">
                <button type="button" onClick={() => setOpenLang((value) => !value)} className="font-semibold">{lang.flag} {lang.code}</button>
                {openLang && (
                  <div className="absolute top-full right-0 mt-2 bg-white text-gray-700 rounded-xl shadow-xl w-40 py-1">
                    {LANGS.map((item) => (
                      <button key={item.code} type="button" onClick={() => { setLang(item); setOpenLang(false); }} className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50">
                        {item.flag} {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <a href={PLATFORM.phoneHref} className="hidden sm:block opacity-90">{PLATFORM.phone}</a>
            </div>
          </div>
        </div>
        <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <button type="button" onClick={() => navigate(paths.home)} className="shrink-0">
              <img src={logoImg} alt="To'yxona" className="h-9 w-auto object-contain" />
            </button>
            <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-gray-700">
              <button type="button" onClick={() => navigate(paths.home)} className="px-3 py-2 rounded-xl hover:bg-gray-50 hover:text-[#00A86B]">Bosh sahifa</button>
              <button type="button" onClick={() => navigate(paths.catalog)} className="px-3 py-2 rounded-xl hover:bg-gray-50 hover:text-[#00A86B]">To&apos;yxonalar</button>
              <button type="button" onClick={() => navigate(paths.specialists)} className="px-3 py-2 rounded-xl hover:bg-gray-50 hover:text-[#00A86B]">Mutaxassislar</button>
            </nav>
            <div className="hidden md:block flex-1 relative">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setOpenSearch(true)}
                onBlur={() => setTimeout(() => setOpenSearch(false), 180)}
                onKeyDown={(event) => { if (event.key === "Enter") goSearch(); }}
                placeholder="To'yxona yoki mutaxassis qidiring..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00A86B]"
              />
              {openSearch && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-xl z-50 p-2" style={{ borderColor: "var(--border)" }}>
                  {venueHits.map((item) => (
                    <button key={item.id} type="button" onMouseDown={() => navigate(paths.venue(item.id))} className="block w-full text-left px-2 py-2 text-sm rounded-lg hover:bg-gray-50">
                      {item.name} <span className="text-gray-400">· to&apos;yxona</span>
                    </button>
                  ))}
                  {peopleHits.map((item) => (
                    <button key={item.id} type="button" onMouseDown={() => navigate(paths.specialist(item.id))} className="block w-full text-left px-2 py-2 text-sm rounded-lg hover:bg-gray-50">
                      {item.name} <span className="text-gray-400">· mutaxassis</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <button type="button" onClick={() => navigate(paths.favorites)} className="relative px-2 py-2 rounded-xl text-gray-600 hover:text-[#00A86B]" aria-label="Sevimlilar">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {favCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">{favCount}</span>}
              </button>
              <button type="button" onClick={() => navigate(customer ? paths.account.bookings : paths.auth)} className="relative px-2 py-2 rounded-xl text-gray-600 hover:text-[#00A86B]" aria-label="Bronlar">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {bookingCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#F59E0B] text-white text-[10px] flex items-center justify-center">{bookingCount}</span>}
              </button>
              <button type="button" onClick={() => navigate(paths.specialistJoin)} className="hidden xl:block border border-[#00A86B] text-[#00A86B] hover:bg-[#00A86B] hover:text-white px-3 py-2 rounded-xl text-sm font-semibold">
                Mutaxassis bo&apos;lish
              </button>
              <button type="button" onClick={() => navigate(customer ? paths.account.root : paths.auth)} className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-[#00A86B]">
                {customer ? customer.firstName || "Kabinet" : "Kirish"}
              </button>
              <button type="button" onClick={() => setMenu((value) => !value)} className="lg:hidden px-2 py-2" aria-label="Menyu">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
          <div className="md:hidden px-4 pb-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") goSearch(); }}
              placeholder="To'yxona qidiring..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00A86B]"
            />
          </div>
          {menu && (
            <div className="lg:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ borderColor: "var(--border)" }}>
              <button type="button" onClick={() => { navigate(paths.home); setMenu(false); }} className="text-left py-2 text-sm font-semibold">Bosh sahifa</button>
              <button type="button" onClick={() => { navigate(paths.catalog); setMenu(false); }} className="text-left py-2 text-sm font-semibold">To&apos;yxonalar</button>
              <button type="button" onClick={() => { navigate(paths.specialists); setMenu(false); }} className="text-left py-2 text-sm font-semibold">Mutaxassislar</button>
              <button type="button" onClick={() => { navigate(paths.specialistJoin); setMenu(false); }} className="text-left py-2 text-sm font-semibold text-[#00A86B]">Mutaxassis bo&apos;lish</button>
              {!customer && (
                <button type="button" onClick={() => { navigate(paths.auth); setMenu(false); }} className="text-left py-2 text-sm font-semibold">Ro&apos;yxatdan o&apos;tish</button>
              )}
            </div>
          )}
        </div>
      </header>
      <div style={{ height: barHeight }} />
    </>
  );
}
