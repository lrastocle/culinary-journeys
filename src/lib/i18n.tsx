import { useRouterState } from "@tanstack/react-router";

import { langFromPath, type Lang } from "@/lib/paths";

export type { Lang };

/**
 * Textes d'interface du site. Les contenus (activités, produits, articles, équipe,
 * presse, coordonnées) viennent de l'admin et ne sont jamais écrits ici.
 */
const dict = {
  fr: {
    locale: "fr-FR",
    skip: "Aller au contenu",
    nav: {
      activities: "Nos expériences",
      about: "Qui sommes-nous",
      blog: "Blog",
      shop: "Boutique",
      team: "Notre équipe",
      contact: "Contact",
      book: "Réserver",
      menu: "Menu",
      switchTo: "English",
    },
    activities: {
      title: "Nos expériences",
      intro: "Visites gourmandes et culturelles, ateliers, excursions et chefs à domicile en Martinique.",
      types: {
        food: "Visite gourmande",
        cultural: "Visite culturelle",
        workshop: "Atelier",
        excursion: "Excursion privée",
        chef: "Chef à domicile",
      },
      request: "Demander",
      from: "dès",
      duration: "Durée",
      languages: "Langues",
      groupSize: "Groupe",
      meetingPoint: "Point de rendez-vous",
      highlights: "Les temps forts",
      included: "Inclus",
      notIncluded: "Non inclus",
      gallery: "En images",
      book: "Réserver",
      details: "Découvrir",
      empty: "Nos expériences seront bientôt en ligne. Écrivez-nous pour réserver !",
      langNames: { fr: "Français", en: "Anglais", gcf: "Créole", es: "Espagnol", de: "Allemand" } as Record<string, string>,
    },
    featured: { tag: "À ne pas manquer", cta: "Commander", details: "En savoir plus" },
    footer: {
      titleA: "Vos vacances,",
      titleB: "enfin savoureuses",
      cta1: "Réserver une visite",
      cta2: "Nous écrire",
      rights: "« Tété dwèt » : « c'est délicieux » en créole",
      follow: "Suivez-nous",
    },
    blog: {
      title: "Le blog",
      intro: "Adresses gourmandes, terroir, traditions et rencontres : nos articles pour prolonger le voyage.",
      readMore: "Lire l'article",
      by: "Par",
      related: "À lire aussi",
      category: "Catégorie",
      tag: "Étiquette",
      prev: "Articles plus récents",
      next: "Articles plus anciens",
      page: "Page",
      empty: "Aucun article pour le moment.",
      back: "Tous les articles",
    },
    shop: {
      title: "La Boutique",
      intro: "Cartes cadeaux et douceurs maison, à commander en ligne.",
      order: "Commander",
      soldOut: "Épuisé",
      empty: "La boutique est vide pour le moment.",
      back: "Toute la boutique",
    },
    team: {
      title: "Notre équipe",
      intro: "Les guides et passionnés qui vous font goûter la Martinique.",
      empty: "Présentation de l'équipe à venir.",
    },
    contact: {
      title: "Contactez-nous",
      intro: "Une question, une réservation, une demande sur mesure ? Écrivez-nous, on répond vite.",
      send: "Envoyer",
      sending: "Envoi…",
      sent: "Merci ! Votre message est bien envoyé — nous revenons vers vous très vite.",
      error: "L'envoi n'a pas abouti. Réessayez, ou écrivez-nous directement.",
      direct: "Ou directement :",
      noForm: "Écrivez-nous directement :",
      required: "obligatoire",
    },
    notFound: {
      title: "Page introuvable",
      text: "Cette page n'existe pas ou a été déplacée.",
      home: "Retour à l'accueil",
    },
    error: {
      title: "Cette page n'a pas pu s'afficher",
      text: "Une erreur est survenue de notre côté. Réessayez dans un instant.",
      retry: "Réessayer",
    },
    faq: "Questions fréquentes",
  },
  en: {
    locale: "en-GB",
    skip: "Skip to content",
    nav: {
      activities: "Experiences",
      about: "Who we are",
      blog: "Blog",
      shop: "Shop",
      team: "Our team",
      contact: "Contact",
      book: "Book now",
      menu: "Menu",
      switchTo: "Français",
    },
    activities: {
      title: "Our experiences",
      intro: "Food and cultural tours, workshops, excursions and private chefs in Martinique.",
      types: {
        food: "Food tour",
        cultural: "Cultural tour",
        workshop: "Workshop",
        excursion: "Private excursion",
        chef: "Private chef",
      },
      request: "Request",
      from: "from",
      duration: "Duration",
      languages: "Languages",
      groupSize: "Group",
      meetingPoint: "Meeting point",
      highlights: "Highlights",
      included: "Included",
      notIncluded: "Not included",
      gallery: "Gallery",
      book: "Book now",
      details: "Discover",
      empty: "Our experiences will be online soon. Get in touch to book!",
      langNames: { fr: "French", en: "English", gcf: "Creole", es: "Spanish", de: "German" } as Record<string, string>,
    },
    featured: { tag: "Don't miss", cta: "Order", details: "Learn more" },
    footer: {
      titleA: "Your holidays,",
      titleB: "finally tasty",
      cta1: "Book a tour",
      cta2: "Write to us",
      rights: "“Tété dwèt”: “it's delicious” in Creole",
      follow: "Follow us",
    },
    blog: {
      title: "The blog",
      intro: "Food spots, local produce, traditions and encounters: our articles to make the trip last.",
      readMore: "Read the article",
      by: "By",
      related: "Read also",
      category: "Category",
      tag: "Tag",
      prev: "Newer articles",
      next: "Older articles",
      page: "Page",
      empty: "No articles yet.",
      back: "All articles",
    },
    shop: {
      title: "The Shop",
      intro: "Gift cards and homemade treats, to order online.",
      order: "Order",
      soldOut: "Sold out",
      empty: "The shop is empty for now.",
      back: "Whole shop",
    },
    team: {
      title: "Our team",
      intro: "The guides and food lovers who make you taste Martinique.",
      empty: "Team introduction coming soon.",
    },
    contact: {
      title: "Contact us",
      intro: "A question, a booking, a tailor-made request? Write to us, we answer quickly.",
      send: "Send",
      sending: "Sending…",
      sent: "Thank you! Your message has been sent — we will get back to you very soon.",
      error: "Sending failed. Please try again, or write to us directly.",
      direct: "Or directly:",
      noForm: "Write to us directly:",
      required: "required",
    },
    notFound: {
      title: "Page not found",
      text: "This page doesn't exist or has been moved.",
      home: "Back to home",
    },
    error: {
      title: "This page didn't load",
      text: "Something went wrong on our end. Please try again in a moment.",
      retry: "Try again",
    },
    faq: "Frequently asked questions",
  },
} as const;

export type Dict = (typeof dict)[Lang];

/** Langue de la page, déduite de l'adresse (/en/… = anglais). */
export function useLang(): { lang: Lang; t: Dict } {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const lang = langFromPath(pathname);
  return { lang, t: dict[lang] };
}

export const getDict = (lang: Lang): Dict => dict[lang];
