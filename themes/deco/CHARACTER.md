# Art Deco — character

The reference for how deco looks and moves, derived from its anchor. Read the
grammar before adding or changing any deco component; the inventory and the
outliers record where the decided picks (2026-10-05 … 2026-10-07) stand against
it, and the questions (research/deco-character) are the plan to bring them in
line. Kenny picked the anchor on 2026-10-08 in research/deco-anchor and added
that the progress bar is to be redone; the grammar below is proposed from the
anchor and goes to him question by question, the bar among them.

Sources measured (2026-10-08): every `research/character-*/decided.json` pick
for deco resolved to its option, `css/deco-register.css` (2305 lines, layers
`kp.register` and `kp.signature`), `css/themes.css` and `css/_rules.css`
(deco's tokens, `--fx-ease` `cubic-bezier(0.4, 0, 0.2, 1)` at 160 ms, the gold
chevron lattice at 0.05), `js/motion.js` (`--kp-open: reverse-close`), the
families page (deco still open there), `themes/deco/anatomy.md` ("gold as a flat
colour reads as Deco; gold as a gradient reads as a casino") and
research/deco-anchor.

---

## 0. Decided before this analysis (Kenny)

| When             | Where                                             | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-07 02:54 | the Homelab project thread                        | **The network graph changes in no theme.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 2026-10-08       | research/deco-anchor, review dialog               | **The anchor = The fan opens** (option 1, recommended): a crest of gold rays folded to a point opens ray by ray from one side to the other, and folds back; the fan deco's buttons already carry opens behind the label.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2026-10-08       | the same verdict                                  | **The progress bar is to be redone** ("I'm really not a fan of the progress bar btw, that needs to be redone for sure"): the fluted pennant with its emerald lozenge goes; question 11 asks for its replacement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 2026-10-08       | research/deco-character, review dialog            | **Six questions picked, thirteen not approved.** Picked: How long things take = One fan: 160 · 480 (+160, +80) · 2400 ms; The surface = Lacquer, the double rule, one crest; A live update = Gilded: a flare; The spinner = The sunburst rotates (today); The focus ring = A double gold ring; The voice = Poiret capitals, Josefin figures. Not approved (one comment on all thirteen: curve, direction, opening, colour, corners, warning, loading, the bar, leave, composites, hover, press, motifs): "I don't like this direction at all, you should take a look at what art deco represents again, this should be the fancy, distinguished theme, with lots of gold accents and fancy blue backgrounds (maybe even with a background wallpaper style like it already has for most pages), it should exhume elegance without being too 'in your face'". Update 1 of research/deco-character redoes the thirteen in that direction; the six picks stay ticked. |
| 2026-10-09       | research/deco-character, review dialog (update 3) | **All nineteen questions approved after update 3** (research/deco-character/decided.json): loading = lift doors, the bar = the inlay doubled, the corners = a cove, leaving and arriving = a great fan, the rest as listed there. The grammar is proposed from these picks next; it is applied to css/deco-register.css (see the Applied note in §4).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

Open after 2026-10-08: the thirteen questions Kenny did not approve go round again in update 1 of research/deco-character, in the direction he gave (restrained elegance: thin gold on deep blue lacquer with the wallpaper, nothing counted or shouted); the grammar in §1 is to be re-proposed from that update, keeping the six picks.

---

## 1. The deco grammar (decided 2026-10-09)

Deco is **the grand lobby of 1925 after the lights go down**: deep blue lacquer
with the chevron wallpaper behind every plate, gold as hairlines and small jewels
(shaded, never a flat fill: a highlight, the gold, a bronze shade), ivory type,
symmetry, slow motion on the settle, nothing loud. The anchor says what the
lobby does: it fans open. Everything that happens on screen is drawn as inlay
and fan: a plate's gold inlay draws itself, the lacquer comes up, and what
leaves or arrives is covered by one great fan.

| #   | Rule                                                                                                                                                                                                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| G1  | **The curve is the settle**, `cubic-bezier(0.22, 1, 0.36, 1)`: quick to start, long to settle, the way a hand opens a fan. A close is the same frames backwards (js/motion.js plays an arrival's keyframes in reverse; an eased close written by hand runs on `cubic-bezier(0.64, 0, 0.78, 0)`).                                           |
| G2  | **From the centre to both sides.** A plate's inlay draws from the middle of its top edge round both ways and meets at the bottom; a group comes from its middle outward in pairs 80 ms apart.                                                                                                                                              |
| G3  | **Opening: the inlay draws itself, the lacquer comes up.** Dialog, menu, popover, tooltip, toast, drawer and tour card: the gold frame draws (320 ms; the tooltip's from its lozenge), then the lacquer, wallpaper and words come up (160 ms). The close: the lacquer sinks, the inlay undraws.                                            |
| G4  | **One fan of time:** contact 160 ms, an arrival 480 ms (draw 320 + up 160), a group 80 ms apart, a leave 720 ms, a hover 320 ms, a press 160 ms, a loop 2400 ms.                                                                                                                                                                           |
| G5  | **Gold is a line and a jewel, blue is the ground, ivory reads.** Every plate is lacquer with the wallpaper at 8 %; gold is the inlay, the double rule, the head, the picked day's ring and a lozenge; the one primary button is solid gold with lacquer ink; emerald marks what is on or done; ruby is a hairline and a word on a failure. |
| G6  | **Corners are coves.** Each corner is a concave quarter circle (10 px; 5 px on a button, tag or tooltip), two gold hairlines 3 px (2 px) apart follow the cove and the straight edges, a tiny bead in each hollow.                                                                                                                         |
| G7  | **Lacquer, the double rule on what matters** (a dialog's title, a page header), no crest; a plain card, tile or menu is lacquer with its inlay.                                                                                                                                                                                            |
| G8  | **A warning is the figure in ruby with a gold rule under it** (key figure, trend tile, destructive entry, the alert's word); the plate stays lacquer, the inlay gold.                                                                                                                                                                      |
| G9  | **A live update is gilded:** the figure flares gold, swells once and settles (`--kp-update: gilded`).                                                                                                                                                                                                                                      |
| G10 | **Loading is lift doors:** two lacquer halves with panels and a lozenge handle meet at a gold double hairline down the part, part by a third and close, 2400 ms, the wallpaper running across both; on every waiting surface.                                                                                                              |
| G11 | **The progress bar is the inlay doubled:** two hairlines 3 px apart, a lozenge at each end, the share a heavier line between them, the head a larger lozenge with a fan of nine rays; busy: a glint with an afterglow runs between the lines.                                                                                              |
| G12 | **The spinner is the sunburst turning** (3.6 s, linear), as the register had it.                                                                                                                                                                                                                                                           |
| G13 | **Leaving and arriving: a great fan.** Gold ribs and satin panels with a gold-braid edge open over the part, hide it, and fold away rib by rib from the left; a part arrives as that backwards. Closed it is a pointed shape at the bottom centre, then nothing.                                                                           |
| G14 | **Composites:** every button, link and entry inside a header, menu, tile, drawer or tour is deco's own, as it stands alone.                                                                                                                                                                                                                |
| G15 | **Pointing warms with gold leaf:** a wash of gold at 9 % with a grain fades in over 320 ms, the hairline to full gold, the label to champagne.                                                                                                                                                                                             |
| G16 | **Focus is a 3 px double gold ring**, and wins over hover.                                                                                                                                                                                                                                                                                 |
| G17 | **A press is a seal in wax:** the plate sinks 1 px (inner shadow, a highlight), one fine gold ring ripples out and fades in 400 ms; release rises.                                                                                                                                                                                         |
| G18 | **Poiret One capitals for titles, Josefin for the rest:** figures Josefin 600 tabular, labels uppercase tracked 0.08 em, monospace for identifiers.                                                                                                                                                                                        |
| G19 | **Motifs:** the wallpaper, the stepped/coved inlay, the double rule, the lozenge as a point, a jewel and a divider's centre; the fan only where something happens. No crest, sunburst, bulbs, setbacks or curtain.                                                                                                                         |
| G20 | **Every animation sits under `prefers-reduced-motion: no-preference`;** the finished pose is the base (doors stand parted by a third, the inlay drawn).                                                                                                                                                                                    |
| G21 | **The network graph is never a target** (Kenny, 2026-10-07 02:54).                                                                                                                                                                                                                                                                         |

---

## 2. The decided picks against the grammar

Only the meter is in `css/deco-register.css` beyond the signature elements.

| Component · aspect                     | Pick                                             | Verdict                                                    |
| -------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| register · hover                       | the fan opens (faded in)                         | **the anchor** (G15); the fade: outlier-1 (G1)             |
| register · dialog                      | the sun rises: the crest fans, the panel unfolds | fits in picture (G3); smooth: outlier-1                    |
| register · leave                       | scaleX(0) and fade                               | the pleat's picture; the fade: outlier-1 (G13)             |
| register · toast, tooltip              | open from the centre line                        | outlier-2 (G3)                                             |
| register · progress bar                | the fluted pennant, emerald lozenge, chevrons    | **to be redone** (Kenny), outlier-3 (G11)                  |
| register · spinner                     | the sunburst rotates                             | outlier-4 (G12)                                            |
| register · skeleton                    | lozenge strips open from the centre              | fits in picture; smooth: outlier-1                         |
| register · press                       | a colour step                                    | outlier-5 (G17)                                            |
| meter · all                            | the lift's lamps, fanfare, gilt sweep            | lamps: outlier-6 (G19 retires lamps); the sweep: outlier-1 |
| chart · loading                        | the fan rays                                     | **the reference** (G10)                                    |
| chart · arrival                        | rises like a skyline                             | outlier-7 (G2)                                             |
| chart · events                         | gilt cabochons                                   | fits (G5)                                                  |
| calendar · arrival                     | the fan opens                                    | fits                                                       |
| calendar · loading, columns, menu, kpi | a glint runs                                     | outlier-8 (G10)                                            |
| calendar · today                       | sunburst behind the figure                       | outlier-9 (G7)                                             |
| graph · all                            | the marquee, ziggurat steps, curtain up          | never a target                                             |
| trend · shape, tiles                   | the skyscraper setbacks                          | outlier-9                                                  |
| trend · loading                        | the setback climbs                               | outlier-8                                                  |
| trend · arrival, header, busy          | the curtain rises                                | outlier-7                                                  |
| trend · tone, kpi, tiles               | the gilt notice, gold-framed plaque              | **the reference** (G8)                                     |
| trend · live, kpi                      | gilded: a flare                                  | outlier-10 (G9)                                            |
| columns · live                         | a gold underline grows                           | outlier-10                                                 |
| menu · open                            | unveiled: a gold sweep from the top              | outlier-2                                                  |
| menu · interact, tiles                 | the bulbs chase / light                          | outlier-6                                                  |
| drawer · open, next                    | unfolds like a fan, refolds                      | fits                                                       |
| kpi · loading                          | the sunburst opens                               | fits (G10)                                                 |
| tiles · loading, busy                  | the bulbs chase                                  | outlier-6                                                  |
| state · all                            | the sunburst chip, a bulb lights                 | outlier-6, outlier-9                                       |

---

## 3. The outliers

| #          | What                                                       | Breaks                                  | Strength |
| ---------- | ---------------------------------------------------------- | --------------------------------------- | -------- |
| outlier-1  | the Material curve on every motion, the fan faded in       | a fan opens ray by ray (G1)             | ●●       |
| outlier-2  | the centre-line clips, the gold sweep from the top         | fans open from its anchor (G3)          | ●●●      |
| outlier-3  | the fluted pennant with its emerald lozenge                | Kenny: redo it (G11)                    | ●●●      |
| outlier-4  | the sunburst rotates                                       | the fan opens and folds (G12)           | ●●       |
| outlier-5  | the press is a colour step                                 | the fan opens fully (G17)               | ●●       |
| outlier-6  | marquee bulbs on five components; the lift's lamps         | the bulbs retired (G19)                 | ●●●      |
| outlier-7  | skylines, curtains and setbacks rising                     | from a point outward (G2)               | ●●●      |
| outlier-8  | the glint runs on four components; the setback climbs      | loading is a fan (G10)                  | ●●●      |
| outlier-9  | sunbursts behind every figure, setbacks behind every plate | one crest, nothing else ornamented (G7) | ●●       |
| outlier-10 | gilded flares and growing underlines                       | one flash of the fan (G9)               | ●●       |

---

## 4. The questions (research/deco-character)

| #   | Question                         | Rule | Options, recommended first                                                                                                 |
| --- | -------------------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve                 | G1   | ray by ray, counted · one smooth sweep · the register's curve (today)                                                      |
| 2   | The direction                    | G2   | from a point outward, groups from the centre · rising from the foot (the picks) · start → end                              |
| 3   | Opening what drops from a button | G3   | fans open from its anchor · the curtain rises (the picks) · as today (the centre line, the sunrise)                        |
| 4   | How long things take             | G4   | 160 · 480 (+160, +80) · 2400 · brisk 120 · 320 (+100, +50) · 1600 · grand 200 · 720 (+240, +120) · 3600                    |
| 5   | Where the colour goes            | G5   | gold acts flat, emerald marks, ruby warns · gold with a glint (the picks) · gold and ivory only                            |
| 6   | The corners                      | G6   | cut corners, lozenge ends · stepped ziggurat corners · all square                                                          |
| 7   | The surface                      | G7   | lacquer, the double rule, one crest · a sunburst behind every figure (the picks) · setbacks behind every plate (the picks) |
| 8   | A warning                        | G8   | the gilt notice · a tinted sunburst (the state's pick) · framed all round in gold                                          |
| 9   | A live update                    | G9   | one flash of the fan · gilded: a flare (the picks) · the glint (the picks)                                                 |
| 10  | Loading                          | G10  | a fan opens and folds · the glint runs (the picks) · the bulbs chase (the picks) · the skeleton's strips (today)           |
| 11  | The progress bar, redone         | G11  | a fan laid flat · a flat band with a chevron tip · the lift's lamps · stepped tiers (· the pennant, today, for reference)  |
| 12  | The spinner                      | G12  | a fan opens and folds · the sunburst rotates (today) · the lift's lamps round                                              |
| 13  | Leaving and arriving             | G13  | fans open from its base, folds to it · folds flat (today) · the curtain (the picks)                                        |
| 14  | Buttons inside composites        | G14  | exactly deco's own · deco's own on a gilt plaque · as today                                                                |
| 15  | Pointing at something            | G15  | the fan opens behind the label · the gilded edge (the picks) · the bulbs light (the picks)                                 |
| 16  | The focus ring                   | G16  | the two-channel ring · a double gold ring · as today                                                                       |
| 17  | The press                        | G17  | the fan opens fully · the fan folds shut · a colour step (today)                                                           |
| 18  | The voice                        | G18  | Poiret capitals, Josefin figures · Poiret figures too · Josefin everywhere                                                 |
| 19  | Motifs                           | G19  | the fan, the double rule, the lozenge, the chevron · plus the bulbs and the setbacks (the picks) · as today (everything)   |

**Applied 2026-10-09** (css/deco-register.css, `kp.register` and `kp.signature`, tokens
`--kp-sig-deco-*`; `fx-ease` in themes/deco/tokens.json; Kenny approved all nineteen picks of
research/deco-character on 2026-10-09):

- **Q1, Q4 (curve, durations): applied.** `fx-ease` is the settle `cubic-bezier(0.22, 1, 0.36, 1)`
  (the generated css/themes.css follows when the designer regenerates), `fx-duration` stays 160 ms.
  Tokens: contact 160, draw 320, up 160, arrive 480, leave 720, hover 320, press 160, loop 2400 ms;
  the settle's point reflection is `cubic-bezier(0.64, 0, 0.78, 0)`.
- **Q2, Q3 (direction, opening): applied.** One keyframe set, `kp-sig-deco-arrive`, animates two
  registered numbers: `--kp-sig-deco-draw` (a conic mask round the plate's `::after`, from the middle of
  the top edge, 320 ms) then `--kp-sig-deco-up` (lacquer, wallpaper and words, 160 ms); per-segment
  settle easing, no timing function of its own, so js/motion.js plays it backwards as the close
  (`--kp-open: reverse-close`). On `.kp-dialog` (720 ms unopened, 480 ms open, so the close it reads is
  480), `.kp-menu-button > .kp-menu`, `.kp-popover[popover]`, `.kp-tooltip` (inlay from its lozenge),
  `.kp-toast`, `dialog.kp-drawer[open]`, `.kp-tour[open]` and the picker panels. The scaleX fold, the
  circle-free sunrise, the centre-line clips and the dialog crest are gone.
- **Q5, Q6, Q7, Q19 (colour, corners, surface, motifs): applied.** One rule on every plate (`.kp-card`,
  `.kp-kpi`, `.kp-alert`, `.kp-empty`, `.kp-grid__tile`, dialog, popover, menu, toast, tour, drawer,
  picker panels): lacquer (`--kp-sig-deco-lac`) with the wallpaper, the cove as a mask on the plate (the
  box and 24 px round it kept, four quarter circles taken out), 20 layers of hairlines, arcs and beads on
  `::after` (kept once in `--kp-sig-deco-hair`, drawn on a button's own background too). Buttons, icon
  buttons, tags and badges take the small cove. Tone toasts keep their plates and ink; alerts are lacquer
  with the label in the tone's colour; the dialog title and the page header take `3px double`; the empty
  state and dialog crests, the stepped tooltip notch and the toast chevron are replaced (a lozenge).
- **Q8 (warning): applied.** `.kp-kpi[data-kp-tone]` (and the trend tile), `.kp-menu__item--destructive`
  and `.kp-alert--warning|destructive` set the figure or word in `--destructive` with a 1 px gold
  underline; the package's start edge and plate under the figure are off.
- **Q9 (live): applied** as `--kp-update: gilded`, `[data-kp-updating='gilded']`, `kp-sig-deco-gilded`
  (gold, drop shadow, scale 1.1, one second).
- **Q10 (loading): applied** on `.kp-skeleton` (line, block, circle), `.kp-card[aria-busy]`, busy tiles,
  `.kp-kpi[aria-busy]`, `.kp-datatable__busy-panel`, loading days, loading meters, the loading menu
  entry and the busy button: `::before` and `::after` are the two doors, `kp-sig-deco-doors` turns
  `--kp-sig-deco-p` (parted 0 to 1, 2400 ms). Reduced motion: parted by a third.
- **Q11, Q12 (bar, spinner): applied.** `.kp-progressbar`: track, fill, head as the double inlay in the
  three sizes (`--kp-sig-deco-s`), busy `kp-sig-deco-glint`; `.kp-meter` is a hairline with a hollow
  lozenge mark. The spinner is unchanged (rotating sunburst, 3600 ms).
- **Q13 (leave): applied.** `[data-kp-leaving]` on a card, key figure, alert, empty state or tile:
  `kp-sig-deco-fan` (720 ms) turns `--kp-sig-deco-a1`, `-a2` (the two guard sticks) and hides the part
  once covered; the fan is the part's `::before` (satin pleats, guards, pivot) and `::after` (leaf,
  braid, sticks), present only while `[data-kp-leaving]` or `[data-kp-arriving]` is set, faded out with
  `--kp-sig-deco-v` in the last frame. Any other part folds away through the fan's sector as a mask
  (`kp-sig-deco-wipe`). Arrival is js/motion.js playing it backwards.
- **Q14 to Q17 (composites, hover, focus, press): applied** to `.kp-button`, `.kp-icon-button`,
  `.kp-menu__item`, `a.kp-kpi`, `.kp-kpi--toggle`, the trend tile with its link and `.kp-calendar__day`:
  `--kp-sig-deco-hv` and `--kp-sig-deco-pr` transition 320 and 160 ms (settle in, inverse out); leaf on
  `::before` with a grain mask, ring (`kp-sig-deco-seal`) on `::after`; focus `3px double` gold.
- **Q18 (voice): applied.** Titles Poiret caps tracked 0.16 em, figures Josefin 600 tabular, alert labels
  Josefin caps 0.08 em.
- **Gates:** every new keyframe has its TIMINGS row (js/effects.js) and OUT_OF_SCOPE line
  (gates/check-motion.mjs); `kp-sig-deco-meter-pos`, `-leave`, `-deco-open`, `-centre`, `-sunrise`,
  `-deco-fan` and `kp-progressbar-deco-ascent` are removed.

---

## 5. Distinct from the other themes

| Aspect  | Deco (recommended)                                 | Overlap found, and the difference                                                                                  |
| ------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Curve   | counted ray by ray in steps                        | terminal, nostromo and cyberpunk step too; deco's steps are rays of one fan, and a plate opens behind its fan      |
| Opening | fans open from its anchor's base point             | forest grows out of its anchor (clipped); deco's rays appear one by one and the plate follows                      |
| Loading | a fan opens and folds                              | solstice's sun is a disc on an arc; deco's fan is a crest of straight rays that never travels                      |
| Bar     | a fan laid flat, rays lit one by one               | brutalism's ruled bar counts ten steps in ink; deco's are gold rays with a lozenge point                           |
| Live    | one flash of the fan                               | synthwave's laser flares under the value; deco's fan opens behind it, counted                                      |
| Motifs  | the fan, the double rule, the lozenge, the chevron | sepia's dinkus is three lozenges in a row (dropped); grotesk's one red disc; deco's lozenge is a jewel set in gold |
