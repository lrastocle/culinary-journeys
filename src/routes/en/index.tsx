import { createFileRoute } from "@tanstack/react-router";

import { HomeView, homeRoute } from "@/views/home";

export const Route = createFileRoute("/en/")({
  ...homeRoute("en"),
  component: () => <HomeView data={Route.useLoaderData()} />,
});
