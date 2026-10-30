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
export declare function closeOnOutsidePress(dialog: HTMLDialogElement): () => void;
/**
 * Whether a click landed on an opener meant for this dialog.
 *
 * @param {Event} event
 * @param {HTMLDialogElement} dialog
 * @param {boolean} answersKey  whether this dialog is the one an empty value means
 */
export declare function openerFor(event: Event, dialog: HTMLDialogElement, answersKey: boolean): boolean;
