// The chart's data setter and its public state object.
import { nextSelection, pointsOf } from '../selection.js';
/** @typedef {import('../words.js').ChartData} ChartData */
/** @typedef {import('../api.js').ChartState} ChartState */
/** @typedef {import('./context.js').PlotContext} PlotContext */

/**
 * What the the chart's data setter and its public state object part adds to the table's context.
 *
 * @typedef {{
 *     state: ChartState;
 * }} ApiFields
 */

/**
 * The chart's data setter and its public state object.
 *
 * @param {PlotContext} c
 */
export function installApi(c) {
    const { buildLegend, decorateOwn, doc, draw, drawnKey, group, host, key, label, legend, parts, plot, range, setSel, strings } = c;

    // A page that sets or clears `data-kp-chart-loading` itself.
    // (the feed removes `data-kp-chart-loading` just before it draws, which this watch need not draw again)
    const watch = new (doc.defaultView ?? globalThis).MutationObserver(() => {
        const asked = `${host.hasAttribute('data-kp-chart-loading')} ${host.getAttribute('data-kp-chart-sources')}`;
        if (!c.drawnFor.endsWith(asked)) draw();
    });
    watch.observe(host, { attributes: true, attributeFilter: ['data-kp-chart-loading', 'data-kp-chart-sources'] });
    /** @param {ChartData} next */
    const setData = (next) => {
        const sameSources = next.series.length === c.data.series.length && next.series.every((sr, i) => sr.label === c.data.series[i].label);
        const keyBefore = key();
        c.data = next;
        if (c.data.key != null) host.setAttribute('data-kp-key', c.data.key);
        c.points = c.data.series.map(pointsOf);
        if (!sameSources) {
            const had = c.sel.size > 0;
            c.sel = new Set();
            c.hot = null;
            buildLegend();
            if (had) setSel(c.sel);
        } else {
            legend.setAttribute('aria-label', strings.sources(label()));
            plot.setAttribute('aria-label', strings.plot(label()));
        }
        if (key() !== keyBefore) decorateOwn();
        // The group's window follows its newest point: this chart draws, and a neighbour only when that window moved under it
        // (a feed to sixteen charts of a group no longer draws every chart sixteen times).
        draw();
        for (const c of group.charts) if (c !== state && (!c.stale || c.stale())) c.draw();
    };
    if (c.data.key != null) host.setAttribute('data-kp-key', c.data.key);
    c.points = c.data.series.map(pointsOf);
    buildLegend();
    decorateOwn();
    /** @type {ChartState} */
    const state = {
        host,
        spark: false,
        group,
        draw,
        view: (inView) => {
            c.held = !inView;
            if (inView && c.behind) draw();
        },
        resize: () => {
            if (drawnKey() !== c.drawnFor) draw();
        },
        stale: () => {
            if (!c.drawnWindow) return false;
            const win = range();
            return !win || `${win.from} ${win.to}` !== c.drawnWindow;
        },
        setData,
        select: (i, on) => {
            const next = nextSelection(c.sel, i, c.data.series.length, on);
            if (!next) return false;
            setSel(next);
            draw();
            return true;
        },
        cursorAt: (t, own) => {
            c.cursor = t;
            if (!own && t == null) c.hot = null;
            draw();
        },
        lastTime: () => {
            const last = c.points.map((p) => p[p.length - 1]?.[0] ?? -Infinity);
            const max = Math.max(-Infinity, ...last);
            return Number.isFinite(max) ? max : null;
        },
        destroy: () => {
            watch.disconnect();
            if (group.owner === state) group.owner = null;
            for (const part of parts) part.remove();
            host.classList.remove('kp-chart');
        },
        unobserve: () => {},
    };
    c.state = state;
}
