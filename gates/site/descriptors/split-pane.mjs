// Page descriptor for the "split-pane" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const splitPaneDescriptor = {
        id: 'split-pane',
        title: 'Split pane',
        group: 'Structure',
        classes: ['kp-split'],
        exports: ['SplitPane'],
        aliases: ['orientation', 'collapse', 'large-step', 'step'],
        intro: 'Two panes with a separator between them that can be dragged, and moved with the arrow keys. One custom property drives the whole layout, so the pointer and the keyboard move the same thing.',
        whenToUse:
            'For a list beside a detail, or an editor beside its preview, where readers disagree about how much room each deserves. Not on a narrow screen, where two panes are two half-width columns; and not for a fixed proportion, which is a grid and needs no separator.',
        examples: [
            {
                title: 'A list beside a detail',
                why: 'The separator is a real separator with a value, minimum and maximum, so it is announced as a slider and moved with the arrows rather than only dragged.',
                markup: `
<div class="kp-split" data-kp-split>
<div class="kp-split__pane">
<p class="kp-fw-semibold">Applications</p>
<p>Example Inc</p>
<p>Second Ltd</p>
</div>
<div class="kp-split__separator" role="separator" tabindex="0" aria-orientation="vertical" aria-valuemin="10" aria-valuemax="90" aria-valuenow="50" aria-label="Resize the panes"></div>
<div class="kp-split__pane">
<p class="kp-fw-semibold">Example Inc</p>
<p>Applied on 4 September; interview on the eleventh.</p>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: 'vertical separator', what: 'The default: two panes side by side, the separator moving left and right.' },
            { name: 'horizontal', what: 'The same control stacked, for an editor above its output.' },
            { name: 'collapsing', what: 'A double click on the separator can put a pane away and bring it back.' },
            { name: 'step / large step', what: 'How far one arrow press moves the divider, and how far a Page key does.' },
            { name: 'focused separator', what: 'It takes the focus ring inside its own edge, because a two-pixel bar has no room for a ring outside it.' },
        ],
        accessibility: [
            'Built in — the separator is in the tab order and the arrows move it, which is the half a drag-only splitter leaves out.',
            'Built in — each move is an event carrying the new percentage, so a consumer can store the arrangement.',
            'Yours — write the separator role with its value, minimum and maximum, and name it.',
            'Yours — decide what happens below a narrow width; two panes on a phone are two half-columns.',
            'Yours — keep both panes usable at their extremes, or set bounds that stop the reader from erasing one.',
        ],
    };
