# dark — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md), written from what
> `css/dark-register.css` and `themes/dark/tokens.json` do; where this text
> and those two files disagree, the files are the truth (scope-98).
>
> Dark was lifted in 5.0.0 as "Small Hours" (S48, LIFT_PLAN row 15): a
> slate ground, a luminous violet and a starfield. None of that is left.
> Kenny took the starfield out on 2026-09-11, and the same day decided that
> the spectral instrument — the concept world he had called the best of six
> — becomes dark and replaces it outright (scope-16). Its measurement frame
> also replaced blueprint's (scope-18). This document describes that
> instrument.

## The idea

A spectral instrument. A near-black ground with a faint grid ruled on it,
near-white ink, and one mechanism the whole theme is about: an oxide film.
Anodising does not add pigment; it grows a film whose thickness decides
which wavelength survives, so the colour shifts with the angle you look
from. Here that film is a conic gradient through the four chart colours —
cyan, violet, magenta and lime — whose start angle turns with the pointer,
and it runs along every edge that matters: a panel's border, a button's
bottom edge, a field's underline, a heading's rule, the divider's centre
line.

Everything else is quiet so the film can be seen. The controls are machined
parts: corners cut at forty-five degrees rather than rounded, brackets that
close on a button's label under the pointer, a label that draws itself in a
little. The headline arrives the way an instrument brings a line into
register — each word split into two of the film's wavelengths, out of
focus, the halves converging as the blur clears.

## What is load-bearing

1. **Near-black, near-white, and one film.** The ground is
   `hsl(220, 16%, 5%)`, the ink `hsl(205, 20%, 94%)` (17.11:1), and the
   primary is near-white too (`hsl(200, 22%, 93%)`): an action is a light
   plate on the dark, not a hue. Colour lives in the oxide film and in
   meaning (status, danger), nowhere else.
2. **The film follows the hand.** `--kp-iris` is a
   `conic-gradient(from calc(var(--kp-px) * 1turn), …)` of `--chart-1` to
   `--chart-4`; the register sets `--kp-pointer: track`, and `js/effects.js`
   writes the pointer's position into `--kp-px` and `--kp-py`. The
   stylesheet declares both at 0.5, so the film is valid before anything
   moves, without the module, and under reduced motion, where the module
   does not track.
3. **Cut, never rounded.** The token radius is 0; controls (buttons,
   fields, badges) lose two opposite corners to a 0.55rem chamfer
   (`--fx-notch`), panels (cards, dialogs, alerts) to a 1rem one, both as
   a `clip-path` because the corner is a straight edge and a radius is an
   arc.
4. **Motion is notation, not colour.** A hover or a press changes the
   brackets, the label's scale and the film's edge; the ground of a button
   barely moves. What moves without being touched is only what a hand
   moves: the film's angle and a faint pool of light under the pointer.

## The register

`css/dark-register.css` is the theme's answer to the hook vocabulary (S45):

- **The ground.** The page's own background carries an instrument grid —
  hairlines of the ink at 4.5 % every 5.5rem (`--kp-grid`), both ways —
  and a faint pool of `--chart-1` light (13 %) centred where the pointer
  is. There is no texture layer and no starfield.
- **Headline (`resolve`).** Each word, wrapped by `js/effects.js`, runs
  `kp-resolve` over 640ms on `--kp-settle`, 28ms apart
  (`--kp-word-stagger`): from invisible, blurred 3px and 0.22em low, with a
  text-shadow split into `--chart-3` on one side and `--chart-1` on the
  other, to sharp, in place and single. The split is a text-shadow rather
  than a second copy, so a screen reader reads each word once.
- **Emphasis (`ignite`).** A `<mark>` has no plate: its ink is the primary
  with a 2px underline in the boundary colour. Where the browser supports
  scroll-driven animation it starts muted and resolves to that as the
  reader scrolls it into range (`animation-timeline: view()`, entry 30 % to
  80 %), bound to the scroll position rather than a clock. In the dossier a
  more specific rule takes over: each phrase is covered by a bar in
  `--border-strong` on the mark's `::after` that lifts off right to left on
  the trigger (380ms, 90ms apart, `--kp-redact-stagger`); the words turn
  visible in the same instant.
- **Rule (`sweep`).** A heading marked `[data-kp-reveal='rule']` carries a
  2px band of the film across its whole width, which draws itself from the
  leading edge (`kp-draw`, a scale) as the heading scrolls in (entry 10 % to
  85 %). At rest it stands drawn.
- **Divider.** The edge of a ruler: a hairline in `--border` that fades at
  both ends, tick marks in `--border-strong` every 3rem
  (`--kp-divider-tick`), and a line of the film across its middle at 75 %.
  The alt divider is the same ruler mirrored.
- **Buttons.** A flat card-grounded panel with a boundary edge and the
  control chamfer. Under the pointer or the keyboard, `[` and `]` in the
  mono face slide in and close on the label, the label scales to 94 %, and
  `.kp-button__edge` draws the film along the bottom edge. A press arrives
  at once and eases back: the brackets close another step, the label goes
  to 90 %, the edge doubles to 4px. A button's readout, above the control,
  takes the film through its letters; a strip is kept clear of the chamfer
  so the readout is not clipped. The primary is the near-white plate; the
  destructive button is an outline in the danger colour that fills under
  the pointer; the ghost button has no edge until pointed at.
- **Fields.** The same panel and edge; focus turns the border to the
  primary and draws a 1px line of the film under the field from the left.
- **Panels.** Cards and dialogs wear the film as their 1px border (the
  card ground painted over it on the padding box). Since `scope-102` that
  plate — the ground, the film edge and the chamfer — is on a
  pseudo-element for both of them, `.kp-dialog::before` and
  `.kp-card::after`, because a `clip-path` clips the element's own
  box-shadow and a chamfered panel could otherwise cast nothing at all.
  Popovers, menus, toasts, tooltips, confirmations, pickers and the
  palette share the card ground and the boundary edge.
- **The halo** (`scope-102`, Kenny, 2026-09-16, dark-shadow "Gloed van de
  oxidefilm"). A raised panel stands off the ground in the film's own four
  wavelengths rather than in a shadow made from the background token,
  which on a ground at 5 % lightness moved 0.4 % of the band past a
  just-noticeable step. `--kp-halo` is four fixed shadows — `--chart-2`
  below, `--chart-1` left, `--chart-3` right, `--chart-4` above, where the
  conic gradient puts each colour — carried by the dialog, the card and
  the popover family. Four shadows rather than the film itself, blurred,
  because `.kp-popover` is `overflow: auto` and a modal dialog is
  `overflow: auto` by the UA stylesheet: both clip a pseudo-element, and
  the blurred film measured zero on both. The cost, stated: unlike the
  border, the halo does not turn with the pointer. The nav's dropdown
  (`.kp-nav__menu`) is the one panel left on the old background-token
  shadow — `scope-102` names the dialog, the card and the popover.
- **The stamp.** A near-white pill in the primary with the consumer's
  label in mono capitals, on the dossier card.
- **Small parts of the film.** The boot overlay's bar carries the film.
  The register also paints a `.kp-nav__marker` in the film and a
  `.kp-measure__bracket` at 55 % of `--chart-1` (the measurement frame of
  scope-18), but no component or module of the package renders either
  class today (searched 2026-09-16), so neither shows.
- **Navbar and footer.** The bar is the card ground over a boundary rule,
  links muted until pointed at or current; the call to action is the
  near-white plate. The footer is one step darker than the page
  (`--sidebar-background`).
- **Microlabels and platforms.** Spaced muted capitals after a dot in the
  primary.
- **The side note.** A vertical mono line in the hero, blended by
  difference; decorative and hidden below 40rem.
- **Arrival.** None. The page is simply there.

## Answers to the invariant questions

**DI1 — hairline or boundary?** Both exist and are distinct in role:
`--border` (`hsl(214, 12%, 17%)`, 1.37:1 on the ground) is the hairline;
`--border-strong` and `--input` (`hsl(214, 12%, 30%)`) are the boundary a
control wears. The boundary does **not** reach DI1's floor:
`gates/check-invariants.mjs` measures it at 2.22:1 on the ground, 2.11:1 on
a card and 2.02:1 on a popover, against 3.0. That is advice, not a gate
(Kenny, 2026-09-09), and it stands as an open finding rather than a value
this text claims is fine.

**DI2 — the focus ring.** Two channels, reversed from the base default:
the background touches the element and the ink rings outside it, as the
demo drew it. One of the two always clears 3:1 on the surface behind it.
The dropdown's items take an inset outline in the primary, and a menu item
draws both channels inside itself, where the rounded popover cannot clip
them.

**DI3 — does this theme follow the derivation?** Not by derivation: the
token file authors `--primary-hover` and `--primary-active` itself, stepping
the near-white primary darker (86 % and 78 %), because a primary at 93 %
has almost nowhere lighter to go. The register's primary button hovers six
points lighter instead and presses to `--primary-active`; the other
buttons hover to `--accent` and press to the derived `--secondary-active`.

**DI4 — palette or code?** A code, with lighter inks on darker plates for
every status. It does not yet separate the pair that matters:
`gates/check-invariants.mjs` finds offer and rejected 5.8 apart for the
commonest colour deficiency, against a floor of 12. An open finding, like
DI1's.

**DI5 — animation?** One timed keyframe, `kp-resolve`, one-shot per word,
with its row in `TIMINGS` (`js/effects.js`). The ignite and the rule's draw
are scroll-bound: the browser scrubs them by position, so they cannot
free-run or loop. Everything else is a transition — the brackets, the
label's scale, the edges, the redaction bars — and nothing loops. The only
things that change without a transition are the film's angle and the pool
of light, and they change only as fast as the pointer moves.

**DI6 — light or dark, and is the ordering deliberate?** Dark, and
deliberate: background 5 % → card 8 % → popover 10 %, raised by getting
lighter, with the footer one step below the page at 7 %.

**DI7 — reduced motion.** Every animation and transition of the register
lives inside `@media (prefers-reduced-motion: no-preference)`, and the two
scroll-bound ones sit inside an `@supports (animation-timeline: view())`
guard within it. At rest every word of the headline stands sharp, every
mark stands in the primary, and the rule stands drawn; the brackets, the
label's scale and the edges still answer a hover or a press, at once. The
pointer is not tracked, so the film holds its middle angle and the pool of
light stays centred.

**DI9 — theme colour stays in the token layer.** The register names no
colour: every stop is a token or a relative colour of one, including the
four wavelengths of the film. The page's texture layer is empty
(`css/_rules.css` declares none for dark since the starfield went); the
grid and the pool of light sit on the page background itself.

## What this theme may not do

- Reach pure black or pure white.
- Give colour a job the film or a meaning does not have: the primary is
  near-white, and violet appears only as one of the film's wavelengths and
  in the interview status.
- Round a corner that the chamfer cuts.
- Move anything the reader did not move: no loop, no starfield, no drift
  of the film on its own.
- Change a button's box on hover or press: every gesture is paint — a
  pseudo-element, a child's transform, an out-of-flow edge — so no row
  shifts.
