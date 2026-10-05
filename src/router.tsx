import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Toutes les adresses finissent par / (comme sur l'ancien site WordPress).
    trailingSlash: "always",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
