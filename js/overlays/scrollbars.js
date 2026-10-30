// Scroll boxes: the overflow marker and the scrollbar watcher.
import { SCROLL_BOXES, SCROLL_OVERFLOW } from './constants.js';

/**
 * Tell a register whether an overlay's box scrolls, and where [retro notes, 2026-09-15].
 *
 * Theme-neutral data, nothing drawn: `data-kp-popover-overflowing` exactly while the
 * content is taller than the box, and three custom properties while it is —
 * `--kp-scroll-view` (the box's inner height in px), `--kp-scroll-ratio`
 * (the part of the content in view, 0–1) and `--kp-scroll-progress` (how far
 * it is scrolled, 0–1). A register that draws its own scrollbar reads them;
 * every other theme never notices them.
 *
 * Such a register also declares `--kp-scrollbar-size` (the bar's width),
 * `--kp-scrollbar-inset` (its distance from the padding box's end edge and
 * from the top and bottom) and `--kp-scrollbar-button` (an arrow button's
 * height) on the box. Only then does a press on the drawn bar do what a
 * platform scrollbar's does: an arrow scrolls a line, the track a page,
 * and the thumb is dragged. A press on a bar with nothing to scroll does
 * nothing. The bar is drawn at the inline end of a left-to-right box.
 *
 * @param {HTMLElement} box
 * @returns {() => void} stop, which also takes the attribute and the properties away
 */
export function watchScrollbar(box) {
    const PROPS = ['--kp-scroll-view', '--kp-scroll-ratio', '--kp-scroll-progress'];
    const measure = () => {
        const view = box.clientHeight;
        const size = box.scrollHeight;
        const over = view > 0 && size > view + 1;
        box.toggleAttribute(SCROLL_OVERFLOW, over);
        if (!over) {
            for (const p of PROPS) box.style.removeProperty(p);
            return;
        }
        box.style.setProperty('--kp-scroll-view', `${view}px`);
        box.style.setProperty('--kp-scroll-ratio', (view / size).toFixed(4));
        box.style.setProperty('--kp-scroll-progress', Math.min(1, Math.max(0, box.scrollTop / (size - view))).toFixed(4));
    };

    /** @param {string} name */
    const length = (name) => parseFloat(getComputedStyle(box).getPropertyValue(name));
    /** @param {PointerEvent} event */
    const onPointerDown = (event) => {
        const bar = length('--kp-scrollbar-size');
        if (event.button !== 0 || !(bar > 0)) return;
        const inset = length('--kp-scrollbar-inset') || 0;
        const rect = box.getBoundingClientRect();
        const right = rect.left + box.clientLeft + box.clientWidth - inset;
        const top = rect.top + box.clientTop + inset;
        const bottom = rect.top + box.clientTop + box.clientHeight - inset;
        if (event.clientX < right - bar || event.clientX > right || event.clientY < top || event.clientY > bottom) return;
        event.preventDefault();
        if (!box.hasAttribute(SCROLL_OVERFLOW)) return;
        const button = Math.min(length('--kp-scrollbar-button') || bar, (bottom - top) / 2);
        const line = parseFloat(getComputedStyle(box).lineHeight) || 20;
        if (event.clientY < top + button) box.scrollTop -= line;
        else if (event.clientY > bottom - button) box.scrollTop += line;
        else {
            const track = bottom - top - 2 * button;
            const thumb = Math.max(8, track * (box.clientHeight / box.scrollHeight));
            const travel = track - thumb;
            const range = box.scrollHeight - box.clientHeight;
            const start = top + button + travel * (box.scrollTop / range);
            if (event.clientY < start) box.scrollTop -= box.clientHeight;
            else if (event.clientY > start + thumb) box.scrollTop += box.clientHeight;
            else if (travel > 0) {
                const from = { y: event.clientY, scroll: box.scrollTop };
                /** @param {PointerEvent} move */
                const onMove = (move) => {
                    box.scrollTop = from.scroll + ((move.clientY - from.y) / travel) * range;
                };
                const onUp = () => {
                    box.removeEventListener('pointermove', onMove);
                    box.removeEventListener('pointerup', onUp);
                    box.removeEventListener('pointercancel', onUp);
                };
                box.setPointerCapture?.(event.pointerId);
                box.addEventListener('pointermove', onMove);
                box.addEventListener('pointerup', onUp);
                box.addEventListener('pointercancel', onUp);
            }
        }
        measure();
    };

    measure();
    box.addEventListener('scroll', measure, { passive: true });
    box.addEventListener('pointerdown', onPointerDown);
    /** @type {ResizeObserver | null} */
    let resize = null;
    /** @type {MutationObserver | null} */
    let mutation = null;
    if (typeof ResizeObserver !== 'undefined') {
        resize = new ResizeObserver(measure);
        const observe = () => {
            resize?.disconnect();
            resize?.observe(box);
            for (const child of box.children) resize?.observe(child);
        };
        observe();
        mutation = new MutationObserver(() => {
            observe();
            measure();
        });
        mutation.observe(box, { childList: true });
    }
    return () => {
        resize?.disconnect();
        mutation?.disconnect();
        box.removeEventListener('scroll', measure);
        box.removeEventListener('pointerdown', onPointerDown);
        box.removeAttribute(SCROLL_OVERFLOW);
        for (const p of PROPS) box.style.removeProperty(p);
    };
}

/** The boxes some `attachScrollbars` already watches, so a second call is a no-op. */
const scrollbarsWatched = new WeakSet();

/**
 * `watchScrollbar` on every `.kp-popover`, `.kp-dialog` and
 * `.kp-dialog__body` under `root`, including the ones added later (a theme
 * menu, a data table's column menu). Idempotent.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachScrollbars(root = document) {
    /** @type {Map<HTMLElement, () => void>} */
    const watched = new Map();
    /** @param {ParentNode | Element} scope */
    const scan = (scope) => {
        const found = [...scope.querySelectorAll(SCROLL_BOXES)];
        if (scope instanceof Element && scope.matches(SCROLL_BOXES)) found.push(scope);
        for (const el of found) {
            const box = /** @type {HTMLElement} */ (el);
            if (watched.has(box) || scrollbarsWatched.has(box)) continue;
            scrollbarsWatched.add(box);
            const stop = watchScrollbar(box);
            watched.set(box, () => {
                stop();
                scrollbarsWatched.delete(box);
            });
        }
    };
    scan(root);
    const observer =
        typeof MutationObserver === 'undefined'
            ? null
            : new MutationObserver((records) => {
                  for (const record of records) for (const node of record.addedNodes) if (node instanceof Element) scan(node);
              });
    const target = root instanceof Document ? root.documentElement : root;
    if (observer && target instanceof Node) observer.observe(target, { childList: true, subtree: true });
    return () => {
        observer?.disconnect();
        for (const stop of watched.values()) stop();
        watched.clear();
    };
}
