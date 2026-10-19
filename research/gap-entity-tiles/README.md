# research/gap-entity-tiles: a trend line and an app tile for the entity card

Round `gap-entity-tiles-0970f212-7e57-48dd-b3cd-4abb906edd72` (2026-10-19): 3 sections, 3 pairs (formal).

The homelab admin dashboard (gaps research, `gaps-2.md` 5a and 5b) still draws two things beside the entity card by hand. Both are now
options of the existing entity card (`js/entity-card.js`, `.kp-card--entity`), not a new component:

1. **The trend row** (`trend: number[]`, `trendLabel`, `trendText`; `data-kp-entity-trend` = `auto` default, `on`, `off`). One more row of the
   meters block: label, a 24-hour line drawn with `drawSparkline` from `js/kpi.js` (own parts `kp-entity__spark-line` and `-area`), and the
   current value, on the meters' own columns. `auto` gives every card of the grid the row as soon as one card has a `trend`, so cards stay level;
   a card with fewer than two readings keeps the row and says "no line yet". The line is an `img` with the text alternative "CPU 24 h, now 34%".
2. **The tile** (`data-kp-entity-kind="tile"`; data `href`, `external`, `description`, `lines`, `starred`; `data-kp-entity-star` on/off,
   `data-kp-entity-star-key`, event `kp-entity-star`). Four rows (identity, state as the package's `kp-health` dot and word, description,
   lines), no actions row; the name is the real anchor stretched over the card; the star is a real toggle (`js/toggle.js`, icon look) above
   the link, so pressing it or the key `s` never follows the link. Loading is bones in the same rows, `empty` says "not measured" in the lines
   row, `error` replaces description and lines with "reading failed" and a normal Retry.

Sections, one component each, controls at the component (at most 4 groups):

| Section  | Component                      | Control groups                                                                                                                 |
| -------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `trend`  | stack cards with the trend row | Trend line (Shown / Hidden), Readings (full day / one reading, Add a reading), State (Ready / Loading / Not measured / Failed) |
| `tile`   | the app tile board             | Opens in (this tab / a new tab), Favourites (two / none / all eight), Star button (Shown / Hidden)                             |
| `states` | the tile board in its states   | State (Ready / Loading / Not measured / One tile failed / Grid failed / No apps), Width (Wide / Phone)                         |

Formal only, as a new component is (DEMO_RULES ch. 6); the other eleven themes follow once Kenny has approved it here. Nothing in the
register files changed: the star and the tile use the package's own toggle, health dot, idmark and card. Hand-written page; the sample data
(stacks, readings, log lines) is mock and says so on the page.

**Bundled** (Kenny, 2026-10-19 02:38): this demo is the source of the review page [research/gap-round-1](../gap-round-1/demo.html) and is no longer on the Agenda by itself (`"bundledInto"` in its VERDICTS.json).
