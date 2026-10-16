# Notes on approved components (2026-10-16)

Seen while styling the kpadopt2 components in the other fifteen themes. Formal was approved as is; Kenny chose to repair these four on
2026-10-16 15:46 ("formal-faults: Herstellen"). Each is fixed in the shared component, and formal is asked again for the sections that
show them in round 5 of research/kpadopt2 (`reopened` in its VERDICTS.json).

- Run timeline (`.kp-gantt`): when the timeline is empty or failed, its state sentence sat over the series legend. Fixed: the room under
  the axis applies to empty and failed timelines too and grows with the words (commit dd92c3b2).
- Run timeline: a label at the end edge of the time axis could be cut. Fixed: the label stands before its rule by default,
  `--kp-gantt-tick-flip` 1 (commit 5e7d7efc).
- Heat grid and matrix: while loading, their rows were about 36 px taller than loaded, so the page moved when data arrived. Fixed: the
  skeleton cells drop the skeleton-to-skeleton gap (commit f2d8b367).
- Bar cell table: at 390 px the table grew while it loaded. Fixed: the loading figure holds the figure's line height (commit f6e97a0c).
- Light buttons (approved): with the pointer resting on a button's top edge, light's hover drop (`translate: 0 2px`, css/light-register.css:1026) moves the button away and back, so it can flicker; found 2026-10-16 while walking the review dialog. Left as approved.
