# research/kpadopt5-rows: the fifth adoption round, rows

Formal only (Kenny's rule: a new demo starts in formal, then asks to extend). Seven parts, one review topic each: ticking rows with the keyboard
(`js/row-select.js`), the selection bar (`js/selection-bar.js`), the toast with Undo and a clock (`js/undo-toast.js`), the pill for new lines
(`js/newpill.js`), the payload cell (`.kp-code--cell` in `js/code.js`), the JSON box (`js/json-field.js`) and the request inspector
(`js/request-inspector.js`). Options Kenny should pick are boxes to tick in the review dialog (`data-review-choices`).

- `demo.html` is the one page; `rows.js` fills the sample data and answers the demo's controls; `rows.css` lays the sections out.
- `VERDICTS.json` has no rounds yet. The page round is `rows-dfb064e2-85b0-4f84-8cb7-706a0b868f2f`, `received: []`.
- Specification: the option design of 2026-10-17 (items 10, 11, 12, 18, 21, 22, 23) and Kenny's answers of the same day.
