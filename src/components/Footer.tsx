import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t-2 border-ink bg-sun py-14 text-ink">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center">
        <h3 className="max-w-3xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
          {t.footer.titleA}
          <br />
          <span className="italic text-hibiscus">{t.footer.titleB}</span>
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            className="btn-pop rounded-full bg-cream px-8 py-4 font-display text-base font-extrabold"
          >
            {t.footer.cta1}
          </Link>
          <Link
            to="/contact"
            className="rounded-full border-2 border-ink px-8 py-4 font-display text-base font-extrabold transition-colors hover:bg-cream/50"
          >
            {t.footer.cta2}
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold">
          <span>{t.footer.address}</span>
          <a href="mailto:bonjour@tetedwet.com" className="underline">
            bonjour@tetedwet.com
          </a>
          <a href="tel:+596696000000">+596 696 00 00 00</a>
        </div>
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-ink/60">
          {t.footer.rights}
        </span>
      </div>
    </footer>
  );
}
