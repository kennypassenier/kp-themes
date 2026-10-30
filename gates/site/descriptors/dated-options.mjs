// Page descriptor for the "dated-options" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const datedOptionsDescriptor = {
        id: 'dated-options',
        title: 'Dated option picker',
        group: 'Forms',
        classes: ['kp-dated'],
        exports: [],
        aliases: ['latest', 'layout', 'legend', 'meta-column', 'meta-column-off', 'now', 'order', 'picker', 'picker-inline-max', 'picker-kind', 'preselect', 'was', 'no-hint'],
        intro: 'A choice where every option has a date and an age: radio rows with the name (or the date), how long ago, a “Latest” badge on the newest and a size or kind in one column at the end; a searchable list of the same two lines for a long list.',
        whenToUse: 'Picking a snapshot, a backup or a version. For options without a moment use the radio group; for one date use the date picker.',
        examples: [
            {
                title: 'Snapshots',
                why: 'The page hands over the options with `setDatedOptions(el, options, value)`: `{ value, label?, when?, meta?, disabled? }`. Up to `data-kp-picker-inline-max` (7) they are radio rows in one group, the newest first and badged “Latest”, with the meta in one column so it lines up from row to row; type a few letters and the first option starting with them is chosen. `disabled` is the sentence that says why an option cannot be chosen now. `data-kp-now` fixes the clock so “3 days ago” stays true here. `kp-dated-change` carries `{ value, option }`; `datedValue(el)` reads the choice.',
                markup: `
<div class="kp-dated" id="doc-dated" data-kp-dated data-kp-now="2026-10-18T12:00:00+02:00" aria-label="Snapshot to restore"></div>
<p class="kp-text-muted" id="doc-dated-said" role="status">The newest snapshot is chosen.</p>
`,
                script: `
import { attachDatedOptions, datedValue, setDatedOptions } from '@kp-soft/themes/js/dated-options';

const picker = document.getElementById('doc-dated');
attachDatedOptions(picker.parentElement);
setDatedOptions(picker, [
    { value: 'a1', when: '2026-10-15T04:00:00+02:00', meta: '4.1 GB' },
    { value: 'a2', when: '2026-10-16T04:00:00+02:00', meta: '4.2 GB' },
    { value: 'a3', when: '2026-10-17T04:00:00+02:00', meta: '4.2 GB' },
    { value: 'a4', label: 'Before the upgrade', when: '2026-10-10T21:30:00+02:00', meta: '3.9 GB' },
    { value: 'a5', when: '2026-09-30T04:00:00+02:00', meta: '3.7 GB', disabled: 'Pruned: only the catalogue is left.' },
]);
const said = document.getElementById('doc-dated-said');
picker.addEventListener('kp-dated-change', (event) => {
    said.textContent = 'Chosen: ' + datedValue(picker) + ' (' + event.detail.option.value + ').';
});
`,
            },
            {
                title: 'A long list in a combobox, the options, and the states',
                why: 'More than the inline maximum becomes the package’s searchable combobox whose list shows the same two lines (`data-kp-picker="radio"` or `"combobox"` forces one). `data-kp-order` is `newest` (default), `oldest` or `given`, `data-kp-latest="none"` leaves the badge off, `data-kp-meta-column="false"` writes the meta under the name, `data-kp-preselect="false"` leaves the newest unchosen, `data-kp-value` chooses a value when the options arrive and `data-kp-name` names the radios for a form. `setDatedState(el, state, options)`: loading is the busy card over placeholder rows (`data-kp-rows` is how many), empty is the page’s `reason` and an `action` centred in the package’s empty plate, error is the alert with Try again (`kp-dated-retry`).',
                markup: `
<div class="kp-dated" id="doc-dated-long" data-kp-dated data-kp-picker="combobox" data-kp-order="oldest" data-kp-latest="none" data-kp-now="2026-10-18T12:00:00+02:00" aria-label="Backup to restore"></div>
<div class="kp-dated" id="doc-dated-plain" data-kp-dated data-kp-meta-column="false" data-kp-preselect="false" data-kp-now="2026-10-18T12:00:00+02:00" aria-label="Version"></div>
<div class="kp-dated" id="doc-dated-loading" data-kp-dated data-kp-rows="3" aria-label="Snapshots, loading"></div>
<div class="kp-dated" id="doc-dated-empty" data-kp-dated data-kp-rows="3" aria-label="Snapshots, none"></div>
<div class="kp-dated" id="doc-dated-failed" data-kp-dated data-kp-rows="3" aria-label="Snapshots, failed"></div>
`,
                script: `
import { attachDatedOptions, setDatedOptions, setDatedState } from '@kp-soft/themes/js/dated-options';

const long = document.getElementById('doc-dated-long');
attachDatedOptions(long.parentElement);
const many = [];
for (let day = 1; day <= 12; day++) {
    many.push({ value: 'b' + day, when: '2026-10-' + String(day).padStart(2, '0') + 'T03:00:00+02:00', meta: (3 + day / 10).toFixed(1) + ' GB' });
}
setDatedOptions(long, many);
setDatedOptions(document.getElementById('doc-dated-plain'), [
    { value: 'v1', label: 'Version 2.4', when: '2026-10-12T10:00:00+02:00', meta: 'stable' },
    { value: 'v2', label: 'Version 2.5', when: '2026-10-16T10:00:00+02:00', meta: 'beta' },
]);
setDatedState(document.getElementById('doc-dated-loading'), 'loading');
setDatedState(document.getElementById('doc-dated-empty'), 'empty', { reason: 'No snapshots yet.' });
setDatedState(document.getElementById('doc-dated-failed'), 'error', { title: 'Could not list the snapshots', text: 'The backup disk did not answer.' });
`,
            },
        ],
        variants: [
            { name: 'data-kp-preselect', what: '`false` leaves the newest unchosen; else it is chosen when the options arrive.' },
            { name: 'data-kp-name / data-kp-value', what: 'The radios’ name, for a form (the element’s id by default), and the value chosen when the options arrive (the newest).' },
            { name: 'datedAge / orderDated', what: 'The age in words of a moment for a clock, and the options in an order (`newest`, `oldest`, `given`).' },
            { name: 'datedOptions / setDatedState', what: '`datedOptions(el)` gives the options in the order shown; `setDatedState(el, state, { reason, action, title, text })` the other states. `kp-dated-retry` is Try again on a failed picker.' },
            { name: 'data-kp-picker', what: '`radio`, `combobox` or `auto` (default): rows up to the inline maximum, a search above it.' },
            { name: 'data-kp-picker-inline-max', what: 'The longest list drawn as rows; 7.' },
            { name: 'data-kp-latest', what: '`first` (default) labels the newest; `none`.' },
            { name: 'data-kp-order', what: '`newest` (default), `oldest` or `given`.' },
            { name: 'data-kp-meta-column', what: '`false` writes the meta under the name instead of in a column.' },
            { name: 'data-kp-rows', what: 'The rows a first load or a state keeps the height of.' },
        ],
        accessibility: [
            'Built in — the rows are one radio group with arrow keys and type-ahead; the long list is the package’s combobox; the choice is announced; a disabled option says why in its own text.',
            'Yours — name the picker after what it restores (`aria-label`), and format the meta (`formatBytes`).',
        ],
    };
