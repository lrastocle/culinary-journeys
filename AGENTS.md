<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS.md

## Architecture rules

- Design system: "Bold Caribbean Pop" — all colors are oklch tokens in src/styles.css (sun, mango, hibiscus, leaf, sea, cream, plum, ink). Components must use these tokens plus the `shadow-pop*` / `btn-pop` utilities; never hardcode hex colors or Tailwind palette classes. Colors chosen in the admin map to these tokens in `src/lib/site.ts` (`themes`).
- Fonts: Archivo (display, `--font-display`) + DM Sans (body, `--font-body`), loaded via Google Fonts <link> in src/routes/__root.tsx.
- Content comes from the shared admin (Payload, repo `lrastocle/mjr-admin`, folder `admin/`) through its REST API, server-side only: `src/lib/cms/` (server functions in `api.ts`, cached fetch in `fetch.server.ts`). Never hardcode content (tours, products, team, press, contacts, page texts) in components; the dictionary `src/lib/i18n.tsx` holds UI strings only, in both `fr` and `en`.
- Bilingual FR/EN by URL: French at the root, English under `/en/`. The language comes from the path (`useLang()`), never from local storage. English content only exists when translated in the admin (no French fallback under /en/).
- All URLs end with `/` (old WordPress URLs are kept). Content URLs are computed in `src/lib/paths.ts` and must match `admin/src/utilities/publicPath.ts`. Old URLs are redirected by the admin's redirects, applied in `src/server.ts`.
- Routes: one thin file per URL in `src/routes/` (FR) and `src/routes/en/` (EN), each wiring a view from `src/views/` (loader + head + component). Each route sets its own head (title, description, absolute canonical, hreflang) via `src/lib/seo.ts`.
- Booking: FareHarbor links (opened as an overlay by the FareHarbor script in the root head) when an activity or product has a FareHarbor item, otherwise a request through the contact form (`BookButton`).
- Environment: see `.env.example` (CMS_URL, CMS_SITE, SITE_URL, CMS_CACHE_SECONDS).
