**Status (2026-10-12): round `2026-10-12-r1`, waiting for Kenny's verdicts in the review dialog; nothing in the package is changed by this page.**

# Cyberpunk, as applied: what changed

Kenny, 2026-10-12: "finish cyberpunk the way forest was finished."

`demo.html` shows every cyberpunk component the apply changed (css/cyberpunk-register.css, themes/cyberpunk/CHARACTER.md, the
cyberpunk entries under Unreleased in CHANGELOG.md, the rows of `_audit/MISSING.md`), as the package itself: the real stylesheets, the
real markup of the catalogue pages and the real scripts through `js/auto.js`. No scene is drawn for the page. Loading is the real busy
state (`busy()` on the data table, `setCalendarState()` on the month, `data-kp-indeterminate`, `aria-busy`, `data-kp-loading`).

It is a review-kit demo in plain mode (`research/_review`): one judged block per item, Approve or Not approved with a note, in the
review dialog or under each block. Round `2026-10-12-r1`. Theme: cyberpunk only.

## How to judge it

The anchor is the glitch (the channel split): a yellow and a cyan ghost 6, 4, 2 and 1 px away close in four 120 ms ticks, 480 ms in
all, to open, close and arrive; a close is its open played backwards. Each block's heading says in one sentence what changed, and the
paragraph under it says what to try. Look for:

- notched corners, 14 px on plates and 8 px on controls, no rounded shapes;
- the split edge on hover (a cyan and a red doubled edge following the part's own cut);
- four closing focus brackets when you Tab onto a part;
- a closed-circuit press that does not lift;
- loading as four bars with a glitch copy, or the on-screen word LOADING;
- prefixed mono labels and prose in Rajdhani.

## The blocks

1. **The bar**: dropdown, mega menu, the phone menu in a 390 px frame, the call to action, the toggle.
2. **Tabs, breadcrumbs, pagination**: split edge, press, brackets.
3. **Side navigation and its groups**: panel, backdrop and pushed content by the channel split; groups in ticks.
4. **Command palette**.
5. **Date picker**.
6. **Theme menu**: the attached menu and the React shape (a choice does not switch the page).
7. **Combobox**.
8. **Tour**: the card between steps, and its close.
9. **Dialog, drawer and every backdrop**.
10. **Alarm**.
11. **Fields, select, upload zone**.
12. **Checkbox, radio, switch**.
13. **Table**: rows, search, the busy layer with the word LOADING.
14. **Tree and accordion**.
15. **Reorder list, chart legend, swatches**.
16. **Calendar and the busy month**.
17. **Buttons**: every variant and size, the icon button, disabled, busy.
18. **Links, headline, rule, alert edge, meter, back to top**: with a Right to left switch and a play-again button.
19. **Skeletons, spinner, busy button, loading meter**.
20. **Popover menus**: the row-actions popover and the menu button.

## The audit

The measured state of the theme lives in `_audit/`; `_audit/MISSING.md` lists what was missing and in which group (A to H) it was mended.
Run it in Firefox only (Chromium is off in this project):

```
node research/cyberpunk-applied/_audit/audit.mjs --engine firefox
node gates/measure-pairs.mjs --theme cyberpunk --engine firefox
```

The first measures every pointable part (hover, focus, press); the second measures each open/close pair and how closely the close
mirrors the open. Decided exceptions (the divider's 8 s and the marquee's 18 s loops) are recorded in themes/cyberpunk/CHARACTER.md.

## Files

- `demo.html`: the twenty blocks, the round marker, the review kit.
- `demo.css`: the page's layout only, colours through the theme's tokens.
- `demo.js`: what the package leaves to an app: the theme menu's markup, the tour's steps, the table's and the month's busy states, a
  replay of the arrivals, the right-to-left switch.
- `_audit/`: the audit scripts and `MISSING.md`.
