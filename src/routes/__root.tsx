import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteLink } from "@/components/SiteLink";
import { getSite } from "@/lib/cms/api";
import { useLang } from "@/lib/i18n";
import { langFromPath, sectionPath } from "@/lib/paths";
import { SiteContext } from "@/lib/site";

function NotFoundComponent() {
  const { lang, t } = useLang();
  return (
    <main id="main" className="flex min-h-[60vh] items-center justify-center bg-cream px-6 py-20">
      <div className="max-w-md text-center">
        <p className="font-display text-8xl font-black text-hibiscus">404</p>
        <h1 className="mt-4 font-display text-3xl font-black uppercase">{t.notFound.title}</h1>
        <p className="mt-3 font-medium text-ink/70">{t.notFound.text}</p>
        <SiteLink
          href={sectionPath("home", lang)}
          className="btn-pop mt-8 inline-block rounded-full bg-sun px-8 py-4 font-display text-base font-extrabold"
        >
          {t.notFound.home}
        </SiteLink>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const { t } = useLang();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main id="main" className="flex min-h-[60vh] items-center justify-center bg-cream px-6 py-20">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl font-black uppercase">{t.error.title}</h1>
        <p className="mt-3 font-medium text-ink/70">{t.error.text}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="btn-pop mt-8 rounded-full bg-sun px-8 py-4 font-display text-base font-extrabold"
        >
          {t.error.retry}
        </button>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Réglages du site (nom, coordonnées, FareHarbor, textes des rubriques) dans la langue de
  // la page ; relu à chaque navigation (la réponse de l'admin est en cache côté serveur).
  loader: ({ location }) =>
    getSite({ data: { lang: langFromPath(location.pathname) } }).catch((error: unknown) => {
      console.error(error);
      return { siteUrl: "", settings: null };
    }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#f9f4e3" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,600;0,700;0,800;0,900;1,800&family=DM+Sans:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    // Réservation FareHarbor : ouvre les liens fareharbor.com en surimpression.
    scripts: [{ src: "https://fareharbor.com/embeds/api/v1/?autolightframe=yes", defer: true }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <html lang={langFromPath(pathname)}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const site = Route.useLoaderData();
  const { t } = useLang();

  return (
    <SiteContext.Provider value={site}>
      <QueryClientProvider client={queryClient}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sun focus:px-4 focus:py-2 focus:font-bold"
        >
          {t.skip}
        </a>
        <Header />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Footer />
      </QueryClientProvider>
    </SiteContext.Provider>
  );
}
