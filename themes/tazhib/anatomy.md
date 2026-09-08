# tazhib — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Tazhib, the illumination of a Persian manuscript: a lapis-ultramarine
ground, ivory text, gold ruling, vermilion accents, and a ten-fold girih
star tiled under the glass of the hero and the app surface. The only dark
theme in the set built on a saturated pigment rather than a neutral —
formal has the navy and the bronze but on light paper, blueprint has the
blue but as a technical drawing, and neither is black anywhere. Nothing
here is.

Round six's approved concept demo, "Lapis and Leaf" (2026-09-08), is the
specification this register is built from (S49); this document is the
anatomy's answer, not the demo itself.

## What is load-bearing

1. **The ground is a pigment.** `hsl(228, 60%, 26%)` is lapis, not navy;
   the card and popover are the same pigment lifted (31%, 36%), so DI6's
   rising layers are written in lightness, not in saturation — a more
   saturated lapis would look richer and read as lower.
2. **Gold acts.** `--primary` at `hsl(43, 67%, 50%)` measures 5.83:1 on
   lapis and carries a deep-blue ink; the boundaries are a quieter gold
   (`--border-strong`, `hsl(43, 45%, 52%)`), and the card, the popover,
   the spec sheet and every dropdown carry a four-ring frame — a ruled
   border of concentric insets drawn rather than filled, the page a
   manuscript was ruled inside.
3. **Vermilion is a plate, never text.** `hsl(5, 75%, 55%)` on lapis
   measures 3.24:1 and on card 2.78:1 — enough for a large-text accent
   or a filled chip with a dark ink, not for a word of running prose.
   Where red must be text (`--destructive`) it is lifted to 70%
   lightness (`hsl(5, 90%, 70%)`, 4.99:1 on lapis).
4. **Markazi Text for headings, Vazirmatn for the body.** Both drawn for
   Arabic script with a Latin that holds its own; the pairing is the
   manuscript and its margin notes. Both are already shipped
   (`fonts/families.json`, OFL-1.1, no Reserved Font Name clause) — X3
   needed no work.
5. **The girih tile is confined to what it decorates.** The demo refuses
   this theme's own pre-round-six page-wide texture (3.1.1, TH74) as a
   hazard — "the same conic-gradient recipe at 5%, confined to the
   hero/app surfaces, not the whole page" — so the register turns the
   page-wide layer off (`--fx-texture-opacity: 0`, a later cascade layer
   than `css/_rules.css`'s `kp.base` declaration of it) and paints the
   tile itself only where `[data-kp-surface]` stands.
6. **The burnish, not a decipher or a type.** The headline is whole and
   already gold; a single clip-path wipe opens it left to right once,
   with a brief brightness lift that settles as it lands — a gilder's
   burnishing pass, not a per-glyph or per-word reveal. This is the
   theme's own headline routine, `gild` (S49, X2 — see "What the demo
   showed" below).

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` (the gold-line) at 52%
lightness on ground, card and popover; the plain hairline `--border`
carries no contrast claim of its own (a nav rule, a divider edge —
ornament, per DI1's own split).

**DI2 — the focus ring.** The package's shared two-channel ring
(`--focus-ring-contrast` outline, `--focus-ring` box-shadow), unmodified
by this register — the demo's own two-channel ring (ivory outline, gold
box-shadow) already matches the token pair the base layer composes.

**DI3 — states you can see.** Derived by lightness towards light
(AR12's shortcut; this theme does not opt out).

**DI4 — colour is never the only carrier.** Verdigris offer against
vermilion rejected first, measured 8.6 under deuteranopia; a deep teal
(`hsl(175, 70%, 24%)`) against a deep red at 30% measures 14.2, ivory
ink on both above 5. (`--chart-3`, the register's "jade," is the teal
accent the demo's girih dot and divider dot are drawn in.)

**DI5 — the flash threshold.** Every reveal is a one-shot: the burnish
(900ms, once), the inscription (a `color`/`border-bottom-color`
transition, 600ms, once, staggered per mark), the seal (a
`background`/`color` transition, 220ms, once, staggered per mark), the
rule draw (`kp-rule-in`, 420ms, once). `kp-burnish` carries no opacity
step (a `clip-path` wipe), so it is out of scope in
`gates/check-motion.mjs` rather than opacity-rated; the reason is
recorded there. Nothing loops, nothing blinks. The demo's own DI5 section
found zero `@keyframes`/`transition` across every measured reference and
its own research file, and this register's answer keeps that spirit —
one-shot arrivals only, never a loop.

**DI6 — light or dark.** `color-scheme: dark`; 26% → 31% → 36% (ground →
card → popover), rising.

**DI7 — reduced motion.** Every animation and transition sits inside
`@media (prefers-reduced-motion: no-preference)`; without it every
reveal stands at its resolved rest state (flat gold headline, inscribed
marks, cleared seal, drawn rule).

**DI9 — theme colour stays in the token layer.** One texture — the
girih tile at 5% peak alpha, confined to `[data-kp-surface]`, under
DI9's 6% ceiling (no `perTheme` override needed) — and one static
four-ring frame. Every colour in the register is `var(--token)` or a
relative colour of one (`hsl(from var(--primary) h s l / 0.05)` and
its kin); nothing is a literal hex, not even in a comment.

## The register's answers to the hook vocabulary (S45)

- **surface** — the default (`css/themes.css`), plus the girih tile the
  register paints on `[data-kp-surface='hero']` and
  `[data-kp-surface='app']`.
- **emphasis** — `classified`: a loose `<mark>` (the lede) is the
  inscription — ivory with no rule under it, then gold ink and a gold
  underline drawn in, once; a `<mark>` inside
  `.kp-card[data-kp-reveal='emphasis']` (the dossier) is the seal — a
  solid void plate (`--sidebar-background`) with no ink, cleared by the
  trigger on a stagger.
- **reveal (headline)** — `gild`: the burnish, this theme's own routine
  (see "What the demo showed" below).
- **reveal (rule)** — `draw`: a gold-line hairline (`--border-strong`)
  scales in left to right when the heading enters the viewport, the
  shared `kp-rule-in` keyframe formal, blueprint, deco and academia
  already use, themed in gold.
- **divider** — the wide one carries the four-ring frame, the gold
  hatch and the girih's teal dot at centre; the narrow one (`alt`) is a
  plain, fainter hatch.
- **accent** — the display heading, `--kp-text-display`, no further
  ornament beyond the type itself.
- **arrival** — quiet. The demo shows no boot sequence, and the theme's
  own rule ("no animation; the ruling is static") makes an arrival the
  one thing that would move without being asked.

## What it deliberately does not do

- **No black.** The sidebar at 18% lightness is the darkest value and
  it is still lapis.
- **No gradient gold.** Flat gold reads as leaf; gradient gold reads as
  a slot machine.
- **No Western geometry.** The tile is ten-fold; Deco's chevrons and
  the Swiss grid belong to their own themes.
- **No looping motion.** Every reveal in this register runs once and
  rests; nothing blinks, sweeps or drifts the way terminal's phosphor or
  topo's contour layer do.

## What the demo showed and the package now renders exactly (S49)

Every mechanism the demo names traces onto the register:

- **The four-ring frame** (`.kp-spec`, the ruled dividers, `.kp-card`,
  every popover-family root) — built exactly, using `--kp-ring-on-card` /
  `--kp-ring-on-popover` / `--kp-ring-on-ground`, the same inset stack the
  demo measured, mapped from the demo's literal hex onto the existing
  token contract (see "Token measurement" below).
- **The girih star tile** — built exactly at the demo's own 5% peak
  alpha, confined to the hero and app surfaces as the demo's own hazard
  section asks; the theme's pre-round-six page-wide texture is turned off
  by this register rather than left to fight it.
- **The gold hatch** — built exactly, the same 1px-under-24px pitch, on
  the wide divider, the narrow divider and the hero's side note.
- **The double-stroke ruling** (nav border) — built as the _idea_ the
  demo's own comment names (girih.js's wide-line-under-narrow-line, at UI
  hairline scale rather than the generator's wall-pattern widths, which
  the demo's own hazard section already refuses).
- **The burnish** — built exactly as a new headline routine, `gild`
  (`js/effects.js`), because none of the existing routines
  (`decipher`/`tracking`/`shout`/`slam`/`dissolve`/`type`) is a single
  wipe over the whole clause: `shout`/`slam` animate per word,
  `dissolve` clears a dither _overlay_, `type` reveals per glyph. `gild`
  mirrors `dissolve`'s shape exactly (a class toggle, a keyframe, a
  finish callback) with its own keyframe, `kp-burnish`, and its own
  TIMINGS/OUT_OF_SCOPE entries — the same effort as reusing an existing
  routine, not a bigger one.
- **The inscription** (lede marks) — built exactly: no JS change was
  needed, because `emphasis()` in `js/effects.js` is routine-agnostic
  (the string is documentation for the register's own CSS selector, not
  a JS branch) — the same generic `is-cleared` mechanism every other
  lifted theme's loose marks already use.
- **The seal** (dossier marks) — built exactly, mapped from the demo's
  `.kp-redaction` `<span>` markup onto the package's actual dossier
  markup, which carries its redactions as `<mark>` inside
  `.kp-card[data-kp-reveal='emphasis']` (the hook vocabulary's
  established shape, matched by every other lifted theme). The visual —
  a solid void plate, no ink, cleared on the trigger's stagger — is
  exact; only the element name differs, and it differs for every lifted
  theme's dossier, not only this one.
- **The wipe confirmation** (`<dialog>` in the demo) — not built as a
  literal `<dialog>`: the package's shared concept markup already
  answers "wipe the form" with its own generic `confirm` mechanism on
  `Button` (`data-kp-confirm`), the same door every other lifted theme's
  wipe button uses. Building a second, theme-specific dialog beside it
  would duplicate a hook the package already owns; the confirmation
  question itself (`wipeConfirm`, "Wipe the form?") is the demo's own
  words, verbatim, in `showcase/concept-copy.mjs`.

**Token measurement.** Every literal hex in the demo's palette section
converts, HSL to hex, to exactly what `themes/tazhib/tokens.json`
already declares — `background` → `#1b2a6a` (the demo's lapis,
`#1B2A6A`), `primary` → `#d5a52a` (gold, `#D5A52A`), `accent` →
`#e24536` (vermilion, `#E24536`), `sidebar-background` → `#101c4c`
(void, `#101C4C`), `card` → `#22347c`, `popover` → `#2a3e8d`,
`foreground` → `#f2e9d4` (ivory), `muted-foreground` → `#a9afd1`
(ivory-muted), `border-strong` → `#bc9c4e` (gold-line), `border` →
`#324385` (hairline), `destructive` → `#f7796e` (scarlet), `chart-3` →
`#40bfaa` (the teal/"jade" accent) — twelve pairs checked, twelve exact
matches. No token needed a change for this lift; the contrast gate and
the invariants gate both already passed against the existing values.

**What could not be built exactly, and why:** nothing. Every mechanism
the demo names has a rendering in the register above; the two
adaptations recorded here (the seal's element, the wipe confirmation's
door) are the demo's own visual and behavioural intent carried onto the
package's established markup and hook system, not a value the demo
showed being silently changed.
