# What makes light light

**Status: Open (2026-10-08).** Round `2026-10-08-r1`, waiting for Kenny's verdict, question by question, in the review dialog.

**Why.** Kenny decided the anchor of light on 2026-10-08 in [research/light-anchor](../light-anchor/README.md): **Overexposed: out of the
glare**. A part is there as a glare first, blurred and too bright, and comes down into focus and into its own white; it never fades up from
grey; it leaves into the glare, as the register already does. Every later decision of the theme departs from it. The analysis is
[themes/light/CHARACTER.md](../../themes/light/CHARACTER.md): the grammar G1 to G21 proposed from the anchor, the decided picks measured
against it, nine outliers and the questions. This page turns the proposals into the nineteen questions Kenny answers to fix light's grammar,
the way research/forest-character did for forest.

**Already decided, not asked again.** The anchor; his family picks for light (research/families, 2026-10-07 01:32: loading = the strip,
arrival and live = the trend, hover, focus and press = the header, tone = the tiles, shape = the strip); and the network graph, which
changes in no theme and is in no scene.

**What.** One page, light only, in the review kit's aspect mode (`data-review-themes="light"`). An intro (the designer's three
paragraphs, from `aspects.js`), "What light is" (the package's own parts in light, and on demand six decided demos embedded as they are
today), then nineteen questions. Each question is one rule of the grammar and three options (four for questions 1 and 10), each a live
scene built from the package's own components in light. The first option is the recommendation; every option says what you see and why it
is or is not recommended, on the page and in its hint in the dialog. The options named "the pick" are the decided demos' values, the ones
named "today" the register's own.

| #   | Question (rule)                       | Options, recommended first                                                                                   |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | The motion curve (G1)                 | the exposure settles · the commit curve · linear · as today                                                  |
| 2   | The direction (G2)                    | in place, no travel · rises 8 px (today) · start → end                                                       |
| 3   | Opening what drops from a button (G3) | into focus under its anchor · the window from a slit (today) · a soft pop (the pick)                         |
| 4   | How long things take (G4)             | 150 · 420 (+90) · 2400 · brisk 100 · 260 (+60) · 1600 · unhurried 200 · 700 (+120) · 3600                    |
| 5   | Where the colour goes (G5)            | indigo acts, cyan is light, white overexposes · the glare is cyan · an amber warmth (the picks)              |
| 6   | The corners (G6)                      | pills for acting, 0.5 rem for reading · all pills · all 0.5 rem                                              |
| 7   | The surface (G7)                      | white, three shadows, the seam · flat white, lines only · daylight skies (the picks)                         |
| 8   | A warning (G8)                        | a band along the top and a pill · the tinted card · the figure overexposed in the tone                       |
| 9   | A live update (G9)                    | re-exposed · the soft swell (the picks) · nothing (today)                                                    |
| 10  | Loading (G10)                         | out of focus · the daylight band (the picks) · the dashed baseline (the picks) · the skeleton's clip (today) |
| 11  | The busy progress bar (G11)           | a glare runs the line · the three beads walk · the bead orbits the line                                      |
| 12  | The spinner (G12)                     | the bead burns out at the top · the two beads (today) · a ring breathing into the glare                      |
| 13  | Leaving and arriving (G13)            | out of the glare in place · with the 8 px rise (today) · the window                                          |
| 14  | Buttons inside composites (G14)       | exactly light's own · light's own on a soft card · as today                                                  |
| 15  | Pointing at something (G15)           | settles toward the paper · the shadow lifts (the picks) · a touch overexposed                                |
| 16  | The focus ring (G16)                  | the two-channel ring · a halo of light (the picks) · as today                                                |
| 17  | The press (G17)                       | lands and flashes · lands flat · nothing (today)                                                             |
| 18  | The voice (G18)                       | one face, two weights · figures in mono · headings tight and heavy                                           |
| 19  | Motifs (G19)                          | the seam, its circle, the bead · plus the sun and the gnomon (the picks) · none                              |

**How.**

- `aspects.js` holds the nineteen questions as data (the designer's text, verbatim: question, reason, rule, kind, scene key, options with
  what you see and the verdict). `demo.js` imports it, adds each question's scene (`SCENES`, by the scene key), builds the rows
  (`data-lt-aspect`, option cells `data-lt-option`) and writes `data-review-choices` from the same data, so the page and the dialog cannot
  disagree.
- `grammar.css` is the grammar as tokens on `.lt-page, .lt-scene` (the settle curve and its inverse, the durations, the glare, the radii,
  the colours by role, the three shadows) and the keyframes of the recommended options (the exposure and its close, the re-exposure, the
  breathing, the busy glare, the burning bead, the shutter flash).
- `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-lt-<question>="<key>"` on the scene. Colours are tokens
  only; every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the crisp, finished part, and a filter is
  never animated under reduced motion.
- One clock in `demo.js` plays every scene that arrives, opens, updates or leaves (`data-lt-phase`: gap 0.5 s, in 1.5 s, hold 1.5 s, out
  1.5 s): the options of a row start together. Replay restarts it, the speed buttons stretch every duration by 2 or 4, the dialog's Pause
  (Space) stops it. Loops (loading, the busy bar, the spinner, the press) run in CSS.
- Every open is a pair of keyframes (`lt-x`, `lt-x-out`): the close is the open reversed. The timing function is written out inside the
  keyframes, an eased open closes on the inverse curve (`cubic-bezier(0.16, 1, 0.3, 1)` against `cubic-bezier(0.7, 0, 0.84, 0)`; steps are
  mirrored by a 1 ms linear jump), and a part's delay is mirrored (window less delay less length: what came last goes first).
- State (Rest, Hover, Focus, Press) forces a state on every button, entry and link of question 14; the hover, focus and press rows draw
  their own state (`lt-pointed`, `lt-focused`, a looped `lt-press`), which the dialog also plays by itself.
- The gallery of decided components loads the character demos through the review kit's embed mode (`?embed=…&theme=light`) only when it
  is opened.

**Findings while building.**

- The register gives the popover and the `ul.kp-menu` inside it each the medium shadow, so a menu casts two; the scenes show one panel
  with one shadow (the rule is in options.css, not in the register).
- The register's skeleton pills (`--muted`, 95 % L) and every hairline vanish under brightness 1.3 to 1.6, so a surface that is blurred
  and brighter as a whole (plate and all) is white on white. Question 10's "out of focus" therefore blurs the waiting content on its
  plate, and its placeholders carry `--border-strong`.

**Measured:** pending (`node research/_review/measure-motion.mjs research/light-character`).
