import { createFileRoute } from "@tanstack/react-router";

import { ActivityView, activityRoute } from "@/views/activities";

export const Route = createFileRoute("/visites/$slug")({
  ...activityRoute("fr"),
  component: () => <ActivityView activity={Route.useLoaderData().activity} />,
});
