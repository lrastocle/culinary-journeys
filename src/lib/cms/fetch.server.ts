/**
 * Accès à l'API REST de l'admin, côté serveur uniquement (appelé depuis les fonctions
 * serveur et le point d'entrée). Les réponses sont gardées en mémoire quelques
 * instants : une publication dans l'admin apparaît sur le site au plus tard après
 * CMS_CACHE_SECONDS (60 s par défaut). Si l'admin ne répond pas, la dernière réponse
 * connue est resservie.
 */

export const cmsConfig = () => ({
  url: (process.env["CMS_URL"] || "http://localhost:3000").replace(/\/$/, ""),
  site: process.env["CMS_SITE"] || "tete-dwet",
  siteUrl: (process.env["SITE_URL"] || "https://www.tetedwet.com").replace(/\/$/, ""),
  cacheSeconds: Number(process.env["CMS_CACHE_SECONDS"] ?? 60),
});

type Query = Record<string, unknown>;

/** Encode un objet en paramètres « à la qs » attendus par Payload : where[slug][equals]=… */
const encode = (query: Query, prefix = ""): string[] =>
  Object.entries(query).flatMap(([key, value]) => {
    const name = prefix ? `${prefix}[${key}]` : key;
    if (value === undefined || value === null) return [];
    if (Array.isArray(value)) {
      return value.flatMap((item, i) =>
        typeof item === "object" && item !== null
          ? encode(item as Query, `${name}[${i}]`)
          : [`${encodeURIComponent(`${name}[${i}]`)}=${encodeURIComponent(String(item))}`],
      );
    }
    if (typeof value === "object") return encode(value as Query, name);
    return [`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`];
  });

type CacheEntry = { expires: number; value?: unknown; pending?: Promise<unknown> };
const cache = new Map<string, CacheEntry>();

export class CmsError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export const cmsFetch = async <T>(path: string, query: Query = {}): Promise<T> => {
  const { url, cacheSeconds } = cmsConfig();
  const target = `${url}/api/${path}?${encode(query).join("&")}`;
  const now = Date.now();
  const entry = cache.get(target);
  if (entry && entry.value !== undefined && entry.expires > now) return entry.value as T;
  if (entry?.pending) return entry.pending as Promise<T>;

  const pending = (async () => {
    try {
      const res = await fetch(target, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new CmsError(`Admin ${path} : HTTP ${res.status}`, res.status);
      const value = (await res.json()) as T;
      cache.set(target, { value, expires: Date.now() + cacheSeconds * 1000 });
      return value;
    } catch (error) {
      // Admin injoignable : on resert la dernière réponse connue plutôt qu'une erreur.
      if (entry?.value !== undefined) {
        console.error(error);
        cache.set(target, { value: entry.value, expires: Date.now() + 10_000 });
        return entry.value as T;
      }
      cache.delete(target);
      throw error;
    }
  })();
  cache.set(target, { ...entry, expires: entry?.expires ?? 0, pending });
  return pending;
};

/** Envoi (formulaires) : jamais mis en cache. */
export const cmsPost = async <T>(path: string, body: unknown): Promise<T> => {
  const { url } = cmsConfig();
  const res = await fetch(`${url}/api/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new CmsError(`Admin ${path} : HTTP ${res.status}`, res.status);
  return (await res.json()) as T;
};
