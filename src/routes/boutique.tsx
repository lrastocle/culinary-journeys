import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import shopGuide from "@/assets/shop-guide.jpg";
import shopTote from "@/assets/shop-tote.jpg";
import shopJars from "@/assets/shop-jars.jpg";

export const Route = createFileRoute("/boutique")({
  head: () => ({
    meta: [
      { title: "Shop — Tété Dwèt" },
      {
        name: "description",
        content:
          "Food travel guides, madras tote bags and artisanal sauces: take a piece of Martinique home with you.",
      },
      { property: "og:title", content: "Shop — Tété Dwèt" },
      {
        property: "og:description",
        content:
          "Food travel guides, madras tote bags and artisanal sauces from Martinique.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/boutique" },
    ],
    links: [{ rel: "canonical", href: "/boutique" }],
  }),
  component: ShopPage,
});

const images = [shopGuide, shopTote, shopJars];

function ShopPage() {
  const { t } = useLang();

  return (
    <main className="bg-cream">
      <section className="border-b-2 border-ink bg-hibiscus text-cream">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            {t.shop.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-relaxed text-cream/90">
            {t.shop.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {t.shop.items.map((item, i) => (
            <div
              key={item.name}
              className="shadow-pop flex flex-col overflow-hidden rounded-3xl border-2 border-ink bg-cream"
            >
              <img
                src={images[i]}
                alt={item.name}
                loading="lazy"
                width={816}
                height={816}
                className="aspect-square w-full border-b-2 border-ink object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-xl font-black uppercase leading-tight">
                  {item.name}
                </h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-ink/70">
                  {item.desc}
                </p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="font-display text-2xl font-black text-hibiscus">
                    {item.price}
                  </span>
                  <Link
                    to="/contact"
                    className="btn-pop rounded-full bg-sun px-5 py-2 font-display text-sm font-extrabold"
                  >
                    {t.shop.add}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm font-semibold text-ink/60">
          {t.shop.note}
        </p>
      </section>
    </main>
  );
}
