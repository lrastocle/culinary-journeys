import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import teamImg from "@/assets/team.jpg";

export const Route = createFileRoute("/equipe")({
  head: () => ({
    meta: [
      { title: "Our team — Tété Dwèt" },
      {
        name: "description",
        content:
          "Guides, chefs and storytellers: meet the Tété Dwèt team, all in love with Martinican cuisine.",
      },
      { property: "og:title", content: "Our team — Tété Dwèt" },
      {
        property: "og:description",
        content: "Meet the Tété Dwèt team of guides and chefs in Martinique.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/equipe" },
    ],
    links: [{ rel: "canonical", href: "/equipe" }],
  }),
  component: TeamPage,
});

const colors = ["bg-sun", "bg-hibiscus text-cream", "bg-leaf text-cream", "bg-plum text-cream"];

function TeamPage() {
  const { t } = useLang();

  return (
    <main className="bg-cream">
      <section className="border-b-2 border-ink bg-leaf text-cream">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            {t.team.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-relaxed text-cream/90">
            {t.team.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <img
          src={teamImg}
          alt="The Tété Dwèt team cooking together"
          loading="lazy"
          width={1088}
          height={816}
          className="shadow-pop-lg mb-12 w-full rounded-[2rem] border-2 border-ink object-cover"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.team.members.map((m, i) => (
            <div
              key={m.name}
              className={`shadow-pop rounded-3xl border-2 border-ink ${colors[i]} p-6`}
            >
              <h2 className="font-display text-2xl font-black uppercase">
                {m.name}
              </h2>
              <p className="mt-1 text-xs font-extrabold uppercase tracking-wider opacity-80">
                {m.role}
              </p>
              <p className="mt-4 text-sm font-medium leading-relaxed">
                {m.bio}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
