import { createFileRoute } from "@tanstack/react-router";

import { PostListView, postListRoute } from "@/views/blog";

export const Route = createFileRoute("/blog/")({
  ...postListRoute("fr"),
  component: () => <PostListView data={Route.useLoaderData()} />,
});
