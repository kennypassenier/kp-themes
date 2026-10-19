# research/trace-diff-1019: the trace's state column and the diff's long line

Round `tracediff-<uuid>` (see `demo.html`, 2026-10-19): 2 sections, 2 pairs (formal). Found by HTTPSwitchboard (kp-gaps 26, 27), confirmed in
the code, fixed in the package. They change approved components, so they come back through the review dialog. Bundled into
`round-4-1019` (`VERDICTS.json`); the page is not offered on its own and has no Agenda entry.

1. **trace-column**: in a trace stood in a column the state word of each hop was as wide as its own word, so the hops' words ended on different
   edges. Fix: the list owns the tracks and each hop is a subgrid of them (css/components.css).
2. **diff-line**: a long token ran past the other lines of a diff. Fix: the text track is `minmax(0, 1fr)` and the token wraps (css/components.css).

**Generated** by `node research/trace-diff-1019/build.mjs` (edit the builder, never the page).
