import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "pve-agents — disposable coding agents on your own Proxmox host",
      },
      {
        name: "description",
        content:
          "Give it a repository, a ref and a purpose. It boots a disposable Proxmox LXC, checks the repository out, and starts a Claude Code agent inside it — streamed, approvable and reaped when it is done.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return <LandingPage />;
}
