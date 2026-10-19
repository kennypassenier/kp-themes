// research/state-plates-1019: the page's own wiring. The components and their states are the package's (js/auto.js attaches them);
// this file gives each one sample data and wires the state buttons by the section's own elements, so a part page that holds one
// section alone still works.
import { setGraphData, setGraphState, GRAPH_RETRY_EVENT } from '../../js/graph.js';
import { setHeat, setMatrix, HEAT_RETRY_EVENT, MATRIX_RETRY_EVENT } from '../../js/heat.js';
import { USES_RETRY_EVENT } from '../../js/uses-map.js';
import { setGanttRuns, setGanttState, GANTT_RETRY_EVENT } from '../../js/gantt.js';
import { setWeekEvents, setWeekState, WEEK_RETRY_EVENT } from '../../js/week.js';
import { setUptime } from '../../js/uptime.js';
import { setCardState, CARD_RETRY_EVENT } from '../../js/card-state.js';
import { dataTable, RETRY_EVENT as TABLE_RETRY_EVENT } from '../../js/datatable.js';

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

/** How long the "read it again" after a Retry takes, in ms. */
const READ_MS = 1400;
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const NOW = Date.now();

const $ = (/** @type {string} */ sel, /** @type {ParentNode} */ root = document) => /** @type {HTMLElement | null} */ (root.querySelector(sel));

/**
 * A section's state buttons: `data-sp-set="<key>"` with `data-sp-value`. `apply(key, value)` draws; the pressed one follows.
 * @param {string} id the section's id
 * @param {(key: string, value: string) => void} apply
 * @returns {(key: string, value: string) => void} a way to set a state from the page (a Retry)
 */
function wire(id, apply) {
    const section = document.getElementById(id);
    if (!section) return () => {};
    const set = (/** @type {string} */ key, /** @type {string} */ value) => {
        for (const b of section.querySelectorAll(`[data-sp-set="${key}"]`))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-sp-value') === value));
        apply(key, value);
    };
    section.addEventListener('click', (event) => {
        const b = event.target instanceof Element ? event.target.closest('[data-sp-set]') : null;
        if (b && section.contains(b)) set(b.getAttribute('data-sp-set') ?? '', b.getAttribute('data-sp-value') ?? '');
    });
    return set;
}

/** A Retry: loading for a moment, then ready, with the buttons following. @param {(key: string, value: string) => void} set */
function retryWith(set) {
    return () => {
        set('state', 'loading');
        setTimeout(() => set('state', 'ready'), READ_MS);
    };
}

// ---- 1 · the network graph ---------------------------------------------------------------------------
{
    const el = $('[data-kp-graph]', document.getElementById('graph-states') ?? document);
    if (el) {
        const kinds = [
            { kind: 'proxy', label: 'Proxies', hint: 'Traffic goes through it', style: /** @type {const} */ ('solid'), colour: 'var(--chart-1)' },
            { kind: 'reads', label: 'Reads from', hint: 'Reads data', style: /** @type {const} */ ('dash'), colour: 'var(--chart-2)' },
            { kind: 'alerts', label: 'Alerts', hint: 'Sends alerts to', style: /** @type {const} */ ('dot'), colour: 'var(--chart-3)' },
        ];
        const nodes = [
            ['traefik', 'Traefik', 'The edge: every hostname enters here.'],
            ['jellyfin', 'Jellyfin', 'Streams the media library.'],
            ['grafana', 'Grafana', 'Draws the metrics.'],
            ['prometheus', 'Prometheus', 'Collects the metrics.'],
            ['loki', 'Loki', 'Keeps the logs.'],
            ['kuma', 'Uptime Kuma', 'Watches every service.'],
            ['vault', 'Vaultwarden', 'Keeps the passwords.'],
        ].map(([id, label, description]) => ({ id, label, description }));
        const edges = [
            ['traefik', 'jellyfin', 'proxy'],
            ['traefik', 'grafana', 'proxy'],
            ['traefik', 'vault', 'proxy'],
            ['traefik', 'kuma', 'proxy'],
            ['grafana', 'prometheus', 'reads'],
            ['grafana', 'loki', 'reads'],
            ['kuma', 'traefik', 'alerts'],
            ['prometheus', 'kuma', 'alerts'],
        ].map(([from, to, kind]) => ({ from, to, kind }));
        const set = wire('graph-states', (_, value) => {
            if (value === 'ready') setGraphData(el, { nodes, edges, kinds });
            else if (value === 'loading') setGraphState(el, 'loading');
            else if (value === 'empty')
                setGraphState(el, 'empty', 'No network to show yet', { text: 'When a service talks to another one, the link shows here.' });
            else setGraphState(el, 'error', 'The network could not be read', { text: 'The host did not answer. Nothing was changed.' });
        });
        el.addEventListener(GRAPH_RETRY_EVENT, retryWith(set));
        set('state', 'ready');
    }
}

// ---- 2 · the data table ---------------------------------------------------------------------------------
{
    const section = document.getElementById('table-states');
    const wrap = section ? $('[data-kp-datatable]', section) : null;
    const dt = wrap ? dataTable(wrap) : null;
    if (wrap && dt) {
        const tbody = /** @type {HTMLTableSectionElement} */ (wrap.querySelector('tbody'));
        const rows = [...tbody.rows];
        const search = /** @type {HTMLInputElement} */ (wrap.querySelector('[data-kp-datatable-search]'));
        const put = (/** @type {HTMLTableRowElement[]} */ list) => {
            tbody.replaceChildren(...list);
            dt.refresh();
        };
        const set = wire('table-states', (_, value) => {
            dt.state('ready');
            if (value === 'norows') {
                dt.query('');
                search.value = '';
                put([]);
                return;
            }
            if (tbody.rows.length === 0) put(rows);
            if (value === 'nomatch') {
                search.value = 'zzz';
                dt.query('zzz');
            } else {
                search.value = '';
                dt.query('');
            }
            if (value === 'loading') dt.state('loading');
            if (value === 'error') dt.fail('The rows could not be loaded: the host did not answer.');
        });
        wrap.addEventListener(TABLE_RETRY_EVENT, () => {
            set('state', 'loading');
            setTimeout(() => set('state', 'rows'), READ_MS);
        });
        // Clearing the search from the notice goes back to the rows.
        wrap.addEventListener('input', () => {
            if (search.value === '')
                for (const b of section?.querySelectorAll('[data-sp-set="state"]') ?? [])
                    b.setAttribute('aria-pressed', String(b.getAttribute('data-sp-value') === 'rows'));
        });
    }
}

// ---- 3 · the heat grid ----------------------------------------------------------------------------------
{
    const el = $('[data-kp-heat]', document.getElementById('heat-states') ?? document);
    if (el) {
        const columns = Array.from({ length: 12 }, (_, h) => ({ key: String(h * 2), label: String(h * 2).padStart(2, '0') }));
        const tones = /** @type {const} */ (['ok', 'ok', 'ok', 'warn', 'ok', 'bad', 'ok']);
        const rows = ['Jellyfin', 'Traefik', 'Grafana', 'Loki'].map((label, r) => ({
            key: label,
            label,
            cells: columns.map((c, i) => ({ tone: tones[(r * 5 + i * 3) % tones.length], label: `${label} from ${c.label}:00` })),
        }));
        const set = wire('heat-states', (_, value) => {
            if (value === 'ready') setHeat(el, { columns, rows, label: 'Answers per hour' });
            else if (value === 'loading') setHeat(el, { state: 'loading', skeleton: { rows: 4, columns: 12 } });
            else if (value === 'empty')
                setHeat(el, {
                    state: 'empty',
                    message: 'No answers recorded yet',
                    text: 'The first hour shows here once a service has answered.',
                    art: '▦',
                });
            else
                setHeat(el, {
                    state: 'error',
                    message: 'The answers could not be read',
                    text: 'The metrics host did not answer. Nothing was changed.',
                    art: '▦',
                });
        });
        el.addEventListener(HEAT_RETRY_EVENT, retryWith(set));
        set('state', 'ready');
    }
}

// ---- 4 · the matrix, grid and lines ---------------------------------------------------------------------
{
    const el = $('[data-kp-matrix]', document.getElementById('matrix-states') ?? document);
    if (el) {
        const rows = ['Traefik', 'Prometheus', 'Loki', 'Vaultwarden', 'Uptime Kuma'].map((label) => ({ key: label, label }));
        const columns = ['Jellyfin', 'Grafana', 'Almanac', 'kyu hub'].map((label) => ({ key: label, label }));
        const uses = new Set([
            'Traefik|Jellyfin',
            'Traefik|Grafana',
            'Traefik|Almanac',
            'Prometheus|Grafana',
            'Loki|Grafana',
            'Uptime Kuma|kyu hub',
            'Vaultwarden|Almanac',
        ]);
        /** @type {{ state: string, view: string }} */
        const now = { state: 'ready', view: 'lines' };
        const draw = () => {
            /** @type {import('../../js/heat.js').MatrixSpec} */
            const spec = { view: /** @type {'lines' | 'grid'} */ (now.view), label: 'Which service uses which' };
            if (now.state === 'ready')
                Object.assign(spec, {
                    rows,
                    columns,
                    corner: 'from ↓ to →',
                    cell: (/** @type {string} */ r, /** @type {string} */ c) =>
                        uses.has(`${r}|${c}`) ? { tone: 'ok', text: 'uses', label: `${r} is used by ${c}` } : null,
                });
            else if (now.state === 'loading') Object.assign(spec, { state: 'loading', skeleton: 4 });
            else if (now.state === 'empty')
                Object.assign(spec, {
                    state: 'empty',
                    message: 'Nothing uses anything yet',
                    text: 'When one service uses another one, the pair shows here.',
                    art: '◫',
                });
            else
                Object.assign(spec, {
                    state: 'error',
                    message: 'The map could not be read',
                    text: 'The host did not answer. Nothing was changed.',
                    art: '◫',
                });
            setMatrix(el, spec);
        };
        const set = wire('matrix-states', (key, value) => {
            now[/** @type {'state' | 'view'} */ (key)] = value;
            draw();
        });
        const retry = retryWith(set);
        el.addEventListener(MATRIX_RETRY_EVENT, retry);
        el.addEventListener(USES_RETRY_EVENT, retry);
        draw();
    }
}

// ---- 5 · the run timeline -------------------------------------------------------------------------------
{
    const el = $('[data-kp-gantt]', document.getElementById('gantt-states') ?? document);
    if (el) {
        const lanes = [
            { id: 'backup', label: 'Backups', sub: 'every night 03:00' },
            { id: 'update', label: 'Updates', sub: 'every Sunday' },
            { id: 'restore', label: 'Restore test', sub: 'every month' },
        ];
        const at = (/** @type {number} */ hoursAgo, /** @type {number} */ minutes) => NOW - hoursAgo * HOUR + minutes * 0;
        /** @type {import('../../js/gantt.js').GanttRun[]} */
        const runs = [
            { id: 'r1', lane: 'backup', label: 'Backup · media', start: at(21, 0), end: at(21, 0) + 38 * MIN, state: 'ok', series: 1 },
            { id: 'r2', lane: 'backup', label: 'Backup · platform', start: at(13, 0), end: at(13, 0) + 12 * MIN, state: 'ok', series: 1 },
            { id: 'r3', lane: 'update', label: 'Update · media', start: at(9, 0), end: at(9, 0) + 24 * MIN, state: 'ok', series: 2 },
            { id: 'r4', lane: 'update', label: 'Update · platform', start: at(4, 0), end: at(4, 0) + 41 * MIN, state: 'ok', series: 2 },
            { id: 'r5', lane: 'restore', label: 'Restore test', start: at(16, 0), end: at(16, 0) + 17 * MIN, state: 'ok', series: 3 },
        ];
        const set = wire('gantt-states', (_, value) => {
            if (value === 'ready') {
                setGanttRuns(el, runs, lanes);
                setGanttState(el, 'ready');
            } else if (value === 'loading') setGanttState(el, 'loading');
            else if (value === 'empty') {
                setGanttRuns(el, [], lanes);
                setGanttState(el, 'empty', 'Nothing has run in this window', { text: 'A run shows here as soon as a job starts.' });
            } else setGanttState(el, 'error', 'The history could not be read', { text: 'The host did not answer. Nothing was changed.' });
        });
        el.addEventListener(GANTT_RETRY_EVENT, retryWith(set));
        set('state', 'ready');
    }
}

// ---- 6 · the week ---------------------------------------------------------------------------------------
{
    const el = $('[data-kp-week]', document.getElementById('week-states') ?? document);
    if (el) {
        const midnight = new Date(NOW);
        midnight.setHours(0, 0, 0, 0);
        const day = (/** @type {number} */ n, /** @type {number} */ h, /** @type {number} */ m = 0) =>
            midnight.getTime() + n * DAY + h * HOUR + m * MIN;
        /** @type {import('../../js/week.js').WeekEvent[]} */
        const events = [
            { id: 'e1', start: day(0, 22), label: 'Backup · media', series: 1 },
            { id: 'e2', start: day(1, 3), label: 'Backup · media', series: 1 },
            { id: 'e3', start: day(1, 22, 30), label: 'Restore test', series: 3 },
            { id: 'e4', start: day(2, 3), label: 'Backup · platform', series: 1 },
            { id: 'e5', start: day(3, 4), label: 'Update · media', series: 2 },
            { id: 'e6', start: day(4, 3), label: 'Backup · media', series: 1 },
            { id: 'e7', start: day(5, 5), label: 'Update · platform', series: 2 },
            { id: 'e8', start: day(6, 3), label: 'Backup · media', series: 1 },
        ];
        const set = wire('week-states', (_, value) => {
            if (value === 'ready') {
                setWeekEvents(el, events);
                setWeekState(el, 'ready');
            } else if (value === 'loading') setWeekState(el, 'loading');
            else if (value === 'empty') {
                setWeekEvents(el, []);
                setWeekState(el, 'empty', 'Nothing is planned this week', { text: 'A run shows here as soon as a schedule has one.' });
            } else setWeekState(el, 'error', 'The week could not be read', { text: 'The host did not answer. Nothing was changed.' });
        });
        el.addEventListener(WEEK_RETRY_EVENT, retryWith(set));
        set('state', 'ready');
    }
}

// ---- 7 · the uptime strips ------------------------------------------------------------------------------
{
    const section = document.getElementById('uptime-group');
    const strips = /** @type {HTMLElement[]} */ (section ? [...section.querySelectorAll('[data-kp-uptime]')] : []);
    if (strips.length) {
        const periods = (/** @type {number} */ seed) =>
            Array.from({ length: 60 }, (_, i) => {
                const state = /** @type {'up' | 'degraded' | 'down'} */ (
                    (i * 7 + seed) % 23 === 0 ? 'down' : (i * 5 + seed) % 11 === 0 ? 'degraded' : 'up'
                );
                const d = new Date(NOW - (59 - i) * DAY);
                const label = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                return {
                    key: d.toISOString().slice(0, 10),
                    label,
                    state,
                    uptime: state === 'up' ? 1 : state === 'degraded' ? 0.96 : 0.2,
                    incidents: state === 'up' ? 0 : 1,
                };
            });
        /** @type {number[]} */
        let timers = [];
        wire('uptime-group', (_, value) => {
            for (const t of timers) clearTimeout(t);
            timers = [];
            strips.forEach((el, i) => {
                const label = el.getAttribute('data-kp-uptime-label') ?? '';
                if (value === 'ready') setUptime(el, { label, periods: periods(i * 3 + 1), to: 'Today' });
                else if (value === 'loading') setUptime(el, { label, state: 'loading', count: 60 });
                else {
                    setUptime(el, { label, state: 'loading', count: 60 });
                    timers.push(window.setTimeout(() => setUptime(el, { label, periods: periods(i * 3 + 1), to: 'Today' }), 1200 * (i + 1)));
                }
            });
        })('state', 'ready');
    }
}

// ---- 8 · the card -----------------------------------------------------------------------------------------
{
    const card = $('.kp-card', document.getElementById('card-states') ?? document);
    if (card) {
        const art = () => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 40 40');
            svg.setAttribute('class', 'sp-art');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
            svg.innerHTML =
                '<ellipse cx="20" cy="9" rx="13" ry="5"/><path d="M7 9v10c0 2.8 5.8 5 13 5s13-2.2 13-5V9"/><path d="M7 19v10c0 2.8 5.8 5 13 5s13-2.2 13-5V19"/>';
            return svg;
        };
        /** @type {{ state: string, art: string }} */
        const now = { state: 'ready', art: 'none' };
        const draw = () => {
            const withArt = now.art === 'art' ? { art: art() } : {};
            if (now.state === 'empty')
                setCardState(card, 'empty', { title: 'No backups yet', text: 'The first backup shows here after tonight’s run.', ...withArt });
            else if (now.state === 'error')
                setCardState(card, 'error', {
                    title: 'The backups could not be read',
                    text: 'The host did not answer. Nothing was changed.',
                    ...withArt,
                });
            else setCardState(card, /** @type {'ready' | 'loading'} */ (now.state));
        };
        const set = wire('card-states', (key, value) => {
            now[/** @type {'state' | 'art'} */ (key)] = value;
            draw();
        });
        card.addEventListener(CARD_RETRY_EVENT, retryWith(set));
        draw();
    }
}
