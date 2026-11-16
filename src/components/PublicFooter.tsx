import logoImg from "../assets/logo1.png";
import Reveal from "./Reveal";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { paths } from "../routes/paths";
import { dashboardUrl } from "../lib/links";
import { PLATFORM } from "../lib/wedding/catalog";

export default function PublicFooter() {
  const navigate = useAppNavigate();
  return (
    <footer className="bg-[#0F172A] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <Reveal className="md:col-span-2">
        <div>
          <button type="button" onClick={() => navigate(paths.home)} className="inline-flex rounded-2xl bg-white px-3 py-2" aria-label="To'yxona">
            <img src={logoImg} alt="To'yxona" className="h-12 w-auto object-contain" />
          </button>
          <p className="text-gray-400 text-sm leading-relaxed mt-4 max-w-md">
            O&apos;zbekistondagi to&apos;yxonalar va to&apos;y mutaxassislari uchun yagona bron platformasi. Komissiyasiz, to&apos;g&apos;ridan-to&apos;g&apos;ri to&apos;yxona bilan.
          </p>
        </div>
        </Reveal>
        <Reveal delay={90}>
        <div>
          <h4 className="font-semibold text-sm mb-4">Platforma</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><button type="button" onClick={() => navigate(paths.home)} className="hover:text-white">Bosh sahifa</button></li>
            <li><button type="button" onClick={() => navigate(paths.catalog)} className="hover:text-white">To&apos;yxonalar</button></li>
            <li><button type="button" onClick={() => navigate(paths.specialists)} className="hover:text-white">Mutaxassislar</button></li>
            <li><button type="button" onClick={() => navigate(paths.specialistJoin)} className="hover:text-white">Mutaxassis bo&apos;lish</button></li>
          </ul>
        </div>
        </Reveal>
        <Reveal delay={160}>
        <div>
          <h4 className="font-semibold text-sm mb-4">Biz bilan bog&apos;lanish</h4>
          <a href={PLATFORM.phoneHref} className="block text-sm text-gray-300 hover:text-white">{PLATFORM.phone}</a>
          <a href={`mailto:${PLATFORM.email}`} className="block text-sm text-gray-300 hover:text-white mt-2">{PLATFORM.email}</a>
          <a href={dashboardUrl("/?register=1")} className="inline-block mt-4 text-sm font-semibold text-[#6EE7B7]">To&apos;yxona qo&apos;shish</a>
        </div>
        </Reveal>
      </div>
      <div className="border-t border-white/10">
        <p className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500">© 2026 To&apos;yxona — yagona raqamli platforma</p>
      </div>
    </footer>
  );
}
