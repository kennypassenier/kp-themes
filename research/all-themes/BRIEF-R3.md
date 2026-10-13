# Brief, review round 2 of research/all-themes-applied: Kenny's rejections (2026-10-13 20:37)

Same rules as research/all-themes/BRIEF.md and BRIEF-R2.md (read both; their "Never" lists hold, js/* and
research/_review/* included). Firefox only. Judge the way Kenny judges (lesson 28): in the review dialog's stage
(`research/all-themes-applied/demo.html`, "Review in a dialog"), real mouse clicks at coordinates, frames you look at.

## The rule Kenny applies, and the one you must meet

"Niet de open/close animatie van dit thema": the side navigation and the alarm must open and close with THE THEME'S OWN
signature effect, the one its dialog (and its menus) use, not the package's plain slide, fade, rise or scale. The close is
that open played backwards. Look at how the theme's dialog opens in the demo (section "Dialog, drawer and their backdrops")
and make the side navigation's panel and the alarm open the same way, in the theme's timing:
- the side navigation panel (over and push, `#fa-over` / `#fa-side`, and the window-edge panel of research/sidenav-edge if
  the same rules apply): it may still travel in from its edge if the theme's grammar moves things, but the theme's signature
  (its clip, ruling, raster, glitch, tube, cut, throw...) must be what you see draw it in and take it away;
- the alarm (`.kp-alarm`, its panel and title): opens as the theme's dialog does, closes as that backwards.
Check with `research/all-themes/_audit/identity.mjs` (the `sidenav` and `alarm` rows must name the theme's own keyframes or a
scripted copy of them, open and close) and the pair meter (`--only sidenav,sidenav-push,sidenav-group,alarm` plus the edge
pairs `sidenav-edge-push,sidenav-edge-gutter,sidenav-edge-over`), and by looking at frames.

Report as before: a "Review round 2" section in research/all-themes/reports/<theme>.md, and the CHARACTER.md note.
Final message: per item, the cause, the change, the evidence (numbers and what you saw).
