import { useState, useEffect } from "react";
import { catalogApi } from "../lib/api";
import type { Category, Product, Seller } from "../lib/api/types";
import ProductCard from "../components/ProductCard";
import CategoryGlyph from "../components/CategoryGlyph";
import { useAppContext } from "../context/AppContext";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { paths } from "../routes/paths";
import { dashboardUrl } from "../lib/links";

const SLIDES = [
  {
    badge: "Yangi kolleksiya 2024",
    title: "Kerakli mahsulotni",
    highlight: "oson toping",
    desc: "500,000+ mahsulot, 2,000+ ishonchli sotuvchi. O'zbekiston bo'ylab tez yetkazib berish.",
    cta: "Xarid qilishni boshlash",
    img: "photo-1556742049-0cfed4f6a45d",
    tag: "🔥 Bugungi taklif",
    badge2: "Bepul yetkazib berish",
  },
  {
    badge: "Elektronika aksiyasi",
    title: "Eng yaxshi texnika",
    highlight: "arzon narxda",
    desc: "Samsung, Apple, Xiaomi va boshqa brendlardan 30% gacha chegirma. Kafolat bilan.",
    cta: "Elektronikani ko'rish",
    img: "photo-1610945265064-0e34e5519bbf",
    tag: "⚡ Flash Sale",
    badge2: "30% chegirma",
  },
  {
    badge: "Moda & Stil",
    title: "Yangi mavsumning",
    highlight: "eng zo'r kiyimlari",
    desc: "Mahalliy va xalqaro brendlardan eng yangi kolleksiyalar. Har kunduz yangi mahsulotlar.",
    cta: "Kiyimlarni ko'rish",
    img: "photo-1542291026-7eec264c27ff",
    tag: "✨ Trend",
    badge2: "Yangi keldi",
  },
];

export default function HomePage() {
  const navigate = useAppNavigate();
  const { favIds, handleFav, handleCart } = useAppContext();
  const [activeTab, setActiveTab] = useState("tavsiya");
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [feeds, setFeeds] = useState<{ recommended: Product[]; newest: Product[]; onSale: Product[] }>({
    recommended: [],
    newest: [],
    onSale: [],
  });
  const [stats, setStats] = useState({ products: 0, sellers: 0, customers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await catalogApi.home();
        if (cancelled) return;
        setCategories(data.categories);
        setSellers(data.sellers);
        setFeeds(data.feeds);
        setStats(data.stats);
      } catch {
        /* keep empty */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  function goTo(next: number | ((s: number) => number)) {
    setAnimating(true);
    setTimeout(() => {
      setSlide(typeof next === "function" ? next(slide) : next);
      setAnimating(false);
    }, 280);
  }

  const s = SLIDES[slide];
  const products =
    activeTab === "yangi" ? feeds.newest : activeTab === "aksiya" ? feeds.onSale : feeds.recommended;

  const STATS = [
    { label: "Mahsulotlar", value: stats.products ? `${stats.products}+` : "…", icon: "📦" },
    { label: "Sotuvchilar", value: stats.sellers ? `${stats.sellers}+` : "…", icon: "🏪" },
    { label: "Buyurtmalar", value: "1.2M+", icon: "✅" },
    { label: "Foydalanuvchilar", value: stats.customers ? `${stats.customers}+` : "…", icon: "👥" },
  ];

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg, #0F172A 0%, #003D27 50%, #0F172A 100%)" }}>
        {/* Fixed background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "#00A86B" }} />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-15 blur-2xl" style={{ background: "#00A86B" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl" style={{ background: "#00A86B" }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center py-14">

            {/* Left content */}
            <div className={`transition-all duration-300 ${animating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}>
              {/* Badge row */}
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
                  {s.badge}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold bg-[#00A86B]/20 text-[#6EE7B7] border border-[#00A86B]/30">
                  {s.badge2}
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl font-black leading-[1.1] mb-5 tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
                {s.title}{" "}
                <span className="relative inline-block">
                  <span className="text-[#6EE7B7]">{s.highlight}</span>
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                    <path d="M0 5 Q50 0 100 4 Q150 8 200 3" stroke="#00A86B" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
                  </svg>
                </span>
              </h1>

              <p className="text-white/65 text-base mb-8 leading-relaxed max-w-md">{s.desc}</p>

              {/* Search bar */}
              <div className="flex bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/30 mb-6">
                <div className="flex items-center pl-4 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  placeholder="Mahsulot yoki xizmat qidiring..."
                  className="flex-1 text-gray-800 px-4 py-4 text-sm focus:outline-none placeholder-gray-400"
                />
                <button
                  onClick={() => navigate(paths.products)}
                  className="m-1.5 px-6 rounded-xl text-white text-sm font-bold transition-all hover:bg-[#008F5A] active:scale-95 bg-[#00A86B]"
                >
                  {s.cta}
                </button>
              </div>

              {/* Popular tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white/40 text-xs">Trendda:</span>
                {["iPhone 15 Pro", "Samsung S24", "Nike Air", "Xiaomi 14", "MacBook"].map(t => (
                  <button
                    key={t}
                    onClick={() => navigate(paths.products)}
                    className="text-xs px-3 py-1 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/40 transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — product showcase */}
            <div className={`hidden md:flex items-center justify-center transition-all duration-300 ${animating ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"}`}>
              <div className="relative w-full max-w-sm">
                {/* Main card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 shadow-2xl">
                  <div className="relative rounded-2xl overflow-hidden mb-3">
                    <img
                      src={`https://images.unsplash.com/${s.img}?w=500&h=340&fit=crop&auto=format`}
                      alt=""
                      className="w-full h-52 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white bg-[#00A86B]">
                        {s.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-bold text-gray-800">4.9</span>
                      <span className="text-[10px] text-gray-500">(2.4K)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">Eng mashhur mahsulot</p>
                      <p className="text-white/50 text-xs mt-0.5">1,240 ta sotildi</p>
                    </div>
                    <button
                      onClick={() => navigate(paths.product(products[0].id))}
                      className="text-xs font-bold px-4 py-2 rounded-xl text-white bg-[#00A86B] hover:bg-[#008F5A] transition-all"
                    >
                      Ko'rish
                    </button>
                  </div>
                </div>

                {/* Floating mini-cards */}
                <div className="absolute -left-12 top-8 bg-white rounded-2xl shadow-2xl p-3 w-32 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🚚</span>
                    <span className="text-[10px] font-bold text-gray-800">Tez yetkazish</span>
                  </div>
                  <span className="text-[10px] text-[#00A86B] font-semibold">1-3 kun ichida</span>
                </div>

                <div className="absolute -right-10 bottom-10 bg-white rounded-2xl shadow-2xl p-3 w-36 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#E8F8F1] flex items-center justify-center text-xs text-[#00A86B] font-bold">✓</div>
                    <span className="text-[10px] font-bold text-gray-800">Kafolat</span>
                  </div>
                  <div className="flex -space-x-1.5">
                    {["1614680376573", "1607082348824", "1560472354-b33ff0c44a43"].map(id => (
                      <img key={id} src={`https://images.unsplash.com/photo-${id}?w=28&h=28&fit=crop`} className="w-6 h-6 rounded-full border-2 border-white object-cover" alt="" />
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-[#00A86B] flex items-center justify-center text-white text-[8px] font-bold">+8</div>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1">Bugun 840 ta xarid</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Slide controls ── */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              onClick={() => goTo((cur) => (cur - 1 + SLIDES.length) % SLIDES.length)}
              className="w-8 h-8 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${i === slide ? "w-6 h-2 bg-[#00A86B]" : "w-2 h-2 bg-white/30 hover:bg-white/50"}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo((cur) => (cur + 1) % SLIDES.length)}
              className="w-8 h-8 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {STATS.map(stat => (
              <div key={stat.label} className="flex items-center gap-3 justify-center">
                <span className="text-xl">{stat.icon}</span>
                <div>
                  <p className="text-lg font-black leading-tight text-[#6EE7B7]" style={{ fontFamily: "var(--font-sans)" }}>{stat.value}</p>
                  <p className="text-white/50 text-[11px]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>Kategoriyalar</h2>
          <button onClick={() => navigate(paths.products)} className="text-[#00A86B] text-sm font-medium hover:underline">
            Barchasini ko'rish →
          </button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
          {(loading ? [] : categories).map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(`${paths.products}?category=${cat.id}`)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:shadow-md transition-all hover:-translate-y-0.5 border"
              style={{ background: cat.bg, borderColor: "transparent" }}
            >
              <span className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center text-2xl">
                <CategoryGlyph icon={cat.icon} />
              </span>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Flash sale banner */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚡</span>
              <span className="font-black text-2xl" style={{ fontFamily: "var(--font-sans)" }}>Flash Sale</span>
              <div className="bg-white/20 rounded-lg px-3 py-1 font-mono text-sm font-bold">02:45:18</div>
            </div>
            <p className="text-white/80">Bugun soat 24:00 gacha 50% gacha chegirma!</p>
          </div>
          <button onClick={() => navigate(paths.products)} className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-yellow-50 shrink-0">
            Aksiyani ko'rish →
          </button>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>Mahsulotlar</h2>
          <div className="flex bg-gray-100 rounded-xl p-1">
            {[
              { id: "tavsiya", label: "Tavsiya etilgan" },
              { id: "yangi", label: "Yangi" },
              { id: "aksiya", label: "Aksiyada" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? "bg-white text-[#00A86B] shadow-sm" : "text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onFav={() => handleFav(p.id)}
              onCart={() => handleCart(p.id)}
              isFaved={favIds.includes(p.id)}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <button onClick={() => navigate(paths.products)} className="bg-[#00A86B] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#008F5A] transition-colors">
            Ko'proq mahsulot ko'rish
          </button>
        </div>
      </section>

      {/* Sellers */}
      <section className="bg-gray-50 py-12" style={{ background: "var(--muted)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "var(--font-sans)" }}>Mashhur sotuvchilar</h2>
            <button className="text-[#00A86B] text-sm font-medium hover:underline">Barchasini ko'rish →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sellers.map(seller => (
              <button
                key={seller.id}
                onClick={() => navigate(paths.store(seller.slug))}
                className="bg-white rounded-2xl p-4 border hover:shadow-md transition-all hover:-translate-y-0.5 text-left"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <img src={seller.logo || ""} alt={seller.name} className="w-10 h-10 rounded-xl object-cover" />
                  {seller.verified && (
                    <svg className="w-4 h-4 text-[#00A86B] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{seller.name}</h3>
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-3.5 h-3.5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-semibold">{seller.rating}</span>
                  <span className="text-xs text-gray-400">({seller.reviewCount})</span>
                </div>
                <p className="text-xs text-gray-400">{seller.productCount} mahsulot</p>
                <p className="text-xs text-gray-400">{seller.location}</p>
                <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full ${seller.subscription === "PRO" ? "bg-amber-50 text-amber-700" : seller.subscription === "BUSINESS" ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-600"}`}>
                  {seller.subscription}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-black text-center text-gray-900 mb-10" style={{ fontFamily: "var(--font-sans)" }}>Qanday ishlaydi?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { step: "01", icon: "🔍", title: "Mahsulotni toping", desc: "Qidiruv yoki kategoriyalar orqali kerakli mahsulotni toping" },
            { step: "02", icon: "🏪", title: "Sotuvchini tanlang", desc: "Sharhlar va baholarni o'rganib eng yaxshisini tanlang" },
            { step: "03", icon: "🛒", title: "Buyurtma bering", desc: "Savatga qo'shing va qulay to'lov usulini tanlang" },
            { step: "04", icon: "📦", title: "Mahsulotni oling", desc: "Tez va xavfsiz yetkazib berish orqali mahsulotingizni qabul qiling" },
          ].map(step => (
            <div key={step.step} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#E8F8F1] flex items-center justify-center text-3xl mx-auto mb-4">
                {step.icon}
              </div>
              <div className="text-xs font-mono font-bold text-[#F59E0B] mb-1">{step.step}</div>
              <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seller CTA */}
      <section className="bg-[#00A86B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <span>💼</span>
              <span>Biznes egalariga</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: "var(--font-sans)" }}>
              Biznesingizni yangi mijozlar bilan bog'lang
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Platform orqali biznesingizni rivojlantiring. Millionlab foydalanuvchilarga mahsulotlaringizni ko'rsating.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                "Millionlab foydalanuvchilarga kirish",
                "Professional seller kabineti",
                "Kuchli analytika va statistika",
                "Reklama va promoushan imkoniyatlari",
              ].map(f => (
                <div key={f} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-white/80">{f}</span>
                </div>
              ))}
            </div>
            <a href={dashboardUrl("/?register=1")} className="inline-block bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold px-8 py-4 rounded-xl text-lg">
              Sotuvchi bo'lish →
            </a>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 rounded-3xl p-6 border border-white/20">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Oylik daromad", value: "45.2M", change: "+18%" },
                  { label: "Buyurtmalar", value: "1,284", change: "+24%" },
                  { label: "Ko'rishlar", value: "38,400", change: "+32%" },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/10 rounded-xl p-3">
                    <p className="text-white/60 text-xs mb-1">{stat.label}</p>
                    <p className="font-black text-lg font-mono">{stat.value}</p>
                    <p className="text-green-400 text-xs">{stat.change}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-semibold">Oylik savdo</p>
                  <span className="text-xs text-green-400">+18.4%</span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[40, 65, 55, 80, 70, 90, 75, 95, 85, 100, 90, 110].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/20 rounded-t" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🛡️", title: "Xavfsiz to'lov", desc: "Barcha to'lovlar shifrlangan va xavfsiz" },
            { icon: "↩️", title: "Oson qaytarish", desc: "14 kun ichida qaytarish kafolati" },
            { icon: "🚚", title: "Tez yetkazish", desc: "O'zbekiston bo'ylab 1-3 kun ichida" },
            { icon: "⭐", title: "Sifat kafolati", desc: "Tasdiqlangan sotuvchilardan sifatli mahsulotlar" },
          ].map(t => (
            <div key={t.title} className="flex items-start gap-3 p-4 bg-white rounded-2xl border" style={{ borderColor: "var(--border)" }}>
              <span className="text-2xl">{t.icon}</span>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">{t.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
