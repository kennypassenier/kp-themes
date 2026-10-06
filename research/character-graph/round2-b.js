/* research/character-graph, round 3 (Kenny, 2026-10-06 10:58): the new
   loading options of group b — cyberpunk, synthwave, pastel, terminal
   ("Don't like the loading, it should be something based on the shape of
   the graph (nodes and lines), now it's too detached from the end result.
   Be creative." And: "I like loading animations that take advantage of all
   the space that the element takes."). Every option moves the ghost network
   demo.js already lays into the picture while loading (the package's own
   `.kp-graph__edge` / `.kp-graph__node` / `.kp-graph__ring` / `.kp-graph__core`,
   each carrying `--i`, its order from the hub round the ring, and the ghost
   `--n`, how many) — never a spinner, a bar or a plain opacity fade. Six
   genuinely different ideas per theme, each keyed `r3-b-<theme>-load-<n>` so
   round 3's new options never collide with round 2's plain `1`/`2`/`3`. */
export default {
    cyberpunk: {
        loading: [
            [
                'The handshake ping',
                'The hub flares outward in a hard pulse while every link traces itself in from the hub to the rim, one after the next, as a handshake pinging down the whole network at once.',
                'r3-b-cp-load-1',
            ],
            [
                'The port scan',
                'Each site round the ring lights its core in turn, going round once after another without stopping, like a scanner probing every port in sequence.',
                'r3-b-cp-load-2',
            ],
            [
                'The breach trace',
                'The links draw themselves in from the hub one after another, each one jittering hard as it lands, as if a line is forcing its way through the ICE.',
                'r3-b-cp-load-3',
            ],
            [
                'The packet race',
                'A bright packet runs out along every link at once, continuously, from the hub to the rim and back, over and over.',
                'r3-b-cp-load-4',
            ],
            [
                'The grid boot',
                'The ring of sites powers up one by one, each one snapping out to full size and settling, as the whole network boots itself in round the hub.',
                'r3-b-cp-load-5',
            ],
            [
                'The firewall sweep',
                'A neon wedge sweeps round the ring like a scanning firewall, and every site it passes lights its core for a beat before dimming again.',
                'r3-b-cp-load-6',
            ],
        ],
    },
    synthwave: {
        loading: [
            [
                'The laser handshake',
                'The hub swells in a slow neon pulse while every link traces itself in from the hub to the rim in turn, a laser handshake reaching the whole grid at once.',
                'r3-b-sw-load-1',
            ],
            [
                'The marquee lights',
                'The sites round the ring glow up one after another, going round and round without stopping, like chase lights round an arcade marquee.',
                'r3-b-sw-load-2',
            ],
            [
                'The vector trace',
                'The links draw themselves in from the hub one by one, each one holding a beat at full length before the next line starts, a chrome vector beam plotting the grid.',
                'r3-b-sw-load-3',
            ],
            [
                'The outrun pulse',
                'A streak of light runs out along every link at once, continuously, from the hub to the rim and back, like headlights streaking down an outrun highway.',
                'r3-b-sw-load-4',
            ],
            [
                'The grid rez',
                'The ring of sites resolves in and out one by one, round and round, as a wireframe grid rezzing itself into being.',
                'r3-b-sw-load-5',
            ],
            [
                'The horizon sweep',
                'A sunset-striped band sweeps round the ring, and every site it crosses glows for a beat before fading back, the horizon itself doing the reading.',
                'r3-b-sw-load-6',
            ],
        ],
    },
    pastel: {
        loading: [
            [
                'The bubble handshake',
                'The hub softly bulges in a slow breath while every link traces itself in from the hub to the rim in turn, a soap-bubble ripple reaching the whole string of beads.',
                'r3-b-ps-load-1',
            ],
            [
                'The bead lights',
                'The beads round the ring brighten one after another, going round and round without stopping, like fairy lights strung along a candy necklace.',
                'r3-b-ps-load-2',
            ],
            [
                'The crayon trace',
                'The links draw themselves in from the hub one by one, each one holding a beat once fully drawn before the next starts, a crayon tracing the string out bead by bead.',
                'r3-b-ps-load-3',
            ],
            [
                'The sprinkle drift',
                'A soft dot drifts along every link at once, continuously, from the hub to the rim and back, like sprinkles sliding down a row of candy strings.',
                'r3-b-ps-load-4',
            ],
            [
                'The balloon bunch',
                'The beads round the ring puff up and settle back one by one, round and round, as if each were a balloon being tied onto the bunch in turn.',
                'r3-b-ps-load-5',
            ],
            [
                'The watercolour wash',
                'A soft wash of colour sweeps round the ring, and every bead it crosses blooms for a beat before fading back, a brush doing the reading.',
                'r3-b-ps-load-6',
            ],
        ],
    },
    terminal: {
        loading: [
            [
                'The ping sweep',
                'The hub pulses once, hard, while every link traces itself in from the hub to the rim in turn, like a traceroute pinging out to every hop at once.',
                'r3-b-tm-load-1',
            ],
            [
                'The node scan',
                'Each site round the ring lights its core in turn, going round once after another without stopping, as a port scanner printing one result line at a time.',
                'r3-b-tm-load-2',
            ],
            [
                'The boot trace',
                'The links draw themselves in from the hub one after another, each one holding at full length for a beat, like a boot log printing every connection it finds.',
                'r3-b-tm-load-3',
            ],
            [
                'The packet stream',
                'A dashed signal races out along every link at once, continuously, from the hub to the rim and back, a steady stream of packets on the wire.',
                'r3-b-tm-load-4',
            ],
            [
                'The array init',
                'The sites round the ring blink out to full size one by one, round and round, as an array being initialised entry by entry at the prompt.',
                'r3-b-tm-load-5',
            ],
            [
                'The scanline sweep',
                'A scanline band sweeps round the ring, and every site it crosses lights its core for a beat before dimming, a CRT redraw doing the reading.',
                'r3-b-tm-load-6',
            ],
        ],
    },
};
