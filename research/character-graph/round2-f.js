/* research/character-graph, round 3 (Kenny, 2026-10-06 10:58): the new
   options of group f — brutalism, every aspect but the shape ("Only the
   shape is good, the rest needs to be redone") and the loading picture
   (owned by another helper, built on a new ghost-network base). Arrival,
   focus and live each get three new ideas, none repeating round 2's
   rejected ones. Every key is namespaced `r3-fo-<aspect>-<n>` so it can
   never collide with round 2's plain `1`/`2`/`3`. */
export default {
    brutalism: {
        arrival: [
            [
                'Bolted on',
                'The links snap in stepwise, full black at once; each site is punched up from nothing to full size in three hard jumps, bolt by bolt round the ring.',
                'r3-fo-arr-1',
            ],
            [
                'Girder swing',
                'Every link drops to full thickness in two blunt beats, taut like a cable yanked straight; each site swings in tilted and rights itself in three hard steps, as if a crane set it down.',
                'r3-fo-arr-2',
            ],
            [
                'Riveted in',
                'Every link stretches taut from nothing in three hard beats; each site spins down into place from a quarter turn in four blunt jumps, driven home like a rivet.',
                'r3-fo-arr-3',
            ],
        ],
        focus: [
            [
                'The target lock',
                'The pick gets a thick red target ring; everything else drops to near-black-and-white at a hard 15%; a hidden kind’s chip is struck through with a heavy 3px bar.',
                'r3-fo-focus-1',
            ],
            [
                'The hazard tag',
                'The pick is ringed in poster yellow with a hard glow; the rest fades to a flat 10% in grayscale; a hidden kind’s chip turns to hazard stripes (its border and off-background both flip to yellow-on-black).',
                'r3-fo-focus-2',
            ],
            [
                'Taped off',
                'The pick takes a thick violet ring; the rest is knocked back to 25% and flattened to grayscale; a hidden kind’s chip is crossed with a doubled dashed line, as if taped shut.',
                'r3-fo-focus-3',
            ],
        ],
        live: [
            [
                'The siren',
                'The changed site flashes red three times like a siren; its link fires a dashed packet racing along it in the same red.',
                'r3-fo-live-1',
            ],
            [
                'The dial clicks',
                'The changed site’s ring flashes thick in violet once, like a gauge jumping; its link snaps to full weight and back in two blunt beats, as if a counter just clicked over.',
                'r3-fo-live-2',
            ],
            [
                'The hazard strobe',
                'The changed site strobes in and out hard four times in poster yellow; its link flickers on the same hard beat, a hazard light catching the whole connection.',
                'r3-fo-live-3',
            ],
        ],
    },
};
