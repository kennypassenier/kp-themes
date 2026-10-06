// research/character-tiles/round2-b.js — round 2, batch b: the tone of a
// tile, synthwave and sepia only (Kenny, 2026-10-06 18:04).
//
// synthwave: "the ok and warning states are barely visible because of the
// colours" — round 1's tone (`IDEAS.synthwave.tone`, the glass chip / the
// inverse block / the arcade warning) mixed `--success` and `--warning`
// into the mark or the plate at low opacity; both are near-black base
// tokens in synthwave (success hsl(155 60% 14%), warning hsl(48 60% 16%)),
// so an ok or warning tile all but vanished against the card's own dark
// ground, while destructive (a bright red base token) read fine. All
// three options below instead reach for each tone's bright half —
// `--success-foreground` (mint), `--warning-foreground` (amber) and
// `--destructive` itself (already bright) — so ok and warning glow as
// loud as destructive, never the dim background pair.
//
// sepia: "don't like any of these" — round 1's tone (the status plate /
// letterpress border / the rubber stamp) is rejected outright, replaced
// by three ideas from sepia's own ink-and-paper world (wax, hand-inked
// circles, a tipped-in photograph plate), none a status plate, a border
// recolour or a stamp.
//
// Coherence (Kenny, 2026-10-06): every option below echoes a pick already
// made for that theme's other components (research/THEME_PROFILES.md) —
// named inside its own text, not just in this comment.

/** @typedef {{ name: string, text: string, key: string }} Option */

export default {
    synthwave: {
        tone: /** @type {Option[]} */ ([
            {
                key: 'r2-sw-tone-1',
                name: 'The neon pill',
                text: "The mark swells into a neon pill: a near-white core (the Synthwave '84 rule — the glow lives in the shadow, the core never dims) wrapped in a bloom of the tone's own colour. Echoes the meter's Overdrive and the columns' neon pill: ok blooms the meter's mint, warning blooms the columns' amber, destructive blooms laser red — all three equally loud, none the dim night-ground tone.",
            },
            {
                key: 'r2-sw-tone-2',
                name: 'The grid-floor band',
                text: "A band lights along the card's own foot, a hairline white scanline on its top edge and the band itself filled solid in the tone's colour — not a dim wash of it. Echoes the calendar's grid-floor month lighting its own tones and today: ok lights mint, warning lights amber, destructive lights red, each full strength against the horizon.",
            },
            {
                key: 'r2-sw-tone-3',
                name: 'The neon spotlight ring',
                text: "The mark hollows into a lit ring and the title itself takes the same glow, so the tone reads twice over. Echoes the chart's neon rings and the graph's neon spotlight picking out what matters: ok rings and sets the title in mint, warning in amber, destructive in red — ring and title always the same one colour, never two.",
            },
        ]),
    },
    sepia: {
        tone: /** @type {Option[]} */ ([
            {
                key: 'r2-se-tone-1',
                name: 'The wax seal',
                text: "A pressed wax medallion sits by the mark, glossy and embossed as a letter's own seal, cast in the tone's own ink. Echoes the chart's wax-seal beads marking its events: ok presses a sage-green seal, warning an amber seal, destructive a red seal — the seal's wax always the tone's own colour, nothing left sepia-plain.",
            },
            {
                key: 'r2-se-tone-2',
                name: 'Circled in ink',
                text: "A hand-drawn ring, tilted a few degrees as a pen would draw it, circles the title in the tone's own ink. Echoes the graph picking out its node circled in red: ok circles in sage ink, warning in amber ink, destructive in red ink — the ring's ink always the tone's own colour.",
            },
            {
                key: 'r2-se-tone-3',
                name: 'The tipped-in plate',
                text: "A small plate, tipped in at an angle over the corner as a photograph once was pasted into an album, washed in the tone's own colour. Echoes the calendar's own tipped-in plate: ok a sage plate, warning an amber plate, destructive a red plate — the plate's wash always the tone's own colour.",
            },
        ]),
    },
};
