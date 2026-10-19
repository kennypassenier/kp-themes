# research/r1r2-1019: the calendar and the pipeline on the state plate

Round `r1r2-<uuid>` (see `demo.html`, 2026-10-19): 2 sections, 2 pairs (formal only: both fixes are the theme's existing state plate). Found by
Almanac (1 and 5), confirmed in the code, fixed in the package. They change approved components, so they come back through the review dialog with
a "What changed" text. This page is not offered on its own: `VERDICTS.json` says `"bundledInto": "round-2-1019"`, and there is no catalogue entry.
See CHANGELOG.md "Unreleased".

1. **calendar-states**: a calendar in its standard colours drew an empty or failed month as a small grey line with the grey days under it and no
   Retry; only the calm calendar had the plate. Fix: every tone gets the plate over its grid, Retry as `kp-calendar-retry` (js/calendar.js).
2. **pipeline-states**: a failed board was a thin strip above lanes that kept showing 0, a lane could not be marked failing, stage names ended in an
   ellipsis. Fix: the plate over the whole board at its loaded height (js/footprint.js), `danger: true` lanes (destructive plate and the words
   "Needs attention"), names wrap and the lanes share one set of rows (a subgrid) (js/pipeline.js, css/components.css).

**Generated** by `node research/r1r2-1019/build.mjs` (edit the builder, never the page).
