# terminal — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Terminal is the
> fourth theme lifted in 5.0.0 (S48, LIFT_PLAN row 4). The research behind
> it is §6 of [RESEARCH_2026-09.md](../../docs/RESEARCH_2026-09.md); the
> concept demo Kenny approved on 2026-09-08 is "Green Phosphor".

## The idea

A phosphor CRT. Green on near-black, everything monospace, scanlines on
the glass and a faint bloom on the titles. The most committed theme in the
set: it does not merely look like a terminal, it accepts a terminal's
constraints.

`--radius: 0` is not a style choice. A character cell has no rounded
corners.

## What is load-bearing

1. **Monochrome green.** One hue at 120°, varied only by lightness and
   saturation. Introducing a second hue costs the premise.
2. **Everything is mono.** This is the only theme that overrides the body
   typeface. Losing that makes it green-tinted, not a terminal. Share
   Tech Mono ships renamed (`KP Tech Mono`, its licence reserves the name
   "Share"); the display face is the same family without anti-aliasing.
3. **Near-black, not black.** `hsl(120, 10%, 5%)` carries a green cast
   even in the ground.
4. **The scanlines.** A 3 px repeating gradient — measured at roughly
   15.6 cycles per degree, well clear of the band where striped patterns
   cause visual discomfort. Anyone retuning them for a hi-dpi screen must
   check that number again; the uncomfortable band is a period of roughly
   8 to 47 CSS pixels.

## The register (5.0.0)

`css/terminal-register.css` is the theme's answer to the hook vocabulary
(S45), every mechanism measured in the research:

- **Surface.** The void, with the glass on the root's own
  pseudo-elements: ekeijl's bezel drawn as a border-image gradient (no
  image asset), and the sweep band that crosses the viewport once every
  ten seconds and rests eight of them — a transform, the only ambient
  motion. The laurels are a status line, the first field in inverse
  video; the spec sheet is a man page; the side note carries the REC dot.
- **Emphasis.** A `<mark>` is inverse video, the only highlight a
  terminal has (`inverse`); with the script armed the words stand in
  phosphor inside a dim frame until the line lands, then switch in one
  step. A dossier's redactions are a run of character cells cleared left
  to right in nine steps — the way a screen repaints a line, not the way
  a curtain opens.
- **Reveal.** The headline types itself one glyph at a time with a block
  caret of one character cell riding the last one (`type`, 30 characters
  per second); the dashed rule under a heading types itself out in twelve
  steps when the heading enters the viewport (`dashes`).
- **Divider.** A rule of dashes with a plus at each end; the second one
  doubles the line.
- **Accent.** The bloom on every title, the display without
  anti-aliasing, the `$` prompt before a microlabel.
- **Arrival.** `boot`: the POST — the dictionary's boot line in phosphor
  on the void, a bracketed Skip, and the tube collapsing to a line and
  then to nothing in four steps, transform and opacity only (the
  reference's brightness spike was left out). Once per session,
  skippable, never under reduced motion.
- **The cursor in the box (R6-Q7).** Since 3.1.1 a blinking block sat
  after the label of the field being typed into. Kenny's reading of
  2026-09-08: a terminal's cursor lives in the box, at the caret. The
  base rule is gone; the register paints a block of one character cell
  as a background layer of the focused text field, at the column
  `js/effects.js` writes (`--kp-caret: block` on the root, `--kp-col`
  on the field, measured in the field's own `ch` and clamped to its
  width), blinking once a second; a textarea keeps the browser's caret.

Every hover is inverse video; the buttons are brackets and plates (the
ghost's brackets appear under the pointer); the checkbox is `[ ]` and
`[x]`; the panels are TUI panels with one boundary in a dimmer phosphor;
the progress bar and the skeleton are runs of cells. One answer per
component root (56 of 64, the eight helpers excused).

**What the demo showed and the package now renders exactly (S49, 2026-09-08).**
Kenny's rule of 2026-09-08 is that an approved demo is implemented
exactly, and that a test or a gate which disagrees produces a finding for
him rather than a quiet change. The audit of this theme against its demo
is `docs/audits/DEMO_FIDELITY_TERMINAL_2026-09-08.md`; every deviation it
found was put to him, and every one he answered "Demo exact" is built.
What is left is named here, with its reason.

- The page is the demo's own words at `examples/concept-terminal.html`;
  the boot is the demo's five POST lines from the dictionary, one after
  another at its own 190ms, rather than a percentage counter; the panel,
  the well, the footer ground and the two hot colours are the demo's
  measured values, the hot pair carried by the token contract as
  `--fx-hot` and `--fx-hot-alarm`; the headline types at the demo's 34ms
  with no lead-in; every button carries the demo's height, with the three
  sizes told apart by type and padding (TH111, amended the same day); the
  select is the demo's own drawn arrow (KT8 yields for this theme).
- **Still as the package renders it:** the `>` prompt inside the input is
  the microlabel's `$` and the caret block, because a glyph painted in a
  background layer needs a colour that layer may not name (DI9).

## Answers to the invariant questions

**DI1 — hairline or boundary?** Its border is `hsl(120, 20%, 18%)`, a
green so dark it is nearly the ground. A boundary here is a dimmer
phosphor — the same hue at higher lightness — which fits the premise
exactly: a CRT draws boundaries in the same colour it draws everything.

**DI3 — does this theme follow the derivation?** **No, and this is its
opt-out.** A phosphor does not darken under pressure; it brightens. Hover
increases luminance and bloom rather than stepping toward the ground —
the register's `--kp-hot` colours are the foreground, the plate and the
alarm at higher lightness. Like cyberpunk, this forfeits the AR12
shortcut and is checked in full.

**DI4 — palette or code?** A code, and it passes at 80.1 — again because
lightness carries the difference. In a monochrome theme that is the only
channel available, so this theme is structurally the safest for
colour-vision deficiency and structurally the most dependent on lightness
being right.

**DI5 — animation?** Two loops, both rated in `reports/di5.md`: the
sweep (a transform, no luminance change) and the caret (one opposing
change per second over one character cell, a tenth of the threshold).
Everything else runs once and steps. The reference's flicker at .15s
infinite was measured and refused.

**DI6 — light or dark, and is the ordering deliberate?** Dark, and
wrong: 0.0041 → 0.0063 → 0.0052. The popover sinks. The register paints
its panels on `--secondary` for that reason.

**DI7 — reduced motion.** Every animation of the register lives inside
the no-preference guard; at rest the sweep sits above the viewport, the
cursor is a solid block, the redactions and the rule stand at their end,
and the boot screen is not built at all.

**DI9 — theme colour stays in the token layer.** The scanlines at 0.06
are the one texture; the register reads tokens only, with relative
colours for the bezel's greys, the bloom and the brighter phosphor.

## The exception this theme has to justify

Its primary is pure green at 120° and its danger colour is pure red at 0°
— the widest separation in the system (155.6), because it **breaks the
monochrome premise on purpose**.

That is almost certainly right: safety beats aesthetic purity, and a
warning that blends into the phosphor is not a warning. But it has never
been written down, so the next person to work on this theme could
"restore" it to green and remove the only visual alarm the theme has.
It is deliberate. It stays.

## What this theme may not do

- Use a proportional typeface anywhere.
- Round a corner.
- Introduce a third hue. Green, plus the sanctioned red for danger, plus
  the yellow-green accent — that is the whole set.
- Retune the scanline period without recomputing the discomfort band.
- Flicker. The raster never moves; the only loops are the sweep and the
  caret.

## Open for L3

Success is trivially green — which is a problem, because everything is
green. Success will have to be signalled by brightness and by a
non-colour cue rather than by hue, and that is the strongest argument in
the whole system for DI4's second-channel rule. Warning and info face the
same wall.
