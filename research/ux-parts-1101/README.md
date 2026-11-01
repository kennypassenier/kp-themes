# research/ux-parts-1101: seven parts from the app review

**Decided (2026-11-01 23:40 UTC):** Kenny approved both pairs (formal) in round 2, so all seven parts are decided. Recorded in `VERDICTS.json`; the page is not offered again.

The app review of 2026-11-01 (`~/Projects/ux-review/kp-themes.md` and `kp-themes-components.md`, reviewers A and B over kyu,
Almanac, homelab, http-switchboard, Medicine Cabinet and Kitchen) found seven things the package lacked: three options whose
default the demo set ("Als optie, demo kiest") and four parts to build ("Bouwen, met demo").

**Round 1** (page round `ux-parts-1101-e994c521-37e0-4c56-b12b-ed4d536f4d1e`, seven sections, formal only) was judged
2026-11-01 23:22: five approved (`tri-state-chip`, `popover-form`, `empty-ghost-lines`, `date-nav`, `row-undo-delete`), two not
(`VERDICTS.json`), and the three-way chip's default changed to the word (`data-kp-segmented-tri-look`, `word` by default since).
Round 1 is kept in `_previous/` (snapshot of 674a1a18).

**Round 2** shows only the two open sections, formal only (DEMO_RULES ch. 6), at full width and in a 390 px stage:

| Section             | Kenny's note                                                                      | What changed                                                                                                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `chips-narrow`      | "the phone version is unwatchable"                                                | the toolbar stacks on its own width and the chips share their row on balanced columns, 44 px, count at the end (`data-kp-segmented-narrow`); the menu is the option `data-kp-segmented-fold="menu"` |
| `auto-refresh-form` | "the options with paused and every x.. should be on their own line and maybe even scrollable" | under 30rem of its own width the bar is two rows, every choice on a scrolling row of its own with the current one in view (`data-kp-refresh-narrow`, js/auto-refresh/narrow.js)                |

The approved looks fold on the window's width, which a 390 px stage in a wide window never reaches, so the stage gives the "Now"
frames the folded markup a phone shows (`kp-toolbar--stacked`, `data-kp-refresh-stack="always"`); the new looks read their own
width. The data is the apps' own shape (Medicine Cabinet's Overview filters, kyu's Topics header) with mock counts.

**Generated** by `node research/ux-parts-1101/build.mjs` (edit the builder, sections.mjs or markup.mjs, never the page). The builder
holds only the two open sections; round 1 is in git history.
