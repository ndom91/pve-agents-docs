<h1>
  <img src="public/icon1.png" width="88" align="absmiddle" alt="">
  pve-agents-docs
</h1>

The marketing page and documentation for [pve-agents](https://github.com/ndom91/pve-agents),
which runs disposable coding agents on your own Proxmox host.

Two halves, one project. The **landing page** is hand-built: a hero that types a workspace
request and ticks off the four provisioning phases as they land, then the loop the operator
actually lives in — watch the agent, answer it, keep or discard what it wrote. The **docs** are
[fumadocs](https://fumadocs.dev) over MDX, with search, `llms.txt`, and a plain-markdown twin of
every page for anything reading the site rather than looking at it.

Built with [TanStack Start](https://tanstack.com/start) on Vite, prerendered to static files, and
deployed to Cloudflare Workers.

## ⚡ Getting started

```bash
pnpm install
pnpm dev                   # http://localhost:3000
```

Content lives in `content/docs` as MDX. Add a file, add its slug to the `meta.json` beside it, and
it appears in the sidebar. The landing page is `src/components/landing/`, and it is deliberately
not built from the docs components — it is its own thing.

Colours come from `src/styles/tokens.css`, a copy of the app's own `design/tokens_updated.css`
with only the theme selectors changed — the app switches on `[data-theme]`, fumadocs on a `.dark`
class. Keep the values in sync by diffing against that file. Do not add a hex; if a colour is
missing, add a token.

## 🧑‍💻 Development

```bash
pnpm lint                  # biome
pnpm types:check           # fumadocs-mdx && tsgo --noEmit
pnpm build                 # prerender to .output/public
```

None of those load a page. After anything touching routing, styling or SSR, open the site and
look at it — the landing page in particular renders through an SPA shell, so a build that passes
every check can still serve an empty page.

## 🚀 Deploying

```bash
pnpm preview:cf            # build, then serve it through wrangler locally
pnpm deploy                # build, then publish to Cloudflare
```

## 📝 License

[MIT](LICENSE).
