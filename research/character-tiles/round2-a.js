/* research/character-tiles, round 2 (Kenny, 2026-10-06 18:04): the new options of group a.
   Cyberpunk only: Kenny sent back loading (six options), arrival, tone and
   live ("While loading: redo these · How the tiles arrive: redo · The tone
   of a tile: don't like it, make it glitchy or something, i told you to
   make suggestions based on already existing elements · Live update: again,
   redo these"). Shape (3, the holo card) and hover (1, the circuit lights)
   stayed as Kenny picked them in round 1 and are not touched here.

   Every option below follows research/THEME_PROFILES.md's cyberpunk row
   and names the settled pick it echoes, so the new options speak the same
   language as the meter, chart, calendar, graph, trend tile, strip columns
   and menu already do. None of round 1's rejected cyberpunk ideas (the
   neon trace / glitch bar / packet rain loading, jacked in / the neon
   strikes arrival, the cut-corner chip / hazard frame / glitch mark tone,
   packet in / the trace burns live) are repeated. */

export default {
    cyberpunk: {
        loading: [
            {
                key: 'r2-cy-load-1',
                name: 'The lock-on reticle',
                text: 'A corner-bracket reticle sweeps across the body and dwells at each end, hunting for signal, as the graph’s own target lock and the meter’s scanline already do.',
            },
            {
                key: 'r2-cy-load-2',
                name: 'Data shard flicker',
                text: 'A cluster of small shards flickers and jumps across the body, assembling and breaking apart, as the data shard calendar and the data-shard strip columns already stand.',
            },
            {
                key: 'r2-cy-load-3',
                name: 'Hazard roster strobe',
                text: 'A diagonal hazard band along the footer strobes hard between bright and dim, as the hazard roster’s own loading already does.',
            },
            {
                key: 'r2-cy-load-4',
                name: 'Signal burst ping',
                text: 'A ring pings outward from the mark and dies away, again and again, as the meter’s own data burst arrives.',
            },
            {
                key: 'r2-cy-load-5',
                name: 'Black ice breach',
                text: 'A jagged crack of ice-blue light creeps across the body in hard steps, breaching the chart’s own black ice.',
            },
            {
                key: 'r2-cy-load-6',
                name: 'Signal loss',
                text: 'The word LOADING is deciphered from noise glyphs over the waiting tile, holds in neon with a cyan and a red copy, tears sideways and is sliced away: 1800 ms in hard ticks.',
            },
        ],
        arrival: [
            { key: 'r2-cy-arrive-1', name: 'At once', text: 'The title and the body are there the moment loading ends.' },
            {
                key: 'r2-cy-arrive-2',
                name: 'Glitch in',
                text: 'The tile tears through a few torn, over-bright frames before it locks still, as the calendar’s own month already glitches in.',
            },
            {
                key: 'r2-cy-arrive-3',
                name: 'The channel split',
                text: 'Each tile is a yellow copy and a cyan copy until they meet: four ticks of 120 ms, 6, 4, 2, 1 px, the notch cut at every tick, one tick of 60 ms later per tile.',
            },
        ],
        tone: [
            {
                key: 'r2-cy-tone-1',
                name: 'Packet sync tag',
                text: 'A warning or destructive tile gets a top band in its own colour and its mark becomes a cut-corner tag with a faint duplicate a hair off to the side, as if two packets had not yet synced — as the meter’s own packet sync already reads.',
            },
            {
                key: 'r2-cy-tone-2',
                name: 'The target lock',
                text: 'A warning or destructive tile is locked as a target: four corner brackets in its colour twitch twice as they lock and hold.',
            },
            {
                key: 'r2-cy-tone-3',
                name: 'Lock-on corners',
                text: 'A warning or destructive tile is outlined in its own colour with two opposite corners notched off, reticle-style, as the graph’s own target lock already marks a node.',
            },
        ],
        live: [
            { key: 'r2-cy-live-1', name: 'Redrawn', text: 'The body text changes in place at once.' },
            {
                key: 'r2-cy-live-2',
                name: 'Shaken loose',
                text: 'The tile jitters on the spot in hard steps, as the strip columns’ own shaken update already does.',
            },
            {
                key: 'r2-cy-live-3',
                name: 'The tile stutters home',
                text: 'The tile that changed comes home from a yellow copy and a cyan copy of its own shape, 6, 4, 2, 1 px, four ticks of 120 ms.',
            },
        ],
    },
};
