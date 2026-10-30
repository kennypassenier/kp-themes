// Attaches the week agendas of a page.
import { CHART_TIME_ZONE } from '../chart.js';
import { dayKey, shiftDay } from '../calendar.js';
import { resolveLocale } from '../locale.js';
import { resolveStrings } from '../strings.js';
import { setWeekStart } from './api.js';
import { build, buildDays, watchArrivals } from './build.js';
import { placeBusy } from './busy.js';
import { WEEK, WEEK_RANGE_EVENT, WEEK_TICK_MS } from './constants.js';
import { focusPill, open, reachable, syncTabStops } from './menu.js';
import { layout, paint, tick } from './paint.js';
import { weeks } from './state.js';
import { upcomingOn } from './upcoming.js';
/** @typedef {import('./types.js').WeekModel} WeekModel */
/** @typedef {import('./types.js').WeekOptions} WeekOptions */

/**
 * Attach every week agenda under `root`.
 * @param {ParentNode} [root]
 * @param {WeekOptions} [options]
 * @returns {() => void} detach
 */
export function attachWeeks(root = document, options = {}) {
    /** @type {(() => void)[]} */
    const undo = [];
    for (const el of /** @type {HTMLElement[]} */ ([...root.querySelectorAll(WEEK)])) {
        if (weeks.has(el)) continue;
        const zone = options.timeZone ?? el.dataset.kpTimeZone ?? CHART_TIME_ZONE;
        const now = options.now ?? (() => Date.now());
        const days = Math.min(14, Math.max(1, Number(el.dataset.kpWeekDays) || 7));
        /** @type {WeekModel} */
        const c = {
            el,
            zone,
            locale: resolveLocale(options.locale ?? el.dataset.kpLocale, el),
            now,
            strings: resolveStrings(options.strings),
            ...(options.decorate ? { decorate: options.decorate } : {}),
            start: el.dataset.kpWeekStart ?? dayKey(now(), zone),
            days,
            events: [],
            state: 'ready',
            active: null,
            grid: el,
            axis: el,
            cols: [],
            frame: el,
            busy: null,
            leaving: null,
            held: null,
            stateLine: el,
            plate: el,
            plateKey: '',
            plateText: '',
            plateArt: null,
            title: null,
            today: null,
            motion: { gone: false, stop: null, asked: false },
            legend: el,
            pills: new Map(),
            timer: 0,
            observer: null,
            mode: 'grid',
            upcoming: {
                n: Math.max(0, Math.min(50, Number.parseInt(el.dataset.kpWeekUpcoming ?? '', 10) || 0)),
                on: false,
                list: null,
                rows: new Map(),
                items: [],
            },
        };
        weeks.set(el, c);
        build(c);
        buildDays(c);
        paint(c);
        // The one hover card of the page carries each item's detail.
        void import('../hovercard.js').then((m) => m.attachHoverCards(el.ownerDocument));
        if (c.title) watchArrivals(c);

        /** @param {Event} event */
        const pillOf = (event) =>
            event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('.kp-week__pill')) : null;
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const pill = pillOf(event);
            if (!pill || pill.classList.contains('kp-week__pill--more') || pill.tagName !== 'BUTTON') return;
            const item = c.cols.flatMap((col) => col.items).find((i) => i.button === pill);
            if (!item) return;
            c.active = item.event.id;
            syncTabStops(c);
            open(c, item, event.detail === 0 ? 'keyboard' : 'pointer');
        };
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const pill = pillOf(event);
            if (!pill || event.altKey || event.ctrlKey || event.metaKey) return;
            if (c.upcoming.on && c.upcoming.list?.contains(pill)) {
                const listed = c.upcoming.items.map((i) => i.button).filter((b) => b.tagName === 'BUTTON');
                const at = listed.indexOf(/** @type {HTMLButtonElement} */ (pill));
                const to =
                    event.key === 'ArrowDown'
                        ? listed[Math.min(listed.length - 1, at + 1)]
                        : event.key === 'ArrowUp'
                          ? listed[Math.max(0, at - 1)]
                          : event.key === 'Home'
                            ? listed[0]
                            : event.key === 'End'
                              ? listed[listed.length - 1]
                              : undefined;
                if (!to) return;
                event.preventDefault();
                focusPill(c, to);
                return;
            }
            const colIndex = c.cols.findIndex((col) => col.track.contains(pill));
            const col = c.cols[colIndex];
            if (!col) return;
            const own = reachable(c, col);
            const at = own.indexOf(pill);
            /** @type {HTMLElement | undefined} */
            let to;
            if (event.key === 'ArrowDown') to = own[Math.min(own.length - 1, at + 1)];
            else if (event.key === 'ArrowUp') to = own[Math.max(0, at - 1)];
            else if (event.key === 'Home') to = own[0];
            else if (event.key === 'End') to = own[own.length - 1];
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                const rtl = getComputedStyle(c.grid).direction === 'rtl';
                const step = (event.key === 'ArrowRight') !== rtl ? 1 : -1;
                const mine = c.cols.flatMap((x) => x.items).find((i) => i.button === pill)?.at ?? 0.5;
                for (let k = colIndex + step; k >= 0 && k < c.cols.length && !to; k += step) {
                    const there = c.cols[k];
                    if (!there) break;
                    const list = reachable(c, there);
                    if (!list.length) continue;
                    const stamp = (/** @type {HTMLElement} */ el) => c.cols.flatMap((x) => x.items).find((i) => i.button === el)?.at ?? 1;
                    to = list.reduce(
                        (best, el) => (Math.abs(stamp(el) - mine) < Math.abs(stamp(best) - mine) ? el : best),
                        /** @type {HTMLElement} */ (list[0]),
                    );
                }
            }
            if (!to) return;
            event.preventDefault();
            focusPill(c, to);
        };
        /** @param {Event} event */
        const onNav = (event) => {
            const target = event.target instanceof Element ? event.target.closest('button') : null;
            if (!target || target.getAttribute('aria-disabled') === 'true') return;
            let next = c.start;
            if (target.hasAttribute('data-kp-week-prev')) next = shiftDay(c.start, -c.days);
            else if (target.hasAttribute('data-kp-week-next')) next = shiftDay(c.start, c.days);
            else if (target.hasAttribute('data-kp-week-today')) next = dayKey(c.now(), c.zone);
            else return;
            if (next === c.start) return;
            setWeekStart(el, next);
            el.dispatchEvent(new CustomEvent(WEEK_RANGE_EVENT, { bubbles: true, detail: { start: next, source: 'nav' } }));
        };
        el.addEventListener('click', onClick);
        el.addEventListener('keydown', onKey);
        el.addEventListener('click', onNav);
        c.timer = window.setInterval(() => tick(c), WEEK_TICK_MS);
        // The pill's height is the CSS's; a change of width can flip grid and list, a font arriving changes the pill.
        if (typeof ResizeObserver !== 'undefined') {
            let last = '';
            c.observer = new ResizeObserver(() => {
                placeBusy(c);
                const key = `${c.grid.clientWidth}x${c.cols[0]?.track.clientHeight ?? 0}`;
                if (key === last) return;
                last = key;
                // Crossing 40rem with an upcoming list moves the pills between the list and the days: a paint, not a layout.
                if (c.upcoming.n > 0 && upcomingOn(c) !== c.upcoming.on) {
                    paint(c);
                    return;
                }
                layout(c);
                syncTabStops(c);
            });
            c.observer.observe(c.grid);
            if (c.upcoming.list) c.observer.observe(c.upcoming.list);
        }
        undo.push(() => {
            el.removeEventListener('click', onClick);
            el.removeEventListener('keydown', onKey);
            el.removeEventListener('click', onNav);
            window.clearInterval(c.timer);
            c.observer?.disconnect();
            c.motion.gone = true;
            c.motion.stop?.();
            weeks.delete(el);
        });
    }
    return () => undo.splice(0).forEach((off) => off());
}
