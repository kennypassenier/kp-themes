// research/character-kpi round 2, group b: retro only (Kenny, round 1,
// 2026-10-06: "none of these" on all three shape options; every other
// aspect stays open too, "need to see new shapes for this" — nothing is
// settled for retro). Three new shapes, each pulling from a motif Kenny
// already approved elsewhere in retro (research/THEME_PROFILES.md):
// the title bar (character-trend, character-columns' menu), the status
// bar (character-columns, the chart's pinned tooltip), the floppy label
// (character-calendar). Loading, tone, interactive and live keep round
// 1's three options (IDEAS.retro.*, demo.js) — their CSS in kpi-d.css is
// written against `.kp-kpi` generally and the shared `[data-kf]` base,
// not against the old shape's structure, so all three carry over to
// every new shape unchanged; round2-b.css carries no extra rules for
// them beyond the shape itself.

export default {
    retro: {
        shape: [
            {
                key: 'r2-rt-shape-1',
                name: 'The title bar card',
                text: 'A raised 3D bevel round the whole card, a navy caption strip across the label in white system caps, the number in the pixel display face. Echoes trend’s pick (the title bar) and the menu’s (the 1995 dialog): the same navy caption, now on a key figure.',
            },
            {
                key: 'r2-rt-shape-2',
                name: 'The status bar segment',
                text: 'A sunken bevel (dark top-left, light bottom-right — the opposite reading of a raised button), a thin divider after the label, the number in the mono face. Echoes the columns strip’s pick (the status bar) and the chart’s pinned tooltip (the status bar readout): a figure read off the status bar, not a dialog.',
            },
            {
                key: 'r2-rt-shape-3',
                name: 'The floppy label',
                text: 'A paper sticker on the card: faint ruled lines behind the label and number as if lined for a marker pen, a flat 1px drop shadow (no bevel), a small rounded corner. Echoes the calendar’s pick (the floppy label): the same sticker, now carrying a key figure instead of a month.',
            },
        ],
    },
};
