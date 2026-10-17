# research/kpadopt6-ops: the sixth adoption round, seven more operations parts

One page, `demo.html`, formal only (`data-review-themes="formal"`): seven parts the admin dashboard draws by hand today, one review topic per part,
each with an Expected block, a look-at line and the controls that press its states. Nothing moves until a button is pressed.

| Topic   | Part                                                                    | Module                          |
| ------- | ----------------------------------------------------------------------- | ------------------------------- |
| toggle  | a button that stays pressed, filters with exact counts, a one-of switch | `js/toggle.js`                  |
| intent  | the command palette that finds words in any order (now the default)     | `js/intent.js`, `js/palette.js` |
| version | the chip for a version jump                                             | `js/version-delta.js`           |
| ack     | the tick that must be set before an update may start                    | `js/ack-gate.js`                |
| deplist | the list of what depends on what, numbered in the order things must go  | `js/deplist.js`                 |
| trace   | the path one connection takes, allowed or refused hop by hop            | `js/path-trace.js`              |
| entity  | the fixed card of one stack                                             | `js/entity-card.js`             |

`page.css` (`k6-` classes) only lays the sections out; `demo.js` feeds the components sample data and writes their events into a readout.
Kenny's answers of 2026-10-17 are binding where they differ from the spec: the version chip counts the first number, plus a list of apps for which the
second number counts as well; the dependency list is numbered; the palette's word-order matcher is the default for every palette.
