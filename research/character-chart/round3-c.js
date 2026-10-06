/* research/character-chart, round 3 (Kenny, 2026-10-06): the new options of
   group c (brutalism, deco, phantom, shade-light), for the aspects Kenny
   sent back on 2026-10-06 — three fresh options each, never a tint of the
   round-2 options they replace. */

export default {
    brutalism: {
        loading: [
            {
                key: 'r3c-bru-load-1',
                name: 'The pile driver',
                ink: '--foreground',
                ink2: '--primary-foreground',
                text: 'A black weight slams down onto a yellow stake and stops hard; it lifts and slams again.',
            },
            {
                key: 'r3c-bru-load-2',
                name: 'The wrecking ball',
                ink: '--foreground',
                ink2: '--chart-2',
                text: 'A ball on a chain swings pendulum-fashion from a fixed point above the plot, side to side, never easing to a stop.',
            },
            {
                key: 'r3c-bru-load-3',
                name: 'The rivet gun',
                ink: '--foreground',
                ink2: '--primary-foreground',
                text: 'Four square rivets sit in a row; a yellow strike mark jumps from one to the next in hard steps, then starts over.',
            },
        ],
        tip: [
            {
                key: 'r3c-bru-tip-1',
                name: 'The warning plate',
                text: 'A red plate with a hazard-striped corner, black 3px frame, bold white capitals for the time.',
            },
            {
                key: 'r3c-bru-tip-2',
                name: 'The punch card',
                text: 'A flat white card with one corner cut away at an angle and a 3px black line; no shadow, a hole-punch look.',
            },
            {
                key: 'r3c-bru-tip-3',
                name: 'The stencil tag',
                text: 'A black plate tilted two degrees with a thick dashed yellow outline and bold yellow stencilled figures.',
            },
        ],
    },
    deco: {
        events: [
            {
                key: 'r3c-deco-ev-1',
                name: 'Gilt cabochons',
                text: 'Each event is a faceted jewel in its own tone with a gold edge catching the light; its line a fine gold chain, dash by dash.',
            },
            {
                key: 'r3c-deco-ev-2',
                name: 'Stepped plinths',
                text: 'Each event sits on a small gold stepped plinth, ziggurat-fashion; its line a gold rule in long-short hairlines.',
            },
            {
                key: 'r3c-deco-ev-3',
                name: 'Sunburst medallions',
                text: 'Each event is ringed by four short gold rays like a small sunburst; its line a shimmer of fine gold dashes.',
            },
        ],
    },
    phantom: {
        loading: [
            {
                key: 'r3c-pha-load-1',
                name: 'The red safelight',
                ink: '--foreground',
                ink2: '--primary',
                text: 'A halftone screen lies still on the plot while a red bar slides side to side like a darkroom safelight, swapping hard between dim and lit.',
            },
            {
                key: 'r3c-pha-load-2',
                name: 'The off-register plates',
                ink: '--foreground',
                ink2: '--primary',
                text: 'A black halftone layer sits still under a red one that jitters a few pixels left and right in hard steps, as a misprinted plate does.',
            },
            {
                key: 'r3c-pha-load-3',
                name: 'The ransom scrap',
                ink: '--foreground',
                ink2: '--primary',
                text: 'A cut-paper scrap slides in from the left in hard steps, tilts, and stops; then it slides back and comes in again.',
            },
        ],
        arrival: [
            {
                key: 'r3c-pha-arr-1',
                name: 'Torn in at an angle',
                text: 'The lines are revealed left to right behind a jagged, skewed edge, as a torn strip of paper would reveal them.',
            },
            {
                key: 'r3c-pha-arr-2',
                name: 'The flashbulb snap',
                text: 'Each line snaps in oversize and settles to its true size at once, like a flashbulb catching it.',
            },
            {
                key: 'r3c-pha-arr-3',
                name: 'Resolved in halftone bands',
                text: 'The lines are revealed left to right in hard halftone-width steps, as a print resolves band by band.',
            },
        ],
        events: [
            {
                key: 'r3c-pha-ev-1',
                name: 'Bullet holes',
                text: 'Each event is a small red mark with a cracked halo around it; its line solid and thin, like a hole through the print.',
            },
            {
                key: 'r3c-pha-ev-2',
                name: 'Redaction bars',
                text: 'Each event is blacked out, a short bar over the point as a censor would strike it; its line solid black.',
            },
            {
                key: 'r3c-pha-ev-3',
                name: 'Ransom diamonds',
                text: 'Each event is a small white diamond cut from paper with a red edge, pinned to the line; its line dashed red.',
            },
        ],
    },
};
