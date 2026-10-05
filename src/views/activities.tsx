import { notFound } from "@tanstack/react-router";

import { BookButton } from "@/components/cms/BookButton";
import { ActivityCard, useActivityMeta } from "@/components/cms/Cards";
import { Media } from "@/components/cms/Media";
import { RichText } from "@/components/cms/RichText";
import { PageHeader } from "@/components/PageHeader";
import { SiteLink } from "@/components/SiteLink";
import { getActivities, getActivity } from "@/lib/cms/api";
import type { Activity } from "@/lib/cms/types";
import { isPopulated } from "@/lib/cms/types";
import { getDict, useLang } from "@/lib/i18n";
import { sectionAlternates, sectionPath, type Alternates, type Lang } from "@/lib/paths";
import { buildHead, imageUrl, siteFrom } from "@/lib/seo";
import { theme, useSection } from "@/lib/site";

type Matches = Parameters<typeof siteFrom>[0];

// ─── Liste : /visites/ et /en/tours/ ────────────────────────────────────────

export const activitiesRoute = (lang: Lang) => ({
  loader: () => getActivities({ data: { lang } }),
  head: ({ matches }: { matches: Matches }) => {
    const t = getDict(lang);
    const section = siteFrom(matches).settings?.sections?.activities;
    return buildHead({
      matches,
      lang,
      title: section?.title || t.activities.title,
      description: section?.intro || t.activities.intro,
      alternates: sectionAlternates("activities"),
    });
  },
});

export function ActivitiesView({ activities }: { activities: Activity[] }) {
  const { t } = useLang();
  const section = useSection("activities", { title: t.activities.title, intro: t.activities.intro });
  return (
    <main id="main" className="bg-cream">
      <PageHeader title={section.title} intro={section.intro} color="leaf" />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {activities.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {activities.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} />
            ))}
          </div>
        ) : (
          <p className="font-medium text-ink/70">{t.activities.empty}</p>
        )}
      </section>
    </main>
  );
}

// ─── Fiche : /visites/<slug>/ et /en/tours/<slug>/ ──────────────────────────

/** Durée Schema.org (ISO 8601) à partir de « 4 h », « 2 h 30 », « 3 hours ». */
const isoDuration = (duration?: string | null) => {
  const match = duration && /(\d+)\s*h(?:ours?|rs?)?\s*(\d+)?/i.exec(duration);
  return match ? `PT${match[1]}H${match[2] ? `${match[2]}M` : ""}` : undefined;
};

type ActivityData = { activity: Activity; alternates: Alternates };

export const activityRoute = (lang: Lang) => ({
  loader: async ({ params }: { params: { slug: string } }) => {
    const data = await getActivity({ data: { lang, slug: params.slug } }).catch(() => null);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, matches }: { loaderData?: ActivityData; matches: Matches }) => {
    if (!loaderData) return {};
    const { activity, alternates } = loaderData;
    const site = siteFrom(matches);
    const image = activity.heroImage || activity.gallery?.[0];
    return buildHead({
      matches,
      lang,
      title: activity.title,
      description: activity.summary,
      meta: activity.meta,
      image,
      alternates,
      jsonLd: [
        {
          "@type": "TouristTrip",
          name: activity.title,
          ...(activity.summary ? { description: activity.summary } : {}),
          ...(imageUrl(image) ? { image: imageUrl(image) } : {}),
          url: `${site.siteUrl}${alternates[lang]}`,
          inLanguage: lang,
          ...(activity.languages?.length ? { availableLanguage: activity.languages } : {}),
          ...(isoDuration(activity.duration) ? { duration: isoDuration(activity.duration) } : {}),
          touristType: getDict(lang).activities.types[activity.type],
          provider: { "@id": `${site.siteUrl}/#business`, "@type": "LocalBusiness", name: site.settings?.siteName || "Tété Dwèt" },
          ...(activity.priceFrom != null
            ? {
                offers: {
                  "@type": "Offer",
                  price: activity.priceFrom,
                  priceCurrency: "EUR",
                  availability: "https://schema.org/InStock",
                  url: `${site.siteUrl}${alternates[lang]}`,
                },
              }
            : {}),
        },
      ],
    });
  },
});

function List({ title, items }: { title: string; items: { text: string }[] | null | undefined }) {
  if (!items?.length) return null;
  return (
    <div>
      <h2 className="font-display text-xl font-black uppercase">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm font-medium leading-relaxed">
            <span aria-hidden="true">✓</span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ActivityView({ activity }: { activity: Activity }) {
  const { lang, t } = useLang();
  const colors = theme(activity.color, "plum");
  const meta = useActivityMeta(activity);
  const image = activity.heroImage || activity.gallery?.[0];
  const gallery = (activity.gallery || []).filter(isPopulated).filter((m) => !isPopulated(image) || m.id !== image.id);
  const facts = [
    [t.activities.duration, activity.duration],
    [t.activities.groupSize, activity.groupSize],
    [t.activities.languages, activity.languages?.map((code) => t.activities.langNames[code] || code).join(", ")],
  ].filter(([, value]) => value) as [string, string][];

  return (
    <main id="main" className="bg-cream">
      <section className={`border-b-2 border-ink ${colors.bg} ${colors.text}`}>
        <div className={`mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 ${isPopulated(image) ? "md:grid-cols-2" : ""}`}>
          <div>
            <SiteLink href={sectionPath("activities", lang)} className="text-sm font-extrabold underline">
              ← {t.activities.title}
            </SiteLink>
            <span className="mt-6 block w-fit rounded-full bg-cream px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink">
              {activity.tag || t.activities.types[activity.type]}
            </span>
            <h1 className="mt-4 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
              {activity.title}
            </h1>
            {activity.summary && <p className={`mt-6 max-w-lg text-lg font-medium leading-relaxed ${colors.muted}`}>{activity.summary}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BookButton
                item={activity.fareharbor}
                title={activity.title}
                className="btn-pop rounded-full bg-sun px-8 py-4 font-display text-base font-extrabold text-ink"
              >
                {t.activities.book}
              </BookButton>
              {meta && <span className="text-sm font-semibold">{meta}</span>}
            </div>
          </div>
          {isPopulated(image) && (
            <Media
              media={image}
              loading="eager"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/3] w-full rounded-[2rem] border-2 border-ink object-cover"
            />
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          <RichText value={activity.description} />
          {gallery.length > 0 && (
            <>
              <h2 className="mt-12 font-display text-3xl font-black uppercase tracking-tight">{t.activities.gallery}</h2>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {gallery.map((media) => (
                  <Media key={media.id} media={media} sizes="(min-width: 768px) 30vw, 50vw" className="aspect-square w-full rounded-2xl border-2 border-ink object-cover" />
                ))}
              </div>
            </>
          )}
        </div>
        <aside className="space-y-8">
          {facts.length > 0 && (
            <dl className="shadow-pop grid gap-4 rounded-3xl border-2 border-ink bg-sun p-6">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px] font-extrabold uppercase tracking-wider text-ink/60">{label}</dt>
                  <dd className="font-display text-lg font-extrabold">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <List title={t.activities.highlights} items={activity.highlights} />
          <List title={t.activities.included} items={activity.included} />
          <List title={t.activities.notIncluded} items={activity.notIncluded} />
          {activity.meetingPoint && (
            <div>
              <h2 className="font-display text-xl font-black uppercase">{t.activities.meetingPoint}</h2>
              <p className="mt-3 whitespace-pre-line text-sm font-medium leading-relaxed">{activity.meetingPoint}</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
