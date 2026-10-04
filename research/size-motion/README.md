# A dialog closing, and boxes that grow and shrink

**Decided (scope-142, 2026-10-04: approved in every theme over four rounds, 110 of 110).** Kenny approved every pair in every theme over four
rounds: the close and the accordion in round two, the tabs in round three,
growing and shrinking with a character per theme in round four (110 of 110).
Built: `js/motion.js` [scope-142], the character of fourteen themes moved from
`characters.css` into their registers, and deco's dialog entrance remade
without a clip.

Kenny, 2026-10-04: "we hebben nu wel een goede animatie voor dialog opens,
maar wat met dialog closes? … dan opent de dialog mooi, en dan verspringt de
grootte heel plots omdat er elementen bijkomen. Is er een optie om die groei
ook organisch en volgens de richtlijnen van een thema te laten verlopen?",
and "kijk is waar we dat nog kunnen toepassen, bv als een div groeit of
krimpt? want krimpen daar moet je dan ook rekening mee houden".

The demo (`demo.html`, formal only, as Kenny asks for every new demo) puts
the proposal beside the package today in five sections: a dialog closing, a
dialog whose content grows and shrinks, a card whose content changes, an
accordion, and tabs with panels of different heights. A last section lists
where else the package changes a box after it is drawn.

## The proposal

- **Close**: the dialog leaves the way it came, reversed: formal's sheet
  sinks the 14px it rose and fades, with the backdrop, in `--kp-close-dur`
  (200 ms) on `--kp-close-ease` (`cubic-bezier(0.3, 0, 1, 1)`, the opening
  curve mirrored). Escape, a button and a click on the backdrop all play it.
- **Size**: a box eases from its old height to its new one, in both
  directions, in `--kp-size-dur` (240 ms) on `--kp-size-ease` (formal's
  opening curve). A change during a glide continues from where the box is.
  It is a ResizeObserver on the box's content and one Web Animation of the
  box's height, clipped while it runs.
- **Reduced motion**: nothing moves; the box takes its size and the dialog
  closes at once.

Checked once in Firefox and Chromium (2026-10-04): the dialog is still open
90 ms into its close and gone after it; five rows grow the dialog from 217 to
419 px through 368 (Firefox) and 348 (Chromium) at 80 ms, and clearing them
shrinks it back through 267 and 287; the card, the accordion and the tabs
pass through an in-between height the same way; no page errors.

## Open

Kenny judges formal first; then the question whether dark, cyberpunk and
brutalism follow, and only after that the other themes.
