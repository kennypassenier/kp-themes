# research/kyu-11-topic-messages: kyu on kp-themes 11.0.0, the bottom half of the Topic page

Part of the review demo that shows how kyu's dashboard pages look on kp-themes 11.0.0 (map: `kyu/docs/KP_THEMES_11_ADOPTION.md`). This part is
the lower half of `/t/{topic}/dashboard`: the dead letters of a topic (what died, why, the remedy, the payloads, requeue and delete), the recent
messages (list, payload, new arrivals, opened large), and the box that publishes a test message. Formal only. All data is mock (topic
`notify.kenny`, subscriptions `desktop`, `phone`, `kyu-runner`, `almanac`, `archive`; the real dead letter `{"title":"eerste echte bericht","body":"hello from HA"}`).
Two sections are new use cases that need kyu backend work and say so in their first sentence: bulk requeue/delete and replay.

| # | Section | Components and options | Choice sets (default first) |
|---|---|---|---|
| 1 | Dead letters: what died, why and what now | `problems` (`setProblems`, `command` remedy, fix buttons with flash), `.kp-empty` + `art` (done), busy card, state plate | layout each / list / fold; fold from 5 / 3 / 7 |
| 2 | Dead letters: payloads you can read, and a link to each | `datatable` (sort, multi-sort, search, choice filter, column menu, cards, remembered, empty / loading / failed), `code` in cell mode (Pretty/Raw, fold, Copy, binary, truncated, empty, loading, error), `anchors` (rows, landing and "no longer here"), `actions` column, `undo-toast` | opens inline / dialog; # link hover / always; copies url / hash |
| 3 | [server] Dead letters: requeue or delete many at once | `row-select` (j/k, x, Shift range, Ctrl+A), `selection-bar` (names, matching 110, rules with reasons, busy, partial result, Undo), `datatable` select column, phone card list | bar sticky-top / inline / floating-bottom; names / count; max names 6 / 3 / 10; range shift / off; arrows on / false; Ctrl+A on / false |
| 4 | Recent messages: list left, payload right | `master-detail` (resizable, remembered, sheet on a phone, empty / loading / error detail), `code` (lines, fold), list states | phone shows sheet / one-pane / stack |
| 5 | New messages while you read | `newpill` (head, unit, since-left divider), `auto-refresh` (event mode, 30 s, failed refresh), `freshness` (`data-kp-ago`), exact count 120 | divider on / off; interval 30 / 15 / 60 s |
| 6 | A payload opened large | `viewer` (ready, loading, error, unsupported/binary), `code` with line numbers, Copy (flash) and Download | size wide / full |
| 7 | [server] Replay this message | `flash` button (busy, success line, refusal `{error, remedy}`, failed) | refusal line / button / toast; width keep / grow |
| 8 | Publish a test message | `json-field` (strict, Format/Minify, gutter, line and column), `autosize` (counter, Ctrl+Enter, remembered draft), `forms` (summary, field errors), `flash` submit | JSON strict / allow-text; format button / on-blur / off; check input / blur; indent 2 / 4 / tab; gutter on / off; counter chars / lines / both / off |

Checks (Firefox): `check-kit.mjs` clear, `measure-gaps.mjs ... formal 1280,390` clear. Round id `kyu11messages-3c1a9d54-7b2e-4f61-a8d3-5e0b6f9c2a17`.

Notes: the page opens still; nothing moves until a button is pressed (the live list waits for its first refresh at 30 s and brings nothing until "Next refresh" is set). The
viewer's state buttons plan the next opening; the "Open the viewer" button opens it.
