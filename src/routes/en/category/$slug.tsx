import { createFileRoute } from "@tanstack/react-router";

import { PostListView, postListRoute } from "@/views/blog";

export const Route = createFileRoute("/en/category/$slug")({
  ...postListRoute("en", "categories"),
  component: () => <PostListView data={Route.useLoaderData()} />,
});
