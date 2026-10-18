# kpadopt56 shared proposals: the exact rules, with the measured numbers

Evidence page: `research/kpadopt56-shared/evidence.html` (Now beside Proposed, all twelve themes; start a static server on the repository root and open it, pick a theme at the top). Numbers: `node research/kpadopt56-shared/measure.mjs <port>` (Firefox, 12 themes; writes `measured.json`). Nothing in `css/components.css`, `js/` or a register has been changed: these are sketches Kenny decides per item.

Frames: a phone is 390 px wide with the part pages' 40 px margins (308 px of content); the desktop items use a 1280 px frame. "Over" is how far something runs past the frame's content edge, so the formal numbers differ a little from the 186/91 px of the findings (those were against the section edge). A cell is marked worse when the proposal is higher than now on a "lower is better" number, or lower on a "higher is better" one.

Cells where a proposal is worse than now, over all items and themes: **one**, S4 cyberpunk (a button 1 px past the card edge, where before it had a broken word).

## S1. Rule

File: `css/components.css` (next to `.kp-refresh` and `.kp-inspector`)

```css
.kp-refresh,
.kp-inspector { grid-template-columns: minmax(0, 1fr); }
.kp-refresh__chooser,
.kp-inspector__filter { min-inline-size: 0; max-inline-size: 100%; }

/* with it, a narrow request row stops tearing its badges: whole items wrap, the path gets a line */
@container kp-inspector (max-width: 40rem) {
    .kp-inspector__row { display: inline-flex; flex-wrap: wrap; align-items: baseline; }
    .kp-inspector__path { order: 1; flex: 1 0 100%; }
    .kp-inspector__time { margin-inline-start: auto; }
}
```
The package already scrolls a too-wide track (`.kp-segmented[data-kp-segmented-overflow]`); it never got to, because the grid track and the flex item grew to the track first. The third block is not optional: once the card has its real width the narrow request row tears "SUCCESS"/"TEST" in the wide-lettered themes (seen in cyberpunk while building this), which the sticking-out card had been hiding.

Measured, Now vs Proposed:

| theme | refresh bar over, px now | refresh bar over, px proposed |
|---|---|---|
| formal | 203 | 0 |
| dark | 278 | 0 |
| cyberpunk | 266 | 0 |
| synthwave | 294 | 0 |
| pastel | 205 | 0 |
| forest | 203 | 0 |
| blueprint | 285 | 0 |
| solstice | 203 | 0 |
| brutalism | 316 | 0 |
| deco | 327 | 0 |
| nostromo | 320 | 0 |
| titanium | 346 | 0 |

Request inspector at the same time:

| theme | filter bar over now | filter bar over proposed | rows cut by card now | rows cut by card proposed | badge words broken now | badge words broken proposed |
|---|---|---|---|---|---|---|
| formal | 99 | 0 | 93 | 0 | 0 | 0 |
| dark | 111 | 0 | 106 | 0 | 0 | 0 |
| cyberpunk | 113 | 0 | 89 | 0 | 1 | 0 |
| synthwave | 122 | 0 | 116 | 0 | 0 | 0 |
| pastel | 101 | 0 | 95 | 0 | 0 | 0 |
| forest | 99 | 0 | 93 | 0 | 0 | 0 |
| blueprint | 101 | 0 | 93 | 0 | 0 | 0 |
| solstice | 99 | 0 | 93 | 0 | 0 | 0 |
| brutalism | 140 | 0 | 133 | 0 | 0 | 0 |
| deco | 134 | 0 | 128 | 0 | 0 | 0 |
| nostromo | 116 | 0 | 110 | 0 | 0 | 0 |
| titanium | 123 | 0 | 117 | 0 | 0 | 0 |

Downside to say aloud: the track now scrolls sideways inside its bar (203 to 346 px of it is out of sight at 390, "Other..." included), where before the whole card stuck out. Recommended: change.

## S2. Rule

File: `css/components.css`, in the `.kp-badge--version` block

```css
.kp-badge--version { max-inline-size: 100%; box-sizing: border-box; }
.kp-version__from,
.kp-version__to { min-inline-size: 0; overflow-wrap: anywhere; }
```
A normal version still breaks only after a dot, hyphen, underscore or colon; `anywhere` bites only for a part wider than its place. Makes the per-register copies other helpers are writing for forest and blueprint unnecessary. Recommended: change.

Measured, Now vs Proposed:

| theme | badge over, px now | badge over, px proposed |
|---|---|---|
| formal | 228 | 0 |
| dark | 178 | 0 |
| cyberpunk | 266 | 0 |
| synthwave | 134 | 0 |
| pastel | 182 | 0 |
| forest | 199 | 0 |
| blueprint | 233 | 0 |
| solstice | 182 | 0 |
| brutalism | 283 | 0 |
| deco | 254 | 0 |
| nostromo | 250 | 0 |
| titanium | 226 | 0 |

## S3. Rule

File: `css/components.css`, `.kp-checklist__row` and `.kp-checklist__detail`

```css
.kp-checklist__row { grid-template-columns: auto minmax(0, 1fr) fit-content(50%); }
.kp-checklist__detail { white-space: normal; overflow-wrap: anywhere; }
```
(A first sketch, `max-inline-size: 50%` on the detail, did not work: a percentage inside an auto grid track resolves to nothing and the detail shrank to 66 px even in rows that were fine. `fit-content(50%)` keeps a short detail on one line.) Recommended: change.

Measured, Now vs Proposed:

| theme | label width, px now | label width, px proposed | labels broken now | labels broken proposed | list over, px now | list over, px proposed |
|---|---|---|---|---|---|---|
| formal | 8 | 104 | 2 | 0 | 0 | 0 |
| dark | 22 | 104 | 2 | 0 | 0 | 0 |
| cyberpunk | 49 | 104 | 1 | 0 | 0 | 0 |
| synthwave | 48 | 104 | 1 | 0 | 0 | 0 |
| pastel | 8 | 103 | 2 | 0 | 0 | 0 |
| forest | 0 | 98 | 2 | 0 | 4 | 0 |
| blueprint | 0 | 104 | 2 | 0 | 49 | 0 |
| solstice | 8 | 104 | 2 | 0 | 0 | 0 |
| brutalism | 0 | 102 | 2 | 0 | 56 | 0 |
| deco | 25 | 103 | 2 | 0 | 0 | 0 |
| nostromo | 0 | 104 | 2 | 0 | 31 | 0 |
| titanium | 0 | 104 | 2 | 0 | 78 | 0 |

## S4. Rule

File: `css/components.css`, `.kp-entity__actions`

```css
.kp-entity__actions { grid-template-columns: repeat(var(--kp-entity-cols, 4), minmax(min-content, 1fr)); }
.kp-entity__actions .kp-button { overflow-wrap: normal; }
```
Not a wrapping row: the actions row is one button high on every card by design (`--kp-entity-action-row`, five equal rows), so a second line was tried (flex-wrap) and rejected, it ran out of the card. Measured at 1280 with three cards, 22 rem minimum. Result: no word broken in any theme, but cyberpunk's four buttons need 1 px more than the card has (the fourth reaches the card edge). It stays that tight at the minimum card width; any narrower card, or a theme with wider buttons, would overflow instead of breaking. The robust cure is in `js/entity-card.js` (`columnsFor` counting real button widths and moving an action into "More", as `fitFlags` already does for flags). Recommended: change the CSS (cheap, no word breaks anywhere) and put the JS count on the list for the next release; do not treat the CSS alone as final.

Measured, Now vs Proposed:

| theme | words broken now | words broken proposed | past card edge, px now | past card edge, px proposed |
|---|---|---|---|---|
| formal | 0 | 0 | 0 | 0 |
| dark | 0 | 0 | 0 | 0 |
| cyberpunk | 6 | 0 | 0 | 1 |
| synthwave | 6 | 0 | 0 | 0 |
| pastel | 0 | 0 | 0 | 0 |
| forest | 0 | 0 | 0 | 0 |
| blueprint | 0 | 0 | 0 | 0 |
| solstice | 0 | 0 | 0 | 0 |
| brutalism | 6 | 0 | 0 | 0 |
| deco | 3 | 0 | 0 | 0 |
| nostromo | 6 | 0 | 0 | 0 |
| titanium | 0 | 0 | 0 | 0 |

## S5. Rule

File: `css/components.css`, `.kp-chart`

```css
.kp-chart { padding-inline-end: 3rem; }
```
The last date label is `text-anchor: middle` on the last tick (`js/chart.js` line 1598), so its right half lies outside the plot (15 to 26 px past the frame, by theme). CSS cannot address "the last tick" (ticks, labels and the median label are siblings of one element type), so the CSS fix gives the plot a margin on the right, 3 rem for the widest label measured (71 px wide in formal, so 36 px of half). Cost: the plot is 48 px narrower in every chart, whether or not a label sits at the end. The tidy fix is in `js/chart.js`: anchor the last tick `end` when it would pass the plot (and the first `start`; the first label sticks out 6 px at the left in formal). Recommended: do it in `js/chart.js`; if CSS only, take the padding but know it costs width everywhere.

Measured, Now vs Proposed:

| theme | last label past frame, px now | last label past frame, px proposed |
|---|---|---|
| formal | 26 | 0 |
| dark | 19 | 0 |
| cyberpunk | 15 | 0 |
| synthwave | 15 | 0 |
| pastel | 23 | 0 |
| forest | 23 | 0 |
| blueprint | 23 | 0 |
| solstice | 23 | 0 |
| brutalism | 23 | 0 |
| deco | 17 | 0 |
| nostromo | 20 | 0 |
| titanium | 22 | 0 |

## S6. Rule

File: `css/components.css`, next to `.kp-availability__column-row`

```css
.kp-availability__column-row:has(> .kp-availability__column-answers) { grid-template-columns: minmax(0, 1fr); }
```
The row that carries the answer buttons (yours) puts them under your name instead of beside it. In formal the name had 76 px; in cyberpunk, synthwave, brutalism and nostromo it had none. Recommended: change.

Measured, Now vs Proposed:

| theme | "Kenny (you)" width, px now | "Kenny (you)" width, px proposed |
|---|---|---|
| formal | 76 | 290 |
| dark | 5 | 290 |
| cyberpunk | 0 | 290 |
| synthwave | 0 | 290 |
| pastel | 76 | 290 |
| forest | 79 | 290 |
| blueprint | 76 | 290 |
| solstice | 76 | 290 |
| brutalism | 0 | 290 |
| deco | 7 | 290 |
| nostromo | 0 | 290 |
| titanium | 68 | 290 |

## S7. Rule

File: NOT the package: the demo frame (`research/kpadopt56/src/kpadopt5-basics/page.css`, `.kb-frame--stage`)

```css
.kb-frame--stage { block-size: 24rem; overflow: auto; }
```
Measurement: on the real part page (calm, formal, 390) the open non-modal dialog is 2446 px tall with 41 rows (2158 px at 1280) in a frame 384 px high: the frame has `min-block-size: 24rem` and `contain: layout`, the open dialog is `position: absolute` (UA default) and so does not make the frame grow. The same overflow exists at 1280; it is not a phone fault. With the empty sheet (0 rows) the dialog is 391 px in the 384 px frame (7 px). Opened as a modal (`showModal`, how the package is used) at 390 x 844 the dialog is `position: fixed`, top 19, bottom 825 of 844, `overflow-y: auto`, scrolling inside itself, in all twelve themes (pastel, caught mid-animation at first, settles to the same). Recommended: do NOT change the package; fix the demo frame if the sheet stays on a part page.

Measured, Now vs Proposed:

| theme | sheet out of frame, px now | sheet out of frame, px proposed |
|---|---|---|
| formal | 1816 | 0 |
| dark | 1792 | 0 |
| cyberpunk | 1138 | 0 |
| synthwave | 1118 | 0 |
| pastel | 1816 | 0 |
| forest | 1816 | 0 |
| blueprint | 1816 | 0 |
| solstice | 1816 | 0 |
| brutalism | 2057 | 0 |
| deco | 1795 | 0 |
| nostromo | 1118 | 0 |
| titanium | 2032 | 0 |

## S8. Rule

File: `css/titanium-register.css`, in the badge/tag rule at line 986

```css
[data-theme='titanium'] .kp-badge { border-radius: 0; }
```
Titanium only; its chamfer is a `clip-path` and a radius under it is an arc inside a straight cut. Every other theme is untouched (rows below show their own radii, identical now and proposed). Recommended: change (a register change, so a version raise per the project rule).

Measured, Now vs Proposed:

| theme | radius, px now | radius, px proposed |
|---|---|---|
| formal | 0 | 0 |
| dark | 999 | 999 |
| cyberpunk | 0 | 0 |
| synthwave | 2 | 2 |
| pastel | 999 | 999 |
| forest | 0 | 0 |
| blueprint | 2 | 2 |
| solstice | 10 | 10 |
| brutalism | 0 | 0 |
| deco | 0 | 0 |
| nostromo | 2 | 2 |
| titanium | 999 | 0 |

