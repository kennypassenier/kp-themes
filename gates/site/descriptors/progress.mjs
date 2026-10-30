// Page descriptor for the "progress" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const progressDescriptor = {
        id: 'progress',
        title: 'Progress',
        group: 'Feedback',
        classes: ['kp-progressbar', 'kp-progress', 'kp-progress-group'],
        // The busy state is `data-kp-indeterminate`, a name no class slug derives.
        aliases: ['indeterminate'],
        exports: ['Progress'],
        intro: 'A bar for work whose end is known, drawn by each theme in its own hand — a track, a fill clipped to the value and a head on its leading edge — and one line high whatever the theme draws inside it.',
        whenToUse:
            'When you can say how far along something is: an upload, an import, a step count. Not for waiting on a server that will answer when it answers — that is the spinner, or the busy bar when the wait belongs to a task with a place on the page. Not as a rating or a gauge: a progress bar means work in flight.',
        examples: [
            {
                title: 'Three bars that begin in the same column',
                why: 'A set of bars is read against each other, so the tracks have to start and end together — a bar behind “Memory” may not begin later than the one behind “CPU” because the word is longer. The group gives the labels one column, as wide as the longest of them [fix-64].',
                markup: `
<div class="kp-progress-group">
<div class="kp-progress__wrap">
<span class="kp-progress__label">CPU</span>
<div class="kp-progressbar" role="progressbar" aria-label="CPU" aria-valuemin="0" aria-valuemax="100" aria-valuenow="22" style="--kp-value: 0.22">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">22%</span>
</div>
<div class="kp-progress__wrap">
<span class="kp-progress__label">Memory</span>
<div class="kp-progressbar" role="progressbar" aria-label="Memory" aria-valuemin="0" aria-valuemax="100" aria-valuenow="64" style="--kp-value: 0.64">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">64%</span>
</div>
</div>
`,
            },
            {
                title: 'A bar, and a bar with its number',
                why: 'The value is the share done on `--kp-value` (0 to 1) and the amount a screen reader reads on `aria-valuenow`. With js/progressbar.js loaded (js/auto.js loads it), setting `aria-valuenow` moves the paint too, and the outer element alone is enough: the track, the fill and the head are written in.',
                markup: `
<div class="kp-progressbar" role="progressbar" aria-label="Import" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40"></div>
<div class="kp-progress__wrap">
<div class="kp-progressbar" role="progressbar" aria-label="Import" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--kp-value: 0.4">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">40%</span>
</div>
`,
            },
            {
                title: 'Three sizes',
                why: 'The bar as it always was is the small one; `.kp-progressbar--md` and `.kp-progressbar--lg` make it one and a half and two times as tall. The theme draws the same bar larger — its marks, cells and patterns grow with the track — and the label and the number in the same row step up the type scale with it (13, 16 and 18px at a 16px root). Pick by how much the bar matters on the page: small beside a line of text or in a table, medium for the bar a panel is about, large for the one task a page is waiting on.',
                markup: `
<div class="kp-progress-group">
<div class="kp-progress__wrap">
<span class="kp-progress__label">Small</span>
<div class="kp-progressbar" role="progressbar" aria-label="Small" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--kp-value: 0.4">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">40%</span>
</div>
<div class="kp-progress__wrap">
<span class="kp-progress__label">Medium</span>
<div class="kp-progressbar kp-progressbar--md" role="progressbar" aria-label="Medium" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--kp-value: 0.4">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">40%</span>
</div>
<div class="kp-progress__wrap">
<span class="kp-progress__label">Large</span>
<div class="kp-progressbar kp-progressbar--lg" role="progressbar" aria-label="Large" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--kp-value: 0.4">
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<span class="kp-progress__value">40%</span>
</div>
</div>
`,
            },
            {
                title: 'Busy, with no idea how far',
                why: 'Without an amount the bar says so twice: `data-kp-indeterminate` for the eye and no `aria-valuenow` for a screen reader. It moves while it waits, and stands still, still reading as busy, for a reader who asked for less motion.',
                markup: `
<div class="kp-progressbar" role="progressbar" aria-label="Waiting for the export service" data-kp-indeterminate>
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
`,
            },
            {
                title: 'Busy, in three sizes',
                why: 'A busy bar is `data-kp-indeterminate` on the bar, with no value. Each theme draws its own wait in the track, at every size; pastel draws it from pieces: js/loading-pieces.js puts a row of pom-poms with a head in the track while it is busy (a still row of pom-poms without the script), and takes them away when the attribute goes.',
                markup: `
<div class="kp-stack">
<div class="kp-progressbar" role="progressbar" aria-label="Waiting for the export, small" data-kp-indeterminate>
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<div class="kp-progressbar kp-progressbar--md" role="progressbar" aria-label="Waiting for the export, medium" data-kp-indeterminate>
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
<div class="kp-progressbar kp-progressbar--lg" role="progressbar" aria-label="Waiting for the export, large" data-kp-indeterminate>
<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-progressbar', what: 'The bar: one line high, as wide as its place up to a maximum, painting the share done from 0 to 1.' },
            { name: '.kp-progressbar__track', what: 'The ground the value is measured against; the theme draws it.' },
            { name: '.kp-progressbar__fill', what: 'The share done, clipped to the value, so a pattern in it never stretches and only the clip moves.' },
            { name: '.kp-progressbar__head', what: 'The mark on the fill’s leading edge; a theme gives it a shape or leaves it empty.' },
            { name: '.kp-progressbar--md', what: 'The medium size: one and a half times the small bar, the theme’s drawing grown with it, and the label and number beside it at the body size.' },
            { name: '.kp-progressbar--lg', what: 'The large size: twice the small bar, for the one task a page waits on; the label and number one step above the body size.' },
            { name: '[data-kp-indeterminate]', what: 'Busy without an amount: a moving band, and diagonal stripes standing still under reduced motion.' },
            { name: '.kp-progress__wrap', what: 'The bar with something beside it, on one centre line.' },
            { name: '.kp-progress__value', what: 'The number, quiet and small, after the bar.' },
            { name: '.kp-progress-group', what: 'A set of bars in three columns — label, track, reading — so every track begins and ends in the same place [fix-64].' },
            { name: '.kp-progress__label', what: 'The word in front of a bar inside a group.' },
            { name: 'pastel: the caterpillar', what: 'In pastel a busy bar’s track becomes the pom-pom caterpillar: a row of pom-poms as round as the track is high, a head at its end, rising in turn on the theme’s loop (2.4 s). The pieces are js/loading-pieces.js’s, hidden from screen readers; without the script the track shows the same row standing still, and under reduced motion it stands still too.' },
            { name: 'setProgressFailed(bar, { title, text?, art? })', what: 'The failed plate stands in the bar’s place (root export `setProgressbarFailed`), with Retry as `kp-progressbar-retry`. A bar is one line high, so this state grows.' },
        ],
        accessibility: [
            'Built in — `role="progressbar"` with `aria-valuenow` against `aria-valuemin` and `aria-valuemax`; js/progressbar.js keeps the paint in step with them, so the number read and the bar drawn cannot drift apart.',
            'Built in — the busy bar carries no `aria-valuenow`, which is how a screen reader learns the amount is unknown.',
            'Built in — with reduced motion asked for nothing inside the bar moves, in any theme, and the busy bar still reads as busy.',
            'Yours — give it a name. A bar with no label is progress on something unspecified.',
            'Yours — add `aria-valuetext` where a percentage is not the useful number (“3 of 12 files”).',
            'Yours — say when it is finished; a full bar is silent.',
        ],
    };
