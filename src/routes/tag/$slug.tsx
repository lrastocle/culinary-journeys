import { createFileRoute } from "@tanstack/react-router";

import { PostListView, postListRoute } from "@/views/blog";

export const Route = createFileRoute("/tag/$slug")({
  ...postListRoute("fr", "tags"),
  component: () => <PostListView data={Route.useLoaderData()} />,
});
