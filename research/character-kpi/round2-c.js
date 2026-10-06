// research/character-kpi round 2, group c (Kenny, 2026-10-06 19:24): grotesk
// said "none of these" to the key figure's shape — kpi-d.css's three
// options (the transit board, the underlined figure, the index colour) are
// replaced here with three new ones. Every other aspect (loading, tone,
// interactive, live) stays open with round 1's three options
// ("need to see new shapes for this"): round2-c.css carries kpi-d.css's
// existing rules for those four aspects onto each new shape, it does not
// replace them, so this file holds only `shape`.
//
// Grotesk is the Swiss/International Typographic world (THEME_PROFILES.md):
// big grotesque type set tight, a strict grid, red and black on white,
// rules and blocks, nothing decorative. The other approved grotesk picks
// this round echoes: the chart's "Swiss grid" (a ruled grid behind the
// series), the meter's "rule and its cursor", the graph's "transit map"
// with its red pick, the columns' "big numerals", and the chart tooltip's
// "punch card".

export default {
    grotesk: {
        shape: [
            {
                key: 'r2-gr-shape-1',
                name: 'The ruled grid',
                text: 'A borderless plate crossed by five faint vertical rules, a bold red baseline rule along the foot, the number set heavy in the grotesque — the Swiss grid behind the chart, and the meter’s own rule, drawn into the tile.',
            },
            {
                key: 'r2-gr-shape-2',
                name: 'The index block',
                text: 'A heavy black frame with a flat red triangle cut into the top-right corner like a catalogue card’s tab, the number set large and heavy — the graph’s red pick and the columns’ big numerals, as a corner mark.',
            },
            {
                key: 'r2-gr-shape-3',
                name: 'The punch stub',
                text: 'A borderless plate with a column of small round punches down the left edge, a hairline rule under the label, the number set in the grotesque mono — the chart tooltip’s punch card, carried onto the tile itself.',
            },
        ],
    },
};
