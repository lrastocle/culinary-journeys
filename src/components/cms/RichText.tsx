import type { ReactNode } from "react";

import { SiteLink } from "@/components/SiteLink";
import type { LexicalNode, Media as MediaDoc, RichText as RichTextValue } from "@/lib/cms/types";
import { useLang } from "@/lib/i18n";
import { docPath, isContentCollection, type Lang } from "@/lib/paths";

import { Media } from "./Media";

// Formats de texte Lexical (masque de bits).
const BOLD = 1;
const ITALIC = 2;
const STRIKE = 4;
const UNDERLINE = 8;
const CODE = 16;
const SUB = 32;
const SUP = 64;

const headingClass: Record<string, string> = {
  h1: "mt-10 font-display text-4xl font-black uppercase leading-tight tracking-tight",
  h2: "mt-10 font-display text-3xl font-black uppercase leading-tight tracking-tight",
  h3: "mt-8 font-display text-2xl font-black uppercase leading-tight",
  h4: "mt-6 font-display text-xl font-extrabold uppercase",
  h5: "mt-6 font-display text-lg font-extrabold uppercase",
  h6: "mt-6 font-display text-base font-extrabold uppercase",
};

const formatText = (node: LexicalNode, key: number) => {
  let content: ReactNode = node.text ?? "";
  const format = typeof node.format === "number" ? node.format : 0;
  if (format & CODE) content = <code className="rounded bg-ink/10 px-1">{content}</code>;
  if (format & BOLD) content = <strong>{content}</strong>;
  if (format & ITALIC) content = <em>{content}</em>;
  if (format & UNDERLINE) content = <u>{content}</u>;
  if (format & STRIKE) content = <s>{content}</s>;
  if (format & SUB) content = <sub>{content}</sub>;
  if (format & SUP) content = <sup>{content}</sup>;
  return <span key={key}>{content}</span>;
};

/** Adresse d'un lien Lexical : adresse saisie, ou contenu du site (lien interne). */
const linkHref = (fields: LexicalNode["fields"], lang: Lang) => {
  if (!fields) return null;
  if (fields["linkType"] === "internal") {
    const doc = fields["doc"] as { relationTo?: string; value?: { slug?: string } | number } | undefined;
    if (doc?.relationTo && isContentCollection(doc.relationTo) && typeof doc.value === "object" && doc.value?.slug) {
      return docPath(doc.relationTo, doc.value.slug, lang);
    }
    return null;
  }
  return typeof fields["url"] === "string" ? fields["url"] : null;
};

/** Vidéo YouTube / Vimeo intégrée ; les autres adresses deviennent un simple lien. */
function Embed({ url, caption }: { url: string; caption: string | undefined }) {
  const youtube = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url);
  const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url);
  const src = youtube
    ? `https://www.youtube-nocookie.com/embed/${youtube[1]}`
    : vimeo
      ? `https://player.vimeo.com/video/${vimeo[1]}`
      : null;
  return (
    <figure className="my-8">
      {src ? (
        <iframe
          src={src}
          title={caption || url}
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full rounded-2xl border-2 border-ink"
        />
      ) : (
        <a href={url} className="font-semibold text-hibiscus underline" rel="noopener noreferrer" target="_blank">
          {caption || url}
        </a>
      )}
      {caption && src && <figcaption className="mt-2 text-sm text-ink/60">{caption}</figcaption>}
    </figure>
  );
}

function Nodes({ nodes, lang }: { nodes: LexicalNode[] | undefined; lang: Lang }) {
  return <>{(nodes || []).map((node, i) => <Node key={i} index={i} node={node} lang={lang} />)}</>;
}

function Node({ node, lang, index }: { node: LexicalNode; lang: Lang; index: number }) {
  const children = <Nodes nodes={node.children} lang={lang} />;
  switch (node.type) {
    case "text":
      return formatText(node, index);
    case "linebreak":
      return <br />;
    case "tab":
      return <>{"\t"}</>;
    case "paragraph":
      return node.children?.length ? <p className="mt-5 first:mt-0">{children}</p> : null;
    case "heading": {
      const Tag = (["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tag || "") ? node.tag : "h2") as "h2";
      return <Tag className={headingClass[Tag]}>{children}</Tag>;
    }
    case "quote":
      return (
        <blockquote className="mt-6 border-l-4 border-hibiscus pl-5 text-lg font-semibold italic">{children}</blockquote>
      );
    case "list":
      return node.listType === "number" ? (
        <ol className="mt-5 list-decimal space-y-2 pl-6">{children}</ol>
      ) : (
        <ul className="mt-5 list-disc space-y-2 pl-6">{children}</ul>
      );
    case "listitem":
      return <li>{children}</li>;
    case "horizontalrule":
      return <hr className="my-10 border-t-2 border-ink/20" />;
    case "link":
    case "autolink": {
      const href = linkHref(node.fields, lang);
      if (!href) return children;
      const newTab = Boolean(node.fields?.["newTab"]) || /^https?:\/\//.test(href);
      return (
        <SiteLink
          href={href}
          className="font-semibold text-hibiscus underline decoration-2 underline-offset-2 hover:text-ink"
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </SiteLink>
      );
    }
    case "upload": {
      const media = node.value as unknown as MediaDoc | number | undefined;
      if (typeof media !== "object" || !media?.mimeType?.startsWith("image/")) return null;
      return (
        <figure className="my-8">
          <Media
            media={media}
            sizes="(min-width: 768px) 720px, 100vw"
            className="w-full rounded-2xl border-2 border-ink object-cover"
          />
          {media.caption && <figcaption className="mt-2 text-sm text-ink/60">{media.caption}</figcaption>}
        </figure>
      );
    }
    case "block": {
      const fields = node.fields as { blockType?: string; url?: string; caption?: string } | undefined;
      if (fields?.blockType === "embed" && fields.url) return <Embed url={fields.url} caption={fields.caption} />;
      return null;
    }
    default:
      return node.children ? children : null;
  }
}

/** Texte riche de l'admin (éditeur Lexical). */
export function RichText({ value, className }: { value: RichTextValue; className?: string }) {
  const { lang } = useLang();
  if (!value?.root?.children?.length) return null;
  return (
    <div className={`text-base font-medium leading-relaxed text-ink/85 ${className ?? ""}`}>
      <Nodes nodes={value.root.children} lang={lang} />
    </div>
  );
}
