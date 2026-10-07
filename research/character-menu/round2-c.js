/* research/character-menu, round 2 (Kenny, 2026-10-06 12:59): cyberpunk,
   every aspect reopened ("if you make suggestions, they should be in line
   with what we already have for other elements of a certain theme").
   Round 1's cyberpunk options (the neon trace / glitch HUD / holo card
   shapes, the packet runs / glitch bar / packet rain loading, jacked in /
   neon strikes / booted open, the hazard frame / cut-corner chip / warning
   scanline tone, the RGB split / cyan edge / data flicker interact) were
   rejected and are not repeated here. These five sets instead draw on the
   theme's already-picked profile (research/THEME_PROFILES.md): the HUD
   segment gauge (meter), the black ice (chart), the data shard(s)
   (calendar, columns), the hazard roster and packet race (calendar, graph),
   lock-on markers and target lock (chart, graph), and the neon
   strikes/surge/burns family (trend, graph) — hard, stepped motion
   throughout, never a soft ease. */
export default {
    cyberpunk: {
        shape: [
            {
                key: 'r2-cp-shape-1',
                name: 'The HUD segment plate',
                text: 'Faint segment-gap lines run down the plate like the meter’s HUD segment gauge (its shape pick), the heading set off by a lit tick bar in the info colour, mono headings.',
            },
            {
                key: 'r2-cp-shape-2',
                name: 'The black ice slab',
                text: 'A glossy dark slab with a diagonal specular sheen and a hairline glow rim, echoing the chart’s black ice shape pick; headings in the display face, lit in the info colour.',
            },
            {
                key: 'r2-cp-shape-3',
                name: 'The data shard',
                text: 'The plate’s corners are cut to angular shard facets, as the calendar’s and the columns’ data shard(s) shape picks; the heading sits on its own cut-corner tab in the primary colour.',
            },
        ],
        loading: [
            {
                key: 'r2-cp-load-1',
                name: 'The scanline sweep',
                text: 'A thin bright band sweeps left to right across the whole loading row, oscilloscope-style, echoing the meter’s scanline loading pick.',
            },
            {
                key: 'r2-cp-load-2',
                name: 'The hazard roster glitch',
                text: 'A hazard-stripe diagonal fills the row and jitters sideways in hard, glitchy jolts, as the calendar’s hazard roster loading pick.',
            },
            {
                key: 'r2-cp-load-3',
                name: 'The packet race',
                text: 'Two lanes of light packets run the row’s full width at different speeds in opposite directions, echoing the graph’s packet race loading pick.',
            },
            {
                key: 'r2-cp-load-4',
                name: 'The glitch decode',
                text: 'A glyph-dash pattern fills the row and jolts sideways in short, irregular glitch jumps before settling, as the columns’ Decoded pick, then glitches again.',
            },
            {
                key: 'r2-cp-load-5',
                name: 'The chrome wipe',
                text: 'A bright diagonal specular band wipes once across the row’s full width on loop, echoing the chart’s chrome wipe pick.',
            },
            {
                key: 'r2-cp-load-6',
                name: 'The neon tube flicker',
                text: 'The row’s base rule flickers on and off like a neon tube filament across its full span, as the trend’s neon trace and the graph’s neon surge picks.',
            },
        ],
        open: [
            {
                key: 'r2-cp-open-1',
                name: 'The shard snap-in',
                text: 'The menu snaps into shape through a few hard, angular skews, as if assembling from shard facets (echoing the data shard shape above), and snaps back the same way to close.',
            },
            {
                key: 'r2-cp-open-2',
                name: 'The HUD boot sweep',
                text: 'The menu fills in from its left edge in six hard segment steps, as the meter’s HUD segment gauge lighting up, and empties back the same way to close.',
            },
            {
                key: 'r2-cp-open-3',
                name: 'The black ice crack',
                text: 'The menu snaps to full height with one bright overshoot flash, as ice cracking open (echoing the black ice shape above), and dims back the same way to close.',
            },
        ],
        tone: [
            {
                key: 'r2-cp-tone-1',
                name: 'The target-lock bracket',
                text: 'The destructive entry’s label is bracketed by thin corner reticle marks in the destructive colour, as the chart’s lock-on markers and the graph’s target lock picks; a disabled entry’s reason sits inside a dim, open bracket pair.',
            },
            {
                key: 'r2-cp-tone-2',
                name: 'The packet-sync chip',
                text: 'The destructive entry sits on a flat, square-cornered chip filled solid in its colour, as the meter’s Packet sync pick; the disabled reason carries a small dim square dot, an unsynced packet.',
            },
            {
                key: 'r2-cp-tone-3',
                name: 'The black-ice crack mark',
                text: 'A thin jagged crack line in the destructive colour cuts into the entry’s left edge, echoing the black ice shape above; the disabled reason sits under a faint frosted rule.',
            },
        ],
        interact: [
            {
                key: 'r2-cp-interact-1',
                name: 'The HUD segment ladder',
                text: 'A hovered or focused entry lights a ladder of three segment ticks down its left edge, as the meter’s HUD segment gauge; a press brightens the whole ladder.',
            },
            {
                key: 'r2-cp-interact-2',
                name: 'The decode flicker',
                text: 'A hovered or focused entry’s label briefly decodes from a wide, blurred letter-spacing into its clear mono reading, as the columns’ Decoded pick; a press holds it lit in the info colour.',
            },
            {
                key: 'r2-cp-interact-3',
                name: 'The split edge',
                text: 'Pointing at an entry doubles its edge: cyan along the head and the end, red along the foot, 5, 4, 3 px and then 2 px while the pointer rests; focus closes four target brackets on it, a press lights the circuit grid at 60 %; nothing moves and nothing glows.',
            },
        ],
    },
};
