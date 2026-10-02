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

- Design system: "Bold Caribbean Pop" — all colors are oklch tokens in src/styles.css (sun, mango, hibiscus, leaf, sea, cream, plum, ink). Components must use these tokens plus the `shadow-pop*` / `btn-pop` utilities; never hardcode hex colors or Tailwind palette classes.
- Fonts: Archivo (display, `--font-display`) + DM Sans (body, `--font-body`), loaded via Google Fonts <link> in src/routes/__root.tsx.
- Bilingual FR/EN: all user-facing copy lives in the dictionary in src/lib/i18n.tsx (`useLang()` hook). Never hardcode UI strings in components; add keys to both `fr` and `en`.
- Language choice persists in localStorage key `tete-dwet-lang`, read in useEffect only (SSR-safe).
- Routes: / (home), /qui-sommes-nous, /magazine, /boutique, /equipe, /contact. Each route has its own head() metadata; canonical links on leaf routes only.
