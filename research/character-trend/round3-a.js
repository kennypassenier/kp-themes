/* research/character-trend, round 3 (Kenny, 2026-10-06 11:21): the new
   options of group a. brutalism: everything but tone and live redone
   (shape, loading, arrival); round 2's rejected options (the slab, the
   sticker sheet, the poster block / the stamp, the drop, the hammer / at
   once, slammed, shoved in) are not repeated. deco: only loading redone
   (round 2's gilt frame, marquee and sunburst-opens are not repeated). */
export default {
    brutalism: {
        shape: [
            {
                key: 'r3-br-shape-1',
                name: 'The hazard band',
                text: 'A thick black frame, its foot ruled off by the six-pixel ink bar (hazard tape only where the tile carries a tone); the number set huge and heavy, the line thick and square-cut, the plot a plain cast well.',
            },
            {
                key: 'r3-br-shape-2',
                name: 'The bolted plate',
                text: 'A steel plate riveted at all four corners, a hard red shadow kicked off to the side; the plot a shallow recess, the line square and miter-joined.',
            },
            {
                key: 'r3-br-shape-3',
                name: 'The stencil',
                text: 'A poster-yellow well stencilled with a rough hatch, boxed twice in black; the number stencilled in spaced capitals, the line a flat black mark with no wash.',
            },
        ],
        loading: [
            {
                key: 'r3-br-load-1',
                name: 'The hoisted lintel',
                text: 'A lintel hangs on two cables in the plot’s own well: four hard lifts, held, let go to fall free and left to rest, looping every 1.2 s; standing still the beam rests on the floor.',
            },
            {
                key: 'r3-br-load-2',
                name: 'The hazard fill',
                text: 'Black and yellow hazard stripes tile the whole plot and crawl across it, as warning tape laid over wet ground; standing still the stripes are already there.',
            },
            {
                key: 'r3-br-load-3',
                name: 'The fault line',
                text: 'A jagged crack streaks the full width of the plot and is dragged off again, as a slab curing; standing still the crack sits across the middle.',
            },
            {
                key: 'r3-br-load-4',
                name: 'The gate',
                text: 'A solid black bar the full height of the plot slides across it in three hard stops, as a barricade gate dragged into place; standing still the bar sits part-way across.',
            },
            {
                key: 'r3-br-load-5',
                name: 'The bolt ring',
                text: 'One of four corner rivets lights up at a time, round and round, as a plate is bolted down; standing still all four rivets show, one lit.',
            },
            {
                key: 'r3-br-load-6',
                name: 'The siren sweep',
                text: 'A wedge of light turns the full circle about the plot’s middle, as a site siren sweeping the yard; standing still the wedge sits at one bearing.',
            },
        ],
        arrival: [
            {
                key: 'r3-br-arr-1',
                name: 'Cast',
                text: 'The number and the line are there the instant the pour sets solid, as the slab is cast; nothing moves.',
            },
            {
                key: 'r3-br-arr-2',
                name: 'Jackhammered in',
                text: 'The line punches into place left to right in four hard chisel-strikes; the number drops and lands in three short jolts.',
            },
            {
                key: 'r3-br-arr-3',
                name: 'Torn open',
                text: 'The line rips into view on a skew that straightens as it lands, as hazard tape torn off in one pull; the number drops in crooked and settles square.',
            },
        ],
    },
    deco: {
        loading: [
            {
                key: 'r3-dc-load-1',
                name: 'The setback climbs',
                text: 'Fine gold setback lines climb up through the whole plot, rung by rung, as a tower rising storey by storey; standing still the rungs are already stacked.',
            },
            {
                key: 'r3-dc-load-2',
                name: 'The flutes turn',
                text: 'Vertical gold flutes sweep across the whole plot, left to right, as a fluted column catching the light; standing still the fluting already stands.',
            },
            {
                key: 'r3-dc-load-3',
                name: 'The rule is drawn',
                text: 'A slim gold rule the full height of the plot measures it out, sweeping from edge to edge and back; standing still the rule sits at one mark.',
            },
            {
                key: 'r3-dc-load-4',
                name: 'The corners step',
                text: 'A bright stepped-corner mark steps round the plot’s four corners in turn, as a beacon checking the setbacks; standing still all four corners show, one lit.',
            },
            {
                key: 'r3-dc-load-5',
                name: 'The lacquer breathes',
                text: 'A gold glow at the plot’s heart swells to fill it and settles back, as fresh lacquer catching the light; standing still the glow already fills the middle.',
            },
            {
                key: 'r3-dc-load-6',
                name: 'The crown turns',
                text: 'A slim gold wedge turns slowly about the plot’s centre, as a beacon atop a tower; standing still the wedge sits at one bearing.',
            },
        ],
    },
};
