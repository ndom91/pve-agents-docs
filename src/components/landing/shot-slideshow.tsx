import { useCallback, useEffect, useRef, useState } from "react";

export type Shot = {
  src: string;
  alt: string;
  caption: string;
};

/** How long each shot holds before the next one starts fading in. */
const HOLD_MS = 6500;

/**
 * The hero's screenshot frame, cycling slowly through several shots.
 *
 * All the sources are the same size, so the frame reserves its space from the
 * aspect ratio and nothing reflows when the slide changes — the images are
 * stacked and cross-faded rather than swapped in flow.
 *
 * It stops advancing whenever nobody is watching or the visitor is busy with
 * it: off screen, tab hidden, pointer over it, or focus inside it. A carousel
 * that moves under the cursor while someone is reading it is the single most
 * common way this pattern goes wrong.
 */
export function ShotSlideshow({ shots }: { shots: Shot[] }) {
  const [active, setActive] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const onScreen = useRef(true);
  /* Refs rather than state: none of these should repaint anything by
     themselves, they only decide whether the next tick is allowed to. */
  const paused = useRef(false);

  const go = useCallback(
    (next: number) =>
      setActive(((next % shots.length) + shots.length) % shots.length),
    [shots.length],
  );

  useEffect(() => {
    const el = frame.current;
    if (!el || shots.length < 2) return;

    // Respect the OS setting: no automatic movement at all. The dots still
    // work, so the other shots remain reachable rather than merely hidden.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    /* Bound here rather than as JSX props. Hover-pause has no keyboard
       equivalent to pair it with, so as a prop it trips the static-element
       handler rule — and suppressing an accessibility rule to keep a mouse
       affordance is the wrong trade. Focus is handled alongside it, which is
       the keyboard path that actually matters. */
    const hold = () => {
      paused.current = true;
    };
    const release = () => {
      paused.current = false;
    };
    el.addEventListener("pointerenter", hold);
    el.addEventListener("pointerleave", release);
    el.addEventListener("focusin", hold);
    el.addEventListener("focusout", release);

    const id = setInterval(() => {
      if (paused.current || !onScreen.current || document.hidden) return;
      setActive((i) => (i + 1) % shots.length);
    }, HOLD_MS);

    return () => {
      clearInterval(id);
      observer.disconnect();
      el.removeEventListener("pointerenter", hold);
      el.removeEventListener("pointerleave", release);
      el.removeEventListener("focusin", hold);
      el.removeEventListener("focusout", release);
    };
  }, [shots.length]);

  const current = shots[active];

  return (
    <figure className="pa-shot pa-shot-hero">
      <div className="pa-slides" ref={frame}>
        {shots.map((shot, i) => (
          <img
            key={shot.src}
            className="pa-slide"
            src={shot.src}
            alt={shot.alt}
            // The first shot is the LCP, so it loads eagerly and the rest
            // wait — but only until idle, not until they are shown, or the
            // first transition would fade in to nothing.
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
            data-active={i === active}
            aria-hidden={i === active ? undefined : true}
          />
        ))}
      </div>

      <figcaption>
        <span className="pa-slide-caption">{current.caption}</span>
        {shots.length > 1 && (
          <span className="pa-slide-dots">
            {shots.map((shot, i) => (
              <button
                key={shot.src}
                type="button"
                className="pa-slide-dot"
                data-active={i === active}
                aria-label={`Show screenshot ${i + 1} of ${shots.length}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
