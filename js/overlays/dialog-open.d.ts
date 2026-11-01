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
 * Open a dialog the way it asks to be opened [uxdialogs1101]. A `dialog.kp-drawer` with `data-kp-drawer-mode="beside"`
 * opens with show(), marks the row of `trigger` (`data-kp-drawer-current`) and closes on Escape; pressed from another row
 * while open, it moves there (after the close guard's question, if its form changed) and announces itself again with
 * `moved: true`, so the page fills it with that row. Under 40rem it opens modal. Any other dialog opens with showModal(),
 * or show() when `modal` is false. Either way it opens at the top and fires `kp-dialog-open` `{ trigger, modal, beside, moved }`.
 * @param {HTMLDialogElement} dialog @param {{ trigger?: HTMLElement | null, modal?: boolean }} [options]
 */
export declare function openDialog(dialog: HTMLDialogElement, { trigger, modal }?: {
    trigger?: HTMLElement | null;
    modal?: boolean;
}): void;
