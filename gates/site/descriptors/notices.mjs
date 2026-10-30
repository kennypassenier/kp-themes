// Page descriptor for the "notices" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const noticesDescriptor = {
        id: 'notices',
        title: 'Notification centre',
        group: 'Feedback',
        classes: ['kp-notices'],
        exports: [],
        aliases: ['inbox-href', 'notice', 'order', 'panel-max', 'quiet', 'read', 'unread'],
        intro: 'A counter with the exact number, a panel with the newest notices, a switch per source and “Quiet until 09:00” in plain words, plus the same list as a full Inbox page. A notice says what happened, since when, what it affects, what to do, and has a Fix button.',
        whenToUse: 'An application that raises notices people must act on. For one passing message use the toast; for something wrong right here use the alert.',
        examples: [
            {
                title: 'The counter and its panel',
                why: 'The markup is the empty box; the page hands over the notices with `setNotices`.',
                markup: `
<div class="kp-notices" data-kp-notices data-kp-inbox-href="/inbox"></div>
`,
                script: `
import { attachNotices, setNotices } from '@kp-soft/themes/js/notices';

const centre = document.querySelector('[data-kp-notices]');
attachNotices(centre.parentElement);
setNotices(centre, {
    state: 'ready',
    items: [
        { key: 'disk', severity: 'critical', title: 'Pool media is 93% full', since: '2026-10-17T18:02:00+02:00', consequence: 'Backups will stop at 100%.', remedy: 'Remove old snapshots.', fix: { label: 'Open snapshots' } },
        { key: 'cert', severity: 'warning', title: 'Certificate expires in 6 days', since: '2026-10-16T09:30:00+02:00', consequence: 'Clients will refuse the connection.', remedy: 'Renew it.', fix: { label: 'Renew' } },
    ],
    sources: [{ key: 'storage', label: 'Storage' }, { key: 'certs', label: 'Certificates' }],
});
`,
            },
            {
                title: 'The Inbox page, and the states',
                why: '`data-kp-notices-look="page"` has no counter and no panel: the list stands in the page, with a switch per source, the same notices and the same Fix buttons. The list is sorted by time here (`data-kp-order="time"`), and the second source is muted. `setNotices` also takes `state` (`loading`, `empty`, `error`, or `quiet` with `quietUntil`: the counter muted with a moon, “Quiet until 09:00” and End quiet).',
                markup: `
<div class="kp-notices" id="doc-notices-page" data-kp-notices data-kp-notices-look="page" data-kp-order="time"></div>
`,
                script: `
import { attachNotices, setNotices } from '@kp-soft/themes/js/notices';

const page = document.getElementById('doc-notices-page');
attachNotices(page.parentElement);
setNotices(page, {
    state: 'ready',
    items: [
        { key: 'disk', severity: 'critical', title: 'Pool media is 93% full', since: '2026-10-17T18:02:00+02:00', consequence: 'Backups will stop at 100%.', remedy: 'Remove old snapshots.', fix: { label: 'Open snapshots' } },
        { key: 'cert', severity: 'warning', title: 'Certificate expires in 6 days', since: '2026-10-16T09:30:00+02:00', consequence: 'Clients will refuse the connection.', remedy: 'Renew it.', fix: { label: 'Renew' } },
        { key: 'fw', severity: 'info', title: 'Firmware 4.2 is available', since: '2026-10-15T08:00:00+02:00', consequence: 'Nothing stops; the drift fix is not applied.', remedy: 'Plan the update.' },
    ],
    sources: [{ key: 'storage', label: 'Storage' }, { key: 'certs', label: 'Certificates', muted: true }],
});
`,
            },
            {
                title: 'Holding its height in a state',
                why: 'Loaded, the component is as high as its rows. Loading, empty or failed it keeps that height as a minimum, so the page under it does not jump twice; the first load has nothing remembered and is left alone. A very tall list holds a screen, not its full length (the cap is set on the host or any ancestor; it is 12 rem here to show it). Press the states.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-fp-notices">
<div class="kp-row kp-gap-sm" role="group" aria-label="State">
<button type="button" class="kp-button kp-button--sm" data-doc-state="ready">Ready</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="loading">Loading</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="empty">Empty</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="error">Failed</button>
</div>
<div class="kp-notices" data-kp-notices data-kp-notices-look="page" id="doc-fp-notices-host" style="--kp-footprint-max: 14rem"></div>
</div>
`,
                script: `
import { attachNotices, setNotices } from '@kp-soft/themes/js/notices';
const root = document.getElementById('doc-fp-notices');
const host = document.getElementById('doc-fp-notices-host');
attachNotices(root);
const items = [
    { key: 'disk', severity: 'critical', title: 'Pool media is 93% full', since: '2026-10-17T18:02:00+02:00', consequence: 'Backups will stop at 100%.', remedy: 'Remove old snapshots.', fix: { label: 'Open snapshots' } },
    { key: 'cert', severity: 'warning', title: 'Certificate expires in 6 days', since: '2026-10-16T09:30:00+02:00', consequence: 'Clients will refuse the connection.', remedy: 'Renew it.', fix: { label: 'Renew' } },
    { key: 'fw', severity: 'info', title: 'Firmware 4.2 is available', since: '2026-10-15T08:00:00+02:00', consequence: 'Nothing stops.', remedy: 'Plan the update.' },
];
const draw = (state) => setNotices(host, { state: state === 'ready' ? 'ready' : state, items: state === 'ready' ? items : [], error: 'The notices could not be read.' });
for (const button of root.querySelectorAll('[data-doc-state]')) {
    button.addEventListener('click', () => draw(button.dataset.docState));
}
draw('ready');
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachNotices(root, options)` wires every `[data-kp-notices]` and returns a detach; `noticesOf(el)` answers the handle; `setNotices(el, { state, items, sources, quietUntil, error })` hands over the data. `NOTICES` is the selector and `NOTICE_SEVERITIES` the three levels (`critical`, `warning`, `info`).' },
            { name: 'events', what: '`kp-notice-fix` `{ key }`, `kp-notice-read` `{ key, read }`, `kp-notices-read-all`, `kp-notices-source` `{ source, muted }`, `kp-notices-retry`, `kp-notices-end-quiet` and `kp-notices-open-inbox`, bubbling from the root.' },
            { name: '.kp-notices__trigger / __label / __count / __moon', what: 'The counter that opens the panel: its label, the exact number (a `.kp-badge`) and the moon of a quiet period.' },
            { name: '.kp-notices__panel / __page / __head / __heading / __tools / __body', what: 'The panel (a `.kp-popover`, a full-height sheet on a phone) or, in the page look, the page; its head with the heading and the tools, and the body that holds the list or a state.' },
            { name: '.kp-notices__quiet / __end-quiet / __read-all / __inbox', what: '“Quiet until 09:00” with End quiet, Mark all read and the link “All 37 in the Inbox”.' },
            { name: '.kp-notices__list / __item', what: 'One notice: an item with `data-kp-severity` and `data-kp-unread`, holding `__mark` (the severity as a mark and a word), `__title`, `__since`, `__consequence`, `__remedy` and `__actions` (`__fix`, `__mark-read`).' },
            { name: '.kp-notices__sources / __state / __foot', what: 'The switch per source, the plate of a loading, empty or failed list, and the foot of the panel.' },
            { name: 'data-kp-notices-look', what: '`both` (default: counter, panel and a link to the Inbox), `panel` (no link) or `page` (the list stands in the page, with the per-source switches).' },
            { name: 'data-kp-count', what: 'The number the counter shows when it is not the number of unread notices; exact, never “9+”.' },
            { name: 'data-kp-count-in-title', what: '`off` leaves the tab title alone; by default it gets “(5) ” in front.' },
            { name: 'data-kp-order', what: '`severity` (default: worst first, then newest) or `time`.' },
            { name: 'data-kp-read', what: '`explicit` (default: Mark read per row and Mark all read) or `on-open` (opening the panel reads all).' },
            { name: 'data-kp-panel-max', what: 'The newest notices per severity in the panel; 10, then “All 37 in the Inbox”.' },
            { name: 'data-kp-toast-new', what: '`none`, `severe` (default: a new critical notice also toasts) or `all`.' },
            { name: 'data-kp-inbox-href', what: 'Where the Inbox link goes; it also fires `kp-notices-open-inbox`.' },
            { name: 'data-kp-keys', what: '`off` leaves the keys alone: g then i opens the Inbox, m marks the focused notice read.' },
            { name: 'states', what: '`ready`, `loading` (the counter holds its place), `empty` (“Nothing waiting”), `error` (Retry; the counter says “?”) and `quiet` (a moon, “Quiet until 09:00”, End quiet).' },
        ],
        accessibility: [
            'Built in — new notices are announced politely and critical ones assertively, once; the counter has a label that says what it counts; on a phone the panel is a full-height sheet.',
            'Yours — say in each notice what it affects and what to do, and answer `kp-notice-fix` with the fix.',
        ],
    };
