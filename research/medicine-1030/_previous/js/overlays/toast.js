// Toasts: the region, the stack and the toast that waits while it is attended.
import { getStrings } from '../strings.js';
import { leave } from '../motion.js';
import { TOAST_HIDE_EVENT, TOAST_LINGER_MS, TOAST_MS, TOAST_PAUSE_EVENT, TOAST_SHOW_EVENT } from './constants.js';

/**
 * The page's toast region, created on first use.
 *
 * @param {{ region?: HTMLElement | null, role?: string, live?: 'polite' | 'assertive' | 'off', className?: string }} [options]
 * @returns {HTMLElement}
 */
export function toastRegion({ region = null, role = 'status', live = 'polite', className = 'kp-toasts' } = {}) {
    if (region) return region;
    let found = /** @type {HTMLElement | null} */ (document.querySelector(`.${className.split(/\s+/)[0]}`));
    if (!found) {
        found = document.createElement('div');
        found.className = className;
        found.setAttribute('role', role);
        found.setAttribute('aria-live', live);
        document.body.append(found);
    }
    return found;
}

/** The toasts dismissed and leaving now, which a stack's `max` no longer counts. @type {WeakSet<Element>} */
export const goingToasts = new WeakSet();

/**
 * Show a toast in the page's toast region, creating the region if it is
 * not there. role="status" rather than role="alert" by default: a toast
 * is an announcement, and alert interrupts whatever a screen reader was
 * saying. An error that must interrupt passes `live: 'assertive'` on its
 * own toast, which gets its own live region so the politeness is per
 * message rather than per page.
 *
 * A toast does not leave under a reader's eye: while the pointer is on it or
 * focus is inside it, its clock stops (`data-kp-paused` on the toast, and
 * TOAST_PAUSE_EVENT), and `linger` ms after both have gone it leaves. Esc on a
 * focused toast closes it. `pause: false` brings back the plain timer.
 * `close: true` adds a close button; `sticky: true` is `ms: 0` plus that
 * button, a toast that stays until it is closed (an undo that needs a
 * decision, an error to be read). The buttons sit at the toast's end.
 *
 * @param {string | Node} content text, or a node the consumer built
 * @param {{ ms?: number, region?: HTMLElement | null, live?: 'polite' | 'assertive', className?: string, action?: { label: string, onClick: () => void }, max?: number, pause?: boolean, linger?: number, close?: boolean, sticky?: boolean }} [options]
 *   ms: 0 keeps the toast until dismissed; max: drop the oldest beyond this many;
 *   pause: stop the clock while hovered or focused (default true); linger: ms left after both have gone (default TOAST_LINGER_MS);
 *   close: add a close button; sticky: stay until closed, with a close button
 * @returns {HTMLElement & { dismiss: () => void }} the toast, so a caller can remove it early
 */
export function toast(
    content,
    {
        ms = TOAST_MS,
        region = null,
        live,
        className = 'kp-toast',
        action,
        max,
        pause = true,
        linger = TOAST_LINGER_MS,
        close = false,
        sticky = false,
    } = {},
) {
    const host =
        live === 'assertive'
            ? toastRegion({ role: 'alert', live: 'assertive', className: 'kp-toasts kp-toasts--assertive' })
            : toastRegion({ region });
    const el = /** @type {HTMLElement & { dismiss: () => void }} */ (/** @type {unknown} */ (document.createElement('div')));
    el.className = className;
    // The words in their own box, so the buttons sit at the toast's end
    // whatever the text's length (second nostromo pass, 2026-09-13).
    const body = document.createElement('span');
    body.className = 'kp-toast__body';
    if (typeof content === 'string') body.textContent = content;
    else body.append(content);
    el.append(body);
    if (action) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'kp-button kp-button--ghost';
        button.textContent = action.label;
        button.addEventListener('click', action.onClick);
        el.append(button);
    }
    if (close || sticky) {
        const closer = document.createElement('button');
        closer.type = 'button';
        closer.className = 'kp-icon-button kp-toast__close';
        closer.setAttribute('aria-label', getStrings().close);
        closer.textContent = '×';
        // Wired here, so the toast closes without attachDismissals; the mark
        // keeps that one from closing it a second time.
        closer.setAttribute('data-kp-dismiss-owner', '');
        closer.addEventListener('click', () => el.dismiss());
        el.append(closer);
    }
    let timer = 0;
    el.dismiss = () => {
        clearTimeout(timer);
        if (!el.isConnected || goingToasts.has(el)) return;
        goingToasts.add(el);
        // It leaves the theme's way (js/motion.js), the way it arrived turned
        // around where the theme opens so: it popped out at once while it
        // came in with the theme's motion (Kenny, 2026-10-05). The event
        // comes once it is gone.
        void leave(el).then(() => host.dispatchEvent(new CustomEvent(TOAST_HIDE_EVENT, { bubbles: true, detail: { toast: el } })));
    };
    host.append(el);
    if (max !== undefined) {
        // The oldest beyond `max`, not counting those already on their way out.
        const staying = [...host.children].filter((child) => !goingToasts.has(child));
        for (const old of staying.slice(0, Math.max(0, staying.length - max)))
            /** @type {HTMLElement & { dismiss?: () => void }} */ (old).dismiss?.();
    }
    host.dispatchEvent(
        new CustomEvent(TOAST_SHOW_EVENT, { bubbles: true, detail: { toast: el, text: typeof content === 'string' ? content : el.textContent } }),
    );
    const lasting = sticky ? 0 : ms;
    if (lasting > 0) {
        timer = window.setTimeout(el.dismiss, lasting);
        if (pause)
            holdWhileAttended(
                el,
                () => timer,
                (next) => (timer = next),
                linger,
            );
    }
    // Esc on a toast with focus in it closes it, with or without a clock.
    el.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || event.defaultPrevented) return;
        event.preventDefault();
        el.dismiss();
    });
    return el;
}

/**
 * Stop a toast's clock while a pointer is on it or focus is inside it, and
 * start `linger` ms after both are gone. A touch is not "hovering": its
 * pointerenter comes with the tap and its leave with the lift, so only a mouse
 * or a pen holds a toast, and focus does for the rest.
 *
 * @param {HTMLElement & { dismiss: () => void }} el
 * @param {() => number} getTimer
 * @param {(timer: number) => void} setTimer
 * @param {number} linger
 */
function holdWhileAttended(el, getTimer, setTimer, linger) {
    let pointer = false;
    let focus = false;
    let held = false;
    const settle = () => {
        const attended = pointer || focus;
        if (attended === held) return;
        held = attended;
        clearTimeout(getTimer());
        el.toggleAttribute('data-kp-paused', held);
        if (!held) setTimer(window.setTimeout(el.dismiss, linger));
        el.parentElement?.dispatchEvent(new CustomEvent(TOAST_PAUSE_EVENT, { bubbles: true, detail: { toast: el, paused: held } }));
    };
    el.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'touch') return;
        pointer = true;
        settle();
    });
    el.addEventListener('pointerleave', () => {
        pointer = false;
        settle();
    });
    el.addEventListener('focusin', () => {
        focus = true;
        settle();
    });
    el.addEventListener('focusout', (event) => {
        // Focus moving to another part of the same toast is still attended.
        if (event.relatedTarget instanceof Node && el.contains(event.relatedTarget)) return;
        focus = false;
        settle();
    });
}
