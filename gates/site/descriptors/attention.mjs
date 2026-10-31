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
        aliases: ['severity', 'folded'],
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
            {
                title: 'Seven problems, the worst three shown',
                why: '`data-kp-attention-max="3"` keeps the band short on a phone: the three worst problems show, the others fold away (`data-kp-folded` on each) and one button, last on the band, unfolds them: “Show 4 more”, with `aria-expanded`, then “Show fewer”. The fold follows the band’s own order, so a problem that arrives or turns worse lands in its place. Each press fires `kp-attention-toggle` with { expanded, shown, total }. With no number, or 0, nothing is folded.',
                markup: `
<div class="kp-attention" id="doc-attention-max" role="region" aria-label="What needs you today" data-kp-attention-max="3">
<div class="kp-alert kp-alert--destructive kp-attention__item" role="alert" data-kp-severity="critical">
<span class="kp-attention__icon" aria-hidden="true">!</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Critical: </span>Amoxicillin 500 mg has expired</strong><span>It ran out on 09/2026. Do not take it; hand it in at the pharmacy.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Remove it</button></div>
</div>
<div class="kp-alert kp-alert--destructive kp-attention__item" role="alert" data-kp-severity="critical">
<span class="kp-attention__icon" aria-hidden="true">!</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Critical: </span>Ibuprofen 400 mg runs out in 2 days</strong><span>14 tablets, 6 a day at most.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Add stock</button></div>
</div>
<div class="kp-alert kp-alert--warning kp-attention__item" role="status" data-kp-severity="warning">
<span class="kp-attention__icon" aria-hidden="true">!</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Warning: </span>The 20:00 dose of Paracetamol 500 mg is not taken yet</strong><span>It was due 25 minutes ago.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Take it now</button></div>
</div>
<div class="kp-alert kp-alert--warning kp-attention__item" role="status" data-kp-severity="warning">
<span class="kp-attention__icon" aria-hidden="true">!</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Warning: </span>Cetirizine 10 mg is running low</strong><span>8 tablets left, about 8 days.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Add stock</button></div>
</div>
<div class="kp-alert kp-alert--warning kp-attention__item" role="status" data-kp-severity="warning">
<span class="kp-attention__icon" aria-hidden="true">!</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Warning: </span>Vitamin D3 25 µg expires in 12 days</strong><span>The box says 11/2026.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">See the box</button></div>
</div>
<div class="kp-alert kp-alert--info kp-attention__item" role="status" data-kp-severity="info">
<span class="kp-attention__icon" aria-hidden="true">i</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Information: </span>Saline nasal spray has been open for 30 days</strong><span>Sprays are best used within 28 days of opening.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Mark replaced</button></div>
</div>
<div class="kp-alert kp-alert--info kp-attention__item" role="status" data-kp-severity="info">
<span class="kp-attention__icon" aria-hidden="true">i</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Information: </span>A refill list of 3 medicines is ready</strong><span>Ibuprofen, Cetirizine and Vitamin D3.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Open the list</button></div>
</div>
</div>
<p class="kp-text-muted" id="doc-attention-said" role="status">3 of 7 problems shown.</p>
`,
                script: `
const band = document.getElementById('doc-attention-max');
const said = document.getElementById('doc-attention-said');
band.addEventListener('kp-attention-toggle', (event) => {
    const { shown, total } = event.detail;
    said.textContent = shown + ' of ' + total + ' problems shown.';
});
`,
            },
        ],
        variants: [
            { name: '.kp-attention', what: 'The band: a region of items one under the other; with no item it is not drawn.' },
            { name: '.kp-attention__item', what: 'One problem, on a `.kp-alert` of its tone: a soft tint of the severity, a thick edge of it, the page’s own text colour.' },
            { name: 'data-kp-severity', what: '`critical`, `warning` or `info`: the order and the tint.' },
            { name: 'data-kp-attention-max', what: 'A number of problems: the worst that many show, the rest fold behind one toggle. Read again when it changes; none or 0 folds nothing.' },
            { name: '.kp-attention__more', what: 'The toggle the cap writes, last on the band: “Show 4 more” with the exact number, then “Show fewer”; `aria-expanded` and `aria-controls` the band. Hidden while nothing is over the cap.' },
            { name: 'data-kp-folded / data-kp-attention-expanded', what: 'Written by the script, never by you: on a problem folded away, and on the band while the folded problems are shown.' },
            { name: 'kp-attention-toggle', what: 'Fired on the band at each press of the toggle: `{ expanded, shown, total }`.' },
            { name: '.kp-attention__icon, __text, __actions', what: 'A solid round icon, the problem in a strong line and a sentence, and the action that fixes it. In a band under 34rem the actions go under the words.' },
        ],
        accessibility: [
            'Built in — the DOM order is the severity order, so reading order and visual order agree.',
            'Built in — the severity is a word for a screen reader (the hidden prefix) and an icon, not only a colour.',
            'Built in — the folded problems stay in the band and in its order; the toggle says how many it holds back and whether they are shown, and keeps the focus when pressed.',
            'Yours — `role="alert"` for a critical problem that arrives while the reader is on the page, `role="status"` for the rest; and the hidden prefix in your words.',
        ],
    };
