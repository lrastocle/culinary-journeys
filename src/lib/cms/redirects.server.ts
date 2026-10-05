/**
 * Redirections 301 gérées dans l'admin (anciennes adresses WordPress, slugs modifiés…).
 * Appliquées par le point d'entrée serveur avant le rendu des pages.
 */
import { docPath, isContentCollection } from "@/lib/paths";

import { cmsConfig, cmsFetch } from "./fetch.server";
import type { Paginated } from "./types";

type Redirect = {
  from: string;
  type?: "301" | "302" | null;
  to?: {
    type?: "reference" | "custom" | null;
    url?: string | null;
    reference?: { relationTo: string; value: { slug?: string | null } | number } | null;
  } | null;
};

const targetOf = (redirect: Redirect) => {
  const to = redirect.to;
  if (to?.type === "custom") return to.url || null;
  const ref = to?.reference;
  if (ref && isContentCollection(ref.relationTo) && typeof ref.value === "object" && ref.value?.slug) {
    return docPath(ref.relationTo, ref.value.slug, "fr");
  }
  return null;
};

export const findRedirect = async (pathname: string) => {
  const { docs } = await cmsFetch<Paginated<Redirect>>("redirects", {
    where: { "tenant.slug": { equals: cmsConfig().site } },
    limit: 2000,
    depth: 1,
    locale: "fr",
  });
  const candidates = new Set([pathname, pathname.endsWith("/") ? pathname.slice(0, -1) : `${pathname}/`]);
  for (const redirect of docs) {
    if (!candidates.has(redirect.from)) continue;
    const target = targetOf(redirect);
    if (target && target !== pathname) return { target, status: redirect.type === "302" ? 302 : 301 };
  }
  return null;
};
