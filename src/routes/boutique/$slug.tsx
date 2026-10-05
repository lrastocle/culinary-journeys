import { createFileRoute } from "@tanstack/react-router";

import { ProductView, productRoute } from "@/views/shop";

export const Route = createFileRoute("/boutique/$slug")({
  ...productRoute("fr"),
  component: () => <ProductView product={Route.useLoaderData().product} />,
});
