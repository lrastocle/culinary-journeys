/**
 * sitemap.xml : toutes les adresses publiées, avec leurs versions FR/EN liées
 * (xhtml:link hreflang). Un contenu non traduit n'a que son adresse française.
 */
import { docPath, sectionPath, type ContentCollection, type Lang, type Section } from "@/lib/paths";

import { cmsConfig, cmsFetch } from "./fetch.server";
import type { Paginated } from "./types";

type Localized = Partial<Record<Lang, string | null>>;
type Entry = { paths: Partial<Record<Lang, string>>; lastmod: string | undefined };

const SECTIONS: Section[] = ["home", "activities", "blog", "shop", "team", "contact"];
const COLLECTIONS: { collection: ContentCollection; titleField: string }[] = [
  { collection: "pages", titleField: "title" },
  { collection: "posts", titleField: "title" },
  { collection: "activities", titleField: "title" },
  { collection: "products", titleField: "title" },
  { collection: "categories", titleField: "name" },
  { collection: "tags", titleField: "name" },
];

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function buildSitemap(): Promise<string> {
  const { site, siteUrl } = cmsConfig();
  const entries: Entry[] = SECTIONS.map((section) => ({
    paths: { fr: sectionPath(section, "fr"), en: sectionPath(section, "en") },
    lastmod: undefined,
  }));

  const settings = await cmsFetch<Paginated<{ homePage?: number | { id: number } | null }>>("site-settings", {
    where: { "tenant.slug": { equals: site } },
    depth: 0,
    limit: 1,
  });
  const home = settings.docs[0]?.homePage;
  const homeID = typeof home === "object" && home ? home.id : home;

  const today = new Date().toISOString().slice(0, 10);
  for (const { collection, titleField } of COLLECTIONS) {
    const where: Record<string, unknown>[] = [{ "tenant.slug": { equals: site } }];
    if (collection === "products") {
      where.push(
        { or: [{ availableFrom: { exists: false } }, { availableFrom: { less_than_equal: today } }] },
        { or: [{ availableUntil: { exists: false } }, { availableUntil: { greater_than_equal: today } }] },
      );
    }
    const { docs } = await cmsFetch<Paginated<Record<string, unknown>>>(collection, {
      where: { and: where },
      locale: "all",
      depth: 0,
      limit: 5000,
      select: { slug: true, [titleField]: true, updatedAt: true },
    });
    for (const doc of docs) {
      if (collection === "pages" && doc["id"] === homeID) continue; // déjà servie à la racine
      const slug = (doc["slug"] || {}) as Localized;
      const title = (doc[titleField] || {}) as Localized;
      const paths: Entry["paths"] = {};
      for (const lang of ["fr", "en"] as const) {
        // Taxonomies : nom non traduit = même nom dans les deux langues, slug français.
        if (title[lang] && (slug[lang] || slug.fr)) paths[lang] = docPath(collection, (slug[lang] || slug.fr)!, lang);
      }
      if (!title.en) delete paths.en;
      if (paths.fr || paths.en) entries.push({ paths, lastmod: String(doc["updatedAt"] || "").slice(0, 10) || undefined });
    }
  }

  const urls = entries.flatMap(({ paths, lastmod }) => {
    const alternates =
      paths.fr && paths.en
        ? [
            `<xhtml:link rel="alternate" hreflang="fr" href="${escape(siteUrl + paths.fr)}"/>`,
            `<xhtml:link rel="alternate" hreflang="en" href="${escape(siteUrl + paths.en)}"/>`,
            `<xhtml:link rel="alternate" hreflang="x-default" href="${escape(siteUrl + paths.fr)}"/>`,
          ].join("")
        : "";
    return (["fr", "en"] as const)
      .filter((lang) => paths[lang])
      .map(
        (lang) =>
          `<url><loc>${escape(siteUrl + paths[lang]!)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}${alternates}</url>`,
      );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}
