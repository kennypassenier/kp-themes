# high-contrast — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Black on white, one signal yellow, and nothing in between. This is the
theme for someone who finds the other twenty-four too soft — low vision,
a screen in daylight, tired eyes at the end of a shift — and it is the
only one here whose reason for existing is not taste. The approved
concept demo, "Ink & Signal" (2026-09-08), names its own promise: 21:1,
every time, and one accent colour with a job, never a decoration.

It is deliberately loud. A high-contrast theme that has been softened to
look nice has stopped being a high-contrast theme. Where every other
lifted theme in round six adds a mechanism — a decipher, a dither, a
CRT switch — this one adds a border. The register's whole vocabulary is
line weight: 1px hairlines for what is merely decorative, 2px for every
control edge, 3px for the two structural rules (the nav's base and the
footer's), and one flat, unblurred shadow reserved for the single button
the demo marks `--mirror`.

## What is load-bearing

1. **Pure black on pure white.** 21:1, the highest a screen offers. Any
   grey in the body text is a concession, and there is none: the demo's
   own contrast table computes it before use (see below) and this
   register never disagrees with it.
2. **The signal yellow.** `--accent` is `hsl(48, 100%, 50%)` with black
   ink — the colour every accessibility convention reaches for, because
   it is the one hue that stays distinct for nearly every kind of colour
   vision. It is the only decoration this theme has, and the demo's own
   contrast table refuses it as a foreground on the page ground (1.51:1)
   by construction: it appears only as a flat fill with black ink on top,
   never as text colour.
3. **`--radius: 0.25rem`.** Nearly square. A soft corner blurs the edge
   of a control, and an edge is information here.
4. **Atkinson Hyperlegible first.** A typeface drawn by the Braille
   Institute specifically to keep letterforms apart at low acuity — b/d,
   i/l, 0/O — SIL OFL-1.1, no Reserved Font Name
   (`fonts/families.json`: `"atkinsonhyperlegible"` →
   `"reservedFontName": false`). It falls back to the house sans if the
   face is not installed, so nothing breaks; it simply gets better when
   it is there.
5. **No animation loops, ever.** Every motion the demo draws is a single
   load- or click-triggered transition that starts and stops once; the
   register carries no `@keyframes` that repeats and no `animation` with
   `infinite`.

## The register (5.0.0)

`css/high-contrast-register.css` is the theme's answer to the hook
vocabulary (S45):

- **Surface.** The hero and app surfaces are plain paper — `--background`
  and `--foreground` throughout; no gradient, no texture layer at all
  (the demo's own rule: "No gradients, no shadows, no texture"). The
  laurels sit above a 1px hairline, the platforms line below one; the
  spec sheet is a 2px-bordered card with 2px-bordered swatches.
- **Emphasis.** Two mechanisms answer one hook, on purpose, because the
  demo draws two different things under the same `<mark>` element. The
  dossier's three redactions, the card's own `mark` selector, are solid
  black bars that cover each phrase, staggered 0/90/180ms by
  `transition-delay`, and lift on the "Open the file" trigger —
  `--kp-reveal-emphasis: classified`. Every other `<mark>` on
  the page (the two in the lede) is a plain accent plate, always on, no
  cover, no clear step — a deliberate exception carved out for the
  general `mark` selector, because the demo's lede marks are static
  highlights with no reveal mechanism of their own (see the S49 section
  below).
- **Reveal.** The headline sweeps on with a clip-path ellipse wipe from
  the left edge, once, on load (`kp-hc-headline-wipe`); the rule under a
  heading draws left to right the same way (`kp-hc-rule-wipe`). Both are
  plain CSS, unconditional, with no `[data-kp-effects]` gate and no
  `--kp-reveal-headline` / `--kp-reveal-rule` custom property — see the
  S49 section for why, and for the divergence this creates from every
  other lifted theme's JS-driven, once-per-session reveal.
- **Divider.** The "razor tear": a flat 6px two-tone hard edge, no blur —
  ink with a 2px accent line under the hero, accent with a 2px ink line
  under the app section.
- **Accent.** Quiet (`themes/hooks.json`): the demo's own headline and
  section headings carry no colour or rule beyond their own size and
  weight.

## What the demo showed and the package now renders exactly (S49)

The approved demo, "Ink & Signal", is implemented exactly wherever the
package's shared markup and shared modules can carry it. Three places
they cannot, each a finding rather than a silent adaptation:

- **The dossier's redactions are `<mark>`, not the demo's own
  `.kp-redaction`/`<i>` markup.** The demo (a free-standing mockup) drew
  three custom `<span class="kp-redaction">` elements with an inline
  `<script>` toggling a `data-kp-revealed` attribute. The package's one
  shared concept-page descriptor (`showcase/examples.mjs`,
  `conceptBody()`) renders the same three phrases as `<mark>` inside
  `data-kp-reveal="emphasis"`, the hook vocabulary's own emphasis
  mechanism — the same choice retro, phantom, terminal and brutalism
  made for their own dossiers. The register reproduces the demo's exact
  appearance and timing (three bars, staggered 0/90/180ms, lifting on
  the trigger) through that mechanism instead of the demo's bespoke one.
  No content or timing was lost; only the DOM shape changed, because the
  page every theme is tried on is one descriptor, not twenty-five.
- **The headline and rule reveals are plain CSS, not JS-driven, and
  replay on every load rather than once per session.** The demo's own
  headline mechanism is a clip-path wipe with the text intact throughout
  — never scrambled, never split into glyph spans. `js/effects.js`'s
  only headline routines that leave text unscrambled are `tracking`,
  `shout`/`slam`, `dissolve` and `type`; none of them draws an ellipse
  wipe, and every other non-empty routine value falls through to the
  decipher/glitch default, which the demo explicitly refuses ("no
  character scrambling"). Declaring no `--kp-reveal-headline` /
  `--kp-reveal-rule` at all is therefore the only way to get the demo's
  exact visual with the demo's exact text — but it also means the module
  treats both as quiet, so neither is gated by `[data-kp-effects]`,
  neither uses the session memo (`sessionStorage`) the other five
  registers rely on, and the rule is not gated by the
  `IntersectionObserver` — it draws on load rather than on scroll into
  view. This matches the demo's own description ("one shot on load") in
  every case but trades away the once-per-session behaviour every other
  lifted theme has. Reported, not fixed silently: a page refresh replays
  both wipes, where retro or phantom would not replay their reveal.
- **The ghost button's rising bar replaces the demo's duplicate-label
  slide.** The demo's mechanism is a real second copy of the label,
  absolutely positioned one line below and slid up on hover/focus. The
  shared `Button` renderer (`showcase/examples.mjs`) emits one child
  only — `el('button', {...}, kids)`, no `.kp-button__label` /
  `.kp-button__ghost-copy` wrapper — so the literal mechanism cannot be
  built without a page-local script, which `gates/generate-examples.mjs`
  forbids (TH109: four stylesheets, the markup, one module script,
  nothing else). Kept instead, CSS-only and content-free: a 3px bar
  rises from the button's bottom edge on hover/focus-visible, the same
  "something arrives from below" gesture at the theme's `--fx-duration`.

Two smaller findings, both measured rather than asserted:

- **The nav recolour on scroll has no JS to drive it.** The demo's
  `.kp-nav-wrap[data-scrolled]` rule is kept in the register — inert,
  because no module in this package writes `[data-scrolled]` anywhere
  (`grep -rn "data-scrolled" js/*.js css/*.css` before this lift returned
  nothing). It will render exactly as the demo shows the moment such a
  hook exists; today it never fires.
- **The spec sheet's five swatches are the template's fixed five, not
  the demo's own five.** The demo's mockup labels ground/ink/signal/
  action/alert against `surface-hero-bg`/`foreground`/`accent`/
  `primary`/`destructive`. The shared descriptor hard-codes its five
  `data-token` values as `surface-hero-bg`/`background`/`destructive`/
  `accent`/`chart-4` — the same five slots cyberpunk, retro, terminal and
  brutalism all fill. `primary` has no slot in the template; `chart-4`
  does. The copy (`showcase/concept-copy.mjs`) labels each slot in the
  demo's own words where one exists (`paper`, `alert`, `signal`) and in
  the demo's voice where none does (`page` for `background`, `flag` for
  `chart-4`, `hsl(30, 100%, 28%)`, an amber already in the token
  contract as `chart-4`/`status-screening`).
- **The mirrored button's press is not quite instant.** The shared
  `.kp-button` rule in `css/components.css` puts `translate` in its own
  transition list for the hover lift every theme answers with
  `--fx-lift`; high-contrast's `--fx-lift` is `0px`, so the lift itself
  is a no-op, but the same list would have eased the mirror's press over
  `--fx-duration` (120ms) instead of snapping it the way the demo draws
  it. `.kp-button--mirror { transition: none; }` cancels the whole list
  for this one variant so the drop is instant, matching the demo; no
  other button's transitions are touched.
- **The laurel and dossier-meta counts are measured, not copied from the
  demo's own text.** The demo's laurel reads "94 tokens"; the contract
  now declares 96 (`themes/high-contrast/tokens.json`, checked
  2026-09-08 — round six added `fx-hot`, `fx-hot-alarm` and others since
  the demo was written). The copy uses 96. The dossier's meta line has
  no equivalent in the demo at all (the mockup's card carries only a
  visible stamp and no meta paragraph); the shared descriptor always
  renders one, so `dossierMeta` is written in the demo's own bureaucratic
  voice ("FILE 06 · STATUS: PREVIEW · CLEARANCE: AAA").

Everything else is exact: the tokens (below), the spacing scale, the
fonts, the mirrored button's 3px offset and instant drop, the dropdown
(KT14), the dialog's 3px border and its safe default (Cancel
autofocused, matching the shared `openConfirmation()` module exactly),
the laurels, the side note, the platforms line, and the two-tone
dividers.

## Tokens (X0)

No token changed. Every value the demo's own `:root` block declares
(`--hc-bg`, `--hc-fg`, `--hc-muted-bg`, `--hc-muted-fg`, `--hc-border`,
`--hc-border-strong`, `--hc-primary`, `--hc-accent`, `--hc-destructive`,
their foregrounds, the radius, the font stacks, the spacing scale, the
duration and easing) already matches `themes/high-contrast/tokens.json`
exactly — verified by converting each of the demo's hex/HSL pairs by
hand before writing a line of CSS. `node gates/check-contrast.mjs` and
`node gates/check-invariants.mjs` both pass unchanged.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` and `--input` are pure
black: 21:1 against every surface. `--border` is a mid grey at 45%
lightness (4.74:1, the demo's own "decorative hairline" pair) — the one
place this theme allows a boundary that is not black, and the register
uses it only where the demo does: the laurels' rule, a field's resting
edge, the platforms line.

**DI2 — the focus ring.** The two channels are the background and the
foreground, stacked the demo's own way — background inside at 2px, ink
outside at 4px, the reverse of the base layer's default order, which
register rule 8 allows.

**DI3 — states you can see.** The pressed state clears the floor on
lightness alone; nothing here sits near the edge of the colour space the
way neon does, so no chroma is given up. The mirrored button adds a
second, non-colour cue on top: it visibly moves onto its own shadow.

**DI4 — colour is never the only carrier.** Unchanged from the base
theme's own answer, and more important here: the badge label carries the
meaning, and this theme's plates differ in lightness as well as hue.
Every control edge in the register is a real border, never a colour
change alone — the field's rest-to-focus step swaps `--border` for
`--border-strong`, not a background tint.

**DI5 — the flash threshold.** No looping animation anywhere. The two
new keyframes (`kp-hc-headline-wipe`, `kp-hc-rule-wipe`) each run once,
rated at 0.00 opposing luminance changes/s in `reports/di5.md` because
neither touches opacity — a clip-path reveal and a transform scale,
both reported to `gates/check-motion.mjs`'s `OUT_OF_SCOPE` list with
their reason. The redaction lift and the ghost bar are interaction-bound
transitions, not keyframes, and never loop.

**DI6 — light or dark.** `color-scheme: light`. Card and popover are the
same white as the page; the raised surfaces are told apart by their
black border rather than by a lighter fill, which is the point of the
theme.

**DI7 — reduced motion.** Every `animation:` and `transition:` this
register adds lives inside `@media (prefers-reduced-motion: no-preference)`;
the base (unguarded) rules are already the fully
revealed rest state — the headline's clip-path and the rule's
`scaleX(1)` are the SAME value the animation ends on, so a reader with
reduced motion sees the identical final frame, just without the sweep.

**DI9 — theme colour stays in the token layer.** No hex, no named colour,
anywhere in the register — every colour is `var(--token)`. No texture:
`--fx-texture` is never declared, so `gates/check-texture.mjs` measures
nothing for this theme and the DI9 ceiling was never approached, let
alone needing its own per-theme entry in `gates/config.json`.

## What it deliberately does not do

- **No greys in text.** `--muted-foreground` is 20% lightness. Muted here
  means quieter, not fainter.
- **No gradients, no drop shadows, no texture.** Every one of them
  reduces the contrast between two areas, which is the only thing this
  theme has. The one exception, the mirrored button's flat offset
  shadow, is unblurred and the same ink as every border — it reads as a
  second edge, not a glow.
- **No arrival.** The demo refuses every looping and every load-boot
  effect by name ("No animation … Nothing here needs to move"); this
  register declares no `--kp-arrival` at all.
- **No softening for looks.** If a colour is uncomfortable, that is the
  trade this theme makes on purpose. Someone who wants comfortable has
  twenty-four other options.
