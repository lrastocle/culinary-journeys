import { SiteLink } from "@/components/SiteLink";
import type { Activity, Post, Product } from "@/lib/cms/types";
import { isPopulated } from "@/lib/cms/types";
import { useLang } from "@/lib/i18n";
import { docPath } from "@/lib/paths";
import { formatDate, formatPrice, theme } from "@/lib/site";

import { BookButton } from "./BookButton";
import { Media } from "./Media";

const CARD_COLORS = ["plum", "mango", "sea", "hibiscus", "leaf"] as const;

/** Ligne d'informations d'une expérience : « 4 h · 8 pers. max · dès 58 € ». */
export function useActivityMeta(activity: Activity) {
  const { t } = useLang();
  return [
    activity.duration,
    activity.groupSize,
    activity.priceFrom != null ? `${t.activities.from} ${formatPrice(activity.priceFrom, t.locale)}` : null,
    activity.priceNote,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function ActivityCard({ activity, index = 0 }: { activity: Activity; index?: number }) {
  const { lang, t } = useLang();
  const colors = theme(activity.color, CARD_COLORS[index % CARD_COLORS.length] ?? "plum");
  const href = docPath("activities", activity.slug, lang);
  const meta = useActivityMeta(activity);
  const image = activity.heroImage || activity.gallery?.[0];

  return (
    <article className={`shadow-pop-lg flex flex-col overflow-hidden rounded-3xl border-2 border-ink ${colors.bg} ${colors.text}`}>
      <SiteLink href={href} tabIndex={-1} aria-hidden="true">
        {isPopulated(image) ? (
          <Media
            media={image}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/3] w-full border-b-2 border-ink object-cover"
          />
        ) : (
          <div className="aspect-[4/3] w-full border-b-2 border-ink bg-ink/10" />
        )}
      </SiteLink>
      <div className="flex flex-1 flex-col p-7">
        <span className="inline-block w-fit rounded-full bg-cream px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink">
          {activity.tag || t.activities.types[activity.type]}
        </span>
        <h3 className="mt-4 font-display text-3xl font-black uppercase">
          <SiteLink href={href} className="hover:underline">
            {activity.title}
          </SiteLink>
        </h3>
        {activity.summary && <p className="mt-3 text-sm font-medium leading-relaxed">{activity.summary}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-current/40 pt-4">
          <span className="text-sm font-semibold">{meta}</span>
          <div className="flex items-center gap-3">
            <BookButton
              item={activity.fareharbor}
              title={activity.title}
              className="btn-pop rounded-full bg-cream px-4 py-1.5 font-display text-sm font-extrabold text-ink"
            >
              {t.activities.book}
            </BookButton>
            <SiteLink href={href} className="font-display text-lg font-black hover:underline" aria-label={`${t.activities.details} : ${activity.title}`}>
              →
            </SiteLink>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const href = docPath("products", product.slug, lang);
  return (
    <article className="shadow-pop flex flex-col overflow-hidden rounded-3xl border-2 border-ink bg-cream">
      <SiteLink href={href} tabIndex={-1} aria-hidden="true">
        {isPopulated(product.images?.[0]) ? (
          <Media
            media={product.images![0]}
            sizes="(min-width: 768px) 33vw, 100vw"
            className="aspect-square w-full border-b-2 border-ink object-cover"
          />
        ) : (
          <div className="aspect-square w-full border-b-2 border-ink bg-ink/10" />
        )}
      </SiteLink>
      <div className="flex flex-1 flex-col p-6">
        {product.tag && (
          <span className="mb-3 inline-block w-fit rounded-full border-2 border-ink bg-sun px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
            {product.tag}
          </span>
        )}
        <h2 className="font-display text-xl font-black uppercase leading-tight">
          <SiteLink href={href} className="hover:underline">
            {product.title}
          </SiteLink>
        </h2>
        {product.summary && <p className="mt-3 text-sm font-medium leading-relaxed text-ink/70">{product.summary}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="font-display text-2xl font-black text-hibiscus">
            {product.price != null ? formatPrice(product.price, t.locale) : product.priceNote}
          </span>
          {product.available === false ? (
            <span className="font-display text-sm font-extrabold uppercase text-ink/50">{t.shop.soldOut}</span>
          ) : (
            <BookButton
              item={product.fareharbor}
              title={product.title}
              className="btn-pop rounded-full bg-sun px-5 py-2 font-display text-sm font-extrabold"
              requestLabel={t.shop.order}
            >
              {t.shop.order}
            </BookButton>
          )}
        </div>
      </div>
    </article>
  );
}

export function PostCard({ post }: { post: Post }) {
  const { lang, t } = useLang();
  const href = docPath("posts", post.slug, lang);
  const category = post.categories?.find(isPopulated);
  return (
    <article className="shadow-pop flex flex-col overflow-hidden rounded-3xl border-2 border-ink bg-cream">
      <SiteLink href={href} tabIndex={-1} aria-hidden="true">
        {isPopulated(post.featuredImage) ? (
          <Media
            media={post.featuredImage}
            sizes="(min-width: 768px) 33vw, 100vw"
            className="aspect-[4/3] w-full border-b-2 border-ink object-cover"
          />
        ) : (
          <div className="aspect-[4/3] w-full border-b-2 border-ink bg-sun/40" />
        )}
      </SiteLink>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          {category && (
            <SiteLink
              href={docPath("categories", category.slug, lang)}
              className="inline-block w-fit rounded-full border-2 border-ink bg-sun px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider"
            >
              {category.name}
            </SiteLink>
          )}
          {post.publishedAt && (
            <time dateTime={post.publishedAt} className="text-xs font-semibold text-ink/50">
              {formatDate(post.publishedAt, t.locale)}
            </time>
          )}
        </div>
        <h2 className="mt-4 font-display text-xl font-black uppercase leading-tight">
          <SiteLink href={href} className="hover:underline">
            {post.title}
          </SiteLink>
        </h2>
        {post.excerpt && <p className="mt-3 line-clamp-4 text-sm font-medium leading-relaxed text-ink/70">{post.excerpt}</p>}
        <SiteLink href={href} className="mt-auto pt-5 font-display text-sm font-extrabold text-hibiscus">
          {t.blog.readMore} →
        </SiteLink>
      </div>
    </article>
  );
}
