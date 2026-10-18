# kpadopt56 shared findings: what the demo pages cannot fix

Measured 2026-10-18 in Firefox (`measure-overflow.mjs`, `chain.mjs`-style probes of each box chain, and a mid-word probe that reads
every text node's word rects), the eleven non-formal themes and formal, 1280 and 390 px. Every item below was checked against
formal on the same page at the same width. Nothing here is changed in `css/components.css`, `js/` or a register: the first
part is approved formal work for Kenny to decide, the second is for the owner of each theme's register.

Only one thing was a demo-page cause and is fixed (commit `[t56-overflow-1018]`): the entity card grids asked 18rem per card
and now ask 22rem (see "Fixed in the demo" at the end).

## 1. Shared package (css/components.css, js/): Kenny decides

Every proposed fix is a minimal sketch, not measured except where stated.

### S1. `kp-segmented` never shrinks or wraps: the auto-refresh bar and the request-inspector filter stick out at 390 px

- Parts: `updates / auto-refresh` (`.kp-refresh__bar` > `.kp-refresh__chooser` > `.kp-segmented.kp-refresh__segments`, six
  items) and `lists / request-inspector` (`.kp-inspector__bar` > `.kp-segmented.kp-inspector__filter`, five items with counts).
- Cells: auto-refresh 12 (all 11 themes + formal) at 390; request-inspector 12 (all 11 themes + formal) at 390.
- Measured overflow past the section's right edge, 390 px. auto-refresh: dark 261, cyberpunk 249, synthwave 277, pastel 188,
  forest 186, blueprint 268, solstice 186, brutalism 299, deco 310, nostromo 303, titanium 329, formal 186. request-inspector:
  dark 103, cyberpunk 105, synthwave 120 (reported as `button.kp-button`), pastel 93, forest 91, blueprint 93, solstice 91,
  brutalism 132, deco 126, nostromo 108, titanium 115, formal 91.
- Cause: `.kp-segmented__item` is `white-space: nowrap` and the group is an `inline-grid`/`grid` of auto columns, so its
  min-content is the sum of all items (511 px refresh, 390 px inspector in formal). The wrapping flex bar cannot take the group
  below that, and its grid parent (`.kp-refresh` is `display: grid` with an auto column) grows the track to 511 px even
  though `min-inline-size: 0` is set on `.kp-refresh` itself. The section (308 px of content) scrolls sideways.
- Formal has it too (same widths, 186 and 91 px). Themes only add their own padding on top of that.
- Proposed minimal fix: let the group be its own scroller instead of the section:
  `.kp-segmented { max-inline-size: 100%; overflow-x: auto; }` (plus `min-inline-size: 0` on `.kp-refresh__chooser` and
  `.kp-inspector__filter`, and `.kp-refresh { grid-template-columns: minmax(0, 1fr); }` so the track cannot grow). Alternative:
  fold to the menu button look under 30rem, as the entity actions already do.

### S2. A raw version (a 64-character digest) has no break point: the version badge sticks out

- Part: `updates / version-states` ("Long versions", second row, `data-kp-version-digest="full"`: two `sha256:` digests), and
  `.kp-badge--version` in general (the `version` item shows the `a.kp-version__to` link squeezed to 27-30 px, which is a
  normal wrap of an inline link, not a fault).
- Cells: 21 of 22 (all 11 themes at 390; at 1280: dark 2 px, cyberpunk 86, pastel 2, forest 19, blueprint 53, solstice 2,
  brutalism 103, deco 74, nostromo 70, titanium 46; synthwave only at 390). At 390: dark 161, cyberpunk 249, synthwave 117,
  pastel 165, forest 182, blueprint 216, solstice 165, brutalism 266, deco 237, nostromo 233, titanium 209.
- Formal has it too: `span.kp-version__to` sticks out 48 px at 1280 and 211 px at 390 (the section scrolls by 49 and 212).
- Cause: `.kp-badge--version` sets `overflow-wrap: normal` ("a version breaks only where it was given a place to") and the
  digest has none; the badge is a flex item at its content width, so it grows past the row (`__from` 527 px, `__to` 528 px in
  formal at 390).
- Note: two other helpers are patching this per register right now (forest and blueprint get `max-inline-size` + a break
  inside the word, commit text seen: "the badge is now at most as wide as its place"). One shared rule makes those register
  copies unnecessary and fixes the other nine.
- Proposed minimal fix, in the `.kp-badge--version` block:
  `.kp-badge--version { max-inline-size: 100%; box-sizing: border-box; } .kp-version__from, .kp-version__to { min-inline-size: 0; overflow-wrap: anywhere; }`
  (anywhere only bites when the part is wider than its place; a normal version still breaks only after a dot, hyphen,
  underscore or colon).

### S3. A long checklist detail is `nowrap` and squeezes the label to a sliver (a word broken mid-word)

- Part: `media / print-checklist`. The sample row "Hotel booking" carries the detail "check-in after 15:00, reference 8841-KP",
  another row "it is Ghent in October".
- Cells: 4 tier-B cells at 390 (blueprint 32 px, brutalism 39, nostromo 14, titanium 61: `section.kp-checklist__group` sticks
  out). And the label itself is broken: "Hotel" / "booking" splits across lines inside the word at 390 in formal, dark, pastel,
  solstice, deco ("Hotel") and cyberpunk, synthwave ("booking"); the label is 22 px wide in dark.
- Formal: the tier-B overflow does not show (formal's narrower font fits), but the label squeeze does (formal 390: "Hotel").
- Cause: `.kp-checklist__detail { white-space: nowrap }` in a row of `auto minmax(0, 1fr) auto`; the third column takes the
  detail's full width (228 px in dark), the `1fr` label gets the 22 px that are left and `overflow-wrap: anywhere` then cuts
  the word. Where the detail is wider still (wide fonts) the row itself outgrows the card.
- Proposed minimal fix: `.kp-checklist__detail { white-space: normal; overflow-wrap: anywhere; max-inline-size: 50%; }` (the
  detail wraps and can take at most half of the row; keep `nowrap` for a short detail through `max-inline-size` only).

### S4. The entity card actions are four equal `minmax(0, 1fr)` columns: a themed button breaks "Restart" / "Update" in the middle

- Part: `people / entity` and `entity-states` (`.kp-entity__actions`, columns `repeat(var(--kp-entity-cols, 4), minmax(0, 1fr))`,
  buttons `inline-size: 100%`).
- Cells (before the demo fix): entity-states "Update", "Restart", "Logs", "More" split mid-word at 1280 in dark, brutalism,
  cyberpunk, deco, nostromo, synthwave, titanium (26 cells); 106 px buttons in cyberpunk and synthwave still split "Restart"
  after the demo fix (text 107 px against a 106 px button, 1 px short).
- Formal: clear at the same width (smaller button padding).
- Cause: the equal columns ignore the buttons' real min-content; a theme's button padding (20-22 px each side) leaves 25 px of
  text in a 65 px column, and `overflow-wrap: anywhere` on `.kp-button` breaks the word.
- Proposed minimal fix: `grid-template-columns: repeat(var(--kp-entity-cols, 4), minmax(min-content, 1fr))` (a fifth action
  or a wide theme then pushes the card wider instead of breaking the word) and `overflow-wrap: normal` on
  `.kp-entity__actions .kp-button`; or have `columnsFor` in `js/entity-card.js` count the real button widths when it chooses
  how many go inline.

### S5. Two-column footers and rows at 390 px: `kp-focus-steps__nav`, `kp-statusrow`, `kp-inspector__row`

- `calm / focus` and `focus-states`: "Next", "Back", "Done" split inside the word at 390 in brutalism (all three), synthwave
  ("Back", "Next") and deco ("Next"). `.kp-focus-steps__nav` is two equal columns (137 px in brutalism) and the large button
  keeps 32 px padding each side. Formal clear. Proposed: `grid-template-columns: repeat(2, minmax(min-content, 1fr))` and
  `overflow-wrap: normal` on the nav buttons.
- `status / today-states`: "Beweging" (brutalism, deco, synthwave) and the date "03/10/2026" (dark, brutalism, deco,
  synthwave) split inside the word at 390. `.kp-statusrow` is `20px auto auto` columns, the body column gets 75-81 px beside a
  110-123 px trailing column. Formal clear. Proposed: `minmax(min-content, 1fr)` for the body column and
  `overflow-wrap: normal` on `.kp-statusrow__label` and `__detail` (a date is a unit).
- `lists / request-inspector` (cyberpunk, 1280 and 390): the source badge "test" breaks (`tes|t`) in a fixed 63 px column of
  `.kp-inspector__row` (`32 135 63 83`) with cyberpunk's 1.56 px letter-spacing. Formal clear. Proposed: size that column
  `minmax(max-content, 63px)` or `auto`.

## 2. For the theme owner (a single theme's register)

| theme | part / item | width | measured | cause | proposed fix |
|---|---|---|---|---|---|
| brutalism | `choose / intent-states` | 390 | section scrolls sideways by 7 px (5 px on the section content box); no box sticks out, so the measure names none | `[data-theme='brutalism'] .kp-button::after` (the label tab "BUTTON", `position: absolute`, `white-space: nowrap`, `opacity: 0`, around 56 px wide) hangs out of a small button near the right edge; invisible, but it still counts toward the scrollable overflow. With `.kp-button::after { display: none }` the overflow is 0. | show the tab only on hover/focus by `display` (or `visibility` plus `contain: paint` on the section), or anchor it with `inset-inline-end: 0` when the button is in the last half of its row |
| blueprint | `confirm / question` | 1280 and 390 | `.kp-question__head` sticks out 493 px | already named in FINDINGS "Known cause": `[data-theme="blueprint"] [data-kp-measure]` matches the question card's own `data-kp-measure` attribute and pulls every card to `position: absolute` | scope the blueprint selector to its own hook (for example `[data-theme="blueprint"] [data-kp-measure]:not(.kp-question *)`) or rename the hook |
| deco | `status / notices` | 1280 and 390 | button "Mark unread" is cut by 6 px (its own overflow is hidden, no ellipsis) | deco's button clip (an ornamental frame or corner cut) clips the label by 6 px | give the label padding of at least 6 px more inside the clip, or widen `min-inline-size` of the button |
| deco | `lists / payload-cell` | 390 | "Show all 6 / 24 / 38 lines" cut by 5 and 9 px | same clip on the code box's show-all button | same |
| blueprint, brutalism, nostromo, titanium | `media / print-checklist` | 390 | group sticks out 32, 39, 14, 61 px | the shared cause S3 (these four have the widest face); a register cannot fix it, `.kp-checklist__detail` is `nowrap` in components.css | S3 |

## 3. Tier C: checked by eye and by a word-split probe

175 FINDINGS cells (about 220 printed lines) of squeezed parts were run against a probe that finds a word split across
lines and a label clipped by its own box. Findings that are real faults are in S3, S4 and S5 and in the table above. All the
rest is a normal wrap or a stress sample that wraps by design, the same in formal:

- Squeezed wrappers with screen-reader or hidden text, no visible fault: `span.kp-rating__foot` (33 px wide, rating), `div.kp-menu-button`
  "+2 ... " (people, text is the menu), `article.kp-question`, `span.kp-question__default`, `div.kp-focus-steps__tools`
  (0 px high wrapper), `div.kp-pane__head` "Back to the list" (collapsed at 1280 by design: the pane shows both columns),
  `span.kp-claim__person` (an avatar plus a name that wraps), `span.kp-code__meta`, `span.kp-checklist__detail` "2 x 10 l",
  `time.kp-steplist__time` "allowed", `span.kp-runs__rel` "in 1 day", `span.kp-heat__label-text` "Journal"/"Stretch",
  `span.kp-availability__column-name` "Kenny (you)", `span.kp-version__from`/`__to`, `a.kp-version__to`.
- Deliberate stress words that break inside the word with `overflow-wrap: anywhere` in every theme and in formal: the
  "Vandaag-schreef-ik-het-woord-onbegrijpelijk..." quote, "Vandenbroucke-Lemmens", "document-consumption",
  "production/database/replica-reader-credentials-...", "immich-machine-learning-worker...", the QR caption URL,
  "production-database-snapshot-for-the-reporting-replica.sql.gz", and "page-wide" (a hyphenated word that breaks at its
  hyphen, which is the normal wrap). These are the approved edge samples.

## Fixed in the demo

- `people / entity-states` (and the same section copy embedded in the other pages): `data-kp-entity-min` 18rem to 22rem on
  `#kv-entity-cards` and `#kv-entity-gstates`. Measured with the knob set live: no action word split in dark, brutalism and
  titanium at 1280, 1024 and 390, and in deco and nostromo at 1280; cyberpunk and synthwave keep "Restart" split by 1 px
  until S4 is decided.
