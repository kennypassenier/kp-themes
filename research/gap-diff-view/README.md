# research/gap-diff-view: a diff of several files

Round `` (2026-10-19): 5 sections, 5 pairs, formal only. Not judged yet.

The homelab admin dashboard draws its edit plan's diff itself (`js/editui.js` `diffBlocks`): the package had the lines of one diff
(`.kp-diff`, since 11.0.0 also `.kp-diff__hunk`) and nothing around them. Kenny wants the package's components used to the full, so
this is the diff for several files, built in the package first and shown here before the other eleven themes get their turn.

What was built (`js/diff.js`, `css/components.css` "A diff of several files", `js/strings.js` words `diff…`):
`setDiff(el, { files | state, message, compared })`, `attachDiffs`, and the pure `diffWords(old, new)` and `foldContext(lines, keep)`.
A header per file (status badge, path, exact +N -M counts, five blocks for the share, Copy path), unchanged lines folded into a row
that is a button ("12 unchanged lines"), the changed words inside a changed line, loading, empty and failed states at the footprint
the diff had (`js/footprint.js`), and a per-file limit with "Show the other N lines". Every option is an attribute and live.

The page is hand-written: `demo.html` (five sections, each with its own controls at the component), `demo.js` (wiring by each
section's own elements), `data.js` (mock edit-plan data: the jellyfin, sonarr and traefik stacks, a startup log, alert rules),
`page.css` (the page's frame). Nothing is read from a real host.

| Section | Pairs | What to judge |
| --- | --- | --- |
| diff-files | 1 | seven files with every status; Open, Header blocks and Copy path |
| diff-context | 1 | folds with 3, 1 or no kept lines; a static config and a new file |
| diff-words | 1 | four samples; words marked or not |
| diff-states | 1 | changes shown, reading, nothing changed, could not read |
| diff-long | 1 | 453 lines drawn 40, 400 or all first |

Measured with `node research/_review/check-kit.mjs 8913 research/gap-diff-view/demo.html` and
`node research/_review/measure-gaps.mjs 8913 research/gap-diff-view/demo.html formal 1280,390` (Firefox, no tests).

**Bundled** (Kenny, 2026-10-19 02:38): this demo is the source of the review page [research/gap-round-1](../gap-round-1/demo.html) and is no longer on the Agenda by itself (`"bundledInto"` in its VERDICTS.json).
