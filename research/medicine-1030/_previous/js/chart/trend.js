// The trend chart of a key figure.
import { drawSparkline } from '../kpi.js';
import { hostStatePlate } from '../state-plate.js';
import { openBusyCard } from '../busy-card.js';
import { chartState } from './state.js';
import { ChartGroup } from './group.js';
import { DATA } from './api.js';
import { dataInMarkup, decorateWith, h, s } from './dom.js';
import { valueFormat } from './attach.js';
import { trendAxisRow, trendWords } from './spark.js';
import { indexAt, pointsOf } from './selection.js';
import { CHART_RETRY_EVENT } from './constants.js';
/** @typedef {import('./api.js').ChartContext} ChartContext */
/** @typedef {import('./words.js').ChartData} ChartData */
/** @typedef {import('./words.js').ChartPoint} ChartPoint */
/** @typedef {import('./api.js').ChartState} ChartState */

/**
 * The spark variant as a key figure's 24-hour trend
 * (`data-kp-spark-head="none"`): no name and value line; a pointer, a finger
 * or the arrow keys read one point, with a crosshair and a chip over the line
 * (its moment and value, kept inside the trend; the value under the moment
 * when the two do not fit on one line, and in the axis row when even that
 * does not fit). The trend keeps its own crosshair, not the group's. A click
 * that was not a drag follows the tile's `.kp-kpi__link`. The plot is a tab
 * stop only while there are two points or more. Loading (no data yet, or
 * `data-kp-chart-loading`) keeps the trend empty at its height and marks the
 * tile `aria-busy`.
 * @param {HTMLElement} host
 * @param {ChartGroup} group
 * @param {string} locale
 * @param {ChartContext} ctx
 * @returns {ChartState}
 */
export function trendChart(host, group, locale, ctx) {
    const doc = host.ownerDocument;
    const { strings, time, decorate } = ctx;
    /** @type {ChartData | null} */
    let data = DATA.get(host) ?? dataInMarkup(host);
    /** @type {ChartPoint[]} */
    let pts = [];
    const fmt = valueFormat(locale, ctx, () => data ?? { series: [] });
    /** The moment being read, kept across a live update; null while nothing is read. @type {number | null} */
    let at = null;
    /** @type {number | null} */
    let index = null;
    const loading = () => data == null || host.hasAttribute('data-kp-chart-loading');

    const svg = /** @type {SVGSVGElement} */ (/** @type {unknown} */ (s(doc, 'svg', { class: 'kp-kpi__spark' })));
    const cross = h(doc, 'span', { class: 'kp-kpi__chart-cross' });
    cross.hidden = true;
    const chip = h(doc, 'span', { class: 'kp-kpi__chart-chip', 'aria-hidden': 'true' });
    chip.hidden = true;
    const plot = h(doc, 'span', { class: 'kp-kpi__chart-plot', role: 'application' }, svg, cross, chip);
    const keys = h(doc, 'span', { class: 'kp-sr-only', id: `kp-trend-keys-${(chartState.clipIds += 1)}` }, strings.trendKeys);
    plot.setAttribute('aria-describedby', keys.id);
    const axis = trendAxisRow(host);
    const live = h(doc, 'span', { class: 'kp-sr-only', 'aria-live': 'polite' });
    const parts = [plot, ...(axis ? [axis.row] : []), keys, live];
    host.append(...parts);
    if (data?.key != null) host.setAttribute('data-kp-key', data.key);
    decorateWith(decorate, plot, { kind: 'plot', host, key: data?.key ?? host.getAttribute('data-kp-key') ?? undefined });
    const link = /** @type {HTMLElement | null} */ (host.closest('.kp-kpi')?.querySelector('.kp-kpi__link') ?? null);
    /** The busy card over the plot while it loads, and the state plate in the plot's place when it is empty or failed [kyu-plates-1019]. */
    /** @type {import('../busy-card.js').BusyCard | null} */
    let busy = null;
    /** @type {HTMLElement | null} */
    let plate = null;
    /** Set while the busy card leaves: the data is drawn once it has gone. */
    let leaving = false;
    let first = true;

    const hide = () => {
        at = null;
        index = null;
        cross.hidden = true;
        chip.hidden = true;
        if (axis) {
            axis.read.hidden = true;
            axis.from.hidden = false;
            axis.to.hidden = false;
        }
    };

    /**
     * Read point `k`: the crosshair, and the chip with its moment and value
     * over the line, inside the trend.
     * @param {number} k
     * @param {boolean} [announce] say it to a screen reader (keys only)
     */
    const show = (k, announce = false) => {
        if (pts.length < 2) return;
        const i = Math.max(0, Math.min(pts.length - 1, k));
        const [ms, value] = pts[i];
        at = ms;
        index = i;
        const width = plot.clientWidth;
        const x = (i / (pts.length - 1)) * width;
        const moment = time(ms, 'full', {});
        const shown = fmt(value, 'spark');
        cross.style.insetInlineStart = `${x}px`;
        cross.hidden = false;
        const words = () => [h(doc, 'span', { class: 'kp-kpi__chart-at' }, moment), h(doc, 'span', { class: 'kp-kpi__chart-value' }, shown)];
        chip.replaceChildren(...words());
        chip.hidden = false;
        chip.removeAttribute('data-kp-stacked');
        let chipWidth = chip.offsetWidth;
        if (chipWidth > width) {
            chip.setAttribute('data-kp-stacked', '');
            chipWidth = chip.offsetWidth;
        }
        const toAxis = chipWidth > width && axis != null;
        if (!toAxis) chip.style.insetInlineStart = `${Math.max(0, Math.min(width - chipWidth, x - chipWidth / 2))}px`;
        chip.hidden = toAxis;
        if (axis) {
            axis.read.replaceChildren(...(toAxis ? words() : []));
            axis.read.hidden = !toAxis;
            axis.from.hidden = toAxis;
            axis.to.hidden = toAxis;
        }
        if (announce) live.textContent = `${moment} · ${fmt(value, 'readout')}`;
    };

    /** @returns {'loading' | 'error' | 'empty' | 'ready'} */
    const kind = () =>
        loading() ? 'loading' : data?.error ? 'error' : (data?.series[0] ? pointsOf(data.series[0]).length : 0) === 0 ? 'empty' : 'ready';

    /** The state plate, or nothing: the plot and the axis give way to it while it stands. @param {'empty' | 'error' | null} k */
    function setPlate(k) {
        plate?.remove();
        plate = null;
        plot.hidden = k !== null;
        if (axis) axis.row.hidden = k !== null;
        if (k === null) return;
        plate = hostStatePlate(host, {
            kind: k,
            title: k === 'error' ? (data?.error ?? strings.trendFailed) : strings.empty,
            ...(k === 'error' && data?.errorText ? { text: data.errorText } : {}),
            art: data?.art,
            retryEvent: CHART_RETRY_EVENT,
            retryLabel: strings.retry,
        });
        // The Retry goes with the state: the focus goes to the tile's link first, as a chart's Retry hands it to its plot.
        plate.addEventListener(
            'click',
            (event) => {
                if (event.target instanceof Element && event.target.closest('button')) link?.focus({ preventScroll: true });
            },
            true,
        );
        host.append(plate);
    }

    function draw() {
        const series = data?.series[0];
        const k = kind();
        host.setAttribute('data-kp-state', k);
        setPlate(k === 'empty' || k === 'error' ? k : null);
        if (k === 'loading') {
            if (busy && !leaving) busy.place();
            else if (!busy) busy = openBusyCard(host, { words: strings.loading, area: () => [plot], className: 'kp-kpi__busy', arrive: !first });
        } else if (busy && !leaving) {
            busy.remove();
            busy = null;
        }
        first = false;
        pts = k === 'ready' && series ? pointsOf(series) : [];
        plot.setAttribute('aria-label', data?.label ?? host.getAttribute('aria-label') ?? series?.label ?? '');
        drawSparkline(
            svg,
            pts.map((p) => p[1]),
        );
        if (axis) [axis.from.textContent, axis.to.textContent] = trendWords(pts, series, ctx);
        const usable = pts.length >= 2;
        if (usable) plot.tabIndex = 0;
        else plot.removeAttribute('tabindex');
        const tile = host.closest('.kp-kpi');
        if (loading()) tile?.setAttribute('aria-busy', 'true');
        else tile?.removeAttribute('aria-busy');
        if (!usable) hide();
        else if (at != null) show(indexAt(pts, at));
    }

    /** @param {number} clientX */
    const indexAtX = (clientX) => {
        const box = plot.getBoundingClientRect();
        return Math.round(((clientX - box.left) / Math.max(1, box.width)) * (pts.length - 1));
    };
    /** @type {{ x: number, moved: boolean, touch: boolean } | null} */
    let press = null;
    /** @param {PointerEvent} event */
    const onDown = (event) => {
        press = { x: event.clientX, moved: false, touch: event.pointerType !== 'mouse' };
        if (press.touch) {
            try {
                plot.setPointerCapture(event.pointerId);
            } catch {
                // A pointer the browser no longer knows (a synthetic one): read without capture.
            }
            show(indexAtX(event.clientX));
        }
    };
    /** @param {PointerEvent} event */
    const onMove = (event) => {
        if (press && Math.abs(event.clientX - press.x) > 6) press.moved = true;
        if (event.pointerType === 'mouse' || press) show(indexAtX(event.clientX));
    };
    /** @param {PointerEvent} event */
    const onLeave = (event) => {
        if (event.pointerType === 'mouse') hide();
    };
    const onCancel = () => {
        press = null;
        hide();
    };
    /** @param {MouseEvent} event */
    const onClick = (event) => {
        const dragged = press?.moved ?? false;
        press = null;
        // A click without a drag follows the tile's link, as a click anywhere
        // else on the tile does; a drag only read the trend.
        if (!dragged && link && event.button === 0) link.click();
    };
    /** @param {KeyboardEvent} event */
    const onKey = (event) => {
        const n = pts.length;
        if (n < 2) return;
        const shown = !cross.hidden;
        const from = index ?? n - 1;
        /** @type {number | null} */
        let to = null;
        if (event.key === 'ArrowLeft') to = shown ? from - (event.shiftKey ? 10 : 1) : n - 1;
        else if (event.key === 'ArrowRight') to = shown ? from + (event.shiftKey ? 10 : 1) : n - 1;
        else if (event.key === 'Home') to = 0;
        else if (event.key === 'End') to = n - 1;
        else if (event.key === 'Escape' && shown) {
            event.preventDefault();
            event.stopPropagation();
            hide();
            return;
        }
        if (to == null) return;
        event.preventDefault();
        show(to, true);
    };
    plot.addEventListener('pointerdown', onDown);
    plot.addEventListener('pointermove', onMove);
    plot.addEventListener('pointerleave', onLeave);
    plot.addEventListener('pointercancel', onCancel);
    plot.addEventListener('click', onClick);
    plot.addEventListener('keydown', onKey);
    plot.addEventListener('blur', hide);

    /** @type {ChartState} */
    const state = {
        host,
        spark: true,
        group,
        draw,
        setData: (next) => {
            data = next;
            if (data.key != null) host.setAttribute('data-kp-key', data.key);
            if (busy && !leaving && kind() !== 'loading') {
                // The busy card leaves the theme's way first, and nothing is drawn under it on its way out.
                const card = busy;
                busy = null;
                leaving = true;
                void card.close().then(() => {
                    leaving = false;
                    draw();
                });
                return;
            }
            if (!leaving) draw();
        },
        select: () => false,
        // The trend reads on its own crosshair, not the group's.
        cursorAt: () => {},
        lastTime: () => pts[pts.length - 1]?.[0] ?? null,
        destroy: () => {
            for (const part of parts) part.remove();
            plate?.remove();
            busy?.remove();
            host.removeAttribute('data-kp-state');
            host.closest('.kp-kpi')?.removeAttribute('aria-busy');
        },
        unobserve: () => {},
    };
    return state;
}
