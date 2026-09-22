import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { gitConfig } from "@/lib/shared";
import { ContainerField } from "./container-field";
import { type Shot, ShotSlideshow } from "./shot-slideshow";
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
 * The hero frame cycles through these. Ordered fleet → agent → timeline, so
 * it reads as one workspace's life rather than three unrelated screens, and
 * the light shot sits between the two dark ones so the theme alternates
 * rather than changing once and staying.
 */
const heroShots: Shot[] = [
  {
    src: "/screenshots/home.png",
    alt: "The fleet: one workspace running, forty-seven destroyed, and the form that requests the next one",
    caption:
      "What is running, what has been destroyed, and the form that starts the next one.",
  },
  {
    src: "/screenshots/home1.png",
    alt: "A workspace in light mode, the agent answering questions about the checked-out repository, with a banner saying it is holding unsaved work",
    caption:
      "The agent at work — and a workspace holding uncommitted changes, which is why it has not been reaped.",
  },
  {
    src: "/screenshots/home2.png",
    alt: "A workspace with its timeline open, showing requested, clone confirmed, booted, checked out, seeded and session started",
    caption:
      "Every phase of the build, timed, down to the brief it was handed.",
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

/** The tick in a lifecycle box. Draws itself when its step lands — see landing.css. */
function Check() {
  return (
    <span className="pa-lifecycle-check">
      <svg viewBox="0 0 12 12" focusable="false" aria-hidden="true">
        <path d="M2.5 6.3 4.9 8.7 9.5 3.4" />
      </svg>
    </span>
  );
}

export function LandingPage() {
  return (
    <div className="pa-root">
      <div className="pa-shell">
        <nav className="pa-nav" aria-label="Primary">
          <Logo />
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
          <ContainerField />
          <h1 className="pa-hero-title">
            Self-hosted sandboxes for coding agents.
          </h1>
          <p className="pa-hero-sub">
            Give it a repository, a ref and a purpose. It builds a disposable
            LXC on your Proxmox host, starts a Claude Code agent inside it, and
            streams the whole thing to your browser.
          </p>

          <div className="pa-console">
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
                  <Check />
                  <span className="pa-lifecycle-step">{phase.step}</span>
                  <span className="pa-lifecycle-name">{phase.name}</span>
                  <span className="pa-lifecycle-detail">{phase.detail}</span>
                </li>
              ))}
            </ol>
          </div>

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

          {/* The pitch, in the gap before the fleet screenshot: what this gives
              you that a laptop cannot. Parallelism, isolation, a clean slate,
              and hardware you already own. */}
          <div className="pa-bridge">
            <p className="pa-bridge-lead">
              Run as many as your host will hold.
            </p>
            <p className="pa-bridge-body">
              Each workspace is its own container, so nothing an agent does
              touches your workstation. Every one starts from the same clean
              template, they run in parallel rather than in turn, and the
              hardware is already yours.
            </p>
          </div>

          <ShotSlideshow shots={heroShots} />
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

        <footer className="pa-footer">
          <Logo />
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
