import { createFileRoute } from "@tanstack/react-router";

import { TeamView, teamRoute } from "@/views/team";

export const Route = createFileRoute("/en/team")({
  ...teamRoute("en"),
  component: () => <TeamView members={Route.useLoaderData()} />,
});
