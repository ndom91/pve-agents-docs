import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import browserCollections from "collections/browser";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import type { TOCItemType } from "fumadocs-core/toc";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  PageLastUpdate,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { type ComponentType, type CSSProperties, Suspense } from "react";
import { useMDXComponents } from "@/components/mdx";
import { baseOptions } from "@/lib/layout.shared";
import { gitConfig } from "@/lib/shared";
import { slugsToMarkdownPath, source } from "@/lib/source";

type DocsFrontmatter = {
  title: string;
  description?: string;
};

type MDXContent = ComponentType<{
  components?: ReturnType<typeof useMDXComponents>;
}>;

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
  .inputValidator((slugs: string[]) => slugs)
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

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    {
      markdownUrl,
      path,
      lastModifiedTime,
    }: {
      markdownUrl: string;
      path: string;
      lastModifiedTime: Date | undefined;
    },
  ) {
    return (
      <DocsPageContent
        toc={toc}
        frontmatter={frontmatter}
        MDX={MDX}
        markdownUrl={markdownUrl}
        path={path}
        lastModifiedTime={lastModifiedTime}
      />
    );
  },
});

function DocsPageContent({
  toc,
  frontmatter,
  MDX,
  markdownUrl,
  path,
  lastModifiedTime,
}: {
  toc: TOCItemType[];
  frontmatter: DocsFrontmatter;
  MDX: MDXContent;
  markdownUrl: string;
  path: string;
  lastModifiedTime: Date | undefined;
}) {
  const mdxComponents = useMDXComponents();

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{frontmatter.title}</DocsTitle>
      <DocsDescription>{frontmatter.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
        />
      </div>
      <DocsBody>
        <MDX components={mdxComponents} />
      </DocsBody>
      {lastModifiedTime && <PageLastUpdate date={lastModifiedTime} />}
    </DocsPage>
  );
}

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
