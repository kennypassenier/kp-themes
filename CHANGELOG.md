# Changelog

## 10.0.0 — 2026-10-08

- **Released with open review pairs, on Kenny's word** [2026-10-08, forms open-blocks,
  suite-red and approval-gate]. The screenshot check reopened 2515 block/theme pairs whose
  look changed with the character rounds (1154 carried); they wait in the review dialog.
  Three earlier rejections (`data--kpi-columns` in phantom, `motion--leave-options` in deco
  and phantom) ship as they are: deco, dark, retro and phantom are being redrawn on the
  branch `claude/eloquent-hamilton-37jler` for 10.1.0, with formal and light. The release
  suite ran once: 1791 passed, 67 failed, 4 skipped (19 min 2 s); the 67 are findings for
  10.1.0 in research/PACKAGE_FINDINGS.md.

- **Fixed: a trend tile's label no longer runs under its "Charts ↗" link**: `.kp-kpi--trend > .kp-kpi__label` ends
  before the link (`margin-inline-end` 4.5 rem, 1.5 rem in a narrow tile) and a label that is still too long ends in an
  ellipsis (`overflow: hidden`, `text-overflow: ellipsis`), in every theme (css/components.css). Measured at 390 and
  1280 px in formal and brutalism: no tile's label overlaps its link.
- **Fixed: brutalism at a phone width (390 px)**: the dialog stays inside the window on every
  frame of its 2.5 rem drop (it leaves 2.5 rem of room on both sides at narrow widths:
  `max-inline-size` `min(32rem, 100vw - 2 × --kp-sig-br-h-slab)`; the drop, its curve and its 1500 ms are
  unchanged, 1280 px is unchanged), and a busy `.kp-button`'s lintel well is a 0.5 rem strip
  along the foot of the button's own box, inside it, in place of one hanging under it (no
  overlap with the next element, no layout shift, the label uncovered).

- **Changed: synthwave's grammar, as Kenny decided it on research/synthwave-character
  and research/synthwave-anchor** [2026-10-07 21:21 to 23:54, themes/synthwave/CHARACTER.md
  §0]. Anchor: the page horizon. `.kp-page-header` draws one 3 px tube on its foot
  (`::after`), the floor under it (`::before`, 8.5 rem deep at `z-index: -1` inside the
  header's own stacking context [Kenny, 2026-10-08 01:00: the floor is the page, behind
  the plates]; the header reserves nothing, and whatever follows a `.kp-page-header` is
  `position: relative` at no specificity so it paints above the floor),
  and, under a hand on a header action, a brighter piece of the tube exactly as wide as
  the action (anchor positioning on the action's own `::after`, so a popover's trigger
  with an inline `anchor-name`, such as More ▾, lights its piece too). Tokens (`css/themes.css`, from `themes/synthwave/tokens.json`): `--fx-duration`
  225 ms (one beat), `--fx-ease` the sunrise curve `cubic-bezier(0.65, 0, 0.35, 1)`,
  `--fx-lift` 0 (nothing lifts or drops); the root says `--kp-close-max` and
  `--kp-size-max` 450 ms. Durations are beats of 225 ms: an opening 2, a live change 3,
  an arrival or a leave 4, the spinner 8 (1800 ms). Surface: plates (`.kp-card`,
  `.kp-kpi`) are chrome over the floor (3 px stripe, a lit line under it, a shaded foot,
  the grid floor in the lower part), panels the same without the floor, square; the
  corners fall (pink down the left side, cyan down the right, fading out, starting in
  the colour of the stripe end they touch). Colour roles: icon and copy buttons and the
  section rule are pink (laser yellow stays for a warning). Type: identifiers and the
  data faces speak in VT323 (`--kp-mono` is the OSD face, sized by x-height).
  Hover turns the tube up (no lift); press charges the part (its top edge burns, the
  ground takes the pressed token, the header's piece charges); focus is two tubes, top
  and foot, plus a hairline each side, on every part that takes the keyboard
  (`--kp-sw-rails-in` inside buttons, fields, selects, textareas, tabs, menu entries, nav
  links, table cells and rows, tree and accordion triggers, calendar days, pagination,
  tags, key-figure links; `--kp-sw-rails-out` outside links in text, checkboxes, radios
  and switches; a catch-all for any other button or role; a forced-colours outline). Tone: the VCR's symbols (a pause for a warning, a stop for a failure) in
  the part's own ink before a key figure's figure or an alert's label, the stripe and
  sides turning to the tone's ink. Live: `--kp-update: laser`, a 2 px laser drawn under
  the changed value from its centre out, 675 ms. Opening: the beam climbs to the
  horizon: the dialog, popovers, tooltips and the menu button's menu are uncovered from
  their foot upward behind a 2 px beam, 450 ms, and the popovers and menus close as that
  climb reversed (transitions). Leave: the sun sets through it, the part sinking with
  the sun, 900 ms (`[data-kp-leaving]`, replacing the striped circle); a toast and what
  arrives play it backwards; new rows rise over the horizon instead of racing in
  skewed. Loading (the oncoming tube and floor, the bars as they were): while a header
  or an ancestor is `aria-busy='true'` the tube is a track with the sun's ramp flowing
  through it (1800 ms) and the floor drives toward you (900 ms); a `.kp-progressbar`
  with a share fills from nothing on the sunrise curve in four beats, a beat behind the
  tube. The same loading at the scale of a tile: a `.kp-card` or `.kp-kpi` that is
  `aria-busy='true'` (or sits in a `.kp-tiles` or `.kp-kpis` that is) has its stripe as the
  unlit tube with the sun's ramp flowing through it (1800 ms) and the lines of its floor
  driving toward you (900 ms), at full light (`--kp-busy-opacity: 1`, the package's 0.7 dim
  would dull the tube). A tile whose value changes draws the laser too: on the value
  (`[data-kp-updating='laser']`, a `.kp-kpi__value`'s line as wide as the figure) or, when the
  whole plate is marked, under the plate (`::before`; a dossier card keeps its label there and
  draws none). The key figure's number is counted in the chrome display face
  (`--theme-font-display`, a near-white core with the pink tube; its unit and note go back to
  the body face; a figure on a warning or destructive plate keeps the plate's ink, no glow).
  A key figure that is a toggle or a link charges when pressed (`:active`) and a toggle that
  is on (`button.kp-kpi--toggle[aria-pressed='true']`) stays charged: the stripe and the sides
  burn near-white, the bloom gathers above, the ground takes `--secondary-active`, and a second
  channel that is not colour [DI2]: the VCR's play symbol in the tile's padding before the
  label (out of the flow, so no sibling moves) and the horizon of its floor lit near-white.
  The demos `research/character-tiles` (loading 1, live 2) and `research/character-kpi`
  (number, loading 1, press) carry the same pictures in their `synthwave.css`, replacing the
  pink dashes along the foot and the tiles' tracking jump. Retired: the headline's tracking bands and RGB fringe (the reveal is the tube
  striking on, then the shine), the meter's spring and bump, the check's tween, the
  tooltip's typing, the plates' glowing rims, the nav's drop (it rises). The network
  graph, the skeleton, the busy road, the busy table's loading and the boot screen are
  unchanged. Research demos: the synthwave picks of the busy table (shape), trend tile
  (arrival), key figure (live) and dashboard tiles (hover, tone) are redrawn in
  `research/character-*/synthwave.css`.
- **Changed: grotesk's grammar, as Kenny decided it on research/grotesk-character** [2026-10-07 23:43, themes/grotesk/CHARACTER.md "Applied 2026-10-07"; all nineteen questions approved, the press = the rule thickens]. The anchor is Out of register: a second, red plate under the black ink. `--fx-ease` is `linear` (on time: an even pace, a dead stop, a dwell); units of the register's 120 ms: contact 1, a set 2, a fall 8 (960 ms), a loop 22 (2640 ms); the root says `--kp-close-max` 960 ms and `--kp-size-max` 240 ms (the resize stays Kenny's three cuts). What arrives or opens (dialog, toast, tooltip, `[data-kp-arriving]`) is printed in black and its red plate, a `drop-shadow` of the part, falls into register on it along a closing spiral, clockwise (`kp-sig-grotesk-fall`; the dialog's unopened probe runs 1440 ms, the open one 960, so open and close are one fall); focus is DI2's ring and the same fall; a live change is `--kp-update: plate` (`kp-sig-grotesk-update-plate`), a meter's tone turning to warning or destructive falls again. The leave is NOT the arrival reversed, on his explicit word (CHARACTER.md section 0b): the plate opens out clockwise, one turn, then the part is gone (`kp-sig-grotesk-leave`, registered `--kp-sig-gr-a` and `--kp-sig-gr-q`, never turning back, in either text direction); the register no longer declares `--kp-open: reverse-close`, so an arrival plays its own fall. Loading is out of register: the skeleton (lines, block, circle), the busy bar (the slab, 22 units), the loading meter's ruler, a loading calendar day and menu entry print a red copy that travels the clockwise loop; the spinner is the twin that turns (a quarter turn in 8 units, a dwell of 3, clockwise only); `--kp-busy-opacity: 1`. Hover is a bar on the edge (a 3 px red bar on a button's foot, ink on a red face; a menu entry's top edge; a link tile's rule red and 7 px), the press thickens the baseline in the deeper red on the paper face, and a pressed button is never grey (the grey face of 2026-09-14 and the inverting coloured buttons are retired); a nav link keeps its baseline. A card, key figure, busy panel and page header are a column under a 3 px ink rule, no frame; a warning is indexed (a 6 px bar of the tone down the start edge, the tone's word before the figure, the change on a square plate with the arrows ↗ ↘); badges and tags speak Inter 700 in sentence case; the reveal knobs and the signature's durations count whole units. The research/character-* demos carry grotesk's decided options redrawn on the same grammar (`grotesk.css` in each).
- **Added: `--kp-press: size`, the measured width of a pressed button written as `data-kp-press-size`** [2026-10-08, blueprint character]. `js/effects.js` arms the press bus for a theme that declares `--kp-press: size` as it did for `point` (new export `PRESS_SIZE`); `js/effects/pointer.js` writes the width in whole pixels on `.kp-button` and `.kp-icon-button` at pointer-down and on Space or Enter, and answers per press from the theme then active, so a page that changes theme keeps each theme's own answer. Sepia's `point` and every other theme are unchanged. Blueprint declares `size` and letters the dimension below a pressed part with `content: attr(data-kp-press-size)` in the draughtsman's lettering (mono, sloped 15 degrees), the line broken around it; without the module or before a first press the line runs unbroken.
- **Fixed: three more leftovers of the old blueprint** [2026-10-08, themes/blueprint/CHARACTER.md G3, G7, G8, G17]. The nav dropdown's links, the combobox's and the palette's active row take the menu entry's witness-line hover (two amber lines and a ruler with a pointer at each end, no ground change; `--kp-menu-wash` is removed). A menu inside a popover or the theme menu's list is unframed, so a popover with a menu draws one 1 px frame (the pen traces that frame; a standalone menu, a menu button's list, the combobox list and the date picker panel keep their own single frame). A captioned nav dropdown shows its caption instead of a solid bar. CHARACTER.md §1-§3 now state the pen-read meter and the one-frame windows.
- **Fixed: blueprint's combobox list and toast open by their own trace at once** [2026-10-08]. They opened as a leave turned around by `js/motion.js`, so the pen started 466 ms late and the list opened by the part's read-out; they now say `--kp-open: normal`, and every traced panel's leave (`[data-kp-leaving]`) is the trace played backwards, never the part's read-out mask.
- **Fixed: three leftovers of the old blueprint in its register, against the approved character** [2026-10-08, themes/blueprint/CHARACTER.md G3, G7, G8, G9]. The meter's share arrives by the register's read-out (`kp-sig-blueprint-read`, three 160 ms units, the leave its reverse per frame) and a changed reading slides on the feed, in place of the 1200 ms wipes (`kp-sig-blueprint-meter-wipe-*` removed); a warning or failure is a pointer under the track in the tone's ink (also past the end, the over sign keeps `::after`); the windows (menu, popover, tooltip, dialog, toast, nav dropdown) carry no blur shadow, only their one frame; a menu entry is read on a scale like a button (witness lines, a ruler with a pointer), with no wash.
- **Changed: blueprint's character, as Kenny decided it on research/blueprint-character** [2026-10-07 23:41, sixteen of sixteen, with the tracing pen of research/blueprint-anchor as the anchor; themes/blueprint/CHARACTER.md "Applied 2026-10-08"]. One visible plotter pen draws everything, on the package's own components and with no new element or script: `--fx-ease` is the plotter's feed (`linear(0, 0.031 10%, 0.125 20%, 0.875 80%, 0.969 90%, 1)`, `themes/blueprint/tokens.json`), durations count 160 ms (a part 3 units, a panel and the dialog 5 with `--kp-close-max` 800 ms, a tooltip 3, a revision 6, a loop 18). A part arrives and leaves by being read out on its own scales: the pen runs the diagonal of the part, amber witness lines and pointers on its start edge and foot follow it, each line is inked as the pen passes (a `round(up, …, 1lh)` mask over the content box), and the leave is the arrival played backwards by `js/motion.js` (`kp-sig-blueprint-read`, replacing the hatched leave and the resize plot and its closed dashed frame). Dialog, popover, menu, menu button, combobox list, date picker panel and toast open by the pen tracing the outline from its corner and the panel being inked at three quarters (`kp-sig-blueprint-trace`, the dialog's crosses move inside its corners); a tooltip draws its leader, then its outline. A control read on a scale: hover sets the two amber witness lines and runs them on to a ruler with a pointer on each end, focus keeps the two-channel ring and the lines, a press draws the dimension below the part with a slash at each end and never changes its ground (the primary and destructive hover inversions and every pressed ground are gone); a menu entry takes the lines. Plates (card, key figure, tile, pane, spec, log, diff, wizard, data table, form summary, reorder list, plain alert, empty state) stand on the graticule's two axes with no fill and no closed frame; a tone is pointed out on a ruler under the figure instead of a plate; the draughtsman's lettering (mono capitals sloped 15 degrees) is the voice of labels, tags, heads, the change, toasts, the tooltip and the dialog title. A live update is read again: `--kp-update: read` slides an amber pointer along a short ruler under the value. Loading is one pen: skeleton lines are underlined place by place two units apart, a block is traced round, a circle is ringed, the progress bar is the pen's stroke with the pen at its end (busy it strokes, lifts, goes back and strokes again), and the meter's loading does the same; the arrowhead, hatched fill and chain line of the dimension bar are gone. Not built as CSS: the size lettered on a press's dimension (CSS cannot print a measured length).
- **Changed: brutalism's grammar, as Kenny decided it on research/brutalism-character**
  [2026-10-07 23:44, themes/brutalism/CHARACTER.md "Applied 2026-10-07"].
  Gravity: brutalism's `--fx-ease` is the fall curve `cubic-bezier(0.6, 0, 0.9, 0.5)`
  and `--kp-sig-br-up` its mirror; contact 100 ms, a fall, an arrival and a leave
  300 ms, the dialog 1500 ms, a loop 1200 ms (`--kp-sig-br-*`; the root says
  `--kp-close-max` 1500 ms and `--kp-size-max` 300 ms). What opens is dropped onto its
  footprint from up-left with its hard shadow on the ground from the first frame (the
  dialog, the toast, the tooltip, the meter's share; no tilt, no fade, no scale; the
  backdrop holds solid), and what leaves is lifted 1 rem up-left off it and gone in one
  cut, replacing the slam to the left. Loading is the lintel hoisted in four hard lifts
  on every waiting surface (skeleton lines, block and circle, a loading meter, the data
  table's busy panel, a loading menu entry, a busy button, a busy card, the busy
  calendar); the spinner is the block tipped over. The progress bar is Ruled and
  labelled, slowest: the share is printed in the yellow tip and walks to its value in
  ten hard steps of 80 ms, busy the tip hops in ten steps over 2400 ms and prints
  three dots (the tape is gone). Pointing inverts every button, icon button, menu
  entry and navigation link, focus lifts under the two-channel ring, a press is driven
  onto the shadow's own 6 px (3 px on a small part). A new value is slammed onto its
  yellow offset (`--kp-update: slam`); a warning or a failure is taped off (an alert's
  foot, a meter's share, an invalid field's error plate); a status is paint under an ink
  line, never a coloured line. Prose is 500, labels, dates and figures 700 or heavier
  and never under 12 px, dates bold mono in ink. The research demos' brutalism picks
  (`research/character-*/brutalism.css`) follow; the network graph is unchanged. Found while watching the states (2026-10-08): a refreshing data table no longer dims its rows (`--kp-datatable-busy-opacity: 1`, nothing is translucent), a loading menu entry's well is 0.75 rem (the beam was 2 px), an alert's close cross is 700 and 1.5 rem.
- **Changed: terminal's grammar, as Kenny decided it on research/terminal-character** [2026-10-07 23:43, themes/terminal/CHARACTER.md G1-G18, sixteen of sixteen approved]. The cursor writes the screen. Clocks: `--fx-duration` 34 ms and `--fx-ease` `steps(1, jump-end)` (contact is one step), a cell 34 ms, a printed line 136 ms, the slow blink 1000 ms, a change 900 ms (`--kp-sig-tm-*`). Arrival: the meter's share is typed a cell a step with the block cursor on its head (1088 ms); the dialog is printed six lines at 136 ms with the cursor at the line being printed (its unopened probe runs 1.5 times that and `--kp-close-max` is 816 ms, so `js/motion.js` opens and closes it in one print); toast and tooltip type at the cell clock; the leave keeps Kenny's 480 ms sweep with a one-cell cursor in the bloom (no glow) and mirrors under `dir="rtl"`. Loading is an htop row, the cursor its head (dim brackets and cells, cells lit in the ink a cell a step, emptying as they filled, 1000 ms each way) on skeleton lines, block skeletons, a loading meter, the data table's busy panel, a busy calendar, a loading menu entry and a busy card or key figure; a busy button shows the cursor alone; the spinner and the busy bar are unchanged. A change blinks three times (`--kp-update: blink`, `kp-sig-terminal-update-blink`, 900 ms); a new meter tone blinks the share. Pointing is the cursor ring (buttons, icon buttons, menu entries, links, nav and side nav, footer links, link and toggle key figures, tiles), focus the 2 px dashed box in the bright phosphor, a press reverse video; plates (card, key figure, grid tile, pane, plain alert, data table, busy panel, wizard, spec, log, diff, form summary) are a line of htop between square brackets instead of a closed frame; a toned key figure stands on the tone's plate with `[warn]` or `[fail]` before it and its change underlined; labels, badges, tags, tabs, table heads, the alert label and the footer heads are lower case and untracked; the meter loses its glow and its blink at rest. Every keyframe row of the old meter jolt, pos and blink is replaced in js/effects.js and gates/check-motion.mjs. The network graph is untouched. The per-component demos carry terminal's picks on the same grammar (research/terminal-character/grammar.css, research/character-*/terminal.css; research/character-busy/terminal.js keeps the removed overlay for its leave).
- **Changed: cyberpunk's grammar, as Kenny decided it on research/cyberpunk-character**
  [2026-10-07 23:52, themes/cyberpunk/CHARACTER.md §0]. Motion: the dialog, the
  toast, the tooltip and every `[data-kp-leaving]` part arrive and leave as the
  channel split (a yellow and a cyan ghost that come home 6, 4, 2 and 1 px in
  four 120 ms ticks, 480 ms in all, inside a notch-safe wide clip); a close is
  its open played backwards. Shape: the holo plate with its 14 px notch (8 px on
  a control and the tooltip), rim, 135 degree scan lines and prefixed `///` mono
  labels. Pointing is the split edge (a cyan and red doubled edge that follows
  the part's own cut), focus is four closing brackets, a press closes the circuit
  with no lift. The spinner is four bars with a glitch copy (3000 ms), loading is
  the on-screen word LOADING over the skeleton, meter and busy progress bar, and
  the live update's stutter has a fixed 480 ms duration. The meter's knock
  keyframes are removed. Not ported yet: the TARGET and CAUTION tags, the meter's
  tone brackets, hover and press on a plain card or calendar day, and a menu
  (popover) open, which needs a `js/motion.js` hook. css/cyberpunk-register.css.
  (arrival), key figure (shape, tone, hover, focus, live), dashboard tiles (shape, hover,
  tone), the page header (shape, actions) and the strip (shape, change) are redrawn in
  `research/character-*/synthwave.css`: square plates on the register's chrome over the
  floor, the corners falling; the old 2 px pink rim with its glow, the 0.4 rem, 6 px and
  4 px corners, the header's frame, its 999 px cyan pills and the strip's cyan-glow pill
  are retired. New review demo `research/synthwave-floor`: how deep the page floor is
  (a 3.5 rem band inside the header as the package has it, the floor behind the plates
  at 8.5 rem, a header as deep as the floor, deep only where there is room); the
  package keeps the band until Kenny picks.
  keyframes are removed. A warning or destructive key figure carries a boxed CAUTION or TARGET tag, a destructive menu entry a [TARGET] prefix, a toned standalone meter four closing brackets, and a pointable card and a calendar day take the split edge and the closed circuit; a plain card takes neither. Not ported yet: a menu (popover) open, which needs a `js/motion.js` hook. css/cyberpunk-register.css.
  (`research/character-*/brutalism.css`) follow; the network graph is unchanged.
- **Changed: terminal's grammar, as Kenny decided it on research/terminal-character** [2026-10-07 23:43, themes/terminal/CHARACTER.md G1-G18, sixteen of sixteen approved]. The cursor writes the screen. Clocks: `--fx-duration` 34 ms and `--fx-ease` `steps(1, jump-end)` (contact is one step), a cell 34 ms, a printed line 136 ms, the slow blink 1000 ms, a change 900 ms (`--kp-sig-tm-*`). Arrival: the meter's share is typed a cell a step with the block cursor on its head (1088 ms); the dialog is printed six lines at 136 ms with the cursor at the line being printed (its unopened probe runs 1.5 times that and `--kp-close-max` is 816 ms, so `js/motion.js` opens and closes it in one print); toast and tooltip type at the cell clock; the leave keeps Kenny's 480 ms sweep with a one-cell cursor in the bloom (no glow) and mirrors under `dir="rtl"`. Loading is an htop row, the cursor its head (dim brackets and cells, cells lit in the ink a cell a step, emptying as they filled, 1000 ms each way) on skeleton lines, block skeletons, a loading meter, the data table's busy panel, a busy calendar, a loading menu entry and a busy card or key figure; a busy button shows the cursor alone; the spinner and the busy bar are unchanged. A change blinks three times (`--kp-update: blink`, `kp-sig-terminal-update-blink`, 900 ms); a new meter tone blinks the share. Pointing is the cursor ring (buttons, icon buttons, menu entries, links, nav and side nav, footer links, link and toggle key figures, tiles), focus the 2 px dashed box in the bright phosphor, a press reverse video; plates (card, key figure, grid tile, pane, plain alert, data table, busy panel, wizard, spec, log, diff, form summary) are a line of htop between square brackets instead of a closed frame; a toned key figure stands on the tone's plate with `[warn]` or `[fail]` before it and its change underlined; labels, badges, tags, tabs, table heads, the alert label and the footer heads are lower case and untracked; the meter loses its glow and its blink at rest. Every keyframe row of the old meter jolt, pos and blink is replaced in js/effects.js and gates/check-motion.mjs. A menu or popover is printed four lines at 136 ms with the cursor at the line being printed (the reverse is the same keyframes, played by `playEntranceBackwards`), the dialog's dim comes up in the dialog's own six steps instead of the package's fade, and the switch's thumb leaves the way it came (`steps(4, jump-start)` going off). Menu entries take the ring on hover, the dashed box on focus and reverse video on the press, chart legend keys are small terminal buttons (ring, dashed box, reverse while held), and a calendar day takes the ring while the pick is the `>` prompt with its count in reverse and today the figure in reverse. The network graph is untouched. The per-component demos carry terminal's picks on the same grammar (research/terminal-character/grammar.css, research/character-*/terminal.css; research/character-busy/terminal.js keeps the removed overlay for its leave).

- **Changed: solstice's pointing is the sun climbing its arc, its press the sun swelling inside the part** [2026-10-07, Kenny: both picks of research/solstice-character, replacing the rake of scope-12 and the restated `-active` faces of fix-12]. One grammar for every pressable part (buttons of every variant including primary, mirror and icon, menu items, calendar days, key figures that are links or toggles, chart legend keys): a real `:hover` raises a sun along its arc under the part with a dome of warm light and a lit foot edge (`::before` and `::after`), a real `:active` swells a half-sun from the middle of the foot, lights the foot edge and takes the ground half-way to its held face, the words lifting to cream. Two registered numbers (`--kp-sig-solstice-point`, `--kp-sig-solstice-press`) run 240 ms on `cubic-bezier(.37, 0, .63, 1)`, in and out identical (measured in Firefox, real mouse: t50 120 ms, t90 191 ms, both ways, all parts). The register paints no hover face any more; the alarm keeps its own paint. Reduced motion: the finished pose at once.

- **Changed: nostromo's toast, card tile and key figure are drawn and erased under the raster's beam, as the dialog is** [the raster for opening and leave, research/nostromo-character]. They were clipped in whole frames without the beam. The beam (`--kp-sig-no-beam`, the LED orange with its fading tail, 1.1 rem tail as the research demo's tile) is a background layer that exists only while the part plays (`kp-sig-nostromo-beam-layer`, `kp-sig-nostromo-beam-layer-erase`), so no pseudo-element is taken and the part's own background is untouched at rest: 4 frames of 80 ms, the beam's foot on the same edge per frame as the dialog's (0, 25, 50, 75 % of the height, measured in Firefox), the leave the draw backwards frame for frame (75, 50, 25, 0 %), and a tile's or key figure's arrival, which js/motion.js plays as that leave turned round, the exact mirror. It lies under the text and the klaxon frame. Reduced motion: the finished part, no layer.

- **Changed: nostromo's busy progress bar keeps its LED window and its lamps compute** [Kenny, 08/10/2026 01:02: option `led` of research/nostromo-character, update 3, question `busy`]. A `.kp-progressbar[data-kp-indeterminate]` keeps the LED window in its moulded bezel (the meter's cells, 3 px on a 6 px pitch, times `--kp-progressbar-scale`); its lit cells, in the LED orange with their glow, switch in a fixed unordered pattern (a 37-cell tile with 11 lit, shifted 0, 14, 5, 25, 11 cells): a new pattern every 4 frames of 80 ms, five patterns, 1600 ms a cycle, in held steps (`kp-sig-nostromo-compute`); under reduced motion the first pattern stands. It replaces the amber COMPUTING glass this bar took with loading "raster" (d81d9892): the word was 0.5 rem in a 10 px window. Every other waiting part keeps the glass; the bar with a share, the meter and the sizes are unchanged.

- **Changed: nostromo's live update and loading, the last two picks of research/nostromo-character**
  [Kenny, 08/10/2026 00:05, live "raster" and loading "raster"; G9, G10]. Live:
  `--kp-update: raster`; js/update.js's new value stands at once, dimmed to a third
  (its own mask), and is rewritten from the top in 4 frames (320 ms) under the beam
  (`::before`), while the lamp beside a key figure's label lights as the LED in one
  frame, holds and goes out after 8 frames (640 ms). Every key figure's label now
  carries its lamp (unlit at rest; G16), with room inside the label's clip so the
  lit lens and glow are whole. Loading is the waiting screen: dark glass, scanlines,
  a hum band rolling in 10 steps, COMPUTING written row by row in 12 frames under
  the beam, standing 6, blank 2 (1600 ms); the busy progress bar is that screen in
  its own window (it was every other LED lit, standing still), a skeleton line a
  glass whose phosphor line is written in its turn (rows 4 frames apart), a block
  skeleton (the time chart's plot while it loads) writes COMPUTING in its middle,
  a loading day is a glass cell, the menu's loading entry and the data table's busy
  panel carry a glass along their foot. The skeleton's orange glow is retired. A bar
  with a share, the meter and the tape reel are unchanged.

- **Changed: nostromo's grammar, as Kenny decided it on research/nostromo-character**
  [2026-10-07 23:18, sixteen of eighteen approved; themes/nostromo/CHARACTER.md].
  The anchor is the raster. Motion runs on the ship's 80 ms frame clock:
  nostromo's `--fx-ease` is the register's curve held per frame (a 2-frame
  `linear()`), `--fx-lift` is 0, and the register declares the frame tokens
  `--kp-sig-no-f2/-f4/-f8`, contact 160 ms, a panel 320 ms, a print 640 ms,
  a loop 1600 ms, with `--kp-close-max` and `--kp-size-max` at 320 ms. The
  dialog, the drawer, the toast, the tooltip and the tour card are drawn by
  the raster from their top edge down in whole frames (`kp-sig-nostromo-raster`,
  steps; the dialog with the beam on its `::after`), the headline, the stamp
  and the section rule too; the leave is that draw played backwards
  (`kp-sig-nostromo-erase`, 320 ms), so every arrival is the draw. The tape
  reel turns once in 1600 ms in 20 frames; the radio's lens switches on in a
  frame; the tick prints in 2 frames; the switch moves in 2. Corners are
  moulded: buttons, icon buttons, menu entries and small controls 0.3rem,
  badge and tag label tape 2 px (the badge is no longer a pill), and the
  focus ring keeps the part's corner. Every switch has its lamp: the button,
  the menu entry and the key figure that is a link or a filter; lit in ink
  under the pointer, full when pressed, lit orange as the LED on keyboard
  focus; a key at rest is raised and a press turns it into a well without
  moving it; the side navigation's lamp no longer slides. Cards and key
  figures are raised moulding; the key figure's figure is Michroma and its
  label label tape; a warning or failed key figure, meter or destructive
  menu entry is framed 3 px in its tone's ink (the meter's sideways jolt is
  gone). A tick and a picked day are ink. The meter's share prints in 640 ms.
  The live update and the loading pictures are unchanged (both reopened).
  nostromo's picks in research/character-* are redrawn on the same grammar
  (`nostromo.css` per demo, `research/character-busy/nostromo.js`).

- **Changed: solstice's focus ring is a halo** [2026-10-07, Kenny: the halo of research/solstice-character, replacing the global two-channel ring]. A 3 px double rust outline 3 px off the part on every `:focus-visible`; the mirror button keeps only its highlight. The leave comment now names the morning mist, not an eclipse (css/solstice-register.css).

- **Fixed: `.kp-skeleton--block` and `.kp-skeleton--circle` have their own size again** [2026-10-07, Kenny]. The base `.kp-skeleton` rule (1rem tall) came later in components.css than the two shape rules and won at equal specificity, so in every theme a block was a flat 1rem bar and a circle a flat ellipse. The shape rules now follow the base rule: a block is `--kp-skeleton-block` (6rem) tall, a circle `--kp-skeleton-circle` (3rem) wide and as tall as wide.

- **Changed: forest's skeleton block and circle are a treeline that fills in** [2026-10-07, Kenny: option 1 of research/forest-skeleton, replacing the planted plot]. Two ridges rise from the foot, then the planted tree line (the lines' own trees, whole trees only) walks across start to end; 3200 ms linear loop (`--kp-fo-grow`), the leave is the arrival reversed, the leaf corner on the block, clipped to the circle, a finished still under reduced motion. The chart's loading panel and legend stubs take it too; the text lines are unchanged (css/forest-register.css, themes/forest/CHARACTER.md).
- **Fixed: no register frames the theme picker's icon button** [2026-10-07, Kenny]. Sixteen registers (blueprint, brutalism, dark, deco, formal, grotesk, high-contrast, light, nostromo, pastel, retro, sepia, solstice, synthwave, terminal, titanium) listed `.kp-theme-menu`, the wrapper round the button, among the popover surfaces and drew a card border or shadow round it; the surface now belongs to `.kp-theme-menu__list`, the dropdown, and the wrapper takes none (as phantom's already did).

- **Changed: forest's skeleton block and circle, and the empty state, carry forest's own pictures** [2026-10-07, Kenny: "not convinced" by the diagonal stripes and the rings]. The skeleton block and circle are a treeline that fills in (entry above); no stripe is left in forest. The empty state is a clearing on the map: a dashed leaf-cornered plot, one seedling that grows once (1000 ms, growth curve), a clay trig point at the corner (css/forest-register.css only; DOM, sizes and copy unchanged).

- **Changed: forest's contour field is one seamless tile, static and part of the
  page** [2026-10-07, Kenny: "they do not form a whole"]. A 900 x 900 px
  periodic topographic tile (lines continue across every edge, closed summit
  rings and long wandering lines, no ring cut off) replaces the 900 x 460 px
  field of four cut-off rings. It is the body's own background: it scrolls with
  the content and no longer drifts; the 40 s `kp-drift` animation and the fixed
  `body::after` overlay are off for forest (css/themes.css, css/_rules.css,
  css/forest-register.css). Weight measured in Firefox: 0.07 luminance levels
  darker than the paper before, 0.09 after (alpha 0.05 ink either way).

- **Fixed: forest's theme picker no longer sits in a card frame** [2026-10-07, Kenny]. The register painted the card chrome (border and shadow) on `.kp-theme-menu`, the wrapper round the icon button, so the button had a square frame around it; the chrome now belongs to `.kp-theme-menu__list`, the dropdown the React switcher draws.

- **Changed (research demos only): the busy overlay's leave in forest's demo
  is its arrival reversed** [2026-10-07, Kenny: every close is its open
  reversed]. research/character-busy withers back with `fog-grow-back` (the
  arrival's keyframes `reverse`, 1000 ms, same curve; measured identical frame
  for frame in Firefox). The package removes the layer at once, so the demo's
  `forest.js` only holds it for the leave. The meter and the progress bar keep
  their 3 px corners (Kenny, 2026-10-07 18:22: they take no leaf corner).

- **Changed: forest's grammar, as Kenny decided it on research/forest-character**
  [2026-10-07 17:47, themes/forest/CHARACTER.md "Applied 2026-10-07"].
  Growth: forest's `--fx-ease` is the Gompertz growth curve (a `linear()` list,
  `--kp-sig-fo-grow`) and `--fx-lift` is 0; contact stays 200 ms, a growth,
  opening, arrival and leave is 1000 ms (`--kp-sig-fo-time`), a loop 3200 ms,
  a stagger 80 ms; the root says `--kp-close-max` and `--kp-size-max` 1000 ms
  so `themeMotion()` closes and resizes in one growth. The dialog grows up
  out of its base line (a `translate` clipped at that line, never scaled; its
  unopened probe runs 1500 ms, the open dialog 1000 ms, so open and close are
  both one growth), the toast grows from its base as its leave reversed, the
  tooltip grows down out of its trigger like a root; the leave withers into
  its line from green to sepia on the growth curve turned around
  (`--kp-sig-fo-wither`), which makes its arrival the growth, frame for
  frame. Pointing is blazing: a 2 px dashed `--primary` ring 2 px out on a
  button, icon button, menu entry or key-figure link (no lift, no shadow), a
  press closes it in to 1 px and solid; focus is DI2's ring. Live: forest
  declares `--kp-update: ring`, a growth ring drawn once round what changed
  (`kp-sig-forest-update-ring`, 1000 ms); a meter's tone to warning or
  destructive lays the same ring. Loading: the planting strip, the bar's busy
  breath, on skeleton lines (400 ms apart), a loading meter's groove, the data
  table's busy panel, a loading menu entry, a busy button, a busy card, the
  busy calendar and the chart's loading state; the spinner plants a tree in
  three whole stages, 1600 ms a tree. The leaf corner (top-right and
  bottom-left rounded) is one rule and one token (`--kp-sig-fo-leaf`) on every
  plate and small part; tags and plain badges are light wood; notes (tags,
  the change on a tile with ↑ ↓, labels, help text) are italic. The progress
  bar and the network graph are unchanged. The key-figure link and the other
  composites keep the package's own markup and take these rules through their
  buttons.

- **Changed: forest's progress bar breathes and loses its sapling** [Kenny,
  2026-10-07]. The light-green sapling head (and its sway, mound and the
  travelling grove keyframes) is gone, determinate and busy alike. A busy bar
  fills the planted row start to end in 3000 ms, holds full 600 ms and empties
  in 3000 ms with the same frames reversed (`--kp-fo-breath`,
  `kp-progressbar-forest-breath`); reduced motion shows whole trees at half
  breath. The compass spinner is unchanged [themes/forest/CHARACTER.md].
- **Fixed: grotesk's resize cut cuts in three.** `kp-sig-grotesk-size-cut`
  declared only a `from` inset, and an inset does not interpolate with a
  line's own `clip-path: none`, so a line arriving in a resized box was
  hidden for 120 ms and then whole. The keyframe now ends on `inset(0)`:
  hidden, a third, two thirds, whole, 80 ms apart [themes/grotesk/CHARACTER.md
  outlier-14].
- **Fixed: blueprint's resize plot plots top down.** `kp-sig-blueprint-size-plot`
  had the same missing end (hidden for 210 ms, then whole); it now ends on
  `inset(0)` and uncovers the line from its top edge at an even pace over
  420 ms [themes/blueprint/CHARACTER.md outlier-14].
- **Fixed: terminal's ghost button keeps its `]` under the pointer.** The
  ghost's closing bracket and the gap-4 cursor both live on `::after`, and the
  cursor's rule emptied the content, so a hovered or focused ghost showed `[`,
  its label and a cursor but never the `]`. The `]` is back and the cursor
  stands on it, the bracket in reverse while the block is lit
  (`kp-caret-reverse`, new, in step with `kp-caret`, with its row in
  `TIMINGS`); both brackets sit on the cursor's line box, level with the
  label. Under reduced motion the cursor stands lit on the bracket
  [themes/terminal/CHARACTER.md outlier-16].
- **Changed: cyberpunk's live update is the count-down stutter** [Kenny on
  research/cyberpunk-live, 2026-10-07 02:49]. `update()` in cyberpunk plays
  `--kp-update: stutter` (was `glitch`): two unblurred neon copies of the
  value, yellow `--primary` right and up, cyan `--accent` right and down,
  tick home 6, 4, 2, 1 px in four hard steps over 480 ms (0.64 of the update
  time, so `--kp-motion-scale` slows it too), the value sharp on top and
  never moved (`kp-sig-cyberpunk-update-stutter`, a text-shadow; the glitch's
  jitter and torn line are gone). Under reduced motion the copies stand 2 px
  out for 1.2 s and go (`kp-sig-cyberpunk-update-still`). A spark in
  cyberpunk takes its new point at once (`--kp-update: none` on the svg).
- **Changed: `update()` marks every update of one task in one batch.** The
  value is still written at the call; the marks go on together in one
  microtask that reads every element's idea and display first, the theme's
  timing once per theme, then writes every mark, then reads the animations,
  so a dashboard that changes fifty values pays one style pass instead of a
  forced layout per value. `markUpdating()` no longer forces a reflow of its
  own; `updatePlays(idea)` is true whenever the register names an idea (a
  register that names one under reduced motion plays a still version on its
  own time). The idea is read on the element itself, so a spark's svg can
  name none.
- **Changed: titanium moves on one curve.** `--fx-ease` for titanium is
  `cubic-bezier(0.2, 0.8, 0.2, 1)` (was `cubic-bezier(0.3, 0.9, 0.3, 1)`),
  and the register's one-shot motions use it: button contact (60 ms, was
  linear), the headline `kp-mill`, the switch thumb, the toast rail and
  scribe, the dialog cut and its cutter, the tooltip, the progress fill and
  head, the meter's grow, jolt and mark; `--kp-settle` resolves to the same
  curve. Because `themeMotion()` reads the dialog's curve, a dialog's close,
  a box's size glide (`--kp-size-ease`, was linear) and `update()`'s heat
  tint follow it. Loops keep a constant feed [themes/titanium/CHARACTER.md
  G1, Kenny 2026-10-07].
- **Changed: titanium's loading is the anodising bath** [Kenny on
  research/titanium-loading, 2026-10-07 00:54]. The skeleton (line, circle,
  block), the progress bar (busy: the slug is gone, the fill spans the track;
  with a share: the fill is the oxide film), the meter while measuring (was
  the 1400 ms cutter), the data table's busy panel and refreshing rows, a
  menu's loading entry, a busy button, a busy card, the month's busy card and
  a time chart's loading state carry the oxide ramp washed 32% into their
  plate, drifting start → end, `kp-sig-titanium-bath`, one period
  (`--kp-sig-ti-loop`, 2200 ms). Standing still the wash stays, still. The
  spinner is unchanged.
- **Changed: titanium's leave** runs 400 ms on the theme curve (was 650 ms
  ease-in) and its heat band runs start → end, as the update's; the arrival,
  its reverse, follows.
- **Changed: titanium's size arrival** (`[data-kp-arriving]`) is fed in from
  inline-start (was from inline-end), and it and the toast mirror under
  `dir="rtl"`.
- **Changed: titanium's one chamfer diagonal**, top-left and bottom-right, on
  the switch thumb, the wizard step and the tooltip (were top-right and
  bottom-left, the tooltip top-right only). The skeleton line and the empty
  state, which named a custom property the dialog's registered
  `--kp-sig-ti-cut` had made invalid and so were never cut, now carry it.
- **Changed: titanium's spinner is the facing cut** [Kenny on
  research/titanium-spinner, 2026-10-07 01:33]. The drill (a 1.6 × 0.6 bar
  whose flutes travelled one pitch per 480 ms) is replaced by the end face of
  a bar turning on the lathe: turning grain and a centre point, a bright tool
  tip running round the face and leaving the oxide film in its track, gold
  to cyan. Square at `--kp-spinner-size` (so it fits the busy panel, the
  status line, a calendar day and a busy button), one turn per 1800 ms,
  linear, clockwise and mirrored under `dir="rtl"`
  (`kp-sig-titanium-ti-facing`); under reduced motion it stands still, the
  tip with its tail. Same contract: one span, `--kp-spinner-size`,
  `role`/`aria-*` on the span.

- **Removed: three themes, `lapis`, `shade-light` and `shade-dark`**
  [breaking, next major release; Kenny, 2026-10-06 23:49: "Ik heb ook
  beslist van drie themas te laten vallen, Lapis, Shade (light) en Shade
  (dark) mogen vanaf nu verwijderd worden."]. Kenny decided to drop them
  from the set, which leaves nineteen themes. Gone with them: their token
  sources (`themes/<name>/`), their registers (`css/<name>-register.css`
  and the `./css/<name>-register` and `/min` exports), their blocks in
  `css/themes.css` and entries in `js/theme-registry.js` (and so in the
  `ThemeName` type), the lapis texture in `css/_rules.css`, their 15
  `kp-sig-<theme>-meter-*` TIMINGS rows, their hooks, the four font
  families only they used (Source Sans 3 shipped as `KP Shade Sans`, Source
  Serif 4, Vazirmatn, Markazi Text), their showcase, compare and concept
  pages, and their theme-specific tests. A page that stores one of the
  three names falls back to the default theme. See MIGRATION.md.
- **The meter draws itself each theme's way in all 22 registers** [feature,
  9.3.0; research/character-meter round 4, Kenny's picks of 2026-10-05]:
  cyberpunk 2/3/2/3/3, high-contrast 2/3/1/1/3, shade-light 1/3/1/1/2,
  shade-dark 1/3/1/1/2, retro 1/2/1/2/2 and grotesk 1/2/3/3/2 (shape, while
  loading, how the share arrives, when the tone changes, the mark past the
  end) carry their meter in `kp.signature` on the package's own `.kp-meter`
  markup and states, and dark moves to 1/2/3/3/3 (the oxide film runs while
  loading, the share pressed in): 32 keyframes `kp-sig-<theme>-meter-*` with
  their TIMINGS rows. Measured in Firefox against the demo's composed
  combination: identical pixels in drawn, loading, warning, destructive, a
  mark past the end and a share past the end, in all seven, at full and
  reduced motion.
- **The meter draws itself each theme's way in sixteen registers** [feature,
  9.3.0; research/character-meter round 3, Kenny's picks of 2026-10-05]:
  formal, light, dark, synthwave, pastel, terminal, forest, sepia,
  blueprint, solstice, brutalism, deco, phantom, lapis, nostromo and
  titanium each carry their picked shape, loading picture, arrival of the
  share, reaction to a new tone and mark past the end in the
  `kp.signature` layer of their register, on the package's own `.kp-meter` (and
  `.kp-kpi__meter`) markup and states, with 77 keyframes
  `kp-sig-<theme>-meter-*` and their TIMINGS rows. Measured in Firefox
  against the demo's composed combination: identical pixels in drawn,
  loading, warning, destructive, a mark past the end and a share past the
  end, in all sixteen. Cyberpunk, high-contrast, shade-light, shade-dark,
  retro and grotesk keep the plain meter until round 4.
- **The demo review dialog no longer sinks on every approval** [fix-102,
  2026-10-05]: opened from the hub, research/_review/review.js opened its
  dialog before the catalogue shell moved the body's children into its
  column, which took the dialog out of the top layer; it stayed open as a
  plain box after the answer and moved down as the answer grew (840 to
  1096 px over ten approvals on character-graph). The dialog now opens once
  the page's scripts have run, modal, at 36 px in every theme; pinned by
  tests/review-kit-dialog.spec.mjs.
- **The plain key-figure strip keeps one height, one-line labels and a
  frame that reads** [fix-101, 2026-10-05]: in a strip with columns
  (`data-kp-kpis-columns`) the label, the figure and two lines of words
  keep their line boxes in every state, so the strip no longer moves
  (79.4 to 139.2 px in one strip before, 121.2 px tiles now in all 22
  themes); every label is one line, never cut, stepping down with the
  tile, and attachKpiStrips() takes fewer columns while one does not fit,
  in a phone pane too; the tile is framed in `--border-strong`, at 3:1 or
  more on the page (was 1.21 to 2.72:1 in 20 themes), through the new knob
  `--kp-kpi-border` that dark and titanium mix a share of ink into. The
  destructive tile's frame mixes into `--border-strong`; a trend tile's
  hover draws `--ring`.
- **A page's first render no longer arrives as news** [fix-100]: since
  every opposite motion became a mirror, the chrome a late module drew into
  an eased box on load (a data table's pager, group and edit buttons, a
  combobox's list) arrived as the theme's leave played backwards, 346
  elements on the catalogue's index in a queue of about ten seconds, and
  the table's pager bar stood 186 px tall instead of 52 until a click. A
  box now takes what it is given in its first two frames, and under a root
  wearing `data-kp-settling`, at once; js/auto.js holds the root of every
  `attachAll()` so until its modules have attached and two frames are
  painted (`SETTLING_ATTRIBUTE`, `settleAfter()` in js/as-of.js). Only what
  is added after that arrives: an opened group, a new toast. Measured in
  Firefox on catalogue index, data and table in formal, cyberpunk and
  terminal: 0 arrivals in the first 2 s (was 331 to 346), the bar 52/53 px
  from the first frame, no console errors.
- **The progress bar in three sizes** [9.3.0, feature; Kenny, 2026-10-05:
  "zodat dit de kleine is, een midden en een grotere optie"]: the bar as it
  was is the small one, and `.kp-progressbar--md` and `.kp-progressbar--lg`
  (React: `size="md" | "lg"`) make it 1.5 and 2 times as tall. One number,
  `--kp-progressbar-scale`, that the base track and all 22 registers'
  signature bars multiply their drawing by (heights, glyphs, cells,
  pitches, travel distances; line weights stay), so each theme's bar grows
  as one drawing; the label and reading in the same row step to 16 and
  18px (`--kp-progressbar-text`). The small bar is pixel-identical to 9.2.1.
- **A data table's group folds as the mirror of its open** [scope-143;
  Kenny's form v21, 2026-10-05]: while the rows play their arrival
  backwards the table box eases shut on the open's curve turned around, in
  the same time, ending where the open began (it snapped shut in one frame
  once they had gone). The rows carry `data-kp-folding="out"`, which
  `easeSize` leaves out of the box's settled height; the glide ends with the
  rows' own motion. A box no longer holds its glide for an element whose
  leave or arrival folds sideways or is not drawn: the catalogue's tables
  snapped open and shut for the ten seconds the page's first arrivals took.
  Measured in Firefox over 22 themes (catalogue Tables, group "home"): the
  fold's glide is the open's frame for frame turned around within 0.017 px,
  in the open's time (192 to 480 ms), held back only as long as the rows'
  own playback outlasts it (0 to 312 ms); the fold ends 179 to 545 ms after
  the click (was 412 to 1029 ms, the box waiting for the rows); in the first
  seconds after load the box no longer jumps 120 px in one frame either way;
  under reduced motion both are instant; no console errors.
- **The trend tile: a figure and a change on half a pair, a label that
  moved the tile** [fix-99, 2026-10-05]: a key figure's change with a tone
  carries its status pair (`--success` under `--success-foreground`,
  `--destructive` under `--destructive-foreground`), 4.51:1 or more in all
  22 themes (was 1.00:1 in high-contrast, shade-light and grotesk, 4.11:1
  in solstice); the figure in a tone sits on that tone's pair, one rule for
  both tones, the plate hugging the figure with its unit and note in the
  plate's ink: warning 4.55:1 or more (was 1.00:1 in high-contrast, 1.04:1
  in shade-light), destructive 4.79:1 or more (was 4.11:1 in solstice to
  4.47:1 in synthwave, six themes under 4.5:1); and the trend tile's label
  is one line, never wrapped and never cut: it steps down with the tile's
  width (`--kp-text-xs` to seven eighths of it, `5cqi`), and where it still
  does not fit, the strip (`attachKpiStrips()`) takes its next allowed
  column count, so the tile grows to its label and the row stays aligned
  (the catalogue's trend strip: two columns of 469 px in 16 themes, four of
  228.5 px in six; the phone pane one column of 360 px; tiles 187.2 px
  tall, were 205.2 to 242.7 px).
- **The month heatmap: a ring that hid, dimmed figures, a wrapping title**
  [fix-98, 2026-10-05]: today's ring is drawn in the day's own ink
  (`currentColor`), 4.51:1 or more on every tone in all 22 themes (was
  1.29:1 in shade-light, 1.45:1 in shade-dark, 2.50:1 in nostromo);
  `.kp-calendar` sets `--kp-busy-opacity: 1`, so a loading day's figure
  reads 4.52:1 or more (was 2.65:1 to 4.81:1 under the 0.7 dim); formal's
  amber day takes a twentieth of `--foreground` in its ink, 4.78:1 (was
  4.51:1, 4.44:1 under the paper grain); the nav's title and buttons stay
  on one line, the title stepping down under a 334 px nav and taking a
  row of its own over the buttons below the new knob
  `--kp-calendar-nav-fit` (20.5rem; twelve registers set their own), so
  the calendar keeps one height in every month (the title took up to six
  lines in nostromo's phone pane); and a stretched calendar keeps its
  rows at the top (`align-content: start`; the weekday row grew from 18
  to 48 px).
- **The time chart's tooltip: a change that wrapped, a dot that hid**
  [fix-97, 2026-10-05]: the change column is no longer a fixed 4.5rem but
  at least `--kp-chart-delta-width` (default 5.5rem) and as wide as its
  change, on one line (`▼ 74.5 KiB/s` wrapped in 16 of 22 themes, and in
  terminal the pinned pressure tooltip's changes in bar too); an event's dot in the
  tooltip carries a 1.5px ring in the popover's ink, so the warning dot
  reads at 5.00:1 or more on the plate in all 22 themes (was 1.07:1 in
  shade-light, 1.00:1 in high-contrast, 1.04:1 in nostromo, 1.38:1 in
  shade-dark).
- **Fewer clicks per verdict on the review site** [Kenny, 2026-10-05]: every
  block with try-buttons gets **▶ Play** beside Approve (and in the review
  dialog), pressing them in turn with a caption and a pause set by the
  theme's motion (`catalogue/play.js`, `data-cat-play` to order or limit);
  the look is also a checklist with ticks per block and theme and buttons
  for the controls it names (`catalogue/checklist.js`); keys A, R, N, P, T
  and K, with Alt in the dialog's note (`catalogue/shortcuts.js`); the theme
  menu counts what is left per theme; the dialog can open by itself on the
  last block; and `catalogue/changed.html` gathers only the open pairs of
  the theme on screen (`catalogue/open-pairs.js`).
- **Kenny's phantom and shade-light review** [scope-143, 2026-10-05]: the
  catalogue's try-buttons work on the review page too (a block is wired by
  what it carries, when it is composed, not by its id at import: the key
  figures' columns, the trend tiles' data, the meter, the tile set, the
  remembered board, the data table's reload); the rich menu keeps clear of
  sticky side bars as well (`coveredEdges` on all four edges) and its
  loading plate is opaque; the review dialog switches themes in 0.25 s
  instead of 7 s (hashes are kept across a theme change); the navigation
  dropdown grows with its longest row (`width: max-content`, nav-dropdown-M1
  closed); a theme switch restamps only the effect hosts on screen.

- **A dropdown is as wide as its longest link** [nav-dropdown-M1; Kenny,
  form v18, 2026-10-05]: `.kp-nav__menu` takes `width: max-content` above its
  12rem floor, so a long link no longer breaks onto two lines (a 38-character
  link took two or three in all 22 themes). The wider panel is still slid
  inside the window by `--kp-nav-menu-shift`; the mega menu and the phone
  drawer keep `width: auto` and are unchanged.
- **Information that updates in place** [Kenny's picks on
  research/update-motion, 2026-10-05]: `update(el, next)` in the new
  `js/update.js` (`@kp-soft/themes/js/update`, also on the root) writes a new
  value into a text element, a `.kp-state-word` or a spark at once and plays
  the register's update once at the theme's time (`--kp-update-duration`,
  max(resize, close) × 1.25 from `themeMotion()`), marked
  `[data-kp-updating]`. Formal lands a checked stamp (`stamp`), cyberpunk
  glitches and settles (`glitch`), titanium runs a heat tint across it
  (`anodise`), each declared in `--kp-update` with its keyframes in
  kp.signature; the other nineteen registers declare none, so there the value
  simply changes. Reduced motion: the value changes and nothing plays. The
  catalogue's Motion page has the block "Information that updates in place".
- **Every opposite motion is a mirror** [scope-143; Kenny, 2026-10-05]: in
  all 22 themes a dialog opens as its close played backwards and a card
  arrives as its leave played backwards (`--kp-open: reverse-close` in
  every register; several arrive one by one top first, the mirror of the
  leave's bottom-first stagger); a shrink runs on the grow's curve turned
  around (`sizeEase`, for easeSize, attachFold and tile sets); the sidenav
  rail and its submenus collapse on their expand curve turned around; a
  tooltip and the tour card hide by playing their entrance backwards; a
  toast leaves through `leave()` (`TOAST_HIDE_EVENT` fires once it is
  gone); a data table's group rows fold by playing their arrival backwards,
  and the table no longer replays arrivals on a sort or a rebuilt pager.
  The catalogue's size-selector block rebuilds its cards from the sample
  data (a grown card eases back) and lets a removed card's box go.
  Research demo `research/update-motion`: information updating in place,
  three ideas per theme for formal, cyberpunk and titanium.

- **Opening as the reverse of close** [scope-143]: in formal, cyberpunk and
  titanium a dialog opens, and a card arrives, as its theme's close and
  leave played backwards (`--kp-open: reverse-close` in the register,
  played by js/motion.js from the theme's own keyframes and timings; the
  other themes keep their entrances). Approved from `research/open-reverse`
  (2026-10-05). A research demo page no longer carries the catalogue's
  Copy prompt beside its own Copy answer.

- **Kenny's deco review, round one (2026-10-05)** [scope-143]: the rich menu
  always opens fully on screen (`menuPlacement()`: the other edge, above the
  button, or clamped, clear of sticky bars; 144 of 144 cases measured); the
  meter's share past the end is offered in four signs on the catalogue
  (`.kp-meter--over-hatch`, `--over-spill`, `--over-break` beside the ▸);
  the month heatmap's loading in three looks (`.kp-calendar--busy-days`,
  `--busy-whole` beside the pulse) and its live update named; the action
  list's stacked buttons under 30rem are centred; `setAttention` no longer
  moves the items under a leaving one; `easeSize` no longer restarts a
  glide every frame when the box is a flex column (`data-kp-gliding`),
  keeps fractional heights, and watches the box itself; `attachFold` glides
  an `open` set from outside (`data-kp-folding`); `.kp-tiles` ease every
  tile together (`data-kp-tiles-easing`, `sizeMotion()`); `leave()` closes
  the flex gap it leaves. Research demo `research/open-reverse`: opening as
  the reverse of close, in formal, cyberpunk and titanium.

- **Menu button with a rich menu** [scope-143, port spec B]:
  `.kp-menu-button` with a `.kp-menu.kp-menu--rich`, on the package's own
  `.kp-menu` and `.kp-menu__item`, wired by the new `js/menu-button.js`
  (`attachMenuButtons`, `setMenu`, `openMenu`, `closeMenu`, the pure
  `menuSignature` and `menuKeyTarget`; events `kp-menu-open`, `kp-menu-close`
  and the cancelable `kp-menu-select`; `decorate`). Every other action of a
  page, grouped under small muted capitals (`.kp-menu__group`,
  `.kp-menu__heading`, which names its `role="group"`), each a label over a
  one-line hint; an action that cannot be used now keeps its hint, says why
  under it in italics (`.kp-menu__reason`) and stays focusable
  (`aria-disabled`). The keys of an APG menu button (↓ ↑ wrapping, Home,
  End, a letter, Esc that the page does not hear, Tab); a fill that shows
  the same is skipped and one that arrives while the menu is open waits for
  it to close; loading, empty (`data-kp-menu-empty="hide|disable"`) and a
  menu that scrolls past its height. In a page header of 40rem or less the
  open menu spans the header's buttons. Words in the dictionary
  (`menuLoading`, `menuEmpty`). Knobs: `--kp-menu-rich-min`,
  `--kp-menu-rich-max`, `--kp-menu-max-height`. Catalogue:
  overlays.html#menu-button.

- **Help drawer and a short tour** [scope-143, port spec I.3]: `.kp-drawer`
  (a head, a body that scrolls, a foot that stays; a `dialog.kp-drawer` at
  the end edge at full height), `.kp-help` cards whose `.kp-help__list`
  puts the words beside their meanings (over them in a card of 22rem or
  less), and the new `js/tour.js`: `startTour(steps, { start, remember,
returnFocus, onEnd, decorate, strings })` shows one non-modal card
  (`.kp-tour`) per step, 12 px beside its part and 16 px inside the window,
  following it on scroll, with an exact count (a step whose part is not on
  the page is left out first); the part is ringed and the rest of the page
  dimmed (`data-kp-tour-target`). Back, Skip, Next/Done, ← →, Esc; the focus
  returns where it was. A tour that ended is remembered through
  `js/remember.js` (component `tour`; `tourMemoryKey`, `tourRemembered`,
  `forgetTour`), and `shouldStartTour()` starts it on `?tour` or a person's
  first visit only. Words in the dictionary (`tour…`). Knobs:
  `--kp-drawer-width`, `--kp-help-term`, `--kp-tour-width`. Catalogue:
  overlays.html#drawer and #help-tour.

- **A meter with a mark** [scope-143]: `.kp-meter` is a used-of-total bar
  for anywhere (a table cell, a line of words with `.kp-meter--inline`), and
  `.kp-kpi__meter` is now the same meter. `--kp-mark` puts a tick across the
  bar that sticks out above and below without making it taller; a share or
  a mark past the end (`data-kp-over`) shows a small ▸ at the end;
  `data-kp-tone="warning|destructive"` colours the fill and
  `data-kp-loading` pulses the track. `setMeter(el, { value, mark, tone,
label, markLabel, loading })` in `js/kpi.js` writes it all with its ARIA,
  the real share past 100 % in `aria-valuetext`; also `meterText()` and
  `meterParts()`, and the dictionary words `meterUsed`, `meterNotMeasured`
  and `meterMeasuring`. Knobs `--kp-meter-height`, `--kp-meter-fill`,
  `--kp-meter-mark-colour`, `--kp-meter-mark-overhang`, `--kp-meter-halo`,
  `--kp-meter-inline-size`. A `.kp-kpi__meter` no longer clips what sticks
  out of it. Catalogue: data.html#meter.
- **Key figures never leave one tile alone** [scope-143]:
  `.kp-kpis[data-kp-kpis-columns="all 3 2 1"]` takes the first allowed column
  count at which every tile is at least `--kp-kpi-min` wide, by the strip's
  own width, and steps down when that would leave one tile alone on the last
  row; when no count avoids it, the last tile spans the row
  (`data-kp-kpis-span-last`). `attachKpiStrips()`, `fitKpiStrip()` and the
  pure `kpiColumns()` in `js/kpi.js`; `js/auto.js` loads it for such a strip.
  Catalogue: data.html#kpi-columns.
- **A key figure with its 24-hour trend** [scope-143]: `.kp-kpi--trend`
  stretches its `.kp-kpi__link` over the tile (↗ alone in a narrow tile) and
  takes "avg 15 min" in its label (`.kp-kpi__label-note`); the label wraps
  between words and is never cut (the note moves to the next line as one
  unit), every state is as tall as filled (value line, two or three lines of
  words, knob `--kp-kpi-trend-lines`, and the axis row kept), and the line
  takes the figure's `--kp-chart-series`. The time chart's
  spark variant gains two options: `data-kp-spark-head="none"` reads a point
  in a chip over the line, on the trend's own crosshair, and follows the
  tile's link on a click that was not a drag; `data-kp-spark-axis="relative"`
  puts `14:40 yesterday` … `now` under the line. New in `js/chart.js`:
  `setTrendData()`, `trendAxis()`, `attachTrendCharts()`, `TREND_CHART`, the
  option `now` of `attachCharts()`, and the dictionary words `chartToday`,
  `chartYesterday` and `chartTrendKeys`. Catalogue: data.html#kpi-trend.

- **Month heatmap** [scope-143, port spec I.1]: `.kp-calendar` in a
  `.kp-calendar-layout` (calendar | the page's own detail, one column under
  45rem), built by the new `js/calendar.js` (`attachCalendars`,
  `setCalendarDays`, `setCalendarState`, `setCalendarLegend`,
  `calendarSelect`, `calendarMonth`, the pure `monthCells`, `shiftDay`,
  `shiftMonth`, `dayKey`; events `kp-calendar-pick` and `kp-calendar-month`;
  `decorate`). A month of days, each a plate in the colour of its state
  (`ok`, `warn`, `bad`, `muted`, `future`/`before` dashed, `none`, `loading`
  pulsing only without reduced motion), its count under the number; always
  six week rows of 42 cells built once and updated in place, the neighbouring
  months' days as quiet numbers, a night with nothing done told by its red
  plate and its words alone. One tab stop with the keys of a date grid
  (arrows, Home/End, Page Up/Down, Shift for a year); today is the day in
  Europe/Brussels whatever the reader's zone, and every day reads
  `dd/mm/yyyy: …` (rule 52). Words in the dictionary (`calendar…`). Knobs:
  `--kp-calendar-aside`, `-gap`, `-cell-height`, `-cell-font`, `-title-size`.
  Catalogue: data.html#calendar.

- **Network graph** [scope-143]: `.kp-graph` and `js/graph.js`, a picture
  of a network with one centre: the hub in the middle, the other nodes on a
  ring from the top, clockwise, A to Z and then the nodes outside the
  network, the links drawn by kind (a colour and a dash each) and listed
  above the picture with Show all. Each node takes its own hue at the
  theme's chart lightness (`--kp-graph-hue` over `--chart-1`, no literal
  colour). Hover or focus a node to see only its links (classes only, no
  node rebuilt); click or Enter keeps it picked, several at once; Esc or
  Show all clears; the picture is one tab stop and the arrows walk the
  ring. Two links between one pair bend apart (0, ±26). A label points
  away from the hub and is shortened with an ellipsis where it would touch
  another or leave the picture, fitted again when a web font arrives; the
  full name stays in the title and the accessible name. Loading, empty and
  error keep the picture's height. `attachGraphs(root, { decorate, strings })`,
  `setGraphData()` (or a `script[data-kp-graph-data]` JSON child),
  `setGraphState()`, `graphSelect()`, `graphHideKind()`, the pure
  `graphLayout()`, `graphBends()`, `hubOf()`, `ringOf()`,
  `graphLabelText()` and `fitGraphLabels()`, the event `kp-graph-change`,
  the knobs `--kp-graph-h`, `--kp-graph-label-size`, `--kp-graph-dim`, and
  the dictionary words `graph…`. Approved in formal from
  `research/dashboard-ports-2` (each node its own colour; the kinds above
  the picture); catalogue: chart.html#graph.

- **Data table: one open row, groups that fold, Enter on a row, and
  `decorate`** [scope-143, J2]: `data-kp-expand-single` (or
  `expandSingle`) keeps one row open, and the opening's
  `kp-datatable-expand` names the row it closed in `closed`. A heading row
  `tr data-kp-row-group="<key>"` folds the rows marked
  `data-kp-group-of="<key>"` with a real button (`aria-expanded`,
  `aria-controls`, `strings.tableGroupRows`); a sort orders rows within
  their group, the status line keeps the exact number while a group is
  folded, `[data-kp-group-count]` counts each group's matched rows, the fold
  survives `refresh()` by key, and the handle has `fold()`,
  `view().folded` and the event `kp-datatable-group`. Enter or Space on a
  row or grid cell that holds the focus opens it as a click does, and
  `refresh()` keeps the focus on the toggle that had it, by key. The attach
  option `decorate(part, info)` is called with every row toggle
  (`row-toggle`) and group toggle (`row-group-toggle`) it builds. All off
  until asked for; catalogue: table.html#datatable-expand-groups.
- **Time chart: dates and times follow rule 52** [scope-143]: every time the
  chart prints is `dd/mm/yyyy HH:mm` (or a part of it) on a 24-hour clock in
  Europe/Brussels, whatever the reader's zone and the page's language. The
  tooltip's head and an event marker's title read `04/10/2026 14:05`, an
  event line `14:05`, the time axis `14:00` below a day's stride and
  `04/10/2026` from a day on (the 7 d range), and the zoom chip names both
  dates once a zoom spans two days
  (`Zoomed: 03/10/2026 22:00 – 04/10/2026 02:00`; it read `22:00–02:00`).
  Until now the chart printed through
  `Intl` in the browser's zone ("Sun 4", "Sun 4 Oct, 14:05", `02:05 PM`
  under `en-US`). The time axis lands on round wall-clock times in that
  zone, worked out tick by tick: six-hour ticks on 00:00, 06:00, 12:00 and
  18:00 across a change of the clock, day ticks at Brussels midnight (one
  `getTimezoneOffset()` of the browser at the window's start did it before).
  New: `attachCharts(root, { timeZone, time })` with
  `time(ms, style, ctx)` and the styles `clock`, `tick`, `full` and
  `range`; the exports `numericTime()`, `timeTicks()` and
  `CHART_TIME_ZONE`; the dictionary word `chartZoomedSpan` (a reworded
  `chartZoomed` keeps working). `locale` now steers the numbers only.
- **Time chart: units, groups across calls, control from the page, every
  state** [scope-143, port-spec-M1]: `unitKind` (`bytes`, `bytes/s` or
  `rate`, `percent`, `celsius`, `count`, `flag`) prints values the
  dashboard's way with the unit on the axis (`0 B`, `1.0 GiB`, `2.0 GiB`;
  `3.2 MiB/s`), a percent axis of 10, 25, 50 or 100 that goes above 100 when
  a value does (nothing cut off), and counts exact outside the axis
  (`12,345`; `12.3k` on the axis only); `format(v, where, chart)` and the
  export `formatChartValue()`, and `niceMax(v, kind)`. A group is its
  element's across `attachCharts()` calls (a chart attached later shares the
  crosshair and the zoom), charts outside any group share the page's, and a
  zoom chip may sit anywhere (`data-kp-chart-zoom-for`); `kp-chart-zoom`
  reaches the document when there is no group element. New exports
  `chartSelect(el, index, on?)`, `chartZoom(el, zoom)`, `detachChart(el)`,
  and `nextSelection()` in js/chart.js; the option `decorate(part, info)` marks every legend
  source, Show all, ✕, plot, range button and zoom Reset, each time it is
  built; `key` in the data (`data-kp-key`). After a live update only the
  chart under the pointer, or a pinned one, shows its tooltip; a pin the
  window moves past stays docked with `(pinned, outside the window)` until
  ✕; leaving a chart no longer clears a crosshair another chart has taken.
  States at the plot's final height (`--kp-chart-height`): loading
  (`data-kp-chart-loading`, `data-kp-chart-sources`), no readings
  (`chartEmpty`), `{ error }`, one reading (a whole dot, `onePointNote`,
  `chartOnePoint`); new words `chartEmpty`, `chartOnePoint`, `chartLoading`,
  `chartPinnedOutside`. Unit tests in gates/chart-api.test.mjs; measured in
  firefox at 1280 and 390 px (A7.6 to A7.15 and the states table, no console
  errors). Catalogue: chart.html#time-chart-units, #time-chart-states,
  #time-chart-chip-elsewhere, #time-chart-no-group.
- **Every alert's text reads at 4.6:1 or more on its plate** [scope-143,
  alert-contrast-M1]: measured in firefox over all 22 themes (440 distinct
  ink-on-plate pairs: the label and body of the five catalogue alerts and
  the long warning, the title, text and icon of the attention band's three
  items), 22 text pairs read under 4.6, the lowest 4.49. Raised: formal
  warning 4.51 → 4.78, light info 4.51 → 4.79, pastel success 4.57 → 4.79
  and warning 4.58 → 4.75, forest success 4.51 → 4.75 and info
  4.59 → 4.80 (each ink drawn 5 % towards the page's `--foreground` in the
  register), shade-light warning 4.55 → 4.67 (its light ink drawn 60 %
  towards `--card`), and shade-dark's info item on the attention band
  4.49 → 4.71. The band's plate takes the new knob `--kp-attention-tint`
  (default 8 %, unchanged elsewhere), which shade-dark sets to 6 % on its
  info item. The lowest text pair now reads 4.63; no token changed, and the
  band's items keep the page's own text in every theme.
- **The attention band follows a live page** [scope-143, attention-live-M1]:
  `attachAttention(root)` also orders a `.kp-attention` added after it ran
  and lets go of one that leaves (its watcher disconnected). New
  `setAttention(band, items)` sets a band's problems by key
  (`data-kp-key`): an unchanged item stays the same element and only what
  changed is rewritten, so a critical problem is put into the page (and
  announced) once rather than on every poll and a focused fix keeps its
  focus; a new key builds the 9.2.0 markup, a missing one leaves through
  `leave()`. New dictionary words `attentionCritical`, `attentionWarning`,
  `attentionInfo`. Measured in firefox: a band inserted after attach reads
  critical before info, a critical item kept over four refreshes is
  inserted once, focus on its fix survives a refresh. Catalogue:
  feedback.html#attention-live.
- **Only what is new arrives** [scope-143, arrive-none-M1]:
  `data-kp-arrive="new"` on a box (or `attachMotion(root, { arrive: 'new' })`)
  keeps a row redrawn under the key of a row that just left still
  (`data-kp-key`, `data-kp-row-key`, `id`, plus `arriveKeys`), and only a
  row with a new key arrives; a sort, an unkeyed redraw of as many rows and
  data replacing a skeleton do not arrive either. The test is the homelab
  dashboard's, exported as `repaintedIn(records, { keys })` and unit-tested
  with its cases (gates/motion-arrive.test.mjs). Measured in firefox: five
  keyed rows redrawn, 0 arrivals (3 in the default mode); a sixth key, 1;
  three unkeyed rows redrawn as four, 1; the same five reversed, 0.
  Catalogue: motion.html#arrive-new.
- **Size motion: a selector option, and boxes that leave are let go**
  [scope-143, size-motion-docs-M1]: `attachMotion(root, { size })` eases a
  consumer's own boxes by selector, also those added later; a box, dialog or
  disclosure that leaves the page has its observers disconnected a
  microtask later (a move stays), and `motionWatchCount()` reads how many
  are watched. Measured: 1000 boxes added and removed return the count to
  where it was; a 158-cell box redrawn costs about 5 ms per change.
  Catalogue: motion.html#size-selector.
- **Tiles of one height across a board** [scope-143, tiles-board-M1]:
  `data-kp-tiles-set="<name>"` makes the `.kp-tiles` grids under it (or
  carrying it, across branches by name) share the set's tallest visible
  tile as the floor of their rows, `--kp-tile-row-min`, measured and
  written by `attachTileSets(root)` in the new `js/tiles.js` (in
  `js/auto.js`, `index.js` and the exports map). Folded and hidden tiles do
  not count; it writes only when the height changed. Measured in firefox
  with the spec's 72/96 px tiles: all 96, back to 72 within a frame when the
  tall one goes, 72 with its fold closed, 0 style writes on an identical
  refresh. Catalogue: data.html#tiles-set.
- **A freshness line that ticks** [scope-143, freshness-M1]: the new
  `js/freshness.js` rewrites every `[data-kp-ago]` once a second with one
  timer per page ("updated 12 s ago", "2 min 5 s", "1 day 1 h"; the words
  in the dictionary: `agoText`, `agoNever`, `agoSeconds`, `agoMinutes`,
  `agoHours`, `agoDays`, `agoVerb`, `agoStale`, `agoFresh`,
  `agoInLiveRegion`), from `datetime` or `data-kp-ago`, with the verb in
  `data-kp-ago-verb`. The title is the moment as rule 52 writes it
  (`04/10/2026 14:00`, Europe/Brussels); `data-kp-stale-after` sets
  `data-kp-stale`, a warning plate drawn without a size change; the line
  reserves the width of its unit's longest text, is `aria-live="off"`,
  warns once inside a live region, can announce only stale and fresh
  (`data-kp-ago-announce="state"`), and pauses while the tab is hidden.
  Exports `attachAgo`, `setAgo`, `agoText`, `humanDuration`, `agoMoment`,
  `momentOf`; in `js/auto.js`, `index.js` and the exports map; unit tests in
  gates/freshness.test.mjs. Measured in firefox with a fake clock: one
  width (180 px) over 70 ticks from 0 s, stale at 181 s with the box
  unchanged, correct on the frame the tab is shown after 5 min hidden.
  Catalogue: feedback.html#freshness.
- **Remembered disclosures on a page that rebuilds them** [scope-143,
  size-motion-docs-M1]: `attachRemembered(root)` wires a
  `<details data-kp-remember>` added later and paints its memory before the
  first frame (measured: rebuilt closed, `open` false on the first frame),
  and lets go of one that leaves; `data-kp-remember-hold` on it or an
  ancestor stops painting and writing until it goes, then paints the stored
  state back; `forgetRememberedExcept(component, prefix, names)` prunes the
  names no longer used. `.kp-accordion__item--bare` is the accordion's
  glide without its chrome. Catalogue: structure.html#remember-later.
- **Row buttons on a narrow screen** [scope-143, action-columns-narrow-M1]:
  under 30rem a `.kp-action-list` stacks its buttons under the row's text,
  one per line on one left edge, each label on a single line, never wrapped
  or cut (Kenny's UI rule; the equal columns cut "Review and update all 4…"
  by 20 px). The narrow table's
  stacking holds for any `<table>` holding `.kp-row-actions`: in the
  `kp-table` container under 30rem, and outside it while the window is under
  48rem. A table's measured widths count a register's button margin (sepia's
  label sat 5 px into its padding). Measured in firefox over all 22 themes:
  no label cut or wrapped, stacked under 30rem and in the plain table. Catalogue: table.html#action-columns-narrow.

## 9.2.1 — 2026-10-04

- **An alert's close button takes the alert's plate and ink** [fix-95]: in
  every register `.kp-alert .kp-icon-button` draws no plate or border of its
  own and inherits the alert's colour, as the toast's close button does
  since 9.2.0. Measured before the fix: eleven close buttons in seven
  themes under 4.5:1 (forest and brutalism 1.03). The severity-contrast test
  now reads the alerts as well as the toasts.

## 9.2.0 — 2026-10-04

- **Buttons in shared columns** [scope-143]: `.kp-action-list` (a list whose
  rows are one grid) and `.kp-row-actions` line a list's row buttons up in
  columns, by position from the end with no script, or by role
  (`data-kp-action`) through `attachActionColumns()` in the new
  `js/actions.js`, which also measures a table's. On a phone the buttons go
  under the text, side by side in equal columns over the full width.
- **Tiles of one height** [scope-143]: `.kp-tiles` lays `.kp-card`s out with
  every row as tall as the tallest tile and each footer on the bottom edge.
- **Key figures** [scope-143]: `.kp-kpis` and `.kp-kpi` (label, value with a
  unit and a note, trend, delta, sparkline, meter, warning and destructive
  tones). The new `js/kpi.js` draws `svg[data-kp-spark]` as a line over a soft
  area and makes a `button.kp-kpi--toggle` a filter: pressed, a primary border
  over a faint primary background; it fires `kp-kpi-toggle`.
- **Page header** [scope-143]: `.kp-page-header`, the title and description
  beside the page's actions with a "More ▾" overflow menu; on a phone the
  primary comes first at the full width.
- **Attention band** [scope-143]: `.kp-attention`, one soft-tinted alert per
  problem with a coloured edge, no room at all when empty, kept worst first
  in the DOM by `attachAttention()` in the new `js/attention.js`.
- **A state word that keeps its width** [scope-143]: `.kp-state-word` with
  `data-kp-words`, and `setStateWord(el, word)` in `js/components.js`.
- **A data table loading on a phone** [scope-143]: in a table under 30rem the
  busy overlay's panel lies flat (the spinner beside the words, three lines at
  most) and the layer is clipped to the table.
- **Time chart** [scope-143]: `.kp-chart`, `.kp-chart-group`,
  `.kp-chart-ranges` and `.kp-chart-zoom`, drawn by `attachCharts()` in the
  new `js/chart.js` from the page's data (`setChartData()` or a JSON child):
  a legend that singles a source out and keeps sources on, one crosshair per
  group, a tooltip beside it, drag to zoom, event markers, keys, range
  buttons and a spark variant. It fires `kp-chart-select`, `kp-chart-zoom`
  and `kp-chart-range`; its words are `chart…` in `js/strings.js`. The
  catalogue has a new page for it, `catalogue/chart.html`.
- **Back to top on every example page** [feat-page-1]: the generated example
  pages carry `.kp-to-top`, and the user guide says how to add it.
- **A narrow card's actions wrap** instead of breaking their own words
  (`.kp-card__header` wraps), and **the combobox clear button is centred on
  the input**, not on the whole box with its label and status line.
- **The catalogue shows every option and effect** with copyable markup: a
  Motion page, and blocks for the data table's live busy counter, failure
  reason and empty texts, undo after an action, inline confirm, count-up
  numbers, remembered navigation, `.kp-shell`, the error toast, date picker
  views and locale, the overflowing dialog, card actions, the theme status
  line, validation timing and reveals on every load.
- **Elements leave the theme's way** [scope-142]: `leave(el)` (js/motion.js)
  marks the element `[data-kp-leaving]` and every register now draws its own
  exit on it, one per theme, picked by Kenny on research/size-motion over
  rounds five to eight (formal folds up like a letter, terminal's block cursor
  deletes the line, retro shrinks in pixel steps, titanium anodises,
  cyberpunk glitches, high-contrast announces REMOVED, ...). The space closes
  during the exit, so the box around it shrinks along; then the element is
  removed (or hidden with `{ hide: true }`). Elements told to leave together
  go one by one, bottom first, the next starting halfway through the one
  before (`--kp-leave-stagger`, `--kp-leave-fold` and `--kp-leave-pause` to
  change it). `data-kp-arrive="none"` on a box keeps a live view's redraws
  from replaying every arrival.
- **leave() and arrivals follow their animation's own clock**: they end when
  their CSS animations (pseudo-elements included) have played out, at any
  playback rate, instead of on a fixed timeout.
- **The demo review kit asks for picks as ticked choices**
  (`data-review-choices`, per theme or once), each option explained, and
  puts them in the answer.

## 9.1.0 — 2026-10-04

- **A dialog leaves the way it came, and boxes ease to a new size**
  [scope-142]. `js/motion.js` (loaded by `js/auto.js`, attached by the React
  `Dialog`) closes every `.kp-dialog` by playing its theme's entrance
  backwards, in two thirds of the entrance's time, and eases dialogs,
  accordion items, tabs, the data table, toasts, the upload and combobox
  lists, the tree, the wizard, fields and any `[data-kp-size-motion]` box to a
  new height, growing and shrinking, in four fifths of it. Knobs:
  `--kp-close-max` (600ms), `--kp-size-max` (480ms), `--kp-motion-scale` (1).
  A closing dialog stays `open` until its motion ends; its `close` event comes
  then. Reduced motion: nothing moves.
- A size change never overshoots, a padded box no longer clicks smaller at
  the end of its glide, terminal grows and shrinks one line at a time, and
  what arrives in a box arrives with the theme's toast entrance
  [scope-142].
- Growing and shrinking have a character per theme [scope-142]: a register
  draws it on `[data-kp-resizing]` (the gliding box) and `[data-kp-arriving]`
  (what arrives), and may set `--kp-size-ease` or `--kp-size-steps: line`.
  Fourteen registers carry one (formal's ink, dark's darkroom, synthwave's
  neon, high-contrast's two clear steps, sepia's page, blueprint's plotter,
  solstice's dawn, shade's shadow, grotesk's cuts, lapis's gilt, nostromo's
  amber lines, titanium's drawer, light's bloom); the others use their toast
  entrance.
- Deco's dialog entrance is remade without a clip: the dialog unfolds from
  its top edge and the sunburst fans open. The circle clip it opened with
  stayed cut at the bottom corners in Firefox.

## 9.0.1 — 2026-10-04

- **A modal dialog opens centred under a CSS reset.** Tailwind's preflight
  sets `margin: 0` on every element, which took the browser's centring away
  from `<dialog>`, and a `.kp-dialog` opened with `showModal()` landed in the
  top-left corner (found in JobTracker, 2026-10-03). `.kp-dialog` now carries
  `margin: auto` and a modal one `inset: 0` itself; keep `tailwindcss`
  imported before the package (README).
- **The theme menu keeps every row on one line.** The React switcher's list
  is as wide as its longest row (`inline-size: max-content`, capped at the
  window), and a row does not wrap: the bold selected row broke onto two
  lines in high-contrast, shade-light and shade-dark (JobTracker,
  2026-10-03).

## 9.0.0 — 2026-10-03

**Breaking** [scope-140].

- **The progress bar is `.kp-progressbar`**, replacing `<progress class="kp-progress">`:
  one element whose track, fill and head every theme draws its own way, one
  line high and as wide from the first frame, the fill clipped to
  `--kp-value` (0 to 1) so only `clip-path` and `transform` move.
  `data-kp-indeterminate` without `aria-valuenow` is busy with no amount;
  under reduced motion nothing in the bar moves and the busy bar stands as
  stripes. Knobs: `--kp-progressbar-height`, `--kp-progressbar-max-width`,
  `--kp-progressbar-duration`, `--kp-progressbar-ease`. The keyframes
  `kp-progress-stripes` and the knobs `--kp-progress-max-width` and
  `--kp-progress-stripe` are gone. `.kp-progress-group`, `.kp-progress__wrap`,
  `.kp-progress__label` and `.kp-progress__value` stay. MIGRATION.md has the
  before and after.
- **A new cascade layer, `kp.signature`**, right after `kp.register`:
  `@layer kp.base, kp.components, kp.register, kp.signature, kp.layout, kp.utilities`.
  A page that declares its own layer order adds it there.

**Added** [scope-140].

- **Every theme draws its own signature** for the progress bar, spinner,
  skeleton, switch, checkbox and radio, toast, dialog (with its entrance and
  backdrop), tooltip, wizard steps, empty state and link hover, as Kenny
  approved them in three review rounds on 2026-10-03, at the end of each
  register file in `kp.signature`. Busy indicators move in a seamless loop;
  every skeleton line starts at the inline-start edge; the dialog titles keep
  the package's metrics (scope-87); nothing a theme draws on a focusable
  control covers its focus ring (DI2).

- **`js/progressbar.js`** (`@kp-soft/themes/js/progressbar`, loaded by
  `js/auto.js`): keeps `--kp-value` in step with `aria-valuenow`,
  `aria-valuemin` and `aria-valuemax`, writes the track, fill and head into a
  bar that carries only the outer element, and exports `setProgress(el,
value)`, `setIndeterminate(el, on)`, `attachProgressbars(root)`,
  `buildProgressbar(el)` and `syncProgressbar(el)`; the package root
  re-exports the two setters as `setProgressbar` and
  `setProgressbarIndeterminate`.

**Fixed** [fix-88].

- **A radio is round in retro and cyberpunk**: both registers drew every
  `.kp-field__check` square, so an option button looked like a checkbox.
- **Cyberpunk's wizard steps get their mono capitals**: the rule targeted
  `.kp-wizard__step`, a class the package never renders.

**Changed.**

- **An expandable data table row opens from anywhere in it** (Kenny, on the
  homelab dashboard's notifications: "ergens in die rij klikken, niet enkel
  op dat icoon"), and shows a pointer; a click on a button, link, field or
  checkbox in the row does only its own thing, and the toggle keeps Enter
  and Space.

## 8.1.0 — 2026-09-30

A minor: pages use the width of a wide screen, a loading table can show it
over its rows, and an indeterminate progress bar is striped again.

**Changed.**

- **`.kp-page` takes 80% of the window**, never narrower than the old 64rem
  and the whole width on a phone (Kenny: "gebruik standaard 80% vanaf nu van
  de breedte"). A wide desktop screen is used instead of left empty; text
  keeps its measure through `.kp-prose`, and `--kp-page-max` still sets any
  other width.

**Fixed.**

- **An indeterminate progress bar shows its stripes in every theme** [fix-86]:
  twenty registers set the track with the `background` shorthand, which
  reset the stripes, so a bar meaning "no idea yet" was an empty track. The
  registers set only the track's colour now. Reported by the homelab
  dashboard, which can drop its shim once it runs a release carrying this.

**Added.**

- **A loading data table can show it over its rows**: `busy({ text, since,
overlay: true })`, or `data-kp-busy-overlay` on the wrapper, sets a large
  spinner with the status words and the count over the rows while it loads,
  under the header and hidden from assistive technology; the status line
  stays the live region. Asked for by the homelab dashboard, where a long
  table's status line sat below the fold.

## 8.0.1 — 2026-09-29

A patch with nothing new for a web page that imports the package: the
documentation site and the review tools.

**Fixed.**

- **The documentation site's theme menu opens under its button**: Firefox
  drew it at the far left over the sidebar, and in Chromium it ran past the
  window's right edge.

**Changed (review tools)** [scope-138].

- **The review hash is the block's markup alone** (hash version 10), and
  `node gates/verdicts.mjs pixels` judges the rest: it photographs every
  approved block at its approval commit and at HEAD, and carries the
  approval when the pixels are equal. `catalogue/pixel-checks.json` records
  each outcome.

## 8.0.0 — 2026-09-29

A major that only removes: the themes for other programs leave for
repositories of their own, and nothing a web page imports changes.

**Removed (breaking)** [scope-139].

- **The Home Assistant, VS Code, TUI, Windows, Linux and Jellyfin themes
  moved to repositories of their own**: kp-themes-ha, kp-themes-vscode,
  kp-themes-tui (kp-tui renamed), kp-themes-windows, kp-themes-linux and
  kp-themes-jellyfin, each with its history. The `./ha/*`, `./vscode/*` and
  `./tui/*` exports and the `ha-themes.tar`, `vscode-themes.tar` and
  `kp-tui-palette.rs` assets are gone; MIGRATION.md says where each went.

**Added.**

- **`tokens.tar` on every release** [scope-139]: the tokens, `css/themes.css`
  and the modules that read them, which those repositories pin by version
  and sha256. `gates/terminal.mjs` holds the terminal colours and the sixteen
  ANSI that VS Code, Windows Terminal and Konsole share; `check:tokens-tar`
  unpacks a fresh build and imports every entry module from it.

## 7.3.0 — 2026-09-29

A minor for what the homelab dashboard met in use, two rounds of it, and for
the documentation site. The data table gains `busy()` with a count it keeps
itself and `fail()` with the reason in its words, every table can fail
visibly, a multi-sort summary has a line of its own, and a bar's ghost and
icon buttons wear the bar's ink at rest and on hover. Dark's pointer effect
follows a theme switch. The site carries a theme switcher on every page and
the catalogue's blocks as more examples on every component page.

**Fixed.**

- **A ghost or icon button in the bar wears the bar's ink** [fix-77] — it
  took the page's, and read 1.2:1 on cyberpunk's yellow bar and 1:1 on
  nostromo's. `.kp-nav :is(.kp-button--ghost, .kp-icon-button)` inherits the
  bar's colour, in the package and in the four registers that repaint the
  ghost.
- **A select's open list stays in the window** [fix-78] — with
  `appearance: base-select` it was as wide as its longest option and the
  check mark pushed every label to the end. It is now at most
  `--kp-picker-max-width` (40rem, or the window less 2rem), options wrap, and
  the mark sits after the label.
- **Flipping a switch moves nothing** [fix-79] — both words share one cell,
  so the box is as wide as the wider word in any language.
- **A datatable's first load shows its spinner** [fix-80], as a refresh
  does, and the handle's new `busy(text)` puts the consumer's own progress
  words in the status line while it loads.
- **Dark's pointer effect follows a theme switch** [fix-81]: the effects
  module arms the pointer and press buses the first time a theme asks for
  them, not only at attach.
- **A hovered ghost or icon button in the bar keeps the bar's ink** [fix-82]:
  its hover plate is a veil of that ink (nostromo's read 1.12:1).
- **Sorting on several columns moves nothing** [fix-83]: the summary has a
  line of its own under the toolbar, one line high, with a **Reset the sort**
  button that keeps its room and shows only when the sort differs from the
  opening one.
- **`busy({ text, since })` counts by itself** [fix-84], in a part the live
  region does not announce each second.
- **Every data table can fail, with its reason** [fix-85]: the failed slot and
  its Try again are made for any table, `fail(reason)` puts the reason in its
  words, and the empty slot may say "nothing yet" and "nothing matches" apart
  (`data-kp-datatable-empty-none`, `data-kp-datatable-empty-nomatch`).

**Added.**

- **The documentation site**: a theme switcher fixed top right on every page,
  the choice carried from page to page, and every component page showing the
  catalogue's blocks as more examples (136 of them).

## 7.2.0 — 2026-09-27

A minor for a new component and three fixes found in use. `.kp-log` gives a
log line its time, source, level and message on fixed columns, with a
source name's own colour from `js/log.js`; the side navigation marks a
submenu item per theme. Then what a consumer and a desktop ran into: kyu's
login opened with its required field already red [fix-74], retro drew its
pressed icon-button plate at the page's corner [fix-75], and the desktop
apply scripts wrote through Kenny's linked `starship.toml` [fix-76]. The
Windows and Linux desktop files live in `desktop/` from this release on; they
are not part of the npm package.

**Fixed.**

- **An untouched required field no longer loads red** [fix-74] — kyu's login
  page opened with its token field already in the destructive colour, because
  the base layer painted every `:invalid` field and an empty required field is
  invalid before anyone types. The rule now reads `:user-invalid`, which waits
  until the field has been touched or a submit was tried. A consumer that
  worked around it with its own `:user-invalid` rule can drop that rule.
- **An icon button is the containing block of what hangs off it** [fix-75]
  — retro draws its pressed plate as an absolutely placed `::before`, and the
  icon button was not positioned, so the plate was drawn at the page's
  top-left corner. `.kp-icon-button` is now `position: relative` at zero
  specificity, as `.kp-button` already was, in every theme; a part that
  places the button itself, like the dialog's close, still wins.
- **A submenu item carries a mark of its own** — Kenny, 2026-09-20: _"bij
  subitems op de sidenav zou ik graag nog, per thema, een specifiek symbool
  voor de subitemnaam willen zetten zodat het extra duidelijk is wat nu juist
  een hoofdmenuitem en een submenuitem is."_ The package gives the place, in
  the indent a submenu item already carries, so no label moves for it
  [fix-64] — in the name's own line, right before its first letter, because a
  register may give a submenu row its own inline padding and a mark measured
  from the row's edge fell on the word in eleven themes; each register gives
  the mark through `--kp-sidenav-submenu-mark`
  — formal a middot, cyberpunk its double slash, blueprint the grid mark,
  high-contrast a filled square, terminal a prompt, and nostromo the same dot
  it draws on its buttons, drawn rather than typed. On the label's own
  `::before`, because five registers already draw with the link's. Nostromo
  lights the dot its rows already carry instead of drawing a second one, and
  its rows are positioned now, so that dot stops standing in the middle of
  the panel while the list scrolls [fix-73].

**Changed.**

- **A log's loud severities carry a plate, and its stamp stops at the
  second** (fix-70): `--info-foreground` and `--warning-foreground` are the
  ink _on_ a plate, not an ink for a card, and which half of a status pair
  is dark is each theme's own answer — measured 2026-09-20, nineteen words
  in nine themes sat under 4.5:1 and ten of those at 1.00 to 1.38, which is
  white on white. A warning, an error and a critical now take the pair
  itself, plate and ink, which the contrast gate already holds at 4.5:1 in
  all twenty-two themes; a routine line keeps its quiet word, whose colour
  became the knob `--kp-log-level-ink`. The time column reads `09:41:02` —
  Kenny, 2026-09-20: "na seconden moet er niks komen, geen duizendsten".

- **The side navigation travels from the far edge again** (gap-9): the
  `transition: none` that sat on `[data-kp-sidenav-side='end']` since
  2026-09-11 is gone, so that side slides on the register's own duration
  and easing like every other. It was excepted because the slide read as
  rough through two attempts; measured frame by frame on 2026-09-20 it
  drops nothing — 10 to 15 frames at one every 17 to 18 ms in six
  registers, and terminal's two steps are its own `steps(2, end)`
  [research/gap-9-far-edge/README.md].

**Added.**

- **`.kp-log`, a log line** (gap-14): the time, the source, the level and
  the message in four columns that do not move — the list is the grid and
  every line hands its parts to it, so each message begins in the same place
  whatever the source before it is called [fix-64]. The level is a word in a
  column of its own before it is a colour [fix-1], the loud severities carry
  their own plate behind that word [fix-70], and `data-kp-current` marks the
  line a reader is pointed at with the muted ground and nothing else. All
  twenty-two registers dress it with what they already decided for
  `.kp-spec`, so no theme had to invent a second taste.

    This is the shape homelab writes three times by hand and kp-tui carries as
    `LogPane`. The web had the colours for it and not the component.

- **`js/log.js`: a name's own colour** (gap-15): `sourceIndex` hashes a
  source name with FNV-1a — the same offset basis and prime kp-tui uses — and
  `attachLogs` writes `--kp-source-colour: var(--chart-N)` on every
  `[data-kp-source]`. So `media` is the third chart colour in a terminal and
  the third on a page, in all twenty-two themes, and nothing picks a hue by
  hand. Measured against the crate on 2026-09-20: media 3, web 1, backup 5,
  monitoring 4, dns 5, host 1, caddy 2, restic 5; `tests/log.spec.mjs`
  carries that table so the two implementations cannot drift apart quietly.

    The module is lazy like every other: `js/auto.js` fetches it only for a
    page carrying `[data-kp-source]`. Without it a source name is simply ink.

## 7.1.0 — 2026-09-20

A minor for one rule, found in the terminal and brought back to the web.
Kenny, on a set of progress bars whose tracks each began where the word in
front of them happened to end: _"Elementen beginnen op vaste punten, niet
afhankelijk van de lengte van andere elementen … Dat wil ik ook in andere
componenten. Het moet altijd netjes ogen."_

**Added.**

- **`.kp-progress-group`** (fix-64): a set of labelled bars in three
  columns — label, track, reading — with the row handing its parts to them
  through `display: contents`. Every track in the group begins and ends in
  the same place, and the label column is as wide as the longest label in
  that group and no wider. A lone bar keeps `.kp-progress__wrap` and needs
  none of it. `.kp-progress__label` styles the word in front of a bar, and
  `--kp-progress-group-gap` is the row gap.

    Measured: without the rule the three demo bars read
    `lefts 320/580/1042` in formal; with it, one left edge and one right edge
    in all 22 themes (`tests/nostromo-notes.spec.mjs`, "bars in one group all
    start and end in the same column").

**Notes.**

- No theme changed. The rule is a layout in `css/components.css`, so every
  register's own colours, radii and borders are untouched; the twenty-two
  `tokens.json` files are byte for byte those of 7.0.0.
- The catalogue's progress block carries the group now, so its thirty
  neighbouring blocks were judged again on the review site — 660 pairs,
  all approved on 2026-09-19 at device pixel ratio 2.222. The hash resolves
  the code that touches a block per component rather than per family, which
  is why a table with a badge in it came back for a rule about bars.
- The rule is code in kp-tui too, as `label_column` [kp-tui fix-64], which
  is where Kenny found the fault.

## 7.0.0 — 2026-09-17

A major for one break: `attachAll()` and `attachEffects()` finish after they
return, because a page now downloads only the JavaScript its markup uses. A
login page loads 241,556 bytes of it where 6.1.0 loaded 722,686 (Chromium,
`examples/login.html`). No consumer in `~/Projects` calls `attachAll()`;
chassis-rs bakes ten more files at its upgrade (MIGRATION.md has its task).

**Breaking.**

- **`attachAll()` and `attachEffects()` are asynchronous** (`scope-115`,
  `scope-117`): both handles carry `ready`. Code that reads a component's
  state in the same tick awaits it first; `<html data-kp-auto-ready>` marks
  the boot's attach. The individual attach functions stay synchronous.
- **A vendored `js/effects.js` needs `js/effects/` and `js/as-of.js` beside
  it** (`scope-117`, fix-55, fix-56): `SHA256SUMS` lists them.

**Added.**

- **The 22 themes as VS Code colour themes** (`scope-125`): `vscode/kp-<theme>-color-theme.json`,
  generated from the same tokens by `gates/generate-vscode-themes.mjs` and
  checked in the gates chain like the Home Assistant themes. 394 colour keys,
  17 syntax rules and 30 semantic ones per theme; each file carries its own
  measured contrast pairs under `kpThemes.contrast`. A release attaches them as
  `vscode-themes.tar`, the eleventh asset, and the package exports `./vscode/*`.
  They are not in `consumer.tar`: an editor theme is not a stylesheet a page
  serves.

- **`--code-keyword` and `--code-string`, in all 22 themes** (`scope-123`,
  fix-58): the two inks a code block colours its keywords and its strings
  with. They were the chart hues, which are chosen and measured as LINES at
  3:1, and nine themes came out under the 4.5:1 text asks — strings in
  formal, light, pastel, forest, shade-light, lapis and titanium, keywords
  in pastel, brutalism and nostromo. Each new token is its theme's chart hue
  and saturation with the lightness moved until it reads: ten of the 44
  moved, by 2 to 10 points, and the other 34 are the chart colour unchanged.
  `check:site` now measures every colour `site/site.css` gives to text
  against the surface under it and refuses anything below 4.5:1.

**Changed.**

- **`js/auto.js` fetches only what the page carries** (`scope-115`): the
  document is asked first, one selector per module, and a module is
  imported only when its markup is there. Measured in Chromium on
  `examples/login.html`: 10 files and 294,139 bytes of JavaScript where it
  was 28 files and 722,686. Remember, overlays, the theme picker and effects
  are still loaded on every page, because what they do does not depend on
  markup a load-time check can see. `attachAll()` now returns its detach with
  `ready` and `modules`; code that read a component's state in the same tick
  as `attachAll()` awaits `ready` first. `dist/kp-themes.js` stays one file.
- **`js/effects.js` fetches its hooks when asked** (`scope-117`): the nine
  hooks moved into `js/effects/`, each fetched the first time an element or
  a theme knob needs it; the module that every page loads went from 108,896
  to 53,877 bytes. `attachEffects()` returns `ready` on its handle.
- **The catalogue asks only about what a change touches** (`scope-116`,
  fix-54): a block's review hash reads the CSS families and component
  modules its markup carries, not every file in `css/`, `js/` and
  `components/`. Measured: a change to the data table's module brings back
  264 of 3062 block/theme pairs, the loader none.
- **The Home Assistant themes ship with the release** (`scope-120`): the
  22 `ha/kp-*.yaml` as `ha-themes.tar`, listed in `SHA256SUMS`, with the
  install steps in the README.
- **`npm run test:tags -- --level engines`** (fix-51): the commit level's
  selection in both engines, run at a layer's close.

## 6.1.0 — 2026-09-17

A minor: one new thing a consumer can use, twenty-two themes corrected
where Kenny turned a block down, and a review cycle that finally answers
the question it was built to answer.

**New.**

- **A component remembers what the reader set** (`scope-110`):
  `data-kp-remember="<name>"` opts an element in and names its key, so two
  of the same component on one page keep separate state. The side
  navigation's groups and rail, the accordion, the tree, the split pane
  and the data table's columns, sort and density are covered; dialogs,
  popovers, menus, tooltips, toasts, the combobox, the date picker, the
  wizard and the alarm deliberately are not — each is opened for a
  moment, and a page that reopens one by itself argues with its reader.
  `js/remember.js` paints the stored state back as the attributes an
  author could have written, so every module goes on reading its own
  markup; blocked storage leaves everything at its default.

**Corrected.** Every one of these came from Kenny judging the catalogue,
and each is in `docs/CORRECTIONS.md` with the measurement behind it.

- Dark's halo is cut at the chamfer instead of squaring it (`fix-41`);
  dark and titanium show one select arrow, not two (`fix-42`); dark's
  buttons show a focus ring again, with eleven of the twenty-two themes
  measured in the same sweep (`fix-38`).
- Brutalism's alarm fits its frame at every size, and retro's alarm
  speaks the theme's own body face (`scope-108`); retro's dialog no
  longer overlaps its own title, close button and scrollbar.
- A menu opens inside the box that clips it (`fix-39`), and brutalism's
  over-the-page navigation stays off screen when it is closed (`fix-40`).
- Sepia's ink washes, its retry border and its gestures; blueprint's
  laurels; phantom's theme menu; synthwave's, terminal's and
  high-contrast's page effects.

**The review cycle.** Not shipped code, but it is why this release could
be cut at all.

- **The block hash is what a block is made of, not what it looks like**
  (`scope-114`): its markup as written, the theme, and digests of the
  code that shapes it. A verdict no longer follows the zoom, the window,
  the focus, a typed value or the page a block is shown on — and a
  version bump is not a change to a block.
- **Nothing is released while an element is not approved** (`scope-107`),
  counted by `npm run advice`; at this release, 3062 of 3062 block/theme
  pairs carry an approval.
- **One dialog for a whole round** (`scope-113`) and a page that says
  whether the round is finished (`fix-48`, `catalogue/round.html`).

## 6.0.0 — 2026-09-12

A major because four themes are gone and a fifth was replaced outright.
Everything else in this release is additive, but those two are enough:
a page wearing `academia`, `mono`, `ticker` or `woodblock` will fall back
to `formal` and say so in the console, and a page wearing `dark` will
look like a different theme, because it is one.

**Breaking.**

- **Four themes removed** (`scope-11`): `academia`, `mono`, `ticker`,
  `woodblock`. Twenty-two remain. The registry no longer knows the names,
  so `applyTheme('mono')` warns once and applies the fallback rather than
  writing an attribute nothing styles.
- **`dark` is a different theme** (`scope-16`): the spectral instrument,
  rebuilt from its own approved demo. Same name, same token contract, an
  entirely new register — and it now declares `--kp-pointer: track`, so a
  page that loads its register also gets `--kp-px` and `--kp-py` written
  to the root while the pointer moves.

**New.**

- **A side navigation, in both channels.** `js/sidenav.js` shipped first;
  `components/sidenav.jsx` is the other half, rendering the same markup
  and attaching itself on mount, because `js/auto.js` runs at load and
  React mounts after it. `autoAttach={false}` is the way out. Three
  modes, a slim rail, folding categories and either edge; every attribute
  the module reads is a prop.
- **Numbers that count up** (`feat-count-1`): `data-kp-count` on an
  element whose text already holds the final figure. The module reads the
  number out of that text, counts to it and puts the same string back, so
  a page without the module — and a reader who asked for less movement —
  simply sees the number. Which character groups the digits and which is
  the decimal point is decided by the nearest `lang`, never guessed:
  `1.204` is one thousand two hundred and four in Dutch and
  one-point-two-oh-four in English.
- **`titanium`**, the twenty-second theme: anodised metal and carbon
  weave, the machined chamfer, and the oxide film that shifts with the
  angle you look from.
- **Two surfaces a theme may paint on a button** (`scope-16`,
  `scope-17`): an empty `.kp-button__edge` over the whole control, and an
  optional `.kp-button__readout` above it carrying the consumer's own
  word. Both inert in every theme that does not style them.
- **Eight per-theme gestures and six hover gestures**, each from its
  theme's own approved demo.

**Fixed, and each one is a fault that reached a person.**

- **A button that did not react to being pressed** (`fix-12`, and twice
  more in Phase 7). Three shapes of one fault: a later layer beating a
  state, a variant's ground swallowing its flavours, and — the third — a
  longer hover selector outranking the pressed rule in the _same_ layer.
  grotesk carried a correct `:active` rule with a correct token for a
  whole round and it never painted. `gates/check-pressed-state.mjs` now
  compares the two weights.
- **Half a focus ring.** Three themes painted their own elevation on a
  button from the register layer, swallowing the ring the components
  layer draws on `:focus-visible` — a keyboard user got an outline and
  nothing behind it. Two more painted nothing at all on a menu item
  inside a popover that rounds its corners. Both repaired without moving
  what the demos showed.
- **`shade-light` had no muted colour**: `--muted-foreground` was
  identical to `--foreground`, the only theme of twenty-two where the two
  matched, so captions, timestamps, disabled labels and the text of an
  empty field all read as body text. Now 46%, measured at 3.99 against a
  4.5 floor — there is no lighter colour that clears it, because the body
  text only reaches 5.01 itself, and the reading is recorded rather than
  hidden.
- **`blueprint`'s buttons overflowed at a phone width.** Its own approved
  hover gesture put two witness lines outside the control, and the
  right-hand one added six pixels to every button's scrollable area
  whether or not it was visible. The lines moved inside; the gesture is
  unchanged in everything else.

**Under it.**

Thirty-five gates, up from thirty. Five are new and three of those are
about the documents: every command, path and import subpath a document
names is real; every message it quotes verbatim is a string the source
prints; and nothing of a refused shape appears in any of them. The other
two guard the pressed state and the variant grounds.

110 unit tests and 1,343 browser tests in Firefox, 2,736 across both
engines. Fifteen of those browser tests were red on the branch for most
of this round and nobody could see them, because a register edit resolved
to one spec file and skipped the fifteen sweeps that read every register.
`gates/affected.mjs` now resolves a register edit to its own spec plus
every spec that sweeps all themes, found by reading the specs rather than
by keeping a list.

`docs/DEBUGGING_GUIDE.md` and `docs/OPERATIONS_RUNBOOK.md` are new: the
maintainer's half of the troubleshooting pair, and the numbered
procedures this repository actually performs on itself.

## 5.1.0 — 2026-09-09

The first release shaped by a consumer rather than by this project's own
gates. chassis-rs adopted 5.0.0 the day it published and reported two
things back (their R3); both were measured here and both were right.

**A release carries `consumer.tar`.** The release attached eight assets
while `SHA256SUMS` beside them named 231 copyable files, so a consumer
that bakes the package into its own binary pulled the six JavaScript
modules, the twenty-five registers, `css/layout.css` and
`css/utilities.css` off the git tag one file at a time. The tarball is
built FROM the manifest — not from a list anyone maintains, which is the
drift KT7 and TH130 exist about — and carries everything it names except
the fonts (already `fonts.tar`) and the source maps: 92 files, 4.7 MB. It
travels with `SHA256SUMS`, so a consumer verifies what it just received
without a second download:

```sh
tar -xf consumer.tar && sha256sum -c --ignore-missing SHA256SUMS
```

The flag is not optional. The manifest inside is the release's own and
names the fonts and maps the tarball leaves out, so a bare `sha256sum -c`
buries ninety-two `OK` lines under a hundred-odd warnings.

**`dist/kp-themes.js` exports every published module.** It bundled
`js/auto.js` and therefore exported one name, `attachAll` — so a consumer
calling `enforceContracts`, `attachConfirmations`, `attachSkipLinks`,
`attachThemePickers` or `applyStoredTheme` found all five inside the
bundle and none of them coming out, and had to take the loose modules
instead. The bundle now exports a namespace per module
(`comboboxExports`, `themeCoreExports`, …) plus every name that exactly
one module _declares_, flat. Declares, not re-exports: `THEMES` is
written once in `js/theme-registry.js` and passed on by two others, so it
flattens safely, while `OPEN_EVENT` and `MATCHERS` are each written by
several modules with different values and stay namespace-only rather than
silently becoming one of them. A unit test holds the bundle's surface
beside the modules', the way KT7's test holds the check lists.

**How to load twenty-five registers is written down.** chassis-rs asked
how a consumer with a client-side picker should do it, and the honest
answer was that the package already solves it and never said so:
`dist/kp-themes.css` is twenty-nine stylesheets including all twenty-five
registers, each scoped to `[data-theme='name']`, so a theme change fetches
nothing. README.md and `docs/USER_GUIDE.md` now carry both routes with the
measurements: 693 kB minified for everything at once, against an average
of 20 kB per register (dark 44 kB, light 12 kB) for loading the one in
use. Neither is more supported than the other.

No colour and no token moves in this release. Two rules do, and both are
below: a component gained a knob and the Home Assistant themes gained a
register. Every existing page renders exactly as it did.

**A reveal's state is readable** [TF2, KT16]. `js/effects.js` sets
`data-kp-reveal-state` on the element it handled — `armed` (wired to a
trigger, nothing has run), `rest` (settled without playing) or `played`.
Until now the only signal was the `kp-reveal` event, which is a moment:
whoever was not listening when it fired could never learn the answer, so a
consumer asking "is the dossier armed yet" had nowhere to look. The event
is unchanged and still fires.

It came out of two browser tests that failed under load and passed alone
in Kenny's verify run. The tests are repaired the same way the state is:
63 reads that happened after a click, a hover or a press now retry instead
of reading one moment, 22 places that clicked the boot overlay's Skip now
wait for the overlay to actually leave, and `tests/paint.mjs` holds the
readers. Recorded as KT16.

It came back the next day, in the verify run that measure was queued
against, on two reads that were neither of those things [fix-1]. The
repair separates the two halves the first one had run together: a value
that settles is read until it is the value (`wholeRing()` for the focus
ring, four sites), and a value that passes is caught by a listener armed
before the page exists (`recordAnimations()` and `animationsSeen()`,
three sites) — because polling for a keyframe name that has already gone
finds nothing and then costs the whole timeout. Nothing a consumer runs
changes; this is the suite.

**A badge can be told not to break its word** [ask-1]. Five components
share one rule that lets an unbroken value break rather than push the
page sideways — measured before it existed at 607, 485, 483 and 581px in
a 360px viewport. chassis-rs found the other half of that trade: in a
narrow status column the badge cut "active" into "acti / ve", because the
badge was narrow through its column and not through its content. Both
cases are real, so neither becomes the rule. The default is unchanged and
`.kp-badge` now reads `overflow-wrap: var(--kp-badge-wrap, anywhere)`; a
consumer whose badges only hold labels sets `--kp-badge-wrap: normal` on
the column. A custom property rather than a modifier class, because the
place that knows is usually the column rather than the badge.

**Cyberpunk and synthwave wear their register on a Home Assistant
dashboard** [feat-ha-1]. A generated Home Assistant theme carried 23
colour variables, the card radius and width, and the theme's own duration
as a transition — the colour travelled and the expression did not, because
a dashboard has no `.kp-*` class for a register to hang on. Where card-mod
is installed, those two themes now inject their own: cyberpunk's notched
card corner, its signal-yellow tick and its scanlines at DI9's 0.06
ceiling; synthwave's fixed horizon with the floor running to a vanishing
point, and cards as lit panels. Every colour and face comes from the same
tokens as the rest of the file. The other twenty-three are unchanged and
carry colour and timing only — a register is a design choice per theme,
and two of them have been made.

## 5.0.0 — 2026-09-09

**Three themes changed name.** `topo` is now `forest`, `tazhib` is now
`lapis`, `nishiki` is now `woodblock` (Kenny, 2026-09-08, at their lift).
The rename is total — tokens, register, export path, Home Assistant
theme, example pages, the `Theme` type — and `MIGRATION.md` carries the
one-line map a consumer needs. The compare pages ask 4.0.0 for the name
4.0.0 knew, so a rename reads as a rename and not as a redesign.

**The next cyberpunk, and the first theme lifted after it.** Cyberpunk is
rebuilt on signal yellow under the same name (S39); `synthwave` is the
twenty-fifth theme, built from the approved concept demo "Outrun
Horizon" (2026-09-08) on the §25 research: the striped sun and the
drifting floor on the hero, the horizon as divider, chrome type with one
tracking wipe and one shine, the neon tube a `<mark>` switches on, the
laser line under a heading, a boot line with a Skip once per session
(`--kp-arrival: boot`, the sixth hook), VT323 as its mono face. Every
theme gained `theme-font-mono` (the contract is 96 tokens, S47) and the
base layer carries `[hidden] { display: none !important }` (KT13). The
fonts ship with the package; the two registers became three
(`css/synthwave-register.css`), and by the end of round six every one of
the twenty-five themes carried its own. `MIGRATION.md` has the consumer-facing
detail at C6.

**The second lift: phantom.** Built from the approved concept demo
"Calling Card" (2026-09-08) on the §15 research: black, white and one
red that is always a plate, never a word. The headline's words shout in
one after another (`--kp-reveal-headline: shout`), a `<mark>` is a plate
of cut paper shoved under the word (`slab`), the rail under a heading
sweeps from grey to red (`rail`), the divider is torn paper, every hover
is Omicron69's skewed bar, every button a key cap, every popover cut
paper arriving on a three-step film cut, and the page arrives as a
calling card — the theme's name, a red bar, the whole card shoved off to
the left (`--kp-arrival: card`, the second arrival routine). The
register is `css/phantom-register.css`; the effects module gained the
word routines (`shout`, `slam`), `dissolve` and `type` for the lifts
that follow.

**The third lift: retro.** Built from the approved concept demo "Bevel
95" (2026-09-08) on the §21 research (98.css, Win95 SGJ, 2bit.chat, the
NW pixel dissolve). The 3.1.0 bevel register grew into the whole 1995
desktop: the headline clears out of a dither in four discrete densities
(`--kp-reveal-headline: dissolve`), a `<mark>` is the selection bar that
drags across the words in eight steps (`select`), the groove under a
heading rules itself in, in twelve (`groove`), the dividers are the
shell groove — dithered band first, plain two-line second — the brand is
the title-bar ramp, every hover the selection bar, the default button
carries the navy bevel and the mirror modifier the one-pixel ink ring,
the selected tab lifts, the dossier is a Notepad window whose redactions
are the 50% dither brush lifting off, the scrollbar track the 2×2
checkerboard, and the page arrives through the POST (`--kp-arrival:
boot`) and leaves it through the pixel dissolve. VT323 is retro's DOS
voice for labels, help and status. Nothing eases, loops or blinks: every
step is discrete and every effect goes one way. The register stays
`css/retro-register.css`; on a surface the register sets the h1 in ink
with a hard white shadow where the 3.x theme painted a title bar.

**The fourth lift: terminal.** Built from the approved concept demo
"Green Phosphor" (2026-09-08) on the §6 research (PX PUSH, ekeijl,
dottxt.ai). The headline types itself one glyph at a time with a block
caret riding the last one (`--kp-reveal-headline: type`), a `<mark>` is
inverse video (`inverse`), the dashed rule under a heading types itself
out in twelve steps (`dashes`), the dividers are dashes with a plus at
each end, every hover is inverse video, the cta and the ghost button are
bracketed, the checkbox is `[ ]` and `[x]`, the dossier's redactions are
runs of character cells repainting left to right, the glass carries
ekeijl's bezel and the sweep band that crosses once every ten seconds,
and the page arrives through the POST and leaves it as the tube
collapses (`--kp-arrival: boot`). **The cursor moved (R6-Q7):** since
3.1.1 a blinking block sat after the label of the field being typed
into; it is gone from the base layer, and the register paints a block of
one character cell inside the focused text field at the caret — the
effects module writes the column (`--kp-caret: block` on the root,
`--kp-col` on the field), the register paints and blinks it. The
register is `css/terminal-register.css`.

**The demos, exactly (S49).** Kenny's rule of 2026-09-08: an approved
concept demo is implemented exactly, every token and every element, and a
test or a gate that disagrees produces a finding for him rather than a
quiet change. Four read-only audits (`docs/audits/`) measured the four
registers built since C5 against their demos and found fifty deviations;
he answered eleven of the twelve groups "Demo exact". What that changed:

- **The words.** `examples/concept-<theme>.html` is one page per theme
  with an approved demo — the same structure and the same markers (S46),
  the theme's own words, its own theme in the markup. Until now every
  theme's concept page carried cyberpunk's copy. `showcase/concept-copy.mjs`
  holds the ninety slots per theme and a unit test refuses a page that
  says another theme's headline; the React channel takes `?copy=<theme>`.
- **The chrome.** Retro is an application window on the teal desktop
  again, with its window controls, its resize grip, its groove well and
  the segmented bar its POST counts along; the arrival routine learns a
  lines mode fed by the dictionary (`arrivalLinesByTheme`), so a theme's
  boot is its own five POST lines rather than one percentage counter.
- **The values.** Retro's title-bar ramp, terminal's panel, well, footer
  ground and typing speed, brutalism's dot grid and its `oklch` hover
  step are the demos' own. Two tokens join the contract, `--fx-hot` and
  `--fx-hot-alarm` (96 tokens, S47), and phantom ships Barlow Condensed's
  real Black Italic and ExtraBold Italic.
- **The rules that yielded.** TH111 is amended: the three button sizes
  must be told apart, and where a demo pins one height they separate in
  type and padding. AR30's reader accepts a ring stacked either way.
  KT8's one-step hover yields for brutalism, and its themeable select and
  ink-wash highlight yield for retro and terminal — per theme, with the
  reason recorded beside each exception and the exception itself
  measured.
- **Still with Kenny:** phantom's skewed button, where the demo skews the
  element and the package skews the plate (R6-Q8).

**The fifth lift: brutalism.** Built from the approved concept demo
"Hard Copy" (2026-09-08) on the §7 research (Gumroad, BEIGE FORCE,
Future Pharmaceutical). The headline's words slam onto their yellow
offset one after another (`--kp-reveal-headline: slam`), a `<mark>` is a
yellow plate wiped in behind the word and closed by the line (`plate`),
a six-pixel bar rules a heading off when it enters the viewport (`bar`),
the dividers are a hatched marquee strip translating seamlessly — the
second one the other way — every hover is the yellow plate with the
line, the cta and the buttons lift two pixels away from a shadow that
grows, the labels carry the pixel outline of four hard box-shadows, the
dossier's stamp is tilted signal red and its redactions are ink bars
that slide off, and there is no arrival at all: printed matter is simply
there. The register is `css/brutalism-register.css`; it introduces no
family (Archivo Black already ships) and no token.

**The remaining nineteen lifts, and the twenty-five registers.** After
brutalism the other nineteen themes were lifted the same way in one day
(2026-09-08), each from its own approved concept demo and each recording
what it reported rather than corrected —
`docs/audits/DEMO_FIDELITY_ROUND_SIX_2026-09-08.md` gathers all of it in
one place. Every one of the twenty-five themes now ships a register of
its own, `css/<name>-register.css`, opt-in and exported separately, and
every one answers all six hooks. Five registers had to retire a
pre-register signature from `css/_rules.css` first: an animation there
outranks a normal declaration, so formal, blueprint, deco, nishiki and
woodblock had each been painting the rule their register was trying to
draw.

**Three themes changed name at their lift** — recorded above.

**Two shared elements, from what the lifts found missing.** A marquee
(`data-kp-marquee`, `components/marquee.jsx`) that doubles its row for a
seamless pass, hides the copy from a screen reader, rests off screen by
default (`--kp-marquee-pause`) and takes its speed from
`--kp-marquee`; and a caption above a nav dropdown
(`data-kp-menu-label`, or `menuLabel` on a NavBar link) that draws
nothing where nobody asked for one. Kenny judged all twenty-five side by
side and chose each theme's own version. Cyberpunk's band is signal
yellow with blood-red ink at his instruction — 3.21 against the 4.5
floor, an approved exception recorded in `themes/cyberpunk/anatomy.md`.

**A minified build.** Every stylesheet the package ships now has a
minified twin under `dist/css/`, plus the bundle — 45% smaller, with a
source map beside each and the per-file sizes in `docs/MINIFIED.md`,
generated and gated. `url(../fonts/…)` is rewritten one level deeper so
the twin finds the faces.

**How this package is tested changed** [Kenny, 2026-09-09]. There is no
CI: the workflow is deleted and `main` requires no status check. Five
commands replace it — `npm run gates` on every commit, `test:affected`
for what a change touches, `test:browser` for all of it, `advice` for
the reading, and `verify` for everything before a release. The
accessibility floors (contrast, the design invariants, the flash
threshold, the reduced-motion guards, the texture ceiling) are **advice
rather than gates**: measured and printed, never refused, with no
per-theme exception list any more. README.md and
`docs/DESIGN_INVARIANTS.md` say plainly what that costs, so the package
does not claim to enforce what it does not.

**No field test before this release** [Kenny, 2026-09-09, REL3]. Phase 9
asks for one — the package used once from a clean install as a real
consumer would. Kenny chose to skip it, and it is recorded here rather
than left unsaid: what such a run would have found, a consumer finds.

## 4.0.0 — 2026-09-07

**A destructive button asks before it acts, and four things that were
broken in public stop being broken.** The major version is the
confirmation: a click on a destructive control no longer arms the button
for a second click but opens a dialog. Everything else in this release
is either a repair of something the released package got wrong or an
addition that breaks nothing.

`MIGRATION.md` has the consumer-facing detail; this is what changed and
why.

### The confirmation is a dialog [TH107, D4, AR27, AR28, AR29]

A native `<dialog>` opened through `showModal()`, so the browser supplies
the focus trap, the Escape close and the return of focus. Confirm
re-fires the click behind a one-shot lock, which is the only shape that
costs consumers listening for ordinary clicks nothing — measured, because
the obvious version does not work: without the lock the re-fired click is
caught by the same listener and reopens the dialog, `["open", "confirm",
"open"]` and nothing ever performed. `ARM_EVENT` and `DISARM_EVENT` leave
the exports; arm-then-act survives as `data-kp-confirm-mode="inline"`.

The dialog re-shows the popover it displaced before returning focus,
because `showModal()` light-dismisses an open `popover="auto"` and a row
action lives in a menu.

### Four faults the released package had

Each was found by the `architecture-critic` before this round was frozen,
and each started as a test that failed on the released code.

- **A destructive React button could never be confirmed.** The React
  button wrote `data-kp-confirm` and the framework-free module selected
  it document-wide, so the two channels re-armed each other's button
  forever and the action never fired at any number of clicks. The test
  asserting otherwise was green only because its fixture did not attach
  the module over the React part.
- **Half the focus ring was missing on every button in every theme.**
  `.kp-button`'s own `box-shadow` sat in a later cascade layer than the
  global two-part ring and replaced its inner half. It composes now.
- **The cyberpunk register never reached the package's own buttons.**
  Every button rule in it selected `[data-slot='button']`, an attribute
  `css/components.css` never sets.
- **The movable grid's collapse rule had been dead since it was
  written.** `js/gridlayout.js` wrote the tile's place as an inline
  style, which beats any rule in any layer, so the narrow rule lost the
  moment the grid was attached — the only way it is used. The place is
  four custom properties now.

### Container queries beyond the tables [TH104, AR31]

The card grid and the nav bar read the box they are given rather than the
width of the window; the nav bar's `clamp(…, 3vw, …)` was the same fault
in a different disguise. Both need one wrapper element, which the React
components render themselves and `MIGRATION.md` spells out for
hand-written markup. The DataTable needed nothing — `@container kp-table`
has carried it since 3.2.0, checked rather than assumed.

### The button, and the page's edges [TH110, TH111, TH113, AR30, AR32]

Three button sizes as modifier classes with a `size` prop beside them.
One shared rule stops `.kp-button`, `.kp-badge`, `.kp-tag`, `.kp-health`
and `.kp-copyable` pushing the page sideways at 320 and 360px.

### What a scroll region clips [TH114, AR33]

Six assertions and a section of the guide, replacing an assumption with a
measurement: an absolutely positioned child of `.kp-table-wrap`,
`.kp-diff` or a `<pre>` is clipped, and a popover is not — it lives in the
top layer, where no ancestor's overflow applies.

### Two new gates, both blocking

`check:closure` holds the import closure of the six modules chassis-rs
bakes into a Rust binary at exactly those six, because one import edge
would make its whole chassis fail to load. `check:wrappers` refuses one
of this package's own pages that draws a converted component outside a
container that carries it — 65 components over 82 pages today.

### Also

`README.md` and `docs/SCOPE.md` no longer disagree about the git route
[TH112]. Three flaky tests were given a cause rather than an excuse: two
budgets that never scaled with their corpus, and one assertion racing a
state the fixture threw away after 400ms.

## 3.2.0 — 2026-09-07

**The layout the package kept telling consumers to write themselves.** A
consuming project shipped 71 lines of its own layout glue and 28 inline
`style` attributes, and said so in its own stylesheet header. Round four
is the answer: a layout layer, a utility API, ten example pages built out
of nothing else, and a documentation site that shows all of it.

Everything here is additive. Nothing that worked in 3.1.1 stops working.

### Added

- **A layout layer** (`css/layout.css`, exported as `./css/layout`):
  sixteen classes for the shape of a page, each reading a knob that
  defaults to the theme's own spacing scale.
  [docs/LAYOUT.md](docs/LAYOUT.md).
- **A utility API** (`css/utilities.css`, exported as `./css/utilities`):
  118 single-purpose classes in six families, generated from one source
  and documented by hand so the two can disagree.
  [docs/UTILITIES.md](docs/UTILITIES.md).
- **Cascade layers** — `kp.base`, `kp.components`, `kp.register`,
  `kp.layout`, `kp.utilities`. A layout class or a utility now wins on a
  component that sets the same property, without `!important`. Measured
  first: 44 component rules had higher specificity than a utility, so
  load order alone would not have been enough.
- **A spacing scale as tokens** in all 24 themes, pinned to the values
  the components already used, so nothing shifted.
- **A compact density mode**: `data-density="compact"` on any element.
  Pointer targets stay above 24px.
- **A keyboard-reachable scroll region for wide tables** in both
  channels, plus `.kp-cell-break`, `.kp-cell-truncate`, `.kp-col-low`,
  container queries in place of media queries, and a card layout for the
  plain table through `data-kp-cards`.
- **A dist bundle**: `dist/kp-themes.css` and `dist/kp-themes.js`, one
  tag each instead of eight. The loose files are unchanged.
- **Ten example pages** in both channels, built out of the layout layer
  and the utility API and nothing else — zero inline styles, with one
  excused pair of properties a popover needs.
- **A documentation site** with the story of every theme, taken from its
  own anatomy document, and its live tokens beside it.
- **A diagnostics page** that lays a vendored stylesheet and the
  JavaScript beside it and says which half is behind.

### Changed

- **An unknown theme name is no longer silent.** It still falls back to
  the default, but it warns once per session and dispatches a
  `kp-theme-unknown` event carrying what was asked for, what was
  applied, and which of the four paths dropped it. A page that has been
  quietly showing the default theme will now say so.
- **The stylesheet declares its own version** and the theme names it
  knows, as custom properties, so JavaScript can read them.
- **The checksum manifest** is derived from the package exports rather
  than hand-picked, and from what those exports import, so a file a
  consumer has to copy alongside them cannot fall outside it. That is how
  `js/locale.js` — imported by the date picker, the data table and the
  upload field, and exported by nothing — got in.
- **The typography scale is a set of tokens.** `--kp-text-xs`, `--kp-text-sm`
  and `--kp-text-md` are declared in all 24 themes. The six component rules
  that wanted a size the scale name did not mean kept their own value under
  their own knob, so no text moved anywhere.
- **A floor under a collapsed table wrapper.** `--kp-table-wrap-min` does
  nothing by default and gives a way out to a consumer who puts
  `.kp-table-wrap` in a box that shrinks to fit, where inline-size
  containment takes it to zero.

### Fixed

- **A status badge needed an inline style to be coloured.** `css/components.css`
  carries a rule per status now, so `<span class="kp-badge" data-status="offer">`
  gets its plate from the class. The React `Badge` stops writing the style for
  the seven names the package ships and keeps writing it for a consumer's own
  token family.
- **The shortcut sheet ran off a phone.** It was content-box, so at a 360px
  viewport it measured 373px and pushed the page sideways. It is border-box now,
  with the default width raised by exactly what used to sit outside it, so a wide
  screen sees the same 490px it always did.
- **Printing dropped the theme again.** Between the cascade layers
  landing and this release, the print override sat inside a layer while
  the theme tokens did not, and unlayered CSS wins; a dark theme printed
  dark in every theme and both browsers. The override is unlayered now.
  This never reached a published version.

## 3.1.1 — 2026-09-06

**Terminal's cursor moves off the headings.** The blinking block after
every `h1` and `h2` read as a screensaver rather than a flourish once a
page had more than one heading on it. It now appears once, after the
label of the field a person is currently focused in — the one place a
terminal cursor actually marks something.

### Changed

- **Terminal's block-cursor signature** now renders on
  `.kp-field:focus-within .kp-field__label::after` instead of on every
  `h1::after`/`h2::after`. Same glyph, colour and blink timing (DI5's
  flash-threshold literal, unchanged); nothing else about the theme's
  tokens moved (S20).

## 3.1.0 — 2026-09-05

**Thirteen more themes.** Round three researched eleven candidates and
ten further ideas against the existing set, dropped everything that sat
on a theme already here (vaporwave on cyberpunk, botanical on forest,
steampunk on solstice, cosmic on dark), and built the rest —
`docs/THEME_CANDIDATES.md` is the research, `themes/*/anatomy.md` the
result. Nothing existing changed (S20).

### Added

- **Themes:** brutalism, deco, academia, phantom, ticker, woodblock,
  shade-light and shade-dark (one scheme, two halves), mono, retro,
  grotesk, lapis, nostromo. Thirteen light, eleven dark in total.
- **`--fx-shadow-offset`** — a hard offset shadow on buttons, cards and
  inputs; brutalism's signature, `0px` everywhere else (TH85).
- **`--chart-pattern-1` … `-5`** — an image over each chart colour so a
  series is told apart without hue; mono's five fills, `none` elsewhere
  (TH86).
- **`css/retro-register.css`** — raised and sunken bevels inside a gated
  boundary, scoped to retro (TH87). Exported as
  `@kp-soft/themes/css/retro-register`.
- **The showcase compares two themes side by side** — a picker per half,
  one scroll, every specimen twice — and loads each theme's faces from
  Google Fonts (the package still loads none) (TH88).
- **`--kp-popover-max-height`** — the popover scrolls inside itself.

### Changed

- **Hover and the keyboard highlight are a wash of the ink**, not
  `--accent`: `--kp-highlight`, default the foreground at 8% alpha, on
  menu items, the theme picker's options, ghost and icon buttons, and the
  combobox and palette highlights. Seven rules read `--accent` before, and
  a theme whose accent is a colour rather than a tint turned every
  highlighted row that colour. The text keeps the list's colour.
- **`--kp-control-accent`** — what the browser paints checks, radio dots
  and the progress bar in; default `--primary`. Brutalism and mono set
  it, because their primary is (near) the ink.
- **Hover is one lightness step** in every theme (was a half): Kenny's
  finding on the 3.1.0 showcase, KT8/H1. Derived tokens only; no
  authored value changed.
- **The native `<select>` list wears the theme** where the browser
  supports `appearance: base-select` (Chromium 135+): popover surface,
  ink-wash hover, a check on the chosen option. Elsewhere it stays the
  platform's.
- **`<hr>` and `<progress>` wear the theme.** Both were the browser's
  grey — the two elements on a fixture that wore no theme at all, found
  by the foreign-colour test below.
- **A foreign-colour test on every fixture** (`tests/fixtures.spec.mjs`,
  "paints no colour that is not its own"): every painted background,
  text, border and control colour is one of the theme's own values
  within rounding, transparent, or a translucent wash of one; the colour
  picker's swatch and the "browser" specimen's native controls are the
  allowlist, each with its reason. Kenny asked for exactly this after the
  third look at the showcase.
- **The spinner's track is the head at a quarter alpha**, so the two can
  never coincide (brutalism's were both black).

### Fixed

- The strings gate flagged three shapes of code that only looked like
  text (a CSS selector, a capitalised object key, the code between two
  one-character literals); repaired test-first (KT7).
- Fields and inputs shrink inside a grid or flex track instead of
  pushing a 320px viewport sideways, found by the reflow test on a wide
  face.

## 3.0.0 — 2026-09-05

**The release in which every feature of every component became
configurable.** Correction KT6 opened on a busy button with no way back;
Kenny's answer widened it into a sweep of the whole package against what
mature component libraries do in 2026, and this is the result. The audit
and the record of what was done are `docs/GENERIC_SWEEP.md`.

### Breaking

- **The framework-free modules are pure.** Importing `js/*.js` attaches
  nothing. Load `js/auto.js` for what 2.x did, or call the `attach…()`
  functions yourself. `package.json` now tells bundlers the truth about
  side effects — it did not for two versions.
- **The theme labels are English** in the token source. Override with
  `labels` in either channel.
- **The locale is the page's**, not Dutch: the date picker's format and
  week start, the DataTable's collation and number parsing, the upload's
  sizes all read the nearest `lang` attribute, else the browser. Pass
  `locale` / `data-kp-locale` to override. `toDutch()` stays, deprecated.
- **`@kp-soft/themes/fx` no longer exports `BootSequence`**; import it from
  `@kp-soft/themes/fx/boot-sequence`, which is the only place the optional
  `motion` peer is required.
- `ThemeSwitcher` renders the package's own class names, not Tailwind's.
- `Reorder`'s `onChange` receives `(order, { id, from, to })`;
  `Combobox`'s `onChange` receives `(value, values, action)`; `Tree`'s
  `onSelect` still fires on a leaf, and `onSelectedChange` beside it.
- `GridLayout` describes a tile's geometry (`aria-describedby`) instead
  of overwriting its `aria-label`.

### Everything is a knob

Every React component forwards a ref, passes `className`, `style` and the
rest to its root, takes `classNames` for its parts, and holds every state
controlled or uncontrolled through `hooks/use-controllable`. Every
framework-free `attach…()` returns a detach with `handles` whose state is
readable and settable, takes its behaviours as options and `data-kp-*`
attributes, dispatches an event with a detail on every change, and
restores what it changed on detach. Every literal in the CSS a site might
change is `var(--kp-…, <default>)` — 116 of them. README "Everything is a
knob" has the five rules; the per-component list is in the sweep record.

### Repairs found by the audit

`onUndo` on `Button` is invoked at last (it was declared and dead for two
versions). Contract enforcement is recoverable (D7). The skip link moves
focus (`skipTo`, `attachSkipLinks`). The print rule and the forest drift
addressed the wrong pseudo-element. Toasts sat under the texture layer.
`attachDialogs` and `attachTabs` double-bound on a second call. DataTable's
detach left the rows sorted. `no-flash.js` mutated the document on import.
`ShortcutSheet` rendered an empty heading. `EmptyState` discarded its
action when filtered. Tree ids collided across instances. The React
upload's progress bar was pinned at 0. Disabled combobox options were
selectable. `TOAST_MS` was exported and unused. Nested `StringsProvider`s
replaced each other. `data-kp-keys` was documented and never read.

### New

The theme picker groups light and dark with a label per section, in both
channels (TH63). `js/locale.js`. `hooks/use-controllable.js`.
`configureTheme()`. Pointer drag on Reorder and GridLayout. Min, max and
disabled days on both date pickers. Server mode on DataTable
(`totalRows`). Pagination with an ellipsis. Manual and vertical tabs.
Tooltip delays and Escape. Toast variants, actions and auto-dismiss.
Accordion single mode. `beforeStep` on both wizards. `accept`, `maxFiles`
and a validator on both uploads. Command groups in both palettes.

### Kept, on purpose

Three animation durations stay literals: the cursor blink, the skeleton
pulse and the cyberpunk flicker change luminance, and DI5 pins them above
the flash threshold. `STRINGS_NL` is unchanged pending a decision.

## 2.0.0 — 2026-09-05

**The words on screen changed from Dutch to English.** That is the whole
breaking change, and `STRINGS_NL` is the one-line undo. See MIGRATION.md.

Correction KT5. Every user-visible string in the package was written into
the component that renders it, in Dutch, with no way for a consumer to
pass a different one. The fault is not the language — a hardcoded English
string is the same defect — it is that there was no door. JobTracker had
adopted only the components that carry no text at all, which is what the
defect looks like from outside.

### One dictionary

`js/strings.js` holds all 72 keys with English defaults, frozen. Keys that
vary take arguments — `tableRowsFiltered(shown, total)`, `removeNamed(name)`,
`wizardStep(at, of)` — so a consumer can reorder for their own grammar
instead of concatenating ours.

`STRINGS_NL` exports the Dutch that used to be the default, for kyu,
almanac and kp-soft.

### Three ways in, nearest wins

A `strings` prop on any component, a `StringsProvider` from
`hooks/use-strings.jsx` for a subtree, or `setStrings()` globally for the
framework-free channel. Every override is partial. A consumer who does
nothing gets English.

### The screen-reader half

The announcements are the part of this that matters most, because they
fail silently and only for the people who cannot see that they failed. A
copied value announced `` `${value} gekopieerd` ``; the DataTable
announced its filtered row count in Dutch into an `aria-live` region.
Both now come from the dictionary, and the gate does not know they are
special: they are strings.

### `js/contrast.js` is public

The WCAG primitives moved out of `gates/colour.mjs` so a consumer measures
a ratio with the same code our gate measures it with, rather than a second
opinion. `gates/colour.mjs` re-exports from it, unchanged for anyone
importing it there.

### Every field type, not only a text box [TH61]

`FormField` took a `type` prop and rendered an `<input>` whatever it was
told, so a real form grew a hand-written half beside it — without the
label, the error and the `aria-describedby` wiring that are the point of
the component. It now renders `select`, `textarea`, `checkbox` and
`radio` as what they say, and passes `options` through for the two that
need a list.

A radio group is a group: a `<fieldset role="radiogroup">` with the
question as its legend. That has three consequences the suite pins.
The summary counts it once rather than once per button. It is named by
its legend rather than by one of its answers — "How do we reach you?",
not "Email". And the group carries `aria-invalid`, because putting it on
one radio says the wrong thing about the others.

The framework-free channel already validated anything the browser
validates, since it works on `form.elements`. What it did not know was
that a radio group is one question; it does now, so both channels answer
the same.

`Form` itself was collecting only `HTMLInputElement`, so a required
select nobody chose from was thrown away before the summary looked at it.

### A consumer's own link component [TH62]

`NavBar`, `Breadcrumb` and `Pagination` take `linkComponent`, defaulting
to `'a'`. A plain anchor is correct HTML and reloads the page, which is
right for a server-rendered site and wrong inside React Router or Next,
where every click would throw the state away.

The skip link is deliberately not routed: it is a same-page anchor, and
sending it through a router turns the one link a keyboard user needs into
a navigation.

Kenny asked for this on `NavBar`. `Breadcrumb` and `Pagination` had the
same hardcoded `<a>`, and a measure written for the place a fault showed
rather than for the property it has meets you again somewhere else.

### The gate

`npm run check:strings` reads our source and refuses a user-visible
literal that does not come from the dictionary — the same shape as the
layer gate. It matches sinks rather than shapes: where a literal _goes_
(`textContent`, `placeholder`, `setAttribute('aria-label', …)`, JSX
attributes and text nodes, and a bare literal inside a JSX expression),
not what it looks like.

Drilled red in all four of those shapes before it was trusted. It passed
the fourth on the first attempt — the sr-only case, which is the one KT5
exists about — and was fixed. The drills are frozen in
`gates/gates.test.mjs` so the exemptions cannot widen back over them.

## 1.2.0 — 2026-09-04

Twenty-two components, in both channels. Kenny asked for a DataTable and
"top of the line forms", then went through
<https://github.com/brillout/awesome-react-components> with me and rated
the rest.

### The two that were asked for

**DataTable** — sorting, global filtering, pagination, row selection, an
empty state, and a narrow layout where each row becomes a card carrying
its column names. Measured against TanStack Table's feature list, which
is what "best in 2026" means. Deliberately without virtualisation,
in-cell editing or export: that is a grid, a different product, and the
decision is recorded rather than forgotten.

The features were the easy part. `aria-sort` lands on the sorted column
and nowhere else, the row count after a filter is announced, a number
column sorts as numbers, and the header checkbox goes indeterminate on a
partial selection — because a box reading "checked" while one of three
rows is selected is a lie.

**Forms** — the browser already validates; what it does not do is put the
message where a screen reader will read it, gather the errors, or move
focus to them. The summary takes focus rather than merely appearing,
`aria-describedby` is appended to rather than replaced, and validation
reports on blur. Telling someone their email is invalid while they type
the third character is technically true and practically hostile.

### The rest of the round

Combobox and tag input on a shared listbox engine, with virtual focus.
Command palette and shortcut sheet, together, because a palette without
discoverability is a secret. Tree, drag-to-reorder and split pane — all
keyboard-first, no drag library. Date picker, file upload, step wizard.
Empty states that know the difference between "nothing yet" and "nothing
matched", optimistic actions with undo, status parts, a copyable value
and a diff view.

A movable grid layout where every gesture has a keyboard equivalent and
the keyboard one is what the tests drive.

And a colour picker that reports the WCAG contrast ratio of the chosen
colour against the current theme's background, using the same function
the contrast gate uses. That is the one thing a colour picker inside a
theme system can do that a general-purpose one cannot — and a picker that
shows a colour without saying whether anyone can read it is how the
unreadable colours got in.

### What the suites found

Every one of these was found by a test or by the showcase, not by review:

- The two channels disagreed about what a choice is: Enter took `banaan`
  in one and `Banaan` in the other, because the framework-free half
  conflated an option's label with its value.
- Two command palettes on one page both answered Ctrl+K and stacked two
  modal dialogs.
- The React palette kept the old query when opened any way other than the
  shortcut, while the other channel had already cleared it.
- The React form gathered a summary and left the FIELDS unmarked — no
  `aria-invalid`, no per-field message, no blur validation. Four
  assertions failed at once.
- Reorder moved focus with a document-wide query and landed in the other
  channel's list.
- And the showcase found, within a minute, that the combobox input
  overflowed its wrapper by 10 px: at 320 px that pushed the page
  sideways and DI11 went red on all eleven themes. Every browser test had
  been green; the fixture pages were not narrow enough to notice.

### Also

`js/contrast.js` is new and public: the colour primitives moved out of
`gates/`, which is the package's own tooling, so a consumer gets the same
contrast measurement rather than a second opinion.

418 browser tests in Chromium and Firefox, 25 unit tests, 59 export paths.

---

## 1.1.0 — 2026-09-04

Types, and the promise that a version does not move under you.

**Everything here came from a consumer, on the day 1.0.0 shipped.**
JobTracker adopted it and could not: the package carried no type
declarations at all — no `types`, no `typings`, not one `.d.ts` — while
the README, the user guide and the ecosystem entry all promised a `Theme`
type. Their own code was clean; all seven errors were in ours.

### The package ships types

A `.d.ts` beside every entry point, generated from the JSDoc sources and
held in step by a gate, the same contract as the stylesheets and the Home
Assistant themes. `index.d.ts` is published too, which it would not have
been: `files` named `index.js` as a file rather than a directory, so the
main entry point would have arrived without types a second time. The gate
found that before the release did.

### `Theme` is the eleven names, not `string`

It was `@typedef {string} Theme`, which meant the type promised something
it did not deliver: `applyTheme('formeel')` type-checked and then fell
back to `formal` at runtime. It is the generated union now.

Only the OUTPUTS narrowed. What a function accepts stayed lenient —
`storeTheme` and `initializeTheme` still take a plain string — because
narrowing an input breaks a consumer that reads a theme out of config or a
database, which is what JobTracker and kp-soft both do. Narrowing a return
value cannot break anyone. Use `isTheme()` to narrow a string you hold.

That change is why this is 1.1.0 rather than 1.0.1.

### One real defect, found by a stricter compiler

`tabs[index].focus()` in the tab-list keyboard handler had no guard. Under
`noUncheckedIndexedAccess` it is a type error; in a browser it is a thrown
`TypeError` that stops the key handler on an out-of-range index.

### A gate that checks what a consumer gets

`npm run check:types` type-checks OUR sources with OUR resolution — bundler,
`noUncheckedIndexedAccess` off — and could never have seen this. The new
gate packs the tarball and asserts that every published entry point carries
a declaration inside it.

It does not pretend to be a consumer's type checker. Two attempts to build
that could not fail — the first fell back to the `.js` beside the missing
`.d.ts`, the second because TypeScript 7 infers types from a dependency's
JSDoc where JobTracker's compiler does not — and a check that cannot fail
is the one thing this project has a rule against.

### Documentation that matched the decisions

The README still documented an npm setting and a Tailwind `@source` as
requirements after both were struck, and still pinned `#v0.1.1`. It now
says what this package is: a source, with one promise.

**A released version of a theme never changes.** The token values of `dark`
at v1.0.0 are its values at v1.0.0 forever; any change raises the version,
including a correction of a value that is plainly wrong. Pin one and stop
thinking about it. Every release carries a version number, a provenance
line and `SHA256SUMS`, and that is the whole of what a consumer can rely on
mechanically.

Also: how to keep another framework's theme flag in step using the theme
event, without a second list of which themes are dark — two consumers were
found keeping one, and both had it wrong. And why a theme switch can look
stuck in a browser that renders no frames.

---

## 1.0.0 — 2026-09-04

The first release of kp-themes as its own thing. v0.1.1 was the
extraction from kp-soft: seven palettes, a React hook, a switcher, and
one contrast check. This is a package.

**It is a breaking release, and the breaks are worth the price.** They are
listed with what each becomes in [MIGRATION.md](MIGRATION.md); the short
version is that a copy of every theme's colours used to live in
JavaScript, and it is gone.

### Two channels, sharing one state

React for a consumer with a build step, and framework-free — CSS classes
plus a `<script type="module">` that attaches behaviour to markup your own
server wrote. They render the same class names and share the same state,
so a page can mix them and nothing betrays which is which.

That state lives on the document rather than in a React module, which is
what makes it possible: a plain `<script>` cannot reach a React closure,
so two pickers on one page would each have set the theme correctly and
each failed to update the other's mark. A change from either is announced
as one DOM event, and a choice made in another tab arrives on the same
one.

### Eleven themes

The seven that came from kp-soft — formal, light, dark, cyberpunk,
pastel, terminal, forest — and four that fill gaps the set had:

- **high-contrast** — black on white with one signal yellow. The only
  theme here whose reason is not taste.
- **sepia** — warm parchment and brown ink, no cool hue in the reading
  surface. The restful one.
- **blueprint** — cyan on Prussian blue, ruled like a technical drawing.
  Topo is a map; this is the drawing of a thing that does not exist yet.
- **solstice** — warm dark: charcoal, amber and rust, for the reader who
  finds dark clinical and cyberpunk loud.

Each has an anatomy document saying what it is, what is load-bearing, and
what it deliberately does not do. Colour choices come from those
documents rather than from taste.

### A theme is complete now

Links, visited links, text selection, code, kbd, mark, blockquote, list
markers, placeholders, invalid fields, the checkbox tick, and a print
stylesheet. Before this, a consumer who took the palette and wrote
ordinary HTML got a themed page with browser-default holes in it — the
browser's own link blue scored 1.99 against the dark theme's background,
where 4.5 is the floor.

Eighteen components in both channels: button, badge, table, alert, form
field, card, navigation bar, and the eleven overlays. Two of their
contracts are enforced rather than documented — a destructive action must
offer an undo or a confirmation, and a badge whose colour means something
must also say what it means.

### Motion is part of a theme's character

`--fx-duration`, `--fx-ease` and `--fx-lift` were declared by every theme
and used by nothing. Every transition reads them now: terminal steps
rather than eases, because a character display jumps; pastel overshoots;
formal, sepia and high-contrast do not move things at all. Each theme has
at most one gesture of its own, and two have none on purpose.

### Home Assistant

`ha/kp-*.yaml` is the same eleven themes as Home Assistant themes,
generated from the same token sources, so a dashboard and a web page mean
the same thing by "primary". Where card-mod is installed they carry the
theme's timing too.

### Eleven gates, and a rule about them

Contrast, the design invariants, the flash threshold, reduced-motion
guards, token parity, layer discipline, the type check, and whether the
generated files still match their sources — all in Node, all under a
second, all blocking a commit. A behaviour suite of 182 tests runs in
Chromium and Firefox.

Every one of them has been shown red on a deliberately injected violation
before being trusted, because one check in this project was written,
reported as built, and never ran once.

### What they found

Not theory. Each of these was live in the code:

- `fx-flicker` made 5.5 opposing luminance changes per second where
  SC 2.3.1 allows three.
- The focus ring measured 1.00 — identical luminance — against a primary
  button in three themes.
- `--color-scheme` was declared by every theme and applied by nothing, so
  the browser drew light scrollbars over every dark theme.
- 42 colour literals duplicated tokens, three of which had already
  drifted from the token they came from.
- The pressed state was invisible in cyberpunk and terminal.
- `--chart-4` in pastel sat at 2.20 against the page where 3.0 is the
  floor: a chart series nobody could see.
- The whole framework-free channel was missing from the published
  package, found by the first field test.
- Both typefaces a theme declares were applied almost nowhere, so a
  vendored copy rendered in Times New Roman.

### Also

MIT licence. Checksums beside the release tag, because kyu and almanac
vendor the stylesheet and have no npm to verify anything for them. A
showcase at <https://kennypassenier.github.io/kp-themes/> showing all
eleven themes and everything in them.

---

## 0.1.1 — 2026-09-02

Extraction from kp-soft at commit `2983abb`: the seven themes, the
registers, the cyberpunk effects, the theme hook and switcher, the
contrast check, and the seven status-colour tokens JobTracker needed.
