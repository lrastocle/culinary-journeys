# Tété Dwèt — site public (tetedwet.com)

Site de Tété Dwèt (food tours et expériences culinaires en Martinique), conçu avec Lovable
(design « Bold Caribbean Pop ») et alimenté par l'admin commun Majorine / Tété Dwèt
(Payload CMS, dépôt `lrastocle/mjr-admin`, dossier `admin/`).

## Stack

TanStack Start (rendu serveur) · React · Tailwind CSS · shadcn/ui.

## Contenus

Tout le contenu vient de l'admin : pages composées de blocs (accueil, qui sommes-nous…),
blog (articles, catégories, étiquettes), expériences, boutique, équipe, presse, formulaire de
contact, coordonnées et textes des rubriques. Une publication dans l'admin apparaît sur le
site au plus tard après `CMS_CACHE_SECONDS` (60 s).

| Adresse (FR) | Adresse (EN) | Contenu |
|---|---|---|
| `/` | `/en/` | Page d'accueil choisie dans les réglages du site |
| `/<slug>/` | `/en/<slug>/` | Page ou article (mêmes adresses que l'ancien WordPress) |
| `/blog/`, `/category/<slug>/`, `/tag/<slug>/` | idem sous `/en/` | Listes d'articles (`?page=2`) |
| `/visites/`, `/visites/<slug>/` | `/en/tours/…` | Expériences (réservation FareHarbor ou demande) |
| `/boutique/`, `/boutique/<slug>/` | `/en/shop/…` | Produits (FareHarbor ou demande) |
| `/equipe/`, `/contact/` | `/en/team/`, `/en/contact/` | Équipe, formulaire de contact |
| `/sitemap.xml`, `/robots.txt` | | Générés à partir de l'admin |

Les anciennes adresses sont redirigées (301) selon les redirections de l'admin ; une adresse
sans `/` final est redirigée vers la même avec `/`.

## Développement

```bash
cp .env.example .env   # CMS_URL : admin local (voir admin/README.md dans mjr-admin)
bun install
bun run dev
```

Test local du rendu serveur, avec un admin lancé sur le port 3000 :

```bash
NITRO_PRESET=node-server bun run build
PORT=3001 CMS_URL=http://localhost:3000 node .output/server/index.mjs
```

Sans `NITRO_PRESET`, la configuration Lovable construit pour Cloudflare ; sur Netlify, le
préréglage Netlify est détecté automatiquement.

Voir `AGENTS.md` pour les règles d'architecture.
