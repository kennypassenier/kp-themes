# Dark — character

The reference for how dark looks and moves, derived from its anchor. Read the
grammar before adding or changing any dark component; the inventory and the
outliers record where the decided picks (2026-10-05 … 2026-10-07) stand against
it, and the questions (research/dark-character) are the plan to bring them in
line. Kenny picked the anchor on 2026-10-08 in research/dark-anchor (update 1);
the grammar below is proposed from it and goes to him question by question.

Sources measured (2026-10-08): every `research/character-*/decided.json` pick
for dark resolved to its option, `css/dark-register.css` (2759 lines, layers
`kp.register` and `kp.signature`), `css/themes.css` (dark's tokens, `--fx-ease`
`cubic-bezier(0.16, 0.84, 0.28, 1)` at 220 ms, `--kp-settle`
`cubic-bezier(0.22, 1, 0.36, 1)`, the oxide film `--kp-iris` and its pointer
angle `--kp-px`/`--kp-py`, the instrument grid), `js/motion.js` (`--kp-open:
reverse-close`), the families verdict (loading = busy table's ticker baseline,
arrival = menu button's powered up, live = key figure's trace flares, hover =
network graph, tone = meter's pressed in the die, shape = the oscilloscope),
`themes/dark/anatomy.md` ("nothing moves that the reader did not move; colour
is only the film and meaning") and research/dark-anchor (update 1).

---

## 0. Decided before this analysis (Kenny)

| When             | Where                                             | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-07 01:32 | research/families, dark                           | **Loading** = the busy table's _The ticker baseline_. **Arrival** = the menu button's _Powered up_. **Live** = the key figure's _The trace flares_. **Hover, focus, press** = the network graph's _Spotlit_. **Tone** = the meter's _Pressed in the die_. **Shape** = the key-figure strip's _The oscilloscope_.                                                                                                                                                                         |
| 2026-10-07 02:54 | the Homelab project thread                        | **The network graph changes in no theme.**                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 2026-10-08       | research/dark-anchor, review dialog (round one)   | "I love the colours of everything, especially the progress bar on option 1, but I also like the sleek animations of spectral line, can we combine these somehow?" — the film's turn and the spectral line are to be one thing; round one's progress bar (the chamfered ticked track, the film fill whose colour turns as it fills, the `]` head) stays exactly.                                                                                                                          |
| 2026-10-08       | research/dark-anchor, review dialog (update 1)    | **The anchor = The line lays the film down, turning** (option 1, recommended): a spectral line of film light sweeps the panel from the start at an even pace, and the film it lays along the edge behind it is turning (the colour runs once round the edge as the line crosses); when the line reaches the end the figure takes the film through its letters and the turn settles with cyan at the top; the leave is the pass back.                                                     |
| 2026-10-09       | research/dark-character, review dialog (update 1) | **All nineteen questions approved after update 1** (research/dark-character/decided.json): the grammar G1 to G21 stands as decided with the update's fixes. Dark: every opening sweeps left to right over the opened element's own box; the corners are chamfered on two opposite corners with the halo and shadow following the cut; loading = a comet with a film tail; the spinner = the spectrum bars. To be applied in css/dark-register.css and the research/character-* variants. |

What Kenny has not decided and research/dark-character asks: the grammar's
parameters (curve, direction, opening, durations, colour, corners, surface,
type, motifs), how the pass carries to a warning, a live update, loading, the
busy bar, the spinner, leaving and arriving, the buttons inside composites,
hover, focus and the press. Every question's first option is the recommendation;
where a decided pick is at odds with it, the pick is on the page as an option
named "the pick" or "today".

---

## 1. The dark grammar (proposed)

Dark is **a spectral instrument**: near-black ground ruled with a faint grid,
near-white ink, and one mechanism, the anodised oxide film (`--kp-iris`, cyan →
violet → magenta → lime) that runs along every edge that matters and turns with
the pointer. The anchor says what dark does: it **passes a line**. A spectral
line of film light sweeps a part from its start at an even pace and lays the
film along its edge behind it, turning; when the line reaches the end the
figure takes the film through its letters and the turn settles, cyan at the
top. Everything that happens on screen is one pass: a part **is laid by the
line, re-laid by it, swept while it waits, taken off by the pass back**. Nothing
fades, nothing pops, nothing blinks; the film is the only colour and the line is
the only light.

| #   | Rule                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | **The pass is even, the turn settles.** The line crosses at one pace (`linear`) and stops dead at the end; the film it lays turns through its angle on `--kp-settle` (`cubic-bezier(0.22, 1, 0.36, 1)`), most of the turn at once and a long settle to cyan at the top. A close is the pass back on `linear` and the turn back on the inverse `cubic-bezier(0.64, 0, 0.78, 0)`. Never the register's `--fx-ease`, never a spring, never a step. |
| G2  | **From the start, along the edge.** The line enters at a part's start edge and crosses to its end; the film is laid along the edge the line has passed; a group (toasts, days, columns) is crossed by one line, each part lit as the line reaches it (60 ms apart); a line (the trend, the bar) is lit along its length as the line runs it. Nothing rises, nothing scales, nothing comes from the centre.                                      |
| G3  | **What opens is swept in from its anchor.** A menu is swept under its button: the line crosses the menu's footprint from the button's edge and lays the panel behind it; a dialog is swept from its start edge where it stands; a tooltip from its notch; the pass back closes them. The register's fade of the nav dropdown, the dialog's develop flash and the toast's 6 px rise are retired.                                                 |
| G4  | **Durations: one pass.** Contact 220 ms (`--fx-duration`). The pass: 660 ms (the anchor's 6 units at 110); the turn settles 220 ms after the line stops (880 ms in all). A group: 60 ms apart along the line. A live pass: 660 ms. A loop (the busy bar, the spinner, loading): 2400 ms.                                                                                                                                                        |
| G5  | **Colour is the film and meaning.** The film (`--kp-iris`) is every edge that matters, the line, the fill, the ring; ink is near-white; an act is a light plate (`--primary`), not a hue; danger is coral (`--destructive`) and nothing else is a colour. The line is a 2 px slice of the film with the one glow the theme allows (10 px of `--chart-1` at 40 %). No lamps, no tubes, no green traces (the picks' console dialect is retired).  |
| G6  | **Chamfered, never rounded.** Radius 0; controls cut `--fx-notch` 0.55 rem on two opposite corners, panels `--kp-chamfer-panel` 1 rem; brackets `[` `]` close on a label. As the register has it.                                                                                                                                                                                                                                               |
| G7  | **Near-black, the grid, the film on the edge.** The ground carries the instrument grid (hairlines at 4.5 %) and the pointer's pool of light; a panel is one shade lighter with the film along its edge where it matters and the four-colour halo behind a lit panel; no texture, no shadow in grey, no scanline. The picks' status boards and black-ops panels are retired.                                                                     |
| G8  | **A warning is the film gone coral.** A warning or failed part's film edge takes the tone's colour (`--destructive` for a failure, `--warning` for a warning) along its whole length and its change is set in that ink; the plate stays near-black. Never a lamp, never a tinted plate, never a lit number.                                                                                                                                     |
| G9  | **A live update is one pass over the figure.** The line crosses the changed figure once (660 ms), the figure takes the film through its letters as the line passes and settles back to ink; the figure never moves, flares or jolts. Not the trace flaring (the picks), not the darkroom develop.                                                                                                                                               |
| G10 | **Loading is the line sweeping an empty slot.** On every waiting surface the line crosses from start to end and the film it lays turns behind it, then dims as the line leaves at the end; again from the start, 2400 ms a loop; the skeleton's lines are the slots. Not the ticker baseline (the picks), not the misregistration ghosts.                                                                                                       |
| G11 | **The busy bar is the line running the track.** Round one's bar stays exactly (chamfered ticked track, the film fill whose colour turns as it fills, the `]` head): with a share known the fill is laid to the share with the line at its head; busy, the line runs the empty track start → end laying a short stretch of film that turns and dims behind it, 2400 ms, and again.                                                               |
| G12 | **The spinner is the line running the ring.** The register's ring in film colours, and the line runs round it once per 2400 ms laying the film behind it, which turns and dims by the time the line comes round; never a plain rotation.                                                                                                                                                                                                        |
| G13 | **Arriving is the pass that lays, leaving is the pass that takes off.** One animation played forward and backwards (`reverse-close` stays): the line crosses and the part is laid behind it; to leave, the line crosses back from the end and the part goes dark behind it. The register's `brightness(0)` leave and the picks' powered-up switch-on are retired.                                                                               |
| G14 | **An element inside a composite is dark's own element.** A button in a header, menu, drawer, tile or alert hovers, focuses and presses exactly like dark's bracketed `.kp-button`; a menu entry like `.kp-menu__item`; a link like its link.                                                                                                                                                                                                    |
| G15 | **Pointing rests the line at the start.** Hover is the line resting at the control's start edge (a 2 px slice of film with its glow, standing) and the brackets closing one step; a menu entry takes the line at its start; a link's underline takes the film. No lit rim, no lifted panel, no spotlight.                                                                                                                                       |
| G16 | **Focus is DI2's two-channel ring**, a system constant.                                                                                                                                                                                                                                                                                                                                                                                         |
| G17 | **A press is a pass that turns the edge a quarter.** On contact the line crosses the face (220 ms) and the film edge turns a quarter (+90°) and settles; the brackets close; release turns it back. Nothing moves.                                                                                                                                                                                                                              |
| G18 | **Archivo for words, the ticker mono for readings.** Headings Archivo 700, buttons 600, prose 400; readouts, brackets, microlabels, timestamps and identifiers in `KP Ticker Mono`. No other face.                                                                                                                                                                                                                                              |
| G19 | **Motifs: the film, the line, the chamfer, the brackets, the grid.** The film on an edge, the line where something happens, the chamfer on two corners, the brackets on a label, the instrument grid on the ground; nothing else is drawn. The picks' lamps, tubes, ticker tapes, scope traces, status boards and the register's misregistration ghosts and darkroom flash are retired.                                                         |
| G20 | **Every animation sits under `prefers-reduced-motion: no-preference`;** the reduced pose is the part laid, cyan at the top.                                                                                                                                                                                                                                                                                                                     |
| G21 | **The network graph is never a target** (Kenny, 2026-10-07 02:54).                                                                                                                                                                                                                                                                                                                                                                              |

---

## 2. The decided picks against the grammar

Only the meter is in `css/dark-register.css` beyond the signature elements.

| Component · aspect         | Pick                                                 | Verdict                                       |
| -------------------------- | ---------------------------------------------------- | --------------------------------------------- |
| register · leave           | brightness(0), scale 0.98, 460 ms ease-in            | outlier-1 (G13)                               |
| register · dialog, toast   | develop flash and scale; a 6 px rise                 | outlier-2 (G3)                                |
| register · nav dropdown    | an opacity fade                                      | outlier-2                                     |
| register · busy bar        | a static hatch                                       | outlier-3 (G11)                               |
| register · spinner         | a plain linear ring in film colours                  | outlier-3 (G12)                               |
| register · skeleton        | misregistration ghosts drifting                      | outlier-4 (G10, G19)                          |
| register · button          | brackets close, film edge from the left              | **the reference** (G14, G15)                  |
| register · headline        | kp-resolve: two wavelengths converge                 | outlier-4 (G19)                               |
| meter · all                | machined channel, oxide film, pressed in the die     | fits (G5, G7); its tone swell: outlier-5 (G8) |
| kpi · shape                | the oscilloscope                                     | outlier-6 (G7: a scope trace)                 |
| kpi · loading, tiles, busy | the ticker baseline                                  | outlier-4                                     |
| kpi · tone                 | the alarm lamp                                       | outlier-5                                     |
| kpi · interactive          | the panel lights                                     | outlier-7 (G15)                               |
| kpi · live                 | the trace flares                                     | outlier-8 (G9)                                |
| tiles · arrival            | switched on (a tube's strike)                        | outlier-1                                     |
| tiles · tone               | the lit chip                                         | outlier-5                                     |
| tiles · hover              | the panel lights                                     | outlier-7                                     |
| tiles · live               | the trace jumps (a needle's jolt)                    | outlier-8                                     |
| header · shape             | the status board, ticker mono title                  | outlier-6                                     |
| header · menu              | scanned open (a lit band sweeps down)                | near G3 (the sweep), the band is a lamp       |
| header · interactive       | the lit chip: rim lights, square glow ring           | outlier-7                                     |
| drawer · all               | the slate panel, slides from the glow, the glow ring | outlier-2, outlier-7                          |
| state · all                | the status lamp, the alarm line, the lamp flares     | outlier-5, outlier-8                          |
| menu button · arrival      | powered up                                           | outlier-1                                     |
| calendar, columns, chart   | hard steps, scope, lit lamps (the console dialect)   | outlier-6                                     |

---

## 3. The outliers

| #         | What                                                                        | Breaks                                   | Strength |
| --------- | --------------------------------------------------------------------------- | ---------------------------------------- | -------- |
| outlier-1 | brightness-to-black leaves, switch-ons, powered-up strikes                  | the pass that lays and takes off (G13)   | ●●●      |
| outlier-2 | develop flashes, rises, fades, slides from a glow                           | swept in from its anchor (G3)            | ●●●      |
| outlier-3 | the static hatch, the plain ring                                            | the line running the track/ring (G11/12) | ●●       |
| outlier-4 | ticker baselines, misregistration ghosts, the two-wavelength headline       | the line sweeping a slot (G10, G19)      | ●●●      |
| outlier-5 | lamps, lit chips, alarm lines, tone swells                                  | the film gone coral (G8)                 | ●●       |
| outlier-6 | status boards, scopes, ticker-mono titles, hard steps (the console dialect) | the instrument's surface and type (G7)   | ●●●      |
| outlier-7 | panels that light, rims, glow rings, spotlights                             | the line resting at the start (G15)      | ●●       |
| outlier-8 | trace flares, needle jolts, lamp flares                                     | one pass over the figure (G9)            | ●●       |

---

## 4. The questions (research/dark-character)

| #   | Question                         | Rule | Options, recommended first                                                                                                 |
| --- | -------------------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve                 | G1   | an even pass, the turn settles · the register's curve (today) · the settle on everything · as today                        |
| 2   | The direction                    | G2   | from the start along the edge · switched on in place (the picks) · from the centre out                                     |
| 3   | Opening what drops from a button | G3   | swept in from its anchor · developed (today) · scanned open by a lit band (the pick)                                       |
| 4   | How long things take             | G4   | one pass: 220 · 660 (+220, +60) · 2400 · brisk 150 · 440 (+150, +40) · 1600 · unhurried 300 · 990 (+330, +90) · 3600       |
| 5   | Where the colour goes            | G5   | the film and meaning · the lit console (the picks) · ink only                                                              |
| 6   | The corners                      | G6   | chamfered on two corners · chamfered on all four · square                                                                  |
| 7   | The surface                      | G7   | near-black, the grid, the film on the edge · the status board (the picks) · the halo on everything                         |
| 8   | A warning                        | G8   | the film gone coral · the alarm lamp (the picks) · the tinted plate                                                        |
| 9   | A live update                    | G9   | one pass over the figure · the trace flares (the picks) · nothing (today)                                                  |
| 10  | Loading                          | G10  | the line sweeps the slot · the ticker baseline (the picks) · the ghosts drift (today)                                      |
| 11  | The busy progress bar            | G11  | the line runs the track · the hatch (today) · the fill breathes                                                            |
| 12  | The spinner                      | G12  | the line runs the ring · the ring turns (today) · the brackets turn                                                        |
| 13  | Leaving and arriving             | G13  | the pass lays, the pass back takes off · to black (today) · powered up and down (the picks)                                |
| 14  | Buttons inside composites        | G14  | exactly dark's own · dark's own on a lit panel · as today                                                                  |
| 15  | Pointing at something            | G15  | the line rests at the start · the panel lights (the picks) · the brackets close                                            |
| 16  | The focus ring                   | G16  | the two-channel ring · a square glow ring (the picks) · as today                                                           |
| 17  | The press                        | G17  | a pass, the edge turns a quarter · the plate dims (today) · the brackets snap shut                                         |
| 18  | The voice                        | G18  | Archivo, the ticker mono for readings · the ticker mono for titles too (the picks) · Archivo everywhere                    |
| 19  | Motifs                           | G19  | the film, the line, the chamfer, the brackets, the grid · plus the lamps and the scope (the picks) · as today (everything) |

**Applied 2026-10-09** (css/dark-register.css, `@property` rules at its top, TIMINGS rows in js/effects.js, `fx-ease` in tokens.json):

- Q1, Q4 curve and times: `fx-ease` is the settle `cubic-bezier(0.22, 1, 0.36, 1)`, `--fx-duration` 220 ms; `--kp-sig-dk-time` 880 ms (pass 660 + settle 220), `--kp-sig-dk-loop` 2400 ms, word stagger 60 ms. Every pass is linear; the film turn runs 0 to 345deg linear, then to 360deg on the settle.
- Q2, Q3, Q13 pass: `kp-sig-dark-sweep` (a three-layer mask over the part's own box and the reach of its halo, left to right) with the line on `::after` (`kp-sig-dark-pass-line`) on dialog, drawer, menu, popover, tooltip, toast, combobox list, date picker, palette and theme menu; the nav dropdown opens the same way and closes by the entrance reversed (`display` is a discrete transition). `[data-kp-leaving]` plays the same pair `reverse forwards`; `--kp-open: reverse-close` stays. Retired: the develop flash, the 6 px rise, the slit, the brightness(0) leave, the darkroom resize develop.
- Q5, Q7, Q19: headline words are laid by `kp-sig-dark-lay` (the two-wavelength resolve is gone), the check tick and radio dot too (their ghosts removed).
- Q6: the panels (menu, popover, toast, lists, nav dropdown) take the card's cut with the halo through it, plus a 1 px diagonal for the cut edge; `.kp-kpi` standing alone is a panel with the film edge.
- Q8: a warning or failed key figure, alert and meter take the tone on the film edge and the figure's ink, plate near-black; `.kp-menu__item--destructive` has a coral edge and ink.
- Q9: `--kp-update: pass`; `[data-kp-updating='pass']` crosses the figure with the line and the letters take the film.
- Q10: the comet (`kp-sig-dark-comet`, a 2 px head and a 36 % tail, 2400 ms) on every waiting surface, the loading meter and a busy button's ground; skeleton lines are crossed 120 ms apart.
- Q11, Q12: the busy bar's fill is a 28 % comet along the empty track; the spinner is five bars (`kp-sig-dark-bars`), 120 ms apart, cut on two corners.
- Q14, Q15, Q17: buttons, icon buttons and menu entries share one manner: a 2 px film line at the start edge on hover, a quarter turn of the film edge on press and the line crossing the face (`kp-sig-dark-tap`). Q16: DI2's ring unchanged.
- The meter: loading is the comet, the share is laid by `kp-sig-dark-meter-lay`, the tone swell is retired for a coral film strip.

---

## 5. Distinct from the other themes

| Aspect  | Dark (recommended)                     | Overlap found, and the difference                                                                                                    |
| ------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Curve   | an even pass, then the turn settles    | formal's pass is even too, but a navy rule with a dead stop; dark's pass lays a film that goes on turning after the line has stopped |
| Arrival | laid by a line crossing                | titanium's wash drifts and never turns; deco's glint runs along a fixed gold; blueprint's pen traces a path; dark's line lays colour |
| Loading | the line sweeping an empty slot        | titanium's cutter mills; light blurs; dark's slot is swept by light and the film behind it turns                                     |
| Live    | one pass over the figure               | nostromo's readout refreshes; cyberpunk glitches; dark's figure takes the film through its letters once                              |
| Hover   | the line resting at the start          | cyberpunk's cursor blinks; dark's line stands still and glows                                                                        |
| Surface | near-black with a grid and a film edge | terminal is phosphor on black; nostromo amber on black; dark has no hue of its own, only the film on an edge                         |
| Motifs  | film, line, chamfer, brackets, grid    | titanium shares the chamfer and the pointer-turned gradient (a heat tint on metal); dark's film is a slice of spectrum on black      |
