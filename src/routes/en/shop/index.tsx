import { createFileRoute } from "@tanstack/react-router";

import { ShopView, shopRoute } from "@/views/shop";

export const Route = createFileRoute("/en/shop/")({
  ...shopRoute("en"),
  component: () => <ShopView products={Route.useLoaderData()} />,
});
