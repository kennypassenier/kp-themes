// Page descriptor for the "kpi" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const kpiDescriptor = {
        id: 'kpi',
        title: 'Key figures',
        group: 'Data',
        classes: ['kp-kpis', 'kp-kpi'],
        exports: [],
        // The tile's sparkline is `data-kp-spark`; its tone and its hint's
        // two states (`data-kp-when`) are read by the stylesheet, and the
        // time chart reads the same two words.
        aliases: ['spark', 'tone', 'when'],
        intro: 'A strip of key figures: each `.kp-kpi` tile a label, the number (with its unit and a note such as “avg 15 min” beside it), a trend line, and at the bottom a 24-hour sparkline or a meter. Every tile is as tall as the tallest on every row the strip wraps to, so labels, numbers and trend lines line up across it. js/kpi.js draws the sparklines and turns a tile into a filter toggle.',
        whenToUse:
            'At the top of a dashboard, for the handful of numbers a reader checks first. Not for a table of figures, and not for more than a row or two of tiles: a key figure that is one of thirty is not key.',
        examples: [
            {
                title: 'A strip: a meter, a sparkline, a link and a filter',
                why: 'The tile is a `div`, an `a` that leads to its detail, or a `button.kp-kpi--toggle` that turns a filter on this page on and off. Pressed, a filter tile takes a primary border over a faint primary background, and its corner word changes; the words are yours.',
                markup: `
<div class="kp-kpis" role="group" aria-label="Network at a glance">
<div class="kp-kpi">
<span class="kp-kpi__label">Pump houses online</span>
<span class="kp-kpi__value">14<small>of 15</small></span>
<span class="kp-kpi__trend">Pump house 7 offline</span>
<span class="kp-kpi__meter" role="meter" aria-label="Pump houses online: 93 %" aria-valuenow="93" aria-valuemin="0" aria-valuemax="100" style="--kp-value: 0.93"></span>
</div>
<a class="kp-kpi" href="#">
<span class="kp-kpi__label">Flow now</span>
<span class="kp-kpi__value">412<small>m³/h</small><span class="kp-kpi__note">avg 15 min</span></span>
<span class="kp-kpi__trend"><span class="kp-kpi__delta" data-kp-direction="up" data-kp-tone="good">6 %</span> on yesterday</span>
<svg class="kp-kpi__spark" data-kp-spark="380 371 352 340 335 338 360 395 430 451 448 440 436 429 431 440 452 470 480 466 441 420 409 412"></svg>
</a>
<button type="button" class="kp-kpi kp-kpi--toggle" aria-pressed="true" data-kp-tone="warning">
<span class="kp-kpi__label">Open incidents</span>
<span class="kp-kpi__hint" aria-hidden="true"><span data-kp-when="off">Filter</span><span data-kp-when="on">Filtering ×</span></span>
<span class="kp-kpi__value">3</span>
<span class="kp-kpi__trend">2 new today</span>
</button>
</div>
`,
            },
            {
                title: 'A key figure that waits, one that acts, and the tones',
                why: 'A key figure still waiting for its number carries `aria-busy="true"`; a warning or a failed figure carries its tone; a figure that leads somewhere is an `a`. In pastel every key figure has a thumbtack pushed in at its top centre; the waiting one becomes caterpillar (a head on its top-end corner, stepping legs along its foot); a warning or failed figure’s label sits on its tone’s plate; and the one that acts peels its top-end corner into a fold under the pointer.',
                markup: `
<div class="kp-kpis" role="group" aria-label="Pump houses">
<div class="kp-kpi" aria-busy="true">
<span class="kp-kpi__label">Flow now</span>
<span class="kp-kpi__value">…</span>
<span class="kp-kpi__trend">Reading the meters</span>
</div>
<div class="kp-kpi" data-kp-tone="warning">
<span class="kp-kpi__label">Reservoir North</span>
<span class="kp-kpi__value">78<small>%</small></span>
<span class="kp-kpi__trend"><span class="kp-kpi__delta" data-kp-direction="up" data-kp-tone="bad">4 %</span> in the last hour</span>
</div>
<div class="kp-kpi" data-kp-tone="destructive">
<span class="kp-kpi__label">Pump house 7</span>
<span class="kp-kpi__value">0<small>bar</small></span>
<span class="kp-kpi__trend">Offline since 04:12</span>
</div>
<a class="kp-kpi" href="#">
<span class="kp-kpi__label">Alarms today</span>
<span class="kp-kpi__value">3</span>
<span class="kp-kpi__trend">See every alarm</span>
</a>
</div>
`,
            },
            {
                title: 'A long label wraps between words and is never cut',
                why: 'Added 2026-10-14 (`kpi-label-cut-M1`). A plain tile\u2019s label takes as many lines as it needs, breaking between words (a single word longer than the tile breaks inside it); it never ends in an ellipsis. The tiles of a row stretch to the tallest, so the row stays one height, and the figures sit directly under their labels. Here the window is 17rem wide and the tiles stack, each as wide as the window.',
                frame: { height: '15rem', width: '17rem' },
                markup: `
<div class="kp-kpis" role="group" aria-label="Pump house 3">
<div class="kp-kpi"><span class="kp-kpi__label">Discharge pressure at the reservoir inlet</span><span class="kp-kpi__value">3.1<small>bar</small></span><span class="kp-kpi__trend">two pumps running</span></div>
<div class="kp-kpi"><span class="kp-kpi__label">Flow</span><span class="kp-kpi__value">412<small>m\u00b3/h</small></span><span class="kp-kpi__trend">into the ring main</span></div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-kpis', what: 'The strip: as many tiles a row as fit, every tile one height on every row.' },
            { name: '.kp-kpi', what: 'One tile: a `div`, an `a` (its border answers hover), or a `button.kp-kpi--toggle`.' },
            { name: '.kp-kpi__label, __value, __note, __trend', what: 'The label (small capitals; it wraps between words as often as the tile is narrow and is never cut, a word longer than the tile breaks; in a strip with `data-kp-kpis-columns` it keeps one line and the strip takes fewer columns instead), the number with a `<small>` unit, a note beside it, and the trend line.' },
            { name: '.kp-kpi__delta', what: 'A change in the trend line: `data-kp-direction="up|down"` puts ▲ or ▼ before it, `data-kp-tone="good|bad"` colours it.' },
            { name: '.kp-kpi__spark', what: 'An inline SVG with `data-kp-spark="12 14 13 …"`: the script draws a line over a soft area from the numbers, and again when they change.' },
    { name: '.kp-kpi__meter', what: 'The meter at the bottom of a tile: the same rules as `.kp-meter` (its own page), with a mark, past the end and loading; the tile’s tone colours its fill.' },
            { name: 'data-kp-tone', what: 'On the tile, `warning` or `destructive`: a coloured edge and a coloured number (and the meter’s fill).' },
            { name: '.kp-kpi--toggle', what: 'A filter tile: a click flips `aria-pressed` and fires `kp-kpi-toggle` with `detail.pressed`; the page filters. Pressed, a primary border over a faint primary background.' },
            { name: '.kp-kpi__hint', what: 'What a click does, beside the label, in the page’s words: one child `data-kp-when="off"`, one `data-kp-when="on"`.' },
            { name: 'data-kp-kpi-owned', what: 'Leaves a toggle to the page, for a framework that keeps the pressed state itself.' },
            { name: 'pastel: the thumbtack', what: 'In pastel every key figure is fixed to the page with a thumbtack at its top centre, the ones that act too. When a figure leaves, the tack comes out first, then it lifts off as its landing backwards and its space folds after the tack is out; one put back arrives as that backwards, the tack pushed in last.' },
            { name: 'pastel: tones and changes', what: 'A warning or failed figure’s label sits on its tone’s plate, and a change shows as a sticker on the figure; a value written with update() wobbles (the update page). A figure that acts (a link, a toggle) lifts and peels its top-end corner under the pointer and sticks down flat when pressed; its focus is the dashed line alone.' },
            { name: 'pastel: waiting', what: 'A key figure with `aria-busy="true"` becomes caterpillar while it waits: a head on its top-end corner and legs along its foot that step in turn (js/loading-pieces.js).' },
            { name: 'a pressable tile', what: 'A pressable tile’s name and hint never break inside a word (the hint wraps in its own track); a trend tile’s `.kp-kpi__label-note` shows its dot only beside the name.' },
            { name: 'meter tones', what: '`setMeter` and `.kp-meter[data-kp-tone]` take the tones `success` and `neutral` as well as the others.' },
        ],
        accessibility: [
            'Built in — a filter tile is a real button with `aria-pressed`, so a screen reader says whether the filter is on.',
            'Built in — the sparkline is hidden from a screen reader unless it has a role of its own; the number and the trend line carry the meaning.',
            'Built in — a delta’s direction is a ▲ or ▼ as well as a colour.',
            'Yours — give the meter its `aria-label` and values, and say in the trend line what a sparkline would otherwise only show.',
            'Yours — keep the hint `aria-hidden`; the pressed state already says what it says.',
        ],
    };
