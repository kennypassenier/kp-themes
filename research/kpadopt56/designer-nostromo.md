# kpadopt56 designer report: nostromo and titanium

Branch `theme/t56-d`, helper t56-d, 2026-10-18. Measured in Firefox on the eleven part pages
(`research/kpadopt56-<part>/demo.html`, merged from `theme/themes56`) with `measure-gaps.mjs` and
`research/kpadopt56/measure-overflow.mjs`, at 1280 and 390 px. Only `css/nostromo-register.css` and
`css/titanium-register.css` were edited (plus the generated files the gates force: `catalogue/code-version.json`,
`dist/*`, `docs/MINIFIED.md`). No formal, `components.css` or `js/` change.

## Counts (cells = section x theme x width), FINDINGS.md before, this branch after

| theme | A text gaps | B sticks out | C squeezed |
|---|---|---|---|
| nostromo | 10 -> 2 | 5 -> 0 | 17 -> 16 |
| titanium | 8 -> 2 | 5 -> 0 | 19 -> 19 |

The two A cells left are in both themes (and in all eleven): `choose/shortcut-engine` and `choose/dated` at 390 (below).
Every C cell left is a false positive of the "narrower than 40 px" heuristic or a shared part (below).

## nostromo

| fix | commit | measured |
|---|---|---|
| Segmented track wider than a phone: less padding and tracking; up to three segments share the track and wrap words; four or more take rows (the chosen segment carries its own plate), no ellipsis | ab1c36a4, 2b99db0e | calm-mode "Everything" -1.0 px, auto-refresh / explain-lede tracks scrolled and clipped: clear at 390 and 1280 |
| Weekday chips 0.625rem / 0.02em under 34rem | cd20cbf9 | "Last" 0.1 px (weekdays-states), 2.0 px (weekdays): clear |
| Code cell fold button ("Show all 38 lines") in a 200 px cell | 3e282c88 | -6.4 .. 2.6 px: clear |
| Request inspector row at 390: method + status, path, then source + time at the end | 3e282c88 | 14 faults (source tag squeezed to single letters over the date): clear |
| Folded quote: line height 1.6 so the clamped fifth line's box does not reach "Show all" | d41ab9fe | overlap at 1280 and 390: clear |
| Availability list on a phone: name over the three answer keys | d6f6039f | 4 faults at 390: clear |
| Growing text box: the size motion stepped one line per 80 ms frame, 87 lines = 6960 ms with the field clipped and the label, counter and button standing on the unfinished box; steps kept, strike time for all of them | 8b191f13 | "overlaps textarea" x3 at 390, flaky at 1280: clear on repeat runs |
| Checklist detail wraps in at most 9rem under 34rem | 20426853 | "Hotel booking" 3.5 px and a column of single letters, detail cut at the screen edge: clear |
| Bars of controls in a card (inspector, auto-refresh): card track is the card's width; code tools wrap (Pretty/Raw was 28-31 px) | 2b99db0e | inspector bar 108 px and auto-refresh bar 303 px past the edge: 0 |
| Long unbroken version (64 hex characters) may break inside the string when no other place is left | 2b99db0e | version-states 70 px (1280) and 233 px (390): 0 |
| Pills to label tape (2 px): chart key chips, segmented counts, uses-map chips, slider groove | 0c1fc0ec | radii audit of the 79 sections |
| Annotated chart kinds on the beige case: the package paints them in the tones' ink (cream), so operation, update and window were three pale, identical dots; now info blue, warning amber, failure red | 0c1fc0ec | dot colours read from the page: three equal rgb(237,232,222) -> distinct |
| Slider: a vent-slot groove and a moulded key cap with an index line; focus lights the cap's lamp; press sinks it | 0c1fc0ec | screenshots at rest and on keyboard focus |

## titanium

| fix | commit | measured |
|---|---|---|
| Rating in a table cell: words under the stars under 30rem | 172dd606 (the first commit, before the merge) | "Not rated yet" overlaps "2": clear |
| Segmented track, weekday chips, code cell fold button, request inspector row, checklist detail, bars, code tools, long version: the same rules as nostromo with titanium's own tracking and chamfered chosen plate | ab1c36a4, cd20cbf9, 3e282c88, 20426853, 2b99db0e | weekday chips 15 faults (3.8 px "Mon".."Sun", "Last" 1.1 px) -> clear; explain-lede "Failed" 3.3 px -> clear; payload "Show all" 0.0 px -> clear; bars 115 / 329 px past the edge -> 0; version 46 / 209 px -> 0 |
| Square corners (G7) on the new tags, counts, counters, groove, anchor and swatch: chart key chips, segmented counts, uses-map chips and Open, slider groove, heading anchor, text box counter, availability swatch (were 999 / 4 / 2 px) | 9c37fde7 | radii audit |
| Slider: a machined slot and a bare-metal slug with the register's chamfer pair, tool edge and engraved index line; focus turns the rim to the focus ring | 9c37fde7 | screenshots at rest and on keyboard focus |

## Could not fix, or not mine to fix (shared css/js or the part pages)

- `choose/shortcut-engine`, 390 (both themes, all eleven): the open keyboard-shortcuts dialog is drawn on top of the
  neighbouring list inside the phone frame (10 overlaps nostromo, 10 titanium); sits in `kp-shortcuts` / the page.
- `choose/dated`, 390 (both themes, seven themes): the combobox's open list ("12 results", "1 day ago") overlays the
  dated list under it; an open popup over its neighbour, flaky with timing; sits in `kp-combobox` / the page.
- Tier C false positives, all themes: `kp-rating__foot` (31 / 37 px: it holds hidden Clear and Save; the visible "3 of 5"
  fits), `kp-version__to` / `__from` (the visible "12.1" and "1.118.2" are 34 / 39 px; the rest is screen-reader text),
  `kp-claim__person` (24 px initials badge; the name is screen-reader text), `kp-focus-steps__tools` (0 px high: all its
  children are `hidden` until the feature exists), `kp-pane__head` "Back to the list" (0 px high at 1280, shown on a
  phone), `kp-menu-button` "+2" in titanium's entity (35 px, a count button). A `min-width: 40px` rule in the measure's
  heuristic would drop them; no CSS change helps.
- Chart axis: the last date label ("17/10/2026") is cut by the plot's right edge at 1280 in every theme (`kp-chart`,
  shared; measure-gaps does not see SVG text).
- Titanium's `.kp-badge` keeps the shared 999 px radius under its chamfer clip, so every badge (and the version chip and
  the trace's rule tag, which are badges) is a pill with two cut corners, against G7. It is the approved badge; changing
  it changes approved titanium work, so it is Kenny's call. I did not touch it.
- Titanium plates of the new composite cards (passkey row, uses card, gallery tile, thread bubble) are hairline boxes
  without the chamfer panel: a `clip-path` would cut the focus rings and popovers those rows carry. Not done.

## DEMO_RULES confirmations

- Chapter 2 (components in a demo): kept. Only the package's parts; no hand-drawn control; menus, popovers and lists use
  `.kp-menu` and the combobox list (`measure-plate.mjs nostromo titanium`: "every surface plated, the same everywhere",
  0 findings); text margin: measure-gaps clear except the two shared cells above.
- Chapter 3 (states): kept, with a limit: I clicked every Loading / Empty / Failed / Ready state button of the nine
  scratch pages at 390 and found no overflow beyond what the formal demo already shows; I did not measure each state's
  height against the loaded height component by component (79 items).
- Chapter 4 (motion and loading): kept; one fault found and fixed (the seven-second stepped glide of nostromo's growing
  text box). No new loading animation was drawn; the registers' own busy cards and bath / lamp bank apply.
- Chapter 5 (themes and character): kept for what I changed (nostromo: tape, lamp, vent, case plastic; titanium: square
  metal, chamfer pair, tool edge, engraving; neither slider reuses another theme's idea). Not every one of the 79 items
  was redrawn: most parts already inherit each register's tokens and read as the theme; the audit (radii, kinds, sliders)
  fixed what did not.
