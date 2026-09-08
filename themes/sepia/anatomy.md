# sepia — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Sepia is lifted
> in 5.0.0 (S48, LIFT_PLAN row 9). The research behind it is §9 of
> [RESEARCH_2026-09.md](../../docs/RESEARCH_2026-09.md); the concept demo
> Kenny approved on 2026-09-08 is "Aged Well".

## The idea

Warm parchment, brown ink, and not one cool accent anywhere. Formal is
tidy but it is still blue; this is the only theme in the set that is
genuinely restful, and it is meant for long reading rather than for
dashboards.

The reference is a printed page that has aged well — not a filter over a
photograph, but paper, ink, and the warmth both acquire.

## What is load-bearing

1. **No cool hues in the body.** Everything in the reading surface sits
   between 24° and 45°. The moment a blue-grey appears, the page stops
   feeling like paper and starts feeling like a document viewer.
2. **Ink, not black.** `--foreground` is `hsl(28, 45%, 16%)`. True black
   on warm paper reads as a hole punched in the page.
3. **A serif for display.** The only theme besides terminal that changes
   a typeface, and it changes only the display face — body text stays in
   the house sans, because a serif body at screen sizes costs more than
   it gives. The register keeps this distinction exactly: h1 is the serif
   roman, h2 and every card/dialog title is the serif italic — the face
   is the theme's whole accent, not a shadow or an offset.
4. **The surfaces rise by warmth, not by grey.** Page 94%, card 97%,
   popover 98% lightness, each a little more saturated than the last. A
   raised surface here looks like a fresher sheet, not a lighter one.
5. **Unhurried on purpose.** `--fx-duration` moved from 240ms to 220ms at
   this lift (X0 below) to match the demo's own `--dur` exactly — among
   the slower durations in the set, not the fastest. Every reveal is a
   single settle: nothing loops, nothing stutters, nothing asks to be
   watched twice.

## X0 — tokens measured against the demo

The demo's `:root` block names fourteen colours by their role (paper,
paper-2, paper-3, ink, ink-soft, sienna, sienna-ink, rule-color, hairline,
tint, tint-ink, red, red-ink, selected). Every one was converted from its
literal hex value to HSL and diffed against `themes/sepia/tokens.json`:
all fourteen already equalled a token this theme declared before the
lift — paper is `--background`, ink is `--foreground`, sienna is
`--primary` (and `--primary-foreground` for its ink), rule-color is both
`--border-strong` and `--input`, hairline is `--border`, tint is
`--accent` (and `--accent-foreground`), red is `--destructive` (and
`--destructive-foreground`), and selected is `--selected`. **No colour
token changed.**

One value did not match: the demo's `--dur: 220ms` against the theme's
`--fx-duration: 240ms`. The demo wins (X0's rule) — `--fx-duration` is
now `220ms`. `node gates/check-contrast.mjs` and `node gates/check-invariants.mjs`
both still pass after the change (verified 2026-09-08); it did not move
`SHORTEST_THEME_DURATION_MS` in `gates/check-motion.mjs`, because retro
and ticker already declare `0ms`.

## The register (5.0.0)

`css/sepia-register.css` is the theme's answer to the hook vocabulary
(S45), every mechanism measured in the demo's own comment block and in
the research:

- **Surface.** The hero is the reading page itself: the side note in the
  margin, the laurels as three warm pill badges, the drop cap on the
  lede's first letter with Miranda's ink wash confined to its own corner,
  the colophon as a quiet card naming the palette once.
- **Emphasis.** A `<mark>` is a wash — legible from the first paint
  (background tint, ink text), the script's own contribution is a small
  deepening of the ink to the tint's own foreground once it has
  "settled" (`wash` — routine-agnostic in js/effects.js, so the name
  documents the mechanism without adding code). A dossier's redactions
  are solid ink bars over the words, covered until the file opens, then
  lifting left-anchored in the order the demo's own CSS scales them.
- **Reveal.** The headline is `ink` — new at this lift (X2 below): a
  faint, blurred ghost of the ink colour settles to the full colour in
  one shot, the whole line moving together, no per-word stagger. The
  rule under a heading (`draw`) grows from nothing to its full width when
  it scrolls into view.
- **Divider.** A double warm-brown rule — Public Domain Review's device,
  kept inside this theme's own 24°–45° family rather than PDR's literal
  gold. The `alt` variant carries a small diamond at its centre, the
  theme's second-tear flourish.
- **Accent.** No shadow, no offset: the serif face itself, roman for h1
  and italic for h2, is the whole accent (anatomy point 3).
- **Arrival.** Quiet. The headline's own ink-in is this theme's answer to
  a page arriving; it ships no full-page overlay at all (`themes/hooks.json`
  answers the hook `quiet` with this reason).

Every hover on a footer link is the demo's hand-drawn underline,
approximated as a background-size transition (X1 finding below); the
navbar's dropdown (KT14) is a quiet card popover, sienna ink on hover;
every button is a plain plate with no bevel, the theme's own 0.375rem
radius; the confirmation dialog is a real `<dialog>` (Kenny, 2026-09-08),
its backdrop fading once through the demo's own `@keyframes confirm-in`.
One answer per component root (56 of 64, the eight helpers excused).

## X1 — findings: what the demo showed and the package now renders exactly (S49)

Kenny's rule of 2026-09-08 is that an approved demo is implemented
exactly, and that a test or a gate which disagrees produces a finding for
him rather than a quiet change. What follows is that list for sepia; the
implementation matches the demo everywhere else.

- **A full paper-grain texture is refused, not merely capped.** The
  demo's own comment names this explicitly and disagrees with
  `docs/LIFT_PLAN.md` row 9's one-line mechanism shorthand ("multiply
  paper layer"): the demo's hazards section says "No aged-paper texture.
  The obvious flourish, and the wrong one: a mottled background reduces
  text contrast for exactly the reader this theme is for." That sentence
  is more specific than the plan's shorthand and governs — reported
  rather than silently picked, per the demo's own instruction to report
  it. `css/sepia-register.css` declares neither `--fx-texture` nor
  `--fx-texture-opacity`; `node gates/check-texture.mjs` measures it at
  0, under DI9's 0.06 ceiling with room to spare, and no per-theme
  ceiling override was needed.
- **The hand-drawn SVG curves are not reproducible without markup, and
  are approximated.** The demo draws its heading rule and its every
  inline-link underline with an injected `<svg><path>` and
  `stroke-dasharray`/`stroke-dashoffset` — a mechanism that needs a
  `<svg>` element the concept page's markup does not have and, being the
  same structure for every theme (S46), may not gain one for sepia
  alone. The rule is rebuilt as a flat line grown by `transform: scaleX()`
  on the existing `[data-kp-reveal='rule']::after` pseudo-element (the
  same technique retro's groove and phantom's rail already use for their
  own rule reveals); the footer's link underlines are rebuilt as a
  `background-size` transition. Both keep the demo's motion — nothing
  drawn until it is meant to be, one growth, once — and lose only the
  literal hand-drawn wobble of the curve itself.
- **The double-rule divider has no child elements to draw with.** The
  demo's divider is a `<div>` holding two `<i>` lines; the shared concept
  page emits one bare `[data-kp-divider]` element for every theme (S46,
  `showcase/examples.mjs`). The two lines are painted as layered
  backgrounds on that one element instead (retro's own divider does the
  same for its shell groove); the `alt` variant's diamond is a
  `content: '◆'` pseudo-element, a decorative glyph rather than a word
  (KT5 — precedented by phantom's `▾` and the base layer's own `⌄`).
- **The `ink` headline routine is new.** No existing routine in
  `js/effects.js` (`decipher`, `tracking`, `shout`, `slam`, `dissolve`,
  `type`) is a whole-line settle with no per-word stagger; the demo
  genuinely does something else, so `ink` was added (X2, below) rather
  than forcing the headline into `dissolve`'s dither or `shout`'s word
  stagger, either of which would have contradicted the demo's own
  "unhurried on purpose, no per-word stagger" reasoning.
- **The wipe control is a real `<dialog>`, per Kenny's correction of
  2026-09-08**, not the demo's inline-relabelling button some earlier
  concept demos used before that correction; this theme's demo already
  built the `<dialog>` the correction asks for, so nothing needed
  changing here — recorded because the correction is the reason the
  mechanism looks the way it does, not because sepia deviated from it.

Nothing else in the demo needed a finding: every colour, every layout
proportion, the drop cap, the wash, the redaction direction, the stamp's
rotation and the contrast table are built as measured.

## X2 — the effects module

`ink` is a new headline routine (`js/effects.js`): a transient
`is-settling` class (mirroring `dissolving`/`typing`) is added, then
removed one animation frame later — the same one-frame delay the demo's
own `requestAnimationFrame` leaves so the browser paints the ghost values
before the transition carries them back to the plain, settled ones over
1050ms. It is a CSS **transition**, not a `@keyframes` animation — the
demo itself uses a transition for this — so it carries no `TIMINGS` row
(`gates/check-motion.mjs` reads `@keyframes` only) and reports no rate to
`reports/di5.md`; the DI5 arithmetic for it is done by hand below. `wash`
(emphasis) and `draw` (rule) needed no code at all: both reveals are
routine-agnostic in `js/effects.js`, toggling only `is-cleared` /
`is-in`, so their names document the mechanism for a reader without
adding a branch.

The one `@keyframes` this register does carry — `kp-confirm-in`, the
dialog backdrop's fade — has its `TIMINGS` row and was included in
`npm run report:di5` (`reports/di5.md`, 35 effects, sepia's own entry
verified against the table).

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** `--border-strong` and `--input` are a mid
warm brown at 52% lightness, which clears the floor on all three
surfaces. `--selected` had to move at an earlier round: the first draft
sat at 2.61 against the page, and the gate refused it. It is 53%
lightness now, measured at 3.03 on the worst of the three — the same
figure the demo's own contrast table records for `--selected`.

**DI2 — the focus ring.** Warm ink over warm paper, 12.44:1 apart (the
demo's own measured figure for ink on paper). Both channels stay inside
the theme's palette, so focus never introduces the cool colour the theme
is built to avoid; the register composes the ring in front of the
button's own border, never instead of it.

**DI3 — states you can see.** The pressed state reaches the floor on
lightness alone; nothing here is near the edge of the colour space. The
register adds a quiet inset shadow on `:active` and a border-colour step
on `:hover`, both derived from tokens.

**DI4 — colour is never the only carrier.** This theme has the hardest
time of any: warm tints on warm paper converge under a colour deficiency
even more than pale tints elsewhere. The offer and rejection badges are
the pair the gate insists on, and they needed solving rather than
choosing — offer moved to a warmer green and rejection to a deeper rose,
which puts them 12.6 apart under deuteranopia, just over the floor of 12.
Every other pair leans on the label, as DI4 intends.

**DI5 — the flash threshold.** Every reveal on the concept page is
one-shot: the headline settles once (~1050ms, a single opposing change,
0.95/s); the two lede marks deepen once each, staggered 420ms apart
after a 900ms delay; the rule draws once (~760ms); the three dossier
redactions lift once each, staggered 150ms apart (~600ms); the confirm
dialog's backdrop fades once (160ms, 1.00/s, rated in `reports/di5.md`).
Nothing loops, nothing oscillates — DI5's rate is zero opposing changes
a second everywhere sustained, well under the three-per-second floor.

**DI6 — light or dark.** `color-scheme: light`, surfaces rising: page
94%, card 97%, popover 98%.

**DI7 — reduced motion.** `--fx-duration: 220ms` (moved from 240ms at
this lift, X0). Every transition and the one keyframe animation of the
register live inside `@media (prefers-reduced-motion: no-preference)`;
without it, the headline stands in its full colour, the lede marks are
already settled, the rule stands drawn, the redactions are already
lifted or covered at rest (never mid-motion), and the dialog opens with
no fade.

**DI9 — theme colour stays in the token layer.** The register names no
colour: every plate, border, shadow and the ink wash are `var(--token)`
or a relative colour of one (`hsl(from var(--primary) h s l / alpha)`).
No texture — refused wholesale rather than dialled to a ceiling (X1).

## What this theme may not do

- **No cool accent.** Not for links, not for focus, not for charts one to
  five. Two of the charts are green and blue-ish by necessity, and both
  are pulled towards the warm end far enough to belong.
- **No aged-paper texture, no page-wide grain.** The obvious flourish,
  and the wrong one: a mottled background reduces text contrast for
  exactly the reader this theme is for (X1).
- **No sepia photograph feel.** The warmth is in the ink and the paper,
  not in a wash over the top; the one multiply wash the register does
  carry sits beside text — the drop cap's corner, the dossier stamp —
  never across it.
- **No looping or oscillating motion.** Every reveal on this theme
  resolves once and stays resolved; nothing here asks to be watched
  twice (DI5).
