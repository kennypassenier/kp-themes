**Status (2026-10-09): waiting for Kenny's approvals; nothing in the package changed by this page.**

# Forest, as applied: what changed

Kenny, 2026-10-09: "Can you show in a demo which forest components you changed? Just a showcase where I can approve everything."

`demo.html` shows every forest component the uniformity apply changed (css/forest-register.css, themes/forest/CHARACTER.md
"Applied 2026-10-09 (uniformity)", research/forest-uniformity F-01 to F-39), as the package itself: the real stylesheets (loaded
as research/forest-character loads them), the real markup of the catalogue pages and the real scripts through `js/auto.js`. No
scene is drawn for the page. Every pointable part can be pointed at, every overlay opens from its real trigger, and loading is the
real busy state (`busy()` on the data table, `setCalendarState()` on the month, `data-kp-indeterminate`, `aria-busy`,
`data-kp-loading`).

It is a review-kit demo in plain mode (`research/_review`): one judged block per item, Approve or Not approved with a note, in the
review dialog or under each block. Round `2026-10-09-r1`. Theme: forest only.

## The blocks

Each block's heading says in one sentence what the component did before and what it does now.

1. **The bar**: dropdown, mega menu, the phone menu in a 390 px frame, the call to action, the toggle.
2. **Tabs, breadcrumbs, pagination**: the link's green rule, the body face, the leaf corner on page numbers.
3. **Side navigation and its groups**: the rows, the groups unfolding in 1000 ms, the panel growing out of its edge with its
   backdrop.
4. **Command palette**: grows like the dialog; options blaze.
5. **Date picker**: the panel grows out of its field; days blaze, leaf corner, two-channel focus.
6. **Theme menu**: the attached menu (`themeMenuMarkup()`, a choice does not switch the page) and the React shape; options blaze,
   two-channel focus.
7. **Combobox**: the list grows down out of its field and closes reversed; input and options blaze.
8. **Tour**: the card grows and withers (`startTour()`).
9. **Dialog, drawer and every backdrop**: the backdrops on the growth curve.
10. **Alarm**: grows like the dialog, the growth ring every 3200 ms.
11. **Fields, select, upload zone**: the blaze on pointing.
12. **Checkbox, radio, switch**: tick and dot drawn and cleared as mirrors; the blaze.
13. **Table**: rows as menu entries, the search, the status line, the busy panel with one loading picture.
14. **Tree and accordion**: the tree row's first-line answer, the accordion heading's blaze.
15. **Reorder list, chart legend, swatches**: the blaze and the leaf corner (the chart's legend keys are here, not under the
    date picker, which has none).
16. **Calendar and the busy month**: the card grows and withers with the planting row alone; a day's two-channel focus.
17. **Buttons**: the pressed primary and destructive keep their plate (F-10); every variant and size, the icon button, disabled,
    busy.
18. **Links, headline, rule, alert edge, meter, back to top**: the prose link in 200 ms, the headline's growth, the logical rule,
    wipe and edge (a Right to left switch), back to top withering out; every alert and meter variant.
19. **Skeletons, spinner, busy button, loading meter**: one 6.6 s breath for everything that waits.
20. **Popover menus**: one plate, clipped at its button.

## Found while building it

Listed under "## Forest applied" in research/PACKAGE_FINDINGS.md; nothing in `css/` or `js/` was changed.

- **A menu button's menu opens about its own height below the button in forest.** js/menu-button.js `placeMenu()` measures the menu
  with `getBoundingClientRect()` on the frame it opens, while forest's growth still holds it at `translate: 0 -100%`, so it moves
  the menu down by that height. Measured in Chromium at 1280 px, catalogue/overlays.html#menu-button: the button ends at 468 px,
  the menu starts at 1006 px (below the window); in formal and titanium at 472 px. Block 20 says so.
- **Many elements arriving at once take seconds in forest.** js/motion.js arrives them one by one (`arriveInTurn()`), each when the
  one before is `--kp-leave-stagger` (0.5 by default) through forest's 1000 ms leave, with no cap: the review dialog's twenty rows,
  put into a `.kp-dialog`, waited 13 s before the first one showed. Fixed 2026-10-09 in js/motion.js (a row's gaps capped at
  600 ms in all); the page's `data-kp-arrive="none"` workaround is gone. The menu button's placement is fixed the same day
  (js/top-layer.js `layoutRect()`).
- **Not the package, the review kit:** in the review dialog Escape closes the review dialog even while a dialog, palette, menu or
  alarm opened inside it is still open. The intro asks to close those with their own buttons there.

## Files

- `demo.html`: the twenty blocks, the round marker, the review kit.
- `demo.css`: the page's layout only, colours through the theme's tokens.
- `demo.js`: what the package leaves to an app: the theme menu's markup, the tour's steps, the table's and the month's busy
  states, a replay of the arrivals, the right-to-left switch.
