# research/kpadopt5-ops: the fifth adoption round, the operations components

One page, `demo.html`, formal only (`data-review-themes="formal"`): seven parts a dashboard needs and today draws itself, one review topic
per part, each with an Expected block, a look-at line and the controls that press its states. Nothing moves until a button is pressed.

| Topic                      | Part                                                                                    | Module                  |
| -------------------------- | --------------------------------------------------------------------------------------- | ----------------------- |
| ops-page-scaffold          | the page frame: header, KPI strip, attention band, toolbar, card grid                   | css only (`.kp-ops`)    |
| ops-master-detail          | a list and its detail that folds on a phone                                             | `js/master-detail.js`   |
| ops-auto-refresh           | the automatic refresh chooser                                                           | `js/auto-refresh.js`    |
| ops-connection-banner      | the offline and reconnecting banner                                                     | `js/connection.js`      |
| ops-transfer-progress      | a transfer with its speed and the time left                                             | `js/transfer.js`        |
| ops-question-card          | a question that waits for an answer, with a countdown                                   | `js/question-card.js`   |
| ops-notification-centre    | the counter, the panel with the newest notices and the Inbox page                       | `js/notices.js`         |

`page.css` (`ko-` classes) only lays the sections out; `demo.js` feeds the components sample data and writes their events into a log.
Kenny's answers of 2026-10-17 are binding where they differ from the spec: auto refresh opens at 30 s and takes any value; a question card
stays with its outcome; the notification centre is a panel with the newest plus the Inbox page; a folded list and detail shows one pane at
a time with a Back button.

Round 2 (2026-10-17): only connection, transfer and notices are back. The connection banner stands at the foot by default
(`data-kp-placement="top"` puts it under the navigation bar; both shown); a transfer of unknown size breathes in place and settles
(the busy bar restarted because `build()` moved its nodes on every report); Mark read / Mark unread is the first slot of the
actions grid in every notice. The round-1 page is in `_previous/`.

Page round id: `ops-553b88cf-7ad0-4d60-b4b1-19d4090d8b91`, received: `ops-c17983a9-c644-4e17-b04b-bf6ed4735b60`.
