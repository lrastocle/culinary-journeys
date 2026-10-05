/**
 * Balises <head> des pages : titre, description, canonical absolu, hreflang FR/EN,
 * Open Graph et données structurées Schema.org.
 */
import type { SiteData } from "@/lib/cms/api";
import type { Media, Meta, Rel } from "@/lib/cms/types";
import { isPopulated } from "@/lib/cms/types";
import type { Alternates, Lang } from "@/lib/paths";
import { internationalPhone } from "@/lib/site";

type Matches = { routeId: string; loaderData?: unknown }[];

/** Réglages du site, chargés par la route racine (disponibles dans head()). */
export const siteFrom = (matches: Matches): SiteData =>
  (matches.find((m) => m.routeId === "__root__")?.loaderData as SiteData | undefined) ?? {
    siteUrl: "",
    settings: null,
  };

const imageUrl = (image: Rel<Media>) =>
  isPopulated(image) ? image.sizes?.hero?.url || image.sizes?.tablet?.url || image.url || null : null;

export type HeadInput = {
  matches: Matches;
  lang: Lang;
  title: string;
  description?: string | null | undefined;
  /** Adresse de la page dans chaque langue ; la langue courante sert de canonical. */
  alternates: Alternates;
  image?: Rel<Media> | undefined;
  meta?: Meta | undefined;
  type?: "website" | "article" | undefined;
  /** Titre seul (accueil) ou suivi du nom du site. */
  bareTitle?: boolean | undefined;
  jsonLd?: Record<string, unknown>[] | undefined;
  noindex?: boolean | undefined;
};

export function buildHead(input: HeadInput) {
  const { siteUrl, settings } = siteFrom(input.matches);
  const siteName = settings?.siteName || "Tété Dwèt";
  const pageTitle = input.meta?.title || input.title;
  const title = input.bareTitle ? pageTitle : `${pageTitle} — ${siteName}`;
  const description = (input.meta?.description || input.description || settings?.tagline || "").slice(0, 300);
  const path = input.alternates[input.lang] || "/";
  const url = `${siteUrl}${path}`;
  const image = imageUrl(input.meta?.image) || imageUrl(input.image) || imageUrl(settings?.defaultImage);

  const meta: Record<string, string>[] = [
    { title },
    ...(description ? [{ name: "description", content: description }] : []),
    { property: "og:title", content: title },
    ...(description ? [{ property: "og:description", content: description }] : []),
    { property: "og:type", content: input.type || "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: siteName },
    { property: "og:locale", content: input.lang === "en" ? "en_GB" : "fr_FR" },
    ...(image ? [{ property: "og:image", content: image }] : []),
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    ...(input.noindex ? [{ name: "robots", content: "noindex" }] : []),
  ];

  const links: Record<string, string>[] = [{ rel: "canonical", href: url }];
  const { fr, en } = input.alternates;
  if (fr && en) {
    links.push(
      { rel: "alternate", hrefLang: "fr", href: `${siteUrl}${fr}` },
      { rel: "alternate", hrefLang: "en", href: `${siteUrl}${en}` },
      { rel: "alternate", hrefLang: "x-default", href: `${siteUrl}${fr}` },
    );
  }

  const scripts = (input.jsonLd || []).map((data) => ({
    type: "application/ld+json",
    children: JSON.stringify({ "@context": "https://schema.org", ...data }),
  }));

  return { meta, links, scripts };
}

/** Entreprise (accueil) : coordonnées et réseaux de l'admin. */
export function localBusinessLd(site: SiteData): Record<string, unknown> {
  const s = site.settings;
  return {
    "@type": "LocalBusiness",
    "@id": `${site.siteUrl}/#business`,
    name: s?.siteName || "Tété Dwèt",
    url: `${site.siteUrl}/`,
    ...(s?.tagline ? { description: s.tagline } : {}),
    ...(imageUrl(s?.defaultImage) ? { image: imageUrl(s?.defaultImage) } : {}),
    ...(s?.contact?.email ? { email: s.contact.email } : {}),
    ...(s?.contact?.phone ? { telephone: internationalPhone(s.contact.phone) } : {}),
    address: {
      "@type": "PostalAddress",
      ...(s?.contact?.address ? { streetAddress: s.contact.address } : {}),
      addressLocality: "Fort-de-France",
      addressRegion: "Martinique",
      addressCountry: "MQ",
    },
    ...(s?.socials?.length ? { sameAs: s.socials.map((social) => social.url) } : {}),
  };
}

export { imageUrl };
