// Attaches the timeline to its element and wires its controls.
import { CHART_TIME_ZONE } from '../chart.js';
import { resolveStrings } from '../strings.js';
import { watchOptions } from '../live-options.js';
import { GANTT, GANTT_OPEN_EVENT, GANTT_SELECT_EVENT, GANTT_TICK_MS, gantts } from './constants.js';
import { build } from './build.js';
import { windowOf } from './window.js';
import { holdHeight, paint } from './paint.js';
import { announceWindow, focusBar, paintSelection, reachableLanes, syncTabStops, tick } from './selection.js';
import { dayBounds, syncDays } from './axis.js';
import { setGanttSelection } from './api.js';
import { rangeSeconds, rel } from './scale.js';
import { paintChrome } from './chrome.js';
/** @typedef {import('./constants.js').GanttModel} GanttModel */
/** @typedef {import('./constants.js').GanttOptions} GanttOptions */

/**
 * Attach every run timeline under `root`.
 * @param {ParentNode} [root]
 * @param {GanttOptions} [options]
 * @returns {() => void} detach
 */
export function attachGantts(root = document, options = {}) {
    /** @type {(() => void)[]} */
    const undo = [];
    for (const el of /** @type {HTMLElement[]} */ ([...root.querySelectorAll(GANTT)])) {
        if (gantts.has(el)) continue;
        const now = options.now ?? (() => Date.now());
        /** @type {GanttModel} */
        const c = {
            el,
            zone: options.timeZone ?? el.dataset.kpTimeZone ?? CHART_TIME_ZONE,
            now,
            strings: resolveStrings(options.strings),
            ...(options.decorate ? { decorate: options.decorate } : {}),
            base: Math.floor(now() / 1000),
            span: 21_600,
            live: el.dataset.kpGanttLive !== 'false',
            to: 0,
            runs: [],
            lanesGiven: [],
            lanes: [],
            bars: new Map(),
            states: new Map(),
            state: 'ready',
            active: null,
            selected: null,
            body: el,
            scroll: el,
            axis: el,
            plot: el,
            lines: el,
            nowLine: el,
            brushBox: el,
            selectBox: el,
            stateLine: el,
            plate: el,
            plateKey: '',
            plateText: '',
            plateArt: null,
            announcer: el,
            ranges: el,
            liveButton: /** @type {HTMLButtonElement} */ (/** @type {unknown} */ (el)),
            selection: el,
            selectionText: el,
            ticks: new Map(),
            legend: el,
            days: el.hasAttribute('data-kp-gantt-days'),
            dayStop: null,
            points: [],
            pointEls: new Map(),
            kinds: [],
            zones: [],
            fit: false,
            line: el.classList.contains('kp-gantt--line'),
            ghosts: [],
            held: null,
            busy: null,
            leaving: null,
            drawn: false,
            timer: 0,
            observer: null,
            drag: null,
            dragMoved: false,
            tickKey: '',
            labels: new Map(),
            outside: new Map(),
        };
        gantts.set(el, c);
        build(c);
        c.to = windowOf({ ...c, live: true }).end;
        void import('../segmented.js').then((m) => m.attachSegmented(c.ranges));
        void import('../hovercard.js').then((m) => m.attachHoverCards(el.ownerDocument));
        paint(c);
        tick(c);
        // What the first frame shows is the page, not news: a busy card laid before it is painted does not arrive.
        window.requestAnimationFrame(() => (c.drawn = true));

        /** @param {Event} event */
        const barOf = (event) =>
            event.target instanceof Element
                ? /** @type {HTMLButtonElement | null} */ (event.target.closest('.kp-gantt__run, .kp-gantt__point'))
                : null;
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const bar = barOf(event);
            if (bar && bar.dataset.kpId && bar.classList.contains('kp-gantt__point')) {
                if (c.dragMoved) return;
                const point = c.points.find((p) => p.id === bar.dataset.kpId);
                if (!point) return;
                c.active = point.id;
                syncTabStops(c);
                // A mark with a count opens with every point it stands for.
                const lane = c.lanes.find((l) => l.points.includes(bar));
                const at = lane ? lane.points.indexOf(bar) : -1;
                const together = [point];
                if (lane && bar.hasAttribute('data-kp-cluster'))
                    for (const next of lane.points.slice(at + 1)) {
                        if (!next.hasAttribute('data-kp-clustered')) break;
                        const p = c.points.find((q) => q.id === next.dataset.kpId);
                        if (p) together.push(p);
                    }
                el.dispatchEvent(
                    new CustomEvent(GANTT_OPEN_EVENT, {
                        bubbles: true,
                        detail: { id: point.id, point, points: together, source: event.detail === 0 ? 'keyboard' : 'pointer' },
                    }),
                );
                return;
            }
            if (bar && bar.dataset.kpId) {
                if (c.dragMoved) return;
                const run = c.runs.find((r) => r.id === bar.dataset.kpId);
                if (!run) return;
                c.active = run.id;
                syncTabStops(c);
                el.dispatchEvent(
                    new CustomEvent(GANTT_OPEN_EVENT, {
                        bubbles: true,
                        detail: { id: run.id, run, source: event.detail === 0 ? 'keyboard' : 'pointer' },
                    }),
                );
                return;
            }
            const button = event.target instanceof Element ? event.target.closest('button') : null;
            if (!button) return;
            if (button === c.liveButton) {
                setLive(c, !c.live);
            } else if (button.hasAttribute('data-kp-gantt-day')) {
                const day = button.dataset.kpGanttDay ?? '';
                c.dayStop = day;
                const bounds = dayBounds(c, day);
                const lift = button.getAttribute('aria-pressed') === 'true';
                setGanttSelection(el, lift ? null : bounds);
                el.dispatchEvent(
                    new CustomEvent(GANTT_SELECT_EVENT, {
                        bubbles: true,
                        detail: lift ? { from: null, to: null, source: 'clear' } : { ...bounds, source: 'day', day },
                    }),
                );
            } else if (button.hasAttribute('data-kp-gantt-clear')) {
                setGanttSelection(el, null);
                el.dispatchEvent(new CustomEvent(GANTT_SELECT_EVENT, { bubbles: true, detail: { from: null, to: null, source: 'clear' } }));
            } else if (button.hasAttribute('data-kp-gantt-zoom') && c.selected) {
                const { from, to } = c.selected;
                c.span = Math.max(60, (to - from) / 1000);
                c.live = false;
                c.to = rel(c, to);
                c.selected = null;
                freshWindow(c);
                announceWindow(c, 'zoom');
            }
        };
        /** @param {Event} event */
        const onRange = (event) => {
            const value = /** @type {CustomEvent} */ (event).detail?.value;
            if (value === 'all') {
                c.fit = true;
                c.live = false;
                freshWindow(c);
                announceWindow(c, 'range');
                return;
            }
            const seconds = typeof value === 'string' ? rangeSeconds(value) : Number.NaN;
            if (!Number.isFinite(seconds)) return;
            c.fit = false;
            c.span = seconds;
            if (!c.live) c.to = Math.max(c.to, rel(c, c.now()));
            freshWindow(c);
            announceWindow(c, 'range');
        };
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const dayButton = event.target instanceof HTMLButtonElement && event.target.hasAttribute('data-kp-gantt-day') ? event.target : null;
            if (dayButton && !(event.altKey || event.ctrlKey || event.metaKey)) {
                const buttons = /** @type {HTMLButtonElement[]} */ ([
                    ...c.axis.querySelectorAll('button[data-kp-gantt-day]:not([data-kp-gantt-crowded])'),
                ]);
                const at = buttons.indexOf(dayButton);
                const rtl = getComputedStyle(c.axis).direction === 'rtl';
                const step = event.key === 'ArrowRight' ? (rtl ? -1 : 1) : event.key === 'ArrowLeft' ? (rtl ? 1 : -1) : 0;
                const to =
                    event.key === 'Home'
                        ? buttons[0]
                        : event.key === 'End'
                          ? buttons[buttons.length - 1]
                          : step
                            ? buttons[Math.min(buttons.length - 1, Math.max(0, at + step))]
                            : undefined;
                if (!to) return;
                event.preventDefault();
                c.dayStop = to.dataset.kpGanttDay ?? null;
                syncDays(c);
                to.focus();
                return;
            }
            const bar = barOf(event);
            if (!bar || event.altKey || event.ctrlKey || event.metaKey) return;
            const lanes = reachableLanes(c);
            const laneIndex = lanes.findIndex((l) => l.includes(bar));
            const lane = lanes[laneIndex];
            if (!lane) return;
            const at = lane.indexOf(bar);
            /** @type {HTMLElement | undefined} */
            let to;
            if (event.key === 'ArrowRight') to = lane[Math.min(lane.length - 1, at + 1)];
            else if (event.key === 'ArrowLeft') to = lane[Math.max(0, at - 1)];
            else if (event.key === 'Home') to = lane[0];
            else if (event.key === 'End') to = lane[lane.length - 1];
            else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                const next = lanes[laneIndex + (event.key === 'ArrowDown' ? 1 : -1)];
                if (next) {
                    const startOf = (/** @type {HTMLElement} */ b) => Number.parseFloat(b.style.getPropertyValue('--kp-g-s'));
                    const mine = startOf(bar);
                    to = next.reduce(
                        (best, b) => (Math.abs(startOf(b) - mine) < Math.abs(startOf(best) - mine) ? b : best),
                        /** @type {HTMLElement} */ (next[0]),
                    );
                }
            }
            if (!to) return;
            event.preventDefault();
            focusBar(c, to);
        };

        // The brush: a drag across the plot selects a range; a click without a drag is the bar's.
        /** @param {PointerEvent} event */
        const plotX = (event) => event.clientX - c.plot.getBoundingClientRect().left;
        /** @param {number} x @returns {number} epoch ms */
        const timeAt = (x) => {
            const w = windowOf(c);
            const width = c.plot.clientWidth || 1;
            return (w.from + (Math.min(Math.max(x, 0), width) / width) * c.span + c.base) * 1000;
        };
        /** @param {PointerEvent} event */
        const onDown = (event) => {
            // A dated line has no brush: it is read, not searched [kpadopt4].
            if (event.button !== 0 || c.state === 'loading' || c.line || c.el.getAttribute('data-kp-gantt-toolbar') === 'off') return;
            const x = plotX(event);
            if (x < 0 || x > c.plot.clientWidth) return;
            c.drag = { a: x, b: x };
            c.dragMoved = false;
        };
        /** @param {PointerEvent} event */
        const onMove = (event) => {
            if (!c.drag) return;
            c.drag.b = plotX(event);
            if (!c.dragMoved && Math.abs(c.drag.b - c.drag.a) > 6) {
                c.dragMoved = true;
                c.scroll.setPointerCapture(event.pointerId);
            }
            if (!c.dragMoved) return;
            const lo = Math.min(c.drag.a, c.drag.b);
            c.brushBox.hidden = false;
            c.brushBox.style.setProperty('--kp-g-x', `${lo}px`);
            c.brushBox.style.setProperty('--kp-g-w', `${Math.abs(c.drag.b - c.drag.a)}px`);
        };
        const endDrag = (/** @type {boolean} */ commit) => {
            const d = c.drag;
            c.drag = null;
            c.brushBox.hidden = true;
            if (d && commit && c.dragMoved) {
                const from = timeAt(Math.min(d.a, d.b));
                const to = timeAt(Math.max(d.a, d.b));
                c.selected = { from, to };
                paintSelection(c);
                el.dispatchEvent(new CustomEvent(GANTT_SELECT_EVENT, { bubbles: true, detail: { from, to, source: 'brush' } }));
            }
            // The click that follows a drag is not a click on a bar.
            if (c.dragMoved) window.setTimeout(() => (c.dragMoved = false), 0);
        };
        const onUp = () => endDrag(true);
        const onCancel = () => endDrag(false);

        c.ranges.addEventListener('kp-segmented-change', onRange);
        el.addEventListener('click', onClick);
        el.addEventListener('keydown', onKey);
        c.scroll.addEventListener('pointerdown', onDown);
        c.scroll.addEventListener('pointermove', onMove);
        c.scroll.addEventListener('pointerup', onUp);
        c.scroll.addEventListener('pointercancel', onCancel);
        c.timer = window.setInterval(() => tick(c), GANTT_TICK_MS);
        // The toolbar, the legend and the hint are drawn again when their attribute changes [gaps-time-1019].
        // A web font that arrives after the first measure changes every width: the labels are measured again.
        const fonts = el.ownerDocument.fonts;
        const refit = () => {
            c.labels.clear();
            tick(c);
        };
        fonts?.addEventListener?.('loadingdone', refit);
        void fonts?.ready?.then(refit);
        const stopOptions = watchOptions(el, ['data-kp-gantt-toolbar', 'data-kp-gantt-legend', 'data-kp-gantt-hint', 'data-kp-gantt-rest'], () => {
            paint(c);
            paintChrome(c);
            tick(c);
        });
        if (typeof ResizeObserver !== 'undefined') {
            let last = 0;
            c.observer = new ResizeObserver(() => {
                const width = c.plot.clientWidth;
                if (width === last) return;
                last = width;
                c.tickKey = '';
                // Rows are packed with a gap in pixels: another width packs them again.
                if (c.runs.length) paint(c);
                // Lane names wrap differently at another width: the viewport is measured again for whole lanes.
                if (c.held !== null) {
                    c.held = null;
                    holdHeight(c);
                }
                tick(c);
            });
            c.observer.observe(c.plot);
        }
        undo.push(() => {
            c.ranges.removeEventListener('kp-segmented-change', onRange);
            el.removeEventListener('click', onClick);
            el.removeEventListener('keydown', onKey);
            c.scroll.removeEventListener('pointerdown', onDown);
            c.scroll.removeEventListener('pointermove', onMove);
            c.scroll.removeEventListener('pointerup', onUp);
            c.scroll.removeEventListener('pointercancel', onCancel);
            window.clearInterval(c.timer);
            stopOptions();
            fonts?.removeEventListener?.('loadingdone', refit);
            c.observer?.disconnect();
            gantts.delete(el);
        });
    }
    return () => undo.splice(0).forEach((off) => off());
}
/** A new window: lanes may need fewer rows again, the axis starts over. @param {GanttModel} c */
export function freshWindow(c) {
    for (const lane of c.lanes) lane.rows = 1;
    c.held = null;
    c.tickKey = '';
    paint(c);
    tick(c);
    paintSelection(c);
}
/** @param {GanttModel} c @param {boolean} live */
function setLive(c, live) {
    if (live === c.live) return;
    c.live = live;
    // Following now leaves the fitted window; the first range that is a length takes its place [kpadopt4].
    if (live && c.fit) {
        c.fit = false;
        const first = [...c.ranges.querySelectorAll('[data-value]')]
            .map((b) => /** @type {HTMLElement} */ (b).dataset.value ?? '')
            .find((w) => w !== 'all');
        if (first) {
            c.span = rangeSeconds(first);
            void import('../segmented.js').then((m) => m.setSegmentedValues(c.ranges, [first]));
        }
    }
    if (!live) c.to = windowOf({ ...c, live: true }).end;
    freshWindow(c);
    announceWindow(c, 'live');
}
