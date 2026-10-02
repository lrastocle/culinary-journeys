import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import heroMarket from "@/assets/hero-market.jpg";
import guideImg from "@/assets/guide.jpg";
import cocktailsImg from "@/assets/cocktails.jpg";
import excursionImg from "@/assets/excursion.jpg";
import chefImg from "@/assets/chef.jpg";
import hamImg from "@/assets/ham.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tété Dwèt — Food tours & culinary experiences in Martinique" },
      {
        name: "description",
        content:
          "Award-winning walking food tour in Fort-de-France, cocktail workshops, private food excursions and private chefs. Small groups, FR/EN/Creole guides.",
      },
      {
        property: "og:title",
        content: "Tété Dwèt — Food tours & culinary experiences in Martinique",
      },
      {
        property: "og:description",
        content:
          "Award-winning walking food tour in Fort-de-France, cocktail workshops, private food excursions and private chefs.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function ExperienceCard({
  color,
  tag,
  title,
  desc,
  meta,
  img,
  imgAlt,
}: {
  color: string;
  tag: string;
  title: string;
  desc: string;
  meta: string;
  img: string;
  imgAlt: string;
}) {
  return (
    <div
      className={`shadow-pop-lg overflow-hidden rounded-3xl border-2 border-ink ${color} text-cream`}
    >
      <img
        src={img}
        alt={imgAlt}
        loading="lazy"
        width={1024}
        height={768}
        className="aspect-[4/3] w-full border-b-2 border-ink object-cover"
      />
      <div className="p-7">
        <span className="inline-block rounded-full bg-cream px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink">
          {tag}
        </span>
        <h3 className="mt-4 font-display text-3xl font-black uppercase">
          {title}
        </h3>
        <p className="mt-3 text-sm font-medium leading-relaxed">{desc}</p>
        <div className="mt-5 flex items-center justify-between border-t border-cream/40 pt-4">
          <span className="text-sm font-semibold">{meta}</span>
          <Link
            to="/contact"
            className="font-display text-lg font-black hover:underline"
          >
            →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const { t } = useLang();

  return (
    <main>
      {/* HERO */}
      <section className="border-b-2 border-ink bg-leaf text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div className="relative">
            <div className="absolute -right-4 -top-6 z-10 rotate-6 rounded-full border-2 border-ink bg-sun px-4 py-1 font-display text-xs font-extrabold text-ink shadow-pop-sm">
              {t.hero.badge}
            </div>
            <img
              src={heroMarket}
              alt="Creole street food market in Fort-de-France"
              width={1088}
              height={1360}
              className="aspect-[4/5] w-full rounded-[2rem] border-2 border-ink object-cover"
            />
            <div className="shadow-pop absolute -bottom-6 -left-6 hidden rounded-2xl border-2 border-ink bg-cream px-5 py-4 text-ink md:block">
              <span className="font-display text-4xl font-black text-hibiscus">
                2×
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-wider">
                {t.hero.awards}
              </span>
            </div>
          </div>
          <div>
            <h1 className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl">
              {t.hero.titleA}
              <br />
              <span className="text-sun">{t.hero.titleB}</span>
              <br />
              {t.hero.titleC}
            </h1>
            <p className="mt-6 max-w-md text-lg font-medium leading-relaxed text-cream/90">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="btn-pop rounded-full bg-sun px-8 py-4 font-display text-base font-extrabold text-ink"
              >
                {t.hero.cta}
              </Link>
              <span className="text-sm font-semibold">{t.hero.meta}</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRESS STRIP */}
      <section className="border-b-2 border-ink bg-cream py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ink/50">
            {t.press.kicker}
          </p>
          <span className="font-display text-lg font-extrabold italic text-ink/70">
            Échappées Belles
          </span>
          <span className="font-display text-lg font-extrabold italic text-ink/70">
            Cosmopolitan
          </span>
          <span className="font-display text-lg font-extrabold italic text-ink/70">
            France-Antilles
          </span>
          <span className="rounded-full border-2 border-ink bg-hibiscus px-3 py-1 text-xs font-extrabold text-cream">
            ★ Travellers' Choice ×2
          </span>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section id="experiences" className="border-b-2 border-ink bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
              {t.experiences.title}
            </h2>
            <span className="hidden text-sm font-semibold text-ink/50 md:block">
              {t.experiences.kicker}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <ExperienceCard
              color="bg-plum"
              tag={t.experiences.foodTour.tag}
              title={t.experiences.foodTour.title}
              desc={t.experiences.foodTour.desc}
              meta={t.experiences.foodTour.meta}
              img={heroMarket}
              imgAlt="Food tour Fort-de-France"
            />
            <ExperienceCard
              color="bg-mango"
              tag={t.experiences.cocktails.tag}
              title={t.experiences.cocktails.title}
              desc={t.experiences.cocktails.desc}
              meta={t.experiences.cocktails.meta}
              img={cocktailsImg}
              imgAlt="Cocktail creation workshop"
            />
            <ExperienceCard
              color="bg-sea"
              tag={t.experiences.excursion.tag}
              title={t.experiences.excursion.title}
              desc={t.experiences.excursion.desc}
              meta={t.experiences.excursion.meta}
              img={excursionImg}
              imgAlt="Food excursion around Martinique"
            />
            <ExperienceCard
              color="bg-hibiscus"
              tag={t.experiences.chef.tag}
              title={t.experiences.chef.title}
              desc={t.experiences.chef.desc}
              meta={t.experiences.chef.meta}
              img={chefImg}
              imgAlt="Private chef at your villa"
            />
          </div>
        </div>
      </section>

      {/* CHRISTMAS HAM */}
      <section className="border-b-2 border-ink bg-sun text-ink">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full border-2 border-ink bg-hibiscus px-4 py-1 font-display text-xs font-extrabold uppercase tracking-wider text-cream">
              {t.ham.tag}
            </span>
            <h2 className="mt-5 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
              {t.ham.title}
            </h2>
            <p className="mt-5 max-w-md text-lg font-medium leading-relaxed">
              {t.ham.desc}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="btn-pop rounded-full bg-hibiscus px-8 py-4 font-display text-base font-extrabold text-cream"
              >
                {t.ham.cta}
              </Link>
              <span className="text-sm font-semibold">{t.ham.meta}</span>
            </div>
          </div>
          <img
            src={hamImg}
            alt="Homemade Christmas ham glazed with caramel and pineapple"
            loading="lazy"
            width={1024}
            height={1024}
            className="shadow-pop-lg w-full rounded-[2rem] border-2 border-ink object-cover"
          />
        </div>
      </section>

      {/* GUIDE */}
      <section className="border-b-2 border-ink bg-ink py-20 text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-[1fr_1.1fr]">
          <img
            src={guideImg}
            alt="Your local guide in Fort-de-France"
            loading="lazy"
            width={1008}
            height={1104}
            className="aspect-square w-full rounded-[2rem] border-2 border-sun object-cover"
          />
          <div>
            <h2 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
              {t.guide.titleA}
              <br />
              <span className="text-sun">{t.guide.titleB}</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-cream/80">
              {t.guide.desc}
            </p>
            <div className="mt-8 grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-cream/20 bg-cream/5 px-5 py-4">
                <span className="text-2xl">★</span>
                <span className="text-sm font-semibold">{t.guide.point1}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border-2 border-cream/20 bg-cream/5 px-5 py-4">
                <span className="text-2xl">✓</span>
                <span className="text-sm font-semibold">{t.guide.point2}</span>
              </div>
            </div>
            <Link
              to="/equipe"
              className="btn-pop mt-8 inline-block rounded-full bg-sun px-8 py-4 font-display text-base font-extrabold text-ink"
            >
              {t.guide.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* TAILOR-MADE */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
            {t.tailor.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink/70">
            {t.tailor.desc}
          </p>
          <Link
            to="/contact"
            className="btn-pop mt-8 inline-block rounded-full bg-leaf px-8 py-4 font-display text-base font-extrabold text-cream"
          >
            {t.tailor.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}
