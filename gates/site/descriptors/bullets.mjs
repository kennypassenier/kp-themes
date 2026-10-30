// Page descriptor for the "bullets" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const bulletsDescriptor = {
        id: 'bullets',
        title: 'Bullet rows',
        group: 'Data',
        classes: ['kp-bullets'],
        exports: [],
        intro: 'Rows of a value against a threshold: a lead, the label and a detail, a meter whose tick is the threshold, and the exact figure; worst first. js/bullets.js (`setBullets`, `bulletTone`, `attachBullets`); loading lays the data table’s busy card over waiting rows; a failed list has a Retry (`kp-bullets-retry`).',
        whenToUse: 'Days since the last contact against a limit, a backup’s age, days to an expiry. For one value use the meter.',
        examples: [
            {
                title: 'From a spec in the markup',
                why: 'Past the threshold the warning tone, past `bad` the destructive one.',
                markup: `
<div class="kp-bullets" data-kp-bullets='{"threshold":14,"bad":21,"rows":[{"key":"a","label":"Data engineer","detail":"due since 02/10/2026","value":22,"lead":"Acme"},{"key":"b","label":"Project lead","value":9,"lead":"Contoso"}]}'></div>
`,
            },
            {
                title: 'A formatted figure, links and buttons, a row with nothing to measure',
                why: '`format` writes the figure (here “22 d”), `max` is where the bar ends (twice the threshold unless given) and `sort: \'none\'` keeps the order given instead of worst first. A row with `href` is a link and one with `pick: true` a button that fires `kp-bullets-pick` with its key; the whole row is the press area. A `value` of `null` is a dash and no bar, and `figure` writes the figure as it is.',
                markup: `
<div class="kp-stack">
<div class="kp-bullets" data-doc-bullets="rows"></div>
<p class="kp-text-muted" data-doc-bullets-said role="status">Press a row that is a button.</p>
</div>
`,
                script: `
import { setBullets } from '@kp-soft/themes/js/bullets';

const list = document.querySelector('[data-doc-bullets="rows"]');
setBullets(list, {
    threshold: 14,
    bad: 21,
    max: 28,
    sort: 'none',
    format: (days) => days + ' d',
    rows: [
        { key: 'a', lead: 'Acme Logistics', label: 'Data engineer', detail: 'last contact 02/10/2026', value: 22, href: '#acme' },
        { key: 'b', lead: 'Contoso', label: 'Project lead', detail: 'last contact 10/10/2026', value: 15, pick: true },
        { key: 'c', lead: 'Fabrikam', label: 'Site reliability engineer', value: 6, pick: true },
        { key: 'd', lead: 'Northwind', label: 'Platform engineer', detail: 'no contact yet', value: null },
    ],
});
list.addEventListener('kp-bullets-pick', (event) => {
    document.querySelector('[data-doc-bullets-said]').textContent = 'Pressed: ' + event.detail.key;
});
`,
            },
            {
                title: 'Waiting, nothing to list, and failed with a Retry',
                why: '`state: \'loading\'` keeps the rows’ geometry as waiting rows (`loadingRows` says how many, `loadingWords` what the busy card says) and lays the data table’s busy card over them. `empty` is a full-size empty state with `emptyTitle` and `emptyText`; `error` says `message` with a normal-size Retry that fires `kp-bullets-retry` (`retry: false` leaves it out). Nothing under a state moves: it fills the height the rows had.',
                markup: `
<div class="kp-stack">
<div class="kp-bullets" data-doc-bullets="loading"></div>
<div class="kp-bullets" data-doc-bullets="empty"></div>
<div class="kp-bullets" data-doc-bullets="failed"></div>
</div>
`,
                script: `
import { setBullets } from '@kp-soft/themes/js/bullets';

const list = (name) => document.querySelector('[data-doc-bullets="' + name + '"]');

setBullets(list('loading'), { threshold: 14, state: 'loading', loadingRows: 3, loadingWords: 'Reading the follow-ups' });
setBullets(list('empty'), {
    threshold: 14,
    state: 'empty',
    emptyTitle: 'No open applications',
    emptyText: 'Add an application and its follow-up clock shows here.',
});

const failed = list('failed');
const rows = [{ key: 'a', lead: 'Acme', label: 'Data engineer', value: 9 }];
const draw = (state) => setBullets(failed, { threshold: 14, rows, state, message: 'The follow-ups could not be read.' });
draw('error');
failed.addEventListener('kp-bullets-retry', () => draw('ready'));
`,
            },
        ],
        variants: [
            { name: 'href / pick', what: 'A row that is a link, or a button that fires `kp-bullets-pick`; its press area is the whole row.' },
            { name: 'value: null', what: 'Nothing to measure: a dash and no bar, the row keeping its height.' },
            { name: 'tones', what: 'A value at or past the threshold takes the warning tone (the figure on the warning plate), at or past `bad` the destructive one, and past `max` the bar’s ▸ says so. `bulletTone(value, threshold, bad)` gives the same answer to a page that needs it elsewhere.' },
            { name: 'state: loading', what: 'The rows are drawn as waiting rows and the data table’s busy card lies over them; the real rows are drawn once the card has gone.' },
            { name: 'state: empty / error', what: 'The package’s empty state, `.kp-bullets__note` (`.kp-empty` with `.kp-bullets__note-title`, `.kp-bullets__note-text`), filling the height the rows had. An error also has `.kp-bullets__retry`, a normal-size button.' },
            { name: 'retry: false', what: 'A failed list for a read the page cannot repeat: the words and no Retry.' },
        ],
        accessibility: ['Built in — each meter reads its figure and the threshold.', 'Yours — say in the card what the threshold is.'],
    };
