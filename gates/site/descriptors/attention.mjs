// Page descriptor for the "attention" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const attentionDescriptor = {
        id: 'attention',
        title: 'Attention band',
        group: 'Feedback',
        classes: ['kp-attention'],
        exports: [],
        // The band ranks its items by `data-kp-severity`, the word the log
        // reads too.
        aliases: ['severity'],
        intro: 'One alert per problem, worst first, each with the action that fixes it. Each is a soft tint of its severity with a coloured edge, the page’s own text colour and a solid round icon: calm, still unmistakable. With nothing wrong the band takes no room at all. `attachAttention()` in js/attention.js keeps the order in the page itself, so a screen reader meets the problems in the order the eye does.',
        whenToUse:
            'At the top of a dashboard, for what needs a person now. Not for a message about the action just taken, which is a toast, and never for an “all is well” line: an empty band is the all-clear.',
        examples: [
            {
                title: 'Three problems, written in any order',
                why: 'Written info, critical, warning; shown critical, warning, info.',
                markup: `
<div class="kp-attention" role="region" aria-label="Needs attention">
<div class="kp-alert kp-alert--info kp-attention__item" role="status" data-kp-severity="info">
<span class="kp-attention__icon" aria-hidden="true">i</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Information: </span>Firmware 4.2 is out for six field units</strong><span>It fixes the flow meter’s drift after a power cut.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Plan the update</button></div>
</div>
<div class="kp-alert kp-alert--destructive kp-attention__item" role="alert" data-kp-severity="critical">
<span class="kp-attention__icon" aria-hidden="true">!</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Critical: </span>Pump house 3 is below 2.1 bar</strong><span>For forty minutes.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Open the incident</button></div>
</div>
<div class="kp-alert kp-alert--warning kp-attention__item" role="status" data-kp-severity="warning">
<span class="kp-attention__icon" aria-hidden="true">!</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Warning: </span>Pump house 7 has sent no reading since 06:00</strong><span>Its modem may need a restart.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Restart the modem</button></div>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-attention', what: 'The band: a region of items one under the other; with no item it is not drawn.' },
            { name: '.kp-attention__item', what: 'One problem, on a `.kp-alert` of its tone: a soft tint of the severity, a thick edge of it, the page’s own text colour.' },
            { name: 'data-kp-severity', what: '`critical`, `warning` or `info`: the order and the tint.' },
            { name: '.kp-attention__icon, __text, __actions', what: 'A solid round icon, the problem in a strong line and a sentence, and the action that fixes it. In a band under 34rem the actions go under the words.' },
        ],
        accessibility: [
            'Built in — the DOM order is the severity order, so reading order and visual order agree.',
            'Built in — the severity is a word for a screen reader (the hidden prefix) and an icon, not only a colour.',
            'Yours — `role="alert"` for a critical problem that arrives while the reader is on the page, `role="status"` for the rest; and the hidden prefix in your words.',
        ],
    };
