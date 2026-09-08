# brutalism — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Brutalism is
> the fifth theme lifted in 5.0.0 (S48, LIFT_PLAN row 5). The research
> behind it is §12 of [RESEARCH_2026-09.md](../../docs/RESEARCH_2026-09.md);
> the concept demo Kenny approved on 2026-09-08 is "Hard Copy".

## The idea

Neo-brutalism, the 2021 kind: off-white paper, boxes drawn with a 3px
black line, a hard shadow that sits exactly where the box would fall if
you let go of it, and plates in the colours of a sweet shop — yellow,
coral, lavender. Nothing is blurred, nothing is translucent, nothing
pretends to be a material. The reference is Gumroad's redesign and the
directories that grew around it, not the concrete of the 1960s.

It is the first theme in the set whose signature is a shadow. Every
other theme is flat by decision; this one is flat by exaggeration.

## What is load-bearing

1. **Black is the structure.** `--border`, `--border-strong`, `--input`,
   `--ring`, `--selected` and `--primary` are all the same ink,
   `hsl(0, 0%, 7%)`. A brutalist box has one line weight and one line
   colour; a grey hairline anywhere would be a different theme.
2. **The shadow is a knob, not a rule.** `--fx-shadow-offset: 4px` is the
   whole effect: `css/components.css` paints
   `offset offset 0 0 var(--border-strong)` on buttons, cards and inputs
   in every theme, and the other themes answer 0px, which paints
   nothing. The register exaggerates it to six pixels (`--kp-drop`) and
   adds the lift: a box under the pointer rises two pixels away from its
   shadow, and drops onto it when pressed.
3. **Yellow is the default button, black is the primary.** The contrast
   gate holds `--primary` at 4.5:1 against the page as link text, which
   no yellow can pass on off-white — so the ink is primary (13.4:1 with
   yellow text on it) and the yellow `hsl(48, 100%, 60%)` is
   `--secondary`, the plate an ordinary button wears. That is the
   brutalist reading anyway: the loud colour is the common one.
4. **Radius 0, and a display face with weight.** Archivo Black for
   headings, uppercase with tight tracking; Space Grotesk for the body.
   A rounded corner or a light heading would soften exactly what the
   theme is for.

## The register (5.0.0)

`css/brutalism-register.css` is the theme's answer to the hook vocabulary
(S45), every mechanism measured in the research:

- **Surface.** Paper and the base layer's dot grid; the laurels as three
  candy plates, each with its own ink (DI4); the platforms as bordered
  chips; the spec sheet as the white card with the line and the shadow.
- **Emphasis.** A `<mark>` is a plate wiped in behind the word, closed by
  the one line weight (`plate`); with the script armed the word stands
  on the paper until the plate arrives — a size, not a colour. A
  dossier's redactions are black bars that slide off one after another,
  the way a pen is dragged off a page.
- **Reveal.** The headline's words drop onto their yellow offset, one
  after another, 60 ms apart (`slam`); the six-pixel bar rules a heading
  off, left to right, when it enters the viewport (`bar`).
- **Divider.** Future Pharmaceutical's marquee: a strip twice the band's
  width translated -50%, seamless, one cycle in 42 seconds — a hatch of
  the plate on the ink, the second one the ink on the plate running the
  other way. The demo's marquee carried words; the package's carries a
  pattern, because words in CSS content are copy (KT5).
- **Accent.** Archivo Black in capitals with the yellow offset on the
  headline; the microlabel as a yellow plate with BEIGE FORCE's pixel
  outline (four box-shadows, no border).
- **Arrival.** None. Printed matter is simply there; the demo had no boot
  and the register declares no `--kp-arrival`.

Every hover is the yellow plate with the line; the call to action lifts
and drops; the dropdown snaps (white, the line, the shadow — no fade);
the buttons are plates whose hover colour is BEIGE FORCE's step off the
plate itself, as a relative colour of the plate token; the checkbox is a
small box with its own shadow, the ink with a yellow square when checked;
the stamp is a signal plate with the pixel outline, tilted; every panel is
white with the line and the shadow. One answer per component root (56 of
64, the eight helpers excused).

**What the demo showed and the package now renders exactly (S49, 2026-09-08).**
Kenny's rule of 2026-09-08 is that an approved demo is implemented
exactly, and that a test or a gate which disagrees produces a finding for
him rather than a quiet change. The audit of this theme against its demo
is `docs/audits/DEMO_FIDELITY_BRUTALISM_2026-09-08.md`; every deviation it
found was put to him, and every one he answered "Demo exact" is built.
What is left is named here, with its reason.

- The page is the demo's own words at `examples/concept-brutalism.html`;
  the dot grid is the demo's 1.6px dot on a 20px pitch; the hover step is
  the demo's `oklch(from …)` and the primary darkens with every other
  plate; a hover moves the lift, the shadow and the plate colour together
  (KT8's one-step rule yields for this theme, per Kenny); the ring is
  stacked the demo's way, ink outside and paper against the element;
  every button carries the demo's 3rem; the stamp changes to the demo's
  second word when the file opens; the fallback stacks are the demo's.
- **One thing the demo says twice:** its stylesheet gives a bare button a
  white plate, and its markup gives every button it actually renders a
  modifier — the one in the concept page's slot is the yellow. The
  package's plain button is that yellow, so the page looks like the demo;
  the white default is a rule the demo never paints. Put to Kenny at the
  ratification of 2026-09-08 and answered there: **the yellow stays**, so
  the page keeps the appearance he approved.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** Trivial: black on off-white is 18:1, and
the same black is the boundary on the card and the popover.

**DI2 — the focus ring.** The two channels are the ink and the paper,
composed in front of the shadow.

**DI3 — states you can see.** Derived by lightness like everywhere else.
Pressed adds the theme's own gesture on top: the box moves onto its own
shadow (`translate` by the offset, shadow removed), which is an opt-in in
`css/_rules.css`, not a replacement for the colour step; the register
adds the lift before the drop.

**DI4 — colour is never the only carrier.** The status plates are candy
with black ink, except `rejected`, which is the one black plate with
paper ink — so offer (green plate) and rejected (black plate) differ by
lightness before anyone looks at the hue.

**DI5 — the flash threshold.** One loop, the marquee: a transform inside
a 46px band, no luminance change, rated in `reports/di5.md`. The slam
and the bar run once.

**DI6 — light or dark.** `color-scheme: light`. Card and popover are
pure white on off-white paper.

**DI7 — reduced motion.** Every animation of the register lives inside
the no-preference guard; at rest the words carry their offset, the
plates are there, the bars are drawn and the marquee stands still.

**DI9 — theme colour stays in the token layer.** One texture (a dot grid
at 6%, drawn from `--foreground`), and the register reads tokens only,
with one relative colour for the hover step.

## What it deliberately does not do

- **No grey.** `--muted-foreground` is a dark grey for small print and
  that is the only one; dividers and disabled states are derived, not
  designed.
- **No text on yellow except black.** Yellow at 60% lightness carries
  only the ink; white on it would be 1.4:1.
- **No blur, no gradient, no transparency.** The moment the shadow
  softens, this is `light` with a shadow.
- **No arrival.** A page of printed matter does not boot.
