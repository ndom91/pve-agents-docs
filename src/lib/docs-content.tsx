import browserCollections from "collections/browser";
import type { TOCItemType } from "fumadocs-core/toc";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  PageLastUpdate,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import type { ComponentType } from "react";
import { useMDXComponents } from "@/components/mdx";
import { gitConfig } from "@/lib/shared";

/**
 * The docs page body and its client loader.
 *
 * These live here rather than in routes/docs/$.tsx because clientLoader is
 * needed by both that route's loader and its component. The router splits a
 * route file into separate chunks, so anything both halves use gets hoisted
 * into the shared chunk as an export — and a module that exports a
 * non-component turns off Fast Refresh for everything in it. Imported from a
 * module of its own, it is never exported from the route.
 */

type DocsFrontmatter = {
  title: string;
  description?: string;
};

type MDXContent = ComponentType<{
  components?: ReturnType<typeof useMDXComponents>;
}>;

type DocsPageMeta = {
  markdownUrl: string;
  path: string;
  lastModifiedTime: Date | undefined;
};

function DocsPageContent({
  toc,
  frontmatter,
  MDX,
  markdownUrl,
  path,
  lastModifiedTime,
}: DocsPageMeta & {
  toc: TOCItemType[];
  frontmatter: DocsFrontmatter;
  MDX: MDXContent;
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

export const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    { markdownUrl, path, lastModifiedTime }: DocsPageMeta,
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
