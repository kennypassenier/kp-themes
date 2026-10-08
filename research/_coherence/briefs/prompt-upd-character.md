# Update round of a character demo (generic prompt, then one section per theme)

You rebuild the reopened questions of a CHARACTER demo after Kenny's verdict. The demo research/THEME-character/ exists and was judged in the review dialog; he approved some questions and did not approve others. The designer has ALREADY rewritten the reopened questions in research/THEME-character/aspects.js (the `see` text of every option is the specification: build exactly that, in Kenny's words) and written research/THEME-character/update.json (his comment and the designer's reply, shown by the dialog) and bumped the round in demo.html. Your job: make options.css (and demo.js's scene builders where the new options need other parts, and grammar.css for new tokens) draw every option of every reopened question, world-class, and leave the approved questions' drawing untouched (their options keep their CSS; you may move it, never change it).

Kenny expects luxury-grade frontend work and has rejected mediocre drawings twice; if a drawing looks simple, cheap or generic, it is wrong: redo it. Every option of a question must be visibly different from the others.

Read first, in this order:

1. research/THEME-character/aspects.js and update.json: the reopened questions are the ids named in update.json's `questions`; the rest are approved (`picks`).
2. research/THEME-character/demo.js, options.css, grammar.css, demo.css, demo.html, README.md as they stand: keep the engine, the PART helpers and the approved questions' CSS; replace the reopened questions' option rules (`.PX-scene[data-PX-<id>="<key>"]`), add the parts the new scenes need.
3. themes/THEME/CHARACTER.md (§0 the decided anchor, §1 the grammar G1-G21, §5 what the other themes own: never copy those), css/THEME-register.css, css/components.css (package markup), and research/_coherence/README.md (the round's rules).
4. research/light-character/options.css and research/dark-character (or any finished character demo) for the level of finish expected.

Rules (binding):

- Colours only through tokens (relative colours allowed), no hex or named colour; no `style=` beyond the package's own `--kp-value` / `--kp-mark` / `--kp-spinner-size` / `--i` / `--x` as the demo already uses them; every rule hangs on the scene (`.PX-scene`), never on `.PX-page` alone (the review dialog moves the section into its stage); everything in `@layer kp.signature`.
- Every one-shot motion is a keyframe pair (open and `-out`) so every close is its open reversed; timing functions inside @keyframes are written literally (a `var()` there falls back to `ease`); an eased open closes on the inverse curve cubic-bezier(1-x2, 1-y2, 1-x1, 1-y1) (for the settle (0.22, 1, 0.36, 1) that is (0.64, 0, 0.78, 0)); steps(n, jump-end) closes on steps(n, jump-start). The base style is the finished pose; all motion under `prefers-reduced-motion: no-preference`.
- A part in its closed state is NEVER visible (Kenny, phantom verdict): hidden entirely before its first frame and after its last, not at zero opacity in view, not clipped to a sliver, not off to one side where a wider viewport shows it.
- Every scene fits a 300 px stage on a phone and reads large on the desk; no text wraps mid-word; nothing paints outside its scene at hold (except a part deliberately off-stage under `overflow: clip`). The scene cards may take the dialog stage's whole width (the dialog now gives the shown option the full width).
- Prettier: `npx prettier --write research/THEME-character` then `--check`; `node --check demo.js`. Do not edit catalogue/pages.js, aspects.js, update.json, anything outside research/THEME-character/ (and the package files your section names), and never run git. Do not run the browser test suite. Other agents work in the same tree on other themes: touch only your files.

Check (mandatory, repeat until clean):

- Server from the repo root: `(python3 -m http.server PORT --bind 127.0.0.1 > /dev/null 2>&1 &)`.
- Copy research/_coherence/tools/rows.mjs, freeze-char.mjs and mirror.mjs (adapt mirror.mjs to the prefix and the scene attributes) to `tests/tmp-THEME-*.mjs` (Playwright resolves only from inside the repository; port 8743 is in the scripts: change it to yours). Screenshot every reopened question's row at 1280 and 390 (READ the PNGs and judge them as the owner would), paused frames for every motion option (Playwright screenshots land about 500 ms late, so timed shots mislead; a pseudo-element animating a registered custom property cannot be paused: look at those live), and run the mirror check: every cycle scene prints "mirrored" (a press or a live update has no close by nature; say which).
- Open the review dialog at 1280 (?review=open) and step through two of the reopened questions: the scene must play inside the stage.
- Delete your tests/tmp-THEME-*.mjs afterwards and stop your server.

Report in at most 20 lines: per reopened question what each option draws (keyframe pair names), deviations from the designer's text and why, the mirror and clipping output, and anything unsolved.

---

## Section: deco (update 2, prefix `dc-`, port 8781, model: opus)

Kenny's verdict: "Do better, I'm very underwhelmed with what you came up with several times now for this art deco theme". Reopened: corners, loading, bar (the progress bar), leave, hover, press. His words: the shapes are "very simple and frankly unoriginal. It should exhume elegance"; loading: "I want something elegant and fancy. It should fit the style and look really luxurious. be creative"; the bars "look cheap. give me something elegant and worthy of this theme"; leave: "actual curtains that look good and fancy"; hover and press: "can be subtle but should look luxurious". He also asked: "make the elements actually pressable and hoverable so i can test myself".

The direction (unchanged and binding): the grand lobby of 1925 after the lights go down: deep blue lacquer with the register's chevron wallpaper behind every plate, gold as hairlines and small jewels (lozenges, emerald, a lighter facet), ivory type, symmetry, slow luxurious motion on the settle curve, nothing loud, counted or cheap. The gold must look like gold: use layered gradients on the hairlines and jewels (a lighter highlight and a darker shade within the same hue family via relative colours of `--primary`), fine grain on gold leaf, soft inner shadows on relief, never a flat yellow fill.

Specific work:

- The six reopened questions each have new options in aspects.js (corners 6, loading 10 + the old breathe, bar 8, leave 6, hover 5, press 5): draw every one. The curtains (leave: `velvet` and `festoon`) must look like actual curtains: pleats drawn with repeating gradients of light and shade across the width (7 to 9 pleats, the shade deepest in each fold, a sheen on each pleat's crest), a gold braid or fringe (a row of short vertical hairlines with a bead at each end) along the hem, tassels as small gold lozenge-and-line shapes, a scalloped valance (a row of semicircular cut-outs with a gold trim) across the top; the velvet parts from the centre to both sides gathering into thicker folds with a gold tie-back cord; the festoon gathers upward in swags with a gold rosette at each gather. Draw them with CSS gradients, masks, clip-paths and inline SVG as needed (SVG `currentColor`/token colours only); take the time to make them beautiful.
- Hover and press rows: the buttons, the menu entries, the tile with its Open link, the link, the key figures, the days and (press) the primary button, the entry, the day and the filter figure in those scenes must answer a REAL `:hover`, `:active` and `:focus-visible` on the option shown (and the same on the touch), in addition to the State buttons (which force the state by class); no `pointer-events: none`, no `aria-hidden` that stops the pointer, and a press must be holdable (the pressed look lasts as long as the pointer is down; a quick tap shows its full motion once). Check by dispatching real pointer events with Playwright (`page.hover()`, `page.mouse.down()`) on the shown option and reading the computed style change.
- The approved questions keep their drawing; the dialog, menu and tile of the opening row (approved) keep the inlay opening.

---

## Section: dark (update 1, prefix `dk-`, port 8782, model: opus)

Kenny's verdict: much better than the other themes ("much better work on this theme"). Reopened: opening, corners, loading, spinner. His words: opening: "I like option one, but even the ones that open from a button should open from left to right. And the first option here scans starting from the button, it should only scan the actual menu element ... at the tooltip, the scan is also too high, it should only be the height of the menu that actually opens"; corners: "option 2 looks quite good, but the panel (and menu?) still shows a black corner where the colour stops, key figure looks perfect, that's the shape I want, if it's the glow or shadow causing this, it should adapt to the shape"; loading: "give me ten variations on the line sweeps the slot, keep the colours"; spinner: "I feel like we can do better than this, give me ten more examples".

Specific work:

- opening `swept`: a pass from LEFT to RIGHT for every opening, starting at the left edge of the opened element itself and crossing only that element's own box (the line's height is the element's height, never the button's or the page's); the close is right to left. Fix the menu, the dialog, the toast and the tooltip.
- corners: option `four` (all four corners chamfered) is the new first option and the shape the key figure draws; find why the panel/menu/dialog/tooltip show a black triangle at the cut corners (the halo or grey shadow is cut square, or the background shows through where the clip-path is) and fix it for every option so the halo, shadow and film edge follow the cut (a `filter: drop-shadow` on a wrapper of the clipped element, or the halo drawn inside the clip). Show the panel, the menu, the dialog, the tooltip and the key figure; read the PNGs zoomed at the corners (crop and enlarge) to be sure no black corner remains in any of the three options.
- loading: ten variations of the line sweeping the slot (sweep, comet, afterglow, ladder, cross, diagonal, read, edge, prism, grating), all in the film's colours; each visibly different; on every waiting part (tile, panel, menu entry, month, chart plot, skeleton lines). Use paused frames at three moments of each loop to check they differ.
- spinner: twelve options (prism, radar, pendulum, bars, slit, chase, ripple, brackets, dial, lissajous, plus the two earlier `runs` and `turns`), three sizes, in a busy button and a busy panel; every one loops at 2.4 s and is visibly different from the rest at 1 rem, 2 rem and 3 rem.

---

## Section: retro (update 1, prefix `rt-`, port 8783, model: opus)

Kenny's verdict: the demo is approved but for loading: "I like the copying one best, but it doesn't fit skeleton, month days and chart plot". Reopened: loading only. Options (aspects.js): `fitted` (the Copying dialog, fitted to each part), `bars`, `folders`, `blocks`. Whole frames only (steps on the 90 ms frame), the 1995 desktop around each scene as in the other rows, nothing eased.

Specific work: draw `fitted` as the text says for each part: boxes (tile, panel, menu entry) the two small folders and the flying sheet with the segmented bar under; a skeleton line a sunken groove with one sheet hopping along its own length and a block gained behind it; the month's days a sheet passed from day to day, the day it lands on pressed in for a frame, a block per day on a bar under the month; the chart's plot crossed by one sheet along its baseline with the blocks filling the plot's foot. Reuse the anchor's pixel art (`research/retro-anchor/options.css`: `.rt-sheet`, `.rt-folder`, `.rt-bar`) and the existing `rt-fly-8`/`rt-load-*` keyframes where they fit; the other three options draw what their text says. Every close mirrors its open (steps(n, jump-end) / steps(n, jump-start)).

---

## Section: phantom (update 1, prefix `ph-`, port 8784, model: sonnet)

Kenny's verdict: reopened opening, corners, surface, live, spinner, leave. His words and the fixes (aspects.js has the text):

- opening: "I like 1, but at the tooltip and menu from the button, the closed state already shows part of the menu, it shouldn't do that": a closed part is not drawn at all (hidden, `visibility: hidden` or `display: none` outside the open window, via the keyframes' first and last frame), and the dots of a flying part are masked to its own footprint.
- leave: "the closed key figure is visible, maybe the others too but they are offscreen, but things in a closed state should never be visible": same rule for the alert, the card and the key figure; at `gap` and after `out` nothing of them is drawn, at any viewport width.
- corners: "number 1 is good, but make sure that it always looks the same, even when an element is long or wide, I don't want the angle of the corners to change and the corners themselves should probably remain at the same size as well, so content doesn't get cut off on large elements": the cut is a fixed 14 px at 45° drawn in pixels (e.g. a `clip-path: polygon(...)` with `calc(100% - 14px)` coordinates, never percentages of the box), the content inset by the same amount; the scene shows a small, a long and a wide card side by side.
- surface: "1 is best, but in a dialog with a title, the red on the side makes some of the content hard to read": the red edge sits outside the content box (the title and the words inset by its width plus 12 px); the scene has a dialog with a title and a long line.
- live: option `resolve` redrawn in six even cuts with no hold (the old one waited a whole cut at the lowest density); `size` the dots shrinking and growing continuously; `sweep` a diagonal resolve; `twang` the old pick.
- spinner: the star snaps and resolves at 2.8 s, 3.6 s and 2.0 s a turn with long dwells, the dissolving-in-place star, and the register's 1.2 s for reference.

Also check the PACKAGE for the same two faults and report them (do not edit the register): does css/phantom-register.css show a closed tooltip, menu or leaving key figure (an animation whose first/last frame is not hidden)? Say where.
