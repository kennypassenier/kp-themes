// Page descriptor for the "entity-card" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const entityCardDescriptor = {
        id: 'entity-card',
        title: 'Entity card',
        group: 'Data',
        classes: ['kp-entity-grid', 'kp-entity'],
        aliases: ['entity', 'selectable', 'density', 'flags'],
        exports: [],
        intro: 'One card per thing (a stack, a host): its identity mark, name, state in words, a few exact figures, flags, two meters and its actions. Every card is the same five rows, kept whether a row holds anything or not, so every card in every state is exactly as high as the next.',
        whenToUse: 'An overview of a handful to a few dozen things that each have a state and a few actions. For many rows to sort and compare, use the data table.',
        examples: [
            {
                title: 'A grid of cards',
                why: 'The page gives the data; a refill with the same key changes the words in place, so a card under the pointer never moves.',
                markup: `
<div class="kp-entity-grid" data-kp-entity-grid id="doc-entities" role="list"></div>
`,
                script: `
import { setEntityGrid } from '@kp-soft/themes/js/entity-card';
setEntityGrid(document.getElementById('doc-entities'), [
    { key: 'media', name: 'media', vmid: '106', state: { label: 'running', tone: 'success' },
      figures: [{ value: '3/5', label: 'apps up' }, { value: '12', label: 'restarts' }],
      flags: [{ label: 'update available', tone: 'warning' }],
      meters: [{ label: 'CPU', value: 0.34 }, { label: 'RAM', value: 0.71, text: '5.6 of 8 GB' }],
      actions: [{ id: 'restart', label: 'Restart' }, { id: 'logs', label: 'Logs' }] },
]);
`,
            },
            {
                title: 'A narrow grid, a card with no action, and the states',
                why: 'The actions come only from the data: the second card has none, so it has no actions row (`data-kp-entity-actions="none"`, written by the script). The first has three, and the grid is narrow: a button that does not fit the card goes into “More” for the whole grid, and `data-kp-entity-fit` (written on the grid) counts how many fit now; it comes back when the grid widens. `setEntityGridState` puts the whole grid in `loading`, `empty` or `error`; a single card takes a `status` of its own.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-entities-more">
<div style="inline-size: 21rem; max-inline-size: 100%">
<div class="kp-entity-grid" data-kp-entity-grid data-kp-entity-min="18rem" data-kp-entity-inline="3" id="doc-entities-narrow" role="list"></div>
</div>
<div class="kp-entity-grid" data-kp-entity-grid id="doc-entities-failed" role="list"></div>
</div>
`,
                script: `
import { attachEntityCards, setEntityGrid, setEntityGridState } from '@kp-soft/themes/js/entity-card';

attachEntityCards(document.getElementById('doc-entities-more'));
setEntityGrid(document.getElementById('doc-entities-narrow'), [
    { key: 'media', name: 'media', vmid: '106', state: { label: 'running', tone: 'success' },
      figures: [{ value: '3/5', label: 'apps up' }],
      meters: [{ label: 'CPU', value: 0.34 }, { label: 'RAM', value: 0.71 }],
      actions: [{ id: 'restart', label: 'Restart' }, { id: 'logs', label: 'Logs' }, { id: 'remove', label: 'Remove', danger: true }] },
    { key: 'lab', name: 'lab', vmid: '112', state: { label: 'stopped' }, figures: [{ value: '0/2', label: 'apps up' }], meters: [{ label: 'CPU', value: null }, { label: 'RAM', value: null }] },
]);
setEntityGridState(document.getElementById('doc-entities-failed'), 'error', { message: 'The host did not answer.' });
`,
            },
            {
                title: 'Holding its height in a state',
                why: 'Loaded, the component is as high as its rows. Loading, empty or failed it keeps that height as a minimum, so the page under it does not jump twice; the first load has nothing remembered and is left alone. A very tall list holds a screen, not its full length (the cap is set on the host or any ancestor; it is 12 rem here to show it). Press the states.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-fp-entity">
<div class="kp-row kp-gap-sm" role="group" aria-label="State">
<button type="button" class="kp-button kp-button--sm" data-doc-state="ready">Ready</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="loading">Loading</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="empty">Empty</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="error">Failed</button>
</div>
<div class="kp-entity-grid" data-kp-entity-grid id="doc-fp-entity-host" role="list" style="--kp-footprint-max: 14rem"></div>
</div>
`,
                script: `
import { attachEntityCards, setEntityGrid, setEntityGridState } from '@kp-soft/themes/js/entity-card';
const root = document.getElementById('doc-fp-entity');
const host = document.getElementById('doc-fp-entity-host');
attachEntityCards(root);
const stacks = ['media', 'home', 'network'].map((name, i) => ({ key: name, name, vmid: String(106 + i), state: { label: 'running', tone: 'success' }, figures: [{ value: '3/5', label: 'apps up' }], meters: [{ label: 'CPU', value: 0.3 }, { label: 'RAM', value: 0.6 }], actions: [{ id: 'logs', label: 'Logs' }] }));
const draw = (state) => (state === 'ready' ? setEntityGrid(host, stacks) : setEntityGridState(host, state, { message: 'The host did not answer.' }));
for (const button of root.querySelectorAll('[data-doc-state]')) {
    button.addEventListener('click', () => draw(button.dataset.docState));
}
draw('ready');
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachEntityCards(root)` wires every grid and returns a detach; `setEntityGrid(grid, list)` fills it (a refill with the same key changes the words in place); `setEntity(card, data)` draws one card; `setEntityGridState(grid, state, { count, message, title, actionLabel })` puts the grid in a state. `ENTITY_GRID` and `ENTITY_CARD` are the selectors. The card’s data is `{ key, name, vmid, state, figures, flags, meters, actions, status, error }`, and an action may be `danger` or carry a `disabled` reason.' },
            { name: 'events', what: '`kp-entity-action` `{ key, id }`, `kp-entity-flag` `{ key, flag }`, `kp-entity-tick` `{ key, ticked }`, `kp-entity-retry` `{ key }` from a card, and `kp-entity-new` and `kp-entity-grid-retry` from the grid (the `ENTITY_…_EVENT` constants).' },
            { name: 'data-kp-entity-key / -link / -mark / -min / -narrow', what: 'The card’s stable key; the template of the name’s link (`{key}`, the whole card is its click target); the mark (`idmark` default, `icon` or `none`); on the grid, the least width of a card (22rem); `data-kp-entity-narrow`, which the script writes on the grid while it is narrower than 30rem: every action then goes into “More”.' },
            { name: 'data-kp-entity-actions / data-kp-entity-fit', what: 'Written by the script: `none` on a card with no action (it has no actions row), and on the grid the count of action buttons that fit now. A button that does not fit the card’s width goes into “More” for every card of the grid, in one place, and comes back as the grid widens.' },
            { name: '.is-ticked / .is-cursor', what: 'A ticked card and the card the keys j, k and x stand on (a ring); both are rows of a selection.' },
            { name: '.kp-card--entity', what: 'The card: the same five rows in every state, so every card is as high as the next. `.kp-card--ghost` is the placeholder card of a loading grid.' },
            { name: '.kp-entity__id / __figures / __flags / __meters / __actions', what: 'The five rows. The identity row holds `__tick`, `__name` (the link), `__vmid` and `__state`; the figures row `__figure` (`__value`, `__none`); the flags row `__flag` and `__more-flags`, the menu button whose `__plus` is the exact “+2”; the meters row `__meter` (`__meter-label`, `__meter-value`); the actions row `__action` and `__more`, the “More” menu button. `__bone` is a loading row, `__retry` the Retry of a failed card and `__busy` the card laid over a loading grid.' },
            { name: 'data-kp-entity-meters', what: 'How many meter rows a card holds, 0 to 3; two by default.' },
            { name: 'data-kp-entity-flags-max', what: 'How many flags show; the rest are an exact “+2” that opens the package’s own menu. Three by default.' },
            { name: 'data-kp-entity-inline', what: 'The most actions that stand as buttons; the rest go in “More”. The buttons come only from the data: a card with no action has no row for them, and every card has as many columns as the grid’s busiest card. Under 30rem every action folds into “More”.' },
            { name: 'data-kp-selectable', what: 'A tick at the start of the card, a row of a selection with the keys j, k and x.' },
            { name: 'data-kp-state', what: 'On a card: `loading` (the same five rows as bones), `empty` (“not measured”) or `error` (a destructive state and Retry). On the grid: `loading` (skeleton cards under the busy card), `empty` or `error` (the package’s plates).' },
            { name: 'equal action columns', what: 'The same action is one width on every card, a long label wraps, and More takes what cannot fit.' },
            { name: 'meters[].tone', what: '`success` and `neutral` as well as the others.' },
            { name: 'empty with an action', what: '`setEntityGridState(grid, "empty", { action: "none", actionLabel, onAction })`, `setEntityGrid(grid, [], empty)` and `data-kp-entity-empty-action="none"` say whether the empty plate has an action and what it is called.' },
            { name: 'the trend row', what: '`trend`, `trendLabel` and `trendText` in the card data draw a sparkline; `data-kp-entity-trend` is `auto`, `on` or `off`. The parts are `.kp-entity__trend`, `__trend-line` and `__spark`.' },
            { name: 'the app tile', what: '`data-kp-entity-kind="tile"` draws a link tile (card data `href`, `external`, `description`, `lines`, `starred`) with a health state, a description, lines and a favourite star (`data-kp-entity-star`, event `kp-entity-star` with `{ key, starred }`).' },
        ],
        accessibility: [
            'Built in — the name is the card’s one link and stretches over the card (one tab stop); every figure is an exact number; the “+2” and “More” are the package’s menu button with its keys; a ticked card is a checked box with its own name.',
            'Yours — keep the key of a card stable, so a refill changes it in place.',
        ],
    };
