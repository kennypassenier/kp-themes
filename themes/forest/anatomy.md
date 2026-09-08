# forest — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Topo is lifted
> in 5.0.0 (S48, LIFT_PLAN forest row). The concept demo Kenny approved on
> 2026-09-08 is "Contour Register"; its own header comment cites
> docs/RESEARCH_2026-09.md §7 (the perturbed-circle contour field and the
> headline's trace) and §2 (the razor tear and the concentric-ring
> divider). Kenny is renaming this theme to **forest** at its lift; the
> rename touches every generated file and document and is done centrally,
> after every theme is lifted — this anatomy, the register and the
> tokens are still built under the id `forest`.

## The idea

A topographic map on kraft paper. A warm sand ground, deep forest ink, a
clay trail and a lake blue, with contour lines wandering faintly across
the background — a field guide's restraint, not a poster. Where `formal`
is a printed document, this is a printed _map_: the same respect for
paper, but the information is spatial and the palette comes from
outdoors.

## What is load-bearing

1. **Kraft, not cream.** `hsl(42, 32%, 95%)` is more saturated than
   formal's paper and reads as recycled stock.
2. **Forest green acts.** `hsl(158, 42%, 24%)` is the only interactive
   colour, and it is dark enough to read as ink rather than as a
   highlight.
3. **The contour field, felt not seen.** A static six-ring SVG layer at
   0.05 opacity — under DI9's 0.06 ceiling — is the whole texture and the
   theme's only ornament; the finished field is the default, not a
   fallback, and never depends on JS or motion to be complete.
4. **Clay never acts.** `--accent` is warm against the green and is
   always decorative — a plain highlight in the lede, never a control.

## The register (5.0.0)

`css/forest-register.css` is the theme's answer to the hook vocabulary
(S45):

- **Surface.** The hero is transparent enough for the contour field to
  read through it; the app surface carries a light, translucent card
  tint so the form and the dossier lift off the page without blotting
  the field out.
- **Emphasis.** A plain `<mark>` outside a reveal container is a felt
  highlight — always visible, no motion. Inside a
  `data-kp-reveal="emphasis"` container it is a redaction: a plate of
  ink over the phrase (`--kp-reveal-emphasis: plate`, the one word of the
  vocabulary's six no other lifted theme had claimed), cleared on the
  dossier's own trigger with a background/colour crossfade staggered
  0/150/300ms.
- **Reveal.** The section rule draws in from the left when its heading
  enters the viewport (`draw`). The headline answers no routine at all —
  see below.
- **Divider.** A razor tear (a torn-paper clip-path edge) and a second
  form, two concentric contour rings, both static.
- **Arrival.** None. The demo's own DI5 table lists no boot sequence, and
  the register declares no `--kp-arrival`.

**The headline's own mechanism, CSS-only.** The demo's header comment is
explicit that this is deliberate: "the reduced-motion path is the
default, not a fallback." The register declares no
`--kp-reveal-headline`, so `js/effects.js` treats the hook as quiet and
leaves the text alone; the fade-in and the contour trace beside it are
plain CSS animations, guarded by the no-preference media query like
every other motion in the file, but never gated on `[data-kp-effects]`
— they do not need the module to be complete. This is the theme's own
mechanism, distinct from the decipher / tracking / shout / dissolve /
type routines the other five round-six demos used.

## What the demo showed and the package now renders exactly (S49, 2026-09-08)

Kenny's rule of 2026-09-08 is that an approved demo is implemented
exactly, and that a test or a gate which disagrees produces a finding
for him rather than a quiet change. No dedicated audit document exists
yet for this theme (the four `docs/audits/DEMO_FIDELITY_*.md` files are
phantom, retro, terminal and brutalism); the findings below are this
lift's own reading, done the same way.

- **The tokens matched exactly.** Every literal hex the demo's header
  comment lists converts to the HSL already declared in
  `themes/forest/tokens.json` — background, foreground, card, primary,
  secondary, muted, accent, destructive, success, warning, info, border,
  border-strong, the sidebar family, `--fx-signal`, `--radius`,
  `--fx-duration`, `--fx-ease`, `--fx-lift`, and both font stacks. No
  token changed for this lift.
- **The spec sheet's five swatches could not be reproduced exactly.** The
  demo's own spec sheet shows five tokens by the theme's own names —
  ground (`--background`), ink (`--foreground`), moss (`--primary`), clay
  (`--accent`), lake (`--info`). The concept page's shared skeleton
  (`showcase/examples.mjs`, common to every lifted theme) instead fixes
  the five swatches to `--surface-hero-bg`, `--background`,
  `--destructive`, `--accent`, `--chart-4` — a different set of tokens,
  chosen once for cyberpunk and reused unchanged since. The hero-ground
  token and `--background` happen to be the same value for forest (a
  one-ground theme), so the labels "ground" and "kraft" are given to two
  identical swatches; "clay" survives verbatim (both point at `--accent`);
  the other two ("alert" for `--destructive`, "moss" reused for
  `--chart-4`, the closest hue to the demo's own primary-moss) are
  invented to fit tokens the demo never showed on this row. Editing which
  tokens the spec sheet reads would mean editing
  `showcase/examples.mjs`'s fixed swatch list, which every other lifted
  theme also renders through — out of scope for a single theme's lift,
  and not attempted here.
- **The headline's contour trace has no home on the generated page.** The
  demo places a small inline SVG (`.kp-contour-trace`, a hand-drawn stroke
  beside the headline) next to `<h1 data-kp-reveal="headline">`. The
  shared concept-page skeleton's hero only renders the `<h1>` itself —
  no sibling SVG element exists anywhere in `showcase/examples.mjs` for
  any theme. The register's CSS for `.kp-contour-trace` is written and
  correct (it was checked against the demo's own markup and the
  `pathLength`/`stroke-dasharray`/`stroke-dashoffset` mechanism), but it
  never matches anything on `examples/concept-forest.html` today, so the
  trace does not appear. Adding the element would mean editing the same
  shared, all-theme descriptor as the spec-sheet finding above.
- **The demo's own CSS sets a `pathLength` declaration on the trace
  path, which is not a valid CSS property** — `pathLength` is an SVG
  attribute, settable only in markup, and a browser silently ignores it
  in a stylesheet. Read literally, the demo's dash values would animate a
  one-unit dash across a much longer path — a barely visible flicker, not
  a draw-in. The demo's own header comment is unambiguous about the
  intended result (a stroke that draws in via `stroke-dashoffset`), which
  is only achievable by giving the path element an actual `pathLength`
  **attribute** in markup, normalising its length to one unit so the
  dash-array pair produces a full draw. The register's CSS is written for
  that corrected mechanism, with the path expected to carry the
  attribute; since the element has no home on the generated page
  (previous finding), this could not be verified end-to-end, only
  reasoned from the demo's own file.
- **The dossier's two-button affordance is one button on the shared
  page.** The demo hand-rolls its own script: a "Clear the redactions"
  trigger that hides itself and reveals a separate "Close the file"
  button, toggling back and forth. The package's shared trigger
  mechanism (`js/effects.js`'s `wireTrigger`, used by every lifted
  theme's dossier) is a single button whose pressed state toggles the
  redactions both ways, which is what the shared descriptor's dossier
  markup already wires in. The register is styled to work correctly
  with that single-button pattern; the demo's second, separate close
  button is not reproduced, for the same reason the trace SVG is not —
  no such element exists in the shared page this register is tested
  against.
- **The wipe confirmation matches.** The demo's own inline `<dialog>`
  (Kenny's rule of 2026-09-08: a real confirmation, not a self-relabelling
  button) is exactly what the package's shared `data-kp-confirm`
  mechanism already builds; no register change was needed beyond styling
  `.kp-dialog`/`.kp-confirm` and its `::backdrop`.
- **The words on the concept page are the demo's own**, entered in
  `showcase/concept-copy.mjs` and rendered at `examples/concept-forest.html`
  — verbatim where the demo has an equivalent slot, written in the
  demo's own voice for the two slots it has none for (`brandTag`, since
  the demo's brand carries no file code; `handleHelp`, since the demo's
  name field carries no help text). Both are named in the report as
  invented.
- **The texture sits under the ceiling.** The demo's own field is 0.05,
  under DI9's 0.06; no per-theme ceiling override was needed, unlike
  dark's 0.06 or phantom's overrun.

## Answers to the invariant questions

**DI1 — hairline or boundary?** A hairline at `hsl(42, 20%, 80%)`, in the
paper family — used only for decoration (nav/footer separators, the
spec-sheet rule), never on a control edge. The boundary is
`border-strong`, `hsl(160, 20%, 47%)`, in the ink family — 3.29:1 against
the ground, 3.50:1 against the card — and is what every control edge, the
dropdown, the dossier and the dialog use.

**DI2 — the focus ring.** The package's own two-channel constant, in
`css/_rules.css`: an inner ring and an outer one. The demo's own
hand-written version stacks foreground inside, background outside — the
same order the shared rule already uses, so no override was needed.

**DI3 — does this theme follow the derivation?** Yes, unmodified. Ink on
paper again; no opt-out.

**DI4 — palette or code?** A code, and the demo's own outdoor palette has
an advantage formal and pastel lack: water, clay, moss and stone are
naturally well-separated by lightness as well as hue.

**DI5 — animation?** Two CSS-only, once-on-load changes (the headline's
fade, 0.5s; the trace's draw, 1.8s — 0.56 opposing changes/s at worst),
the rule's width transition (0.3s, scroll-triggered, once per session),
and the redaction's background/colour crossfade (0.4s, staggered,
user-triggered). Nothing loops; nothing exceeds one play. The
no-preference media query guards every one of them.

**DI6 — light or dark?** Light, `color-scheme: light`; card and popover
sit slightly lighter than the ground (13.04 → 13.86 foreground contrast),
the only light theme in the set whose layers rise by lightness rather
than by going flat white.

**DI7 — reduced motion.** Every animation and transition sits inside the
no-preference guard; the rest states declared outside it (drawn rule,
cleared mark, settled headline, fully-drawn trace) are what a
reduced-motion reader — or a page without the effects module at all —
gets directly.

**DI8 — the disabled token.** `--muted`/`--muted-foreground` carry
disabled state throughout the register (fields, buttons via the shared
component base); no contrast floor is claimed for it, per the invariant.

**DI9 — theme colour stays in the token layer.** The register names no
colour: every value is `var(--token)` or a relative colour of one — the
contour field, the redaction plate, the dropdown shadow, all built from
`--primary`, `--foreground` and `color-mix()`. One texture, the contour
field, at 0.05, under the 0.06 ceiling.

## What this theme may not do

- Let the contour field become legible as a picture. It is terrain, not
  illustration, and sits at 0.05 for that reason.
- Use clay (`--accent`) for a control. It is decoration only, per its own
  token comment in `themes/forest/tokens.json`.
- Lose the warmth of the ground; a neutral grey turns it into a generic
  light theme with a green accent.
- Animate anything outside the no-preference guard, or let the redaction
  or the rule replay more than once per session without
  `data-kp-reveal-every="load"`.
