import { SiteLink } from "@/components/SiteLink";
import { useLang } from "@/lib/i18n";
import { sectionPath } from "@/lib/paths";
import { internationalPhone, useSite } from "@/lib/site";

const SOCIAL_NAMES: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  tripadvisor: "Tripadvisor",
  google: "Google",
};

export function Footer() {
  const { lang, t } = useLang();
  const { settings } = useSite();
  const contact = settings?.contact;
  const title = settings?.sections?.footer;

  return (
    <footer className="border-t-2 border-ink bg-sun py-14 text-ink">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center">
        <p className="max-w-3xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
          {title?.title || t.footer.titleA}
          <br />
          <span className="italic text-hibiscus">{title?.highlight || t.footer.titleB}</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <SiteLink
            href={sectionPath("activities", lang)}
            className="btn-pop rounded-full bg-cream px-8 py-4 font-display text-base font-extrabold"
          >
            {t.footer.cta1}
          </SiteLink>
          <SiteLink
            href={sectionPath("contact", lang)}
            className="rounded-full border-2 border-ink px-8 py-4 font-display text-base font-extrabold transition-colors hover:bg-cream/50"
          >
            {t.footer.cta2}
          </SiteLink>
        </div>
        <address className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold not-italic">
          {contact?.address && <span className="whitespace-pre-line">{contact.address}</span>}
          {contact?.email && (
            <a href={`mailto:${contact.email}`} className="underline">
              {contact.email}
            </a>
          )}
          {contact?.phone && <a href={`tel:${internationalPhone(contact.phone)}`}>{contact.phone}</a>}
        </address>
        {!!settings?.socials?.length && (
          <nav aria-label={t.footer.follow} className="flex flex-wrap justify-center gap-3">
            {settings.socials.map((social) => (
              <a
                key={social.url}
                href={social.url}
                rel="noopener noreferrer"
                target="_blank"
                className="rounded-full border-2 border-ink px-4 py-1.5 text-xs font-extrabold uppercase hover:bg-cream"
              >
                {SOCIAL_NAMES[social.platform] || social.platform}
              </a>
            ))}
          </nav>
        )}
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-ink/60">
          {settings?.footerText || t.footer.rights}
        </span>
      </div>
    </footer>
  );
}
