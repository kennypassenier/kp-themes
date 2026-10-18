// research/almanac-delivery-chain: the page's own wiring. The components are the package's (js/auto.js attaches them); this file
// hands them Almanac's data and puts them in the state a button asks for. All outage data is sample data, times are relative to
// the moment the page was opened so the "now" line of the timeline and the "in 21 min" words stay true.

import { attachGantts, setGanttKinds, setGanttPoints, setGanttState, setGanttWindow, setGanttZones } from '../../js/gantt.js';
import { attachPipelines, setPipeline, setPipelineState } from '../../js/pipeline.js';
import { attachProblems, setProblems } from '../../js/problems.js';
import { attachRuns, setRuns, setRunsState } from '../../js/runs.js';

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});
await ready;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const NOW = Date.now();

const pad = (n) => String(n).padStart(2, '0');
/** dd/mm/yyyy HH:MM, 24 h, Europe/Brussels. @param {number} ms */
function moment(ms) {
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
            .map((part) => [part.type, part.value]),
    );
    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
}
const clock = (ms) => moment(ms).slice(11);

// A state a person pressed stays: across options, visits and theme changes.
const KEY = 'almanac-delivery-chain:';
const remembered = (name, fallback) => {
    try {
        return localStorage.getItem(KEY + name) || fallback;
    } catch {
        return fallback;
    }
};
const remember = (name, value) => {
    try {
        localStorage.setItem(KEY + name, value);
    } catch {
        /* storage off: the state just does not outlive the page */
    }
};
/** @param {string} attr @param {string} value */
function press(attr, value) {
    for (const button of document.querySelectorAll(`[${attr}]`)) button.setAttribute('aria-pressed', String(button.getAttribute(attr) === value));
}

// Almanac's real ladder (src/core/pacing.rs): the wait after a pass that delivered nothing. The last value repeats.
const LADDER = [15, 60, 300, 900, 1800];
const LAST_PASS = NOW - 9 * MINUTE;
// Passes of the outage: the fifth (index 4) was the last one, nine minutes ago.
const passes = [LAST_PASS];
for (let i = 3; i >= 0; i -= 1) passes.unshift(passes[0] - LADDER[i] * SECOND);
for (let i = 0; i < 4; i += 1) passes.push(passes[passes.length - 1] + LADDER[Math.min(passes.length - 1, LADDER.length - 1)] * SECOND);
const START = passes[0];
const FUTURE = passes.filter((t) => t > NOW);

const ENTRIES = [
    { id: 'ha', title: 'Wasmachine klaar', source: 'home-assistant', received: START - 2 * MINUTE },
    { id: 'hl', title: 'Nightly backup finished', source: 'homelab', received: START + 200 * SECOND },
    { id: 'cs', title: 'Session summary ready', source: 'claude-sessions', received: START + 1100 * SECOND },
    { id: 'ky', title: 'Deploy finished', source: 'kyu', received: START + 300 * SECOND, permanent: true },
].map((entry) => ({ ...entry, tried: passes.filter((t) => t <= NOW && t >= entry.received) }));


/* ------------------------------------------------------------------ 1 · delivery chain */

const chain = /** @type {HTMLElement} */ (document.getElementById('ad-chain'));
const chainSaid = /** @type {HTMLElement} */ (document.getElementById('ad-chain-said'));
attachPipelines(chain.parentElement ?? document);

const LANES = [
    { key: 'received', label: 'Received', tone: 1 },
    { key: 'journal', label: 'Journal', tone: 2 },
    { key: 'worker', label: 'Worker', tone: 3 },
    { key: 'google', label: 'Google Calendar', tone: 4 },
    { key: 'dead', label: 'Set aside · never retried', closed: true },
];

/** Real: the three events the live service delivered (titles are the fixtures'). */
const delivered = [
    { id: 'd1', lane: 'google', title: 'Wasmachine klaar', sub: 'home-assistant', meta: moment(NOW - 26 * HOUR), mark: 'HA' },
    { id: 'd2', lane: 'google', title: 'Nightly backup finished', sub: 'homelab', meta: moment(NOW - 9 * HOUR), mark: 'HL' },
    { id: 'd3', lane: 'google', title: 'Session summary ready', sub: 'claude-sessions', meta: moment(NOW - 95 * MINUTE), mark: 'CS' },
];
const MARKS = { 'home-assistant': 'HA', homelab: 'HL', 'claude-sessions': 'CS', kyu: 'KY' };
const waiting = (note) =>
    ENTRIES.map((entry, i) => ({
        id: `w${i}`,
        lane: 'journal',
        title: entry.title,
        sub: `${entry.source} · ${note(entry)}`,
        meta: `Received ${moment(entry.received)}`,
        mark: MARKS[entry.source],
    }));
const triedWords = (entry) => `${entry.permanent ? 'refused' : 'tried'} ${entry.tried.length} ${entry.tried.length === 1 ? 'time' : 'times'}`;

const CHAIN = {
    healthy: {
        lit: null,
        lanes: LANES,
        cards: delivered,
        said: 'Real data: the live service on 19/10/2026 has accepted 3 events, delivered 3, failed 0 and set 0 aside. The card titles are sample fixtures.',
    },
    google: {
        lit: 'google',
        lanes: LANES.map((l) => (l.key === 'google' ? { ...l, label: 'Google · refusing' } : l)),
        cards: [...delivered, ...waiting(triedWords)],
        said: 'Sample data: Google answers every call with a temporary quota refusal (HTTP 429). The four events wait in the journal and are tried again; the three delivered ones stay in Google Calendar.',
    },
    token: {
        lit: 'worker',
        lanes: LANES.map((l) => (l.key === 'worker' ? { ...l, label: 'Worker · no token' } : l)),
        cards: [...delivered, ...waiting((entry) => `no token for ${entry.tried.length} ${entry.tried.length === 1 ? 'try' : 'tries'}`)],
        said: 'Sample data: the worker cannot get a Google token (the token refresh fails), so no call to Google is even made. The events wait in the journal.',
    },
};

/** Lights the lane `key` (red), none when null. @param {string | null} key */
function light(key) {
    for (const lane of chain.querySelectorAll('[data-kp-lane]')) {
        const lit = lane.getAttribute('data-kp-lane') === key;
        lane.toggleAttribute('data-ad-lit', lit);
    }
}

let chainState = remembered('chain', 'healthy');
function showChain(name) {
    chainState = name;
    remember('chain', name);
    press('data-ad-chain', name);
    if (name === 'loading') {
        setPipelineState(chain, 'loading');
        chainSaid.textContent = 'Reading the journal and the worker.';
        return;
    }
    if (name === 'error') {
        setPipeline(chain, { lanes: LANES, cards: [] });
        light(null);
        setPipelineState(chain, 'error', 'The journal did not answer.');
        chainSaid.textContent = 'Sample state: Almanac could not read the journal, so no count is shown.';
        return;
    }
    const data = CHAIN[name];
    setPipeline(chain, { lanes: data.lanes, cards: data.cards });
    setPipelineState(chain, 'ready');
    light(data.lit);
    // The board draws its lanes after the state change; light them again once they stand.
    requestAnimationFrame(() => light(data.lit));
    chainSaid.textContent = data.said;
}
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-ad-chain]') : null;
    if (button) showChain(button.getAttribute('data-ad-chain') ?? 'healthy');
});
chain.addEventListener('kp-pipeline-retry', () => {
    setPipelineState(chain, 'loading');
    setTimeout(() => showChain('healthy'), 1200);
});
new MutationObserver(() => {
    if (CHAIN[chainState]) light(CHAIN[chainState].lit);
}).observe(chain, { childList: true, subtree: true });

/* ------------------------------------------------------------------ 2 · retry schedule */

const runsEl = /** @type {HTMLElement} */ (document.getElementById('ad-runs'));
const ganttEl = /** @type {HTMLElement} */ (document.getElementById('ad-gantt'));
const schedSaid = /** @type {HTMLElement} */ (document.getElementById('ad-sched-said'));
attachRuns(runsEl.parentElement ?? document);
attachGantts(ganttEl.parentElement ?? document);

const KINDS = [
    { kind: 'received', label: 'received', shape: 'square', tone: 'muted' },
    { kind: 'refused', label: 'tried, Google refused', shape: 'dot', tone: 'destructive' },
    { kind: 'next', label: 'next try', shape: 'ring', tone: 'info' },
    { kind: 'aside', label: 'third refusal: set aside', shape: 'triangle', tone: 'destructive' },
];

function ganttData() {
    const points = [];
    const lanes = [];
    for (const entry of ENTRIES) {
        const strikes = entry.tried.length;
        const left = 3 - strikes;
        lanes.push({
            id: entry.id,
            label: entry.title,
            sub: entry.permanent ? `${entry.source} · ${left} ${left === 1 ? 'try' : 'tries'} left` : `${entry.source} · no limit`,
        });
        points.push({ id: `${entry.id}-in`, lane: entry.id, at: entry.received, kind: 'received', label: `${entry.title}: received ${moment(entry.received)}` });
        entry.tried.forEach((t, i) =>
            points.push({
                id: `${entry.id}-t${i}`,
                lane: entry.id,
                at: t,
                kind: 'refused',
                label: `${entry.title}: try ${i + 1} refused`,
                detail: entry.permanent ? `Permanent refusal ${i + 1} of 3 (the calendar no longer exists).` : 'Temporary refusal; Almanac keeps trying.',
            }),
        );
        for (const [i, t] of FUTURE.entries()) {
            if (entry.permanent && i > left - 1) break;
            const last = entry.permanent && i === left - 1;
            points.push({
                id: `${entry.id}-n${i}`,
                lane: entry.id,
                at: t,
                kind: last ? 'aside' : 'next',
                label: last ? `${entry.title}: third refusal, set aside` : `${entry.title}: next try`,
                detail: `${moment(t)}${last ? '. After this Almanac stops trying and keeps the entry in the journal.' : ''}`,
                planned: true,
            });
        }
    }
    return { points, lanes };
}

function runsData() {
    const aside = ENTRIES.find((e) => e.permanent);
    const when = FUTURE.map((t) => ({ at: t }));
    if (aside) when[2 - aside.tried.length] = { at: FUTURE[2 - aside.tried.length], conflict: `Third refusal for the kyu entry "${aside.title}": it is set aside` };
    return when.slice(0, 4);
}

let schedState = remembered('sched', 'ready');
let schedShape = 'runs';
const SCHED_SAID = {
    ready: 'Sample data: Google has refused since %START%; four events wait. Times are counted from when you opened this page.',
    empty: 'Real data: the live service has nothing pending (journal pending 0).',
    loading: 'Reading the journal.',
    error: 'Sample state: the journal could not be read.',
};

function showSchedule() {
    press('data-ad-sched', schedState);
    runsEl.hidden = schedShape !== 'runs';
    ganttEl.hidden = schedShape !== 'gantt';
    schedSaid.textContent = SCHED_SAID[schedState].replace('%START%', moment(START));
    const apply = schedShape === 'runs' ? applyRuns : applyGantt;
    apply();
}
function applyRuns() {
    if (schedState === 'ready') setRuns(runsEl, runsData());
    else if (schedState === 'empty') setRuns(runsEl, [], { reason: 'Nothing is waiting. Every event Almanac accepted has reached its calendar.' });
    else if (schedState === 'loading') setRunsState(runsEl, 'loading');
    else setRunsState(runsEl, 'error', { title: 'Could not read the retry schedule', text: 'The journal did not answer.' });
}
function applyGantt() {
    if (schedState === 'loading') return setGanttState(ganttEl, 'loading');
    if (schedState === 'error') return setGanttState(ganttEl, 'error', 'Could not read the retry schedule: the journal did not answer.');
    setGanttKinds(ganttEl, KINDS);
    if (schedState === 'empty') {
        setGanttPoints(ganttEl, [], []);
        return setGanttState(ganttEl, 'empty', 'Nothing is waiting. Every event Almanac accepted has reached its calendar.');
    }
    const { points, lanes } = ganttData();
    setGanttZones(ganttEl, [{ from: START, to: NOW, label: `Google refusing since ${clock(START)}`, tone: 'warning' }]);
    setGanttPoints(ganttEl, points, lanes);
    setGanttState(ganttEl, 'ready');
    const end = FUTURE[FUTURE.length - 1] + 6 * MINUTE;
    setGanttWindow(ganttEl, { span: Math.ceil((end - (START - 6 * MINUTE)) / SECOND), live: false, to: end });
}
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-ad-sched]') : null;
    if (!button) return;
    schedState = button.getAttribute('data-ad-sched') ?? 'ready';
    remember('sched', schedState);
    showSchedule();
});
runsEl.addEventListener('kp-runs-retry', () => {
    setRunsState(runsEl, 'loading');
    setTimeout(() => {
        schedState = 'ready';
        remember('sched', 'ready');
        showSchedule();
    }, 1200);
});
document.addEventListener('review:choice', (event) => {
    const detail = /** @type {CustomEvent} */ (event).detail;
    if (detail?.id === 'schedule-shape') {
        schedShape = detail.value === 'gantt' ? 'gantt' : 'runs';
        showSchedule();
    }
    if (detail?.id === 'chain-share') {
        chain.setAttribute('data-kp-pipeline-share', detail.value === 'hide' ? 'false' : 'true');
        showChain(chainState);
    }
});

/* ------------------------------------------------------------------ 3 · set-aside entries */

const asideEl = /** @type {HTMLElement} */ (document.getElementById('ad-aside'));
const asideEmpty = /** @type {HTMLElement} */ (document.getElementById('ad-aside-empty'));
attachProblems(asideEl.parentElement ?? document);

const SET_ASIDE = [
    {
        key: 'ky',
        severity: 'critical',
        what: 'An event from kyu was set aside: "Deploy finished"',
        why: `Google refused it three times in a row, the last time on ${moment(NOW - 4 * MINUTE)}: Calendar API returned HTTP 404 (the calendar no longer exists).`,
        remedy: 'Check the request payload, event id and calendar id, then send the event again from the source.',
    },
    {
        key: 'hl',
        severity: 'critical',
        what: 'An event from homelab was set aside: "Weekly disk report"',
        why: `Google refused it three times in a row, the last time on ${moment(NOW - 2 * HOUR)}: Calendar API returned HTTP 400 (the start time is not a valid date).`,
        remedy: 'Check the request payload, event id and calendar id, then send the event again from the source.',
    },
];

let asideCount = remembered('aside', '1');
function showAside() {
    press('data-ad-aside', asideCount);
    const n = Number(asideCount);
    setProblems(asideEl, SET_ASIDE.slice(0, n));
    asideEl.hidden = n === 0;
    asideEmpty.hidden = n !== 0;
}
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-ad-aside]') : null;
    if (!button) return;
    asideCount = button.getAttribute('data-ad-aside') ?? '1';
    remember('aside', asideCount);
    showAside();
});

showChain(chainState);
showSchedule();
showAside();
