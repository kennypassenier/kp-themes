# 10.1.0: the complete work list

Assembled 2026-10-14 from four checks on main, each in its own file:
research/SUITE_10_0_0_TRIAGE.md (the 67 failures of the 10.0.0 suite),
research/PACKAGE_FINDINGS_RECHECK.md and research/PACKAGE_FINDINGS_RECHECK_MOTION.md (every package finding,
measured in Firefox where reading could not settle it) and research/OPEN_ITEMS_HISTORY_CHECK.md (every open item laid
against earlier fixes and Kenny's decisions). Nothing below was already fixed or already decided otherwise.

## Done on 2026-10-14

- sidenav-opener-M1: `data-kp-sidenav-opener` built (merge 6b74d704); its demo research/sidenav-opener waits on the Agenda.
- The motion report left `generate:all` (Kenny: "Rapport schrappen").
- fix-97 and fix-102 closed (passed at the 10.0.0 suite); cat-phone-frame-M1 closed (Firefox, 15 pages, 390 px).

## In progress

- The review-dialog asserts fix-106 to fix-116 (behaviour already fixed, only the tests are missing).
- The dashboard gaps: close what round two of the port built after one measurement each; the date picker's display in
  dd/mm/yyyy; a plain key figure's label that wraps instead of ending in an ellipsis.

## To do: real faults (from the triage)

1. Blueprint's trace `::after` (`inset: -9px`, css/blueprint-register.css:2806) makes a 320 px page scroll to 329 px
   and the table filter menu overflow.
2. Pastel's toast plate widens the pastel showcase to 327 px at 320 px (new since 10.0.0).
3. Formal's calendar nav ends 7 px outside a 334 px card in September.
4. Nostromo's key-figure tile changes height between states (121.2 to 139.4 px), against the fix-101 invariant.

## To do: stale tests (from the triage)

55 failures expect a look from before the character rounds; most clear with five shared repairs listed at the end of
research/SUITE_10_0_0_TRIAGE.md (the auto-lazy `EAGER` list, an `oklab()`/`oklch()` colour parser, one theme-agnostic
focus helper, ...). The stamp-cards test lists `light`, which has no stamp: drop it from the list.

## To do: package findings still open and undecided

- Destructive menu entry ink cancelled in the same layer (css/components.css:5173 before :5220): in synthwave and pastel
  "delete" looks like every other entry.
- Synthwave `.kp-button` labels cut by 4 px; blueprint kit buttons overflow in height (28 px).
- Cyberpunk's rich menu entries carry their dash on a line of their own (css/cyberpunk-register.css:781).
- A busy button has no element for its label (js/forms.js writes `textContent`).
- Formal: js/motion.js cannot replay a custom-property animation and plays element by element; no register hook for
  the live update's time or a panel's line count.
- Dark: the pass is physical left to right on a right-to-left page.
- Phantom: `clip-path` clips the part's own hard shadow; a warning tile with no change looks plain.
- Deco: a quick tap cuts the seal; the menu inlay starts mid top edge; under reduced motion the doors cover two thirds of
  a busy button's label.
- The tour dim misses an opaque later sibling in block flow (css/components.css:9446).
- The plain calendar overhangs a 334 px pane by 12 px (a scrollbar, the days themselves fit).
- The React theme list unmounts at once, so it has no close (components/theme-switcher.jsx:234).
- The light theme's dead T6 grid block in css/_rules.css:31-41 (nothing visible; delete the source).
- Dead CSS: cyberpunk's `kp-charge` rule and keyframes never win (css/cyberpunk-register.css:1543, :1663 against :2440).

## Waiting on Kenny (form of 2026-10-14)

- Grotesk's toast, alert close and upload open with `fall` and close with `leave`: a mirror or its "clockwise both
  ways" rule?
- A trend tile's long label next to its corner link ends in an ellipsis (css/components.css:1587), against "a label is
  never cut".
- The opener's default with no attribute (the markup decides) and the header room it gives back without a launcher.
- The demo research/sidenav-opener on the Agenda.

## Not worked on again (already decided or parked)

Contrast readings (a signal, not a gate: form v44); the parked package for the release after (arrival moments, per-dialog
duration incl. dark's 587 ms dialogs, tile mark and tone, state word tones); fix-103 ("voorlopig ok", form v27); light's
blueprint grid as a visible result.

## Still to settle

- Forest motion strays F-15/25/33/34 (the backdrop part is fixed; the rest not measured in time).
- The graph's loading picture as the ghost of the network: check against the decided character-graph picks before any
  work.
- Phantom's focus no longer settles its animations in tests/focus-visible.spec.mjs:136 (new, not looked at).
