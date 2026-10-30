/**
 * Make a row busy while its action runs, or done with it. The row carries
 * `aria-busy`; every button in it says no to a press (`aria-disabled`, so the
 * focus stays where it is); `button`, the one pressed, shows the theme's
 * spinner in place of its words, which keep their room, so no column moves.
 * @param {HTMLElement} row a list item of a `.kp-action-list`
 * @param {boolean} [busy] true when absent
 * @param {HTMLElement | null} [button] the button that started it
 * @returns {HTMLElement} the row
 */
export declare function setRowBusy(row: HTMLElement, busy?: boolean, button?: HTMLElement | null): HTMLElement;
