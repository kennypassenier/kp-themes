// Page descriptor for the "facets" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const facetsDescriptor = {
        id: 'facets',
        title: 'Facet list',
        group: 'Data',
        classes: ['kp-facets', 'kp-facet'],
        exports: [],
        intro: 'Checkbox rows that narrow a list by one property, each with how many items it would show and an “only” button that selects just that row. `data-kp-facets` on the group; `data-kp-facets-all="Everything"` adds a row that turns every row on and shows a mixed state while only some are. js/facets.js (`setFacetItems`, `setFacetCounts`, `setFacetValues`, `getFacetValues`, `attachFacets`) keeps the rows in step and fires `kp-facet-change`. `setFacetItems` changes rows in place, so a row that arrives later never takes the keyboard focus away.',
        whenToUse: 'For the side of a log, a list or a board where a few values of one property are turned on and off, and the common move is “only this one”. For one value out of a few use a segmented control; for a long list with search use the combobox.',
        examples: [
            {
                title: 'A group with an Everything row',
                why: 'The checkboxes are the theme’s own; “only” is the theme’s ghost button, a sibling of the label. Counts keep a column.',
                markup: `
<div class="kp-facets" role="group" aria-label="Source">
<ul class="kp-facets__list">
<li class="kp-facet" data-kp-facet-all><label class="kp-facet__option"><input type="checkbox" class="kp-field__check kp-facet__check" checked /><span class="kp-facet__name">Everything</span><span class="kp-facet__count">351</span></label></li>
<li class="kp-facet" data-value="HOST"><label class="kp-facet__option"><input type="checkbox" class="kp-field__check kp-facet__check" checked /><span class="kp-facet__name">Host</span><span class="kp-facet__count">214</span></label><button type="button" class="kp-button kp-button--ghost kp-button--sm kp-facet__only" aria-label="Show only Host">only</button></li>
<li class="kp-facet" data-value="jellyfin"><label class="kp-facet__option"><input type="checkbox" class="kp-field__check kp-facet__check" checked /><span class="kp-facet__name">jellyfin</span><span class="kp-facet__count">96</span></label><button type="button" class="kp-button kp-button--ghost kp-button--sm kp-facet__only" aria-label="Show only jellyfin">only</button></li>
</ul>
</div>
`,
            },
            {
                title: 'Made from items, with a colour and an identity pattern, and counts that arrive',
                why: '`setFacetItems` reconciles the rows by value, in place. A row’s `swatch` is a colour and its `pattern` a seed (a name): a 5 by 5 pattern, the same for the same name wherever it is drawn (`identityCells(seed)`), is laid over the square, so two sources are told apart by more than a hue. `aria-busy="true"` shows the counts as quiet bars until `setFacetCounts` writes them. `kp-facet-change` carries `{ group, values, source, value }`; the line under the list prints it.',
                markup: `
<div class="kp-facets" id="doc-facets-live" data-kp-facets data-kp-facets-all="Everything" role="group" aria-label="Source" aria-busy="true">
<ul class="kp-facets__list"></ul>
<p class="kp-facets__empty" hidden>No sources yet.</p>
</div>
<p class="kp-text-muted" id="doc-facets-out" aria-live="polite">Showing everything.</p>
`,
                script: `
import { attachFacets, setFacetCounts, setFacetItems } from '@kp-soft/themes/js/facets';

const group = document.getElementById('doc-facets-live');
attachFacets(group.parentElement);
const hue = (name) => [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 360;
setFacetItems(
    group,
    ['Host', 'jellyfin', 'traefik', 'vaultwarden'].map((name) => ({
        value: name,
        label: name,
        swatch: 'oklch(0.62 0.15 ' + hue(name) + ')',
        pattern: name,
    })),
);
setTimeout(() => {
    setFacetCounts(group, { Host: 214, jellyfin: 96, traefik: 31, vaultwarden: 10 });
    group.removeAttribute('aria-busy');
}, 1200);
group.addEventListener('kp-facet-change', (event) => {
    const { values, source, value } = event.detail;
    document.getElementById('doc-facets-out').textContent = 'Showing ' + values.join(', ') + ' (' + source + (value ? ', ' + value : '') + ').';
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-facets-all', what: 'The Everything row; its checkbox is mixed while only some rows are on, and pressing it turns every row on.' },
            { name: 'aria-busy="true"', what: 'On the group: the counts show as quiet bars that keep their place until `setFacetCounts` writes them.' },
            { name: '.kp-facets--row', what: 'The rows side by side as bordered pills, scrolling sideways, for a phone.' },
            { name: '.kp-facet__swatch', what: 'An optional small square before the name; its colour is a custom property you set on it.' },
            { name: 'FacetItem.pattern / data-kp-facet-pattern', what: 'A seed (a name) for an identity pattern over the swatch: `identityCells(seed)` makes a 5 by 5 grid mirrored about its middle column, the same for the same name everywhere; `.kp-facet__pattern` is the drawing. An empty seed takes it away. The pattern’s size and ink are in the knobs.' },
            { name: 'setFacetItems / setFacetCounts / setFacetValues / getFacetValues', what: 'Reconcile the rows by value in place, write the counts, set the values that are on without an event, and read them. `kp-facet-change` fires for a person’s choice only: `source` is `toggle`, `only` or `all`.' },
            { name: 'facetOnly / facetAll / facetShowingOnly / facetShowingAll', what: 'The words (“only”, “Everything”, “Showing only Host”, “Showing everything”), in the dictionary; the “only” label and its aria name are `facetOnly` and `facetOnlyLabel`.' },
            { name: 'data-kp-facet-all and only', what: 'The “only” button is shown when the pointer is on the row or focus is in it, and always on a device that cannot hover.' },
        ],
        accessibility: [
            'Built in — each checkbox is named by its row’s name and described by its count; “only” says which row it is for; it sits beside the label, never inside it.',
            'Built in — after “only” or “Everything” a hidden status region says “Showing only Host” or “Showing everything”.',
            'Yours — give the group a name, and keep each count in step with what the page shows.',
        ],
    };
