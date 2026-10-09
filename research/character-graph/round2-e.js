/* research/character-graph, round 3 (Kenny, 2026-10-06 10:58): the new
   "While loading" options of group e — shade-dark, retro, grotesk, lapis,
   nostromo. Kenny: "Don't like the loading, it should be something based
   on the shape of the graph (nodes and lines), now it's too detached from
   the end result. Be creative." And: "I like loading animations that take
   advantage of all the space that the element takes." Every option here
   moves the ghost network (`.kp-graph__ghost`, demo.js's `ghost()`: the
   package's own `.kp-graph__edge`/`.kp-graph__node`/`.kp-graph__ring`/
   `.kp-graph__core`, each carrying `--i` round the ring from the hub and
   `--n` the node count) laid under the hidden skeleton — never a spinner,
   a bar or an opacity fade. Six genuinely different ideas per theme, from
   that theme's own world. Every key is namespaced `r3-<tag>-load-<n>` so it
   can never collide with round 2's plain `1`/`2`/`3` or another group's
   keys. */
export default {
    grotesk: {
        loading: [
            [
                'The transit line runs',
                'A bold coloured dash runs the length of every link, hub to rim, one route starting just as the last one reaches its stop, exactly the way a transit map shows a line running its route.',
                'r3-gk-load-1',
            ],
            [
                'The interchange ticks',
                'Every white interchange ring ticks round hard, one notch at a time, round the whole ring in turn, like a line being checked stop by stop before the timetable starts.',
                'r3-gk-load-2',
            ],
            [
                'The grid snaps into place',
                'A hard-edged block sweeps once round the box in flat steps, and every link it crosses snaps to full weight for a beat, the whole picture assembling itself grid cell by grid cell.',
                'r3-gk-load-3',
            ],
            [
                'The route is checked end to end',
                'Every link’s bold dash steps backward from the rim toward the hub, over and over, as if every route is being walked back to the control centre to be checked.',
                'r3-gk-load-4',
            ],
            [
                'The signal pulses down every line',
                'The hub flashes hard once, and the pulse runs straight out along every link in turn, one flat beat per line, the way a signal box fires a line down the whole network.',
                'r3-gk-load-5',
            ],
            [
                'The timetable flips through every stop',
                'Each site flips a quarter turn and holds, one after another round the ring, square and definite, like a split-flap timetable display working through every stop on the line.',
                'r3-gk-load-6',
            ],
        ],
    },
    nostromo: {
        loading: [
            [
                'The sweep finds every contact',
                'A green radar sweep turns steadily round the hub, and every site it passes catches a brief, brighter ring, exactly the way a radar scope lights a contact as the beam crosses it.',
                'r3-no-load-1',
            ],
            [
                'Blips surface round the scope',
                'Each site blinks into view and out again, one after another round the ring, the hub holding a slow steady pulse beneath them, the way new contacts surface on an old radar scope.',
                'r3-no-load-2',
            ],
            [
                'Phosphor traces every line',
                'Every link draws itself outward from the hub in a thin glowing trace, the way old phosphor draws a line and lets it fade before drawing the next one round the ring.',
                'r3-no-load-3',
            ],
            [
                'MOTHER reads the network',
                'A short data segment steps mechanically along every link, in hard, even steps, while each site flickers briefly as it is reached, the way a terminal reads through a list line by line.',
                'r3-no-load-4',
            ],
            [
                'The lamps scan the board',
                'Each node ring brightens and dims in turn, one scanning pass after another round the whole ring, exactly the way a row of indicator lamps scans a panel left to right.',
                'r3-no-load-5',
            ],
            [
                'The scanline rolls down the board',
                'A faint horizontal scanline rolls steadily down the whole box, over the hub and every site alike, while the network beneath it holds a slow phosphor bloom, breathing with the roll.',
                'r3-no-load-6',
            ],
        ],
    },
};
