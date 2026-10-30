// Page descriptor for the "update" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const updateDescriptor = {
        // Kenny's picks on research/update-motion, 2026-10-05. The task named
        // a group 'Motion'; GROUPS has none, so it stands beside size-motion.
        id: 'update',
        title: 'Information that updates in place',
        group: 'Theming',
        classes: [],
        aliases: ['updating'],
        exports: [],
        intro: 'A value that changes on a live page (a key figure, a table cell, a state word, a chart’s last point) shows it changed, the theme’s way: formal lands a stamp’s frame round it, cyberpunk glitches it and lets it settle, titanium runs the anodised colours across it. The new value is there from the first frame; nothing beside it moves.',
        whenToUse:
            'When a page writes a new value into something already on the screen and the reader should notice: call `update(el, next)` from `js/update.js` instead of setting the text. Not on first paint and not on a value that ticks every second (a clock, a countdown): only a change is an update. Every other theme has no update motion yet, so there the value simply changes.',
        examples: [
            {
                title: 'A key figure that changes',
                why: 'update() writes the value, marks the element for as long as the theme’s update plays (once, in max(resize, close) × 1.25 of the theme’s motion) and takes the mark off. With reduced motion asked for, the value changes and nothing moves (cyberpunk shows its two copies still for a moment). Every update called in the same task is marked in one batch: one style pass for a whole dashboard.',
                markup: `
<span class="kp-kpi__value"><span id="pressure">3.26</span><small>bar</small></span>
`,
            },
        ],
        variants: [
            { name: 'data-kp-updating', what: 'Written on the element while its update plays, with the register’s idea (`stamp`, `stutter`, `anodise`, `wobble`); on a spark it is the svg’s parent. Read it, do not set it.' },
            { name: '--kp-update', what: 'In a register: the idea it plays on an update. Formal `stamp`, cyberpunk `stutter`, titanium `anodise`, pastel `wobble` (the value rocks on its pin and settles, 800 ms); most registers declare an idea of their own. Read on the element itself, so `none` on a spark’s svg lets the chart take its new point at once (cyberpunk). A register that declares it outside `prefers-reduced-motion: no-preference` plays a still version under reduced motion (cyberpunk).' },
        ],
        accessibility: [
            'Built in — the new value is in the page at the first frame and readable throughout; no idea hides, scrambles or resizes it.',
            'Built in — a reader who asked for reduced motion gets the value without the motion (cyberpunk: its copies stand still beside the value for 1.2 s).',
            'Yours — a change a screen reader must hear goes in a live region; the motion is for the eye only.',
        ],
    };
