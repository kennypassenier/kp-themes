# Designer notes: pastel, forest, blueprint (t56-b)

Measured in Firefox on the eleven part pages (`research/kpadopt56-<part>/demo.html`) with `measure-gaps.mjs` and `measure-overflow.mjs`, at 1280 and 390 px, after merging `theme/themes56`. Only `css/<theme>-register.css` changed (plus the generated files every register commit regenerates: `catalogue/code-version.json`, `dist/`, `docs/MINIFIED.md`).

## Before and after (cells = section x width)

| theme | A: text gaps before | A after | B: sticks out before | B after |
|---|---|---|---|---|
| pastel | 3 | 2 (choose 390: dated, shortcut-engine) | 4 | 0 |
| forest | 2 | 2 (choose 390: dated, shortcut-engine) | 4 | 0 |
| blueprint | 7 | 2 (choose 390: dated, shortcut-engine) | 7 | 0 |

The two A cells left in every theme are the same two sections and sit in the demo frame, not in a register (see "Could not fix").

## Pastel

- `[t56-pastel-1018]` problem alert: the alert used the tone's solid plate with the page's plum ink (plum on red). Now the tone at 14 % in paper, pass and edge kept (kpadopt5-basics/problem-alert).
- version badge: hash stuck out 2 px (1280) and 165 px (390), text -3.4 px from the badge edge; now 0 and clear.
- refresh chooser at 390: bar stuck out 188 px; now clear (segments share the width, words wrap).
- request inspector at 390: filter 93 px, code tools 36 px out; source badge 1 letter wide; all clear.
- print-checklist 390: label squeezed to 8 px by a nowrap detail; label keeps 6rem.
- hidden-names list of an identity group: 24 px soft shadow replaced by the flat sky pass (pastel has no soft shadow).
- runs-states Empty: 183 px plate in a 134 px footprint (+17 px page shift); now level (all four states 166 px).
- uses-states Loading: 68 px caterpillar lines with 0.45 rem margins, +84 px over Ready; now level with formal at 1280 and 390.

## Forest

- version badge: hash -7.0 px from the badge edge, badge 19 px (1280) / 182 px (390) out; now clear.
- refresh chooser (186 px out at 390), request inspector (91 px out), print-checklist: same fixes as pastel.
- runs-states Empty: 177 px against 134 px (+11 px); now level, seedling placed on the clearing.
- busy table panel: planting row stood on the words "Reading..." (2 px overlap); the foot padding clears it by 6 px.

## Blueprint

- `[t56-blueprint-1018]` question card: `[data-kp-measure]` (headline readout) matched `.kp-question[data-kp-measure]`; every card was a 34 px absolute strip (55 overlaps at 1280 and at 390, `.kp-question__head` 493 px out). Excluded `.kp-question`.
- Stop on a question card had no edge on the red plates; it carries the sheet's dark line.
- Phone segments: "Last" 2.9 px (1.1 px frozen) from its edge, calm switch 45 px out and "Everything" -1.0 px; tracking 0.02 em on a phone, weekday cells at 11 px, 8 px padding.
- version badge (53 px / 216 px out), refresh chooser (268 px out, labels at 10 px, no tracking), request inspector (93 px out, labels whole), print-checklist (32 px out, label one letter wide): all clear.
- hidden-names list of a group: soft shadow removed (nothing glows).

## Could not fix (shared css/js or the demo frame)

| item | theme | width | what |
|---|---|---|---|
| choose/shortcut-engine | pastel, forest, blueprint | 390 | The two frozen sheets stand in `.kb-frame--stage` (`min-block-size: 24rem`, `contain: layout`, `research/kpadopt56/src/kpadopt5-basics/page.css`); the dialog is taller than the frame at 390 and overlaps the next one (6 to 8 texts). Needs the frame to grow, or a smaller sheet in `css/components.css`. |
| choose/dated | pastel, forest, blueprint | 390 | The opened list of the phone-width example is drawn above its field and covers the rows of the first example (texts overlap "input"/"12 results"). Opening position is in js (combobox) and the demo layout. |
| the sliding plate of `.kp-segmented` (`::before`, `css/components.css`) | all | any width | It is placed for one row, so a segmented control cannot wrap (it painted a 57 px plate over two rows when I tried); I shortened the segments instead. |
| tier C: `a.kp-version__to` "squeezed", `kp-rating__foot` | all | both | Their text includes visually hidden parts; the signal is not a visible fault. |

## Process notes

- `npm run gates` stops at `check:rereview` (research/kpadopt5-ops, -rows, kpadopt6-ops: "received" ids against VERDICTS.json) on the unchanged base; the commit hook printed "gates green" for every commit.
- `git stash` is shared by all worktrees: a `stash pop` in this worktree applied another helper's stash (BRUTALISM HELPER WORK). I restored my files from HEAD with `git restore` and left the stash entry alone; nothing of mine was lost.
- Every register commit regenerates `catalogue/code-version.json`, `dist/*` and `docs/MINIFIED.md`; merging t56-a, t56-b and t56-c needs those regenerated once more.
