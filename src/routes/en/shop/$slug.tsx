import { createFileRoute } from "@tanstack/react-router";

import { ProductView, productRoute } from "@/views/shop";

export const Route = createFileRoute("/en/shop/$slug")({
  ...productRoute("en"),
  component: () => <ProductView product={Route.useLoaderData().product} />,
});
