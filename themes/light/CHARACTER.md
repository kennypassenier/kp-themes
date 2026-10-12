# Light — character

The reference for how light looks and moves, derived from its anchor. Read the
grammar before adding or changing any light component; the inventory and the
outliers record where the decided picks (2026-10-05 … 2026-10-07) stand against
it, and the questions (research/light-character) are the plan to bring them in
line. Kenny picked the anchor on 2026-10-08 in research/light-anchor; the grammar
below is proposed from it and goes to him question by question.

Sources measured (2026-10-08): every `research/character-*/decided.json` pick
for light resolved to its option, `css/light-register.css` (1817 lines, layers
`kp.register` and `kp.signature`), `css/themes.css` (light's tokens, `--fx-ease`
`cubic-bezier(0.2, 0, 0, 1)` at 150 ms, no texture), the register's own
`--kp-ease-arrive` `cubic-bezier(0.16, 1, 0.3, 1)`, `js/motion.js`
(`--kp-open: reverse-close`), the families verdict (loading = key-figure strip,
arrival = trend tile, live = trend tile, hover = page header, tone = dashboard
tiles, shape = key-figure strip), `themes/light/anatomy.md` ("no mood, no
display face, no ornament, no texture") and research/light-anchor.

---

## 0. Decided before this analysis (Kenny)

| When             | Where                                   | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-07 01:32 | research/families, light                | **Loading** = the strip's _Morning light_. **Arrival** = the trend's _Sunrise_. **Live** = the trend's _A soft swell_. **Hover, focus, press** = the header's _The warm glow_. **Tone** = the tiles' _The soft pill_. **Shape** = the strip's _Separate cards_.                                                                                                                                                                                                                                                                                     |
| 2026-10-07 02:54 | the Homelab project thread              | **The network graph changes in no theme.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2026-10-08       | research/light-anchor, review dialog    | **The anchor = Overexposed: out of the glare** (option 5): a part is there as a glare first, blurred and too bright, and comes down into focus and into its own white; it never fades up from grey; it leaves into the glare, as the register already does.                                                                                                                                                                                                                                                                                         |
| 2026-10-08       | research/light-character, review dialog | **All nineteen questions approved, every recommendation except How long things take = Unhurried: 200 · 700 (+120) · 3600 ms and The busy progress bar = The bead orbits the line** (research/light-character/decided.json). The grammar G1 to G21 below stands as decided, with G4 (durations) = 200 ms contact, 700 ms exposure, 120 ms between the parts of a group, 3.6 s a loop, and G11 (busy bar) = one cyan bead running to the end of the hairline and back. To be applied in css/light-register.css and the research/character-* variants. |

Decided 2026-10-08: every question in research/light-character is answered (see the last row above). Applied the same day in css/light-register.css and the research variants (the notes at the end of §4); the package findings are under a Light heading in research/PACKAGE_FINDINGS.md.

---

## 1. The light grammar (proposed)

Light is **a photograph on white paper**: pure white, near-black ink, one indigo
that acts, a cyan that is light itself (a fill, never a word), no ornament but
the seam with its circle, no depth but three soft shadows. The anchor says what
light does: it **exposes**. A part is a glare first, too bright to read, and the
exposure comes down until it is crisp and white; what leaves goes back into the
glare. Everything that happens on screen is a matter of exposure: it **comes
into focus, is re-exposed, waits out of focus, burns out**. Nothing slides,
nothing grows, nothing is drawn; the picture is always already there, and only
its exposure changes.

| #   | Rule                                                                                                                                                                                                                                                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | **The exposure settles.** Every one-shot motion is the glare coming down: brightness 1.6 → 1 and blur 5 px → 0 together on light's settle curve `--kp-ease-arrive` (`cubic-bezier(0.16, 1, 0.3, 1)`: most of the way at once, then a long settle into focus), the way a lens pulls focus. A close is the same played backwards on the inverse curve. Never linear, never a spring. |
| G2  | **In place, no travel.** A part comes into focus where it stands: no rise, no slide, no scale. A group (toasts, days, columns) is exposed one after the other, 90 ms apart, in reading order. A line (the trend, the bar) is exposed along its length start → end, the glare running ahead of the focus.                                                                           |
| G3  | **What opens comes into focus under its anchor.** A menu is a glare under its button that comes into focus; a dialog is a glare where it stands; both go back into the glare to close. The register's window (a slit widening) is retired; the toast's and the dialog's rise too.                                                                                                  |
| G4  | **Durations: one exposure.** Contact 150 ms (`--fx-duration`). An exposure (an arrival, an opening, the leave as its reverse): 420 ms (the register's leave). A group: 90 ms apart (the register's toasts). A re-exposure (a live update): 420 ms. A loop (the busy bar's glare running the line): 2400 ms.                                                                        |
| G5  | **Indigo acts, cyan is light, white overexposes.** `--primary` draws every act and pick; `--fx-signal` (cyan) is a fill where light is literally shown (the bead, the glint, the laurel rule) and never a word; the glare is white (brightness, not a tint); the status tints show a state, their inks say it.                                                                     |
| G6  | **Pills for what you act on, 0.5 rem for what you read.** Buttons, chips, tags, the tooltip, the switch, the bar's line are pills; cards, inputs, dialogs, menus take `--radius` 0.5 rem; the checkbox 0.3 rem. As the register has it.                                                                                                                                            |
| G7  | **White, three soft shadows, the seam.** Surfaces are white on white, told apart by `--kp-shadow-sm/-md/-lg` only; the seam (a hairline with its open circle) divides; no texture, no gradient, no sky wash (the picks' daylight skies are retired), no ornament.                                                                                                                  |
| G8  | **A warning is a band along the top and a pill.** A warning or failed figure's card carries a 3 px band of the tone's colour along its top edge and its change on a soft pill in the tone's ink (the tiles', the trend's and the key figure's pick); the card stays white. Never a tinted card, never a frame all round.                                                           |
| G9  | **A live update is re-exposed.** The changed figure goes into the glare for a beat (brightness 1.4, blur 2 px) and comes back into focus, 420 ms; the figure never moves or swells. Not the soft swell (the picks).                                                                                                                                                                |
| G10 | **Loading is out of focus.** A waiting surface stands in the glare, blurred and bright, its exposure breathing (brightness 1.3 ↔ 1.6, blur 3 ↔ 5 px, 2400 ms ease-in-out) until the reading comes into focus; the skeleton's pills are the same, out of focus. Not the daylight band (the picks), not the dashed baseline.                                                         |
| G11 | **The busy bar is a glare running the line.** The indigo line is drawn whole and a short overexposed stretch (white, blurred) runs along it start → end and comes round again, 2400 ms linear, the bead at its head; with a share known, the line is exposed to the share with the bead.                                                                                           |
| G12 | **The spinner is a bead that burns out and comes back.** The register's ring with its indigo and cyan beads orbiting (1200 ms), and the indigo bead overexposes as it passes the top (brightness up, a 4 px blur) and comes back into focus by the foot.                                                                                                                           |
| G13 | **Arriving is out of the glare, leaving is into it.** One animation, played forward and backwards (`reverse-close` stays): brightness and blur, in place, no rise. The register's 8 px rise on the leave is retired.                                                                                                                                                               |
| G14 | **An element inside a composite is light's own element.** A button in a header, menu, drawer, tile or alert hovers, focuses and presses exactly like light's `.kp-button`; a menu entry like `.kp-menu__item`; a link like its link.                                                                                                                                               |
| G15 | **Pointing settles the pill toward the paper.** Hover is the register's gap-4: the control settles 2 px down and its shadow tightens; a menu entry takes the muted wash; a link takes the pale-cyan wash; a tile's shadow does not grow (the picks' lift is retired).                                                                                                              |
| G16 | **Focus is DI2's two-channel ring**, a system constant.                                                                                                                                                                                                                                                                                                                            |
| G17 | **A press lands the pill and flashes it.** The pill settles flat (shadow gone) and overexposes for the contact (brightness 1.25 for 150 ms), then is crisp in its pressed ground; release lifts it back to rest.                                                                                                                                                                   |
| G18 | **One face, two weights.** Instrument Sans for everything: headings 600 tracked −0.01 em, figures 600 with tabular numerals, labels 500 at 0.8125 rem, prose 400; monospace only for identifiers and timestamps. No display face, no small capitals.                                                                                                                               |
| G19 | **Motifs: the seam and its circle, the bead.** A hairline with an open circle divides; the bead (a white-ringed cyan dot) is the head of a line; nothing else is drawn. The picks' suns, gnomons, sticky notes and folded corners are retired.                                                                                                                                     |
| G20 | **Every animation sits under `prefers-reduced-motion: no-preference`;** the reduced pose is the crisp picture; a filter is never animated under reduced motion.                                                                                                                                                                                                                    |
| G21 | **The network graph is never a target** (Kenny, 2026-10-07 02:54).                                                                                                                                                                                                                                                                                                                 |

---

## 2. The decided picks against the grammar

Only the meter is in `css/light-register.css` beyond the signature elements.

| Component · aspect        | Pick                                       | Verdict                                              |
| ------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| register · leave/arrival  | the glare, with an 8 px rise               | **the anchor** (G13); the rise: outlier-1 (G2)       |
| register · dialog, toast  | a window from a slit; the toast rises      | outlier-2 (G3)                                       |
| register · tooltip        | floats in 4 px, scales from 0.96           | outlier-2                                            |
| register · busy bar       | three beads, still                         | outlier-3 (G11)                                      |
| register · spinner        | two beads orbit                            | fits; the burn-out is added (G12)                    |
| register · skeleton       | pills open from the start by clip          | outlier-4 (G10)                                      |
| register · hover          | settles 2 px toward the paper              | **the reference** (G15)                              |
| register · press          | none                                       | outlier-5 (G17)                                      |
| register · update         | none declared                              | outlier-6 (G9)                                       |
| meter · all               | daylight, morning light, the shadow swings | the band: outlier-4; the gnomon and glint: outlier-7 |
| chart · shape             | daylight: a pale sky, a sun off frame      | outlier-7 (G7)                                       |
| chart · loading, arrival  | a band rises; grows into the light         | outlier-4, outlier-1                                 |
| calendar · all            | daylight cards, a ring of sunlight         | outlier-7; the ring: G19                             |
| columns · loading         | morning light                              | outlier-4                                            |
| columns · arrival, live   | drawn by daylight; lifted in               | outlier-1                                            |
| trend · arrival           | sunrise                                    | outlier-1                                            |
| trend · live, tiles, kpi  | a soft swell                               | outlier-6                                            |
| trend · tone, tiles, kpi  | the coloured tab, the soft pill            | **the reference** (G8)                               |
| menu · open               | a soft pop                                 | outlier-2                                            |
| menu · interact, tiles    | the soft lift                              | outlier-8 (G15)                                      |
| kpi · shape               | the paper sheet, a folded corner           | outlier-7 (G19)                                      |
| kpi · interactive, header | the warm glow (amber halo)                 | outlier-8, outlier-9 (G5: amber)                     |
| busy · arrival            | unfolds from its middle                    | outlier-2                                            |
| busy, tiles · loading     | the dashed baseline drifts                 | outlier-4                                            |
| drawer · all              | grows into the light; sticky note          | outlier-1; outlier-7                                 |
| state · all               | the soft dot, a soft swell                 | outlier-6                                            |

---

## 3. The outliers

| #         | What                                                                    | Breaks                           | Strength |
| --------- | ----------------------------------------------------------------------- | -------------------------------- | -------- |
| outlier-1 | rises, sunrises, lifts and slides in the picks and the register's leave | in place, no travel (G2)         | ●●●      |
| outlier-2 | the window slit, the rise, the float, the pop, the unfold               | into focus under its anchor (G3) | ●●●      |
| outlier-3 | the busy bar stands still                                               | a glare running the line (G11)   | ●●       |
| outlier-4 | daylight bands, dashed baselines, the skeleton's clip                   | out of focus (G10)               | ●●●      |
| outlier-5 | no press                                                                | the pill lands and flashes (G17) | ●●       |
| outlier-6 | the soft swell; no update declared                                      | re-exposed (G9)                  | ●●       |
| outlier-7 | suns, skies, gnomons, glints, sticky notes, folded corners              | no ornament (G7, G19)            | ●●       |
| outlier-8 | the soft lift on hover                                                  | settles toward the paper (G15)   | ●●       |
| outlier-9 | the amber halo of the warm glow                                         | indigo acts, cyan is light (G5)  | ●        |

---

## 4. The questions (research/light-character)

| #   | Question                         | Rule | Options, recommended first                                                                                   |
| --- | -------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------ |
| 1   | The motion curve                 | G1   | the exposure settles · the commit curve · linear · as today                                                  |
| 2   | The direction                    | G2   | in place, no travel · rises 8 px out of the glare (today) · start → end                                      |
| 3   | Opening what drops from a button | G3   | into focus under its anchor · the window from a slit (today) · a soft pop (the pick)                         |
| 4   | How long things take             | G4   | 150 · 420 (+90) · 2400 · brisk 100 · 260 (+60) · 1600 · unhurried 200 · 700 (+120) · 3600                    |
| 5   | Where the colour goes            | G5   | indigo acts, cyan is light, white overexposes · the glare is cyan · an amber warmth (the picks)              |
| 6   | The corners                      | G6   | pills for acting, 0.5 rem for reading · all pills · all 0.5 rem                                              |
| 7   | The surface                      | G7   | white, three shadows, the seam · flat white, lines only · daylight skies (the picks)                         |
| 8   | A warning                        | G8   | a band along the top and a pill · the tinted card · the figure overexposed in the tone                       |
| 9   | A live update                    | G9   | re-exposed · the soft swell (the picks) · nothing (today)                                                    |
| 10  | Loading                          | G10  | out of focus · the daylight band (the picks) · the dashed baseline (the picks) · the skeleton's clip (today) |
| 11  | The busy progress bar            | G11  | a glare runs the line · the three beads walk · the bead orbits the line                                      |
| 12  | The spinner                      | G12  | the bead burns out at the top · the two beads (today) · a ring breathing into the glare                      |
| 13  | Leaving and arriving             | G13  | out of the glare in place · with the 8 px rise (today) · the window                                          |
| 14  | Buttons inside composites        | G14  | exactly light's own · light's own on a soft card · as today                                                  |
| 15  | Pointing at something            | G15  | settles toward the paper · the shadow lifts (the picks) · a touch overexposed                                |
| 16  | The focus ring                   | G16  | the two-channel ring · a halo of light (the picks) · as today                                                |
| 17  | The press                        | G17  | lands and flashes · lands flat · nothing (today)                                                             |
| 18  | The voice                        | G18  | one face, two weights · figures in mono · headings tight and heavy                                           |
| 19  | Motifs                           | G19  | the seam, its circle, the bead · plus the sun and the gnomon (the picks) · none                              |

**Applied 2026-10-08** (css/light-register.css, kp.register and `kp.signature`, tokens
`--kp-sig-light-*`; `--fx-ease` and `--fx-duration` in css/themes.css; Kenny's answers on
research/light-character, all nineteen approved, durations and the busy bar as he chose them):

- **Q1, Q4 (curve, durations): applied.** `--fx-ease` is the settle,
  `cubic-bezier(0.16, 1, 0.3, 1)`, and `--kp-ease-hover` is the same curve; its inverse
  `--kp-ease-leave` is `cubic-bezier(0.7, 0, 0.84, 0)` (the control points reflected through the
  middle: (1 − x2, 1 − y2, 1 − x1, 1 − y1), so its last number is 0, as the demo's own
  `--lt-settle-out` has it). Contact 200 ms (`--fx-duration`), exposure 700 ms
  (`--kp-sig-light-time`), 120 ms between the parts of a group (`--kp-sig-light-step`), a loop
  3600 ms (`--kp-sig-light-loop`), the spinner's turn 1200 ms (`--kp-sig-light-orbit`). The
  glare, the beat, the dim and the dazzle, the burn and the shutter are tokens too (brightness 1.6
  and blur 5 px; 1.4 and 2 px; 1.3 and 3 px; 1.8 and 4 px; 1.25). `--kp-close-max` and
  `--kp-size-max` are one exposure, so js/motion.js does not cut a close at 600 ms. The old
  loom curve, the 150 ms contact and every 420 and 520 ms are gone; the easings written inside
  keyframes are literal (`cubic-bezier(0.16, 1, 0.3, 1)` into focus, `(0.7, 0, 0.84, 0)` into the
  glare); the plain eases left are the there-and-backs (the bead on the hairline, the breathing)
  and the two halves of the spinner's burn.
- **Q2, Q3, Q13 (direction, opening, leave): applied.** One pair of keyframes:
  `kp-sig-light-expose` (opacity 0 to 1, `filter` glare to none) and `kp-sig-light-leave` (the
  same the other way), neither names its own easing, so js/motion.js can turn either round and
  the close is the arrival's frames reversed (sampled in Chromium on the dialog and the menu:
  one pair, run each way, on the settle and on its inverse). `.kp-dialog` (one and a half exposures
  unopened, so the close js/motion.js reads off it is one; one when open), `.kp-toast` (a
  group 120 ms apart), `.kp-tooltip`, `.kp-menu-button > .kp-menu`, `.kp-popover[popover]`,
  `dialog.kp-drawer`, `.kp-tour[open]` and `[data-kp-arriving]` come into focus where they stand;
  `[data-kp-leaving]` is `kp-sig-light-leave` on the inverse curve, `--kp-open: reverse-close`
  stays. The headline (`kp-clip-reveal`, the slit is retired: opacity and glare), the rule
  under a heading (`kp-sig-light-expose` in place of the drawn `kp-rule-in`) and the mark
  (`kp-mark-sweep`, the sweep of a background is retired: the phrase takes its ground and
  comes into focus) arrive the same way; the 8 px rise of the leave, the window slit of the
  dialog and the toast, the tooltip's float and scale, the radio bead's scale from nothing,
  the meter share's scale and the skeleton's clip are gone.
- **Q5, Q7 (colour, surface): applied.** The three shadows and the seam are the whole of the
  depth; the blueprint grid texture the base layer still painted for light (T6, 5 %) is taken
  off in the register (`--fx-texture: none`); the meter's share is flat (no sun at its end),
  its mark a plain stroke, the glint past the end gone; a resizing box brightens (white) without
  the indigo drop shadow; no amber warmth anywhere in the register.
- **Q6 (corners): as the register had it.** Buttons, icon buttons, badges, tags, the tooltip,
  the switch and the bar's line are pills, cards, inputs, dialogs and menus 0.5 rem, the
  checkbox 0.3 rem; nothing changed.
- **Q8 (warning): applied.** `.kp-kpi[data-kp-tone='warning'|'destructive']` (and so the trend
  tile) carries a 3 px band along its top as an inset shadow (`--kp-sig-light-band`, which
  follows the corners), the card stays white, the figure is in the ink and the change
  (`.kp-kpi__delta`) sits on a soft pill (14 % of the tone's ink, in the ink); the package's
  start edge, its frame all round and its plate under the figure are retired.
  `.kp-alert--warning` and `.kp-alert--destructive` are a white card with the same band and
  the label on a soft pill (the attention band's items keep what they had);
  `.kp-menu__item--destructive` is in the destructive ink (the components layer's own
  `color: inherit` had cancelled it) with the band and a soft wash under the pointer.
- **Q9 (live update): applied** as `--kp-update: reexpose` and
  `[data-kp-updating='reexpose']`: `kp-sig-light-reexpose`, into the glare for a beat on the
  inverse curve (18 % of the time) and back into focus on the settle, in 0.8 times the theme's
  update time (700 ms); the figure, the word and the line never move. The meter's tone change
  is the same beat (`kp-sig-light-meter-expose-o|w|d`, one name per tone so a change restarts it).
- **Q10 (loading): applied** on every waiting surface the package has, out of focus and
  breathing (`kp-sig-light-breathe`, brightness 1.3 to 1.6 and blur 3 to 5 px, 3600 ms
  ease-in-out): `.kp-skeleton` lines, blocks and circles (the fill is on `::before`, so the
  chart's loading sentence stays sharp; the key figures', columns' and trend's lines and plot
  are such skeletons), `.kp-meter[data-kp-loading]` and `.kp-kpi__meter`, a loading menu entry,
  and the words of `.kp-card[aria-busy]`, a busy tile of `.kp-tiles`, `.kp-kpi[aria-busy]`,
  `.kp-datatable__busy-panel` (not its spinner) and a loading calendar day (a day later in the
  week a beat later); a busy `.kp-button` keeps its pill and its label is its own blur
  (`kp-sig-light-breathe-ink`), because a pill that is brighter and blurred as a whole is white
  on white. The busy dim of layout.css is off in light (`--kp-busy-opacity: 1`). Under
  reduced motion the placeholders and the meter stand still, out of focus, and words stay sharp.
- **Q11, Q12 (busy bar, spinner): applied.** An indeterminate `.kp-progressbar` keeps its
  hairline and its one cyan bead runs to the end and back (`kp-sig-light-line`, 3600 ms a leg,
  ease-in-out, `alternate`) in the three sizes; standing still it is the three beads at the
  middle. The `.kp-spinner`'s indigo bead burns out at the top and is back in focus by the foot
  (`kp-sig-light-burn` beside the orbit, 1200 ms).
- **Q14 to Q17 (composites, hover, focus, press): applied** to every `.kp-button` and
  `.kp-icon-button` wherever it stands, to `.kp-menu__item`, `a.kp-kpi`, `.kp-kpi--toggle`,
  `.kp-kpi--trend`, `.kp-calendar__day` and `.kp-kpi__link`: pointing settles 2 px and tightens
  the shadow (a card-like part takes the softer 1 px shadow and the stronger hairline, a menu
  entry the muted wash, a link the pale-cyan wash); focus is DI2's ring, written after the
  pointer's rule at the same weight so it wins (`:focus-visible:not(:disabled)`), and kept
  through a press; a press lands flat (shadow gone, 2 px down) and flashes
  (`kp-sig-light-flash`, brightness 1.25 for the contact), then stands crisp in the pressed
  ground the components layer paints. Buttons now also transition their ground and ink on the
  contact time.
- **Q18, Q19 (voice, motifs): applied.** Headings 600 tracked −0.01 em (h4 too), figures 600
  tabular (`.kp-numeric` is no longer mono), labels 500 at 0.8125 rem (the side note, the
  platform line, the spec's terms, the wizard steps, the language link and the status lines
  lose their mono, capitals and tracking), the brand and the laurels' figure 600. Monospace is
  left on identifiers, timestamps, code and keys. The seam and its circle stay, the empty state's
  bead is white-ringed, today in the calendar wears the bead (in the top corner of its cell,
  because the package's day carries its count under the number) instead of an inner ring.
- **Research variants redrawn** on the grammar (a `light.css` per component, wired in its
  demo.html, its IDEAS text updated): character-busy, -calendar, -chart, -columns, -drawer
  (round2-a.js too), -header, -kpi, -menu, -meter, -state, -tiles, -trend. The network graph
  is untouched. The chart tooltip is a white card now (the picked frosted glass was a
  translucent plate, G7); the tour card of the drawer is a plain card (the sticky note, G19).
- **Gates:** every new keyframe has its row in `TIMINGS` (js/effects.js) and, where it
  animates a filter, its line in `OUT_OF_SCOPE` (gates/check-motion.mjs); reports/di5.md is
  to be regenerated.

---

## 5. Distinct from the other themes

| Aspect  | Light (recommended)          | Overlap found, and the difference                                                                                               |
| ------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Curve   | the settle (0.16, 1, 0.3, 1) | titanium's quick-out (0.2, 0.8, 0.2, 1) is near; light's overshoots to 1 and settles for twice as long                          |
| Arrival | in place, out of a glare     | dark develops in the darkroom (contrast comes up from a pale print under a flash); light's is brightness coming DOWN into white |
| Loading | out of focus, breathing      | no other theme blurs to wait; sepia's headline blur-in is one shot                                                              |
| Live    | re-exposed                   | solstice's figure rises into its line; light's never moves                                                                      |
| Hover   | settles toward the paper     | titanium drops 1 px on press; light settles 2 px on hover and lands flat on press                                               |
| Surface | white on white, soft shadows | every other theme has a ground or a frame; light has neither                                                                    |
| Motifs  | the seam and the bead        | pastel's pearls are a row; light's circle is one, open, on a hairline                                                           |
