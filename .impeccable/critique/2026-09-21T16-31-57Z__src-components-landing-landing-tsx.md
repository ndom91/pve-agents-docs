---
target: the marketing landing page
total_score: 26
max_score: 36
na_heuristics: 9
p0_count: 0
p1_count: 2
timestamp: 2026-09-21T16-31-57Z
slug: src-components-landing-landing-tsx
---
Method: dual-agent (A: critique-A-design · B: critique-B-detector)

Target: `src/components/landing/landing.tsx` — the pve-agents marketing landing page.
Surface mode: **Persuade**. Inspected live at https://pve-agents-docs.ndo.workers.dev/

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Load animation communicates well; external links give no cue they leave the site. |
| 2 | Match System / Real World | 4 | Proxmox / LXC / ref / golden-template is exactly this audience's language. |
| 3 | User Control and Freedom | 3 | ~4s hero animation cannot be skipped; `prefers-reduced-motion` is handled correctly. |
| 4 | Consistency and Standards | 3 | Token discipline is excellent, but focus rings come in two flavours and `--text-decorative` carries text against its own documented contract. |
| 5 | Error Prevention | 2 | Two labels per destination, twice over. Five controls above the fold, three destinations. |
| 6 | Recognition Rather Than Recall | 3 | "Get started" ≡ "Quick start"; "Source" ≡ "GitHub". |
| 7 | Flexibility and Efficiency | 2 | No skip link, no in-page anchors, logo is not a link and not in the tab order. |
| 8 | Aesthetic and Minimalist Design | 3 | Strong restraint, undone by an illegible hero shot and ~250px of dead space inside each rail image. |
| 9 | Error Recovery | n/a | Static marketing page: no inputs, no failure states, no error surface. |
| 10 | Help and Documentation | 3 | Docs reachable from three places; nothing says what you need before clicking. |
| **Total** | | **26/36** | **Good (72%)** |

Applicable maximum 36; heuristic 9 scored n/a.

## Design Specificity Verdict

**Authored-for-this-product in its parts, category-interchangeable in its composition.**

**LLM assessment.** The details are genuinely earned. The hero console is not a decorative terminal — it is the product's actual request shape (`repo` / `ref` / `purpose`) followed by its four real provisioning phases with their real detail strings. The whole page runs on the app's own `tokens.css`, so the marketing surface and the product are visibly the same object. The copy has fingerprints: "not in a terminal somebody has to be attached to" was written by someone who has been burned by that.

The skeleton is not earned. Strip the words and you have the standard dev-tool template: centred column, h1 + sub + two buttons, big product screenshot, 3-up feature grid, two more screenshots, thin footer. "Watch / Answer / Decide" is the most interchangeable unit in the genre, and a typed-text hero is the category's most over-used trope.

**The damning gap: the headline word is "disposable" and nothing in the composition expresses disposal.** The lifecycle animation only ever builds — clone, boot, checkout, agent, four green ticks. It never tears anything down. The single mention of destruction on the entire page is a figcaption under an illegible screenshot. The most distinctive claim in the product gets zero design.

**Deterministic scan.** CLI detector over `landing.tsx`: **zero findings, exit 0.** The runtime overlay found 11: `undersized-ui-text` ×10 and `overused-font` ×1.

- The **font** hit (Geist, 40% of text) is a false positive under a pinned brief — the app ships Geist and its style guide says to keep the app's faces.
- The **undersized-text** hits are a real tension rather than a clean false positive. STYLE.md does prescribe 9.5px labels and 10.5px controls, so the page is faithful to its brief. But that brief was written for a dense operator dashboard viewed up close, not a marketing page being scanned by a stranger. Inheriting it wholesale is a defensible choice that nobody explicitly made.
- The detector's earlier `side-tab` hit on `border-right: 6px solid var(--sage)` was dismissed twice this session as a caret false positive. The rule was wrong about the reason and right about the location — see P2 below.

**Visual overlays.** Injection succeeded against a local dev build; the overlay rendered real `.impeccable-overlay` nodes and reported `[impeccable] 11 anti-patterns found`. The live server has been stopped.

**Measured contrast.** One failure out of 14 pairings. Everything else clears AA comfortably (5.0:1 to 15.1:1). Production console is completely empty — zero errors, zero warnings, zero 404s across 22 requests.

## Overall Impression

This is a good page with rare discipline and one strategic hole. The craft floor is high: one accent colour, four surfaces, flat throughout, mono strictly for machine facts, no lapse into a framework default anywhere. It reads as built by the same hand as the product, because it was.

What it does not do is argue. It shows you the machine working and assumes you are already sold on self-hosting an autonomous agent with shell access on your own hardware. For the reader who is not there yet — and that is most of them — the page never addresses the only question that matters: what does this thing do to my host, my LAN, and my credentials?

The single biggest opportunity: **make "disposable" visible.** It is the first word of the headline and the one thing competitors cannot copy, and the design is silent on it.

## What's Working

**The hero is evidence, not illustration.** Most dev-tool heroes show an imaginary terminal. This one shows the product's literal request schema and its literal state machine, in the product's own type and colour. It earns trust before asking for any.

**Token discipline is genuinely rare.** One accent, four surfaces, flat, nothing rounder than 7px, mono reserved for machine facts and sans for prose — held across a whole page without a single lapse. Measured contrast confirms it: 13 of 14 pairings pass, most of them comfortably.

**The copy knows its reader.** "Replayed from the beginning for whoever opens the page late" names a specific pain a homelab operator has felt. No adjectives, no "seamlessly", no invented claims.

## Priority Issues

**[P1] Nothing tells the reader what this costs them to try.**
No requirements (which Proxmox version? a prepared golden template? what auth?), no blast-radius statement, no explanation of what destruction actually removes, no mention of API cost. AGPL appears only as a footer link.
*Why it matters:* the audience is being asked to run an autonomous agent with shell access on hardware they own. This is *the* decision, and the page is silent on it. Readers who cannot answer it leave rather than click through to docs.
*Fix:* one section between the loop and the footer — "What it needs" as a mono key/value block (host, template, auth, network), plus one sentence on what a destroy deletes and what survives it.
*Suggested command:* `$impeccable clarify`

**[P1] The hero screenshot is unreadable and half empty.**
`home.png` is 2880×1800 rendered into ~1014 CSS px, so the app's own 9.5px labels land near 7px. The lower-left quadrant is blank sidebar. It occupies the most valuable 640px on the page, is the LCP element, and communicates nothing. The two rail figures have the same problem: ~250px of empty ground each, because the sources are a fixed 1760px tall.
*Why it matters:* the eye leans in right after the page's best moment, fails, and the confidence the console just built leaks out.
*Fix:* crop to the "New workspace" panel plus one running row and render near 1:1, or ship a 1440-wide source. Same treatment for the rail figures.
*Suggested command:* `$impeccable layout`

**[P2] The typing caret never turns off.**
`.pa-typed` sets `border-right: 6px solid var(--sage)` as its base and `pa-caret` has no fill-mode, so after 5.1s it reverts to that base. A solid 6px sage bar sits against "queue" permanently. Verified three ways: computed `rgb(181, 205, 169)` at 32s, 40s and 48s on production, with `pa-caret` gone from `getAnimations()`; plus a cropped screenshot. The code comment two lines above argues explicitly against exactly this.
*Fix:* base `border-right-color: transparent`; let `pa-caret` light it only during the run.
*Suggested command:* `$impeccable polish`

**[P2] Six of eight tab stops get Chrome's blue ring instead of the project's.**
`.pa-nav-link:focus-visible` only changes `color`, so the UA default `outline: auto 1px rgb(153,200,255)` shows through on all three nav and all three footer links. The two hero buttons correctly use `outline: 2px solid var(--focus-ring)`. Nothing is missing a ring; the page just has two unrelated ones.
*Fix:* split focus out of the hover rule and give it the sage token.
*Suggested command:* `$impeccable polish`

**[P2] `--text-decorative` is carrying text.**
`.pa-lifecycle-step` renders `01`–`04` in `#3b4636` on `#131713` — **measured 1.82:1**, the page's only contrast failure. The token's own definition in `tokens.css` says "BELOW THRESHOLD — dots and rails only".
*Fix:* `--text-dim`. The ordinals chunk the sequence; they are content, not decoration.
*Suggested command:* `$impeccable polish`

## Persona Red Flags

**Jordan (confused first-timer)**
- "golden template" appears in the sub-headline and again in the lifecycle as a known noun. Never defined, and it is the actual prerequisite.
- `home.png` is the obvious "just show me the product" fallback, and it is illegible at its rendered size.
- "Get started" (hero) and "Quick start" (nav) are the same URL under two names. Jordan guesses which is which.

**Riley (deliberate stress tester)**
- `<Logo />` is a `<span>` in both nav and footer — not a link, not in the tab order. No clickable wordmark, no keyboard route home.
- Nav focus is a colour shift identical to hover, so focus and hover are indistinguishable.
- `.pa-request` carries `role="img"` plus a 30-word `aria-label`, flattening three key/value rows into one sentence for a screen reader.
- Credit where due: the `prefers-reduced-motion` block sets the ticks' *end* state, so the phases still read as done rather than never-started.

**Casey (distracted mobile user)** — *not visually verified; read from the 900px and 560px media blocks, because viewport-resize tooling silently fails in this environment*
- `home.png` is 2880px wide, above the fold, and is the LCP. At ~328px on a phone its UI text lands near 2px. Full download, zero value.
- Below 900px both rail figures stack full-width at roughly 1160px tall each, several hundred px of that empty, before a footer with no CTA.
- The only conversion control sits ~400px down, behind a ~4s animation.

## Minor Observations

- `pa-caret` runs 4.8s but `pa-type` finishes at 2.1s — 2.7s of blinking after the typing stops.
- `@keyframes pa-type` targets `43ch` for a 42-character string.
- `.pa-shot figcaption, .pa-shot-rail figcaption` — the second selector is dead; `.pa-shot-rail` elements already carry `.pa-shot`.
- Both `target="_blank"` links give no cue they leave the site.
- Lifecycle ticks are `aria-hidden` SVGs with no text equivalent, so completion is conveyed by colour and shape alone.
- Only two heading-level regions on the whole page.
- Page is ~3160px tall at a 1899px viewport; roughly 2000px of that is screenshots.
- Page weight ~1.1MB: 614KB screenshots (PNG only, no WebP/AVIF), 142KB fonts, 304KB in the main JS chunk.

## Questions to Consider

1. What would the hero look like if it animated a **destroy** instead of a build? "Disposable" is the pitch, and the page only ever builds.
2. If the screenshots are too small to read, why are they screenshots? Rebuilt as real DOM they would be legible, responsive, lighter — and would *be* the product rather than a picture of it.
3. Who is the second reader? The page argues to someone already sold on self-hosting. It never speaks to the person running Claude Code on their laptop today.
4. STYLE.md's 9.5px labels were designed for a dense dashboard viewed up close. Should a marketing page inherit them unchanged?
