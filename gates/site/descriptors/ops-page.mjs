// Page descriptor for the "ops-page" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const opsPageDescriptor = {
        id: 'ops-page',
        title: 'Operations page',
        group: 'Layout',
        classes: ['kp-ops'],
        exports: [],
        intro: 'The anatomy of a dashboard page in one fixed order whatever the source order: header, KPI strip, attention band, toolbar, card grid. Pure CSS. Empty parts take no room; the toolbar (or the header) stays reachable while the cards scroll.',
        whenToUse: 'An operations or overview page that follows the principles of the house layout. For a free-form page use the page and stack layouts.',
        examples: [
            {
                title: 'Header, KPIs and two cards',
                why: 'A card takes six of twelve columns by default; `data-kp-span` widens one.',
                markup: `
<div class="kp-ops" data-kp-ops-sticky="none">
<header class="kp-ops__head kp-page-header"><h1 class="kp-page-header__title">Overview</h1></header>
<div class="kp-ops__kpis"><div class="kp-kpis"><div class="kp-kpi"><span class="kp-kpi__label">Stacks</span><span class="kp-kpi__value">24</span></div><div class="kp-kpi"><span class="kp-kpi__label">Failed</span><span class="kp-kpi__value">0</span></div></div></div>
<div class="kp-ops__body">
<section class="kp-card" data-kp-span="8"><h2 class="kp-card__title">Backups</h2><p>Last run 03:00, 31 volumes.</p></section>
<section class="kp-card" data-kp-span="4"><h2 class="kp-card__title">Disk</h2><p>63% used.</p></section>
</div>
</div>
`,
            },
            {
                title: 'A page that failed to load',
                why: 'The page writes `data-kp-state="error"` on `.kp-ops`; no script is needed. By default (`plate`) the failure takes the body whole: the alert is centred at heading size, holds the height the page had, and the cards of the last read are hidden. `data-kp-ops-failed="keep"` leaves the cards and lays the alert as a band on top. The switch changes the attribute at runtime.',
                markup: `
<div class="kp-stack kp-gap-md">
<label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" id="doc-ops-keep"><span>Keep the earlier cards under the band</span></label>
<div class="kp-ops" id="doc-ops-failed" data-kp-state="error" data-kp-ops-sticky="none" data-kp-ops-width="full">
<header class="kp-ops__head kp-page-header"><h1 class="kp-page-header__title">Overview</h1></header>
<div class="kp-ops__kpis"><div class="kp-kpis"><div class="kp-kpi"><span class="kp-kpi__label">Stacks</span><span class="kp-kpi__value">24</span></div><div class="kp-kpi"><span class="kp-kpi__label">Failed</span><span class="kp-kpi__value">0</span></div></div></div>
<div class="kp-ops__attention kp-attention">
<div class="kp-alert kp-alert--destructive kp-attention__item" role="alert" data-kp-severity="critical">
<span class="kp-attention__icon" aria-hidden="true">!</span>
<div class="kp-attention__text"><strong><span class="kp-sr-only">Critical: </span>The overview could not be read</strong><span>The host did not answer.</span></div>
<div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">Retry</button></div>
</div>
</div>
<div class="kp-ops__body">
<section class="kp-card" data-kp-span="8"><h2 class="kp-card__title">Backups</h2><p>Last run 03:00, 31 volumes.</p></section>
<section class="kp-card" data-kp-span="4"><h2 class="kp-card__title">Disk</h2><p>63% used.</p></section>
</div>
</div>
</div>
`,
                script: `
const ops = document.getElementById('doc-ops-failed');
document.getElementById('doc-ops-keep').addEventListener('change', (event) => {
    ops.setAttribute('data-kp-ops-failed', event.target.checked ? 'keep' : 'plate');
});
`,
            },
        ],
        variants: [
            { name: 'the footprint', what: 'The page is a footprint host (js/footprint.js): while it is `loading` or `error` it keeps the height it had when it was ready, as a minimum, so the failed plate stands where the cards stood. `FOOTPRINT_MAX` is the cap behind the knob, 48rem; the other hosts are the matrix, the entity grid, the checklist, the notices, the gallery, the availability grid and the request inspector (`FOOTPRINT_HOSTS`).' },
            { name: '.kp-ops__head / __kpis / __attention / __toolbar / __body', what: 'The five slots, in this fixed order whatever the source order. The head and the body are required; a missing or empty slot takes no room. The attention slot is a `.kp-attention` with one alert per problem; the toolbar is a `.kp-toolbar`.' },
            { name: 'data-kp-state', what: 'On `.kp-ops`: `loading`, `empty` or `error` (the last is the failed page above). The page is a footprint host: in a state it holds the height it had when ready (js/footprint.js), so the page under it does not jump.' },
            { name: 'data-kp-ops-width', what: '`80vw` (default, never under 64rem), `full` or `measure` (64rem).' },
            { name: 'data-kp-ops-cards', what: 'The default span of a card in twelve columns: `12`, `8`, `6` (default), `4` or `3`.' },
            { name: 'data-kp-ops-sticky', what: '`toolbar` (default), `head` or `none`: the part that stays reachable.' },
            { name: 'data-kp-ops-failed', what: '`plate` (default) or `keep`: what a page with `data-kp-state="error"` shows. `plate`: the alert takes the body, centred at heading size, at the height the page had, the stale cards hidden. `keep`: the cards stay, the alert is a band on top. Switchable at runtime.' },
            { name: 'data-kp-uniform', what: '`off`: cards in a row keep their own height; by default a row has one height.' },
            { name: 'data-kp-density', what: '`comfortable` (default) or `compact`.' },
            { name: 'data-kp-span', what: 'On a card: `3`, `4`, `6`, `8` or `12` columns.' },
            { name: 'data-kp-ops-wide / data-kp-ops-narrow', what: 'On header actions: `wide` ones leave the header on a phone; `narrow` entries of its More menu appear there.' },
        ],
        accessibility: [
            'Built in — the visual order is fixed but the source order is yours, so keep it the reading order; spans collapse to 6 and 12 columns on a tablet and one on a phone by the page’s own width.',
            'Yours — give each card a title and keep the KPI strip to figures that matter.',
        ],
    };
