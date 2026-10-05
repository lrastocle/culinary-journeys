import { createFileRoute } from "@tanstack/react-router";

import { ContactView, contactRoute } from "@/views/contact";

export const Route = createFileRoute("/en/contact")({
  ...contactRoute("en"),
  component: () => <ContactView form={Route.useLoaderData()} prefill={Route.useSearch().objet} />,
});
