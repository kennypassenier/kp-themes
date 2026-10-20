// research/wishes-1120: the page's own wiring. Every component is the package's (attached by js/auto.js from its data-kp-* attributes, or built
// here where the page makes the markup); this file gives each its mock data and wires the controls of each section by its own elements.
// The clock is fixed (20/10/2026) so labels such as "Today" and the weeks of the heat grid are the same on every visit.

import { setCardState } from '../../js/card-state.js';
import { attachSteplists, buildSteplist, setStep } from '../../js/steplist.js';
import { resetTransfer, setTransfer } from '../../js/transfer.js';
import { setJobLine } from '../../js/job-line.js';
import { setSelection, setSelectionBusy, setSelectionProgress, setSelectionResult } from '../../js/selection-bar.js';
import { setDatedOptions, setDatedState } from '../../js/dated-options.js';
import { attachDataTables, dataTable } from '../../js/datatable.js';
import { setEntityGrid } from '../../js/entity-card.js';
import { setHeat } from '../../js/heat.js';
import { setChartData } from '../../js/chart.js';
import { appendLogLines, setLogViewer } from '../../js/logviewer.js';
import { setCodeFieldError } from '../../js/code-field.js';
import { setQuiet } from '../../js/quiet-hours.js';
import { setSnoozedUntil } from '../../js/snooze.js';
import { buildTypeConfirm } from '../../js/components.js';
import { registerShortcuts } from '../../js/shortcuts.js';
import { setContents } from '../../js/page-contents.js';
import { ackGate, setAckNotes } from '../../js/ack-gate.js';
import { showAlertAgain } from '../../js/overlays.js';
import { setToolbarActive } from '../../js/toolbar.js';

const $ = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.getElementById(id));

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = document.documentElement.hasAttribute('data-kp-auto-ready')
    ? Promise.resolve()
    : new Promise((resolve) => {
          new MutationObserver((_, watch) => {
              if (document.documentElement.hasAttribute('data-kp-auto-ready')) {
                  watch.disconnect();
                  resolve(undefined);
              }
          }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
      });

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the group's handler. */
/** @type {Record<string, (value: string, button: HTMLElement) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    if (!button) return;
    const name = button.dataset.pg ?? '';
    const handler = HANDLERS[name];
    if (!handler) return;
    for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', button);
});
/** @param {string} name @param {(value: string, button: HTMLElement) => void} handler */
const on = (name, handler) => {
    HANDLERS[name] = handler;
};

const NOW = Date.UTC(2026, 9, 20, 10, 0, 0); // 20/10/2026 12:00 in Brussels
const DAY = 86_400_000;

// ---------------------------------------------------------------- plain-card
on('frame', (value) => {
    const card = $('pg-plain');
    if (value === 'plain') card.setAttribute('data-kp-card', 'plain');
    else card.removeAttribute('data-kp-card');
});
on('state', (value) => {
    const card = $('pg-plain');
    if (value === 'loading') setCardState(card, 'loading', { words: 'Reading the backups…' });
    else if (value === 'empty') setCardState(card, 'empty', { title: 'No backups yet', text: 'The first nightly run will write one.' });
    else if (value === 'error') setCardState(card, 'error', { title: 'Could not read the backups', text: 'The host did not answer in time.' });
    else setCardState(card, 'ready');
});

// ---------------------------------------------------------------- job-line
const JOB_STEPS = [
    'Check the host',
    'Stop the stack',
    'Snapshot the volumes',
    'Copy media to the repository',
    'Copy the database',
    'Verify the copy',
    'Prune old snapshots',
    'Start the stack',
];
const GB = 1e9;
let jobList = /** @type {HTMLElement} */ ($('pg-job-steps'));
/** Draw the step list with the first `done` steps done and the next running (or none running). @param {number} done @param {boolean} running */
function drawSteps(done, running) {
    const rows = JOB_STEPS.map((title, i) => ({
        id: `s${i}`,
        title,
        note: i === 3 ? 'Streams the media volume' : '',
        state: /** @type {'done' | 'running' | 'pending'} */ (i < done ? 'done' : i === done && running ? 'running' : 'pending'),
    }));
    const next = buildSteplist(rows, { label: 'Backup progress' });
    next.id = 'pg-job-steps';
    jobList.replaceWith(next);
    jobList = next;
    attachSteplists(next.parentElement ?? document);
}
/** @param {{ done: number, total?: number, eta?: number }} bytes */
function drawBytes(bytes) {
    const row = $('pg-job-transfer');
    const at = Date.now();
    setTransfer(row, { name: 'media.tar.zst', done: Math.max(0, bytes.done - 0.2 * GB), ...(bytes.total ? { total: bytes.total } : {}), at: at - 5000 }, { now: () => at });
    setTransfer(row, { done: bytes.done, ...(bytes.total ? { total: bytes.total } : {}), at }, { now: () => at });
    setJobLine($('pg-job-line'), { done: bytes.done, total: bytes.total ?? null, etaSeconds: bytes.eta ?? null });
}
/** @type {number} */
let jobTimer = 0;
const stopJob = () => window.clearInterval(jobTimer);
on('job', (value) => {
    stopJob();
    const row = $('pg-job-transfer');
    resetTransfer(row);
    if (value === 'waiting') {
        drawSteps(0, false);
        setJobLine($('pg-job-line'), { done: null, total: null, etaSeconds: null });
    } else if (value === 'steps') {
        drawSteps(2, true);
        setJobLine($('pg-job-line'), { done: null, total: null, etaSeconds: null });
    } else if (value === 'both') {
        drawSteps(2, true);
        drawBytes({ done: 1.2 * GB, total: 4 * GB, eta: 120 });
    } else {
        drawSteps(2, true);
        drawBytes({ done: 1.2 * GB });
    }
});
on('job-run', (value) => {
    stopJob();
    if (value !== 'run') {
        // Stop cancels the run: the line goes back to waiting, as the job panel does after a cancel.
        resetTransfer($('pg-job-transfer'));
        drawSteps(0, false);
        setJobLine($('pg-job-line'), { done: null, total: null, etaSeconds: null });
        return;
    }
    let tick = 0;
    resetTransfer($('pg-job-transfer'));
    jobTimer = window.setInterval(() => {
        tick += 1;
        const done = Math.min(JOB_STEPS.length, Math.floor(tick / 3));
        drawSteps(done, done < JOB_STEPS.length);
        const bytes = Math.min(4 * GB, tick * 0.2 * GB);
        drawBytes({ done: bytes, total: 4 * GB, eta: Math.max(0, Math.round(((4 * GB - bytes) / (0.2 * GB)) * 0.5)) });
        if (done >= JOB_STEPS.length) stopJob();
    }, 500);
});

// ---------------------------------------------------------------- batch-progress
const STACKS = ['jellyfin', 'sonarr', 'radarr', 'traefik', 'grafana', 'vaultwarden', 'paperless'];
/** @type {number} */
let batchTimer = 0;
const batchBar = () => $('pg-batch');
on('batch', (value) => {
    window.clearInterval(batchTimer);
    const bar = batchBar();
    setSelection(bar, STACKS);
    if (value === 'running') {
        setSelectionBusy(bar, 'Updating stacks…');
        setSelectionProgress(bar, { done: 3, total: 7 });
    } else if (value === 'done') setSelectionResult(bar, { done: 7, refused: [] });
});
document.addEventListener('kp-selection-action', (event) => {
    if (!(event.target instanceof Element) || event.target.id !== 'pg-batch') return;
    const bar = batchBar();
    window.clearInterval(batchTimer);
    let done = 0;
    setSelectionBusy(bar, 'Updating stacks…');
    setSelectionProgress(bar, { done, total: 7 });
    batchTimer = window.setInterval(() => {
        done += 1;
        setSelectionProgress(bar, { done, total: 7 });
        if (done >= 7) {
            window.clearInterval(batchTimer);
            setSelectionBusy(bar, '');
            setSelectionResult(bar, { done: 7, refused: [] });
        }
    }, 700);
});

// ---------------------------------------------------------------- clipboard-clear
{
    const log = $('pg-secret-log');
    const clock = () => new Date().toLocaleTimeString('en-GB');
    $('pg-secret').addEventListener('kp-copy', () => (log.textContent = `Copied at ${clock()}. The clipboard is emptied again after the time you chose.`));
    $('pg-secret').addEventListener('kp-secret-clipboard', (event) => {
        const { cleared, reason } = /** @type {CustomEvent<{ cleared: boolean, reason: string }>} */ (event).detail;
        log.textContent = cleared
            ? `Clipboard cleared at ${clock()}${reason === 'unavailable' ? ' (this browser would not let the page read it first)' : ''}.`
            : 'Left alone: the clipboard no longer held the token.';
    });
    on('clear', (value) => {
        const field = $('pg-secret');
        if (value === '0') field.removeAttribute('data-kp-secret-clear');
        else field.setAttribute('data-kp-secret-clear', value);
        log.textContent = value === '0' ? 'Never emptied: the token stays on the clipboard.' : `Emptied ${value} s after a copy.`;
    });
}

// ---------------------------------------------------------------- countdown-days
on('days', (value) => {
    const el = $('pg-days');
    const length = value === 'day' ? 23 * 3600_000 + 59 * 60_000 : 6 * DAY + 22 * 3600_000;
    if (value === 'digits') el.setAttribute('data-kp-countdown-days', 'off');
    else el.removeAttribute('data-kp-countdown-days');
    el.setAttribute('data-kp-countdown-until', String(Date.now() + length));
});

// ---------------------------------------------------------------- dated-meta
const SNAPSHOTS_MIXED = [
    { value: 'latest', label: 'The files as they are now', meta: ['4.1 GB', '12,480 files'] },
    { value: 'a1', when: '2026-10-20T04:00:00+02:00', meta: ['4.1 GB', '12,401 files'] },
    { value: 'a2', when: '2026-10-19T04:00:00+02:00', meta: ['4.0 GB', '12,377 files'] },
    { value: 'a3', when: '2026-10-17T04:00:00+02:00', meta: ['3.9 GB', '12,100 files'] },
];
const SNAPSHOTS_DATED = SNAPSHOTS_MIXED.slice(1).map((o) => ({ value: o.value, when: o.when, meta: o.meta[0] }));
on('dated', (value) => setDatedOptions($('pg-dated'), value === 'mixed' ? SNAPSHOTS_MIXED : SNAPSHOTS_DATED, value === 'mixed' ? 'latest' : undefined));
on('dated-state', (value) => {
    if (value === 'empty') setDatedState($('pg-dated'), 'empty', { reason: 'No snapshots yet' });
    else if (value === 'loading') setDatedState($('pg-dated'), 'loading');
    else setDatedState($('pg-dated'), 'ready');
});

// ---------------------------------------------------------------- table-reorder
{
    const table = $('pg-rules');
    table.addEventListener('kp-datatable-reorder', (event) => {
        $('pg-rules-order').textContent = `Order: ${/** @type {CustomEvent<{ order: string[] }>} */ (event).detail.order.join(', ')}`;
    });
    on('reorder', (value) => {
        const handle = dataTable(table);
        if (value === 'sorted') handle?.sortBy([{ column: 1, direction: 'ascending' }]);
        else handle?.sort(null);
    });
}

// ---------------------------------------------------------------- tiles (tile-match, tile-keys)
const APPS = [
    ['jellyfin', 'Jellyfin', 'Movies, series and music for the house'],
    ['sonarr', 'Sonarr', 'Finds new episodes of the series you follow'],
    ['radarr', 'Radarr', 'Finds new movies on your list'],
    ['traefik', 'Traefik', 'Routes every hostname to its stack'],
    ['grafana', 'Grafana', 'Charts of the host and the stacks'],
    ['vaultwarden', 'Vaultwarden', 'Passwords for the whole house'],
    ['paperless', 'Paperless', 'Scanned letters, searchable'],
    ['syncthing', 'Syncthing', 'Keeps folders equal on two machines'],
];
/** @param {string} [match] */
const tiles = (match = '') =>
    APPS.filter(([, name]) => !match || name.toLowerCase().includes(match.toLowerCase())).map(([key, name, description]) => ({
        key,
        name,
        href: `#${key}`,
        description,
        state: { label: 'up', tone: /** @type {'success'} */ ('success') },
        lines: [`${name.length} containers healthy`],
        ...(match ? { match } : {}),
    }));
const drawMatch = (/** @type {string} */ q) => {
    const grid = $('pg-match-grid');
    const list = tiles(q);
    if (list.length) setEntityGrid(grid, list);
    else setEntityGrid(grid, [], { title: 'No app matches', message: 'Try fewer letters.', action: 'none' });
};
$('pg-match-q').addEventListener('input', (event) => drawMatch(/** @type {HTMLInputElement} */ (event.target).value));
on('match', (value) => {
    /** @type {HTMLInputElement} */ ($('pg-match-q')).value = value;
    drawMatch(value);
});
on('keys', (value) => $('pg-keys-board').setAttribute('data-kp-tiles-keys', value === 'letters' ? 'letters' : ''));
$('pg-keys-board').addEventListener('kp-tiles-move', (event) => {
    const detail = /** @type {CustomEvent<{ to: HTMLElement, key: string }>} */ (event).detail;
    const name = detail.to.querySelector('.kp-entity__name')?.textContent ?? '';
    $('pg-keys-log').textContent = `Moved to ${name.trim()} with ${detail.key === ' ' ? 'Space' : detail.key}.`;
});

// ---------------------------------------------------------------- heat-paging
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const HEAT_ROWS = ['media', 'sonarr', 'traefik', 'vaultwarden'];
const HISTORY_FROM = Date.UTC(2026, 8, 27);
/** @param {number} offset @returns {import('../../js/heat.js').HeatSpec} */
function heatSpec(offset) {
    const end = Date.UTC(2026, 9, 20) - offset * 7 * DAY;
    const days = Array.from({ length: 7 }, (_, i) => end - (6 - i) * DAY);
    const first = new Date(days[0]);
    const last = new Date(days[6]);
    const label = `${first.getUTCDate()} ${first.getUTCMonth() === last.getUTCMonth() ? '' : `${MONTHS[first.getUTCMonth()]} `}to ${last.getUTCDate()} ${MONTHS[last.getUTCMonth()]} ${last.getUTCFullYear()}`;
    return {
        every: 1,
        label: 'Backups per stack per night',
        columns: days.map((d) => ({ key: new Date(d).toISOString().slice(0, 10), label: String(new Date(d).getUTCDate()) })),
        rows: HEAT_ROWS.map((row, r) => ({
            key: row,
            label: row,
            cells: days.map((d, c) => {
                if (d < HISTORY_FROM) return { tone: /** @type {'before'} */ ('before'), label: 'before any history' };
                const bad = (new Date(d).getUTCDate() * 7 + r * 13 + c) % 11 === 0;
                return bad ? { tone: /** @type {'bad'} */ ('bad'), label: 'missed' } : { tone: /** @type {'ok'} */ ('ok'), label: 'backed up' };
            }),
        })),
        legend: [
            { tone: 'ok', label: 'backed up' },
            { tone: 'bad', label: 'missed' },
            { tone: 'before', label: 'before any history' },
        ],
        paging: { offset, label, max: 3 },
    };
}
{
    const heat = $('pg-heat');
    let state = 'ready';
    const draw = (offset = Number(heat.getAttribute('data-kp-heat-offset')) || 0) => {
        const spec = heatSpec(offset);
        if (state === 'loading') setHeat(heat, { ...spec, state: 'loading', skeleton: { rows: 4, columns: 7 } });
        else if (state === 'empty') setHeat(heat, { ...spec, state: 'empty', message: 'No backups this week', rows: [], columns: [] });
        else if (state === 'error') setHeat(heat, { ...spec, state: 'error', message: 'Could not read the backups' });
        else setHeat(heat, spec);
    };
    heat.addEventListener('kp-heat-page', (event) => {
        const detail = /** @type {CustomEvent<{ offset?: number, direction: string }>} */ (event).detail;
        draw(detail.direction === 'latest' ? 0 : (detail.offset ?? 0));
    });
    heat.addEventListener('kp-heat-retry', () => {
        state = 'ready';
        draw();
    });
    on('heat', (value) => {
        state = value;
        draw();
    });
    ready.then(() => draw(0));
}

// ---------------------------------------------------------------- charts
const T0 = Date.UTC(2026, 9, 20, 0, 0, 0);
/** Request counts per minute over six hours, with a spike and one event. */
const REQUESTS = Array.from({ length: 36 }, (_, i) => Math.round(420 + 60 * Math.sin(i / 3) + (i === 22 ? 340 : 0) + ((i * 37) % 23)));
/** @param {'s' | 'ms'} unit */
function secondsChart(unit) {
    const k = unit === 's' ? 1 : 1000;
    return {
        label: 'Requests per minute',
        timeUnit: unit,
        unit: 'req/min',
        series: [{ label: 'traefik', start: (T0 / 1000 + 6 * 3600) * k, step: 600 * k, values: REQUESTS }],
        events: [{ at: (T0 / 1000 + 6 * 3600 + 22 * 600) * k, label: 'Backup window opened', tone: /** @type {'info'} */ ('info') }],
    };
}
on('secs', (unit) => {
    const data = secondsChart(/** @type {'s' | 'ms'} */ (unit));
    setChartData($('pg-chart-s'), /** @type {any} */ (data));
    $('pg-chart-s-first').textContent = `First point handed over: start ${data.series[0].start} (${unit === 's' ? 'seconds' : 'milliseconds'}), step ${data.series[0].step}.`;
});
{
    let shape = 'columns';
    let levels = 'two';
    const draw = () =>
        setChartData($('pg-chart-c'), {
            label: 'Slow requests per hour',
            unitKind: 'count',
            threshold: levels === 'two' ? [60, 40] : 60,
            series: [
                {
                    label: 'over 500 ms',
                    shape: /** @type {'columns' | 'line'} */ (shape),
                    start: T0 + 6 * 3600_000,
                    step: 3600_000,
                    values: [12, 18, 22, 31, 44, 52, 47, 38, 29, 33, 41, 58, 66, 49, 35, 26, 21, 17, 15, 24, 36, 28, 19, 14],
                },
            ],
        });
    on('shape', (value) => {
        shape = value;
        draw();
    });
    on('levels', (value) => {
        levels = value;
        draw();
    });
    ready.then(draw);
}

// ---------------------------------------------------------------- logviewer
{
    const lines = [
        ['traefik', 'info', 'Configuration loaded from file: /etc/traefik/traefik.yml'],
        ['traefik', 'info', '12 routers, 14 services, 3 middlewares'],
        ['sonarr', 'warning', 'Indexer prowlarr returned 429, backing off for 60 s'],
        ['jellyfin', 'info', 'Library scan finished: 12,480 items in 41 s'],
        ['vaultwarden', 'info', 'Rocket has launched from http://0.0.0.0:80'],
        ['grafana', 'error', 'Failed to query Loki: dial tcp 192.168.1.50:3100: connect: connection refused'],
        ['traefik', 'info', 'Server configuration reloaded on :443'],
        ['sonarr', 'info', 'Series refresh: 38 series checked'],
    ].map(([source, level, message], i) => ({ id: `l${i}`, ts: NOW - (9 - i) * 41_000, source, level, message }));
    ready.then(() => appendLogLines($('pg-log'), lines));
    on('log', (value) => {
        const v = $('pg-log');
        if (value === 'host') setLogViewer(v, { state: 'error', errorTitle: 'Could not read the host log', message: 'Loki did not answer: connection refused (192.168.1.50:3100)' });
        else if (value === 'plain') setLogViewer(v, { state: 'error', errorTitle: '', message: '' });
        else setLogViewer(v, { state: 'ready' });
    });
    on('log-margin', (value) => $('pg-log').setAttribute('data-pg-margin', value === 'margin' ? 'on' : 'off'));
    ready.then(() => $('pg-log').setAttribute('data-pg-margin', 'on'));
}

// ---------------------------------------------------------------- yaml-field
{
    const area = /** @type {HTMLTextAreaElement} */ ($('pg-yaml'));
    const SAMPLES = {
        clean: 'services:\n  web:\n    image: nginx:1.27\n    ports:\n      - "8080:80"\n  db:\n    image: postgres:17\n',
        indent: 'services:\n  web:\n    image: nginx:1.27\n   ports:\n      - "8080:80"\n',
        tab: 'services:\n  web:\n\timage: nginx:1.27\n    ports:\n      - "8080:80"\n',
        server: 'services:\n  web:\n    image: nginx:1.27\n    image: nginx:1.28\n    ports:\n      - "8080:80"\n',
    };
    /** The mock check: tabs and odd indents. A real page puts its parser, or its server, here. @param {string} text */
    const mockCheck = (text) => {
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i += 1) {
            const tab = lines[i].indexOf('\t');
            if (tab >= 0 && /^\s*\t/.test(lines[i])) return { line: i + 1, column: tab + 1, message: 'tabs cannot be used for indentation' };
            const spaces = /^ */.exec(lines[i])?.[0].length ?? 0;
            if (spaces % 2 === 1) return { line: i + 1, column: spaces + 1, message: 'indent by two spaces here (mock rule of this page)' };
        }
        return null;
    };
    area.addEventListener('kp-code-field-check', (event) => {
        const detail = /** @type {CustomEvent<{ value: string, error: (l: number, c: number, m: string) => void }>} */ (event).detail;
        const problem = mockCheck(detail.value);
        if (problem) detail.error(problem.line, problem.column, problem.message);
    });
    /** @type {number} */
    let late = 0;
    on('yaml', (value) => {
        window.clearTimeout(late);
        area.value = SAMPLES[/** @type {keyof typeof SAMPLES} */ (value)] ?? SAMPLES.clean;
        area.dispatchEvent(new Event('input', { bubbles: true }));
        if (value === 'server') late = window.setTimeout(() => setCodeFieldError(area, 4, 5, 'duplicate key "image" (answered by the server a moment later)'), 900);
    });
    ready.then(() => {
        area.value = SAMPLES.clean;
        area.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

// ---------------------------------------------------------------- quiet-hours
{
    const quiet = $('pg-quiet');
    on('quiet', (value) => {
        if (value === 'off') setQuiet(quiet, { on: false });
        else if (value === 'same') setQuiet(quiet, { on: true, from: '22:00', to: '22:00' });
        else setQuiet(quiet, { on: true, from: '22:00', to: '07:00', days: [1, 2, 3, 4, 5], through: ['critical'] });
    });
    on('quiet-state', (value) => {
        quiet.removeAttribute('data-kp-state');
        quiet.removeAttribute('data-kp-disabled');
        if (value === 'loading') quiet.setAttribute('data-kp-state', 'loading');
        else if (value === 'disabled') quiet.setAttribute('data-kp-disabled', 'Only an admin can change the quiet hours.');
    });
    ready.then(() => setQuiet(quiet, { on: true, from: '22:00', to: '07:00', days: [1, 2, 3, 4, 5], through: ['critical'] }));
}

// ---------------------------------------------------------------- snooze-words
on('snooze', (value) => {
    const until = value === 'snoozed' ? '2026-10-21T09:00:00+02:00' : null;
    setSnoozedUntil($('pg-snooze-a'), until);
    setSnoozedUntil($('pg-snooze-b'), until);
});

// ---------------------------------------------------------------- confirm-id
{
    const host = $('pg-confirm-host');
    const draw = (/** @type {boolean} */ stable) => {
        host.replaceChildren();
        const { block, input } = buildTypeConfirm(document, {
            name: 'jellyfin',
            loses: ['3 containers', 'the media database'],
            ...(stable ? { id: 'act-confirm', fieldName: 'confirm' } : {}),
        });
        host.append(block);
        const label = block.querySelector('label');
        $('pg-confirm-ids').textContent = `Field id: ${input.id} · label for: ${label?.htmlFor} · name: ${input.name || '(none)'}`;
    };
    on('confirm', (value) => draw(value === 'stable'));
    draw(true);
}

// ---------------------------------------------------------------- space-key
{
    const list = $('pg-schedules');
    const form = $('pg-change');
    const SCHEDULES = [
        ['Nightly backup', true],
        ['Weekly prune', true],
        ['Certificate renewal', false],
        ['Update check', true],
    ];
    for (const [name, onNow] of SCHEDULES) {
        const li = document.createElement('li');
        li.tabIndex = 0;
        li.setAttribute('data-on', String(onNow));
        const words = document.createElement('span');
        words.textContent = String(name);
        const badge = document.createElement('span');
        badge.className = 'kp-badge';
        li.append(words, badge);
        list.append(li);
    }
    const paint = () => {
        for (const li of list.children) {
            const onNow = li.getAttribute('data-on') === 'true';
            const badge = li.querySelector('.kp-badge');
            if (badge) badge.textContent = onNow ? 'On' : 'Off';
        }
    };
    paint();
    registerShortcuts($('pg-keys-scope'), [
        {
            keys: 'Space',
            what: 'Turn the focused schedule on or off',
            group: 'Schedules',
            run: () => {
                const row = document.activeElement?.closest('#pg-schedules > li');
                if (!row) return false;
                row.setAttribute('data-on', String(row.getAttribute('data-on') !== 'true'));
                paint();
                return true;
            },
        },
        {
            keys: 'Escape',
            what: 'Close the change form, also while typing in it',
            group: 'Schedules',
            inFields: true,
            when: () => !form.hidden,
            run: () => {
                form.hidden = true;
                /** @type {HTMLElement | undefined} */ (list.firstElementChild)?.focus();
            },
        },
    ]);
    on('space-form', (value) => {
        form.hidden = value !== 'open';
        if (value === 'open') /** @type {HTMLInputElement} */ ($('pg-change-at')).focus();
    });
}

// ---------------------------------------------------------------- page-contents
{
    const nav = $('pg-contents');
    on('contents', (value) => {
        if (value === 'items') {
            setContents(nav, [
                { id: 'working-copy', label: 'Working copy', count: 2 },
                { id: 'sign-in', label: 'Sign-in', count: 3 },
                { id: 'passkeys', label: 'Passkeys', level: 1 },
                { id: 'machine-tokens', label: 'Machine tokens', level: 1, count: 4 },
                { id: 'this-browser', label: 'This browser' },
                { id: 'notifications', label: 'Notifications', count: 6 },
                { id: 'host-toml', label: 'host.toml', count: 31 },
            ]);
        } else setContents(nav, null);
    });
    on('contents-state', (value) => {
        if (value === 'loading') nav.setAttribute('data-kp-state', 'loading');
        else nav.removeAttribute('data-kp-state');
    });
}

// ---------------------------------------------------------------- notes-gate
const NOTES = `## What is new in 12.1

- Faster library scans (**about 3x** on spinning disks)
- A new *playback report* under Dashboard
  - exports to CSV
  - filters by user
- The \`ffmpeg\` bundle is now 7.1

> Back up the database before you update.

### Breaking changes

1. The plugin API v3 is removed.
2. \`JELLYFIN_CACHE_DIR\` is read once, at start.

\`\`\`
jellyfin --version
\`\`\`

Full notes: [the release page](https://example.com/jellyfin/12.1) and the [upgrade guide](/docs/upgrade).`;
const HOSTILE = `## Notes from a stranger

<script>alert('this must stay text')</script>

<img src=x onerror="alert(1)"> is also only text.

- [click me](javascript:alert(1)) is only the words
- [a fine link](https://example.com/fine) opens in a new tab
- ![tracker](https://tracker.example/pixel.png) is its alt text

**Bold** and *italic* still work.`;
on('gate', (value) => {
    const gate = $('pg-gate');
    const handle = ackGate(gate);
    if (value === 'loading') handle?.setState('loading');
    else if (value === 'error') handle?.setState('error');
    else {
        handle?.setState('ready');
        setAckNotes(gate, value === 'none' ? null : value === 'hostile' ? HOSTILE : NOTES);
    }
});
ready.then(() => setAckNotes($('pg-gate'), NOTES));

// ---------------------------------------------------------------- alert-remember
on('alert', (value) => {
    const alert = $('pg-alert');
    if (value === 'close') /** @type {HTMLElement | null} */ (alert.querySelector('.kp-alert__close'))?.click();
    else showAlertAgain(alert);
});

// ---------------------------------------------------------------- decorate-hook
{
    /** @param {HTMLElement} part @param {{ kind: string }} info */
    const decorate = (part, info) => part.setAttribute('data-pg-driven', info.kind);
    on('marks', (value) => $('pg-decorate').setAttribute('data-pg-marks', value));
    $('pg-decorate').setAttribute('data-pg-marks', 'on');
    ready.then(() => {
        setToolbarActive($('pg-toolbar'), [{ id: 'status', label: 'Status: running' }, { id: 'host', label: 'Host: pve' }], { decorate });
        $('pg-dt-host').innerHTML = `<div class="kp-datatable" data-kp-datatable data-kp-filter-mode="add">
            <div class="kp-datatable__bar"><input class="kp-datatable__search" type="search" data-kp-datatable-search aria-label="Search the table" placeholder="Search…" /></div>
            <div class="kp-table-wrap"><table class="kp-table"><caption>Containers</caption>
            <thead><tr><th scope="col" data-kp-sort="text">Name</th><th scope="col" data-kp-filter="choice">Status</th><th scope="col" data-kp-filter="choice">Host</th></tr></thead>
            <tbody><tr data-kp-row-key="a"><td>jellyfin</td><td>running</td><td>pve</td></tr><tr data-kp-row-key="b"><td>sonarr</td><td>running</td><td>pve</td></tr><tr data-kp-row-key="c"><td>traefik</td><td>stopped</td><td>nas</td></tr></tbody></table></div></div>`;
        const table = /** @type {HTMLElement} */ ($('pg-dt-host').firstElementChild);
        attachDataTables(table.parentElement ?? document, { decorate });
        dataTable(table)?.filter(1, ['running']);
        const grid = $('pg-heat-mark');
        const days = Array.from({ length: 5 }, (_, i) => ({ key: `d${i}`, label: String(16 + i) }));
        setHeat(
            grid,
            {
                every: 1,
                toggle: true,
                label: 'Last five nights',
                columns: days,
                rows: ['media', 'sonarr'].map((row) => ({ key: row, label: row, cells: days.map((_, c) => ({ tone: c === 3 && row === 'sonarr' ? 'bad' : 'ok', label: c === 3 && row === 'sonarr' ? 'missed' : 'backed up' })) })),
                paging: { offset: 0, label: '16 to 20 October 2026' },
            },
            { decorate },
        );
    });
}

// ---------------------------------------------------------------- first draw
ready.then(() => {
    drawMatch('');
    setEntityGrid($('pg-keys-grid'), tiles());
    HANDLERS.frame?.('plain', document.body);
    HANDLERS.job?.('waiting', document.body);
    HANDLERS.batch?.('selected', document.body);
    HANDLERS.dated?.('mixed', document.body);
    HANDLERS.days?.('week', document.body);
    HANDLERS.secs?.('s', document.body);
});
