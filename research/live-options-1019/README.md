# research/live-options-1019: options that were read once now follow their attribute

**Waiting for a verdict (2026-10-19).** Round `live-options-e555dcab-eba4-4df6-9a04-52f46476da29`: 10 sections, 10 pairs (formal only; nothing
here looks different per theme). They change components Kenny had approved, so they come back through the review dialog with a "What changed
since you approved it" text (DEMO_RULES ch. 2, 7 and 9). The fixes are in the package (js/, one new module), published with the next release
after 11.0.0.

DEMO_RULES ch. 2: a variant that could be a setting is a component option with a default, switchable at runtime; the demo shows that switch
working. In each section the buttons above the component set the attribute a page would set; the component follows at once.

1. **refresh-look** (kyu 9, http-switchboard 9): `data-kp-look` of the refresh chooser (segments or menu) was read once. The chooser is now
   built by a function and redrawn when the attribute changes (the interval, countdown and updated line stay); `data-kp-refresh-choices`,
   `-stale-after`, `-announce`, `data-kp-refresh` and `-refresh-key` follow too.
2. **refresh-paused** (kyu 8, http-switchboard 8): `fire()` returned at once when the interval was 0, so Refresh now, R and Retry now did
   nothing while paused. A refresh the person asks for now always runs (it also no longer waits for a dialog or a field being typed in); the
   timer still only runs with an interval. A failure while paused says "Last refresh failed." (new string `refreshFailedPaused`).
3. **newpill-placement** (http-switchboard 11): `data-kp-pill-placement` was read once; it is now read again on change.
4. **sort-multi**, 5. **filter-mode** (kyu 9): `data-kp-sort-multi` and `data-kp-filter-mode` shaped the chrome built at attach. The one-table
   wiring of js/datatable.js is now a function; a change of either attribute puts that table back to its markup, wires it again and gives it
   back its view (query, scope, filters, sort, page size, hidden columns, density, folds, open rows, selection, page, state). The handle a
   page holds stays valid (the new table's methods move onto it).
6. **lede-options** (kyu 9, audhd-recepten 10): the fold and the link are drawn by `draw()` and redrawn on a change of
   `data-kp-lede-collapsible` or `-link`. (The "never folds with a link" half of audhd 10 was already fixed by findings-1019.)
7. **secret-options** (kyu 9): `-ttl`, `-reveal-on`, `-mask`, `-mask-char` are read by `readOptions()` and applied on a change (a shown value
   is hidden first when the gesture changes; a new time restarts the count).
8. **palette-match** (kyu 2): `data-kp-match` chooses the matcher and the intent filter; a change gives the commands back and draws them
   again for what is typed. Also fixed here: the start-of-name matcher got the markup's indentation, so `prefix` found nothing in an
   indented list.
9. **qr-retry** (audhd-recepten 13): `data-kp-qr-retry` was the one option missing from the list of attributes the code watches.
10. **segmented-mode** (kyu 18): the roles and states of `single`, `multi` and `tri` are rewritten on a change of `data-kp-segmented`; the
    values that were on stay on, and the All segment is a value in single and the absence of values in multi.

**Shared helper.** There was none (each module ran its own MutationObserver), so `js/live-options.js` adds `watchOptions(element,
attributes, onChange)`: it calls back once per batch with the names whose value really changed (a value written again, or changed and
changed back, is not a change).

**Generated** by `node research/live-options-1019/build.mjs` (edit the builder, never the page). Checked in Firefox with scratch scripts
(not tests); numbers are in the session report.
