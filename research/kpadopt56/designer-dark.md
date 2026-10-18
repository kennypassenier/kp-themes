# kpadopt56 designer notes: dark, cyberpunk, synthwave

Worked 2026-10-18 on branch `theme/t56-a`, only in `css/dark-register.css`, `css/cyberpunk-register.css` and
`css/synthwave-register.css` (plus the generated files each commit regenerates). Formal, `css/components.css` and `js/`
were not touched. Measured in Firefox with `research/_review/measure-gaps.mjs`, `measure-plate.mjs` and
`research/kpadopt56/measure-overflow.mjs`, at 1280 and 390 px.

Every commit below is one item; the subject tag is `[t56-<item>-1018]`.

## Measured, before and after

Cells are the counts of research/kpadopt56/FINDINGS.md (item, theme, width) on the eleven part pages.

| theme | A text gaps | B sticks out | C squeezed |
|---|---|---|---|
| dark | 6 -> 1 | 4 -> 1 | 12 -> 13 (see below) |
| cyberpunk | 4 -> 2 | 4 -> 0 | 14 -> 16 |
| synthwave | 9 -> 2 | 3 -> 0 | 19 -> 21 |

The nine original demo pages (kpadopt5-*, kpadopt6-*) print clear on measure-gaps for all three themes at 1280 and 390.
Tier C went up by the cells the new narrow layouts show as wrapped words ("Every 15 s" in the auto-refresh track); each
tier C line was looked at (below): what is left is short text that is narrower than 40 px by its own length, or
screen-reader text counted as visible.

## Fixed (commit, what, numbers)

- `[t56-segmented-1018]` dark, cyberpunk, synthwave: below 30rem a segmented track shares its columns by min-content and
  wraps labels between words; weekday chips close up their letters in a narrow picker. calm-mode "Everything" -1.0 px
  (all three) -> clear; weekdays / weekdays-states / sentence-states at 390: dark 10 texts, cyberpunk 1, synthwave 6 ->
  clear.
- `[t56-idmark-1018]` synthwave: round identity marks (24 px and 32 px) keep their letters off the neon ring. avatar: 4
  texts at 2.7 to 3.4 px -> clear.
- `[t56-codefoot-1018]` synthwave: "Show all N lines" in a code cell. payload-cell 390: 2.1 px -> clear.
- `[t56-version-1018]` dark: version badge border-box, 12 px. version-states 1280: 2.0 px from the badge edge -> clear.
- `[t56-vcrmark-1018]` synthwave: the pause/stop symbol (the alert's ::before) was a grid item that pushed the attention
  band's icon, text and actions one column on and made a row of its own in the question card. Band: a column for it;
  card: the symbol stands in the top corner. Looked at at 1280 (ops-page, question).
- `[t56-gallery-1018]` all three: the gallery tile was a bare token square. Dark: chamfer on two corners, strong edge,
  cyan edge when pointed at, mono caption. Cyberpunk: plate notch, scan raster, hazard edge on hover, tag caption.
  Synthwave: pink-to-cyan tube round the edge and a glow when pointed at.
- `[t56-thread-1018]` all three: the conversation had no rule of its own. Dark: bubbles cut on two opposite corners (yours
  the other way round), mono time. Cyberpunk: packet notch (top right for theirs, top left for yours), `//` sender tag.
  Synthwave: glowing cyan tube down the start edge of theirs, pink down the end edge of yours, display-face sender.
- `[t56-merge-1018]` merge of `theme/themes56` (the eleven part pages).
- `[t56-phone-1018]` all three, tier B: a track of five or more segments closes its tracking and padding (six or more
  also its size); the tools of a code block may wrap; a sha256 breaks at the badge edge; the inspector row is three lines
  on a phone. auto-refresh bar at 390: 261 / 249 / 277 px past the edge -> inside; version-states: 161 / 249 / 117 px past
  the edge -> inside; request-inspector bar: 103 / 105 / 120 px -> 4 px (dark) and 0.
- `[t56-labels-1018]` all three: a long checklist detail wraps inside ten rem, so the label "Hotel booking" is no longer
  22 px wide and broken in the middle of its words (print-checklist 390); cyberpunk's trace rule tag keeps its `// `
  lead with its text.
- `[t56-versionshape-1018]` dark: the version badge is cut, not an oval (radius 0).

## Tier C, looked at by eye

rating caption / foot, claim-row detail and person, runs "in 1 day", trace "allowed", heat "Stretch", version link
"12.1 (release notes ...)", availability column name at 390: all read well (short words, a screen-reader suffix, or a
column that is meant to be a header cell). Looked at in the three themes at 390 (runs, claim-row, trace) and 1280 (rating,
calm tones).

## Not fixable in my files (shared css / js or by design)

- choose / shortcut-engine, 390, all three: "Jump to the usual choices" / "Keyboard shortcuts" / "No shortcuts on this
  page" overlap. The open palette and the help sheet are drawn over the page inside the demo; formal prints 13 cells for
  the same item. Cells: dark 1, cyberpunk 1, synthwave 1.
- choose / dated, 390: cyberpunk "12 results" over "1 day ago", and "16/10/2026 04:00" over the input (cyberpunk,
  synthwave): the opened search list of the combobox overlays the line beneath it; formal prints the same 3 cells.
- lists / request-inspector, dark, 390: the status filter (five segments with counts) still sticks out 4 px; it is the
  shared segmented track's minimum width.
- charts / availability-grid, 390: the grid is wider than the phone and scrolls inside its own box (formal too); the
  column name "Kenny (you)" is hidden there by the shared `kp-availability` layout.
- confirm / question and the like in other themes belong to other helpers.
- Contrast was not measured (rule: advice only). Where a theme paints a solid coral plate (synthwave failed or urgent
  question, with the pink Allow frame on it), the frame reads weak against the plate: below WCAG 2.2 AA by eye, not
  blocked.

## Things worth Kenny's attention

- Every commit regenerates `dist/` and `catalogue/code-version.json` (the gates demand it), so two helpers' branches
  will conflict on those files; a rebuild after the merge resolves it.
- Shared `git stash` is a trap: a helper's `git stash pop` took another helper's stash (brutalism, in a worktree of the
  same repository) and put it back as a stash named "BRUTALISM HELPER WORK popped by t56-a by mistake" (also kept as a
  patch in the t56-a scratchpad). Nothing of it was committed.

## DEMO_RULES chapters

- Chapter 2 (components): kept. Every fix uses the package's own parts (kp-segmented, kp-badge, kp-code, kp-gallery,
  kp-thread, kp-alert) and its raised surfaces; none paints its own menu or popover. measure-plate: dark clear; cyberpunk
  only the known bare tooltip; synthwave only the known menu-in-popover finding.
- Chapter 3 (states): kept. Empty and failed states checked for centring in all items (centre script) and by eye; the
  gallery's broken-picture and loading tiles keep their own look; no state was resized.
- Chapter 4 (motion and loading): kept. Every loading state in the nine pages has a running animation in the three
  themes (script); no motion was added or changed except hover glow on the gallery tile.
- Chapter 5 (themes and character): kept. New rules use each theme's own anchors: dark's chamfer and film, cyberpunk's
  notch, scan raster and `//` lead, synthwave's neon tube; nothing from another theme's entrance or loading idea.
