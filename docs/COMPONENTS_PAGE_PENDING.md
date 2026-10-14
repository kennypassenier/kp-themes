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

- **Pastel's grammar, approved 2026-10-14 and ported the same day [scope-141]** (css/pastel-register.css, the signature layer;
  research/pastel-applied shows it). The pages show, each with its example and option row in pastel: the anchor _printed
  twice, stuck on_ on the dialog, drawer, palette and shortcut sheet (their `::backdrop` is the sky pass, its border the dim),
  the popovers, menus, theme menu, date picker panel and combobox list (`::backdrop` pass), the bar's dropdown and mega menu
  and a tooltip (the holder's `::after` pass, anchor positioning), the toast, alert, tour card, side navigation (over and
  push), the phone panel and the busy table's and month's panels (their own plate and pass), the alarm (its plate on the
  pass's clock); keyframes `kp-sig-pastel-stuck-in`/`-out`, `-stuck-placed-in`/`-out`, `-stuck-plate-in`/`-out`,
  `-pass-in`/`-out`, `-pass-host-in`/`-out`, `-tack-in`/`-out`, `-stuck-small-in`, `-pass-small-in` (the tick and the dot),
  `-meter-stuck-o`/`-w`/`-d`, `-update-wobble`, `-bug-rise`, `-bug-rise-bead`, `-bug-step`, `-bug-feel`, `-curl-orbit`,
  `-curl-lift`, `-curl-turn`, `-tour-ring`; the registered numbers `--kp-sig-pa-pass` and `--kp-sig-pa-ink` (the two
  clocks); the register tokens `--kp-sig-pa-land` (the soft landing; `--fx-ease` is the same curve in tokens.json),
  `--kp-sig-pa-land-size` (the landing held at its value, for sizes; pastel's `--kp-sidenav-ease`), `--kp-sig-pa-land-back`,
  `--kp-sig-pa-window` (560 ms), `--kp-sig-pa-dialog` (840 ms), `--kp-sig-pa-tack` (360 ms), `--kp-sig-pa-wobble` (800 ms),
  `--kp-sig-pa-loop` (2400 ms), `--kp-sig-pa-pass-c`, `--kp-sig-pa-peel`, `--kp-sig-pa-off` (6 px), `--kp-sig-pa-r-plate`,
  `--kp-sig-pa-r-ctl`, `--kp-sig-pa-r-chip`, `--kp-sig-pa-tape-bg`, `--kp-sig-pa-dir`, `--kp-sig-pa-corner`,
  `--kp-sig-pa-ground`; pastel's package knobs `--kp-update: wobble`, `--kp-loading-pieces: caterpillar`,
  `--kp-focus-ring-inner-width: 0px`, `--kp-size-max: 560ms`, `--kp-leave-stagger: 0.1071`, `--kp-nav-close-time: 560ms`;
  `--fx-lift` 0px in tokens.json. Pointing: the corner fold on buttons, menu entries and a key figure that acts; focus: the
  dashed `--ring` line alone (the plate's ink on a destructive, info, primary plate); press: stuck down flat. Tones: the
  change sticker on a key figure, a warning or failed figure's label on its tone's plate. The thumbtack on a card, a key
  figure and a tile (leave: the tack first, `--kp-leave-fold-start` 0.6429 on them); washi tape on the dialog, palette,
  wizard and spec sheet. Pages: dialog, popover, menu, toast, tooltip, alert, alarm, tour, side navigation, date picker,
  combobox, card, key figure, progress bar, spinner, skeleton, button, meter, calendar, data table.
- **Pastel's loading picture and spinner, ported 2026-10-14 [scope-141].** Loading = the pom-pom caterpillar 6, everything
  becomes caterpillar: a skeleton line, the busy progress bar's track and a loading meter a row of pom-poms with a head; a
  loading day of the month its body (rim, two legs, the hump through the days, a head beside the last of its week); a block
  skeleton, the busy table's panel, the busy month's card, a busy menu, a busy key figure or card a head on its corner and
  stepping legs. Spinner = the pom-pom caterpillar 2, the round trip, at every size. Drawn by the new module
  `js/loading-pieces.js` (`attachLoadingPieces()`, `PIECES_PROPERTY` `--kp-loading-pieces`, `PIECES_ATTRIBUTE`
  `data-kp-pieces`, `PIECE_CARRIERS`; wired in js/auto.js), with a still row of pom-poms in CSS without the script. The
  progress bar, skeleton, spinner, key figure, meter, menu button, data table and calendar pages show it in pastel; the
  spinner page lists `data-kp-pieces` already (gates/site/descriptors.mjs).
- **Side navigation, narrow-screen width (2026-10-14, research/sidenav-minor).** `--kp-sidenav-width-narrow`: the panel's width
  while `data-kp-sidenav-narrow` is on it (below the `data-kp-sidenav-over-below` step); falls back to `--kp-sidenav-width`.
- **Side navigation, floating variant (2026-10-14, research/sidenav-minor).** `data-kp-sidenav-variant="floating"`: panel detached
  from the edge (`--kp-sidenav-float-inset`, `-radius`, `-edge`, `-shadow`, `-ink`; the module reads `--kp-sidenav-room` and `-lead`).
- **Side navigation, inset variant (2026-10-14, research/sidenav-minor).** `data-kp-sidenav-variant="inset"`: flush panel, the content a
  rounded card (`--kp-sidenav-inset-gap`, `-radius`, `-edge`; the module marks the content `data-kp-sidenav-inset`).
- **Side navigation, peek strip (2026-10-14, research/sidenav-minor).** `--kp-sidenav-peek` (0.75rem): a thin `.kp-sidenav__peek` strip
  stays at the edge while the panel is shut (`--kp-sidenav-peek-surface`); push keeps its room, over lies over the page by that width.
