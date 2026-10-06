/* research/character-graph, round 3 (Kenny, 2026-10-06 10:58): group c —
   forest, high-contrast, sepia, blueprint, loading only ("Don't like the
   loading, it should be something based on the shape of the graph (nodes
   and lines), now it's too detached from the end result. Be creative." /
   "I like loading animations that take advantage of all the space that the
   element takes."). Every option moves demo.js's ghost — the coming
   network already laid into the picture as the package's own edges and
   nodes (`.kp-graph__ghost`, `--i` round the ring from the hub, `--n` the
   count) — never a spinner or a bar standing apart from it. Six genuinely
   different ideas per theme, each drawn from that theme's own world: the
   trail map and the moss floor for forest, the signage board for
   high-contrast, the letterpress and the nib for sepia, the drafting sheet
   and the plotter for blueprint. Round2-c.css moves these; round2-c.css's
   file comment says how. */
export default {
    forest: {
        loading: [
            [
                'Root tips feel forward',
                'Every root walks out from the ranger station one at a time, drawn from the hub to its cap and pulled back to try again; each cap opens as its root reaches it, closes, and the next root sets off.',
                'r3-fr-load-1',
            ],
            [
                'The canopy sways',
                'The whole ring of caps leans and rights itself like leaves in a slow wind, each a beat behind its neighbour; the roots between them thicken and thin as the canopy moves.',
                'r3-fr-load-2',
            ],
            [
                'Fireflies trace the clearing',
                'A firefly spark runs the length of every root at once, each a little behind the last; the cap it lands on glows warm for a moment before the spark moves on.',
                'r3-fr-load-3',
            ],
            [
                'The ripple spreads',
                'A ripple runs outward from the station through the ring, swelling each cap in turn as it passes and brightening the root it crosses, like rain landing on the moss.',
                'r3-fr-load-4',
            ],
            [
                'The light finds the floor',
                'A soft patch of woodland light turns slowly over the whole clearing; whatever cap it crosses warms for a moment, so the sweep itself reads the ring one site at a time.',
                'r3-fr-load-5',
            ],
            [
                'Cairns stack along the trail',
                'Each cap drops into place from above and settles with a small bounce, one after another round the ring, as if a line of cairns were being stacked stone by stone, forever starting over.',
                'r3-fr-load-6',
            ],
        ],
    },
    'high-contrast': {
        loading: [
            [
                'The board snaps on',
                'Every site on the ring switches hard from off to on, one after another with no fade between, while its root link snaps fully drawn the moment the site lights, like a signage board being switched on segment by segment.',
                'r3-hc-load-1',
            ],
            [
                'The bar thuds across',
                'A heavy black bar thuds round the box in hard steps; every site it crosses flips to reverse video for a beat, the way a scanning light inverts whatever it passes on a sign.',
                'r3-hc-load-2',
            ],
            [
                'The circuit is tested',
                'A short pulse races down every link in hard jumps, and the ring it lands on thickens for a beat, as a continuity tester pings its way round the whole board, link by link.',
                'r3-hc-load-3',
            ],
            [
                'The count ticks',
                'Each site punches up to full size in two hard beats, one after another round the ring, landing with a thud and holding, like a row of digits ticking over on a counter.',
                'r3-hc-load-4',
            ],
            [
                'The whole sign strobes',
                'The entire network — every link and every site at once — snaps between on and off together, a hard synchronised flash, the way a whole sign strobes rather than one bulb at a time.',
                'r3-hc-load-5',
            ],
            [
                'The frame is bolted',
                'Each site’s ring is traced in four hard square steps, one corner at a time, moving round the whole network site by site, as if every frame on the board were being bolted on in turn.',
                'r3-hc-load-6',
            ],
        ],
    },
    sepia: {
        loading: [
            [
                'The nib inks each line',
                'Every link is drawn out from the hub by the nib, one line at a time, then drawn back to dip and start again, the ink reaching a little further round the ring each time it passes.',
                'r3-se-load-1',
            ],
            [
                'The platen presses',
                'Each site is pressed down from a blur into sharp relief, one after another round the ring, with the small thud of a letterpress stamping one piece of type at a time.',
                'r3-se-load-2',
            ],
            [
                'The compass sweeps',
                'A fine arc turns slowly over the whole plate like a draughtsman’s compass; whatever site it crosses darkens for a moment, so the sweep itself reads the ring one site at a time.',
                'r3-se-load-3',
            ],
            [
                'Ink bleeds along the wires',
                'A bead of wet ink runs the length of every link at once, each a little behind the last, and the site it reaches darkens and settles before the next bead sets off.',
                'r3-se-load-4',
            ],
            [
                'The seal turns and presses',
                'Each site turns a little and presses larger for a moment, one after another round the ring, as if a wax seal were being pressed at every site in turn.',
                'r3-se-load-5',
            ],
            [
                'Type is set along the frame',
                'Each site drops into place from above and settles, one after another round the ring, and the link behind it is ruled in the moment it lands, as type is set into a letterpress frame piece by piece.',
                'r3-se-load-6',
            ],
        ],
    },
    blueprint: {
        loading: [
            [
                'The plotter pulls each wire',
                'Every wire is drawn out from the terminal block by the plotter, one at a time, then pulled back and drawn again a little further, the amber pen never quite finishing the round.',
                'r3-bp-load-1',
            ],
            [
                'The compass walks the ring',
                'A fine arm turns slowly over the whole sheet like a drafting compass; every pad it crosses glows amber for a moment, so the sweep itself reads the layout one pad at a time.',
                'r3-bp-load-2',
            ],
            [
                'Current finds the circuit',
                'A short pulse of current runs the length of every wire at once, each a little behind the last, and the pad it reaches glows before the current moves on to find the next one.',
                'r3-bp-load-3',
            ],
            [
                'Each pad is soldered',
                'Every pad swells and brightens for a moment, one after another round the ring, with the small flare of a solder joint being made at each site in turn.',
                'r3-bp-load-4',
            ],
            [
                'The grid snaps the ring in',
                'Each pad overshoots and settles hard into place, one after another round the ring, the way a part snaps to the nearest grid line when it is dropped on a drafting sheet.',
                'r3-bp-load-5',
            ],
            [
                'The schematic is ruled out',
                'Every wire on the sheet redraws almost together, a beat apart rather than one by one, and each pad gives a small tick as its line completes, as an auto-router rules out the whole circuit in one fast pass.',
                'r3-bp-load-6',
            ],
        ],
    },
};
