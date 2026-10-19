# kyu-11-overview: the parts of kyu that cross pages

Review demo (formal only, mock data in kyu's shape) for the cross-page part of `KP_THEMES_11_ADOPTION.md`: the command
palette, the keys with the `?` sheet and the hint line, the first-visit tour, link anchors, and "who reads what" as a line
diagram next to a hub-and-ring graph. Files: `demo.html`, `demo.js` (mock data and wiring), `page.css` (frame only).

| Section | Components and options used | Choice sets (default first) |
|---|---|---|
| Command palette | `palette` + `intent` (`data-kp-context`, `-featured`, `-static`, `-verb`, `-words`, `-nomatch`, `-group-order`), `setState` loading/error with Retry, modal open (button and Ctrl K) | matching (intent, substring, prefix, subsequence), marks (on, off), one letter off (0, 1), when nothing matches (plate, status) |
| Keys | `shortcuts` (`registerShortcuts`, sheet `data-kp-shortcuts-live`, reason on a dimmed key, scope = element), `keys` (`kp-keys`, `kp-keys--end`) | chord cap place (centre, bottom-centre), unknown chord word (say, silent), hint line (start, end) |
| Tour | `tour` (`startTour`, `remember`, `shouldStartTour`, `?tour`), `kp-drawer` Help shown open and as a modal | none: the module has no switchable option beyond `start` and `remember` |
| Anchors on headings | `anchors` headings, "no longer here" notice | position (after, before), show (hover, always), copy (url, hash), landing (highlight, none) |
| Anchors on rows | `anchors` rows on a `datatable` (sort, states loading/empty/failed), landing flash, row removed, `art` done | the same four, set on the headings section |
| Who reads what, lines | `uses-map` via `setMatrix` view lines, grid view, states, phone list | shape (curve, elbow, straight), side (left, right), light (both, hover, pick, off), count (on, off) |
| Who reads what, graph | `graph` hub-and-ring, link kind = subscription state (active, flagged, archived), live update | node size (same, by waiting messages) |
