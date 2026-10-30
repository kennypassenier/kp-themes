// Page descriptor for the "meter" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const meterDescriptor = {
        id: 'meter',
        title: 'Meter with a mark',
        group: 'Data',
        classes: ['kp-meter'],
        exports: [],
        // What setMeter() writes for the stylesheet: a share past the end
        // (on the meter and on its mark) and the loading pulse.
        aliases: ['over', 'loading'],
        intro: 'A used-of-total bar that works anywhere: in a table cell, at the bottom of a key figure (`.kp-kpi__meter`), at the start of a line of words (`.kp-meter--inline`). the share property is the share, the mark property an optional tick across the bar (a target, a limit, what is booked) that sticks out above and below without making the meter taller. A share or a mark past the end shows a small ▸ at the end, and a screen reader hears the real numbers, past 100 % too. js/kpi.js writes it all in one call: `setMeter(el, { value, mark, tone, label, markLabel, loading })`.',
        whenToUse:
            'For one share of a whole that the reader compares with a line: a reservoir against its target, capacity against what is booked tonight, a plan against what was done. Not for progress that moves on its own (that is a progress bar), and not for many values side by side (that is a chart).',
        examples: [
            {
                title: 'A share against its mark, past the end, and in a line of words',
                why: 'Written the way `setMeter()` writes it, so it reads right before any script runs: `role="meter"`, `aria-valuenow` from 0 to 100, and an `aria-valuetext` that names the real share. The tick is a `.kp-meter__mark` child; past the end it carries `data-kp-over`.',
                markup: `
<div class="kp-stack">
<span class="kp-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="62" aria-valuetext="62% full; 80% the target level" style="--kp-value: 0.62; --kp-mark: 0.8"><span class="kp-meter__mark" aria-hidden="true"></span></span>
<span class="kp-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="58" aria-valuetext="58% running now; 130% booked for tonight" style="--kp-value: 0.58; --kp-mark: 1.3"><span class="kp-meter__mark" aria-hidden="true" data-kp-over></span></span>
<span class="kp-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" aria-valuetext="112% of the plan used" data-kp-over style="--kp-value: 1.12"></span>
<span class="kp-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="78" aria-valuetext="78% full; 80% the overflow alarm" data-kp-tone="warning" style="--kp-value: 0.78; --kp-mark: 0.8"><span class="kp-meter__mark" aria-hidden="true"></span></span>
<span class="kp-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuetext="being measured" aria-busy="true" data-kp-loading style="--kp-value: 0"></span>
<p><span class="kp-meter kp-meter--inline" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="41" aria-valuetext="41% of today's plan; 55% planned by now" style="--kp-value: 0.41; --kp-mark: 0.55"><span class="kp-meter__mark" aria-hidden="true"></span></span>41 % of today’s plan, plan to 55 % by now</p>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-meter', what: 'The bar: the share property from 0 up (above 1 the fill is full), on the muted track, the primary colour by default.' },
            { name: '.kp-kpi__meter', what: 'The same meter at the bottom of a key figure; a `data-kp-tone` on the tile colours its fill.' },
            { name: '.kp-meter__mark', what: 'The tick at the mark property, across the bar and a little above and below it, with a halo of the card colour so it reads on the fill and on the track. The meter is as tall with it as without.' },
            { name: 'data-kp-over', what: 'Past the end: on the meter, the share is above 1 and a ▸ sits at the bar’s end; on the mark, the tick stops just short of the end with the ▸ after it.' },
            { name: 'data-kp-tone', what: '`warning` or `destructive` on the meter: an amber or red fill.' },
            { name: 'data-kp-loading', what: 'Loading: the track pulses at its height (still under reduced motion), with no fill and no mark; `aria-busy` with it.' },
            { name: '.kp-meter--inline', what: 'Three rem wide, at the start of a line of words, its middle on the line’s middle.' },
            { name: 'setMeter(el, meter)', what: 'Writes the share, the mark (made the first time), the tone and the ARIA in one call; `meterText(value, mark, words)` and `meterParts(value, mark)` are the words and the arithmetic on their own.' },
            { name: 'pastel: loading', what: 'In pastel a meter with `data-kp-loading` (the last one in the example above) becomes a row of pom-poms with a head, as a busy progress bar does; a share that arrives is stuck on from its start corner on the soft landing.' },
        ],
        accessibility: [
            'Built in — `setMeter()` writes `role="meter"`, `aria-valuenow` (0 to 100) and an `aria-valuetext` with the real share and the mark, past 100 % too (“58% running now; 130% booked for tonight”).',
            'Built in — past the end is a ▸ as well as a full bar, so it does not rest on colour; a tone is a colour and the words carry the same.',
            'Built in — the loading pulse stops under reduced motion; a loading meter says “being measured” (`meterMeasuring`).',
            'Yours — the words: `label` names the share (“full”) and `markLabel` the mark (“the target level”); without a `label` the dictionary’s `meterUsed` is used. In markup you write the same `aria-valuetext` yourself.',
        ],
    };
