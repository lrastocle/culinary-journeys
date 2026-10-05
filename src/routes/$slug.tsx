import { createFileRoute } from "@tanstack/react-router";

import { ContentView, contentRoute } from "@/views/content";

export const Route = createFileRoute("/$slug")({
  ...contentRoute("fr"),
  component: () => <ContentView data={Route.useLoaderData()} />,
});
