// Page descriptor for the "toolbar" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const toolbarDescriptor = {
        id: 'toolbar',
        title: 'List toolbar',
        group: 'Data',
        classes: ['kp-toolbar'],
        exports: [],
        intro: 'The bar above a list, a log, a board or a chart that is not (or not only) a data table: a search box, groups of filters (segmented controls or chips), a slot for a count or a switch, and a row of the filters that are on as removable tags. The zones sit on one grid row, so the search box keeps its width whatever the filter groups hold. js/toolbar.js clears the search on Escape, focuses it on a key, and draws the active row.',
        whenToUse:
            'Above any list the reader narrows down by typing and by a few filters. For a data table use its own header filters instead: the toolbar is the same idea for everything else.',
        examples: [
            {
                title: 'Search, one filter group and a count',
                why: '`data-kp-toolbar-key="/"` focuses the search from anywhere on the page that is not a field; the key cap in the markup says so. The active row stays hidden until the page calls `setToolbarActive`.',
                markup: `
<div class="kp-toolbar" data-kp-toolbar data-kp-toolbar-key="/" role="group" aria-label="Containers">
<div class="kp-toolbar__search"><input type="search" class="kp-field__input kp-toolbar__input" placeholder="Search containers" aria-label="Search containers" aria-keyshortcuts="/" /><kbd class="kp-kbd kp-toolbar__key" aria-hidden="true">/</kbd></div>
<div class="kp-toolbar__filters"><div class="kp-toolbar__group" role="group" aria-labelledby="doc-tb-status"><b class="kp-toolbar__label" id="doc-tb-status">Status</b>
<div class="kp-segmented kp-segmented--chips" data-kp-segmented="multi" role="group" aria-label="Status"><button type="button" class="kp-segmented__item" data-value="all" data-kp-segmented-all aria-pressed="true"><span class="kp-segmented__label">All</span></button><button type="button" class="kp-segmented__item" data-value="running" aria-pressed="false"><span class="kp-segmented__label">Running</span></button></div>
</div></div>
<div class="kp-toolbar__state">12 of 48</div>
<div class="kp-toolbar__active" hidden></div>
</div>
`,
            },
            {
                title: 'The active row, a reserved height and a narrow column',
                why: 'The page keeps the filters in step: `setToolbarActive(toolbar, filters)` draws one removable tag each and Clear all, and the page turns a filter off on `kp-toolbar-remove` (`{ id, label }`) or all of them on `kp-toolbar-clear`. `data-kp-toolbar-reserve` keeps the active row’s height while it is empty, so the list under the toolbar never moves; `.kp-toolbar--stacked` is the one-column toolbar on demand, for a narrow card or a side column on a wide window.',
                markup: `
<div class="kp-toolbar kp-toolbar--stacked" id="doc-tb-live" data-kp-toolbar data-kp-toolbar-reserve role="group" aria-label="Containers" style="max-inline-size: 24rem">
<div class="kp-toolbar__search"><input type="search" class="kp-field__input kp-toolbar__input" placeholder="Search containers" aria-label="Search containers" /></div>
<div class="kp-toolbar__filters"><div class="kp-toolbar__group" role="group" aria-labelledby="doc-tb-live-status"><b class="kp-toolbar__label" id="doc-tb-live-status">Status</b>
<div class="kp-segmented kp-segmented--chips" data-kp-segmented="multi" role="group" aria-label="Status"><button type="button" class="kp-segmented__item" data-value="all" data-kp-segmented-all aria-pressed="true"><span class="kp-segmented__label">All</span></button><button type="button" class="kp-segmented__item" data-value="running" aria-pressed="false"><span class="kp-segmented__label">Running</span></button><button type="button" class="kp-segmented__item" data-value="stopped" aria-pressed="false"><span class="kp-segmented__label">Stopped</span></button></div>
</div></div>
<div class="kp-toolbar__state">3 containers</div>
<div class="kp-toolbar__active" hidden></div>
</div>
`,
                script: `
import { attachSegmented, getSegmentedValues, resetSegmented, setSegmentedValues } from '@kp-soft/themes/js/segmented';
import { attachToolbars, setToolbarActive } from '@kp-soft/themes/js/toolbar';

const toolbar = document.getElementById('doc-tb-live');
const chips = toolbar.querySelector('[data-kp-segmented]');
attachSegmented(toolbar);
attachToolbars(toolbar.parentElement);
const draw = (values) => setToolbarActive(toolbar, values.map((value) => ({ id: value, label: 'Status: ' + value })));
chips.addEventListener('kp-segmented-change', (event) => draw(event.detail.values));
toolbar.addEventListener('kp-toolbar-remove', (event) => {
    const values = getSegmentedValues(chips).filter((value) => value !== event.detail.id);
    setSegmentedValues(chips, values);
    draw(values);
});
toolbar.addEventListener('kp-toolbar-clear', () => {
    resetSegmented(chips);
    draw([]);
});
`,
            },
        ],
        variants: [
            { name: '.kp-toolbar__search', what: 'The search zone: the field and, beside it, the key cap that focuses it.' },
            { name: '.kp-toolbar__filters', what: 'The filter zone: any number of `.kp-toolbar__group`, each a label over a segmented control.' },
            { name: '.kp-toolbar__state', what: 'A slot for a count, a follow switch or a table/cards choice.' },
            { name: '.kp-toolbar__active', what: 'The filters that are on, as the data table’s removable tags and a Clear all button. Hidden when none is on.' },
            { name: 'data-kp-toolbar-key', what: 'The key that focuses the search from anywhere on the page that is not a field (`/`); the key cap in the markup (`.kp-toolbar__key`) says so.' },
            { name: 'data-kp-toolbar-reserve', what: 'The active row keeps its height while it is empty, so the list under the toolbar does not move when a filter is turned on.' },
            { name: '.kp-toolbar--stacked', what: 'The one-column toolbar on demand, for a narrow card or a side column on a wide window, where the window’s own width cannot know the room. The filters scroll sideways instead of wrapping.' },
            { name: 'data-kp-toolbar-clear', what: 'On the Clear all button; the script makes it once and keeps it, so a press in flight never meets a button replaced under it.' },
            { name: 'setToolbarActive(toolbar, filters, { clearAll, removeGlyph })', what: 'Draws the filters that are on (`{ id, label }` each); `clearAll: false` leaves out Clear all, `removeGlyph` changes the cross. `toolbarSearch(toolbar)` returns the search input.' },
            { name: 'toolbarShowingOnly / toolbarClearAll', what: 'The word before the tags and the Clear all label, in the dictionary, so `setStrings()` translates them.' },
        ],
        accessibility: [
            'Built in — the toolbar is a named group; Escape in the search clears it and fires `input`, so the page filters again.',
            'Built in — removing a tag moves the focus to the next one, and Clear all returns it to the search.',
            'Yours — name the toolbar, label the search, and call `setToolbarActive` again after a filter changes so the tags always say what is on.',
        ],
    };
