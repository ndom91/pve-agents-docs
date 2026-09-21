import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { type CSSProperties, Suspense } from "react";
import { clientLoader } from "@/lib/docs-content";
import { baseOptions } from "@/lib/layout.shared";
import { slugsToMarkdownPath, source } from "@/lib/source";

const docsLayoutStyle = {
  "--fd-sidebar-col": "var(--pa-sidebar-col)",
} as CSSProperties;

export const Route = createFileRoute("/docs/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? [];
    const data = await loader({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
});

const loader = createServerFn({
  method: "GET",
})
  .validator((slugs: string[]) => slugs)
  .middleware([staticFunctionMiddleware])
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    return {
      path: page.path,
      markdownUrl: slugsToMarkdownPath(page.slugs).url,
      lastModifiedTime: page.data.lastModified,
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

function Page() {
  const { pageTree, path, markdownUrl, lastModifiedTime } = useFumadocsLoader(
    Route.useLoaderData(),
  );

  return (
    <DocsLayout
      {...baseOptions()}
      tree={pageTree}
      containerProps={{ style: docsLayoutStyle }}
    >
      <Link to={markdownUrl} hidden />
      <Suspense>
        {clientLoader.useContent(path, { markdownUrl, path, lastModifiedTime })}
      </Suspense>
    </DocsLayout>
  );
}
