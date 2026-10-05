import { SiteLink } from "@/components/SiteLink";
import type { BlockData } from "@/lib/cms/api";
import type { LinkValue, PageBlock, Product } from "@/lib/cms/types";
import { isPopulated } from "@/lib/cms/types";
import { useLang } from "@/lib/i18n";
import { docPath } from "@/lib/paths";
import { formatPrice, linkHref, theme, useSite } from "@/lib/site";

import { BookButton } from "./BookButton";
import { ActivityCard, PostCard, ProductCard } from "./Cards";
import { CmsForm } from "./CmsForm";
import { Media } from "./Media";
import { RichText } from "./RichText";

type Block<T extends PageBlock["blockType"]> = Extract<PageBlock, { blockType: T }>;

const container = "mx-auto max-w-7xl px-6";
const sectionTitle = "font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl";

function Button({ link, className }: { link: LinkValue | null | undefined; className: string }) {
  const { lang } = useLang();
  const { settings } = useSite();
  const href = linkHref(link, lang, settings?.fareharbor);
  if (!href || !link?.label) return null;
  if (link.type === "fareharbor" || /^https?:\/\//.test(href)) {
    return (
      <a href={href} className={className}>
        {link.label}
      </a>
    );
  }
  return (
    <SiteLink href={href} className={className}>
      {link.label}
    </SiteLink>
  );
}

function Hero({ block, isFirst }: { block: Block<"hero">; isFirst: boolean }) {
  const colors = theme(block.color, "leaf");
  const Heading = isFirst ? "h1" : "h2";
  return (
    <section className={`border-b-2 border-ink ${colors.bg} ${colors.text}`}>
      <div className={`${container} grid items-center gap-10 py-16 ${block.image ? "md:grid-cols-2" : ""}`}>
        {isPopulated(block.image) && (
          <div className="relative">
            {block.badge && (
              <div className="shadow-pop-sm absolute -right-4 -top-6 z-10 rotate-6 rounded-full border-2 border-ink bg-sun px-4 py-1 font-display text-xs font-extrabold text-ink">
                {block.badge}
              </div>
            )}
            <Media
              media={block.image}
              loading="eager"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/5] w-full rounded-[2rem] border-2 border-ink object-cover"
            />
            {block.stat?.value && (
              <div className="shadow-pop absolute -bottom-6 -left-6 hidden rounded-2xl border-2 border-ink bg-cream px-5 py-4 text-ink md:block">
                <span className="font-display text-4xl font-black text-hibiscus">{block.stat.value}</span>
                <span className="block text-[11px] font-bold uppercase tracking-wider">{block.stat.label}</span>
              </div>
            )}
          </div>
        )}
        <div>
          <Heading className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl">
            {block.heading}
            {block.highlight && (
              <>
                <br />
                <span className={colors.accent}>{block.highlight}</span>
              </>
            )}
            {block.headingEnd && (
              <>
                <br />
                {block.headingEnd}
              </>
            )}
          </Heading>
          {block.subheading && (
            <p className={`mt-6 max-w-md text-lg font-medium leading-relaxed ${colors.muted}`}>{block.subheading}</p>
          )}
          {(block.buttons?.length || block.meta) && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {block.buttons?.map((button, i) => (
                <Button
                  key={button.id || i}
                  link={button.link}
                  className={`btn-pop rounded-full px-8 py-4 font-display text-base font-extrabold ${i === 0 ? "bg-sun text-ink" : "bg-cream text-ink"}`}
                />
              ))}
              {block.meta && <span className="text-sm font-semibold">{block.meta}</span>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Press({ block, data }: { block: Block<"press">; data: BlockData | undefined }) {
  if (!data?.press?.length) return null;
  return (
    <section className="border-b-2 border-ink bg-cream py-6">
      <div className={`${container} flex flex-wrap items-center justify-center gap-x-10 gap-y-3`}>
        {block.heading && (
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ink/50">{block.heading}</p>
        )}
        {data.press.map((mention) => {
          const name = <span className="font-display text-lg font-extrabold italic text-ink/70">{mention.outlet}</span>;
          return mention.url ? (
            <a key={mention.id} href={mention.url} rel="noopener noreferrer" target="_blank" className="hover:text-hibiscus">
              {name}
            </a>
          ) : (
            <span key={mention.id}>{name}</span>
          );
        })}
      </div>
    </section>
  );
}

function ActivitiesList({ block, data }: { block: Block<"activitiesList">; data: BlockData | undefined }) {
  const { t } = useLang();
  const activities = data?.activities ?? [];
  return (
    <section id="experiences" className="border-b-2 border-ink bg-cream">
      <div className={`${container} py-16`}>
        {block.heading && <h2 className={`mb-10 ${sectionTitle}`}>{block.heading}</h2>}
        {activities.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {activities.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} />
            ))}
          </div>
        ) : (
          <p className="font-medium text-ink/70">{t.activities.empty}</p>
        )}
      </div>
    </section>
  );
}

/** Grande mise en avant d'un produit (ex. jambon de Noël en saison). */
function ProductSpotlight({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const colors = theme(product.color, "sun");
  const href = docPath("products", product.slug, lang);
  return (
    <section className={`border-b-2 border-ink ${colors.bg} ${colors.text}`}>
      <div className={`${container} grid items-center gap-10 py-16 md:grid-cols-2`}>
        <div>
          {product.tag && (
            <span className="inline-block rounded-full border-2 border-ink bg-hibiscus px-4 py-1 font-display text-xs font-extrabold uppercase tracking-wider text-cream">
              {product.tag}
            </span>
          )}
          <h2 className={`mt-5 ${sectionTitle}`}>{product.title}</h2>
          {product.summary && <p className="mt-5 max-w-md text-lg font-medium leading-relaxed">{product.summary}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <BookButton
              item={product.fareharbor}
              title={product.title}
              className="btn-pop rounded-full bg-hibiscus px-8 py-4 font-display text-base font-extrabold text-cream"
              requestLabel={t.featured.cta}
            >
              {t.featured.cta}
            </BookButton>
            {product.price != null && (
              <span className="font-display text-2xl font-black">{formatPrice(product.price, t.locale)}</span>
            )}
            {product.details && <span className="text-sm font-semibold">{product.details}</span>}
          </div>
          <SiteLink href={href} className="mt-6 inline-block text-sm font-extrabold underline">
            {t.featured.details} →
          </SiteLink>
        </div>
        {isPopulated(product.images?.[0]) && (
          <Media
            media={product.images![0]}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="shadow-pop-lg w-full rounded-[2rem] border-2 border-ink object-cover"
          />
        )}
      </div>
    </section>
  );
}

function ProductsList({ block, data }: { block: Block<"productsList">; data: BlockData | undefined }) {
  const products = data?.products ?? [];
  if (!products.length) return null;
  if (block.display === "spotlight") {
    return (
      <>
        {products.map((product) => (
          <ProductSpotlight key={product.id} product={product} />
        ))}
      </>
    );
  }
  return (
    <section className="border-b-2 border-ink bg-cream">
      <div className={`${container} py-16`}>
        {block.heading && <h2 className={`mb-10 ${sectionTitle}`}>{block.heading}</h2>}
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PostsList({ block, data }: { block: Block<"postsList">; data: BlockData | undefined }) {
  if (!data?.posts?.length) return null;
  return (
    <section className="border-b-2 border-ink bg-cream">
      <div className={`${container} py-16`}>
        {block.heading && <h2 className={`mb-10 ${sectionTitle}`}>{block.heading}</h2>}
        <div className="grid gap-6 md:grid-cols-3">
          {data.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

const TEAM_COLORS = ["bg-plum text-cream", "bg-mango text-cream", "bg-sea text-cream", "bg-hibiscus text-cream", "bg-leaf text-cream"];

export function TeamGrid({ members }: { members: NonNullable<BlockData["team"]> }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((member, i) => (
        <div key={member.id} className={`shadow-pop overflow-hidden rounded-3xl border-2 border-ink ${TEAM_COLORS[i % TEAM_COLORS.length]}`}>
          {isPopulated(member.photo) && (
            <Media media={member.photo} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-square w-full border-b-2 border-ink object-cover" />
          )}
          <div className="p-6">
            <h3 className="font-display text-2xl font-black uppercase">{member.name}</h3>
            {member.role && <p className="mt-1 text-xs font-extrabold uppercase tracking-wider opacity-80">{member.role}</p>}
            {member.bio && <p className="mt-4 text-sm font-medium leading-relaxed">{member.bio}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Team({ block, data }: { block: Block<"team">; data: BlockData | undefined }) {
  if (!data?.team?.length) return null;
  return (
    <section className="border-b-2 border-ink bg-cream">
      <div className={`${container} py-16`}>
        {block.heading && <h2 className={`mb-10 ${sectionTitle}`}>{block.heading}</h2>}
        <TeamGrid members={data.team} />
      </div>
    </section>
  );
}

function Spotlight({ block }: { block: Block<"spotlight"> }) {
  const colors = theme(block.color, "ink");
  const imageRight = block.imagePosition === "right";
  return (
    <section className={`border-b-2 border-ink py-20 ${colors.bg} ${colors.text}`}>
      <div className={`${container} grid items-center gap-12 ${block.image ? "md:grid-cols-[1fr_1.1fr]" : ""}`}>
        {isPopulated(block.image) && (
          <Media
            media={block.image}
            sizes="(min-width: 768px) 45vw, 100vw"
            className={`aspect-square w-full rounded-[2rem] border-2 border-sun object-cover ${imageRight ? "md:order-2" : ""}`}
          />
        )}
        <div>
          {block.tag && (
            <span className="mb-5 inline-block rounded-full border-2 border-ink bg-hibiscus px-4 py-1 font-display text-xs font-extrabold uppercase tracking-wider text-cream">
              {block.tag}
            </span>
          )}
          <h2 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            {block.heading}
            {block.highlight && (
              <>
                <br />
                <span className={colors.accent}>{block.highlight}</span>
              </>
            )}
          </h2>
          {block.text && <p className={`mt-6 max-w-lg text-lg font-medium leading-relaxed ${colors.muted}`}>{block.text}</p>}
          {!!block.points?.length && (
            <ul className="mt-8 grid gap-3">
              {block.points.map((point, i) => (
                <li key={point.id || i} className="flex items-center gap-3 rounded-2xl border-2 border-current/20 bg-current/5 px-5 py-4">
                  <span className="text-2xl" aria-hidden="true">
                    {i === 0 ? "★" : "✓"}
                  </span>
                  <span className="text-sm font-semibold">{point.text}</span>
                </li>
              ))}
            </ul>
          )}
          <Button
            link={block.link}
            className="btn-pop mt-8 inline-block rounded-full bg-sun px-8 py-4 font-display text-base font-extrabold text-ink"
          />
        </div>
      </div>
    </section>
  );
}

function CallToAction({ block }: { block: Block<"cta"> }) {
  const colors = theme(block.color, "cream");
  return (
    <section className={`border-b-2 border-ink py-20 ${colors.bg} ${colors.text}`}>
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className={sectionTitle}>{block.heading}</h2>
        {block.text && <p className={`mx-auto mt-5 max-w-2xl text-lg font-medium leading-relaxed ${colors.muted}`}>{block.text}</p>}
        <Button
          link={block.link}
          className="btn-pop mt-8 inline-block rounded-full bg-leaf px-8 py-4 font-display text-base font-extrabold text-cream"
        />
      </div>
    </section>
  );
}

function TextBlock({ block }: { block: Block<"richText"> }) {
  const imageLeft = block.imagePosition === "left";
  return (
    <section className="border-b-2 border-ink bg-cream">
      <div className={`${container} grid items-center gap-10 py-16 ${block.image ? "md:grid-cols-2" : ""}`}>
        <div className={`${block.image ? "" : "max-w-3xl"} ${imageLeft ? "md:order-2" : ""}`}>
          {block.heading && <h2 className={`mb-6 ${sectionTitle}`}>{block.heading}</h2>}
          <RichText value={block.content} />
        </div>
        {isPopulated(block.image) && (
          <Media
            media={block.image}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="shadow-pop-lg aspect-[4/5] w-full rounded-[2rem] border-2 border-ink object-cover"
          />
        )}
      </div>
    </section>
  );
}

function Gallery({ block }: { block: Block<"gallery"> }) {
  const images = block.images.filter(isPopulated);
  if (!images.length) return null;
  return (
    <section className="border-b-2 border-ink bg-cream">
      <div className={`${container} py-16`}>
        {block.heading && <h2 className={`mb-10 ${sectionTitle}`}>{block.heading}</h2>}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((image) => (
            <Media key={image.id} media={image} sizes="(min-width: 768px) 33vw, 50vw" className="aspect-square w-full rounded-2xl border-2 border-ink object-cover" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ block }: { block: Block<"faq"> }) {
  const { t } = useLang();
  if (!block.items?.length) return null;
  return (
    <section className="border-b-2 border-ink bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h2 className={`mb-8 ${sectionTitle}`}>{block.heading || t.faq}</h2>
        <div className="grid gap-4">
          {block.items.map((item, i) => (
            <details key={i} className="shadow-pop group rounded-2xl border-2 border-ink bg-cream px-6 py-4">
              <summary className="cursor-pointer list-none font-display text-lg font-extrabold">
                {item.question}
                <span className="float-right transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 whitespace-pre-line text-sm font-medium leading-relaxed text-ink/80">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FormBlock({ block }: { block: Block<"form"> }) {
  if (!isPopulated(block.form)) return null;
  return (
    <section className="border-b-2 border-ink bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {block.heading && <h2 className={`mb-4 ${sectionTitle}`}>{block.heading}</h2>}
        {block.intro && <p className="mb-8 text-lg font-medium text-ink/70">{block.intro}</p>}
        <div className="shadow-pop-lg rounded-3xl border-2 border-ink bg-cream p-8">
          <CmsForm form={block.form as Parameters<typeof CmsForm>[0]["form"]} />
        </div>
      </div>
    </section>
  );
}

/** Blocs d'une page composée dans l'admin. */
export function Blocks({ blocks, data }: { blocks: PageBlock[]; data: Record<string, BlockData> }) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id || String(index);
        const blockData = data[key];
        switch (block.blockType) {
          case "hero":
            return <Hero key={key} block={block} isFirst={index === 0} />;
          case "richText":
            return <TextBlock key={key} block={block} />;
          case "gallery":
            return <Gallery key={key} block={block} />;
          case "activitiesList":
            return <ActivitiesList key={key} block={block} data={blockData} />;
          case "productsList":
            return <ProductsList key={key} block={block} data={blockData} />;
          case "postsList":
            return <PostsList key={key} block={block} data={blockData} />;
          case "team":
            return <Team key={key} block={block} data={blockData} />;
          case "press":
            return <Press key={key} block={block} data={blockData} />;
          case "spotlight":
            return <Spotlight key={key} block={block} />;
          case "faq":
            return <Faq key={key} block={block} />;
          case "cta":
            return <CallToAction key={key} block={block} />;
          case "form":
            return <FormBlock key={key} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
