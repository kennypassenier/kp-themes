// research/character-calendar: round two's new options for the aspect
// Kenny sent back open in high-contrast, "while loading" (Kenny, 2026-10-06
// 10:30: "don't like the loading, a spinner in each day is barely visible";
// the spinner-in-each-day look also often took long to load, since forty-two
// animated day cells are heavy). NEW (Kenny, 2026-10-06): "I like loading
// animations that take advantage of all the space that the element takes" —
// so every option here is one picture across the whole grid, edge to edge,
// not a small glyph repeated per day. Every picture is unmistakable in
// high-contrast's own terms: heavy ink, signal yellow, strong blue, and a
// pattern or a big shape, never a tint or a speed of the same idea.
//
// Mechanism: `js/calendar.js` already sets `--cl-row` and `--cl-col` on
// every grid cell (0-6 across, 0-5 down; demo.js's arrival rows read them
// too). Each day's `::after` reads a single background sized to the whole
// grid (700% × 600%, seven columns by six rows) and positions itself with
// `calc(var(--cl-col) * -100%)` / `calc(var(--cl-row) * -100%)`, so every
// cell shows exactly its own slice of one continuous picture. The loop
// always shifts by one full tile (-700% and/or -600%), which is seamless by
// definition of `background-repeat: repeat` regardless of the pattern's own
// period, so every cell keeps its own (cheap) CSS animation — satisfying
// "one Animation per cell" for review's own measuring — while the moving
// picture reads as a single sweep across the whole month, not forty-two
// separate heavy loops.
export default {
    'high-contrast': {
        loading: [
            {
                key: 'r2-hc-load-1',
                name: 'The hazard tape',
                text: 'Loading shows ink-and-signal-yellow hazard stripes running diagonally across the whole grid: one picture, not forty-two small ones. Now it moves: the tape runs the length of the whole month, again and again.',
            },
            {
                key: 'r2-hc-load-2',
                name: 'The shutter bars',
                text: 'Loading shows thick ink-and-blue bars spanning the whole grid like a dropped shutter. Now it moves: the bars step down across the whole month, row by row, in hard steps.',
            },
            {
                key: 'r2-hc-load-3',
                name: 'The scanner beam',
                text: 'Loading shows one wide signal-blue beam on a field of ink, the whole month read as a single band. Now it moves: the beam sweeps the full width of the grid, again and again.',
            },
            {
                key: 'r2-hc-load-4',
                name: 'The barcode scan',
                text: "Loading shows the whole month as one dense ink-and-card barcode, a single picture across the grid. Now it moves: the bars step across the whole width, as a scanner's beam reads it.",
            },
            {
                key: 'r2-hc-load-5',
                name: 'The marching ruling',
                text: "Loading shows the grid's own bold ink ruling across the whole month at once. Now it moves: the ruling redraws itself across the whole grid in hard steps, again and again.",
            },
            {
                key: 'r2-hc-load-6',
                name: 'The hazard checker',
                text: 'Loading shows one hazard-flag checker, ink and signal yellow, in large squares across the whole grid. Now it moves: the checker shifts diagonally across the whole month in hard steps, again and again.',
            },
        ],
    },
};
