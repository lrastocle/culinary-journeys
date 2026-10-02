import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import heroMarket from "@/assets/hero-market.jpg";

export const Route = createFileRoute("/qui-sommes-nous")({
  head: () => ({
    meta: [
      { title: "Who we are — Tété Dwèt" },
      {
        name: "description",
        content:
          "Tété Dwèt means “it's tasty” in Martinican Creole. Meet the small local team behind Martinique's award-winning food experiences.",
      },
      { property: "og:title", content: "Who we are — Tété Dwèt" },
      {
        property: "og:description",
        content:
          "The small local team behind Martinique's award-winning food experiences.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/qui-sommes-nous" },
    ],
    links: [{ rel: "canonical", href: "/qui-sommes-nous" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useLang();

  return (
    <main className="bg-cream">
      <section className="border-b-2 border-ink bg-mango text-cream">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            {t.about.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-relaxed text-cream/90">
            {t.about.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <div className="space-y-5 text-base font-medium leading-relaxed text-ink/80">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
        </div>
        <img
          src={heroMarket}
          alt="Fort-de-France market"
          loading="lazy"
          width={1088}
          height={1360}
          className="shadow-pop-lg aspect-[4/5] w-full rounded-[2rem] border-2 border-ink object-cover"
        />
      </section>

      <section className="border-t-2 border-ink bg-cream pb-20">
        <div className="mx-auto max-w-7xl px-6 pt-14">
          <h2 className="font-display text-3xl font-black uppercase tracking-tight md:text-4xl">
            {t.about.valuesTitle}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: t.about.value1T, d: t.about.value1D, c: "bg-sun" },
              { t: t.about.value2T, d: t.about.value2D, c: "bg-leaf text-cream" },
              { t: t.about.value3T, d: t.about.value3D, c: "bg-sea text-cream" },
            ].map((v) => (
              <div
                key={v.t}
                className={`shadow-pop rounded-3xl border-2 border-ink ${v.c} p-7`}
              >
                <h3 className="font-display text-2xl font-black uppercase">
                  {v.t}
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed">
                  {v.d}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/equipe"
            className="btn-pop mt-10 inline-block rounded-full bg-ink px-8 py-4 font-display text-base font-extrabold text-cream"
          >
            {t.guide.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}
