import { createFileRoute } from "@tanstack/react-router";

import { PostListView, postListRoute } from "@/views/blog";

export const Route = createFileRoute("/en/blog/")({
  ...postListRoute("en"),
  component: () => <PostListView data={Route.useLoaderData()} />,
});
