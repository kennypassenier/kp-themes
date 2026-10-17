# research/kpadopt6-ops: the sixth adoption round, second round (three parts sent back)

**Decided (2026-10-18 01:21):** Kenny approved every part in formal, defaults kept. Recorded in `VERDICTS.json`; the part is not offered again.

One page, `demo.html`, formal only (`data-review-themes="formal"`): the three parts of round one that Kenny did not approve on 2026-10-18 (the other
four, version, ack, deplist and trace, are approved and left the page). Each has an Expected block, a look-at line and the controls that press its
states. Nothing moves until a button is pressed. The first round's page is kept under `_previous/`.

| Topic  | Part                                                                      | Module                          |
| ------ | ------------------------------------------------------------------------- | ------------------------------- |
| toggle | a button that stays pressed, shown beside the segmented control it joins  | `js/toggle.js`                  |
| intent | the command palette that finds words in any order (now the default)       | `js/intent.js`, `js/palette.js` |
| entity | the fixed card of one stack: buttons only from the data, a gap above them | `js/entity-card.js`             |

`page.css` (`k6-` classes) only lays the sections out; `demo.js` feeds the components sample data and writes their events into a readout.
