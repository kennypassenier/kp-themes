# research/kpadopt6-calm: the sixth adoption round, calm screens

**Decided (2026-10-18 00:28):** Kenny approved every part in formal and changed some defaults, applied in the package and in this page. Recorded in `VERDICTS.json`; the part is not offered again.

Six parts for a daily check-in and a quiet today screen, built in the package and shown in formal only until Kenny has judged them (Kenny, 2026-10-17, form keuzes-nieuwe-onderdelen):

- **Picker with the usual on top** (extends `kp-combobox` with `data-kp-usual`, `js/usual-picker.js`): a band of the usual choices, pinned "Nothing to log", "Show all 38", tags with "Not today", inline add with Undo and the near-match guard. Choices: what the band does while typing, what a near name does, whether the full list folds.
- **Questions, one per screen** (answer mode of `kp-focus-steps`): big answers, "Same as yesterday" and "Same as usual" (two buttons, Kenny's answer), Not today, resume, summary. Choices: how progress shows, what a tap does.
- **Today card** (calm vocabulary of `kp-statuslist`: `data-kp-status-vocab="calm"`): open, done, paused since a date, not known; Resume with Undo. Paused stays a quiet row (Kenny's answer). Choices: how a pause is told, where the open rows stand.
- **Quote card** (`kp-quote`, new, `js/quote.js`): your own words with who and when, folded behind Show all, Hide with Undo. Choices: how the date reads, where a quote folds.
- **Calm days** (`data-kp-tones="calm"` on the calendar, heat grid and uptime strip, `js/calm-tones.js`): logged in the theme's accent (Kenny's answer), quiet, paused. Choices: the colour of a logged day, the legend.
- **Star rating** (`kp-rating`, new, `js/rating.js`): five whole stars (Kenny's answer), display, table cell. Choices: what a tap does, the star under the pointer.

One page, `demo.html`, one review topic per part (two sections each: the part, then its states and phone width). Round 2 (defaults-1017): `usual-states` was approved and left the page; the other eleven sections are asked. The page round is `calm-c39372f2-91de-4620-b0fc-060c328526cc`, `received` = the round-1 page. Every choice set only sets the default. Every choice shown as a button in a section is a real attribute of the component: changing it redraws the component.
