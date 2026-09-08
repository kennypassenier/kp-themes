# solstice — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Solstice is one
> of the themes lifted in 5.0.0 (S48). The concept demo Kenny approved on
> 2026-09-08 is "Low Sun".

## The idea

Warm dark. Charcoal with amber and rust, for the reader who finds dark too
clinical and cyberpunk too loud. Both existing dark themes are cool — one
indigo, one magenta-on-violet — and neither is restful.

The reference is firelight rather than screenlight: the low sun of the
name, not a neon sign, not a phosphor. An hour of the day, not a filter —
the demo's own laurels put it in three words: "No neon", "Still legible",
"Unhurried".

## What is load-bearing

1. **The ground is warm charcoal, not black.** `hsl(20, 14%, 10%)` — a
   trace of red in the dark. Take the hue out and it becomes dark's
   neutral cousin, which the set already has.
2. **Amber leads, rust supports.** `--primary` at 28° and `--accent` at
   12°, close enough to be one family and far enough apart to tell which
   is which. This is the only theme whose primary and accent are
   neighbours on the wheel, and the calibration wipe's three bands (the
   headline's own reveal) are built from exactly this triad plus the
   foreground.
3. **A serif for display.** Shared with sepia, and for the same reason:
   warmth reads better with a little contrast in the letterforms.
4. **`--radius: 0.625rem`.** The softest in the set. Sharp corners fight
   the warmth; this theme is the one place where roundness is doing work,
   and every window, plate and swatch in the register carries it —
   nothing here is a bevel, a scanline or a grid.
5. **`--fx-duration: 240ms`.** The slowest of all eleven lifted themes.
   Warmth is unhurried; hover and focus transitions read the token
   directly from `css/components.css`'s own no-preference block, so this
   register never redeclares them.

## The register's answers to the hook vocabulary (S45)

- **Surface.** The default remap in `css/themes.css` (the hero and app
  surfaces share one ground per `tokens.json`'s `surface-hero-*` block);
  the register only adds the demo's own hero padding and the display
  headline's size.
- **Reveal — headline (`calibrate`).** The demo's calibration wipe: three
  flat bands (primary, accent, foreground) sit over the solid headline
  text with `mix-blend-mode: difference` and clear away once. The demo
  drives this with three independently-staggered `scaleX` transforms on
  three child `<span>`s; the shared markup gives a headline no room for
  child elements (`examples.mjs`'s `conceptBody` renders `c.headline` as
  plain text), so the register approximates the same triad and the same
  total time (740ms) as **one** `clip-path` sweep across a single
  three-band gradient — same appearance, a different mechanism (S49
  finding, below). `js/effects.js` gained a `calibrate` branch for this
  (mirroring the existing `dissolve` branch); the keyframe is
  `kp-cal-slide`, `TIMINGS['kp-cal-slide']` and
  `gates/check-motion.mjs`'s `OUT_OF_SCOPE['kp-cal-slide']` both carry it.
- **Reveal — rule (`draw`).** A plain `scaleX(0→1)` draw, 480ms, 260ms
  delay, when the heading enters the viewport — the demo's own mechanism,
  unornamented. `js/effects.js`'s `rule()` function is routine-agnostic
  (it only toggles `is-in`), so no JS change was needed; the keyframe is
  `kp-cal-rule`.
- **Reveal — emphasis (`redact`).** The dossier: three `<mark>`s inside
  one paragraph, each covered by a `--border-strong` bar until the
  trigger opens the file, then lifted one after another, right to left —
  the demo's own `clip-path` direction (`inset(0 100% 0 0)` at rest,
  cleared). `js/effects.js`'s `emphasis()`/`wireTrigger()` are also
  routine-agnostic, so no JS change was needed; the keyframe is
  `kp-cal-redact`.
- **Divider.** The demo's horizon seam — a hairline with one accent peak,
  approximated in CSS (`conic-gradient` chevron over a 1px line) because
  `[data-kp-divider]` is an empty div in the shared markup, with no room
  for the demo's inline SVG paths (S49 finding, below). The alt divider
  swaps the peak to the opposite side and to primary.
- **Accent.** Quiet — no accent beyond the heading's own type (the demo
  does not decorate `h1`/`h2` beyond size, weight and colour).
- **Arrival.** Quiet — the demo's own script wires the nav dropdown, the
  dossier and the wipe dialog only; nothing counts up on first paint.

Buttons, fields, windows (dialog/popover/menu/toast/tooltip/confirm/
datepicker panel/combobox list/palette/theme-menu), the footer, badges,
health, skeleton, progress, spinner, empty, error, the text-shape roots
(id/url/numeric/timestamp/masked/copyable/truncate/cell-break/
cell-truncate), table/datatable/diff/timeline/tree/reorder,
tab/breadcrumb/pagination/wizard, and the pickers each carry one rule —
soft radius, warm shadow, no bevel. One answer per component root (56 of
64, the eight helpers excused).

## What the demo showed and the package now renders exactly (S49, 2026-09-08)

Kenny's rule of 2026-09-08 is that an approved demo is implemented
exactly, and that a test or a gate which disagrees produces a finding for
him rather than a quiet change. What follows is that list for solstice;
nothing here was silently adapted.

- **The calibration wipe's mechanism**, above: one `clip-path` sweep
  standing in for the demo's three independently-transformed `<span>`s.
  Same triad, same total duration, a different technique — the same kind
  of substitution `docs/audits/DEMO_FIDELITY_TERMINAL_2026-09-08.md`
  records for the cursor-in-the-box (B4: "same visual result, different
  technique").
- **The headline's emphasised word** (small-caps, amber, tighter
  tracking, inside an `<em>` in the demo) is not reachable: the copy
  slot `c.headline` is a plain string in `showcase/concept-copy.mjs`, and
  `conceptBody()` renders it as plain text with no markup slot. The
  register still carries the `h1 em` rule, written against the day the
  shared generator can pass inline markup; it does not fire today.
- **The divider's inline SVG** (a horizon line plus a hand-drawn zigzag
  peak) is approximated with a CSS conic-gradient chevron, for the
  reason above.
- **The nav.** The demo's own nav is two links ("Overview", a "Field
  guide" dropdown of three) plus a language link; the shared `NavBar` is
  a fixed six-slot shape (a "Themes" dropdown, a "Components" dropdown,
  two plain links, a language dropdown, a CTA). The `solstice` entry in
  `showcase/concept-copy.mjs` reuses the demo's own "Field guide" items
  for the `navThemes*` slots and writes a "Components" group in the
  demo's voice for the slots the demo has no equivalent for.
- **The spec sheet.** The demo's own six swatches are Background,
  Primary/amber, Accent/rust, Card, Secondary, Border-strong; the shared
  page (`examples.mjs`) binds five fixed tokens instead —
  `--surface-hero-bg`, `--background`, `--destructive`, `--accent`,
  `--chart-4` — the same five every theme's spec sheet shows. The copy
  entry's `spec1`–`spec8` label what is actually bound (`ground`, `page`,
  `alert`, `rust`, `ember`, `display`, `body`, `mono`), not the demo's own
  six.
- **The dossier's three redactions.** The demo has three separate
  redaction paragraphs, each independently covered; the shared shape is
  one paragraph with three marked phrases. The copy entry
  recombines the demo's own three facts (the 28°/12° hue-family pairing,
  the 0.625rem radius, the 240ms motion floor) into one flowing sentence,
  the marked phrases carrying the numbers.
- **The wipe dialog's body text** ("This clears the name, email, desk,
  notes and consent you've entered below. There's no undo.") is not
  reproduced anywhere: the confirmation `js/components.js` opens is a
  package-wide mechanism whose body text comes from `js/strings.js`
  (KT5), not a per-theme copy slot.
- **Invented, not from the demo:** `platform4` ("Linux" — the demo names
  only three of the four platforms the shared row needs);
  `handlePlaceholder`/`handleHelp` and `mailPlaceholder`/`mailHelp` (the
  demo's Name and Email fields carry neither); `dossierPara2` (the demo's
  closest text is the dossier's _hidden, post-reveal_ detail line, not a
  visible pre-reveal paragraph, so this is written fresh in the demo's
  voice, describing the register's own redaction-lift direction).
- **The fonts, the tokens and the contrast pairs are unchanged**:
  `themes/solstice/tokens.json`'s HSL values compute to the demo's own
  hex values exactly (verified with a throwaway Node script, all 20
  colour tokens the demo declares), so X0 needed no token change.
  Instrument Sans and Instrument Serif were already declared for
  solstice in `fonts/families.json`.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` and `--input` are
`hsl(30, 20%, 55%)`, clearing 5.50:1 on the background and 4.89:1 on the
card (the demo's own measured figures).

**DI2 — the focus ring.** Two channels: a 2px solid `var(--foreground)`
outline with a 2px gap, and a 4px `var(--ring)` box-shadow — `--ring`
equals `--primary`. Both clear 3:1 on the hero and the app ground (they
share one surface).

**DI3 — states you can see.** Follows the standard derivation. Lightness
alone reaches the floor: amber at 58% has room above it, unlike neon.

**DI4 — colour is never the only carrier.** The worst case in the whole
set: the first draft had offer and rejection 2.9 apart under
deuteranopia, because a warm green and a warm red on a warm ground
collapse into the same muddy tone. Solved to 23.6 by pushing offer to a
deeper true green and rejection to a deeper red. Everything else leans on
the label.

**DI5 — the flash threshold.** Three one-shot reveals, all monotonic in
one direction, all rated in `reports/di5.md`: the calibration wipe
(`kp-cal-slide`, a `clip-path` sweep — out of scope, zero opposing
changes, per the demo's own reasoning that "a single monotonic wipe …
cannot cross a threshold defined by alternation"), the rule draw
(`kp-cal-rule`, a `transform`, no luminance change), and the redaction
lift (`kp-cal-redact`, a `clip-path` under 341×256px). Hover and focus
transitions read `--fx-duration`/`--fx-ease` from the base layer and are
not gated again here. Nothing loops.

**DI6 — light or dark, and is the ordering deliberate?** Dark, and
correct: background 10% → card 14% → popover 17%, rising in the right
order (unlike terminal's popover, which the terminal audit found sunk
below its card).

**DI7 — reduced motion.** `--fx-duration: 240ms`, the slowest of all
eleven. Every keyframe of this register's own (`kp-cal-slide`,
`kp-cal-rule`, `kp-cal-redact`) lives inside the no-preference guard; at
rest the headline shows solid, the rule stands drawn, and the redactions
stand covered.

**DI9 — theme colour stays in the token layer.** No texture, no
`--fx-texture` declaration beyond the shared default (the demo carries
none). Every colour in the register is `var(--token)` or a relative
colour of one — the shadows use a translucent `var(--background)` rather
than the demo's literal near-black rgba, and the button's mirror
highlight uses relative colours from `var(--foreground)` /
`hsl(from var(--primary-foreground) …)` for the same reason.

## What this theme may not do

- **No orange-on-black terminal look.** The amber is a light source, not
  a phosphor. Terminal owns the glowing-monospace idea and this theme
  stays out of it — hence the serif display face and the soft corners.
- **No cool accent for contrast.** A single teal would make the palette
  "designed"; the discipline is that every hue stays between 0° and 45°,
  except the three chart series that cannot.
- **No gradients as surface colour.** Firelight suggests them and they
  would cost contrast on every surface that carries text — the only
  gradients in the register are the calibration wipe's band background
  and the divider's chevron, both decorative overlays, never a surface.
- **No bevel, no scanline, no grid.** DI9's texture answer is "no
  texture, no register" — nothing here repeats.
