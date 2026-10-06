/* research/character-state, round 2 (Kenny, 2026-10-06 19:38): phantom's
   new shapes, filled by its helper.

   phantom: "none, first one seems broken" — round 1's shape 1 ("The red
   dot") broke `.kp-state-word`'s own width-holding mechanism (it set
   `display: inline-block` on the word, which turns off the `::after`
   width-trick's `block-size: 0` collapse, so the hidden word list renders
   as real stacked lines and the dot and the Stop button wrap). All three
   shapes below leave `.kp-state-word`'s `display` alone and use no static
   `transform` on it or on the dot, so round 1's tone and change (which
   animate `transform` on exactly those two parts) keep composing freely.
   `tone` and `interactive`/`change` are left out, so demo.js keeps round
   1's three options for them (IDEAS.phantom), now drawn against whichever
   of these shapes is picked. */
export default {
    phantom: {
        shape: [
            {
                key: 'r2-ph-shape-1',
                name: 'The ransom note',
                text: 'The word sits in a slanted hand on a torn kraft scrap, its top-left corner cut away, a dashed cut edge and a faint paper-fibre hatch running across it — echoes the trend tile’s "The ransom note" and the calling-card world’s torn paper and ransom-note cut-outs.',
            },
            {
                key: 'r2-ph-shape-2',
                name: 'The dossier tab',
                text: 'A manila case-file tab is cut into the plate’s top-left corner, a steep kraft hatch fills it, the label set in tracked capitals as if typed on a folder spine — echoes the action columns’ "The redacted dossier" and the key figures’ "The dossier folder."',
            },
            {
                key: 'r2-ph-shape-3',
                name: 'The target mark',
                text: 'The dot sits inside a bullseye of concentric rings, a primary-coloured ring frames the whole word like a target’s rim, the word in bold mono as if circled for the file — echoes the network graph’s "The target" and the key figures’ "The target file."',
            },
        ],
    },
};
