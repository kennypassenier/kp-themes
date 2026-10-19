# AuDHD recipe app · bad days (demo, formal only)

**Decided (2026-10-19 02:38):** Kenny approved every pair (5 of 5 approved, defaults kept). Recorded in `VERDICTS.json`; the page is not offered again. One section was rebuilt afterwards for the grid rule and is asked again in research/audhd-recepten/grid-fix.

`demo.html` (data-review `audhd-baddays`). Five sections, each with a heading, one sentence, an Expected block, a look-at line and
working state buttons (ready, loading, empty, failed). No calorie or weight field anywhere. Sample content, dates and the server are pretend.

| Section | Component | Why this one |
| --- | --- | --- |
| Safe dishes | `js/action-tiles.js` (`.kp-actions`) inside `js/card-state.js` | `tiles.js` only equalises tile heights; `action-tiles` is the tile itself: a button with a title, one sentence saying what it does, a meta line and a busy state. The card gives loading (busy card), empty and failed at one footprint. |
| The freezer | `js/datatable.js`, `js/freshness.js` (`kp-ago`), `js/undo-toast.js` | Sortable table, oldest first; "How long" is a ticking `kp-ago`; Take one portion has Undo instead of "are you sure". `as-of.js` is not a "how long" module (it only scopes late attaches), so it is not used. |
| Zero-prep shelf | `.kp-action-list--lead`, `js/segmented.js`, `js/card-state.js` | Rows with a lead, one button column; the segmented control filters by energy ("Just open it" 4, "One easy step" 7, "Anything here" 9). |
| Mini recipe | `js/focus-steps.js`, `js/segmented.js`, `.kp-lede` | Mini (3 steps, 12 min) or full (9 steps), one step at a time; a line says what the mini drops. |
| When things went in (own idea) | `js/calendar.js` with `data-kp-tones="calm"` (`js/calm-tones.js`) | Days you froze something are filled, other days are quiet, never "missed"; a holiday week can be hatched. |

Options (default first, each switchable in the dialog and a `data-review-choices` set): tile size big/huge, small line full/time/none, press
recipe/tonight; undo clock ring/bar/words/none, undo time 10/6/20 s (10 s on purpose: slow reactions are not punished), old-portion hint
quiet word/time only; shelf lead minutes/word; screen wake on/off; calendar fill accent/success, time away none/holiday.

Own ideas and why they help: tiles never reorder (muscle memory, no choice stress); the old-portion hint is a grey word, never a colour; undo
rather than confirm (no friction when tired); the shelf filters by "what I can manage today" in neutral words (no "lazy" tier); the empty
freezer says "that is fine" and points to the other bad-day tools; the calendar makes a quiet day neutral.

## Component gaps
- **action-tiles**: no size option; the demo turns `--kp-actions-min`, `--kp-action-pad`, `--kp-action-title-size`. Wanted `data-kp-action-size="lg|xl"`.
- **freshness (`kp-ago`)**: the stale state is a warning plate, there is no calm tone, so the freezer cannot mark age through it; wanted `data-kp-stale-tone="calm"`. Also no days-only unit option ("frozen 41 days 3 h ago"); wanted `data-kp-ago-units="days"`.
- **calm-tones**: only calendar, heat and uptime take it; datatable cells have no quiet tone. The hint is a plain `kp-badge` shown after 60 days.
- **freshness auto-attach**: `js/auto.js` attaches `[data-kp-ago]` only for lines present at load, so rows added later need `attachAgo()` by the page.
- **datatable**: an empty or failed state stands under a still-rendered table wrap; the demo hides the wrap with `:has()`.
