# The dashboard's Map, drawn by kp-graph

Round 1 (2026-10-15), all 16 themes. Kenny's rule: the look of the admin dashboard's network graphs never changes. The dashboard still draws
the Map itself because kp-graph (10.1.1) lacks three things on it
(`KP_THEMES_ADOPTION.md`, kpa-14 and its note in section 7). `demo.html` draws the picture twice with the same made-up fleet: the dashboard's own
code (verbatim copies: `dash-map.js`, `dash-map.css`) on the left, kp-graph with the new options on the right.
Mock: the fleet, the adapters in `demo.js` and the try-buttons. Real: kp-graph and the copied dashboard code.

| Name              | What it is for                                                          | Reference                                                             | What the package reuses                                                         | Cost   | Recommendation                                                              |
| ----------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------- |
| Fixed node colour | Map nodes at `oklch(0.62 0.15 hue)` in every theme                      | dashboard `css/pages/map.css` `.mp-node`                              | the hue spread of `js/graph.js` (equal to `stackHues`, measured)                | small  | `data-kp-graph-colour="fixed"` + knobs `--kp-graph-node-l/-c`               |
| Label under node  | name centred under the node, never cut                                  | dashboard `js/pages/mapgraph.js` (`y + r + 16`)                       | the label element and halo; skips `fitGraphLabels`                              | small  | `data-kp-graph-labels="under"`; also switches off the narrow-box ellipse    |
| Chrome inside     | Show all top right and the hint along the foot, inside the frame        | dashboard `.mp-graph__reset`, `.mp-graph__hint`                       | the bar and hint elements, moved by a css grid cell (no script)                 | small  | `data-kp-graph-chrome="inside"`                                             |
| Fidelity knobs    | the small numbers that differ (2.4 lit link, butt dots, dash 5 4, bend) | same files                                                            | custom properties with today's value as default                                 | small  | knobs and kind fields `dash`, `opacity`, `bent`; frame knobs for the choice |

## Measured

- Node positions of the Map's `layout()` against `graphLayout(data, W, H, { plain: true })`: largest difference 0.000000 px over widths 1000, 800, 420, 390 and 300. Without `plain` kp narrows the ellipse under 600 px (46.6 px off at 390 wide), which is why `labels="under"` turns that trade off.
- Hues of `stackHues` against kp's spread: equal. Bends of `bends()` against `graphBends(edges, bent)`: equal once the `named` kind is `bent` (kp had no
  always-bent kind; the Map bends a named address even when it is alone).
- Overriding `--kp-graph-node-colour` per graph does not work: `.kp-graph__node` declares it itself, so a value on the figure never reaches the node.
  That is why the fixed colour is an attribute with two knobs.

## Where kp cannot match the dashboard exactly, and why

- **Tab order.** The Map gives every node its own tab stop; kp-graph is one tab stop with the arrow keys walking the ring (the package's keyboard model,
  USER_GUIDE). Pointer, Enter, Space, Esc and Show all behave the same.
- **The Map frame.** Today: 8 px corners and a soft glow in the middle. kp: the theme's radius and plain ground. Open question below; the knobs
  `--kp-graph-box-radius` and `--kp-graph-box-fill` do either.
- **The Map's kinds row** is the page's own pill style; kp's pills are the package's (slightly different padding and off-state). Chrome, not picture.

## Open questions for Kenny (in the review dialog)

1. The Map's frame: the theme draws it (recommended: squared in brutalism, round in pastel, as every other card), or today's 8 px corners and glow in every theme.

## Recommendation

Adopt the three attributes. The Map moves to kp-graph with `colour="fixed"`, `labels="under"`, `chrome="inside"` and the two knobs of the recipe in
`demo.css`; positions, hues, bends and sizes are equal to the pixel. The Firewall picture has no caller in the dashboard, so the package does not
ship a layout for it.
