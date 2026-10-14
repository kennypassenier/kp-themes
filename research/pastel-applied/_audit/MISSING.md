# Pastel applied: findings

## Contrast (2026-10-14, contrast-sweep.mjs, Firefox)

Contrast is a guideline with a signal, not a gate (Kenny, form v44). The sweep read 935 element×state readings:
141 below 4.5:1 before its fix, 140 after (12 min 46 s). Every low reading was checked against a screenshot
of the element in that state and a per-text-node measurement (each text node in its own colour, on the ground
painted under its own glyph box). **No label was found unreadable; css/pastel-register.css was not changed.**

**Sweep artefacts (no paint fault):**

- **Drag selection (fixed in the sweep).** The press state released the mouse away from the element, which
  dragged a text selection across the page; every later reading measured the selection's plum plate. This was
  the sidenav links at 1.05:1, the alert bodies at 1.14:1 and 2.14:1, the nav links and brand at 2.14:1 and the
  switch labels at 2.14:1 (measured at rest instead: 5.3 to 13.8:1). The sweep now clears the selection after
  every state and reads each text node in its own colour.
- **Antialiasing on short labels.** On a glyph box only a few pixels wide (the pagination numbers, a sidenav
  badge or icon, a calendar day, `▦`, `×`, `⠿`, `↻`) the blend between ink and plate passes the 5 % share and
  counts as a ground: pagination "14" 1.43:1 in the sweep, 6.10:1 white on plum measured; calendar days 1.70
  to 1.95:1, 4.33 to 4.57:1 measured; "Laden"/"Waarden bijwerken" pressed 1.91:1, 6.69:1 measured.
- **Covered or off-screen parts.** The side navigation's "Summary" sits under the "Open the panel" button
  where the sweep hovers it (1.29:1 is the button's plate).
- **A busy button's caterpillar** ("Working…", "Exporting", 2.36:1): its pom-poms are read as the label's
  ground; the label itself reads 9 to 10:1 on its plate (intended busy picture).
- **The review strip** (`main.fa-page`, "0 of 1 steps judged") is demo chrome, not pastel.

**Real, below 4.5:1, left as findings (pre-existing, same on 5dacb4f4):**

| Where | Reading | Note |
| ----- | ------- | ---- |
| Info alert, label and body (`--info` on its violet plate) | 4.43:1 | identical before the port |
| Calendar day count "9/9" in the success ink on its mint plate | 4.33:1 | the day number rose to 4.57:1 with the port; the count is unchanged |
| Key figure change "6 %" (success ink on mint) | 4.57:1 | passes, listed as the closest |

Not chased within the time box, sweep only: the kpi link "Charts ↗" 3.41:1, the drag handle `⠿` 3.66:1, the
alarm close `×` 3.34 to 3.48:1, "Today" at rest 4.21:1 (the first "Today" button measured 10.2:1). Each is a
short or glyph label of the antialiasing kind above until a per-node probe says otherwise.

## Open and close pairs (Firefox, 2026-10-14)

`node research/pastel-applied/_audit/pairs-meter.mjs --theme pastel --engine firefox`: 26 of 32 pairs passed at first. Three real faults were fixed
the same day: the side navigation rail's tip (its pass on `::backdrop` stayed on through the close; 106.9 % → 0.0 %), the busy table (the
table and its rows dimmed in one frame; 74.6 % → 4.0 %) and the busy calendar's card (its words were emptied before it left; inside the card
0.00 % now, `--kp-calendar-busy-words: hold` in js/calendar.js, pastel only). What the meter still reports, all read as meter artefacts:

- **calendar-busy** 95.6 %: the days underneath swap between loading and results in one frame both ways, a state change (lesson 27); every
  theme reads 95-177 % here.
- **sidenav-rail-tip** 26.4 % left over: the first rail item's hover plate, the pointer stays on it (forest 19.8 %, cyberpunk 40.1 %).
- **tooltip** 39.6-41.3 % left over: the meter freezes the two static demo tooltips in their overshoot at 517 of 560 ms; with a 1400 ms settle
  the pair passes.
- **wizard-step** and **empty-state**: state changes, not pairs (lesson 27); forest and cyberpunk read the same. A wizard run with the field
  filled left 13.7 % after Back, not traced.

Identity: `node research/pastel-applied/_audit/identity.mjs` 20 of 20 parts open and close by pastel's own family. Keyboard: a real Tab
through 400 stops, every stop shows the dashed line. Edges: `node research/pastel-applied/_audit/edges.mjs pastel` 9 small findings (log
lines, palette keys, a fieldset legend and a key figure link within 2 px of their plate edge).

## Kenny's two blocks not approved (2026-10-14)

- **Side navigation (block 3).** What painted right of the panel: the demo's over panel carried `data-kp-sidenav-backdrop`, the package's
  dimming over the whole frame (now `="false"`, as in research/all-themes-applied block 2); the panel's swing round its top corner, which
  carried its foot up to 118 px over the page (240 px panel read 358 px wide mid-open); and its sky pass, which slid in from 24 px off
  register. The side navigation (over and push) now lands in its own column without the turn (`kp-sig-pastel-sidenav-in/-out`) and its pass
  is a fixed 6 px shadow that only fades on its clock (themes/pastel/CHARACTER.md §0 and G3). Firefox, 1600 and 390, every variant (demo
  over and push, edge push, gutter, over, tab, rail flyout, tip, peek): the panel keeps its 240 px box in every frame, open and mid-toggle.
  Left as designed: the rail's group flyout and the tip are popovers that float beside the rail by purpose (their pass on `::backdrop`).
  Not changed: in the demo frame the "Open the panel" button stays over the open panel's title (the frame's layout, every theme).
- **Key figures (block 21).** The link and the toggle key figure had no tack: their `::after` is the corner that curls on a hover. Their
  tack is now their `::before` (same drawing, same leave and arrival). All five carry it at rest, through a leave and an arrival.
- Meter: identity 20 of 20; pairs-meter on the ten side navigation and pin pairs 9 of 10, the one left `sidenav-rail-tip` 26.4 %, the
  pointer's hover plate (above).
