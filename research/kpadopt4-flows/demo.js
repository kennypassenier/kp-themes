// research/kpadopt4-flows: the page's own data and the buttons that drive a state. Every component is the package's;
// this file only hands them sample data (a job search, a homelab's schedules, a service's secrets) on a fixed clock,
// 16/10/2026 12:00 in Brussels, so the review reads the same every day.

import { attachPatterns, revealSecret, hideSecret } from '../../js/patterns.js';
import { openConfirmation } from '../../js/components.js';
import { attachDataTables, dataTable } from '../../js/datatable.js';
import { attachPipelines, setPipeline, setPipelineState, setPipelineSelected } from '../../js/pipeline.js';
import { attachGantts, setGanttPoints, setGanttKinds, setGanttZones, setGanttState } from '../../js/gantt.js';
import { attachArt } from '../../js/art.js';

const NOW = Date.UTC(2026, 9, 16, 10, 0);
const now = () => NOW;
const DAY = 86_400_000;
/** A day `n` days from today, as the ISO date a page would hand over. @param {number} n */
const day = (n) => new Date(NOW + n * DAY).toISOString().slice(0, 10);
const main = /** @type {HTMLElement} */ (document.querySelector('main'));

// ── 2 · The dialogs held open in the page ────────────────────────────────────────────────────────────────────────────
// The manage dialog: a copy of the page's own modal, its ids made its own, laid open in the stage.
{
    const modal = /** @type {HTMLDialogElement} */ (document.getElementById('fd-manage'));
    const copy = /** @type {HTMLDialogElement} */ (modal.cloneNode(true));
    copy.id = 'fd-manage-held';
    for (const el of copy.querySelectorAll('[id]')) el.id = `${el.id}-held`;
    copy.setAttribute('aria-labelledby', 'fd-manage-title-held');
    copy.setAttribute('open', '');
    for (const close of copy.querySelectorAll('[data-kp-dialog-close]')) close.removeAttribute('data-kp-dialog-close');
    document.querySelector('[data-fd-stage="manage"]')?.append(copy);
}
// The three confirmations, made by the package's own openConfirmation() for a button that is not in the page (so no
// focus moves), copied before they close: the package's markup, held open.
for (const [stage, attrs] of /** @type {const} */ ([
    [
        'blocked',
        {
            'data-kp-confirm': 'Delete the calendar Household?',
            'data-kp-confirm-dependents': 'kyu-runner; Home Assistant',
            'data-kp-confirm-blocked': 'Delete those two sources first, on the Sources page.',
        },
    ],
    ['dependents', { 'data-kp-confirm': 'Delete the calendar Work and everything on it?', 'data-kp-confirm-dependents': 'Outlook import' }],
    ['type', { 'data-kp-confirm': 'Delete the calendar Holidays and everything on it?', 'data-kp-confirm-type': 'Holidays' }],
])) {
    const button = document.createElement('button');
    for (const [k, v] of Object.entries(attrs)) button.setAttribute(k, v);
    const dialog = openConfirmation(button);
    const held = /** @type {HTMLDialogElement} */ (dialog.cloneNode(true));
    dialog.close('');
    held.removeAttribute('data-kp-confirm-dialog');
    for (const el of held.querySelectorAll('[id]')) el.id = `${el.id}-held-${stage}`;
    held.setAttribute('aria-labelledby', `${held.getAttribute('aria-labelledby')}-held-${stage}`);
    held.removeAttribute('aria-describedby');
    held.setAttribute('open', '');
    for (const label of held.querySelectorAll('label[for]')) label.setAttribute('for', `${label.getAttribute('for')}-held-${stage}`);
    document.querySelector(`[data-fd-stage="${stage}"]`)?.append(held);
}
for (const button of document.querySelectorAll('[data-fd-delete]')) {
    button.addEventListener('click', () => {
        const log = document.querySelector('[data-fd-delete-log]');
        if (log) log.textContent = `The page would delete the calendar ${/** @type {HTMLElement} */ (button).dataset.fdDelete} now.`;
    });
}

// ── 1 · The secret field ────────────────────────────────────────────────────────────────────────────────────────────
const SECRETS = {
    token: 'hl_live_7Hq2v9XcLm4TzR8sWb3N',
    client: 'kyu_cs_Qe81mZt5RwV0aLp3',
    root: 'correct-horse-battery-staple',
    recovery: 'K7QF-2M9X-PL4D-8VZA',
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJncmFmYW5hLXJlYWRlciIsImV4cCI6MTc5MjE3MTcxMH0.4Qn8x0mH3sVb2LwE7pRtY9kZcJ1fUaGd',
};
document.addEventListener('kp-secret-request', (event) => {
    const field = /** @type {HTMLElement} */ (event.target);
    const kind = field.dataset.fdSecret;
    if (!kind) return;
    const { respond, fail } = /** @type {CustomEvent} */ (event).detail;
    event.preventDefault();
    if (kind === 'never') return;
    window.setTimeout(() => {
        if (kind === 'fail') fail(new Error('the vault is sealed until it is unlocked on the host'));
        else respond(SECRETS[/** @type {keyof typeof SECRETS} */ (kind)] ?? '');
    }, 700);
});
document.addEventListener('kp-secret', (event) => {
    const log = document.querySelector('[data-fd-secret-log]');
    const { shown, reason } = /** @type {CustomEvent} */ (event).detail;
    if (log) log.textContent = `${/** @type {HTMLElement} */ (event.target).getAttribute('aria-label')}: ${shown ? 'shown' : 'hidden'} (${reason}).`;
});
attachPatterns(main);
const showStates = () => {
    for (const field of document.querySelectorAll('[data-kp-secret]')) {
        hideSecret(field);
        if (field.hasAttribute('data-fd-show')) revealSecret(field);
    }
};
showStates();
document.querySelector('[data-fd-secrets-again]')?.addEventListener('click', showStates);

// ── 3 · The page's own sort ─────────────────────────────────────────────────────────────────────────────────────────
const SCHEDULES = [
    {
        on: 'On',
        what: 'Back up the photos',
        when: 'Every night at 02:00',
        next: NOW + 14 * 3600e3,
        last: NOW - 10 * 3600e3,
        note: 'To the NAS and the cloud copy',
    },
    {
        on: 'On',
        what: 'Update the images',
        when: 'Sundays at 04:00',
        next: NOW + 3 * DAY - 6 * 3600e3,
        last: NOW - 4 * DAY,
        note: 'Media stack only',
    },
    { on: 'Off', what: 'Prune the old logs', when: 'Every hour', next: NOW + 40 * 60e3, last: NOW - 20 * 60e3, note: '' },
    {
        on: 'On',
        what: 'Renew the certificates',
        when: 'On the 1st at 03:00',
        next: NOW + 16 * DAY,
        last: NOW - 15 * DAY,
        note: 'Wildcard and the mail host',
    },
    {
        on: 'On',
        what: 'Check the disks',
        when: 'Saturdays at 05:30',
        next: NOW + 2 * DAY - 4 * 3600e3,
        last: NOW - 5 * DAY,
        note: 'SMART long test on the pool',
    },
    {
        on: 'On',
        what: 'Restart Jellyfin',
        when: 'Every night at 05:00',
        next: NOW + 17 * 3600e3,
        last: NOW - 7 * 3600e3,
        note: 'Frees the transcoder',
    },
    {
        on: 'Off',
        what: 'Mirror the Git repositories',
        when: 'Every 6 hours',
        next: NOW + 2 * 3600e3,
        last: NOW - 4 * 3600e3,
        note: 'Paused while the mirror moves',
    },
];
/** dd/mm/yyyy HH:MM in Brussels (rule 52). @param {number} ms */
const stamp = (ms) => {
    const p = Object.fromEntries(
        new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Brussels',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        })
            .formatToParts(ms)
            .map((x) => [x.type, x.value]),
    );
    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
};
const FIELDS = /** @type {const} */ (['on', 'what', 'when', 'next', 'last', 'note']);
const NAMES = ['On', 'What', 'When', 'Next run', 'Last run', 'Note'];
/** @param {HTMLElement} wrap */
const renderSchedules = (wrap) => {
    const handle = dataTable(wrap);
    const sorts = handle?.view().sorts ?? [{ column: 3, direction: 'ascending' }];
    const rows = [...SCHEDULES].sort((a, b) => {
        for (const { column, direction } of sorts) {
            const field = FIELDS[column] ?? 'next';
            const x = a[field];
            const y = b[field];
            const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'en');
            if (c !== 0) return direction === 'descending' ? -c : c;
        }
        return 0;
    });
    const body = /** @type {HTMLTableSectionElement} */ (wrap.querySelector('tbody'));
    body.replaceChildren(
        ...rows.map((r) => {
            const tr = document.createElement('tr');
            tr.dataset.kpRowKey = r.what;
            for (const [at, field] of FIELDS.entries()) {
                const td = document.createElement('td');
                td.dataset.label = NAMES[at] ?? '';
                const value = r[field];
                td.textContent = typeof value === 'number' ? stamp(value) : value || '—';
                if (typeof value === 'number') {
                    td.className = 'kp-timestamp';
                    td.dataset.kpSortValue = String(value);
                }
                tr.append(td);
            }
            return tr;
        }),
    );
    handle?.refresh();
    const log = wrap.querySelector('[data-fd-sort-log]');
    if (log)
        log.textContent = sorts.length
            ? `The page sorted by ${sorts.map((k) => `${NAMES[k.column]}, ${k.direction}`).join(', then ')}.`
            : 'The page shows its own order.';
};
const schedules = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-fd-schedules]')]);
for (const wrap of schedules) {
    wrap.setAttribute('data-kp-datatable', '');
    renderSchedules(wrap);
}
attachDataTables(main);
for (const wrap of schedules) {
    renderSchedules(wrap);
    wrap.addEventListener('kp-datatable-sort', () => renderSchedules(wrap));
}
document.querySelector('[data-fd-reload]')?.addEventListener('click', (event) => {
    const wrap = /** @type {HTMLElement} */ (/** @type {HTMLElement} */ (event.currentTarget).closest('[data-fd-schedules]'));
    const handle = dataTable(wrap);
    if (!handle) return;
    handle.busy({ text: 'Reading the schedules', overlay: true });
    handle.state('loading');
    window.setTimeout(() => {
        handle.state('ready');
        renderSchedules(wrap);
    }, 1500);
});

// ── 4 · The pipeline ───────────────────────────────────────────────────────────────────────────────────────────────
const LANES = [
    { key: 'draft', label: 'Draft', tone: /** @type {const} */ (1) },
    { key: 'sent', label: 'Sent', tone: /** @type {const} */ (2) },
    { key: 'interview', label: 'Interview', tone: /** @type {const} */ (3) },
    { key: 'offer', label: 'Offer', tone: /** @type {const} */ (4) },
    { key: 'closed', label: 'Closed · no status', closed: true },
];
const APPS = [
    { id: 'granite', lane: 'draft', title: 'Design systems engineer', sub: 'Granite Labs', meta: 'started 14/10/2026', mark: 'GL', reply: true },
    { id: 'juniper', lane: 'draft', title: 'Frontend developer', sub: 'Juniper Retail', meta: 'started 15/10/2026', mark: 'JR', reply: true },
    { id: 'acme', lane: 'sent', title: 'Senior UI engineer', sub: 'Acme Analytics', meta: 'applied 03/10/2026', mark: 'AA', reply: true },
    { id: 'evergreen', lane: 'sent', title: 'Accessibility specialist', sub: 'Evergreen Bank', meta: 'applied 29/09/2026', mark: 'EB', reply: false },
    {
        id: 'harbour',
        lane: 'sent',
        title: 'Lead frontend developer for the citizen services portal and its design system',
        sub: 'Harbour City Council',
        meta: 'applied 06/10/2026',
        mark: 'HC',
        reply: true,
    },
    { id: 'ironbark', lane: 'sent', title: 'Web developer', sub: 'Ironbark Software', meta: 'applied 08/10/2026', mark: 'IS', reply: false },
    { id: 'kestrel', lane: 'sent', title: 'UI developer', sub: 'Kestrel Energy', meta: 'applied 11/10/2026', mark: 'KE', reply: false },
    {
        id: 'northwind',
        lane: 'interview',
        title: 'Frontend developer',
        sub: 'Northwind Logistics',
        meta: 'interview 14/10/2026',
        mark: 'NL',
        reply: true,
    },
    {
        id: 'corvid',
        lane: 'interview',
        title: 'Senior frontend engineer',
        sub: 'Corvid Systems',
        meta: 'interview 20/10/2026',
        mark: 'CS',
        reply: true,
    },
    { id: 'delta', lane: 'closed', title: 'Frontend developer', sub: 'Delta Freight · rejected', meta: '30/09/2026', mark: 'DF', reply: true },
    { id: 'foxglove', lane: 'closed', title: 'UX engineer', sub: 'Foxglove Studio · withdrawn', meta: '24/09/2026', mark: 'FS', reply: true },
    { id: 'brightline', lane: 'closed', title: 'React developer', sub: 'Brightline Health · no status record', meta: '—', mark: 'BH', reply: false },
];
let dimmed = false;
const cards = () => APPS.map(({ reply, ...card }) => ({ ...card, href: `#pipeline`, dimmed: dimmed && !reply }));
const boards = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-fd-pipeline]')]);
for (const b of boards) b.setAttribute('data-kp-pipeline', '');
attachPipelines(main);
for (const b of boards) {
    const kind = b.dataset.fdPipeline;
    if (kind === 'loading') {
        setPipeline(b, { lanes: LANES.slice(0, 4), cards: [] });
        setPipelineState(b, 'loading');
    } else if (kind === 'empty') {
        setPipeline(b, { lanes: LANES.slice(0, 4), cards: [] });
        setPipelineState(b, 'empty', 'No applications yet. They appear here once you start one.');
    } else if (kind === 'error') {
        setPipeline(b, { lanes: LANES.slice(0, 4), cards: [] });
        setPipelineState(b, 'error', 'the database did not answer in 10 s');
    } else setPipeline(b, { lanes: LANES, cards: cards() });
}
const filled = /** @type {HTMLElement} */ (document.querySelector('[data-fd-pipeline="filled"]'));
setPipelineSelected(filled, 'corvid');
filled.addEventListener('kp-pipeline-open', (event) => {
    event.preventDefault();
    const { card, source } = /** @type {CustomEvent} */ (event).detail;
    const log = document.querySelector('[data-fd-pipeline-log]');
    if (log) log.textContent = `Opened ${card.sub}, ${card.title} (${source}).`;
    setPipelineSelected(filled, card.id);
});
filled.addEventListener('click', (event) => {
    // The sample links lead nowhere: the page stays where it is.
    if (event.target instanceof Element && event.target.closest('a.kp-pipeline__card')) event.preventDefault();
});
document.querySelector('[data-fd-pipeline-dim]')?.addEventListener('click', (event) => {
    dimmed = !dimmed;
    /** @type {HTMLElement} */ (event.currentTarget).setAttribute('aria-pressed', String(dimmed));
    for (const b of boards) if (['filled', 'phone'].includes(b.dataset.fdPipeline ?? '')) setPipeline(b, { cards: cards() });
});
document.querySelector('[data-fd-pipeline-open]')?.addEventListener('click', () => setPipelineSelected(filled, 'acme'));
let tries = 0;
const failing = /** @type {HTMLElement} */ (document.querySelector('[data-fd-pipeline="error"]'));
failing.addEventListener('kp-pipeline-retry', () => {
    tries += 1;
    setPipelineState(failing, 'loading');
    const log = document.querySelector('[data-fd-retry-log]');
    if (log) log.textContent = `Tried again ${tries} ${tries === 1 ? 'time' : 'times'}.`;
    window.setTimeout(() => setPipelineState(failing, 'error', 'the database did not answer in 10 s'), 1200);
});

// ── 5 and 6 · Moments on the timeline ───────────────────────────────────────────────────────────────────────────────
const KINDS = [
    { kind: 'applied', label: 'applied', shape: /** @type {const} */ ('dot'), series: /** @type {const} */ (2) },
    { kind: 'mail', label: 'mail', shape: /** @type {const} */ ('square'), series: /** @type {const} */ (1) },
    { kind: 'contact', label: 'contact', shape: /** @type {const} */ ('diamond'), series: /** @type {const} */ (3) },
    { kind: 'interview', label: 'interview', shape: /** @type {const} */ ('triangle'), series: /** @type {const} */ (4) },
    { kind: 'follow', label: 'follow-up', shape: /** @type {const} */ ('ring'), tone: /** @type {const} */ ('info') },
];
/** @typedef {{ id: string, role: string, company: string, events: [string, number, string][], wait?: number }} Story */
/** @type {Story[]} */
const STORIES = [
    { id: 'juniper', role: 'Frontend developer', company: 'Juniper Retail', events: [['applied', -1, 'Applied']] },
    {
        id: 'granite',
        role: 'Design systems engineer',
        company: 'Granite Labs',
        events: [
            ['applied', -2, 'Applied'],
            ['follow', 5, 'Planned follow-up'],
        ],
    },
    {
        id: 'kestrel',
        role: 'UI developer',
        company: 'Kestrel Energy',
        events: [
            ['applied', -5, 'Applied'],
            ['mail', -3, 'Mail from the recruiter: received'],
        ],
    },
    {
        id: 'northwind',
        role: 'Frontend developer',
        company: 'Northwind Logistics',
        events: [
            ['applied', -14, 'Applied'],
            ['mail', -11, 'Mail: invitation to a call'],
            ['contact', -9, 'Call with the recruiter'],
            ['interview', -2, 'Interview at the office'],
            ['follow', 5, 'Planned follow-up'],
        ],
    },
    { id: 'ironbark', role: 'Web developer', company: 'Ironbark Software', events: [['applied', -8, 'Applied']], wait: -8 },
    {
        id: 'harbour',
        role: 'Lead frontend developer for the citizen services portal',
        company: 'Harbour City Council',
        events: [
            ['applied', -10, 'Applied'],
            ['mail', -3, 'Mail: questions about the portfolio'],
            ['contact', -3, 'Call back about the portfolio'],
        ],
    },
    {
        id: 'acme',
        role: 'Senior UI engineer',
        company: 'Acme Analytics',
        events: [
            ['applied', -13, 'Applied'],
            ['mail', -7, 'Mail: received, in review'],
            ['contact', -7, 'Short call with the hiring manager'],
        ],
        wait: -7,
    },
    { id: 'evergreen', role: 'Accessibility specialist', company: 'Evergreen Bank', events: [['applied', -17, 'Applied']], wait: -17 },
    {
        id: 'corvid',
        role: 'Senior frontend engineer',
        company: 'Corvid Systems',
        events: [
            ['applied', -20, 'Applied'],
            ['contact', -12, 'Call with the team lead'],
            ['interview', 4, 'Interview, second round'],
        ],
    },
    {
        id: 'foxglove',
        role: 'UX engineer',
        company: 'Foxglove Studio',
        events: [
            ['applied', -30, 'Applied'],
            ['mail', -22, 'Mail: withdrawn by you'],
        ],
    },
    {
        id: 'delta',
        role: 'Frontend developer',
        company: 'Delta Freight',
        events: [
            ['applied', -34, 'Applied'],
            ['contact', -24, 'Screening call'],
            ['mail', -16, 'Mail: rejected'],
        ],
    },
    {
        id: 'brightline',
        role: 'React developer',
        company: 'Brightline Health',
        events: [
            ['applied', -42, 'Applied'],
            ['follow', -28, 'Follow-up sent'],
        ],
    },
];
/** @param {Story[]} stories */
const lanesOf = (stories) => stories.map((s) => ({ id: s.id, label: s.role, sub: s.company, href: '#contact' }));
/** @param {Story[]} stories */
const pointsOf = (stories) =>
    stories.flatMap((s) =>
        s.events.map(([kind, at, label], i) => ({
            id: `${s.id}-${i}`,
            lane: s.id,
            at: day(at),
            kind,
            label: `${s.company}: ${label}`,
            planned: at > 0,
        })),
    );
/** @param {Story[]} stories */
const waitsOf = (stories) =>
    stories
        .filter((s) => s.wait !== undefined)
        .map((s) => ({ lane: s.id, from: day(/** @type {number} */ (s.wait)), to: NOW, label: 'waiting for an answer, follow-up overdue' }));
const HOLIDAY = { from: day(3), to: day(10), label: 'recruiters away (autumn holiday)', tone: /** @type {const} */ ('muted') };

const timelines = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-fd-contact], [data-fd-line]')]);
for (const t of timelines) t.setAttribute('data-kp-gantt', '');
for (const t of timelines) {
    const words =
        t.dataset.fdLine === 'empty'
            ? { ganttEmpty: 'No dates yet: they come with the status record.' }
            : { ganttEmpty: 'No contacts yet: each application draws its own lane once it has a date.' };
    attachGantts(/** @type {HTMLElement} */ (t.parentElement), { now, strings: words });
}
for (const t of timelines) {
    const kind = t.dataset.fdContact ?? t.dataset.fdLine;
    setGanttKinds(t, KINDS);
    if (t.dataset.fdContact === 'filled' || kind === 'phone') {
        const stories = t.dataset.fdLine ? STORIES.filter((s) => s.id === 'northwind') : STORIES;
        setGanttZones(t, [
            ...(t.dataset.fdLine ? [{ lane: 'northwind', from: day(-2), to: NOW, label: 'waiting since the interview' }] : waitsOf(stories)),
            ...(t.dataset.fdLine ? [] : [HOLIDAY]),
        ]);
        setGanttPoints(t, pointsOf(stories), lanesOf(stories));
    } else if (kind === 'one') {
        const stories = STORIES.filter((s) => s.id === 'acme');
        setGanttZones(t, waitsOf(stories));
        setGanttPoints(t, pointsOf(stories), lanesOf(stories));
    } else if (kind === 'progress') {
        const stories = STORIES.filter((s) => s.id === 'northwind');
        setGanttZones(t, [{ lane: 'northwind', from: day(-2), to: NOW, label: 'waiting since the interview' }]);
        setGanttPoints(t, pointsOf(stories), lanesOf(stories));
    } else if (kind === 'closed') {
        const stories = STORIES.filter((s) => s.id === 'delta');
        setGanttPoints(t, pointsOf(stories), lanesOf(stories));
    } else if (kind === 'loading') setGanttState(t, 'loading');
    else if (kind === 'empty') setGanttState(t, 'empty');
    else if (kind === 'error') setGanttState(t, 'error', 'Could not read the applications: the mail server did not answer.');
}
document.querySelector('[data-fd-contact="filled"]')?.addEventListener('kp-gantt-open', (event) => {
    const { points, source } = /** @type {CustomEvent} */ (event).detail;
    const log = document.querySelector('[data-fd-contact-log]');
    if (log && points) log.textContent = `Opened ${points.map((/** @type {{ label: string }} */ p) => p.label).join(' and ')} (${source}).`;
});

// ── 7 · The drawings ───────────────────────────────────────────────────────────────────────────────────────────────
attachArt(main);
document.querySelector('[data-fd-art-again]')?.addEventListener('click', () => {
    for (const host of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-fd-art] [data-kp-art]')])) {
        const kind = host.dataset.kpArt ?? 'none';
        host.dataset.kpArt = '';
        window.requestAnimationFrame(() => (host.dataset.kpArt = kind));
    }
});
