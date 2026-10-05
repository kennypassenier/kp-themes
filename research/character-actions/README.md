# Action columns of their own, per theme

Kenny, 2026-10-05: "doe voort aan het project", after character-attention —
the ninth component of the character round, all 22 themes in one demo
judged through the review kit. The meter, the time chart, the month
heatmap, the network graph, the trend tile, the key-figure strip, the
dashboard tiles and the attention band came first; this is action columns,
a list's row buttons that share columns (`.kp-action-list`, `.kp-row-actions`,
`js/actions.js`, scope-143).

`js/actions.js` lays every row's buttons onto shared columns: a button of
one role starts at one edge and has one width on every row, whatever its
label, and a row that lacks a role leaves that column empty.
`.kp-action-list` is a CSS subgrid, so the browser sizes the columns;
`attachActionColumns()` only names each button's column and the list's
count (and, for a table, measures each role's widest button). This demo
does not touch `js/actions.js`; every option only restyles the list from
the theme's tokens, in the theme's own `kp.signature` layer
(`actions.css`).

## Structure (one pick per aspect, as the meter, the trend tile and the

attention band)

Nothing is bundled: per theme the list has five aspects, each picked on
its own from three options, and any combination composes on the cell
wrapping the list (`[data-ac-cell]`, which also carries the list
`[data-ac]` and the loading panel `.ac-loading-panel`).

| Aspect      | Attribute             | What it covers                                                                                    |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| Shape       | `data-ac-shape`       | the row, the divider, the column rail and the primary button at rest                              |
| Loading     | `data-ac-loading`     | the picture shown in place of the rows while the list is still loading; always moves, never fades |
| Arrival     | `data-ac-arrival`     | what a new row does as it joins the list, and the mirror of that on its way out (`leave()`)       |
| Tone        | `data-ac-tone`        | how the primary column and a destructive action read beside an ordinary one                       |
| Interactive | `data-ac-interactive` | the rail's answer to hover and keyboard focus                                                     |

Shape is first, as every character-round demo keeps it; loading, arrival
and tone follow the components that already have them (the trend tile,
the attention band); interactive is new to this component because its
whole point — a list of buttons — is to be pressed, so how the rail
answers the pointer and the keyboard is its own aspect, not folded into
shape.

Every rule in `actions.css` names one aspect only, so any of the
3<sup>5</sup> combinations composes without a special case; a theme's
register drops the `[data-ac…]` parts of every selector, same as
`trends.css` and `attention.css`. Arrival and leave mirror each other
option for option (an arrival's leave is its reverse, played on
`[data-kp-leaving]` through `js/motion.js`'s own `leave()`); the loading
picture always animates at full motion and stands still under reduced
motion; nothing anywhere touches `opacity` in a keyframe.

## All 22 themes bespoke

Every theme has its own pass over the five aspects now (formal and
titanium from the characters this round already gave them elsewhere; the
other twenty from their group's own pass, built the same way: one rule
names one aspect, tokens only, nothing fades, arrival and leave mirror
each other, the loading picture always runs at full motion and stands
still under reduced motion). The four groups' options were merged into
`demo.js`'s `THEME_IDEAS` and the `ideas-a.json` … `ideas-d.json` files
removed; there is no GENERIC fallback left in the demo data.

- **a** — light, dark, cyberpunk, synthwave, pastel
- **b** — terminal, forest, high-contrast, sepia, blueprint
- **c** — solstice, brutalism, deco, phantom, shade-light
- **d** — shade-dark, retro, grotesk, lapis, nostromo

## The IDEAS table, all 22 themes

Three named options per aspect, per theme.

| Theme         | Shape 1 / 2 / 3                                                       | Loading 1 / 2 / 3                                                    | Arrival 1 / 2 / 3                                      | Tone 1 / 2 / 3                                              | Interactive 1 / 2 / 3                                       |
| ------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------- |
| formal        | The engraved ledger row / The annual report row / The certificate row | The dotted leader / The ledger is ruled / The seal is pressed        | Unrolled / Stamped in / Entered in the ledger          | The engraved tone / The ledger tone / The certificate tone  | The pressed plate / The traced rule / The lifted seal       |
| titanium      | The milled rail / The instrument rail / The anodised rail             | The cutter runs / The knurl rolls / The lathe turns                  | Seated / Milled in / Clicked in                        | The machined tone / The alarm tone / The anodised tone      | The warmed plate / The lit groove / The chamfered edge      |
| light         | The pinned rail / The ruled memo rail / The sun-flag rail             | The pencil marches / The sun sweeps / The shadow turns               | Unfurls / Catches the light / Pinned down              | The sun-tinted edge / The stamped tone / The banded top     | The warmed paper / The traced rule / The lifted corner      |
| dark          | The status rail / The panel gauge rail / The OLED chip rail           | The scanline marches / The gauge sweeps / The LED pulses             | Powers up / Scans in / Locks in                        | The LED edge / The lit lamp / The glow bar                  | The warmed panel / The lit groove / The raised bezel        |
| cyberpunk     | The neon rail / The glitch rail / The holo rail                       | The scanline marches / The glitch sweeps / The ping pulses           | Boots onto the HUD / Glitch-snaps in / Rezzes in       | The chromatic edge / The lit core / The glow bar            | The lit rail / The traced edge / The ping focus             |
| synthwave     | The horizon rail / The VCR rail / The marquee rail                    | The grid scrolls / The scanline sweeps / The marquee chases          | Rises over the horizon / Tracks in / Lights up         | The sunset edge / The lit sign / The marquee band           | The lit horizon / The traced grid / The chasing focus       |
| pastel        | The sticker rail / The washi rail / The cloud rail                    | The stitches march / The wash sweeps / The bubble breathes           | Floats in / Peels on / Pops in                         | The crayon edge / The candy dot / The ribbon band           | The warmed sticker / The traced ribbon / The bouncy focus   |
| terminal      | The prompt row / The man-page rail / The curses panel                 | The cursor blinks / Lines scroll past / Static snows                 | Printed / Paged in / Scrolled up                       | The ANSI tone / The bell tone / The flagged tone            | The cursor row / The reverse-video rail / The echoed rail   |
| forest        | The trail markers / The ranger's clipboard / The contour rail         | Fog rolls across / Leaves drift / The compass spins                  | Blazed in / Crested the ridge / Pressed like a leaf    | The blazed tone / The waypoint tone / The canopy tone       | The pressed trail / The lit clearing / The blazed edge      |
| high-contrast | The framed rail / The inverse rail / The signal rail                  | The strobe bar / The signal flashes / The marching frame             | Snapped in / Framed in / Barred in                     | The inverse tone / The signal tone / The framed tone        | The inverted row / The barred row / The framed button       |
| sepia         | The letterpress row / The ticket stub rail / The barograph rail       | Ink bleeds / The quill writes / The stub is punched                  | Inked in / Pressed / Torn in                           | The letterpress tone / The ticket tone / The barograph tone | The warmed page / The traced line / The pressed corner      |
| blueprint     | The ruled rail / The title block / The grid rail                      | The pen plots / Grid lines scroll / The dimension ticks march        | Drafted in / Plotted in / Ruled in                     | The inked tone / The dimensioned tone / The stamped tone    | The traced rail / The lit grid / The snapped corner         |
| solstice      | The horizon rail / The ember rail / The rising rail                   | The sun crawls the horizon / The embers breathe / The light swings   | Rises over the horizon / Kindles / Drifts in on embers | The glowing tone / The banked tone / The risen tone         | The warmed row / The kindled edge / The lifted ember        |
| brutalism     | The slab rail / The sticker-sheet rail / The poster-block rail        | The stamp lands / The poster peels / The sticker hops                | Slams in / Stamped flat / Shoved in                    | The offset tone / The branded tone / The torn tone          | The pressed slab / The marked edge / The raised block       |
| deco          | The gilt-frame rail / The marquee rail / The skyscraper rail          | The marquee bulbs chase / The sunburst opens / The spotlight sweeps  | Unveiled / Lit in / Ascends                            | The gilt tone / The marquee tone / The spotlight tone       | The lit frame / The chasing bulbs / The elevated marquee    |
| phantom       | The evidence-card rail / The calling-card rail / The ransom-note rail | The stamp lands / The calling card is punched / The string is pulled | Slapped down / Punched in / Snipped in                 | The stamped tone / The punched tone / The ransom tone       | The inked press / The traced perforation / The snipped edge |
| shade-light   | The pencil-shaded rail / The leaf-shade rail / The window-light rail  | Pencil in the shade / The leaf shade drifts / Leaves sway            | Drawn in / Shaded in / Lit in                          | The traced tone / The dappled tone / The lit tone           | The warmed page / The pencil trace / The lit edge           |
| shade-dark    | The glow rail / The gauge rail / The halo rail                        | The ember line / The drifting pool / The pulsing halo                | Lamp swings in / Glow blooms / Flickers in             | The glowing edge / The halo button / The underlit band      | The warmed glow / The lit filament / The raised lamp        |
| retro         | The dialog rail / The status rail / The title rail                    | The marquee rail / The scanning block / The hourglass flip           | Pops open / Slides in off-screen / Boots up            | The beveled edge / The beveled lamp / The title strip       | The pressed bevel / The marquee edge / The lit title        |
| grotesk       | The transit rail / The poster rail / The index rail                   | The marching ticks / The grid runner / The flap flip                 | Slides onto the grid / Stamps down / Flips in          | The ruled edge / The boxed button / The ruled top           | The grid flash / The ruled mark / The raised plate          |
| lapis         | The girih rail / The gilt rail / The margin rail                      | The girih turns / The illumination sweeps / The ink spreads          | Unfurls / Illuminated in / Inked in                    | The gold edge / The gilt button / The double rule           | The warmed vellum / The traced gilt / The illuminated ring  |
| nostromo      | The CRT rail / The indicator rail / The tape rail                     | The scan line / The indicator blinks / The tape feeds                | Scans in / Feeds in / Warms up                         | The indicator edge / The lit indicator / The tape band      | The warmed panel / The lit groove / The scan flash          |

## Measured (Firefox via Playwright, a local `http.server`, 22 themes ×

2 motion settings = 44 runs; DOM, computed style, and contrast with
gradients resolved to their worst stop, scoped per element with
`getAnimations({ subtree: true })`, counting only `CSSAnimation`)

| Check                                                                                                                                         | Before this pass                                                                                                              | After                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Console errors                                                                                                                                | 0                                                                                                                             | 0                                                                                                                                                                                                                         |
| Every aspect's three options differ (computed style, simulated hover for Interactive)                                                         | formal's Tone option 2 only varies by `font-style` (an artefact of the check, not a fault — verified by hand)                 | 0 real failures                                                                                                                                                                                                           |
| Every Loading option ≥ 1 running `CSSAnimation` at full motion, 0 under reduced motion                                                        | —                                                                                                                             | pass, all 22 themes                                                                                                                                                                                                       |
| Every Arrival/leave option ≥ 1 running `CSSAnimation` at full motion, 0 under reduced motion                                                  | —                                                                                                                             | pass, all 22 themes                                                                                                                                                                                                       |
| formal shape 1's separating rule                                                                                                              | `var(--border)`, 1.36:1                                                                                                       | `var(--border-strong, var(--border))`, ≥ 3:1                                                                                                                                                                              |
| titanium's separating rule (shape 1 direct, shape 2/3 via `--ac-rule`)                                                                        | titanium's own `--border-strong` measures 2.58:1; shape 1 used plain `--border` (1.37:1)                                      | a theme override of `--ac-rule` using the same ink mix titanium's own register already uses for `--kp-kpi-border` (`color-mix(in oklab, var(--border-strong) 85%, var(--foreground))`); shape 1 now reads `--ac-rule` too |
| dark shape 3's primary label (Open)                                                                                                           | `color: var(--primary-foreground)` over a background diluted to 18% primary — 1.4:1                                           | `color: var(--primary)`, the chip reads by its own glowing colour — ≥ 4.5:1                                                                                                                                               |
| light shape 3 / pastel shape 2's primary label (background dropped for an underline look)                                                     | `color` stayed `--primary-foreground` with no fill behind it — 1.06:1 / 1.07:1                                                | `color: var(--primary)` added — ≥ 4.5:1                                                                                                                                                                                   |
| synthwave shape 1's primary label                                                                                                             | the gradient's near stop mixed only 70% primary — 1.31:1 at that stop                                                         | mix raised to 92% primary — ≥ 4.5:1 at both stops                                                                                                                                                                         |
| solstice shape 1/2, deco shape 2/tone 3, shade-light tone 2/3, lapis shape 2 — the unfilled destructive label against a tinted rail/row plate | dropped as low as 1.8:1 (solstice shape 2) against the plain list's own 4.11–6.18:1                                           | the card's own plate restored behind the destructive label, or the tint's mix lowered, back to the plain list's own level (±0.3)                                                                                          |
| Row height stable across ready / loading / ready again, same cell                                                                             | pass (the loading panel's own `min-block-size` is far shorter than six real rows — see package finding below, not fixed here) | unchanged, noted below                                                                                                                                                                                                    |

## Package findings (not fixed here — outside `research/character-actions`)

- **The plain list's own separating rule reads 1.2–2.7:1 in every theme** (the package's shipped `.kp-action-list` hairline, not an option). The research options fix this per-theme by reading `--ac-rule`/`--border-strong`; the plain list itself still reads the plain `--border` token.
- **The plain list's own destructive (Remove…) label reads under 4.5:1** in solstice (4.11), deco (4.26) and lapis (4.28) — all three close, none fixed in the package register.
- ~~cyberpunk's Acknowledge/Assign…/Reassign… labels measure 1:1~~ — a measurement artefact: the button's background-color equals its text, but its last background-image layer paints the dark plate; a screenshot shows yellow on black (checked by Claude, 2026-10-05).
- **Label cutting/wrapping in the plain list**, confirmed in synthwave, high-contrast, sepia and blueprint: synthwave's row buttons measure roughly 4 px too narrow for their labels; Open/Acknowledge overflow in height in high-contrast, sepia and blueprint. All five are in the plain list's own column widths, not in any research option.
- **The loading picture is shorter than the ready list it replaces** (the panel's own `min-block-size: 10rem` against six real rows at ≈ 660–880 px): the cell's total height does drop while `Loading` is pressed. This is the same skeleton convention the package uses elsewhere (a placeholder narrower than its real content), so it is named here rather than hidden, not changed.

## Open points

None for this component. Kenny's verdict (one pick per aspect, per
theme) is still open in the review dialog (`?next=/catalogue/changed.html&review=open`).
