// The uptime strip [kpadopt4-ideas, Kenny 2026-10-16].
//
// One thin strip of cells, one per period (90 days, 48 hours), each toned by
// how the service did in it: up, degraded, down, or no data. Over the strip a
// title and the window's summary in exact figures ("99.4% · 2 incidents"),
// under it the first and the last period's names. Every cell is a button with
// the hover card for its detail (js/hovercard.js) and fires `kp-uptime-pick`
// when pressed, so a page can open that day.
//
//   <div class="kp-uptime" data-kp-uptime data-kp-uptime-label="jellyfin" data-kp-uptime-count="90"></div>
//
//   setUptime(el, { label: 'jellyfin', periods: [{ key: '2026-10-16', label: '16/10/2026', state: 'up' }, …] });
//
// A strip is never wrapped onto a second line. On a narrow page it shows the
// latest periods that fit (each cell at least `--kp-uptime-cell-min` wide) and
// says how many of them it shows ("55 of 90 shown"); with
// `data-kp-uptime-fit="scroll"` it keeps every period and scrolls sideways
// instead, scrolled to the latest. The summary always speaks of the whole
// window the page gave.
//
// The figures are exact: the share is cut, never rounded up (99.96% reads
// 99.9%, and only a window without a minute down reads 100%), and the incident
// count is the number, not "9+". A period's share is its `uptime` (0 to 1)
// when the page measured one, else 1 for up and degraded and 0 for down;
// periods without data do not count. Its incidents are `incidents` when given,
// else 1 for a degraded or down period.
//
// States, each in the same footprint so nothing moves between them: `ready`;
// `loading` (the cells wait as the theme's skeleton and the data table's busy
// card stands over them, js/busy-card.js); `empty` (every cell without data,
// the summary says so); `error` (the cells without data, the summary carries
// the page's sentence on the destructive plate). Before the first
// setUptime() the strip draws the loading state from its attributes, so a
// page shows loading from its first frame.
//
// Keys: the strip is one tab stop (the latest cell); the arrows move through
// the cells that are shown, Home and End go to the first and the latest, and
// Enter or Space picks. The hover card opens at once on focus.
//
// Nothing runs on import; attachUptimes(root) returns a detach.

import { getStrings } from './strings.js';
import { attachHoverCards } from './hovercard.js';
import { openBusyCard } from './busy-card.js';

/** A strip. */
export const UPTIME = '[data-kp-uptime]';
/** Fired on the strip when a cell is pressed: `{ key, index, period }`. */
export const UPTIME_PICK_EVENT = 'kp-uptime-pick';
/** The states of a period, in the order of how bad they are. */
export const UPTIME_STATES = /** @type {const} */ (['up', 'degraded', 'down', 'none']);
/** How many cells a strip waits with when the page has not said (`data-kp-uptime-count`). */
export const UPTIME_COUNT = 90;

/**
 * @typedef {object} UptimePeriod
 * @property {string} key       stable id of the period (an ISO day or hour)
 * @property {string} label     its name as a person reads it ("14/10/2026", "14:00")
 * @property {'up' | 'degraded' | 'down' | 'none'} state
 * @property {number} [uptime]  the share of the period the service was up, 0 to 1, when measured
 * @property {number} [incidents] how many incidents began in it
 * @property {string} [tip]     the hover card's text; else the label, the state and the figures
 */

/**
 * @typedef {object} UptimeSpec
 * @property {UptimePeriod[]} [periods] oldest first
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state] default `ready` (or `empty` without periods)
 * @property {string} [label]   the strip's title (the service); else `data-kp-uptime-label`
 * @property {string} [from]    the axis's start word when every period is shown ("90 days ago"); else the first period's label
 * @property {string} [to]      the axis's end word ("Today"); else the latest period's label
 * @property {number} [count]   how many cells a loading or empty strip waits with; else `data-kp-uptime-count`, else 90
 * @property {string} [error]   the error state's sentence; else the dictionary's
 */

/**
 * @typedef {object} UptimeFigures
 * @property {number} measured   periods with data
 * @property {number | null} share  the window's share up, 0 to 1; null without data
 * @property {number} incidents
 * @property {Record<'up' | 'degraded' | 'down' | 'none', number>} counts
 */

/**
 * The window's figures from its periods.
 * @param {readonly UptimePeriod[]} periods
 * @returns {UptimeFigures}
 */
export function uptimeFigures(periods) {
    const counts = { up: 0, degraded: 0, down: 0, none: 0 };
    let sum = 0;
    let incidents = 0;
    for (const period of periods) {
        const state = UPTIME_STATES.includes(period.state) ? period.state : 'none';
        counts[state] += 1;
        if (state === 'none') continue;
        const share =
            typeof period.uptime === 'number' && Number.isFinite(period.uptime) ? Math.min(1, Math.max(0, period.uptime)) : state === 'down' ? 0 : 1;
        sum += share;
        incidents += typeof period.incidents === 'number' && period.incidents >= 0 ? Math.floor(period.incidents) : state === 'up' ? 0 : 1;
    }
    const measured = counts.up + counts.degraded + counts.down;
    return { measured, share: measured === 0 ? null : sum / measured, incidents, counts };
}

/**
 * A share as a percentage with one decimal, cut rather than rounded, so a window with any time down never reads 100.
 * @param {number} share 0 to 1
 * @returns {string} "99.4", "99.0", "100", "0"
 */
export function uptimePercent(share) {
    if (share >= 1) return '100';
    if (share <= 0) return '0';
    // The small epsilon keeps a share like 0.994 (993.9999… thousandths in binary) from reading 99.3.
    return (Math.min(999, Math.floor(share * 1000 + 1e-9)) / 10).toFixed(1);
}

/**
 * How many of `count` cells fit in `width` px, each at least `min` px with `gap` px between.
 * @param {number} count @param {number} width @param {number} min @param {number} gap
 * @returns {number}
 */
export function uptimeFit(count, width, min, gap) {
    if (count <= 0) return 0;
    const fits = Math.floor((width + gap) / (Math.max(1, min) + gap));
    return Math.max(1, Math.min(count, fits));
}

/** What each strip was last given. @type {WeakMap<HTMLElement, UptimeSpec>} */
const SPECS = new WeakMap();
/** The busy card over a loading strip. @type {WeakMap<HTMLElement, import('./busy-card.js').BusyCard>} */
const CARDS = new WeakMap();
/** A card on its way out and the spec that waits for it. @type {WeakMap<HTMLElement, { card: import('./busy-card.js').BusyCard, spec: UptimeSpec }>} */
const WAITING = new WeakMap();
/** Scrolling strips the reader scrolled away from the latest period. @type {WeakSet<HTMLElement>} */
const UNPINNED = new WeakSet();
/** Strips drawn before: a card on the first render is the page, not news. @type {WeakSet<HTMLElement>} */
const DRAWN = new WeakSet();

/** @param {HTMLElement} el @returns {number} */
const countOf = (el) => {
    const n = Number.parseInt(el.dataset.kpUptimeCount ?? '', 10);
    return Number.isFinite(n) && n > 0 ? n : UPTIME_COUNT;
};

/** @param {HTMLElement} el @param {string} tag @param {string} [className] */
const make = (el, tag, className) => {
    const node = el.ownerDocument.createElement(tag);
    if (className) node.className = className;
    return node;
};

/**
 * Draw a strip, or let its busy card leave first when it stops loading.
 * @param {HTMLElement} el
 * @param {UptimeSpec} spec
 */
export function setUptime(el, spec) {
    SPECS.set(el, spec);
    const loading = spec.state === 'loading';
    const waiting = WAITING.get(el);
    if (loading && waiting) {
        WAITING.delete(el);
        waiting.card.remove();
    } else if (!loading) {
        if (waiting) {
            waiting.spec = spec;
            return;
        }
        const card = CARDS.get(el);
        if (card) {
            CARDS.delete(el);
            const entry = { card, spec };
            WAITING.set(el, entry);
            void card.close().then(() => {
                if (WAITING.get(el) !== entry) return;
                WAITING.delete(el);
                draw(el, entry.spec);
            });
            return;
        }
    }
    draw(el, spec);
}

/**
 * @param {HTMLElement} el
 * @param {UptimeSpec} spec
 */
function draw(el, spec) {
    const s = getStrings();
    const periods = spec.periods ?? [];
    const state = spec.state ?? (periods.length === 0 ? 'empty' : 'ready');
    const loading = state === 'loading';
    const failed = state === 'error';
    const label = spec.label ?? el.dataset.kpUptimeLabel ?? '';
    const count = periods.length > 0 && !loading ? periods.length : (spec.count ?? countOf(el));
    const figures = uptimeFigures(loading || failed ? [] : periods);
    const focusedKey = el.contains(el.ownerDocument.activeElement)
        ? /** @type {HTMLElement} */ (el.ownerDocument.activeElement).dataset.kpKey
        : undefined;

    el.classList.add('kp-uptime');
    el.dataset.kpUptimeState = state;
    if (loading) el.setAttribute('aria-busy', 'true');
    else el.removeAttribute('aria-busy');

    // The head: the title on the start side, the summary on the end side, on one line.
    const head = make(el, 'div', 'kp-uptime__head');
    const title = make(el, 'span', 'kp-uptime__title');
    title.textContent = label;
    if (label) title.title = label;
    const summary = make(el, 'span', 'kp-uptime__summary');
    summary.setAttribute('role', 'status');
    let said = '';
    if (loading) {
        summary.dataset.kpTone = 'loading';
        const wait = make(el, 'span', 'kp-skeleton kp-uptime__summary-skeleton');
        wait.setAttribute('aria-hidden', 'true');
        summary.append(wait);
        said = s.uptimeLoading;
        const hidden = make(el, 'span', 'kp-sr-only');
        hidden.textContent = said;
        summary.append(hidden);
    } else if (failed) {
        summary.dataset.kpTone = 'error';
        said = spec.error ?? s.uptimeError;
        summary.textContent = said;
        summary.title = said;
    } else if (figures.share === null) {
        summary.dataset.kpTone = 'empty';
        said = s.uptimeEmpty;
        summary.textContent = said;
    } else {
        const percent = make(el, 'b', 'kp-uptime__percent');
        percent.textContent = s.uptimePercent(uptimePercent(figures.share));
        const dot = make(el, 'span', 'kp-uptime__dot');
        dot.setAttribute('aria-hidden', 'true');
        dot.textContent = '·';
        const incidents = make(el, 'span', 'kp-uptime__incidents');
        incidents.textContent = s.uptimeIncidents(figures.incidents);
        summary.append(percent, dot, incidents);
        said = s.uptimeSummary(uptimePercent(figures.share), figures.incidents);
    }
    head.append(title, summary);

    // The strip: one button per period, oldest first.
    const track = make(el, 'div', 'kp-uptime__track');
    track.setAttribute('role', 'group');
    track.setAttribute('aria-label', label ? s.uptimeTrack(label, said) : said);
    /** @type {HTMLElement[]} */
    const cells = [];
    for (let i = 0; i < count; i++) {
        const period = loading || failed ? null : (periods[i] ?? null);
        const cell = make(el, loading ? 'span' : 'button', loading ? 'kp-uptime__cell kp-skeleton kp-skeleton--block' : 'kp-uptime__cell');
        if (loading) {
            cell.setAttribute('aria-hidden', 'true');
        } else {
            const tone = period && UPTIME_STATES.includes(period.state) ? period.state : 'none';
            /** @type {HTMLButtonElement} */ (cell).type = 'button';
            cell.dataset.kpTone = tone;
            cell.tabIndex = -1;
            if (period) {
                cell.dataset.kpKey = period.key;
                const share = typeof period.uptime === 'number' ? s.uptimePercent(uptimePercent(period.uptime)) : null;
                const n = typeof period.incidents === 'number' ? period.incidents : null;
                const words = s.uptimeCell(period.label, s.uptimeStateWord(tone), share, n);
                cell.setAttribute('aria-label', words);
                cell.setAttribute('data-kp-hovercard', period.tip ?? words);
            } else {
                cell.setAttribute('aria-label', s.uptimeStateWord('none'));
                cell.dataset.kpKey = `none-${i}`;
            }
        }
        cells.push(cell);
    }
    track.append(...cells);

    // The axis: the first and the latest period shown, and how many are shown when not all fit.
    const axis = make(el, 'div', 'kp-uptime__axis');
    const from = make(el, 'span', 'kp-uptime__from');
    const shown = make(el, 'span', 'kp-uptime__shown');
    const to = make(el, 'span', 'kp-uptime__to');
    axis.append(from, shown, to);

    const keep = CARDS.get(el)?.layer;
    for (const child of [...el.childNodes]) if (child !== keep) child.remove();
    if (keep && keep.parentElement === el) keep.before(head, track, axis);
    else el.append(head, track, axis);

    fit(el);
    if (!loading) {
        const roving = cells.find((c) => c.dataset.kpKey === focusedKey && !c.hidden) ?? [...cells].reverse().find((c) => !c.hidden) ?? null;
        if (roving) roving.tabIndex = 0;
        if (focusedKey !== undefined && roving?.dataset.kpKey === focusedKey) roving.focus({ preventScroll: true });
    }

    // The busy card: centred over the strip while it loads.
    const first = !DRAWN.has(el);
    if (!DRAWN.has(el)) {
        const view = el.ownerDocument.defaultView;
        if (view) view.requestAnimationFrame(() => DRAWN.add(el));
        else DRAWN.add(el);
    }
    const card = CARDS.get(el);
    if (loading) {
        if (card) card.place();
        else CARDS.set(el, openBusyCard(el, { words: s.uptimeLoading, area: () => [track], className: 'kp-uptime__busy', arrive: !first }));
    } else if (card) {
        CARDS.delete(el);
        card.remove();
    }
}

/**
 * Show the latest cells that fit (or all of them, scrolling, with `data-kp-uptime-fit="scroll"`) and write the axis.
 * @param {HTMLElement} el
 */
function fit(el) {
    const spec = SPECS.get(el) ?? {};
    const track = /** @type {HTMLElement | null} */ (el.querySelector(':scope > .kp-uptime__track'));
    if (!track) return;
    const s = getStrings();
    const cells = /** @type {HTMLElement[]} */ ([...track.children]);
    const periods = spec.periods ?? [];
    const scroll = el.dataset.kpUptimeFit === 'scroll';
    const style = getComputedStyle(track);
    const min = Number.parseFloat(style.getPropertyValue('--kp-uptime-cell-min')) || 4;
    const gap = Number.parseFloat(style.columnGap) || 0;
    const n = scroll ? cells.length : uptimeFit(cells.length, track.clientWidth, min, gap);
    const firstShown = cells.length - n;
    let moved = false;
    cells.forEach((cell, i) => {
        const hide = i < firstShown;
        if (cell.hidden !== hide) {
            cell.hidden = hide;
            moved = true;
        }
    });
    if (moved) {
        const focusable = cells.filter((c) => !c.hidden && c.tabIndex === 0);
        if (focusable.length === 0) {
            const last = cells.at(-1);
            if (last && last.tagName === 'BUTTON') last.tabIndex = 0;
        }
        for (const c of cells) if (c.hidden && c.tabIndex === 0) c.tabIndex = -1;
    }
    track.style.setProperty('--kp-uptime-cells', String(n));
    // A scrolling strip stays at the latest period until the reader scrolls away from it.
    if (scroll && !UNPINNED.has(el)) track.scrollLeft = track.scrollWidth;

    const from = el.querySelector('.kp-uptime__from');
    const to = el.querySelector('.kp-uptime__to');
    const shown = el.querySelector('.kp-uptime__shown');
    const state = el.dataset.kpUptimeState;
    const real = state === 'ready' && periods.length > 0;
    if (from) from.textContent = real ? (firstShown === 0 && spec.from ? spec.from : (periods[firstShown]?.label ?? '')) : (spec.from ?? '');
    if (to) to.textContent = spec.to ?? (real ? (periods.at(-1)?.label ?? '') : '');
    if (shown) shown.textContent = real && !scroll && firstShown > 0 ? s.uptimeShown(n, cells.length) : '';
    if (scroll) edges(el, track);
}

/**
 * Mark the side a scrolling strip has more periods on, so the stylesheet fades that edge.
 * @param {HTMLElement} el @param {HTMLElement} track
 */
function edges(el, track) {
    const max = track.scrollWidth - track.clientWidth;
    el.toggleAttribute('data-kp-uptime-before', track.scrollLeft > 1);
    el.toggleAttribute('data-kp-uptime-after', track.scrollLeft < max - 1);
}

/**
 * Wire every strip under `root`: draw the waiting state of a strip not yet given its periods, follow its width, and
 * take its keys and presses.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachUptimes(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    const strips = /** @type {HTMLElement[]} */ ([
        ...(root instanceof Element && root.matches(UPTIME) ? [root] : []),
        ...root.querySelectorAll(UPTIME),
    ]);
    for (const el of strips) {
        if (el.dataset.kpUptimeAttached !== undefined) continue;
        el.dataset.kpUptimeAttached = '';
        if (!SPECS.has(el)) {
            const state = /** @type {UptimeSpec['state']} */ (el.dataset.kpUptimeState ?? 'loading');
            setUptime(el, { state });
        }
        let frame = 0;
        let width = -1;
        const watcher =
            typeof ResizeObserver === 'function'
                ? new ResizeObserver(() => {
                      const now = el.clientWidth;
                      if (now === width) return;
                      width = now;
                      cancelAnimationFrame(frame);
                      frame = requestAnimationFrame(() => fit(el));
                  })
                : null;
        watcher?.observe(el);
        /** @param {Event} event */
        const onScroll = (event) => {
            const track = /** @type {HTMLElement} */ (event.target);
            if (!(track instanceof HTMLElement) || !track.matches('.kp-uptime__track')) return;
            if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) UNPINNED.delete(el);
            else UNPINNED.add(el);
            edges(el, track);
        };
        el.addEventListener('scroll', onScroll, { capture: true, passive: true });
        // A strip that is laid out again (its fonts arrived, it was shown) keeps its latest period in view.
        const relaid = typeof ResizeObserver === 'function' ? new ResizeObserver(() => fit(el)) : null;
        const track = el.querySelector('.kp-uptime__track');
        if (relaid && track && el.dataset.kpUptimeFit === 'scroll') relaid.observe(track);

        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const cell = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest('button.kp-uptime__cell') : null);
            if (!cell || !el.contains(cell)) return;
            const cells = /** @type {HTMLElement[]} */ ([...el.querySelectorAll('button.kp-uptime__cell:not([hidden])')]);
            const at = cells.indexOf(cell);
            let next = -1;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = Math.min(cells.length - 1, at + 1);
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = Math.max(0, at - 1);
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = cells.length - 1;
            if (next < 0) return;
            event.preventDefault();
            if (next === at) return;
            for (const c of cells) c.tabIndex = -1;
            cells[next].tabIndex = 0;
            cells[next].focus();
        };
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const cell = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest('button.kp-uptime__cell') : null);
            if (!cell || !el.contains(cell)) return;
            const periods = SPECS.get(el)?.periods ?? [];
            const index = periods.findIndex((p) => p.key === cell.dataset.kpKey);
            if (index < 0) return;
            for (const c of el.querySelectorAll('button.kp-uptime__cell')) /** @type {HTMLElement} */ (c).tabIndex = -1;
            cell.tabIndex = 0;
            el.dispatchEvent(
                new CustomEvent(UPTIME_PICK_EVENT, { bubbles: true, detail: { key: cell.dataset.kpKey, index, period: periods[index] } }),
            );
        };
        el.addEventListener('keydown', onKey);
        el.addEventListener('click', onClick);
        cleanups.push(() => {
            watcher?.disconnect();
            relaid?.disconnect();
            el.removeEventListener('scroll', onScroll, { capture: true });
            cancelAnimationFrame(frame);
            el.removeEventListener('keydown', onKey);
            el.removeEventListener('click', onClick);
            CARDS.get(el)?.remove();
            CARDS.delete(el);
            delete el.dataset.kpUptimeAttached;
        });
    }
    const doc = root instanceof Document ? root : (root.ownerDocument ?? document);
    if (strips.length > 0) attachHoverCards(doc);
    return () => {
        for (const c of cleanups) c();
    };
}
