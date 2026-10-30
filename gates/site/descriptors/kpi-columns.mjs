// Page descriptor for the "kpi-columns" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const kpiColumnsDescriptor = {
        id: 'kpi-columns',
        title: 'Key figures on allowed column counts',
        group: 'Data',
        classes: [],
        exports: [],
        // The strip's list of allowed counts, and the flag the script writes
        // when no count avoids a lone tile.
        aliases: ['kpis-columns', 'kpis-span-last'],
        intro: 'A strip of key figures that never leaves one tile alone on a row. `.kp-kpis[data-kp-kpis-columns="all 3 2 1"]` takes the first count in the list at which every tile is at least its minimum width wide, measured by the strip’s own width (not the window’s); if that leaves one tile alone on the last row it steps down to a count that does not, and only when none exists does the last tile span the whole row. js/kpi.js keeps it so as the strip resizes and as tiles come and go: `attachKpiStrips(root)`.',
        whenToUse:
            'For a strip whose number of tiles changes with the data (hosts, pumps, queues), or that sits in a column of changing width, where the package’s plain auto-fit would leave a single tile on the last row. Not needed for a fixed set of tiles that always fits.',
        examples: [
            {
                title: 'Five tiles, three a row at most',
                why: 'At a desk width the five sit on one row (`all`); narrower, three would leave 3 + 2, so three it is; at a phone width two would leave 2 + 2 + 1, and with no count left that avoids it the fifth spans its row. Before the script runs the strip keeps the package’s auto-fit.',
                markup: `
<div class="kp-kpis" data-kp-kpis-columns="all 3 2 1" role="group" aria-label="The northern network right now">
<div class="kp-kpi"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">3.1<small>bar</small></span><span class="kp-kpi__trend">two pumps running</span></div>
<div class="kp-kpi"><span class="kp-kpi__label">Flow</span><span class="kp-kpi__value">412<small>m³/h</small></span><span class="kp-kpi__trend">into the ring main</span></div>
<div class="kp-kpi"><span class="kp-kpi__label">Reservoir North</span><span class="kp-kpi__value">71<small>%</small></span><span class="kp-kpi__trend">target 80 %</span></div>
<div class="kp-kpi"><span class="kp-kpi__label">Reservoir South</span><span class="kp-kpi__value">64<small>%</small></span><span class="kp-kpi__trend">target 80 %</span></div>
<div class="kp-kpi"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">2</span><span class="kp-kpi__trend">one needs a visit</span></div>
</div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-kpis-columns', what: 'The allowed counts, largest first: numbers and `all` (as many as there are tiles), for example `"all 3 2 1"` or `"4 2 1"`.' },
            { name: 'data-kp-kpis-span-last', what: 'Written by the script when no allowed count avoids a lone tile: the last tile spans its row.' },
            { name: 'kpiColumns(n, width, options)', what: 'The pure rule: `{ columns, spanLast }` for `n` tiles in `width` px, with `allowed`, `minTilePx` (144) and `gapPx` (16); `fitKpiStrip(strip)` applies it once.' },
        ],
        accessibility: [
            'Built in — only the layout changes; the tiles keep their order in the markup and in the tab order.',
            'Yours — name the strip (`role="group"` with an `aria-label`), as for any strip of key figures.',
        ],
    };
