# Text-against-edge audit, all 16 themes (Firefox)

Tool: `research/cyberpunk-applied/_audit/edges.mjs <theme|all>`. For every visible text node on every catalogue page and the applied demo it measures the distance from the glyph box to the visible edge of the nearest ancestor that paints its own background, border, outline or clip-path, per side, and flags text closer than 4 px (8 px for a plate, 2 / 4 px on the vertical sides because the font box is taller than the glyphs). Exclusions are listed at the top of the script (diff lines, key figures, review chrome, bare underlined links, progress/meter/skeleton/spinner, boxes painted by borders alone judged only on their bordered sides, background-image-only boxes judged left/right only).

Run 2026-10-12 after the shared tree fix (css/components.css `--kp-tree-inset`, 0.375rem start inset; cyberpunk 0.5rem, forest keeps its own 0.5rem). Nothing below was fixed: information for the all-theme package.

## Tree rows (the demo's `readings-0240.csv` complaint)

Selected/hover wash of a tree row touched the text before the fix in 15 of 16 themes (structure page: 1 finding each, nostromo 3; cyberpunk's demo: 4 leaf rows). After: 0 tree findings in all 16 themes. Forest was already clean (own 0.5rem start padding, unchanged).

## Counts per theme (after) and the first ten

| theme     | findings | (tree rows before) |
| --------- | -------- | ------------------ |
| blueprint | 7        | 1                  |
| brutalism | 20       | 1                  |
| cyberpunk | 2        | 4                  |
| dark      | 13       | 1                  |
| deco      | 10       | 1                  |
| forest    | 7        | 0                  |
| formal    | 6        | 1                  |
| grotesk   | 12       | 1                  |
| light     | 5        | 1                  |
| nostromo  | 20       | 3                  |
| pastel    | 11       | 1                  |
| phantom   | 6        | 1                  |
| solstice  | 6        | 1                  |
| synthwave | 6        | 1                  |
| terminal  | 11       | 1                  |
| titanium  | 12       | 1                  |

### blueprint (7)

- data: "warning" in `span.kp-log__level` (background): top 1.4, bottom 1.4
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4, bottom 1.4
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4
- navigation: "Section 2" in `div` (plate/border): bottom 0.9

### brutalism (20)

- data: "warning" in `span.kp-log__level` (background): top 1.4, bottom 1.4
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4, bottom 1.4
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4
- data: "Keyboard shortcuts" in `h2.kp-dialog__title` (background): top -0.5
- data: "The spec's cases (gap 16 px, smallest ti" in `table.kp-table` (plate/background): top 1.5
- navigation: "Overview" in `a.kp-sidenav__link` (background): bottom 1.5
- navigation: "Line 2" in `a.kp-sidenav__link` (background): bottom 1.5

### cyberpunk (2)

- navigation: "Overview" in `a.kp-sidenav__link` (background): right 1.7
- navigation: "Line 2" in `a.kp-sidenav__link` (background): bottom -0.5

### dark (13)

- data: "warning" in `span.kp-log__level` (background): top 1.7
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.7
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- data: "Ctrl K" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "?" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "J" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "Shift L" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- navigation: "Section 2" in `div` (plate/border): bottom 1.0

### deco (10)

- data: "warning" in `span.kp-log__level` (background): top 1.5
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- data: "Ctrl K" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "?" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "J" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "Shift L" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- navigation: "Overdue" in `nav.kp-sidenav` (background): right -0.3

### forest (7)

- data: "warning" in `span.kp-log__level` (background): top 1.5
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- navigation: "Section 2" in `div` (plate/border): bottom 0.9
- navigation: "Alarms" in `a.kp-sidenav__link` (outline): right 1.8

### formal (6)

- data: "warning" in `span.kp-log__level` (background): top 1.4, bottom 1.4
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4, bottom 1.4
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4

### grotesk (12)

- data: "warning" in `span.kp-log__level` (background): top 1.7
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.7
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- navigation: "Overview" in `a.kp-sidenav__link` (border): bottom 1.0
- navigation: "Line 2" in `a.kp-sidenav__link` (border): bottom 1.0
- navigation: "Alarms" in `a.kp-sidenav__link` (border): bottom 1.0
- navigation: "All invoices" in `a.kp-sidenav__link` (border): bottom 1.0
- navigation: "Drafts" in `a.kp-sidenav__link` (border): bottom 1.0

### light (5)

- data: "warning" in `span.kp-log__level` (background): top 1.1
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.1
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4

### nostromo (20)

- data: "warning" in `span.kp-log__level` (background): top 0.9
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 0.9
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- data: "9/9" in `button.kp-calendar__day` (background): bottom 0.9
- data: "7/9" in `button.kp-calendar__day` (background): bottom 0.9
- motion: "at once under a copy that plays the exit" in `td` (plate/border): bottom 1.5
- motion: "," in `td` (plate/border): bottom 1.5
- motion: ") stays still, and only a row with a new" in `td` (plate/border): bottom 1.5

### pastel (11)

- data: "warning" in `span.kp-log__level` (background): top 1.7
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.7
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- data: "Ctrl K" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "?" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "J" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "Shift L" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- navigation: "Line 2" in `a.kp-sidenav__link` (background): bottom 0.3

### phantom (6)

- data: "warning" in `span.kp-log__level` (background): top 1.4, bottom 1.4
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4, bottom 1.4
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4

### solstice (6)

- data: "warning" in `span.kp-log__level` (background): top 1.4, bottom 1.4
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4, bottom 1.4
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.4

### synthwave (6)

- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0
- data: "backup" in `span.kp-log__source` (background): left 0.0
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0
- navigation: "Pump house 4" in `a.kp-nav__brand` (background): left 0.0, right 0.0
- navigation: "Overdue" in `nav.kp-sidenav` (background): right 2.0
- navigation: "Northwind" in `a.kp-nav__brand` (background): left 0.0, right 0.0

### terminal (11)

- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0
- data: "backup" in `span.kp-log__source` (background): left 0.0
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0
- data: "Ctrl K" in `kbd.kp-palette__keys` (border): top 1.5, bottom 1.5
- data: "?" in `kbd.kp-palette__keys` (border): top 1.5, bottom 1.5
- data: "J" in `kbd.kp-palette__keys` (border): top 1.5, bottom 1.5
- data: "Shift L" in `kbd.kp-palette__keys` (border): top 1.5, bottom 1.5
- data: "04" in `span.kp-calendar__num` (background): left 2.0, right 2.0, top -0.6, bottom -0.7
- navigation: "Line 2" in `a.kp-sidenav__link` (background): bottom 0.0
- navigation: "14" in `nav.kp-sidenav` (background): right 0.6

### titanium (12)

- data: "warning" in `span.kp-log__level` (background): top 1.7
- data: "09:41:06" in `time.kp-log__time` (background): left 0.0, right 0.0, top 1.4, bottom 1.4
- data: "backup" in `span.kp-log__source` (background): left 0.0, top 1.4, bottom 1.4
- data: "error" in `span.kp-log__level` (background): top 1.7
- data: "restic: snapshot failed, the lock is 41 " in `span.kp-log__message` (background): left 0.0, top 1.4, bottom 1.4
- data: "Ctrl K" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "?" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "J" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- data: "Shift L" in `kbd.kp-palette__keys` (background): top 1.5, bottom 1.5
- navigation: "Section 2" in `div` (plate/border): bottom -0.5

## What repeats (shared defects, for the package)

- `.kp-log__line[data-kp-current] > *`: the pointed-at log line washes every cell with no padding, text flush with the wash on left/right (components.css; cyberpunk fixed in its register with a 0.25rem padding and the same negative margin).
- `.kp-log__level` plates (warning/error words): 0 inline padding vertically, text closer than 2 px to the plate's top/bottom edge in several themes.
- `kbd.kp-palette__keys` and similar inline-block keys: no block padding.
- `.kp-sidenav__link` in the narrow side panel of the navigation page: label wider than the panel (cyberpunk's two remaining findings are this, overflow rather than an edge).
- Other one-offs are listed per theme above.
