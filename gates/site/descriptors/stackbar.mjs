// Page descriptor for the "stackbar" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const stackbarDescriptor = {
        id: 'stackbar',
        title: 'Share bar',
        group: 'Data',
        classes: ['kp-stackbar'],
        exports: [],
        intro: 'One bar split into the parts of a whole, in the chart colours, the free rest as the track, with a legend that gives every part its exact value. js/stackbar.js (`setStackbar`, `stackbarParts`, `attachStackbars`) draws it from a list; every part has a hover card, the arrow keys walk them, and `kp-stackbar-pick` names a pressed part.',
        whenToUse: 'For what fills a disk, a budget or a quota. For one share of a whole use the meter; for shares over time use the chart.',
        examples: [
            {
                title: 'From a spec in the markup',
                why: 'A page that draws later calls `setStackbar(el, spec)`; `state` is `loading`, `empty` or `error`, each at the bar’s height.',
                markup: `
<figure class="kp-stackbar" data-kp-stackbar='{"title":"Root volume","total":120,"parts":[{"label":"Docker images","value":41},{"label":"Volumes","value":18.5},{"label":"Logs","value":6.5}]}'></figure>
`,
            },
            {
                title: 'Small parts merged, a warning tick, a part that needs attention, and a bar past its whole',
                why: '`other` is a share: every part under it joins one “Other” part. `marks` puts a tick across the bar at a share of the whole, with its words in a tooltip; a part with `tone` takes the warning or destructive colour in place of a chart colour; `restLabel` renames the free row. The second bar holds more than its total: it is drawn as their sum, a ▸ stands at its end and the legend says “Over by …”. `legend: false` leaves the legend out and `summary` replaces the words at the head’s end. The bars are `--sm` and `--lg`.',
                markup: `
<div class="kp-stack">
<figure class="kp-stackbar kp-stackbar--lg" data-doc-share="volume"></figure>
<figure class="kp-stackbar" data-doc-share="over"></figure>
<figure class="kp-stackbar kp-stackbar--sm" data-doc-share="compact"></figure>
</div>
`,
                script: `
import { setStackbar } from '@kp-soft/themes/js/stackbar';

const gb = (value) => value + ' GB';
const bar = (name) => document.querySelector('[data-doc-share="' + name + '"]');

setStackbar(bar('volume'), {
    title: 'Root volume',
    total: 120,
    format: gb,
    other: 0.05,
    restLabel: 'Free space',
    marks: [{ at: 0.8, label: '80 % warning level' }],
    parts: [
        { key: 'images', label: 'Docker images', value: 41 },
        { key: 'volumes', label: 'Volumes', value: 18.5 },
        { key: 'logs', label: '/var/log', value: 31, tone: 'warning' },
        { key: 'tmp', label: '/tmp', value: 2 },
        { key: 'cache', label: 'Cache', value: 3 },
    ],
});

setStackbar(bar('over'), {
    title: 'Monthly budget',
    total: 100,
    format: (value) => '€ ' + value,
    parts: [
        { label: 'Hosting', value: 64 },
        { label: 'Backups', value: 31 },
        { label: 'Domains', value: 17 },
    ],
});

setStackbar(bar('compact'), {
    title: 'Quota',
    summary: '3 of 5 seats',
    total: 5,
    legend: false,
    parts: [{ label: 'Seats in use', value: 3 }],
});
`,
            },
            {
                title: 'Waiting, nothing to show, and failed with a Retry',
                why: '`state` is `loading` (the bar is the meter’s own loading picture and the legend keeps its rows as waiting lines), `empty` or `error` (a calm note with the words, filling the footprint the bar and legend had, so nothing under it moves). `message` replaces the default words. A failed bar has a normal-size Retry that fires `kp-stackbar-retry`; `retry: false` leaves it out. A press on a part or on its legend row fires `kp-stackbar-pick`; try the third bar.',
                markup: `
<div class="kp-stack">
<figure class="kp-stackbar" data-doc-share="loading"></figure>
<figure class="kp-stackbar" data-doc-share="empty"></figure>
<figure class="kp-stackbar" data-doc-share="failed"></figure>
<p class="kp-text-muted" data-doc-share-said role="status">Press a part, or fail the read and press Retry.</p>
</div>
`,
                script: `
import { setStackbar } from '@kp-soft/themes/js/stackbar';

const bar = (name) => document.querySelector('[data-doc-share="' + name + '"]');
const said = document.querySelector('[data-doc-share-said]');
const gb = (value) => value + ' GB';
const parts = [
    { key: 'images', label: 'Docker images', value: 41 },
    { key: 'volumes', label: 'Volumes', value: 18.5 },
];

setStackbar(bar('loading'), { title: 'Root volume', state: 'loading' });
setStackbar(bar('empty'), { title: 'Backups volume', state: 'empty', message: 'Nothing has been measured on this volume yet.' });

const failed = bar('failed');
const draw = (state) => setStackbar(failed, { title: 'Data volume', total: 120, format: gb, parts, state, message: 'The disk could not be read.' });
draw('error');
failed.addEventListener('kp-stackbar-retry', () => draw('ready'));
failed.addEventListener('kp-stackbar-pick', (event) => {
    said.textContent = 'Pressed: ' + event.detail.key;
});
`,
            },
            {
                title: 'Picking parts',
                why: 'With `picked`, a part is a toggle button; the page keeps the state from `kp-stackbar-pick`.',
                markup: `
<figure class="kp-stackbar" id="doc-stack-pick" aria-label="Root volume"></figure>
`,
                script: `
import { setStackbar } from '@kp-soft/themes/js/stackbar';

const bar = document.getElementById('doc-stack-pick');
const spec = { title: 'Root volume', total: 120, parts: [{ key: 'img', label: 'Docker images', value: 41 }, { key: 'vol', label: 'Volumes', value: 18.5 }, { key: 'log', label: 'Logs', value: 6.5 }] };
let picked = ['vol'];
setStackbar(bar, { ...spec, picked });
bar.addEventListener('kp-stackbar-pick', (event) => {
    picked = event.detail.picked ?? picked;
    setStackbar(bar, { ...spec, picked });
});
`,
            },
        ],
        variants: [
            { name: '.kp-stackbar--sm / --lg', what: 'An 8 px or a 20 px bar around the 12 px default.' },
            { name: 'other, marks', what: 'Parts under a share merged into “Other”; ticks across the bar at a share.' },
            { name: 'over the whole', what: 'Parts adding up past the total: the bar is their sum, a ▸ at its end, “Over by …” in the legend.' },
            { name: 'tone', what: 'A part with `tone: \'warning\'` or `\'destructive\'` takes that status colour in place of a chart colour.' },
            { name: 'the sixth part', what: 'From the sixth part on the chart colours come round again, hatched, so two parts never share one look.' },
            { name: 'state: loading', what: 'The bar is the meter’s loading picture, the theme’s own way a bar waits; the legend keeps its rows as waiting lines and the root is `aria-busy`.' },
            { name: 'state: empty / error', what: 'One calm note, `.kp-stackbar__note` with `.kp-stackbar__note-title`, over the whole footprint the bar and legend had; an error also has `.kp-stackbar__retry`, a normal-size button. A bar without a legend keeps its track and says the words in its name and hover card.' },
            { name: 'retry: false', what: 'A failed bar for a read the page cannot repeat: the words and no Retry.' },
            { name: 'the legend', what: 'The legend keeps one value column for all rows (written by `setStackbar`) and a label wraps instead of being cut, with the swatch and the value on its first line.' },
            { name: 'setStackbar(el, { picked: [keys] })', what: 'The parts become toggle buttons with `aria-pressed`; a part and its legend row take `data-kp-stackbar-picked`. The page owns the state through `kp-stackbar-pick` and calls `setStackbar` again with the new keys.' },
        ],
        accessibility: ['Built in — the bar is a group of parts, each named with its value and share; one tab stop, arrow keys within.', 'Built in — the legend holds every exact value.'],
    };
