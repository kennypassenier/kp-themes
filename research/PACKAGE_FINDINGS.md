- sepia: every .kp-button has scrollWidth 12 px above clientWidth (sepia register, also without any demo CSS; formal fine). Check for a cut label; candidate correction.
- chart: lapis and nostromo plain tooltip swatch under 3:1 against the popover; high-contrast info/warning event tones are white on white paper.
- strip: a stamp arrival scales the figure past its tile for 200-450 ms (demo only).
- calendar: the plain calendar needs 322-352 px; in a 334 px pane it overflows in every theme (package minimum day width).
- attention: the plain band item hairline (var(--border)) reads 1.1-1.4:1 against the plate in every theme.
- menu: in pastel the longest menu hint ("Stop and start both pumps, one after the other.") wraps to two lines in the plain menu (package/pastel font), also without demo CSS.
- kpi: the plain key-figure tile changes height between ready and loading (formal 103.7 to 112.2 px): the skeleton replaces value and trend with a different height.
- actions: in synthwave every row button in the plain action list is about 4 px too narrow (Rajdhani versus the column width js/actions.js measures): labels cut, also without demo CSS.
- actions: dark --border-strong reads 2.11:1 against the panel (known DI1 finding for dark).
- dark --border-strong itself reads ~2.1:1 against card/panel plates (DI1 finding, dark and titanium).
- menu: the plain destructive menu label (var(--destructive) on --popover) reads under 4.5:1 in solstice 3.74, deco 3.88, phantom 4.32.
- actions: button labels "Open" (high-contrast) and "Acknowledge"/"Open" (sepia, blueprint) overflow their button in height in the plain action list (scrollHeight > clientHeight), also without demo CSS.
- SYNTHWAVE BUTTONS (important): .kp-button labels are cut in synthwave in general (scrollWidth > clientWidth), e.g. "Export readings", "Schedule a visit", "More ▾" in the plain page header, also the action list; Rajdhani metrics versus the button box. Same class as the sepia 12 px button overflow.
- state word: plain dots in --success / --warning read ~1.0-2.9:1 against the card in retro and lapis (and others per group b); the package dot should use the -foreground ink or a ring.
- datatable busy overlay: drawOverlay() removes the overlay synchronously and the failed alert toggles [hidden] (display:none !important), so no leave can play; arrival works. A mirrored leave needs a leave() hand-off in js/datatable.js (package finding, Kenny rule: opposites mirror).
- tiles: plain .kp-card edge under 3:1 in light, cyberpunk, synthwave, pastel, titanium (2.58), nostromo; evenTileSet() floors per redraw, so a tile changes height between ready/loading/empty/error (10-25 px).
- kpi: the plain tile edge reads ~1.2-2.3:1; lapis good/bad delta 3.96:1 on the plain tile (.kp-kpi__delta[data-kp-tone]).
- menu: plain destructive/disabled-reason ink under 4.5:1 in nine themes (cyberpunk, synthwave, sepia, blueprint, solstice, deco, phantom, lapis, titanium); --border-strong under 3:1 against the popover in formal 2.97, dark 2.11, titanium 1.97.
- drawer: .kp-drawer__head / foot divider is var(--border) (under 3:1) in the package.

- **Chart loading under a plot overlay (nostromo, found 2026-10-06 in chart round 3).** `.kp-chart__plot` is `isolation: isolate` with its own `::after` at `z-index: 1` (nostromo's scanline wash), while `.kp-chart__state` stays at `z-index: auto`, so every loading picture painted under the wash and looked empty (Kenny: "loading didn't show anything for the three options"). The demo lifts the state box (`z-index: 2`, research/character-chart/round3-e.css); the port must give `.kp-chart__state` a z-index above any plot overlay in every register that draws one.

- **Calendar loading drawn per day is slow and hard to see (found 2026-10-06, calendar round 1).** High-contrast's "a spinner in each day" put one animation on each of the 42 day cells; Kenny: "barely visible" and "duurde wel vaak lang om te laden". A loading picture for the calendar is one picture over the whole month grid, with a few animated layers, not one animation per day (his rule of the same day: a loading animation uses all the space the element takes).

- **The graph's loading picture should be the ghost of the network (found 2026-10-06, graph round 2).** Kenny rejected every theme's loading: "it should be something based on the shape of the graph (nodes and lines), now it's too detached from the end result". js/graph.js draws one ellipse while loading. The demo (research/character-graph/demo.js `ghost()`, ghost.css) lays the coming network under it in the package's own classes with `--i`/`--n` for staggered motion, so the theme's shape draws it; the port moves that into js/graph.js (a ghost from the last layout, or a hub with a ring when nothing was drawn yet).

- **The key-figure strip has no arrival or live moment in the package (found 2026-10-06, columns decided).** Kenny picked an arrival and a live update per theme for the strip columns; the demo sets `data-cs-moment="arrive|live"` on the strip, but js/kpi.js only toggles `aria-busy`. The port gives js/kpi.js the same moments (after loading, after a changed figure) so the registers can key the picked motions on the package's own markup.

- **The tour's dimming is painted over by later siblings (found 2026-10-06, drawer round 2).** The tour dims the stage with a 100vmax `box-shadow` on `[data-kp-tour-target]`, which sets `z-index` without a `position`, so the target makes no stacking context and any later sibling with its own opaque background paints over the wash; the ring (an outline) stays visible. Measured on research/character-drawer with round 1's and round 2's highlight options alike. And `.kp-drawer__desc` takes a fixed `color: var(--muted-foreground)`, so a theme that fills the drawer's head must set the description's ink too, or it reads grey on the fill (terminal, brutalism, high-contrast round 1). Both belong in css/components.css at the port.

- **Cyberpunk's menu entries carry a dash on a line of their own, and closes never play (found 2026-10-06, menu round 3).** `[data-theme='cyberpunk'] .kp-menu__item::before { content: '— ' }` sits in the flow of `.kp-menu--rich`, so every rich entry gains a line (84px instead of 59px); the register should not apply it to rich entries. And a close that reuses its opening keyframes with `animation-direction: reverse` does not restart a finished animation: each close needs its own keyframes name.

- **A menu closes without its leave (found 2026-10-06, menu round 3).** js/menu-button.js hides an open menu at once on Escape, a pick and any click outside (a capture listener on the document), so no leave can play; Kenny's rule (21:40) is that every close is its open played backwards. At the port the package plays the leave (the arrival's keyframes reversed, restarted by clearing the animation for one frame, since a finished animation does not restart on a change of direction alone) and hides the menu on its end, as research/character-menu/demo.js `closeAll()` does.

- **A loading data table fades to 70 % (found 2026-10-06, busy round 3).** The package sets `opacity: 0.7` on the whole `.kp-datatable` while it loads, so every theme's busy panel reads washed out (grotesk's black turns grey). At the port the fade belongs to the rows under the veil, not to the panel.

- **Closes that are not their open reversed, measured in all 19 registers (found 2026-10-07, motion audit).** Measured per frame in Firefox (harness with every register, js/motion.js, overlays.js, menu-button.js; research/_review/measure-motion.mjs shows the method). Dialog, drawer and the toast's main plate mirror by construction in every theme. To fix at the port (Kenny's rule: every close is its open played backwards; fix, never ask):
    - Toast pseudo-elements: on arrival motion.js plays the reverse of their leave, but on the real leave `::before` does not move (forest, synthwave, blueprint, grotesk, nostromo) and/or `::after` jumps at the start of the close or does not move (formal, dark, synthwave, terminal, high-contrast, sepia, grotesk, titanium 12–87 %, phantom once 100 % off at the start). Suspected, unproven: the same animation name, so the browser does not restart it; fix generally in js/motion.js.
    - Tooltips of high-contrast (140 ms) and retro (500 ms): open = wait, then appear at once; close = stay, then vanish at once. The close must be the open reversed.
    - Near-mirrors to make exact: dark tooltip 18 % off in the last frame; forest dialog and drawer 13 % opacity in the last frame; grotesk dialog 8 % in the last frame; high-contrast toast 23–24 % off around 600 ms (opacity); titanium toast 10 % off.
    - No register animates `.kp-popover` / `.kp-menu--rich` yet: instant both ways (symmetric, but there is no menu motion to mirror; see the menu finding above).

## Release suite of 10.0.0 (2026-10-08): 67 failures, findings for 10.1.0

Kenny released 10.0.0 with these open (form suite-red). Not triaged: some expect the look before the character rounds, five are timeouts while the screenshot check ran alongside. Keyboard and sideways-scroll ones first.

- tests/auto-lazy.spec.mjs:188:5 › catalogue/chart.html ends up the same as with every module attached [scope-115] — Error: only in the lazy page
- tests/auto-lazy.spec.mjs:188:5 › catalogue/feedback.html ends up the same as with every module attached [scope-115] — Error: only in the lazy page
- tests/auto-lazy.spec.mjs:188:5 › catalogue/data.html ends up the same as with every module attached [scope-115] — Error: only in the lazy page
- tests/auto-lazy.spec.mjs:188:5 › catalogue/overlays.html ends up the same as with every module attached [scope-115] — Error: only in the lazy page
- tests/auto-lazy.spec.mjs:188:5 › catalogue/index.html ends up the same as with every module attached [scope-115] — Error: only in the lazy page
- tests/button-notes.spec.mjs:56:5 › cyberpunk: the charge sweep on every variant [scope-80] › every variant runs the sweep, in a colour at least 3:1 from the face it cross — Error: Save changes runs no sweep
- tests/button.spec.mjs:70:9 › the button › both halves of the focus ring reach .kp-button in every theme, framework-free [AR30] — Error: half a ring in:
- tests/button.spec.mjs:70:9 › the button › both halves of the focus ring reach .kp-button in every theme, React [AR30] — Error: half a ring in:
- tests/calendar.spec.mjs:40:1 › October back to February: six rows every month, all one height (I.1.7 1) [scope-143]; today's ring and a title on one line in 19 themes [fi — Error: locator.evaluate: Test timeout of 30000ms exceeded.
- tests/catalogue-review-dialog.spec.mjs:44:1 › the review dialog keeps one size over every block, with the cursor in the note on each [scope-90] — Error: a block taller than the stage scrolls inside it
- tests/catalogue-review-dialog.spec.mjs:492:1 › the review note stands before "Look at:" in the same scrolling frame, at its top when a block opens, in the look's font in — Error: the note shows
- tests/catalogue-review-dialog.spec.mjs:525:1 › a long review note scrolls in the frame with the look, opens at the top on every block and moves no button [scope-92] — Error: a long note makes the frame scroll
- tests/catalogue-review-dialog.spec.mjs:204:1 › a theme finished in the dialog walks on to the next theme, and the last one says the round is over [scope-113] — Error: expect(locator).toContainText(expected) failed
- tests/catalogue-review.spec.mjs:173:1 › a note on one page and a verdict on the review page share one prompt on a third page, and Clear prompt empties it — Error: expect(locator).toContainText(expected) failed
- tests/dark-themes-notes.spec.mjs:72:9 › titanium: a click is seen [Kenny's note, 2026-09-15] › every live button in Variants and States paints differently the moment it i — Error: Working…: hover settles
- tests/dashboard.spec.mjs:255:5 › both halves of the focus ring reach the destructive item in the row menu, every theme — framework-free [W4, AR30, DI2] — Error: blueprint: the keyboard lost the menu item
- tests/dashboard.spec.mjs:291:5 › the focus indicator PAINTS on the destructive item inside the menu, every theme — framework-free [W4, AR30] — Error: focus painted no ring in:
- tests/dashboard.spec.mjs:322:5 › the confirmation's buttons carry both halves of the ring, every theme — framework-free [W4, TH107, DI2] — Error: blueprint: the keyboard is not on Cancel
- tests/dashboard.spec.mjs:255:5 › both halves of the focus ring reach the destructive item in the row menu, every theme — React [W4, AR30, DI2] — Error: blueprint: the keyboard lost the menu item
- tests/dashboard.spec.mjs:322:5 › the confirmation's buttons carry both halves of the ring, every theme — React [W4, TH107, DI2] — Error: blueprint: the keyboard is not on Cancel
- tests/dashboard.spec.mjs:291:5 › the focus indicator PAINTS on the destructive item inside the menu, every theme — React [W4, AR30] — Error: focus painted no ring in:
- tests/datatable-add-filter.spec.mjs:335:9 › datatable add-filter mode — framework-free › every theme draws the menu, the editor and its calendar where they can be reached — Error: expect(received).toEqual(expected) // deep equality
- tests/datatable-more.spec.mjs:496:9 › datatable keyboard grid — framework-free › Enter on an editable cell edits it, Escape hands the focus back to the cell, and the focu — Error: expect(received).toEqual(expected) // deep equality
- tests/datatable-add-filter.spec.mjs:335:9 › datatable add-filter mode — React › every theme draws the menu, the editor and its calendar where they can be reached, inside — Error: expect(received).toEqual(expected) // deep equality
- tests/datatable-more.spec.mjs:496:9 › datatable keyboard grid — React › Enter on an editable cell edits it, Escape hands the focus back to the cell, and the focus ring sh — Error: expect(received).toEqual(expected) // deep equality
- tests/datatable.spec.mjs:834:5 › datatable — a group folds as its open played backwards › nothing in a table arrives on load, its pager bar is settled from the first fram — Error: locator.click: Test timeout of 30000ms exceeded.
- tests/fixtures.spec.mjs:43:9 › blueprint fixture › reflows at 320 px without sideways scrolling [DI11] — Error: the document scrolls horizontally at 320 px
- tests/fixtures.spec.mjs:149:5 › formal paints no colour that is not its own [KT8] — Error: expect(received).toEqual(expected) // deep equality
- tests/fixtures.spec.mjs:149:5 › light paints no colour that is not its own [KT8] — Error: expect(received).toEqual(expected) // deep equality
- tests/fixtures.spec.mjs:149:5 › pastel paints no colour that is not its own [KT8] — Error: expect(received).toEqual(expected) // deep equality
- tests/fixtures.spec.mjs:149:5 › forest paints no colour that is not its own [KT8] — Error: expect(received).toEqual(expected) // deep equality
- tests/fixtures.spec.mjs:149:5 › solstice paints no colour that is not its own [KT8] — Error: expect(received).toEqual(expected) // deep equality
- tests/focus-visible.spec.mjs:136:5 › cyberpunk: Tab to a button, a primary button, a field and a bar link, and a ring shows around each [fix-38] — Error: {"button":{"outside":0,"edge":0,"top":0,"bottom":0,"start":0,"end":0},"primary butt
- tests/focus-visible.spec.mjs:136:5 › terminal: Tab to a button, a primary button, a field and a bar link, and a ring shows around each [fix-38] — Error: {"button":{"outside":452,"edge":0,"top":0.56,"bottom":0.56,"start":0.56,"end":0.56}
- tests/kpi-columns.spec.mjs:82:1 › at 1280 px, every D7 row as the spec says, and the phone pane (D7) [scope-143] — Error: 4/600: row 2's heights
- tests/kpi-columns.spec.mjs:115:1 › in 19 themes, at full width, at 700 px and in a 334 px pane: one height in every state and set, every label one line and uncut, the fra — Error: expect(received).toEqual(expected) // deep equality
- tests/kpi-trend.spec.mjs:198:1 › in 19 themes, wide and in the phone pane: a figure in a tone and the change on their status pairs, and every label on one line, uncut, th — Error: expect(received).toEqual(expected) // deep equality
- tests/kpi-columns.spec.mjs:106:1 › at 390 px, every D7 row keeps the rules, with no sideways scroll (D7) [scope-143] — Error: locator.click: Test timeout of 30000ms exceeded.
- tests/meter.spec.mjs:20:1 › the fill, the tick, past the end and the tone, through setMeter() (C7.1–C7.3) [scope-143] — Error: expect(received).toEqual(expected) // deep equality
- tests/nav-ghost.spec.mjs:33:5 › solstice: a ghost and an icon button in the bar read against the bar [fix-77] — Error: ghost: oklch(0.929821 0.0138186 76.5791) on rgb(41, 34, 31)
- tests/nav-ghost.spec.mjs:91:5 › solstice: a hovered or focused ghost and icon button in the bar still read against what is under them [fix-82] — TypeError: object null is not iterable (cannot read property Symbol(Symbol.iterator))
- tests/nostromo-notes.spec.mjs:139:1 › bars in one group all start and end in the same column, in every theme [fix-64] — Error: three labelled bars stand in the group
- tests/nostromo-notes.spec.mjs:89:1 › the progress label reads at 4.5:1 on what is behind it, in every theme [scope-60] — Error: locator.evaluate: Test timeout of 30000ms exceeded.
- tests/nostromo-second-pass.spec.mjs:304:1 › a button hovered in a toast takes a shade of that toast’s own colour and reads at 4.5:1, in every theme [note 4] — Error: expect(received).toEqual(expected) // deep equality
- tests/redaction-cover.spec.mjs:331:5 › every redaction covers its phrase at three widths and after a resize under synthwave [fix-33] — Error: locator.scrollIntoViewIfNeeded: Element is not attached to the DOM
- tests/register-brutalism.spec.mjs:155:9 › the brutalism register, framework-free › the strip: a hovered item is the yellow plate with the line, and the cta lifts away fro — Error: expect(received).toBe(expected) // Object.is equality
- tests/register-brutalism.spec.mjs:155:9 › the brutalism register, React › the strip: a hovered item is the yellow plate with the line, and the cta lifts away from its sha — Error: expect(received).toBe(expected) // Object.is equality
- tests/register-grotesk.spec.mjs:227:9 › grotesk press label [grotesk-hover decision] › a pressed primary button's label reads at 4.5:1 or more on the press ground — Error: the grey press ground
- tests/register-grotesk.spec.mjs:227:9 › grotesk press label [grotesk-hover decision] › a pressed destructive button's label reads at 4.5:1 or more on the press ground — Error: the grey press ground
- tests/register-solstice.spec.mjs:215:9 › the solstice register, framework-free › a low sun rakes once across the touched control [scope-12] — Error: the sun rakes across
- tests/register-solstice.spec.mjs:215:9 › the solstice register, React › a low sun rakes once across the touched control [scope-12] — Error: the sun rakes across
- tests/register-terminal.spec.mjs:207:9 › the terminal register, framework-free › the shell line: a hovered item is inverse video, the cta is bracketed, the buttons are br — Error: expect(received).toBe(expected) // Object.is equality
- tests/register-terminal.spec.mjs:207:9 › the terminal register, React › the shell line: a hovered item is inverse video, the cta is bracketed, the buttons are brackets an — Error: expect(received).toBe(expected) // Object.is equality
- tests/registers.spec.mjs:95:9 › .kp-button--primary reacts to being pressed under blueprint [fix-12] — Error: blueprint: held down, the button paints exactly as it did hovered
- tests/registers.spec.mjs:95:9 › .kp-button reacts to being pressed under blueprint [fix-12] — Error: blueprint: held down, the button paints exactly as it did hovered
- tests/registers.spec.mjs:95:9 › .kp-button--destructive reacts to being pressed under blueprint [fix-12] — Error: blueprint: held down, the button paints exactly as it did hovered
- tests/registers.spec.mjs:95:9 › .kp-button reacts to being pressed under cyberpunk [fix-12] — Error: cyberpunk: held down, the button paints exactly as it did hovered
- tests/registers.spec.mjs:95:9 › .kp-button--primary reacts to being pressed under solstice [fix-12] — Error: solstice: held down, the button paints exactly as it did hovered
- tests/registers.spec.mjs:95:9 › .kp-button--destructive reacts to being pressed under solstice [fix-12] — Error: solstice: held down, the button paints exactly as it did hovered
- tests/site-more-examples.spec.mjs:34:1 › the table page shows its catalogue blocks beside its own examples — Error: expect(locator).toHaveCount(expected) failed
- tests/site-more-examples.spec.mjs:11:1 › the data table page shows every catalogue block, loading and failed among them — Error: expect(locator).toHaveCount(expected) failed
- tests/stamp-cards.spec.mjs:174:13 › sepia: the stamp lands on every labelled card, off its title [scope-98] › a plain labelled card of the package’s markup, at three widt — Error: expect(received).toEqual(expected) // deep equality
- tests/site.spec.mjs:106:1 › no documentation page scrolls sideways at 360px [DI11] — Error: these pages make the reader scroll sideways
- tests/surfaces.spec.mjs:163:9 › two surfaces in one theme [TH116] › every text on both surfaces clears its contrast floor under cyberpunk — Error: expect(received).toEqual(expected) // deep equality
- tests/surfaces.spec.mjs:163:9 › two surfaces in one theme [TH116] › every text on both surfaces clears its contrast floor under solstice — Error: not a colour: oklch(0.899913 0.0162407 76.5606)
- tests/tour.spec.mjs:40:1 › the tour end to end: an exact count, the card 12 px from its ringed target and following it, Esc, memory, decorate, ?tour (I.3.7 1-4, 6, 7) [sc — Error: expect(received).toEqual(expected) // deep equality
- tests/tour.spec.mjs:87:1 › on a phone: the card 16 px from both edges, the drawer at the end edge at full height, Help gets the focus back, the tab bar toured (I.3.7 5) [ — Error: expect(received).toEqual(expected) // deep equality
