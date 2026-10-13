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

- Side navigation, launcher: `.kp-sidenav__launcher` with its toggler, `.kp-sidenav__bars`,
  `data-kp-sidenav-launched`, `data-kp-sidenav-lit`, `data-kp-sidenav-launcher-room` (research/sidenav-edge).
- Side navigation, the three edge variants: `push` with `data-kp-sidenav-content`, the gutter
  (`data-kp-sidenav-reserve`), `over` with `data-kp-sidenav-backdrop="false"`; `data-kp-sidenav-over-below`.
- Side navigation, the options from other libraries: `data-kp-sidenav-inert`, `-rail-tips`, `-flyout`
  (`data-kp-sidenav-flown`), `-slim-below`, `-shortcut` (`aria-keyshortcuts`), `-initial-focus`,
  `-hover-delay` (`data-kp-sidenav-peek`), the edge tab `.kp-sidenav__tab`; a push panel on the end edge.
- Motion: a close is its open played backwards in every theme; the leave tokens `--kp-leave-state`,
  `--kp-arrive-unseen`, `--kp-leave-fold-grow`, `--kp-leave-fold-start`, `--kp-leave-fold-ease`,
  `--kp-swap-fold-ease`, `--kp-calendar-busy-leave`, `--kp-accordion-size: own`, `--kp-nav-close-time`.
- Tour: `--kp-tour-dim` and the tour close tokens (`--kp-tour-dim-time`, `-close`, `-close-ease`, `-close-delay`).
- Tree: `--kp-tree-inset`.
- Back to top: scrolls the box it sits in.
- Focus: the focus returns to the opener when a date picker or side navigation has closed.
