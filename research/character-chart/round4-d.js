/* research/character-chart, round 4 (Kenny, 2026-10-06 09:31): the six new
   options of group d. sepia's loading picture is the only open row for this
   group (round 3's "no" to the blotter, the wax seal and the type being set;
   round 2's dip pen, platen and engraver's dots are settled out too). Each
   option fills the whole plot, edge to edge, in the letterpress specimen's
   own world: paper, ink, print and the darkroom. */
export default {
    sepia: {
        loading: [
            {
                key: 'r4-se-load-galley',
                name: 'The galley sets',
                text: 'Lines of type compose down the whole page, row by row, until the galley is full top to bottom; then it is cleared and set again.',
                ink: '--foreground',
                ink2: '--primary',
            },
            {
                key: 'r4-se-load-develop',
                name: 'The print develops',
                text: 'The tray fills from the foot upward as the sepia print comes up out of the liquid, then drains back to a blank sheet and starts again.',
                ink: '--primary',
                ink2: '--primary',
            },
            {
                key: 'r4-se-load-roller',
                name: 'The forme is rolled',
                text: 'An inked roller passes the full width of the forme, left to right, laying ink across the whole plate before it lifts and starts its pass again.',
                ink: '--primary',
                ink2: '--foreground',
            },
            {
                key: 'r4-se-load-ledger',
                name: 'The ledger page fills',
                text: 'A nib writes its way along one ruled line after another, left to right down the whole page, then lifts back to the top and starts the page again.',
                ink: '--foreground',
                ink2: '--primary',
            },
            {
                key: 'r4-se-load-fox',
                name: 'The page foxes',
                text: 'Age spots bloom and spread across the whole page, growing larger the longer the plate waits, then the page is replaced by a clean sheet.',
                ink: '--chart-2',
                ink2: '--primary',
            },
            {
                key: 'r4-se-load-turn',
                name: 'The page turns',
                text: 'A diagonal fold sweeps across the whole page corner to corner, as if a leaf were turning over, showing the next leaf beneath before it comes round again.',
                ink: '--primary',
                ink2: '--foreground',
            },
        ],
    },
};
