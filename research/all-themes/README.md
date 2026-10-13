# All themes: focus, close mechanism and the cyberpunk faults (scope-143 follow-up)

Kenny, 2026-10-12: one cross-theme fix for focus and for close = open reversed, and "Cyberpunk lijkt af, zie dat
dezelfde fouten nu niet terugkomen in andere thema's". Paused 2026-10-13 01:41 on Kenny's word, resumed 15:02.

Tools (`_audit/`, Firefox only; every script reads the theme from `KP_THEME`, the cyberpunk applied demo is served
re-dressed in that theme by lib.mjs): identity.mjs + identity-summary.mjs (which animation runs on each open/close),
pairs-meter.mjs (open/close pairs; the boot screen and the page's reveal animations are left out), tab-paint.mjs (a
real Tab, focus read from pixels), audit.mjs --pointing-only + focus-summary.mjs, shots.mjs + sheet.mjs (buttons,
alerts, calendar side by side), tones.mjs (computed text against plate for alerts and calendar days).

## Result (2026-10-13, Firefox)

- Focus: a real Tab shows a mark on every stop in every theme (tab-paint.mjs; only the review dialog's own two buttons
  read NOMARK, covered by the catalogue's chrome). Fixed: grotesk and nostromo selected tab, grotesk switch, synthwave
  slider (lesson 41).
- Identity: in every theme but pastel every part that opens or arrives runs the theme's own effect on open and close
  (out/identity-summary.txt; the remaining "ASYM" lines are close keyframes with their own names, mirrored per the pairs).
- Pairs: out/pairs-matrix.txt (before: out/pairs-matrix-before.txt). 20 or 21 of 25 pass in every theme; forest and
  cyberpunk measure as before except the focus return (datepicker 4.7 -> 2.4 %, sidenav 1.0 -> 0.4 %) and the phone bar,
  which the meter now holds (lesson 47). Shared changes: js/datepicker.js and js/sidenav.js give the focus back when the
  close is over (lesson 45), js/motion.js places a turned popover's closing copy at its layout box (lesson 46),
  research/_review/review.js asks a section only in its own `data-review-themes`.
- Per theme, what changed and every borrowed effect: reports/<theme>.md. The deviations are the demo
  research/all-themes-applied/demo.html (built by build-demo.py), each block asked only in the themes where it changed.

## Pairs that still fail, and the measured reason

| Pair | Themes | Reason |
| --- | --- | --- |
| wizard-step, empty-state, tabs-panel | all | state changes, not open/close pairs (lesson 27); read per frame where it matters |
| calendar-busy | all, forest and cyberpunk too | the busy layers mirror; the month's days take their data (tone, words) at the moment loading ends (js/calendar.js), a state change |
| table-busy | terminal 7 % | the layer mirrors; the status line's words swap at once both ways (js/datatable.js, a live region for screen readers) |
| table-busy | cyberpunk 37 % | approved as is (research/cyberpunk-applied/_audit/MISSING.md row 1) |
| table-busy, upload-file, toast, alert-close | grotesk | decided: grotesk's leave turns clockwise and is not the arrival reversed (themes/grotesk/CHARACTER.md 0b) |
| tooltip | formal, forest (now and then) | the page's two frozen tooltip examples sit at a fractional y and Firefox re-rasters them a pixel differently (lesson 47) |
| everything in pastel that has no motion | pastel | pastel has no CHARACTER.md: only the shared mechanism, no new effect (Kenny, 2026-10-12) |

## Found outside this package

- Forest's hover dropdown still closes with no animation in Firefox (it sets no `--kp-nav-close-time`, lesson 36); forest is
  approved and was not touched.
- Every boot screen is to be re-evaluated and may leave the repository (Kenny, 2026-10-13 01:42).

## Next

Kenny's verdicts in research/all-themes-applied (14 steps). The tone colours of the calendar days and the alerts in seven
themes are asked there as approve (keep) or not (design the theme's own variant).
