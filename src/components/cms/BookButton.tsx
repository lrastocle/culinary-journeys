import type { ReactNode } from "react";

import { SiteLink } from "@/components/SiteLink";
import type { FareHarborRef } from "@/lib/cms/types";
import { useLang } from "@/lib/i18n";
import { fareharborUrl, sectionPath } from "@/lib/paths";
import { useSite } from "@/lib/site";

/**
 * Bouton de réservation d'une activité ou d'un produit :
 * - avec un article FareHarbor : lien que le script FareHarbor (chargé dans <head>)
 *   ouvre en surimpression ;
 * - sinon : demande par le formulaire de contact, sujet prérempli.
 */
export function BookButton({
  item,
  title,
  className,
  children,
  requestLabel,
}: {
  item: FareHarborRef | string | null | undefined;
  /** Nom de l'activité ou du produit, repris dans la demande de contact. */
  title: string;
  className?: string;
  children: ReactNode;
  requestLabel?: ReactNode;
}) {
  const { settings } = useSite();
  const { lang, t } = useLang();
  const account = settings?.fareharbor;
  const ref = typeof item === "string" ? { itemId: item } : item;
  if (account?.shortname && ref?.itemId) {
    return (
      <a href={fareharborUrl(account.shortname, ref.itemId, ref.flowId || account.flowId)} className={className}>
        {children}
      </a>
    );
  }
  return (
    <SiteLink href={`${sectionPath("contact", lang)}?objet=${encodeURIComponent(title)}`} className={className}>
      {requestLabel ?? t.activities.request}
    </SiteLink>
  );
}
