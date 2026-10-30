// Closing a dialog on an outside press and finding the control that opened it.
import { OPENER } from './constants.js';

/**
 * Close a modal dialog on a press outside its box [scope-80].
 *
 * A modal `<dialog>` paints its backdrop as part of itself, so a press on
 * the dimmed page lands on the dialog element with coordinates outside its
 * border box. Both the press and the release have to fall outside: a drag
 * that selects the query and lets go past the box is not a click outside.
 * `dialog.close()` is what Escape does too, so focus goes back to the
 * opener the same way, and the `close` event runs every channel's own
 * bookkeeping. Returns the function that takes the listeners off.
 *
 * @param {HTMLDialogElement} dialog
 * @returns {() => void}
 */
export function closeOnOutsidePress(dialog) {
    /** @param {MouseEvent} event */
    const outside = (event) => {
        if (event.target !== dialog) return false;
        const box = dialog.getBoundingClientRect();
        return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    };
    let pressedOutside = false;
    /** @param {PointerEvent} event */
    const onDown = (event) => {
        pressedOutside = dialog.open && outside(event);
    };
    /** @param {MouseEvent} event */
    const onClick = (event) => {
        const both = pressedOutside && outside(event);
        pressedOutside = false;
        if (both && dialog.open) dialog.close();
    };
    dialog.addEventListener('pointerdown', onDown);
    dialog.addEventListener('click', onClick);
    return () => {
        dialog.removeEventListener('pointerdown', onDown);
        dialog.removeEventListener('click', onClick);
    };
}

/**
 * Whether a click landed on an opener meant for this dialog.
 *
 * @param {Event} event
 * @param {HTMLDialogElement} dialog
 * @param {boolean} answersKey  whether this dialog is the one an empty value means
 */
export function openerFor(event, dialog, answersKey) {
    const opener = event.target instanceof Element ? event.target.closest(OPENER) : null;
    if (opener === null) return false;
    const name = opener.getAttribute('data-kp-palette-open') ?? '';
    return name === '' ? answersKey : name === dialog.id;
}
