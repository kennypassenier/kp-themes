// Page descriptor for the "status-row" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const statusRowDescriptor = {
        id: 'status-row',
        aliases: ['status', 'status-id', 'status-retry', 'status-retry-button', 'status-change', 'today', 'since', 'resume', 'detail', 'folded'],
        title: 'Status rows',
        group: 'Feedback',
        classes: ['kp-statuslist', 'kp-statusrow'],
        exports: [],
        intro: 'One row per item that is read or checked one by one: a mark, the item’s name, a short detail and, when it failed, a Retry that tries that one item again. `data-state` is `ok`, `loading`, `failed` or `empty`; each is a shape and a word as well as a colour. js/statusrow.js (`buildStatusList`, `setStatus`, `attachStatusLists`) keeps the mark, the spoken state, `aria-busy`, the Retry and the announcement in step with it, and fires `kp-status-retry` when a Retry is pressed and `kp-status-change` when a row changes.',
        whenToUse: 'For a page that reads many things separately (a backup per stack, a check per host) and must say which one is slow, which failed and why. For the steps of one run use the step list.',
        examples: [
            {
                title: 'The four states',
                why: 'Give every row a detail so a reason arriving later moves nothing; `--kp-statusrow-detail-lines: 2` keeps room for a two-line reason.',
                markup: `
<ul class="kp-statuslist" aria-label="Backups per stack">
<li class="kp-statusrow" data-state="ok" data-kp-status-id="jellyfin"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">jellyfin</span><span class="kp-statusrow__detail">read</span></span></li>
<li class="kp-statusrow" data-state="loading" data-kp-status-id="vault"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">vaultwarden</span><span class="kp-statusrow__detail">reading (12 s)</span></span></li>
<li class="kp-statusrow" data-state="failed" data-kp-status-id="traefik"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">traefik</span><span class="kp-statusrow__detail">timed out after 20 s</span></span></li>
<li class="kp-statusrow" data-state="empty" data-kp-status-id="grafana"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">grafana</span><span class="kp-statusrow__detail">no backups by design</span></span></li>
</ul>
`,
            },
            {
                title: 'Built from rows, with a Retry that works',
                why: '`buildStatusList(rows, { label, retry, single })` builds the list; `setStatus(list, id, { state, label, detail })` changes one row. Pressing Retry on the failed row fires `kp-status-retry` with `{ item, id }` and changes nothing else: the page decides what a retry is, here `loading`, then `ok` two seconds later. `kp-status-change` fires on every change after attach, and the hidden status region says it once.',
                markup: `
<div id="doc-status-host"></div>
`,
                script: `
import { attachStatusLists, buildStatusList, setStatus } from '@kp-soft/themes/js/statusrow';

const host = document.getElementById('doc-status-host');
const list = buildStatusList(
    [
        { id: 'jellyfin', label: 'jellyfin', state: 'ok', detail: 'read' },
        { id: 'vault', label: 'vaultwarden', state: 'loading', detail: 'reading' },
        { id: 'traefik', label: 'traefik', state: 'failed', detail: 'timed out after 20 s' },
        { id: 'grafana', label: 'grafana', state: 'empty', detail: 'no backups by design' },
    ],
    { label: 'Backups per stack', single: true },
);
host.append(list);
attachStatusLists(host);
setTimeout(() => setStatus(list, 'vault', { state: 'ok', detail: 'read' }), 2500);
list.addEventListener('kp-status-retry', (event) => {
    const id = event.detail.id;
    setStatus(list, id, { state: 'loading', detail: 'reading' });
    setTimeout(() => setStatus(list, id, { state: 'ok', detail: 'read' }), 2000);
});
`,
            },
            {
                title: 'A check list: a reservation, the fix written out, a summary line',
                why: '`warn` is a pass with a reservation: the warning pair on the mark and a “!” as its shape. A failed or warn row may carry `fix`, what to do about it, written out under the detail in `.kp-statusrow__fix` (a row in any other state hides it). `buildStatusList` and `setStatus` take `fix`, and `countStatus(list)` counts the rows by state as they are now, for a line such as “2 of 4 checks pass”. Press Fix the folder to see the row pass and the line change.',
                markup: `
<div class="kp-stack">
<p data-doc-checks-summary role="status"></p>
<div id="doc-checks-host"></div>
<div class="kp-row"><button type="button" class="kp-button kp-button--sm" data-doc-checks-fix>Fix the folder</button></div>
</div>
`,
                script: `
import { attachStatusLists, buildStatusList, countStatus, setStatus } from '@kp-soft/themes/js/statusrow';

const host = document.getElementById('doc-checks-host');
const summary = document.querySelector('[data-doc-checks-summary]');
const list = buildStatusList(
    [
        { id: 'disk', label: 'Free disk space', state: 'ok', detail: '81 GB free' },
        { id: 'clock', label: 'Clock', state: 'warn', detail: 'Two seconds off', fix: 'Turn on time sync in the host settings.' },
        { id: 'folder', label: 'Data folder', state: 'failed', detail: 'Not writable', fix: 'Give the service account write access to /srv/data.' },
        { id: 'mail', label: 'Mail server', state: 'ok', detail: 'Answered in 120 ms' },
    ],
    { label: 'Readiness checks', single: true },
);
host.append(list);
attachStatusLists(host);

const tell = () => {
    const counts = countStatus(list);
    summary.textContent = counts.ok + ' of ' + counts.total + ' checks pass, ' + counts.warn + ' with a reservation, ' + counts.failed + ' failed';
};
tell();
document.querySelector('[data-doc-checks-fix]').addEventListener('click', () => {
    setStatus(list, 'folder', { state: 'ok', detail: 'Writable', fix: '' });
    tell();
});
`,
            },
            {
                title: 'A calm list: open, done, paused, not known',
                why: '`data-kp-status-vocab="calm"` swaps the four states for ones with no red: a paused row says since when and offers Resume (one press, with Undo); a row nothing is known about is `unknown`, never done. Put it in a `.kp-card` for the loading, empty and failed states (`setTodayState`).',
                markup: `
<ul class="kp-statuslist kp-statuslist--rows" aria-label="Today" data-kp-status-vocab="calm" data-kp-today-now="2026-10-17T12:00:00+02:00">
<li class="kp-statusrow" data-state="open" data-kp-status-id="meds"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Morning pills</span><span class="kp-statusrow__detail"></span></span></li>
<li class="kp-statusrow" data-state="done" data-kp-status-id="water"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Water the plants</span><span class="kp-statusrow__detail"></span></span></li>
<li class="kp-statusrow" data-state="paused" data-kp-since="2026-10-03" data-kp-status-id="move"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Movement</span><span class="kp-statusrow__detail"></span></span></li>
<li class="kp-statusrow" data-state="unknown" data-kp-status-id="soil"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Zamioculcas soil</span><span class="kp-statusrow__detail">No sensor reading</span></span></li>
</ul>
`,
            },
            {
                title: 'A today card: Pause, Resume with a reason, open rows first, and the events',
                why: '`data-kp-today-pause` adds Pause to open rows and Resume stays on paused ones; both fire a cancelable event (`kp-status-pause`, `kp-status-resume`, with `{ item, id }`) and offer Undo, which fires `kp-status-undo` with `{ item, id, action }`. A row with `data-kp-resume-reason` cannot be resumed and says why in its own words. `data-kp-today-order="open-first"` orders the rows once, when the list attaches, and a row that becomes done never moves under a thumb. The list sits in a `.kp-card` so loading, empty and failed have somewhere to go.',
                markup: `
<section class="kp-card" id="doc-today" data-kp-state="ready" aria-labelledby="doc-today-title">
<div class="kp-card__header"><h3 class="kp-card__title" id="doc-today-title">Today</h3></div>
<div class="kp-card__stage"><div class="kp-card__data">
<ul class="kp-statuslist kp-statuslist--rows" aria-label="Today" data-kp-status-vocab="calm" data-kp-today-now="2026-10-17T12:00:00+02:00" data-kp-today-pause data-kp-today-order="open-first" data-kp-today-since="relative">
<li class="kp-statusrow" data-state="done" data-kp-status-id="done"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Evening check-in</span><span class="kp-statusrow__detail"></span></span></li>
<li class="kp-statusrow" data-state="open" data-kp-status-id="walk"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Walk after dinner</span><span class="kp-statusrow__detail"></span></span></li>
<li class="kp-statusrow" data-state="paused" data-kp-status-id="move" data-kp-since="2026-10-03"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Movement</span><span class="kp-statusrow__detail"></span></span></li>
<li class="kp-statusrow" data-state="paused" data-kp-status-id="pills" data-kp-since="2026-10-10" data-kp-resume-reason="Wait for the pharmacy to confirm the new dose"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Morning pills</span><span class="kp-statusrow__detail"></span></span></li>
</ul>
</div></div>
</section>
<pre class="kp-code-block" id="doc-today-log" aria-live="polite">Press Pause or Resume.</pre>
`,
                script: `
import { STATUS_PAUSE_EVENT, STATUS_RESUME_EVENT, STATUS_UNDO_EVENT } from '@kp-soft/themes/js/statusrow';

const list = document.querySelector('#doc-today .kp-statuslist');
const log = document.getElementById('doc-today-log');
for (const name of [STATUS_PAUSE_EVENT, STATUS_RESUME_EVENT, STATUS_UNDO_EVENT]) {
    list.addEventListener(name, (event) => (log.textContent = name + ' { id: ' + event.detail.id + ' }'));
}
`,
            },
            {
                title: 'Long pauses gathered behind one line, and the card’s states',
                why: '`data-kp-today-paused="fold"` gathers rows paused longer than `data-kp-today-fold-after` days (30 by default) into one expandable line, so a long list of old pauses does not stand between a person and today. The calm vocabulary is `CALM_STATUS_STATES` (`open`, `done`, `paused`, `unknown`, `loading`); `setTodayState(card, state)` draws the card’s `loading`, `empty` and `error` (a blame-free sentence and a normal-size Retry) in the footprint of the rows, and `settleToday(list)` orders and folds again after rows were changed by a script.',
                markup: `
<div class="kp-stack">
<section class="kp-card" id="doc-today-fold" data-kp-state="ready" aria-labelledby="doc-today-fold-title">
<div class="kp-card__header"><h3 class="kp-card__title" id="doc-today-fold-title">Today</h3></div>
<div class="kp-card__stage"><div class="kp-card__data">
<ul class="kp-statuslist kp-statuslist--rows" aria-label="Today" data-kp-status-vocab="calm" data-kp-today-now="2026-10-17T12:00:00+02:00" data-kp-today-paused="fold" data-kp-today-fold-after="30">
<li class="kp-statusrow" data-state="open" data-kp-status-id="a"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Call the pharmacy</span><span class="kp-statusrow__detail"></span></span></li>
<li class="kp-statusrow" data-state="paused" data-kp-status-id="b" data-kp-since="2026-10-03"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Movement</span><span class="kp-statusrow__detail"></span></span></li>
<li class="kp-statusrow" data-state="paused" data-kp-status-id="c" data-kp-since="2026-08-20"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Reading</span><span class="kp-statusrow__detail"></span></span></li>
<li class="kp-statusrow" data-state="paused" data-kp-status-id="d" data-kp-since="2026-07-02"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Evening stretch</span><span class="kp-statusrow__detail"></span></span></li>
<li class="kp-statusrow" data-state="paused" data-kp-status-id="e" data-kp-since="2026-05-11"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Cold shower</span><span class="kp-statusrow__detail"></span></span></li>
</ul>
</div></div>
</section>
<div class="kp-row kp-flex-wrap kp-gap-sm" role="group" aria-label="States">
<button type="button" class="kp-button" data-doc-today-state="ready">Ready</button>
<button type="button" class="kp-button" data-doc-today-state="loading">Loading</button>
<button type="button" class="kp-button" data-doc-today-state="empty">Empty</button>
<button type="button" class="kp-button" data-doc-today-state="error">Could not read</button>
</div>
</div>
`,
                script: `
import { setTodayState } from '@kp-soft/themes/js/statusrow';

const card = document.getElementById('doc-today-fold');
for (const button of document.querySelectorAll('[data-doc-today-state]')) {
    button.addEventListener('click', () => setTodayState(card, button.getAttribute('data-doc-today-state')));
}
`,
            },
        ],
        variants: [
            { name: 'data-state', what: '`ok` (a disc with a tick), `loading` (the theme’s spinner), `failed` (a disc with a cross, a red edge and a Retry), `empty` (a dashed ring and a dashed edge).' },
            { name: 'data-state="warn"', what: 'A pass with a reservation: the warning pair on the mark with a “!” as its shape, never colour alone. Like `failed` it may carry a fix.' },
            { name: '.kp-statusrow__fix', what: 'Inside the row’s body: the fix written out, in the row’s own words. Shown on a `failed` or `warn` row only; `fix` of `buildStatusList` and `setStatus` fills it, and an empty `fix` clears it.' },
            { name: 'countStatus(list)', what: 'How many rows are in each state (and the total) as they stand now, for a summary line such as “3 of 4 checks pass”; a calm list counts its own states.' },
            { name: 'data-kp-status-id', what: 'Names a row for `setStatus(list, id, { state, label, detail })`.' },
            { name: 'data-kp-status-retry="false"', what: 'On the list: no Retry button on failed rows.' },
            { name: '.kp-statuslist--rows', what: 'One column instead of a grid of columns of at least 16rem.' },
            { name: 'buildStatusList / setStatus / attachStatusLists', what: 'Build the list from rows `{ id, label, state, detail }`, change one row, and attach the spoken parts and the Retry. `kp-status-retry` is `{ item, id }`, `kp-status-change` is `{ item, id, state, previous }`.' },
            { name: 'statusOk / statusLoading / statusFailed / statusEmpty / statusRetry', what: 'The state words and the Retry label, in the dictionary; `statusRetryLabel` names a Retry after its row, and `statusAnnounce` and `statusAnnounceMany` are the announcements (more than three changes in one tick become one summary).' },
            { name: 'data-kp-status-vocab', what: '`calm` (open, done, paused, unknown; `standard` is the default). A row asked for `failed`, `warn` or anything else is drawn as unknown and the console says so.' },
            { name: 'data-kp-since', what: 'On a paused calm row: `YYYY-MM-DD`; the row says “Paused since 03/10/2026”.' },
            { name: 'data-kp-today-since', what: '`both` (the default: “Paused since 03/10/2026 (2 weeks)”), `date` or `relative` (“Paused for 2 weeks”).' },
            { name: 'data-kp-today-resume', what: '`off` leaves out Resume (present by default); `data-kp-resume-reason` on a row disables it and says why.' },
            { name: 'data-kp-today-pause', what: 'Present shows Pause on open rows.' },
            { name: 'data-kp-today-order', what: '`open-first` orders the rows once, at attach (`given` is the default); nothing moves afterwards.' },
            { name: 'data-kp-today-paused and data-kp-today-fold-after', what: '`fold` gathers rows paused longer than this many days (30) into one line that opens them; `show` is the default.' },
            { name: 'data-kp-today-mark', what: '`none` takes the glyphs away (`glyph` is the default).' },
            { name: 'data-kp-today-now', what: 'An ISO moment that “today” is for, for a page with its own clock.' },
            { name: 'data-kp-undo-ms', what: 'How long Undo is offered after Resume or Pause (6000, 0 for none).' },
            { name: 'kp-status-resume, kp-status-pause, kp-status-undo', what: 'Resume and Pause are cancelable and carry `{ item, id }`; Undo puts the row back as it was and carries `{ item, id, action }`. `settleToday(list)` orders and folds again; `setTodayState(card, state)` is the card’s loading, empty and failed.' },
            { name: '.kp-statusrow--fold and .kp-statusrow__fold', what: 'The one line that gathers the long-paused rows, “3 paused for more than 30 days”, with the exact number, as a button that opens them (`aria-expanded`). It is the module’s, put last in the list, not written in markup.' },
            { name: 'CALM_STATUS_STATES', what: 'The states a calm row may be in: `open`, `done`, `paused`, `unknown`, and `loading`. Anything else is drawn as `unknown`.' },
            { name: 'marks the module writes', what: '`data-kp-detail-auto` (the since line is the module’s), `data-kp-folded` (a row gathered behind the fold line).' },
        ],
        accessibility: [
            'Built in — each row reads “name, state”, a loading row has `aria-busy`, and a change is announced once through a hidden status region; more than three changes in one tick become one summary.',
            'Built in — the Retry is named after its row, and when the focused Retry goes away the focus moves to the row’s name.',
            'Yours — name the list, and write a reason that says what to do.',
        ],
    };
