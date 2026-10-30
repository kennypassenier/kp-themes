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
 * Give one dialog its leaving motion: its own `close()`, Escape and the
 * backdrop all play it. `dialog.open` stays true while it plays, and the
 * `close` event comes at its end, as it does for any closed dialog.
 * @param {HTMLDialogElement} dialog
 * @returns {() => void}
 */
export declare function attachClose(dialog: HTMLDialogElement): () => void;
/**
 * A theme switch changes many sizes at once (a field's gap, a face's
 * metrics); none of that is content arriving, so nothing glides for it. The
 * box takes its new size, as the rest of the page does. Set for two frames
 * after the root's theme changes, and while the new register's faces load.
 */
export declare let switching: number;
/** The attribute playEntranceBackwards() sets while it turns an entrance around. */
export declare const REVERSING_ATTRIBUTE = "data-kp-reversing";
/**
 * Play the CSS entrance `el` wears now backwards, then settle: a tooltip
 * that slid in slides out, a tour card that faded in fades out, each in its
 * entrance's own time on its curve turned around, so frame t of the going
 * is frame (T - t) of the coming (Kenny, 2026-10-05: "find out where else
 * there is a discrepancy between opening/closing"). The entrance is
 * restarted reversed on the element and its pseudo-elements
 * (`[data-kp-reversing]`, css/components.css), whatever its fill, so one
 * that already played out is turned around too. With no entrance (reduced
 * motion, a theme without one) it settles at once. The caller hides the
 * element when it settles true and then calls stopReversing(), which also
 * stops it early when the element is wanted back meanwhile.
 * @param {HTMLElement} el
 * @returns {Promise<boolean>} true once played out, false when there was nothing to play or it was stopped
 */
export declare function playEntranceBackwards(el: HTMLElement): Promise<boolean>;
/**
 * Stop a playEntranceBackwards() on `el` (it is wanted back), or tidy up
 * after one that played out: a running one settles false, and the entrance
 * is the element's own again.
 * @param {HTMLElement} el
 */
export declare function stopReversing(el: HTMLElement): void;
/** The attribute a panel carries while playClose() plays its close. */
export declare const CLOSING_ATTRIBUTE = "data-kp-closing";
/** The panels that hang from a trigger and close as their opening reversed. */
export declare const PANEL_SELECTOR = ".kp-popover:not(.kp-tooltip), .kp-menu, .kp-combobox__list, .kp-datepicker__panel";
/**
 * Play the close of a panel that is about to be hidden (a menu, a popover):
 * its opening played backwards, frame for frame, in the opening's own time
 * (Kenny, 2026-10-06: every close is its open played backwards; menus and
 * popovers hid at once until now, research/PACKAGE_FINDINGS.md). The panel
 * carries `[data-kp-closing]` meanwhile, so a register can draw a close of
 * its own there instead (blueprint: the same trace under a second name, so
 * the browser restarts it) or run its transitions to the closed state
 * (synthwave). The caller hides the panel once this settles true, then calls
 * stopClose(); a stopClose() before that (the panel wanted back) settles it
 * false and leaves the opening where it stands.
 * @param {HTMLElement} el
 * @returns {Promise<boolean>} true once the close played out (or there was nothing to play)
 */
export declare function playClose(el: HTMLElement): Promise<boolean>;
/**
 * Tidy up after playClose() (call it once the panel is hidden), or stop one
 * still playing because the panel is wanted back: it turns round from the
 * frame on screen.
 * @param {HTMLElement} el
 */
export declare function stopClose(el: HTMLElement): void;
