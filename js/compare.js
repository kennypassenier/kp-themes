// The compare slider: two versions stacked, a divider between them [kpadopt4-ideas, Kenny 2026-10-16].
//
//   <div class="kp-compare" data-kp-compare>
//       <div data-kp-compare-pane="before"><img src="old.png" width="1200" height="675" alt="The dashboard before" /></div>
//       <div data-kp-compare-pane="after"><img src="new.png" width="1200" height="675" alt="The dashboard after" /></div>
//   </div>
//
// The two panes lie on top of each other; the before pane shows on the start
// side of the divider and the after pane on the end side. The divider is a
// slider (`role="slider"`, 0 to 100): drag its handle, or press the arrow keys
// (a step of 1, with Shift of 10), Page Up and Page Down (10), Home (all
// after) and End (all before). On images a press anywhere moves the divider
// there and a drag follows; on live HTML panes (a pane that holds a link, a
// button or a field) only the handle drags, so the panes stay usable on both
// sides. A label marks each side ("Before", "After", or the
// `data-kp-compare-before` and `-after` words) and steps aside while the
// divider covers it.
//
// The panes keep their size from the first frame: give the images their
// width and height, or the box `data-kp-compare-ratio="16/9"`. While an image
// loads the box shows the theme's skeleton over its whole size; an image that
// fails says so in its own pane. setCompare(el, position) moves the divider
// from a script; `kp-compare-change` ({ position }) says where it went.
//
// The divider glides to a press in the theme's own time and curve, follows a
// drag at once, and never glides under reduced motion.
//
// Nothing runs on import; attachCompares(root) returns a detach.

import { getStrings } from './strings.js';

/** A compare slider. */
export const COMPARE = '[data-kp-compare]';
/** Fired on the slider when the divider moved by a person: `{ position }` (0 to 100). */
export const COMPARE_EVENT = 'kp-compare-change';
/** What makes a pane live HTML: the panes stay usable and only the handle drags. */
const INTERACTIVE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/** @type {WeakMap<HTMLElement, (position: number, fire: boolean, glide: boolean) => void>} */
const MOVE = new WeakMap();

/**
 * Move a slider's divider from a script, without the event.
 * @param {Element} el @param {number} position 0 (all after) to 100 (all before)
 */
export function setCompare(el, position) {
    MOVE.get(/** @type {HTMLElement} */ (el))?.(position, false, true);
}

/**
 * The divider's position after a key, or null for a key it does not take.
 * @param {string} key @param {number} at @param {boolean} big
 * @returns {number | null}
 */
export function compareKey(key, at, big) {
    const step = big ? 10 : 1;
    if (key === 'ArrowLeft' || key === 'ArrowDown') return Math.max(0, at - step);
    if (key === 'ArrowRight' || key === 'ArrowUp') return Math.min(100, at + step);
    if (key === 'PageDown') return Math.max(0, at - 10);
    if (key === 'PageUp') return Math.min(100, at + 10);
    if (key === 'Home') return 0;
    if (key === 'End') return 100;
    return null;
}

/**
 * Wire every compare slider under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachCompares(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    const sliders = /** @type {HTMLElement[]} */ ([
        ...(root instanceof Element && root.matches(COMPARE) ? [root] : []),
        ...root.querySelectorAll(COMPARE),
    ]);
    for (const el of sliders) {
        if (MOVE.has(el)) continue;
        const before = /** @type {HTMLElement | null} */ (el.querySelector(':scope > [data-kp-compare-pane="before"]'));
        const after = /** @type {HTMLElement | null} */ (el.querySelector(':scope > [data-kp-compare-pane="after"]'));
        if (!before || !after) continue;
        const s = getStrings();
        const doc = el.ownerDocument;
        const view = doc.defaultView ?? window;
        const rtl = () => view.getComputedStyle(el).direction === 'rtl';
        el.classList.add('kp-compare');
        before.classList.add('kp-compare__pane', 'kp-compare__pane--before');
        after.classList.add('kp-compare__pane', 'kp-compare__pane--after');
        if (el.dataset.kpCompareRatio) el.style.setProperty('--kp-compare-ratio', el.dataset.kpCompareRatio);
        const live = Boolean(before.querySelector(INTERACTIVE) || after.querySelector(INTERACTIVE));
        el.dataset.kpCompareDrag = el.dataset.kpCompareDrag ?? (live ? 'handle' : 'anywhere');
        const wordBefore = el.dataset.kpCompareBefore ?? s.compareBefore;
        const wordAfter = el.dataset.kpCompareAfter ?? s.compareAfter;

        const labelBefore = doc.createElement('span');
        labelBefore.className = 'kp-compare__label kp-compare__label--before';
        labelBefore.textContent = wordBefore;
        labelBefore.setAttribute('aria-hidden', 'true');
        const labelAfter = doc.createElement('span');
        labelAfter.className = 'kp-compare__label kp-compare__label--after';
        labelAfter.textContent = wordAfter;
        labelAfter.setAttribute('aria-hidden', 'true');

        const divider = doc.createElement('div');
        divider.className = 'kp-compare__divider';
        const handle = doc.createElement('span');
        handle.className = 'kp-compare__handle';
        handle.tabIndex = 0;
        handle.setAttribute('role', 'slider');
        handle.setAttribute('aria-label', el.getAttribute('aria-label') ?? s.compareSlider(wordBefore, wordAfter));
        handle.setAttribute('aria-valuemin', '0');
        handle.setAttribute('aria-valuemax', '100');
        handle.setAttribute('aria-orientation', 'horizontal');
        const grip = doc.createElement('span');
        grip.className = 'kp-compare__grip';
        grip.setAttribute('aria-hidden', 'true');
        handle.append(grip);
        divider.append(handle);

        // While an image loads, the theme's skeleton covers the box; a failed image says so in its pane.
        const wait = doc.createElement('span');
        wait.className = 'kp-skeleton kp-skeleton--block kp-compare__wait';
        wait.setAttribute('aria-hidden', 'true');
        el.append(labelBefore, labelAfter, divider, wait);

        let position = Math.min(100, Math.max(0, Number(el.dataset.kpComparePosition ?? 50) || 0));
        /** @param {number} next @param {boolean} fire @param {boolean} glide */
        const move = (next, fire, glide) => {
            const to = Math.round(Math.min(100, Math.max(0, next)) * 10) / 10;
            el.toggleAttribute('data-kp-compare-glide', glide);
            el.style.setProperty('--kp-compare-pos', String(to));
            handle.setAttribute('aria-valuenow', String(Math.round(to)));
            handle.setAttribute('aria-valuetext', s.compareValue(Math.round(to), wordBefore, wordAfter));
            // A label steps aside while the divider covers it.
            el.toggleAttribute('data-kp-compare-before-hidden', to < 12);
            el.toggleAttribute('data-kp-compare-after-hidden', to > 88);
            const moved = to !== position;
            position = to;
            if (fire && moved) el.dispatchEvent(new CustomEvent(COMPARE_EVENT, { bubbles: true, detail: { position: to } }));
        };
        MOVE.set(el, move);
        move(position, false, false);

        /** @param {PointerEvent} event */
        const at = (event) => {
            const box = el.getBoundingClientRect();
            const share = ((event.clientX - box.left) / Math.max(1, box.width)) * 100;
            return rtl() ? 100 - share : share;
        };
        let dragging = false;
        /** @param {PointerEvent} event */
        const onDown = (event) => {
            if (event.button !== 0) return;
            const onHandle = handle.contains(/** @type {Node} */ (event.target));
            if (!onHandle && el.dataset.kpCompareDrag !== 'anywhere') return;
            dragging = true;
            el.setAttribute('data-kp-compare-dragging', '');
            el.setPointerCapture(event.pointerId);
            if (!onHandle) move(at(event), true, true);
            handle.focus({ preventScroll: true });
            event.preventDefault();
        };
        /** @param {PointerEvent} event */
        const onMove = (event) => {
            if (dragging) move(at(event), true, false);
        };
        /** @param {PointerEvent} event */
        const onUp = (event) => {
            if (!dragging) return;
            dragging = false;
            el.removeAttribute('data-kp-compare-dragging');
            if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
        };
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const flip = rtl() && (event.key === 'ArrowLeft' || event.key === 'ArrowRight');
            const key = flip ? (event.key === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft') : event.key;
            const next = compareKey(key, position, event.shiftKey);
            if (next === null) return;
            event.preventDefault();
            move(next, true, false);
        };
        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onUp);
        handle.addEventListener('keydown', onKey);

        // Loading: the box waits until every image in it has arrived or failed.
        const images = /** @type {HTMLImageElement[]} */ ([...before.querySelectorAll('img'), ...after.querySelectorAll('img')]);
        /** @type {HTMLElement[]} */
        const notes = [];
        const settle = () => {
            const waiting = images.some((img) => !img.complete);
            el.dataset.kpCompareState = waiting ? 'loading' : 'ready';
            el.setAttribute('aria-busy', String(waiting));
            for (const img of images) {
                const pane = /** @type {HTMLElement} */ (img.closest('.kp-compare__pane'));
                const failed = img.complete && img.naturalWidth === 0;
                const known = notes.find((n) => n.parentElement === pane);
                if (failed && !known) {
                    const note = doc.createElement('p');
                    note.className = 'kp-compare__failed';
                    note.textContent = s.compareFailed;
                    pane.append(note);
                    notes.push(note);
                }
            }
        };
        for (const img of images) {
            img.addEventListener('load', settle);
            img.addEventListener('error', settle);
        }
        settle();

        cleanups.push(() => {
            el.removeEventListener('pointerdown', onDown);
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerup', onUp);
            el.removeEventListener('pointercancel', onUp);
            for (const img of images) {
                img.removeEventListener('load', settle);
                img.removeEventListener('error', settle);
            }
            for (const n of [labelBefore, labelAfter, divider, wait, ...notes]) n.remove();
            MOVE.delete(el);
            el.style.removeProperty('--kp-compare-pos');
            el.removeAttribute('aria-busy');
            delete el.dataset.kpCompareState;
        });
    }
    return () => {
        for (const c of cleanups) c();
    };
}
