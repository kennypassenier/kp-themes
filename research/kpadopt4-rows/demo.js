// research/kpadopt4-rows: the sample data and the buttons that drive the demo. Everything it draws uses the package's
// classes and calls the package's own functions (js/actions.js, js/card-state.js, js/statusrow.js).
import { removeRow, setRowBusy } from '../../js/actions.js';
import { setCardState } from '../../js/card-state.js';
import { countStatus, setStatus } from '../../js/statusrow.js';

/** @param {string} tag @param {Record<string, string> | null} [attrs] @param {...(Node | string | null)} kids */
const h = (tag, attrs = null, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs ?? {})) el.setAttribute(k, v);
    for (const kid of kids) if (kid !== null) el.append(kid);
    return el;
};
/** @param {string} label @param {Record<string, string>} [attrs] */
const button = (label, attrs = {}) => h('button', { type: 'button', class: 'kp-button kp-button--sm', ...attrs }, label);
/** @param {...(Node | string | null)} parts */
const meta = (...parts) => h('span', { class: 'kp-action-list__meta' }, ...parts.map((p) => (typeof p === 'string' ? h('span', null, p) : p)));
const wait = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------- 1a inbox
const INBOX = [
    {
        key: 'backup-vault',
        state: 'new',
        dot: 'down',
        word: 'urgent',
        title: 'Backups of vault failed twice',
        text: 'The last two runs stopped at the upload: the backup target refused the connection.',
        meta: ['Backups', '12 min ago'],
        open: 'Open backups',
    },
    {
        key: 'jellyfin-mem',
        state: 'new',
        dot: 'warn',
        word: 'warning',
        title: 'jellyfin is using 91 % of its memory limit',
        text: 'For the last 20 minutes; a transcode is running.',
        meta: ['Host', '34 min ago'],
        open: 'Open host',
    },
    {
        key: 'gateway',
        state: 'active',
        dot: 'ok',
        word: 'in flight',
        title: 'Live view is updating the gateway',
        text: 'Step 3 of 35: pulling the new image.',
        meta: ['Live view', 'started 2 min ago'],
        open: 'Watch',
        noSeen: true,
    },
    {
        key: 'cert',
        state: 'done',
        dot: 'ok',
        word: 'done',
        title: 'Certificate for media.kp-soft.dev renewed',
        text: 'Valid until 14/01/2027.',
        meta: ['Traefik', '15/10/2026 23:10'],
        open: 'Open',
    },
    {
        key: 'long',
        state: 'new',
        dot: 'warn',
        word: 'warning',
        title: 'The restore test of the photo library found 14 files whose checksum differs from the copy taken on 12/10/2026 at 03:00, all of them in the folder Holidays/2019/Provence-and-the-long-drive-back',
        text: 'They may have been edited since; compare them before the next pruning removes the older copy.',
        meta: ['Backups', 'Restore test', '1 h ago'],
        open: 'Compare',
    },
];

let failNext = false;

/** @param {typeof INBOX[number]} r */
const inboxRow = (r) =>
    h(
        'li',
        { 'data-kp-state': r.state, 'data-key': r.key },
        h(
            'span',
            { class: 'kp-action-list__lead' },
            h(
                'span',
                { class: 'kp-health', 'data-state': r.dot },
                h('span', { class: 'kp-health__dot', 'aria-hidden': 'true' }),
                h('span', { class: 'kp-sr-only' }, r.word),
            ),
        ),
        h(
            'div',
            { class: 'kp-action-list__main' },
            h('strong', { class: 'kp-action-list__title' }, r.title),
            h('span', { class: 'kp-action-list__text' }, r.text),
            meta(...r.meta),
        ),
        h(
            'div',
            { class: 'kp-row-actions' },
            button(r.open, { 'data-kp-action': 'open', 'data-k4-open': '' }),
            r.noSeen ? null : button('Mark seen', { 'data-kp-action': 'seen', 'data-k4-seen': '' }),
        ),
    );

const inboxLists = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-k4-inbox], [data-k4-inbox-phone]')]);
const drawInbox = () => {
    for (const list of inboxLists) list.replaceChildren(...INBOX.map(inboxRow));
};
drawInbox();
const inboxReadout = /** @type {HTMLElement} */ (document.querySelector('[data-k4-inbox-readout]'));
for (const list of inboxLists) {
    list.addEventListener('click', async (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const row = /** @type {HTMLElement | null} */ (target?.closest('li'));
        if (!row) return;
        if (target?.closest('[data-k4-open]')) {
            inboxReadout.textContent = `Opened: ${row.querySelector('.kp-action-list__title')?.textContent}`;
            return;
        }
        const seen = /** @type {HTMLElement | null} */ (target?.closest('[data-k4-seen]'));
        if (!seen || row.getAttribute('aria-busy') === 'true') return;
        setRowBusy(row, true, seen);
        await wait(1200);
        if (failNext) {
            failNext = false;
            failButton.setAttribute('aria-pressed', 'false');
            setRowBusy(row, false);
            inboxReadout.textContent = 'Could not mark it seen: the server did not answer. The row is back as it was.';
            return;
        }
        await removeRow(row);
        inboxReadout.textContent = 'Marked seen.';
    });
    list.addEventListener('kp-row-open', (event) => {
        const row = /** @type {CustomEvent} */ (event).detail.row;
        inboxReadout.textContent = `Opened: ${row.querySelector('.kp-action-list__title')?.textContent}`;
    });
}
const failButton = /** @type {HTMLElement} */ (document.querySelector('[data-k4-inbox-fail]'));
failButton.addEventListener('click', () => {
    failNext = !failNext;
    failButton.setAttribute('aria-pressed', String(failNext));
});
document.querySelector('[data-k4-inbox-reset]')?.addEventListener('click', () => {
    drawInbox();
    inboxReadout.textContent = 'All five rows are back.';
});

// ---------------------------------------------------------------- 1b backlog
const BACKLOG = [
    {
        id: '01JA3Q7K2M8V4T6N0R5X9C1B2D',
        state: 'dead',
        published: '16/10/2026 03:00',
        attempts: '5 of 5 attempts',
        note: 'gave up: the receiver answered 503 five times',
        payload: '{\n  "job": "backup",\n  "stack": "vault",\n  "target": "s3://backups-hourly/vault/2026-10-16T03:00:00Z",\n  "volumes": ["vault_data", "vault_config"],\n  "requested_by": "schedule:backups-hourly"\n}',
    },
    {
        id: '01JA3R2W5Y7P1K3M9Q4T8V6Z0A',
        state: 'claimed',
        published: '16/10/2026 13:00',
        attempts: '1 of 5 attempts',
        note: 'claimed by runner-2 for 40 s',
        payload: '{ "job": "backup", "stack": "jellyfin", "target": "s3://backups-hourly/jellyfin/2026-10-16T13:00:00Z" }',
    },
    {
        id: '01JA3S8B1C4D6F2G9H7J5K3L0M',
        state: 'pending',
        published: '16/10/2026 14:00',
        attempts: '0 of 5 attempts',
        note: '',
        payload: '{ "job": "backup", "stack": "traefik" }',
    },
    {
        id: '01JA3T0N2P4Q6R8S1T3U5V7W9X',
        state: 'pending',
        published: '16/10/2026 14:00',
        attempts: '0 of 5 attempts',
        note: 'binary payload, 2.1 KB, not shown',
        payload: '',
    },
];
const BADGE = /** @type {Record<string, string>} */ ({ dead: 'kp-badge kp-badge--destructive', claimed: 'kp-badge kp-badge--warning', pending: 'kp-badge' });
const ROW_STATE = /** @type {Record<string, string>} */ ({ dead: 'failed', claimed: 'active', pending: '' });

/** @param {typeof BACKLOG[number]} m */
const backlogRow = (m) => {
    const row = h(
        'li',
        { 'data-key': m.id },
        h('span', { class: 'kp-action-list__lead' }, h('span', { class: BADGE[m.state] }, m.state)),
        h(
            'div',
            { class: 'kp-action-list__main' },
            h('span', { class: 'kp-action-list__title kp-id' }, m.id),
            meta(`published ${m.published}`, m.attempts, m.note || null),
            m.payload
                ? h(
                      'details',
                      { class: 'kp-accordion__item kp-accordion__item--bare kp-action-list__more' },
                      h('summary', null, 'Payload'),
                      h('pre', { class: 'kp-action-list__payload' }, m.payload),
                  )
                : null,
        ),
        h(
            'div',
            { class: 'kp-row-actions' },
            m.state === 'dead' ? button('Requeue', { 'data-kp-action': 'requeue', 'data-k4-requeue': '' }) : null,
            button('Delete', { 'data-kp-action': 'delete', 'data-k4-delete': '', class: 'kp-button kp-button--sm kp-button--destructive' }),
        ),
    );
    if (ROW_STATE[m.state]) row.setAttribute('data-kp-state', ROW_STATE[m.state]);
    return row;
};
const backlog = /** @type {HTMLElement} */ (document.querySelector('[data-k4-backlog]'));
const backlogPhone = /** @type {HTMLElement} */ (document.querySelector('[data-k4-backlog-phone]'));
const backlogCard = /** @type {HTMLElement} */ (document.querySelector('[data-k4-backlog-card]'));
const backlogCount = /** @type {HTMLElement} */ (document.querySelector('[data-k4-backlog-count]'));
const countBacklog = () => {
    const n = backlog.querySelectorAll(':scope > li').length;
    backlogCount.textContent = n === 1 ? '1 message' : `${n} messages`;
    return n;
};
const drawBacklog = () => {
    backlog.replaceChildren(...BACKLOG.map(backlogRow));
    backlogPhone.replaceChildren(...BACKLOG.slice(0, 2).map(backlogRow));
    countBacklog();
    setCardState(backlogCard, 'ready');
};
drawBacklog();
backlog.addEventListener('click', async (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const row = /** @type {HTMLElement | null} */ (target?.closest('li'));
    if (!row || row.getAttribute('aria-busy') === 'true') return;
    const requeue = /** @type {HTMLElement | null} */ (target?.closest('[data-k4-requeue]'));
    const del = /** @type {HTMLElement | null} */ (target?.closest('[data-k4-delete]'));
    if (!requeue && !del) return;
    setRowBusy(row, true, requeue ?? del);
    await wait(900);
    if (requeue) {
        setRowBusy(row, false);
        row.removeAttribute('data-kp-state');
        const badge = row.querySelector('.kp-action-list__lead > .kp-badge');
        if (badge) {
            badge.className = 'kp-badge';
            badge.textContent = 'pending';
        }
        requeue.remove();
        return;
    }
    await removeRow(row);
    if (countBacklog() === 0)
        setCardState(backlogCard, 'empty', {
            title: 'Nothing pending or claimed',
            text: 'Every message of this subscription has been delivered or deleted.',
        });
});
document.querySelector('[data-k4-backlog-reset]')?.addEventListener('click', drawBacklog);

// ---------------------------------------------------------------- 1c files
const FILES = [
    { fmt: 'PDF', name: 'CV', meta: ['PDF', '182 KB', '14/10/2026 09:12'], used: ['Cover letter', 'Mail draft'], view: true },
    { fmt: 'PDF', name: 'Cover letter · PDF', meta: ['PDF', '96 KB', '14/10/2026 09:20'], used: ['Mail draft'], view: true },
    { fmt: 'TXT', name: 'Vacancy text', meta: ['TXT', '6 KB', '12/10/2026 18:44'], used: [], view: true },
    {
        fmt: 'IMG',
        name: 'Proof of application: the portal confirmation page as it stood after sending, full height, with the reference number and the list of attachments',
        meta: ['IMG', '1.4 MB', '14/10/2026 09:31'],
        used: ['Status record', 'Follow-up of 21/10/2026', 'Journey'],
        view: true,
    },
    { fmt: 'DATA', name: 'Status record', meta: ['DATA', 'missing from the folder since 15/10/2026'], used: [], view: true, missing: true },
];

/** @param {typeof FILES[number]} f */
const fileRow = (f) => {
    const view = button('View', { 'data-kp-action': 'view' });
    if (f.missing) {
        view.setAttribute('disabled', '');
        view.setAttribute('title', 'The file is not in the folder any more, so there is nothing to show');
    }
    const row = h(
        'li',
        f.missing ? { 'data-kp-state': 'failed' } : null,
        h('span', { class: 'kp-action-list__lead' }, h('span', { class: 'kp-badge' }, f.fmt)),
        h(
            'div',
            { class: 'kp-action-list__main' },
            h('strong', { class: 'kp-action-list__title' }, f.name),
            meta(...f.meta, ...f.used.map((u) => h('span', { class: 'kp-badge' }, u))),
        ),
        h(
            'div',
            { class: 'kp-row-actions' },
            view,
            f.missing
                ? null
                : h('a', { class: 'kp-button kp-button--sm', href: '#files', 'data-kp-action': 'open', 'aria-label': `Open ${f.name} in a new tab`, title: 'Open in a new tab' }, '↗'),
        ),
    );
    return row;
};
for (const list of document.querySelectorAll('[data-k4-files], [data-k4-files-phone]')) list.replaceChildren(...FILES.map(fileRow));
for (const list of document.querySelectorAll('[data-k4-files-mini]')) {
    const n = Number(list.getAttribute('data-k4-files-mini')) || FILES.length;
    list.replaceChildren(...FILES.slice(0, n).map(fileRow));
}

// ---------------------------------------------------------------- 1d appointments
const APPOINTMENTS = [
    { group: 'Upcoming' },
    { day: 'Thu 23/10/2026', time: '14:00', title: 'Second interview', note: 'With Hanne Peeters and the platform lead, at the Ghent office.', state: 'next', badge: 'Next · in 7 days', calendar: true },
    { day: 'Tue 28/10/2026', time: '10:00', title: 'Technical test', note: 'Two hours, remote; they send the link the day before.', state: '' },
    { group: 'Past' },
    { day: 'Tue 14/10/2026', time: '09:30', title: 'Intro call', note: 'Twenty minutes with the recruiter.', state: 'past' },
    { day: 'Mon 06/10/2026', time: '16:00', title: 'Phone screen', note: '', state: 'past' },
];
/** @param {typeof APPOINTMENTS[number]} a */
const appointmentRow = (a) => {
    if ('group' in a && a.group) return h('li', { class: 'kp-action-list__group' }, h('h4', null, a.group));
    const del = button('Delete', { 'data-kp-action': 'delete', class: 'kp-button kp-button--sm kp-button--destructive' });
    if (a.calendar) {
        del.setAttribute('disabled', '');
        del.setAttribute('title', 'Remove it from your calendar first (Calendar card)');
    }
    const row = h(
        'li',
        a.state ? { 'data-kp-state': a.state } : null,
        h('span', { class: 'kp-action-list__lead' }, h('time', { class: 'kp-action-list__when' }, h('span', null, a.day ?? ''), h('span', null, a.time ?? ''))),
        h(
            'div',
            { class: 'kp-action-list__main' },
            h('strong', { class: 'kp-action-list__title' }, a.title ?? ''),
            a.note ? h('span', { class: 'kp-action-list__text' }, a.note) : null,
            a.badge || a.calendar
                ? meta(a.badge ? h('span', { class: 'kp-badge kp-badge--info' }, a.badge) : null, a.calendar ? 'In your calendar: remove it there before deleting it here' : null)
                : null,
        ),
        h('div', { class: 'kp-row-actions' }, button('Edit', { 'data-kp-action': 'edit' }), del),
    );
    return row;
};
for (const list of document.querySelectorAll('[data-k4-appointments], [data-k4-appointments-phone]')) list.replaceChildren(...APPOINTMENTS.map(appointmentRow));

// ---------------------------------------------------------------- 2 card states
const live = /** @type {HTMLElement} */ (document.querySelector('[data-k4-live-card]'));
const readout = /** @type {HTMLElement} */ (document.querySelector('[data-k4-card-readout]'));
const pick = /** @type {HTMLElement} */ (document.querySelector('[data-k4-state-pick]'));
const WORDS = /** @type {Record<string, string>} */ ({ loading: 'loading', empty: 'empty', error: 'error', ready: 'filled' });
const OPTIONS = /** @type {Record<string, import('../../js/card-state.js').CardStateOptions>} */ ({
    loading: { words: 'Reading the folder…' },
    empty: {
        title: 'No files yet',
        text: 'Files the procedure writes for this application land here.',
        action: h('button', { type: 'button', class: 'kp-button kp-button--sm' }, 'Open the folder'),
    },
    error: { title: 'Could not list the files', text: 'The server answered 502 Bad Gateway: the files service is not running.' },
    ready: {},
});
/** @param {HTMLElement} card @param {string} state */
const put = (card, state) => setCardState(card, /** @type {any} */ (state), { ...OPTIONS[state], action: state === 'empty' ? OPTIONS.empty.action?.cloneNode(true) : null });
/** @param {string} state */
const choose = (state) => {
    put(live, state);
    readout.textContent = `State: ${WORDS[state]}.`;
    for (const item of pick.querySelectorAll('[data-value]')) item.setAttribute('aria-checked', String(item.getAttribute('data-value') === state));
};
pick.addEventListener('kp-segmented-change', (event) => {
    const value = /** @type {CustomEvent} */ (event).detail.value;
    if (value) choose(value);
});
const reload = async () => {
    choose('loading');
    await wait(1500);
    choose('ready');
};
document.querySelector('[data-k4-reload]')?.addEventListener('click', reload);
live.addEventListener('kp-card-retry', reload);

const phone = /** @type {HTMLElement} */ (document.querySelector('[data-k4-phone-card]'));
put(phone, 'error');
phone.addEventListener('kp-card-retry', async () => {
    put(phone, 'loading');
    await wait(1500);
    put(phone, 'error');
});
for (const card of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('[data-k4-still]'))) {
    const kind = card.getAttribute('data-k4-still') ?? 'ready';
    put(card, kind === 'first' || kind === 'refresh' ? 'loading' : kind);
}

// ---------------------------------------------------------------- 3 checks
const system = /** @type {HTMLElement} */ (document.querySelector('[data-k4-system]'));
const checks = /** @type {HTMLElement} */ (document.querySelector('[data-k4-checks]'));
const summary = /** @type {HTMLElement} */ (document.querySelector('[data-k4-summary]'));
let gitPasses = false;
let reads = 0;
const writeSummary = () => {
    const c = countStatus(checks);
    const at = ['14:02', '14:05', '14:07', '14:09', '14:12'][Math.min(reads, 4)];
    summary.textContent = `${c.ok} of ${c.total} checks pass · read 16/10/2026 ${at}`;
};
document.querySelector('[data-k4-recheck]')?.addEventListener('click', async () => {
    setCardState(system, 'loading', { words: 'Checking…' });
    await wait(1500);
    gitPasses = !gitPasses;
    reads += 1;
    setStatus(
        checks,
        'git',
        gitPasses ? { state: 'ok', detail: 'in step · branch main' } : { state: 'failed', detail: '2 commits not pushed', fix: 'Pull and push from the repository; the dashboard never rebases.' },
    );
    writeSummary();
    setCardState(system, 'ready');
});

// ---------------------------------------------------------------- 4 tiles
const form = /** @type {HTMLFormElement} */ (document.querySelector('[data-k4-tiles-form]'));
const tilesReadout = /** @type {HTMLElement} */ (document.querySelector('[data-k4-tiles-readout]'));
const cvField = /** @type {HTMLElement} */ (document.querySelector('[data-k4-cv-field]'));
const cv = /** @type {HTMLElement} */ (document.querySelector('[data-k4-cv]'));
form.addEventListener('change', () => {
    const ticked = [...form.querySelectorAll('input[name="act"]:checked')].map((i) => i.closest('label')?.querySelector('.kp-field__option-title')?.textContent);
    const tone = form.querySelector('input[name="tone"]:checked')?.closest('label')?.querySelector('.kp-field__option-title')?.textContent;
    tilesReadout.textContent = `Ticked: ${ticked.length ? ticked.join(', ') : 'nothing'} · Tone: ${tone}`;
    if (form.querySelector('input[name="cv"]:checked')) {
        cv.removeAttribute('aria-invalid');
        cvField.querySelector('.kp-field__error')?.setAttribute('hidden', '');
    }
});
form.addEventListener('submit', (event) => event.preventDefault());
