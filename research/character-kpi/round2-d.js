/* research/character-kpi, round 2 (Kenny, 2026-10-06 19:24): the new options
   of group d. Only titanium is open here (tone: 1, live: 3 are settled from
   round 1 and are not touched).

   Shape, three new options (Kenny: "again, you can do much better for
   titanium") — past the milled plate / instrument dial / anodised tag of
   round 1, drawing instead on the heat-tinted groove (meter), the anodised
   rivet (chart) and the knurl (graph/trend/menu).

   While loading, six new options (Kenny: "none of these"; a rejected
   loading picture gets six) — machining, anodising colour-shift, a gauge,
   a milling pass, a knurling wheel and an inspection lamp, each moving the
   whole tile.

   Hover, focus, press, three new options (Kenny: "again, none are good") —
   a torque wrench's detent, the anodising flash and witness-mark brackets. */

export default {
    titanium: {
        shape: [
            {
                key: 'r2-ti-shape-1',
                name: 'The heat-tint rim',
                text: 'A thin frame carries the blue-to-gold heat-tint oxide band of the meter’s groove, the number in instrument mono, the change on its own machined tab.',
            },
            {
                key: 'r2-ti-shape-2',
                name: 'The counterbored plate',
                text: 'Two small counterbored rivets sit at the plate’s top corners, as the chart’s anodised rivets do, a knurled band under the label, the change on a machined tab.',
            },
            {
                key: 'r2-ti-shape-3',
                name: 'The chamfered boss',
                text: 'The plate’s corners are chamfered flat, as a milled fastener’s boss, with a diagonal machined sheen across the face, the change on its own machined tab.',
            },
        ],
        loading: [
            {
                key: 'r2-ti-load-1',
                name: 'The anodising bath',
                text: 'While the figure loads, the whole plate’s surface cycles through the heat-tint oxide spectrum, blue through violet to gold, as a part dipped in the anodising bath; it keeps cycling until the reading is drawn.',
            },
            {
                key: 'r2-ti-load-2',
                name: 'The facing pass',
                text: 'While the figure loads, a cutter blade the full height of the tile travels left to right across its face, as a facing pass squares a block; it keeps travelling until the reading is drawn.',
            },
            {
                key: 'r2-ti-load-3',
                name: 'The gauge sweep',
                text: 'While the figure loads, a needle the height of the tile pivots from its foot through a wide arc and back, as an instrument gauge searching for its reading; it keeps sweeping until the reading is drawn.',
            },
            {
                key: 'r2-ti-load-4',
                name: 'The knurl scroll',
                text: 'While the figure loads, a knurled texture over the whole plate scrolls sideways without pause, as a knurling wheel rolling along the edge of a part; it keeps scrolling until the reading is drawn.',
            },
            {
                key: 'r2-ti-load-5',
                name: 'The witness lamp',
                text: 'While the figure loads, a bright tick travels the whole perimeter of the frame, corner to corner, as an inspection lamp run around a part’s edge; it keeps travelling until the reading is drawn.',
            },
            {
                key: 'r2-ti-load-6',
                name: 'The passivation sheen',
                text: 'While the figure loads, a diagonal specular band sweeps the whole tile corner to corner, as the pass light catches a part being passivated; it keeps sweeping until the reading is drawn.',
            },
        ],
        interactive: [
            {
                key: 'r2-ti-int-1',
                name: 'The detent click',
                text: 'Hover brightens the frame to the primary and warms the plate; a press seats the tile one notch down, as a torque wrench finding its detent; focus draws a bold double ring in the primary.',
            },
            {
                key: 'r2-ti-int-2',
                name: 'The anodising flash',
                text: 'Hover lays the heat-tint oxide band across the frame, as the rim of the chosen shape; a press deepens it toward gold; focus draws a single heavy ring offset clear of the plate.',
            },
            {
                key: 'r2-ti-int-3',
                name: 'The witness bracket',
                text: 'Hover lights four small corner brackets on the frame, as a machinist’s witness marks; a press draws the brackets in tight against the plate; focus thickens the brackets and tints them in the primary.',
            },
        ],
    },
};
