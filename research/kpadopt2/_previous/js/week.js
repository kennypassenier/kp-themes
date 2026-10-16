// A week agenda: seven day columns, the items of the week placed in time
// [kpadopt-time; the admin dashboard's `sch-week` and `sch-pill`].
//
// `section.kp-week[data-kp-week]` is filled by attachWeeks(): optionally a
// row of week buttons (`data-kp-week-nav`), the head of each day, an hour
// axis, and one column per day in which every item is a pill placed at its
// time of day. The page gives the items (setWeekEvents) and the state of the
// whole (setWeekState); the agenda paints them in place.
//
//   <section class="kp-week" data-kp-week data-kp-week-start="2026-10-16"
//            aria-label="Runs in the next 7 days"></section>
//
//   setWeekEvents(el, [
//       { id: 'backup', start: '2026-10-17T02:00:00+02:00', label: 'Backup photos', series: 1, detail: 'nightly, keeps 14' },
//       { id: 'host',   start: '2026-10-17T03:30:00+02:00', label: 'Host round',    state: 'reference' },
//   ]);
//
//   start    the day the week begins on, `YYYY-MM-DD` (`data-kp-week-start`,
//            else today in `data-kp-time-zone`, Europe/Brussels by default);
//            `data-kp-week-days` is how many columns (7)
//   series   1 to 5: the pill's colour, from `--chart-1` to `--chart-5`; the
//            colour never carries the meaning alone, the label does
//   state    `next` (a ring), `off` and `skipped` (muted, struck through),
//            `reference` (dashed, not a button: the host's own round)
//   crowd    a column holds as many pills as its height fits at one pill's
//            height; what does not fit is folded into a `+N` menu button at
//            the end of the stack, and its menu lists them. The page never
//            grows and no pill sits on another
//   narrow   below the agenda's own width of 40rem (a container query) the
//            seven columns become seven rows: the day on the left, its items
//            in time order on the right, every item shown, no `+N`
//   now      a line across today's column (`aria-label` "now, 14:32"),
//            moved every 30 s; items already past are muted
//   keys     one tab stop: ↑ ↓ move within a day, ← → to the neighbouring day
//            (the item nearest in time), Home and End to the day's first and
//            last, Enter or Space opens; Tab leaves the agenda
//   hover    the item's `detail` (else its name and time) in the page's one
//            hover card (js/hovercard.js)
//
// Events (bubbling, on the agenda):
//   kp-week-open    { id, event, source: 'pointer' | 'keyboard' }  an item was opened
//   kp-week-range   { start: 'YYYY-MM-DD', source: 'nav' }         a week button moved the range; give the new items
//
// Every date a person reads is dd/mm (the year in the day's name, rule 52);
// the machine's day is `YYYY-MM-DD`. Every word is in the dictionary (`week…`
// in js/strings.js). Nothing runs on import; attachWeeks(root) returns a
// detach. `decorate` marks every control the agenda builds (`pill`, `more`,
// `prev`, `next`, `today`), the shape every kp module's `decorate` takes.

import { CHART_TIME_ZONE, wallTime } from './chart.js';
import { dayKey, shiftDay } from './calendar.js';
import { resolveLocale } from './locale.js';
import { resolveStrings } from './strings.js';

/** A week agenda: `section.kp-week[data-kp-week]`. */
export const WEEK = '[data-kp-week]';
/** Fired on the agenda, bubbling, when an item was opened: `detail` `{ id, event, source: 'pointer' | 'keyboard' }`. */
export const WEEK_OPEN_EVENT = 'kp-week-open';
/** Fired on the agenda, bubbling, when a week button moved the range: `detail` `{ start: 'YYYY-MM-DD', source: 'nav' }`. */
export const WEEK_RANGE_EVENT = 'kp-week-range';
/** How often the now-line and the past marks move, in ms. */
export const WEEK_TICK_MS = 30_000;

/**
 * @typedef {'next' | 'off' | 'skipped' | 'reference'} WeekEventState
 * @typedef {object} WeekEvent
 * @property {string} id what the page calls the item; reported by `kp-week-open`
 * @property {number | string} start the moment: epoch ms, or an ISO string with its offset
 * @property {string} label what it is, one line (clipped with an ellipsis)
 * @property {1 | 2 | 3 | 4 | 5} [series] the colour, from `--chart-1`; 1 when absent
 * @property {WeekEventState} [state] absent for a plain item
 * @property {string} [detail] the hover card's words, and the end of the item's accessible name
 * @typedef {'loading' | 'ready' | 'empty' | 'error'} WeekState
 * @typedef {import('./strings.js').Strings} Strings
 */

/**
 * What `decorate` is told about the control it is handed.
 * `kind` is `pill`, `more`, `prev`, `next` or `today`; `id` is the item's (a pill) or the day's `YYYY-MM-DD` (`more`).
 * @typedef {{ kind: 'pill' | 'more' | 'prev' | 'next' | 'today', host: HTMLElement, key?: string, id?: string }} WeekDecorateInfo
 *
 * @typedef {object} WeekOptions
 * @property {string} [timeZone] the IANA zone that decides which day an item is on; else `data-kp-time-zone`, else `Europe/Brussels`
 * @property {string} [locale] the weekday names; else `data-kp-locale`, else the nearest `lang`
 * @property {() => number} [now] the clock, `Date.now` by default
 * @property {Partial<Strings>} [strings] any of the dictionary's words, for these agendas only
 * @property {(part: HTMLElement, info: WeekDecorateInfo) => void} [decorate]
 *
 * @typedef {{ event: WeekEvent, ms: number, at: number, hhmm: string, button: HTMLButtonElement, day: string }} WeekItem
 * @typedef {{ iso: string, cell: HTMLElement, head: HTMLElement, track: HTMLElement, items: WeekItem[], now: HTMLElement,
 *   more: HTMLElement | null, moreButton: HTMLButtonElement | null, ghosts: HTMLElement[], hidden: WeekItem[] }} WeekDay
 * @typedef {{ el: HTMLElement, zone: string, locale: string, now: () => number, strings: Strings, decorate?: WeekOptions['decorate'],
 *   start: string, days: number, events: WeekEvent[], state: WeekState, active: string | null, grid: HTMLElement,
 *   axis: HTMLElement, cols: WeekDay[], stateLine: HTMLElement, title: HTMLElement | null, legend: HTMLElement,
 *   pills: Map<string, HTMLButtonElement>, timer: number, observer: ResizeObserver | null, mode: 'grid' | 'list' }} WeekModel
 */

/** @type {WeakMap<Element, WeekModel>} */
const weeks = new WeakMap();
let idSeq = 0;
/** The gap between two stacked pills, px. */
const GAP = 2;
/** The hours the axis names. */
const AXIS_HOURS = [0, 6, 12, 18, 24];

/** Two digits. @param {number} n */
const two = (n) => String(n).padStart(2, '0');

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {Document} doc
 * @param {K} tag
 * @param {string} [className]
 * @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
const make = (doc, tag, className, text) => {
    const el = doc.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
};

/** @param {number | string} when @returns {number} */
const toMs = (when) => (typeof when === 'number' ? when : Date.parse(when));

/** @param {Element} host @returns {string | undefined} */
const keyOf = (host) => host.getAttribute('data-kp-key') ?? undefined;

/**
 * Where the pills of one column stand: each at its time of day, pushed down
 * until it clears the one above, and pulled back up where the stack would run
 * out of the bottom. Pure; every number is px of the column's height.
 *
 * @param {number[]} wants each pill's wanted top, as a share of the column (0 to 1), in time order
 * @param {number} height the column's height
 * @param {number} pill one pill's height
 * @param {number} [gap] the space kept between two pills
 * @returns {number[]} each pill's top
 */
export function stackPills(wants, height, pill, gap = GAP) {
    const step = pill + gap;
    const max = Math.max(0, height - pill);
    const tops = wants.map((want) => Math.min(Math.max(0, want * height), max));
    for (let i = 1; i < tops.length; i += 1) tops[i] = Math.max(tops[i] ?? 0, (tops[i - 1] ?? 0) + step);
    const last = tops.length - 1;
    if (last >= 0 && (tops[last] ?? 0) > max) {
        tops[last] = max;
        for (let i = last - 1; i >= 0; i -= 1) tops[i] = Math.min(tops[i] ?? 0, (tops[i + 1] ?? 0) - step);
    }
    return tops;
}

/**
 * How many pills a column of `height` holds at one pill's height.
 * @param {number} height
 * @param {number} pill
 * @param {number} [gap]
 * @returns {number}
 */
export function pillCapacity(height, pill, gap = GAP) {
    return Math.max(1, Math.floor((height - pill) / (pill + gap)) + 1);
}

/** @param {WeekModel} c @param {string} iso */
const dayName = (c, iso, style = /** @type {'short' | 'long'} */ ('short')) =>
    new Intl.DateTimeFormat(c.locale, { weekday: style, timeZone: 'UTC' }).format(Date.parse(`${iso}T12:00:00Z`));

/** `17/10` for the head, `17/10/2026` for a name. @param {string} iso @param {boolean} [year] */
const dm = (iso, year = false) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}${year ? `/${iso.slice(0, 4)}` : ''}`;

/** @param {WeekModel} c @param {WeekEvent} e @param {string} hhmm @param {string} iso */
function nameOf(c, e, hhmm, iso) {
    const s = c.strings;
    const state =
        e.state === 'next'
            ? s.weekNextRun
            : e.state === 'off'
              ? s.weekOff
              : e.state === 'skipped'
                ? s.weekSkipped
                : e.state === 'reference'
                  ? s.weekReference
                  : '';
    return [`${e.label}, ${dayName(c, iso)} ${dm(iso, true)} ${hhmm}`, state, e.detail ?? ''].filter(Boolean).join(', ');
}

/** The time of day of a moment: `{ hhmm, at }`, `at` a share of the day (0 to 1). @param {WeekModel} c @param {number} ms */
function timeOfDay(c, ms) {
    const w = wallTime(ms, c.zone);
    return { hhmm: `${two(w.hour)}:${two(w.minute)}`, at: (w.hour * 60 + w.minute) / 1440 };
}

/** Build the chrome once; the days are filled by paint(). @param {WeekModel} c */
function build(c) {
    const doc = c.el.ownerDocument;
    const s = c.strings;
    const level = c.el.dataset.kpHeadingLevel ?? '2';
    const parts = [];
    if (c.el.hasAttribute('data-kp-week-nav')) {
        const nav = make(doc, 'div', 'kp-week__nav');
        nav.setAttribute('role', 'group');
        nav.setAttribute('aria-label', s.weekGroup);
        const prev = make(doc, 'button', 'kp-button kp-button--sm', s.weekPrev);
        prev.type = 'button';
        prev.dataset.kpWeekPrev = '';
        const title = make(doc, /** @type {'h2'} */ (`h${level}`), 'kp-week__title');
        title.setAttribute('aria-live', 'polite');
        const next = make(doc, 'button', 'kp-button kp-button--sm', s.weekNext);
        next.type = 'button';
        next.dataset.kpWeekNext = '';
        const today = make(doc, 'button', 'kp-button kp-button--sm', s.weekToday);
        today.type = 'button';
        today.dataset.kpWeekToday = '';
        nav.append(prev, title, next, today);
        c.title = title;
        c.decorate?.(prev, { kind: 'prev', host: c.el, key: keyOf(c.el) });
        c.decorate?.(next, { kind: 'next', host: c.el, key: keyOf(c.el) });
        c.decorate?.(today, { kind: 'today', host: c.el, key: keyOf(c.el) });
        parts.push(nav);
    }
    const frame = make(doc, 'div', 'kp-week__frame');
    c.grid = make(doc, 'div', 'kp-week__grid');
    c.grid.setAttribute('role', 'group');
    if (!c.el.hasAttribute('aria-label') && !c.el.hasAttribute('aria-labelledby')) c.grid.setAttribute('aria-label', s.weekGroup);
    c.axis = make(doc, 'div', 'kp-week__axis');
    c.axis.setAttribute('aria-hidden', 'true');
    for (const hour of AXIS_HOURS) {
        const mark = make(doc, 'span', '', `${two(hour)}:00`);
        mark.style.setProperty('--kp-week-at', String(hour / 24));
        c.axis.append(mark);
    }
    c.grid.append(c.axis);
    c.stateLine = make(doc, 'p', 'kp-week__state');
    c.stateLine.setAttribute('role', 'status');
    frame.append(c.grid, c.stateLine);
    c.legend = make(doc, 'ul', 'kp-week__legend');
    c.legend.hidden = true;
    parts.push(frame, c.legend);
    c.el.replaceChildren(...parts);
}

/** (Re)build the day columns for the range; keeps the pills by id. @param {WeekModel} c */
function buildDays(c) {
    const doc = c.el.ownerDocument;
    const s = c.strings;
    for (const col of c.cols) col.cell.remove();
    c.cols = [];
    const today = dayKey(c.now(), c.zone);
    for (let i = 0; i < c.days; i += 1) {
        const iso = shiftDay(c.start, i);
        const cell = make(doc, 'div', 'kp-week__day');
        cell.setAttribute('role', 'group');
        cell.setAttribute('aria-label', `${dayName(c, iso, 'long')} ${dm(iso, true)}`);
        cell.dataset.kpDate = iso;
        cell.style.setProperty('--kp-week-i', String(i));
        const head = make(doc, 'div', 'kp-week__head');
        head.append(
            make(doc, 'span', 'kp-week__dow', dayName(c, iso)),
            make(doc, 'span', 'kp-week__num', iso.slice(8, 10)),
            make(doc, 'span', 'kp-week__date', dm(iso)),
        );
        const mark = make(doc, 'span', 'kp-week__today', s.weekToday);
        head.append(mark);
        const track = make(doc, 'div', 'kp-week__col');
        const now = make(doc, 'div', 'kp-week__now');
        now.setAttribute('role', 'separator');
        now.hidden = true;
        track.append(now);
        // Ghosts for the loading state, at the final size of a pill.
        const ghosts = [0.18, 0.32, 0.5, 0.74].slice(0, 2 + (i % 3)).map((at, g) => {
            const ghost = make(doc, 'span', 'kp-week__ghost kp-skeleton');
            ghost.setAttribute('aria-hidden', 'true');
            ghost.style.setProperty('--kp-week-at', String(at + ((i + g) % 3) * 0.04));
            return ghost;
        });
        track.append(...ghosts);
        cell.append(head, track);
        c.grid.append(cell);
        c.cols.push({ iso, cell, head, track, items: [], now, more: null, moreButton: null, ghosts, hidden: [] });
        if (iso === today) {
            cell.dataset.kpToday = '';
            head.setAttribute('aria-current', 'date');
        }
    }
    c.grid.style.setProperty('--kp-week-days', String(c.days));
    if (c.title) {
        const last = c.cols[c.cols.length - 1]?.iso ?? c.start;
        c.title.textContent = `${dm(c.start, true)} – ${dm(last, true)}`;
    }
}

/** A pill for an item, kept by id. @param {WeekModel} c @param {WeekEvent} e */
function pillFor(c, e) {
    let button = c.pills.get(e.id);
    const doc = c.el.ownerDocument;
    const reference = e.state === 'reference';
    if (button && (button.tagName === 'BUTTON') === reference) {
        button.remove();
        button = undefined;
    }
    if (!button) {
        button = /** @type {HTMLButtonElement} */ (make(doc, reference ? 'span' : 'button', 'kp-week__pill'));
        if (!reference) button.type = 'button';
        button.append(make(doc, 'b', 'kp-week__time'), make(doc, 'span', 'kp-week__label'));
        c.pills.set(e.id, button);
        c.decorate?.(button, { kind: 'pill', host: c.el, key: keyOf(c.el), id: e.id });
    }
    button.dataset.kpId = e.id;
    return button;
}

/** Everything the week shows, from the model. @param {WeekModel} c */
function paint(c) {
    const s = c.strings;
    const doc = c.el.ownerDocument;
    const byDay = new Map(c.cols.map((col) => [col.iso, /** @type {WeekItem[]} */ ([])]));
    const live = new Set();
    for (const event of c.events) {
        const ms = toMs(event.start);
        if (!Number.isFinite(ms)) continue;
        const day = dayKey(ms, c.zone);
        const list = byDay.get(day);
        if (!list) continue;
        const { hhmm, at } = timeOfDay(c, ms);
        const button = pillFor(c, event);
        live.add(event.id);
        button.dataset.kpSeries = String(event.series ?? 1);
        if (event.state) button.dataset.kpState = event.state;
        else delete button.dataset.kpState;
        const time = /** @type {HTMLElement} */ (button.querySelector('.kp-week__time'));
        const label = /** @type {HTMLElement} */ (button.querySelector('.kp-week__label'));
        if (time.textContent !== hhmm) time.textContent = hhmm;
        if (label.textContent !== event.label) label.textContent = event.label;
        const name = nameOf(c, event, hhmm, day);
        if (button.getAttribute('aria-label') !== name) button.setAttribute('aria-label', name);
        button.setAttribute('data-kp-hovercard', event.detail || `${event.label} · ${hhmm}`);
        if (event.state === 'reference') button.setAttribute('role', 'note');
        list.push({ event, ms, at, hhmm, button, day });
    }
    for (const [id, button] of c.pills)
        if (!live.has(id)) {
            button.remove();
            c.pills.delete(id);
        }
    for (const col of c.cols) {
        col.items = (byDay.get(col.iso) ?? []).sort((a, b) => a.ms - b.ms);
    }
    c.el.dataset.kpState = c.state;
    c.grid.toggleAttribute('aria-busy', c.state === 'loading');
    const words = c.state === 'loading' ? s.weekLoading : c.state === 'empty' ? s.weekEmpty : c.stateLine.dataset.kpWords || '';
    c.stateLine.textContent = c.state === 'ready' ? '' : words;
    c.stateLine.dataset.kpState = c.state;
    for (const col of c.cols) {
        const nodes = c.state === 'loading' ? [] : col.items.map((item) => item.button);
        const wanted = [col.now, ...col.ghosts, ...nodes];
        // Re-order only when the order differs: moving a focused node loses its focus.
        const have = [...col.track.children].filter((n) => n !== col.moreButton?.parentElement);
        const same = wanted.length === have.length && wanted.every((n, i) => n === have[i]);
        if (!same) {
            for (const n of nodes) n.remove();
            col.track.append(...nodes);
        }
    }
    layout(c);
    if (!c.active || !c.pills.has(c.active)) {
        const first = c.cols.flatMap((col) => col.items).find((i) => i.button.tagName === 'BUTTON');
        c.active = first?.event.id ?? null;
    }
    syncTabStops(c);
    tick(c);
    void doc;
}

/** Place the pills of every column, fold what does not fit. @param {WeekModel} c */
function layout(c) {
    c.mode = getComputedStyle(c.grid).getPropertyValue('--kp-week-mode').trim() === 'list' ? 'list' : 'grid';
    c.el.dataset.kpWeekMode = c.mode;
    for (const col of c.cols) {
        for (const item of col.items) {
            item.button.removeAttribute('data-kp-overflow');
            item.button.style.removeProperty('--kp-week-top');
        }
        col.hidden = [];
        if (c.mode === 'list' || c.state === 'loading') {
            foldMenu(c, col);
            continue;
        }
        const height = col.track.clientHeight;
        const sample = col.items.find((i) => i.button.offsetHeight > 0)?.button.offsetHeight ?? 0;
        if (!height || !sample) {
            foldMenu(c, col);
            continue;
        }
        const room = pillCapacity(height, sample);
        const items = col.items;
        const keep = items.length > room ? items.slice(0, room - 1) : items;
        col.hidden = items.length > room ? items.slice(room - 1) : [];
        const wants = keep.map((i) => i.at);
        if (col.hidden.length) wants.push(col.hidden[0]?.at ?? 1);
        const tops = stackPills(wants, height, sample);
        keep.forEach((item, i) => item.button.style.setProperty('--kp-week-top', `${tops[i]}px`));
        for (const item of col.hidden) item.button.setAttribute('data-kp-overflow', '');
        foldMenu(c, col, tops[keep.length] ?? 0);
    }
}

let menuModule = /** @type {Promise<typeof import('./menu-button.js')> | null} */ (null);

/** The `+N` of one column: a menu button listing what did not fit. @param {WeekModel} c @param {WeekDay} col @param {number} [top] */
function foldMenu(c, col, top = 0) {
    const doc = c.el.ownerDocument;
    const n = col.hidden.length;
    if (!n) {
        col.more?.setAttribute('hidden', '');
        return;
    }
    if (!col.more) {
        const wrapper = make(doc, 'div', 'kp-menu-button kp-week__more');
        wrapper.setAttribute('data-kp-menu-button', '');
        const button = make(doc, 'button', 'kp-week__pill kp-week__pill--more');
        button.type = 'button';
        const menu = make(doc, 'div', 'kp-menu kp-menu--rich');
        menu.setAttribute('role', 'menu');
        wrapper.append(button, menu);
        col.track.append(wrapper);
        col.more = wrapper;
        col.moreButton = button;
        c.decorate?.(button, { kind: 'more', host: c.el, key: keyOf(c.el), id: col.iso });
        menuModule ??= import('./menu-button.js');
        void menuModule.then((m) => {
            m.attachMenuButtons(wrapper);
            fillMenu(c, col);
        });
        wrapper.addEventListener('kp-menu-select', (event) => {
            const id = /** @type {CustomEvent} */ (event).detail?.value;
            const item = col.hidden.find((i) => i.event.id === id) ?? col.items.find((i) => i.event.id === id);
            if (item) open(c, item, 'keyboard');
        });
    }
    col.more.removeAttribute('hidden');
    col.more.style.setProperty('--kp-week-top', `${top}px`);
    const text = c.strings.weekMore(n);
    if (col.moreButton && col.moreButton.textContent !== text) col.moreButton.textContent = text;
    col.moreButton?.setAttribute('aria-label', c.strings.weekMoreLabel(n, `${dayName(c, col.iso)} ${dm(col.iso, true)}`));
    void menuModule?.then(() => fillMenu(c, col));
}

/** @param {WeekModel} c @param {WeekDay} col */
function fillMenu(c, col) {
    if (!col.more) return;
    void menuModule?.then((m) => {
        if (!col.more?.isConnected) return;
        m.setMenu(col.more, [
            {
                group: '',
                items: col.hidden.map((i) => ({
                    label: `${i.hhmm} ${i.event.label}`,
                    value: i.event.id,
                    ...(i.event.detail ? { hint: i.event.detail } : {}),
                    ...(i.event.state === 'reference' ? { disabled: c.strings.weekReference } : {}),
                })),
            },
        ]);
    });
}

/** The pills a person can reach, per column, in time order. @param {WeekModel} c @param {WeekDay} col */
function reachable(c, col) {
    const list = col.items.filter((i) => i.button.tagName === 'BUTTON' && !(c.mode === 'grid' && i.button.hasAttribute('data-kp-overflow')));
    return /** @type {HTMLElement[]} */ (list.map((i) => i.button)).concat(
        col.hidden.length && col.moreButton && c.mode === 'grid' ? [col.moreButton] : [],
    );
}

/** One tab stop: the active pill. @param {WeekModel} c */
function syncTabStops(c) {
    const all = /** @type {HTMLElement[]} */ (
        c.cols.flatMap((col) => [...col.items.map((i) => i.button), ...(col.moreButton ? [col.moreButton] : [])])
    );
    let target = c.active ? c.pills.get(c.active) : undefined;
    if (!target || !all.includes(target) || (c.mode === 'grid' && target.hasAttribute('data-kp-overflow'))) {
        target = /** @type {HTMLButtonElement | undefined} */ (c.cols.flatMap((col) => reachable(c, col))[0]);
    }
    for (const el of all) el.tabIndex = el === target ? 0 : -1;
}

/** @param {WeekModel} c @param {WeekItem} item @param {'pointer' | 'keyboard'} source */
function open(c, item, source) {
    c.el.dispatchEvent(new CustomEvent(WEEK_OPEN_EVENT, { bubbles: true, detail: { id: item.event.id, event: item.event, source } }));
}

/** The now-line and the past marks. @param {WeekModel} c */
function tick(c) {
    const now = c.now();
    const today = dayKey(now, c.zone);
    const { hhmm, at } = timeOfDay(c, now);
    for (const col of c.cols) {
        const isToday = col.iso === today;
        col.cell.toggleAttribute('data-kp-today', isToday);
        if (isToday) col.head.setAttribute('aria-current', 'date');
        else col.head.removeAttribute('aria-current');
        col.now.hidden = !isToday;
        if (isToday) {
            col.now.style.setProperty('--kp-week-at', String(at));
            col.now.setAttribute('aria-label', c.strings.weekNowAt(hhmm));
        }
        for (const item of col.items) item.button.toggleAttribute('data-kp-past', item.ms < now);
    }
}

/** Move the roving focus. @param {WeekModel} c @param {HTMLElement} to */
function focusPill(c, to) {
    c.active = to.dataset.kpId ?? c.active;
    syncTabStops(c);
    if (to.tabIndex !== 0) to.tabIndex = 0;
    to.focus();
}

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
            stateLine: el,
            title: null,
            legend: el,
            pills: new Map(),
            timer: 0,
            observer: null,
            mode: 'grid',
        };
        weeks.set(el, c);
        build(c);
        buildDays(c);
        paint(c);
        // The one hover card of the page carries each item's detail.
        void import('./hovercard.js').then((m) => m.attachHoverCards(el.ownerDocument));

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
            if (!target) return;
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
                const key = `${c.grid.clientWidth}x${c.cols[0]?.track.clientHeight ?? 0}`;
                if (key === last) return;
                last = key;
                layout(c);
                syncTabStops(c);
            });
            c.observer.observe(c.grid);
        }
        undo.push(() => {
            el.removeEventListener('click', onClick);
            el.removeEventListener('keydown', onKey);
            el.removeEventListener('click', onNav);
            window.clearInterval(c.timer);
            c.observer?.disconnect();
            weeks.delete(el);
        });
    }
    return () => undo.splice(0).forEach((off) => off());
}

/**
 * The items of the range. Repaints in place, by id: a pill that is still there
 * keeps its node, its focus and its place in the tab order, so a live update
 * never moves a reader. A week that was loading is ready from here on.
 * @param {Element} el
 * @param {WeekEvent[]} events
 */
export function setWeekEvents(el, events) {
    const c = weeks.get(el);
    if (!c) return;
    c.events = events;
    if (c.state === 'loading' || (c.state === 'empty' && events.length)) c.state = 'ready';
    else if (c.state === 'ready' && !events.length) c.state = 'empty';
    paint(c);
}

/**
 * The agenda as a whole: `loading` (ghost pills at the final size), `ready`,
 * `empty` or `error` (`words` over the grid; an error says it in the page's
 * words).
 * @param {Element} el
 * @param {WeekState} state
 * @param {string} [words]
 */
export function setWeekState(el, state, words = '') {
    const c = weeks.get(el);
    if (!c) return;
    c.state = state;
    c.stateLine.dataset.kpWords = words;
    paint(c);
}

/**
 * Move the range to start on `iso` (`YYYY-MM-DD`); no event, the page asked.
 * The items stay until the page gives the new ones.
 * @param {Element} el
 * @param {string} iso
 */
export function setWeekStart(el, iso) {
    const c = weeks.get(el);
    if (!c) return;
    c.start = iso;
    buildDays(c);
    paint(c);
}

/**
 * The legend under the agenda: a swatch and its words per series, in the
 * order given; none hides it.
 * @param {Element} el
 * @param {{ series: 1 | 2 | 3 | 4 | 5, label: string }[]} entries
 */
export function setWeekLegend(el, entries) {
    const c = weeks.get(el);
    if (!c) return;
    const doc = c.el.ownerDocument;
    c.legend.replaceChildren(
        ...entries.map(({ series, label }) => {
            const li = make(doc, 'li');
            const swatch = make(doc, 'span', 'kp-week__swatch');
            swatch.dataset.kpSeries = String(series);
            swatch.setAttribute('aria-hidden', 'true');
            li.append(swatch, make(doc, 'span', '', label));
            return li;
        }),
    );
    c.legend.hidden = entries.length === 0;
}
