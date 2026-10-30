// Draws the chart: the state plate and the plot itself.
import { h, keepEndsInside, s } from '../dom.js';
import { CHART_RETRY_EVENT } from '../constants.js';
import { statePlate } from '../../state-plate.js';
import { chartHeight, paintSeries } from '../attach.js';
import { niceMax } from '../format.js';
import { timeTicks } from '../time.js';
import { chartMedian, chartRuns } from '../stats.js';
import { indexAt } from '../selection.js';
/** @typedef {import('../words.js').ChartPoint} ChartPoint */
/** @typedef {import('./context.js').PlotContext} PlotContext */

/**
 * What the draws the chart: the state plate and the plot itself part adds to the table's context.
 *
 * @typedef {{
 *     draw: () => void;
 * }} DrawFields
 */

/**
 * Draws the chart: the state plate and the plot itself.
 *
 * @param {PlotContext} c
 */
export function installDraw(c) {
    const {
        annKey,
        buildLegend,
        clip,
        ctx,
        doc,
        drawnKey,
        fmt,
        hint,
        host,
        label,
        legend,
        medianWords,
        note,
        option,
        paintKey,
        plot,
        range,
        readout,
        shownEvents,
        skeletonLegend,
        strings,
        time,
        tip,
        toneOf,
        visible,
    } = c;
    c.draw = draw;

    /**
     * The plot at its height with no lines: loading (a pulse), empty or an
     * error (a sentence), so the card keeps its place in every state.
     * @param {'loading' | 'empty' | 'error'} kind
     * @param {number} H
     */
    function drawState(kind, H) {
        c.geo = null;
        // The state on the host too, so js/footprint.js holds the loaded height while it shows.
        host.setAttribute('data-kp-state', kind);
        // A key already drawn keeps its room (unseen), so the chart's height is the same in every state.
        if (c.keyMemo) annKey.setAttribute('data-kp-wait', '');
        else annKey.hidden = true;
        tip.hidden = true;
        note.hidden = true;
        hint.hidden = true;
        const box = h(doc, 'div', {
            class: kind === 'loading' ? 'kp-chart__state kp-skeleton kp-skeleton--block' : 'kp-chart__state',
            'data-kp-state': kind,
        });
        // The plot's own height, borders and padding inside it.
        box.style.boxSizing = 'border-box';
        box.style.blockSize = `${H}px`;
        const words = kind === 'loading' ? strings.loading : kind === 'error' ? (c.data.error ?? '') : strings.empty;
        if (kind === 'loading') box.append(h(doc, 'span', { class: 'kp-sr-only' }, words));
        else if (kind === 'error') {
            // The failed plate is the package's own (`statePlate`: the destructive alert every other failed area uses, so each
            // register dresses it): what failed, and a normal Retry under it (`kp-chart-retry`). The button goes with the state,
            // so the focus moves to the plot first, as a card's Try again hands it to its stage.
            box.append(
                statePlate(doc, {
                    kind: 'error',
                    title: words,
                    actionLabel: strings.retry,
                    onAction: () => {
                        plot.focus({ preventScroll: true });
                        host.dispatchEvent(new CustomEvent(CHART_RETRY_EVENT, { bubbles: true }));
                    },
                }),
            );
        } else box.append(h(doc, 'div', { class: 'kp-chart__state-text' }, words));
        plot.replaceChildren(box);
        // Said once, not on every redraw.
        if (c.shown !== `${kind} ${words}`) {
            c.shown = `${kind} ${words}`;
            if (kind !== 'loading') readout.textContent = `${label()}: ${words}`;
        }
    }
    function draw() {
        const H = chartHeight(host, c.data);
        c.drawnWindow = '';
        c.drawnFor = drawnKey();
        const loading = host.hasAttribute('data-kp-chart-loading');
        plot.setAttribute('aria-busy', String(loading));
        if (loading) {
            skeletonLegend();
            drawState('loading', H);
            return;
        }
        if (c.skeleton) buildLegend();
        legend.hidden = c.data.series.length <= 1;
        if (c.data.error) {
            drawState('error', H);
            return;
        }
        const win = range();
        if (!win || c.points.every((p) => p.length === 0)) {
            drawState('empty', H);
            return;
        }
        if (c.held) {
            // Off screen: the plot keeps its footprint (the loading plate) and is drawn as it comes into view.
            c.behind = true;
            if (!c.geo && c.shown === '') drawState('loading', H);
            return;
        }
        c.behind = false;
        c.shown = '';
        host.setAttribute('data-kp-state', 'ready');
        hint.hidden = c.data.series.length <= 1;
        const { from, to } = win;
        c.drawnWindow = `${from} ${to}`;
        const W = Math.max(240, plot.clientWidth);
        const vis = visible();
        const stacked = c.data.stacked ?? false;
        const kind = c.data.unitKind;
        const thresholds = (Array.isArray(c.data.threshold) ? c.data.threshold : c.data.threshold != null ? [c.data.threshold] : []).filter(
            Number.isFinite,
        );
        const inR = (/** @type {ChartPoint} */ p) => p[0] >= from && p[0] <= to;
        let hi = c.data.yMax ?? 0;
        if (c.data.yMax == null) {
            if (stacked) {
                (c.points[0] ?? []).forEach((p, k) => {
                    if (inR(p))
                        hi = Math.max(
                            hi,
                            vis.reduce((sum, si) => sum + (c.points[si][k]?.[1] ?? 0), 0),
                        );
                });
            } else for (const si of vis) for (const p of c.points[si]) if (inR(p)) hi = Math.max(hi, p[1]);
            for (const level of thresholds) hi = Math.max(hi, level * 1.08);
            hi = niceMax(hi, kind);
        }
        const ticksY = [0, hi / 2, hi].map((v) => fmt(v, 'axis'));
        const P = { l: Math.max(30, Math.max(...ticksY.map((t) => t.length)) * 7 + 12), r: 10, t: 18, b: 22 };
        const x = (/** @type {number} */ t) => P.l + ((t - from) / (to - from)) * (W - P.l - P.r);
        const y = (/** @type {number} */ v) => H - P.b - (v / hi) * (H - P.t - P.b);
        const svg = /** @type {SVGSVGElement} */ (s(doc, 'svg', { viewBox: `0 0 ${W} ${H}`, height: H, 'aria-hidden': 'true' }));
        const defs = s(doc, 'defs');
        const cp = s(doc, 'clipPath', { id: clip });
        cp.append(s(doc, 'rect', { x: P.l, y: 0, width: W - P.l - P.r, height: H }));
        defs.append(cp);
        svg.append(defs);
        [0, hi / 2, hi].forEach((v, k) => {
            svg.append(s(doc, 'line', { class: 'kp-chart__grid', x1: P.l, x2: W - P.r, y1: y(v), y2: y(v) }));
            const tick = s(doc, 'text', { class: 'kp-chart__tick', x: P.l - 6, y: y(v) + 4, 'text-anchor': 'end' });
            tick.textContent = ticksY[k];
            svg.append(tick);
        });
        // Time ticks on round wall-clock times in the group's zone: 15 or
        // 30 min, one, two, three, six or twelve hours, or days (the
        // dashboard's tiers, with 30 min and 3 h added so a zoomed span keeps
        // more than one tick), at least 70 px apart.
        const most = Math.max(2, Math.floor((W - P.l - P.r) / 70));
        const axisKey = `${from} ${to} ${most} ${ctx.timeZone}`;
        if (axisKey !== c.axisMemo.key) c.axisMemo = { key: axisKey, axis: timeTicks(from, to, most, ctx.timeZone) };
        const { axis } = c.axisMemo;
        /** @type {SVGTextElement[]} */
        const axisLabels = [];
        for (const t of axis.ticks) {
            const tick = /** @type {SVGTextElement} */ (s(doc, 'text', { class: 'kp-chart__tick', x: x(t), y: H - 6, 'text-anchor': 'middle' }));
            tick.textContent = time(t, 'tick', { stride: axis.stride });
            svg.append(tick);
            axisLabels.push(tick);
        }
        const g = s(doc, 'g', { 'clip-path': `url(#${clip})` });
        svg.append(g);
        thresholds.forEach((level, k) =>
            g.append(
                s(doc, 'line', {
                    class: k === 0 ? 'kp-chart__threshold' : 'kp-chart__threshold kp-chart__threshold--more',
                    x1: P.l,
                    x2: W - P.r,
                    y1: y(level),
                    y2: y(level),
                }),
            ),
        );
        const opt = option();
        /** The hatch patterns this drawing needs, one per tone. @type {Set<string>} */
        const hatches = new Set();
        const pool = shownEvents();
        // A band (an event with `until`) is in the window while any of it is; the rest count at the edge.
        const events = pool.filter((ev) => ev.at <= to && (ev.until ?? ev.at) >= from);
        const beforeCount = pool.filter((ev) => (ev.until ?? ev.at) < from).length;
        const afterCount = pool.filter((ev) => ev.at > to).length;
        for (const ev of events) {
            if (ev.until != null && ev.until > ev.at) {
                const x0 = x(Math.max(ev.at, from));
                const x1 = x(Math.min(ev.until, to));
                const tone = toneOf(ev);
                const band = s(doc, 'g', { class: 'kp-chart__band', 'data-kp-tone': tone, 'data-kp-band': opt.band });
                if (opt.band === 'bracket') {
                    // Only a bracket along the top: a bar between two short ticks, nothing across the readings.
                    band.append(s(doc, 'line', { class: 'kp-chart__band-bar', x1: x0, x2: x1, y1: P.t - 4, y2: P.t - 4 }));
                    if (ev.at >= from) band.append(s(doc, 'line', { class: 'kp-chart__band-edge', x1: x0, x2: x0, y1: P.t - 4, y2: P.t + 8 }));
                    if (ev.until <= to) band.append(s(doc, 'line', { class: 'kp-chart__band-edge', x1: x1, x2: x1, y1: P.t - 4, y2: P.t + 8 }));
                } else {
                    let fill = '';
                    if (opt.band === 'hatch') {
                        const id = `${clip}-hatch-${tone}`;
                        if (!hatches.has(id)) {
                            hatches.add(id);
                            const pattern = s(doc, 'pattern', {
                                id,
                                width: 6,
                                height: 6,
                                patternUnits: 'userSpaceOnUse',
                                patternTransform: 'rotate(45)',
                                'data-kp-tone': tone,
                            });
                            pattern.append(s(doc, 'line', { class: 'kp-chart__hatch', x1: 0, y1: 0, x2: 0, y2: 6 }));
                            defs.append(pattern);
                        }
                        fill = `url(#${id})`;
                    }
                    const rect = s(doc, 'rect', {
                        class: 'kp-chart__band-fill',
                        x: x0,
                        y: P.t - 4,
                        width: Math.max(1, x1 - x0),
                        height: H - P.b - P.t + 4,
                    });
                    if (fill) rect.setAttribute('fill', fill);
                    band.append(rect);
                    if (ev.at >= from) band.append(s(doc, 'line', { class: 'kp-chart__band-edge', x1: x0, x2: x0, y1: P.t - 4, y2: H - P.b }));
                    if (ev.until <= to) band.append(s(doc, 'line', { class: 'kp-chart__band-edge', x1: x1, x2: x1, y1: P.t - 4, y2: H - P.b }));
                }
                g.append(band);
            } else g.append(s(doc, 'line', { class: 'kp-chart__event-line', x1: x(ev.at), x2: x(ev.at), y1: P.t - 4, y2: H - P.b }));
        }
        const have = Math.max(0, ...c.points.map((p) => p.length));
        const few = opt.minPoints > 0 && have < opt.minPoints;
        const base = (c.points[0] ?? []).map(() => 0);
        const fill = vis.length <= 2 && !stacked;
        c.data.series.forEach((series, si) => {
            // Too few readings for a trend: no line, no area and no dot is drawn, only the empty plot and the sentence
            // (Kenny, 2026-10-18 17:45: a faint line still showed through the "3 of 7 days" plate).
            if (!vis.includes(si) || few) return;
            const pts = c.points[si].map((p, k) => [x(p[0]), y(stacked ? (base[k] ?? 0) + p[1] : p[1])]);
            if (pts.length === 0) return;
            const d = pts.map((p, k) => `${k ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
            const sg = s(doc, 'g', { class: 'kp-chart__series' });
            paintSeries(sg, series, si);
            if (c.hot != null) sg.setAttribute('data-kp-state', c.hot === si ? 'hot' : 'dim');
            if (series.shape === 'columns') {
                // A histogram: one column per reading, 76 % of the room its neighbours leave, stood on the baseline (or on the
                // columns below it when stacked) [wish-1120, homelab 104].
                const gap = pts.length > 1 ? Math.min(...pts.slice(1).map((p, k) => p[0] - pts[k][0])) : (W - P.l - P.r) / 12;
                const width = Math.max(1.5, Math.min(48, gap * 0.76));
                pts.forEach((p, k) => {
                    const bottom = y(stacked ? (base[k] ?? 0) : 0);
                    sg.append(
                        s(doc, 'rect', {
                            class: 'kp-chart__column',
                            x: (p[0] - width / 2).toFixed(1),
                            y: Math.min(p[1], bottom).toFixed(1),
                            width: width.toFixed(1),
                            height: Math.max(0, bottom - p[1]).toFixed(1),
                        }),
                    );
                });
                if (stacked) c.points[si].forEach((p, k) => (base[k] = (base[k] ?? 0) + p[1]));
                g.append(sg);
                return;
            }
            if (stacked) {
                const back = c.points[si]
                    .map((p, k) => [x(p[0]), y(base[k] ?? 0)])
                    .reverse()
                    .map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`)
                    .join('');
                sg.append(s(doc, 'path', { class: 'kp-chart__area kp-chart__area--stacked', d: `${d}${back}Z` }));
                c.points[si].forEach((p, k) => (base[k] = (base[k] ?? 0) + p[1]));
            } else if (fill) {
                const last = pts[pts.length - 1];
                sg.append(
                    s(doc, 'path', {
                        class: vis.length === 1 ? 'kp-chart__area kp-chart__area--alone' : 'kp-chart__area',
                        d: `${d}L${last[0]},${y(0)}L${pts[0][0]},${y(0)}Z`,
                    }),
                );
            }
            sg.append(s(doc, 'path', { class: 'kp-chart__line', d }));
            g.append(sg);
            // A lone reading's dot outside the clip, so one at the window's
            // edge (the newest) shows whole.
            if (pts.length === 1 && inR(c.points[si][0])) {
                const dot = s(doc, 'g', { class: 'kp-chart__series' });
                paintSeries(dot, series, si);
                if (c.hot != null) dot.setAttribute('data-kp-state', c.hot === si ? 'hot' : 'dim');
                dot.append(s(doc, 'circle', { class: 'kp-chart__point', cx: pts[0][0], cy: pts[0][1], r: 3.5 }));
                svg.append(dot);
            }
        });
        // The median of each shown source and, when asked, the runs of six or more on one side of it.
        c.medians = [];
        if (opt.median && !stacked && !few) {
            for (const si of vis) {
                const inside = c.points[si].filter(inR);
                const m = chartMedian(inside.map((p) => p[1]));
                if (m != null) c.medians.push({ si, label: c.data.series[si].label || label(), v: m });
            }
            for (const m of c.medians) {
                const sg = s(doc, 'g', { class: 'kp-chart__series kp-chart__median-series' });
                paintSeries(sg, c.data.series[m.si], m.si);
                sg.append(s(doc, 'line', { class: 'kp-chart__median', x1: P.l, x2: W - P.r, y1: y(m.v), y2: y(m.v) }));
                g.append(sg);
                if (opt.runs) {
                    const inside = c.points[m.si].filter(inR);
                    const marked = chartRuns(
                        inside.map((p) => p[1]),
                        m.v,
                    );
                    // One ring is built, the rest are copies of it: a typical-level chart marks hundreds.
                    const proto = s(doc, 'g', { class: 'kp-chart__series kp-chart__run-series' });
                    paintSeries(proto, c.data.series[m.si], m.si);
                    proto.append(s(doc, 'circle', { class: 'kp-chart__run', cx: 0, cy: 0, r: 4.25 }));
                    const rings = doc.createDocumentFragment();
                    for (const i of marked) {
                        const ring = /** @type {SVGGElement} */ (proto.cloneNode(true));
                        const circle = /** @type {SVGCircleElement} */ (ring.firstChild);
                        circle.setAttribute('cx', String(x(inside[i][0])));
                        circle.setAttribute('cy', String(y(inside[i][1])));
                        rings.append(ring);
                    }
                    g.append(rings);
                }
            }
            if (c.medians.length === 1) {
                const m = c.medians[0];
                const up = y(m.v) - 6 < P.t + 8;
                const text = s(doc, 'text', {
                    class: 'kp-chart__median-label',
                    x: W - P.r - 4,
                    y: up ? y(m.v) + 14 : y(m.v) - 6,
                    'text-anchor': 'end',
                });
                text.textContent = `${medianWords(opt)} ${fmt(m.v, 'tip')}`;
                svg.append(text);
            }
        }
        for (const ev of events) {
            const at = Math.min(to, Math.max(from, ev.at));
            const mark = s(doc, 'g', { class: 'kp-chart__mark', 'data-kp-tone': toneOf(ev), 'data-at': at });
            mark.append(s(doc, 'circle', { class: 'kp-chart__mark-hit', cx: x(at), cy: P.t - 9, r: 10 }));
            mark.append(s(doc, 'circle', { class: 'kp-chart__mark-dot', cx: x(at), cy: P.t - 9, r: 5 }));
            const title = s(doc, 'title');
            title.textContent =
                ev.until != null && ev.until > ev.at
                    ? strings.markBand(ev.label, time(ev.at, 'full', {}), time(ev.until, 'full', {}))
                    : strings.mark(ev.label, time(ev.at, 'full', {}));
            mark.append(title);
            svg.append(mark);
        }
        // Events past the window: an arrow at that edge with their count.
        for (const [count, side] of /** @type {const} */ ([
            [beforeCount, 'start'],
            [afterCount, 'end'],
        ])) {
            if (count === 0) continue;
            const edge = s(doc, 'g', { class: 'kp-chart__edge', 'data-kp-side': side });
            const text = s(doc, 'text', {
                class: 'kp-chart__edge-text',
                x: side === 'start' ? P.l + 2 : W - P.r - 2,
                y: P.t - 5,
                'text-anchor': side === 'start' ? 'start' : 'end',
            });
            text.textContent = side === 'start' ? `◂ ${count}` : `${count} ▸`;
            const title = s(doc, 'title');
            title.textContent = side === 'start' ? strings.edgeBefore(count) : strings.edgeAfter(count);
            edge.append(title, text);
            svg.append(edge);
        }
        if (c.brush) {
            svg.append(
                s(doc, 'rect', {
                    class: 'kp-chart__brush',
                    x: Math.min(c.brush.x0, c.brush.x1),
                    y: P.t,
                    width: Math.abs(c.brush.x1 - c.brush.x0),
                    height: H - P.t - P.b,
                }),
            );
        }
        const t = c.pinned ?? c.cursor;
        if (t != null && t >= from && t <= to) {
            svg.append(
                s(doc, 'line', {
                    class: c.pinned != null ? 'kp-chart__crosshair kp-chart__crosshair--pinned' : 'kp-chart__crosshair',
                    x1: x(t),
                    x2: x(t),
                    y1: P.t,
                    y2: H - P.b,
                }),
            );
            const acc = (c.points[0] ?? []).map(() => 0);
            c.data.series.forEach((series, si) => {
                if (!vis.includes(si) || c.points[si].length === 0) return;
                const k = indexAt(c.points[si], t);
                const v = c.points[si][k][1] + (stacked ? (acc[k] ?? 0) : 0);
                if (stacked) c.points[si].forEach((p, j) => (acc[j] += p[1]));
                const dot = s(doc, 'circle', { class: 'kp-chart__snap', cx: x(c.points[si][k][0]), cy: y(v), r: c.hot === si ? 4.5 : 3.5 });
                paintSeries(dot, series, si);
                svg.append(dot);
            });
        }
        plot.replaceChildren(svg);
        keepEndsInside(axisLabels, W);
        c.geo = { x, inv: (px) => from + ((px - P.l) / (W - P.l - P.r)) * (to - from), W, P, from, to, svg };
        paintKey(opt);
        const aria = [strings.plot(label())];
        for (const m of c.medians) aria.push(`${medianWords(opt)} ${c.medians.length > 1 ? `${m.label} ` : ''}${fmt(m.v, 'readout')}`);
        if (beforeCount) aria.push(strings.edgeBefore(beforeCount));
        if (afterCount) aria.push(strings.edgeAfter(afterCount));
        plot.setAttribute('aria-label', aria.join(', '));
        if (few) {
            // Too early for a trend: the empty plot, faint, and the sentence on an opaque plate in the middle of its whole height.
            const words = strings.few(have, opt.minPoints, opt.minUnit || strings.fewUnit);
            svg.setAttribute('data-kp-faint', '');
            c.geo = null;
            tip.hidden = true;
            hint.hidden = true;
            note.hidden = true;
            // The plate stands on an opaque ground of the card's colour, so a theme that draws its empty plate as a
            // see-through texture keeps that texture and still lets nothing of the plot show through (Kenny, 2026-10-18 17:45).
            const plate = h(
                doc,
                'div',
                { class: 'kp-chart__few' },
                h(doc, 'div', { class: 'kp-chart__few-ground' }, h(doc, 'p', { class: 'kp-empty kp-chart__few-plate', role: 'status' }, words)),
            );
            plot.append(plate);
            if (c.shown !== `few ${words}`) {
                c.shown = `few ${words}`;
                readout.textContent = `${label()}: ${words}`;
            }
            c.paintLegend();
            return;
        }
        const withPoints = vis.filter((si) => c.points[si].length > 0);
        note.hidden = !(c.data.onePointNote && withPoints.length > 0 && withPoints.every((si) => c.points[si].length === 1));
        c.paintLegend();
        c.paintTip();
    }
}
