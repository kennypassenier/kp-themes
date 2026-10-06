/* research/character-graph, round 3 (Kenny, 2026-10-06 10:58): the new
   options of group d — solstice, deco, phantom and shade-light, loading
   only ("Don't like the loading, it should be something based on the shape
   of the graph (nodes and lines), now it's too detached from the end
   result. Be creative." And: "I like loading animations that take
   advantage of all the space that the element takes."). Every option moves
   the ghost network demo.js lays into the picture (`.kp-graph__ghost`, the
   package's own edge and node classes, each part carrying --i, its order
   from the hub round the ring, and the ghost --n, how many), in that
   theme's own world. Every key is namespaced `r3-d-<theme>-load-<n>` so it
   can never collide with round 2's plain `1`/`2`/`3` or another group's
   keys. Brutalism's loading (and its other open aspects) is group f's,
   untouched here. */
export default {
    brutalism: {
        loading: [
            [
                'The girder is bolted',
                'Each link is drawn outward from the hub in three hard square steps, no glide, and the slab at its far end punches up to full size the instant its girder lands, going round the ring one hard beat at a time.',
                'r3-d-bru-load-1',
            ],
            [
                'The rivets hammer round',
                'Every slab on the ring is hammered down in a hard beat, swelling then slamming flat, one after another all the way round, while the links underneath stay put, solid and unmoving.',
                'r3-d-bru-load-2',
            ],
            [
                'The slab drops',
                'Each slab drops in from above and stops dead with no bounce, one after another round the ring, and the instant it lands its link is slammed down flat behind it.',
                'r3-d-bru-load-3',
            ],
            [
                'The jackhammer shakes the frame',
                'The whole network shakes hard side to side without ever settling, as a jackhammer at work, while the slabs on the ring flash yellow one after another underneath the shaking.',
                'r3-d-bru-load-4',
            ],
            [
                'Poster ink stamped on',
                'A flat block of poster yellow slams on and off behind the whole network in hard steps, no fade, while every link is drawn in the same hard steps underneath it.',
                'r3-d-bru-load-5',
            ],
            [
                'The crane swings it into place',
                'The whole network swings hard one way then the other before snapping dead still, over and over, as a crane lowering the frame and losing its slack with a jolt.',
                'r3-d-bru-load-6',
            ],
        ],
    },
    solstice: {
        loading: [
            [
                'Sunrise sweep',
                'A warm band of sunlight turns slowly behind the whole network, and as it reaches each node round the ring in turn, that node’s ring flares bright and settles, as if the sun is finding one site after another.',
                'r3-d-sol-load-1',
            ],
            [
                'Embers catching',
                'A small bright coal races outward along every link from the hub at once, and each node it reaches glows hot amber for a moment before cooling back, as if the fire is reaching every pump house down its own line.',
                'r3-d-sol-load-2',
            ],
            [
                'The shadow turns',
                'A thin bronze gnomon-shadow sweeps steadily round the hub like a sundial’s hand, and the node it currently points to brightens, so the whole ring is read one site at a time as the shadow goes round.',
                'r3-d-sol-load-3',
            ],
            [
                'Kindled one by one',
                'Starting at the hub, each link lights up in turn and the node at its far end catches alight with a small warm flare and a little catch of breath, lighting the whole ring like a row of candles.',
                'r3-d-sol-load-4',
            ],
            [
                'The low sun rises',
                'The whole network rises gently as if climbing over the horizon, while a warm glow brightens beneath it in the same slow breath, the links glowing a little brighter as the network comes up into the light.',
                'r3-d-sol-load-5',
            ],
            [
                'Sparks leap the gaps',
                'A bright ember leaps outward along every link in hard little jumps rather than a smooth glide, hopping from the hub to each site in turn, as sparks jumping off a fire catch the whole network one jump at a time.',
                'r3-d-sol-load-6',
            ],
        ],
    },
    deco: {
        loading: [
            [
                'A gold wire rolls round',
                'Every link is traced in gold from the hub outward, one after another round the whole ring, and the medallion at its far end catches a glint of gold the moment its wire is finished.',
                'r3-d-dec-load-1',
            ],
            [
                'The marquee chases',
                'A bright bulb races outward along every link at once, as a marquee’s chase of bulbs, and each medallion blooms gold for a moment as the bulb reaches it before the chase runs again.',
                'r3-d-dec-load-2',
            ],
            [
                'The spotlight sweeps the stage',
                'A gold spotlight beam turns slowly round the whole picture, and the medallion it crosses blooms brighter for a moment, reading the ring like a stage being lit one performer at a time.',
                'r3-d-dec-load-3',
            ],
            [
                'The rays fan out',
                'The gold rays are drawn from the hub to the rim in quick succession, fanning out one after another faster than a sunrise, like a gilt sunburst opening across the whole box.',
                'r3-d-dec-load-4',
            ],
            [
                'The curtain rises on the gold',
                'The whole network rises slightly as a gold stage-light brightens beneath it in the same motion, every ray catching a touch more glint as it comes up, as a curtain lifting on the set.',
                'r3-d-dec-load-5',
            ],
            [
                'The bulbs count the ring',
                'Each medallion flashes on in turn all the way round the ring, a quick bright pop at a time with no travelling light along the wires, exactly as a marquee counts off its bulbs one by one.',
                'r3-d-dec-load-6',
            ],
        ],
    },
    phantom: {
        loading: [
            [
                'The string is pulled taut',
                'Every red string is drawn out from the hub and then snaps taut with a small overshoot, one after another round the board, each tag landing with a little jolt the instant its string is pulled tight.',
                'r3-d-pha-load-1',
            ],
            [
                'The stamp beats the ring',
                'Each tag is stamped down hard onto the ring in turn, swelling then slamming to size with a beat of red ink, going round the whole board one stamp at a time.',
                'r3-d-pha-load-2',
            ],
            [
                'Tags pinned one by one',
                'Each tag is pinned up with a jolt, popping in askew before righting itself, one after another all round the board, its string staying slack until the tag above it has landed.',
                'r3-d-pha-load-3',
            ],
            [
                'The red string races out',
                'A red mark races outward along every string at once in hard little jumps rather than a glide, as if someone is yanking each string taut in turn, reaching every tag in its own time.',
                'r3-d-pha-load-4',
            ],
            [
                'The halftone flickers',
                'A halftone of dots flickers and shifts slowly behind the whole board while every tag and string pulses a faint red in step, as a wanted board caught under a bad light.',
                'r3-d-pha-load-5',
            ],
            [
                'The calling card spins in',
                'The whole board rocks slowly side to side as if being turned over in someone’s hand, while the tags flash red one after another round the ring, a calling card held up and read.',
                'r3-d-pha-load-6',
            ],
        ],
    },
    'shade-light': {
        loading: [
            [
                'The pencil sketches the lines',
                'Each link is sketched in slowly, one after another, as a hand drawing with a soft pencil, and the disc at its far end settles gently into place the moment its line is drawn.',
                'r3-d-shl-load-1',
            ],
            [
                'A cloud’s shadow drifts',
                'A soft shadow drifts slowly across the whole picture as a cloud passing overhead, and every disc it crosses lifts a little brighter for a moment as the light finds it again.',
                'r3-d-shl-load-2',
            ],
            [
                'Leaves sway over the network',
                'The whole network sways gently from side to side, as light coming through moving leaves, a slow and soft motion that never settles while the network is still being read.',
                'r3-d-shl-load-3',
            ],
            [
                'The lantern glow breathes',
                'Every paper disc breathes a soft warm glow in and out together, brightening and settling in a slow rhythm, as a row of paper lanterns stirring in the evening air.',
                'r3-d-shl-load-4',
            ],
            [
                'Hatched in, stroke by stroke',
                'Each link is laid in with short, stepped pencil strokes rather than one smooth line, going round the ring one hatch mark at a time, as a hand cross-hatching a sketch.',
                'r3-d-shl-load-5',
            ],
            [
                'Dappled light crosses the ring',
                'A small warm pool of light visits each disc in turn, all the way round the ring, brightening it softly before moving on to the next, as sunlight dappling through a moving canopy.',
                'r3-d-shl-load-6',
            ],
        ],
    },
};
