import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export function Header() {
  const { lang, setLang, t } = useLang();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl border-2 border-ink bg-hibiscus font-display text-xl font-black text-cream">
            TD
          </div>
          <div className="leading-none">
            <span className="block font-display text-lg font-extrabold tracking-tight">
              Tété Dwèt<span className="text-hibiscus">.</span>
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/50">
              Martinique
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex">
          <Link to="/" hash="experiences" className="hover:text-hibiscus">
            {t.nav.experiences}
          </Link>
          <Link to="/qui-sommes-nous" className="hover:text-hibiscus">
            {t.nav.about}
          </Link>
          <Link to="/magazine" className="hover:text-hibiscus">
            {t.nav.magazine}
          </Link>
          <Link to="/boutique" className="hover:text-hibiscus">
            {t.nav.shop}
          </Link>
          <Link to="/equipe" className="hover:text-hibiscus">
            {t.nav.team}
          </Link>
          <Link to="/contact" className="hover:text-hibiscus">
            {t.nav.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-full border-2 border-ink text-xs font-bold">
            <button
              onClick={() => setLang("fr")}
              className={
                lang === "fr" ? "bg-ink px-3 py-1.5 text-cream" : "px-3 py-1.5"
              }
            >
              FR
            </button>
            <button
              onClick={() => setLang("en")}
              className={
                lang === "en" ? "bg-ink px-3 py-1.5 text-cream" : "px-3 py-1.5"
              }
            >
              EN
            </button>
          </div>
          <Link
            to="/contact"
            className="btn-pop hidden rounded-full bg-sun px-5 py-2 font-display text-sm font-extrabold sm:inline-block"
          >
            {t.nav.book}
          </Link>
        </div>
      </div>
    </header>
  );
}
