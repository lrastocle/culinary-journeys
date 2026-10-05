import type { ReactNode } from "react";

import type { ThemeColor } from "@/lib/cms/types";
import { theme } from "@/lib/site";

/** Bandeau de titre des pages de rubrique (couleur pleine, titre en capitales). */
export function PageHeader({
  title,
  intro,
  color,
  children,
}: {
  title: string;
  intro?: string | null | undefined;
  color: ThemeColor;
  children?: ReactNode;
}) {
  const colors = theme(color, color);
  return (
    <section className={`border-b-2 border-ink ${colors.bg} ${colors.text}`}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        {children}
        <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">{title}</h1>
        {intro && <p className={`mt-6 max-w-2xl text-xl font-medium leading-relaxed ${colors.muted}`}>{intro}</p>}
      </div>
    </section>
  );
}
