# Opening as the reverse of closing

**Decided (2026-10-05).** Kenny approved the demo in full at 11:08: "Reverse of close" for both the dialog and the card, in formal, cyberpunk and titanium. In the package each of those registers declares `--kp-open: reverse-close`, and js/motion.js opens a dialog as its close played backwards (the entrance's keyframes forwards in the close's time) and lets what arrives in an eased box play the theme's leave backwards. The other nineteen themes keep their entrances and arrivals.

Kenny, 2026-10-05, on the catalogue block "Leaving: the options"
(catalogue/motion.html#leave-options): "bring them back should be smoother,
can we also see the opposite of close() with the reverse animation of close?
So when it grows it's the opposite? give a demo with formal, cyberpunk and
titanium".

The demo (`demo.html`) opens two elements two ways, side by side, in each of
the three themes, with the review kit (`../_review/review.js`): one choice
per theme and per element, "Reverse of close" or "Today's open".

## What is shown

- **A dialog.** Its close (`closeDialog()`, js/motion.js) plays the entrance
  it kept backwards, in two thirds of the entrance's time, capped at 600 ms.
  The reverse of that close is the entrance's keyframes played forwards on
  the same curve, in the close's time, with the backdrop's fade turned
  around. So the only difference from today's open is the speed: formal
  200 ms instead of 300 ms, cyberpunk 600 ms instead of 1520 ms, titanium
  160 ms instead of 240 ms.
- **A card.** Its close is `leave(card, { hide: true })`: the register's
  exit on `[data-kp-leaving]` (formal folds up like a letter, cyberpunk
  glitches out, titanium runs through the anodised colours) while its space
  folds shut a third of the way in. The reverse plays that whole timeline
  turned around: the exit's keyframes in reverse, ending at the timeline's
  end, and the fold of the space unfolding over the mirrored span. Today's
  open shows the card in a box that eases (`data-kp-size-motion`): the box
  glides open and the card plays the theme's arrival.

Nothing in `demo.js` has a duration, delay or curve of its own: every
number is read from the theme (themeMotion(), the register's keyframes and
`--kp-leave-fold`), so a frame t of the opening is frame (T − t) of the
close. A theme whose register has no exit of its own would close by playing
its arrival backwards; the demo's card only shows themes that have one.

## Measured

Firefox, 2026-10-05, full speed: see the helper's report in the thread for
the numbers (the dialog's reverse lasts as long as its close, the card's
reverse as long as its leave, and the sampled frames mirror).

## If picked

"Reverse of close" for a card would become an option of the package's
motion (an `open`-side counterpart of `leave()`, say `enter(el)`), not a
change to the dialog, whose reverse of close is its own entrance faster.
