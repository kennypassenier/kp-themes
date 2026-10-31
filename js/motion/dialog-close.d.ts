import { Controller } from '../controller.js';
/**
 * One dialog's leaving motion. `dialog.open` stays true while it plays, and
 * the `close` event comes at its end, as it does for any closed dialog. The
 * dialog's own `show`, `showModal` and `close` are shadowed on the element
 * while the controller lives, and handed back by `destroy()`.
 */
export declare class DialogClose extends Controller {
    connect(): void;
    /** Shadow the dialog's show, showModal and close with ones that play the motion. @param {HTMLDialogElement} dialog */
    shadow(dialog: HTMLDialogElement): void;
    /** The dialog just opened: keep its entrance for the close, and play the opening as that close turned around. @param {HTMLDialogElement} dialog */
    opened(dialog: HTMLDialogElement): void;
    /** Motion watches one dialog fewer, and the dialog's own methods are its own again. */
    release(): void;
}
/**
 * Give one dialog its leaving motion.
 * @param {HTMLDialogElement} dialog
 * @returns {() => void} detach; a dialog already wired gets one that does nothing
 */
export declare function attachClose(dialog: HTMLDialogElement): () => void;
