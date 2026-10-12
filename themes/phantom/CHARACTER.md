# Phantom — character

The reference for how phantom looks and moves, derived from its anchor. Read
the grammar before adding or changing any phantom component; the inventory and
the outliers record where the decided picks (2026-10-05 … 2026-10-07) stand
against it, and the questions (research/phantom-character) are the plan to
bring them in line. Kenny picked the anchor on 2026-10-08 in
research/phantom-anchor (update 1); the grammar below is proposed from it and
goes to him question by question.

Sources measured (2026-10-08): every `research/character-*/decided.json` pick
for phantom resolved to its option, `css/phantom-register.css` (layers
`kp.register` and `kp.signature`, `--kp-skew` −8°, the 7 px halftone screen
`--fx-texture` at 0.14, `--kp-cut` `cubic-bezier(0.7, 0, 0.3, 1)`, `--kp-out`
`cubic-bezier(0.16, 1, 0.3, 1)`, `--kp-shove` `cubic-bezier(0.81, −0.01, 0, 1)`,
`--kp-paperclip`, the deep-red second plate `--kp-red-deep`), `css/themes.css`
(phantom's tokens, `--fx-ease` `cubic-bezier(0.2, 0.9, 0.25, 1)` at 120 ms),
`js/motion.js` (`--kp-open: reverse-close`), the families page (phantom still
open there: no family pick), `themes/phantom/anatomy.md` ("Cyberpunk emits
light; phantom is print": no glow, no blur, the red is a plate with black ink
and never a word) and research/phantom-anchor (round one and update 1).

---

## 0. Decided before this analysis (Kenny)

| When             | Where                                                | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-07 02:54 | the Homelab project thread                           | **The network graph changes in no theme.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 2026-10-08       | research/phantom-anchor, review dialog (round one)   | "I like both the card is thrown and half tone shift, make another attempt with those combined" — the thrown calling card and the shifting halftone screen are to be one gesture.                                                                                                                                                                                                                                                                                                                                                         |
| 2026-10-08       | research/phantom-anchor, review dialog (update 1)    | **The anchor = Thrown as a screen, resolves at the slap** (option 2; the jolt was recommended): the calling card flies in as its own halftone, a silhouette of white dots in the card's shape, title and all, on the shove `cubic-bezier(0.81, 0, 0, 1)`; it slaps down with a dead stop and the dots resolve into the solid white card in three hard cuts; it leaves by dissolving back into dots and being snatched off.                                                                                                               |
| 2026-10-09       | research/phantom-character, review dialog (update 1) | **All nineteen questions approved after update 1** (research/phantom-character/decided.json): the grammar G1 to G21 stands as decided with the update's fixes. Phantom: a closed part is never drawn; the corner cut is a fixed 14 px at 45 degrees on every size; the dialog's red edge is outside the content; the live update is six even cuts; loading = the red slash and the spinner = the star that snaps (the register's, 1.2 s) stay as today. To be applied in css/phantom-register.css and the research/character-* variants. |

What Kenny has not decided and research/phantom-character asks: the grammar's
parameters (curve, direction, opening, durations, colour, corners, surface,
type, motifs), how the throw and the resolve carry to a warning, a live update,
loading, the busy bar, the spinner, leaving and arriving, the buttons inside
composites, hover, focus and the press. Every question's first option is the
recommendation; where a decided pick is at odds with it, the pick is on the page
as an option named "the pick" or "today".

---

## 1. The phantom grammar (proposed)

Phantom is **print**: black, white and one violent red, cut paper, a halftone
screen over everything, condensed italic capitals, hard offset shadows and no
light. The anchor says what phantom does: it **throws a screen that resolves**.
A part flies in as its own halftone, a silhouette of dots in its shape, slaps
down with a dead stop and resolves into the solid thing in three hard cuts, as
a print comes out of its screen; it leaves by dissolving into dots and being
snatched off. Everything that happens on screen is a print: a part **is thrown
and resolves, dissolves and resolves again, waits as a screen that will not
resolve, dissolves and is snatched**. Nothing eases to a stop but the shove,
nothing fades, nothing glows, nothing blurs.

| #   | Rule                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | **The throw is the shove, the resolve is cuts.** Every travel is the shove `cubic-bezier(0.81, 0, 0, 1)` (a hard start, a dead stop); every change of state is hard cuts (`steps(n, jump-end)`, 100 ms a cut); the two never mix. A close is the cuts backwards and the shove on the inverse `cubic-bezier(1, 0, 0.19, 1)`. Never the register's `--fx-ease`, never a spring, never a blur.                                   |
| G2  | **Thrown from off the start edge, along the skew.** A part comes from beyond its start edge along the −8° skew and lands a degree and a half askew; a group (toasts, days, columns) is thrown one after the other, 80 ms apart, each slapping where it lands; a line (the trend, the bar) is cut in from its start. Nothing rises, nothing scales, nothing comes from the centre.                                             |
| G3  | **What opens is thrown from its anchor and resolves.** A menu is thrown from its button's edge as a screen and resolves under it; a dialog is thrown onto the board; a toast is thrown from the start edge; a tooltip is too small to fly: it resolves in place in three cuts. The close: dissolve, then the throw back. The register's dialog scale-and-rotate, the tooltip's pop and the nav's fade are retired.            |
| G4  | **Durations: one throw.** Contact 120 ms (`--fx-duration`). The throw: 400 ms (the anchor's 4 units at 100). The resolve: 300 ms (three cuts). A group: 80 ms apart. A live resolve (dissolve and resolve): 400 ms (two cuts each way). A loop (the busy bar, loading): 1500 ms (the register's shove).                                                                                                                       |
| G5  | **Red is a plate with black ink; white and black print.** `--primary` is a plate (a bar, a slab, a card's edge) with black ink, never a word; cards are white with black ink or black with white; the halftone is white dots on black; `--kp-red-deep` is the second plate behind a red one and the hard shadow; yellow (`--fx-signal`) is the overprint for a warning only. Nothing glows, nothing is a gradient.            |
| G6  | **Square, skewed, cut.** Radius 0; controls and bars are parallelograms (`--kp-skew` −8°, the label un-skewed); cards and menus are cut paper (`--kp-paperclip`), a landed card a degree and a half askew; the tooltip a slab at −3°. As the register has it.                                                                                                                                                                 |
| G7  | **Black under the screen, cards as plates, hard shadows.** The ground is black under the 7 px halftone screen and the grain; a card is a white or black plate with a hard offset shadow in deep red; the hero carries the red slash. No glow, no blur, no soft shadow, no gradient. The picks' bullseyes, string and evidence boards are retired.                                                                             |
| G8  | **A warning is the yellow overprint.** A warning figure's change is stamped on a yellow plate with black ink, overprinted a touch off register (2 px) on the figure; a failure's on the red plate; the card stays its plate. Never a tinted card, never a stamped ring, never a frame.                                                                                                                                        |
| G9  | **A live update dissolves and resolves.** The changed figure dissolves into its dots (two cuts) and resolves to the new value (two cuts), in place, 400 ms; it never moves, jolts, shivers or twangs. Not the string twang (the kpi's pick), not the punch (the tiles'), not the shiver (the columns').                                                                                                                       |
| G10 | **Loading is a screen that will not resolve.** A waiting surface is its own halftone silhouette, dissolving and resolving without landing (density 25 → 50 → 75 → 50 → 25 %, hard cuts, 1500 ms a loop), never solid; the skeleton's lines are dot silhouettes. Not the shuffle (the kpi's and tiles' pick), not the red slash (the register's skeleton), not the stamp ring (the trend's).                                   |
| G11 | **The busy bar is the slab shoved across as a screen.** Round one's bar stays (the skewed track, the black halftone well, the deep-red second plate, the white shard head): with a share known the red slab resolves solid at its stop with the shard at its edge; busy, the slab is shoved across as a dot silhouette that never resolves, 1500 ms, and again (the register's shove, as dots).                               |
| G12 | **The spinner is the star that snaps and resolves.** The register's white star over its red second plate snaps 72° at a time (five cuts a turn, 1200 ms); on each landing it resolves from dots to solid in one cut. Never a smooth turn.                                                                                                                                                                                     |
| G13 | **Arriving is thrown and resolved, leaving dissolves and is snatched.** One animation played forward and backwards (`reverse-close` stays): the throw in as dots, three cuts to solid; to leave, three cuts to dots, the throw back off the start edge. The register's wavering ghost (blur, glow, skew) is retired.                                                                                                          |
| G14 | **An element inside a composite is phantom's own element.** A button in a header, menu, drawer, tile or alert hovers, focuses and presses exactly like phantom's key-cap `.kp-button`; a menu entry like `.kp-menu__item`; a link like its link.                                                                                                                                                                              |
| G15 | **Pointing throws the red bar in and resolves it.** Hover is the register's red bar behind the label (the parallelogram), thrown in from the start edge as a screen and resolved solid in two cuts, the ink flipping to black; a menu entry the same; a link's underline the same bar, thin; a card does not move. No glint, no tilt, no lift, no ring.                                                                       |
| G16 | **Focus is DI2's two-channel ring**, as the register draws it: two rings outside the skewed plate, paper then red.                                                                                                                                                                                                                                                                                                            |
| G17 | **A press drops the key cap onto its shadow and resolves the face.** The cap drops 5 px onto its deep-red shadow (the register's press) and its face resolves from dots to solid in two cuts; release lifts it and the face is solid. Nothing eases.                                                                                                                                                                          |
| G18 | **Barlow Condensed shouts, Barlow speaks, mono files.** Titles, labels, buttons and tabs in Barlow Condensed 900 italic uppercase; prose and figures in Barlow; identifiers, help and errors in the monospace. No other face.                                                                                                                                                                                                 |
| G19 | **Motifs: the screen, the skew, the red plate, the second plate, the slash, the star.** The halftone screen on every ground and on anything arriving, the skew on every control, the red plate with black ink, the deep-red second plate off register, the slash as a cut and a corner, the five-point star; nothing else. The picks' stamps, strings, pins, bullet holes, targets and the ghost's blur and glow are retired. |
| G20 | **Every animation sits under `prefers-reduced-motion: no-preference`;** the reduced pose is the part resolved, landed askew.                                                                                                                                                                                                                                                                                                  |
| G21 | **The network graph is never a target** (Kenny, 2026-10-07 02:54).                                                                                                                                                                                                                                                                                                                                                            |

---

## 2. The decided picks against the grammar

Only the meter is in `css/phantom-register.css` beyond the signature elements.

| Component · aspect           | Pick                                                     | Verdict                                             |
| ---------------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| register · leave             | the wavering ghost: blur, red glow, skew, rise           | outlier-1 (G13, G7)                                 |
| register · dialog, tooltip   | scale 1.25 and rotate −7°; a pop from 0.4                | outlier-2 (G3)                                      |
| register · toast             | from translateX(−48 px) skewX(−14°)                      | near G2 (the throw), on the wrong curve (outlier-2) |
| register · busy bar          | the slab shoved across, solid                            | **the reference** (G11), as dots now                |
| register · spinner           | the star snaps 72°                                       | **the reference** (G12), resolving on each landing  |
| register · skeleton          | a red slash sweeps                                       | outlier-3 (G10)                                     |
| register · hover             | the red bar grows behind the label                       | **the reference** (G15), thrown and resolved now    |
| register · press             | the cap drops onto its shadow                            | **the reference** (G17), the face resolving now     |
| meter · all                  | the calling card: shoved share, screen slides, jolts     | fits (G5, G6); the jolt on tone: outlier-4 (G9)     |
| chart · loading              | the off-register plates jitter                           | outlier-3                                           |
| chart · arrival, events, tip | torn in; bullet holes; a ransom note                     | the tear: outlier-2; the holes: outlier-5 (G19)     |
| calendar · all               | torn tickets, a red cut, stamped, a staple tag           | outlier-5 (the evidence board), outlier-3           |
| trend · shape, loading       | the ransom note; the stamp ring                          | outlier-5, outlier-3                                |
| trend · arrival, live        | slashed in easing in and out; redrawn                    | outlier-2 (the ease), outlier-4                     |
| columns · all                | the redacted dossier, folders shuffle, typed, a shiver   | outlier-5, outlier-3, outlier-4                     |
| menu · open, interact        | slashed in easing in and out; the halftone shifts        | outlier-2; the shift: near G15                      |
| menu · shape, tone, loading  | the calling card; stamped askew; the string pulled       | fits (G5); outlier-5                                |
| kpi · all                    | the target file, stamped askew, the pin glints, twangs   | outlier-5, outlier-3, outlier-6 (G15), outlier-4    |
| tiles · arrival, hover, live | thrown in hard jumps; snatched off the board; punched    | near G2 (as jumps: outlier-2); outlier-6; outlier-4 |
| busy table · all             | the torn ticket, trembles, thrown, flat on a phone       | outlier-5; outlier-3; near G2                       |
| state · all                  | the target mark, stamped colour, pinned                  | outlier-5, outlier-4                                |
| header · all                 | the ransom note, stamped askew, the stamp ring on hover  | outlier-5, outlier-6                                |
| drawer · all                 | the spectral panel, seeps in, pale halo, vapour reshapes | outlier-1 (the ghost reading of the name)           |

---

## 3. The outliers

| #         | What                                                                            | Breaks                                   | Strength |
| --------- | ------------------------------------------------------------------------------- | ---------------------------------------- | -------- |
| outlier-1 | the wavering ghost leave, the spectral drawer, blur, glow, vapour               | print, no light (G7, G13)                | ●●●      |
| outlier-2 | scales, rotates, pops, eased slashes, tears, jumps on the wrong curve           | the shove and cuts (G1, G3)              | ●●●      |
| outlier-3 | slashes, jitters, stamp rings, shuffles, trembles, strings pulled while loading | a screen that will not resolve (G10)     | ●●●      |
| outlier-4 | jolts, twangs, punches, shivers, pins on a live update                          | dissolves and resolves in place (G9)     | ●●       |
| outlier-5 | stamps, strings, pins, staples, bullet holes, targets, dossiers, ransom cuts    | the print's six motifs (G19)             | ●●●      |
| outlier-6 | glints, tilts, snatches, stamp rings on hover                                   | the red bar thrown in and resolved (G15) | ●●       |

---

## 4. The questions (research/phantom-character)

| #   | Question                         | Rule | Options, recommended first                                                                                                               |
| --- | -------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve                 | G1   | the shove and cuts · the register's curve (today) · eased in and out (the picks) · all cuts                                              |
| 2   | The direction                    | G2   | thrown from off the start edge · in hard jumps from the side (the picks) · from the centre out                                           |
| 3   | Opening what drops from a button | G3   | thrown from its anchor, resolves · scaled and rotated (today) · slashed in easing (the picks)                                            |
| 4   | How long things take             | G4   | one throw: 120 · 400 (+300, +80) · 1500 · brisk 80 · 260 (+200, +50) · 1000 · unhurried 180 · 600 (+450, +120) · 2250                    |
| 5   | Where the colour goes            | G5   | red is a plate, white and black print · red words too · the evidence board's colours (the picks)                                         |
| 6   | The corners                      | G6   | square, skewed, cut · square and level · torn edges (the picks)                                                                          |
| 7   | The surface                      | G7   | black under the screen, hard shadows · the evidence board (the picks) · the ghost (the drawer's pick)                                    |
| 8   | A warning                        | G8   | the yellow overprint · stamped askew (the picks) · the red plate for both                                                                |
| 9   | A live update                    | G9   | dissolves and resolves · the string twangs (the picks) · redrawn (the trend's pick)                                                      |
| 10  | Loading                          | G10  | a screen that will not resolve · the red slash (today) · the shuffle (the picks) · the stamp ring (the picks)                            |
| 11  | The busy progress bar            | G11  | the slab shoved across as a screen · the slab solid (today) · the screen slides (the meter's pick)                                       |
| 12  | The spinner                      | G12  | the star snaps and resolves · the star snaps (today) · a dotted star shoved round                                                        |
| 13  | Leaving and arriving             | G13  | thrown and resolved, dissolved and snatched · the wavering ghost (today) · thrown solid, snatched solid                                  |
| 14  | Buttons inside composites        | G14  | exactly phantom's own · phantom's own on a card · as today                                                                               |
| 15  | Pointing at something            | G15  | the red bar thrown in and resolved · the pin glints (the picks) · snatched off the board (the picks)                                     |
| 16  | The focus ring                   | G16  | the two rings (DI2, today) · a dashed red ring (the picks) · as today's mix                                                              |
| 17  | The press                        | G17  | the cap drops, the face resolves · the cap drops (today) · the card tilts (the picks)                                                    |
| 18  | The voice                        | G18  | Barlow Condensed shouts, Barlow speaks · condensed everywhere · the ransom note (the picks)                                              |
| 19  | Motifs                           | G19  | the screen, the skew, the red plate, the second plate, the slash, the star · plus the evidence board (the picks) · as today (everything) |

**Applied 2026-10-09** (css/phantom-register.css, `kp.register` and `kp.signature`, tokens
`--kp-shove`, `--kp-shove-out`, `--kp-cut-size`, `--kp-land` in the register and `--kp-sig-ph-*` for
the masks, the block, the slash and the pose of a throw; `fx-ease` in themes/phantom/tokens.json;
Kenny's picks on research/phantom-character, all nineteen approved 2026-10-09 after update 1):

- **Q1 curve, Q4 durations: applied.** `--kp-cut`, `--kp-out` and `--kp-shove` are the shove
  `cubic-bezier(0.81, 0, 0, 1)` (they were three other curves), the close runs
  `--kp-shove-out` `cubic-bezier(1, 0, 0.19, 1)`; `fx-ease` in tokens.json is the shove (themes.css
  takes it at the next generation), contact is `--fx-duration` 120 ms, a throw is 700 ms (400 of the
  shove, 300 of the resolve), a group 80 ms apart (`--kp-reveal-stagger`, `--kp-redact-stagger`),
  `--kp-wipe`, `--kp-plate` and `--kp-rail` 400 ms; `--kp-close-max` and `--kp-size-max` 700 ms so
  js/motion.js does not cut a close or a glide short. Every eased keyframe was retired
  (`kp-shout`, `kp-cut-in`, the slam, the stick, the card, the big card and the pop of the signature).
- **Q2 direction, Q3 opening, Q13 leave: applied** as one pair of keyframes, played together:
  `kp-sig-phantom-fly` (translate, rotate and scale from beyond the start edge, 0 to 57.142857 % on
  the shove, hidden at its first instant) and `kp-sig-phantom-resolve` (a mask of the register's 7 px
  dot grid at 25, 50 and 75 % of the cell, then none, three hard cuts); the leave is the pair on the
  inverse, `kp-sig-phantom-fly-out` and `kp-sig-phantom-resolve-out`, hidden at its last instant, on
  `[data-kp-leaving]`, 700 ms, so an arrival (the leave backwards) is thrown on the shove. The dialog,
  the toast, the menu and the popover, the bar's dropdown, the tour card, the words of a headline and the
  drawer (level, from its own edge) are thrown; the tooltip and a tick resolve in place
  (`kp-sig-phantom-resolve-tip`, three cuts of 100 ms). A closed part is never drawn: no sliver of a
  menu, a tooltip, a dialog, a toast or a leaving key figure. The unopened dialog runs 1050 ms and the open
  one 700 ms (js/motion.js reads two thirds of the first as the close). RTL swaps the start edge
  (`:dir(rtl)`).
- **Q5 colour: applied.** No red word is left: the destructive button is white ink on a red frame, the
  open accordion and the sorted column are white with a red underline, the copy that failed is white,
  the card's label and the brand tag are red plates with black ink; links keep the red underline.
- **Q6 corners: applied.** `--kp-paperclip` is the cut paper, a fixed 14 px at 45 degrees (top-start and
  bottom-end) whatever the size of the part; menus and popovers pad their rows by the cut less the edge,
  the tooltip is a slab (no cut), a landed card stands `--kp-land` -1.5 degrees askew (toast, dialog,
  menus, tour, the hud tags and the wizard's numbers), the tooltip -3.
- **Q7 surface: applied.** The dialog's red edge stands outside the content: `.kp-dialog::after` is the
  hero's slash (a red plate cut at 40 %), 2.2 rem (1.25 rem under 30 rem) at the end edge, and the
  content is inset by its width and 12 px. Hard shadows are the deep red second plate, never a
  translucent one (`--kp-hard`, the media, back to top); the tour has no blur; the empty state lost its
  feathered mask; the alarm's glow is off.
- **Q8 warning: applied.** A warning alert is the yellow overprint with black ink and a black edge; on a
  key figure the figure stays plain, the card stays its plate, and the change is stamped on the yellow
  plate (warning) or the red plate (failure, destructive), black ink, 2 px off register; a destructive menu
  entry is the red plate with black ink.
- **Q9 live update: applied.** `--kp-update: resolve`; `[data-kp-updating='resolve']` plays
  `kp-sig-phantom-update`, 400 ms, six cuts of the mask (70, 40, 10 %, then back), in place. The meter's
  tone change is the same six cuts (`kp-sig-phantom-meter-redraw-d|o|w`, the jolts are gone).
- **Q10 loading: applied** (the red slash, as today, 1400 ms on `cubic-bezier(0.6, 0, 0.4, 1)`, the
  one place the grammar's curve is not used, because Kenny picked the register's own). A block of
  the screen with the red slash across it, behind the part's words, on the skeleton's lines, blocks
  and circles (the line's leaning sheet, the plate's cut, the circle), the loading meter, the table's
  busy panel, the loading menu entry, a busy button and card, the tiles' cards, the calendar's days and
  busy panel and the chart's plot; the layout layer's dim is off on each.
- **Q11 busy bar: applied.** With no share known the slab is a silhouette of dots on a 4 px cell that
  never resolves (`mask-image: var(--kp-sig-ph-dots)`), the shove 1500 ms on the shove's curve; reduced
  motion shows the stripes unmasked. **Q12 spinner: unchanged** (the star that snaps, 1.2 s, as today).
- **Q14 composites, Q15 hover: applied.** The key cap's manners are the same everywhere: a button,
  an icon button, the nav's links and dropdown entries, the footer's links, the search trigger, a menu
  entry, a calendar day and the label of a key figure that is a link have the red bar waiting at the
  start edge; pointing throws it in on the shove in 60 ms and resolves it in two cuts across the 120 ms
  (`kp-sig-phantom-bar`), the ink flips to black at the second (`kp-sig-phantom-ink`), leaving snatches it
  back on the inverse after 30 ms; a link in running text gets the thin bar under its foot.
- **Q16 focus: applied.** DI2's two channels, the dashed red ring (3 px, 2 px out, 4 px on a key cap)
  over the contrast ring that hugs the part; on a menu entry, a day and a key figure it stands inside
  the cut (-6 px). The keyboard throws no bar and a hover on a focused part leaves the ring.
- **Q17 press: applied.** The cap drops 3 px (the primary 5 px, its shadow gone) with `translate`, so the
  skew stays; nothing eases and the release lifts; the face resolves from dots in two cuts
  (`kp-sig-phantom-face`).
- **Q18 type: applied.** Key figure label and state word shout (Barlow Condensed italic), the figure
  speaks (Barlow 700). **Q19 motifs: applied.** The stamp is a skewed plate, the hud tags and the wizard's
  numbers land at -1.5 degrees, nothing is a stamp, string, pin, hole, target or ransom cut.
- **Not applied here:** the network graph (G21, unchanged); the dashboard components' own plates, which
  the port gives phantom (research/PACKAGE_FINDINGS.md, "Phantom").

---

## 5. Distinct from the other themes

| Aspect  | Phantom (recommended)                    | Overlap found, and the difference                                                                                         |
| ------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Curve   | the shove, then hard cuts                | grotesk falls into register and dwells; cyberpunk cuts too but glitches; phantom's cuts resolve a screen and never jitter |
| Arrival | thrown as dots, resolves at the slap     | retro dissolves in a chequer dither (grey, 4 densities, in place); phantom's screen flies, slaps and resolves to a plate  |
| Loading | a screen that will not resolve           | retro's dither pulses in place; phantom's silhouette keeps the part's shape and never lands                               |
| Live    | dissolves and resolves in place          | cyberpunk glitches sideways; phantom never moves, it re-prints                                                            |
| Hover   | the red bar thrown in behind the label   | synthwave's bars glow; grotesk's plate drops; phantom's bar is thrown and resolves with black ink                         |
| Surface | black under a halftone, hard red shadows | brutalism's shadows are black on cream; cyberpunk's cuts glow; phantom's are deep red and nothing glows                   |
| Motifs  | screen, skew, plates, slash, star        | grotesk shares the red/black/white but is level and unscreened; nothing else is skewed and halftoned                      |
