// Page descriptor for the "timeline" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const timelineDescriptor = {
        id: 'timeline',
        title: 'Timeline',
        group: 'Data',
        classes: ['kp-timeline'],
        exports: ['Timeline'],
        intro: 'An ordered list of things that happened, each with its moment and a marker down the left. The rule between markers is drawn on the marker itself, so a one-item timeline has no line hanging under it.',
        whenToUse:
            'For a history in order — releases, an audit trail, the states an application passed through. Not for a schedule of what is still to come, where a list with dates reads better than a line. Not as a chart: this is prose in order, not a measurement of time.',
        examples: [
            {
                title: 'Two events',
                why: 'The moment is a time element and the marker is decorative, so the entry reads as “2026-09-04 14:07, version 1.1.0 released” rather than as a bullet with a date attached.',
                markup: `
<ol class="kp-timeline">
<li class="kp-timeline__item"><span class="kp-timeline__marker" aria-hidden="true"></span>
<span><time class="kp-timeline__when" datetime="2026-09-04T14:07">2026-09-04 14:07</time>Version 1.1.0 released</span></li>
<li class="kp-timeline__item"><span class="kp-timeline__marker" aria-hidden="true"></span>
<span><time class="kp-timeline__when" datetime="2026-09-04T12:27">2026-09-04 12:27</time>Version 1.0.0 released</span></li>
</ol>
`,
            },
        ],
        variants: [
            { name: '.kp-timeline__item', what: 'One entry: a marker column and the text beside it.' },
            { name: '.kp-timeline__marker', what: 'The dot, and the rule to the next entry — except on the last, which draws no line.' },
            { name: '.kp-timeline__when', what: 'The moment, quiet, above the text, in same-width digits so a column of times lines up.' },
        ],
        accessibility: [
            'Built in — the markers are decorative and the list is an ordered list, so the order is announced rather than drawn only.',
            'Yours — use a time element with a machine-readable moment; the printed text is for the reader.',
            'Yours — put the newest entry where your readers expect it, and say which end that is if the order could be either.',
        ],
    };
