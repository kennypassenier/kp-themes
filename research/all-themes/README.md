# All themes: focus, close mechanism and the cyberpunk faults (scope-143 follow-up)

Kenny, 2026-10-12: one cross-theme fix for focus and for close = open reversed, and "Cyberpunk lijkt af, zie dat
dezelfde fouten nu niet terugkomen in andere thema's". Paused 2026-10-13 01:41 on Kenny's word; resume here.

Tools (`_audit/`, Firefox only; every script reads the theme from `KP_THEME`, the cyberpunk applied demo is served
re-dressed in that theme by lib.mjs): identity.mjs + identity-summary.mjs (which animation runs on each open/close),
pairs-meter.mjs (open/close pairs; the boot screen and the page's reveal animations are left out), tab-paint.mjs (a
real Tab, focus read from pixels), audit.mjs --pointing-only + focus-summary.mjs, shots.mjs + sheet.mjs (buttons,
alerts, calendar side by side), tones.mjs (computed text against plate for alerts and calendar days).

## State at the pause

- Done: focus. Every theme shows a mark on every Tab stop except four, now fixed in the registers: grotesk and
  nostromo selected tab, grotesk switch, synthwave slider (lesson 41).
- Done: alerts and calendar are readable in every theme (tones.mjs: only deco's warning and error label 4.37:1).
  Calendar tone days and alerts use the generic green/ochre plates in blueprint, solstice, deco, phantom,
  synthwave, terminal, titanium: a colour choice for Kenny in the review dialog, not fixed yet.
- Measured (first identity run, out/identity-summary.txt; synthwave and terminal to re-measure, their boot screen
  covered the page): the command palette falls back to a bare fade in 12 themes; the date picker and the combobox
  open with no animation in 10; menus in pastel, synthwave, titanium; the navbar's hover dropdown closes with no
  animation in 14 themes and the mega menu and phone bar have none in 11 (in scope, coordinator 2026-10-12 23:39).
- Not finished: the pairs re-run with the cleaned meter (done for pastel, cyberpunk, deco, terminal, forest,
  phantom, blueprint; the rest to run), the identity re-run.
- Pastel has no CHARACTER.md: shared fixes only, no signature check (Kenny agreed by default, 2026-10-12 23:37).

## Next

1. Re-run pairs-meter and identity for every theme.
2. Per theme, give palette, date picker, combobox, menus and navbar the theme's own open effect and a close that is
   its reverse; set the leave tokens (lesson 37) where the pairs show instant leaves (alert-close open 0 ms in 14).
3. Forest and cyberpunk must measure unchanged except focus.
4. One demo with only the deviations, through the review dialog (calendar/alert tones as options).
