# research/b3b4-1019: data table and disabled-reason fixes

Round `b3b4-<uuid>` (see `demo.html`, 2026-10-19): 5 sections, 5 pairs, formal only (none of the faults differs per theme). Found by the
project threads (homelab 33, 34; kyu 16, 28; almanac 8, 13), confirmed in the code, fixed in the package. They change approved components,
so they come back through the review dialog with a "What changed" text. The page has no catalogue entry: its pages are bundled into
`round-2-1019` (`VERDICTS.json` `bundledInto`). See CHANGELOG.md "Unreleased".

1. **table-removed-rows**: a row the page took out stayed in the count, the "filtered from" total and the pager until `refresh()`. Fix: the
   table watches its body (client-side tables) and re-reads the rows by itself, keeping the page (js/datatable.js).
2. **table-held-row**: every redraw and `refresh()` set `hidden` on every row, so a page could not keep one hidden. Fix: a row marked
   `data-kp-row-hidden` is held out of the table (not counted, paged, searched or shown) until the attribute goes.
3. **table-date-pills**: date pills and the backwards-range refusal printed ISO. Fix: written in the table's locale (`boundText`). `page()` is
   zero-based by design (as `view().page`); now written down, and `view().pageNumber` is the pager's number.
4. **table-expand-single**: `data-kp-expand-single` was read once. Fix: it is a watched option; the toggle column in the column numbers is
   written down.
5. **reason-columns**: the disabled-reason wrapper lost `data-kp-action`, so an off button's column differed from its neighbours'. Fix: the
   wrapper wears the role (js/reason.js) and fills its column with the button (css/components.css).

**Generated** by `node research/b3b4-1019/build.mjs` (edit the builder, never the page).
