import { CmsForm } from "@/components/cms/CmsForm";
import { PageHeader } from "@/components/PageHeader";
import { getContactForm } from "@/lib/cms/api";
import type { Form } from "@/lib/cms/types";
import { getDict, useLang } from "@/lib/i18n";
import { sectionAlternates, type Lang } from "@/lib/paths";
import { buildHead, siteFrom } from "@/lib/seo";
import { internationalPhone, useSection, useSite } from "@/lib/site";

type Matches = Parameters<typeof siteFrom>[0];
type Search = { objet?: string };

/** Contact : /contact/ et /en/contact/. `?objet=` préremplit le sujet (bouton « Demander »). */
export const contactRoute = (lang: Lang) => ({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search["objet"] === "string" && search["objet"] ? { objet: search["objet"].slice(0, 200) } : {},
  loader: () => getContactForm({ data: { lang } }),
  head: ({ matches }: { matches: Matches }) => {
    const t = getDict(lang);
    const section = siteFrom(matches).settings?.sections?.contact;
    return buildHead({
      matches,
      lang,
      title: section?.title || t.contact.title,
      description: section?.intro || t.contact.intro,
      alternates: sectionAlternates("contact"),
    });
  },
});

const cardCls = "shadow-pop block rounded-2xl border-2 border-ink px-6 py-5 font-display text-lg font-extrabold";

export function ContactView({ form, prefill }: { form: Form | null; prefill: string | undefined }) {
  const { t } = useLang();
  const { settings } = useSite();
  const section = useSection("contact", { title: t.contact.title, intro: t.contact.intro });
  const contact = settings?.contact;
  return (
    <main id="main" className="bg-cream">
      <PageHeader title={section.title} intro={section.intro} color="plum" />
      <section className={`mx-auto grid max-w-7xl gap-10 px-6 py-16 ${form ? "md:grid-cols-[1.2fr_1fr]" : ""}`}>
        {form && (
          <div className="shadow-pop-lg rounded-3xl border-2 border-ink bg-cream p-8">
            <CmsForm form={form} prefill={prefill} />
          </div>
        )}
        <div className="space-y-4">
          <p className="font-display text-lg font-extrabold uppercase">{form ? t.contact.direct : t.contact.noForm}</p>
          {contact?.email && (
            <a href={`mailto:${contact.email}`} className={`${cardCls} bg-sun`}>
              {contact.email}
            </a>
          )}
          {contact?.phone && (
            <a href={`tel:${internationalPhone(contact.phone)}`} className={`${cardCls} bg-sea text-cream`}>
              {contact.phone}
            </a>
          )}
          {contact?.whatsapp && (
            <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} className={`${cardCls} bg-leaf text-cream`}>
              WhatsApp
            </a>
          )}
          {contact?.address &&
            (contact.mapsUrl ? (
              <a href={contact.mapsUrl} className={`${cardCls} whitespace-pre-line bg-leaf text-cream`}>
                {contact.address}
              </a>
            ) : (
              <div className={`${cardCls} whitespace-pre-line bg-leaf text-cream`}>{contact.address}</div>
            ))}
          {contact?.openingHours && <p className="whitespace-pre-line text-sm font-medium text-ink/70">{contact.openingHours}</p>}
        </div>
      </section>
    </main>
  );
}
