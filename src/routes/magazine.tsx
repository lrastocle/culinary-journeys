import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import magSpices from "@/assets/mag-spices.jpg";
import magRum from "@/assets/mag-rum.jpg";
import heroMarket from "@/assets/hero-market.jpg";

export const Route = createFileRoute("/magazine")({
  head: () => ({
    meta: [
      { title: "Magazine — Tété Dwèt" },
      {
        name: "description",
        content:
          "Recipes, ingredient stories and favourite addresses: the Tété Dwèt magazine about Martinican cuisine.",
      },
      { property: "og:title", content: "Magazine — Tété Dwèt" },
      {
        property: "og:description",
        content:
          "Recipes, ingredient stories and favourite addresses about Martinican cuisine.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/magazine" },
    ],
    links: [{ rel: "canonical", href: "/magazine" }],
  }),
  component: MagazinePage,
});

const images = [magSpices, magRum, heroMarket];

function MagazinePage() {
  const { t } = useLang();

  return (
    <main className="bg-cream">
      <section className="border-b-2 border-ink bg-sea text-cream">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            {t.magazine.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-relaxed text-cream/90">
            {t.magazine.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {t.magazine.articles.map((a, i) => (
            <article
              key={a.title}
              className="shadow-pop flex flex-col overflow-hidden rounded-3xl border-2 border-ink bg-cream"
            >
              <img
                src={images[i]}
                alt={a.title}
                loading="lazy"
                width={944}
                height={704}
                className="aspect-[4/3] w-full border-b-2 border-ink object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <span className="inline-block w-fit rounded-full border-2 border-ink bg-sun px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
                  {a.tag}
                </span>
                <h2 className="mt-4 font-display text-xl font-black uppercase leading-tight">
                  {a.title}
                </h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-ink/70">
                  {a.excerpt}
                </p>
                <span className="mt-auto pt-5 font-display text-sm font-extrabold text-hibiscus">
                  {t.magazine.readMore} →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
