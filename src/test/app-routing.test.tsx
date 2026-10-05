import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Les pages lisent l'admin par des fonctions serveur, indisponibles hors du serveur :
// on simule une admin vide (ce test vérifie seulement que le routeur se monte).
vi.mock("@/lib/cms/api", () => ({
  getSite: vi.fn(async () => ({ siteUrl: "", settings: null })),
  getHome: vi.fn(async () => ({ page: null, blockData: {}, alternates: { fr: "/", en: "/en/" }, activities: [] })),
  getContent: vi.fn(async () => null),
  getPostList: vi.fn(async () => null),
  getActivities: vi.fn(async () => []),
  getActivity: vi.fn(async () => null),
  getProducts: vi.fn(async () => []),
  getProduct: vi.fn(async () => null),
  getTeam: vi.fn(async () => []),
  getContactForm: vi.fn(async () => null),
  submitForm: vi.fn(async () => ({ ok: true })),
}));

function renderAt(path: string) {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  return render(<RouterProvider router={router} />);
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Assert only that the router mounts and paints, never page content:
// routes are rewritten as the app is built and this must keep passing.
describe("App routing", () => {
  it("renders the index route", async () => {
    const { container } = renderAt("/");

    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });

  it("renders the not-found route", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const { container } = renderAt("/this-route-does-not-exist");

    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });
});
