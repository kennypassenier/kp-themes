// Behaviour for the dashboard components of round two (2026-10-04), written
// as it would land in js/: pure exports, nothing runs on import, every attach
// function takes a root and returns a detach, and what it acts on is declared
// in markup (classes and data-kp-* attributes), never named by an app.
//
//   attachMenuButtons(root)      a menu button: groups, hints, reasons, keys [port2-1]
//   setMenu(wrapper, groups)     its entries, deferred while it is open [port2-1]
//   setMeter(el, meter)          a meter with a mark tick, its ARIA in one call [port2-2]
//   attachKpiStrips(root)        a key-figure strip on allowed column counts [port2-3]
//   attachTrendCharts(root)      a key figure's 24-hour trend: axis, readout, keys [port2-4]
//   attachCalendars(root)        a month heatmap with tones, today and keys [port2-5]
//   attachGraphs(root)           a hub-and-ring graph with kinds and a selection [port2-6]
//   startTour(steps)             a guided tour over the page, exact counts [port2-7]
//
// Every moment a person reads is dd/mm/yyyy HH:mm, 24-hour, in Europe/Brussels
// (rule 52), whatever zone the viewer's computer is in. Words are plain
// English constants for now; they join js/strings.js on the move.
//
// Every attach function takes `decorate(part, info)`: kp calls it each time it
// builds a control (a menu entry, a calendar day, a graph node, a tour button),
// so a consumer can mark them (the dashboard's Live view marks every control).

import { drawSparkline } from '../../js/kpi.js';

/* ------------------------------------------------------------- shared */

/** The zone every moment is read in, unless a component is told another. */
export const TIME_ZONE = 'Europe/Brussels';

/**
 * @typedef {{ kind: string, host: Element, key?: string, index?: number, label?: string, value?: string }} DecorateInfo
 * @typedef {(part: Element, info: DecorateInfo) => void} Decorate
 */

/** @param {Element} host @returns {string | undefined} */
const keyOf = (host) => host.getAttribute('data-kp-key') ?? undefined;

/** @type {Map<string, Intl.DateTimeFormat>} */
const zoneFormats = new Map();

/**
 * A moment's calendar parts on the wall clock of `timeZone`.
 * @param {number} ms
 * @param {string} timeZone
 * @returns {{ year: string, month: string, day: string, hour: string, minute: string }}
 */
export function zoneParts(ms, timeZone = TIME_ZONE) {
    let format = zoneFormats.get(timeZone);
    if (!format) {
        format = new Intl.DateTimeFormat('en-GB', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        });
        zoneFormats.set(timeZone, format);
    }
    /** @type {Record<string, string>} */
    const parts = {};
    for (const part of format.formatToParts(ms)) parts[part.type] = part.value;
    return { year: parts.year, month: parts.month, day: parts.day, hour: parts.hour, minute: parts.minute };
}

/** `04/10/2026 14:40` @param {number} ms @param {string} [timeZone] */
export const formatMoment = (ms, timeZone = TIME_ZONE) => {
    const p = zoneParts(ms, timeZone);
    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
};

/** `14:40` @param {number} ms @param {string} [timeZone] */
export const formatClock = (ms, timeZone = TIME_ZONE) => {
    const p = zoneParts(ms, timeZone);
    return `${p.hour}:${p.minute}`;
};

/** The day a moment falls on in `timeZone`, as `YYYY-MM-DD` (for machines). @param {number} ms @param {string} [timeZone] */
export const dayKey = (ms, timeZone = TIME_ZONE) => {
    const p = zoneParts(ms, timeZone);
    return `${p.year}-${p.month}-${p.day}`;
};

/** `2026-10-04` → `04/10/2026` @param {string} iso */
export const formatDay = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

/** @param {Document} doc @returns {boolean} */
const reducedMotion = (doc) => !!doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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

let idSeq = 0;
/** @param {string} prefix */
const nextId = (prefix) => `${prefix}-${(idSeq += 1)}`;

/** Is `el` laid out (not hidden, not inside something hidden)? @param {Element | null} el */
const isShown = (el) => !!el && el.isConnected && el.getClientRects().length > 0;

/* ======================================================== menu button */

/** A menu button's wrapper: a button, then its `[role=menu]`. */
export const MENU_BUTTON = '[data-kp-menu-button]';

/** Fired on the wrapper. `kp-menu-select` is cancelable: preventing it keeps the menu open. */
export const MENU_OPEN_EVENT = 'kp-menu-open';
export const MENU_CLOSE_EVENT = 'kp-menu-close';
export const MENU_SELECT_EVENT = 'kp-menu-select';

export const MENU_STRINGS = {
    loading: 'Loading the actions…',
    empty: 'Nothing to do here right now.',
};

/**
 * @typedef {{ label: string, hint?: string, href?: string, download?: string, disabled?: string | null,
 *   danger?: boolean, attrs?: Record<string, string | null>, value?: string }} MenuItem
 * @typedef {{ group: string, items: MenuItem[] }} MenuGroup
 * @typedef {{ wrapper: HTMLElement, button: HTMLElement, menu: HTMLElement, decorate?: Decorate,
 *   drawn: string, pending: MenuGroup[] | 'loading' | null, open: boolean, empty: boolean,
 *   off: (() => void)[] }} MenuState
 */

/** @type {WeakMap<Element, MenuState>} */
const menus = new WeakMap();

/** What a fill shows, as one string: a fill that shows the same is skipped. @param {MenuGroup[] | 'loading'} groups */
export const menuSignature = (groups) =>
    groups === 'loading'
        ? 'loading'
        : JSON.stringify(
              groups.map((g) => [
                  g.group,
                  g.items.map((i) => [i.label, i.hint ?? '', i.href ?? '', i.download ?? '', i.disabled ?? '', !!i.danger, i.attrs ?? null, i.value ?? '']),
              ]),
          );

/** What a fill would draw in this wrapper: the entries and how a reason shows. @param {MenuState} s @param {MenuGroup[] | 'loading'} groups */
const drawnKey = (s, groups) => `${s.wrapper.dataset.kpMenuReason ?? 'replace'}|${menuSignature(groups)}`;

/** @param {MenuState} s @returns {HTMLElement[]} */
const menuItems = (s) => /** @type {HTMLElement[]} */ ([...s.menu.querySelectorAll('[role="menuitem"]')]);

/** @param {MenuState} s @param {HTMLElement} item @param {number} index */
const decorateItem = (s, item, index) =>
    s.decorate?.(item, {
        kind: 'menu-item',
        host: s.wrapper,
        key: keyOf(s.wrapper),
        index,
        label: item.querySelector('.kp-menu__label')?.textContent ?? item.textContent ?? '',
        value: item.dataset.kpValue,
    });

/**
 * One entry: a label over a hint; a disabled one says why instead (or, with
 * `data-kp-menu-reason="add"` on the wrapper, under the hint).
 * @param {Document} doc
 * @param {MenuItem} item
 * @param {boolean} addReason
 * @returns {HTMLElement}
 */
function menuEntry(doc, item, addReason) {
    const el = /** @type {HTMLElement} */ (doc.createElement(item.href ? 'a' : 'button'));
    if (item.href) {
        el.setAttribute('href', item.href);
        if (item.download) el.setAttribute('download', item.download);
    } else el.setAttribute('type', 'button');
    el.setAttribute('role', 'menuitem');
    el.className = `kp-menu__item${item.danger ? ' kp-menu__item--destructive' : ''}`;
    el.tabIndex = -1;
    const label = make(doc, 'span', 'kp-menu__label', item.label);
    label.id = nextId('kp-menu-label');
    el.setAttribute('aria-labelledby', label.id);
    el.append(label);
    /** @type {string[]} */
    const described = [];
    const showHint = item.hint && !(item.disabled && !addReason);
    if (showHint) {
        const hint = make(doc, 'span', 'kp-menu__hint', item.hint);
        hint.id = nextId('kp-menu-hint');
        described.push(hint.id);
        el.append(hint);
    }
    if (item.disabled) {
        const reason = make(doc, 'span', addReason ? 'kp-menu__hint kp-menu__reason' : 'kp-menu__hint', item.disabled);
        reason.id = nextId('kp-menu-reason');
        described.push(reason.id);
        el.append(reason);
        el.setAttribute('aria-disabled', 'true');
        el.dataset.kpReason = item.disabled;
    }
    if (described.length) el.setAttribute('aria-describedby', described.join(' '));
    el.title = item.disabled ?? item.hint ?? '';
    if (item.value) el.dataset.kpValue = item.value;
    for (const [name, value] of Object.entries(item.attrs ?? {})) {
        if (value == null) el.removeAttribute(name);
        else el.setAttribute(name, value);
    }
    return el;
}

/** @param {MenuState} s @param {MenuGroup[] | 'loading'} groups */
function drawMenu(s, groups) {
    const doc = s.menu.ownerDocument;
    s.drawn = drawnKey(s, groups);
    const addReason = s.wrapper.dataset.kpMenuReason === 'add';
    if (groups === 'loading') {
        const entry = menuEntry(doc, { label: MENU_STRINGS.loading, hint: ' ' }, false);
        entry.setAttribute('aria-disabled', 'true');
        entry.dataset.kpLoading = '';
        s.menu.replaceChildren(entry);
        s.menu.setAttribute('aria-busy', 'true');
        setEmpty(s, false);
        return;
    }
    s.menu.removeAttribute('aria-busy');
    const used = groups.filter((g) => g.items.length);
    const total = used.reduce((n, g) => n + g.items.length, 0);
    /** @type {HTMLElement[]} */
    const blocks = [];
    let index = 0;
    for (const group of used) {
        const block = make(doc, 'div', 'kp-menu__group');
        // One entry, or a nameless group: no heading, so nothing to name it by.
        if (group.group && total > 1) {
            const heading = make(doc, 'p', 'kp-menu__heading', group.group);
            heading.id = nextId('kp-menu-group');
            heading.setAttribute('role', 'presentation');
            block.setAttribute('role', 'group');
            block.setAttribute('aria-labelledby', heading.id);
            block.append(heading);
        } else block.setAttribute('role', 'none');
        for (const item of group.items) {
            const entry = menuEntry(doc, item, addReason);
            block.append(entry);
            decorateItem(s, entry, index);
            index += 1;
        }
        blocks.push(block);
    }
    s.menu.replaceChildren(...blocks);
    setEmpty(s, total === 0);
}

/** No entries: the button hides (`data-kp-menu-empty="hide"`) or says why it does nothing. @param {MenuState} s @param {boolean} empty */
function setEmpty(s, empty) {
    s.empty = empty;
    const hide = s.wrapper.dataset.kpMenuEmpty === 'hide';
    s.wrapper.hidden = empty && hide;
    if (empty && !hide) {
        s.button.setAttribute('aria-disabled', 'true');
        s.button.title = MENU_STRINGS.empty;
    } else if (s.button.getAttribute('aria-disabled') === 'true') {
        s.button.removeAttribute('aria-disabled');
        s.button.removeAttribute('title');
    }
}

/**
 * Open a menu button's menu and put the focus on its first (or last) entry.
 * @param {Element} wrapper
 * @param {{ focus?: 'first' | 'last' }} [options]
 */
export function openMenu(wrapper, { focus = 'first' } = {}) {
    const s = menus.get(wrapper);
    if (!s || s.open || s.empty) return;
    const doc = s.menu.ownerDocument;
    const view = doc.defaultView;
    s.open = true;
    s.menu.hidden = false;
    s.button.setAttribute('aria-expanded', 'true');
    /** @param {MouseEvent} event */
    const outside = (event) => {
        if (!s.wrapper.contains(/** @type {Node} */ (event.target))) closeMenu(s.wrapper);
    };
    /** @param {KeyboardEvent} event */
    const escape = (event) => {
        if (event.key !== 'Escape') return;
        // Capture, on the window: the menu's Escape is its own, and the page's
        // Escape (or a dialog's) does not fire as well.
        event.preventDefault();
        event.stopPropagation();
        closeMenu(s.wrapper, { focus: true });
    };
    doc.addEventListener('click', outside, true);
    view?.addEventListener('keydown', escape, true);
    s.off.push(
        () => doc.removeEventListener('click', outside, true),
        () => view?.removeEventListener('keydown', escape, true),
    );
    const items = menuItems(s);
    const target = focus === 'last' ? items.at(-1) : items[0];
    target?.focus();
    s.wrapper.dispatchEvent(new CustomEvent(MENU_OPEN_EVENT, { bubbles: true }));
}

/**
 * Close it; with `focus`, the focus goes back to the button. A fill that
 * waited while it was open is drawn now.
 * @param {Element} wrapper
 * @param {{ focus?: boolean }} [options]
 */
export function closeMenu(wrapper, { focus = false } = {}) {
    const s = menus.get(wrapper);
    if (!s || !s.open) return;
    s.open = false;
    s.menu.hidden = true;
    s.button.setAttribute('aria-expanded', 'false');
    for (const off of s.off.splice(0)) off();
    if (focus) s.button.focus();
    if (s.pending) {
        const next = s.pending;
        s.pending = null;
        drawMenu(s, next);
    }
    s.wrapper.dispatchEvent(new CustomEvent(MENU_CLOSE_EVENT, { bubbles: true }));
}

/**
 * Give a menu button its entries. Skipped when they show the same as now;
 * while the menu is open the change waits until it closes, so a live refill
 * never moves an entry under the pointer or the focus. `'loading'` shows one
 * disabled entry at the final row height.
 * @param {Element} wrapper
 * @param {MenuGroup[] | 'loading'} groups
 */
export function setMenu(wrapper, groups) {
    const s = menus.get(wrapper) ?? wireMenu(/** @type {HTMLElement} */ (wrapper));
    if (!s) return;
    if (drawnKey(s, groups) === s.drawn) {
        s.pending = null;
        return;
    }
    if (s.open) {
        s.pending = groups;
        return;
    }
    drawMenu(s, groups);
}

/**
 * @param {HTMLElement} wrapper
 * @param {Decorate} [decorate]
 * @returns {MenuState | null}
 */
function wireMenu(wrapper, decorate) {
    const button = /** @type {HTMLElement | null} */ (wrapper.querySelector(':scope > button'));
    const menu = /** @type {HTMLElement | null} */ (wrapper.querySelector(':scope > [role="menu"]'));
    if (!button || !menu) return null;
    if (!menu.id) menu.id = nextId('kp-menu');
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-controls', menu.id);
    button.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
    /** @type {MenuState} */
    const s = { wrapper, button, menu, decorate, drawn: '', pending: null, open: false, empty: false, off: [] };
    menus.set(wrapper, s);
    decorate?.(button, { kind: 'menu-button', host: wrapper, key: keyOf(wrapper) });
    menuItems(s).forEach((item, index) => {
        item.tabIndex = -1;
        decorateItem(s, item, index);
    });
    return s;
}

/**
 * Wire every menu button under `root`: the button opens and closes the menu,
 * and the menu answers the keys of a menu (APG menu button). A disabled entry
 * (`aria-disabled`) keeps the focus, so its reason is read; it does nothing.
 * @param {ParentNode} [root]
 * @param {{ decorate?: Decorate }} [options]
 * @returns {() => void} detach
 */
export function attachMenuButtons(root = document, { decorate } = {}) {
    /** @type {(() => void)[]} */
    const undo = [];
    for (const wrapper of /** @type {HTMLElement[]} */ ([...root.querySelectorAll(MENU_BUTTON)])) {
        const s = menus.get(wrapper) ?? wireMenu(wrapper, decorate);
        if (!s) continue;
        if (decorate) s.decorate = decorate;
        const onClick = () => {
            if (s.open) closeMenu(wrapper);
            else openMenu(wrapper, { focus: 'first' });
        };
        /** @param {KeyboardEvent} event */
        const onButtonKey = (event) => {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
            event.preventDefault();
            if (s.open) closeMenu(wrapper);
            openMenu(wrapper, { focus: event.key === 'ArrowUp' ? 'last' : 'first' });
        };
        /** @param {MouseEvent} event */
        const onPick = (event) => {
            const item = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest('[role="menuitem"]') : null);
            if (!item || !s.menu.contains(item)) return;
            if (item.getAttribute('aria-disabled') === 'true') {
                event.preventDefault();
                return;
            }
            const value = item.dataset.kpValue ?? item.querySelector('.kp-menu__label')?.textContent ?? '';
            const go = wrapper.dispatchEvent(new CustomEvent(MENU_SELECT_EVENT, { bubbles: true, cancelable: true, detail: { item, value } }));
            if (!go) {
                event.preventDefault();
                return;
            }
            closeMenu(wrapper, { focus: !item.matches('a[href]') });
        };
        /** @param {KeyboardEvent} event */
        const onMenuKey = (event) => {
            const items = menuItems(s);
            if (!items.length) return;
            const active = /** @type {HTMLElement} */ (s.menu.ownerDocument.activeElement);
            const at = items.indexOf(active);
            /** @type {number | null} */
            let to = null;
            if (event.key === 'ArrowDown') to = (at + 1) % items.length;
            else if (event.key === 'ArrowUp') to = (at - 1 + items.length) % items.length;
            else if (event.key === 'Home') to = 0;
            else if (event.key === 'End') to = items.length - 1;
            else if (event.key === 'Tab') {
                // The focus goes back to the button first, so the browser's own
                // Tab moves on from there: to what follows the button, or (with
                // Shift) to what comes before it.
                closeMenu(wrapper, { focus: true });
                return;
            } else if (event.key === ' ' && active?.matches('a[href]')) {
                event.preventDefault();
                active.click();
                return;
            } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ') {
                const letter = event.key.toLocaleLowerCase();
                for (let step = 1; step <= items.length; step += 1) {
                    const candidate = items[(at + step + items.length) % items.length];
                    const text = (candidate.querySelector('.kp-menu__label')?.textContent ?? '').trim().toLocaleLowerCase();
                    if (text.startsWith(letter)) {
                        to = items.indexOf(candidate);
                        break;
                    }
                }
            }
            if (to == null) return;
            event.preventDefault();
            items[to].focus();
        };
        s.button.addEventListener('click', onClick);
        s.button.addEventListener('keydown', onButtonKey);
        s.menu.addEventListener('click', onPick);
        s.menu.addEventListener('keydown', onMenuKey);
        undo.push(() => {
            closeMenu(wrapper);
            s.button.removeEventListener('click', onClick);
            s.button.removeEventListener('keydown', onButtonKey);
            s.menu.removeEventListener('click', onPick);
            s.menu.removeEventListener('keydown', onMenuKey);
            menus.delete(wrapper);
        });
    }
    return () => undo.splice(0).forEach((off) => off());
}

/* ============================================================== meter */

/**
 * The words a meter is read by: the real share, never clamped
 * (`130% promised`), and the mark's share with its label.
 * @param {number | null} value 0..∞ (1 is full)
 * @param {number | null} [mark] 0..∞
 * @param {{ unit?: string, label?: string, markLabel?: string }} [words]
 * @returns {string}
 */
export function meterText(value, mark = null, { unit = '%', label = 'used', markLabel = '' } = {}) {
    if (value == null || !Number.isFinite(value)) return 'not measured';
    const share = (/** @type {number} */ v) => `${Math.round(v * 100)}${unit}`;
    let text = `${share(value)} ${label}`.trim();
    if (mark != null && Number.isFinite(mark)) text += `; ${share(mark)} ${markLabel}`.trimEnd();
    return text;
}

/**
 * @typedef {{ value?: number | null, mark?: number | null, tone?: 'warning' | 'destructive' | null,
 *   label?: string, markLabel?: string, loading?: boolean }} Meter
 */

/**
 * Write a `.kp-meter`'s share, mark, tone and ARIA in one call. Above 1 the
 * fill is full and the meter carries `data-kp-over`; a mark above 1 sits at
 * the end and carries it too. The words name the real share.
 * @param {HTMLElement} el
 * @param {Meter} meter
 */
export function setMeter(el, { value = null, mark = null, tone = null, label = 'used', markLabel = '', loading = false }) {
    el.setAttribute('role', 'meter');
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '100');
    el.toggleAttribute('data-kp-loading', loading);
    if (loading) el.setAttribute('aria-busy', 'true');
    else el.removeAttribute('aria-busy');
    const measured = !loading && value != null && Number.isFinite(value);
    el.style.setProperty('--kp-value', measured ? String(Math.max(0, /** @type {number} */ (value))) : '0');
    el.toggleAttribute('data-kp-over', measured && /** @type {number} */ (value) > 1);
    if (measured) el.setAttribute('aria-valuenow', String(Math.min(100, Math.round(/** @type {number} */ (value) * 100))));
    else el.removeAttribute('aria-valuenow');
    el.setAttribute('aria-valuetext', loading ? 'being measured' : meterText(value, mark, { label, markLabel }));
    if (tone) el.dataset.kpTone = tone;
    else delete el.dataset.kpTone;
    let tick = /** @type {HTMLElement | null} */ (el.querySelector(':scope > .kp-meter__mark'));
    const marked = !loading && mark != null && Number.isFinite(mark);
    if (marked && !tick) {
        tick = make(el.ownerDocument, 'span', 'kp-meter__mark');
        tick.setAttribute('aria-hidden', 'true');
        el.append(tick);
    }
    if (tick) tick.hidden = !marked;
    if (marked && tick) {
        el.style.setProperty('--kp-mark', String(Math.max(0, /** @type {number} */ (mark))));
        tick.toggleAttribute('data-kp-over', /** @type {number} */ (mark) > 1);
        if (markLabel) tick.dataset.kpMarkLabel = markLabel;
    } else el.style.removeProperty('--kp-mark');
}

/* ========================================================= KPI strips */

/** A strip whose column count comes from a list of allowed counts. */
export const KPI_STRIP = '.kp-kpis[data-kp-kpis-columns]';

/**
 * How many columns a strip of `n` tiles takes at `width`: the first allowed
 * count whose tiles are at least `minTilePx` wide; then, if that leaves one
 * tile alone on the last row, the next smaller allowed count (two or more)
 * that does not; failing that the count stays and the last tile spans its row.
 * @param {number} n
 * @param {number} width
 * @param {{ allowed?: (number | 'all')[] | string, minTilePx?: number, gapPx?: number }} [options]
 * @returns {{ columns: number, spanLast: boolean }}
 */
export function kpiColumns(n, width, { allowed = 'all 3 2 1', minTilePx = 144, gapPx = 16 } = {}) {
    if (n <= 1) return { columns: 1, spanLast: false };
    const list = (typeof allowed === 'string' ? allowed.trim().split(/\s+/) : allowed)
        .map((c) => (c === 'all' ? n : Number(c)))
        .filter((c) => Number.isInteger(c) && c >= 1 && c <= n)
        .filter((c, at, all) => all.indexOf(c) === at);
    if (!list.length) list.push(1);
    const fits = (/** @type {number} */ c) => (width - (c - 1) * gapPx) / c >= minTilePx;
    const first = list.findIndex(fits);
    const at = first < 0 ? list.length - 1 : first;
    const columns = list[at];
    if (columns > 1 && n % columns === 1) {
        const better = list.slice(at + 1).find((c) => c >= 2 && c < columns && n % c !== 1);
        if (better) return { columns: better, spanLast: false };
        return { columns, spanLast: true };
    }
    return { columns, spanLast: false };
}

/** A length in a custom property ("10rem", "160px") in pixels. @param {Element} el @param {string} text @param {number} fallback */
function lengthPx(el, text, fallback) {
    const m = /^\s*(-?[\d.]+)\s*(px|rem|em)?\s*$/.exec(text);
    if (!m) return fallback;
    const n = Number(m[1]);
    const view = el.ownerDocument.defaultView;
    if (m[2] === 'rem') return n * parseFloat(view?.getComputedStyle(el.ownerDocument.documentElement).fontSize || '16');
    if (m[2] === 'em') return n * parseFloat(view?.getComputedStyle(el).fontSize || '16');
    return n;
}

/** @param {HTMLElement} strip @param {number} [width] */
export function fitKpiStrip(strip, width) {
    const view = strip.ownerDocument.defaultView;
    if (!view) return;
    const style = view.getComputedStyle(strip);
    const inner = width ?? strip.clientWidth - parseFloat(style.paddingInlineStart || '0') - parseFloat(style.paddingInlineEnd || '0');
    if (!(inner > 0)) return;
    const n = [...strip.children].filter((tile) => !(/** @type {HTMLElement} */ (tile).hidden)).length;
    const { columns, spanLast } = kpiColumns(n, inner, {
        allowed: strip.getAttribute('data-kp-kpis-columns') || 'all 3 2 1',
        minTilePx: lengthPx(strip, style.getPropertyValue('--kp-kpi-min'), 144),
        gapPx: parseFloat(style.columnGap) || 0,
    });
    strip.style.setProperty('--kp-kpis-columns', String(columns));
    strip.toggleAttribute('data-kp-kpis-span-last', spanLast);
}

/**
 * Keep every `.kp-kpis[data-kp-kpis-columns="all 3 2 1"]` under `root` on an
 * allowed column count, by the strip's own width (not the window's), with no
 * tile alone on a row; and again when tiles come or go.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachKpiStrips(root = document) {
    const doc = root instanceof Document ? root : (root.ownerDocument ?? document);
    const view = doc.defaultView;
    if (!view) return () => {};
    /** @type {Set<HTMLElement>} */
    const watched = new Set();
    const sizes = new view.ResizeObserver((entries) => {
        for (const entry of entries) {
            const size = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
            fitKpiStrip(/** @type {HTMLElement} */ (entry.target), size);
        }
    });
    const scan = () => {
        for (const strip of /** @type {HTMLElement[]} */ ([...root.querySelectorAll(KPI_STRIP)])) {
            if (!watched.has(strip)) {
                watched.add(strip);
                sizes.observe(strip);
            }
            fitKpiStrip(strip);
        }
    };
    scan();
    const changes = new view.MutationObserver(scan);
    changes.observe(root instanceof Document ? root.documentElement : /** @type {Node} */ (root), {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['hidden', 'data-kp-kpis-columns'],
    });
    return () => {
        sizes.disconnect();
        changes.disconnect();
    };
}

/* ======================================================= trend charts */

/** A key figure's trend: `figure.kp-kpi__chart[data-kp-chart="spark"]`. */
export const TREND_CHART = '.kp-kpi__chart[data-kp-chart="spark"]';

export const TREND_STRINGS = {
    now: 'now',
    today: 'today',
    yesterday: 'yesterday',
    keys: 'Left and right arrows read the trend point by point, Shift moves ten, Home and End go to the ends, Escape hides the reading.',
};

/**
 * @typedef {{ points: [number, number][], step?: number, unit?: string, digits?: number }} TrendData
 * @typedef {{ data: TrendData | null, at: number | null, figure: HTMLElement, plot: HTMLElement, svg: SVGSVGElement,
 *   cross: HTMLElement, chip: HTMLElement, from: HTMLElement, to: HTMLElement, read: HTMLElement, live: HTMLElement,
 *   format: (v: number, figure: HTMLElement) => string, timeZone: string, now: () => number }} TrendState
 */

/** @type {WeakMap<Element, TrendState>} */
const trends = new WeakMap();

/**
 * The words under a trend: the first point's clock and its day (`14:40
 * yesterday`, `07:00 today`, or its date when older), and `now` when the last
 * point is at most two steps old, else that point's clock. Fewer than two
 * points: nothing (two no-break spaces keep the row).
 * @param {[number, number][]} points
 * @param {{ now: number, step?: number, timeZone?: string }} context
 * @returns {[string, string]}
 */
export function trendAxis(points, { now, step = 600_000, timeZone = TIME_ZONE }) {
    if (points.length < 2) return [' ', ' '];
    const today = dayKey(now, timeZone);
    const yesterday = dayKey(Date.parse(`${today}T12:00:00Z`) - 86_400_000, 'UTC');
    /** @param {number} ms */
    const dayWord = (ms) => {
        const day = dayKey(ms, timeZone);
        if (day === today) return TREND_STRINGS.today;
        if (day === yesterday) return TREND_STRINGS.yesterday;
        return formatDay(day);
    };
    const first = points[0][0];
    const last = points[points.length - 1][0];
    const left = `${formatClock(first, timeZone)} ${dayWord(first)}`;
    const right =
        now - last <= 2 * step
            ? TREND_STRINGS.now
            : dayKey(last, timeZone) === today
              ? formatClock(last, timeZone)
              : `${formatClock(last, timeZone)} ${dayWord(last)}`;
    return [left, right];
}

/** @param {TrendState} t */
function hideTrendReading(t) {
    t.at = null;
    t.cross.hidden = true;
    t.chip.hidden = true;
    t.read.hidden = true;
    t.from.hidden = false;
    t.to.hidden = false;
}

/**
 * Show the reading at point `index`: the crosshair, and a chip with its moment
 * and value above the line, kept inside the tile. A chip too wide for the
 * trend puts the value under the moment; one too wide even then (a very
 * narrow tile) gives its words to the axis row. With
 * `data-kp-spark-readout="axis"` the reading always takes the axis row, the
 * moment over the value.
 * @param {TrendState} t
 * @param {number} index
 * @param {{ announce?: boolean }} [options]
 */
function showTrendReading(t, index, { announce = false } = {}) {
    const points = t.data?.points ?? [];
    if (points.length < 2) return;
    const i = Math.max(0, Math.min(points.length - 1, index));
    const [ms, value] = points[i];
    t.at = ms;
    const width = t.plot.clientWidth;
    const x = (i / (points.length - 1)) * width;
    const moment = formatMoment(ms, t.timeZone);
    const shown = t.format(value, t.figure);
    const words = `${moment} · ${shown}`;
    t.cross.style.insetInlineStart = `${x}px`;
    t.cross.hidden = false;
    const inAxis = t.figure.dataset.kpSparkReadout === 'axis';
    const doc = t.chip.ownerDocument;
    const parts = () => [make(doc, 'span', 'kp-kpi__chart-at', moment), make(doc, 'span', 'kp-kpi__chart-value', shown)];
    t.chip.replaceChildren(...parts());
    t.read.replaceChildren(...parts());
    let toAxis = inAxis;
    if (!inAxis) {
        t.chip.hidden = false;
        t.chip.removeAttribute('data-kp-stacked');
        let chipWidth = t.chip.offsetWidth;
        if (chipWidth > width) {
            t.chip.setAttribute('data-kp-stacked', '');
            chipWidth = t.chip.offsetWidth;
        }
        if (chipWidth > width) toAxis = true;
        else t.chip.style.insetInlineStart = `${Math.max(0, Math.min(width - chipWidth, x - chipWidth / 2))}px`;
    }
    t.chip.hidden = toAxis;
    t.read.hidden = !toAxis;
    t.from.hidden = toAxis;
    t.to.hidden = toAxis;
    t.figure.dataset.kpIndex = String(i);
    if (announce) t.live.textContent = words;
}

/** @param {TrendState} t */
function drawTrend(t) {
    const points = t.data?.points ?? [];
    drawSparkline(
        t.svg,
        points.map((p) => p[1]),
    );
    const [left, right] = trendAxis(points, { now: t.now(), step: t.data?.step, timeZone: t.timeZone });
    t.from.textContent = left;
    t.to.textContent = right;
    const usable = points.length >= 2;
    if (usable) t.plot.tabIndex = 0;
    else t.plot.removeAttribute('tabindex');
    const tile = t.figure.closest('.kp-kpi');
    if (t.data == null) tile?.setAttribute('aria-busy', 'true');
    else tile?.removeAttribute('aria-busy');
    if (!usable) hideTrendReading(t);
    else if (t.at != null) {
        // A live update keeps the reading at its moment, or the nearest point.
        let best = 0;
        points.forEach((p, i) => {
            if (Math.abs(p[0] - /** @type {number} */ (t.at)) < Math.abs(points[best][0] - /** @type {number} */ (t.at))) best = i;
        });
        showTrendReading(t, best);
    }
}

/**
 * Give a trend its points (`[[ms, value]…]`, oldest first) and their step.
 * `null` is loading: an empty trend at its final height, the tile busy.
 * @param {Element} figure
 * @param {TrendData | null} data
 */
export function setTrendData(figure, data) {
    const t = trends.get(figure);
    if (t) {
        t.data = data;
        drawTrend(t);
    } else /** @type {any} */ (figure).kpTrendData = data;
}

/**
 * Draw every key figure's trend under `root`, with the axis words, the
 * readout on pointer, touch and keys, and a click that follows the tile's
 * link (`.kp-kpi__link`) unless it was a drag.
 * @param {ParentNode} [root]
 * @param {{ timeZone?: string, now?: () => number, format?: (value: number, figure: HTMLElement) => string }} [options]
 * @returns {() => void} detach
 */
export function attachTrendCharts(root = document, { timeZone = TIME_ZONE, now = () => Date.now(), format } = {}) {
    /** @type {(() => void)[]} */
    const undo = [];
    for (const figure of /** @type {HTMLElement[]} */ ([...root.querySelectorAll(TREND_CHART)])) {
        if (trends.has(figure)) continue;
        const doc = figure.ownerDocument;
        const plot = make(doc, 'span', 'kp-kpi__chart-plot');
        plot.setAttribute('role', 'application');
        const name = figure.getAttribute('aria-label') ?? '';
        plot.setAttribute('aria-label', name);
        const keysId = nextId('kp-trend-keys');
        const keys = make(doc, 'span', 'kp-sr-only', TREND_STRINGS.keys);
        keys.id = keysId;
        plot.setAttribute('aria-describedby', keysId);
        const svg = /** @type {SVGSVGElement} */ (doc.createElementNS('http://www.w3.org/2000/svg', 'svg'));
        svg.setAttribute('class', 'kp-kpi__spark');
        const cross = make(doc, 'span', 'kp-kpi__chart-cross');
        cross.hidden = true;
        const chip = make(doc, 'span', 'kp-kpi__chart-chip');
        chip.hidden = true;
        chip.setAttribute('aria-hidden', 'true');
        plot.append(svg, cross, chip);
        const axis = make(doc, 'span', 'kp-kpi__chart-axis');
        axis.setAttribute('aria-hidden', 'true');
        const from = make(doc, 'span', 'kp-kpi__chart-from', ' ');
        const to = make(doc, 'span', 'kp-kpi__chart-to', ' ');
        const read = make(doc, 'span', 'kp-kpi__chart-read');
        read.hidden = true;
        axis.append(from, to, read);
        const live = make(doc, 'span', 'kp-sr-only');
        live.setAttribute('aria-live', 'polite');
        figure.replaceChildren(plot, axis, keys, live);
        /** @type {TrendState} */
        const t = {
            data: /** @type {any} */ (figure).kpTrendData ?? null,
            at: null,
            figure,
            plot,
            svg,
            cross,
            chip,
            from,
            to,
            read,
            live,
            timeZone,
            now,
            format:
                format ??
                ((value, fig) => {
                    const digits = t.data?.digits ?? Number(fig.dataset.kpDigits ?? 0);
                    const unit = t.data?.unit ?? fig.dataset.kpUnit ?? '';
                    return `${value.toFixed(digits)}${unit ? ` ${unit}` : ''}`;
                }),
        };
        trends.set(figure, t);
        drawTrend(t);
        const link = /** @type {HTMLAnchorElement | null} */ (figure.closest('.kp-kpi')?.querySelector('.kp-kpi__link') ?? null);
        const indexAt = (/** @type {number} */ clientX) => {
            const box = plot.getBoundingClientRect();
            const n = t.data?.points.length ?? 0;
            return Math.round(((clientX - box.left) / Math.max(1, box.width)) * (n - 1));
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
                showTrendReading(t, indexAt(event.clientX));
            }
        };
        /** @param {PointerEvent} event */
        const onMove = (event) => {
            if (press && Math.abs(event.clientX - press.x) > 6) press.moved = true;
            if (event.pointerType === 'mouse' || press) showTrendReading(t, indexAt(event.clientX));
        };
        /** @param {PointerEvent} event */
        const onLeave = (event) => {
            if (event.pointerType === 'mouse') hideTrendReading(t);
        };
        const onCancel = () => {
            press = null;
            hideTrendReading(t);
        };
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const dragged = press?.moved ?? false;
            press = null;
            // A click without a drag follows the tile's link, as a click anywhere
            // on the tile does; a drag only read the trend.
            if (!dragged && link && event.button === 0) link.click();
        };
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const n = t.data?.points.length ?? 0;
            if (n < 2) return;
            const at = Number(figure.dataset.kpIndex ?? n - 1);
            const shown = !t.cross.hidden;
            /** @type {number | null} */
            let to = null;
            if (event.key === 'ArrowLeft') to = shown ? at - (event.shiftKey ? 10 : 1) : n - 1;
            else if (event.key === 'ArrowRight') to = shown ? at + (event.shiftKey ? 10 : 1) : n - 1;
            else if (event.key === 'Home') to = 0;
            else if (event.key === 'End') to = n - 1;
            else if (event.key === 'Escape' && shown) {
                event.preventDefault();
                event.stopPropagation();
                hideTrendReading(t);
                return;
            }
            if (to == null) return;
            event.preventDefault();
            showTrendReading(t, to, { announce: true });
        };
        const onBlur = () => hideTrendReading(t);
        plot.addEventListener('pointerdown', onDown);
        plot.addEventListener('pointermove', onMove);
        plot.addEventListener('pointerleave', onLeave);
        plot.addEventListener('pointercancel', onCancel);
        plot.addEventListener('click', onClick);
        plot.addEventListener('keydown', onKey);
        plot.addEventListener('blur', onBlur);
        undo.push(() => {
            plot.removeEventListener('pointerdown', onDown);
            plot.removeEventListener('pointermove', onMove);
            plot.removeEventListener('pointerleave', onLeave);
            plot.removeEventListener('pointercancel', onCancel);
            plot.removeEventListener('click', onClick);
            plot.removeEventListener('keydown', onKey);
            plot.removeEventListener('blur', onBlur);
            trends.delete(figure);
        });
    }
    return () => undo.splice(0).forEach((off) => off());
}

/* =========================================================== calendar */

/** A month heatmap: `section.kp-calendar[data-kp-calendar]`. */
export const CALENDAR = '[data-kp-calendar]';
export const CALENDAR_PICK_EVENT = 'kp-calendar-pick';
export const CALENDAR_MONTH_EVENT = 'kp-calendar-month';

export const CALENDAR_STRINGS = {
    prev: '‹ Prev',
    prevLabel: 'Previous month',
    next: 'Next ›',
    nextLabel: 'Next month',
    today: 'Today',
    todayTitle: 'Show this month and select today',
    future: 'a day still to come',
    loading: 'being read',
    none: 'nothing known about this day',
};

/**
 * @typedef {'ok' | 'warn' | 'bad' | 'muted' | 'future' | 'before' | 'loading' | 'none'} DayTone
 * @typedef {{ tone: DayTone, count?: string, label: string }} DayState
 * @typedef {'loading' | 'ready' | 'empty' | 'error'} CalendarState
 * @typedef {{ el: HTMLElement, year: number, month: number, selected: string | null, focus: string | null,
 *   days: Record<string, DayState>, state: CalendarState, timeZone: string, locale: string, now: () => number,
 *   decorate?: Decorate, title: HTMLElement, stateLine: HTMLElement, grid: HTMLTableElement,
 *   cells: { td: HTMLTableCellElement, button: HTMLButtonElement, num: HTMLElement, count: HTMLElement, pad: HTMLElement }[],
 *   legend: HTMLElement, shownMonth: string }} CalendarModel
 */

/** @type {WeakMap<Element, CalendarModel>} */
const calendars = new WeakMap();

/** @param {number} y @param {number} m 1-12 @param {number} d */
const isoOf = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);

/** @param {string} iso @param {number} days */
export const shiftDay = (iso, days) => {
    const d = new Date(`${iso}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
};

/** The same day `months` later, clamped to the month's last day. @param {string} iso @param {number} months */
export const shiftMonth = (iso, months) => {
    const [y, m, d] = iso.split('-').map(Number);
    const first = new Date(Date.UTC(y, m - 1 + months, 1));
    const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    return isoOf(first.getUTCFullYear(), first.getUTCMonth() + 1, Math.min(d, last));
};

/** Monday = 0 … Sunday = 6. @param {string} iso */
const weekday = (iso) => (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;

/**
 * The 42 days a month's grid shows: six weeks from the Monday on or before
 * its first, so every month is six rows tall.
 * @param {number} year
 * @param {number} month 1-12
 * @returns {string[]}
 */
export function monthCells(year, month) {
    const first = isoOf(year, month, 1);
    const start = shiftDay(first, -weekday(first));
    return Array.from({ length: 42 }, (_, i) => shiftDay(start, i));
}

/** @param {CalendarModel} c */
const monthKey = (c) => `${c.year}-${String(c.month).padStart(2, '0')}`;

/** @param {CalendarModel} c @param {string} iso @param {string} today */
function dayFor(c, iso, today) {
    /** @type {DayState | undefined} */
    const given = c.days[iso];
    if (c.state === 'loading') return { tone: /** @type {DayTone} */ ('loading'), label: CALENDAR_STRINGS.loading };
    if (c.state === 'empty') return { tone: /** @type {DayTone} */ ('muted'), label: c.stateLine.textContent || CALENDAR_STRINGS.none };
    if (c.state === 'error') return { tone: /** @type {DayTone} */ ('none'), label: c.stateLine.textContent || CALENDAR_STRINGS.none };
    if (given) return given;
    if (iso > today) return { tone: /** @type {DayTone} */ ('future'), label: CALENDAR_STRINGS.future };
    return { tone: /** @type {DayTone} */ ('none'), label: CALENDAR_STRINGS.none };
}

/** Repaint the grid in place: classes, words and tab stops, never new buttons. @param {CalendarModel} c */
function paintCalendar(c) {
    const ym = monthKey(c);
    const today = dayKey(c.now(), c.timeZone);
    const cells = monthCells(c.year, c.month);
    const monthChanged = c.shownMonth !== ym;
    c.shownMonth = ym;
    c.title.textContent = new Intl.DateTimeFormat(c.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(c.year, c.month - 1, 1));
    c.grid.setAttribute('aria-busy', String(c.state === 'loading'));
    const inMonth = (/** @type {string} */ iso) => iso.startsWith(ym);
    const stop =
        [c.focus, c.selected, today, `${ym}-01`].find((iso) => iso && inMonth(iso)) ?? `${ym}-01`;
    cells.forEach((iso, i) => {
        const cell = c.cells[i];
        const mine = inMonth(iso);
        cell.button.hidden = !mine;
        cell.pad.textContent = mine ? '' : iso.slice(8, 10);
        cell.td.toggleAttribute('data-kp-pad', !mine);
        if (!mine) {
            cell.td.removeAttribute('aria-selected');
            delete cell.button.dataset.kpDate;
            cell.button.tabIndex = -1;
            return;
        }
        const day = dayFor(c, iso, today);
        cell.button.dataset.kpDate = iso;
        cell.button.dataset.kpTone = day.tone;
        cell.button.toggleAttribute('data-kp-today', iso === today);
        cell.num.textContent = iso.slice(8, 10);
        const counted = day.count && !['future', 'before', 'loading'].includes(day.tone);
        cell.count.textContent = counted ? /** @type {string} */ (day.count) : ' ';
        const words = `${formatDay(iso)}: ${day.label}`;
        cell.button.setAttribute('aria-label', words);
        cell.button.title = words;
        cell.td.setAttribute('aria-selected', String(iso === c.selected));
        cell.button.tabIndex = iso === stop ? 0 : -1;
        if (monthChanged) c.decorate?.(cell.button, { kind: 'day', host: c.el, key: keyOf(c.el), index: i, value: iso });
    });
}

/** @param {CalendarModel} c @param {number} year @param {number} month @param {boolean} announce */
function showMonth(c, year, month, announce) {
    if (c.year === year && c.month === month) return;
    c.year = year;
    c.month = month;
    paintCalendar(c);
    if (announce) c.el.dispatchEvent(new CustomEvent(CALENDAR_MONTH_EVENT, { bubbles: true, detail: { year, month } }));
}

/** @param {CalendarModel} c @param {string} iso */
const buttonFor = (c, iso) => c.cells.find((cell) => cell.button.dataset.kpDate === iso)?.button ?? null;

/** @param {CalendarModel} c @param {string} iso */
function moveFocus(c, iso) {
    const [y, m] = iso.split('-').map(Number);
    c.focus = iso;
    if (y !== c.year || m !== c.month) showMonth(c, y, m, true);
    else paintCalendar(c);
    buttonFor(c, iso)?.focus();
}

/** @param {CalendarModel} c @param {string} iso @param {'pointer' | 'keyboard'} source */
function pick(c, iso, source) {
    c.selected = iso;
    c.focus = iso;
    paintCalendar(c);
    buttonFor(c, iso)?.focus();
    c.el.dispatchEvent(new CustomEvent(CALENDAR_PICK_EVENT, { bubbles: true, detail: { date: iso, source } }));
}

/**
 * Build every month heatmap under `root`: the month's title between Prev and
 * Next, Today, a line for the state, a six-week grid (one tab stop, the keys
 * of a date grid) and the legend. Today is the day in `timeZone`.
 * @param {ParentNode} [root]
 * @param {{ timeZone?: string, locale?: string, now?: () => number, decorate?: Decorate }} [options]
 * @returns {() => void} detach
 */
export function attachCalendars(root = document, { timeZone, locale = 'en-GB', now = () => Date.now(), decorate } = {}) {
    /** @type {(() => void)[]} */
    const undo = [];
    for (const el of /** @type {HTMLElement[]} */ ([...root.querySelectorAll(CALENDAR)])) {
        if (calendars.has(el)) continue;
        const doc = el.ownerDocument;
        const zone = timeZone ?? el.dataset.kpTimeZone ?? TIME_ZONE;
        const today = dayKey(now(), zone);
        const [year, month] = (el.dataset.kpCalendarMonth ?? today.slice(0, 7)).split('-').map(Number);
        const nav = make(doc, 'div', 'kp-calendar__nav');
        nav.setAttribute('role', 'group');
        nav.setAttribute('aria-label', 'Month');
        const prev = make(doc, 'button', 'kp-button kp-button--sm', CALENDAR_STRINGS.prev);
        prev.type = 'button';
        prev.setAttribute('aria-label', CALENDAR_STRINGS.prevLabel);
        prev.title = CALENDAR_STRINGS.prevLabel;
        prev.dataset.kpCalendarPrev = '';
        const title = make(doc, /** @type {'h2'} */ (`h${el.dataset.kpHeadingLevel ?? '2'}`), 'kp-calendar__title');
        title.id = nextId('kp-calendar-title');
        title.setAttribute('aria-live', 'polite');
        const next = make(doc, 'button', 'kp-button kp-button--sm', CALENDAR_STRINGS.next);
        next.type = 'button';
        next.setAttribute('aria-label', CALENDAR_STRINGS.nextLabel);
        next.title = CALENDAR_STRINGS.nextLabel;
        next.dataset.kpCalendarNext = '';
        const todayButton = make(doc, 'button', 'kp-button kp-button--sm', CALENDAR_STRINGS.today);
        todayButton.type = 'button';
        todayButton.title = CALENDAR_STRINGS.todayTitle;
        todayButton.dataset.kpCalendarToday = '';
        nav.append(prev, title, next, todayButton);
        const stateLine = make(doc, 'p', 'kp-calendar__state');
        stateLine.setAttribute('role', 'status');
        const grid = make(doc, 'table', 'kp-calendar__grid');
        grid.setAttribute('role', 'grid');
        grid.setAttribute('aria-labelledby', title.id);
        const head = make(doc, 'thead');
        const headRow = make(doc, 'tr');
        const monday = Date.UTC(2026, 0, 5);
        for (let d = 0; d < 7; d += 1) {
            const th = make(doc, 'th');
            th.scope = 'col';
            th.abbr = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(monday + d * 86_400_000);
            th.textContent = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(monday + d * 86_400_000);
            headRow.append(th);
        }
        head.append(headRow);
        const body = make(doc, 'tbody');
        /** @type {CalendarModel['cells']} */
        const cells = [];
        for (let w = 0; w < 6; w += 1) {
            const tr = make(doc, 'tr');
            for (let d = 0; d < 7; d += 1) {
                const td = make(doc, 'td');
                const button = make(doc, 'button', 'kp-calendar__day');
                button.type = 'button';
                const num = make(doc, 'span', 'kp-calendar__num');
                const count = make(doc, 'span', 'kp-calendar__count', ' ');
                button.append(num, count);
                const pad = make(doc, 'span', 'kp-calendar__pad');
                pad.setAttribute('aria-hidden', 'true');
                td.append(button, pad);
                tr.append(td);
                cells.push({ td, button, num, count, pad });
            }
            body.append(tr);
        }
        grid.append(head, body);
        const legend = make(doc, 'ul', 'kp-calendar__legend');
        legend.hidden = true;
        el.replaceChildren(nav, stateLine, grid, legend);
        if (!el.hasAttribute('aria-labelledby')) el.setAttribute('aria-labelledby', title.id);
        /** @type {CalendarModel} */
        const c = {
            el,
            year,
            month,
            selected: el.dataset.kpCalendarSelected ?? null,
            focus: null,
            days: {},
            state: 'ready',
            timeZone: zone,
            locale,
            now,
            decorate,
            title,
            stateLine,
            grid,
            cells,
            legend,
            shownMonth: '',
        };
        calendars.set(el, c);
        decorate?.(prev, { kind: 'month-prev', host: el, key: keyOf(el) });
        decorate?.(next, { kind: 'month-next', host: el, key: keyOf(el) });
        decorate?.(todayButton, { kind: 'today', host: el, key: keyOf(el) });
        paintCalendar(c);
        const step = (/** @type {number} */ months) => {
            const target = shiftMonth(isoOf(c.year, c.month, 1), months);
            const [y, m] = target.split('-').map(Number);
            showMonth(c, y, m, true);
        };
        const onPrev = () => step(-1);
        const onNext = () => step(1);
        const onToday = () => {
            const iso = dayKey(c.now(), c.timeZone);
            const [y, m] = iso.split('-').map(Number);
            showMonth(c, y, m, true);
            pick(c, iso, 'pointer');
        };
        /** @param {MouseEvent} event */
        const onDay = (event) => {
            const button = /** @type {HTMLButtonElement | null} */ (event.target instanceof Element ? event.target.closest('.kp-calendar__day') : null);
            if (!button?.dataset.kpDate) return;
            pick(c, button.dataset.kpDate, event.detail === 0 ? 'keyboard' : 'pointer');
        };
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const button = /** @type {HTMLButtonElement | null} */ (event.target instanceof Element ? event.target.closest('.kp-calendar__day') : null);
            const iso = button?.dataset.kpDate;
            if (!iso) return;
            /** @type {string | null} */
            let to = null;
            if (event.key === 'ArrowLeft') to = shiftDay(iso, -1);
            else if (event.key === 'ArrowRight') to = shiftDay(iso, 1);
            else if (event.key === 'ArrowUp') to = shiftDay(iso, -7);
            else if (event.key === 'ArrowDown') to = shiftDay(iso, 7);
            else if (event.key === 'Home') to = shiftDay(iso, -weekday(iso));
            else if (event.key === 'End') to = shiftDay(iso, 6 - weekday(iso));
            else if (event.key === 'PageUp') to = shiftMonth(iso, event.shiftKey ? -12 : -1);
            else if (event.key === 'PageDown') to = shiftMonth(iso, event.shiftKey ? 12 : 1);
            if (!to) return;
            event.preventDefault();
            moveFocus(c, to);
        };
        prev.addEventListener('click', onPrev);
        next.addEventListener('click', onNext);
        todayButton.addEventListener('click', onToday);
        body.addEventListener('click', onDay);
        body.addEventListener('keydown', onKey);
        undo.push(() => {
            prev.removeEventListener('click', onPrev);
            next.removeEventListener('click', onNext);
            todayButton.removeEventListener('click', onToday);
            body.removeEventListener('click', onDay);
            body.removeEventListener('keydown', onKey);
            calendars.delete(el);
        });
    }
    return () => undo.splice(0).forEach((off) => off());
}

/**
 * Every day's state, by `YYYY-MM-DD` (the whole history: a month change
 * needs no new call). Repaints in place; focus and selection stay.
 * @param {Element} el
 * @param {Record<string, DayState>} days
 */
export function setCalendarDays(el, days) {
    const c = calendars.get(el);
    if (!c) return;
    c.days = days;
    if (c.state === 'loading') c.state = 'ready';
    paintCalendar(c);
}

/**
 * The calendar as a whole: `loading` (every day pulses at its final size),
 * `ready`, `empty` or `error` (no pulse, the sentence under the month).
 * @param {Element} el
 * @param {CalendarState} state
 * @param {string} [words]
 */
export function setCalendarState(el, state, words = '') {
    const c = calendars.get(el);
    if (!c) return;
    c.state = state;
    c.stateLine.textContent = words;
    c.stateLine.dataset.kpState = state;
    paintCalendar(c);
}

/** Select a day (or none) and show its month; no event, the page asked. @param {Element} el @param {string | null} iso */
export function calendarSelect(el, iso) {
    const c = calendars.get(el);
    if (!c) return;
    c.selected = iso;
    if (iso) {
        const [y, m] = iso.split('-').map(Number);
        c.year = y;
        c.month = m;
    }
    paintCalendar(c);
}

/** Show a month; no event, the page asked. @param {Element} el @param {{ year: number, month: number }} at */
export function calendarMonth(el, { year, month }) {
    const c = calendars.get(el);
    if (c) showMonth(c, year, month, false);
}

/** The legend under the grid: a swatch and its words per tone. @param {Element} el @param {{ tone: DayTone, label: string }[]} entries */
export function setCalendarLegend(el, entries) {
    const c = calendars.get(el);
    if (!c) return;
    const doc = c.legend.ownerDocument;
    c.legend.replaceChildren(
        ...entries.map(({ tone, label }) => {
            const li = make(doc, 'li');
            const swatch = make(doc, 'span', 'kp-calendar__swatch');
            swatch.dataset.kpTone = tone;
            swatch.setAttribute('aria-hidden', 'true');
            li.append(swatch, make(doc, 'span', '', label));
            return li;
        }),
    );
    c.legend.hidden = entries.length === 0;
}

/* ============================================================== graph */

/** A hub-and-ring graph: `figure.kp-graph[data-kp-graph]`. */
export const GRAPH = '[data-kp-graph]';
export const GRAPH_CHANGE_EVENT = 'kp-graph-change';

export const GRAPH_STRINGS = {
    showAll: 'Show all',
    showAllTitle: 'Clear the selection and show every kind of link again',
    hint: 'Hover or focus a node to see only its links. Click it, or press Enter, to keep it picked; pick several the same way. Arrow keys move between nodes; Esc shows all.',
    kinds: 'Kinds of link',
    loading: 'Reading the network…',
};

/**
 * @typedef {{ id: string, label: string, kind?: string, hue?: number, weight?: number | null,
 *   flag?: 'mismatch' | null, description: string, external?: boolean }} GraphNode
 * @typedef {{ from: string, to: string, kind: string, detail?: string }} GraphEdge
 * @typedef {{ kind: string, label: string, hint: string, style: 'solid' | 'dash' | 'dot' | 'long-dash', colour: string }} GraphKind
 * @typedef {{ nodes: GraphNode[], edges: GraphEdge[], kinds: GraphKind[], hub?: string }} GraphData
 */

/**
 * The hub: the one named, else the node with the most links.
 * @param {GraphData} data
 * @returns {string | null}
 */
export function hubOf(data) {
    if (data.hub && data.nodes.some((n) => n.id === data.hub)) return data.hub;
    /** @type {Map<string, number>} */
    const degree = new Map();
    for (const e of data.edges) {
        degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
        degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
    }
    let best = null;
    let most = -1;
    for (const node of data.nodes) {
        const d = degree.get(node.id) ?? 0;
        if (d > most) {
            most = d;
            best = node.id;
        }
    }
    return best;
}

/**
 * The ring's order: the nodes by label, then the outside ones; the first at
 * the top, clockwise.
 * @param {GraphData} data
 * @param {string | null} hub
 */
export const ringOf = (data, hub) =>
    data.nodes
        .filter((n) => n.id !== hub)
        .sort((a, b) => Number(!!a.external) - Number(!!b.external) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id));

/**
 * Where every node sits in a W×H box: the hub in the middle, the others on an
 * ellipse around it (stretched sideways on a wide box). On a narrow box the
 * ellipse gives up width for height, so the labels beside the ring keep room.
 * @param {GraphData} data
 * @param {number} W
 * @param {number} H
 * @returns {Map<string, { x: number, y: number, angle: number }>}
 */
export function graphLayout(data, W, H) {
    /** @type {Map<string, { x: number, y: number, angle: number }>} */
    const at = new Map();
    const hub = hubOf(data);
    const cx = W / 2;
    const cy = H / 2 - 10;
    const R = Math.min(W, H) * 0.36;
    let rx = R * (W > 600 ? 1.35 : 1);
    let ry = R;
    if (W < 600) {
        rx = Math.min(rx, W * 0.24);
        ry = Math.max(ry, H * 0.36);
    }
    if (hub) at.set(hub, { x: cx, y: cy, angle: Math.PI / 2 });
    const ring = ringOf(data, hub);
    ring.forEach((n, i) => {
        const angle = -Math.PI / 2 + (i / Math.max(1, ring.length)) * Math.PI * 2;
        at.set(n.id, { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry, angle });
    });
    return at;
}

/**
 * Each edge's bend: edges between the same two nodes fan out (0, +26, −26,
 * +52 …) so two kinds never draw on top of each other.
 * @param {GraphEdge[]} edges
 * @returns {number[]}
 */
export function graphBends(edges) {
    /** @type {Map<string, number>} */
    const seen = new Map();
    return edges.map((e) => {
        const key = [e.from, e.to].sort().join('\u0000');
        const k = seen.get(key) ?? 0;
        seen.set(key, k + 1);
        if (k === 0) return 0;
        const size = Math.ceil(k / 2) * 26;
        return size * (k % 2 ? 1 : -1) * (e.from < e.to ? 1 : -1);
    });
}

/** A node's radius: 14, or 10 to 24 by its weight; an outside node 9. @param {GraphNode} n */
const radiusOf = (n) => (n.external ? 9 : n.weight != null ? 10 + 14 * Math.sqrt(Math.max(0, Math.min(1, n.weight))) : 14);

/**
 * @typedef {{ el: HTMLElement, data: GraphData | null, state: 'loading' | 'ready' | 'empty' | 'error', words: string,
 *   selected: Set<string>, hidden: Set<string>, hover: string | null, focus: string | null, drawnWidth: number,
 *   bar: HTMLElement, showAll: HTMLButtonElement, legend: HTMLElement, box: HTMLElement, svg: SVGSVGElement,
 *   note: HTMLElement, hint: HTMLElement, decorate?: Decorate,
 *   labels: { text: SVGTextElement, full: string, length: number }[], size: [number, number] }} GraphModel
 */

/** @type {WeakMap<Element, GraphModel>} */
const graphs = new WeakMap();
const SVG_NS = 'http://www.w3.org/2000/svg';

/** @param {Document} doc @param {string} tag @param {Record<string, string | number>} [attrs] */
const svgEl = (doc, tag, attrs = {}) => {
    const el = doc.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, String(value));
    return el;
};

/** @param {GraphModel} g */
function graphChanged(g) {
    g.el.dispatchEvent(
        new CustomEvent(GRAPH_CHANGE_EVENT, { bubbles: true, detail: { selected: [...g.selected], hover: g.hover, hiddenKinds: [...g.hidden] } }),
    );
}

/** Selection, hover and hidden kinds change classes only, never the nodes. @param {GraphModel} g */
function restyleGraph(g) {
    const lit = new Set(g.selected);
    if (g.hover) lit.add(g.hover);
    g.el.toggleAttribute('data-kp-focus', lit.size > 0);
    const on = new Set(lit);
    for (const path of g.svg.querySelectorAll('.kp-graph__edge')) {
        const a = path.getAttribute('data-kp-from') ?? '';
        const b = path.getAttribute('data-kp-to') ?? '';
        const hidden = g.hidden.has(path.getAttribute('data-kp-kind') ?? '');
        const isOn = !hidden && (lit.has(a) || lit.has(b));
        path.classList.toggle('is-hidden', hidden);
        path.classList.toggle('is-on', isOn);
        path.classList.toggle('is-dim', lit.size > 0 && !isOn && !hidden);
        if (isOn) {
            on.add(a);
            on.add(b);
        }
    }
    for (const node of g.svg.querySelectorAll('.kp-graph__node')) {
        const id = node.getAttribute('data-kp-id') ?? '';
        node.classList.toggle('is-on', on.has(id));
        node.classList.toggle('is-dim', lit.size > 0 && !on.has(id));
        node.classList.toggle('is-picked', g.selected.has(id));
        node.setAttribute('aria-pressed', String(g.selected.has(id)));
    }
    for (const button of g.legend.querySelectorAll('[data-kp-kind]')) button.setAttribute('aria-pressed', String(!g.hidden.has(button.getAttribute('data-kp-kind') ?? '')));
    g.showAll.toggleAttribute('data-kp-idle', g.selected.size === 0 && g.hidden.size === 0);
}

/**
 * Shorten labels until each lies inside the box and no two overlap: the
 * longer of two that touch loses a letter, an ellipsis marks the cut, and the
 * full name stays in the node's title and accessible name.
 * @param {{ text: SVGTextElement, full: string, length: number }[]} labels
 * @param {number} W
 * @param {number} H
 */
function fitLabels(labels, W, H) {
    // The halo (a 4 px stroke) reaches up to 3 px past each box as drawn:
    // keep that much and one more from the edge, and twice that and one
    // more between two labels.
    const pad = 4;
    /** @param {{ text: SVGTextElement, full: string, length: number }} l */
    const cut = (l) => {
        l.length -= 1;
        l.text.textContent = l.length >= l.full.length ? l.full : `${l.full.slice(0, l.length).trimEnd()}…`;
    };
    /** @param {SVGTextElement} t */
    const box = (t) => t.getBBox();
    for (const l of labels) {
        let b = box(l.text);
        while (l.length > 1 && (b.x < pad || b.x + b.width > W - pad || b.y < pad || b.y + b.height > H - pad)) {
            cut(l);
            b = box(l.text);
        }
    }
    const gap = 7;
    for (let guard = 0; guard < 2000; guard += 1) {
        const boxes = labels.map((l) => box(l.text));
        let found = false;
        outer: for (let i = 0; i < labels.length; i += 1) {
            for (let j = i + 1; j < labels.length; j += 1) {
                const a = boxes[i];
                const b = boxes[j];
                const touch = a.x < b.x + b.width + gap && b.x < a.x + a.width + gap && a.y < b.y + b.height + gap && b.y < a.y + a.height + gap;
                if (!touch) continue;
                const longer = labels[i].length >= labels[j].length ? labels[i] : labels[j];
                const other = longer === labels[i] ? labels[j] : labels[i];
                const victim = longer.length > 1 ? longer : other.length > 1 ? other : null;
                if (!victim) continue;
                cut(victim);
                found = true;
                break outer;
            }
        }
        if (!found) break;
    }
}

/** Draw the whole graph for the box's width. @param {GraphModel} g */
function drawGraph(g) {
    const doc = g.el.ownerDocument;
    const width = g.box.clientWidth;
    g.drawnWidth = width;
    const W = Math.max(280, width || 800);
    const H = W < 600 ? 480 : Math.max(420, Math.min(560, Math.round(W * 0.6)));
    g.box.style.setProperty('--kp-graph-h', `${H}px`);
    g.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    g.svg.setAttribute('height', String(H));
    const hadFocus = g.svg.contains(doc.activeElement) ? g.focus : null;
    g.svg.replaceChildren();
    const data = g.data;
    g.el.dataset.kpState = g.state;
    g.note.textContent = g.state === 'ready' ? '' : g.state === 'loading' ? g.words || GRAPH_STRINGS.loading : g.words;
    g.note.hidden = g.state === 'ready';
    if (g.state === 'loading') {
        g.svg.append(svgEl(doc, 'ellipse', { class: 'kp-graph__skeleton', cx: W / 2, cy: H / 2 - 10, rx: W < 600 ? Math.min(W * 0.24, Math.min(W, H) * 0.36) : Math.min(W, H) * 0.36 * 1.35, ry: Math.min(W, H) * 0.36 }));
    }
    if (g.state !== 'ready' || !data) {
        g.legend.replaceChildren();
        g.legend.hidden = true;
        g.showAll.setAttribute('data-kp-idle', '');
        return;
    }
    const at = graphLayout(data, W, H);
    const hub = hubOf(data);
    const bends = graphBends(data.edges);
    const kinds = new Map(data.kinds.map((k) => [k.kind, k]));
    const edges = svgEl(doc, 'g', { class: 'kp-graph__edges' });
    data.edges.forEach((e, i) => {
        const a = at.get(e.from);
        const b = at.get(e.to);
        if (!a || !b) return;
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const mx = (a.x + b.x) / 2 - ((b.y - a.y) / len) * bends[i];
        const my = (a.y + b.y) / 2 + ((b.x - a.x) / len) * bends[i];
        const kind = kinds.get(e.kind);
        const path = svgEl(doc, 'path', {
            d: `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`,
            class: 'kp-graph__edge',
            'data-kp-from': e.from,
            'data-kp-to': e.to,
            'data-kp-kind': e.kind,
            'data-kp-style': kind?.style ?? 'solid',
        });
        if (kind?.colour) path.setAttribute('style', `--kp-graph-edge-colour: ${kind.colour}`);
        const title = svgEl(doc, 'title');
        const name = (/** @type {string} */ id) => data.nodes.find((n) => n.id === id)?.label ?? id;
        title.textContent = `${name(e.from)} → ${name(e.to)}: ${e.detail || kind?.label || e.kind}`;
        path.append(title);
        edges.append(path);
    });
    g.svg.append(edges);
    // Hues spread evenly over the nodes in label order, unless a node has its own.
    const sorted = data.nodes.filter((n) => !n.external).sort((a, b) => a.label.localeCompare(b.label));
    /** @type {{ text: SVGTextElement, full: string, length: number }[]} */
    const labels = [];
    const ring = ringOf(data, hub);
    const order = [...(hub ? [hub] : []), ...ring.map((n) => n.id)];
    if (!g.focus || !order.includes(g.focus)) g.focus = order[0] ?? null;
    for (const id of order) {
        const n = /** @type {GraphNode} */ (data.nodes.find((x) => x.id === id));
        const p = at.get(id);
        if (!p) continue;
        const r = radiusOf(n);
        const node = svgEl(doc, 'g', {
            class: `kp-graph__node${n.external ? ' kp-graph__node--external' : ''}${id === hub ? ' kp-graph__node--hub' : ''}`,
            'data-kp-id': id,
            role: 'button',
            tabindex: id === g.focus ? 0 : -1,
            'aria-pressed': String(g.selected.has(id)),
            'aria-label': `${n.label}, ${n.description}`,
        });
        if (!n.external) node.setAttribute('style', `--kp-graph-hue: ${n.hue ?? Math.round((sorted.indexOf(n) / Math.max(1, sorted.length)) * 360)}`);
        const title = svgEl(doc, 'title');
        title.textContent = `${n.label}: ${n.description}`;
        node.append(title, svgEl(doc, 'circle', { class: 'kp-graph__ring', cx: p.x, cy: p.y, r }));
        if (!n.external) node.append(svgEl(doc, 'circle', { class: 'kp-graph__core', cx: p.x, cy: p.y, r: Math.max(4, r - 6) }));
        if (n.flag === 'mismatch') node.append(svgEl(doc, 'circle', { class: 'kp-graph__flag', cx: p.x, cy: p.y, r: r + 5 }));
        // The label points away from the hub: beside the node on the ring's
        // sides, over it at the top, under it at the bottom and for the hub.
        const dx = id === hub ? 0 : Math.cos(p.angle);
        const dy = id === hub ? 1 : Math.sin(p.angle);
        const off = r + (n.flag === 'mismatch' ? 10 : 6);
        const anchor = dx > 0.35 ? 'start' : dx < -0.35 ? 'end' : 'middle';
        const lx = p.x + dx * off;
        const ly = p.y + dy * off + (dy > 0.35 ? 9 : dy < -0.35 ? -3 : 4);
        const text = /** @type {SVGTextElement} */ (svgEl(doc, 'text', { class: 'kp-graph__label', x: lx.toFixed(1), y: ly.toFixed(1), 'text-anchor': anchor }));
        text.textContent = n.label;
        text.setAttribute('aria-hidden', 'true');
        node.append(text);
        labels.push({ text, full: n.label, length: n.label.length });
        g.svg.append(node);
        g.decorate?.(node, { kind: 'node', host: g.el, key: keyOf(g.el), value: id, label: n.label });
    }
    g.labels = labels;
    g.size = [W, H];
    if (isShown(g.svg)) fitLabels(labels, W, H);
    // The legend: one toggle per kind the edges use, none when nothing links.
    const present = data.kinds.filter((k) => data.edges.some((e) => e.kind === k.kind));
    g.legend.replaceChildren(
        ...present.map((k) => {
            const li = make(doc, 'li');
            const button = make(doc, 'button', 'kp-graph__kind');
            button.type = 'button';
            button.dataset.kpKind = k.kind;
            button.title = k.hint;
            button.setAttribute('aria-pressed', String(!g.hidden.has(k.kind)));
            const sample = svgEl(doc, 'svg', { class: 'kp-graph__sample', viewBox: '0 0 24 8', 'aria-hidden': 'true' });
            const line = svgEl(doc, 'line', { x1: 1, y1: 4, x2: 23, y2: 4, 'data-kp-style': k.style });
            line.setAttribute('style', `--kp-graph-edge-colour: ${k.colour}`);
            sample.append(line);
            button.append(sample, make(doc, 'span', '', k.label));
            li.append(button);
            g.decorate?.(button, { kind: 'kind', host: g.el, key: keyOf(g.el), value: k.kind, label: k.label });
            return li;
        }),
    );
    g.legend.hidden = present.length === 0 || data.nodes.length < 2;
    restyleGraph(g);
    if (hadFocus) /** @type {SVGGElement | null} */ (g.svg.querySelector(`[data-kp-id="${CSS.escape(hadFocus)}"]`))?.focus();
}

/**
 * Give a graph its nodes, edges and kinds. Ids that stay keep their
 * selection and focus; picked ids that went are dropped (and said so).
 * @param {Element} el
 * @param {GraphData} data
 */
export function setGraphData(el, data) {
    const g = graphs.get(el);
    if (!g) return;
    g.data = data;
    g.state = data.nodes.length ? 'ready' : 'empty';
    const ids = new Set(data.nodes.map((n) => n.id));
    const before = g.selected.size;
    for (const id of [...g.selected]) if (!ids.has(id)) g.selected.delete(id);
    if (g.hover && !ids.has(g.hover)) g.hover = null;
    drawGraph(g);
    if (g.selected.size !== before) graphChanged(g);
}

/** `loading`, `empty` or `error`, with the sentence to show at the graph's final height. @param {Element} el @param {'loading' | 'empty' | 'error'} state @param {string} [words] */
export function setGraphState(el, state, words = '') {
    const g = graphs.get(el);
    if (!g) return;
    g.state = state;
    g.words = words;
    drawGraph(g);
}

/** Pick these nodes (and only these). @param {Element} el @param {string[]} ids */
export function graphSelect(el, ids) {
    const g = graphs.get(el);
    if (!g) return;
    g.selected = new Set(ids);
    restyleGraph(g);
    graphChanged(g);
}

/** Hide or show one kind of link. @param {Element} el @param {string} kind @param {boolean} hide */
export function graphHideKind(el, kind, hide) {
    const g = graphs.get(el);
    if (!g) return;
    if (hide) g.hidden.add(kind);
    else g.hidden.delete(kind);
    restyleGraph(g);
    graphChanged(g);
}

/**
 * Build every graph under `root`: a bar with the kinds and Show all, the
 * picture (one tab stop: arrows between nodes, Enter or Space picks, Esc
 * shows all), and the hint under it in the page's flow.
 * @param {ParentNode} [root]
 * @param {{ decorate?: Decorate }} [options]
 * @returns {() => void} detach
 */
export function attachGraphs(root = document, { decorate } = {}) {
    /** @type {(() => void)[]} */
    const undo = [];
    for (const el of /** @type {HTMLElement[]} */ ([...root.querySelectorAll(GRAPH)])) {
        if (graphs.has(el)) continue;
        const doc = el.ownerDocument;
        const view = doc.defaultView;
        const bar = make(doc, 'div', 'kp-graph__bar');
        const legend = make(doc, 'ul', 'kp-graph__kinds');
        legend.setAttribute('aria-label', GRAPH_STRINGS.kinds);
        legend.hidden = true;
        const showAll = make(doc, 'button', 'kp-button kp-button--sm kp-graph__show-all', GRAPH_STRINGS.showAll);
        showAll.type = 'button';
        showAll.title = GRAPH_STRINGS.showAllTitle;
        showAll.setAttribute('data-kp-idle', '');
        bar.append(legend, showAll);
        const box = make(doc, 'div', 'kp-graph__box');
        const svg = /** @type {SVGSVGElement} */ (/** @type {unknown} */ (svgEl(doc, 'svg', { class: 'kp-graph__svg', role: 'group' })));
        svg.setAttribute('aria-label', `${el.getAttribute('aria-label') ?? 'Graph'}. ${GRAPH_STRINGS.hint}`);
        const note = make(doc, 'p', 'kp-graph__note');
        note.setAttribute('role', 'status');
        box.append(svg, note);
        const hint = make(doc, 'p', 'kp-graph__hint', GRAPH_STRINGS.hint);
        el.replaceChildren(bar, box, hint);
        /** @type {GraphModel} */
        const g = {
            el,
            data: null,
            state: 'loading',
            words: '',
            selected: new Set(),
            hidden: new Set(),
            hover: null,
            focus: null,
            drawnWidth: -1,
            bar,
            showAll,
            legend,
            box,
            svg,
            note,
            hint,
            decorate,
            labels: [],
            size: [0, 0],
        };
        graphs.set(el, g);
        decorate?.(showAll, { kind: 'show-all', host: el, key: keyOf(el) });
        drawGraph(g);
        const nodeOf = (/** @type {EventTarget | null} */ target) =>
            /** @type {SVGGElement | null} */ (target instanceof Element ? target.closest('.kp-graph__node') : null);
        const toggle = (/** @type {string} */ id) => {
            if (g.selected.has(id)) g.selected.delete(id);
            else g.selected.add(id);
            restyleGraph(g);
            graphChanged(g);
        };
        const setHover = (/** @type {string | null} */ id) => {
            if (g.hover === id) return;
            g.hover = id;
            restyleGraph(g);
            graphChanged(g);
        };
        const clear = () => {
            if (g.selected.size === 0 && g.hidden.size === 0) return false;
            g.selected.clear();
            g.hidden.clear();
            restyleGraph(g);
            graphChanged(g);
            return true;
        };
        const order = () => /** @type {SVGGElement[]} */ ([...svg.querySelectorAll('.kp-graph__node')]);
        const focusNode = (/** @type {SVGGElement} */ node) => {
            for (const other of order()) other.setAttribute('tabindex', other === node ? '0' : '-1');
            g.focus = node.getAttribute('data-kp-id');
            node.focus();
        };
        /** @param {PointerEvent} event */
        const onOver = (event) => {
            const node = nodeOf(event.target);
            if (node) setHover(node.getAttribute('data-kp-id'));
        };
        /** @param {PointerEvent} event */
        const onOut = (event) => {
            const node = nodeOf(event.target);
            if (node && !node.contains(/** @type {Node | null} */ (event.relatedTarget))) setHover(null);
        };
        /** @param {FocusEvent} event */
        const onFocus = (event) => {
            const node = nodeOf(event.target);
            if (node) {
                g.focus = node.getAttribute('data-kp-id');
                setHover(g.focus);
            }
        };
        /** @param {FocusEvent} event */
        const onBlur = (event) => {
            if (!svg.contains(/** @type {Node | null} */ (event.relatedTarget))) setHover(null);
        };
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const node = nodeOf(event.target);
            if (!node) return;
            const id = node.getAttribute('data-kp-id') ?? '';
            for (const other of order()) other.setAttribute('tabindex', other === node ? '0' : '-1');
            g.focus = id;
            toggle(id);
        };
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const node = nodeOf(event.target);
            if (!node) return;
            const nodes = order();
            const at = nodes.indexOf(node);
            const hasHub = !!svg.querySelector('.kp-graph__node--hub');
            const ringStart = hasHub ? 1 : 0;
            const ringCount = nodes.length - ringStart;
            /** @type {number | null} */
            let to = null;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') to = at < ringStart ? ringStart : ringStart + ((at - ringStart + 1) % ringCount);
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
                to = at < ringStart ? nodes.length - 1 : ringStart + ((at - ringStart - 1 + ringCount) % ringCount);
            else if (event.key === 'Home') to = 0;
            else if (event.key === 'End') to = nodes.length - 1;
            else if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggle(node.getAttribute('data-kp-id') ?? '');
                return;
            } else if (event.key === 'Escape') {
                if (clear()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                return;
            }
            if (to == null || !nodes[to] || ringCount < 1) return;
            event.preventDefault();
            focusNode(nodes[to]);
        };
        /** @param {MouseEvent} event */
        const onKind = (event) => {
            const button = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest('[data-kp-kind]') : null);
            if (!button) return;
            const kind = button.dataset.kpKind ?? '';
            graphHideKind(el, kind, !g.hidden.has(kind));
        };
        const onShowAll = () => clear();
        /** @param {KeyboardEvent} event */
        const onDocKey = (event) => {
            if (event.key !== 'Escape' || event.defaultPrevented) return;
            if (/** @type {Element | null} */ (event.target)?.closest?.('dialog, input, textarea, select, [role="menu"]')) return;
            clear();
        };
        svg.addEventListener('pointerover', onOver);
        svg.addEventListener('pointerout', onOut);
        svg.addEventListener('focusin', onFocus);
        svg.addEventListener('focusout', onBlur);
        svg.addEventListener('click', onClick);
        svg.addEventListener('keydown', onKey);
        legend.addEventListener('click', onKind);
        showAll.addEventListener('click', onShowAll);
        doc.addEventListener('keydown', onDocKey);
        // Only a new width redraws: a taller box (a side panel growing beside
        // it) must never rebuild a node under the pointer.
        const sizes = view
            ? new view.ResizeObserver(() => {
                  if (box.clientWidth !== g.drawnWidth) drawGraph(g);
              })
            : null;
        sizes?.observe(box);
        // A web font that arrives after the drawing changes every label's
        // width: fit them again, in place (no node is rebuilt).
        const onFonts = () => {
            for (const l of g.labels) {
                l.length = l.full.length;
                l.text.textContent = l.full;
            }
            if (isShown(svg)) fitLabels(g.labels, g.size[0], g.size[1]);
        };
        doc.fonts?.addEventListener('loadingdone', onFonts);
        undo.push(() => {
            doc.fonts?.removeEventListener('loadingdone', onFonts);
            sizes?.disconnect();
            svg.removeEventListener('pointerover', onOver);
            svg.removeEventListener('pointerout', onOut);
            svg.removeEventListener('focusin', onFocus);
            svg.removeEventListener('focusout', onBlur);
            svg.removeEventListener('click', onClick);
            svg.removeEventListener('keydown', onKey);
            legend.removeEventListener('click', onKind);
            showAll.removeEventListener('click', onShowAll);
            doc.removeEventListener('keydown', onDocKey);
            graphs.delete(el);
        });
    }
    return () => undo.splice(0).forEach((off) => off());
}

/* =============================================================== tour */

export const TOUR_STRINGS = {
    next: 'Next',
    nextTitle: 'Show the next part of the page',
    back: 'Back',
    backTitle: 'Show the part before this one',
    done: 'Done',
    doneTitle: 'End the tour',
    skip: 'Skip',
    skipTitle: 'End the tour now; Help can start it again',
    /** @param {number} n @param {number} of */
    count: (n, of) => `${n} of ${of}`,
};

/**
 * @typedef {{ target: string | (() => Element | null), title: string, text: string }} TourStep
 * @typedef {{ start?: number, remember?: string, spotlight?: boolean, decorate?: Decorate,
 *   returnFocus?: HTMLElement | null, onEnd?: (finished: boolean) => void }} TourOptions
 */

/** The memory key a finished tour writes. @param {string} name */
export const tourMemoryKey = (name) => `kp-tour:${name}`;

/**
 * Whether a tour starts by itself, and at which step: `?tour` (or `?tour=3`,
 * counted from 1) always does; otherwise only a first visit by a person
 * (not a browser driven by a script).
 * @param {{ search?: string, remembered?: boolean, automated?: boolean }} context
 * @returns {number | null}
 */
export function shouldStartTour({ search = '', remembered = false, automated = false }) {
    const asked = new URLSearchParams(search).get('tour');
    if (asked != null) return Math.max(0, (Number.parseInt(asked, 10) || 1) - 1);
    if (remembered || automated) return null;
    return 0;
}

/** @param {TourStep} step @param {Document} doc @returns {HTMLElement | null} */
function resolveTarget(step, doc) {
    if (typeof step.target === 'function') {
        const el = step.target();
        return el instanceof HTMLElement && isShown(el) ? el : null;
    }
    return /** @type {HTMLElement | null} */ ([...doc.querySelectorAll(step.target)].find((el) => isShown(el)) ?? null);
}

/** @type {(() => void) | null} */
let endRunning = null;

/**
 * Walk the reader over the page, one card per step, beside its target. Steps
 * whose target is not on the page are left out before counting, so the count
 * is exact. The card is a non-modal dialog: the page stays usable. Esc or
 * Skip ends it, the focus goes back where it was, and a finished tour is
 * remembered (`remember`), if the browser lets it.
 * @param {TourStep[]} steps
 * @param {TourOptions} [options]
 * @returns {{ end: () => void, goto: (i: number) => void } | null} null when no step has a target
 */
export function startTour(steps, { start = 0, remember, spotlight = false, decorate, returnFocus, onEnd } = {}) {
    endRunning?.();
    const doc = document;
    const view = /** @type {Window} */ (doc.defaultView);
    let live = steps.filter((s) => resolveTarget(s, doc));
    if (!live.length) return null;
    const back = /** @type {HTMLElement | null} */ (returnFocus ?? (doc.activeElement instanceof HTMLElement ? doc.activeElement : null));
    let index = Math.min(Math.max(0, start), live.length - 1);
    /** @type {HTMLElement | null} */
    let target = null;
    /** @type {string} */
    let targetPosition = '';
    const card = /** @type {HTMLDialogElement} */ (make(doc, 'dialog', 'kp-tour'));
    const title = make(doc, 'h3', 'kp-tour__title');
    title.id = nextId('kp-tour-title');
    const text = make(doc, 'p', 'kp-tour__text');
    text.id = nextId('kp-tour-text');
    card.setAttribute('aria-labelledby', title.id);
    card.setAttribute('aria-describedby', text.id);
    const foot = make(doc, 'footer', 'kp-tour__foot');
    const count = make(doc, 'span', 'kp-tour__count');
    const buttons = make(doc, 'span', 'kp-tour__buttons');
    const backButton = make(doc, 'button', 'kp-button kp-button--sm', TOUR_STRINGS.back);
    backButton.type = 'button';
    backButton.title = TOUR_STRINGS.backTitle;
    const skipButton = make(doc, 'button', 'kp-button kp-button--sm kp-button--ghost', TOUR_STRINGS.skip);
    skipButton.type = 'button';
    skipButton.title = TOUR_STRINGS.skipTitle;
    const nextButton = make(doc, 'button', 'kp-button kp-button--sm kp-button--primary', TOUR_STRINGS.next);
    nextButton.type = 'button';
    buttons.append(backButton, skipButton, nextButton);
    foot.append(count, buttons);
    card.append(title, text, foot);
    decorate?.(nextButton, { kind: 'tour-next', host: card });
    decorate?.(backButton, { kind: 'tour-back', host: card });
    decorate?.(skipButton, { kind: 'tour-skip', host: card });

    const unmark = () => {
        if (!target) return;
        target.removeAttribute('data-kp-tour-target');
        target.removeAttribute('data-kp-tour-spotlight');
        target.style.position = targetPosition;
        target = null;
    };
    const place = () => {
        if (!target || !card.open) return;
        // A target replaced or hidden by a live update: find it again.
        if (!isShown(target)) {
            const again = resolveTarget(live[index], doc);
            if (again) mark(again);
            else {
                live = live.filter((_, i) => i !== index);
                if (!live.length) {
                    finish(false);
                    return;
                }
                show(Math.min(index, live.length - 1), false);
                return;
            }
        }
        const r = /** @type {HTMLElement} */ (target).getBoundingClientRect();
        const gutter = 16;
        const gap = 12;
        const w = card.offsetWidth;
        const h = card.offsetHeight;
        const left = Math.max(gutter, Math.min(view.innerWidth - w - gutter, r.left + r.width / 2 - w / 2));
        // Under the target, or over it when the target is in the lower half:
        // the card never covers what it talks about.
        const top = r.top + r.height / 2 > view.innerHeight / 2 ? r.top - gap - h : r.bottom + gap;
        card.style.left = `${Math.round(left)}px`;
        card.style.top = `${Math.round(top)}px`;
    };
    /** @param {HTMLElement} el */
    const mark = (el) => {
        unmark();
        target = el;
        targetPosition = el.style.position;
        el.setAttribute('data-kp-tour-target', '');
        if (spotlight) el.setAttribute('data-kp-tour-spotlight', '');
        if (view.getComputedStyle(el).position === 'static') el.style.position = 'relative';
    };
    /** @param {number} i @param {boolean} [scroll] */
    const show = (i, scroll = true) => {
        index = i;
        const step = live[index];
        const el = resolveTarget(step, doc);
        if (!el) {
            live = live.filter((_, k) => k !== index);
            if (!live.length) {
                finish(false);
                return;
            }
            show(Math.min(index, live.length - 1), scroll);
            return;
        }
        mark(el);
        // The card goes where the target is: into an open modal dialog when the
        // target is in one, or it would sit behind it, inert.
        const host = el.closest('dialog[open]') ?? doc.body;
        if (card.parentElement !== host) {
            if (card.open) card.close();
            host.append(card);
        }
        if (!card.open) card.show();
        title.textContent = step.title;
        text.textContent = step.text;
        count.textContent = TOUR_STRINGS.count(index + 1, live.length);
        backButton.hidden = index === 0;
        const last = index === live.length - 1;
        nextButton.textContent = last ? TOUR_STRINGS.done : TOUR_STRINGS.next;
        nextButton.title = last ? TOUR_STRINGS.doneTitle : TOUR_STRINGS.nextTitle;
        if (scroll) el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reducedMotion(doc) ? 'auto' : 'smooth' });
        place();
        nextButton.focus({ preventScroll: true });
    };
    /** @param {boolean} finished */
    const finish = (finished) => {
        unmark();
        if (card.open) card.close();
        card.remove();
        view.removeEventListener('keydown', onKey, true);
        view.removeEventListener('resize', onMove);
        doc.removeEventListener('scroll', onMove, true);
        endRunning = null;
        if (remember) {
            try {
                view.localStorage.setItem(tourMemoryKey(remember), '1');
            } catch {
                // No storage (a private window): the tour shows again next time.
            }
        }
        if (back?.isConnected) back.focus();
        onEnd?.(finished);
    };
    let frame = 0;
    const onMove = () => {
        if (frame) return;
        frame = view.requestAnimationFrame(() => {
            frame = 0;
            place();
        });
    };
    /** @param {KeyboardEvent} event */
    const onKey = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            finish(false);
            return;
        }
        if (!card.contains(/** @type {Node} */ (event.target))) return;
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextButton.click();
        } else if (event.key === 'ArrowLeft' && index > 0) {
            event.preventDefault();
            backButton.click();
        }
    };
    nextButton.addEventListener('click', () => (index >= live.length - 1 ? finish(true) : show(index + 1)));
    backButton.addEventListener('click', () => index > 0 && show(index - 1));
    skipButton.addEventListener('click', () => finish(false));
    view.addEventListener('keydown', onKey, true);
    view.addEventListener('resize', onMove);
    doc.addEventListener('scroll', onMove, true);
    endRunning = () => finish(false);
    show(index);
    return { end: () => finish(false), goto: (i) => show(Math.min(Math.max(0, i), live.length - 1)) };
}
