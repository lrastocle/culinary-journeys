import { getHome, type HomeData } from "@/lib/cms/api";
import { Blocks } from "@/components/cms/Blocks";
import { ActivityCard } from "@/components/cms/Cards";
import { PageHeader } from "@/components/PageHeader";
import { useLang } from "@/lib/i18n";
import type { Lang } from "@/lib/paths";
import { buildHead, localBusinessLd, siteFrom } from "@/lib/seo";
import { useSite } from "@/lib/site";

type Matches = Parameters<typeof siteFrom>[0];

/** Accueil : page composée dans l'admin, sinon liste des expériences. */
export const homeRoute = (lang: Lang) => ({
  loader: () => getHome({ data: { lang } }),
  head: ({ loaderData, matches }: { loaderData?: HomeData; matches: Matches }) => {
    const site = siteFrom(matches);
    const siteName = site.settings?.siteName || "Tété Dwèt";
    return buildHead({
      matches,
      lang,
      // Titre SEO de la page d'accueil (onglet SEO de l'admin), sinon nom du site et accroche.
      title: site.settings?.tagline ? `${siteName} — ${site.settings.tagline}` : siteName,
      bareTitle: true,
      meta: loaderData?.page?.meta?.title === loaderData?.page?.title ? { ...loaderData?.page?.meta, title: null } : loaderData?.page?.meta,
      alternates: loaderData?.alternates ?? { fr: "/", en: "/en/" },
      jsonLd: [localBusinessLd(site)],
    });
  },
});

export function HomeView({ data }: { data: HomeData }) {
  const { t } = useLang();
  const { settings } = useSite();
  if (data.page?.layout?.length) {
    return (
      <main id="main">
        <Blocks blocks={data.page.layout} data={data.blockData} />
      </main>
    );
  }
  return (
    <main id="main">
      <PageHeader title={settings?.siteName || "Tété Dwèt"} intro={settings?.tagline} color="leaf" />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-10 font-display text-4xl font-black uppercase tracking-tight">{t.activities.title}</h2>
        {data.activities.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {data.activities.map((activity, i) => (
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
