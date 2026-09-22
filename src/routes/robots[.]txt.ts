import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/shared";

/**
 * robots.txt — everything is allowed, including AI.
 *
 * The named agents below are already covered by `User-agent: *`, so this file
 * is longer than it strictly needs to be. It is explicit on purpose: the
 * default assumption around AI crawlers is now that a site wants them out, and
 * several of these read a named group in preference to the wildcard. Saying yes
 * by name is unambiguous, and it documents the decision for whoever reads this
 * next.
 *
 * Three distinct things are being allowed, which are often conflated:
 *  - training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended)
 *  - retrieval at inference time (ChatGPT-User, Claude-User, Perplexity-User)
 *  - AI search indexing (OAI-SearchBot, Claude-SearchBot, PerplexityBot)
 */
const AI_AGENTS = [
  // Training / dataset collection
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
  "Diffbot",
  "omgili",
  // Live retrieval on a user's behalf
  "ChatGPT-User",
  "Claude-User",
  "Perplexity-User",
  "Meta-ExternalFetcher",
  // AI search indexing
  "OAI-SearchBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "YouBot",
];

function robots() {
  const groups = [
    "# Everything here is public documentation for an open-source project.",
    "# Crawl it, index it, train on it, cite it.",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "# Named explicitly so there is no ambiguity: AI training, inference-time",
    "# retrieval and AI search are all permitted.",
    ...AI_AGENTS.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", ""]),
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
  ];

  return groups.join("\n");
}

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET() {
        return new Response(robots(), {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
