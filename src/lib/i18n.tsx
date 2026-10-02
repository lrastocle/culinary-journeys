import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "fr" | "en";

const dict = {
  fr: {
    nav: {
      experiences: "Nos expériences",
      about: "Qui sommes-nous",
      magazine: "Magazine",
      shop: "Boutique",
      team: "Notre équipe",
      contact: "Contact",
      book: "Réserver",
    },
    hero: {
      badge: "N°1 — Best seller",
      titleA: "Dégustez",
      titleB: "Fort-de-France",
      titleC: "à la cuillère",
      subtitle:
        "Plongez dans la cuisine martiniquaise authentique avec notre guide locale experte, en petit groupe. Vu dans Échappées Belles, Cosmopolitan & France-Antilles.",
      cta: "Réserver le food tour",
      meta: "4 h · petits groupes · FR / EN / Créole",
      awards: "Travellers' Choice",
    },
    experiences: {
      title: "Nos expériences",
      kicker: "4 façons de goûter l'île",
      foodTour: {
        tag: "Best seller",
        title: "Food tour Fort-de-France",
        desc: "Le grand classique. Une marche gourmande dans Fort-de-France avec une experte locale qui parle français, anglais et créole. La meilleure façon de goûter nos vrais plats authentiques.",
        meta: "4 h · max 8 pers.",
      },
      cocktails: {
        tag: "Nouveau",
        title: "Atelier cocktails",
        desc: "Créez vous-même 3 cocktails iconiques de Martinique, de la canne au verre. Les mains dans les épices, en petit groupe.",
        meta: "2 h · petit groupe",
      },
      excursion: {
        tag: "Privé",
        title: "Excursion gourmande",
        desc: "Voiture climatisée privée et guide dédié : tour de l'île entre spots culturels et nos adresses préférées — petit-déj, déjeuner, snack ou dîner.",
        meta: "Journée · sur mesure",
      },
      chef: {
        tag: "À domicile",
        title: "Chef privé",
        desc: "Cuisine traditionnelle, brunch ou grande occasion : nos chefs cuisinent chez vous ou dans votre villa. Vous n'avez qu'à vous régaler.",
        meta: "Sur devis · 4–12 pers.",
      },
      discover: "Découvrir",
    },
    ham: {
      tag: "Édition de Noël",
      title: "Le Jambon de Noël maison",
      desc: "Notre jambon de Noël artisanal, laqué au caramel et à l'ananas, préparé comme à la maison. Réservez le vôtre pour les fêtes — les quantités sont limitées !",
      cta: "Réserver mon jambon",
      meta: "Fait maison · caramel & ananas · retrait en décembre",
    },
    guide: {
      titleA: "Votre guide,",
      titleB: "votre voisine",
      desc: "Chaque expérience est menée par une experte née sur l'île. Elle vous raconte les histoires derrière chaque plat, en français, en anglais ou en créole.",
      point1: "Élue meilleure expérience gourmande — 2× Travellers' Choice",
      point2: "Petits groupes pour un accueil chaleureux",
      cta: "Rencontrer l'équipe",
    },
    tailor: {
      title: "Envie d'une expérience sur mesure ?",
      desc: "Anniversaire, EVJF, voyage d'entreprise ou simple envie particulière : nous créons l'expérience gourmande qui vous ressemble. Parlez-nous de votre projet !",
      cta: "Contactez-nous",
    },
    press: {
      kicker: "Ils en parlent",
    },
    footer: {
      titleA: "Vos vacances,",
      titleB: "enfin savoureuses",
      cta1: "Réserver une expérience",
      cta2: "Demander un devis privé",
      address: "Fort-de-France, Martinique",
      rights: "© Tété Dwèt · Martinique — « tété dwèt » signifie « c'est délicieux » en créole",
    },
    about: {
      title: "Qui sommes-nous ?",
      intro:
        "Tété Dwèt — « c'est délicieux » en créole martiniquais — est né d'une conviction simple : la meilleure façon de découvrir la Martinique, c'est par l'assiette.",
      p1: "Nous sommes une petite équipe de passionnés, nés sur l'île ou tombés amoureux d'elle. Depuis nos débuts, nous faisons découvrir la cuisine martiniquaise authentique aux voyageurs du monde entier : celle des marchés, des lolos, des cuisines de famille — pas celle des menus touristiques.",
      p2: "Notre food tour de Fort-de-France, notre best seller, a été récompensé deux fois par les Travellers' Choice Awards et mis à l'honneur dans Échappées Belles, Cosmopolitan et France-Antilles.",
      p3: "Aujourd'hui, nous allons plus loin : ateliers de cocktails, excursions gourmandes privées, chefs à domicile, et même notre jambon de Noël maison. Une seule promesse : du vrai, du local, du tété dwèt.",
      valuesTitle: "Ce qui nous guide",
      value1T: "Authenticité",
      value1D: "De vraies adresses, de vraies recettes, de vraies rencontres.",
      value2T: "Petits groupes",
      value2D: "Jamais de foule : on prend le temps, ensemble.",
      value3T: "Local d'abord",
      value3D: "Producteurs, artisans et cuisiniers de l'île, en direct.",
    },
    magazine: {
      title: "Le Magazine",
      intro:
        "Recettes, histoires d'ingrédients et carnets d'adresses : nos articles pour prolonger le voyage.",
      readMore: "Lire l'article",
      articles: [
        {
          title: "Colombo, massalé, piment : le guide des épices créoles",
          tag: "Ingrédients",
          excerpt:
            "D'où vient le colombo ? Comment doser le piment végétarien ? Petit précis d'épices pour cuisiner créole sans se tromper.",
        },
        {
          title: "Rhum agricole : visite au cœur des distilleries",
          tag: "Terroir",
          excerpt:
            "De la canne à la colonne de cuivre, immersion dans les distilleries qui font la renommée du rhum de Martinique, seul rhum AOC au monde.",
        },
        {
          title: "Nos 10 adresses préférées à Fort-de-France",
          tag: "Carnet d'adresses",
          excerpt:
            "Du grand marché couvert aux lolos du front de mer, nos cantines de cœur — celles qu'on partage lors du food tour.",
        },
      ],
    },
    shop: {
      title: "La Boutique",
      intro:
        "Guides, tote bags et produits gourmands : emportez un bout de Martinique avec vous.",
      add: "Commander",
      items: [
        {
          name: "Guide gourmand de la Martinique",
          desc: "Nos 100 adresses préférées, recettes et itinéraires — le carnet parfait avant, pendant et après le voyage.",
          price: "19 €",
        },
        {
          name: "Tote bag madras",
          desc: "Le cabas en tissu madras traditionnel, brodé d'un hibiscus. Solide, coloré, 100 % marché.",
          price: "24 €",
        },
        {
          name: "Coffret sauces & confitures artisanales",
          desc: "Sauce piment créole, confiture ananas-mangue et pâte d'épices colombo, faits en petites séries.",
          price: "29 €",
        },
      ],
      note: "Commandez par message — on vous confirme la disponibilité et la livraison.",
    },
    team: {
      title: "Notre équipe",
      intro:
        "Des guides, des chefs, des conteurs : tous amoureux de la cuisine martiniquaise.",
      members: [
        {
          name: "Manvi",
          role: "Fondatrice & guide",
          bio: "Née à Fort-de-France, elle connaît chaque étal du marché. Elle guide en français, anglais et créole.",
        },
        {
          name: "Julien",
          role: "Chef & ateliers cocktails",
          bio: "Barman puis chef, il anime l'atelier cocktails et régale nos hôtes lors des dîners privés.",
        },
        {
          name: "Aïcha",
          role: "Guide & excursions",
          bio: "Historienne de formation, elle raconte l'île comme personne au volant de nos excursions gourmandes.",
        },
        {
          name: "Kévin",
          role: "Chef à domicile",
          bio: "Le roi du jambon de Noël. Il cuisine chez vous comme chez sa grand-mère — en mieux, ose-t-il dire.",
        },
      ],
    },
    contact: {
      title: "Contactez-nous",
      intro:
        "Une question, une réservation, une expérience sur mesure ? Écrivez-nous, on répond vite.",
      name: "Votre nom",
      email: "Votre e-mail",
      subject: "Sujet",
      subjects: {
        tour: "Food tour Fort-de-France",
        cocktails: "Atelier cocktails",
        excursion: "Excursion gourmande",
        chef: "Chef privé",
        ham: "Jambon de Noël",
        tailor: "Expérience sur mesure",
        other: "Autre demande",
      },
      message: "Votre message",
      send: "Envoyer",
      sent: "Merci ! Votre message est bien envoyé — nous revenons vers vous très vite.",
      direct: "Ou directement :",
    },
  },
  en: {
    nav: {
      experiences: "Experiences",
      about: "Who we are",
      magazine: "Magazine",
      shop: "Shop",
      team: "Our team",
      contact: "Contact",
      book: "Book now",
    },
    hero: {
      badge: "No.1 — Best seller",
      titleA: "Taste",
      titleB: "Fort-de-France",
      titleC: "by the spoonful",
      subtitle:
        "Dive into authentic Martinican cuisine with our expert local guide, in a small group. As seen on Échappées Belles, Cosmopolitan & France-Antilles.",
      cta: "Book the food tour",
      meta: "4 hrs · small groups · FR / EN / Creole",
      awards: "Travellers' Choice",
    },
    experiences: {
      title: "Our experiences",
      kicker: "4 ways to taste the island",
      foodTour: {
        tag: "Best seller",
        title: "Fort-de-France food tour",
        desc: "The classic. A gourmet walk through Fort-de-France with a local expert who speaks French, English and Creole. The best way to try our real, authentic dishes.",
        meta: "4 hrs · max 8 guests",
      },
      cocktails: {
        tag: "New",
        title: "Cocktail workshop",
        desc: "Craft 3 iconic Martinican cocktails yourself, from cane to glass. Hands-on, small groups.",
        meta: "2 hrs · small group",
      },
      excursion: {
        tag: "Private",
        title: "Food excursion",
        desc: "Private A/C car and dedicated guide: an island tour between cultural spots and our favourite addresses — breakfast, lunch, snack or dinner.",
        meta: "Full day · tailor-made",
      },
      chef: {
        tag: "At home",
        title: "Private chef",
        desc: "Traditional cuisine, brunch or a special occasion: our chefs cook at your house or villa rental. Just indulge yourself.",
        meta: "On quote · 4–12 guests",
      },
      discover: "Discover",
    },
    ham: {
      tag: "Christmas edition",
      title: "Our homemade Christmas ham",
      desc: "Our artisanal Jambon de Noël, glazed with caramel and pineapple, made just like at home. Book yours for the holidays — quantities are limited!",
      cta: "Book my ham",
      meta: "Homemade · caramel & pineapple · December pickup",
    },
    guide: {
      titleA: "Your guide,",
      titleB: "your neighbour",
      desc: "Every experience is led by an expert born on the island. She tells you the stories behind every dish, in French, English or Creole.",
      point1: "Voted best food experience — 2× Travellers' Choice",
      point2: "Small groups for a warm welcome",
      cta: "Meet the team",
    },
    tailor: {
      title: "Looking for a tailor-made food experience?",
      desc: "Birthday, bachelorette, company trip or a special craving: we create the food experience that fits you. Tell us about your project!",
      cta: "Contact us",
    },
    press: {
      kicker: "As seen in",
    },
    footer: {
      titleA: "Your holiday,",
      titleB: "finally tasty",
      cta1: "Book an experience",
      cta2: "Request a private quote",
      address: "Fort-de-France, Martinique",
      rights: "© Tété Dwèt · Martinique — “tété dwèt” means “it's tasty” in Creole",
    },
    about: {
      title: "Who we are",
      intro:
        "Tété Dwèt — “it's tasty” in Martinican Creole — was born from a simple belief: the best way to discover Martinique is through the plate.",
      p1: "We are a small team of food lovers, born on the island or fallen in love with it. Since day one, we've been showing travellers from all over the world the real Martinican cuisine: the one of markets, lolos and family kitchens — not the tourist menus.",
      p2: "Our Fort-de-France food tour, our best seller, has won two Travellers' Choice Awards and was featured on Échappées Belles, Cosmopolitan and France-Antilles.",
      p3: "Today we go further: cocktail workshops, private food excursions, private chefs, and even our homemade Christmas ham. One promise: real, local, tété dwèt.",
      valuesTitle: "What drives us",
      value1T: "Authenticity",
      value1D: "Real addresses, real recipes, real encounters.",
      value2T: "Small groups",
      value2D: "Never a crowd: we take our time, together.",
      value3T: "Local first",
      value3D: "The island's producers, artisans and cooks, first-hand.",
    },
    magazine: {
      title: "The Magazine",
      intro:
        "Recipes, ingredient stories and address books: our articles to extend the journey.",
      readMore: "Read the article",
      articles: [
        {
          title: "Colombo, massalé, chilli: the Creole spice guide",
          tag: "Ingredients",
          excerpt:
            "Where does colombo come from? How to dose piment végétarien? A little spice primer for cooking Creole without missteps.",
        },
        {
          title: "Agricultural rum: inside the distilleries",
          tag: "Terroir",
          excerpt:
            "From cane to copper column, inside the distilleries behind Martinique's rum — the only AOC rum in the world.",
        },
        {
          title: "Our 10 favourite addresses in Fort-de-France",
          tag: "Address book",
          excerpt:
            "From the covered market to the waterfront lolos, our beloved canteens — the very ones we share on the food tour.",
        },
      ],
    },
    shop: {
      title: "The Shop",
      intro:
        "Guides, tote bags and gourmet treats: take a piece of Martinique home with you.",
      add: "Order",
      items: [
        {
          name: "Martinique food travel guide",
          desc: "Our 100 favourite addresses, recipes and itineraries — the perfect companion before, during and after your trip.",
          price: "€19",
        },
        {
          name: "Madras tote bag",
          desc: "A tote in traditional madras fabric, embroidered with a hibiscus. Sturdy, colourful, 100% market-ready.",
          price: "€24",
        },
        {
          name: "Artisanal sauces & jams gift box",
          desc: "Creole hot sauce, pineapple-mango jam and colombo spice paste, made in small batches.",
          price: "€29",
        },
      ],
      note: "Order by message — we'll confirm availability and delivery.",
    },
    team: {
      title: "Our team",
      intro:
        "Guides, chefs, storytellers: all in love with Martinican cuisine.",
      members: [
        {
          name: "Manvi",
          role: "Founder & guide",
          bio: "Born in Fort-de-France, she knows every stall of the market. She guides in French, English and Creole.",
        },
        {
          name: "Julien",
          role: "Chef & cocktail workshops",
          bio: "Bartender turned chef, he runs the cocktail workshop and delights our guests at private dinners.",
        },
        {
          name: "Aïcha",
          role: "Guide & excursions",
          bio: "A trained historian, she tells the island's story like no one else at the wheel of our food excursions.",
        },
        {
          name: "Kévin",
          role: "Private chef",
          bio: "The Christmas ham king. He cooks at your place like at his grandmother's — better, he dares say.",
        },
      ],
    },
    contact: {
      title: "Contact us",
      intro:
        "A question, a booking, a tailor-made experience? Write to us, we reply fast.",
      name: "Your name",
      email: "Your email",
      subject: "Subject",
      subjects: {
        tour: "Fort-de-France food tour",
        cocktails: "Cocktail workshop",
        excursion: "Food excursion",
        chef: "Private chef",
        ham: "Christmas ham",
        tailor: "Tailor-made experience",
        other: "Other request",
      },
      message: "Your message",
      send: "Send",
      sent: "Thank you! Your message has been sent — we'll get back to you very soon.",
      direct: "Or directly:",
    },
  },
};

type Dict = (typeof dict)["fr"];

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}>({ lang: "fr", setLang: () => {}, t: dict.fr });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = window.localStorage.getItem("tete-dwet-lang");
    if (saved === "en" || saved === "fr") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("tete-dwet-lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
