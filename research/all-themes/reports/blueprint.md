# Blueprint: close = open reversed, and the trace on every part that opens

Changed: `css/blueprint-register.css` (only), the note "Applied 2026-10-13" at the end of `themes/blueprint/CHARACTER.md`.
Measured in Firefox only (`research/all-themes/_audit`). Before: `out/blueprint/pairs-before.txt`, `identity-before.txt`;
after: `out/blueprint/pairs.txt`, `identity.txt`, `tab-paint.txt`.

Result: **11 → 19 of 25 pairs pass**, **21 of 25** with the focus-return change in js/datepicker.js and js/sidenav.js that appeared in this worktree at 16:17 (not mine: the focus now goes back to the opener when the panel is gone, lesson 11); (the meter's list as of 16:05: the phone bar is one row now and holds the bar's close
timer; before, it was two rows, both failing, so the before run read 11 of 26); identity **3 → 14 of 14** parts open and close by the theme's own family
(`kp-sig-blueprint-*`, the dialog's scripted copy of it included). Tab stops: 41, NOMARK only "Review in a dialog" and
"Copy answer".

The theme's own motion, kept: the trace (`kp-sig-blueprint-trace` / `-trace-out`, 5 units = 800 ms, the plotter's feed,
inked at 75 %) for what opens (G3), the read-out (`kp-sig-blueprint-read`, 3 units = 480 ms) for a part that arrives or
leaves (G12 as applied 2026-10-08). No new effect was invented; every new rule borrows one of these two.

## Fixes

| # | Part | Cause | Change (selector) | Before | After |
|---|------|-------|-------------------|--------|-------|
| 1 | alert-close, upload-file, toast | lesson 19/23/24: leaves not asked of js/motion.js, fold of the old 1.25x/one-third timing | root block `[data-theme='blueprint']`: `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0` | alert-close open 0 / close 760 ms, 108.5 %; upload-file 760 / 0 ms; toast 800 / 1267 ms, 102.6 % | all three ok, 0.0 % (480/480, 480/480, 800/800) |
| 1b | toast | `--kp-open: normal` on the toast (a comment from the old fold timing: "466 ms of nothing") made the open trace-only while the close also folded the space | `:is(.kp-combobox__list, .kp-toast) { --kp-open: normal }` narrowed to `.kp-combobox__list`: the toast now arrives as its leave played backwards (trace and space together) | 84.1 % after step 1 | ok 0.0 % |
| 2 | tree | lesson 26: the shutting group was `display: none` at once | `.kp-tree [role='treeitem'][aria-expanded='false'] > / + [role='group'][data-kp-group-folding] { display: block }` (forest's two selectors) | open 0 / close 0 ms, 104.7 % | ok 480/480, 0.0 % |
| 3 | table-busy | (a) the read-out's `position: relative` for every arriving/leaving part took the absolute busy layer out of its place: it was read out under the table, folding space of its own (lesson 5); (b) the table's two dims (`[aria-busy]` 0.7 in css/layout.css, rows 0.55) switched in one frame while the layer is a transparent plate, so they were most of what the pair changes | `.kp-datatable > .kp-datatable__busy-overlay:is([data-kp-leaving],[data-kp-arriving]) { position: absolute }`; `:is(.kp-datatable[aria-busy='true'], … tbody)` and the leaving counterpart `.kp-datatable:not([aria-busy='true']):has(> .kp-datatable__busy-overlay[data-kp-leaving])` animate the dims on the feed in 480 ms (`kp-sig-blueprint-busy-dim` / `-dim-out`) | open 760 / close 0 ms, 268.7 % | ok 480/480, 4.3 % |
| 4 | calendar-busy | the busy layers came in by the package's 160 ms opacity fade and left at once | `:is(.kp-calendar__busy, .kp-calendar__day-busy) { --kp-calendar-busy-leave: hold }`; shown layers read out (`kp-sig-blueprint-read`, 480 ms) with the read's mask and pen; leaving layers `.kp-calendar > .kp-calendar__busy[data-kp-leaving]`, `.kp-calendar__day > .kp-calendar__day-busy[data-kp-leaving]` read back under a second name `kp-sig-blueprint-read-out` (the same keyframes: only flipping the finished arrival's direction showed its first frame at once), kept displayed and placed through the leave | open 160 / close 0 ms, 100 % | open 480 / close 480 ms, 100.4 % (see Still failing) |
| 5 | tour | the card opened by the package's `kp-tour-in` (160 ms fade); dim and ring 350/250 ms `ease` in, 1000 ms `ease-in` out | `.kp-tour[open]:not([data-kp-tour-stepping])` traced; root `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: var(--kp-sig-bp-panel); --kp-tour-dim-close-ease: var(--kp-sig-bp-feed)` (the feed is its own mirror); `[data-kp-tour-target]` ring keyframe `kp-sig-blueprint-tour-ring` + transitions on the panel time and feed, `backwards` (lesson 21); a stepped card plays nothing and keeps `position: fixed` under the read's update mark (`.kp-tour[data-kp-updating]`, lesson 5) | open 350 / close 1000 ms, 27.2 %; identity FADE (`kp-tour-in`) | ok 800/800, 0.7 %; identity OWN |
| 6 | palette | a bare fade (no `animation`) | `.kp-palette` traced like the dialog (`--kp-bp-ov: hidden`), its `::after` added to the pen's lists | ok 800/800 but FADE/FADE | ok 800/800, 0.1 %; OWN/OWN |
| 7 | datepicker (and dialog, drawer focus) | the trace hides the panel by `visibility: hidden` for 600 ms, so js/datepicker.js's focus on a day fell through: focus stayed on the opener, Escape never closed the panel (close 0 ms). The same hid the dialog's and the drawer's buttons from `showModal()`: focus went to `<body>` (probe: dialog and drawer `BODY` at 60 and 1060 ms) | `@property --kp-bp-ink` (top level, initial 1), written 0/1 by both trace keyframes at the ink (74.9 %/75 %); `:is(.kp-dialog:not(.kp-alarm), .kp-palette, .kp-datepicker__panel, .kp-tour, .kp-nav__menu, the phone bar's links) > * { visibility: visible; opacity: var(--kp-bp-ink) }`: the contents are focusable, painted only at the ink; the picture is unchanged | datepicker open 800 / close 0 ms, 100.2 %; focus BODY in dialog and drawer | datepicker 800/800, 7.0 % (see Still failing); focus lands on the dialog's button, the drawer's close, the day |
| 8 | bar-equipment (mega), hover dropdown | the mega menu had no animation either way; the hover dropdown faded in (160 ms) and closed at once in Firefox (lesson 36) | `.kp-nav__menu` open states (`li:is(:hover,:focus-within,[data-kp-nav-menu-open])`, the disclosure's `aria-expanded='true'`) traced; `li[data-kp-nav-closing]:not(...)` traced backwards and held `display: block`; `--kp-nav-close-time: 800ms` (no-preference; `0ms` under reduce); a registered `--kp-bp-hold` transition of 800 ms replaces the package's opacity fade and is what js/components.js waits for on the mega menu | bar-equipment open 0 / close 0 ms, 100 %; identity dropdown FADE/NONE, mega NONE/NONE | bar-equipment ok 800/800, 0.5 %; dropdown and mega OWN/OWN |
| 9 | phone-bar | no animation on the toggle's panel | in `@container kp-nav (max-width: 40rem)`: `.kp-nav:has(> .kp-nav__toggle)[data-kp-nav-open]:not([data-kp-nav-closing]) > .kp-nav__links` traced, `[data-kp-nav-closing] > .kp-nav__links` traced backwards (`position: relative` for the pen, the list is static there); nested menus draw nothing | open 0 / close 0 ms, 100 %; NONE/NONE | ok 800/800, 0.0 % (meter of 16:05, which holds js/components.js's close timer; the meter before it read 82.9 %, the timer firing between its paused frames); OWN/OWN |
| 10 | sidenav | lesson 31 checked: no clip; the content slides out of the stage's frame whole. The package's backdrop fade is a literal 220 ms against blueprint's 160 ms panel, so the pair's frames were out of step | `.kp-sidenav__backdrop { animation-duration: 160ms }` (literal, for the flash check) | open 220 / close 220 ms, 25.0 % | 160/160, 6.3 % (see Still failing) |

Identity before → after (open/close): dialog OWN/OWN → OWN/OWN; drawer OWN/OWN → OWN/OWN; palette FADE/FADE → OWN/OWN;
alarm OWN/OWN → OWN/OWN; datepicker OWN/NONE → OWN/OWN; combobox, theme-menu, row-actions OWN/OWN → OWN/OWN;
tour FADE/FADE (`kp-tour-in`, counted OWN by the summary's property rule) → OWN/OWN (the trace); sidenav OWN/OWN (the
package's slide) → unchanged; desktop-dropdown FADE/NONE → OWN/OWN; desktop-mega NONE/NONE → OWN/OWN; phone-frame and
phone-390 NONE/NONE → OWN/OWN. The remaining "ASYM" marks only name `-trace` against `-trace-out` (the same keyframes under
a second name) and the `--kp-bp-hold` clock.

## Deviations for Kenny

- **Command palette:** traced like the dialog (5 units, inked at 75 %), closing as the drawing backwards. Borrows the dialog's
  rule (G3 lists the dialog, not the palette).
- **Tour card:** traced like the dialog; the page's dim grows out of the target and the ring is drawn in, both on the panel's
  800 ms and the feed, and go back the same way. Borrows the dialog's trace; the dim's growth is forest's mechanism on
  blueprint's time and curve.
- **Phone bar:** its list of links is traced as a panel (outline, then inked) and drawn backwards on close; the toggle itself
  is unchanged. Borrows the header's menu (G3 names "the header's menu"; the phone panel was not decided).
- **Calendar busy layers and the busy table's dims:** read out and back in 3 units like any part that arrives (G12 as
  applied); the dims run on the feed with the layer. Borrows the read-out.
- **Focus during a trace:** a traced panel's contents are now visible to focus (and painted only at the ink) instead of being
  hidden with the panel. Nothing changes on screen; the focus lands where js/*.js puts it. A deviation only in mechanism.

## Still failing

- **datepicker 7.0 % and sidenav 6.3 % in the full run:** both were the focus coming back to the opener at the close's first
  frame (js/datepicker.js, js/sidenav.js), while the open had no ring there. With the focus-return change that appeared in the
  worktree at 16:17 (shared JS, not mine) they pass: datepicker 800/800, 3.0 %; sidenav 160/160, 0.2 % (`--only` re-run, so `out/blueprint/pairs-firefox.json` holds those two rows; `pairs.txt` is the full run before the change).
- **calendar-busy 100.4 %:** as forest (95-113 %): the days change their tone at the state change in one frame, and
  js/calendar.js empties the whole-month card's words at the same moment, so the leaving card is smaller than the arriving one.
  Both are shared JS / state, not the layer's motion.
- **wizard-step, empty-state, tabs-panel:** state changes, not pairs (ignored per brief).
- **Not asked, noted:** the side navigation still slides (the package's translate on blueprint's feed), not traced; the
  dialog's and palette's backdrops still take js/motion.js's `ease-in` fallback (lesson 16) though they mirror.

Measured wall time (Firefox, blueprint): pairs-meter full 2 min 52 s (old meter) and 2 min 30 s (re-run on the meter of 16:05),
phone-bar alone 7 s, datepicker and sidenav re-run 12 s, identity 1 min 7 s, tab-paint 1 min 18 s: 8 min 6 s; plus the targeted `--only` runs and probes while
fixing, not each timed (the first two measured 6 s and 37 s).

## Review round 1 (2026-10-13)

Judged in the review dialog's stage (Firefox, real mouse clicks at coordinates, every frame read by rAF and screenshot
bursts; tool `research/all-themes/_audit/_r2stage.mjs`, contact sheets `_r2sheet.mjs`).

**tour · "some weird behaviour when the first card opens … the closing animation is also bugged, the window just
disappears"**
- Cause 1 (the open): the card, added to the page, was also marked `[data-kp-arriving]`, and the reading of an arriving part
  (`kp-sig-blueprint-read`, specificity 0,5,0) beat the card's trace (0,4,0): the card was read out visible for 570 ms at
  (100, 375), with the read's `position: relative` putting a fixed card in the flow, then jumped to (57, 338), went hidden and
  traced again for 800 ms.
- Cause 2 (the close, and the open's empty 600 ms): in the stage the card is a child of the review dialog (a `.kp-dialog`),
  so the rule that keeps a traced panel's contents focusable (`.kp-dialog > * { opacity: var(--kp-bp-ink) }`) took the
  card's own ink (0 while it traces) for the card's opacity: the pen was hidden with the card. The card appeared at the ink
  and, closing, vanished at a quarter of the close with nothing drawn. The plain page (the pair meter's) never shows it.
- Change: `.kp-tour` added to the three `:not(...)` lists of the arriving/leaving read (mask, leave, arrival) and to the
  read's `::after`; the contents rule now ends `> :not(.kp-dialog, .kp-palette, .kp-tour, .kp-popover,
  .kp-datepicker__panel, .kp-combobox__list, .kp-toast)`.
- Evidence: rAF trace after the fix: one `kp-sig-blueprint-trace` 0 → 800 ms at (57, 338) from the first frame, no read, no
  jump; the close the same 800 ms reversed. Screenshots every 60 ms: the pen draws the card's outline on open and draws it
  back on close (`scratchpad/r2/kb/sheet-bp8.png`). Pair meter `tour`: ok 800/800 ms, 0.7 % (unchanged; it measures the
  plain page, where neither cause shows).

**calendar · "there is no loading animation?"**
- Cause: the busy layers are inked line by line by a mask `round(up, calc(var(--kp-bp-rp) * 100%), 1lh)`; css/components.css
  sets `line-height: 0` on both layers, so the step was 0, the round NaN, and Firefox computed the mask `100% 0%`: the
  whole content (the card's words, the compasses) masked away at rest. Only the layers' empty plates showed.
- Change: the step is `max(1lh, 1px)` in both mask rules (the general read and the calendar layers); identical wherever a
  line has height.
- Evidence: computed mask `100% round(up, 100%, 1px)`; screenshots after Loading show the whole-month card with its
  words and spinning compass and every loading day's compass, read out by the pen in 480 ms
  (`scratchpad/r2/kb/sheet-cal3.png`). Pair meter `calendar-busy`: open 480 / close 480 ms, 100.4 % (unchanged, the known
  forest-like state change, see Still failing above).

Full pair meter after the round: 22 of 25 pass, the same rows as before (calendar-busy, wizard-step, empty-state, tabs-panel
as listed). Wall time: full blueprint run 2 min 32 s; stage runs about 20 s each, eleven of them.


## Review round 2 (2026-10-13 20:37): the side navigation and the alarm

Kenny, verbatim: "sidenav: Niet de open/close animatie van dit thema" and "alarm: Niet de open/close animatie van dit thema".

### sidenav (over and push, `#fa-over`, `#fa-side` pushes, and the window-edge panels of research/sidenav-edge)

- **Cause:** the register gave the over/push panel no motion of its own, so it ran the package's plain slide from its edge
  (identity: transition:translate 160 ms on the feed (the package slide)).
- **Change:** it now opens as blueprint's dialog does, G3's drawing: the pen traces the outline from the top-start corner, along the top, down the end, back along the foot and up the start, each side on the feed, and at three quarters of 5 units (800 ms) the part is inked at once and the construction line lifted; the close is that drawing backwards. It no longer slides: `translate: 0 0` in every state, shut it is
  `visibility: hidden` (after the close's last frame). Keyframes: `kp-sig-blueprint-trace` on the panel (the dialog's keyframes; the pen and construction line on its ::after, run on the panel's own edge) and `kp-sig-blueprint-trace-out` with `reverse both` for the close; its rows stay visible to the focus and are painted by `--kp-bp-ink`, as the dialog's are. The content a push panel moves (and the edge
  tab) makes room at once when the panel is inked (a `linear(0, 0 75%, 1 75%, 1)` clock) and goes back at once when the ink lifts, a quarter into the close (G2: nothing slides): js/sidenav.js copies the panel's `translate` transition onto it, and the panel's `translate` never
  changes, so that transition is only the clock. The backdrop (where a page keeps one) takes the same time and curve.
  Selectors: `[data-theme='blueprint'] .kp-sidenav:is([data-kp-sidenav-mode='over'], [data-kp-sidenav-mode='push'])`, its
  `[data-kp-sidenav-open='true']` state and their `::after` (end of the `kp.signature` layer, under
  `prefers-reduced-motion: no-preference`; reduced motion keeps the package's instant show and hide).
- **Evidence:** identity `sidenav` row FAIL (NOT split) → ok (split, open and close), now kp-sig-blueprint-trace 800 ms; close kp-sig-blueprint-trace-out, reverse. Pair meter
  before: sidenav 160/160 0.2 %, sidenav-push 160/160, edge-push 160/160 1.0 %, -gutter 0.3 %, -over 0.3 %, alarm 800/800 0.0 %; after: sidenav 800/800 0.2 %, sidenav-push 800/800 0.0 %, sidenav-edge-push 800/800 0.0 %, -gutter 800/800 0.0 %, -over 800/800 0.3 %, -tab 800/800 0.3 %, sidenav-group 160/160 0.0 % (unchanged), alarm 800/800 0.0 %, dialog 800/800 0.0 %: 9 of 9. Seen in frames (review dialog stage, real clicks at
  coordinates, the animations paused and sought): sidenav: at 25 % a cyan line runs along the panel's top with the pen at its end, at 50 % down the end edge and along the foot, at 75 % the panel and its rows inked at once; the edge page's content jumps right in that same frame and back in the close's frame where the ink lifts. The alarm: the pen draws the frame round the screen (top, end, foot, start) over the page, then the red alarm is inked; the close untraces it.

### alarm (`.kp-alarm`, its panel and title)

- **Cause:** the register named no alarm motion, so it ran the package's script[opacity] on the plate, script[opacity,scale,translate] on the panel, script[opacity,scale] on the title, which js/motion.js replays
  and turns round.
- **Change:** `kp-sig-blueprint-trace` on `.kp-alarm[open]` with the pen on its ::after, laid on the alarm's frame (inset by the bar + 0.75 rem), so the pen constructs the frame and the screen is inked at three quarters; what it holds stays focusable and is painted by the ink; the frame's breathing glow moved from that ::after to `.kp-alarm__scan::after` with the package's own `kp-alarm-pulse`; the package's fade, rise and scale set to none. js/motion.js keeps this entrance and closes the alarm by playing it backwards in the dialog's
  close time, as it does the dialog. Respects `data-kp-alarm-motion='still'`.
- **Evidence:** identity now lists script[overflowX,overflowY,visibility,--kp-bp-ink,--kp-bp-nib,--kp-bp-pv,--kp-bp-r,--kp-bp-tv]@dialog.kp-alarm, exactly the dialog's own row. The audit's regex can only read keyframe NAMES, and js/motion.js
  replays every dialog-like entrance as an unnamed script animation, so the `alarm` row prints FAIL exactly as this
  theme's `dialog` row does; the property sets are the evidence. Pair meter: alarm 800/800 0.0 % (open =
  close, close the open reversed).

### Deviations for Kenny (this round)

- The push panel's content moves in one jump when the panel is inked (and back when the ink lifts) instead of travelling with a slide; borrowed from G2 ('when the line closes, the part is inked at once'), G3 does not name the page next to a panel. The alarm's breathing glow now sits on the scan layer instead of the alarm's own ::after, because the pen takes that pseudo-element as it does on the dialog.

Focus after the change (`tab-paint.mjs`): only "Review in a dialog" and "Copy answer" read NOMARK, as allowed.
Measured wall time of this round's runs (Firefox, four themes in parallel): identity + pairs before 1 min 23 s, after
1 min 31 s, tab-paint 1 min 15 s, frame sheets about 40 s each.
