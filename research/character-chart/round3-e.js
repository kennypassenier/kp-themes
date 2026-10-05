/* research/character-chart, round 3 (Kenny, 2026-10-06): the new options of
   group e — grotesk (loading, tip), lapis (loading), nostromo (loading,
   arrival) and titanium (events). Every other aspect of these four themes is
   settled from round 2 and is not touched here. */

export default {
    grotesk: {
        loading: [
            {
                key: 'r3-gr-load-1',
                name: 'The baseline tally',
                text: 'Five ink squares sit on the baseline; they fill in solid one after another, left to right, in hard steps, then the tally resets and counts again.',
                ink: '--foreground',
                ink2: '--primary',
            },
            {
                key: 'r3-gr-load-2',
                name: 'The grid build',
                text: 'A hairline Swiss grid, both its rules and its columns, is laid in from the left in eight hard steps, then cleared and laid again.',
                ink: '--foreground',
                ink2: '--primary',
            },
            {
                key: 'r3-gr-load-3',
                name: 'The red marker',
                text: "A small red square steps along the top edge over a faint row of column ticks, column by column, the reader's eye led across the data the way a proof mark is.",
                ink: '--foreground',
                ink2: '--primary',
            },
        ],
        tip: [
            {
                key: 'r3-gr-tip-1',
                name: 'The specification label',
                text: 'A white plate in a 2px ink frame, flush corners, a small red square marking the time, set in the bold grotesque.',
            },
            {
                key: 'r3-gr-tip-2',
                name: 'The index plate',
                text: 'Black with white figures and a red rule across the top, the way the pressed legend button reads.',
            },
            {
                key: 'r3-gr-tip-3',
                name: 'The punch card',
                text: 'A plain card with two round holes punched at its left edge and a red rule along its foot, flush corners throughout.',
            },
        ],
    },
    lapis: {
        loading: [
            {
                key: 'r3-la-load-1',
                name: 'The gilt brushstroke',
                text: "A soft bar of gold, fading at both ends, sweeps across the vellum and back, as a burnisher's hand lays gold leaf.",
                ink: '--primary',
                ink2: '--foreground',
            },
            {
                key: 'r3-la-load-2',
                name: 'The girih weave',
                text: 'Two sets of fine gold lines, one laid each way, drift past each other in a slow diagonal weave, as the lattice is traced.',
                ink: '--primary',
                ink2: '--accent',
            },
            {
                key: 'r3-la-load-3',
                name: 'The gold dust',
                text: 'Fine flecks of gold and ivory drift slowly down the page, as ground pigment settles after the brush has passed.',
                ink: '--primary',
                ink2: '--foreground',
            },
        ],
    },
    nostromo: {
        loading: [
            {
                key: 'r3-no-load-1',
                name: 'The alert pulse',
                text: 'The whole screen breathes with an amber glow at its centre, brightening and fading, the way a warning light does before anything else shows.',
                ink: '--sidebar-primary',
                ink2: '--sidebar-foreground',
            },
            {
                key: 'r3-no-load-2',
                name: 'The sentry patrol',
                text: 'A single blip walks a diamond beat around a faint outline and back, the way a motion tracker holds its ground until it has something to report.',
                ink: '--sidebar-primary',
                ink2: '--sidebar-foreground',
            },
            {
                key: 'r3-no-load-3',
                name: 'The static roll',
                text: 'Fine interference bars drift up the screen without pause, the snow of a set still finding its signal.',
                ink: '--sidebar-primary',
                ink2: '--sidebar-foreground',
            },
        ],
        arrival: [
            {
                key: 'r3-no-arr-1',
                name: 'The warm-up flicker',
                text: 'The lines reveal left to right while flickering in hard steps, as the tube finds its picture.',
            },
            {
                key: 'r3-no-arr-2',
                name: 'The pen lift',
                text: 'The lines reveal left to right and settle with a small overshoot, like a recorder pen lifting off the paper and landing again.',
            },
            {
                key: 'r3-no-arr-3',
                name: 'The phosphor trace',
                text: 'The lines reveal left to right behind a travelling glow, the way a fresh phosphor trace is brighter than the lines that came before it.',
            },
        ],
    },
    titanium: {
        events: [
            {
                key: 'r3-ti-ev-1',
                name: 'Countersunk washers',
                text: 'Each event is a countersunk washer, a wide machined ring with the paper showing through its hollow; its line a fine machined groove.',
            },
            {
                key: 'r3-ti-ev-2',
                name: 'The anodised rivet',
                text: 'Each event is a rivet head in the blue oxide anodised accent, with a faint glow at its edge; its line the same blue, finely dashed.',
            },
            {
                key: 'r3-ti-ev-3',
                name: 'The knurled stud',
                text: 'Each event is a stud with a knurled ring cut into its edge around a solid metal head; its line a thin engraved rule.',
            },
        ],
    },
};
