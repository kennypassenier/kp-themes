// Page descriptor for the "graph" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const graphDescriptor = {
        id: 'graph',
        title: 'Network graph',
        group: 'Data',
        classes: ['kp-graph'],
        exports: [],
        // The marks the script writes on what it draws and reads back: a
        // link's ends and kind (`data-kp-from`, `-to`, `-kind`), its dash
        // (`data-kp-style`), a node's id, Show all at rest (`-idle`), a
        // graph with a node lit (`-focus`), its state, and the host's key
        // that `decorate` passes on.
        aliases: ['key', 'style', 'from', 'to', 'kind', 'id', 'idle', 'state', 'focus', 'panning', 'zoomed', 'colour', 'labels', 'ring-radius', 'node-radius'],
        intro: 'A picture of a network: one node in the middle, the rest on a ring around it from the top, clockwise, A to Z and then the nodes outside the network, the links drawn by kind (a colour and a dash each, listed above the picture with Show all). Hover or focus a node to see only its links; click it, or press Enter, to keep it picked, several at once; Esc or Show all clears. Each node takes its own hue at the theme’s chart lightness. A label points away from the middle and is shortened, with an ellipsis, where it would touch another or leave the picture; the full name stays in its title and its accessible name. js/graph.js builds it from the page’s data.',
        whenToUse:
            'For a network with one centre that everything reports to or is reached from: a control centre and its sites, a server and the services it talks to. Not for a network without a centre, not for a flow with a direction that matters more than the links, and not past a few dozen nodes, where the ring’s labels shrink to a letter.',
        examples: [
            {
                title: 'A control centre, its sites and two kinds of link',
                why: 'The data is the page’s, here as a JSON child (`setGraphData()` does the same from a script). The hub is the node named in `hub`, else the one with the most links. A kind the links do not use is left out of the list; a node marked `external` has a dashed grey ring and sits at the end of the ring.',
                markup: `
<figure class="kp-graph" data-kp-graph aria-label="The northern network">
<script type="application/json" data-kp-graph-data>{"hub":"centre","nodes":[{"id":"centre","label":"Control centre","description":"where every reading arrives"},{"id":"ph1","label":"Pump house 1","description":"two pumps, ring main west"},{"id":"ph2","label":"Pump house 2","description":"one pump, the old town"},{"id":"ph3","label":"Pump house 3","description":"two pumps, ring main north","flag":"mismatch"},{"id":"north","label":"Reservoir North","description":"level sensor and an inlet valve"},{"id":"weather","label":"Weather service","description":"an address outside the network","external":true}],"edges":[{"from":"ph1","to":"centre","kind":"telemetry"},{"from":"ph2","to":"centre","kind":"telemetry"},{"from":"ph3","to":"centre","kind":"telemetry"},{"from":"north","to":"centre","kind":"telemetry"},{"from":"centre","to":"ph1","kind":"control","detail":"pump start and stop"},{"from":"weather","to":"centre","kind":"telemetry","detail":"rain radar every 10 min"}],"kinds":[{"kind":"telemetry","label":"Telemetry","hint":"Readings sent every minute","style":"solid","colour":"var(--chart-1)"},{"kind":"control","label":"Remote control","hint":"Commands to the site","style":"dash","colour":"var(--chart-2)"},{"kind":"radio","label":"Radio link","hint":"A spare path over radio","style":"dot","colour":"var(--chart-4)"}]}</script>
</figure>
`,
            },
        ],
        variants: [
            { name: '[data-kp-graph]', what: 'A graph; usually a `figure.kp-graph` with an `aria-label`. Its data comes from a `script[type="application/json"][data-kp-graph-data]` child or from `setGraphData(el, data)` after the attach; until then it shows loading.' },
            { name: '.kp-graph__bar', what: 'Over the picture: the kinds of link (`.kp-graph__kinds`, one `.kp-graph__kind` toggle each, the ones the links use) and Show all, which keeps its place while there is nothing to show again (`data-kp-idle`).' },
            { name: '.kp-graph__box', what: 'The picture (`.kp-graph__svg`) at the height it is drawn at (see the knobs), in every state, with `.kp-graph__note` for the state’s sentence.' },
            { name: '.kp-graph__hint', what: 'What a pointer, a click and the keys do, under the picture in the page’s flow.' },
            { name: '.kp-graph__edge', what: 'A link: its kind’s colour (the kind’s `colour`, a token such as `var(--chart-2)`) and dash (`data-kp-style="solid|dash|dot|long-dash"`). Two links between one pair bend apart, 26 px a step.' },
            { name: '.kp-graph__node', what: 'A node: a ring (`__ring`), a core (`__core`) in its own hue (spread over the nodes A to Z unless a node gives its own `hue`), and its label (`__label`). A `weight` from 0 to 1 sizes it.' },
            { name: '.kp-graph__node--hub', what: 'The node in the middle; its label sits under it.' },
            { name: '.kp-graph__node--external', what: 'A node outside the network (`external: true`): a dashed grey ring, no core, at the end of the ring.' },
            { name: '.kp-graph__flag', what: 'A dotted ring around a node whose `flag` is `mismatch`: its settings differ from the plan.' },
            { name: 'lit, dim, picked', what: 'While a node is hovered, focused or picked, its links are `is-on`, the rest `is-dim`, and the nodes they do not reach fade; a picked node has a thicker ring. A kind turned off is `is-hidden`.' },
            { name: 'data-kp-state', what: 'Written by the script: `loading` (the ring pulses; still under reduced motion), `empty` or `error` (a red dot before the page’s sentence), each at the picture’s full height; `ready` once it has nodes.' },
            { name: 'data-kp-labels', what: 'Option `below`, off by default. The name stands whole and centred under its node and is never cut: the ring is as wide as the box allows and the picture grows taller (up to 1400 px) until no name touches another or leaves the box. `graphRoom()` is the pure half.' },
            { name: 'data-kp-chrome', what: 'Option `inside`, off by default. Show all stands at the picture’s top right and the hint at its foot, inside the drawing instead of over and under it; the layout keeps a strip clear for them.' },
            { name: 'data-kp-colour', what: 'Option `fixed`, off by default. A node keeps one colour in every theme: its hue at a fixed lightness and strength (see the knobs), so a stack has the colour it has on other pages. A node’s own `colour` (any CSS colour) wins in every mode.' },
            { name: 'data-kp-direction', what: 'Option `arrows`, off by default. An arrowhead at the end of each link (`.kp-graph__arrow`), short of the node, turned with the curve and in the kind’s colour; a dashed kind gets an open head. A link may say `arrows: \'to\' | \'from\' | \'both\' | \'none\'` (default `to`).' },
            { name: 'data-kp-zoom', what: 'Option, off by default. Wheel or pinch zooms about the pointer, a drag on the background moves the picture, `+`, `-`, `0` and Shift with the arrows work from a node, and Zoom in, Zoom out and Reset view stand inside the picture (`graphZoom(el, \'in\' | \'out\' | \'reset\')`). `data-kp-zoomed` marks a view that is not the first one and `data-kp-panning` a drag; a button or key eases on the theme’s own time and curve (see the knobs), and not at all under reduced motion.' },
            { name: 'data-kp-detail', what: 'Option, off by default. A picked node opens a details panel inside the picture (`.kp-graph__detail`). The page fills it through the `detail` option of `attachGraphs()` or the `kp-graph-detail` event (`detail.slot`), else it shows the node’s description. Esc closes it first and keeps the picks; `graphDetail(el, id)` opens or closes it from the page.' },
            { name: 'data-kp-ring-radius', what: 'Option. The ring as a share of the picture (0.36 by default), from 0.15 to 0.48.' },
            { name: 'data-kp-node-radius', what: 'Option. The base node radius in px (14 by default); a weight scales from it and a node’s own `radius` wins.' },
        ],
        accessibility: [
            'Built in — the picture is one tab stop: Tab lands on the hub (or the node last focused), the arrow keys walk the ring, Home and End jump, Enter or Space picks, Esc shows all again.',
            'Built in — every node is a `role="button"` with `aria-pressed` and the accessible name “label, description”; the picture is a named group whose name ends with the hint.',
            'Built in — a shortened label keeps the full name in the node’s title and accessible name; the labels are fitted again when a web font arrives.',
            'Built in — a kind toggle is a real button with `aria-pressed` and the kind’s hint as its title; a kind turned off is crossed out as well as faded.',
            'Built in — a live update keeps the focus and the picks by id; a hover or a pick changes classes only, so the node under the pointer is never rebuilt.',
            'Built in — with zoom on, the keys `+`, `-`, `0` and Shift with the arrows do what the wheel and a drag do, the three controls are real buttons, and a focus walk brings the node into view; with details on, the panel is a named region and Esc closes it before it shows all.',
            'Yours — name the graph (`aria-label`), give every node a `description` worth hearing, and say in text near it what a reader must not miss; the picture is the overview.',
        ],
    };
