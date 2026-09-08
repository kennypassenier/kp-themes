# shade-dark — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Shade-dark is
> lifted in 5.0.0 (S48, LIFT_PLAN row 24). The concept demo Kenny approved
> on 2026-09-08 is "Undertow Editorial".

## The idea

The dark half of the shade pair: the same Solarized scheme with the
lightness steps mirrored, so switching between the two halves changes the
ground and keeps the accents. Medium contrast on a deep blue-black, for
reading at night without the glare of white text. See
[shade-light](../shade-light/anatomy.md) for the idea the pair shares;
this document records only what the dark half does differently.

Shade-dark is a **one-ground theme**: the hero and the app share
`--background` (`--surface-hero-bg` equals `--background` in
`tokens.json`), which is load-bearing for the divider below — a plain
fade to transparent would fade to the colour it already sits on and
vanish.

## What is load-bearing

1. **The ground is base03, the text is lifted.** `hsl(192, 100%, 11%)` is
   Solarized's own; the canonical text colour base0 measured 4.28:1 on
   the card and was lifted to `hsl(186, 8%, 64%)`, which reads at 4.5 on
   every surface and still stops far short of white.
2. **Accents lighter than the light half's.** Blue at 60% instead of
   38%, magenta at 58%, red at 66%: the same hues, mirrored across the
   middle, so a plate reads at the same contrast on either ground.
3. **The layers rise.** Ground 11%, card 14%, popover 17% — deliberate,
   where the light half's card goes the other way.
4. **No elevation shadow.** `--fx-lift: 0px` and `--fx-shadow-offset: 0px`
   already shipped; three independently measured sources (this
   theme's own research, obsidianassembly.com, Dark_Editorial.html)
   carried between zero and three soft box-shadows each. Depth between
   surfaces (bg → card → popover, and the dossier card) comes from the
   tone ladder alone.
5. **No texture.** `--fx-texture` stays unset. No starfield, no grain —
   the register adds nothing to the ground.

## The register (5.0.0)

`css/shade-dark-register.css` is the theme's answer to the hook
vocabulary (S45):

- **Surface.** The tone ladder alone (bg → card → popover), no shadow.
  The hero and app share one ground.
- **Emphasis.** A loose `<mark>` (the hero lede) is a static signal
  plate — the demo never covers or reveals it, unlike the other lifted
  themes' loose marks. Inside the dossier card, a `<mark>` is an ink
  plate in `--border-strong` that the reader clears left to right on the
  trigger, staggered 150ms apart, 300ms each (`plate`).
- **Reveal.** The headline's words arrive out of a blur one after
  another, 90ms apart, 600ms each (`focus`) — the package's own take on
  obsidianassembly.com's per-character blur reveal, shortened to word
  level and to this cadence so a page with no boot gate does not sit
  half-blurred on first paint. The rule under a heading draws itself in
  with a 500ms scaleX transition on scroll into view (`draw`).
- **Divider.** A radial swell in the _next_ surface's own tone (popover,
  then secondary for the second one) plus a hairline fading at both
  ends — noth.in's blurred-seam idea paired with Dark Editorial's
  gold-hairline device, neither literally reproduced: no `blur()`
  filter anywhere, no literal gold (DI9's own rule).
- **Accent.** No shadow, no plate behind a heading — the demo's whole
  point is that a heading is just text, medium contrast, easy to read.
- **Arrival.** None. `--kp-arrival` is unset, matching the "no
  starfield, no grain" restraint; the page is simply there, the way
  `dark` and `light` already answer this hook.

The hero CTA button and the dossier card (both carry
`data-kp-reveal="emphasis"`) settle out of the same blur the headline
uses, once, when the page is ready — see the S49 finding below for why
this is "on load" rather than the demo's own words, "on first
scroll-into-view". Every hover is a lightness step on the token
(`hsl(from var(--token) h s calc(l ± N%))`), never a colour of its own.
One answer per component root (56 of 64, the eight helpers excused).

**What the demo showed and the package now renders exactly (S49,
2026-09-08).** Kenny's rule of 2026-09-08 is that an approved demo is
implemented exactly, and that a test or a gate which disagrees produces
a finding for him rather than a quiet change. What follows is named here
with its reason, put to him rather than decided silently.

- **The palette needed no change.** Every hex value the demo's own
  header comment lists converts, colour for colour, from the HSL values
  already in `themes/shade-dark/tokens.json` (verified by converting all
  24 of them with the same `hslToHex` the demo's comment names). X0's
  "the demo wins" step therefore changed nothing in `tokens.json`.
- **The hero CTA and the dossier card's entrance.** The demo's own script
  hides both behind a blur and reveals them "on first scroll-into-view",
  the same `IntersectionObserver` the rule hook uses. `js/effects.js`'s
  shared `emphasis()` function has no generic per-element scroll trigger
  for a container with nothing to clear — it only clears `<mark>`
  elements, and both containers here carry either none (the button) or
  marks that are clearing for a different reason (the card's
  redactions). Rather than add a second `IntersectionObserver` path to a
  function four other lifted themes already depend on, the register
  plays the same blur-and-focus device once, as soon as the page reports
  `data-kp-effects` — which is correct for the hero button (already near
  the top of the viewport at first paint) but means the dossier card,
  well below the fold, has already finished its reveal by the time a
  reader scrolls to it. **Finding for Kenny:** approve this simplification,
  or ask for a real per-element scroll trigger added to `emphasis()`.
- **The confirmation dialog's backdrop.** The demo's own CSS is a literal
  `rgba(0, 0, 0, 0.55)`. `css/components.css`'s base `.kp-dialog::backdrop`
  is already a literal `rgb(0 0 0 / 0.5)`, deliberately exempted from
  DI9 with its own comment ("a theme colour here would tint the page
  rather than dim it") — a per-theme override to 0.55 would need a
  second literal colour in a register, which DI9 forbids outright. The
  register does not override the backdrop; the shipped opacity is 0.5,
  not the demo's 0.55. **Finding for Kenny:** the difference is 0.05 of
  opacity on a full-viewport black backdrop, effectively imperceptible,
  but it is a literal deviation from the demo and is recorded as one.
- **The redaction markup.** The demo's own standalone HTML redacts three
  phrases with `<span class="kp-redact">` and a hand-rolled
  `.kp-card.is-open` toggle. The page every register actually ships is
  generated from the shared `examples/concept.html` structure (S46,
  KT11), whose dossier already carries real `<mark>` elements and a
  `data-kp-reveal-trigger` button wired to `js/effects.js`'s
  `wireTrigger()` — the same mechanism retro and phantom's dossiers use.
  The register targets that markup; the visual result (three plates that
  clear left to right, staggered, on the trigger) matches the demo's
  description exactly, even though the DOM underneath is the package's
  own rather than the standalone artifact's.
- **A measured contrast pair the demo's own audit missed.** The demo's
  `.microlabel { color: var(--accent); }` is one rule for every surface
  the class appears on. `tests/surfaces.spec.mjs`, run against every
  theme over the package's own concept page, measures accent
  (`#2aa298`) as text on the dossier card (`#073541`) at **4.21:1**,
  under the 4.5 floor normal text needs (large text's floor is 3). The
  demo's own contrast comment lists 12 pairs and never this one — accent
  only appears there as a _background_ (accent-foreground on accent,
  4.69). **Finding for Kenny:** the register keeps the demo's single
  `.microlabel` rule rather than adding a card-specific override with a
  colour the demo never specified; `tests/surfaces.spec.mjs` fails one
  case (`shade-dark`) as a direct, measured consequence, recorded here
  rather than corrected.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` (`hsl(194, 14%, 50%)`,
`#6e8991`) on background measures 3.94, on card 3.54 — the lowest
boundary on the page, still above the 3.0 floor.

**DI2 — the focus ring.** The demo's own global rule: an outline in the
foreground and a box-shadow moat in the ground, composed on every
focusable element rather than per component. Measured on a primary
button: foreground/primary 1.11 (fails alone), background/primary 5.46
(clears 3:1) — one channel always wins, as the invariant predicts.

**DI3 — states you can see.** Derived by lightness towards light; the
dark button took a lighter ink for the same reason the light half's took
a darker one. Hover states step `l` by a few points on the token via
`hsl(from var(--token) h s calc(l + N%))` — no colour of the register's
own.

**DI4 — colour is never the only carrier.** As the light half.

**DI5 — the flash threshold.** Nothing loops. Six one-shot effects, all
in `reports/di5.md`: the headline's words (opacity, 600ms), the hero
button and dossier card's entrance (opacity, 500ms), the three
redactions clearing (a transform, not luminance-tracked), the dialog and
its backdrop opening (opacity, 180ms each), and the rule drawing (a
transform, not luminance-tracked). None of the three sources this pass
measured carried a loop either (obsidianassembly.com's reveal is
one-shot, Dark Editorial's only animated rule is an 8s hover-zoom,
noth.in's blur layers are static) — this theme adds none.

**DI6 — light or dark.** `color-scheme: dark`, and the layers rise:
0.0041 (bg) → a lighter card → a lighter popover still, in that order.

**DI7 — reduced motion.** `--fx-duration: 180ms` inherited from the
token contract for the dialog's own animation; every animation and
transition of this register lives inside the no-preference guard. At
rest: the rule stands drawn, the hero button and dossier card stand in
full focus, the dossier's marks stand plain (never covered — a redaction
that could hide content without a script is not acceptable), the dialog
opens and closes without a transition.

**DI9 — theme colour stays in the token layer.** No texture, no
flourish, no colour outside `var(--token)` or a relative colour of one.

## What this theme may not do

- **No white text.** 64% lightness is the ceiling for body text; only
  plates carry a near-white ink.
- **No starfield, no grain.** Dark owns the first; this half owns
  nothing but its contrast.
- **No elevation shadow.** The tone ladder carries depth; a `box-shadow`
  on a card or popover would contradict the anatomy's own measured
  finding (`--fx-lift: 0px`, `--fx-shadow-offset: 0px`).
- **No loop, no flicker.** Every effect in `reports/di5.md` plays once.
