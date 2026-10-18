# research/kpadopt56-followups: two faults found in approved work

**Decided (2026-10-18 22:09):** Kenny approved every pair. Recorded in `VERDICTS.json`; the page is not offered again.

Round `followups-1c17f9d4-3e96-4ad7-8489-4c09af816abb` (2026-10-18): 2 sections, 13 pairs. Changes to approved work go back to Kenny
through the review dialog (DEMO_RULES ch. 7 and 9), so each fix is a section with a plain "What changed since you approved it" text.

1. **selection-bar-place, "Floating at the foot", twelve themes (dark first, then formal and the ten others).** Kenny approved it in dark
   with the note "ik zie de balk nergens?" (research/kpadopt56-confirm, archived). Cause, measured in Firefox in the dialog at
   1920x965 and 1280x800: a lane's frame is as tall as its section (block-tools.js `isolate`), the bar is `position: fixed`, so
   it stood at the foot of the FRAME, 540 to 600 px below the foot of the dialog on the first screen (1497 to 1566 against a view
   ending at 960), and showed only when the lane was scrolled to its very end. The bar (css/components.css) is right; the lane is
   at fault, in every theme. Fix, in the kit: `research/_review/review.css` puts a floating-bottom selection bar of a lane at
   the foot of the part of the frame that is in view (`--kp-shortcuts-view-top/-height`, which review.js already sets from
   `rv-lane-view`). The section opens on the floating variant with two rows ticked (`demo.js`).
2. **usual-states, formal.** The two samples shown opened (`kc-usual-o`, `kc-usual-c`) were opened and closed by an
   IntersectionObserver at threshold 0.9; opening makes the case taller, so a half-visible case flickered (in a 1280x500 dialog:
   6 to 8 open/close toggles in 2 s at 58% to 70% visible). They open once, the first time they are on screen, and stay open
   (0 toggles in 2 s). `research/kpadopt56/src/kpadopt6-calm/demo.js` had the fix since the choose round 2; the same fix is now in the
   archived `research/kpadopt6-calm/demo.js`, whose page has no such sample (its observer found no element), so there it is
   a guard only.

**Generated** by `node research/kpadopt56-followups/build.mjs` from `research/kpadopt56/src` (kpadopt5-rows and kpadopt6-calm);
edit the sources or the builder, never the page. Not touched: research/kpadopt56/build-parts.mjs and the other parts.
