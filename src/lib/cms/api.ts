/**
 * Fonctions serveur appelées par les routes (loaders) : elles interrogent l'admin
 * côté serveur et renvoient au navigateur uniquement les données utiles.
 *
 * Langues : en français, les contenus sont lus normalement ; en anglais, sans repli
 * sur le français (fallback-locale=none) et seulement s'ils sont traduits — une page
 * non traduite n'existe pas sous /en/ (pas de contenu dupliqué pour Google).
 */
import { createServerFn } from "@tanstack/react-start";

import type { Alternates, ContentCollection, Lang } from "@/lib/paths";
import { docPath } from "@/lib/paths";

import { cmsConfig, cmsFetch, cmsPost } from "./fetch.server";
import type {
  Activity,
  Form,
  ID,
  Page,
  PageBlock,
  Paginated,
  Post,
  PressMention,
  Product,
  SiteSettings,
  Taxonomy,
  TeamMember,
} from "./types";
import { isPopulated } from "./types";

// ─── Validation des paramètres ──────────────────────────────────────────────

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const asLang = (value: unknown): Lang => (value === "en" ? "en" : "fr");
const asSlug = (value: unknown): string => {
  if (typeof value !== "string" || !SLUG.test(value)) throw new Error("Adresse invalide");
  return value;
};
const asPage = (value: unknown) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n < 1000 ? n : 1;
};

// ─── Requêtes communes ──────────────────────────────────────────────────────

const localeQuery = (lang: Lang) =>
  lang === "en" ? { locale: "en", "fallback-locale": "none" } : { locale: "fr" };

/** Contenus du site, et en anglais seulement ceux qui ont un titre (traduits). */
const scope = (lang: Lang, extra: Record<string, unknown>[] = [], titleField = "title") => ({
  and: [
    { "tenant.slug": { equals: cmsConfig().site } },
    ...(lang === "en" ? [{ [titleField]: { exists: true } }] : []),
    ...extra,
  ],
});

const find = <T>(
  collection: string,
  lang: Lang,
  options: {
    where?: Record<string, unknown>[];
    sort?: string;
    limit?: number;
    page?: number;
    depth?: number;
    titleField?: string;
  } = {},
) =>
  cmsFetch<Paginated<T>>(collection, {
    ...localeQuery(lang),
    where: scope(lang, options.where, options.titleField),
    sort: options.sort,
    limit: options.limit ?? 100,
    page: options.page,
    depth: options.depth ?? 1,
  });

/** Adresses d'un contenu dans chaque langue (la version EN n'existe que si elle est traduite). */
const alternatesOf = async (
  collection: ContentCollection,
  id: ID,
  titleField = "title",
): Promise<Alternates> => {
  const doc = await cmsFetch<Record<string, Record<string, string | null> | undefined>>(
    `${collection}/${id}`,
    { locale: "all", depth: 0, select: { slug: true, [titleField]: true } },
  );
  const slug = doc["slug"] || {};
  const title = doc[titleField] || {};
  return {
    fr: slug["fr"] && title["fr"] ? docPath(collection, slug["fr"], "fr") : null,
    en: slug["en"] && title["en"] ? docPath(collection, slug["en"], "en") : null,
  };
};

/** Produits affichables aujourd'hui (dates d'affichage vides = toujours). */
const visibleProductsWhere = () => {
  const today = new Date().toISOString().slice(0, 10);
  return [
    { or: [{ availableFrom: { exists: false } }, { availableFrom: { less_than_equal: today } }] },
    { or: [{ availableUntil: { exists: false } }, { availableUntil: { greater_than_equal: today } }] },
  ];
};

const getSettings = async (lang: Lang) => {
  const { docs } = await cmsFetch<Paginated<SiteSettings>>("site-settings", {
    ...localeQuery(lang),
    where: { "tenant.slug": { equals: cmsConfig().site } },
    limit: 1,
    depth: 1,
  });
  return docs[0] ?? null;
};

// ─── Site (en-tête, pied de page, SEO) ─────────────────────────────────────

export type SiteData = {
  siteUrl: string;
  settings: SiteSettings | null;
};

export const getSite = createServerFn({ method: "GET" })
  .validator((input: { lang: Lang }) => ({ lang: asLang(input?.lang) }))
  .handler(async ({ data }): Promise<SiteData> => {
    const settings = await getSettings(data.lang).catch((error: unknown) => {
      console.error(error);
      return null;
    });
    // La page d'accueil n'est utile qu'à getHome : on ne garde que son identifiant.
    if (settings && isPopulated(settings.homePage)) settings.homePage = settings.homePage.id;
    return { siteUrl: cmsConfig().siteUrl, settings };
  });

// ─── Données des blocs de page ─────────────────────────────────────────────

export type BlockData = {
  activities?: Activity[];
  products?: Product[];
  posts?: Post[];
  team?: TeamMember[];
  press?: PressMention[];
};

const loadBlockData = async (blocks: PageBlock[], lang: Lang) => {
  const result: Record<string, BlockData> = {};
  await Promise.all(
    blocks.map(async (block, index) => {
      const key = block.id || String(index);
      switch (block.blockType) {
        case "activitiesList": {
          if (block.selection === "manual") {
            result[key] = { activities: (block.items || []).filter(isPopulated) };
            break;
          }
          const where = [
            ...(block.activityType ? [{ type: { equals: block.activityType } }] : []),
            ...(block.selection === "featured" ? [{ featured: { equals: true } }] : []),
          ];
          result[key] = { activities: (await find<Activity>("activities", lang, { where, sort: "order" })).docs };
          break;
        }
        case "productsList": {
          if (block.selection === "manual") {
            result[key] = { products: (block.items || []).filter(isPopulated) };
            break;
          }
          const where = [
            ...visibleProductsWhere(),
            ...(block.selection === "featured" ? [{ featured: { equals: true } }] : []),
          ];
          result[key] = { products: (await find<Product>("products", lang, { where, sort: "order" })).docs };
          break;
        }
        case "postsList": {
          const category = block.category && (isPopulated(block.category) ? block.category.id : block.category);
          const where = category ? [{ categories: { in: [category] } }] : [];
          result[key] = {
            posts: (await find<Post>("posts", lang, { where, sort: "-publishedAt", limit: block.limit || 3 })).docs,
          };
          break;
        }
        case "team":
          result[key] = { team: (await find<TeamMember>("team-members", lang, { sort: "order", titleField: "name" })).docs };
          break;
        case "press":
          result[key] = {
            press: (await find<PressMention>("press-mentions", lang, { sort: "-date", limit: block.limit || 100 })).docs,
          };
          break;
      }
    }),
  );
  return result;
};

// ─── Accueil ───────────────────────────────────────────────────────────────

export type HomeData = {
  /** Page d'accueil composée dans l'admin (choisie dans les réglages et publiée). */
  page: Page | null;
  blockData: Record<string, BlockData>;
  alternates: Alternates;
  /** Sans page d'accueil publiée : la liste des expériences. */
  activities: Activity[];
};

export const getHome = createServerFn({ method: "GET" })
  .validator((input: { lang: Lang }) => ({ lang: asLang(input?.lang) }))
  .handler(async ({ data: { lang } }): Promise<HomeData> => {
    const alternates: Alternates = { fr: "/", en: "/en/" };
    const settings = await getSettings(lang);
    const homeID = settings?.homePage && (isPopulated(settings.homePage) ? settings.homePage.id : settings.homePage);
    const page = homeID
      ? (await find<Page>("pages", lang, { where: [{ id: { equals: homeID } }], depth: 2, limit: 1 })).docs[0] ?? null
      : null;
    if (page?.layout?.length) {
      return { page, blockData: await loadBlockData(page.layout, lang), alternates, activities: [] };
    }
    const activities = await find<Activity>("activities", lang, { sort: "order" });
    return { page: null, blockData: {}, alternates, activities: activities.docs };
  });

// ─── Pages et articles (à la racine du site) ───────────────────────────────

export type ContentData =
  | { kind: "page"; page: Page; blockData: Record<string, BlockData>; alternates: Alternates }
  | { kind: "post"; post: Post; related: Post[]; alternates: Alternates };

export const getContent = createServerFn({ method: "GET" })
  .validator((input: { lang: Lang; slug: string }) => ({ lang: asLang(input?.lang), slug: asSlug(input?.slug) }))
  .handler(async ({ data: { lang, slug } }): Promise<ContentData | null> => {
    const where = [{ slug: { equals: slug } }];
    const [pages, posts] = await Promise.all([
      find<Page>("pages", lang, { where, depth: 2, limit: 1 }),
      find<Post>("posts", lang, { where, depth: 2, limit: 1 }),
    ]);
    const page = pages.docs[0];
    if (page) {
      return {
        kind: "page",
        page,
        blockData: await loadBlockData(page.layout || [], lang),
        alternates: await alternatesOf("pages", page.id),
      };
    }
    const post = posts.docs[0];
    if (!post) return null;
    const categoryIDs = (post.categories || []).map((c) => (isPopulated(c) ? c.id : c)).filter(Boolean);
    const [related, alternates] = await Promise.all([
      categoryIDs.length
        ? find<Post>("posts", lang, {
            where: [{ categories: { in: categoryIDs } }, { id: { not_equals: post.id } }],
            sort: "-publishedAt",
            limit: 3,
          })
        : Promise.resolve({ docs: [] as Post[] }),
      alternatesOf("posts", post.id),
    ]);
    return { kind: "post", post, related: related.docs, alternates };
  });

// ─── Blog, catégories, étiquettes ──────────────────────────────────────────

export type PostListData = {
  posts: Paginated<Post>;
  term: Taxonomy | null;
  alternates: Alternates;
};

export const getPostList = createServerFn({ method: "GET" })
  .validator((input: { lang: Lang; page?: number | undefined; taxonomy?: "categories" | "tags" | undefined; slug?: string | undefined }) => ({
    lang: asLang(input?.lang),
    page: asPage(input?.page),
    taxonomy: input?.taxonomy === "categories" || input?.taxonomy === "tags" ? input.taxonomy : undefined,
    slug: input?.taxonomy ? asSlug(input.slug) : undefined,
  }))
  .handler(async ({ data: { lang, page, taxonomy, slug } }): Promise<PostListData | null> => {
    let term: Taxonomy | null = null;
    let alternates: Alternates = { fr: "/blog/", en: "/en/blog/" };
    if (taxonomy && slug) {
      term =
        (await find<Taxonomy>(taxonomy, lang, { where: [{ slug: { equals: slug } }], limit: 1, titleField: "name" }))
          .docs[0] ?? null;
      if (!term) return null;
      alternates = await alternatesOf(taxonomy, term.id, "name");
    }
    const posts = await find<Post>("posts", lang, {
      where: term ? [{ [taxonomy as string]: { in: [term.id] } }] : [],
      sort: "-publishedAt",
      limit: 12,
      page,
    });
    if (page > 1 && !posts.docs.length) return null;
    return { posts, term, alternates };
  });

// ─── Activités et boutique ─────────────────────────────────────────────────

export const getActivities = createServerFn({ method: "GET" })
  .validator((input: { lang: Lang }) => ({ lang: asLang(input?.lang) }))
  .handler(async ({ data: { lang } }) => (await find<Activity>("activities", lang, { sort: "order" })).docs);

export const getActivity = createServerFn({ method: "GET" })
  .validator((input: { lang: Lang; slug: string }) => ({ lang: asLang(input?.lang), slug: asSlug(input?.slug) }))
  .handler(async ({ data: { lang, slug } }) => {
    const activity = (
      await find<Activity>("activities", lang, { where: [{ slug: { equals: slug } }], depth: 2, limit: 1 })
    ).docs[0];
    if (!activity) return null;
    return { activity, alternates: await alternatesOf("activities", activity.id) };
  });

export const getProducts = createServerFn({ method: "GET" })
  .validator((input: { lang: Lang }) => ({ lang: asLang(input?.lang) }))
  .handler(
    async ({ data: { lang } }) =>
      (await find<Product>("products", lang, { where: visibleProductsWhere(), sort: "order" })).docs,
  );

export const getProduct = createServerFn({ method: "GET" })
  .validator((input: { lang: Lang; slug: string }) => ({ lang: asLang(input?.lang), slug: asSlug(input?.slug) }))
  .handler(async ({ data: { lang, slug } }) => {
    const product = (
      await find<Product>("products", lang, {
        where: [{ slug: { equals: slug } }, ...visibleProductsWhere()],
        depth: 2,
        limit: 1,
      })
    ).docs[0];
    if (!product) return null;
    return { product, alternates: await alternatesOf("products", product.id) };
  });

// ─── Équipe ────────────────────────────────────────────────────────────────

export const getTeam = createServerFn({ method: "GET" })
  .validator((input: { lang: Lang }) => ({ lang: asLang(input?.lang) }))
  .handler(
    async ({ data: { lang } }) =>
      (await find<TeamMember>("team-members", lang, { sort: "order", titleField: "name" })).docs,
  );

// ─── Formulaires ───────────────────────────────────────────────────────────

/** Formulaire de contact choisi dans les réglages du site. */
export const getContactForm = createServerFn({ method: "GET" })
  .validator((input: { lang: Lang }) => ({ lang: asLang(input?.lang) }))
  .handler(async ({ data: { lang } }) => {
    const settings = await getSettings(lang);
    const form = settings?.contactForm;
    if (!form) return null;
    return isPopulated(form) ? form : cmsFetch<Form>(`forms/${form}`, { ...localeQuery(lang), depth: 0 });
  });

/**
 * Envoi d'un formulaire de l'admin. Le champ « website » est un piège à robots :
 * invisible pour les visiteurs, il n'est rempli que par les robots (envoi ignoré).
 */
export const submitForm = createServerFn({ method: "POST" })
  .validator((input: { formId: number; values: Record<string, string>; website?: string }) => {
    const formId = Number(input?.formId);
    if (!Number.isInteger(formId) || formId <= 0) throw new Error("Formulaire invalide");
    const values = Object.fromEntries(
      Object.entries(input?.values || {})
        .filter(([key, value]) => /^[\w-]{1,64}$/.test(key) && typeof value === "string")
        .map(([key, value]) => [key, value.slice(0, 5000)]),
    );
    return { formId, values, website: String(input?.website || "") };
  })
  .handler(async ({ data: { formId, values, website } }) => {
    if (website) return { ok: true };
    // On vérifie que le formulaire appartient bien à ce site avant d'envoyer.
    const form = await cmsFetch<Form & { tenant?: unknown }>(`forms/${formId}`, { depth: 1 });
    const tenant = form.tenant as { slug?: string } | undefined;
    if (tenant?.slug !== cmsConfig().site) throw new Error("Formulaire invalide");
    await cmsPost("form-submissions", {
      form: formId,
      submissionData: Object.entries(values).map(([field, value]) => ({ field, value })),
    });
    return { ok: true };
  });
