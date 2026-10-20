# research/graph-1020: the network graph can draw the homelab Map

Round `graph-1020-<uuid>` (see `demo.html`, 2026-10-21): 8 sections, 8 pairs, formal only (DEMO_RULES ch. 6: a new demo starts in formal; the other
themes follow after the verdict). One page for all of them.

This is homelab gap 102 (`~/Projects/kp-gaps/homelab.md`): the Map in the homelab admin dashboard draws its own network
(`admin/web/js/pages/mapgraph.js` and `mapview.js`) because `js/graph.js` could not. Kenny chose "Volledig" (2026-10-21): the graph must draw
everything the Map draws, so the dashboard can delete its own drawing. Seven options, each an attribute on the graph, off by default, switchable at
runtime; the approved graph is what a graph without them draws.

| Section        | Option                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| labels-below   | `data-kp-labels="below"`: the name whole under its node, the layout makes room (`graphRoom`)            |
| chrome-inside  | `data-kp-chrome="inside"`: Show all and the hint inside the drawing                                    |
| fixed-colour   | `data-kp-colour="fixed"` and a node's own `colour`                                                     |
| arrows         | `data-kp-direction="arrows"`, an edge's `arrows` (`to`, `from`, `both`, `none`)                        |
| zoom-pan       | `data-kp-zoom`: wheel/pinch, drag, `+` `-` `0`, Shift+arrows, the three controls, `graphZoom()`          |
| detail-slot    | `data-kp-detail`: details panel in the drawing, `kp-graph-detail` / the `detail` hook, `graphDetail()`  |
| own-radius     | `data-kp-ring-radius`, `data-kp-node-radius`, a node's `radius` and `weight`                           |
| states         | loading, empty and failed with every option on                                                         |

The data is the homelab's own stacks (gateway, media, downloader, productivity, syncthing, ...), mock, in the shapes the Map reads.

**Generated** by `node research/graph-1020/build.mjs` (edit the builder, never the page).
