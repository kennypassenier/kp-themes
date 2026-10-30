// Page descriptor for the "spinner" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const spinnerDescriptor = {
        id: 'spinner',
        title: 'Spinner',
        group: 'Feedback',
        classes: ['kp-spinner'],
        // `data-kp-pieces` marks a waiting part while a theme's loading pieces are in it (js/loading-pieces.js).
        aliases: ['pieces'],
        exports: ['Spinner'],
        intro: 'A small ring that turns while something is happening whose end is not known. It stops turning for a reader who asked for less motion, and it says what it is in words.',
        whenToUse:
            'For a wait you cannot measure, and only for the part of the page that is waiting. Not for a whole page that is loading, where a skeleton shows the shape of what is coming; and not for something that finishes in a blink, where a spinner is a flash of anxiety.',
        examples: [
            {
                title: 'A spinner with its name',
                why: 'The ring’s track is its own head at a quarter of its alpha rather than a grey boundary: in a theme where both were black, nothing visibly turned.',
                markup: `
<span class="kp-spinner" role="status" aria-label="Loading"></span>
`,
            },
            {
                title: 'Inside the button that started the wait',
                why: 'Beside the label rather than instead of it: a button whose text disappears has changed size and meaning at the moment the reader is looking away.',
                markup: `
<button type="button" class="kp-button kp-button--primary" aria-busy="true"><span class="kp-spinner" aria-hidden="true"></span> Saving…</button>
`,
            },
            {
                title: 'At every size',
                why: 'The spinner’s size is a measure (the knobs table below), so one spinner serves a button, a line and a panel. In pastel the spinner is the pom-pom caterpillar going round a small day sticker, the round trip, at every size: js/loading-pieces.js draws it from pieces and marks the spinner `data-kp-pieces` while they are there.',
                markup: `
<div class="kp-row kp-gap-md">
<span class="kp-spinner" role="status" aria-label="Loading, small" style="--kp-spinner-size: 1rem"></span>
<span class="kp-spinner" role="status" aria-label="Loading"></span>
<span class="kp-spinner" role="status" aria-label="Loading, medium" style="--kp-spinner-size: 2rem"></span>
<span class="kp-spinner" role="status" aria-label="Loading, large" style="--kp-spinner-size: 3rem"></span>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-spinner', what: 'The one size, set by a measure so a consumer can make it smaller inside a button.' },
            { name: 'reduced motion', what: 'The animation is inside the reduced-motion guard: for a reader who asked for stillness the ring is simply drawn, not turning.' },
            { name: 'decorative', what: 'Beside a label that already says what is happening, the ring is marked hidden so the wait is not announced twice.' },
            { name: 'pastel: the round trip', what: 'In pastel the spinner is the pom-pom caterpillar going round a small day sticker, at every size, on the theme’s loop; under reduced motion it rests curled round the sticker.' },
            { name: '--kp-loading-pieces', what: 'A register’s name for a loading picture made of pieces: js/loading-pieces.js (attachLoadingPieces(), wired in js/auto.js) adds the pieces to every waiting part of a theme that names one, and none to a theme that names nothing. Pastel names `caterpillar`; it is the only theme that names one.' },
        ],
        accessibility: [
            'Built in — the animation only runs where motion is welcome, which is DI7 and not a preference honoured where convenient.',
            'Built in — the turn does not change luminance in a way that approaches the flash threshold, and the motion gate measures that.',
            'Yours — give a standalone spinner a name, or nothing says what is being waited for.',
            'Yours — say when the wait ends. A spinner that disappears is silent.',
        ],
    };
