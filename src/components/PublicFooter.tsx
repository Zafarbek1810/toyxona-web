import Logo from "./Logo";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { paths } from "../routes/paths";
import { dashboardUrl } from "../lib/links";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.788.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 1.878 4.267 4.321v6.42zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
] as const;

export default function PublicFooter() {
  const navigate = useAppNavigate();

  return (
    <footer className="bg-[#0F172A] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="mb-4">
              <Logo size="md" variant="light" onClick={() => navigate(paths.home)} />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              O'zbekistondagi eng ishonchli to'y xizmatlari platformasi. Minglab to'yxonalar, dekoratorlar va xizmat ko'rsatuvchilar.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Platforma</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Bosh sahifa", "Kategoriyalar", "Xizmatlar", "Hamkorlar", "Aksiyalar"].map(l => (
                <li key={l}><button onClick={() => navigate(paths.home)} className="hover:text-white transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Hamkorlar uchun</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { label: "Ro'yxatdan o'tish", href: dashboardUrl("/?register=1") },
                { label: "Obuna rejalari", href: dashboardUrl("/?register=1") },
                { label: "Seller kabineti", href: dashboardUrl("/") },
                { label: "Xizmat qo'shish", href: dashboardUrl("/") },
                { label: "Yordam markazi", href: dashboardUrl("/") },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-white transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Qo'llab-quvvatlash</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Yordam markazi", "Mijozlar uchun", "Qaytarish", "To'lov usullari", "Biz haqimizda", "Aloqa"].map(l => (
                <li key={l}><button className="hover:text-white transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2024 To'yxona. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <button className="hover:text-white">Foydalanish shartlari</button>
            <button className="hover:text-white">Maxfiylik siyosati</button>
            <button className="hover:text-white">Cookie</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">To'lov usullari:</span>
            {["Payme", "Click", "Uzum"].map(p => (
              <span key={p} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
