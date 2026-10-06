/* research/character-graph, round 4 (Kenny, 2026-10-06 12:31): the new
   options of group a — high-contrast and deco, loading only ("Don't like
   the loading, it should be something based on the shape of the graph
   (nodes and lines), now it's too detached from the end result. Be
   creative." And: "I like loading animations that take advantage of all
   the space that the element takes."). Round 3's loading ideas for both
   themes (round2-c.js's r3-hc-load-*, round2-d.js's r3-d-dec-load-*) were
   all rejected ("don't like any of these"); every idea below is a
   different mechanic from those six and from the original pre-ghost 1/2/3
   ideas (demo.js's own IDEAS.high-contrast.loading / IDEAS.deco.loading).

   Every option moves the ghost network demo.js lays into the picture
   (`.kp-graph__ghost`, the package's own edge and node classes, each
   carrying `--i`, its order from the hub round the ring, and the ghost
   `--n`, how many), never a spinner or a bar standing apart from it.

   High-contrast draws from the signage board / departure board / hazard
   world ("unmistakable at a glance, heavy ink, signal yellow and strong
   blue, pattern not colour, big confident motion"): a split-flap tile
   turning, hazard tape marching, an odometer wheel dropping into place, a
   dial filling round, a torque wrench snapping a site home, the whole
   board racking into focus.

   Deco draws from the Art Deco world Kenny named ("gold rules, sunbursts,
   stepped geometry, jewelled lamps, Chrysler-building grandeur, the
   network lit like a marquee or engraved in gilt"): a ziggurat rising
   tier by tier, a gem catching its facets, a line being engraved finer and
   finer, the whole tower setting back storey by storey, lamps flaring
   along a colonnade, a gold rule plucked taut. Every key is namespaced
   `r4-hc-load-<n>` / `r4-dec-load-<n>` so it can never collide with round
   2's plain `1`/`2`/`3`, round 3's `r3-hc-…`/`r3-d-dec-…`, or another
   group's keys. round3-a.css moves these; its own file comment says how. */
export default {
    'high-contrast': {
        loading: [
            [
                'The flap board turns',
                'Each site turns over like a tile on a split-flap departure board — a hard, mechanical flip, one after another round the ring — and the instant a tile lands, its link opens from a solid rule into a dashed one, as if a new line had just been posted.',
                'r4-hc-load-1',
            ],
            [
                'The hazard tape marches',
                'Every link all round the ring is ruled in heavy black-and-blank hazard tape, and the stripes march steadily along every link and every site’s ring at once, the way tape is pulled taut round a site still under inspection.',
                'r4-hc-load-2',
            ],
            [
                'The odometer rolls in',
                'Each site drops in hard from above and settles with a short, confident bounce, one after another round the ring, and the link behind it snaps to double weight the instant the site lands, like a wheel on a mechanical counter clicking into its slot.',
                'r4-hc-load-3',
            ],
            [
                'The dial fills round',
                'Each site grows and flares bright like a gauge needle swinging hard round to its top reading, and its link draws itself taut end to end in the same beat, before both drop back and sweep again — the ring is read one dial at a time.',
                'r4-hc-load-4',
            ],
            [
                'The torque wrench snaps round',
                'Each site is given one hard, confident turn and springs back half a beat later, one after another round the whole ring, while its link ratchets forward a single notch at the same instant, the way a wrench clicks tight on a bolt.',
                'r4-hc-load-5',
            ],
            [
                'The whole board racks into focus',
                'The entire network pulls sharply out of a soft blur and locks hard into focus, over and over, while every site’s ring tightens from a loose dotted line to a solid one a beat behind the last, as a wide board being focused and read all at once.',
                'r4-hc-load-6',
            ],
        ],
    },
    deco: {
        loading: [
            [
                'The ziggurat steps up',
                'Each site rises in three hard, stepped jumps rather than a single climb, one after another round the ring, its link lengthening a tier at a time to match — a stepped Art Deco silhouette setting itself up storey by storey.',
                'r4-dec-load-1',
            ],
            [
                'The jewel catches its facets',
                'Each site turns smartly through a sharp angle and flares gold as it catches the light, one after another round the ring, like a cut gem being turned in the fingers to find its brightest facet — nothing travels along the wires at all.',
                'r4-dec-load-2',
            ],
            [
                'The engraving is cut',
                'Each link is cut from a few sparse strokes into a fine, close-set line, as if a burin were engraving it deeper one site at a time, and the medallion at its far end catches a hard bevelled glint the moment its line is finished.',
                'r4-dec-load-3',
            ],
            [
                'The tower sets back, tier by tier',
                'The whole network rises in three unhurried stages rather than one motion, settling a little taller and a little brighter each time, as the stepped crown of a skyscraper locking into place tier by tier, while every medallion catches a touch more gold on each settle.',
                'r4-dec-load-4',
            ],
            [
                'Lamps are lit along the colonnade',
                'Each medallion swells and tilts in a short double flare — on, then brighter still — one after another all round the ring, as a row of lamps being switched up through two settings along a lit colonnade.',
                'r4-dec-load-5',
            ],
            [
                'The gold rule is plucked taut',
                'Each link is plucked like a taut gold wire, thickening and thinning in a short, decaying shiver, and the medallion at its end gives one hard, confident pulse of its own the instant the pluck reaches it, going round the ring string by string.',
                'r4-dec-load-6',
            ],
        ],
    },
};
