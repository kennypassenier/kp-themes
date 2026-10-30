// Attaches the uptime strips of a page.
import { getStrings } from '../strings.js';
import { attachHoverCards, HOVERCARD_ATTRIBUTE } from '../hovercard.js';
import { arriveShown, playClose, stopClose } from '../motion.js';
import { raiseOverlay, placeBlockSide } from '../top-layer.js';
import { CELL, UPTIME, UPTIME_OPEN_EVENT, UPTIME_PICK_EVENT, UPTIME_STATES } from './constants.js';
import { setUptime } from './draw.js';
import { uptimePercent } from './figures.js';
import { edges, fit } from './fit.js';
import { infoMode, leaveGroupCard } from './group.js';
import { make, toneFor, wordFor } from './helpers.js';
import { CARDS, GROUPS, INFO, SPECS, UNPINNED, uptimeState } from './state.js';
/** @typedef {import('./types.js').UptimePeriod} UptimePeriod */
/** @typedef {import('./types.js').UptimeSpec} UptimeSpec */

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

        // The quick info of one period (opt-in, `open: 'info'`): the theme's popover plate under the pressed cell.
        const doc = el.ownerDocument;
        /** @type {HTMLElement | null} */
        let panel = null;
        /** @type {HTMLElement | null} */
        let anchor = null;
        /** @type {(() => void) | null} */
        let lower = null;
        let shown = false;
        /** The hover cards of this strip rest while its quick info is open, and come back after. @param {boolean} on */
        const tips = (on) => {
            for (const c of el.querySelectorAll('.kp-uptime__cell')) {
                const from = on ? 'data-kp-uptime-tip' : HOVERCARD_ATTRIBUTE;
                const to = on ? HOVERCARD_ATTRIBUTE : 'data-kp-uptime-tip';
                const words = c.getAttribute(from);
                if (words === null) continue;
                c.setAttribute(to, words);
                c.removeAttribute(from);
            }
        };
        /** Under its cell, its start edge on the cell's, kept inside the strip and the window. @param {HTMLElement} p */
        const place = (p) => {
            if (!anchor) return;
            const box = anchor.getBoundingClientRect();
            const strip = el.getBoundingClientRect();
            const width = p.offsetWidth;
            const start = getComputedStyle(el).direction === 'rtl' ? box.right - width : box.left;
            const inStrip = Math.max(strip.left, Math.min(start, strip.right - width));
            const left = Math.max(8, Math.min(inStrip, doc.documentElement.clientWidth - width - 8));
            p.style.setProperty('left', `${left}px`);
            p.style.setProperty('top', `${box.bottom + 6}px`);
            placeBlockSide(p, box);
        };
        /** @param {HTMLElement} box @param {UptimePeriod} period */
        const fill = (box, period) => {
            const s = getStrings();
            const tone = toneFor(el, UPTIME_STATES.includes(period.state) ? period.state : 'none');
            const title = make(el, 'p', 'kp-uptime__info-title');
            title.id = `${box.id}-title`;
            title.textContent = period.label;
            const state = make(el, 'p', 'kp-uptime__info-state');
            const swatch = make(el, 'span', 'kp-uptime__swatch');
            swatch.dataset.kpTone = tone;
            swatch.setAttribute('aria-hidden', 'true');
            const word = make(el, 'span');
            word.textContent = wordFor(el, tone);
            state.append(swatch, word);
            const parts = [title, state];
            const percent = typeof period.uptime === 'number' && Number.isFinite(period.uptime) ? uptimePercent(period.uptime) : null;
            const incidents = typeof period.incidents === 'number' && period.incidents >= 0 ? Math.floor(period.incidents) : null;
            if (percent !== null || incidents !== null) {
                const figures = make(el, 'p', 'kp-uptime__info-figures');
                figures.textContent = s.uptimeInfoFigures(percent, incidents);
                parts.push(figures);
            }
            if (period.details?.length) {
                const list = make(el, 'ul', 'kp-uptime__info-details');
                for (const line of period.details) list.append(Object.assign(make(el, 'li'), { textContent: line }));
                parts.push(list);
            }
            if (period.href) {
                const link = /** @type {HTMLAnchorElement} */ (make(el, 'a', 'kp-button kp-button--sm kp-uptime__info-link'));
                link.href = period.href;
                link.textContent = s.uptimeOpen(period.label);
                parts.push(link);
            }
            box.setAttribute('aria-labelledby', title.id);
            box.replaceChildren(...parts);
        };
        /** @param {HTMLElement} cell */
        const openInfo = (cell) => {
            const periods = SPECS.get(el)?.periods ?? [];
            const index = periods.findIndex((p) => p.key === cell.dataset.kpKey);
            if (index < 0) return;
            if (!panel) {
                panel = make(el, 'div', 'kp-popover kp-uptime__info');
                panel.id = `kp-uptime-info-${(uptimeState.infoMade += 1)}`;
                panel.setAttribute('role', 'dialog');
                panel.hidden = true;
                el.append(panel);
            }
            const detail = { key: cell.dataset.kpKey, index, period: periods[index], panel };
            if (!el.dispatchEvent(new CustomEvent(UPTIME_OPEN_EVENT, { bubbles: true, cancelable: true, detail }))) return;
            fill(panel, periods[index]);
            anchor?.setAttribute('aria-expanded', 'false');
            anchor = cell;
            cell.setAttribute('aria-expanded', 'true');
            cell.setAttribute('aria-controls', panel.id);
            if (shown) {
                place(panel);
                return;
            }
            shown = true;
            attachHoverCards(doc).hide();
            tips(false);
            stopClose(panel);
            panel.hidden = false;
            if (lower) place(panel);
            else {
                lower = raiseOverlay(panel, place);
                arriveShown(panel);
            }
        };
        /** @param {boolean} refocus @param {boolean} [now] shut at once, without the close (a redraw) */
        const closeInfo = async (refocus, now = false) => {
            if (!shown || !panel) return;
            shown = false;
            const cell = anchor;
            cell?.setAttribute('aria-expanded', 'false');
            if (!now) {
                const done = await playClose(panel);
                if (!done || shown) return;
            }
            panel.hidden = true;
            lower?.();
            lower = null;
            stopClose(panel);
            tips(true);
            anchor = null;
            if (refocus && cell?.isConnected) cell.focus();
        };
        INFO.set(el, () => {
            void closeInfo(false, true);
            panel?.remove();
            panel = null;
        });

        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            if (event.key === 'Escape' && shown) {
                event.preventDefault();
                event.stopPropagation();
                void closeInfo(true);
                return;
            }
            const cell = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest(CELL) : null);
            if (!cell || !el.contains(cell) || panel?.contains(cell)) return;
            if (event.key === ' ' && cell.tagName === 'A') {
                // A link follows Enter by itself; Space follows it too, as on a button.
                event.preventDefault();
                cell.click();
                return;
            }
            const cells = /** @type {HTMLElement[]} */ ([...el.querySelectorAll(`.kp-uptime__track > ${CELL}:not([hidden])`)]);
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
            // An open quick info goes along with the focus.
            if (shown && cells[next].getAttribute('aria-haspopup')) openInfo(cells[next]);
        };
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const cell = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest(CELL) : null);
            if (!cell || !el.contains(cell) || panel?.contains(cell)) return;
            const periods = SPECS.get(el)?.periods ?? [];
            const index = periods.findIndex((p) => p.key === cell.dataset.kpKey);
            if (index < 0) return;
            for (const c of el.querySelectorAll(`.kp-uptime__track > ${CELL}`)) /** @type {HTMLElement} */ (c).tabIndex = -1;
            cell.tabIndex = 0;
            el.dispatchEvent(
                new CustomEvent(UPTIME_PICK_EVENT, { bubbles: true, detail: { key: cell.dataset.kpKey, index, period: periods[index] } }),
            );
            if (cell.getAttribute('aria-haspopup') && infoMode(el)) {
                if (shown && anchor === cell) void closeInfo(false);
                else openInfo(cell);
            }
        };
        /** A press anywhere but the quick info and the strip's cells closes it. @param {PointerEvent} event */
        const onOutside = (event) => {
            if (!shown) return;
            const target = event.target instanceof Element ? event.target : null;
            if (target && (panel?.contains(target) || (el.contains(target) && target.closest(CELL)))) return;
            void closeInfo(false);
        };
        /** Tabbing out of the strip and its quick info closes it. @param {FocusEvent} event */
        const onFocusOut = (event) => {
            const next = event.relatedTarget;
            if (shown && next instanceof Node && !el.contains(next)) void closeInfo(false);
        };
        el.addEventListener('keydown', onKey);
        el.addEventListener('click', onClick);
        el.addEventListener('focusout', onFocusOut);
        doc.addEventListener('pointerdown', onOutside, true);
        cleanups.push(() => {
            watcher?.disconnect();
            relaid?.disconnect();
            el.removeEventListener('scroll', onScroll, { capture: true });
            cancelAnimationFrame(frame);
            el.removeEventListener('keydown', onKey);
            el.removeEventListener('click', onClick);
            el.removeEventListener('focusout', onFocusOut);
            doc.removeEventListener('pointerdown', onOutside, true);
            INFO.get(el)?.();
            INFO.delete(el);
            const own = CARDS.get(el);
            const left = leaveGroupCard(el);
            if (!left || left.last) own?.remove();
            if (left?.last) GROUPS.delete(left.host);
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
