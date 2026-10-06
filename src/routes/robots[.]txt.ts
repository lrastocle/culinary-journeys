import { createFileRoute } from "@tanstack/react-router";

import { cmsConfig } from "@/lib/cms/fetch.server";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const { noindex, siteUrl } = cmsConfig();
        const body = noindex
          ? "User-agent: *\nDisallow: /\n"
          : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
