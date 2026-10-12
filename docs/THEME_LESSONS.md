# Theme lessons

What went wrong while finishing a theme, and the pattern that fixes it, so the next theme
applies the fix at once instead of finding the fault in review. One entry per cause: the
symptom Kenny sees, the cause, the fix, how to check it. Entries are added as a theme is
finished; forest (research/forest-applied, rounds 4 and 5) is the first.

How to check any motion claim: measure what is seen, frame by frame, in Firefox and Chromium
(`research/forest-applied/measure.mjs` is a worked example: it samples a part's rectangle,
opacity and animations every frame through an open and a close). A close is its open reversed:
the close's t50 is the open's remaining 50 %, not its own.

## 1. A keyframe animation fights a transition on the same property

- **Symptom:** a menu opening on a phone is half visible through its own edge, then catches up;
  it stutters.
- **Cause:** an entrance `@keyframes` (translate, clip-path) and a `transition` on
  `max-block-size` both act on the same box; the animation wins the frames it covers.
- **Fix:** one mechanism per part. Take the keyframes off the part and let the transition (height
  and opacity together, on the theme's growth curve) do the whole entrance; `overflow: clip` hides
  what is not grown yet.
- **Check:** sample height and opacity per frame; both are monotonic and end together.

## 2. The open animation replays whenever the element is redrawn

- **Symptom:** every month change or year pick in a date picker plays the panel's growth again.
- **Cause:** the entrance is keyed on an attribute that the script removes after a timeout
  (`data-kp-date-open`), and a redraw puts the node back in the tree, so CSS starts the animation
  over.
- **Fix:** the attribute stays for as long as the part is open and goes only when it closes
  (js/datepicker.js). Never key an entrance on something a redraw can restart.
- **Check:** `getAnimations()` on the part and its children after a month change: no entrance
  animation is running.

## 3. Inline `position: relative` on a target shifts the layout

- **Symptom:** background elements jump when a tour step highlights them.
- **Cause:** js/tour.js set `el.style.position = 'relative'` on static targets so the ring could be
  drawn; a grid or flex child that was positioned absolutely or by `place-self` moves.
- **Fix:** no inline `position`. Draw the highlight with an outline or a pseudo-element that needs
  no positioned parent, or a class that does not change the box.
- **Check:** compare the targets' rectangles before the tour starts and while it shows a step: they
  are identical.

## 4. The arrival animation replays on every step

- **Symptom:** pressing Next deforms the tour card and fades it in again.
- **Cause:** `.kp-tour[open]` carries the entrance animation, and a step re-renders the card.
- **Fix:** mark the card while it steps (`data-kp-tour-stepping`) and scope the entrance to
  `:not([data-kp-tour-stepping])`; the card then walks to the next target by a transition on `left`
  and `top` on the growth time and curve.
- **Check:** during a step the card's width and height never change, its position moves by about
  10 px a frame at most.

## 5. A state mark that sets `position: relative` breaks fixed and absolute parts

- **Symptom:** after the first step the tour's card sits far outside the window: it is
  `position: relative` now and takes its `left` and `top` from the flow.
- **Cause:** forest draws the live-update ring against its element, so
  `[data-kp-updating='ring']` set `position: relative`; the tour's card carries that mark on a step
  and is fixed in components.css; the signature layer comes later and wins.
- **Fix:** exclude the parts that are positioned already (`:not(.kp-tour)`), or draw the ring
  without changing `position`. A state mark never sets `position` on an element that may be fixed,
  absolute or sticky.
- **Check:** the computed `position` of the part before and after it is marked.

## 6. A wrapping column re-wraps its rows into columns while it grows

- **Symptom:** the phone menu's height grows in steps of one row (44 px a frame) and the links
  jump sideways.
- **Cause:** `.kp-nav__links` is `display: flex; flex-wrap: wrap`; as a column under a growing
  `max-block-size` the rows that do not fit yet wrap into a second column.
- **Fix:** `flex-wrap: nowrap` on the part that grows under a ceiling.
- **Check:** the height series is smooth (no multiples of a row) and no item changes its x.

## 7. A ceiling taller than the content hides the start and end of the growth

- **Symptom:** the close is not the open reversed: it begins late and ends early.
- **Cause:** `max-block-size: 25rem` over a list that is 17.6 rem tall: for the first and last
  part of the curve the ceiling is above the content and nothing moves.
- **Fix:** grow to the content's own height: js/components.js writes the list's `scrollHeight` as
  `--kp-nav-links-height` when the bar opens, and the theme's transition reads it.
- **Check:** open and close t50 and t90 are each other's mirror image.

## 8. A reversed animation takes the same curve, not the reversed one

- **Symptom:** a backdrop leaves out of step with its panel.
- **Cause:** the close used `animation-direction: reverse` together with the reversed (`wither`)
  curve: reversed twice.
- **Fix:** with `animation-direction: reverse` use the growth curve itself and a second keyframes
  name (so the close restarts); a `transition` back takes the reversed curve (`--kp-sig-fo-wither`).
  The two give the same mirror image by different means.
- **Check:** the close's frames equal the open's frames in reverse order within one frame.

## 9. A panel that changes height under the pointer

- **Symptom:** the date picker's panel is 276, 312 or 240 px high depending on the month, so the
  field below it moves on every month.
- **Fix:** the day grid keeps the height of a six-week month (`min-block-size`).
- **Check:** the panel's height series across twelve months is one value.

## 10. The close plays the opening forwards when the opening's mark is removed first

- **Symptom:** the date picker's panel vanishes at once, or re-grows for a second before it goes.
- **Cause:** `js/motion.js` `playClose()` compares the panel's animation name before and after it
  sets `[data-kp-closing]`; a script that removes the opening's mark (`data-kp-date-open`) *before*
  calling it makes the opening look like a close of its own, which then plays forwards.
- **Fix:** call `playClose()` first and remove the opening's mark right after (it reads its
  snapshot synchronously). Keep the rule that draws the opening on the union of the opening mark,
  `[data-kp-closing]` and `[data-kp-reversing]`, so the name stays the same.
- **Check:** `node gates/measure-pairs.mjs --theme forest --only datepicker`.

## 11. A page dim and a ring are part of the pair

- **Symptom:** the tour's page dims in 350 ms and un-dims in 1000 ms, and the target's ring appears
  at once and fades out: the close is not the open reversed, and the pair meter says 78 % off.
- **Fix:** the dim and the ring take the growth time and curve to appear, and the reversed curve
  (`--kp-sig-fo-wither`, read by css/components.css) to leave; the ring is drawn in from
  `outline-color: transparent` by a keyframe, since an attribute change starts no `@starting-style`.
  A focus ring that comes back at once at the start of a close is not the opening reversed either:
  the opener takes its focus when the card is gone.
- **Check:** the pair meter; the remaining difference is named in the list of what is still missing.

## 12. The pair meter and Chromium

- `gates/measure-pairs.mjs` reports "the closing runs no animation at all" in Chromium for a popover
  that the browser hides itself (the ghost copy of js/motion.js plays its close one task later).
  The close does play there: sampling the ghost's `translate` per frame goes from 0 to -100 % in
  1000 ms for the combobox, the row-actions menu and the theme menu. Trust the per-frame sampling
  (`research/forest-applied/measure.mjs` shows how) over the meter's verdict for these three in
  Chromium.

## 13. A register in `kp.register` cannot reach a rule in `kp.layout`

- **Symptom:** a part is in the register's leaf-corner list and still renders the package's default radius
  (`.kp-code-block` stayed 10 px on all four corners).
- **Cause:** `css/layout.css` is its own layer, declared after `kp.signature`; a later layer beats an earlier one
  whatever the specificity, so no rule in the register's layers can win against it.
- **Fix:** restate the one property in `@layer kp.layout { [data-theme='x'] .part { ... } }` at the foot of the register
  (synthwave does the same for `kp.base`). Check which layer a default lives in (`grep -n 'the-class' css/*.css`) before
  adding a part to a list.
- **Check:** the computed `border-radius` of every part in the list, in both engines.

## 14. A pressed state that restates the base hover paints a new plate

- **Symptom:** a plain or ghost button turns grey when pressed and the ghost's words fall to 4.35:1, while the primary and
  destructive buttons keep their plate.
- **Cause:** the register restated the package's `:active` background (`--secondary-active`) for every button but two.
- **Fix:** a press keeps what the pointer had already made (the plain plate; the ghost's 8 % tint and edge) and closes the blaze
  in; never restate a base pressed value without asking what the theme's press is (G12: the part does not change).
- **Check:** compute the text against the pressed plate composited over the page: the ghost reads 6.7:1.

## 15. A transition list that omits a timing function falls back to `ease`

- **Symptom:** the audit reads `ease` on `outline-style` (and 240 ms `ease-out` on the progress bar's head) next to
  200 ms on the growth curve everywhere else.
- **Cause:** `outline-style var(--fx-duration) allow-discrete` has no curve; the package's knobs
  (`--kp-progressbar-duration`, `--kp-progressbar-ease`) were left at their defaults while the register restyled the fill.
- **Fix:** write the curve in every list entry (`outline-style var(--fx-duration) var(--fx-ease) allow-discrete`) and set a
  component's knobs next to the register's own rule for it.
- **Check:** `getComputedStyle(part).transitionTimingFunction` per property.

## 16. A backdrop that is transparent still needs its fade

- **Symptom:** the alarm's close runs a 1000 ms `ease-in` on its backdrop, not the growth curve, and is not the open reversed.
- **Cause:** `js/motion.js` plays the backdrop's close from the CSS entrance it finds on `::backdrop`; with none, it falls back to
  its own `ease-in` fade.
- **Fix:** give every dialog-like part's `::backdrop` the theme's fade animation, even if the backdrop is invisible.
- **Check:** the pair meter's `::backdrop` entries read `linear(...)`, not `ease-in`.

## 17. Key a state's tint on the attribute that flips first

- **Symptom:** the phone bar's toggle keeps its open tint for about 1000 ms after the close has begun.
- **Cause:** the tint hung on `[data-kp-nav-open]`, which the script removes when the close has finished; `aria-expanded`
  turns false when it starts.
- **Fix:** `.kp-nav[data-kp-nav-open] > .kp-nav__toggle:not([aria-expanded='true'])` puts the rest look back at once; the
  tint then comes in 200 ms and goes in 200 ms. The pair meter in Firefox pauses before that transition exists and reads
  about 17 % at frame 0: sample real time (`getComputedStyle` per 60 ms) to see it.
- **Check:** the toggle's background across the first 300 ms of a close.

## 18. Prose is not an identifier

- **Symptom:** error messages, status lines, the alarm's text and button, truncated cells and microlabels read in the
  monospace.
- **Cause:** a register put `font-family: mono` on a whole root instead of on the identifiers inside it.
- **Fix:** forest's rule (G13): body face for words, mono for ids, times, log lines and keys (`.kp-id`, `.kp-timestamp`,
  `.kp-cell-break`, `.kp-alarm__code`). Reset each part of a composite that the package set in mono.
- **Check:** `getComputedStyle(part).fontFamily` for every prose part of the component.

## 19. A part a script removes or hides must leave first, in the themes that say so

- **Symptom:** the table's busy layer, the empty state, an upload's file row and a dismissed alert's return vanish or appear in 0 ms
  while their opposite takes 1000 ms; the pair meter reads "the closing runs no animation at all".
- **Cause:** the script calls `el.remove()` or `el.hidden = true`; `js/motion.js` `leave()` was never asked.
- **Fix:** shared JS asks `leavesState(el)` (the theme's token `--kp-leave-state: leave`, set by forest only) and then
  `leave(el)` or `leave(el, { hide: true })`; every other theme takes the old branch, so its behaviour does not move. A hidden part that
  the script re-shows (an alert) needs `arriveShown(el)` too: nothing else arrives a part that sits in no watched box. A part
  that is hidden again meanwhile (the empty state while typing goes on) applies the latest wish when its leave is over.
- **Check:** the pair meter on the part, and `getAnimations()` on it right after the click.

## 20. One `animation` per element: a loop on the same part silently replaces its entrance

- **Symptom:** the busy panel's own growth and withering rules never played; only the planting row's breath ran, and the layer
  appeared and went through another route.
- **Cause:** the loop's rule is `[data-theme] :is(...list...)`, whose specificity is that of its most specific argument (0,3,0), so the
  entrance written as `[data-theme] .part` (0,2,0) always lost. Dead rules stayed in the file and read as if they worked.
- **Fix:** put the entrance and the exit on the part that is not looping (here the layer around the panel, which `arrive()` and
  `leave()` animate as a whole) and delete the rules that cannot win.
- **Check:** `part.getAnimations()` while it opens: the entrance is listed, not only the loop.

## 21. A finished `both` animation holds its end value and blocks the transition back

- **Symptom:** the tour's ring is drawn in over 1000 ms and vanishes in one frame on close (the pair meter: 14.4 % off).
- **Cause:** `animation: ... both` keeps `outline-color` pinned after it has played, and a CSS transition does not start on a
  property an animation is still filling; the meter additionally rewinds the filling animation during the close and reads it as a
  ring drawn forwards.
- **Fix:** `backwards` for an entrance that ends on the natural value; the close is then the base layer's transition on the
  withering curve. One mechanism per direction.
- **Check:** sample the ring's alpha per frame through open and close: the close series is the open series reversed.

## 22. A base-layer `!important` cannot be beaten from a later layer: give it a token

- **Symptom:** the tour's dim fades out at its full spread (it covers the page until the last frame) but grew from the target on
  opening; a forest rule with `!important` and more specificity changed nothing.
- **Cause:** for `!important` declarations the cascade reverses the layer order, so `kp.components` beats `kp.register` and
  `kp.signature`.
- **Fix:** make the value of the base declaration a custom property with today's value as the fallback
  (`box-shadow: var(--kp-tour-dim-close, 0 0 0 100vmax transparent) !important`) and set the property in the register. Every other
  theme computes the same value as before.
- **Check:** the computed `box-shadow` mid-close: the spread shrinks with the alpha.

## 23. A part that takes no box must not hold back the one that does

- **Symptom:** the busy layer arrived after 500 ms of nothing (open 1500 ms against close 1000 ms).
- **Cause:** js/motion.js lets elements that arrive in one task come one by one; the table's status line adds a spinner that the
  register hides (`display: none`), and it took its turn first.
- **Fix:** a theme that says `--kp-arrive-unseen: skip` lets an element with no layout box arrive as nothing.
- **Check:** `layer.getAnimations()` right after the state change: one animation, delay 0.

## 24. A fold of space sized for a staggered theme makes forest's pairs 1583 ms

- **Symptom:** after a leave (alert, toast, file row, tab panel, empty state) the space closes for 1250 ms starting 333 ms in.
- **Cause:** `leaveOne()` and `arriveAsReversedLeave()` multiplied by 1.25 and started at a third of the exit: other themes' choice.
- **Fix:** `--kp-leave-fold-grow` and `--kp-leave-fold-start` (js/motion.js `foldTiming()`); the defaults are the old values and
  forest sets 1 and 0, so the space closes in exactly the growth time, together with the leave.
- **Check:** the longest animation in the leave: 1000 ms.

## 25. A swap is one picture: the two halves overlap, and the dip is measured

- **Symptom:** a tab switch withers the old panel for 1000 ms and then grows the new one for 1000 ms.
- **Fix:** with `leavesState()` the new panel is shown at once and arrives while the old one leaves (`js/overlays.js` `attachTabs`);
  the box height dips by the difference of the two folds (91 to 76 px to 91 on a 48 px panel), a half of what the sequence did.
- **Check:** per-frame sampling of both panels and the box, in both engines: open and close are each other's mirror.

## 26. A group that is `display: none` when shut is opened by gliding its height

- **Symptom:** a tree branch's children appear at once; only the box glides, pair 40 % off.
- **Fix:** `glideGroup()` (js/motion.js): the group is kept drawn through the shut glide by forest's rule on
  `[data-kp-group-folding]`, its height moves on the growth curve (the same curve turned round to shut), and the box follows
  (`followsAFold()` knows the attribute) instead of gliding itself. A bulk change (expand all) applies at once, a nested group inside
  a gliding one too.
- **Check:** the group's height, the box's height and the next item's offset per frame: one series, mirrored.

## 27. Make the pair meter's pairs literal

- A pair whose "open" does nothing measures nothing (the alert pair never dismissed the alert first, so open read 0 ms); a loop that
  starts with the pair (the planting row) free-runs at a different phase in the open and the close and reads as a difference of
  50 % (the meter now holds such loops at frame 0). State changes (tabs, empty state, wizard) are not pairs: read them by per-frame
  sampling.

## 28. Judge the way Kenny judges: in the review dialog, with real clicks, every frame

- **Symptom:** round 5 passed my measurements (datepicker "no animation restarted", tour "shape
  constant") and Kenny still saw both faults.
- **Why the measurement missed it:** it counted CSS `animationstart` and read the card's width
  and its first and last height, on the plain page, with Playwright's `click()`. The faults were
  (a) a redraw playing arrivals through `element.animate()` (js/motion.js `arrival()`), which fires
  no CSS animation event, so the day grid and the panel grew back from 268 to 312 px on every move;
  (b) a transient 112 to 156 to 112 px height of the tour card between two steps, invisible in the
  first and last value; (c) the review dialog's stage, a scroller in which a `position: fixed` panel
  is positioned against the scrolled content, and a Playwright `click()` that scrolls the target
  into view and so moves such a panel before the frame is read.
- **Fix:** measure in the dialog stage (`?review=open`), scroll the stage to the section, click at
  the element's coordinates with `page.mouse` (no scroll), do every action Kenny can do, and read
  every frame's rectangle, opacity, translate and `getAnimations()` (all of them, `element.animate()`
  included, not only CSS ones). Compare the whole series, not its ends.
- **Check:** `research/forest-applied/measure.mjs` stays as the plain-page check; the dialog flows
  are listed in the entries below.

## 29. A redraw is not an arrival; a redrawn box says so

- **Symptom:** every month, year or day pick replays a growth on the date picker's panel.
- **Cause:** js/motion.js treats added children as arrivals unless the box says
  `data-kp-arrive="none"`; the picker redraws its grid on every move.
- **Fix:** `panel.dataset.kpArrive = 'none'` (the combobox's list does the same), plus a day grid
  that keeps the height of six weeks so no size glide runs either.
- **Check:** the panel's height series across every action (open, next, previous, title, month,
  year, arrows, day) is one value after the opening.

## 30. A step is not an arrival, and a card that moves keeps its shape

- **Symptom:** pressing Next changes the tour card's shape and replays its entrance.
- **Cause:** the new words arrive as content, the card glides its height to each step's own, the
  entrance and the update ring play again.
- **Fix:** `data-kp-arrive="none"` on the card, its height fixed to the tallest step when the tour
  opens (js/tour.js `fixShape`), no entrance and no ring while it steps; it walks on the growth
  time and curve.
- **Check:** width and height series across every step: one value each.

## 31. The close must not clip what the open does not clip

- **Symptom:** the side navigation's content vanishes at once when the close begins.
- **Cause:** the open grew the panel by a clip from its far side; the close, as that reversed, clipped
  the panel from its own edge while it slid, which cut away the content that sits at that edge.
- **Fix:** the clip opens at the start of the opening and closes at the end of the closing
  (`clip-path 0s` with the growth time as delay), so the panel slides whole; the demo frames the
  panel (`data-kp-sidenav-position="absolute"`) so a panel judged in a scrolling stage is not
  carried off with the scroll.
- **Check:** content `getBoundingClientRect().left` tracks the panel's through the close, in a
  screenshot at 150 and 350 ms.

## 32. A focus rule loses to a reset of higher specificity: the keyboard sees nothing

- **Symptom:** a keyboard user tabs through every `.kp-button` in cyberpunk and sees no mark at all (60 button
  signatures, outline none, zero channels).
- **Cause:** the register's clock reset for buttons had specificity (0,4,0); the focus-bracket rule that should win after it
  had (0,3,0), so the reset zeroed the focus variables on every button.
- **Fix:** write the reset inside `:where(...)` (specificity 0) so any state rule wins; never let a reset out-rank the states
  it resets.
- **Check:** a real keyboard Tab through a page of every control, then `getComputedStyle` of the focus variables and the
  pointing audit (`audit.mjs --focus-only`): every stop shows its mark.

## 33. A lift token the theme does not decide moves every pressed part

- **Symptom:** buttons rise on hover and press although the theme's press closes a circuit and moves nothing.
- **Cause:** the package reads `--fx-lift` (default a pixel or two) for hover and press; only forest and a few others set 0.
- **Fix:** set `--fx-lift: 0px` (css/themes.css and themes/<theme>/tokens.json) and add `translate: none` on pressed parts that
  must not move. Applies to every theme whose grammar says a part does not move.
- **Check:** the pointing audit: no signature moves on hover or press.

## 34. Keyframes that clip with a rectangle square a notched corner while they play

- **Symptom:** (Kenny, cyberpunk power flicker) a part with a cut corner draws a rectangle round itself during the animation and the
  corner is square again; only the last frame puts the cut back.
- **Cause:** `clip-path: inset(...)` in the keyframes replaces the part's polygon clip for as long as it runs.
- **Fix:** keep the notch in every keyframe by clipping with the notch itself made wider than the part (`--cy-wide-clip`: the
  same polygon with 40 px of room), and let glows come from a drop-shadow wrapper. Applies to every theme with a cut corner.
- **Check:** `getComputedStyle(part).clipPath` is a `polygon(` in every frame.

## 35. `steps()` animations sought to their exact start or end read the after-state

- **Symptom:** the pair meter reads 11-26 % off at the last frame of dialog, drawer, palette and alarm while the per-frame
  poses mirror.
- **Cause:** at the boundary of a `steps(n, end)` tick the animation is already on the next pose; the meter seeks exactly to
  fraction 0 and 1.
- **Fix (meter):** seek 1 ms inside each tick (first and last frame). The theme's keyframes may also end on `75%, 100%` so the
  last tick has a pose of its own; a close must not begin on a sharp one-frame state.
- **Check:** all pairs read under 1 % in Firefox.

## 36. Firefox does not hold `display` for a transition: a hover dropdown needs a hold

- **Symptom:** a menu that opens on hover closes at once in Firefox while Chromium plays its close.
- **Fix:** js/components.js holds the dropdown's `display` for the close time (`--kp-nav-close-time`, read only where a theme sets
  it). Same pattern for any hover-opened part: a token-gated script hold, never `transition-behavior` alone.
- **Check:** `getAnimations()` on the dropdown for the close time after the pointer leaves.

## 37. Which of cyberpunk's faults sat in shared code (for the all-theme package)

These were not cyberpunk's: the same wrong default is in every theme that has not set its token.
- **Focus and pointing (B+E):** the reset-over-state specificity (32), `--fx-lift` (33), several part families that have no
  hover/press/focus rule in any register (tabs, pagination, icon buttons, options, tree rows, sort heads, grid cells, check/switch
  labels, fields and selects, calendar and datepicker days), and the package's own two-channel ring on non-buttons.
- **Closing and folding (A+H):** `--kp-leave-state`, `--kp-arrive-unseen`, `--kp-leave-fold-grow`, `--kp-leave-fold-start` are set by
  forest only (lessons 19, 23, 24); the accordion opens late and closes at once unless `--kp-accordion-size: own`; a calendar busy
  layer leaves at once unless `--kp-calendar-busy-leave`; the tabs swap folds with `--kp-swap-fold-ease`; the tour's close reads
  `--kp-tour-dim-time`, `--kp-tour-dim-close-ease` and `--kp-tour-dim-close-delay`; the side navigation's content shift is
  `data-kp-sidenav-shift`; the hover dropdown hold is `--kp-nav-close-time` (36). Each theme must set the tokens its grammar needs.
- **Check:** `node gates/measure-pairs.mjs --theme <theme> --engine firefox` and the audit in research/cyberpunk-applied/_audit
  (a theme-neutral copy of forest's) before showing a theme to Kenny.
