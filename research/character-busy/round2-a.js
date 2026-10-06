/* research/character-busy, round 2 (Kenny, 2026-10-06 22:30): new shape
   options of group a (cyberpunk, synthwave, pastel, terminal, forest).
   Round 1's three shapes per theme differed by only 0-4 % of their pixels
   (Kenny, 2026-10-06 22:30: "ik zie enkel dezelfde vorm en dezelfde loading
   screen"); these three replace them with clearly different silhouettes —
   frame, plate, veil, word setting and spinner ring — each speaking one of
   the theme's already-approved picks from research/THEME_PROFILES.md, and
   each option's text says in one sentence what sets it apart from the
   other two. Only the shape aspect is touched; loading, arrival, failure
   and phone keep their existing 1/2/3 keys and still compose over any of
   these three (the `--bo-*` knobs busy.css's shared part reads). */
export default {
    cyberpunk: {
        shape: [
            {
                key: 'r2-cy-shape-1',
                name: 'The segment gauge',
                text: "Echoes the HUD segment gauge (the meter's approved shape): the frame is a run of short LED-style dashes on all four sides instead of one solid line, in the accent colour, square corners, a tight accent ring on the spinner. Unlike the other two, nothing is cut or faceted — the whole outline is built from dashes.",
            },
            {
                key: 'r2-cy-shape-2',
                name: 'The black ice',
                text: "Echoes the chart's black ice: a dark glass slab, a soft diagonal sheen across its face, one corner sheared off low on the leading edge. Unlike the segment gauge's dashed outline or the data shard's two cuts, this plate has a single shard taken from one corner only.",
            },
            {
                key: 'r2-cy-shape-3',
                name: 'The data shard',
                text: "Echoes the calendar's data shard and the graph's holo HUD: two opposite corners are sheared away and a double rim — a bright inner line, a dim outer one — runs around what is left. Unlike the black ice's single cut, this plate is cut at both ends and doubly rimmed.",
            },
        ],
    },
    synthwave: {
        shape: [
            {
                key: 'r2-sw-shape-1',
                name: 'Chrome over the grid',
                text: "Echoes the meter's chrome over the grid: a chrome bevel (a light line above, a dark line below) frames the panel over a grid that runs both directions, not just along the floor. Unlike the cassette counter's reel holes or the constellation's stars, the whole face is ruled in a crossing grid.",
            },
            {
                key: 'r2-sw-shape-2',
                name: 'The cassette counter',
                text: "Echoes the columns' cassette counter: two small reel holes sit punched at the top corners, a darker counter strip runs along the foot, corners well rounded. Unlike the chrome grid's ruled face or the constellation's stars, this plate reads as a tape window, not a horizon.",
            },
            {
                key: 'r2-sw-shape-3',
                name: 'The grid-floor constellation',
                text: "Echoes the graph's grid-floor constellation: a scatter of small lit points sits above a single horizon line two-thirds down the panel, square corners. Unlike the chrome grid's crossing lines or the cassette's reel holes, the accents here are a starfield over one horizon, not a ruled floor or a tape deck.",
            },
        ],
    },
    pastel: {
        shape: [
            {
                key: 'r2-pt-shape-1',
                name: 'Washi tape',
                text: "Echoes the meter's washi tape: a strip of tape crosses one corner on the diagonal, its edge left dotted, the rest of the panel plain. Unlike the bubblegum pop's round bulge or the paint swatches' row of chips, the only accent is one taped corner.",
            },
            {
                key: 'r2-pt-shape-2',
                name: 'Bubblegum pop',
                text: 'Echoes the chart’s bubblegum pop: the panel is pulled into a near-circle with generously rounded corners and a small round highlight near the top, like a blown bubble catching the light. Unlike the diagonal tape or the row of swatches, this plate reads as one soft round shape, not a rectangle with an accent.',
            },
            {
                key: 'r2-pt-shape-3',
                name: 'Paint swatches',
                text: "Echoes the columns' paint swatches: a row of small rounded colour chips lines the panel's foot, the rest of the plate a plain rounded rectangle. Unlike the tape's single diagonal strip or the bubble's round silhouette, the accent here is a repeated row along one edge.",
            },
        ],
    },
    terminal: {
        shape: [
            {
                key: 'r2-tm-shape-1',
                name: 'The htop meter',
                text: "Echoes the meter's htop meter: square brackets sit at the panel's two ends like a meter row's `[` and `]`, the border kept only along the top and foot, none at the sides. Unlike the hex dump's gutter bar or the box-drawing map's mixed rules, nothing frames the sides at all.",
            },
            {
                key: 'r2-tm-shape-2',
                name: 'The hex dump',
                text: "Echoes the calendar's hex dump: a dense grid of character-cell lines fills the panel's face and a thick address-gutter bar sits down the inline-start edge, in the phosphor colour. Unlike the htop meter's open sides or the box-drawing map's mixed rules, the one accent is that gutter bar.",
            },
            {
                key: 'r2-tm-shape-3',
                name: 'The box-drawing map',
                text: "Echoes the graph's box-drawing map: the top and foot are ruled in a double line, the sides in a single line, small cross marks sit at all four corners where the rules would meet. Unlike the htop meter's bracket ends or the hex dump's gutter bar, every edge is drawn, each in its own weight.",
            },
        ],
    },
    forest: {
        shape: [
            {
                key: 'r2-fo-shape-1',
                name: 'The wooden gauge',
                text: "Echoes the meter's wooden gauge with the trail's marks: faint horizontal wood-grain lines fill the panel and a row of small trail-blaze ticks sits along the inline-start edge. Unlike the tree rings' concentric circles or the mushroom ring's scalloped edge, the grain and the ticks are the only accents, both straight.",
            },
            {
                key: 'r2-fo-shape-2',
                name: 'Tree rings',
                text: "Echoes the calendar's and the columns' tree rings: faint concentric rings fill the panel's face, centred low, the corners softly rounded to match their curve. Unlike the wood grain's straight lines or the mushroom ring's bumps on the frame itself, the rings sit inside the plate, not on its edge.",
            },
            {
                key: 'r2-fo-shape-3',
                name: 'Mushroom ring',
                text: "Echoes the graph's mushroom ring: the panel's outline is scalloped all the way round in small even bumps, like a fairy ring of caps, no straight edge left. Unlike the wood grain's straight ticks or the tree rings' inner circles, here the accent is the outline itself.",
            },
        ],
    },
};
