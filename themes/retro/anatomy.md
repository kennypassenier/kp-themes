# retro — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Retro is the
> third theme lifted in 5.0.0 (S48, LIFT_PLAN row 3). The research behind
> it is §21 of [RESEARCH_2026-09.md](../../docs/RESEARCH_2026-09.md); the
> concept demo Kenny approved on 2026-09-08 is "Bevel 95".

## The idea

The 1995 desktop: mid-grey chrome, a navy title bar, buttons and fields
drawn as bevels, a pixel face for the headings, and nothing that
blinks. 98.css is the reference. The OS-chrome reading, not Y2K's
candy chrome — that would collide with pastel and cyberpunk.

The style is tamed in exactly two places, both measured: the bevel
that _is_ the style measured 2.17:1 in the original and cannot be the
boundary DI1 asks for, and the dotted focus rectangle is forbidden by
DI2. So the boundary is a gated 38% grey and the bevel sits inside it
(`css/retro-register.css`), and the focus ring is the system's.

## What is load-bearing

1. **The chrome is 75%.** `hsl(0, 0%, 75%)` is the classic surface; the
   card at 84% and the popover at 90% are the "button face" and the
   "window" of the original, ordered so a raised surface is lighter
   (DI6 read for a light theme).
2. **Navy acts, teal signals.** `--primary` is the title-bar navy
   `hsl(240, 100%, 25%)` — 8.8:1 on the chrome — and the sidebar is
   navy too, with white text. Teal `hsl(180, 100%, 20%)` is the accent
   and the signal: the desktop colour, deepened until it clears 3:1 on
   the chrome (25% measured 2.62 as a chart series). As a label's ink
   the register deepens it once more, to 15% (5.32 on the chrome),
   because the plate colour measured 3.69 as text.
3. **The register carries the bevel.** `css/retro-register.css` paints
   the raised and sunken edges as inset shadows in the theme's own
   tokens — popover as highlight, foreground as the deep edge, border as
   the mid edge — on buttons, cards, popovers and fields, and inverts
   them on press with the label stepping one pixel. Scoped to
   `[data-theme='retro']`, inert elsewhere, loaded by the showcase and
   the fixtures. A browser test holds the painted boundary at 3:1 with
   the register on.
4. **No easing.** `--fx-duration: 0ms`: the original snapped, and so
   does this. Every reveal of the register runs in discrete steps — a
   dither in four densities, a selection in eight, a groove in twelve —
   and every one only ever goes one way. Pixelify Sans on headings only;
   the body is Instrument Sans, because pixel body text under 16px is
   the readability risk every retro guide names; VT323 is the DOS voice
   for labels, help and status.

## The register (5.0.0)

`css/retro-register.css` is the theme's answer to the hook vocabulary
(S45), every mechanism measured in the research:

- **Surface.** The hero is the window's client area: the chrome, the
  heading in ink with a hard white shadow, the laurels as three sunken
  status panels, the spec sheet as a Display Properties window with the
  ramp as its title bar.
- **Emphasis.** A `<mark>` is the selection — the navy bar with white
  text. With the script armed the words stand in ink until the bar
  drags across them in eight steps (`select`). A dossier's redactions
  are the 50% dither brush of a disabled control, lifted left to right
  in eight steps when the file is opened.
- **Reveal.** The headline clears out of a dither in four densities
  (`dissolve`); the groove under a heading rules itself in, left to
  right, in twelve steps when the heading enters the viewport
  (`groove`).
- **Divider.** The shell groove of 2bit.chat: the first is the wide
  groove with the dithered band between its two lines, the second the
  plain two-line groove.
- **Accent.** The hard white shadow on every surface heading; the
  title-bar ramp — navy to the sidebar's lit navy — on the brand, the
  dossier's header, a dialog's title and the spec sheet. The reference
  ramp ended on a blue where white measured 4.01 (S42: reported, and
  answered with a token white clears).
- **Arrival.** `boot`: the POST — the dictionary's boot line counting up
  in the DOS face on the deep ground, a raised Skip button, and the
  screen leaving through the pixel dissolve. Once per session,
  skippable, never under reduced motion.

Every hover is the selection bar, instantly; the default button carries
the navy bevel and the mirror modifier the one-pixel ink ring 1995 drew
around whatever Enter would press; the selected tab lifts two pixels
and overhangs three; the scrollbar track is the 2×2 checkerboard; every
window and menu has the hard drop shadow. One answer per component root
(56 of 64, the eight helpers excused).

**What the demo showed and the package now renders exactly (S49, 2026-09-08).**
Kenny's rule of 2026-09-08 is that an approved demo is implemented
exactly, and that a test or a gate which disagrees produces a finding for
him rather than a quiet change. The audit of this theme against its demo
is `docs/audits/DEMO_FIDELITY_RETRO_2026-09-08.md`; every deviation it
found was put to him, and every one he answered "Demo exact" is built.
What is left is named here, with its reason.

- The page is the demo's own words at `examples/concept-retro.html`; the
  whole page sits in one application window on the teal desktop (the root
  is the desktop, the body is the window); the title bar row ends on the
  three window controls, drawn in gradients because a glyph in `content`
  is copy (KT5); the status bar has its resize grip and the spec sheet
  its groove well; the title-bar ramp ends on the measured lit navy; the
  POST is the demo's BIOS banner and memory test from the dictionary,
  counting along a segmented bar; the fieldset's groove is the demo's two
  hairlines as four inset shadows; the selection drags its own white
  words in with the bar; the select is the demo's painted combo button
  and the keyboard highlight is the selection bar (KT8 yields for this
  theme, per Kenny, with the exception recorded in the fixture suite);
  the ring is stacked the demo's way, ink outside.
- **Not reproducible without markup, and reported as such:** the demo's
  spec sheet carries three tabs and a fieldset legend, and its status bar
  a second NUM panel. The concept page's structure is the same for every
  theme (S46), so a theme may not add elements to it, and a word in CSS
  `content` is copy (KT5). The window, the controls, the grip and the
  groove well are all there; those three are not.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A 38% grey on the chrome (3.3), the card
and the popover; the bevel is decoration inside it.

**DI2 — the focus ring.** Navy over chrome, the ink as the second
channel, composed in front of the bevel — never instead of it, which
was the 3.1.0 fault this file records. No dotted rectangle.

**DI3 — states you can see.** Derived by lightness; the register adds
the inverted bevel on press and the embossed grey label on a disabled
control, an opt-in, not a replacement.

**DI4 — colour is never the only carrier.** Green offer against red
rejected: 22.3 apart under deuteranopia with green at 26% and red at
24%, measured before the tokens were written.

**DI5 — the flash threshold.** Nothing loops and nothing blinks; every
effect runs once and every step is monotone, so the count of opposing
luminance changes is zero. The four keyframes of the register are rated
in `reports/di5.md`.

**DI6 — light or dark.** `color-scheme: light`; chrome 75%, card 84%,
popover 90%.

**DI7 — reduced motion.** Every animation of the register lives inside
the no-preference guard; the rest states are what a reader who asked
for reduced motion gets, and the boot screen is not built at all.

**DI9 — theme colour stays in the token layer.** One texture — a
two-pixel checkerboard at 4%, the dither every gradient was — and the
register reads tokens only, with relative colours for the navy bevel
and the label's teal; `gates/check-layers.mjs` holds it there.

## What it deliberately does not do

- **No Y2K.** No chrome gradient, no iridescence, no candy.
- **No pixel body text.** Headings only.
- **No blink, no marquee, no hit counter.** The original had them; the
  flash threshold and taste both say no.
- **No dotted focus rectangle, no smoothing switched off at 11px.** Both
  measured in the reference, both refused (DI2, readability).
