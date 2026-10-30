// Page descriptor for the "freshness" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const freshnessDescriptor = {
        id: 'freshness',
        title: 'Freshness line',
        group: 'Data',
        classes: ['kp-ago'],
        exports: [],
        aliases: ['ago', 'updated', 'stale'],
        intro: 'A ticking “updated 42 s ago” (js/freshness.js): one timer per page, a width held at the widest text of its unit so nothing beside it moves, a stale plate once the moment is older than `data-kp-stale-after`, and the moment itself as dd/mm/yyyy HH:mm in Europe/Brussels in the title. It stays out of live regions: a line that ticks must not be read aloud every second.',
        whenToUse:
            'Where a page shows data that goes stale: a dashboard’s last reading, a list’s last refresh. Not for a fixed date: write that out.',
        examples: [
            {
                title: 'A reading’s freshness, stale after three minutes',
                why: 'The moment is the `datetime`; the verb is yours; past 180 s the line takes the stale plate and `data-kp-stale`.',
                markup: `
<time class="kp-ago" datetime="2026-10-04T12:00:00Z" data-kp-ago data-kp-ago-verb="updated" data-kp-stale-after="180">updated 42 s ago</time>
`,
            },
            {
                title: 'Calm when stale, counted in days',
                why: '`data-kp-stale-tone="calm"` keeps a stale line quiet; `data-kp-ago-units="days"` counts in days.',
                markup: `
<time class="kp-ago" datetime="2026-10-01T12:00:00Z" data-kp-ago data-kp-stale-tone="calm" data-kp-ago-units="days" data-kp-ago-verb="updated" data-kp-stale-after="180">updated 3 days ago</time>
`,
            },
        ],
        variants: [
            { name: 'data-kp-ago', what: 'The line itself; the moment is the `datetime`, or this attribute’s value (ISO or ms).' },
            { name: 'data-kp-ago-verb', what: 'The word before the age (“updated”, “read”); the dictionary’s `agoVerb` when absent.' },
            { name: 'data-kp-stale-after', what: 'Seconds after which the line is stale and carries `data-kp-stale`; the stale plate’s three knobs are listed below.' },
            { name: 'data-kp-stale', what: 'Written by the module while the moment is older than `data-kp-stale-after`. Read it, do not set it.' },
            { name: 'data-kp-ago-width', what: 'Written by the module: the held width, measured once per unit and cached by font.' },
            { name: 'data-kp-ago-announce', what: '`state` announces only the change to stale and back, through a polite region of its own; the ticking itself is never announced.' },
            { name: 'data-kp-ago-voice', what: 'Written by the module: the live region it announces through when `data-kp-ago-announce` is set.' },
            { name: 'data-kp-stale-tone="calm"', what: 'A stale reading is quiet, not alarming: the calm plate instead of the warning one (the colours are knobs).' },
            { name: 'data-kp-ago-units="days"', what: 'The line counts in days (“updated 3 days ago”) rather than seconds and minutes; `humanDuration` and `agoText` take `units`.' },
        ],
        accessibility: [
            'Built in — `aria-live="off"`, `aria-description` with the moment written out, a console warning when the line sits inside a live region.',
            'Yours — keep the line out of `role="status"`; announce staleness with `data-kp-ago-announce="state"` if it matters.',
        ],
    };
