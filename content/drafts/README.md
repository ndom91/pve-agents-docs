# Drafts

Pages that are written but not published.

`source.config.ts` collects `content/docs` only, so nothing here is built,
indexed, listed in `sitemap.xml` or `llms.txt`, or reachable by URL. It is not
merely absent from the sidebar.

To publish one: move the file back under `content/docs/<section>/` and add its
slug to that section's `meta.json`.

- `not-built.mdx` — "Deliberately not built". Accurate, and pulled while the
  site settles on how much of the project's own reasoning belongs on a public
  docs site.
