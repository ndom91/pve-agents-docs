import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    mdx(),
    svgr(),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
        // SPA mode prerenders a shell page at `maskPath` (default "/"). With the
        // default, that shell page shares the "/" key with the index route and
        // wins prerender de-duplication, so "/" emits the empty _shell.html
        // instead of our landing page. We give the mask a query string: it
        // still resolves to the index route (pathname "/") for the required 200
        // response, but its de-dup key ("/?spa-shell") differs from "/", so the
        // index route prerenders its real content AND the shell is still
        // written to _shell.html (the shell's outputPath is independent of
        // maskPath), keeping serve.json's SPA fallback rewrite valid.
        maskPath: "/?spa-shell",
        prerender: {
          enabled: true,
          crawlLinks: true,
        },
      },

      pages: [
        {
          path: "/",
          prerender: { enabled: true, outputPath: "/index.html" },
        },
        {
          path: "/docs",
        },
        {
          path: "/api/search",
        },
        {
          path: "llms-full.txt",
        },
        {
          path: "llms.txt",
        },
      ],
    }),
    react(),
    // please see https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro for guides on hosting
    nitro(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: "tslib/tslib.es6.js",
    },
  },
});
