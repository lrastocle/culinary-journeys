import type { ImgHTMLAttributes } from "react";

import type { Media as MediaDoc, Rel } from "@/lib/cms/types";
import { isPopulated } from "@/lib/cms/types";

const ORDER = ["thumbnail", "card", "tablet", "hero"] as const;

/** Image de la médiathèque de l'admin, avec ses tailles WebP (srcset). */
export function Media({
  media,
  sizes = "100vw",
  className,
  loading = "lazy",
  alt,
  ...props
}: { media: Rel<MediaDoc>; sizes?: string } & Omit<ImgHTMLAttributes<HTMLImageElement>, "src">) {
  if (!isPopulated(media) || !media.url) return null;
  const srcSet = ORDER.map((name) => media.sizes?.[name])
    .filter((size) => size?.url && size.width)
    // Les vignettes recadrées (thumbnail, card) n'ont pas le même cadrage que l'original.
    .filter((size) => !media.width || !media.height || !size?.height || Math.abs(size.width! / size.height - media.width / media.height) < 0.02)
    .map((size) => `${size!.url} ${size!.width}w`);
  if (media.width) srcSet.push(`${media.url} ${media.width}w`);

  return (
    <img
      src={media.sizes?.tablet?.url || media.url}
      srcSet={srcSet.length ? srcSet.join(", ") : undefined}
      sizes={sizes}
      width={media.width || undefined}
      height={media.height || undefined}
      alt={alt ?? media.alt ?? ""}
      loading={loading}
      decoding="async"
      className={className}
      {...props}
    />
  );
}
