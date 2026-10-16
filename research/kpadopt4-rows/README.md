# Rows, cards and choices (kpadopt4-rows)

Seven needs from the 2026-10-16 survey of what Kenny's apps still draw themselves (G14, G15, G16, G19, G22, G23, G25),
checked against the package first. Formal only, until Kenny approves it.

| Need | What the apps draw | Package answer | Build |
| --- | --- | --- | --- |
| G14 "Needs you" band | JobTracker `jt-attn` (Overview, Dossier, Queue) | already `.kp-attention` + `setAttention`/`attachAttention`: rows of icon, title and sentence, actions, worst first, keyed refresh | none |
| G15 check tile | JobTracker `jt-check-tile` | `data-kp-layout="tiles"` on `.kp-fieldset` (new option) | CSS |
| G16 card in four states | JobTracker `Card` `state`, homelab `failBox` | `.kp-card[data-kp-state]`, js/card-state.js (new module, lays js/busy-card.js) | CSS + JS |
| G19 inbox / message row | homelab `nx-inbox`, JobTracker queue, kyu backlog | `.kp-action-list--lead` (new option) + `setRowBusy`, `removeRow`, `attachRowKeys` in js/actions.js | CSS + JS |
| G22 file list | JobTracker Files | the same rows; `.kp-upload__file` stays for files being sent | CSS |
| G23 readiness checks | JobTracker Readiness, homelab doctor | `.kp-statusrow` `warn` + `__fix`, `countStatus` (new options) | CSS + JS |
| G25 appointments | JobTracker Appointments | the same rows, `time.__when`, `li.__group`, `data-kp-state="next"`/`"past"` | CSS |

Not built: bulk select, swipe actions, an undo toast after a delete (no current app uses them), relative "in 7 days"
words (the page writes them), a count chip on a choice tile.

Demo: `demo.html` (formal), seven sections in four topics, each with its Expected block and a 360 px column.
