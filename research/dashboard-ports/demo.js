// The demo page's own wiring: copies for the phone frames, the option
// buttons, and the sample data moving. The proposal itself is ports.js.
import {
    attachActionColumns,
    attachAttention,
    attachCharts,
    attachKpiToggles,
    attachSparklines,
    CHART_RANGE_EVENT,
    KPI_TOGGLE_EVENT,
    parseSpan,
    setChartData,
    setStateWord,
} from './ports.js';
import { attachDataTables, dataTable } from '../../js/datatable.js';

/** @param {string} selector @returns {HTMLElement[]} */
const all = (selector) => /** @type {HTMLElement[]} */ ([...document.querySelectorAll(selector)]);

/* ---- copies: the phone frames and "Package today" show the same rows ---- */

const incidents = document.querySelector('[data-dp-actlist]:not([data-dp-mirror])');
if (incidents) {
    for (const target of all('[data-dp-actlist][data-dp-mirror], [data-dp-today]')) target.innerHTML = incidents.innerHTML;
}
const kpis = document.querySelector('[data-dp-kpis]:not([data-dp-mirror])');
if (kpis) for (const target of all('[data-dp-kpis][data-dp-mirror]')) target.innerHTML = kpis.innerHTML;

/* ---- the proposal, attached as a consumer would ---- */

attachActionColumns(document);
attachSparklines(document);
attachKpiToggles(document);

/* ---- options: the buttons in a section, and the review dialog's ticks ---- */

/** What each option does to the page. @type {Record<string, (value: string) => void>} */
const APPLY = {
    phone: (value) => {
        for (const list of all('[data-dp-actlist]')) {
            if (value === 'stack') list.dataset.kpActionPhone = 'stack';
            else delete list.dataset.kpActionPhone;
        }
    },
    rows: (value) => all('[data-dp-tiles]').forEach((grid) => grid.classList.toggle('kp-tiles--per-row', value === 'per-row')),
    pressed: (value) => all('[data-dp-kpis]').forEach((strip) => strip.classList.toggle('kp-kpis--tint', value === 'tint')),
    spark: (value) => all('.kp-kpi__spark').forEach((svg) => svg.classList.toggle('kp-kpi__spark--line', value === 'line')),
    overflow: (value) => {
        const section = document.getElementById('page-header');
        if (section) section.dataset.dpOverflow = value;
    },
    'header-phone': (value) =>
        all('.kp-page-header').forEach((header) => header.classList.toggle('kp-page-header--primary-first', value === 'primary')),
    look: (value) => all('[data-dp-attention]').forEach((band) => band.classList.toggle('kp-attention--soft', value === 'soft')),
    tip: (value) => all('[data-dp-chart]').forEach((chart) => chart.classList.toggle('kp-chart--tip-docked', value === 'docked')),
    fill: (value) =>
        all('[data-dp-charts] .kp-chart, [data-dp-charts] [data-kp-chart]').forEach((chart) =>
            chart.classList.toggle('kp-chart--lines', value === 'lines'),
        ),
};

/** @param {string} name @param {string} value */
const choose = (name, value) => {
    APPLY[name]?.(value);
    for (const button of all(`[data-dp-preview="${name}"] [data-value]`)) button.setAttribute('aria-pressed', String(button.dataset.value === value));
};

for (const group of all('[data-dp-preview]')) {
    group.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('[data-value]')) : null;
        if (button?.dataset.value) choose(group.dataset.dpPreview ?? '', button.dataset.value);
    });
}

// A tick in the review dialog shows that option on the page too. The header's
// phone choice is named "phone" in the dialog, like the list's.
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    const item = event.target instanceof Element ? event.target.getAttribute('data-review-item') : null;
    choose(item === 'page-header' && id === 'phone' ? 'header-phone' : id, value);
});

/* ---- 1 · a label that grows ---- */

document.querySelector('[data-dp-longer]')?.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.currentTarget);
    const longer = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(longer));
    for (const assign of all('[data-dp-assign]')) assign.textContent = longer ? 'Assign to the night shift…' : 'Assign…';
});

/* ---- 3 · what the filters would do ---- */

const filterOut = document.querySelector('[data-dp-filter-out]');
document.addEventListener(KPI_TOGGLE_EVENT, (event) => {
    const tile = /** @type {HTMLElement} */ (event.target);
    const name = tile.dataset.dpFilter ?? '';
    const pressed = /** @type {CustomEvent<{ pressed: boolean }>} */ (event).detail.pressed;
    // The two copies of a tile (full width and phone frame) move together.
    for (const twin of all(`[data-dp-filter="${name}"]`)) twin.setAttribute('aria-pressed', String(pressed));
    const on = [...new Set(all('[data-dp-filter][aria-pressed="true"]').map((t) => t.dataset.dpFilter))];
    if (filterOut)
        filterOut.textContent = on.length ? `Filtering the list below: ${on.join(' and ')} only.` : 'No filter on: every pump house is listed.';
});

/* ---- 5 · the attention band ---- */

const items = /** @type {HTMLTemplateElement | null} */ (document.querySelector('[data-dp-attention-items]'));
const extra = /** @type {HTMLTemplateElement | null} */ (document.querySelector('[data-dp-attention-extra]'));
const bands = all('[data-dp-attention]');
const fill = () => bands.forEach((band) => band.replaceChildren(items ? items.content.cloneNode(true) : ''));
fill();
attachAttention(document);
document.querySelector('[data-dp-attn="add"]')?.addEventListener('click', () => {
    for (const band of bands) if (extra) band.append(extra.content.cloneNode(true));
});
document.querySelector('[data-dp-attn="clear"]')?.addEventListener('click', () => bands.forEach((band) => band.replaceChildren()));
document.querySelector('[data-dp-attn="reset"]')?.addEventListener('click', fill);

/* ---- 7 · state words ---- */

const STATES = ['Running', 'Stopped', 'Restarting', 'Starting in 3 min'];
const PUMPS = ['Pump 1', 'Pump 2', 'Pump 3', 'Pump 4'];
for (const list of all('[data-dp-pumps]')) {
    const proposal = list.dataset.dpPumps === 'proposal';
    PUMPS.forEach((pump, at) => {
        const li = document.createElement('li');
        const name = document.createElement('b');
        name.textContent = pump;
        const word = document.createElement('span');
        if (proposal) {
            word.className = 'kp-state-word';
            word.setAttribute('data-kp-words', STATES.join('\n'));
        }
        word.dataset.dpWord = '';
        word.textContent = STATES[at % STATES.length];
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'kp-button kp-button--sm';
        button.textContent = at % 2 ? 'Start' : 'Stop';
        li.append(name, word, button);
        list.append(li);
    });
}
let step = 0;
/** @type {number | undefined} */
let timer;
document.querySelector('[data-dp-cycle]')?.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.currentTarget);
    const on = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(on));
    button.textContent = on ? 'Stop changing' : 'Change the states';
    clearInterval(timer);
    if (!on) return;
    timer = window.setInterval(() => {
        step += 1;
        for (const list of all('[data-dp-pumps]')) {
            [...list.querySelectorAll('[data-dp-word]')].forEach((word, at) => {
                const next = STATES[(at + step) % STATES.length];
                if (word.classList.contains('kp-state-word')) setStateWord(/** @type {HTMLElement} */ (word), next);
                else word.textContent = next;
            });
        }
    }, 1200);
});

/* ---- 8 · two tables loading for the first time ---- */

const busySection = document.getElementById('busy-phone');
if (busySection) {
    attachDataTables(busySection);
    const since = Date.now() - 42_000;
    for (const table of all('[data-dp-busy]')) {
        dataTable(table)?.busy({ text: 'Reading the pump houses from the field units on the northern network…', since, overlay: true });
    }
}

/* ---- 9 · the time chart: made-up readings, the same on every load ---- */

// Sunday 4 October 2026, 09:00 on the reader's clock: "now" for the sample.
const NOW = new Date(2026, 9, 4, 9, 0).getTime();
const HOUR = 3_600_000;
const DAY = 24 * HOUR;
/** The step of each range: a minute, five minutes, an hour. @type {Record<string, number>} */
const STEPS = { '1h': 60_000, '24h': 300_000, '7d': HOUR };

/** Noise from the time alone, so every range draws the same readings. @param {number} t @param {number} k */
const noise = (t, k) => {
    const v = Math.sin((t / 60_000) * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v) - 0.5;
};
/** The network's demand at `t`: a morning and an evening peak, a quiet night. @param {number} t */
const demand = (t) => {
    const d = new Date(t);
    const h = d.getHours() + d.getMinutes() / 60;
    return 0.55 + 0.4 * Math.exp(-((h - 7.5) ** 2) / 3) + 0.3 * Math.exp(-((h - 19) ** 2) / 4) - 0.25 * Math.exp(-((h - 3.5) ** 2) / 5);
};
/** How far pump house 3 sagged this morning, 0 to 1 (the alarm at 07:32, the restart at 08:12). @param {number} t */
const sag = (t) => {
    const start = NOW - 100 * 60_000;
    const restart = NOW - 48 * 60_000;
    if (t < start || t > restart + 20 * 60_000) return 0;
    if (t <= restart) return Math.min(1, (t - start) / (30 * 60_000));
    return 1 - (t - restart) / (20 * 60_000);
};

const PRESSURE = [
    { label: 'Pump house 1', at: (/** @type {number} */ t) => 3.7 - 0.45 * demand(t) + 0.05 * noise(t, 1) },
    { label: 'Pump house 3', at: (/** @type {number} */ t) => 3.15 - 0.5 * demand(t) - 0.75 * sag(t) + 0.05 * noise(t, 3) },
    { label: 'Pump house 7', at: (/** @type {number} */ t) => 2.95 - 0.35 * demand(t) + 0.05 * noise(t, 7) },
];
const FLOW = [120, 95, 80, 70, 55, 45, 30].map((base, k) => ({
    label: `Pump house ${k + 1}`,
    at: (/** @type {number} */ t) => base * demand(t) * (k === 2 ? 1 - 0.5 * sag(t) : 1) + 3 * noise(t, k + 11),
}));

/** @type {import('./ports.js').ChartEvent[]} */
const EVENTS = [
    ...Array.from({ length: 7 }, (_, d) => ({
        at: new Date(2026, 9, 4 - d, 2, 0).getTime(),
        label: 'Backup',
        tone: /** @type {const} */ ('info'),
        href: '#time-chart',
    })),
    { at: new Date(2026, 9, 4, 6, 10).getTime(), label: 'Valve swap, ring main', tone: 'info', href: '#time-chart' },
    { at: new Date(2026, 9, 4, 7, 32).getTime(), label: 'Alarm: pump house 3 below 2.1 bar', tone: 'critical', href: '#time-chart' },
    { at: new Date(2026, 9, 4, 8, 12).getTime(), label: 'Pump restart, pump house 3', tone: 'warning', href: '#time-chart' },
    { at: new Date(2026, 9, 2, 14, 20).getTime(), label: 'Valve swap, reservoir North', tone: 'info', href: '#time-chart' },
    { at: new Date(2026, 8, 30, 11, 5).getTime(), label: 'Alarm: pump house 7 no reading', tone: 'critical', href: '#time-chart' },
];

/**
 * A source's readings over the window `span` up to now, one per `step`.
 * @param {{ label: string, at: (t: number) => number }} source
 * @param {number} span
 * @param {number} step
 * @param {number} digits
 */
const series = (source, span, step, digits) => {
    const start = NOW - span;
    const values = Array.from({ length: Math.round(span / step) + 1 }, (_, i) => Number(source.at(start + i * step).toFixed(digits)));
    return { label: source.label, start, step, values };
};

/** @param {string} range @returns {Record<string, import('./ports.js').ChartData>} */
const chartData = (range) => {
    const span = parseSpan(range) ?? DAY;
    const step = STEPS[range] ?? 300_000;
    return {
        pressure: {
            label: 'Pressure',
            unit: 'bar',
            digits: 2,
            threshold: 2.1,
            series: PRESSURE.map((p) => series(p, span, step, 2)),
            events: EVENTS,
        },
        flow: { label: 'Flow', unit: 'm³/h', digits: 0, series: FLOW.map((f) => series(f, span, step, 0)), events: EVENTS },
    };
};

/** @param {HTMLElement} groupEl @param {string} range */
const fillGroup = (groupEl, range) => {
    const data = chartData(range);
    for (const chart of /** @type {HTMLElement[]} */ ([...groupEl.querySelectorAll('[data-dp-chart]')]))
        setChartData(chart, data[chart.dataset.dpChart ?? '']);
};

for (const groupEl of all('[data-dp-charts]')) {
    const data = chartData(groupEl.dataset.kpChartSpan ?? '24h');
    const sparks = all(`[data-dp-charts="${groupEl.dataset.dpCharts}"] [data-dp-spark]`);
    /** @type {[HTMLElement, import('./ports.js').ChartData][]} */
    const charts = [
        ...[.../** @type {NodeListOf<HTMLElement>} */ (groupEl.querySelectorAll('[data-dp-chart]'))].map(
            (chart) => /** @type {[HTMLElement, import('./ports.js').ChartData]} */ ([chart, data[chart.dataset.dpChart ?? '']]),
        ),
        ...sparks.map((spark) => {
            const source = PRESSURE[Number(spark.dataset.dpSpark)];
            // A source keeps its colour from the pressure chart: colour follows the
            // pump house, not its place in this one-source chart.
            const colour = `var(--chart-${Number(spark.dataset.dpSpark) + 1})`;
            return /** @type {[HTMLElement, import('./ports.js').ChartData]} */ ([
                spark,
                { label: source.label, unit: 'bar', digits: 2, series: [{ ...series(source, DAY, 300_000, 2), colour }] },
            ]);
        }),
    ];
    for (const [chart, d] of charts) {
        if (groupEl.dataset.dpCharts === 'phone') {
            // The phone frame's charts read the markup way: a JSON child.
            const script = document.createElement('script');
            script.type = 'application/json';
            script.dataset.kpChartData = '';
            script.textContent = JSON.stringify(d);
            chart.append(script);
        } else setChartData(chart, d);
    }
    // A new range: new readings for its window, before the charts redraw.
    groupEl.addEventListener(CHART_RANGE_EVENT, (event) => fillGroup(groupEl, /** @type {CustomEvent<{ range: string }>} */ (event).detail.range));
}
// The sample is a European water company: its clock is 24-hour (the page
// itself is `lang="en"`, which Intl reads as American).
attachCharts(document.getElementById('time-chart') ?? document, { locale: 'en-GB' });
