// Page descriptor for the "health" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const healthDescriptor = {
        id: 'health',
        title: 'Health',
        group: 'Feedback',
        classes: ['kp-health'],
        exports: ['Health'],
        intro: 'A dot and a word for the state of something being watched — a service, a job, a connection. The word is what carries it; the dot is the second channel.',
        whenToUse:
            'In a list of things whose state a reader scans down — a status page, a fleet, a set of integrations. Not for the outcome of a single action, which is an alert or a toast. Not for a numeric measurement, where the number itself says more than three colours can.',
        examples: [
            {
                title: 'Three states',
                why: 'The dot is marked decorative and the word beside it is the label, so the row reads as “Database, healthy” rather than as a coloured circle nobody can name.',
                markup: `
<span class="kp-health" data-state="ok"><span class="kp-health__dot" aria-hidden="true"></span> Healthy</span>
<span class="kp-health" data-state="warn"><span class="kp-health__dot" aria-hidden="true"></span> Degraded</span>
<span class="kp-health" data-state="down"><span class="kp-health__dot" aria-hidden="true"></span> Unreachable</span>
`,
            },
        ],
        variants: [
            { name: 'ok', what: 'The success colour in the dot, with the word beside it.' },
            { name: 'warn', what: 'The warning colour: something is wrong but the thing still works.' },
            { name: 'down', what: 'The destructive colour: it does not work.' },
            { name: 'no state', what: 'Without a state the dot takes the quiet ground — unknown, which is a fourth thing and not a fourth colour.' },
        ],
        accessibility: [
            'Built in — the dot is decorative and carries a boundary, so it is visible on a pale card and never the only carrier.',
            'Yours — write the state as a word. Three coloured dots in a column are one dot to somebody who cannot tell them apart.',
            'Yours — say what the state belongs to, and when it was last measured.',
        ],
    };
