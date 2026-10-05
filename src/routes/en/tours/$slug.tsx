import { createFileRoute } from "@tanstack/react-router";

import { ActivityView, activityRoute } from "@/views/activities";

export const Route = createFileRoute("/en/tours/$slug")({
  ...activityRoute("en"),
  component: () => <ActivityView activity={Route.useLoaderData().activity} />,
});
