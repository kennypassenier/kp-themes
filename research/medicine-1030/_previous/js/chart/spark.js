// The spark chart: a plot without axes.
import { drawSparkline } from '../kpi.js';
import { ChartGroup } from './group.js';
import { trendChart } from './trend.js';
import { DATA } from './api.js';
import { dataInMarkup, decorateWith, h, s } from './dom.js';
import { paintSeries, valueFormat } from './attach.js';
import { indexAt, pointsOf } from './selection.js';
import { BLANK, trendAxis } from './time.js';
/** @typedef {import('./api.js').ChartContext} ChartContext */
/** @typedef {import('./words.js').ChartData} ChartData */
/** @typedef {import('./words.js').ChartPoint} ChartPoint */
/** @typedef {import('./words.js').ChartSeries} ChartSeries */
/** @typedef {import('./api.js').ChartState} ChartState */

/**
 * The spark variant: one source's last 24 hours as a tile's sparkline
 * (drawSparkline(), the KPI tile's own drawing), on the group's crosshair,
 * with its value at the crosshair (or now) beside its name.
 * @param {HTMLElement} host
 * @param {ChartGroup} group
 * @param {string} locale
 * @param {ChartContext} ctx
 * @returns {ChartState}
 */
export function sparkChart(host, group, locale, ctx) {
    if (host.dataset.kpSparkHead === 'none') return trendChart(host, group, locale, ctx);
    const doc = host.ownerDocument;
    const { strings, time, decorate } = ctx;
    /** @type {ChartData} */
    let data = DATA.get(host) ?? dataInMarkup(host) ?? { series: [] };
    /** @type {ChartPoint[]} */
    let pts = [];
    const fmt = valueFormat(locale, ctx, () => data);
    /** @type {number | null} */
    let cursor = null;
    const label = () => data.label ?? data.series[0]?.label ?? host.getAttribute('aria-label') ?? '';

    host.classList.add('kp-chart', 'kp-chart--spark');
    const name = h(doc, 'span', { class: 'kp-chart__spark-label' });
    const value = h(doc, 'b', { class: 'kp-chart__spark-value kp-chart__num' });
    const head = h(doc, 'p', { class: 'kp-chart__spark-head' }, name, value);
    const svg = /** @type {SVGSVGElement} */ (/** @type {unknown} */ (s(doc, 'svg', { class: 'kp-chart__spark' })));
    const plot = h(doc, 'div', { class: 'kp-chart__plot kp-chart__spark-plot', tabindex: '0', role: 'application' });
    plot.append(svg);
    const readout = h(doc, 'p', { class: 'kp-chart__readout kp-sr-only', 'aria-live': 'polite' });
    const axis = trendAxisRow(host);
    const parts = [head, plot, ...(axis ? [axis.row] : []), readout];
    host.append(...parts);
    if (data.key != null) host.setAttribute('data-kp-key', data.key);
    decorateWith(decorate, plot, { kind: 'plot', host, key: data.key ?? host.getAttribute('data-kp-key') ?? undefined });

    function draw() {
        const series = data.series[0];
        name.textContent = label();
        if (axis) [axis.from.textContent, axis.to.textContent] = trendWords(pts, series, ctx);
        plot.setAttribute('aria-label', strings.spark(label()));
        if (!series || pts.length < 2) {
            svg.replaceChildren();
            value.textContent = '';
            return;
        }
        drawSparkline(
            svg,
            pts.map((p) => p[1]),
            { parts: 'kp-chart__spark' },
        );
        paintSeries(svg, series, 0);
        const first = pts[0][0];
        const last = pts[pts.length - 1][0];
        const on = cursor != null && cursor >= first && cursor <= last;
        if (on) {
            const k = indexAt(pts, /** @type {number} */ (cursor));
            const cx = (k / (pts.length - 1)) * 100;
            svg.append(s(doc, 'line', { class: 'kp-chart__crosshair', x1: cx, x2: cx, y1: 0, y2: 28, 'vector-effect': 'non-scaling-stroke' }));
            value.textContent = `${time(pts[k][0], 'clock', {})} · ${fmt(pts[k][1], 'spark')}`;
        } else value.textContent = `${strings.now} · ${fmt(pts[pts.length - 1][1], 'spark')}`;
    }

    /** @param {number} t */
    const say = (t) => {
        const k = indexAt(pts, t);
        readout.textContent = `${label()}: ${time(pts[k][0], 'full', {})}, ${fmt(pts[k][1], 'readout')}`;
    };
    plot.addEventListener('pointermove', (e) => {
        if (pts.length < 2) return;
        const r = svg.getBoundingClientRect();
        const k = Math.round(((e.clientX - r.left) / Math.max(1, r.width)) * (pts.length - 1));
        group.cursor(pts[Math.max(0, Math.min(pts.length - 1, k))][0], state);
    });
    plot.addEventListener('pointerleave', () => {
        if (group.owner === state) group.cursor(null, state);
    });
    plot.addEventListener('keydown', (e) => {
        if (pts.length < 2) return;
        let k = cursor == null ? pts.length - 1 : indexAt(pts, cursor);
        const step = e.shiftKey ? 10 : 1;
        if (e.key === 'ArrowLeft') k -= step;
        else if (e.key === 'ArrowRight') k += step;
        else if (e.key === 'Home') k = 0;
        else if (e.key === 'End') k = pts.length - 1;
        else if (e.key === 'Escape') {
            if (cursor == null) return;
            e.stopPropagation();
            group.cursor(null, state);
            return;
        } else return;
        e.preventDefault();
        k = Math.max(0, Math.min(pts.length - 1, k));
        group.cursor(pts[k][0], state);
        say(pts[k][0]);
    });
    plot.addEventListener('blur', () => {
        if (group.owner === state) group.cursor(null, state);
    });

    /** @param {ChartData} next */
    const setData = (next) => {
        data = next;
        if (data.key != null) host.setAttribute('data-kp-key', data.key);
        pts = data.series[0] ? pointsOf(data.series[0]) : [];
        draw();
    };
    pts = data.series[0] ? pointsOf(data.series[0]) : [];

    /** @type {ChartState} */
    const state = {
        host,
        spark: true,
        group,
        draw,
        setData,
        select: () => false,
        cursorAt: (t) => {
            cursor = t;
            draw();
        },
        lastTime: () => pts[pts.length - 1]?.[0] ?? null,
        destroy: () => {
            if (group.owner === state) group.owner = null;
            for (const part of parts) part.remove();
            host.classList.remove('kp-chart', 'kp-chart--spark');
        },
        unobserve: () => {},
    };
    return state;
}
/**
 * The axis row under a trend, when the spark asks for one
 * (`data-kp-spark-axis="relative"`): where the line starts and where it ends.
 * @param {HTMLElement} host
 * @returns {{ row: HTMLElement, from: HTMLElement, to: HTMLElement, read: HTMLElement } | null}
 */
export function trendAxisRow(host) {
    if (host.dataset.kpSparkAxis !== 'relative') return null;
    const doc = host.ownerDocument;
    const from = h(doc, 'span', { class: 'kp-kpi__chart-from' }, BLANK);
    const to = h(doc, 'span', { class: 'kp-kpi__chart-to' }, BLANK);
    // The reading, here only when even a stacked chip is too wide for the trend.
    const read = h(doc, 'span', { class: 'kp-kpi__chart-read' });
    read.hidden = true;
    const row = h(doc, 'span', { class: 'kp-kpi__chart-axis', 'aria-hidden': 'true' }, from, to, read);
    return { row, from, to, read };
}
/**
 * trendAxis() for a spark's points, in its chart context.
 * @param {readonly ChartPoint[]} pts
 * @param {ChartSeries | undefined} series
 * @param {ChartContext} ctx
 */
export function trendWords(pts, series, ctx) {
    const step = series?.step ?? (pts.length > 1 ? pts[pts.length - 1][0] - pts[pts.length - 2][0] : undefined);
    const { now, today, yesterday } = ctx.strings;
    return trendAxis(pts, { now: ctx.now(), step, timeZone: ctx.timeZone, time: ctx.time, words: { now, today, yesterday } });
}
