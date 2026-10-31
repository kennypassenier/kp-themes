/**
 * Close a dialog the way it opened, backwards, then close it for real. With
 * no entrance to reverse (reduced motion, a theme without one) it closes at
 * once.
 *
 * @param {HTMLDialogElement} dialog
 * @param {string} [returnValue]
 * @returns {Promise<void>} settled once the dialog is closed
 */
export declare function closeDialog(dialog: HTMLDialogElement, returnValue?: string): Promise<void>;
/**
 * Whether the theme `el` wears opens what closes as that close played
 * backwards: its register says `--kp-open: reverse-close` (every register
 * since 2026-10-05; Kenny's pick on research/open-reverse).
 * @param {Element} el
 */
export declare const opensAsReversedClose: (el: Element) => boolean;
/**
 * Open `dialog` as its close played backwards [research/open-reverse]:
 * closeDialog() plays each kept entrance with `direction: 'reverse'` in
 * themeMotion().close; this replaces the register's entrance with the same
 * keyframes on the same curve, forwards, in that same time, and the
 * backdrop's fade turned around, so frame t of the opening is frame
 * (close - t) of the close. Only in a theme that asks for it.
 * @param {HTMLDialogElement} dialog
 */
export declare function openAsReversedClose(dialog: HTMLDialogElement): void;
