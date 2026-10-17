# research/kpadopt5-rows: the fifth adoption round, rows

Formal only (Kenny's rule: a new demo starts in formal, then asks to extend). Seven parts, one review topic each: ticking rows with the keyboard
(`js/row-select.js`), the selection bar (`js/selection-bar.js`), the toast with Undo and a clock (`js/undo-toast.js`), the pill for new lines
(`js/newpill.js`), the payload cell (`.kp-code--cell` in `js/code.js`), the JSON box (`js/json-field.js`) and the request inspector
(`js/request-inspector.js`). Options Kenny should pick are boxes to tick in the review dialog (`data-review-choices`).

- `demo.html` is the one page; `rows.js` fills the sample data and answers the demo's controls; `rows.css` lays the sections out.
- `VERDICTS.json` has no rounds yet. The page round is `rows-dfb064e2-85b0-4f84-8cb7-706a0b868f2f`, `received: []`.
- Specification: the option design of 2026-10-17 (items 10, 11, 12, 18, 21, 22, 23) and Kenny's answers of the same day.

Round 2 (2026-10-17): only the new-lines pill and the JSON box are back. The log rows have fixed columns for the time, the level
and the line (they overlapped); the "New since" divider is on by default (`data-kp-since-left="off"` turns it off, read at
runtime); the JSON gutter is laid over a gutter that is exactly as tall as the text box and scrolls with it. The picks of round 1
(arrows walk rows and Ctrl+A in the table, the bar stuck to the top with names and +N more, the toast with a draining ring, the
payload opening in the cell, checking while typing with Format and Minify buttons, requests all folded) are the defaults of
their components. The round-1 page is in `_previous/`.

Round 3 (2026-10-18): only the JSON box is back (the new-lines pill is approved and left the page). Long could not be scrolled in the
review dialog: the box measured its height with a twin textarea appended to the page's body, and the dialog hides every part of the
page outside the section, so the twin measured 0 and the box stayed six lines high with scrolling off. The box now measures from
its own lines (and its mirror when wrapping), grows to 20 lines and scrolls inside itself with wheel, keys and scrollbar; the wheel
also works over the line numbers. The 390 px box takes the sample buttons too. The round-2 page is in `_previous/`.

Page round id: `rows-8e808b98-7c3f-4fba-adea-9781e6b60e63`, received: `rows-dfb064e2-85b0-4f84-8cb7-706a0b868f2f`, `rows-b7aeeae6-3b7f-4f9f-a823-d4447a1816e7`.
