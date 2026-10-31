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
