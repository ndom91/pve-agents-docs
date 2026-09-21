import { Link } from "@tanstack/react-router";
import { gitConfig } from "@/lib/shared";
import "./landing.css";

const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

/** The four states a workspace passes through before the agent has the purpose. */
const lifecycle = [
  { step: "01", name: "clone", detail: "golden template → new LXC" },
  { step: "02", name: "boot", detail: "container up, address assigned" },
  { step: "03", name: "checkout", detail: "repository at your ref" },
  { step: "04", name: "agent", detail: "Claude Code, handed the purpose" },
];

const loop = [
  {
    label: "Watch",
    title: "The transcript streams",
    body: "Tool calls and all, over SSE, replayed from the beginning for whoever opens the page late.",
  },
  {
    label: "Answer",
    title: "Its questions surface in the browser",
    body: "Permission prompts are answered where you already are, not in a terminal somebody has to be attached to.",
  },
  {
    label: "Decide",
    title: "Read the diff, then push or discard",
    body: "Per-file diffs in the rail. Push to a branch of the workspace's own, or throw the lot away.",
  },
];

/**
 * The two rail tabs shown as screenshots. Both are 800x1760, so they sit in a
 * 2-up grid without one being squeezed.
 *
 * Only these two, deliberately. The diff and full-app shots in
 * design/screenshots carry material that must not be published — see
 * public/screenshots/README.md.
 */
const rail = [
  {
    shot: "/screenshots/tab-timeline.png",
    alt: "The workspace timeline: requested, clone confirmed, booted, seeded, session started, ready",
    caption: "Every phase, timed, with the brief the agent was handed.",
  },
  {
    shot: "/screenshots/tab-terminal.png",
    alt: "A full terminal session attached to the workspace container",
    caption: "And a real shell, for the things a transcript cannot do.",
  },
];

/**
 * The refusals. This is the most distinctive thing about the project and the
 * section most likely to be skimmed, so it leads with the promise and puts the
 * reasoning underneath.
 */
const refusals = [
  {
    title: "Only the ownership marker authorises a destroy",
    body: "Every container carries the controller's id, the workspace id and a token in its LXC description, re-read immediately before anything is purged. Pool membership, hostname and tags are discovery aids, not permission.",
  },
  {
    title: "Unsaved work is kept",
    body: "Uncommitted changes or unpushed commits exempt a workspace from reaping, and so does a workspace the controller could not inspect. “Could not tell” is not “nothing to lose”.",
  },
  {
    title: "Unrecognised containers are reported, never destroyed",
    body: "A restored or lost database makes every live workspace look orphaned, and a timer would then purge the fleet.",
  },
];

function DocsLink({
  to = "",
  className,
  children,
}: {
  to?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link to="/docs/$" params={{ _splat: to }} className={className}>
      {children}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="pa-section-label">{children}</div>;
}

export function LandingPage() {
  return (
    <div className="pa-root">
      <div className="pa-shell">
        <nav className="pa-nav" aria-label="Primary">
          <span className="pa-mark">
            <span className="pa-mark-glyph" aria-hidden="true" />
            pve-agents
          </span>
          <div className="pa-nav-links">
            <DocsLink className="pa-nav-link">Docs</DocsLink>
            <DocsLink to="getting-started/quick-start" className="pa-nav-link">
              Quick start
            </DocsLink>
            <a
              className="pa-nav-link"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </nav>

        {/* ===================== HERO ===================== */}
        <header className="pa-hero">
          <h1 className="pa-hero-title">
            Disposable coding agents on your own Proxmox host.
          </h1>
          <p className="pa-hero-sub">
            Give it a repository, a ref, and a purpose. It clones a golden
            template, boots an LXC, checks the repository out, starts a Claude
            Code agent inside it and hands it the purpose.
          </p>

          <div
            className="pa-request"
            role="img"
            aria-label="A workspace request: repository ndom91/pve-agents, ref main, purpose: port the reaper to the new operation queue"
          >
            <div className="pa-request-row">
              <span className="pa-request-key">repo</span>
              <span className="pa-request-val">ndom91/pve-agents</span>
            </div>
            <div className="pa-request-row">
              <span className="pa-request-key">ref</span>
              <span className="pa-request-val">main</span>
            </div>
            <div className="pa-request-row">
              <span className="pa-request-key">purpose</span>
              <span className="pa-request-val pa-typed" aria-hidden="true">
                Port the reaper to the new operation queue
              </span>
            </div>
          </div>

          <ol className="pa-lifecycle">
            {lifecycle.map((phase, i) => (
              <li
                className="pa-lifecycle-item"
                key={phase.name}
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className="pa-lifecycle-step">{phase.step}</span>
                <span className="pa-lifecycle-name">{phase.name}</span>
                <span className="pa-lifecycle-detail">{phase.detail}</span>
              </li>
            ))}
          </ol>

          <div className="pa-hero-actions">
            <DocsLink
              to="getting-started/quick-start"
              className="pa-btn pa-btn-primary"
            >
              Get started
            </DocsLink>
            <a
              className="pa-btn"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              Source
            </a>
          </div>

          <figure className="pa-shot pa-shot-hero">
            <img
              src="/screenshots/home.png"
              alt="The pve-agents home screen, listing active workspaces"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </header>

        {/* ===================== THE LOOP ===================== */}
        <section className="pa-section" aria-labelledby="pa-loop-heading">
          <SectionLabel>The loop</SectionLabel>
          <h2 className="pa-section-title" id="pa-loop-heading">
            Watch it work, answer it, keep or throw away the result.
          </h2>

          <div className="pa-loop">
            {loop.map((panel) => (
              <article className="pa-panel" key={panel.label}>
                <div className="pa-panel-label">{panel.label}</div>
                <h3 className="pa-panel-title">{panel.title}</h3>
                <p className="pa-panel-body">{panel.body}</p>
              </article>
            ))}
          </div>

          <div className="pa-rail">
            {rail.map((item) => (
              <figure className="pa-shot pa-shot-rail" key={item.shot}>
                <img
                  src={item.shot}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ===================== REFUSALS ===================== */}
        <section className="pa-section" aria-labelledby="pa-safety-heading">
          <SectionLabel>What it will not do</SectionLabel>
          <h2 className="pa-section-title" id="pa-safety-heading">
            Destruction is the only path that loses something irreversibly.
          </h2>
          <p className="pa-section-sub">
            So it is the one with the most said about it.
          </p>

          <div className="pa-refusals">
            {refusals.map((item) => (
              <article className="pa-refusal" key={item.title}>
                <h3 className="pa-refusal-title">{item.title}</h3>
                <p className="pa-refusal-body">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ===================== QUICK START ===================== */}
        <section className="pa-section" aria-labelledby="pa-start-heading">
          <SectionLabel>Quick start</SectionLabel>
          <h2 className="pa-section-title" id="pa-start-heading">
            Nothing touches Proxmox until you ask it to.
          </h2>
          <p className="pa-section-sub">
            <code>PROVISIONING_ENABLED</code> is off by default. With it off a
            request queues a durable operation and builds nothing — the intended
            way to try the UI, the API and the whole state machine without a
            hypervisor anywhere near it.
          </p>

          <pre className="pa-code">
            <code>{`pnpm install
cp .env.example .env
pnpm dev                   # http://127.0.0.1:3000`}</code>
          </pre>

          <div className="pa-hero-actions">
            <DocsLink
              to="getting-started/quick-start"
              className="pa-btn pa-btn-primary"
            >
              Read the docs
            </DocsLink>
          </div>
        </section>

        <footer className="pa-footer">
          <span className="pa-mark">
            <span className="pa-mark-glyph" aria-hidden="true" />
            pve-agents
          </span>
          <div className="pa-footer-links">
            <DocsLink className="pa-nav-link">Docs</DocsLink>
            <a
              className="pa-nav-link"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="pa-nav-link"
              href={`${githubUrl}/blob/${gitConfig.branch}/LICENSE`}
              target="_blank"
              rel="noreferrer"
            >
              AGPL-3.0
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
