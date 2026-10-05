import { createFileRoute } from "@tanstack/react-router";

import { ContentView, contentRoute } from "@/views/content";

export const Route = createFileRoute("/en/$slug")({
  ...contentRoute("en"),
  component: () => <ContentView data={Route.useLoaderData()} />,
});
