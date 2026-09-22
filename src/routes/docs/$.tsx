import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { type CSSProperties, Suspense } from "react";
import { clientLoader } from "@/lib/docs-content";
import { baseOptions } from "@/lib/layout.shared";
import { absoluteUrl, appName, docsRoute } from "@/lib/shared";
import { slugsToMarkdownPath, source } from "@/lib/source";

const docsLayoutStyle = {
  "--fd-sidebar-col": "var(--pa-sidebar-col)",
} as CSSProperties;

/* The same preview the landing page uses. A docs page has no image of its
   own, and a card with no image collapses to a bare link in most clients. */
const previewImage = absoluteUrl("/screenshots/home.png");

export const Route = createFileRoute("/docs/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? [];
    const data = await loader({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
  /* Every docs page used to inherit the root's bare "pve-agents" title, with
     no description and no canonical — 17 pages indistinguishable in a tab
     strip, a bookmark list or a search result. The canonical matters twice
     over now: the site also answers on its workers.dev hostname. */
  head: ({ loaderData, params }) => {
    const path = `${docsRoute}${params._splat ? `/${params._splat}` : ""}`;
    const title = loaderData?.title
      ? `${loaderData.title} — ${appName}`
      : appName;

    const description = loaderData?.description;

    return {
      meta: [
        { title },
        ...(description
          ? [
              { name: "description", content: description },
              { property: "og:description", content: description },
              { name: "twitter:description", content: description },
            ]
          : []),
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: appName },
        { property: "og:title", content: title },
        { property: "og:url", content: absoluteUrl(path) },
        { property: "og:image", content: previewImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:image", content: previewImage },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(path) }],
    };
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
      /* Carried purely so head() can build a per-page title, description and
         canonical without a second lookup. */
      title: page.data.title,
      description: page.data.description,
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
