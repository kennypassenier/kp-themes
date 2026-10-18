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



---

# The state faults (S9 to S14)

Found by the states round (`git show theme/t56-c:research/kpadopt56/designer-solstice-states.md`, its "shared" list); they are in formal too. Evidence: the same page, items 9 to 14; numbers: `node research/kpadopt56-shared/measure-states.mjs <port>` (Firefox, 12 themes, merges into `measured.json`). The page draws the real package components with their own setters in each state (cut-down data), so heights differ a little from the states round's (its frames were narrower or its lists longer); the faults and their direction are the same. States are pressed in the order ready, loading, empty, failed, as the part pages' buttons are. The Proposed side carries the S1 to S8 rules too, so a cell in a component those touch (the inspector, the checklist, the availability grid) can differ from Now for that reason; where a "worse" cell is flagged below, that is the cause I could not rule out (forest and synthwave in S10 are reproducible and I did not isolate them).

A "differs by" number is |height in the state - height with data|, lower is better. "Off the centre" is the distance of the busy card's centre from the component's centre.

## S9. A component holds the height it had while a state shows

Where the state is set: every data component writes its state as `data-kp-state` on its host (`js/uses-map.js:174`, `js/entity-card.js:436`, `js/checklist.js:360`, `js/notices.js:292`, `js/gallery.js:169`, `js/availability.js:384`, `js/request-inspector.js:515`), so no component has to change. Proposal, **JS** (new module `js/footprint.js`, one entry in `js/auto.js` for the components above, or for every `[data-kp-state]` host that is not a `.kp-card`): the sketch is `holdFootprint()` in `research/kpadopt56-shared/proposed.js`.

```js
export function holdFootprint(host) {
    let held = 0;
    const isReady = () => { const s = host.getAttribute('data-kp-state'); return !s || s === 'ready'; };
    new ResizeObserver(() => { if (isReady()) held = host.getBoundingClientRect().height; }).observe(host);
    new MutationObserver(() => {
        if (isReady() || !held) host.style.removeProperty('min-block-size');
        else host.style.setProperty('min-block-size', `min(${asMin(held)}px, var(--kp-footprint-max, 48rem))`);
    }).observe(host, { attributes: true, attributeFilter: ['data-kp-state'] });
}
```
(`asMin` takes padding and border off for a content-box host.) It is capped at `--kp-footprint-max` (48rem): a plate in the middle of 1000 px or more is out of sight. The first load has nothing to hold. No CSS can do this: the last ready height is a runtime value.

Limits, honestly: (1) the checklist draws "empty" as a ready list without rows, so the hold cannot see it; it already has its own floor `--kp-checklist-min-rows` (10), and the claim row numbers do not change (see below); (2) pastel's uses map is 89 px higher while loading than with data (its skeleton, a theme matter); a minimum never shrinks it.

Measured, difference from the loaded height, px (Now / Proposed), uses map and entity grid:

| theme | uses loading now | prop | uses empty now | prop | uses failed now | prop | entity empty now | prop | entity failed now | prop |
|---|---|---|---|---|---|---|---|---|---|---|
| formal | 12 | 0 | 188 | 0 | 188 | 0 | 202 | 0 | 202 | 0 |
| dark | 12 | 0 | 188 | 0 | 188 | 0 | 200 | 0 | 200 | 0 |
| cyberpunk | 12 | 0 | 188 | 0 | 188 | 0 | 196 | 0 | 196 | 0 |
| synthwave | 12 | 0 | 188 | 0 | 188 | 0 | 267 | 0 | 267 | 0 |
| pastel | 89 | 89 | 188 | 0 | 188 | 0 | 200 | 0 | 200 | 0 |
| forest | 12 | 0 | 12 | 0 | 188 | 0 | 200 | 0 | 200 | 0 |
| blueprint | 12 | 0 | 188 | 0 | 188 | 0 | 200 | 0 | 200 | 0 |
| solstice | 12 | 0 | 188 | 0 | 188 | 0 | 200 | 0 | 200 | 0 |
| brutalism | 12 | 0 | 188 | 0 | 188 | 0 | 208 | 0 | 208 | 0 |
| deco | 12 | 0 | 188 | 0 | 188 | 0 | 213 | 0 | 213 | 0 |
| nostromo | 12 | 0 | 188 | 0 | 188 | 0 | 200 | 0 | 200 | 0 |
| titanium | 12 | 0 | 188 | 0 | 188 | 0 | 200 | 0 | 200 | 0 |

Notices page (capped at 768 px; loaded 1043 px) and packing list (unchanged):

| theme | notices loading now | prop | notices empty now | prop | notices failed now | prop | claim empty now | prop | claim failed now | prop |
|---|---|---|---|---|---|---|---|---|---|---|
| formal | 459 | 275 | 459 | 275 | 459 | 275 | 136 | 136 | 136 | 136 |
| dark | 459 | 275 | 459 | 275 | 459 | 275 | 127 | 127 | 127 | 127 |
| cyberpunk | 459 | 275 | 459 | 275 | 459 | 275 | 152 | 152 | 152 | 152 |
| synthwave | 459 | 275 | 459 | 275 | 459 | 275 | 167 | 167 | 167 | 167 |
| pastel | 459 | 275 | 459 | 275 | 459 | 275 | 150 | 150 | 150 | 150 |
| forest | 459 | 275 | 459 | 275 | 459 | 275 | 178 | 178 | 178 | 178 |
| blueprint | 459 | 275 | 459 | 275 | 459 | 275 | 128 | 128 | 128 | 128 |
| solstice | 459 | 275 | 459 | 275 | 459 | 275 | 146 | 146 | 146 | 146 |
| brutalism | 459 | 275 | 459 | 275 | 459 | 275 | 175 | 175 | 175 | 175 |
| deco | 459 | 275 | 459 | 275 | 459 | 275 | 160 | 160 | 160 | 160 |
| nostromo | 459 | 275 | 459 | 275 | 459 | 275 | 162 | 162 | 162 | 162 |
| titanium | 459 | 275 | 459 | 275 | 459 | 275 | 127 | 127 | 127 | 127 |

Worse cells: none. Recommendation: **change via JS** for the matrix, entity grid, notices, gallery, availability and inspector; leave the checklist to its `--kp-checklist-min-rows` knob; decide the cap (48rem here).

## S10. The busy card centred over the whole component

Cause: each component hands `openBusyCard()` the part it thinks is the data. Findings, per component:

- **Gallery (real fault).** `js/gallery.js:266` passes `area: () => [grid]`, and while loading the grid is a 43 px strip of skeleton lines, so the card sits at the top and its panel (54 px) is cut at 43 px. Proposal, **CSS** (`css/components.css`, with the gallery's other rules): `.kp-gallery > .kp-gallery__busy { inset: 0; }` (or the one-word JS change `area: () => [el]`). The layer is already inside the gallery and positioned; the four offsets the script writes only say which part to cover, so `inset: 0` wins.
- **Claim row (21 to 40 px low), availability grid (78 px right):** by design. The card is centred over the rows or cells, the way the busy data table centres it over its rows and leaves the toolbar or the names column readable. Centring over the whole component would veil the toolbar and the names. Recommendation: leave.
- **Operations page:** no single data area; every card is its own area and lays its own card, centred in itself (the "own" column is 0 to 31 px). Recommendation: leave.
- **Request inspector at 390:** the 58 px (64 to 80 in the wide-lettered themes) was the S1 fault; with S1 the card is centred sideways (0 in all twelve).

| theme | gallery off centre (up/down) now | prop | inspector at 390, sideways now | prop | claim up/down now | prop | availability sideways now | prop |
|---|---|---|---|---|---|---|---|---|
| formal | 201 | 0 | 58 | 0 | 21 | 21 | 78 | 78 |
| dark | 202 | 0 | 64 | 0 | 37 | 37 | 78 | 78 |
| cyberpunk | 202 | 0 | 65 | 0 | 37 | 37 | 78 | 78 |
| synthwave | 202 | 0 | 70 | 0 | 37 | 37 | 78 | 78 |
| pastel | 202 | 0 | 59 | 0 | 22 | 22 | 78 | 78 |
| forest | 204 | 0 | 58 | 0 | 21 | 36 | 78 | 78 |
| blueprint | 202 | 0 | 58 | 0 | 20 | 20 | 78 | 78 |
| solstice | 202 | 0 | 58 | 0 | 21 | 21 | 78 | 78 |
| brutalism | 191 | 0 | 80 | 0 | 40 | 40 | 78 | 78 |
| deco | 199 | 0 | 76 | 0 | 38 | 38 | 78 | 78 |
| nostromo | 186 | 0 | 66 | 0 | 37 | 38 | 78 | 78 |
| titanium | 202 | 0 | 70 | 0 | 36 | 37 | 78 | 78 |

Operations page, first card against the page / each card against itself (px, now and proposed):

| theme | page up/down now | prop | page sideways now | prop | own card now | prop |
|---|---|---|---|---|---|---|
| formal | 155 | 155 | 204 | 204 | 19 | 19 |
| dark | 163 | 163 | 204 | 204 | 19 | 19 |
| cyberpunk | 161 | 161 | 204 | 204 | 19 | 19 |
| synthwave | 196 | 196 | 204 | 204 | 8 | 24 |
| pastel | 163 | 163 | 204 | 204 | 19 | 19 |
| forest | 163 | 163 | 204 | 204 | 19 | 31 |
| blueprint | 163 | 163 | 204 | 204 | 19 | 19 |
| solstice | 163 | 163 | 204 | 204 | 19 | 19 |
| brutalism | 152 | 152 | 204 | 204 | 19 | 19 |
| deco | 152 | 153 | 204 | 204 | 19 | 19 |
| nostromo | 163 | 163 | 204 | 204 | 19 | 19 |
| titanium | 163 | 163 | 204 | 204 | 19 | 19 |

Worse cells (Proposed higher than Now, in components these proposals do not touch, so the S1/S3/S6 rules or the S9 hold are the suspect): synthwave, forest and deco in the operations page's own-card column, forest and nostromo/titanium (1 px) in the claim row, forest in the availability grid and the inspector (42 to 71). The gallery has none. Recommendation: **change (CSS)** for the gallery; **leave** for the others.

## S11. A card's failure is a plate, not an alert row

Today `js/card-state.js buildNote()` makes the failure `.kp-alert.kp-card__failure`, an alert row (words left, Retry right) at body size, so it does not fill the stage. Proposal, **CSS + one class** (`css/components.css`, next to `.kp-card__failure`; or give the alert `kp-stateplate` in `buildNote` and drop the row rules): the card's failure takes the state plate's treatment.

```css
.kp-card__state:has(> .kp-card__failure) { align-content: stretch; }
.kp-card__state > .kp-card__failure {
    display: grid; place-content: center; justify-items: center; gap: var(--kp-space-sm, 0.5rem);
    box-sizing: border-box; inline-size: 100%; block-size: 100%; padding: var(--kp-space-lg, 1.5rem);
    font-size: var(--kp-stateplate-text, clamp(1.125rem, 1rem + 0.6vw, 1.5rem)); line-height: 1.35; text-align: center; text-wrap: balance;
}
.kp-card__failure > .kp-alert__body { justify-items: center; flex: none; }
.kp-card__state > .kp-card__failure .kp-card__state-title { font-size: var(--kp-stateplate-text, clamp(1.125rem, 1rem + 0.6vw, 1.5rem)); font-weight: 600; line-height: 1.35; }
.kp-card__failure > .kp-card__retry { min-block-size: 2.25rem; }
```
The title rule needs that specificity: nostromo and titanium (13 px) and solstice (20 px) set the title's size in their registers. Cost: the card grows while failed, because the plate needs room for a heading, a sentence and a normal Retry (quote 151 to 168 px; lede 215 to 229; synthwave's quote 180 to 214); today-card unchanged. The lede card's Retry goes from 28 to 36 px.

Measured (note fills the stage %, title px; Now / Proposed):

| theme | quote fill % now | prop | quote title px now | prop | today fill % now | prop | lede fill % now | prop | lede Retry px now | prop |
|---|---|---|---|---|---|---|---|---|---|---|
| formal | 65 | 100 | 16 | 24 | 31 | 100 | 63 | 100 | 28 | 36 |
| dark | 65 | 100 | 16 | 24 | 28 | 100 | 63 | 100 | 28 | 36 |
| cyberpunk | 65 | 100 | 16 | 24 | 28 | 100 | 63 | 100 | 28 | 36 |
| synthwave | 65 | 100 | 16 | 24 | 28 | 100 | 63 | 100 | 28 | 36 |
| pastel | 65 | 100 | 16 | 24 | 27 | 100 | 63 | 100 | 28 | 36 |
| forest | 65 | 100 | 16 | 24 | 28 | 100 | 63 | 100 | 28 | 36 |
| blueprint | 65 | 100 | 16 | 24 | 30 | 100 | 63 | 100 | 28 | 36 |
| solstice | 70 | 100 | 20 | 24 | 30 | 100 | 68 | 100 | 28 | 36 |
| brutalism | 76 | 100 | 16 | 24 | 30 | 100 | 73 | 100 | 28 | 36 |
| deco | 68 | 100 | 16 | 24 | 27 | 100 | 66 | 100 | 28 | 36 |
| nostromo | 61 | 100 | 13 | 24 | 27 | 100 | 59 | 100 | 28 | 36 |
| titanium | 61 | 100 | 13 | 24 | 27 | 100 | 60 | 100 | 28 | 36 |

Worse cells: none (the card height is information). Recommendation: **change**.

## S12. Small lines instead of a plate

- **Chart failed (real fault).** `.kp-chart__state[data-kp-state='error']` is a dot and a 13 px sentence, nothing painted, no action. Proposal, **CSS** (`css/components.css`, after the `.kp-chart__state` rules): tinted, bordered plate, heading size.

```css
.kp-chart__state[data-kp-state='error'] {
    padding: var(--kp-space-lg, 1.5rem); border: 1px solid color-mix(in oklab, var(--destructive) 55%, transparent);
    background: color-mix(in oklab, var(--destructive) 8%, transparent);
    font-size: var(--kp-stateplate-text, clamp(1.125rem, 1rem + 0.6vw, 1.5rem)); font-weight: 600; line-height: 1.35;
}
.kp-chart__state[data-kp-state='error'] .kp-chart__state-text { max-inline-size: 36ch; }
```
A Retry would be a small addition in `js/chart.js` (an event on the chart, like the other components); not in the sketch.
- **Usual picker empty and failed: not a fault.** Both are heading-size `.kp-stateplate` plates in the picker's list panel (100 percent of that panel, 24 px title). The 13 px line of the states round was the input row, the only part of the component outside the panel. Nothing to propose. (In dark, synthwave and titanium the empty plate has neither fill nor border, so the "painted plate" measure prints 0 there; the words are the same plate.)
- **Operations page failed (real fault).** The page keeps its stale cards and shows one 74 px attention band at the top (6 percent of the page). Proposal, **CSS** (`css/components.css`, with the `.kp-ops` rules): in `data-kp-state='error'` the cards go and the alert takes the body, centred.

```css
.kp-ops[data-kp-state='error'] > :is(.kp-ops__kpis, .kp-ops__toolbar, .kp-ops__body) { display: none; }
.kp-ops[data-kp-state='error'] > .kp-ops__attention { display: grid; flex: 1 1 auto; min-block-size: 24rem; }
.kp-ops[data-kp-state='error'] .kp-attention__item { grid-template-columns: minmax(0, 1fr); place-content: center; justify-items: center; text-align: center; padding: var(--kp-space-xl, 2rem); }
.kp-ops[data-kp-state='error'] .kp-attention__text > strong { font-size: var(--kp-stateplate-text, clamp(1.125rem, 1rem + 0.6vw, 1.5rem)); }
.kp-ops[data-kp-state='error'] .kp-attention__actions { justify-content: center; }
```
It relies on the page writing `data-kp-state` on `.kp-ops` (the demo does). The old text "What is shown is from earlier" no longer fits when the cards go. Cost: the stale data is no longer visible during a failure; if Kenny wants it kept, the band stays (today).

Measured (painted note, % of its area; title px; Now / Proposed):

| theme | chart fill % now | prop | chart title px now | prop | ops page fill % now | prop | ops page title px now | prop | ops page height now | prop |
|---|---|---|---|---|---|---|---|---|---|---|
| formal | 0 | 79 | None | 24 | 6 | 79 | 16 | 24 | 1232 | 768 |
| dark | 0 | 79 | None | 24 | 6 | 81 | 16 | 24 | 1217 | 768 |
| cyberpunk | 0 | 79 | None | 24 | 6 | 81 | 16 | 24 | 1207 | 768 |
| synthwave | 0 | 79 | None | 24 | 8 | 79 | 16 | 24 | 1412 | 768 |
| pastel | 0 | 79 | None | 24 | 6 | 81 | 16 | 24 | 1217 | 768 |
| forest | 0 | 79 | None | 24 | 6 | 81 | 16 | 24 | 1217 | 768 |
| blueprint | 0 | 79 | None | 24 | 6 | 81 | 16 | 24 | 1217 | 768 |
| solstice | 0 | 79 | None | 24 | 6 | 81 | 16 | 24 | 1217 | 768 |
| brutalism | 0 | 79 | None | 24 | 7 | 77 | 16 | 24 | 1279 | 768 |
| deco | 0 | 79 | None | 24 | 6 | 79 | 16 | 24 | 1229 | 768 |
| nostromo | 0 | 79 | None | 24 | 6 | 81 | 16 | 24 | 1217 | 768 |
| titanium | 0 | 79 | None | 24 | 6 | 81 | 16 | 24 | 1217 | 768 |

Worse cells: none. Recommendation: **change (CSS)** for the chart and the operations page; **leave** the usual picker.

## S13. Master-detail shows no failure at all

Not reproduced in the package. A failed detail pane draws `.kp-alert.kp-stateplate` over the whole detail area (85 percent of the component in the wide layout, 24 px title, a 36 px Retry) in every theme. The states round's "no failure" came from the demo page: `research/kpadopt56/src/kpadopt5-ops/demo.js` (`data-ko-md-state`) selects an item after the Empty button, which fires `kp-pane-select`, whose listener starts a load that ends 700 ms later in Ready, over the failed state it had just set. The fix is the demo wiring (do not reload on a selection made by the state button), not the package. Recommendation: **leave** (no package change).

| theme | detail plate fill % now | prop | title px now | prop | Retry px now | prop |
|---|---|---|---|---|---|---|
| formal | 85 | 85 | 24 | 24 | 36 | 36 |
| dark | 85 | 85 | 24 | 24 | 36 | 36 |
| cyberpunk | 85 | 85 | 24 | 24 | 36 | 36 |
| synthwave | 79 | 79 | 24 | 24 | 36 | 36 |
| pastel | 85 | 85 | 24 | 24 | 36 | 36 |
| forest | 85 | 83 | 24 | 24 | 36 | 36 |
| blueprint | 85 | 85 | 24 | 24 | 36 | 36 |
| solstice | 85 | 85 | 24 | 24 | 36 | 36 |
| brutalism | 85 | 85 | 24 | 24 | 36 | 36 |
| deco | 85 | 85 | 24 | 24 | 36 | 36 |
| nostromo | 85 | 85 | 24 | 24 | 36 | 36 |
| titanium | 86 | 86 | 24 | 24 | 36 | 36 |

## S14. Inline loadings have no busy card

The Proposed side lays the package's own busy card (`openBusyCard`) over each control to answer whether one belongs. It does not: the card is a spinner and a line of words on a plate, 42 to 84 px high, over controls 18 to 62 px high, so it covers the whole control (and the skeleton that shows the control's shape), and over a version badge it is up to three times as high as the line it sits in. The inline controls keep their own skeleton in place, which is exactly the shape of the loaded control; that is the right loading picture for them. The rule in DEMO_RULES chapter 4 is about data areas ("grid, matrix, week, timeline, list read as a whole"), which these are not. Recommendation: **leave**, and word the rule that way (a busy card belongs on a data area, not on a control one line high; an inline control loads as its own skeleton). The sentence field and the acknowledge gate are the same kind (one inline field, one checkbox line) and were not drawn here.

Card taller than the control, px (Proposed only; Now has no card):

| theme | slider card now | prop | time field card now | prop | version badge card now | prop |
|---|---|---|---|---|---|---|
| formal | 0 | 10 | 0 | 0 | 0 | 36 |
| dark | 0 | 8 | 0 | 2 | 0 | 32 |
| cyberpunk | 0 | 8 | 0 | 0 | 0 | 25 |
| synthwave | 0 | 8 | 0 | 2 | 0 | 32 |
| pastel | 0 | 8 | 0 | 0 | 0 | 22 |
| forest | 0 | 4 | 0 | 0 | 0 | 22 |
| blueprint | 0 | 8 | 0 | 2 | 0 | 32 |
| solstice | 0 | 8 | 0 | 2 | 0 | 34 |
| brutalism | 0 | 30 | 0 | 18 | 0 | 46 |
| deco | 0 | 14 | 0 | 6 | 0 | 36 |
| nostromo | 0 | 40 | 0 | 30 | 0 | 60 |
| titanium | 0 | 8 | 0 | 1 | 0 | 31 |

"Worse" is flagged on every row on purpose: it is the evidence for leaving.

## Summary of S9 to S14

| item | recommendation |
|---|---|
| S9 height held while a state shows | change via JS (hold the last ready height, cap 48rem); checklist: leave to its min-rows knob |
| S10 busy card centred | change (CSS) for the gallery only; claim, availability, ops: leave (by design); inspector: solved by S1 |
| S11 card failure | change (CSS + class) |
| S12 small lines | change (CSS) for chart and ops page; usual picker: not a fault |
| S13 master-detail failure | leave (the package is fine; the demo wiring hid it) |
| S14 inline loadings | leave (a card is larger than the control) |
