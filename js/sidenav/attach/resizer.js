// The resize grip: drag, keys and reset.
import { OPTIONS } from '../options.js';
import { getStrings } from '../../strings.js';
import { SIDENAV_RESIZER } from '../constants.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the the resize grip: drag, keys and reset part adds to the table's context.
 *
 * @typedef {{
 *     grip: HTMLElement | null;
 *     held: number | null;
 *     heldTransition: string;
 *     wroteWidth: boolean;
 * }} ResizerFields
 */

/**
 * The resize grip: drag, keys and reset.
 *
 * @param {SidenavContext} c
 */
export function installResizer(c) {
    const { doc, edge, isOpen, memory, offsetContent, on, panel, read, still, strings, threshold } = c;

    // Resize by dragging [Kenny, 2026-10-13, from the libraries survey]. A
    // handle on the edge that faces the content, inside the panel so it
    // covers none of the page: a `separator` the pointer drags and the
    // arrow keys move. It writes `--kp-sidenav-width`, the one knob the
    // content's offset already reads, and keeps it when the panel
    // remembers. The handle is not there in the collapsed rail.
    /** @type {HTMLElement | null} */
    c.grip = null;
    c.wroteWidth = false;
    const RESIZE_STEP = 16;
    /** @param {string} name @param {string} fallback */
    const limit = (name, fallback) => {
        const px = threshold(read(name) ?? fallback);
        return Number.isFinite(px) && px > 0 ? px : threshold(fallback);
    };
    const minWidth = () => limit(OPTIONS.minWidth, '12rem');
    const maxWidth = () => Math.max(minWidth(), limit(OPTIONS.maxWidth, '32rem'));
    const startsAtLeft = () => (edge() === 'start') !== (getComputedStyle(panel).direction === 'rtl');
    /** @param {number} px */
    const clampWidth = (px) => Math.round(Math.min(maxWidth(), Math.max(minWidth(), px)));
    const sayWidth = () => {
        if (c.grip === null) return;
        c.grip.setAttribute('aria-valuemin', String(Math.round(minWidth())));
        c.grip.setAttribute('aria-valuemax', String(Math.round(maxWidth())));
        c.grip.setAttribute('aria-valuenow', String(Math.round(panel.getBoundingClientRect().width)));
    };
    /** @param {number} px @param {boolean} [save] */
    const setWidth = (px, save = true) => {
        const next = clampWidth(px);
        panel.style.setProperty('--kp-sidenav-width', `${next}px`);
        c.wroteWidth = true;
        offsetContent(isOpen());
        sayWidth();
        if (save) memory?.write('width', next);
        return next;
    };
    if (on(OPTIONS.resizable, false)) {
        const s = { ...getStrings(), ...strings };
        c.grip = doc.createElement('div');
        c.grip.className = SIDENAV_RESIZER.slice(1);
        c.grip.setAttribute('role', 'separator');
        c.grip.setAttribute('aria-orientation', 'vertical');
        c.grip.setAttribute('aria-label', s.resizeSidebar);
        c.grip.setAttribute('aria-controls', panel.id);
        c.grip.tabIndex = 0;
        panel.append(c.grip);
        const painted = parseFloat(panel.style.getPropertyValue('--kp-sidenav-width'));
        if (Number.isFinite(painted)) setWidth(painted, false);
        else sayWidth();
    }
    /** The panel's width with the pointer where the handle is held, so the handle does not jump. @type {number} */
    let gripOffset = 0;
    /** @type {string} */
    c.heldTransition = '';
    /** @type {number | null} the pointer holding the handle */
    c.held = null;
    /** @param {PointerEvent} event */
    const pointerWidth = (event) => {
        const rect = panel.getBoundingClientRect();
        return startsAtLeft() ? event.clientX - rect.left : rect.right - event.clientX;
    };
    /** @param {PointerEvent} event */
    const onGripDown = (event) => {
        if (c.grip === null || event.button !== 0) return;
        event.preventDefault();
        try {
            c.grip.setPointerCapture(event.pointerId);
        } catch {
            // A pointer the browser does not know (a scripted one): the moves still arrive on the handle.
        }
        c.held = event.pointerId;
        gripOffset = panel.getBoundingClientRect().width - pointerWidth(event);
        c.heldTransition = panel.style.transition;
        // The width follows the pointer, not a transition's catch-up.
        panel.style.transition = 'none';
        panel.setAttribute(OPTIONS.resizing, '');
    };
    /** @param {PointerEvent} event */
    const onGripMove = (event) => {
        if (c.grip === null || c.held !== event.pointerId) return;
        setWidth(pointerWidth(event) + gripOffset, false);
    };
    /** @param {PointerEvent} event */
    const onGripUp = (event) => {
        if (c.grip === null || c.held !== event.pointerId) return;
        c.held = null;
        if (c.grip.hasPointerCapture(event.pointerId)) c.grip.releasePointerCapture(event.pointerId);
        panel.style.transition = c.heldTransition;
        panel.removeAttribute(OPTIONS.resizing);
        memory?.write('width', clampWidth(panel.getBoundingClientRect().width));
    };
    /** @param {KeyboardEvent} event */
    const onGripKey = (event) => {
        const grow = startsAtLeft() ? 'ArrowRight' : 'ArrowLeft';
        const shrink = startsAtLeft() ? 'ArrowLeft' : 'ArrowRight';
        const now = panel.getBoundingClientRect().width;
        const step = RESIZE_STEP * (event.shiftKey ? 5 : 1);
        let next = null;
        if (event.key === grow) next = now + step;
        else if (event.key === shrink) next = now - step;
        else if (event.key === 'Home') next = minWidth();
        else if (event.key === 'End') next = maxWidth();
        if (next === null) return;
        event.preventDefault();
        still(() => setWidth(next));
    };
    /** A double press gives the width back to the stylesheet's own. */
    const onGripReset = () => {
        panel.style.removeProperty('--kp-sidenav-width');
        c.wroteWidth = false;
        memory?.forget('width');
        still(() => offsetContent(isOpen()));
        sayWidth();
    };
    if (c.grip !== null) {
        c.grip.addEventListener('pointerdown', onGripDown);
        c.grip.addEventListener('pointermove', onGripMove);
        c.grip.addEventListener('pointerup', onGripUp);
        c.grip.addEventListener('pointercancel', onGripUp);
        c.grip.addEventListener('keydown', onGripKey);
        c.grip.addEventListener('dblclick', onGripReset);
    }
}
