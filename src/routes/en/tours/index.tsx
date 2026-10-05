import { createFileRoute } from "@tanstack/react-router";

import { ActivitiesView, activitiesRoute } from "@/views/activities";

export const Route = createFileRoute("/en/tours/")({
  ...activitiesRoute("en"),
  component: () => <ActivitiesView activities={Route.useLoaderData()} />,
});
