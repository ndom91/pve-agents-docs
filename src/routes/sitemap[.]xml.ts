import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/shared";
import { source } from "@/lib/source";

/**
 * sitemap.xml, generated from the same source of truth the sidebar and
 * llms.txt use, so a page cannot be added to the docs and forgotten here.
 *
 * URLs must match the canonical each page declares, character for character —
 * a sitemap listing one form while the page claims another is a contradiction
 * a crawler has to resolve, and it resolves it by trusting neither. That is
 * why both go through absoluteUrl().
 */

type Entry = {
  url: string;
  lastModified?: Date;
  changefreq: string;
  priority: string;
};

function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c] as string,
  );
}

function entries(): Entry[] {
  const pages = source.getPages().map((page) => ({
    url: absoluteUrl(page.url),
    // lastModified() is populated by the lastModified fumadocs-mdx plugin;
    // it is absent when a file is untracked, so it stays optional.
    lastModified: page.data.lastModified,
    changefreq: "weekly",
    priority: "0.7",
  }));

  return [
    { url: absoluteUrl("/"), changefreq: "weekly", priority: "1.0" },
    ...pages,
  ];
}

function sitemap() {
  const urls = entries()
    .map(({ url, lastModified, changefreq, priority }) => {
      const lines = [
        `    <loc>${escapeXml(url)}</loc>`,
        lastModified
          ? `    <lastmod>${new Date(lastModified).toISOString().slice(0, 10)}</lastmod>`
          : undefined,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
      ].filter(Boolean);

      return `  <url>\n${lines.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET() {
        return new Response(sitemap(), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
