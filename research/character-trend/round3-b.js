/* research/character-trend, round 3 (Kenny, 2026-10-06 11:21): the new
   shapes of group b — retro and nostromo, both sent back whole
   ("shapes need to be redone" / "redo the shapes"). Everything else in
   both themes is settled (loading, arrival, tone, live) and is not
   touched here; only `shape` carries new options, keyed so they never
   collide with round 2's `1`/`2`/`3`. */
export default {
    retro: {
        shape: [
            {
                key: 'r3-br-shape-1',
                name: 'The title bar',
                text: 'A 1995 window: the navy title-bar ramp across the very top, the tile raised in the grey three-dimensional bevel, the plot a sunken well, the label, the number and the axis in the DOS pixel face.',
            },
            {
                key: 'r3-br-shape-2',
                name: 'The dither wash',
                text: 'A sunken square frame holds a raised well dithered in the 16-colour checkerboard instead of a soft wash, a one-pixel line with square joins over it, the number in the pixel headline face.',
            },
            {
                key: 'r3-br-shape-3',
                name: 'The default button',
                text: 'The whole tile raised in the navy bevel of a dialog’s default button, a plain sunken plot inside a hairline frame, the line a flat navy rule with square ends.',
            },
        ],
    },
    nostromo: {
        shape: [
            {
                key: 'r3-br-shape-1',
                name: 'The vent grille',
                text: 'The plot a moulded dark vent set into the case behind rounded glass, horizontal ribs embossed across it, the amber phosphor trace lit with its own glow, the label in the ship’s mono and the number in Michroma.',
            },
            {
                key: 'r3-br-shape-2',
                name: 'The spec plate',
                text: 'A cream spec plate with a thin ruled frame and a sunken aperture: a fine mono trace with square corners, no wash, the label tracked wide as a part number.',
            },
            {
                key: 'r3-br-shape-3',
                name: 'The indicator cluster',
                text: 'A row of ticks like indicator lamps along the top edge, the plot a dark recessed aperture, the amber trace thick and round-capped like a lit gauge, the number heavy in the ship’s mono.',
            },
        ],
    },
};
