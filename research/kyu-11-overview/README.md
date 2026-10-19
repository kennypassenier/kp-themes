# kyu-11-overview: who reads what, as a hub and ring (round 2)

**Decided (2026-10-19 06:43):** Kenny approved every pair (round 1: six sections; round 2: the graph with formal's own loading). Recorded in `VERDICTS.json`; the part is not offered again.

Review demo (formal only, mock data in kyu's shape). Round 1 (2026-10-19) approved the command palette, the keys with the
`?` sheet and the hint line, the first-visit tour, both anchor sections and the line diagram; those are gone from the page.
Kenny did not approve the graph: "dit is toch niet de standaard laadanimatie die Formeel heeft voor een netwerkdiagram?".
Round 2 is that one section. Files: `demo.html`, `demo.js` (mock data and wiring), `page.css` (frame, plus formal's graph
loading), `_previous/` (the round he judged), `VERDICTS.json`.

| Section | Components and options used | Choice sets (default first) |
|---|---|---|
| Who reads what, graph | `graph` hub-and-ring, link kind = subscription state (active, flagged, archived), live update, states through `setGraphState` / `setGraphData` | node size (same, by waiting messages) |

What changed: Loading is the package's own loading state (`setGraphState(el, 'loading')`, the ghost of the network it draws),
and formal's decided loading from `research/character-graph/decided.json` (`r3-fm-load-3`, the courier's round: a short mark
travelling along every link, linear, 2000 ms, 170 ms between links) runs on that ghost. The demo draws no ghost of its own.
Empty and Failed stay as the package draws them: a sentence in the picture's area, no plate and no Retry (package gap).
