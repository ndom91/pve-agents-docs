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

/** Absolute URL for a path, for the tags that cannot take a relative one. */
export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const gitConfig = {
  user: "ndom91",
  repo: "pve-agents",
  branch: "main",
};
