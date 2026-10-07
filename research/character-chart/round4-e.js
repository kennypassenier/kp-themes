/* research/character-chart, round 4 (Kenny, 2026-10-06 09:31): the six new
   options of group e — blueprint's loading picture only ("do loading again";
   be more creative, out of the box; the compass arc, the French curve, the
   set-square slides and round 2's plotter pen, scanner bar and protractor
   arm were seen and rejected). Each fills the whole plot edge to edge, moves
   at full motion only, and stands still under reduced motion (round4-e.css).
   The ink and the words come from the theme's own tokens through
   `ink`/`ink2`. */
export default {
    blueprint: {
        loading: [
            {
                key: 'r4-bp-ld-1',
                name: 'The pen plotter',
                text: 'A whole technical drawing is plotted corner to corner across the sheet, the pen head riding the growing edge, then lifts and starts again from the empty sheet.',
                ink: '--primary',
                ink2: '--accent',
            },
            {
                key: 'r4-bp-ld-2',
                name: 'The cyanotype exposure',
                text: 'A cyanotype sheet exposes in the sun: a disc of Prussian blue spreads from the centre until it floods the whole sheet, then the paper is swapped for a blank one and it exposes again.',
                ink: '--primary',
                ink2: '--foreground',
            },
            {
                key: 'r4-bp-ld-3',
                name: 'The exploded view assembling',
                text: "Three parts fly in from the sheet's corners and slide together into a row on a dashed centreline, an exploded view assembling itself, then fly apart and assemble again.",
                ink: '--foreground',
                ink2: '--accent',
            },
            {
                key: 'r4-bp-ld-4',
                name: 'The CAD wireframe rotating',
                text: 'A diamond wireframe nearly as large as the sheet turns steadily in place, its spokes sweeping round like a model rotating on a CAD turntable.',
                ink: '--primary',
                ink2: '--accent',
            },
            {
                key: 'r4-bp-ld-5',
                name: 'The grid being ruled',
                text: 'One pen over the whole chart: it traces the chart’s outline, then underlines the places its plot and its legend will stand, in reading order, the pen up between them; 18 units (2880 ms) a loop.',
                ink: '--primary',
            },
            {
                key: 'r4-bp-ld-6',
                name: 'The stamped revision table filling',
                text: "A revision table covers the sheet and a stamp marks off its cells one by one, row by row, filling the whole table before it's wiped and stamped again.",
                ink: '--accent',
                ink2: '--primary',
            },
        ],
    },
};
