export const appName = "pve-agents";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";

/**
 * The site's own origin, no trailing slash.
 *
 * It exists so the canonical URL has one source. The site answers on its
 * workers.dev hostname as well as this one, and without a canonical a crawler
 * treats the two as duplicate copies of every page.
 */
export const siteUrl = "https://pve-agents.sh";

/**
 * Absolute URL for a path, for the tags that cannot take a relative one.
 *
 * The root is `https://pve-agents.sh` with NO trailing slash. A canonical is
 * matched as a literal string, so the slashed and unslashed forms are two
 * different URLs to a crawler, and declaring one while linking the other is
 * the mistake this exists to avoid.
 */
export function absoluteUrl(path = "/") {
  const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${suffix}`;
}

export const gitConfig = {
  user: "ndom91",
  repo: "pve-agents",
  branch: "main",
};
