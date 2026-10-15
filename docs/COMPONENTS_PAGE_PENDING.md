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

(The pass of 2026-10-15 brought the last three lines onto their pages: the date
picker's `data-kp-date-format`, the key-figure label wrap, the side navigation's
`data-kp-sidenav-opener`. The pass of 2026-10-14 brought every line before them.)

- `--kp-menu-anchor-x`, written by `js/menu-button.js` on the open menu of a menu button (the button's centre, in px from the menu's left edge,
  kept 14 px inside it; not written when the menu hangs above its button). Written for every theme, read only by deco, whose inlay starts under the
  button. Belongs on the menu button page next to the knobs (2026-10-15, research/leftover-looks).
- Network graph, three opt-in attributes on `figure.kp-graph[data-kp-graph]` (2026-10-15, research/kpadopt-graph): `data-kp-graph-colour="fixed"`
  (every node's hue at `oklch(var(--kp-graph-node-l, 0.62) var(--kp-graph-node-c, 0.15) hue)`), `data-kp-graph-labels="under"` (a label centred under
  its node, never cut; the narrow-box ellipse trade is off), `data-kp-graph-chrome="inside"` (Show all and the hint inside the picture, css grid
  only; a `graphHint` with line breaks makes spans). Belongs on the network graph page with
  an example each.
- Network graph, new knobs: `--kp-graph-node-l`, `--kp-graph-node-c`, `--kp-graph-box-radius`, `--kp-graph-box-fill`, `--kp-graph-edge-on-width`
  (2.6), `--kp-graph-node-dim` (0.3), `--kp-graph-dot-cap` (round), `--kp-graph-flag-colour`, `--kp-graph-label-weight` (500),
  `--kp-graph-label-halo` (4px), `--kp-graph-inset` (10px, the inside chrome), `--kp-graph-edge-opacity` and
  `--kp-graph-dash` (written per link and sample by the script from a kind's `opacity` and `dash`).
- Network graph data: a kind's optional `colour`, `dash`, `opacity` and `bent`. Exports `graphLayout(data, W, H, { plain })` and
  `graphBends(edges, bent)`.

