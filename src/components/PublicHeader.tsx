import { useState, useRef, useEffect } from "react";
import { catalogApi } from "../lib/api";
import type { Category } from "../lib/api/types";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { useAppContext } from "../context/AppContext";
import { paths } from "../routes/paths";
import { dashboardUrl } from "../lib/links";
import logoImg from "../assets/logo1.png";
import CategoryGlyph from "./CategoryGlyph";

interface Props {
  cartCount: number;
  favCount: number;
}

const LANGS = [
  { code: "UZ", label: "O'zbek", flag: "🇺🇿" },
  { code: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "EN", label: "English", flag: "🇬🇧" },
];

export default function PublicHeader({ cartCount, favCount }: Props) {
  const navigate = useAppNavigate();
  const { user } = useAppContext();
  const customer = user?.role === "customer" ? user : null;
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showRegion, setShowRegion] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Toshkent shahri");
  const [showCats, setShowCats] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string>("Elektronika");
  const [mobileCatPanel, setMobileCatPanel] = useState<"list" | "subs">("list");
  const [showLang, setShowLang] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGS[0]);
  const [showTopBar, setShowTopBar] = useState(true);
  const [topBarHeight, setTopBarHeight] = useState(36);
  const [spacerHeight, setSpacerHeight] = useState(96);

  const catsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const showTopBarRef = useRef(true);

  useEffect(() => {
    catalogApi.categories().then((cats) => {
      setCategories(cats);
      if (cats[0]) setHoveredCat(cats[0].name);
    }).catch(() => undefined);
    catalogApi.regions().then((list) => {
      setRegions(list);
      if (list[0]) setSelectedRegion((prev) => (list.includes(prev) ? prev : list[0]));
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catsRef.current && !catsRef.current.contains(e.target as Node)) {
        setShowCats(false);
        setHoveredCat(categories[0]?.name || "Elektronika");
        setMobileCatPanel("list");
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLang(false);
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setShowRegion(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!showCats) return;
    const mq = window.matchMedia("(max-width: 1023px)");
    if (!mq.matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showCats]);

  useEffect(() => {
    const topEl = topBarRef.current;
    const headerEl = headerRef.current;
    if (!topEl || !headerEl) return;

    const measure = () => {
      if (showTopBarRef.current) {
        const natural = topEl.offsetHeight || topEl.scrollHeight;
        if (natural > 0) setTopBarHeight(natural);
      }
      setSpacerHeight(headerEl.offsetHeight);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(topEl);
    ro.observe(headerEl);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [showTopBar]);

  useEffect(() => {
    showTopBarRef.current = showTopBar;
  }, [showTopBar]);

  useEffect(() => {
    const headerEl = headerRef.current;

    const getScrollParent = (): Element | Window => {
      let node = headerEl?.parentElement ?? null;
      while (node && node !== document.body && node !== document.documentElement) {
        const { overflowY } = getComputedStyle(node);
        if (
          (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
          node.scrollHeight > node.clientHeight + 1
        ) {
          return node;
        }
        node = node.parentElement;
      }
      return window;
    };

    const scrollParent = getScrollParent();

    const readScrollY = () => {
      if (scrollParent === window) {
        return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      }
      return (scrollParent as Element).scrollTop;
    };

    lastScrollY.current = readScrollY();

    const onScroll = () => {
      const y = readScrollY();
      const delta = y - lastScrollY.current;

      if (y <= 16) {
        if (!showTopBarRef.current) {
          showTopBarRef.current = true;
          setShowTopBar(true);
        }
      } else if (delta > 6) {
        if (showTopBarRef.current) {
          showTopBarRef.current = false;
          setShowTopBar(false);
          setShowRegion(false);
          setShowLang(false);
        }
      } else if (delta < -6) {
        if (!showTopBarRef.current) {
          showTopBarRef.current = true;
          setShowTopBar(true);
        }
      }

      lastScrollY.current = y;
    };

    scrollParent.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollParent.removeEventListener("scroll", onScroll);
  }, []);

  const activeCat = categories.find(c => c.name === hoveredCat);

  const closeCats = () => {
    setShowCats(false);
    setHoveredCat(categories[0].name);
    setMobileCatPanel("list");
  };

  const goProducts = () => {
    navigate(paths.products);
    closeCats();
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 w-full"
      >
        {/* Top bar: height collapse — transform ishlatilmaydi (mobile fixed overlaylar uchun) */}
        <div
          className="transition-[height] duration-300 ease-out"
          style={{
            height: showTopBar ? topBarHeight : 0,
            overflow: showTopBar ? "visible" : "hidden",
          }}
        >
          <div
            ref={topBarRef}
            style={{ background: "#00A86B" }}
            className="text-white text-xs py-1.5 px-3 sm:px-4"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-0">
              <span className="opacity-60 hidden sm:block truncate">Uzbekiston bo'ylab tez yetkazib berish 🚀</span>
              <div className="flex items-center gap-2 sm:gap-3 ml-auto min-w-0">

                {/* Region */}
                <div ref={regionRef} className="relative hidden md:block">
                  <button
                    type="button"
                    onClick={() => setShowRegion(v => !v)}
                    className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate max-w-[110px]">{selectedRegion}</span>
                    <svg className={`w-3 h-3 transition-transform duration-150 ${showRegion ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showRegion && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl w-56 max-h-64 overflow-y-auto z-50 py-1.5">
                      {regions.map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => { setSelectedRegion(r); setShowRegion(false); }}
                          className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center gap-2 ${r === selectedRegion ? "text-[#00A86B] font-bold bg-[#E8F8F1]" : "text-gray-700"}`}
                        >
                          {r === selectedRegion && <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="opacity-20 hidden md:block">|</span>

                {/* Language */}
                <div ref={langRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setShowLang(v => !v)}
                    className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <span className="w-[18px] h-[18px] rounded-full overflow-hidden inline-flex items-center justify-center shrink-0" style={{ fontSize: 14, lineHeight: 1 }}>
                      {selectedLang.flag}
                    </span>
                    <span className="font-semibold tracking-wide">{selectedLang.code}</span>
                    <svg className={`w-3 h-3 shrink-0 transition-transform duration-150 ${showLang ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showLang && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl w-44 z-50 py-1.5 overflow-hidden">
                      {LANGS.map(lang => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => { setSelectedLang(lang); setShowLang(false); }}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors ${lang.code === selectedLang.code ? "bg-[#E8F8F1]" : ""}`}
                        >
                          <span className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center shrink-0 ring-1 ring-gray-200" style={{ fontSize: 18, lineHeight: 1 }}>
                            {lang.flag}
                          </span>
                          <span className={`text-gray-700 ${lang.code === selectedLang.code ? "font-bold text-[#00A86B]" : "font-medium"}`}>{lang.label}</span>
                          {lang.code === selectedLang.code && (
                            <svg className="w-3.5 h-3.5 text-[#00A86B] ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="opacity-20 hidden sm:block">|</span>
                <span className="opacity-60 hidden sm:block whitespace-nowrap">+998 71 200 00 00</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main header ── */}
        <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
            {/* Top row: logo + cats + actions */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">

              {/* Logo */}
              <button
                type="button"
                onClick={() => navigate(paths.home)}
                aria-label="To'yxona"
                className="shrink-0 inline-flex items-center bg-transparent border-0 p-0 cursor-pointer"
              >
                <img
                  src={logoImg}
                  alt="To'yxona"
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain"
                />
              </button>

          {/* Categories */}
          <div ref={catsRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowCats(v => !v);
                setMobileCatPanel("list");
              }}
              aria-expanded={showCats}
              aria-label="Barcha kategoriyalar"
              className={`flex items-center gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 select-none
                ${showCats ? "bg-[#008F5A] shadow-lg" : "bg-[#00A86B] hover:bg-[#008F5A]"}`}
            >
              <span className="w-4 h-[14px] flex flex-col justify-between shrink-0 relative">
                <span className={`block h-0.5 bg-white rounded-full transition-all duration-200 origin-left ${showCats ? "rotate-[38deg] w-[115%]" : "w-full"}`} />
                <span className={`block h-0.5 bg-white rounded-full transition-all duration-200 ${showCats ? "opacity-0 scale-x-0" : "w-full"}`} />
                <span className={`block h-0.5 bg-white rounded-full transition-all duration-200 origin-left ${showCats ? "-rotate-[38deg] w-[115%]" : "w-full"}`} />
              </span>
              <span className="hidden xl:block whitespace-nowrap">Barcha kategoriyalar</span>
              <svg className={`w-3.5 h-3.5 shrink-0 hidden sm:block transition-transform duration-200 ${showCats ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Backdrop (mobile / tablet) */}
            {showCats && (
              <div
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={closeCats}
                aria-hidden
              />
            )}

            {/* ── Desktop mega dropdown ── */}
            <div
              className="hidden lg:block absolute top-[calc(100%+8px)] left-0 z-50"
              style={{
                pointerEvents: showCats ? "auto" : "none",
                opacity: showCats ? 1 : 0,
                transform: showCats ? "translateY(0) scaleY(1)" : "translateY(-8px) scaleY(0.97)",
                transformOrigin: "top left",
                transition: "opacity 180ms ease, transform 180ms ease",
                width: "min(720px, calc(100vw - 2rem))",
              }}
            >
              <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden flex" style={{ borderColor: "var(--border)" }}>
                <div className="w-52 shrink-0 border-r bg-gray-50/60 py-2" style={{ borderColor: "var(--border)" }}>
                  {categories.map(cat => {
                    const isActive = hoveredCat === cat.name;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onMouseEnter={() => setHoveredCat(cat.name)}
                        onClick={goProducts}
                        className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors relative ${isActive ? "bg-white text-[#00A86B]" : "text-gray-600 hover:bg-white/70 hover:text-gray-900"}`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r-full bg-[#00A86B]" />
                        )}
                        <span
                          className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center text-base shrink-0 transition-colors"
                          style={{ background: isActive ? cat.bg : "#fff", border: "1px solid #e5e7eb" }}
                        >
                          <CategoryGlyph icon={cat.icon} />
                        </span>
                        <span className={`flex-1 text-left text-xs leading-snug ${isActive ? "font-bold" : "font-medium"}`}>
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-gray-300 font-mono shrink-0">{((cat.count ?? 0) / 1000).toFixed(1)}K</span>
                        <svg className={`w-3 h-3 shrink-0 transition-colors ${isActive ? "text-[#00A86B]" : "text-gray-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 p-5 min-h-[380px] min-w-0">
                  {activeCat && (
                    <>
                      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
                        <span
                          className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center text-xl shrink-0"
                          style={{ background: activeCat.bg }}
                        >
                          <CategoryGlyph icon={activeCat.icon} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-black text-gray-900 text-sm leading-tight truncate" style={{ fontFamily: "var(--font-sans)" }}>
                            {activeCat.name}
                          </h3>
                          <p className="text-[11px] text-gray-400 font-mono">{(activeCat.count ?? 0).toLocaleString()} mahsulot</p>
                        </div>
                        <button
                          type="button"
                          onClick={goProducts}
                          className="ml-auto flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-[#E8F8F1] hover:border-[#00A86B] hover:text-[#00A86B] text-gray-500 shrink-0"
                          style={{ borderColor: "var(--border)" }}
                        >
                          Barchasini ko'rish
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1">
                        {(activeCat.subcategories || []).map(sub => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={goProducts}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-[#E8F8F1] hover:text-[#00A86B] transition-colors group text-left"
                          >
                            <span
                              className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center text-base shrink-0 bg-gray-100 group-hover:bg-white transition-colors"
                              style={{ fontSize: 16 }}
                            >
                              <CategoryGlyph icon={sub.icon} />
                            </span>
                            <span className="text-xs font-medium group-hover:font-semibold transition-all">{sub.name}</span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Trendda</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(activeCat.subcategories || []).slice(0, 4).map(sub => (
                            <button
                              key={sub.name}
                              type="button"
                              onClick={goProducts}
                              className="text-[11px] px-2.5 py-1 rounded-full border font-medium text-gray-500 hover:border-[#00A86B] hover:text-[#00A86B] hover:bg-[#E8F8F1] transition-colors"
                              style={{ borderColor: "var(--border)" }}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Mobile / tablet categories sheet ── */}
            <div
              className={`lg:hidden fixed inset-x-0 bottom-0 top-[auto] z-50 max-h-[85dvh] bg-white rounded-t-2xl shadow-2xl border-t flex flex-col transition-transform duration-200 ease-out
                ${showCats ? "translate-y-0" : "translate-y-full pointer-events-none"}`}
              style={{ borderColor: "var(--border)" }}
              role="dialog"
              aria-modal="true"
              aria-hidden={!showCats}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
                {mobileCatPanel === "subs" && activeCat ? (
                  <button
                    type="button"
                    onClick={() => setMobileCatPanel("list")}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-800 min-w-0"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="truncate">{activeCat.name}</span>
                  </button>
                ) : (
                  <h2 className="text-sm font-bold text-gray-900">Kategoriyalar</h2>
                )}
                <button
                  type="button"
                  onClick={closeCats}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
                  aria-label="Yopish"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto overscroll-contain flex-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {mobileCatPanel === "list" ? (
                  <div className="py-1">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setHoveredCat(cat.name);
                          setMobileCatPanel("subs");
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50"
                      >
                        <span
                          className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center text-lg shrink-0"
                          style={{ background: cat.bg, border: "1px solid #e5e7eb" }}
                        >
                          <CategoryGlyph icon={cat.icon} />
                        </span>
                        <span className="flex-1 text-sm font-medium text-gray-800 truncate">{cat.name}</span>
                        <span className="text-[10px] text-gray-300 font-mono shrink-0">{((cat.count ?? 0) / 1000).toFixed(1)}K</span>
                        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                ) : activeCat ? (
                  <div className="p-3">
                    <button
                      type="button"
                      onClick={goProducts}
                      className="w-full mb-3 flex items-center justify-center gap-1 text-sm font-semibold py-2.5 rounded-xl border text-[#00A86B] border-[#00A86B]/30 bg-[#E8F8F1]"
                    >
                      Barchasini ko'rish
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
                      {(activeCat.subcategories || []).map(sub => (
                        <button
                          key={sub.name}
                          type="button"
                          onClick={goProducts}
                          className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm text-gray-700 hover:bg-[#E8F8F1] hover:text-[#00A86B] text-left"
                        >
                          <span className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center text-base shrink-0 bg-gray-100">
                            <CategoryGlyph icon={sub.icon} />
                          </span>
                          <span className="text-sm font-medium">{sub.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Search — desktop / large tablet inline */}
          <div className="hidden md:block flex-1 relative min-w-0">
            <div className="flex min-w-0">
              <div className="relative flex-1 min-w-0">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 150)}
                  placeholder="Mahsulot yoki xizmat qidiring..."
                  className="w-full min-w-0 pl-9 pr-3 py-2.5 border border-gray-200 rounded-l-xl text-sm focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B]/20"
                />
              </div>
              <button
                type="button"
                onClick={() => navigate(paths.products)}
                className="bg-[#00A86B] hover:bg-[#008F5A] text-white px-4 lg:px-5 rounded-r-xl text-sm font-semibold shrink-0 transition-colors"
              >
                <span className="hidden lg:inline">Qidirish</span>
                <svg className="w-4 h-4 lg:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            {showSearch && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Mashhur qidiruvlar</p>
                {["Samsung Galaxy S24", "MacBook Pro M3", "Nike Air Max", "Zara ko'ylak", "LG Televisor 55\""].map(t => (
                  <button key={t} type="button" onClick={() => navigate(paths.products)} className="flex items-center gap-2.5 w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0 sm:gap-1 shrink-0 ml-auto">
            <button
              type="button"
              onClick={() => navigate(paths.favorites)}
              className="relative flex flex-col items-center gap-0.5 px-1.5 sm:px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-[#00A86B] transition-colors"
              aria-label="Sevimlilar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs hidden lg:block">Sevimlilar</span>
              {favCount > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{favCount}</span>}
            </button>

            <button
              type="button"
              onClick={() => navigate(paths.cart)}
              className="relative flex flex-col items-center gap-0.5 px-1.5 sm:px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-[#00A86B] transition-colors"
              aria-label="Savat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs hidden lg:block">Savat</span>
              {cartCount > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#F59E0B] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
            </button>

            <div className="hidden xl:flex">
              <a
                href={dashboardUrl("/?register=1")}
                className="border border-[#00A86B] text-[#00A86B] hover:bg-[#00A86B] hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
              >
                Sotuvchi bo'lish
              </a>
            </div>

            <button
              type="button"
              onClick={() => navigate(customer ? paths.account.root : paths.auth)}
              className="flex flex-col items-center gap-0.5 px-1.5 sm:px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-[#00A86B] transition-colors"
              aria-label={customer ? "Kabinet" : "Kirish"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs hidden lg:block">{customer ? customer.firstName || "Kabinet" : "Kirish"}</span>
            </button>
          </div>
            </div>

            {/* Search — phone / small tablet full-width second row */}
            <div className="md:hidden mt-2.5 relative">
              <div className="flex min-w-0">
                <div className="relative flex-1 min-w-0">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearch(true)}
                    onBlur={() => setTimeout(() => setShowSearch(false), 150)}
                    placeholder="Qidirish..."
                    className="w-full min-w-0 pl-9 pr-3 py-2.5 border border-gray-200 rounded-l-xl text-sm focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B]/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => navigate(paths.products)}
                  className="bg-[#00A86B] hover:bg-[#008F5A] text-white px-4 rounded-r-xl text-sm font-semibold shrink-0 transition-colors"
                  aria-label="Qidirish"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              {showSearch && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Mashhur qidiruvlar</p>
                  {["Samsung Galaxy S24", "MacBook Pro M3", "Nike Air Max", "Zara ko'ylak", "LG Televisor 55\""].map(t => (
                    <button key={t} type="button" onClick={() => navigate(paths.products)} className="flex items-center gap-2.5 w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="truncate text-left">{t}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div
        aria-hidden
        className="shrink-0"
        style={{ height: spacerHeight, transition: "height 300ms ease-out" }}
      />
    </>
  );
}
