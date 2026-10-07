/* research/character-kpi, round 2 (Kenny, 2026-10-06 19:24): the new
   options of group a (phantom, nostromo), filled by its helper.

   phantom: SHAPE only — three new shapes; tone and interactive are left
   out, so demo.js keeps round 1's three options for them (IDEAS.phantom),
   now drawn against whichever of these shapes is picked.

   nostromo: SHAPE only — three new shapes, read against
   research/THEME_PROFILES.md and the approved character demos (the
   meter's "The backlit vents", the columns' "The readout bank", the
   trend tile's "The vent grille") so the key figures reach the same
   cassette-futurism level; interactive is left out for the same reason
   as phantom's. */
export default {
    phantom: {
        shape: [
            {
                key: 'r2-ph-shape-1',
                name: 'The dossier folder',
                text: 'A manila case-file folder with a cut tab at the top left, a steep kraft hatch, the label in italic capitals, the number stamped with a hairline red offset — echoes the columns’ "The redacted dossier" and the trend tile’s "The ransom note."',
            },
            {
                key: 'r2-ph-shape-2',
                name: 'The target file',
                text: 'A faint bullseye of concentric rings sits behind the number, a primary-coloured ring frame all round like a target’s rim, the number in bold mono as if circled for the file — echoes the network graph’s "The target."',
            },
            {
                key: 'r2-ph-shape-3',
                name: 'The string-tied card',
                text: 'A corner is cut away as a tag, a red grommet hole sits in it with a taut red thread running down into the card, the label in display capitals — echoes the network graph’s "Stamped tags and string" and the calendar’s "The staple tag."',
            },
        ],
    },
    nostromo: {
        shape: [
            {
                key: 'r2-ns-shape-1',
                name: 'The backlit vents',
                text: 'Vertical vent slats run the full tile, lit from behind with a faint primary glow, the label on a riveted tape block in wide-tracked capitals, the number in instrument mono — echoes the meter’s own "The backlit vents."',
            },
            {
                key: 'r2-ns-shape-2',
                name: 'The readout bank',
                text: 'Two heavy panel rules run the full width top and foot like a bank of stacked readouts, a faint horizontal band pattern between them on raised moulding, the number in Michroma, the case’s printed type, with no glow — echoes the action columns’ "The readout bank."',
            },
            {
                key: 'r2-ns-shape-3',
                name: 'The vent grille',
                text: 'A punched grille of small square holes covers the whole tile at low contrast, a heavy primary-coloured ring frames the card like a sealed housing, the number in mono — echoes the trend tile’s "The vent grille."',
            },
        ],
    },
};
