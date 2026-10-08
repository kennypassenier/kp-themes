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

| When             | Where                                | Decision                                                                                                                                                                                                                                                        |
| ---------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-07 01:32 | research/families, light             | **Loading** = the strip's _Morning light_. **Arrival** = the trend's _Sunrise_. **Live** = the trend's _A soft swell_. **Hover, focus, press** = the header's _The warm glow_. **Tone** = the tiles' _The soft pill_. **Shape** = the strip's _Separate cards_. |
| 2026-10-07 02:54 | the Homelab project thread           | **The network graph changes in no theme.**                                                                                                                                                                                                                      |
| 2026-10-08       | research/light-anchor, review dialog | **The anchor = Overexposed: out of the glare** (option 5): a part is there as a glare first, blurred and too bright, and comes down into focus and into its own white; it never fades up from grey; it leaves into the glare, as the register already does.     |

What Kenny has not decided and research/light-character asks: the grammar's
parameters (curve, direction, opening, durations, colour, corners, surface,
type, motifs), how the exposure carries to a warning, a live update, loading,
the busy bar, the spinner, the composites, hover, focus and the press.

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
