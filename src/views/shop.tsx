import { notFound } from "@tanstack/react-router";

import { BookButton } from "@/components/cms/BookButton";
import { ProductCard } from "@/components/cms/Cards";
import { Media } from "@/components/cms/Media";
import { RichText } from "@/components/cms/RichText";
import { PageHeader } from "@/components/PageHeader";
import { SiteLink } from "@/components/SiteLink";
import { getProduct, getProducts } from "@/lib/cms/api";
import type { Product } from "@/lib/cms/types";
import { isPopulated } from "@/lib/cms/types";
import { getDict, useLang } from "@/lib/i18n";
import { sectionAlternates, sectionPath, type Alternates, type Lang } from "@/lib/paths";
import { buildHead, imageUrl, siteFrom } from "@/lib/seo";
import { formatPrice, useSection } from "@/lib/site";

type Matches = Parameters<typeof siteFrom>[0];

// ─── Liste : /boutique/ et /en/shop/ ────────────────────────────────────────

export const shopRoute = (lang: Lang) => ({
  loader: () => getProducts({ data: { lang } }),
  head: ({ matches }: { matches: Matches }) => {
    const t = getDict(lang);
    const section = siteFrom(matches).settings?.sections?.shop;
    return buildHead({
      matches,
      lang,
      title: section?.title || t.shop.title,
      description: section?.intro || t.shop.intro,
      alternates: sectionAlternates("shop"),
    });
  },
});

export function ShopView({ products }: { products: Product[] }) {
  const { t } = useLang();
  const section = useSection("shop", { title: t.shop.title, intro: t.shop.intro });
  return (
    <main id="main" className="bg-cream">
      <PageHeader title={section.title} intro={section.intro} color="hibiscus" />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {products.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="font-medium text-ink/70">{t.shop.empty}</p>
        )}
      </section>
    </main>
  );
}

// ─── Fiche : /boutique/<slug>/ et /en/shop/<slug>/ ──────────────────────────

type ProductData = { product: Product; alternates: Alternates };

export const productRoute = (lang: Lang) => ({
  loader: async ({ params }: { params: { slug: string } }) => {
    const data = await getProduct({ data: { lang, slug: params.slug } }).catch(() => null);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, matches }: { loaderData?: ProductData; matches: Matches }) => {
    if (!loaderData) return {};
    const { product, alternates } = loaderData;
    const site = siteFrom(matches);
    const image = product.images?.[0];
    return buildHead({
      matches,
      lang,
      title: product.title,
      description: product.summary,
      meta: product.meta,
      image,
      alternates,
      jsonLd: [
        {
          "@type": "Product",
          name: product.title,
          ...(product.summary ? { description: product.summary } : {}),
          ...(imageUrl(image) ? { image: imageUrl(image) } : {}),
          brand: { "@type": "Brand", name: site.settings?.siteName || "Tété Dwèt" },
          ...(product.price != null
            ? {
                offers: {
                  "@type": "Offer",
                  price: product.price,
                  priceCurrency: "EUR",
                  availability: product.available === false ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
                  url: `${site.siteUrl}${alternates[lang]}`,
                },
              }
            : {}),
        },
      ],
    });
  },
});

export function ProductView({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const images = (product.images || []).filter(isPopulated);
  return (
    <main id="main" className="bg-cream">
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2">
        <div className="space-y-4">
          {images.map((media, i) => (
            <Media
              key={media.id}
              media={media}
              loading={i === 0 ? "eager" : "lazy"}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="shadow-pop-lg w-full rounded-[2rem] border-2 border-ink object-cover"
            />
          ))}
        </div>
        <div>
          <SiteLink href={sectionPath("shop", lang)} className="text-sm font-extrabold underline">
            ← {t.shop.back}
          </SiteLink>
          {product.tag && (
            <span className="mt-6 block w-fit rounded-full border-2 border-ink bg-hibiscus px-4 py-1 font-display text-xs font-extrabold uppercase tracking-wider text-cream">
              {product.tag}
            </span>
          )}
          <h1 className="mt-4 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight">{product.title}</h1>
          {product.summary && <p className="mt-5 text-lg font-medium leading-relaxed text-ink/80">{product.summary}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {(product.price != null || product.priceNote) && (
              <span className="font-display text-3xl font-black text-hibiscus">
                {product.price != null ? formatPrice(product.price, t.locale) : ""} {product.priceNote}
              </span>
            )}
            {product.available === false ? (
              <span className="font-display text-sm font-extrabold uppercase text-ink/50">{t.shop.soldOut}</span>
            ) : (
              <BookButton
                item={product.fareharbor}
                title={product.title}
                className="btn-pop rounded-full bg-sun px-8 py-4 font-display text-base font-extrabold"
                requestLabel={t.shop.order}
              >
                {t.shop.order}
              </BookButton>
            )}
          </div>
          {product.details && <p className="mt-4 text-sm font-semibold text-ink/70">{product.details}</p>}
          <RichText value={product.description} className="mt-10" />
        </div>
      </section>
    </main>
  );
}
