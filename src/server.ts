import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { findRedirect } from "./lib/cms/redirects.server";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/** Fichiers, fonctions serveur et ressources techniques : pas de redirection. */
const isTechnicalPath = (pathname: string) =>
  pathname.startsWith("/_") || pathname.startsWith("/@") || /\.[a-z0-9]{2,5}$/i.test(pathname);

/**
 * Avant le rendu : redirections de l'admin (anciennes adresses), puis slash final
 * obligatoire (toutes les adresses du site finissent par /, comme sur l'ancien site).
 */
async function redirectFor(request: Request): Promise<Response | null> {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  if (isTechnicalPath(url.pathname)) return null;
  try {
    const redirect = await findRedirect(url.pathname);
    if (redirect) {
      return Response.redirect(new URL(redirect.target + url.search, url), redirect.status);
    }
  } catch (error) {
    // Admin injoignable : on continue sans redirection plutôt que de bloquer le site.
    console.error(error);
  }
  if (!url.pathname.endsWith("/")) {
    return Response.redirect(new URL(`${url.pathname}/${url.search}`, url), 301);
  }
  return null;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const redirect = await redirectFor(request);
      if (redirect) return redirect;
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
