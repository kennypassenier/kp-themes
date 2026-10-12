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
