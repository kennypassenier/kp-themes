// research/character-drawer, round 2, group b: high-contrast and
// brutalism. Round 1 (Kenny, 2026-10-06 20:45): high-contrast's shape,
// open/close and highlight ("none of these are readable? it's just grey!",
// "same here", "not good") and brutalism's shape, open/close and highlight
// ("again, not readable", "same here", "none are good") are reopened; both
// themes' card (1) and their own next (high-contrast 2, brutalism 3) stay
// settled and are not touched here.
//
// The measured cause of "just grey": `.kp-drawer__desc` (css/components.css)
// is hard-coded to `color: var(--muted-foreground)`, which only reads on a
// light head; round 1's shape options that darkened or inverted the head
// left the description in that same fixed grey, unreadable on a dark or
// inverted head. The tour's dimming wash had the same class of bug: round 1
// forced the scrim to `hsl(from var(--foreground) h s 50%)`, a fixed
// mid-grey regardless of either theme's actual pure black/white foreground.
// Every option below sets `.kp-drawer__desc` explicitly for its own head
// background, and every highlight option dims with the real foreground (or
// background) colour at an alpha fraction, never a forced 50% lightness.

/** @typedef {{ key: string, name: string, text: string }} Option */
/** @typedef {'shape' | 'openclose' | 'highlight'} OpenAspect */

export default {
    'high-contrast': {
        shape: [
            {
                key: 'r2-hc-shape-1',
                name: 'The ink frame',
                text: 'A pure white panel inside a 4px black border; the head is a solid black bar with white title and white description (no grey anywhere), divided from the body by a 4px black rule; the foot sits behind a 4px black rule. Echoes the meter’s and the trend’s own shape pick, “the ink frame”.',
            },
            {
                key: 'r2-hc-shape-2',
                name: 'The signal board',
                text: 'A white panel in a 4px black border with one accent-yellow bar across the very top edge, like a signage board’s warning strip; the head and foot stay black-on-white (ink, not grey), the body plain. Echoes the chart’s shape pick, “the signal board”.',
            },
            {
                key: 'r2-hc-shape-3',
                name: 'The inverse plate',
                text: 'The whole panel inverts: black fill, white 4px border, white head and foot text set directly (not the muted token), the body also inverted so nothing mid-grey ever appears. Echoes the columns’ shape pick, “the inverse heads”, and the calendar’s picked day, “the inverse plate”.',
            },
        ],
        openclose: [
            {
                key: 'r2-hc-openclose-1',
                name: 'It is switched',
                text: 'The panel is off-stage, then on, in one hard binary cut with no travel in between (a two-frame step, not a slide); closing is the same cut played backwards. Echoes the menu’s own open/close pick, “Switched”.',
            },
            {
                key: 'r2-hc-openclose-2',
                name: 'It marches in',
                text: 'The panel advances from the end edge in four equal hard-edged steps, no easing between them, like a marching display board; closing retraces the same four steps in reverse. Echoes the chart’s while-loading pick, “the marching frame”.',
            },
            {
                key: 'r2-hc-openclose-3',
                name: 'It is racked into place',
                text: 'The panel rises in from below in three discrete stepped jumps, each landing hard with no settle, like a mechanical display rack loading a plate; closing drops back through the same three steps, reversed. Echoes the meter’s while-loading pick, “the stepping block”.',
            },
        ],
        highlight: [
            {
                key: 'r2-hc-highlight-1',
                name: 'The inverse frame',
                text: 'A heavy 6px black ring squares off the target; the rest of the stage goes genuinely dark (the real foreground colour at high alpha, not a locked 50% grey) — pure black-on-white logic, nothing in between. Echoes the inverse plate’s own black/white reversal.',
            },
            {
                key: 'r2-hc-highlight-2',
                name: 'The hazard ring',
                text: 'A dashed, solid accent-yellow ring (the closest CSS-only reading of hazard tape) sits outside the target, never over its own content; the stage behind drops to true near-black (foreground at high alpha). Echoes the graph’s picked node, “the yellow ring, heavier”.',
            },
            {
                key: 'r2-hc-highlight-3',
                name: 'The signal ring',
                text: 'A thick solid accent-yellow ring surrounds the target; the stage behind goes true near-black. Echoes the chart’s shape, “the signal board”, and the trend’s live update, “the bar flips”.',
            },
        ],
    },
    brutalism: {
        shape: [
            {
                key: 'r2-br-shape-1',
                name: 'The stacked blocks',
                text: 'An off-white panel in a 3px black border with a hard offset shadow (no blur); the head is a solid black bar, its title and description set in the background colour directly (not the muted token, so nothing greys out); the foot sits behind a thick black rule. Echoes the meter’s and the chart’s own shape pick, “the stacked blocks” / “the poster”.',
            },
            {
                key: 'r2-br-shape-2',
                name: 'The poster plate',
                text: 'A panel in a 3px black border, the head carrying a bold accent-coloured strip (not a pale tint) with black text, a hard offset shadow trailing the whole plate; the body plain, the foot a thick black rule. Echoes the trend’s shape pick, “the hazard band”, and the columns’ shape pick, “the poster grid”.',
            },
            {
                key: 'r2-br-shape-3',
                name: 'The slab',
                text: 'A squared-off panel, no radius, in a thick black border on every edge, the head and foot both solid black bars with background-coloured text set directly, the body carrying faint visible “form-tie” dots. Echoes the calendar’s shape pick, “the slab”.',
            },
        ],
        openclose: [
            {
                key: 'r2-br-openclose-1',
                name: 'It is slammed down',
                text: 'The panel drops from above in one hard linear fall with no easing and no bounce, landing with its offset shadow snapping to full size on impact; closing lifts it straight back up the same way, reversed. Echoes the calendar’s how-the-month-arrives pick, “slammed down”, and the columns’ own pick, “Slammed down”.',
            },
            {
                key: 'r2-br-openclose-2',
                name: 'It is cast in one pour',
                text: 'The panel appears at the end edge already at a short distance out, then advances the rest of the way in a single hard, fast, linear push with no overshoot, as if poured and set in one go; closing pulls it back out the same way, reversed. Echoes the graph’s pick, “cast in one pour”, and the trend’s pick, “Cast”.',
            },
            {
                key: 'r2-br-openclose-3',
                name: 'It is thrown on',
                text: 'The panel’s offset shadow appears first, oversized, then snaps down to its resting size the instant the panel itself lands from the end edge in one hard step; closing reverses both parts at once. Echoes the meter’s pick, “Thrown on”.',
            },
        ],
        highlight: [
            {
                key: 'r2-br-highlight-1',
                name: 'The rivet ring',
                text: 'A thick black ring with small square tick marks at each corner (rivet heads) surrounds the target, its own small hard offset shadow; the stage behind flattens to a true dark overlay (the real foreground at high alpha, not a locked mid-grey). Echoes the graph’s picked node, “Boxed in black ink”, and the chart’s event dots, “Bolts”.',
            },
            {
                key: 'r2-br-highlight-2',
                name: 'The warning frame',
                text: 'A black ring then an accent-coloured ring outside it (the closest CSS-only reading of hazard tape, both bands outside the border box so the target’s own content stays clear); the stage behind goes true dark. Echoes the trend’s tone pick, “the warning poster”, and the columns’ tone pick, “the hard shadow”.',
            },
            {
                key: 'r2-br-highlight-3',
                name: 'The struck plate',
                text: 'A heavy black ring with its own hard offset shadow (no blur) sits on the target, as if a plate were struck down on it; the stage behind goes true dark. Echoes the graph’s while-loading pick, “the plot line is struck”.',
            },
        ],
    },
};
