# research/kpadopt3: round 3 of the dashboard adoption, six opt-in options

**Round 1 (2026-10-16 15:21):** Kenny approved all six options in formal in the review dialog (week-upcoming on the condition that its loading is phone-only, which it is). Recorded in `VERDICTS.json`. Round 2 asks the fifteen other themes for the four options that are seen (below).

The admin dashboard (homelab `admin/web`) still drew six things itself because kp-themes lacked them. Each is now an
opt-in option of a component Kenny already approved; without the new attribute or field nothing changes. One page,
[`demo.html`](demo.html), six sections, **formal only** (`data-review-themes="formal"`), one review topic (`kpadopt3`).

- Package: every `kp-` class and every script under `js/`. Mock: the sample data, the frames and the width slider, the
  history box under the timeline, the readouts and the buttons that drive a section (`demo.js`, `demo.css`).

| Part                        | Dashboard source                                   | What the package offers now                                                                                                       | Cost   | Recommendation |
| --------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ | -------------- |
| Separator in the nav bar    | `.nx-nav-sep` (main.js)                            | `li.kp-nav__sep`; the fold (`js/nav-fold.js`, `planSeparators()`) keeps it only between shown links, the More menu's own rule     | small  | Adopt          |
| Choice filter value         | `filterCell` + hidden `data-kp-edit-value` on Host | `td[data-kp-filter-value]` (js/datatable.js), as `td[data-kp-sort-value]` is for sorting; on a header it stays the opening filter | small  | Adopt          |
| Run timeline: day, legend   | activity.js before the swap (274114e9)             | `data-kp-gantt-days`, `kp-gantt-select` `source: 'day'` + `day`; `GanttRun.series`, `setGanttLegend()`                            | medium | Adopt          |
| Week agenda on a phone      | `agenda()` "next 8" list (schedules.js)            | `data-kp-week-upcoming="8"`, `-label`, `-empty` (js/week.js), `.kp-week__upcoming`, `.kp-week__next`                              | medium | Adopt          |
| Facet swatch with a pattern | `stackMark` / `markCells` (ui.js)                  | `FacetItem.pattern`, `data-kp-facet-pattern`, `identityCells()` (js/facets.js), `.kp-facet__pattern`                              | small  | Adopt          |
| Heat grid: to the latest    | Home key on the Backups heat (backups.js)          | `data-kp-heat-latest="end" \| "start"`: End (Home) also sends `kp-heat-page { direction: 'latest' }`                              | small  | Adopt          |

Every word the options add comes from the dictionary or the page (no new dictionary word: the dictionary is in every
block's digest). Formal's own look: the separator is the docket cut stood upright (G19), a pressed day on the axis is
closed with the double rule and pointing rules the navy rule under it (G15, G7), a series' finished run carries the
ledger's heavy rule on its start edge.

## Round 2 of the page (2026-10-16-r2): the fifteen other themes

Formal is approved in full (round 1) and leaves the page, with the two options that have no look of their own (the choice
filter's `td[data-kp-filter-value]` and the heat grid's `data-kp-heat-latest`: behaviour only, the same in every theme).
This round asks the fifteen other themes for the four options that are seen: the separator in the folding bar, the
timeline's day buttons and series runs, the week agenda's upcoming list on a phone and the facet swatch's identity
pattern. Each theme's look is one `[kpadopt3]` block at the end of `css/<theme>-register.css`, drawn from that theme's
own divider, nav bar and the week, timeline and facet parts it was given in research/kpadopt2 round 5; formal's
register is untouched. The review dialog's "Look at" line names what is the theme's own; **Previous version** shows
the page as it stood before this round (`_previous/`, from 28788e07).

| Theme     | Separator (upright · lying)                | Day on the axis (pointed · pressed)        | Series run                 | Facet pattern             |
| --------- | ------------------------------------------ | ------------------------------------------ | -------------------------- | ------------------------- |
| light     | hairline with the open bead                | muted pill · indigo-tint pill              | the small card shadow      | 4 px card, small shadow   |
| dark      | fading scale with one lit cyan tick        | lit edge · accent plate with its glow      | 2 px leading edge          | square, machined rim      |
| cyberpunk | neon slash with its cyan ghost · data dash | RGB split · notched yellow lock-on         | hard 3 px leading bar      | notched corner            |
| synthwave | the horizon tube, glowing                  | laser underline · lit pink tube            | its own neon glow          | 2 px corner, hue glow     |
| pastel    | the divider's plum beads                   | lifted on its peel · stuck-down pink chip  | a peel of its own colour   | rounded sticker on a peel |
| terminal  | the glyph │ · a line of ─                  | cursor ring · reverse video                | (the package's)            | square, phosphor bloom    |
| forest    | a twig with its leaf                       | moss leaf · green leaf with the trail foot | grows from its foot        | a leaf                    |
| blueprint | the dashed fold line                       | cyan witness lines · amber hatched section | hatched section in its ink | framed by a drawn line    |
| solstice  | horizon with its amber peak                | flare from the foot · the halo             | lit from its foot          | soft lantern, lit below   |
| brutalism | ink slab · the hazard band                 | kicked up-left · yellow block in ink       | (the package's)            | boxed in ink, hard shadow |
| deco      | gold hairline with the lozenge             | gold rule · double gold frame on lacquer   | double rule in its ink     | gilt frame                |
| phantom   | the red slash · a slanted red strip        | red slash under · red plate thrown in      | hard leading edge          | cut as a calling card     |
| grotesk   | the razor tear (two rules, red hairline)   | red baseline · inverted black block        | hard leading rule          | plain square              |
| nostromo  | panel seam with an unlit lamp              | LED rim · key in its well, lamp lit        | (the package's)            | a key in its well         |
| titanium  | the milled groove                          | bright tool edge · chamfered oxide plate   | tool edge along its top    | chamfered                 |
