/* research/character-chart, round 3 (Kenny, 2026-10-06): the new options of
   group b — terminal (loading, arrival), forest (loading, events), sepia
   (loading), blueprint (loading, events). Every loading option animates at
   full motion and stands still under reduced motion (round3-b.css); the ink
   and the words come from the theme's own tokens through `ink`/`ink2`/`say`. */
export default {
    terminal: {
        loading: [
            {
                key: 'r3-tm-ld-post',
                name: 'The POST check',
                text: 'A row of status cells lights up left to right, like a terminal running its power-on self-test, then clears and runs again.',
                ink: '--primary',
                ink2: '--chart-2',
            },
            {
                key: 'r3-tm-ld-link',
                name: 'The link light',
                text: "Two small activity lights blink out of step, like a modem's TX and RX lamps while it listens for a carrier.",
                ink: '--primary',
                ink2: '--chart-2',
            },
            {
                key: 'r3-tm-ld-crawl',
                name: 'The braille crawl',
                text: 'A row of braille dots grows in from the left in hard steps, a solid cursor cell riding at its head.',
                ink: '--primary',
                ink2: '--foreground',
            },
        ],
        arrival: [
            {
                key: 'r3-tm-ar-print',
                name: 'Printed top to bottom',
                text: 'The lines are revealed from the top down in eight hard steps, like a dot-matrix printer running its head over the page.',
            },
            {
                key: 'r3-tm-ar-dial',
                name: 'The carrier dials in',
                text: 'The lines snap in from the right in five jittery steps, settling the way a dial-up tone settles into a steady carrier.',
            },
            {
                key: 'r3-tm-ar-scroll',
                name: 'Scrolled up from the prompt',
                text: 'The lines rise from the foot of the plot and settle with a small overshoot, as a line does scrolling up a terminal.',
            },
        ],
    },
    forest: {
        loading: [
            {
                key: 'r3-fo-ld-trig',
                name: 'The trig point',
                text: 'A small survey marker walks left to right along a dotted trail, leaving a clay-coloured track behind it.',
                ink: '--primary',
                ink2: '--chart-2',
            },
            {
                key: 'r3-fo-ld-rings',
                name: 'The growth rings',
                text: 'Growth rings spread outward from the centre of the plot, one after another, like a cut log counted in a field guide.',
                ink: '--primary',
                ink2: '--chart-2',
            },
            {
                key: 'r3-fo-ld-blaze',
                name: 'The trail blaze',
                text: 'A painted trail blaze is dabbed onto the plot in three strokes, one after another, then fades and starts again.',
                ink: '--chart-2',
                ink2: '--primary',
            },
        ],
        events: [
            {
                key: 'r3-fo-ev-trig',
                name: 'Trig points',
                text: 'Each event is a small survey triangle on a post, the way a trig point marks a trail on the map.',
            },
            {
                key: 'r3-fo-ev-blaze',
                name: 'Trail blazes',
                text: "Each event is a painted blaze mark, set at an angle like paint brushed on a tree at the trail's turn.",
            },
            {
                key: 'r3-fo-ev-cone',
                name: 'Pinecones',
                text: 'Each event is a small scaled pinecone shape on its stem, dropped where the reading happened.',
            },
        ],
    },
    sepia: {
        loading: [
            {
                key: 'r3-se-ld-blot',
                name: 'The blotter dries',
                text: 'An ink blot soaks into the paper and grows, slows, and starts again, as a nib leaves a drop too long on the page.',
                ink: '--primary',
                ink2: '--chart-2',
            },
            {
                key: 'r3-se-ld-seal',
                name: 'The wax seal presses',
                text: 'A wax seal lowers onto the page and presses flat, a bead of wax at its rim, then lifts and lowers again.',
                ink: '--chart-2',
                ink2: '--primary',
            },
            {
                key: 'r3-se-ld-set',
                name: 'The letters are set',
                text: "Three type blocks drop into the compositor's stick one after another, left to right, then the stick is cleared.",
                ink: '--primary',
                ink2: '--foreground',
            },
        ],
    },
    blueprint: {
        loading: [
            {
                key: 'r3-bp-ld-compass',
                name: 'The compass arc',
                text: 'A drafting compass swings its leg around the centre of the plot, tracing an arc of chain-dashes as it goes.',
                ink: '--primary',
                ink2: '--chart-2',
            },
            {
                key: 'r3-bp-ld-curve',
                name: 'The French curve',
                text: 'A chevroned construction line grows in from the left at an even pace, the way a curve is traced against a French curve.',
                ink: '--primary',
                ink2: '--chart-2',
            },
            {
                key: 'r3-bp-ld-square',
                name: 'The set-square slides',
                text: "A set-square's edge slides across the plot at an even pace, ticking off every millimetre as it goes.",
                ink: '--primary',
                ink2: '--foreground',
            },
        ],
        events: [
            {
                key: 'r3-bp-ev-section',
                name: 'Section cuts',
                text: 'Each event is a small cutting-plane arrow, hatched like a section line, its stem a chain-dashed line.',
            },
            {
                key: 'r3-bp-ev-callout',
                name: 'Callout flags',
                text: 'Each event is a small flagged callout pointing down from a dotted leader, like a note pinned to the drawing.',
            },
            {
                key: 'r3-bp-ev-weld',
                name: 'Weld marks',
                text: 'Each event is a small weld symbol, a ringed flag on its stem, its line dash-dotted like a centreline.',
            },
        ],
    },
};
