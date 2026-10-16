// The demo's wiring: sample data, the buttons that drive the timeline and the readouts.
// The components are the package's own (js/week.js, js/gantt.js); everything named kt* here is mock.
import { attachWeeks, setWeekEvents, setWeekLegend, setWeekStart, setWeekState, WEEK_OPEN_EVENT, WEEK_RANGE_EVENT } from '../../js/week.js';
import {
    attachGantts,
    setGanttRuns,
    setGanttSelection,
    setGanttState,
    setGanttWindow,
    GANTT_OPEN_EVENT,
    GANTT_SELECT_EVENT,
    GANTT_WINDOW_EVENT,
} from '../../js/gantt.js';
import { attachHoverCards } from '../../js/hovercard.js';
import { openMenu } from '../../js/menu-button.js';
import { dayKey, shiftDay } from '../../js/calendar.js';
import { zonedTime } from '../../js/chart.js';

const ZONE = 'Europe/Brussels';
/** @param {string} id @returns {HTMLElement} */
const byId = (id) => /** @type {HTMLElement} */ (document.getElementById(id));
const stamp = () => new Date().toLocaleTimeString('en-GB', { hour12: false });
/** @param {HTMLElement} log @param {string} line */
const say = (log, line) => {
    const lines = (log.textContent ?? '').split('\n').filter(Boolean);
    lines.push(`${stamp()}  ${line}`);
    log.textContent = lines.slice(-5).join('\n');
};

/* ------------------------------------------------------------ week data */

/** @param {string} iso @param {number} hh @param {number} mm */
const at = (iso, hh, mm) => zonedTime(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)), Number(iso.slice(8, 10)), hh, mm, ZONE) ?? 0;

/**
 * The weekly pattern of a household server for the seven days from `start`.
 * @param {string} start
 * @returns {import('../../js/week.js').WeekEvent[]}
 */
function plan(start) {
    /** @type {import('../../js/week.js').WeekEvent[]} */
    const out = [];
    for (let i = 0; i < 7; i += 1) {
        const iso = shiftDay(start, i);
        const dow = new Date(`${iso}T12:00:00Z`).getUTCDay();
        out.push({
            id: `backup-${iso}`,
            start: at(iso, 2, 0),
            label: 'Backup photos',
            series: 1,
            detail: 'Nightly. Keeps 14 copies, about 12 minutes.',
        });
        out.push({ id: `prune-${iso}`, start: at(iso, 3, 15), label: 'Prune old snapshots', series: 3, detail: 'Nightly. Frees about 2 GB.' });
        out.push({
            id: `host-${iso}`,
            start: at(iso, 3, 30),
            label: "Host's own round",
            state: 'reference',
            detail: "The host's own nightly round (backups, updates), for reference.",
        });
        if (dow === 0 || dow === 3)
            out.push({
                id: `update-${iso}`,
                start: at(iso, 4, 0),
                label: 'Update images',
                series: 2,
                detail: 'Sundays and Wednesdays. Restarts three services.',
            });
        if (dow === 1)
            out.push({
                id: `certs-${iso}`,
                start: at(iso, 6, 0),
                label: 'Check certificates',
                series: 4,
                detail: 'Mondays. Warns 21 days before expiry.',
            });
        if (dow >= 1 && dow <= 5)
            out.push({
                id: `report-${iso}`,
                start: at(iso, 7, 30),
                label: 'Mail the report',
                series: 5,
                ...(i === 2
                    ? { state: /** @type {const} */ ('skipped'), detail: 'Skipped once: you are away.' }
                    : { detail: 'Weekdays. A summary of the night.' }),
            });
        out.push({
            id: `export-${iso}`,
            start: at(iso, 22, 0),
            label: 'Export snapshots',
            series: 2,
            state: 'off',
            detail: 'Off. Its slots are kept; nothing runs until you turn it on.',
        });
    }
    // The next run is the first one still to come that is on and is not the host's.
    const now = Date.now();
    const next = out.filter((e) => !e.state && Number(e.start) > now).sort((a, b) => Number(a.start) - Number(b.start))[0];
    if (next) next.state = 'next';
    return out;
}

/** Fourteen items on one day, between 01:00 and 04:30. @param {string} iso @param {number} count */
function crowd(iso, count) {
    const names = [
        'Rotate web logs',
        'Backup databases',
        'Backup photos',
        'Backup documents',
        'Verify backups',
        'Prune old snapshots',
        'Scrub the pool',
        'Refresh the index',
        'Compact the mail store',
        'Sync the music library',
        'Check disk health',
        'Renew the certificate',
        'Clean the cache',
        'Update the blocklist',
        'Rebuild thumbnails',
    ];
    return Array.from({ length: count }, (_, i) => ({
        id: `crowd-${i}`,
        start: at(iso, 1 + Math.floor((i * 15) / 60), (i * 15) % 60),
        label: names[i % names.length] ?? 'Job',
        series: /** @type {1 | 2 | 3 | 4 | 5} */ ((i % 5) + 1),
        detail: `Night job ${i + 1} of ${count}.`,
    }));
}

const today = () => dayKey(Date.now(), ZONE);
const LEGEND = [
    { series: /** @type {const} */ (1), label: 'Backups' },
    { series: /** @type {const} */ (2), label: 'Updates' },
    { series: /** @type {const} */ (3), label: 'Housekeeping' },
    { series: /** @type {const} */ (4), label: 'Checks' },
    { series: /** @type {const} */ (5), label: 'Reports' },
];

// Attach before auto.js does, so the demo's own options are the ones that count.
attachWeeks(document);
const hover = attachHoverCards(document);

const weekWide = byId('kt-week-wide');
const weekPhone = byId('kt-week-phone');
const weekLog = byId('kt-week-log');
let start = today();
for (const el of [weekWide, weekPhone]) {
    setWeekEvents(el, plan(start));
    setWeekLegend(el, LEGEND);
}
weekWide.addEventListener(WEEK_OPEN_EVENT, (e) =>
    say(weekLog, `opened: ${/** @type {CustomEvent} */ (e).detail.event.label} (${/** @type {CustomEvent} */ (e).detail.source})`),
);
weekPhone.addEventListener(WEEK_OPEN_EVENT, (e) => say(weekLog, `phone opened: ${/** @type {CustomEvent} */ (e).detail.event.label}`));
weekWide.addEventListener(WEEK_RANGE_EVENT, (e) => {
    start = /** @type {CustomEvent} */ (e).detail.start;
    say(weekLog, `range moved to ${start}; the page gives the items for it`);
    setWeekEvents(weekWide, plan(start));
    setWeekStart(weekPhone, start);
    setWeekEvents(weekPhone, plan(start));
});

/* ----------------------------------------------------------- crowded day */

const crowdWide = byId('kt-crowd-wide');
const crowdPhone = byId('kt-crowd-phone');
const crowdLog = byId('kt-crowd-log');
let crowded = 14;
const feedCrowd = () => {
    const day = shiftDay(today(), 3);
    const events = [...plan(today()).filter((e) => !e.id.includes(day)), ...crowd(day, crowded)];
    for (const el of [crowdWide, crowdPhone]) setWeekEvents(el, events);
};
feedCrowd();
crowdWide.addEventListener(WEEK_OPEN_EVENT, (e) => say(crowdLog, `opened: ${/** @type {CustomEvent} */ (e).detail.event.label}`));
byId('kt-crowd-add').addEventListener('click', () => {
    crowded = Math.min(15, crowded + 1);
    feedCrowd();
});
byId('kt-crowd-remove').addEventListener('click', () => {
    crowded = Math.max(0, crowded - 1);
    feedCrowd();
});
const moreWrapper = () => /** @type {HTMLElement | null} */ (crowdWide.querySelector('.kp-week__more:not([hidden])'));
const showMore = () => {
    const wrapper = moreWrapper();
    if (wrapper) openMenu(wrapper, { focus: 'none' });
};
byId('kt-more-open').addEventListener('click', () => {
    const wrapper = moreWrapper();
    if (wrapper) openMenu(wrapper, { focus: 'first' });
});
// The opened state, shown once the menu module has filled the menu.
window.setTimeout(showMore, 700);

/* ------------------------------------------------------------ week states */

const stateLoading = byId('kt-state-loading');
const stateEmpty = byId('kt-state-empty');
const stateError = byId('kt-state-error');
const stateFocus = byId('kt-state-focus');
setWeekState(stateLoading, 'loading');
setWeekEvents(stateEmpty, []);
setWeekState(stateError, 'error', 'The schedules could not be read: the host did not answer.');
setWeekEvents(stateFocus, plan(today()));
window.setTimeout(() => {
    const first = /** @type {HTMLElement | null} */ (stateFocus.querySelector('.kp-week__pill[tabindex="0"]'));
    first?.focus({ preventScroll: true, focusVisible: true });
}, 400);
byId('kt-states-cycle').addEventListener('click', () => {
    setWeekState(weekWide, 'loading');
    window.setTimeout(() => setWeekEvents(weekWide, plan(start)), 2000);
});

/* ------------------------------------------------------------- the timeline */

let origin = Date.now();
let virtual = origin;
let speed = 1;
const clock = () => virtual + (Date.now() - origin) * speed;
const MIN = 60_000;

/** @type {import('../../js/gantt.js').GanttLane[]} */
const LANES = [
    { id: 'backup', label: 'Backups' },
    { id: 'update', label: 'Updates' },
    { id: 'prune', label: 'Prune' },
    { id: 'report', label: 'Reports' },
    { id: 'certs', label: 'Certificates' },
];

/** @type {import('../../js/gantt.js').GanttRun[]} */
let runs = [];
let seq = 100;
/** @param {string} id @param {string} lane @param {string} label @param {number} agoMin @param {number} lengthMin @param {import('../../js/gantt.js').GanttRunState} state @param {string} [detail] */
const run = (id, lane, label, agoMin, lengthMin, state, detail) => {
    const startMs = Date.now() - agoMin * MIN;
    runs.push({
        id,
        lane,
        label,
        start: startMs,
        end: state === 'running' || state === 'queued' ? null : startMs + lengthMin * MIN,
        state,
        ...(detail ? { detail } : {}),
    });
};
run('b1', 'backup', 'Backup photos', 340, 12, 'ok', 'Nightly photos, 4.1 GB.');
run('b2', 'backup', 'Backup databases', 180, 4, 'failed', 'The dump stopped: no space left on the target.');
run('b3', 'backup', 'Backup photos', 135, 11, 'ok', 'Nightly photos, 4.0 GB.');
run('b4', 'backup', 'Backup documents', 7, 0, 'running', 'Started by the schedule.');
run('u1', 'update', 'Update images', 290, 9, 'ok');
run('u2', 'update', 'Update dashboard', 285, 5, 'ok', 'Runs beside the images update.');
run('u3', 'update', 'Update images', 80, 2, 'failed', 'The registry did not answer.');
run('u4', 'update', 'Update images', 2, 0, 'queued', 'Waits for the backup to finish.');
run('p1', 'prune', 'Prune snapshots', 310, 3, 'ok');
run('p2', 'prune', 'Prune snapshots', 110, 4, 'ok');
run('p3', 'prune', 'Prune snapshots', 1, 0, 'running');
for (let k = 0; k < 6; k += 1)
    run(
        `r${k}`,
        'report',
        'Mail the report',
        330 - k * 60,
        1.5,
        k === 3 ? 'failed' : 'ok',
        k === 3 ? 'The mail server refused the message.' : 'A summary of the last hour.',
    );
run('c1', 'certs', 'Check certificates', 355, 0.7, 'ok');
run('c2', 'certs', 'Check certificates', 1415, 0.7, 'ok');
// Older days, for the 24 h and 7 d ranges.
for (let d = 1; d <= 6; d += 1) {
    run(`bd${d}`, 'backup', 'Backup photos', d * 1440 - 380, 12, d === 4 ? 'failed' : 'ok');
    run(`pd${d}`, 'prune', 'Prune snapshots', d * 1440 - 320, 3, 'ok');
    if (d % 3 === 0) run(`ud${d}`, 'update', 'Update images', d * 1440 - 300, 9, 'ok');
}

const ganttWide = byId('kt-gantt-wide');
const ganttPhone = byId('kt-gantt-phone');
const ganttLog = byId('kt-gantt-log');
attachGantts(document, { now: clock });
const feed = () => {
    for (const el of [ganttWide, ganttPhone]) setGanttRuns(el, runs, LANES);
};
setGanttState(ganttWide, 'loading');
setGanttState(ganttPhone, 'loading');
window.setTimeout(feed, 900);
for (const el of [ganttWide, ganttPhone]) {
    el.addEventListener(GANTT_OPEN_EVENT, (e) =>
        say(ganttLog, `opened: ${/** @type {CustomEvent} */ (e).detail.run.label} (${/** @type {CustomEvent} */ (e).detail.source})`),
    );
    el.addEventListener(GANTT_SELECT_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        say(
            ganttLog,
            d.from === null
                ? 'selection lifted'
                : `selected ${new Date(d.from).toLocaleTimeString('en-GB')} to ${new Date(d.to).toLocaleTimeString('en-GB')} (${d.source})`,
        );
    });
    el.addEventListener(GANTT_WINDOW_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        say(ganttLog, `window: ${Math.round(d.span / 60)} min, ${d.live ? 'live' : 'held'}`);
    });
}

const LABELS = ['Backup documents', 'Update images', 'Prune snapshots', 'Mail the report', 'Check certificates'];
let rotate = 0;
const nowMs = () => Math.round(clock());
byId('kt-run-start').addEventListener('click', () => {
    const k = rotate % LANES.length;
    rotate += 1;
    seq += 1;
    runs = [
        ...runs,
        {
            id: `n${seq}`,
            lane: LANES[k]?.id ?? 'backup',
            label: LABELS[k] ?? 'Job',
            start: nowMs(),
            end: null,
            state: 'running',
            detail: 'Started from this page.',
        },
    ];
    feed();
});
/** @param {'ok' | 'failed'} to */
const finishOldest = (to) => {
    const oldest = runs.filter((r) => r.state === 'running').sort((a, b) => Number(a.start) - Number(b.start))[0];
    if (!oldest) return;
    runs = runs.map((r) => (r === oldest ? { ...r, state: to, end: nowMs(), detail: to === 'failed' ? 'Stopped by the demo.' : r.detail } : r));
    feed();
};
byId('kt-run-finish').addEventListener('click', () => finishOldest('ok'));
byId('kt-run-fail').addEventListener('click', () => finishOldest('failed'));
byId('kt-run-queue').addEventListener('click', () => {
    seq += 1;
    runs = [
        ...runs,
        { id: `n${seq}`, lane: 'update', label: 'Update images', start: nowMs(), end: null, state: 'queued', detail: 'Waits for a free slot.' },
    ];
    feed();
});
byId('kt-run-promote').addEventListener('click', () => {
    const queued = runs.find((r) => r.state === 'queued');
    if (!queued) return;
    runs = runs.map((r) => (r === queued ? { ...r, state: 'running', start: nowMs() } : r));
    feed();
});
const fast = byId('kt-run-fast');
fast.addEventListener('click', () => {
    virtual = clock();
    origin = Date.now();
    speed = speed === 1 ? 60 : 1;
    fast.setAttribute('aria-pressed', String(speed !== 1));
    fast.textContent = speed === 1 ? 'Fast time (x60)' : 'Real time (x1)';
});

/* ------------------------------------------------------- timeline states */

const gLoading = byId('kt-gstate-loading');
const gEmpty = byId('kt-gstate-empty');
const gError = byId('kt-gstate-error');
const gHeld = byId('kt-gstate-held');
setGanttState(gLoading, 'loading');
setGanttState(gEmpty, 'empty');
setGanttState(gError, 'error', 'The history could not be read: the host did not answer.');
const held = Date.now() - 2 * 3_600_000;
setGanttRuns(
    gHeld,
    runs.filter((r) => Number(r.start) < held + 10 * MIN),
    LANES,
);
setGanttWindow(gHeld, { span: 6 * 3600, live: false, to: held });
setGanttSelection(gHeld, { from: held - 3 * 3_600_000, to: held - 2 * 3_600_000 });
byId('kt-hover-open').addEventListener('click', () => {
    const bar = /** @type {HTMLElement | null} */ (gHeld.querySelector('.kp-gantt__run[data-kp-state="failed"]:not([hidden])'));
    if (bar) {
        bar.scrollIntoView({ block: 'center' });
        hover.open(bar);
    }
});
