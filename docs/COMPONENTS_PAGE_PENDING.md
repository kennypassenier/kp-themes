# What the components page still has to show

The site's component pages (`site/components/*.html`, every component with its
code examples) are brought up to date in one pass, on Kenny's go, once every
open review is approved (Kenny, 2026-10-13: "nadat alles approved is, vraag je
aan mij of je onze pagina waar al onze componenten staan (met codevoorbeelden)
mag updaten met alles wat nieuws is en alle nieuwe opties").

Every session that adds or changes a component, an option, an attribute or a
token adds a line here in the same commit. The pass works down the list, gives
each line its example and its option row, and empties the list.

## Waiting

(The pass of 2026-10-13 brought every line before this onto its component page.)

- **Pastel's grammar, approved 2026-10-14 (research/pastel-character/decided.json; nothing in css/ yet, waits for the port).**
  Once ported, the page shows what the register gains: the anchor _printed twice, stuck on_ (keyframes `kp-sig-pastel-pass-*` and
  `kp-sig-pastel-stuck-*`, a second name for each close) on the dialog, alarm, palette, tour card, toast, tooltip, popovers,
  menus, the bar's dropdown and phone panel, side navigation, drawer, date picker and combobox list; the proposed register
  tokens `--kp-sig-pa-land` (the soft landing curve, `--fx-ease` following it), the pass offset (6 px) and colour
  (`--fx-overprint`); the folded corner on hover and the dashed focus line alone; the wobble as pastel's `--kp-update`. Each with its example and
  option row on the component pages it touches (dialog, popover, menu, toast, tooltip, alarm, tour, side navigation, date
  picker, combobox, progress bar, spinner, skeleton, button, key figure).
- **Pastel's loading picture and spinner, decided 2026-10-14 (research/pastel-character/decided.json; waits for the port).**
  Loading = the pom-pom caterpillar 6, everything becomes caterpillar (`b-bug-6`: the days become its body, skeleton lines and the
  busy bar rows of pom-poms with a head); spinner = the pom-pom caterpillar 2, the round trip (`b-curl-2`). The progress bar,
  skeleton, spinner, key figure, menu and calendar pages show them in pastel, with an example and an option row each. Also
  pending the port: the leave _the anchor, then a thumbtack_ (the tack's keyframes on the card and key figure pages).
