import { useRouter } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

/**
 * Lien vers une adresse du site calculée à partir des contenus de l'admin
 * (adresses dynamiques) : navigation sans rechargement, comme <Link>.
 * Les liens externes et ceux qui ouvrent un nouvel onglet restent des liens normaux.
 */
export function SiteLink({ href, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const router = useRouter();
  const internal = href.startsWith("/") && !href.startsWith("//");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      !internal ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target
    ) {
      return;
    }
    event.preventDefault();
    void router.navigate({ href });
  };

  return <a href={href} onClick={handleClick} {...props} />;
}
