import { notFound } from "@tanstack/react-router";

import { Blocks } from "@/components/cms/Blocks";
import { PostCard } from "@/components/cms/Cards";
import { Media } from "@/components/cms/Media";
import { RichText } from "@/components/cms/RichText";
import { PageHeader } from "@/components/PageHeader";
import { SiteLink } from "@/components/SiteLink";
import { getContent, type ContentData } from "@/lib/cms/api";
import type { Post } from "@/lib/cms/types";
import { isPopulated } from "@/lib/cms/types";
import { useLang } from "@/lib/i18n";
import { docPath, sectionPath, type Lang } from "@/lib/paths";
import { buildHead, imageUrl, siteFrom } from "@/lib/seo";
import { formatDate } from "@/lib/site";

type Matches = Parameters<typeof siteFrom>[0];

/** Page ou article à la racine du site : /<slug>/ et /en/<slug>/. */
export const contentRoute = (lang: Lang) => ({
  loader: async ({ params }: { params: { slug: string } }) => {
    const data = await getContent({ data: { lang, slug: params.slug } }).catch(() => null);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, matches }: { loaderData?: ContentData; matches: Matches }) => {
    if (!loaderData) return {};
    if (loaderData.kind === "page") {
      return buildHead({ matches, lang, title: loaderData.page.title, meta: loaderData.page.meta, alternates: loaderData.alternates });
    }
    const { post, alternates } = loaderData;
    const site = siteFrom(matches);
    return buildHead({
      matches,
      lang,
      title: post.title,
      description: post.excerpt,
      meta: post.meta,
      image: post.featuredImage,
      alternates,
      type: "article",
      jsonLd: [
        {
          "@type": "BlogPosting",
          headline: post.title,
          ...(post.excerpt ? { description: post.excerpt } : {}),
          ...(imageUrl(post.featuredImage) ? { image: imageUrl(post.featuredImage) } : {}),
          ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
          dateModified: post.updatedAt,
          inLanguage: lang,
          mainEntityOfPage: `${site.siteUrl}${alternates[lang]}`,
          ...(post.showAuthor && post.authorName ? { author: { "@type": "Person", name: post.authorName } } : {}),
          publisher: { "@type": "Organization", name: site.settings?.siteName || "Tété Dwèt" },
        },
      ],
    });
  },
});

function PostView({ post, related }: { post: Post; related: Post[] }) {
  const { lang, t } = useLang();
  const categories = (post.categories || []).filter(isPopulated);
  const tags = (post.tags || []).filter(isPopulated);
  return (
    <main id="main" className="bg-cream">
      <PageHeader title={post.title} color="sea">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <SiteLink href={sectionPath("blog", lang)} className="text-sm font-extrabold underline">
            ← {t.blog.back}
          </SiteLink>
          {categories.map((category) => (
            <SiteLink
              key={category.id}
              href={docPath("categories", category.slug, lang)}
              className="rounded-full border-2 border-ink bg-sun px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink"
            >
              {category.name}
            </SiteLink>
          ))}
        </div>
      </PageHeader>
      <article className="mx-auto max-w-3xl px-6 py-14">
        <p className="mb-8 text-sm font-semibold text-ink/60">
          {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, t.locale)}</time>}
          {post.showAuthor && post.authorName && (
            <>
              {" · "}
              {t.blog.by} {post.authorName}
            </>
          )}
        </p>
        {isPopulated(post.featuredImage) && (
          <Media
            media={post.featuredImage}
            loading="eager"
            sizes="(min-width: 768px) 720px, 100vw"
            className="shadow-pop-lg mb-10 w-full rounded-[2rem] border-2 border-ink object-cover"
          />
        )}
        <RichText value={post.content} />
        {tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 border-t-2 border-ink/10 pt-6">
            {tags.map((tag) => (
              <SiteLink
                key={tag.id}
                href={docPath("tags", tag.slug, lang)}
                className="rounded-full border-2 border-ink px-3 py-1 text-xs font-bold hover:bg-sun"
              >
                #{tag.name}
              </SiteLink>
            ))}
          </div>
        )}
      </article>
      {related.length > 0 && (
        <section className="border-t-2 border-ink">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <h2 className="mb-8 font-display text-3xl font-black uppercase tracking-tight">{t.blog.related}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export function ContentView({ data }: { data: ContentData }) {
  if (data.kind === "post") return <PostView post={data.post} related={data.related} />;
  const blocks = data.page.layout || [];
  return (
    <main id="main" className="bg-cream">
      {blocks[0]?.blockType !== "hero" && <PageHeader title={data.page.title} color="mango" />}
      <Blocks blocks={blocks} data={data.blockData} />
    </main>
  );
}
