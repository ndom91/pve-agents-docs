import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/landing";
import { absoluteUrl, appName } from "@/lib/shared";

const title = "pve-agents — disposable coding agents on your own Proxmox host";
const description =
  "Give it a repository, a ref and a purpose. It boots a disposable Proxmox LXC, checks the repository out, and starts a Claude Code agent inside it — streamed, approvable and reaped when it is done.";

/* The home screen doubles as the social preview. It is the only image on the
   site that shows the whole product at once. */
const previewImage = absoluteUrl("/screenshots/home.png");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },

      /* Open Graph and Twitter need ABSOLUTE urls — a relative one is dropped
         by most scrapers rather than resolved. */
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: appName },
      { property: "og:url", content: absoluteUrl("/") },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: previewImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: previewImage },
    ],
    links: [
      /* The site also answers on its workers.dev hostname. Without this, both
         are indexable copies of the same page. */
      { rel: "canonical", href: absoluteUrl("/") },
    ],
  }),
  component: Home,
});

function Home() {
  return <LandingPage />;
}
