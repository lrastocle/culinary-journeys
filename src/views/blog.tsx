import { notFound } from "@tanstack/react-router";

import { PostCard } from "@/components/cms/Cards";
import { PageHeader } from "@/components/PageHeader";
import { SiteLink } from "@/components/SiteLink";
import { getPostList, type PostListData } from "@/lib/cms/api";
import { getDict, useLang } from "@/lib/i18n";
import type { Alternates, Lang } from "@/lib/paths";
import { buildHead, siteFrom } from "@/lib/seo";
import { useSection } from "@/lib/site";

type Matches = Parameters<typeof siteFrom>[0];
type Search = { page?: number };

const withPage = (path: string | null, page: number) => (path && page > 1 ? `${path}?page=${page}` : path);

/**
 * Liste d'articles : blog (/blog/), catégorie (/category/<slug>/) ou étiquette
 * (/tag/<slug>/), en pages de 12 (?page=2).
 */
export const postListRoute = (lang: Lang, taxonomy?: "categories" | "tags") => ({
  validateSearch: (search: Record<string, unknown>): Search => {
    const page = Number(search["page"]);
    return Number.isInteger(page) && page > 1 ? { page } : {};
  },
  loaderDeps: ({ search }: { search: Search }) => ({ page: search.page ?? 1 }),
  loader: async ({ params, deps }: { params: { slug?: string }; deps: { page: number } }) => {
    const data = await getPostList({ data: { lang, page: deps.page, taxonomy, slug: params.slug } }).catch(() => null);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, matches }: { loaderData?: PostListData; matches: Matches }) => {
    if (!loaderData) return {};
    const t = getDict(lang);
    const site = siteFrom(matches);
    const page = loaderData.posts.page ?? 1;
    // Au-delà de la page 1, les listes FR et EN n'ont pas le même nombre de pages : pas de hreflang.
    const alternates: Alternates =
      page > 1
        ? { fr: null, en: null, [lang]: withPage(loaderData.alternates[lang], page) }
        : loaderData.alternates;
    const section = site.settings?.sections?.blog;
    const title = loaderData.term ? loaderData.term.name : section?.title || t.blog.title;
    return buildHead({
      matches,
      lang,
      title: page > 1 ? `${title} — ${t.blog.page} ${page}` : title,
      description: loaderData.term?.description || section?.intro || t.blog.intro,
      alternates,
    });
  },
});

export function PostListView({ data }: { data: PostListData }) {
  const { lang, t } = useLang();
  const section = useSection("blog", { title: t.blog.title, intro: t.blog.intro });
  const { posts, term } = data;
  const page = posts.page ?? 1;
  const base = data.alternates[lang] || "/";
  return (
    <main id="main" className="bg-cream">
      <PageHeader title={term ? term.name : section.title} intro={term ? term.description : section.intro} color="sea" />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {posts.docs.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.docs.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="font-medium text-ink/70">{t.blog.empty}</p>
        )}
        {posts.totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-between gap-4" aria-label={t.blog.page}>
            {posts.hasPrevPage ? (
              <SiteLink href={withPage(base, page - 1)!} className="btn-pop rounded-full bg-sun px-6 py-3 font-display text-sm font-extrabold">
                ← {t.blog.prev}
              </SiteLink>
            ) : (
              <span />
            )}
            <span className="text-sm font-semibold text-ink/60">
              {t.blog.page} {page} / {posts.totalPages}
            </span>
            {posts.hasNextPage ? (
              <SiteLink href={withPage(base, page + 1)!} className="btn-pop rounded-full bg-sun px-6 py-3 font-display text-sm font-extrabold">
                {t.blog.next} →
              </SiteLink>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </main>
  );
}
