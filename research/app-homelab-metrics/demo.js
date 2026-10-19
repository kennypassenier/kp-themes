// research/app-homelab-metrics: the page's own wiring. The components are the package's (js/auto.js attaches them); this
// file feeds them sample data (sample.js), presses their states and writes what they fire into a readout. Each section is
// wired by its own elements, so a page that holds one section alone (the review dialog's lanes) works.
import { CHART_RANGE_EVENT, CHART_RETRY_EVENT, CHART_ZOOM_EVENT, attachCharts, CHART_SELECT_EVENT, chartSelect, chartZoom, formatChartValue, setChartData, setTrendData } from '../../js/chart.js';
import { CHANGE_EVENT, combobox } from '../../js/combobox.js';
import { STACKBAR_PICK_EVENT, STACKBAR_RETRY_EVENT, setStackbar } from '../../js/stackbar.js';
import { HEAT_PICK_EVENT, HEAT_ROW_EVENT, setHeat, setHeatPick, setHeatRows } from '../../js/heat.js';
import { dataTable, RETRY_EVENT as TABLE_RETRY_EVENT } from '../../js/datatable.js';
import { attachBarCells, setBarCell } from '../../js/barcell.js';
import { attachIdmarks } from '../../js/idmark.js';
import { UPTIME_PICK_EVENT, setUptime, uptimeFigures } from '../../js/uptime.js';
import { attachRequestInspectors, setRequests } from '../../js/request-inspector.js';
import { refreshOf } from '../../js/auto-refresh.js';
import { RANGE_EVENT, attachRanges, rangeOf, setRange } from '../../js/range.js';
import { GANTT_OPEN_EVENT, GANTT_WINDOW_EVENT, setGanttRuns, setGanttState, setGanttWindow } from '../../js/gantt.js';
import { DAY, GiB, HOUR, MIN, OPERATIONS, PROFILES, STACKS, chartOf, clock, dayAt, clockTime, count, diskUsed, eventsIn, hostCpu, hostLoad, hostMem, hostTemp, KINDS, moment, pointsOf, spanOf, stackValue, stepFor, systemChart, HOSTNAMES, STATUS_CLASSES, TZ, hostRequests, requestSamples, trafficByHour, trafficTotals, driveHistory, drivesOf } from './sample.js';

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

/** @param {string} id */
const byId = (id) => document.getElementById(id);
/** @param {string} id @param {string} text */
const say = (id, text) => {
    const out = byId(id);
    if (out) out.textContent = text;
};
/** Press a state button: exactly one of the group is pressed. @param {string} attribute @param {(value: string) => void} apply */
function stateButtons(attribute, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`[${attribute}]`)]);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(button.getAttribute(attribute) ?? '');
        });
    }
}
/** Mark one button of a group pressed without firing it. @param {string} attribute @param {string} value */
function press(attribute, value) {
    for (const b of document.querySelectorAll(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
}
/** Wait. @param {number} ms */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── live charts ──────────────────────────────────────────────────────────────────────────────────────────────────
if (byId('live-component')) {
    const SPAN = HOUR;
    const QUIET = 300;
    const cpu = /** @type {HTMLElement} */ (byId('live-cpu'));
    const mem = /** @type {HTMLElement} */ (byId('live-mem'));
    const group = /** @type {HTMLElement} */ (byId('live-group'));
    const control = /** @type {HTMLElement} */ (document.querySelector('#live-component [data-kp-refresh]'));
    let data = 'ready';
    let whileReading = 'keep';
    let polls = 0;
    let playing = false;
    let playLeft = 0;
    /** @type {{ from: number, to: number } | null} */
    let zoom = null;

    /** Someone is reading: a pinned reading, a zoom, a source switched off (how the page decides today). */
    const reading = () => {
        const pinned = !!document.querySelector('#live-component .kp-chart__tip[data-kp-pinned]:not([hidden])');
        const off = !!document.querySelector('#live-component .kp-chart__source[aria-pressed="false"]');
        return pinned || zoom != null || off;
    };

    const draw = () => {
        const to = clock.now;
        const from = to - SPAN;
        if (data === 'loading') {
            cpu.setAttribute('data-kp-chart-loading', '');
            mem.setAttribute('data-kp-chart-loading', '');
            return;
        }
        if (data === 'error') {
            for (const el of [cpu, mem]) setChartData(el, { label: el.getAttribute('aria-label') ?? '', series: [], error: 'Prometheus did not answer: connection refused. The charts keep their place; Retry reads again.' });
            return;
        }
        if (data === 'empty') {
            for (const el of [cpu, mem]) setChartData(el, { label: el.getAttribute('aria-label') ?? '', series: [{ label: 'pve', points: [] }] });
            return;
        }
        setChartData(cpu, systemChart('cpu', from, to));
        setChartData(mem, systemChart('ctmem', from, to));
    };

    /** One refresh: the control asked, the page reads and answers. @param {{ reason: string, done: (ok: boolean) => void }} detail */
    const refresh = (detail) => {
        polls += 1;
        if (playing && (playLeft -= 1) <= 0) {
            playing = false;
            queueMicrotask(() => handle()?.setInterval(QUIET, 'script'));
        }
        if (data === 'error') {
            detail.done(false);
            say('live-log', `refresh ${polls} (${detail.reason}) at ${clockTime(Date.now())}: Prometheus did not answer, the control keeps the charts and retries`);
            return;
        }
        if (whileReading === 'pause' && reading()) {
            detail.done(true);
            say('live-note', 'Waiting: a reading is pinned, a zoom is on or a source is off, so this refresh was skipped.');
            say('live-log', `refresh ${polls} (${detail.reason}) at ${clockTime(Date.now())}: skipped, someone is reading (today's behaviour)`);
            return;
        }
        clock.now += stepFor(SPAN);
        draw();
        detail.done(true);
        say('live-note', whileReading === 'keep' ? 'Updating in place: your pin, zoom and sources stay.' : 'Nothing is being read, so the refresh ran.');
        say('live-log', `refresh ${polls} (${detail.reason}) at ${clockTime(Date.now())}: +1 reading, the charts now end at ${clockTime(clock.now)}${zoom ? `, zoom ${clockTime(zoom.from)} to ${clockTime(zoom.to)} kept` : ''}`);
    };
    control.addEventListener('kp-refresh', (event) => refresh(/** @type {CustomEvent} */ (event).detail));
    group.addEventListener(CHART_ZOOM_EVENT, (event) => {
        zoom = /** @type {CustomEvent} */ (event).detail ?? null;
    });
    group.addEventListener(CHART_RETRY_EVENT, () => {
        data = 'ready';
        press('data-hm-live-data', 'ready');
        draw();
        say('live-log', 'Retry pressed on a chart: the page read again and drew again.');
    });

    stateButtons('data-hm-live-data', (value) => {
        data = value;
        draw();
    });
    stateButtons('data-hm-while', (value) => {
        whileReading = value;
        say('live-note', value === 'keep' ? 'Updating in place: your pin, zoom and sources stay.' : 'Pausing a refresh while you read.');
    });
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id !== 'live-while-reading') return;
        whileReading = detail.value === 'pause' ? 'pause' : 'keep';
        press('data-hm-while', whileReading);
    });

    const handle = () => refreshOf(control);
    for (const button of document.querySelectorAll('[data-hm-live]')) {
        button.addEventListener('click', async () => {
            const what = button.getAttribute('data-hm-live');
            if (what === 'play') {
                // The control's own timer does the work: two seconds apart, six times, then back to its quiet interval.
                if (playing) return;
                playing = true;
                playLeft = 6;
                handle()?.setInterval(2, 'script');
            } else if (what === 'pin') {
                const plot = /** @type {HTMLElement | null} */ (cpu.querySelector('.kp-chart__plot'));
                if (!plot || document.querySelector('#live-cpu .kp-chart__tip[data-kp-pinned]:not([hidden])')) return;
                plot.focus({ preventScroll: true });
                for (let i = 0; i < 12; i += 1) plot.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
                plot.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            } else if (what === 'zoom') chartZoom(group, { from: clock.now - 10 * MIN, to: clock.now });
            else if (what === 'unzoom') chartZoom(group, null);
        });
    }
    draw();
}

// ── what the host did, on the charts ─────────────────────────────────────────────────────────────────────────────
if (byId('events-component')) {
    const chart = /** @type {HTMLElement} */ (byId('events-chart'));
    const group = /** @type {HTMLElement} */ (byId('events-group'));
    const ribbon = /** @type {HTMLElement} */ (byId('events-ribbon'));
    let rangeKey = '24h';
    let band = /** @type {'hatch' | 'tint' | 'bracket'} */ ('hatch');
    let keyOn = true;
    let data = 'ready';
    const shown = new Set(['operation', 'update', 'failure']);
    let ribbonOn = true;
    const LANES = [
        { id: 'rounds', label: 'Nightly round' },
        { id: 'updates', label: 'Updates' },
        { id: 'host', label: 'Host work' },
    ];

    const drawRibbon = () => {
        const to = clock.now;
        const from = to - spanOf(rangeKey);
        if (data === 'loading') return setGanttState(ribbon, 'loading');
        if (data === 'error') return setGanttState(ribbon, 'error', 'The history could not be read: the dashboard did not answer. Retry reads it again.');
        const runs = OPERATIONS.filter((o) => o.at >= from && o.at <= to && shown.has(o.kind)).map((o) => ({
            id: o.id,
            lane: o.lane,
            label: o.label,
            start: o.at,
            end: o.until ?? o.at + 2 * MIN,
            state: /** @type {const} */ (o.kind === 'failure' ? 'failed' : 'ok'),
            detail: `${moment(o.at)}${o.until ? ` to ${moment(o.until)}` : ''}`,
        }));
        setGanttWindow(ribbon, { span: spanOf(rangeKey) / 1000, live: false, to });
        setGanttRuns(ribbon, runs, LANES);
    };
    const draw = () => {
        const to = clock.now;
        const from = to - spanOf(rangeKey);
        if (data === 'loading') chart.setAttribute('data-kp-chart-loading', '');
        else if (data === 'error') setChartData(chart, { label: 'CPU used', series: [], error: 'Prometheus did not answer: connection refused.' });
        else setChartData(chart, { ...systemChart('cpu', from, to), events: eventsIn(from, to, { kinds: shown }), kinds: KINDS, band, annotationKey: keyOn });
        drawRibbon();
        ribbon.hidden = !ribbonOn;
    };
    group.addEventListener(CHART_RANGE_EVENT, (event) => {
        rangeKey = /** @type {CustomEvent} */ (event).detail.range;
        draw();
    });
    group.addEventListener(CHART_RETRY_EVENT, () => {
        data = 'ready';
        press('data-hm-events-data', 'ready');
        draw();
    });
    // The ribbon's own window buttons press the chart's, so the two always show the same window.
    ribbon.addEventListener(GANTT_WINDOW_EVENT, (event) => {
        const key = { 86400: '24h', 604800: '7d', 2592000: '30d' }[/** @type {number} */ (/** @type {CustomEvent} */ (event).detail.span)];
        if (key && key !== rangeKey) /** @type {HTMLElement | null} */ (group.querySelector(`[data-kp-chart-range="${key}"]`))?.click();
    });
    ribbon.addEventListener(GANTT_OPEN_EVENT, (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        say('events-log', `kp-gantt-open ${JSON.stringify({ id: d.id, source: d.source })}: ${d.run?.label ?? d.id}`);
    });
    stateButtons('data-hm-band', (value) => {
        band = /** @type {typeof band} */ (value);
        draw();
    });
    stateButtons('data-hm-key', (value) => {
        keyOn = value === 'on';
        draw();
    });
    stateButtons('data-hm-events-data', (value) => {
        data = value;
        draw();
    });
    for (const button of document.querySelectorAll('[data-hm-kind]')) {
        button.addEventListener('click', () => {
            const kind = button.getAttribute('data-hm-kind') ?? '';
            const on = button.getAttribute('aria-pressed') !== 'true';
            button.setAttribute('aria-pressed', String(on));
            if (kind === 'ribbon') ribbonOn = on;
            else if (on) shown.add(kind);
            else shown.delete(kind);
            draw();
        });
    }
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === 'events-band') {
            band = detail.value;
            press('data-hm-band', band);
            draw();
        } else if (detail?.id === 'events-ribbon') {
            ribbonOn = detail.value !== 'hidden';
            press('data-hm-ribbon', ribbonOn ? 'shown' : 'hidden');
            const toggle = document.querySelector('[data-hm-kind="ribbon"]');
            toggle?.setAttribute('aria-pressed', String(ribbonOn));
            draw();
        }
    });
    draw();
}

// ── typical level and runs ───────────────────────────────────────────────────────────────────────────────────────
if (byId('typical-component')) {
    const chart = /** @type {HTMLElement} */ (byId('typical-chart'));
    const group = /** @type {HTMLElement} */ (byId('typical-group'));
    let median = true;
    let runs = /** @type {'mark' | 'off'} */ ('mark');
    let history = 'plenty';
    let data = 'ready';
    let picked = false;
    const draw = () => {
        const to = clock.now;
        const from = to - 7 * DAY;
        if (data === 'loading') return chart.setAttribute('data-kp-chart-loading', '');
        if (data === 'error') return setChartData(chart, { label: 'Memory per container', series: [], error: 'Prometheus did not answer: connection refused.' });
        if (data === 'empty') return setChartData(chart, { label: 'Memory per container', series: [{ label: 'immich', points: [] }] });
        const d = systemChart('ctmem', from, to);
        const keep = history === 'plenty' ? Infinity : history === 'new' ? 3 : 1;
        setChartData(chart, {
            ...d,
            series: d.series.map((s) => ({ ...s, points: Number.isFinite(keep) ? s.points.slice(-keep) : s.points })),
            median: median ? 'typical' : false,
            runs,
            minPoints: 48,
            minUnit: 'readings',
            onePointNote: true,
        });
        // The story is immich: open on it alone; the legend adds the others.
        if (!picked) {
            picked = true;
            chartSelect(chart, 1, true);
        }
    };
    stateButtons('data-hm-typical', (value) => {
        median = value !== 'off';
        runs = value === 'rings' ? 'mark' : 'off';
        draw();
    });
    stateButtons('data-hm-history', (value) => {
        history = value;
        draw();
    });
    stateButtons('data-hm-typical-data', (value) => {
        data = value;
        draw();
    });
    group.addEventListener(CHART_RETRY_EVENT, () => {
        data = 'ready';
        press('data-hm-typical-data', 'ready');
        draw();
    });
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id !== 'typical-line') return;
        median = detail.value !== 'off';
        runs = detail.value === 'rings' ? 'mark' : 'off';
        press('data-hm-typical', detail.value);
        draw();
    });
    draw();
}

// ── the time window ──────────────────────────────────────────────────────────────────────────────────────────────
if (byId('range-component')) {
    const picker = /** @type {HTMLElement} */ (byId('range-picker'));
    const group = /** @type {HTMLElement} */ (byId('range-group'));
    const charts = {
        cpu: /** @type {HTMLElement} */ (byId('range-cpu')),
        mem: /** @type {HTMLElement} */ (byId('range-mem')),
        load: /** @type {HTMLElement} */ (byId('range-load')),
    };
    const cfg = { presets: '1h 6h 24h 7d 30d', max: 31, open: 'preset' };
    /** @type {(() => void) | null} */
    let detach = null;

    /** @param {number} from @param {number} to */
    const draw = (from, to) => {
        setChartData(charts.cpu, systemChart('cpu', from, to));
        setChartData(charts.mem, systemChart('mem', from, to));
        setChartData(charts.load, systemChart('load', from, to));
    };
    /** Draw for whatever window the picker holds. */
    const drawPicker = () => {
        const value = rangeOf(picker);
        if (!value) return;
        draw(Date.parse(value.start), Date.parse(value.end));
    };
    /** The picker is read once at attach; a changed option draws it again. */
    const mount = () => {
        detach?.();
        picker.setAttribute('data-kp-range', '24h');
        picker.setAttribute('data-kp-range-presets', cfg.presets);
        if (cfg.max) picker.setAttribute('data-kp-range-max-days', String(cfg.max));
        else picker.removeAttribute('data-kp-range-max-days');
        picker.toggleAttribute('data-kp-range-disabled', cfg.open === 'off');
        if (cfg.open === 'custom') {
            picker.setAttribute('data-kp-range-start', new Date(dayAt(4, 22, 0)).toISOString());
            picker.setAttribute('data-kp-range-end', new Date(dayAt(3, 2, 30)).toISOString());
        } else {
            picker.removeAttribute('data-kp-range-start');
            picker.removeAttribute('data-kp-range-end');
        }
        detach = attachRanges(picker);
        drawPicker();
    };
    picker.addEventListener(RANGE_EVENT, (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        draw(Date.parse(d.start), Date.parse(d.end));
        say('range-log', `kp-range-change ${JSON.stringify({ preset: d.preset, start: d.start, end: d.end })}\n${d.label}`);
    });
    group.addEventListener(CHART_RETRY_EVENT, drawPicker);
    stateButtons('data-hm-presets', (value) => {
        cfg.presets = value === 'short' ? '1h 24h 7d' : '1h 6h 24h 7d 30d';
        mount();
    });
    stateButtons('data-hm-max', (value) => {
        cfg.max = Number(value);
        mount();
    });
    stateButtons('data-hm-open', (value) => {
        cfg.open = value;
        mount();
    });
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === 'range-presets') {
            cfg.presets = detail.value === 'short' ? '1h 24h 7d' : '1h 6h 24h 7d 30d';
            press('data-hm-presets', detail.value);
            mount();
        } else if (detail?.id === 'range-max') {
            cfg.max = Number(detail.value);
            press('data-hm-max', String(cfg.max));
            mount();
        }
    });
    mount();
    void setRange;
}

// ── a window of its own for each section ──────────────────────────────────────────────────────────────────────────
if (byId('groups-component')) {
    const compute = /** @type {HTMLElement} */ (byId('groups-compute'));
    const storage = /** @type {HTMLElement} */ (byId('groups-storage'));
    const state = { compute: '1h', storage: '7d', link: 'per-section', data: 'ready' };
    const parts = {
        compute: { el: compute, charts: [['groups-cpu', 'cpu'], ['groups-load', 'load']] },
        storage: { el: storage, charts: [['groups-disk', 'disk'], ['groups-temp', 'temp']] },
    };
    /** @param {'compute' | 'storage'} which */
    const draw = (which) => {
        const to = clock.now;
        const from = to - spanOf(state[which]);
        for (const [id, name] of parts[which].charts) {
            const el = /** @type {HTMLElement} */ (byId(id));
            if (state.data === 'loading') el.setAttribute('data-kp-chart-loading', '');
            else if (state.data === 'error') setChartData(el, { label: el.getAttribute('aria-label') ?? '', series: [], error: 'Prometheus did not answer: connection refused.' });
            else setChartData(el, systemChart(name, from, to));
        }
    };
    /** Click the key for `range` in a section, when it has one. @param {HTMLElement} el @param {string} range */
    const clickKey = (el, range) => /** @type {HTMLElement | null} */ (el.querySelector(`[data-kp-chart-range="${range}"]`))?.click();
    for (const which of /** @type {const} */ (['compute', 'storage'])) {
        const el = parts[which].el;
        el.addEventListener(CHART_RANGE_EVENT, (event) => {
            const range = /** @type {CustomEvent} */ (event).detail.range;
            if (state[which] === range) return;
            state[which] = range;
            draw(which);
            say('groups-log', `kp-chart-range on ${which}: ${range}${state.link === 'page' ? ', and the other section follows' : ', the other section keeps its window'}`);
            if (state.link === 'page') {
                const other = which === 'compute' ? 'storage' : 'compute';
                if (state[other] !== range) clickKey(parts[other].el, range);
            }
        });
        el.addEventListener(CHART_RETRY_EVENT, () => {
            state.data = 'ready';
            press('data-hm-groups-data', 'ready');
            draw('compute');
            draw('storage');
        });
    }
    stateButtons('data-hm-link', (value) => {
        state.link = value;
        // One window for the page: Storage takes Compute's window where it has the key, else the nearest it has.
        if (value === 'page') clickKey(storage, ['24h', '7d', '30d'].includes(state.compute) ? state.compute : '7d');
    });
    stateButtons('data-hm-groups-data', (value) => {
        state.data = value;
        draw('compute');
        draw('storage');
    });
    for (const button of document.querySelectorAll('[data-hm-groups-zoom]')) {
        button.addEventListener('click', () => {
            if (button.getAttribute('data-hm-groups-zoom') === 'in') {
                const to = clock.now;
                const span = spanOf(state.compute);
                chartZoom(compute, { from: to - span / 4, to });
            } else chartZoom(compute, null);
        });
    }
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id !== 'groups-link') return;
        state.link = detail.value;
        press('data-hm-link', detail.value);
        if (detail.value === 'page') clickKey(storage, ['24h', '7d', '30d'].includes(state.compute) ? state.compute : '7d');
    });
    draw('compute');
    draw('storage');
}

// ── which machine, and its key figures ───────────────────────────────────────────────────────────────────────────
if (byId('scope-component')) {
    const comboOne = /** @type {HTMLElement} */ (byId('scope-combo'));
    const comboMulti = /** @type {HTMLElement} */ (byId('scope-combo-multi'));
    const buttons = /** @type {HTMLElement} */ (byId('scope-buttons'));
    const tilesEl = /** @type {HTMLElement} */ (byId('scope-tiles'));
    const chart = /** @type {HTMLElement} */ (byId('scope-chart'));
    const group = /** @type {HTMLElement} */ (byId('scope-group'));
    const state = { values: ['host'], multi: true, picker: 'list', data: 'ready' };
    /** @type {(() => void) | null} */
    let detachTiles = null;

    /** @type {Record<string, { label: string, note?: string, kind: 'percent' | 'bytes' | 'count' | 'celsius', digits?: number, unit: string, f: (t: number, s: number) => number, chart: string }>} */
    const HOST_TILES = {
        cpu: { label: 'CPU', note: '5 min avg', kind: 'percent', unit: '%', f: hostCpu, chart: 'CPU used' },
        mem: { label: 'Memory', kind: 'bytes', unit: 'GiB', f: hostMem, chart: 'Memory used' },
        disk: { label: 'Root disk', kind: 'percent', unit: '%', f: (t, s) => diskUsed('root', t, s), chart: 'Disk used per filesystem' },
        load: { label: 'Load', note: '1 min', kind: 'count', digits: 1, unit: '', f: hostLoad, chart: 'Load average' },
        temp: { label: 'Hottest chip', kind: 'celsius', unit: '°C', f: hostTemp, chart: 'Chip temperature' },
    };
    /** @param {string} name */
    const stackTiles = (name) => {
        const p = PROFILES[/** @type {keyof typeof PROFILES} */ (name)];
        return {
            cpu: { label: 'CPU', note: '5 min avg', kind: 'percent', unit: '%', f: (/** @type {number} */ t, /** @type {number} */ s) => stackValue(name, 'cpu', t, s), chart: 'CPU used' },
            mem: { label: 'Memory', kind: /** @type {const} */ ('bytes'), unit: 'GiB', f: (/** @type {number} */ t, /** @type {number} */ s) => stackValue(name, 'mem', t, s), chart: 'Memory used' },
            disk: { label: 'Disk', kind: /** @type {const} */ ('percent'), unit: '%', f: (/** @type {number} */ t, /** @type {number} */ s) => stackValue(name, 'disk', t, s), chart: 'Disk used' },
            apps: { label: 'Apps running', kind: /** @type {const} */ ('count'), digits: 0, unit: '', f: () => p.apps, chart: 'CPU per app' },
            restarts: { label: 'Restarts', note: '1 h', kind: /** @type {const} */ ('count'), digits: 0, unit: '', f: (/** @type {number} */ t) => (name === 'immich' && t > clock.now - 9.6 * HOUR && t < clock.now - 9.4 * HOUR ? 1 : 0), chart: 'Restarts' },
        };
    };
    /** @param {number} v @param {{ kind: string, digits?: number, unit: string }} tile */
    const figure = (v, tile) => {
        if (tile.kind === 'bytes') return (v / GiB).toFixed(1);
        if (tile.kind === 'count') return v.toFixed(tile.digits ?? 0);
        return String(Math.round(v));
    };
    /** The tile's text for a reading, with its unit. @param {number} v @param {{ kind: string, digits?: number, unit: string }} tile */
    const reading = (v, tile) => `${figure(v, tile)}${tile.unit === '%' || tile.unit === '°C' ? tile.unit : tile.unit ? ` ${tile.unit}` : ''}`;

    const drawTiles = () => {
        detachTiles?.();
        const first = state.values[0] ?? 'host';
        const defs = first === 'host' ? HOST_TILES : stackTiles(first);
        const to = clock.now;
        const step = 10 * MIN;
        tilesEl.replaceChildren();
        const n = Object.keys(defs).length;
        for (const [key, tile] of Object.entries(defs)) {
            const points = pointsOf(to - DAY, to, step, (t) => tile.f(t, step));
            const last = points[points.length - 1][1];
            const peak = points.reduce((a, p) => (p[1] > a[1] ? p : a), points[0]);
            const low = points.reduce((a, p) => (p[1] < a[1] ? p : a), points[0]);
            const el = document.createElement('div');
            el.className = 'kp-kpi kp-kpi--trend';
            el.dataset.hmTile = key;
            const loading = state.data === 'loading';
            const failed = state.data === 'error';
            el.innerHTML = `
                <span class="kp-kpi__label">${tile.label}${tile.note ? ` <span class="kp-kpi__label-note">${tile.note}</span>` : ''}</span>
                <a class="kp-kpi__link" href="#scope-chart" data-hm-tile-link="${key}" title="Open ${tile.chart} on Metrics" data-kp-hovercard="${failed ? 'Not read' : `Highest ${reading(peak[1], tile)} at ${moment(peak[0])}. Lowest ${reading(low[1], tile)} at ${moment(low[0])}.`}"><span class="kp-kpi__link-word">Chart</span> ↗</a>
                <span class="kp-kpi__value">${failed || loading ? '—' : `${figure(last, tile)}${tile.unit ? `<small>${tile.unit}</small>` : ''}`}</span>
                <span class="kp-kpi__trend">${failed ? 'not read' : loading ? 'reading…' : `now <b>${reading(last, tile)}</b> · peak ${reading(peak[1], tile)}`}</span>
                <figure class="kp-kpi__chart" data-kp-chart="spark" data-kp-spark-head="none" data-kp-spark-axis="relative" aria-label="${tile.label}, last 24 hours"></figure>`;
            tilesEl.append(el);
            const fig = /** @type {HTMLElement} */ (el.querySelector('figure'));
            queueMicrotask(() => setTrendData(fig, loading ? null : failed ? { points: [] } : { points, step, unitKind: tile.kind }));
        }
        tilesEl.setAttribute('data-kp-kpis-columns', n === 5 ? '5 3 2 1' : '5 3 2 1');
        detachTiles = attachCharts(tilesEl);
    };

    const drawChart = () => {
        const to = clock.now;
        const from = to - DAY;
        if (state.data === 'loading') return chart.setAttribute('data-kp-chart-loading', '');
        if (state.data === 'error') return setChartData(chart, { label: 'CPU used', series: [], error: 'Prometheus did not answer: connection refused.' });
        const names = state.values.length ? state.values : ['host'];
        const sources = names.map((name) => (name === 'host' ? { label: names.length > 1 ? 'pve (the host)' : 'pve', f: hostCpu } : { label: name, f: (/** @type {number} */ t, /** @type {number} */ s) => stackValue(name, 'cpu', t, s) }));
        const hostOnly = names.length === 1 && names[0] === 'host';
        const d = chartOf({ label: 'CPU used', key: 'cpu', unitKind: 'percent', from, to, ...(hostOnly ? { yMax: 100 } : {}), sources });
        setChartData(chart, { ...d, events: eventsIn(from, to, names.includes('host') ? {} : { stacks: new Set(names) }), kinds: KINDS, band: 'hatch' });
    };
    const draw = () => {
        drawTiles();
        drawChart();
    };

    /** The picker the state asks for is shown, the others hidden, and it holds the values. The usual picker decides single or
     * several when it attaches, so each is a picker of its own. */
    const showPicker = () => {
        const active = state.picker === 'buttons' ? buttons : state.multi ? comboMulti : comboOne;
        for (const el of [comboOne, comboMulti, buttons]) el.hidden = el !== active;
        const label = byId('scope-label');
        label?.setAttribute('for', active === comboMulti ? 'scope-input-multi' : 'scope-input');
        if (active !== buttons) combobox(active)?.set(state.values);
        for (const b of buttons.querySelectorAll('[data-value]')) b.setAttribute('aria-checked', String(b.getAttribute('data-value') === state.values[0]));
    };

    for (const el of [comboOne, comboMulti]) {
        el.addEventListener(CHANGE_EVENT, (event) => {
            if (el.hidden) return;
            const d = /** @type {CustomEvent} */ (event).detail;
            const values = /** @type {string[]} */ (d.values ?? []);
            state.values = values.length ? values : ['host'];
            say('scope-log', `kp-combobox-change ${JSON.stringify({ values })}`);
            draw();
        });
    }
    buttons.addEventListener('kp-segmented-change', (event) => {
        const v = /** @type {CustomEvent} */ (event).detail?.value;
        if (!v) return;
        state.values = [v];
        say('scope-log', `kp-segmented-change ${JSON.stringify({ value: v })}`);
        draw();
    });
    tilesEl.addEventListener('click', (event) => {
        const link = /** @type {HTMLElement | null} */ ((/** @type {HTMLElement} */ (event.target)).closest('[data-hm-tile-link]'));
        if (!link) return;
        event.preventDefault();
        say('scope-log', `A key figure was pressed: the page would open the ${link.getAttribute('title')?.replace(/^Open /, '')}`);
    });
    group.addEventListener(CHART_RETRY_EVENT, () => {
        state.data = 'ready';
        press('data-hm-scope-data', 'ready');
        draw();
    });
    stateButtons('data-hm-picker', (value) => {
        state.picker = value;
        showPicker();
    });
    stateButtons('data-hm-compare', (value) => {
        state.multi = value === 'multi';
        if (!state.multi) state.values = state.values.slice(0, 1);
        showPicker();
        draw();
    });
    for (const button of document.querySelectorAll('[data-hm-scope]')) {
        button.addEventListener('click', () => {
            state.values = button.getAttribute('data-hm-scope') === 'host' ? ['host'] : state.multi ? ['kyu', 'almanac', 'inbox'] : ['kyu'];
            showPicker();
            draw();
        });
    }
    stateButtons('data-hm-scope-data', (value) => {
        state.data = value;
        draw();
    });
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === 'scope-picker') {
            state.picker = detail.value === 'buttons' ? 'buttons' : 'list';
            press('data-hm-picker', state.picker);
            showPicker();
        } else if (detail?.id === 'scope-compare') {
            state.multi = detail.value !== 'one';
            press('data-hm-compare', state.multi ? 'multi' : 'one');
            if (!state.multi) state.values = state.values.slice(0, 1);
            showPicker();
            draw();
        }
    });
    showPicker();
    draw();
    say('scope-log', 'Pick a machine or press a key figure; what it fires is written here.');
    void [STACKS, formatChartValue];
}

// ── traffic ──────────────────────────────────────────────────────────────────────────────────────────────────────
if (byId('traffic-component')) {
    const mix = /** @type {HTMLElement} */ (byId('traffic-mix'));
    const group = /** @type {HTMLElement} */ (byId('traffic-group'));
    const chart = /** @type {HTMLElement} */ (byId('traffic-chart'));
    const heat = /** @type {HTMLElement} */ (byId('traffic-heat'));
    const heatBox = /** @type {HTMLElement} */ (byId('traffic-heat-box'));
    const table = /** @type {HTMLElement} */ (byId('traffic-table'));
    const rows = /** @type {HTMLElement} */ (byId('traffic-rows'));
    const state = { hosts: 'heat', cls: 'all', data: 'ready' };
    /** @type {string[]} */
    let selected = [];
    const hour = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    const CLASS_WORDS = { s2: '2xx', s3: '3xx', s4: '4xx', s5: '5xx' };
    const EMPTY_WORDS = 'No requests reached the gateway in this window.';
    const ERROR_WORDS = 'The gateway’s access log could not be read: Loki did not answer.';

    const drawMix = (/** @type {ReturnType<typeof trafficTotals>} */ totals) => {
        if (state.data === 'loading') return setStackbar(mix, { state: 'loading', label: 'Status mix' });
        if (state.data === 'empty') return setStackbar(mix, { state: 'empty', message: EMPTY_WORDS, label: 'Status mix' });
        if (state.data === 'error') return setStackbar(mix, { state: 'error', message: ERROR_WORDS, label: 'Status mix' });
        setStackbar(mix, {
            title: 'Status mix, last 24 hours',
            total: totals.total,
            summary: `${count(totals.total)} requests`,
            format: count,
            label: 'Status mix',
            parts: totals.classes.map((c) => ({ key: c.key, label: c.label, value: c.n, ...(c.key === 's5' ? { tone: /** @type {const} */ ('destructive') } : c.key === 's4' ? { tone: /** @type {const} */ ('warning') } : {}) })),
        });
    };
    const drawChart = (/** @type {number} */ from, /** @type {number} */ to, /** @type {ReturnType<typeof trafficTotals>} */ totals) => {
        if (state.data === 'loading') return chart.setAttribute('data-kp-chart-loading', '');
        if (state.data === 'error') return setChartData(chart, { label: 'Requests per hostname', series: [], error: ERROR_WORDS });
        if (state.data === 'empty') return setChartData(chart, { label: 'Requests per hostname', series: [{ label: 'jellyfin.kp-soft.dev', points: [] }] });
        const cls = state.cls === 'all' ? 'n' : /** @type {'s2'} */ (state.cls);
        const d = chartOf({
            label: 'Requests per hostname',
            key: 'hostnames',
            unitKind: 'count',
            from,
            to,
            sources: HOSTNAMES.map((h, i) => ({ label: h.name, f: (/** @type {number} */ t, /** @type {number} */ s) => hostRequests(h, t, s, cls), total: totals.perHost[i][cls] })),
        });
        setChartData(chart, d);
    };
    const drawHeat = (/** @type {number} */ to) => {
        const skeleton = { rows: HOSTNAMES.length, columns: 24 };
        const label = 'Requests per hostname per hour';
        if (state.data === 'loading') return setHeat(heat, { state: 'loading', skeleton, label });
        if (state.data === 'empty') return setHeat(heat, { state: 'empty', skeleton, message: EMPTY_WORDS, label });
        if (state.data === 'error') return setHeat(heat, { state: 'error', skeleton, message: ERROR_WORDS, label });
        const narrow = window.matchMedia('(max-width: 40rem)').matches;
        // On a phone three hours share a column, so eight columns keep their names clear of each other.
        const merge = (/** @type {ReturnType<typeof trafficByHour>[number]['hours']} */ hours) =>
            narrow
                ? Array.from({ length: hours.length / 3 }, (_, i) => {
                      const part = hours.slice(3 * i, 3 * i + 3);
                      const sum = (/** @type {'n' | 's2' | 's3' | 's4' | 's5'} */ k) => part.reduce((a, h) => a + h[k], 0);
                      return { at: part[0].at, n: sum('n'), s2: sum('s2'), s3: sum('s3'), s4: sum('s4'), s5: sum('s5') };
                  })
                : hours;
        const byHour = trafficByHour(to).map((r) => ({ host: r.host, hours: merge(r.hours) }));
        const span = narrow ? 3 * HOUR : HOUR;
        const key = state.cls === 'all' ? 'n' : /** @type {'s2'} */ (state.cls);
        setHeat(heat, {
            label,
            every: narrow ? 1 : 3,
            columns: byHour[0].hours.map((h) => ({ key: String(h.at), label: hour.format(h.at).slice(0, 2) })),
            rows: byHour.map((row, i) => {
                const values = row.hours.map((h) => h[key]);
                const peak = Math.max(1, ...values);
                return {
                    key: row.host.name,
                    label: row.host.name,
                    mark: `var(--chart-${(i % 5) + 1})`,
                    pressed: selected.includes(row.host.name),
                    cells: row.hours.map((h, k) => ({
                        tone: h.s5 > 0 ? /** @type {const} */ ('bad') : /** @type {const} */ ('level'),
                        level: values[k] / peak,
                        label: `${count(values[k])} requests`,
                        tip: `${row.host.name}, ${hour.format(h.at)} to ${hour.format(h.at + span)}: ${count(h.n)} requests, ${count(h.s4)} client errors, ${count(h.s5)} server errors`,
                    })),
                };
            }),
        });
    };
    const drawTable = (/** @type {number} */ to, /** @type {ReturnType<typeof trafficTotals>} */ totals) => {
        const handle = dataTable(table);
        if (state.data === 'loading') return handle?.state('loading');
        if (state.data === 'error') return handle?.fail(ERROR_WORDS);
        handle?.state('ready');
        const key = state.cls === 'all' ? 'n' : /** @type {'s2'} */ (state.cls);
        const list = state.data === 'empty' ? [] : [...totals.perHost].filter((r) => r[key] > 0).sort((a, b) => b[key] - a[key]);
        const whole = list.reduce((a, r) => a + r[key], 0) || 1;
        rows.innerHTML = list
            .map(
                (r) => `<tr data-kp-row-key="${r.host.name}">
                    <td data-label="Hostname"><span class="kp-idmark-name"><span class="kp-idmark kp-idmark--sm" data-kp-idmark="${r.host.stack ?? r.host.name}" aria-hidden="true"></span><span class="kp-mono">${r.host.name}</span></span></td>
                    <td class="kp-text-end" data-label="Requests" data-kp-sort-value="${r[key]}">${count(r[key])}</td>
                    <td data-label="Share of all"><span class="kp-bar-cell" data-hm-share="${(r[key] / whole).toFixed(4)}"></span></td>
                    <td class="kp-text-end" data-label="Client errors (4xx)" data-kp-sort-value="${r.s4}">${count(r.s4)}</td>
                    <td class="kp-text-end" data-label="Server errors (5xx)" data-kp-sort-value="${r.s5}">${count(r.s5)}</td>
                </tr>
                <tr data-kp-row-detail><td colspan="5"><div class="kp-card kp-inspector" data-kp-requests data-kp-requests-open="failed" data-hm-requests="${r.host.name}"></div></td></tr>`,
            )
            .join('');
        for (const cell of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-hm-share]'))) {
            const share = Number(cell.dataset.hmShare);
            setBarCell(cell, { value: share, text: `${(share * 100).toFixed(1)}%`, tone: null, sortValue: share });
        }
        attachBarCells(rows);
        attachIdmarks(rows);
        attachRequestInspectors(rows, { origin: '' });
        for (const box of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-hm-requests]'))) setRequests(box, requestSamples(box.dataset.hmRequests ?? '', to));
        handle?.refresh();
    };
    const draw = () => {
        const to = clock.now;
        const from = to - DAY;
        const totals = trafficTotals(from, to);
        drawMix(totals);
        drawChart(from, to, totals);
        drawHeat(to);
        drawTable(to, totals);
        heatBox.hidden = state.hosts !== 'heat';
        table.hidden = state.hosts !== 'table';
    };

    mix.addEventListener(STACKBAR_PICK_EVENT, (event) => {
        const key = /** @type {CustomEvent} */ (event).detail.key;
        state.cls = state.cls === key ? 'all' : key;
        press('data-hm-class', state.cls);
        say('traffic-log', `kp-stackbar-pick ${JSON.stringify({ key })}: ${state.cls === 'all' ? 'all classes again' : `only ${CLASS_WORDS[/** @type {'s2'} */ (state.cls)]} below`}`);
        draw();
    });
    const retry = () => {
        state.data = 'ready';
        press('data-hm-traffic-data', 'ready');
        draw();
        say('traffic-log', 'Retry pressed: the page read again and drew again.');
    };
    mix.addEventListener(STACKBAR_RETRY_EVENT, retry);
    group.addEventListener(CHART_RETRY_EVENT, retry);
    table.addEventListener(TABLE_RETRY_EVENT, retry);
    heat.addEventListener(HEAT_PICK_EVENT, (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        chartZoom(group, d.picked ? { from: Number(d.colKey), to: Number(d.colKey) + (window.matchMedia('(max-width: 40rem)').matches ? 3 * HOUR : HOUR) } : null);
        say('traffic-log', `kp-heat-pick ${JSON.stringify({ rowKey: d.rowKey, colKey: d.colKey, picked: d.picked })}: ${d.picked ? `the chart zooms to ${hour.format(Number(d.colKey))} to ${hour.format(Number(d.colKey) + HOUR)}` : 'the zoom is released'}`);
    });
    heat.addEventListener(HEAT_ROW_EVENT, (event) => {
        const keys = /** @type {string[]} */ (/** @type {CustomEvent} */ (event).detail.keys);
        selected = keys;
        chartSelect(chart, null);
        for (const k of keys) chartSelect(chart, HOSTNAMES.findIndex((h) => h.name === k), true);
        say('traffic-log', `kp-heat-row ${JSON.stringify({ keys })}: the chart shows ${keys.length ? keys.join(', ') : 'every hostname'}`);
    });
    chart.addEventListener(CHART_SELECT_EVENT, (event) => {
        const on = /** @type {number[]} */ (/** @type {CustomEvent} */ (event).detail.on ?? []);
        selected = on.map((i) => HOSTNAMES[i]?.name).filter(Boolean);
        setHeatRows(heat, selected);
    });
    group.addEventListener(CHART_ZOOM_EVENT, (event) => {
        if (!(/** @type {CustomEvent} */ (event).detail)) setHeatPick(heat, null);
    });
    window.matchMedia('(max-width: 40rem)').addEventListener('change', draw);
    stateButtons('data-hm-hosts', (value) => {
        state.hosts = value;
        draw();
    });
    stateButtons('data-hm-class', (value) => {
        state.cls = value;
        draw();
    });
    stateButtons('data-hm-traffic-data', (value) => {
        state.data = value;
        draw();
    });
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id !== 'traffic-hostnames') return;
        state.hosts = detail.value === 'table' ? 'table' : 'heat';
        press('data-hm-hosts', state.hosts);
        draw();
    });
    draw();
}

// ── drives ───────────────────────────────────────────────────────────────────────────────────────────────────────
if (byId('drives-component')) {
    const table = /** @type {HTMLElement} */ (byId('drives-table'));
    const rows = /** @type {HTMLElement} */ (byId('drives-rows'));
    const state = { failing: false, strip: 'days', data: 'ready' };
    const ERROR_WORDS = 'Prometheus did not answer, so the drives could not be read.';
    const hours = (/** @type {number} */ h) => `${count(h)} h · ${(h / 8760).toFixed(1)} y`;

    const draw = () => {
        const handle = dataTable(table);
        if (state.data === 'loading') return handle?.state('loading');
        if (state.data === 'error') return handle?.fail(ERROR_WORDS);
        handle?.state('ready');
        const list = state.data === 'empty' ? [] : drivesOf(state.failing);
        rows.innerHTML = list
            .map(
                (d) => `<tr data-kp-row-key="${d.name}">
                    <td data-label="Drive"><b class="kp-mono">${d.name}</b> <span class="hm-opt__meta">${d.model}</span></td>
                    <td data-label="SMART" data-kp-sort-value="${d.ok ? 'ok' : 'not ok'}"><span class="kp-badge hm-nowrap ${d.ok ? 'kp-badge--success' : 'kp-badge--destructive'}">${d.ok ? 'ok' : 'not ok'}</span></td>
                    <td data-label="Temperature" data-kp-sort-value="${d.temp}"><span class="kp-bar-cell" data-hm-temp="${d.temp}"></span></td>
                    <td class="kp-text-end" data-label="Pending sectors" data-kp-sort-value="${d.pending}">${count(d.pending)}</td>
                    <td class="kp-text-end" data-label="Reallocated sectors" data-kp-sort-value="${d.realloc}">${count(d.realloc)}</td>
                    <td class="kp-text-end hm-nowrap" data-label="Powered on" data-kp-sort-value="${d.hours}">${hours(d.hours)}</td>
                </tr>
                <tr data-kp-row-detail><td colspan="6"><div class="hm-drive-detail">
                    <div class="kp-uptime" data-kp-uptime data-hm-strip="${d.name}"></div>
                    <div class="hm-charts hm-charts--two">
                        <figure class="kp-chart" data-kp-chart="spark" data-hm-spark="temp:${d.name}" aria-label="Temperature of ${d.name}"></figure>
                        <figure class="kp-chart" data-kp-chart="spark" data-hm-spark="pending:${d.name}" aria-label="Pending sectors of ${d.name}"></figure>
                    </div>
                </div></td></tr>`,
            )
            .join('');
        const to = clock.now;
        for (const cell of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-hm-temp]'))) {
            const t = Number(cell.dataset.hmTemp);
            setBarCell(cell, { value: t / 80, text: `${t} °C`, warnAt: 0.75, badAt: 0.9, sortValue: t, label: 'of 80 °C' });
        }
        for (const el of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-hm-strip]'))) {
            const d = list.find((x) => x.name === el.dataset.hmStrip);
            if (!d) continue;
            const unit = state.strip === 'days' ? 'days' : 'hours';
            const periods = driveHistory(d, unit, state.strip === 'days' ? 90 : 48).map((p) => ({
                ...p,
                ...(p.state === 'down' ? { incidents: 1, details: [`SMART not ok on ${p.label}`, `${d.pending} pending sectors`] } : {}),
            }));
            setUptime(el, { label: d.name, periods, from: state.strip === 'days' ? '90 days ago' : '48 hours ago', to: state.strip === 'days' ? 'Today' : 'Now', open: 'info' });
        }
        attachBarCells(rows);
        queueMicrotask(() => {
            attachCharts(rows);
            for (const fig of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-hm-spark]'))) {
                const [what, name] = (fig.dataset.hmSpark ?? '').split(':');
                const d = list.find((x) => x.name === name);
                if (!d) continue;
                const values = what === 'temp' ? d.tempTrend : d.pendTrend;
                const step = HOUR;
                setChartData(fig, { label: what === 'temp' ? 'Temperature' : 'Pending sectors', ...(what === 'temp' ? { unitKind: 'celsius' } : { unitKind: 'count' }), series: [{ label: what === 'temp' ? 'Temperature' : 'Pending sectors', points: values.map((v, i) => [to - (values.length - 1 - i) * step, v]) }] });
            }
        });
        handle?.refresh();
        if (state.failing) handle?.expand(['sdb']);
    };
    table.addEventListener(TABLE_RETRY_EVENT, () => {
        state.data = 'ready';
        press('data-hm-drives-data', 'ready');
        draw();
    });
    rows.addEventListener(UPTIME_PICK_EVENT, (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        say('drives-log', `kp-uptime-pick ${JSON.stringify({ key: d.key, period: d.period?.label })}`);
    });
    stateButtons('data-hm-drives', (value) => {
        state.failing = value === 'failing';
        draw();
    });
    stateButtons('data-hm-strip', (value) => {
        state.strip = value;
        draw();
    });
    stateButtons('data-hm-drives-data', (value) => {
        state.data = value;
        draw();
    });
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id !== 'drives-strip') return;
        state.strip = detail.value === 'hours' ? 'hours' : 'days';
        press('data-hm-strip', state.strip);
        draw();
    });
    draw();
    void uptimeFigures;
}

void [DAY, count, eventsIn, KINDS, moment, spanOf, chartSelect, CHART_RANGE_EVENT];
