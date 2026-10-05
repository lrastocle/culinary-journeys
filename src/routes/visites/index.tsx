import { createFileRoute } from "@tanstack/react-router";

import { ActivitiesView, activitiesRoute } from "@/views/activities";

export const Route = createFileRoute("/visites/")({
  ...activitiesRoute("fr"),
  component: () => <ActivitiesView activities={Route.useLoaderData()} />,
});
