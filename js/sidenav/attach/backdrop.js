// The backdrop and the focus trap of an open panel.
import { playEntranceBackwards, stopReversing } from '../../motion.js';
import { OPTIONS } from '../options.js';
import { FOCUSABLE } from '../helpers.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the the backdrop and the focus trap of an open panel part adds to the table's context.
 *
 * @typedef {{
 *     dropBackdrop: () => void;
 *     onTrap: (event: KeyboardEvent) => void;
 *     raiseBackdrop: () => void;
 * }} BackdropFields
 */

/**
 * The backdrop and the focus trap of an open panel.
 *
 * @param {SidenavContext} c
 */
export function installBackdrop(c) {
    const { covering, doc, isOpen, on, panel, read } = c;

    const dropBackdrop = () => {
        if (!c.backdrop) return;
        const target = c.backdrop;
        c.backdrop = null;
        void playEntranceBackwards(target).then(() => {
            target.remove();
            stopReversing(target);
        });
    };
    c.dropBackdrop = dropBackdrop;
    const raiseBackdrop = () => {
        if (c.backdrop || !covering() || !on(OPTIONS.backdrop, true)) return;
        c.backdrop = doc.createElement('div');
        c.backdrop.className = `kp-sidenav__backdrop ${read(OPTIONS.backdropClass) ?? ''}`.trim();
        // The backdrop belongs to the same box the panel does. A panel
        // scoped to a container with an absolute position had a fixed
        // backdrop over the whole window, which dimmed a page that was
        // never asked about.
        if (read(OPTIONS.position) === 'absolute') c.backdrop.style.position = 'absolute';
        c.backdrop.addEventListener('click', onBackdropClick);
        panel.after(c.backdrop);
    };
    c.raiseBackdrop = raiseBackdrop;
    /**
     * A click on the backdrop. `static` shows the backdrop and refuses the
     * click with the theme's cue; `close-on-backdrop="false"` ignores it
     * like `close-on-esc="false"` ignores Escape; otherwise it closes.
     */
    const onBackdropClick = () => {
        if (read(OPTIONS.backdrop) === 'static') return c.refuse();
        if (!on(OPTIONS.closeOnBackdrop, true)) return;
        c.set(false, true, true, 'backdrop');
    };
    /** @param {KeyboardEvent} event */
    const onTrap = (event) => {
        if (event.key !== 'Tab' || !covering() || !isOpen() || !on(OPTIONS.focusTrap, true)) return;
        const stops = [.../** @type {NodeListOf<HTMLElement>} */ (panel.querySelectorAll(FOCUSABLE))].filter((el) => el.offsetParent !== null);
        if (stops.length === 0) return;
        const first = stops[0];
        const last = stops[stops.length - 1];
        const active = doc.activeElement;
        if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        } else if (event.shiftKey && active === first) {
            event.preventDefault();
            last.focus();
        }
    };
    c.onTrap = onTrap;
}
