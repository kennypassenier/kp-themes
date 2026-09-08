# nishiki — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Nishiki is
> lifted in 5.0.0 (S48, LIFT_PLAN row 20) from its approved concept demo,
> **"The Woodblock Pull" (v2, 2026-09-08)** —
> `<scratchpad>/nishiki-demo-v2.html`. It replaces the round-one demo
> "Beni & Bero" on Kenny's own note that the first pass "did not… read as
> a woodblock print at all"; v2 keeps the round-one palette and adds the
> physical vocabulary of a hand-pulled print. Note for the record: the
> theme is renamed **woodblock** at this lift, but the rename touches
> every generated file and document across the package and is done
> centrally, not by this lift — this theme is built under the id
> `nishiki` throughout.

## The idea

Ukiyo-e, the polychrome woodblock print: unbleached washi for the
ground, Prussian blue — _bero-ai_, the imported pigment Hokusai's wave
is printed in — for the water, safflower red for the seal, and the
black key-block line that gives every shape its edge. A non-Western
print tradition, the first in the set, and a flat, outlined, graphic
one: nothing soft, nothing organic. v2 adds the vocabulary of the
**pull itself** — the carved registration marks a printer squints at to
line up six blocks, the uneven density a hand-rubbed baren leaves on
every plate, the hand-cut edge of a knife rather than a ruler — so the
page reads as a specific physical object, not only a palette.

## What is load-bearing

1. **The key-block line.** `--border-strong`/`--input`/`--foreground`
   are the ink itself, `hsl(36, 10%, 10%)`. In a woodblock print the
   black block is printed first and every colour sits inside its lines;
   here every control shares the same edge, and DI1 is free instead of
   hard.
2. **Prussian blue acts, beni marks.** `--primary` at `hsl(215, 51%, 25%)`
   measures 9.99:1 on washi; `--accent` and the signal are beni red
   `hsl(1, 58%, 46%)` at 5.09:1, used as a plate with washi ink and as
   the hanko seal.
3. **Washi, not white.** The ground is `hsl(42, 52%, 92%)`, the card a
   step lighter, the popover lighter still (DI6 read the other way: the
   paper gets whiter as it rises).
4. **Shippori Mincho for headings, Zen Kaku Gothic New for the body.**
   Both carry Latin well and both are drawn for Japanese; the Mincho's
   contrast is the brush, the Gothic is the print shop. Both ship as the
   package's own subset (`fonts/shipporimincho`, `fonts/zenkakugothicnew`),
   regular weight only — see "What the demo showed" below.
5. **kentō (見当), v2's own addition.** The registration marks a real
   block carries — a kagi corner notch and a hikitsuke edge mark — appear
   as page furniture on the hero, the spec sheet, the dossier and the
   nav dropdown, and the headline's own reveal is named for the same
   mechanism: two ghost plates that converge and settle a pixel or two
   out of true, because a real pull is never perfectly registered.
6. **The baren burnish, v2's second addition.** A baren is rubbed by
   hand, not pressed by a machine, so every plate it pulls — every
   filled button, the hanko-adjacent stamp — carries a soft, uneven
   density: two low-alpha ink radials over the flat fill, always
   darkening, never lightening, so no baren-mottled pair can measure
   under its own flat figure.

## The register's answers to the hook vocabulary (S45)

- **Surface.** The hero stands on washi (`css/themes.css`'s own
  `surface-hero-*` tokens, all pointing at the app ground — a one-ground
  theme). The register adds the seigaiha wave texture and the kentō
  corner marks on top, hero-scoped.
- **Emphasis (`emphasis: tint`).** A `<mark>` is an ink tint drawn in
  from the left, at rest already drawn (AR34); armed, it stands undrawn
  until the loose-mark stagger clears it. The dossier's redactions are a
  separate, more literal mechanism — sumi-nuri ink bars that wipe away
  from each phrase, right edge first, staggered 170ms apart on the
  file's trigger.
- **Reveal (`rule: carve`, headline unrouted).** The rule under a
  heading is the hand-cut key line — an irregular clip-path edge, not a
  ruler's straight one — drawn once when the heading scrolls into view.
  The headline's own reveal, kentō, is **not** one of js/effects.js's
  named routines: it is a static CSS convergence of two ghost plates
  (`content: attr(data-kp-text)`, `mix-blend-mode: multiply`), gated only
  by `prefers-reduced-motion`, because the module already sets
  `data-kp-text` unconditionally for any `[data-kp-reveal='headline']`
  regardless of routine — declaring none leaves the theme's own CSS to
  drive it, with no glyph-noise decipher fallback in the way.
- **Divider.** The deckle edge — two offset zig-zag tooth layers (torn
  handmade washi) with a fibre wisp confined to the strip — and the toji
  stitch in beni, the stab-binding of a Japanese book, as the second
  tear.
- **Accent.** Quiet, by design: the print's flat graphic language is the
  whole accent, and h1/h2 carry no shadow or gradient of their own — see
  "What it deliberately does not do" below.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** Ink on washi is 15.13:1 and the same ink is
the boundary on every surface.

**DI2 — the focus ring.** Prussian blue over washi, the ink as the
second channel — identical to the base layer's own default, so the
register does not restate it.

**DI3 — states you can see.** Derived by lightness. Prussian at 25%
steps lighter on hover and active; washi buttons step darker.

**DI4 — colour is never the only carrier.** The one place the print
palette fought the gate: moss green against beni is the classic
deuteranopia pair, and the first three drafts measured 6.3, 7.5 and 6.4
apart against a floor of 12 — the depth of the red did not help, because
a plate carrying washi ink cannot get lighter. Rejected is the one plate
with the ink on it: a lighter beni `hsl(3, 75%, 56%)` under black,
against a deep teal offer under washi. Lightness carries the difference
before hue does, which is the point of DI4.

**DI5 — the flash threshold.** Every gesture in this register is a
translate, a clip-path or an opacity transition; nothing loops, nothing
opposes luminance faster than 1/s. The kentō ghosts, the carved rule and
the two redaction wipes are the whole inventory — see the demo's own §5
for every figure.

**DI6 — light or dark.** `color-scheme: light`; ground 92%, card 95%,
popover 97%.

**DI7 — reduced motion.** Every transition and animation of this
register — other than the kentō ghosts, which carry their own explicit
reduced-motion pair by design (see below) — lives inside
`@media (prefers-reduced-motion: no-preference)`.

**DI9 — theme colour stays in the token layer.** The page-wide texture
is washi fibre at 4.5% (`css/_rules.css`, TH69, unchanged by this lift).
The register adds two more, both element-scoped rather than page-wide:
the hero's seigaiha wave at 5%, and the spec sheet's own wood-grain at
up to 10.2% — see "What the demo showed" below for why the second one is
not measured by `check-texture.mjs` and why that is the correct outcome.

## What it deliberately does not do

- **No gradient, no shadow.** A print has none; the key line does the
  work a shadow does elsewhere, and the "mirror" button carries a solid
  offset plate rather than a blurred one.
- **No sage or terracotta.** The earth palette belongs to topo; this
  theme is pigment on paper, not landscape.
- **No pastel reading.** Beni and Prussian are strong; a softened
  version would be pastel with a different font.
- **No heading shadow or gradient (the "accent" hook, quiet).** The
  kentō reveal and the carved rule already carry the headline's and the
  h2's own drama; stacking a shadow on top would be a second flourish
  competing with the first, which the demo does not do.

## What the demo showed and the package now renders exactly (S49)

Every mechanism, token and value the approved demo declares is built
above, with three exceptions, each a genuine constraint of the shared
concept-page markup or the token contract rather than a judgement call
against the demo's appearance:

- **The hanko mark could not be attached to the headline.** The demo
  places `<span class="kp-hanko">` as literal inline content at the end
  of the h1's text. The package's h1 offers exactly two pseudo-element
  slots, and both are already committed to the kentō ghost plates — the
  theme's own defining reveal, and the specific thing Kenny's correction
  on v1 was about. CSS does not allow a third generated-content layer on
  one element, so the hanko is not reproduced as a mark after the
  headline. It follows that the pre-lift hanko this package already
  shipped for nishiki (`css/_rules.css`, TH69, a settling accent square
  on every `h1`) is superseded wherever the register's own
  `[data-kp-surface] h1::after` rule reaches (later cascade layer, same
  pseudo-element) — not deleted, but with no visible effect under a
  loaded register. The carved short accent bar the demo draws as a
  separate `.kp-carved-rule` div between the headline and the lede has
  the same fate: the shared markup has no sibling element there to carry
  it, so it is not reproduced either.
- **The spec sheet's own wood-grain is not measured by `check-texture.mjs`.**
  The demo explains this itself: the grain is "the visible material of a
  specific element … because it is an object, not a page texture," and
  is deliberately stronger than DI9's page ceiling (up to 10.2% against
  0.06) on that basis. `--fx-texture`/`--fx-texture-opacity` is a single
  page-wide slot (one declaration per theme, painted by `_rules.css`'s
  `body::after`); the register does not put the spec sheet's pattern
  through it, matching how phantom's own denser hero halftone is built —
  a plain background on a scoped pseudo-element, not the shared texture
  channel. The gate therefore never measures this pattern one way or the
  other; this is reported as the honest state, not corrected to force a
  measurement the mechanism was never built to take.
- **The demo's separate hero fibre layer is not duplicated.** The demo's
  standalone HTML draws its own full washi-fibre turbulence inside the
  hero (`.kp-washi-fibre`, 4.5%) because it has no knowledge of the
  package's own page-wide fibre texture. That page-wide texture already
  exists for nishiki (TH69, also 4.5%, identical recipe) and already
  reaches the hero, since it is a fixed full-viewport layer. Painting a
  second, hero-local fibre layer on top would stack to roughly 9%
  locally for no reason the demo actually intends; only the demo's _new_
  seigaiha wave (5%, genuinely new) is added as a hero-scoped layer.

One measured fact, carried over from the round-one anatomy and
unchanged by v2: both shipped faces (Shippori Mincho, Zen Kaku Gothic
New) ship **regular weight only** — with the bold faces nishiki weighed
2.37 MB against the 1.5 MB font budget (`fonts/families.json`, R6-Q6,
still open in the queue). The demo's own Google-Fonts `<link>` loads
weights 300–900; the package's shipped subset synthesises bold from the
regular face until Kenny raises the budget or drops a family. This is
not new to this lift, and is restated here because R6-Q6 is exactly the
gap between what the demo's `<link>` shows and what the package ships.
