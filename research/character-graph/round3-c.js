/* research/character-graph, round 4 (Kenny, 2026-10-06 12:31): the new
   options of group c — brutalism only. Its shape stays 2 ("The sticker
   sheet"); loading, arrival, focus and live all go round again ("don't
   like any of these", both round 2's and round 3's group f
   (round2-f.js) builds). Every option moves the ghost network demo.js
   lays into the picture (`.kp-graph__ghost`: `.kp-graph__edges >
   path.kp-graph__edge` with `pathLength="100"`, and `g.kp-graph__node`
   holding `.kp-graph__ring` and `.kp-graph__core`, each carrying `--i`,
   its order from the hub round the ring, and the ghost its own `--n`).
   Every key is namespaced `r4-c-bru-<aspect>-<n>` so it can never collide
   with round 2's plain `1`/`2`/`3`, round 3's `r3-d-bru-…` / `r3-fo-…`, or
   another group's keys. */
export default {
    brutalism: {
        loading: [
            [
                'The plot line is struck',
                'Every link is plotted outward from the hub in a few blunt, hard-edged strokes, no glide, going round the ring one line at a time; the sites themselves sit still and let the lines do the reading.',
                'r4-c-bru-load-1',
            ],
            [
                'The gantry scan sweeps',
                'A hard-edged band in poster yellow and violet rakes once across the whole box like a gantry crane’s beam, and every site it crosses punches brighter for a moment, reading the ring left to right.',
                'r4-c-bru-load-2',
            ],
            [
                'The shockwave rings out',
                'A heavy black ring expands outward from the hub in a few hard jumps, filling the whole box as it grows; every link it crosses flashes bright the instant the ring passes over it.',
                'r4-c-bru-load-3',
            ],
            [
                'The tack gun fires round',
                'Each site is tacked down from above in one short, hard drop with no bounce, going round the ring one site at a time, as a tack gun driving a fastener flush.',
                'r4-c-bru-load-4',
            ],
            [
                'The rebar is chalked in',
                'A diagonal chalk-stripe pattern crawls slowly across the whole box behind the network, while every link is struck in with a hard, deliberate stroke from the hub outward underneath it.',
                'r4-c-bru-load-5',
            ],
            [
                'The tally clicks round',
                'Each site clicks on with a short, sharp jolt, one after another all the way round the ring like a mechanical tally counting sites off; the links stay put, already struck in heavy and still.',
                'r4-c-bru-load-6',
            ],
        ],
        arrival: [
            [
                'Cast in one pour',
                'Every link is plotted outward from the hub in a few hard strokes; each site starts oversized, as freshly poured concrete, and is struck level to its true size in a single hard snap the instant its link lands.',
                'r4-c-bru-arr-1',
            ],
            [
                'Sheared flush',
                'Every link is drawn in leaning hard off true and sheared flush to square in a couple of blunt jumps, like a guillotine squaring a sheet; each site snaps up from half size to full in two hard beats right behind it.',
                'r4-c-bru-arr-2',
            ],
            [
                'Printed through the screen',
                'Every link is struck in from the hub in hard, even strokes; each site comes up flat and colourless and then punches to full ink and true size in one hard beat, as a screen-print mesh dropping its colour.',
                'r4-c-bru-arr-3',
            ],
        ],
        focus: [
            [
                'Boxed in black ink',
                'The pick is framed in a thick dashed black stencil ring; the rest of the network is bleached and oversaturated, as a poster left out in the sun; a hidden kind’s chip is blacked out to a solid redacted bar.',
                'r4-c-bru-focus-1',
            ],
            [
                'The rubber stamp, askew',
                'The whole picked site tilts a few degrees off true, as a rubber stamp planted in a hurry, ringed heavy in poster yellow; the rest goes dark and flat; a hidden kind’s chip gets a thick dashed black outline.',
                'r4-c-bru-focus-2',
            ],
            [
                'Framed and bleached',
                'The pick is boxed in red with a doubled hard offset shadow, one black and one red; the rest of the network washes out pale and grey; a hidden kind’s chip fades to almost nothing, as if erased from the plan.',
                'r4-c-bru-focus-3',
            ],
        ],
        live: [
            [
                'Re-struck',
                'The changed site is bumped hard once in violet, as a loose block knocked back into true; its link is struck again from end to end in the same violet, a quick hard redraw.',
                'r4-c-bru-live-1',
            ],
            [
                'The gauge clicks over',
                'The changed site’s ring jumps thick for a moment in poster yellow, as a dial just clicked to a new reading; its link is struck in fresh from end to end in the same beat.',
                'r4-c-bru-live-2',
            ],
            [
                'Re-cast',
                'The changed site flattens hard and snaps back round in red, as a slab briefly re-poured and struck level again; its link pulses heavy once in the same red, end to end.',
                'r4-c-bru-live-3',
            ],
        ],
    },
};
