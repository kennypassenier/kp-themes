// research/character-chart, round 3 (Kenny, 2026-10-06): group d.
// retro: "Don't like anything here, remake it and make me feel the
// 'retro' vibe of an old windows" — all six aspects remade from the 1995
// desktop's own furniture (the bevel, the title bar, the hourglass, the
// file-copy flyout, the segmented progress bar, the Minesweeper board,
// the dialog's warning triangle), never a tint of round 1 or round 2.
export default {
    retro: {
        shape: [
            {
                key: 'r3-rt-shape-1',
                name: 'The Excel 97 wizard',
                text: "The chart wizard's own page: the plot sunk into the grey chrome on a hard bevel, black grid rules, bold pixel figures. The legend is raised bevelled buttons that sink in when pressed, the crosshair the navy selection colour.",
            },
            {
                key: 'r3-rt-shape-2',
                name: 'The Paint canvas',
                text: 'A white MS Paint canvas in a sunken frame: the lines are thick flat pencil strokes with square corners, the areas filled with the 50% dither brush. The legend sits in the toolbox, flat buttons that press into a well; the crosshair the dashed selection marquee.',
            },
            {
                key: 'r3-rt-shape-3',
                name: 'The Minesweeper board',
                text: 'The plot sits on a board of small raised bevelled tiles, like an unopened minefield; the grid is a single darker rule per row and column cut into the tiles. The legend is square number-tile buttons that sink to their pressed face; the crosshair a thin navy flag line.',
            },
        ],
        tip: [
            {
                key: 'r3-rt-tip-1',
                name: 'The 1995 tooltip',
                text: 'The classic yellow tooltip: a pale yellow box with a plain 1px black line, the time in the pixel face.',
            },
            {
                key: 'r3-rt-tip-2',
                name: 'The little window',
                text: 'A miniature application window: a navy title bar with the time as its caption and a close box, the body in the window grey with a sunken readout.',
            },
            {
                key: 'r3-rt-tip-3',
                name: 'The status bar readout',
                text: "The window's own status bar, unpinned and floating: a sunken bevel strip, the time and the readings set in cells divided by raised rules.",
            },
        ],
        loading: [
            {
                key: 'r3-rt-load-1',
                name: 'The hourglass',
                text: 'The hourglass cursor, sand falling in one bulb and filling the other, flipping over to start again — the one icon the whole desktop used for "wait".',
                ink: '--foreground',
                ink2: '--primary',
            },
            {
                key: 'r3-rt-load-2',
                name: 'The file-copy flyout',
                text: 'A sheet of paper flies from one folder to another and the folder flap lifts to take it, over and over, the way Explorer copied files in 1995.',
                ink: '--foreground',
                ink2: '--primary',
            },
            {
                key: 'r3-rt-load-3',
                name: 'The segmented progress bar',
                text: 'The install-wizard progress bar: navy blocks fill a sunken bar left to right in hard segments, then empty and start again.',
                ink: '--primary',
                ink2: '--foreground',
            },
        ],
        arrival: [
            {
                key: 'r3-rt-arr-1',
                name: 'Painted in hard blocks',
                text: 'The plot is revealed from the left in eight hard-edged blocks, the way a slow video card redrew a maximised window.',
            },
            {
                key: 'r3-rt-arr-2',
                name: 'The window slides open',
                text: 'The plot is revealed from the left at one even, linear pace with no easing at all, the way a dragged window snapped to its outline.',
            },
            {
                key: 'r3-rt-arr-3',
                name: 'Dealt like Solitaire',
                text: 'The lines drop from above and land with a hard, un-eased stop in three steps, the way a dealt card hit the felt.',
            },
        ],
        update: [
            {
                key: 'r3-rt-upd-1',
                name: 'The tractor feed',
                text: 'The whole plot nudges down and snaps back in three hard steps, the way continuous paper jogged through a dot-matrix feed.',
            },
            {
                key: 'r3-rt-upd-2',
                name: 'The odometer rolls',
                text: 'The newest stretch at the right is unmasked in two hard steps, the way a mechanical counter rolled its last wheel over.',
            },
            {
                key: 'r3-rt-upd-3',
                name: 'The bevel pops',
                text: 'The lines swell out to a thicker, raised-bevel weight for a beat and settle back, like a button that was just clicked.',
            },
        ],
        events: [
            {
                key: 'r3-rt-events-1',
                name: 'The warning triangle',
                text: "Each event is the dialog's own warning triangle (a yellow wedge with a black mark), its line a plain black rule down into the plot.",
            },
            {
                key: 'r3-rt-events-2',
                name: 'The rivet',
                text: 'Each event is a small raised bevelled stud, like a rivet on the chrome; its line a sunken groove down into the plot.',
            },
            {
                key: 'r3-rt-events-3',
                name: 'The push-pin flag',
                text: 'Each event is a little flag on a stem, planted at the top of its line, the way a reminder was pinned to the desktop.',
            },
        ],
    },
};
