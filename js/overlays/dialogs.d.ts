/**
 * Put a dialog that has just opened, and its `.kp-dialog__body`, back at
 * the top [scope-96]. A closed dialog keeps its scroll position, so a
 * long dialog scrolled and closed reopened where it was left (Kenny,
 * 2026-09-15: "Bovenaan openen"). Called after showModal()/show(), because
 * a closed dialog has no box to scroll. The one exception is focus: when
 * the element the dialog focused on opening lies below the fold, it is
 * scrolled back into view, as far as needed and no further, so focus is
 * never hidden.
 *
 * @param {HTMLDialogElement} dialog
 */
export declare function openAtTop(dialog: HTMLDialogElement): void;
/**
 * Wire `[data-kp-dialog="<id>"]` buttons to the dialog with that id.
 *
 * showModal() by default: the modal form is the one that traps focus and
 * makes the rest of the page inert. `data-kp-dialog-mode="non-modal"` on
 * the trigger opens with show() instead, for a palette-like panel that
 * must not inert the page.
 *
 * @param {ParentNode} root
 * @param {{ modal?: boolean }} [options] the default mode when a trigger says nothing
 * @returns {() => void} detach
 */
export declare function attachDialogs(root?: ParentNode, { modal }?: {
    modal?: boolean;
}): () => void;
/** The close label a consumer's markup can use: `data-kp-dialog-close` with the dictionary's word. */
export declare const closeLabel: () => string;
