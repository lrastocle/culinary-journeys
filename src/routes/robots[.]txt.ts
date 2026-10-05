import { createFileRoute } from "@tanstack/react-router";

import { cmsConfig } from "@/lib/cms/fetch.server";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(`User-agent: *\nAllow: /\n\nSitemap: ${cmsConfig().siteUrl}/sitemap.xml\n`, {
          headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
        }),
    },
  },
});
