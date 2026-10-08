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

| When             | Where                               | Decision                                                                                                                                                                                                                 |
| ---------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-10-07 02:54 | the Homelab project thread          | **The network graph changes in no theme.**                                                                                                                                                                               |
| 2026-10-08       | research/deco-anchor, review dialog | **The anchor = The fan opens** (option 1, recommended): a crest of gold rays folded to a point opens ray by ray from one side to the other, and folds back; the fan deco's buttons already carry opens behind the label. |
| 2026-10-08       | the same verdict                    | **The progress bar is to be redone** ("I'm really not a fan of the progress bar btw, that needs to be redone for sure"): the fluted pennant with its emerald lozenge goes; question 11 asks for its replacement.         |

What Kenny has not decided and research/deco-character asks: the grammar's
parameters (curve, direction, opening, durations, colour, corners, surface,
type, motifs), how the fan carries to a warning, a live update, loading, the new
progress bar, the spinner, leaving and arriving, the composites, hover, focus
and the press.

---

## 1. The deco grammar (proposed)

Deco is **the lobby of 1925**: flat gold on blue-black lacquer, an emerald and a
ruby as jewels, capitals tracked wide, double rules, the chevron and the
lozenge, corners cut and never rounded. The anchor says what the lobby does:
it **fans open**. A crest of rays folded to a point opens ray by ray from one
side to the other and folds back the same way. Everything that happens on
screen is a fan: it **opens from a point, is counted ray by ray, folds shut**.
Nothing fades, nothing slides, nothing rises; gold is never a gradient, and a
fan is counted, never smeared.

| #   | Rule                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | **A fan opens ray by ray.** Every one-shot motion is counted: a fan of n rays opens one ray per step (`steps(n, jump-end)`, 40 ms a ray), a plate opens as its fan does; a close is the same steps backwards (`steps(n, jump-start)`). Never a smooth sweep, never the register's Material curve, never a spring. A colour change keeps the 160 ms transition.                                                                                                               |
| G2  | **From a point outward.** A fan opens from its base point up and out to both sides; a group opens from its centre to both ends (the middle first, then one on each side, alternating); a line is lit from its start as a fan of rays would be from its first ray. Nothing rises from a foot, nothing falls, nothing comes from a corner except a fan from its base.                                                                                                          |
| G3  | **What opens fans open from its anchor.** A menu fans open from its button's base point (rays first, then the plate behind them, counted); a dialog fans open from the base of its crest (the sun rising, as today, but counted ray by ray); a tooltip from its notch; both fold shut the same way. The toast's and the tooltip's centre-line clip are retired.                                                                                                              |
| G4  | **Durations: one fan.** Contact 160 ms (`--fx-duration`). A fan of 12 rays: 480 ms (40 ms a ray). A plate behind its fan: +160 ms. A group: 80 ms apart from the centre out. A loop (the spinner's fan opening and folding, the busy bar): 2400 ms.                                                                                                                                                                                                                          |
| G5  | **Gold acts, flat; emerald marks; ruby warns; ivory reads.** `--primary` is every rule, ray, act and pick, always flat; `--accent` (emerald) is the jewel on what is current or done (the head, the picked day, the switch on); `--destructive` (ruby) warns on a plate with ivory ink; ivory `--foreground` is every word. No gradient on gold, no glow but the lamps' (and they are retired).                                                                              |
| G6  | **Corners cut, ends in lozenges.** Plates (cards, dialogs, menus, tiles) have radius 0 and one corner bitten as a chevron (the cartouche's bite); small parts (tags, the change, the tooltip, the bar's head) end in a lozenge point; the stepped ziggurat notch stays the tooltip's alone.                                                                                                                                                                                  |
| G7  | **Lacquer, the double rule, one crest.** The ground is blue-black lacquer with the chevron lattice felt and not seen; what matters (a dialog, a header, a certificate) carries the `3px double` gold rule; a title may stand under one small sunburst crest; nothing else is ornamented (no sunburst behind every figure, no setbacks behind every plate).                                                                                                                   |
| G8  | **A warning is the gilt notice.** A warning or failed figure sits on a plaque ringed twice in gold in the tone's colour (ruby for a failure, the warning plate for a warning) with ivory ink, its change on a lozenge-ended tag; the plate behind it stays lacquer. Never a tinted sunburst, never a frame all round in gold.                                                                                                                                                |
| G9  | **A live update is one flash of the fan.** Behind the changed figure a small fan opens ray by ray and folds (480 ms open, 480 ms fold); the figure never moves, swells or flares. Not the gilded flare (the picks), not the glint.                                                                                                                                                                                                                                           |
| G10 | **Loading is a fan opening and folding.** On every waiting surface a crest of rays opens from the surface's foot-centre ray by ray and folds, and opens again (the chart's and the key figure's pick, carried everywhere); the skeleton's lines are lit ray by ray from the start. Not the glint (the picks), not the bulbs.                                                                                                                                                 |
| G11 | **The progress bar is a fan laid flat.** The pennant is retired. The track is a row of thin gold rays (a fan laid along a line, each ray a lozenge-ended stroke at 22 %); the share lights the rays one by one from the start (counted), the head is the last lit ray's lozenge in emerald; busy = the rays light across and fold back, 2400 ms. The alternatives in the demo: a flat band with a chevron tip on the double-rule track, the lift's lamps, the stepped tiers. |
| G12 | **The spinner is a fan that opens and folds.** A crest of 12 rays opens ray by ray and folds ray by ray, round a gold centre dot, 2400 ms a loop; it never rotates (today's rotating sunburst is retired).                                                                                                                                                                                                                                                                   |
| G13 | **Arriving fans open from its base, leaving folds to it.** A part arrives as a fan opening from its base point: its rays first (a crest or, on a plate without one, the plate itself counted in vertical pleats from its centre out), then it stands; it leaves folding to the point, the same steps backwards. The register's `scaleX(0)` fold stays as the pleat count's picture, counted.                                                                                 |
| G14 | **An element inside a composite is deco's own element.** A button in a header, menu, drawer, tile or alert hovers, focuses and presses exactly like deco's `.kp-button`; a menu entry like `.kp-menu__item`; a link like its link.                                                                                                                                                                                                                                           |
| G15 | **Pointing opens the fan behind the label.** Hover is the register's gap-4 (the rays from the lower-left corner, counted now, not faded); a menu entry's fan opens from its start edge; a link gains its overline. No glint, no bulbs, no lift.                                                                                                                                                                                                                              |
| G16 | **Focus is DI2's two-channel ring**, a system constant.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| G17 | **A press opens the fan fully and holds it.** The fan behind the label opens all its rays and the face takes `--secondary-active` (gold at 8 % on a primary button: `--primary-active`); release folds the fan. Nothing moves.                                                                                                                                                                                                                                               |
| G18 | **Poiret One capitals for titles, Josefin for the rest.** Titles and the words on a crest in Poiret One uppercase tracked 0.16 em; figures in Josefin Sans 600 tabular; labels in Josefin uppercase tracked 0.08 em; prose in Josefin; monospace only for identifiers.                                                                                                                                                                                                       |
| G19 | **Motifs: the fan, the double rule, the lozenge, the chevron.** The fan where something happens, the double rule on what matters, the lozenge as a point and a jewel, the chevron as a corner's bite; the setbacks stay the tooltip's notch; the marquee bulbs, the curtain and the glint are retired.                                                                                                                                                                       |
| G20 | **Every animation sits under `prefers-reduced-motion: no-preference`;** the reduced pose is the fan open.                                                                                                                                                                                                                                                                                                                                                                    |
| G21 | **The network graph is never a target** (Kenny, 2026-10-07 02:54).                                                                                                                                                                                                                                                                                                                                                                                                           |

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
