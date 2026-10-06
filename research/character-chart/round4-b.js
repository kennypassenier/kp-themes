/* research/character-chart, round 4 (Kenny, 2026-10-06 09:31): the six new
   options of group b — terminal's loading picture only. Kenny rejected
   round 3's POST check, link light and braille crawl (round3-b.js) and
   round 2's prompt/progress-bar/phosphor-sweep (R2.terminal): "don't like
   the loading ones, I like loading animations that take advantage of all
   the space that the element takes. Be creative and give 6 versions."
   Every option below fills the whole state box edge to edge (the
   `aspects.css` reset already insets `::before`/`::after` to 0, so neither
   layer narrows that unless it is a thin accent on top of a full-area
   base); every one keeps at least one layer covering the full box. Keyed
   exactly as aspects.css: `data-cc-loading` on the state box and its two
   pseudo-elements, inked through `--ccl-i`/`--ccl-j` (set from `ink`/
   `ink2` by demo.js). All motion is inside the
   `prefers-reduced-motion: no-preference` block in round4-b.css; every
   still frame already reads as loading. */
export default {
    terminal: {
        loading: [
            {
                key: 'r4-tm-load-boot',
                name: 'The boot log',
                text: 'The whole screen is a scrolling boot log: rows of text climb the full height of the plot, a second, paler pass of lines drifting past them at its own speed, the way dmesg keeps scrolling long after the machine is up.',
                ink: '--foreground',
                ink2: '--primary',
            },
            {
                key: 'r4-tm-load-curses',
                name: 'The curses install',
                text: 'Four bracketed progress bars fill the whole plot top to bottom, like a curses installer running several jobs at once, each filling to its own width in hard steps before the whole screen resets and runs again.',
                ink: '--primary',
                ink2: '--chart-3',
            },
            {
                key: 'r4-tm-load-matrix',
                name: 'The column drop',
                text: 'Columns of characters run the full width and height of the plot, a brighter leading row of glyphs falling down through the dimmer field beneath it, over and over, the way a wall of falling text runs top to bottom.',
                ink: '--primary',
                ink2: '--chart-5',
            },
            {
                key: 'r4-tm-load-braille',
                name: 'The braille canvas',
                text: 'The full plot is a braille dot canvas: a faint grid of every dot the screen could set sits underneath, and a brighter patch of plotted dots sweeps diagonally across the whole area, corner to corner, as if the canvas were being plotted anew each pass.',
                ink: '--border-strong',
                ink2: '--primary',
            },
            {
                key: 'r4-tm-load-frame',
                name: 'The frame draw',
                text: 'A faint box-drawing grid divides the whole plot into six panels, like a tiled status screen; a brighter copy of the same grid draws itself in from the top-left panel to the bottom-right one, one panel at a time, then starts again.',
                ink: '--border-strong',
                ink2: '--chart-2',
            },
            {
                key: 'r4-tm-load-dialup',
                name: 'The handshake waterfall',
                text: "Noise bands fill the full height of the plot and scroll upward in small jerks, like a modem's handshake waterfall; a brighter carrier band rises through them with a small side-to-side wobble, the signal settling in and dropping out, again and again.",
                ink: '--chart-2',
                ink2: '--chart-3',
            },
        ],
    },
};
