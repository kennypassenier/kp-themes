// research/kpadopt4 (flows sections, round 2: the journey and the contact timeline, each beside the component it was
// asked whether it repeats): the page's own data. Every component is the package's; this file only hands them sample
// data (a job search, a homelab's runs) on a fixed clock, 16/10/2026 12:00 in Brussels, so the review reads the same
// every day. The sections Kenny approved in round 1 left the page; their wiring is in _previous/ and in git at c1e907a8.

import { attachGantts, setGanttPoints, setGanttKinds, setGanttZones, setGanttState, setGanttRuns } from '../../js/gantt.js';

const NOW = Date.UTC(2026, 9, 16, 10, 0);
const now = () => NOW;
const DAY = 86_400_000;
/** A day `n` days from today, as the ISO date a page would hand over. @param {number} n */
const day = (n) => new Date(NOW + n * DAY).toISOString().slice(0, 10);

// ── The plain run timeline, for the comparison: runs, not moments ─────────────────────────────────────────────────────
{
    const el = /** @type {HTMLElement | null} */ (document.querySelector('[data-fd-runs]'));
    if (el) {
        const MIN = 60_000;
        /** @type {import('../../js/gantt.js').GanttRun[]} */
        const runs = [];
        /** @param {string} id @param {string} lane @param {string} label @param {number} agoMin @param {number} lengthMin @param {import('../../js/gantt.js').GanttRunState} state */
        const run = (id, lane, label, agoMin, lengthMin, state) => {
            const start = NOW - agoMin * MIN;
            runs.push({ id, lane, label, start, end: state === 'running' || state === 'queued' ? null : start + lengthMin * MIN, state });
        };
        run('b1', 'backup', 'Backup photos', 340, 12, 'ok');
        run('b2', 'backup', 'Backup databases', 180, 4, 'failed');
        run('b3', 'backup', 'Backup photos', 135, 11, 'ok');
        run('b4', 'backup', 'Backup documents', 7, 0, 'running');
        run('u1', 'update', 'Update images', 290, 9, 'ok');
        run('u3', 'update', 'Update images', 80, 2, 'failed');
        run('u4', 'update', 'Update images', 2, 0, 'queued');
        run('p1', 'prune', 'Prune snapshots', 310, 3, 'ok');
        run('p2', 'prune', 'Prune snapshots', 110, 4, 'ok');
        for (let k = 0; k < 6; k += 1) run(`r${k}`, 'report', 'Mail the report', 330 - k * 60, 1.5, k === 3 ? 'failed' : 'ok');
        el.setAttribute('data-kp-gantt', '');
        attachGantts(/** @type {HTMLElement} */ (el.parentElement), { now });
        setGanttRuns(el, runs, [
            { id: 'backup', label: 'Backups' },
            { id: 'update', label: 'Updates' },
            { id: 'prune', label: 'Prune' },
            { id: 'report', label: 'Reports' },
        ]);
    }
}

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
