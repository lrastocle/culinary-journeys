/**
 * Adresses publiques du site. Le français est à la racine, l'anglais sous /en/,
 * toutes les adresses finissent par / (comme sur l'ancien WordPress).
 *
 * Les adresses des contenus doivent rester identiques à celles calculées par l'admin
 * (admin/src/utilities/publicPath.ts) : aperçu SEO, redirections, import WordPress.
 */
export type Lang = "fr" | "en";

export type ContentCollection =
  | "pages"
  | "posts"
  | "categories"
  | "tags"
  | "activities"
  | "products";

const prefixes: Record<ContentCollection, Record<Lang, string>> = {
  pages: { fr: "", en: "" },
  posts: { fr: "", en: "" },
  categories: { fr: "/category", en: "/category" },
  tags: { fr: "/tag", en: "/tag" },
  activities: { fr: "/visites", en: "/tours" },
  products: { fr: "/boutique", en: "/shop" },
};

/** Pages propres au site (listes, équipe, contact). */
const sections = {
  home: { fr: "/", en: "/" },
  blog: { fr: "/blog/", en: "/blog/" },
  activities: { fr: "/visites/", en: "/tours/" },
  shop: { fr: "/boutique/", en: "/shop/" },
  team: { fr: "/equipe/", en: "/team/" },
  contact: { fr: "/contact/", en: "/contact/" },
} as const;

export type Section = keyof typeof sections;

const root = (lang: Lang) => (lang === "en" ? "/en" : "");

export const sectionPath = (section: Section, lang: Lang) =>
  `${root(lang)}${sections[section][lang]}`;

export const isContentCollection = (value: string): value is ContentCollection =>
  value in prefixes;

export const docPath = (collection: ContentCollection, slug: string, lang: Lang) =>
  `${root(lang)}${prefixes[collection][lang]}/${slug}/`;

export const langFromPath = (pathname: string): Lang =>
  pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";

/** Adresse d'une page dans les deux langues (null : pas de version dans cette langue). */
export type Alternates = Record<Lang, string | null>;

export const sectionAlternates = (section: Section): Alternates => ({
  fr: sectionPath(section, "fr"),
  en: sectionPath(section, "en"),
});

/** Lien de réservation FareHarbor (ouvert en surimpression par le script FareHarbor). */
export const fareharborUrl = (shortname: string, itemId: string, flowId?: string | null) =>
  `https://fareharbor.com/embeds/book/${encodeURIComponent(shortname)}/items/${encodeURIComponent(itemId)}/?full-items=yes${
    flowId ? `&flow=${encodeURIComponent(flowId)}` : ""
  }`;
