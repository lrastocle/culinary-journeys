import { useMatches, useRouterState } from "@tanstack/react-router";

import { SiteLink } from "@/components/SiteLink";
import { useLang } from "@/lib/i18n";
import { docPath, sectionPath, type Alternates, type Lang } from "@/lib/paths";
import { useSite } from "@/lib/site";

/** Rubriques dont l'adresse diffère selon la langue (pour le changement de langue). */
const SECTION_PAIRS: [string, string][] = [
  ["/", "/en/"],
  ["/visites/", "/en/tours/"],
  ["/boutique/", "/en/shop/"],
  ["/equipe/", "/en/team/"],
  ["/blog/", "/en/blog/"],
  ["/contact/", "/en/contact/"],
];

/** Adresse de la page courante dans l'autre langue (sinon l'accueil de cette langue). */
function useSwitchHref(target: Lang) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const alternates = useMatches({
    select: (matches) =>
      [...matches]
        .reverse()
        .map((m) => (m.loaderData as { alternates?: Alternates } | undefined)?.alternates)
        .find(Boolean),
  });
  if (alternates) return alternates[target] ?? sectionPath("home", target);
  const pair = SECTION_PAIRS.find(([fr, en]) => fr === pathname || en === pathname);
  return pair ? pair[target === "fr" ? 0 : 1] : sectionPath("home", target);
}

export function Header() {
  const { lang, t } = useLang();
  const { settings } = useSite();
  const other: Lang = lang === "fr" ? "en" : "fr";
  const switchHref = useSwitchHref(other);

  const links = [
    { href: sectionPath("activities", lang), label: t.nav.activities },
    { href: docPath("pages", lang === "fr" ? "qui-sommes-nous" : "about-us", lang), label: t.nav.about },
    { href: sectionPath("blog", lang), label: t.nav.blog },
    { href: sectionPath("shop", lang), label: t.nav.shop },
    { href: sectionPath("team", lang), label: t.nav.team },
    { href: sectionPath("contact", lang), label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream/95 backdrop-blur-sm">
      {settings?.announcement && (
        <p className="border-b-2 border-ink bg-hibiscus px-4 py-2 text-center text-sm font-bold text-cream">
          {settings.announcement}
        </p>
      )}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <SiteLink href={sectionPath("home", lang)} className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl border-2 border-ink bg-hibiscus font-display text-xl font-black text-cream">
            TD
          </div>
          <div className="leading-none">
            <span className="block font-display text-lg font-extrabold tracking-tight">
              {settings?.siteName || "Tété Dwèt"}
              <span className="text-hibiscus">.</span>
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/50">Martinique</span>
          </div>
        </SiteLink>

        <nav aria-label={t.nav.menu} className="hidden items-center gap-6 text-sm font-semibold lg:flex">
          {links.map((link) => (
            <SiteLink key={link.href} href={link.href} className="hover:text-hibiscus">
              {link.label}
            </SiteLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SiteLink
            href={switchHref}
            hrefLang={other}
            lang={other}
            className="rounded-full border-2 border-ink px-3 py-1.5 text-xs font-bold hover:bg-ink hover:text-cream"
            aria-label={t.nav.switchTo}
          >
            {other.toUpperCase()}
          </SiteLink>
          <SiteLink
            href={sectionPath("activities", lang)}
            className="btn-pop hidden rounded-full bg-sun px-5 py-2 font-display text-sm font-extrabold sm:inline-block"
          >
            {t.nav.book}
          </SiteLink>
          {/* Menu mobile : sans JavaScript. */}
          <details className="relative lg:hidden">
            <summary className="cursor-pointer list-none rounded-full border-2 border-ink px-3 py-1.5 text-xs font-bold">
              {t.nav.menu}
            </summary>
            <nav
              aria-label={t.nav.menu}
              className="shadow-pop absolute right-0 mt-3 grid w-56 gap-1 rounded-2xl border-2 border-ink bg-cream p-3 text-sm font-semibold"
            >
              {links.map((link) => (
                <SiteLink key={link.href} href={link.href} className="rounded-xl px-3 py-2 hover:bg-sun">
                  {link.label}
                </SiteLink>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
