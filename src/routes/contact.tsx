import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Tété Dwèt" },
      {
        name: "description",
        content:
          "Book a food tour, a private chef or a tailor-made food experience in Martinique: contact the Tété Dwèt team.",
      },
      { property: "og:title", content: "Contact — Tété Dwèt" },
      {
        property: "og:description",
        content:
          "Book a food tour, a private chef or a tailor-made food experience in Martinique.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const inputCls =
  "w-full rounded-xl border-2 border-ink bg-cream px-4 py-3 text-sm font-medium placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-hibiscus";

function ContactPage() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);

  return (
    <main className="bg-cream">
      <section className="border-b-2 border-ink bg-plum text-cream">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            {t.contact.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-relaxed text-cream/90">
            {t.contact.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_1fr]">
        <div className="shadow-pop-lg rounded-3xl border-2 border-ink bg-cream p-8">
          {sent ? (
            <p className="rounded-2xl border-2 border-ink bg-leaf p-6 font-display text-lg font-extrabold text-cream">
              {t.contact.sent}
            </p>
          ) : (
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input required placeholder={t.contact.name} className={inputCls} />
              <input
                required
                type="email"
                placeholder={t.contact.email}
                className={inputCls}
              />
              <select required defaultValue="" className={inputCls}>
                <option value="" disabled>
                  {t.contact.subject}
                </option>
                <option value="tour">{t.contact.subjects.tour}</option>
                <option value="cocktails">{t.contact.subjects.cocktails}</option>
                <option value="excursion">{t.contact.subjects.excursion}</option>
                <option value="chef">{t.contact.subjects.chef}</option>
                <option value="ham">{t.contact.subjects.ham}</option>
                <option value="tailor">{t.contact.subjects.tailor}</option>
                <option value="other">{t.contact.subjects.other}</option>
              </select>
              <textarea
                required
                rows={5}
                placeholder={t.contact.message}
                className={inputCls}
              />
              <button
                type="submit"
                className="btn-pop w-fit rounded-full bg-hibiscus px-8 py-4 font-display text-base font-extrabold text-cream"
              >
                {t.contact.send}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <p className="font-display text-lg font-extrabold uppercase">
            {t.contact.direct}
          </p>
          <a
            href="mailto:bonjour@tetedwet.com"
            className="shadow-pop block rounded-2xl border-2 border-ink bg-sun px-6 py-5 font-display text-lg font-extrabold"
          >
            bonjour@tetedwet.com
          </a>
          <a
            href="tel:+596696000000"
            className="shadow-pop block rounded-2xl border-2 border-ink bg-sea px-6 py-5 font-display text-lg font-extrabold text-cream"
          >
            +596 696 00 00 00
          </a>
          <div className="shadow-pop rounded-2xl border-2 border-ink bg-leaf px-6 py-5 font-display text-lg font-extrabold text-cream">
            Fort-de-France, Martinique
          </div>
        </div>
      </section>
    </main>
  );
}
