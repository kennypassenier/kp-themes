# research/gap-activity-feed: the activity feed

Round `gap-activity-feed-20d466eb-19f4-45d6-ae44-6579548ca243` (2026-10-19): 5 sections, 5 pairs (formal only; the other eleven themes
come after Kenny approves it in formal, DEMO_RULES ch. 6).

The component is `kp-feed` (`js/feed.js`, `css/components.css`, block `gap-activity-feed:feed`), found missing by the homelab admin
dashboard (evidence: gap 4 of the gap list, 2026-10-19). The dashboard drew the same row twice, on a stack's History tab and on the
Activity page: a coloured outcome dot, a bold "what", a chip naming who started it, a muted detail line, the time on the right, and a
heading per day with that day's count. The package had every part and no row that joins them, so the row is made from the parts:

- the status row's shapes and glyph tokens for the mark (`js/statusrow.js`; a shape and a word, not a colour alone),
- the identity chip (`js/idmark.js`) for the actor,
- the ticking `kp-ago` (`js/freshness.js`, new attribute `data-kp-ago-bare`: "12 s ago" without a verb) for the time, and the
  dd/mm/yyyy HH:mm moment after 24 hours,
- the timeline's rule (`kp-timeline`) between the marks of a day,
- the thread's day divider (`js/thread.js`) for the day heading, with "Today", "Yesterday" and the day's count,
- the empty and failed plates (`js/state-plate.js`), the busy card (`js/busy-card.js`) and the held footprint (`js/footprint.js`).

| Section                                 | Component options it shows                                                             | Pair   |
| --------------------------------------- | -------------------------------------------------------------------------------------- | ------ |
| `feed-days`: a day of activity          | states (ready, loading, empty, failed, stale), grouping (by day, one list)             | formal |
| `feed-row-options`: what a row shows    | time (auto, relative, clock, moment), actor (chip, mark, off), rail (on, off)          | formal |
| `feed-rows-open`: lines under a row     | expand (many, one, off), the title as link, the opened lines                           | formal |
| `feed-earlier`: load earlier            | the foot in its four states and hidden; the real button loads two older pages and ends | formal |
| `feed-narrow`: a narrow, scrolling feed | the phone layout (container query), a list that scrolls with its day headings in place | formal |

Hand-written page; every control is a toggle that changes the component (`aria-pressed`), the markup of each feed is written by
`js/feed.js` from the rows in `demo.js`. The data is homelab-shaped (stacks jellyfin, sonarr, traefik; real-looking log lines) and is
mock: the times are relative to the moment the page opens, so "Today" and "Yesterday" are always true.

Not touched: any other component, any register. `kp-feed` has no register rules yet: it is formal, judged first (gates/register-pending.json).
