import { createFileRoute } from "@tanstack/react-router";

import { ShopView, shopRoute } from "@/views/shop";

export const Route = createFileRoute("/boutique/")({
  ...shopRoute("fr"),
  component: () => <ShopView products={Route.useLoaderData()} />,
});
