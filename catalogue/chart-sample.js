// The catalogue's made-up readings for the time chart (catalogue/chart.html)
// [scope-143]: a water company's pump houses, the same on every load and in
// every time zone. Pure: nothing runs on import, so the JSON children on the
// page can be written from it once (node) and demos.js draws a new range
// from it in the browser.
//
// "Now" is Sunday 4 October 2026, 09:00 in Brussels (07:00 UTC); the hours
// of the day the demand follows are Brussels hours, so the morning peak is
// a morning peak wherever the page is read.

export const NOW = Date.UTC(2026, 9, 4, 7, 0);
const HOUR = 3_600_000;
const DAY = 24 * HOUR;
/** Brussels is two hours ahead of UTC on these dates (summer time). */
const OFFSET = 2 * HOUR;
/** A local Brussels time on 4 October 2026, `days` before it. @param {number} hour @param {number} minute @param {number} [days] */
const at = (hour, minute, days = 0) => Date.UTC(2026, 9, 4 - days, hour, minute) - OFFSET;

/** The step of each range: a minute, five minutes, an hour. @type {Record<string, number>} */
const STEPS = { '1h': 60_000, '24h': 300_000, '7d': HOUR };
/** Each range's span. @type {Record<string, number>} */
const SPANS = { '1h': HOUR, '24h': DAY, '7d': 7 * DAY };

/** Noise from the time alone, so every range draws the same readings. @param {number} t @param {number} k */
const noise = (t, k) => {
    const v = Math.sin((t / 60_000) * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v) - 0.5;
};

/** The network's demand at `t`: a morning and an evening peak, a quiet night. @param {number} t */
const demand = (t) => {
    const h = ((((t + OFFSET) % DAY) + DAY) % DAY) / HOUR;
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

/** @typedef {{ label: string, at: (t: number) => number }} Source */

/** @type {Source[]} */
export const PRESSURE = [
    { label: 'Pump house 1', at: (t) => 3.7 - 0.45 * demand(t) + 0.05 * noise(t, 1) },
    { label: 'Pump house 3', at: (t) => 3.15 - 0.5 * demand(t) - 0.75 * sag(t) + 0.05 * noise(t, 3) },
    { label: 'Pump house 7', at: (t) => 2.95 - 0.35 * demand(t) + 0.05 * noise(t, 7) },
];

/** @type {Source[]} */
const FLOW = [120, 95, 80, 70, 55, 45, 30].map((base, k) => ({
    label: `Pump house ${k + 1}`,
    at: (/** @type {number} */ t) => base * demand(t) * (k === 2 ? 1 - 0.5 * sag(t) : 1) + 3 * noise(t, k + 11),
}));

const LINK = '#time-chart';
/** @type {import('../js/chart.js').ChartEvent[]} */
const EVENTS = [
    ...Array.from({ length: 7 }, (_, d) => ({ at: at(2, 0, d), label: 'Backup', tone: /** @type {const} */ ('info'), href: LINK })),
    { at: at(6, 10), label: 'Valve swap, ring main', tone: 'info', href: LINK },
    { at: at(7, 32), label: 'Alarm: pump house 3 below 2.1 bar', tone: 'critical', href: LINK },
    { at: at(8, 12), label: 'Pump restart, pump house 3', tone: 'warning', href: LINK },
    { at: at(14, 20, 2), label: 'Valve swap, reservoir North', tone: 'info', href: LINK },
    { at: at(11, 5, 4), label: 'Alarm: pump house 7 no reading', tone: 'critical', href: LINK },
];

/**
 * A source's readings over `span` up to now, one per `step`, compact.
 * @param {Source} source @param {number} span @param {number} step @param {number} digits
 * @returns {import('../js/chart.js').ChartSeries}
 */
const series = (source, span, step, digits) => {
    const start = NOW - span;
    const values = Array.from({ length: Math.round(span / step) + 1 }, (_, i) => Number(source.at(start + i * step).toFixed(digits)));
    return { label: source.label, start, step, values };
};

/**
 * The data of one sample chart for a range: `pressure` (three sources, an
 * alarm level, the events), `flow` (seven sources, so the colours come round
 * again dashed), `alone` (pump house 3 by itself), or `spark-0` to `spark-2`
 * (one pump house's last 24 hours, in its colour from the pressure chart).
 * @param {string} name
 * @param {string} [range] '1h', '24h' or '7d'
 * @returns {import('../js/chart.js').ChartData}
 */
export function sampleData(name, range = '24h') {
    const span = SPANS[range] ?? DAY;
    const step = STEPS[range] ?? 300_000;
    if (name === 'pressure')
        return { label: 'Pressure', unit: 'bar', digits: 2, threshold: 2.1, series: PRESSURE.map((p) => series(p, span, step, 2)), events: EVENTS };
    if (name === 'flow') return { label: 'Flow', unit: 'm³/h', digits: 0, series: FLOW.map((f) => series(f, span, step, 0)), events: EVENTS };
    if (name === 'alone')
        return { label: 'Pump house 3', unit: 'bar', digits: 2, threshold: 2.1, series: [series(PRESSURE[1], span, step, 2)], events: EVENTS };
    const k = Number(name.replace('spark-', ''));
    const source = PRESSURE[k] ?? PRESSURE[0];
    // A source keeps its colour from the pressure chart: colour follows the
    // pump house, not its place in a one-source chart.
    return { label: source.label, unit: 'bar', digits: 2, series: [{ ...series(source, DAY, 300_000, 2), colour: `var(--chart-${k + 1})` }] };
}

const GIB = 2 ** 30;
const MIB = 2 ** 20;
/** One reading per quarter of an hour over the day up to now. @param {(t: number) => number} at @returns {Pick<import('../js/chart.js').ChartSeries, 'start' | 'step' | 'values'>} */
const quarterly = (at) => {
    const step = 15 * 60_000;
    const start = NOW - DAY;
    return { start, step, values: Array.from({ length: DAY / step + 1 }, (_, i) => at(start + i * step)) };
};

/**
 * The control room's telemetry server, one chart per unit kind [scope-143]:
 * `memory` (bytes), `network` (bytes/s), `cpu` (percent, the import job
 * above 100 on several cores), `readings` (count, with the day's totals).
 * @param {'memory' | 'network' | 'cpu' | 'readings'} name
 * @returns {import('../js/chart.js').ChartData}
 */
export function unitData(name) {
    if (name === 'memory')
        return {
            label: 'Memory',
            unitKind: 'bytes',
            series: [
                { label: 'Used', ...quarterly((t) => Math.round((1.2 + 0.35 * demand(t) + 0.03 * noise(t, 21)) * GIB)) },
                { label: 'Cache', ...quarterly((t) => Math.round((0.55 + 0.05 * noise(t, 22)) * GIB)) },
            ],
        };
    if (name === 'network')
        return {
            label: 'Network',
            unitKind: 'bytes/s',
            series: [
                { label: 'In', ...quarterly((t) => Math.round((1.4 + 2.2 * demand(t) + 0.2 * noise(t, 23)) * MIB)) },
                { label: 'Out', ...quarterly((t) => Math.round((0.3 + 0.6 * demand(t) + 0.05 * noise(t, 24)) * MIB)) },
            ],
        };
    if (name === 'cpu')
        return {
            label: 'Processor',
            unitKind: 'percent',
            series: [
                { label: 'Telemetry import', ...quarterly((t) => Number((20 + 110 * demand(t) ** 2 + 4 * noise(t, 25)).toFixed(1))) },
                { label: 'Web', ...quarterly((t) => Number((6 + 12 * demand(t) + 2 * noise(t, 26)).toFixed(1))) },
            ],
        };
    return {
        label: 'Meter readings',
        unitKind: 'count',
        series: [
            { label: 'Received', total: 1183402, ...quarterly((t) => Math.round(6000 + 9000 * demand(t) + 300 * noise(t, 27))) },
            { label: 'Rejected', total: 1534, ...quarterly((t) => Math.max(0, Math.round(12 + 8 * noise(t, 28)))) },
        ],
    };
}
