import { createContext, useContext } from "react";

import type { SiteData } from "@/lib/cms/api";
import type { LinkValue, SectionKey, ThemeColor } from "@/lib/cms/types";
import { isPopulated } from "@/lib/cms/types";
import { docPath, fareharborUrl, isContentCollection, type Lang } from "@/lib/paths";

/** Données du site (réglages de l'admin), chargées par la route racine et fournies à toutes les pages. */
export const SiteContext = createContext<SiteData>({ siteUrl: "", settings: null });

export function useSite(): SiteData {
  return useContext(SiteContext);
}

/** Titre et introduction d'une rubrique : texte de l'admin, sinon texte par défaut. */
export function useSection(key: SectionKey, fallback: { title: string; intro: string }) {
  const { settings } = useSite();
  const section = settings?.sections?.[key];
  return { title: section?.title || fallback.title, intro: section?.intro || fallback.intro };
}

/** Couleurs du thème : fond, texte, et couleur de mise en valeur adaptée au fond. */
export const themes: Record<ThemeColor, { bg: string; text: string; accent: string; muted: string }> = {
  sun: { bg: "bg-sun", text: "text-ink", accent: "text-hibiscus", muted: "text-ink/75" },
  mango: { bg: "bg-mango", text: "text-cream", accent: "text-ink", muted: "text-cream/90" },
  hibiscus: { bg: "bg-hibiscus", text: "text-cream", accent: "text-sun", muted: "text-cream/90" },
  leaf: { bg: "bg-leaf", text: "text-cream", accent: "text-sun", muted: "text-cream/90" },
  sea: { bg: "bg-sea", text: "text-cream", accent: "text-sun", muted: "text-cream/90" },
  plum: { bg: "bg-plum", text: "text-cream", accent: "text-sun", muted: "text-cream/90" },
  cream: { bg: "bg-cream", text: "text-ink", accent: "text-hibiscus", muted: "text-ink/70" },
  ink: { bg: "bg-ink", text: "text-cream", accent: "text-sun", muted: "text-cream/80" },
};

export const theme = (color: ThemeColor | null | undefined, fallback: ThemeColor) => themes[color || fallback];

/**
 * Adresse interne saisie dans l'admin (en français, ex. /equipe/) → adresse dans la langue
 * de la page. Les rubriques connues ont leur équivalent anglais ; le reste est préfixé /en.
 */
const EN_SECTIONS: Record<string, string> = {
  "/": "/en/",
  "/equipe/": "/en/team/",
  "/visites/": "/en/tours/",
  "/boutique/": "/en/shop/",
  "/blog/": "/en/blog/",
  "/contact/": "/en/contact/",
};

export const localizeHref = (href: string, lang: Lang) => {
  if (lang === "fr" || !href.startsWith("/") || href.startsWith("//") || href.startsWith("/en/")) return href;
  const [path = href, rest = ""] = href.split(/(?=[?#])/);
  return (EN_SECTIONS[path] ?? `/en${path}`) + rest;
};

/** Adresse d'un bouton de l'admin (contenu du site, adresse saisie ou réservation FareHarbor). */
export const linkHref = (
  link: LinkValue | null | undefined,
  lang: Lang,
  fareharbor: { shortname?: string | null; flowId?: string | null } | null | undefined,
) => {
  if (!link) return null;
  if (link.type === "fareharbor") {
    return link.fareharborItemId && fareharbor?.shortname
      ? fareharborUrl(fareharbor.shortname, link.fareharborItemId, fareharbor.flowId)
      : null;
  }
  if (link.type === "reference") {
    const ref = link.reference;
    if (ref && isContentCollection(ref.relationTo) && isPopulated(ref.value) && ref.value.slug) {
      return docPath(ref.relationTo, ref.value.slug, lang);
    }
    return null;
  }
  return link.url ? localizeHref(link.url, lang) : null;
};

export const formatPrice = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);

export const formatDate = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
