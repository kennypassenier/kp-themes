# research/r6r8-1019: four faults found by the project threads

Round `r6r8-<uuid>` (see `demo.html`, 2026-10-19): 4 sections, formal only. Found by homelab 24, almanac 15 and AuDHD recipes 29 and 30,
confirmed in the code, fixed in the package. They change approved components, so they come back through the review dialog with a "What
changed" text. This page is bundled into `round-3-1019` (`VERDICTS.json` `bundledInto`), so it has no Agenda entry of its own.

1. **snooze-width**: the picker was a size container with width 0 in content-sized cells. Fix: no container; flex-wrap (css/components.css).
2. **copyable-kv**: Copy broke mid-word in a narrow fact cell. Fix: the button never wraps or shrinks; Copy at the end of the kv value cell.
3. **checklist-failed**: the failed state had no Retry. Fix: the empty line is the state plate; `kp-checklist-retry` (js/checklist.js, js/claim.js).
4. **timers-states**: no loading or failed state, a low empty plate. Fix: `setTimersState`, the plate and busy card (js/timer.js).

**Generated** by `node research/r6r8-1019/build.mjs` (edit the builder, never the page).
