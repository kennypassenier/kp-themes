# research/almanac-delivery-chain: Almanac's delivery chain, retry schedule and set-aside entry

Review demo (formal only, 3 sections, 3 pairs) for two new Almanac use cases from `almanac/docs/KP_THEMES_11_ADOPTION.md`:
feat-ui-3 (delivery chain) and feat-ui-4 (retry schedule), plus the problem a set-aside entry becomes.

| Section | Components | What it judges |
| --- | --- | --- |
| chain | `.kp-pipeline` | Four stages (received, journal, worker, Google Calendar) plus a closed "Set aside" lane; healthy, Google refusing, token refresh failing, loading, failed. Choice: share of all on or off (default on). |
| schedule | `.kp-runs`, `.kp-gantt` | The next tries of the waiting entries as a list (default) or a timeline with a lane per entry. Choice: list or timeline. States: waiting, nothing waiting, loading, failed. |
| aside | `.kp-problems` | An entry Almanac set aside as a problem with its remedy, one, two or none. No Retry now button: Almanac cannot retry a set-aside entry (see below). |

## Real and mock

- Real (live service, 19/10/2026): version 4.1.7, 3 accepted, 3 delivered, 0 failed, 0 dead, journal pending 0. Event titles are the fixtures' (`almanac/fixtures`).
- Real rules: the wait after a pass that delivered nothing is 15 s, 1 min, 5 min, 15 min, then 30 min for ever (`src/core/pacing.rs`);
  a temporary Google refusal (429, 5xx, 403 with a rate or quota reason) is retried without limit; a permanent refusal sets the entry aside
  after 3 strikes, counted in memory (`src/shell/worker.rs`, `PERMANENT_FAILURES_BEFORE_DEAD`); a set-aside entry is kept in the journal and
  never tried again, and no route or action re-queues it. All waiting entries are tried together in one pass, so the next-try times are shared.
- Mock, labelled "sample data" on the page: every outage, the four waiting entries (source names other than home-assistant are mock), every
  time on the schedule (computed from the moment the page opens so "in 21 min" and the timeline's now line stay true), and the two set-aside entries.

Files: `demo.html`, `demo.js` (wires the state buttons, remembered in localStorage), `page.css` (page frame, the lit stage, stable heights).
