import teamImg from "@/assets/team.jpg";
import { TeamGrid } from "@/components/cms/Blocks";
import { PageHeader } from "@/components/PageHeader";
import { getTeam } from "@/lib/cms/api";
import type { TeamMember } from "@/lib/cms/types";
import { getDict, useLang } from "@/lib/i18n";
import { sectionAlternates, type Lang } from "@/lib/paths";
import { buildHead, siteFrom } from "@/lib/seo";
import { useSection } from "@/lib/site";

type Matches = Parameters<typeof siteFrom>[0];

/** Équipe : /equipe/ et /en/team/. */
export const teamRoute = (lang: Lang) => ({
  loader: () => getTeam({ data: { lang } }),
  head: ({ matches }: { matches: Matches }) => {
    const t = getDict(lang);
    const section = siteFrom(matches).settings?.sections?.team;
    return buildHead({
      matches,
      lang,
      title: section?.title || t.team.title,
      description: section?.intro || t.team.intro,
      alternates: sectionAlternates("team"),
    });
  },
});

export function TeamView({ members }: { members: TeamMember[] }) {
  const { t } = useLang();
  const section = useSection("team", { title: t.team.title, intro: t.team.intro });
  return (
    <main id="main" className="bg-cream">
      <PageHeader title={section.title} intro={section.intro} color="leaf" />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <img
          src={teamImg}
          alt=""
          loading="lazy"
          width={1600}
          height={1200}
          className="shadow-pop-lg mb-12 aspect-[16/7] w-full rounded-[2rem] border-2 border-ink object-cover"
        />
        {members.length ? <TeamGrid members={members} /> : <p className="font-medium text-ink/70">{t.team.empty}</p>}
      </section>
    </main>
  );
}
