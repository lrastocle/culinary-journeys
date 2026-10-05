import { createFileRoute } from "@tanstack/react-router";

import { PostListView, postListRoute } from "@/views/blog";

export const Route = createFileRoute("/en/tag/$slug")({
  ...postListRoute("en", "tags"),
  component: () => <PostListView data={Route.useLoaderData()} />,
});
