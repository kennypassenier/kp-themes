# A month heatmap of its own, per theme

**Decided (2026-10-06 21:03).** Kenny approved all 22 themes in full, one pick per aspect; the picks, as the attribute keys the demo sets, are in [decided.json](decided.json) (shape / loading / arrival / tone / select). They move into the registers exactly as the demo draws them at the port, after every component's verdict (research/PACKAGE_FINDINGS.md lists what the package must learn first).

Kenny, form v18 (2026-10-05): the character round, one component at a time,
all 22 themes in one demo. The meter (`research/character-meter`) and the
time chart (`research/character-chart`) came first; this is the third
component, the month heatmap.

`.kp-calendar` (css/components.css, "Month heatmap", scope-143; js/calendar.js)
is today the same shape in every theme: rounded plates in the status colours,
the number over its count, dashed days to come or from before, an inner ring
for today, an outer ring in the primary colour for the picked day, square
swatches in the legend, a pulse while it loads (or the theme's spinner, per
day or once over the grid).

## Round two: one pick per aspect

Kenny, 2026-10-05 20:03: "I want separate options for the heatmap as well,
just like you did for the meters … and it should be like this in the
future." Round one offered two whole characters per theme; nothing is
bundled any more. Per theme, five aspects, each with three options, each
picked on its own in the review dialog, nothing ticked in advance:

| Aspect                | Attribute         | What it covers                                                                                              |
| --------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| Shape                 | `data-cl-shape`   | the grid, the day cells, the weekday header, the title and month buttons                                    |
| While loading         | `data-cl-loading` | the picture each day shows while the month is read; always moving, still under reduced motion, never a fade |
| How the month arrives | `data-cl-arrival` | how the days come in after loading and on a month change                                                    |
| Tones and today       | `data-cl-tone`    | how a good, warning, failed, unknown, busy night reads, and today's ring                                    |
| The picked day        | `data-cl-select`  | the frame round the picked day, the hover, and the picked day's count                                       |

Options 1 and 2 are round one's two characters split into their parts (its
rules were scoped `[data-cl='a'|'b']`; each was moved to the aspect it
touches: loading rules by `[data-kp-tone='loading']` and the busy classes,
the pick by `aria-selected`, today and the tones by `data-kp-today` and
`data-kp-tone`, the rest to the shape; the knob blocks were split knob by
knob). Where the two characters barely differed (the picked day's frame,
often the same outline at another offset) the hover and the count of the
picked day are new in both; the loading pictures that stood still in round
one (formal 1 and 2, light 1 and 2, dark 1 and 2, high-contrast 1 and 2,
retro 1 and 2, shade-light 1, shade-dark 1) now move. Option 3 of every
aspect, and all three arrivals, are new.

## Files

- `demo.html`: one section judged per theme with the review kit
  (`../_review/review.js`): five choices per theme, one per aspect, three
  options each with its name and what it does as the hint; nothing ticked.
  At the top "Your combination" shows the ticked options together (an aspect
  not ticked yet shows option 1) and follows `review:choice`; below it one
  row per aspect of three calendars that differ in that aspect only; at the
  foot the plain calendar of today for comparison (not an option). The
  controls sit in `data-review-controls`, so the dialog mirrors them: State
  (Read, which replays the arrival; Loading; Nothing to check; Could not
  read; the live update), Loading look (each day's own picture,
  `kp-calendar--busy-days`, `kp-calendar--busy-whole`), Month (August,
  September, October 2026), and the speed of every animation.
  `data-review-round` is `2026-10-05-r2` and reopens every theme.
- `calendars.css`: every option, in `@layer kp.signature`, scoped
  `[data-theme='<name>'] [data-cl-<aspect>='1'|'2'|'3']`; the shared contract
  and knobs at the top read `[data-cl]` (the wrapper of every calendar but
  the plain one). Options 1 and 2 follow theme by theme; then the generated
  block: option 3 of shape, tone, select and loading, the hover and count of
  every select option, the arrivals and the loops of the formerly still
  pictures; every animation sits in a `prefers-reduced-motion:
no-preference` block, and the last rule stops the days' own loops under
  the two spinner looks. In a register the same rules read
  `[data-theme='<name>'] .kp-calendar`.
- `demo.js`: the five aspects (`ASPECTS`), the names and descriptions
  (`IDEAS`, per theme and aspect three options), the review choices and
  look-at lines built from them, the rows, `compose()` (writes the five
  attributes on the preview from the ticks and on every row's wrapper with
  its own option in its own aspect), the nights (nine services' made-up
  nightly backups, "now" fixed at 20/10/2026 14:40 in Brussels), the states
  through the package's API (`setCalendarState()`, `setCalendarDays()`,
  `setCalendarLegend()`, `calendarSelect()`), the arrival trigger and the
  speed.
- `demo.css`: the page layout only; the three calendars of a row share their
  rows (a subgrid), each calendar keeps its own height, the state line holds
  two lines.

How the month arrives: the arrival's rule needs the grid not busy, so after
loading it restarts by itself when `aria-busy` drops. A month change repaints
the grid in place (no new buttons), so the demo sets `data-cl-arrive` on the
calendar again when the title changes; in a register `js/calendar.js` would
have to mark a month change (a hook it does not expose). Arrivals move by
clip-path, translate, scale, rotate or a 3D turn, never by opacity, and each
day starts after its own delay from its row and column (`--cl-row`,
`--cl-col`, set per `tr` and `td`).

October carries every tone: green and amber nights, the red night of the
power cut (08/10), a night with nothing to back up (11/10), a night whose
report was lost (14/10), today (20/10, 6 of 9), the nights to come; August
starts with nine nights from before the first backup. 16/10 is picked.
js/calendar.js is not changed.

## The options per theme

| Theme         | Aspect                | 1                                               | 2                                             | 3                     |
| ------------- | --------------------- | ----------------------------------------------- | --------------------------------------------- | --------------------- |
| formal        | Shape                 | The desk diary                                  | The ledger                                    | The engraved card     |
|               | While loading         | The desk diary: its loading                     | The ledger: its loading                       | The fountain pen      |
|               | How the month arrives | Set in type                                     | The page turns                                | Ruled in              |
|               | Tones and today       | The desk diary: its tones and today             | The ledger: its tones and today               | The margin rule       |
|               | The picked day        | The desk diary: its pick                        | The ledger: its pick                          | The bookplate         |
| light         | Shape                 | The seam                                        | Daylight                                      | The pill row          |
|               | While loading         | The seam: its loading                           | Daylight: its loading                         | The sunbeam           |
|               | How the month arrives | Morning                                         | Slide up                                      | The wave              |
|               | Tones and today       | The seam: its tones and today                   | Daylight: its tones and today                 | The coloured dot      |
|               | The picked day        | The seam: its pick                              | Daylight: its pick                            | The focus halo        |
| dark          | Shape                 | The readout                                     | The machined pocket                           | The keycap            |
|               | While loading         | The readout: its loading                        | The machined pocket: its loading              | The status LED        |
|               | How the month arrives | Boot sequence                                   | Shutter                                       | Pressed in            |
|               | Tones and today       | The readout: its tones and today                | The machined pocket: its tones and today      | The status bar        |
|               | The picked day        | The readout: its pick                           | The machined pocket: its pick                 | The marquee select    |
| cyberpunk     | Shape                 | Neon cells                                      | The hazard roster                             | The data shard        |
|               | While loading         | Neon cells: its loading                         | The hazard roster: its loading                | The glitch slice      |
|               | How the month arrives | Glitch in                                       | Data rain                                     | Skew lock             |
|               | Tones and today       | Neon cells: its tones and today                 | The hazard roster: its tones and today        | The corner tag        |
|               | The picked day        | Neon cells: its pick                            | The hazard roster: its pick                   | The target lock       |
| synthwave     | Shape                 | The grid-floor month                            | The VCR timer                                 | The arcade marquee    |
|               | While loading         | The grid-floor month: its loading               | The VCR timer: its loading                    | The scanning beam     |
|               | How the month arrives | Out of the horizon                              | Tracking                                      | Neon flicker on       |
|               | Tones and today       | The grid-floor month: its tones and today       | The VCR timer: its tones and today            | The neon underline    |
|               | The picked day        | The grid-floor month: its pick                  | The VCR timer: its pick                       | The player select     |
| pastel        | Shape                 | The sticker chart                               | The washi planner                             | The macaron tray      |
|               | While loading         | The sticker chart: its loading                  | The washi planner: its loading                | The bouncing jelly    |
|               | How the month arrives | Pop                                             | Sticker peel                                  | Bubbles               |
|               | Tones and today       | The sticker chart: its tones and today          | The washi planner: its tones and today        | The sprinkles         |
|               | The picked day        | The sticker chart: its pick                     | The washi planner: its pick                   | The candy wrapper     |
| terminal      | Shape                 | cal(1)                                          | The boot log                                  | The hex dump          |
|               | While loading         | cal(1): its loading                             | The boot log: its loading                     | The progress hashes   |
|               | How the month arrives | Typed                                           | Scroll                                        | Redraw                |
|               | Tones and today       | cal(1): its tones and today                     | The boot log: its tones and today             | The flags             |
|               | The picked day        | cal(1): its pick                                | The boot log: its pick                        | The visual mode       |
| forest        | Shape                 | The ranger's wall calendar                      | The trail map                                 | The tree rings        |
|               | While loading         | The ranger's wall calendar: its loading         | The trail map: its loading                    | The firefly           |
|               | How the month arrives | Leaves unfold                                   | Growth                                        | Falling leaves        |
|               | Tones and today       | The ranger's wall calendar: its tones and today | The trail map: its tones and today            | The moss and the rust |
|               | The picked day        | The ranger's wall calendar: its pick            | The trail map: its pick                       | The flagging tape     |
| high-contrast | Shape                 | The ink grid                                    | The inverse plate                             | The big print         |
|               | While loading         | The ink grid: its loading                       | The inverse plate: its loading                | The march             |
|               | How the month arrives | Line by line                                    | Column by column                              | Cell by cell          |
|               | Tones and today       | The ink grid: its tones and today               | The inverse plate: its tones and today        | The thick bar         |
|               | The picked day        | The ink grid: its pick                          | The inverse plate: its pick                   | The double frame      |
| sepia         | Shape                 | The almanac page                                | The letterpress specimen                      | The tipped-in plate   |
|               | While loading         | The almanac page: its loading                   | The letterpress specimen: its loading         | The ink drop          |
|               | How the month arrives | Developed                                       | Pressed                                       | Written in            |
|               | Tones and today       | The almanac page: its tones and today           | The letterpress specimen: its tones and today | The wax seal          |
|               | The picked day        | The almanac page: its pick                      | The letterpress specimen: its pick            | The pencilled box     |
| blueprint     | Shape                 | The drafting schedule                           | The title block                               | The stencil grid      |
|               | While loading         | The drafting schedule: its loading              | The title block: its loading                  | The compass           |
|               | How the month arrives | Plotted                                         | Projected                                     | Unrolled              |
|               | Tones and today       | The drafting schedule: its tones and today      | The title block: its tones and today          | The revision cloud    |
|               | The picked day        | The drafting schedule: its pick                 | The title block: its pick                     | The detail callout    |
| solstice      | Shape                 | The low sun                                     | The embers                                    | The standing stones   |
|               | While loading         | The low sun: its loading                        | The embers: its loading                       | The sun dial          |
|               | How the month arrives | Sunrise                                         | Dawn across                                   | Kindled               |
|               | Tones and today       | The low sun: its tones and today                | The embers: its tones and today               | The ember line        |
|               | The picked day        | The low sun: its pick                           | The embers: its pick                          | The halo              |
| brutalism     | Shape                 | The slab                                        | The sticker sheet                             | The concrete block    |
|               | While loading         | The slab: its loading                           | The sticker sheet: its loading                | The jackhammer        |
|               | How the month arrives | Slammed down                                    | Shoved in                                     | Dropped               |
|               | Tones and today       | The slab: its tones and today                   | The sticker sheet: its tones and today        | The colour block      |
|               | The picked day        | The slab: its pick                              | The sticker sheet: its pick                   | The fat frame         |
| deco          | Shape                 | The gilt calendar                               | The marquee                                   | The arched window     |
|               | While loading         | The gilt calendar: its loading                  | The marquee: its loading                      | The fan               |
|               | How the month arrives | The curtain rises                               | The fan opens                                 | The marquee           |
|               | Tones and today       | The gilt calendar: its tones and today          | The marquee: its tones and today              | The gilt corner       |
|               | The picked day        | The gilt calendar: its pick                     | The marquee: its pick                         | The spotlight         |
| phantom       | Shape                 | The stamped VOID nights                         | The calling card month                        | The torn ticket       |
|               | While loading         | The stamped VOID nights: its loading            | The calling card month: its loading           | The red cut           |
|               | How the month arrives | Cut in                                          | Card dealt                                    | Stamped               |
|               | Tones and today       | The stamped VOID nights: its tones and today    | The calling card month: its tones and today   | The marker stripe     |
|               | The picked day        | The stamped VOID nights: its pick               | The calling card month: its pick              | The cut line          |
| shade-light   | Shape                 | Pencil in the shade                             | The leaf shade                                | The paper fold        |
|               | While loading         | Pencil in the shade: its loading                | The leaf shade: its loading                   | The window shadow     |
|               | How the month arrives | The shade passes                                | Unfolded                                      | Settled               |
|               | Tones and today       | Pencil in the shade: its tones and today        | The leaf shade: its tones and today           | The watercolour wash  |
|               | The picked day        | Pencil in the shade: its pick                   | The leaf shade: its pick                      | The pencil circle     |
| shade-dark    | Shape                 | Silverpoint                                     | The reading lamp                              | The night window      |
|               | While loading         | Silverpoint: its loading                        | The reading lamp: its loading                 | The headlights        |
|               | How the month arrives | Lamps on                                        | Blinds up                                     | Night falls           |
|               | Tones and today       | Silverpoint: its tones and today                | The reading lamp: its tones and today         | The window light      |
|               | The picked day        | Silverpoint: its pick                           | The reading lamp: its pick                    | The lit pane          |
| retro         | Shape                 | The tear-off pad                                | The 1995 date picker                          | The floppy label      |
|               | While loading         | The tear-off pad: its loading                   | The 1995 date picker: its loading             | The hourglass         |
|               | How the month arrives | Repaint                                         | The wipe                                      | The dissolve          |
|               | Tones and today       | The tear-off pad: its tones and today           | The 1995 date picker: its tones and today     | The status icons      |
|               | The picked day        | The tear-off pad: its pick                      | The 1995 date picker: its pick                | The marching ants     |
| grotesk       | Shape                 | The Swiss grid                                  | The transit bullets                           | The poster grid       |
|               | While loading         | The Swiss grid: its loading                     | The transit bullets: its loading              | The ticker            |
|               | How the month arrives | On the grid                                     | Column drop                                   | Hard cut              |
|               | Tones and today       | The Swiss grid: its tones and today             | The transit bullets: its tones and today      | The rule              |
|               | The picked day        | The Swiss grid: its pick                        | The transit bullets: its pick                 | The red bar           |
| lapis         | Shape                 | Lapis on vellum                                 | The girih tiles                               | The mosaic            |
|               | While loading         | Lapis on vellum: its loading                    | The girih tiles: its loading                  | The gold leaf         |
|               | How the month arrives | Laid in                                         | Gilded                                        | The star              |
|               | Tones and today       | Lapis on vellum: its tones and today            | The girih tiles: its tones and today          | The enamel            |
|               | The picked day        | Lapis on vellum: its pick                       | The girih tiles: its pick                     | The gold setting      |
| nostromo      | Shape                 | The CRT duty roster                             | The indicator panel                           | The keypad            |
|               | While loading         | The CRT duty roster: its loading                | The indicator panel: its loading              | The radar             |
|               | How the month arrives | Self test                                       | CRT warm up                                   | Teletype              |
|               | Tones and today       | The CRT duty roster: its tones and today        | The indicator panel: its tones and today      | The warning lamp      |
|               | The picked day        | The CRT duty roster: its pick                   | The indicator panel: its pick                 | The hazard select     |
| titanium      | Shape                 | The anodised tiles                              | The date wheel                                | The watch bezel       |
|               | While loading         | The anodised tiles: its loading                 | The date wheel: its loading                   | The second hand       |
|               | How the month arrives | Machined                                        | Wound                                         | Clicked in            |
|               | Tones and today       | The anodised tiles: its tones and today         | The date wheel: its tones and today           | The index mark        |
|               | The picked day        | The anodised tiles: its pick                    | The date wheel: its pick                      | The heat-tint ring    |

Every option's full description is its hint in the review dialog and its line on the page (`IDEAS` in demo.js).

## Round two, measured

Firefox (Playwright's, its own `http.server` on 127.0.0.1:8732, under
`flock /tmp/kp-themes-shot.lock`), 2026-10-05 21:25, viewport 1600 × 1200,
formal and titanium, each with and without reduced motion; the run took
39 min 33 s, almost all of it waiting for the lock. The 22-theme run
follows below.

- **Console:** 0 errors and 0 page errors in both themes, with and without
  reduced motion, through Loading (in all three looks), Nothing to check,
  Could not read, the three months, the live update, and Read (replay).
- **Heights:** every calendar box and grid (17 per page) keeps one height
  through all of those states and months.
- **Rows differ:** in every aspect row the three calendars' computed styles
  differ pairwise (the loading row measured while loading; the arrival row
  differs only where motion is allowed).
- **Preview:** follows `review:choice` (tone 3 ticked, then 1).
- **Loading:** every loading option runs 31 animations (one per day) at full
  motion and 0 under reduced motion; the arrival runs 31 per calendar after
  Read at full motion and 0 under reduced motion.
- **Figures:** lowest computed contrast of a day's figure against its plate
  colour (patterns not counted), shape and tone rows: formal 4.72 (ok) in
  shapes 1 to 3 and tones 1 and 2, 16.41 in tone 3; titanium 4.74 (future),
  tone 3 13.33. Rings not measured yet.

### All 22 themes (2026-10-05 21:30 to 22:00)

Firefox (Playwright's), its own `http.server` on 127.0.0.1:8741, no
screenshot lock (DOM, computed style and contrast reads only), four
processes in parallel; 22 themes × full and reduced motion, viewport
1600 × 1200. One run: 4 min 8 s (re-measure after the fixes); the three
themes fixed last: 47 s. Colours are resolved through a canvas and
composited over their ancestors; a figure's plate also counts its own
`::before` where that covers it and a day's radial dot; patterns are not
composited.

- **Console:** 0 errors in 44 runs, through Loading (three looks), Nothing to
  check, Could not read, the three months, the live update and Read.
- **Heights:** one height per calendar box and grid (17 per page) in all 44.
- **Rows differ:** shape, tone and the pick differ pairwise in every theme;
  loading differs while loading in every theme; the arrival differs at full
  motion in 21 themes by its computed style, and in high-contrast by its
  order alone (1 and 3 both wipe down: row by row against day by day, 80
  and 14 ms steps).
- **Loading:** every loading option runs ≥ 31 animations at full motion and
  0 under reduced motion in all 22; arrivals 0 under reduced motion.
- **Figures:** lowest number against its plate over every tone, every
  calendar, October, August, September, Nothing to check and Could not
  read: 4.51 (forest), all ≥ 4.5.
- **Rings:** a marker counts when it is absent on a day of the same tone
  (box-shadow, outline, border, the colours of a pseudo's gradient), against
  the plate (inset) or the ground (outset); lowest today 3.18 (solstice,
  tone 2), lowest pick 3.03 (brutalism, shape 2), all ≥ 3.
- **Labels and title:** title, weekday heads, month buttons, legend, number
  and count read back through a Range per text node (more than one line is
  wrapped) and against their box (wider is cut): 0 wrapped, 0 cut at desk
  width and in a 334 px pane. Under full motion the number 20 reads 2 px
  wider than its box in lapis and pastel tone 2 for one frame of Nothing to
  check (a scale in flight; 0 under reduced motion); not counted.
- **334 px pane:** the grid itself needs 322 to 352 px: wider than 334 in
  all 22 themes, the plain calendar too (346 px), so the package's own
  minimum day width, not an option; open.
- **Dialog** (`?theme=formal&next=/catalogue/changed.html&review=open`):
  open, five groups (Shape, While loading, How the month arrives, Tones and
  today, The picked day) of three, nothing ticked, 0 errors.

Failures found and fixed (tokens only, one aspect per rule):

| Theme · option            | Measured before                                     | Cause                                                            | Fix                                                                                                                | After            |
| ------------------------- | --------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------- |
| formal shape 2            | before-days 2.05                                    | figures on the grey ruling showing through the 1px gaps          | shape names `--cl-ground: var(--card)`; the contract's empty tones read it                                         | ≥ 4.5            |
| brutalism shape 2         | before-days 4.34                                    | muted ink on the accent slab                                     | shape names `--cl-ground-soft: var(--accent-foreground)`                                                           | ≥ 4.5            |
| lapis shape 2, 3          | future/before 1.0, muted 1.15, none 1.17; pick 1.17 | tone 1 and pick 1 inked for shape 1's ivory leaf                 | shape 1 names `--cl-ground-ink/-soft/-accent`; tone 1, loading 1, pick 1 and 2 read them (lapis ground by default) | ≥ 4.5; pick ≥ 3  |
| lapis tone 2              | future/before 1.78; none 1.17 after the first fix   | muted ink on the ivory leaf; none-days ink on lapis              | contract fallback; `--cl-none-fg: var(--foreground)`                                                               | ≥ 4.5            |
| lapis pick 2              | 1.88                                                | gold outline on the ivory leaf                                   | `--cl-ground-accent` (gold at 32 % lightness) on shape 1                                                           | ≥ 3              |
| lapis today, tone 1, 2, 3 | 2.74, 2.74, 2.78                                    | gold / vermilion ring on the amber plate and the card            | gold at 72 %, vermilion at 66 %                                                                                    | ≥ 3              |
| deco today, tone 1        | 2.71                                                | gold ring on the amber plate                                     | gold at 74 % (ring and cartouche)                                                                                  | ≥ 3              |
| nostromo shape 2, 3       | ok/warn 1.17, bad 1.55; today 1.17; muted 4.42      | tone 1 reads `--cl-phosphor`/`--cl-amber`, only shape 1 set them | shapes 2 and 3 name their own (foreground, warning at 24 %, warning-foreground on it); muted at 0.8                | ≥ 4.5; today ≥ 3 |
| nostromo tone 2           | today 2.5                                           | dark ring on the amber key                                       | a card-coloured inner line inside the ring                                                                         | ≥ 3              |
| nostromo pick 3           | 1.07                                                | dark dashes on the dark CRT panel                                | dashes in `--cl-phosphor` (the ground's ink)                                                                       | ≥ 3              |
| nostromo loading 2        | 0 animations                                        | the lamp was shape 2's `::before`; elsewhere nothing moved       | the loading picture draws its own lamp                                                                             | 31               |
| synthwave shape 2         | bad count 1.06                                      | pink count on the red plate                                      | the count takes the plate's ink on a bad night                                                                     | ≥ 4.5            |
| deco shape 3              | month buttons cut (46 in 42 px)                     | the title's 0.2em tracking squeezes the nav                      | tracking 0.08em                                                                                                    | 0 cut            |

The contract change: `none`, `future` and `before` fall back to
`--cl-ground` for their plate and `--cl-ground-soft` for their ink before
the transparent / muted-foreground defaults, so a shape that draws its own
ground names it once and every tone option reads on it.

## Round one (kept for provenance)

### The characters

| Theme         | Character 1                                                                                                                                                                                     | Character 2                                                                                                                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| formal        | The desk diary: hairline-framed paper squares, Fraunces old-style figures top left, a rule in the night's ink along the top, today in the navy double rule; a still dotted leader while loading | The ledger: days parted by hairlines, mono ledger figures flush right, a single rule under a night and the double rule under a night with nothing done, today's figure boxed; a still entry line |
| light         | The seam: soft plates with the night's seam along the foot, today in the divider's open circle; a still dashed seam                                                                             | Daylight: white cards lifted off a pale sky, washed in the night's colour, today in a ring of amber sunlight; a band of daylight crosses                                                         |
| dark          | The readout: black cells, a lit strip and figure in the night's light, ticker mono, today between corner brackets; still                                                                        | The machined pocket: chamfered pockets with a lit lower lip, engraved figures, today ringed in light; still                                                                                      |
| cyberpunk     | Neon cells: neon tubes in the night's colour with their glow, tech mono, yellow HUD brackets on today; a cyan packet runs                                                                       | The hazard roster: cut-corner plates, condensed display figures, hazard stripes on nights that went wrong, a yellow NOW tag; the stripes crawl                                                   |
| synthwave     | The grid-floor month: glass plates over a perspective floor and a pink horizon, VT323 figures, today a sunset ring; a horizon line drives up                                                    | The VCR timer: OSD numerals on black, a block in the corner, an inverse red block for none, scanlines; the tracking band rolls                                                                   |
| pastel        | The sticker chart: candy plates with a flat sticker shadow, ★ ☆ ✕ stickers, a dashed candy ring on today; a candy dot hops                                                                      | The washi planner: riso-grain squares with washi tape in the night's colour (striped, crossed), a doodled ring on today; the tape drifts                                                         |
| terminal      | cal(1): character cells, figures flush right, reverse video for none and for today's figure, · ~ ? signs; a 1 Hz caret                                                                          | The boot log: box-line cells with [OK] [WARN] [FAIL] [SKIP] tags, today in the double line; a text spinner                                                                                       | / - \ |
| forest        | The ranger's wall calendar: kraft paper, italic figures, a pinned green or autumn leaf, today circled in pencil; a leaf drifts down                                                             | The trail map: contour rings, the night as a trail blaze (double for none), a map pin on today, a dashed trail for the pick; the dashes walk                                                     |
| high-contrast | The ink grid: every tone three ways, colour, frame (solid, dashed, double, dotted) and sign (✓ ! ✕ – ?); still                                                                                  | The inverse plate: ink plates told apart by a pattern band alone (solid, hatched, cross-hatched, dotted), yellow ring on today; still                                                            |
| sepia         | The almanac page: serif italic figures, moon-phase signs ● ◐ ○, today ringed in ink, the pick in a double rule; a pen stroke writes and fades                                                   | The letterpress specimen: blind-impression plates, speckled ink, a fleuron ❧ on today; the platen presses                                                                                        |
| blueprint     | The drafting schedule: white-ink boxes on millimetre lines, hatched for some missing, amber dimension ticks on today, an amber chain line for the pick; a plotter dash runs                     | The title block: the figure in a boxed field, the count in a strip, △ ▲ revision triangles, today in the double border; a dash marches round                                                     |
| solstice      | The low sun: charcoal plates glowing up from the foot in the night's colour, serif figures, a sun ring on today; a dawn rises                                                                   | The embers: a good night glows along its edges, specks for some missing, the red coal for none, a hot iron rim on today; embers breathe                                                          |
| brutalism     | The slab: 3px black frames with the hard shadow, the pick pressed in, yellow-and-black tape across today; the tape runs                                                                         | The sticker sheet: askew stickers on a lavender sheet, a black starburst behind today's figure, the month on its own line; blocks drop                                                           |
| deco          | The gilt calendar: lacquer panels in double gold hairlines with stepped corners, Poiret figures, a gold sunburst on today; a glint runs                                                         | The marquee: a row of bulbs on every panel (all lit, half lit, dark on red); the bulbs chase                                                                                                     |
| phantom       | The stamped VOID nights: white index cards, VOID and PART stamps, a red tick, today in a red frame; the halftone slides                                                                         | The calling card month: black cards under a halftone, every figure a slanted cut-paper scrap, a red slash on today; the halftone shuffles                                                        |
| shade-light   | Pencil in the shade: lifted paper squares, pencil hatching over the night, the pick lifted further; hatched in once                                                                             | The leaf shade: dappled leaf shade over the sheet, a sun ring on today; a cloud's shade passes                                                                                                   |
| shade-dark    | Silverpoint: silver hairline frames and hatching, today ringed in the figure's own ink; hatched in once                                                                                         | The reading lamp: a warm pool of light over the sheet, a warm ring on today; the pool slides                                                                                                     |
| retro         | The tear-off pad: perforated leaves in green, yellow and red, pixel figures, today ringed in marker, the dotted focus line of 1995; still                                                       | The 1995 date picker: a white well in a bevel, raised bevelled day buttons, a navy weekday bar, today ringed in red, the pick sinks; a still dither                                              |
| grotesk       | The Swiss grid: a heavy black rule over every day, bold figures flush left, today boxed in black, the pick in red; three squares cut in                                                         | The transit bullets: round bullets in the night's colour, open rings for the nights to come, black ring today, red ring for the pick; the zebra hops                                             |
| lapis         | Lapis on vellum: an ivory vellum leaf in a double gold frame under a lapis head band, inked panels, a gold cartouche on today; a burnisher's glint                                              | The girih tiles: lapis tiles under a gold lattice in double gold frames, a gold eight-pointed star behind today's figure; a glint runs the frame                                                 |
| nostromo      | The CRT duty roster: a dark CRT in the beige case, phosphor cells (cream, amber, inverse amber), scanlines, a block cursor under today; the cursor blinks                                       | The indicator panel: coloured keys with a lit lamp in the corner, the count on embossed label tape, the pick pressed in; the lamps scan                                                          |
| titanium      | The anodised tiles: brushed metal anodised in the night's colour, engraved instrument-mono figures, a blue heat-tint ring on today; the cutter runs linearly                                    | The date wheel: the figure in a recessed aperture ringed in the night's anodised colour, a knurled top, blue oxide on today; the knurl rolls                                                     |

Themes whose rules forbid loops keep their loading picture still: formal 1
and 2, light 1, dark 1 and 2, high-contrast 1 and 2, retro 1 and 2 (light 2
keeps the slow daylight band, as the chart's light 2 did). Nothing loops at
rest in any character. shade-light 1 and shade-dark 1 hatch in once.

### Measured

Firefox (Playwright's, one script, its own `http.server`, under
`flock /tmp/kp-themes-shot.lock`), 2026-10-05, all 22 themes, viewport
1600 × 1200 at 2×. The last fixes for formal, dark, forest, solstice,
shade-dark, lapis and nostromo were measured again in a second run; the
table holds the latest run per theme.

- **Console:** 0 errors and 0 page errors in all 22 themes, with and without
  reduced motion, through every state, look, month and the live update.
- **Heights:** the grid (`table.kp-calendar__grid`) measured in Read,
  August, September, October, Loading in each of its three looks, Nothing to
  check, Could not read, and the live update (reading, then done): one height
  per grid in all 66 columns. The whole calendar keeps one height too, once
  the titles were set so that "September 2026" stays on one line (nostromo 1
  and 2 and brutalism 2 put the month on its own line above the buttons).
- **Reduced motion:** with `prefers-reduced-motion: reduce`, 0 running
  animations in every column in every one of those states, in all 22 themes.
- **Contrast**, from the screenshot's pixels: the day shot twice, as drawn
  and with the figure (then the count) made transparent; over the pixels that
  differ, the 95th percentile of the contrast between the two shots. Per
  character, the lowest over the tones ok, warn, bad, muted, none, future,
  before and loading (the count where a tone has one). Rings the same way:
  the cell and 10px around it with and without `data-kp-today` (today warn,
  and again as ok after the live update; the lower counts) and with and
  without `aria-selected`. Every character is at or above 4.5:1 for figures
  and counts and 3:1 for today's and the picked day's ring, in every theme.
- **Tones:** the plates of the eight tones shot with their figures hidden;
  "Tones" is the smallest mean difference per pixel (0–255) between any two
  of them. In high-contrast it is measured in grey as well: 13.6 (1) and 8.4
  (2), so the pattern alone tells every tone apart.

| Theme         | Option |     Grid | Figure, lowest | Count, lowest | Today | Picked | Tones | Loading animates        |
| ------------- | ------ | -------: | -------------: | ------------: | ----: | -----: | ----: | ----------------------- |
| formal        | 1      | 392.5 px |      4.65 (ok) |          4.64 |  8.72 |  11.59 |   5.2 | nothing (still)         |
|               | 2      | 344.4 px |      4.65 (ok) |          4.64 |  8.74 |   8.75 |   3.3 | nothing (still)         |
|               | plain  |   378 px | 3.03 (loading) |          4.44 | 12.13 |  11.58 |   5.0 | kp-pulse                |
| light         | 1      |   378 px |      4.73 (ok) |          4.73 | 14.18 |   9.40 |   3.2 | nothing (still)         |
|               | 2      |   386 px |      4.81 (ok) |          5.14 |  5.36 |   8.90 |   3.1 | nothing (still)         |
|               | plain  |   378 px | 3.12 (loading) |          4.73 | 14.18 |   9.40 |   3.5 | kp-pulse                |
| dark          | 1      |   378 px | 4.66 (loading) |          6.86 | 16.26 |  16.26 |   2.2 | nothing (still)         |
|               | 2      | 384.5 px |   4.66 (muted) |          6.60 | 17.11 |  15.91 |   3.2 | nothing (still)         |
|               | plain  |   378 px | 2.92 (loading) |          6.60 | 11.20 |  15.91 |   2.9 | kp-pulse                |
| cyberpunk     | 1      |   378 px |     4.92 (bad) |          4.92 | 13.48 |  13.67 |   9.6 | cl-cy-packet            |
|               | 2      | 379.5 px |     4.92 (bad) |          4.92 | 15.26 |  13.03 |   6.3 | cl-cy-hazard            |
|               | plain  |   378 px | 3.32 (loading) |          4.92 |  7.94 |  15.26 |   3.1 | kp-pulse                |
| synthwave     | 1      |   384 px | 5.39 (loading) |          5.46 |  4.94 |  14.28 |   5.7 | cl-sw-horizon           |
|               | 2      |   384 px |  5.20 (before) |          5.46 | 14.84 |   4.55 |   3.8 | cl-sw-track             |
|               | plain  |   378 px | 3.49 (loading) |          5.44 |  7.97 |   4.55 |   1.7 | kp-pulse                |
| pastel        | 1      |   394 px |      4.57 (ok) |          4.57 |  6.45 |   6.45 |   8.1 | cl-pa-hop               |
|               | 2      |   378 px |      4.57 (ok) |          4.57 |  4.81 |  13.77 |   5.0 | cl-pa-drift             |
|               | plain  |   378 px | 2.95 (loading) |          4.57 | 10.27 |   6.45 |   5.1 | kp-pulse                |
| terminal      | 1      |   354 px |    4.66 (warn) |          4.66 |  5.00 |  12.17 |   3.6 | cl-tm-caret             |
|               | 2      |   378 px |     5.55 (bad) |          5.55 | 13.50 |  12.17 |   4.3 | cl-tm-spin              |
|               | plain  |   378 px | 4.28 (loading) |          4.66 |  5.00 |  12.17 |   2.1 | kp-pulse                |
| forest        | 1      |   378 px |      4.51 (ok) |          4.51 |  6.85 |  11.21 |   3.1 | cl-fo-leaf              |
|               | 2      | 376.5 px |      4.51 (ok) |          4.51 |  8.44 |  11.21 |   7.2 | cl-fo-walk              |
|               | plain  |   378 px | 2.87 (loading) |          4.51 | 10.02 |   8.06 |   6.0 | kp-pulse                |
| high-contrast | 1      |   386 px |    6.84 (warn) |          6.84 |  6.84 |  10.86 |  13.6 | nothing (still)         |
|               | 2      |   378 px |     8.21 (bad) |          8.21 | 13.89 |  10.86 |   8.4 | nothing (still)         |
|               | plain  |   378 px | 4.57 (loading) |          6.84 |  3.07 |  10.86 |   3.8 | kp-pulse                |
| sepia         | 1      |   365 px | 5.27 (loading) |          5.94 |  5.64 |   6.92 |   4.6 | cl-se-write             |
|               | 2      | 387.5 px |   5.27 (muted) |          6.22 |  6.62 |   6.92 |   4.4 | cl-se-press             |
|               | plain  |   378 px | 2.90 (loading) |          5.94 | 10.78 |   6.92 |   4.8 | kp-pulse                |
| blueprint     | 1      |   378 px |     5.27 (bad) |          5.27 |  7.57 |   7.57 |   6.8 | cl-bp-plot              |
|               | 2      |   378 px |     5.27 (bad) |          5.27 |  6.21 |   8.64 |   4.4 | cl-bp-march             |
|               | plain  |   378 px | 4.16 (loading) |          5.27 |  6.11 |   8.64 |   5.1 | kp-pulse                |
| solstice      | 1      |   381 px |     5.00 (bad) |          5.00 |  6.40 |   3.84 |   5.6 | cl-so-dawn              |
|               | 2      |   378 px |     5.00 (bad) |          4.81 |  3.04 |  12.72 |   3.8 | cl-so-breathe           |
|               | plain  |   378 px | 3.91 (loading) |          5.00 |  6.04 |   6.40 |   4.8 | kp-pulse                |
| brutalism     | 1      |   402 px |     6.31 (bad) |          6.31 | 18.73 |  18.73 |   5.6 | cl-br-tape              |
|               | 2      |   394 px |     6.31 (bad) |          6.31 | 13.31 |   8.74 |  31.3 | cl-br-drop              |
|               | plain  |   378 px | 3.66 (loading) |          6.31 | 10.84 |  18.73 |   5.6 | kp-pulse                |
| deco          | 1      |   378 px |     4.79 (bad) |          4.79 |  6.95 |   7.55 |   7.2 | cl-de-glint             |
|               | 2      |   378 px |     4.79 (bad) |          4.79 |  4.99 |  13.87 |   3.7 | cl-de-chase             |
|               | plain  |   378 px |     4.79 (bad) |          4.79 |  4.99 |   7.55 |   4.4 | kp-pulse                |
| phantom       | 1      |   378 px | 7.34 (loading) |         14.35 | 14.30 |  17.01 |   8.6 | cl-ph-slide             |
|               | 2      |   378 px |  8.00 (before) |          5.03 |  4.78 |  17.01 |  19.8 | cl-ph-shuffle           |
|               | plain  |   378 px | 4.34 (loading) |          5.03 |  5.24 |   4.79 |   3.0 | kp-pulse                |
| shade-light   | 1      |   386 px |    4.55 (warn) |          4.55 |  4.55 |   5.30 |   6.6 | cl-sh-hatch             |
|               | 2      |   378 px |    4.55 (warn) |          4.55 |  3.77 |   5.39 |   6.9 | cl-sh-cloud             |
|               | plain  |   378 px | 2.70 (loading) |          4.55 |  1.29 |   5.39 |   4.5 | kp-pulse                |
| shade-dark    | 1      |   386 px |    4.94 (warn) |          4.94 |  4.94 |   4.90 |   5.2 | cl-sh-hatch             |
|               | 2      |   378 px | 4.55 (loading) |          4.75 |  6.13 |   4.48 |   2.7 | cl-sh-lamp              |
|               | plain  |   378 px | 3.27 (loading) |          4.75 |  1.45 |   4.90 |   1.0 | kp-pulse                |
| retro         | 1      |   378 px | 6.46 (loading) |          7.21 | 12.24 |  11.97 |   4.6 | nothing (still)         |
|               | 2      | 360.4 px |  5.64 (before) |          7.21 |  7.62 |  17.11 |  17.7 | nothing (still)         |
|               | plain  |   378 px | 3.34 (loading) |          7.24 | 12.24 |  11.02 |   2.1 | kp-pulse                |
| grotesk       | 1      |   370 px |  5.27 (before) |          5.74 |  5.74 |   4.99 |   8.4 | cl-gr-cut               |
|               | 2      |   378 px | 5.27 (loading) |          5.74 | 18.73 |   4.99 |   6.9 | cl-gr-zebra             |
|               | plain  |   378 px | 2.87 (loading) |          5.74 |  5.74 |   4.99 |   1.9 | kp-pulse                |
| lapis         | 1      |   378 px |      5.12 (ok) |          5.12 |  5.15 |  10.96 |   3.9 | cl-la-glint             |
|               | 2      |   378 px |   4.82 (muted) |          5.12 | 14.98 |   5.00 |  11.2 | cl-la-glint             |
|               | plain  |   378 px | 3.21 (loading) |          5.12 |  5.15 |   5.00 |   2.6 | kp-pulse                |
| nostromo      | 1      |   378 px |     4.86 (bad) |          4.86 |  4.83 |  12.37 |   4.3 | cl-no-warm, cl-no-blink |
|               | 2      | 381.5 px |  4.52 (before) |         12.37 |  7.01 |   3.23 |   8.1 | cl-no-scan              |
|               | plain  |   378 px | 2.66 (loading) |          4.94 |  2.50 |   9.90 |   7.0 | kp-pulse                |
| titanium      | 1      |   375 px | 4.55 (loading) |          6.23 |  4.13 |  11.19 |   6.3 | cl-ti-cut               |
|               | 2      |   375 px |  4.74 (before) |          6.09 |  4.13 |  11.19 |   3.1 | cl-ti-knurl             |
|               | plain  |   378 px | 3.28 (loading) |          6.09 | 11.24 |  11.19 |   1.9 | kp-pulse                |

### Open

- **Two tone pairs are close:** dark 1, future and before (2.2: both bare
  black cells, dotted against a dark dashed frame), and shade-dark 2, none and
  before (2.7). Not fixed: the measuring stopped at the coordinator's word.
  dark 1 would give "before" a hatch, shade-dark 2 a sign on "none".
- **Findings in the plain calendar** (the package, not changed here): a
  loading day's figures read 2.7:1 to 4.6:1 in every theme, because
  layout.css dims every `[aria-busy]` to 0.7 and the grid is busy while it
  loads (the characters set `--kp-busy-opacity: 1` on the grid: their loading
  picture says busy); formal's warning pair reads 4.44:1 for the count;
  today's inner ring in the foreground colour reads 1.29:1 in shade-light,
  1.45:1 in shade-dark and 2.50:1 in nostromo on the amber plate; the title
  wraps in synthwave, nostromo and brutalism, so the calendar grows a line in
  some months; and in a grid row stretched by its neighbour the table hands
  the extra height to its header row (the demo sets `align-self: start`).
- **Hooks the calendar does not expose:** the weekday of a cell (the stickers
  of brutalism 2 and the scraps of phantom 2 vary by column, `td:nth-child`,
  which depends on the locale's first weekday); whether a day has a count
  (the count is a no-break space when there is none, so nostromo 2's label
  tape is shown only for the tones that carry one); the weekday names are the
  locale's (cal(1)'s "Mo Tu" cannot be drawn); the month of the grid is in
  the title only.
- **Today's ring in several characters is drawn on `td:has(> [data-kp-today])`**
  (dark 1, cyberpunk 1 and 2, pastel 1, forest 2, sepia 2, blueprint 1,
  brutalism 1, phantom 2, grotesk 2): a `data-kp-today` on the cell would
  spare the `:has()`.
- **terminal 1's caret animates `content`**, which Firefox runs as a discrete
  animation; where it does not, the caret simply stays lit.
