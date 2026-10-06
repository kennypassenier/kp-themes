/* research/character-graph, round 4 (Kenny, 2026-10-06 12:31): the new
   "While loading" options of group b — grotesk, lapis. Kenny rejected every
   round-3 loading option for both themes outright ("don't like any of
   these"; see round2-e.js/.css for what they were — never repeated here):
   grotesk's transit-line run, interchange tick, grid-snap sweep, backward
   route check, hub signal pulse and split-flap flip; lapis's travelling
   gilt glint, slow ring burnish, hub-outward edge reveal, node bounce-
   settle, hub-glow radiation and whole-lattice rotation. Six genuinely new
   ideas per theme below, each moving `.kp-graph__ghost` (demo.js's
   `ghost()`: the package's own `.kp-graph__edge`/`.kp-graph__node` with
   `.kp-graph__ring`/`.kp-graph__core`, each carrying `--i` round the ring
   from the hub and the ghost `--n` how many) — never a spinner, a bar or
   an opacity fade. Every key is namespaced `r4-<tag>-load-<n>` so it can
   never collide with round 2's plain `1`/`2`/`3`, round 3's `r3-*` keys or
   another group's keys. */
export default {
    grotesk: {
        loading: [
            [
                'The ruling pen scores every line',
                'Every link is ruled in from the hub outward in hard, even steps, one route after another round the ring, the way a ruling pen scores a straight guide line across the grid before the ink follows.',
                'r4-gk-load-1',
            ],
            [
                'The proof is stamped, mark by mark',
                'Each site punches down to a flat disc and springs back, one after another round the ring, square and sudden, the way a proof mark is stamped onto a specimen sheet before it is checked off.',
                'r4-gk-load-2',
            ],
            [
                'The register bar sweeps the sheet',
                'A hard red bar steps once across the whole box, left to right, the way a printer’s register bar is drawn across a sheet to check that every plate still lines up.',
                'r4-gk-load-3',
            ],
            [
                'The whole sheet ticks to the grid',
                'The entire network snaps to a slightly larger size and back in one hard beat, over and over, every node and link moving together on the same count, like a whole plate being registered to the grid at once.',
                'r4-gk-load-4',
            ],
            [
                'The ring is hatched for proofing',
                'Each node’s ring fills with short, hard hatching strokes that ratchet forward a notch at a time, one ring after another round the whole circle, the way a proofreader hatches a mark to flag a stop.',
                'r4-gk-load-5',
            ],
            [
                'The specification reads out, cell by cell',
                'Each site and the line feeding it blink once, hard, in strict order round the ring, square and definite, the way a typesetter reads a specification cell by cell before it is set.',
                'r4-gk-load-6',
            ],
        ],
    },
    lapis: {
        loading: [
            [
                'The rubricator marks each site',
                'Each site swells once in a brief vermilion flare and settles, one after another round the ring, the way a rubricator strikes a small red mark beside a line before the gold is laid.',
                'r4-lp-load-1',
            ],
            [
                'Gold ground is burnished across the page',
                'A soft gold sheen travels once in a steady diagonal across the whole box, over the hub and every site alike, the way a burnisher’s stroke is drawn clean across a leaf of gold ground.',
                'r4-lp-load-2',
            ],
            [
                'Each girih facet turns under the glass',
                'Every site tilts gently back and forth in its place, one after another round the ring, unhurried, the way a girih star tile is turned slightly under glass to catch each facet in turn.',
                'r4-lp-load-3',
            ],
            [
                'The illuminator’s lamp sweeps the folio',
                'A warm gold wedge of light turns steadily about the hub, round and round without hurry, the way a scribe’s lamp is swept slowly across an open folio while the page is read.',
                'r4-lp-load-4',
            ],
            [
                'Every link catches the light in turn',
                'Each link catches a brief gold glow and lets it go, one after another round the ring, the glow caught rather than travelling, the way gold leaf answers the light as a hand passes near it.',
                'r4-lp-load-5',
            ],
            [
                'The rosary of nodes glows round the ring',
                'Each site breathes into a soft gold glow and back, one after another round the ring, while the hub holds its own glow steady beneath them, like a rosary of gilded beads catching candlelight in turn.',
                'r4-lp-load-6',
            ],
        ],
    },
};
