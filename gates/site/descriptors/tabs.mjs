// Page descriptor for the "tabs" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const tabsDescriptor = {
        id: 'tabs',
        title: 'Tabs',
        group: 'Navigation',
        classes: ['kp-tabs', 'kp-tab'],
        exports: ['Tabs'],
        aliases: ['activation', 'loop'],
        intro: 'One panel at a time, with a row of tabs above it. The arrows move between tabs, one tab is in the tab order at a time, and by default moving the arrows also selects.',
        whenToUse:
            'For alternative views of the same subject, where the reader wants one of them at a time — a record’s details, its history, its files. Not to split a form into parts, where a reader has to fill in all of them and a wizard says so; and not for content anyone might want to search or print as a whole.',
        examples: [
            {
                title: 'Two tabs and their panels',
                why: 'The wiring is markup: each tab controls a panel and each panel names its tab. The module adds the roving tab order and the arrow keys, and nothing else.',
                markup: `
<div class="kp-tabs">
<div class="kp-tabs__list" role="tablist" aria-label="Application">
<button type="button" class="kp-tab" role="tab" id="doc-tab-0" aria-controls="doc-panel-0" aria-selected="true">Overview</button>
<button type="button" class="kp-tab" role="tab" id="doc-tab-1" aria-controls="doc-panel-1" aria-selected="false">History</button>
</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-0" aria-labelledby="doc-tab-0">Sent on 4 September, interview on the eleventh.</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-1" aria-labelledby="doc-tab-1" hidden>Three earlier applications to this company.</div>
</div>
`,
            },
            {
                title: 'Tabs that only select when you say so',
                why: 'With manual activation the arrows move focus and Enter or Space selects — the right choice when showing a panel is expensive, and the wrong one when it is free.',
                markup: `
<div class="kp-tabs">
<div class="kp-tabs__list" role="tablist" aria-label="Reports" data-kp-activation="manual" data-kp-loop="false">
<button type="button" class="kp-tab" role="tab" id="doc-tab-m0" aria-controls="doc-panel-m0" aria-selected="true">Summary</button>
<button type="button" class="kp-tab" role="tab" id="doc-tab-m1" aria-controls="doc-panel-m1" aria-selected="false">Full export</button>
</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-m0" aria-labelledby="doc-tab-m0">Twelve applications this quarter.</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-m1" aria-labelledby="doc-tab-m1" hidden>Everything, as a table.</div>
</div>
`,
            },
            {
                title: 'Counts on tabs',
                why: 'The count is the exact number, with the unit heard by a screen reader; `loading` is a skeleton, never a 0.',
                markup: `
<div class="kp-tabs">
<div class="kp-tabs__list" role="tablist" aria-label="Application">
<button type="button" class="kp-tab" role="tab" id="doc-b-tab-0" aria-controls="doc-b-panel-0" aria-selected="true" data-kp-tab-count="12" data-kp-tab-count-tone="error" data-kp-tab-count-unit="error,errors">Overview</button>
<button type="button" class="kp-tab" role="tab" id="doc-b-tab-1" aria-controls="doc-b-panel-1" aria-selected="false" data-kp-tab-count-state="loading">History</button>
</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-b-panel-0" aria-labelledby="doc-b-tab-0">Sent on 4 September, interview on the eleventh.</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-b-panel-1" aria-labelledby="doc-b-tab-1" hidden>Three earlier applications to this company.</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-tabs__list', what: 'The row, with a rule under it that the selected tab’s own rule sits on.' },
            { name: '.kp-tab', what: 'One tab: quiet ink until it is chosen.' },
            { name: 'selected', what: 'The page’s full ink, bold, and a coloured rule underneath — three carriers, and the selected state is what is announced.' },
            { name: 'automatic activation', what: 'The default: moving with the arrows selects as it goes.' },
            { name: 'manual activation', what: 'The arrows move focus only; Enter or Space selects.' },
            { name: 'looping', what: 'The arrows wrap from the last tab to the first, unless the list says not to.' },
            { name: '.kp-tabs__panel', what: 'The panel. Exactly one is visible; the others are hidden, which also takes them out of the search and the tab order.' },
            { name: 'the count on a tab', what: '`setTabCount` and `data-kp-tab-count` draw the exact number on a `.kp-tab` (never “9+”), with `-tone` (neutral, info, success, warning, error), `-unit` (“error,errors”, always heard, drawn with `-show-unit`), `-state` (`loading`: a skeleton, `error`: a dash) and `-zero` (`show`: a 0 is information).' },
        ],
        accessibility: [
            'Built in — a roving tab order, so Tab leaves the list rather than walking through every tab in it.',
            'Built in — the arrows, Home and End move between tabs, and the selection is reflected on the tab itself.',
            'Built in — every change of tab is an event, so a consumer can put the choice in the URL.',
            'Yours — write the roles and the pairing between tab and panel. The module drives markup that is already a tab list.',
            'Yours — name the tab list, and give each panel a label that is its tab.',
            'Yours — do not hide something behind a tab that the reader has to find by searching the page.',
        ],
    };
