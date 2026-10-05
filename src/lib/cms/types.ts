/**
 * Formes des contenus renvoyés par l'API REST de l'admin (Payload), limitées à ce
 * que le site utilise. Référence : admin/src/payload-types.ts du dépôt mjr-admin.
 */
import type { ContentCollection } from "@/lib/paths";

export type ID = number;

export type MediaSize = { url?: string | null; width?: number | null; height?: number | null };

export type Media = {
  id: ID;
  alt: string;
  caption?: string | null;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  sizes?: Partial<Record<"thumbnail" | "card" | "tablet" | "hero", MediaSize>>;
};

/** Relation : identifiant seul ou document peuplé selon la profondeur demandée. */
export type Rel<T> = ID | T | null | undefined;

/** Valeur JSON (les données renvoyées par les fonctions serveur doivent être sérialisables). */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue | undefined };

export type LexicalNode = {
  type: string;
  version?: number;
  children?: LexicalNode[];
  text?: string;
  format?: number | string;
  tag?: string;
  listType?: "bullet" | "number" | "check";
  /** Upload : document média peuplé (ou son identifiant). */
  value?: JsonValue;
  relationTo?: string;
  fields?: { [key: string]: JsonValue | undefined };
};

export type RichText = { root: LexicalNode } | null | undefined;

export type Meta = { title?: string | null; description?: string | null; image?: Rel<Media> };

export type Taxonomy = { id: ID; name: string; slug: string; description?: string | null };

export type Post = {
  id: ID;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: RichText;
  featuredImage?: Rel<Media>;
  publishedAt?: string | null;
  updatedAt: string;
  authorName?: string | null;
  showAuthor?: boolean | null;
  categories?: Rel<Taxonomy>[] | null;
  tags?: Rel<Taxonomy>[] | null;
  meta?: Meta;
};

export type FareHarborRef = { itemId?: string | null; flowId?: string | null } | null;

/** Couleurs du thème « Bold Caribbean Pop », choisies dans l'admin. */
export type ThemeColor = "sun" | "mango" | "hibiscus" | "leaf" | "sea" | "plum" | "cream" | "ink";

export type ActivityType = "food" | "cultural" | "workshop" | "excursion" | "chef";

export type Activity = {
  id: ID;
  title: string;
  slug: string;
  type: ActivityType;
  tag?: string | null;
  color?: ThemeColor | null;
  summary?: string | null;
  heroImage?: Rel<Media>;
  duration?: string | null;
  priceFrom?: number | null;
  priceNote?: string | null;
  languages?: string[] | null;
  groupSize?: string | null;
  meetingPoint?: string | null;
  highlights?: { text: string }[] | null;
  included?: { text: string }[] | null;
  notIncluded?: { text: string }[] | null;
  description?: RichText;
  gallery?: Rel<Media>[] | null;
  fareharbor?: FareHarborRef;
  featured?: boolean | null;
  updatedAt: string;
  meta?: Meta;
};

export type Product = {
  id: ID;
  title: string;
  slug: string;
  summary?: string | null;
  tag?: string | null;
  details?: string | null;
  color?: ThemeColor | null;
  images?: Rel<Media>[] | null;
  price?: number | null;
  priceNote?: string | null;
  description?: RichText;
  fareharbor?: FareHarborRef;
  available?: boolean | null;
  availableFrom?: string | null;
  availableUntil?: string | null;
  featured?: boolean | null;
  updatedAt: string;
  meta?: Meta;
};

export type TeamMember = {
  id: ID;
  name: string;
  role?: string | null;
  photo?: Rel<Media>;
  bio?: string | null;
};

export type PressMention = {
  id: ID;
  outlet: string;
  title: string;
  date?: string | null;
  excerpt?: string | null;
  url?: string | null;
  logo?: Rel<Media>;
};

export type LinkValue = {
  type?: "reference" | "custom" | "fareharbor" | null;
  label?: string | null;
  reference?: { relationTo: ContentCollection; value: Rel<{ id: ID; slug?: string | null }> } | null;
  url?: string | null;
  fareharborItemId?: string | null;
};

export type PageBlock =
  | {
      blockType: "hero";
      id?: string;
      badge?: string | null;
      heading: string;
      highlight?: string | null;
      headingEnd?: string | null;
      subheading?: string | null;
      image?: Rel<Media>;
      stat?: { value?: string | null; label?: string | null } | null;
      meta?: string | null;
      color?: ThemeColor | null;
      buttons?: { id?: string; link: LinkValue }[] | null;
    }
  | {
      blockType: "spotlight";
      id?: string;
      tag?: string | null;
      heading: string;
      highlight?: string | null;
      text?: string | null;
      points?: { id?: string; text: string }[] | null;
      link?: LinkValue | null;
      image?: Rel<Media>;
      imagePosition?: "left" | "right" | null;
      color?: ThemeColor | null;
    }
  | { blockType: "richText"; id?: string; heading?: string | null; content: RichText; image?: Rel<Media>; imagePosition?: "left" | "right" | null }
  | { blockType: "gallery"; id?: string; heading?: string | null; images: Rel<Media>[] }
  | { blockType: "activitiesList"; id?: string; heading?: string | null; activityType?: ActivityType | null; selection?: "all" | "featured" | "manual" | null; items?: Rel<Activity>[] | null }
  | { blockType: "productsList"; id?: string; heading?: string | null; selection?: "all" | "featured" | "manual" | null; items?: Rel<Product>[] | null; display?: "cards" | "spotlight" | null }
  | { blockType: "postsList"; id?: string; heading?: string | null; category?: Rel<Taxonomy>; limit?: number | null }
  | { blockType: "team"; id?: string; heading?: string | null }
  | { blockType: "press"; id?: string; heading?: string | null; limit?: number | null }
  | { blockType: "faq"; id?: string; heading?: string | null; items?: { question: string; answer: string }[] | null }
  | { blockType: "cta"; id?: string; heading: string; text?: string | null; link?: LinkValue | null; color?: ThemeColor | null }
  | { blockType: "form"; id?: string; heading?: string | null; intro?: string | null; form: Rel<{ id: ID }> };

export type Page = {
  id: ID;
  title: string;
  slug: string;
  layout?: PageBlock[] | null;
  updatedAt: string;
  meta?: Meta;
};

export type FormField = {
  blockType: "text" | "email" | "textarea" | "select" | "checkbox" | "number" | "message" | "country" | "state";
  name?: string;
  label?: string | null;
  required?: boolean | null;
  defaultValue?: string | boolean | number | null;
  width?: number | null;
  options?: { label: string; value: string }[] | null;
  message?: RichText;
};

export type Form = {
  id: ID;
  title: string;
  fields?: FormField[] | null;
  submitButtonLabel?: string | null;
  confirmationType?: "message" | "redirect" | null;
  confirmationMessage?: RichText;
};

export type SiteSettings = {
  siteName: string;
  tagline?: string | null;
  defaultImage?: Rel<Media>;
  /** Seul l'identifiant de la page d'accueil sert au site (chargée à part par getHome). */
  homePage?: Rel<{ id: ID }>;
  contact?: {
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    address?: string | null;
    mapsUrl?: string | null;
    openingHours?: string | null;
  } | null;
  socials?: { platform: string; url: string }[] | null;
  announcement?: string | null;
  footerText?: string | null;
  fareharbor?: { shortname?: string | null; flowId?: string | null } | null;
  contactForm?: Rel<Form>;
  sections?: Partial<
    Record<SectionKey, { title?: string | null; intro?: string | null }> & {
      footer: { title?: string | null; highlight?: string | null };
    }
  > | null;
};

export type SectionKey = "activities" | "blog" | "shop" | "team" | "contact";

export type Paginated<T> = {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const isPopulated = <T extends { id: ID }>(value: Rel<T>): value is T =>
  typeof value === "object" && value !== null;
