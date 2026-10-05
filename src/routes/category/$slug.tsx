import { createFileRoute } from "@tanstack/react-router";

import { PostListView, postListRoute } from "@/views/blog";

export const Route = createFileRoute("/category/$slug")({
  ...postListRoute("fr", "categories"),
  component: () => <PostListView data={Route.useLoaderData()} />,
});
